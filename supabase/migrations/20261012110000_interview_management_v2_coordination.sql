-- Phase 2. Additive migration: only interview_mgmt_ objects are changed.
begin;
alter table public.interview_mgmt_change_requests add column review_note text;
alter table public.interview_mgmt_change_requests add column reviewed_by uuid references public.interview_mgmt_users(id);
alter table public.interview_mgmt_change_requests add column reviewed_at timestamptz;
alter table public.interview_mgmt_change_requests drop constraint interview_mgmt_change_requests_status_check;
alter table public.interview_mgmt_change_requests add constraint interview_mgmt_change_requests_status_check check(status in ('PENDING','ACCEPTED','REJECTED','RESOLVED'));
create table public.interview_mgmt_availability_requests (
  id uuid primary key default gen_random_uuid(), interview_id uuid not null references public.interview_mgmt_interviews(id),
  user_id uuid not null references public.interview_mgmt_users(id), requested_by uuid not null references public.interview_mgmt_users(id),
  created_at timestamptz not null default now(), resolved_at timestamptz,
  foreign key(interview_id,user_id) references public.interview_mgmt_participants(interview_id,user_id) on delete cascade
);
create unique index interview_mgmt_pending_availability_request on public.interview_mgmt_availability_requests(interview_id,user_id) where resolved_at is null;
alter table public.interview_mgmt_availability_requests enable row level security;
revoke all on public.interview_mgmt_availability_requests from anon,authenticated;

-- Version invalidation never releases a confirmed reservation.
create function public.interview_mgmt_invalidate(p_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
  update public.interview_mgmt_interviews set version=version+1,updated_at=now(),
    status=case when exists(select 1 from public.interview_mgmt_bookings where interview_id=p_id and active) then 'CHANGE_REQUESTED' else 'COORDINATING' end where id=p_id;
  update public.interview_mgmt_proposals set active=false where interview_id=p_id;
  update public.interview_mgmt_email_drafts set status='INVALIDATED' where interview_id=p_id and status in ('PENDING','APPROVED','FAILED');
end;
$$;
revoke all on function public.interview_mgmt_invalidate(uuid) from public,anon,authenticated;

create function public.interview_mgmt_common_slots(p_id uuid) returns table(starts_at timestamptz,ends_at timestamptz)
language plpgsql stable security definer set search_path='' as $$
declare i public.interview_mgmt_interviews; p record; v_all tstzmultirange; v_ranges tstzmultirange; v_busy tstzmultirange;
begin
  if public.interview_mgmt_role() not in ('RECRUITER','HRBP','INTERVIEWER') or not public.interview_mgmt_can_view(p_id) then raise exception 'Forbidden' using errcode='42501'; end if;
  select * into i from public.interview_mgmt_interviews where id=p_id;
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

create function public.interview_mgmt_schedule(p_id uuid) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare i public.interview_mgmt_interviews; v_candidate boolean; v_result jsonb;
begin
  if public.interview_mgmt_role() is null or not public.interview_mgmt_can_view(p_id) then raise exception 'Forbidden' using errcode='42501'; end if;
  select * into i from public.interview_mgmt_interviews where id=p_id;
  v_candidate:=public.interview_mgmt_role()='CANDIDATE';
  v_result:=jsonb_build_object('interview_id',p_id,'version',i.version,
    'proposals',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'starts_at',p.starts_at,'ends_at',p.ends_at) order by p.starts_at) from public.interview_mgmt_proposals p where p.interview_id=p_id and p.active and p.version=i.version and p.starts_at>now()),'[]'::jsonb),
    'booking',(select jsonb_build_object('id',b.id,'starts_at',b.starts_at,'ends_at',b.ends_at) from public.interview_mgmt_bookings b where b.interview_id=p_id and b.active),
    'requests',coalesce((select jsonb_agg(case when v_candidate then jsonb_build_object('id',c.id,'kind',c.kind,'status',c.status,'proposed_start',c.proposed_start,'proposed_end',c.proposed_end,'reason',c.reason,'created_at',c.created_at) else to_jsonb(c) end order by c.created_at desc) from public.interview_mgmt_change_requests c where c.interview_id=p_id and (not v_candidate or c.requested_by=auth.uid())),'[]'::jsonb));
  if not v_candidate then
    v_result:=v_result||jsonb_build_object(
      'availability',coalesce((select jsonb_agg(to_jsonb(a) order by a.starts_at) from public.interview_mgmt_availability a where a.interview_id=p_id),'[]'::jsonb),
      'participants',coalesce((select jsonb_agg(jsonb_build_object('id',u.id,'name',u.name) order by u.name) from public.interview_mgmt_participants p join public.interview_mgmt_users u on u.id=p.user_id where p.interview_id=p_id),'[]'::jsonb),
      'availability_requests',coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.interview_mgmt_availability_requests r where r.interview_id=p_id),'[]'::jsonb),
      'common_slots',coalesce((select jsonb_agg(to_jsonb(s)) from public.interview_mgmt_common_slots(p_id) s),'[]'::jsonb));
  end if;
  return v_result;
end;
$$;

create function public.interview_mgmt_coordinate(p_id uuid,p_action text,p_data jsonb) returns jsonb
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
  if p_action in ('availability','availability_delete') then
    if i.status='CONFIRMED' then raise exception 'Request a change before editing availability'; end if;
    v_user:=(p_data->>'user_id')::uuid;
    if not ((v_role='INTERVIEWER' and v_user=auth.uid()) or v_role='HRBP') or not exists(select 1 from public.interview_mgmt_participants where interview_id=p_id and user_id=v_user) then raise exception 'Forbidden' using errcode='42501'; end if;
    if p_action='availability' then
      v_start:=(p_data->>'starts_at')::timestamptz;v_end:=(p_data->>'ends_at')::timestamptz;
      if v_start is null or v_end is null or v_start<greatest(i.window_start,now()) or v_end>i.window_end or v_start>=v_end then raise exception 'Invalid availability'; end if;
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
        if v_request.proposed_start is not null then update public.interview_mgmt_interviews set window_start=v_request.proposed_start,window_end=v_request.proposed_end where id=p_id; end if;
        perform public.interview_mgmt_invalidate(p_id);
      elsif not exists(select 1 from public.interview_mgmt_change_requests where interview_id=p_id and status='PENDING') and exists(select 1 from public.interview_mgmt_bookings where interview_id=p_id and active) and not exists(select 1 from public.interview_mgmt_proposals where interview_id=p_id and active) then
        update public.interview_mgmt_interviews set status='CONFIRMED',updated_at=now() where id=p_id;
      end if;
    end if;
    v_id:=v_request.id;
  elsif p_action='reopen' then
    if v_role<>'RECRUITER' then raise exception 'Forbidden' using errcode='42501'; end if;
    v_start:=(p_data->>'starts_at')::timestamptz;v_end:=(p_data->>'ends_at')::timestamptz;
    if v_start is null or v_end is null or v_start<=now() or v_end<v_start+i.duration_minutes*interval '1 minute' then raise exception 'Invalid coordination window'; end if;
    update public.interview_mgmt_interviews set window_start=v_start,window_end=v_end where id=p_id;
    perform public.interview_mgmt_invalidate(p_id);
  else raise exception 'Unknown coordination action'; end if;
  insert into public.interview_mgmt_audit_logs(interview_id,actor_id,target_user_id,action) values(p_id,auth.uid(),v_user,'일정: '||p_action);
  return jsonb_build_object('id',v_id);
end;
$$;

create function public.interview_mgmt_select_proposal(p_id uuid,p_proposal uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare i public.interview_mgmt_interviews; p public.interview_mgmt_proposals; v_booking uuid; v_old uuid; v_count integer;
begin
  select * into i from public.interview_mgmt_interviews where id=p_id for update;
  if public.interview_mgmt_role() is distinct from 'CANDIDATE' or i.candidate_id is distinct from auth.uid() then raise exception 'Forbidden' using errcode='42501'; end if;
  -- Retry of an already successful choice returns the same booking.
  select id into v_booking from public.interview_mgmt_bookings where interview_id=p_id and proposal_id=p_proposal and active;
  if found then return jsonb_build_object('id',v_booking,'confirmed',true); end if;
  if i.status not in ('PROPOSED','CHANGE_REQUESTED') then raise exception 'Proposal no longer valid' using errcode='40001'; end if;
  select * into p from public.interview_mgmt_proposals where id=p_proposal and interview_id=p_id and active and version=i.version;
  if not found or p.starts_at<=now() then raise exception 'Proposal expired' using errcode='40001'; end if;
  -- Shared resource locks serialize choices across different interviews.
  perform u.id from public.interview_mgmt_users u where u.id=i.candidate_id or u.id in(select user_id from public.interview_mgmt_participants where interview_id=p_id) order by u.id for update;
  if public.interview_mgmt_role() is distinct from 'CANDIDATE' then raise exception 'Forbidden' using errcode='42501'; end if;
  select count(*) into v_count from public.interview_mgmt_participants where interview_id=p_id;
  if v_count=0 or exists(select 1 from public.interview_mgmt_participants pp where pp.interview_id=p_id and not coalesce((select range_agg(tstzrange(a.starts_at,a.ends_at,'[)')) @> tstzrange(p.starts_at,p.ends_at,'[)') from public.interview_mgmt_availability a where a.interview_id=p_id and a.user_id=pp.user_id),false)) then raise exception 'Availability changed' using errcode='40001'; end if;
  if exists(select 1 from public.interview_mgmt_booking_resources r join public.interview_mgmt_bookings b on b.id=r.booking_id where r.active and b.active and b.interview_id<>p_id and (r.user_id=i.candidate_id or r.user_id in(select user_id from public.interview_mgmt_participants where interview_id=p_id)) and tstzrange(r.starts_at,r.ends_at,'[)') && tstzrange(p.starts_at,p.ends_at,'[)')) then raise exception 'Booking conflict' using errcode='23P01'; end if;
  select id into v_old from public.interview_mgmt_bookings where interview_id=p_id and active;
  insert into public.interview_mgmt_bookings(interview_id,proposal_id,starts_at,ends_at,active) values(p_id,p_proposal,p.starts_at,p.ends_at,false) returning id into v_booking;
  insert into public.interview_mgmt_booking_resources(booking_id,user_id,starts_at,ends_at,active)
    select v_booking,u.id,p.starts_at,p.ends_at,false from public.interview_mgmt_users u where u.id=i.candidate_id or u.id in(select user_id from public.interview_mgmt_participants where interview_id=p_id);
  -- The entire transition is atomic. Any conflict rolls back the new booking
  -- and restores the old active booking/locks; there is no visible free gap.
  update public.interview_mgmt_booking_resources set active=false where booking_id=v_old;
  update public.interview_mgmt_booking_resources set active=true where booking_id=v_booking;
  update public.interview_mgmt_bookings set active=false where id=v_old;
  update public.interview_mgmt_bookings set active=true where id=v_booking;
  update public.interview_mgmt_interviews set status='CONFIRMED',updated_at=now() where id=p_id;
  update public.interview_mgmt_proposals set active=false where interview_id=p_id;
  update public.interview_mgmt_change_requests set status='RESOLVED' where interview_id=p_id and status='PENDING';
  insert into public.interview_mgmt_audit_logs(interview_id,actor_id,action) values(p_id,auth.uid(),'지원자 일정 확정');
  return jsonb_build_object('id',v_booking,'confirmed',true);
end;
$$;

-- Phase 1 edits can reset availability safely before replacing participants.
create function public.interview_mgmt_calendar() returns setof jsonb language plpgsql stable security definer set search_path='' as $$
begin
  if public.interview_mgmt_role() is null then raise exception 'Forbidden' using errcode='42501'; end if;
  return query select jsonb_build_object('interview_id',i.id,'position',i.position,'type',i.type,'starts_at',b.starts_at,'ends_at',b.ends_at,'mode',i.mode)
    from public.interview_mgmt_bookings b join public.interview_mgmt_interviews i on i.id=b.interview_id
    where b.active and public.interview_mgmt_can_view(i.id) order by b.starts_at;
end;
$$;

-- Preserve the original validated create/update transaction via a private name.
alter function public.interview_mgmt_save_interview(uuid,jsonb) rename to interview_mgmt_save_interview_phase1;
revoke all on function public.interview_mgmt_save_interview_phase1(uuid,jsonb) from public,anon,authenticated;
create function public.interview_mgmt_save_interview(p_id uuid,p_data jsonb) returns uuid language plpgsql security definer set search_path='' as $$
begin
  if public.interview_mgmt_role() is distinct from 'RECRUITER' then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_id is not null then
    perform id from public.interview_mgmt_interviews where id=p_id for update;
    delete from public.interview_mgmt_availability where interview_id=p_id;
  end if;
  return public.interview_mgmt_save_interview_phase1(p_id,p_data);
end;
$$;
revoke all on function public.interview_mgmt_common_slots(uuid),public.interview_mgmt_schedule(uuid),public.interview_mgmt_coordinate(uuid,text,jsonb),public.interview_mgmt_select_proposal(uuid,uuid),public.interview_mgmt_save_interview(uuid,jsonb),public.interview_mgmt_calendar() from public,anon;
grant execute on function public.interview_mgmt_common_slots(uuid),public.interview_mgmt_schedule(uuid),public.interview_mgmt_coordinate(uuid,text,jsonb),public.interview_mgmt_select_proposal(uuid,uuid),public.interview_mgmt_save_interview(uuid,jsonb),public.interview_mgmt_calendar() to authenticated;
commit;
