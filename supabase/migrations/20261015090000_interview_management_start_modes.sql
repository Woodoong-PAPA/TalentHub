-- Optional coordination end; explicit immediate/scheduled activation. Existing rows retain their prior window.
begin;
alter table public.interview_mgmt_interviews alter column window_end drop not null;
alter table public.interview_mgmt_interviews add column coordination_start_mode text not null default 'IMMEDIATE' check(coordination_start_mode in ('IMMEDIATE','SCHEDULED'));
create or replace function public.interview_mgmt_save_interview(p_id uuid,p_data jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare v_start timestamptz;v_id uuid;v_data jsonb:=p_data;
begin
  if public.interview_mgmt_role() is distinct from 'RECRUITER' then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_id is not null then
    perform id from public.interview_mgmt_interviews where id=p_id for update;
    delete from public.interview_mgmt_availability where interview_id=p_id;
  end if;
  if p_data ? 'coordination_start_mode' then
    if p_data->>'coordination_start_mode' not in ('IMMEDIATE','SCHEDULED') or p_data->>'coordination_start_mode' is null then raise exception 'Invalid start mode'; end if;
    v_start:=case when p_data->>'coordination_start_mode'='IMMEDIATE' then now() else (p_data->>'window_start')::timestamptz end;
    if v_start is null or not isfinite(v_start) or (p_data->>'coordination_start_mode'='SCHEDULED' and v_start<=now()) then raise exception 'Invalid scheduled start'; end if;
    v_data:=p_data||jsonb_build_object('window_start',v_start,'window_end',null);
  end if;
  v_id:=public.interview_mgmt_save_interview_phase1(p_id,v_data);
  update public.interview_mgmt_interviews set coordination_start_mode=coalesce(p_data->>'coordination_start_mode','IMMEDIATE') where id=v_id;
  return v_id;
end;
$$;
create or replace function public.interview_mgmt_common_slots(p_id uuid) returns table(starts_at timestamptz,ends_at timestamptz)
language plpgsql stable security definer set search_path='' as $$
declare i public.interview_mgmt_interviews; p record; v_all tstzmultirange; v_ranges tstzmultirange; v_busy tstzmultirange;
begin
  if public.interview_mgmt_role() not in ('RECRUITER','HRBP','INTERVIEWER') or not public.interview_mgmt_can_view(p_id) then raise exception 'Forbidden' using errcode='42501'; end if;
  select * into i from public.interview_mgmt_interviews where id=p_id;
  if i.coordination_start_mode='SCHEDULED' and i.window_start>now() then return; end if;
  if i.status in ('CANCELLED','CONFIRMED') or i.window_end<=now() then return; end if;
  v_all:=tstzmultirange(tstzrange(greatest(i.window_start,now()),i.window_end,'[)'));
  if not exists(select 1 from public.interview_mgmt_participants where interview_id=p_id) then return; end if;
  for p in select user_id from public.interview_mgmt_participants where interview_id=p_id loop
    select range_agg(tstzrange(a.starts_at,a.ends_at,'[)')) into v_ranges from public.interview_mgmt_availability a where a.interview_id=p_id and a.user_id=p.user_id;
    v_all:=v_all*coalesce(v_ranges,'{}'::tstzmultirange);
  end loop;
  select range_agg(tstzrange(r.starts_at,r.ends_at,'[)')) into v_busy from public.interview_mgmt_booking_resources r
    join public.interview_mgmt_bookings b on b.id=r.booking_id where r.active and b.active and b.interview_id<>p_id
    and (r.user_id=i.candidate_id or r.user_id in(select user_id from public.interview_mgmt_participants where interview_id=p_id));
  v_all:=v_all-coalesce(v_busy,'{}'::tstzmultirange);
  return query select s,s+i.duration_minutes*interval '1 minute' from unnest(v_all) r
    cross join lateral generate_series(lower(r),upper(r)-i.duration_minutes*interval '1 minute',interval '15 minutes') s
    order by s limit 200;
end;
$$;
create or replace function public.interview_mgmt_coordinate(p_id uuid,p_action text,p_data jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare i public.interview_mgmt_interviews; v_role text; v_user uuid; v_id uuid; v_start timestamptz; v_end timestamptz;
  v_request public.interview_mgmt_change_requests; v_count integer;
begin
  -- Every mutation of availability, proposals and requests serializes on the interview.
  select * into i from public.interview_mgmt_interviews where id=p_id for update;
  perform id from public.interview_mgmt_users where id=auth.uid() for share;
  v_role:=public.interview_mgmt_role();
  if v_role is null or not public.interview_mgmt_can_view(p_id) then raise exception 'Forbidden' using errcode='42501'; end if;
  if i.status='CANCELLED' then raise exception 'Cancelled interview'; end if;
  if i.coordination_start_mode='SCHEDULED' and i.window_start>now() and p_action<>'reopen' then raise exception 'Coordination has not started'; end if;
  if p_action in ('availability','availability_delete') then
    if i.status='CONFIRMED' then raise exception 'Request a change before editing availability'; end if;
    v_user:=(p_data->>'user_id')::uuid;
    if not ((v_role='INTERVIEWER' and v_user=auth.uid()) or v_role='HRBP') or not exists(select 1 from public.interview_mgmt_participants where interview_id=p_id and user_id=v_user) then raise exception 'Forbidden' using errcode='42501'; end if;
    if p_action='availability' then
      v_start:=(p_data->>'starts_at')::timestamptz;v_end:=(p_data->>'ends_at')::timestamptz;
      if v_start is null or v_end is null or not isfinite(v_start) or not isfinite(v_end) or v_start<greatest(i.window_start,now()) or v_end>i.window_end or v_start>=v_end then raise exception 'Invalid availability'; end if;
      if p_data->>'id' is null then
        insert into public.interview_mgmt_availability(interview_id,user_id,entered_by,starts_at,ends_at) values(p_id,v_user,auth.uid(),v_start,v_end) returning id into v_id;
      else
        update public.interview_mgmt_availability set starts_at=v_start,ends_at=v_end,entered_by=auth.uid() where id=(p_data->>'id')::uuid and interview_id=p_id and user_id=v_user returning id into v_id;
        if not found then raise exception 'Unknown availability'; end if;
      end if;
      update public.interview_mgmt_availability_requests set resolved_at=now() where interview_id=p_id and user_id=v_user and resolved_at is null;
    else
      delete from public.interview_mgmt_availability where id=(p_data->>'id')::uuid and interview_id=p_id and user_id=v_user returning id into v_id;
      if not found then raise exception 'Unknown availability'; end if;
    end if;
    perform public.interview_mgmt_invalidate(p_id);
  elsif p_action='request_availability' then
    if v_role not in ('RECRUITER','HRBP') then raise exception 'Forbidden' using errcode='42501'; end if;
    v_user:=(p_data->>'user_id')::uuid;
    if not exists(select 1 from public.interview_mgmt_participants where interview_id=p_id and user_id=v_user) then raise exception 'Invalid participant'; end if;
    insert into public.interview_mgmt_availability_requests(interview_id,user_id,requested_by) values(p_id,v_user,auth.uid()) on conflict (interview_id,user_id) where resolved_at is null do nothing returning id into v_id;
  elsif p_action='publish' then
    if v_role not in ('RECRUITER','HRBP') then raise exception 'Forbidden' using errcode='42501'; end if;
    if i.status='CONFIRMED' or jsonb_typeof(p_data->'starts') is distinct from 'array' or jsonb_array_length(p_data->'starts') not between 1 and 20 then raise exception 'Invalid proposals'; end if;
    if (p_data->>'version')::integer is distinct from i.version then raise exception 'Stale version' using errcode='40001'; end if;
    select count(distinct t.value::timestamptz) into v_count from jsonb_array_elements_text(p_data->'starts') t where exists(select 1 from public.interview_mgmt_common_slots(p_id) s where s.starts_at=t.value::timestamptz);
    if v_count<>jsonb_array_length(p_data->'starts') then raise exception 'Proposals must be common slots'; end if;
    perform public.interview_mgmt_invalidate(p_id);
    insert into public.interview_mgmt_proposals(interview_id,version,starts_at,ends_at)
      select p_id,i.version+1,value::timestamptz,value::timestamptz+i.duration_minutes*interval '1 minute' from jsonb_array_elements_text(p_data->'starts');
    update public.interview_mgmt_interviews set status=case when exists(select 1 from public.interview_mgmt_bookings where interview_id=p_id and active) then 'CHANGE_REQUESTED' else 'PROPOSED' end where id=p_id;
  elsif p_action='change_request' then
    if v_role not in ('CANDIDATE','INTERVIEWER') then raise exception 'Forbidden' using errcode='42501'; end if;
    if p_data->>'kind' not in ('COUNTER_PROPOSAL','CHANGE') or p_data->>'kind' is null then raise exception 'Invalid request'; end if;
    if p_data->>'kind'='COUNTER_PROPOSAL' and v_role<>'CANDIDATE' then raise exception 'Forbidden' using errcode='42501'; end if;
    if p_data->>'kind'='CHANGE' and not exists(select 1 from public.interview_mgmt_bookings where interview_id=p_id and active) then raise exception 'No confirmed schedule'; end if;
    v_start:=(p_data->>'starts_at')::timestamptz;v_end:=(p_data->>'ends_at')::timestamptz;
    if ((v_start is null) <> (v_end is null)) or (p_data->>'kind'='COUNTER_PROPOSAL' and v_start is null)
      or (v_start is not null and (v_start<=now() or v_end<v_start+i.duration_minutes*interval '1 minute'))
      or length(btrim(coalesce(p_data->>'reason',''))) not between 1 and 1000 then raise exception 'Invalid requested range or reason'; end if;
    if exists(select 1 from public.interview_mgmt_change_requests where interview_id=p_id and requested_by=auth.uid() and status='PENDING') then raise exception 'Pending request already exists'; end if;
    insert into public.interview_mgmt_change_requests(interview_id,requested_by,kind,proposed_start,proposed_end,reason)
      values(p_id,auth.uid(),p_data->>'kind',v_start,v_end,p_data->>'reason') returning id into v_id;
    if exists(select 1 from public.interview_mgmt_bookings where interview_id=p_id and active) then update public.interview_mgmt_interviews set status='CHANGE_REQUESTED',updated_at=now() where id=p_id; end if;
  elsif p_action='review_request' then
    if v_role not in ('RECRUITER','HRBP') then raise exception 'Forbidden' using errcode='42501'; end if;
    select * into v_request from public.interview_mgmt_change_requests where id=(p_data->>'id')::uuid and interview_id=p_id and status='PENDING' for update;
    if not found then raise exception 'Request unavailable'; end if;
    if length(coalesce(p_data->>'note',''))>1000 then raise exception 'Review note too long'; end if;
    if v_role='HRBP' then
      if p_data->>'decision' is distinct from 'REVIEW' then raise exception 'Recruiter decision required' using errcode='42501'; end if;
      update public.interview_mgmt_change_requests set review_note=p_data->>'note',reviewed_by=auth.uid(),reviewed_at=now() where id=v_request.id;
    else
      if p_data->>'decision' is null or p_data->>'decision' not in ('ACCEPT','REJECT') then raise exception 'Invalid decision'; end if;
      update public.interview_mgmt_change_requests set status=case when p_data->>'decision'='ACCEPT' then 'ACCEPTED' else 'REJECTED' end,review_note=p_data->>'note',reviewed_by=auth.uid(),reviewed_at=now() where id=v_request.id;
      if p_data->>'decision'='ACCEPT' then
        if v_request.proposed_start is not null then update public.interview_mgmt_interviews set window_start=least(now(),v_request.proposed_start),window_end=null,coordination_start_mode='IMMEDIATE' where id=p_id; end if;
        perform public.interview_mgmt_invalidate(p_id);
      elsif not exists(select 1 from public.interview_mgmt_change_requests where interview_id=p_id and status='PENDING') and exists(select 1 from public.interview_mgmt_bookings where interview_id=p_id and active) and not exists(select 1 from public.interview_mgmt_proposals where interview_id=p_id and active) then
        update public.interview_mgmt_interviews set status='CONFIRMED',updated_at=now() where id=p_id;
      end if;
    end if;
    v_id:=v_request.id;
  elsif p_action='reopen' then
    if v_role<>'RECRUITER' then raise exception 'Forbidden' using errcode='42501'; end if;
    if p_data ? 'coordination_start_mode' then
      if p_data->>'coordination_start_mode' not in ('IMMEDIATE','SCHEDULED') then raise exception 'Invalid start mode'; end if;
      v_start:=case when p_data->>'coordination_start_mode'='IMMEDIATE' then now() else (p_data->>'window_start')::timestamptz end;
      if v_start is null or not isfinite(v_start) or (p_data->>'coordination_start_mode'='SCHEDULED' and v_start<=now()) then raise exception 'Invalid scheduled start'; end if;
      v_end:=null;
    else
      v_start:=(p_data->>'starts_at')::timestamptz;v_end:=(p_data->>'ends_at')::timestamptz;
      if v_start is null or v_end is null or v_start<=now() or v_end<v_start+i.duration_minutes*interval '1 minute' then raise exception 'Invalid coordination window'; end if;
    end if;
    update public.interview_mgmt_interviews set window_start=v_start,window_end=v_end,coordination_start_mode=coalesce(p_data->>'coordination_start_mode','IMMEDIATE') where id=p_id;
    perform public.interview_mgmt_invalidate(p_id);
  else raise exception 'Unknown coordination action'; end if;
  insert into public.interview_mgmt_audit_logs(interview_id,actor_id,target_user_id,action) values(p_id,auth.uid(),v_user,'일정: '||p_action);
  return jsonb_build_object('id',v_id);
end;
$$;
alter table public.interview_mgmt_email_events add column dispatch_after timestamptz not null default now();
create function public.interview_mgmt_mail_dispatch_time() returns trigger language plpgsql security definer set search_path='' as $$
begin
  select case when d.kind<>'CANCELLATION' and i.coordination_start_mode='SCHEDULED' then greatest(now(),i.window_start) else now() end into new.dispatch_after
    from public.interview_mgmt_email_drafts d join public.interview_mgmt_interviews i on i.id=d.interview_id where d.id=new.draft_id;
  return new;
end;
$$;
revoke all on function public.interview_mgmt_mail_dispatch_time() from public,anon,authenticated;
create trigger interview_mgmt_mail_dispatch_time before insert on public.interview_mgmt_email_events for each row execute function public.interview_mgmt_mail_dispatch_time();
create index interview_mgmt_mail_due on public.interview_mgmt_email_events(status,dispatch_after,created_at);
create or replace function public.interview_mgmt_mail_claim(p_event uuid,p_from text) returns jsonb language plpgsql security definer set search_path='' as $$
declare e public.interview_mgmt_email_events;d public.interview_mgmt_email_drafts;i public.interview_mgmt_interviews;v_token uuid;v_payload jsonb;
begin
  select ii.* into i from public.interview_mgmt_interviews ii join public.interview_mgmt_email_drafts dd on dd.interview_id=ii.id join public.interview_mgmt_email_events ee on ee.draft_id=dd.id where ee.id=p_event for update of ii;
  select * into d from public.interview_mgmt_email_drafts where id=(select draft_id from public.interview_mgmt_email_events where id=p_event) for update;
  select * into e from public.interview_mgmt_email_events where id=p_event for update;
  if not found or e.status in('SENT','CANCELLED','UNCERTAIN') or (e.status='SENDING' and e.lease_until>now()) or e.next_attempt_at>now() then return null;end if;
  if d.kind<>'CANCELLATION' and i.coordination_start_mode='SCHEDULED' and i.window_start>now() then return null;end if;
  if e.first_attempt_at is not null and e.first_attempt_at<now()-interval '23 hours' then update public.interview_mgmt_email_events set status='UNCERTAIN',last_error='Retry safety window exceeded' where id=e.id;return null;end if;
  if not public.interview_mgmt_mail_valid(d.id) or d.status<>'APPROVED' or d.content_version<>e.content_version or not exists(select 1 from public.interview_mgmt_email_approvals a join public.interview_mgmt_users u on u.id=a.approved_by where a.draft_id=d.id and a.version=d.version and a.content_version=d.content_version and u.active and u.role='RECRUITER' and u.id in(i.recruiter_id,i.alternate_recruiter_id)) then update public.interview_mgmt_email_events set status='CANCELLED' where id=e.id;return null;end if;
  if e.attempts>=5 then update public.interview_mgmt_email_events set status='UNCERTAIN',last_error='Maximum retries exceeded' where id=e.id;return null;end if;
  v_payload:=coalesce(e.payload,jsonb_build_object('from',p_from,'to',jsonb_build_array((select email from public.interview_mgmt_users where id=d.recipient_id)),
    'reply_to',(select email from public.interview_mgmt_users where id=i.recruiter_id),'subject',d.subject,'text',d.body));
  v_token:=gen_random_uuid();
  update public.interview_mgmt_email_events set status='SENDING',payload=v_payload,lease_token=v_token,lease_until=now()+interval '5 minutes',attempts=attempts+1,first_attempt_at=coalesce(first_attempt_at,now()) where id=e.id;
  return jsonb_build_object('id',e.id,'token',v_token,'key',e.idempotency_key,'payload',v_payload);
end;
$$;
create or replace function public.interview_mgmt_mail_ready(p_event uuid,p_token uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.interview_mgmt_email_events e join public.interview_mgmt_email_drafts d on d.id=e.draft_id join public.interview_mgmt_interviews i on i.id=d.interview_id where e.id=p_event and e.lease_token=p_token and e.status='SENDING' and e.lease_until>now() and d.status='APPROVED' and e.content_version=d.content_version and public.interview_mgmt_mail_valid(d.id)
    and (d.kind='CANCELLATION' or i.coordination_start_mode<>'SCHEDULED' or i.window_start<=now())
    and exists(select 1 from public.interview_mgmt_email_approvals a join public.interview_mgmt_users u on u.id=a.approved_by where a.draft_id=d.id and a.version=d.version and a.content_version=d.content_version and u.active and u.role='RECRUITER' and u.id in(i.recruiter_id,i.alternate_recruiter_id)));
$$;
create or replace function public.interview_mgmt_list_interviews() returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if public.interview_mgmt_role() is null then raise exception 'Forbidden' using errcode='42501'; end if;
  return query select case when public.interview_mgmt_role()='CANDIDATE' then
    jsonb_build_object('id',i.id,'position',i.position,'type',i.type,'duration_minutes',i.duration_minutes,'mode',i.mode,'status',i.status,'coordination_start_mode',i.coordination_start_mode,'window_start',i.window_start,'window_end',i.window_end,'created_at',i.created_at)
  else to_jsonb(i) || jsonb_build_object(
    'candidate_name',c.name,'department_name',d.name,
    'interviewer_ids',coalesce((select jsonb_agg(p.user_id order by p.user_id) from public.interview_mgmt_participants p where p.interview_id=i.id),'[]'::jsonb),
    'interviewer_names',coalesce((select jsonb_agg(u.name order by u.id) from public.interview_mgmt_participants p join public.interview_mgmt_users u on u.id=p.user_id where p.interview_id=i.id),'[]'::jsonb)) end
  from public.interview_mgmt_interviews i join public.interview_mgmt_users c on c.id=i.candidate_id join public.interview_mgmt_departments d on d.id=i.department_id
  where public.interview_mgmt_can_view(i.id) order by i.created_at desc;
end;
$$;
notify pgrst,'reload schema';
commit;
