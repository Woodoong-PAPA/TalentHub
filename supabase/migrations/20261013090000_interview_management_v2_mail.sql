begin;
alter table public.interview_mgmt_email_drafts add column content_version integer not null default 1;
alter table public.interview_mgmt_email_drafts add column base_body text;
alter table public.interview_mgmt_email_drafts add column note text not null default '';
alter table public.interview_mgmt_email_drafts add column parent_id uuid references public.interview_mgmt_email_drafts(id);
update public.interview_mgmt_email_drafts set base_body=body;
create unique index interview_mgmt_mail_identity on public.interview_mgmt_email_drafts(interview_id,version,kind,recipient_id,reminder_number);
alter table public.interview_mgmt_email_events drop constraint interview_mgmt_email_events_status_check;
alter table public.interview_mgmt_email_events add constraint interview_mgmt_email_events_status_check check(status in ('QUEUED','SENDING','SENT','FAILED','CANCELLED','UNCERTAIN'));
alter table public.interview_mgmt_email_events add column content_version integer not null default 1;
alter table public.interview_mgmt_email_events add column payload jsonb;
alter table public.interview_mgmt_email_events add column lease_token uuid;
alter table public.interview_mgmt_email_events add column lease_until timestamptz;
alter table public.interview_mgmt_email_events add column first_attempt_at timestamptz;
alter table public.interview_mgmt_email_events add column next_attempt_at timestamptz;
alter table public.interview_mgmt_email_approvals add column content_version integer not null default 1;
alter table public.interview_mgmt_email_approvals drop constraint interview_mgmt_email_approvals_draft_id_version_key;
alter table public.interview_mgmt_email_approvals add unique(draft_id,version,content_version);

create function public.interview_mgmt_mail_owner(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
  select public.interview_mgmt_role()='RECRUITER' and exists(select 1 from public.interview_mgmt_interviews where id=p_id and auth.uid() in(recruiter_id,alternate_recruiter_id));
$$;
create function public.interview_mgmt_mail_valid(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.interview_mgmt_email_drafts d join public.interview_mgmt_interviews i on i.id=d.interview_id join public.interview_mgmt_users u on u.id=d.recipient_id
    where d.id=p_id and u.active and i.version=d.version and d.status<>'INVALIDATED' and
    case d.kind when 'PROPOSAL' then i.status in('PROPOSED','CHANGE_REQUESTED') and exists(select 1 from public.interview_mgmt_proposals where interview_id=i.id and version=i.version and active and starts_at>now())
    when 'AVAILABILITY' then i.status in('COORDINATING','CHANGE_REQUESTED') and not exists(select 1 from public.interview_mgmt_availability where interview_id=i.id and user_id=d.recipient_id)
    when 'CONFIRMATION' then exists(select 1 from public.interview_mgmt_bookings where interview_id=i.id and active)
    when 'CANCELLATION' then i.status='CANCELLED' else false end);
$$;
-- Templates deliberately omit interviewer identity, organization and internal recipients.
create function public.interview_mgmt_create_mail(p_interview uuid,p_kind text,p_recipient uuid) returns void language plpgsql security definer set search_path='' as $$
declare i public.interview_mgmt_interviews; v_subject text; v_body text; v_times text;
begin
  select * into i from public.interview_mgmt_interviews where id=p_interview;
  if p_kind='PROPOSAL' then
    v_subject:='[TalentHub] 면접 일정 선택 요청';
    select string_agg(to_char(starts_at at time zone 'Asia/Seoul','YYYY-MM-DD HH24:MI')||' ~ '||to_char(ends_at at time zone 'Asia/Seoul','HH24:MI'),E'\n' order by starts_at) into v_times from public.interview_mgmt_proposals where interview_id=i.id and version=i.version and active;
    v_body:='면접 후보 시간(한국시간) 중 가능한 시간을 선택해주세요.'||E'\n'||coalesce(v_times,'');
  elsif p_kind='CONFIRMATION' then
    v_subject:='[TalentHub] 면접 일정 확정 안내';
    select to_char(starts_at at time zone 'Asia/Seoul','YYYY-MM-DD HH24:MI')||' ~ '||to_char(ends_at at time zone 'Asia/Seoul','HH24:MI') into v_times from public.interview_mgmt_bookings where interview_id=i.id and active;
    v_body:='면접 일정이 확정되었습니다(한국시간).'||E'\n'||coalesce(v_times,'');
  elsif p_kind='CANCELLATION' then v_subject:='[TalentHub] 면접 취소 안내';v_body:='면접이 취소되었습니다. 문의는 담당 채용담당자에게 회신해주세요.';
  elsif p_kind='AVAILABILITY' then v_subject:='[TalentHub] 면접 가능 시간 입력 요청';v_body:='배정된 면접의 가능 시간을 입력해주세요. 전체 면접관의 참석이 필요합니다.';
  else raise exception 'Unknown mail kind';end if;
  v_body:=v_body||E'\n\n'||'TalentHub 면접 일정 관리에 로그인하여 확인해주세요.';
  insert into public.interview_mgmt_email_drafts(interview_id,version,kind,recipient_id,subject,body,base_body) values(i.id,i.version,p_kind,p_recipient,v_subject,v_body,v_body) on conflict do nothing;
end;
$$;
create function public.interview_mgmt_mail_audit_trigger() returns trigger language plpgsql security definer set search_path='' as $$
declare i public.interview_mgmt_interviews; p record; v_kind text;
begin
  if new.interview_id is null then return new;end if;
  select * into i from public.interview_mgmt_interviews where id=new.interview_id;
  if new.action='면접 생성' then
    for p in select user_id from public.interview_mgmt_participants where interview_id=i.id loop perform public.interview_mgmt_create_mail(i.id,'AVAILABILITY',p.user_id);end loop;
  elsif new.action='일정: request_availability' then perform public.interview_mgmt_create_mail(i.id,'AVAILABILITY',new.target_user_id);
  elsif new.action='일정: publish' then perform public.interview_mgmt_create_mail(i.id,'PROPOSAL',i.candidate_id);
  elsif new.action in('일정: availability','일정: availability_delete','일정: reopen','일정: review_request') and i.status in('COORDINATING','CHANGE_REQUESTED') then
    for p in select user_id from public.interview_mgmt_participants pp where pp.interview_id=i.id and not exists(select 1 from public.interview_mgmt_availability a where a.interview_id=i.id and a.user_id=pp.user_id) loop perform public.interview_mgmt_create_mail(i.id,'AVAILABILITY',p.user_id);end loop;
  elsif new.action in('지원자 일정 확정','면접 취소') then
    update public.interview_mgmt_email_drafts set status='INVALIDATED' where interview_id=i.id and status in('PENDING','APPROVED','FAILED');
    v_kind:=case when new.action='면접 취소' then 'CANCELLATION' else 'CONFIRMATION' end;
    perform public.interview_mgmt_create_mail(i.id,v_kind,i.candidate_id);
    perform public.interview_mgmt_create_mail(i.id,v_kind,i.hrbp_id);
    for p in select user_id from public.interview_mgmt_participants where interview_id=i.id loop perform public.interview_mgmt_create_mail(i.id,v_kind,p.user_id);end loop;
  end if;
  return new;
end;
$$;
create trigger interview_mgmt_mail_after_audit after insert on public.interview_mgmt_audit_logs for each row execute function public.interview_mgmt_mail_audit_trigger();

create function public.interview_mgmt_mail_inbox() returns setof jsonb language plpgsql stable security definer set search_path='' as $$
begin
  if public.interview_mgmt_role() is distinct from 'RECRUITER' then raise exception 'Forbidden' using errcode='42501';end if;
  return query select to_jsonb(d)||jsonb_build_object('recipient_name',u.name,'recipient_email',u.email,'reply_to',r.email,'valid',public.interview_mgmt_mail_valid(d.id),
    'events',coalesce((select jsonb_agg(jsonb_build_object('id',e.id,'status',e.status,'attempts',e.attempts,'sent_at',e.sent_at,'last_error',e.last_error) order by e.created_at desc) from public.interview_mgmt_email_events e where e.draft_id=d.id),'[]'::jsonb))
    from public.interview_mgmt_email_drafts d join public.interview_mgmt_users u on u.id=d.recipient_id join public.interview_mgmt_interviews i on i.id=d.interview_id join public.interview_mgmt_users r on r.id=i.recruiter_id
    where public.interview_mgmt_mail_owner(i.id) order by d.created_at desc limit 500;
end;
$$;
create function public.interview_mgmt_mail_manage(p_action text,p_items jsonb,p_note text default '') returns integer language plpgsql security definer set search_path='' as $$
declare p record;d public.interview_mgmt_email_drafts;v_count integer:=0;
begin
  if public.interview_mgmt_role() is distinct from 'RECRUITER' then raise exception 'Forbidden' using errcode='42501';end if;
  if p_action is null or p_action not in('APPROVE','EDIT') or jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) not between 1 and 50 or (p_action='EDIT' and jsonb_array_length(p_items)<>1) or p_note is null or length(p_note)>2000 then raise exception 'Invalid mail action';end if;
  if (select count(distinct x->>'id') from jsonb_array_elements(p_items) x)<>jsonb_array_length(p_items) then raise exception 'Duplicate drafts';end if;
  -- Same lock order as scheduling: interview first, then draft/event.
  perform i.id from public.interview_mgmt_interviews i where i.id in(select interview_id from public.interview_mgmt_email_drafts where id in(select (x->>'id')::uuid from jsonb_array_elements(p_items) x)) order by i.id for update;
  for p in select x from jsonb_array_elements(p_items) x loop
    select * into d from public.interview_mgmt_email_drafts where id=(p.x->>'id')::uuid for update;
    if not found or not public.interview_mgmt_mail_owner(d.interview_id) then raise exception 'Forbidden' using errcode='42501';end if;
    if not public.interview_mgmt_mail_valid(d.id) or d.status not in('PENDING','APPROVED') or d.content_version is distinct from (p.x->>'content_version')::integer or d.version is distinct from (p.x->>'version')::integer then raise exception 'Stale draft' using errcode='40001';end if;
    if exists(select 1 from public.interview_mgmt_email_events where draft_id=d.id and first_attempt_at is not null) then raise exception 'Attempted draft cannot change' using errcode='40001';end if;
    if p_action='EDIT' then
      if exists(select 1 from public.interview_mgmt_users where id=d.recipient_id and role='CANDIDATE') and (
        exists(select 1 from public.interview_mgmt_participants pp join public.interview_mgmt_users u on u.id=pp.user_id where pp.interview_id=d.interview_id and (strpos(lower(p_note),lower(u.email))>0 or (length(u.name)>=2 and strpos(p_note,u.name)>0)))
        or exists(select 1 from public.interview_mgmt_interviews i join public.interview_mgmt_departments dep on dep.id=i.department_id where i.id=d.interview_id and length(dep.name)>=2 and strpos(lower(p_note),lower(dep.name))>0)) then raise exception 'Candidate note contains internal identity';end if;
      update public.interview_mgmt_email_drafts set note=p_note,body=base_body||case when p_note='' then '' else E'\n\n'||p_note end,content_version=content_version+1,status='PENDING' where id=d.id;
      update public.interview_mgmt_email_events set status='CANCELLED' where draft_id=d.id and status in('QUEUED','FAILED');
    else
      insert into public.interview_mgmt_email_approvals(draft_id,version,content_version,approved_by) values(d.id,d.version,d.content_version,auth.uid()) on conflict do nothing;
      update public.interview_mgmt_email_drafts set status='APPROVED' where id=d.id;
      insert into public.interview_mgmt_email_events(draft_id,content_version,idempotency_key,status) values(d.id,d.content_version,'interview-mgmt/'||d.id||'/'||d.content_version,'QUEUED') on conflict do nothing;
    end if;
    insert into public.interview_mgmt_audit_logs(interview_id,actor_id,action) values(d.interview_id,auth.uid(),'메일: '||p_action);
    v_count:=v_count+1;
  end loop;
  return v_count;
end;
$$;

-- Worker RPCs are accessible only by a server service credential.
create function public.interview_mgmt_mail_claim(p_event uuid,p_from text) returns jsonb language plpgsql security definer set search_path='' as $$
declare e public.interview_mgmt_email_events;d public.interview_mgmt_email_drafts;i public.interview_mgmt_interviews;v_token uuid;v_payload jsonb;
begin
  select ii.* into i from public.interview_mgmt_interviews ii join public.interview_mgmt_email_drafts dd on dd.interview_id=ii.id join public.interview_mgmt_email_events ee on ee.draft_id=dd.id where ee.id=p_event for update of ii;
  select * into d from public.interview_mgmt_email_drafts where id=(select draft_id from public.interview_mgmt_email_events where id=p_event) for update;
  select * into e from public.interview_mgmt_email_events where id=p_event for update;
  if not found or e.status in('SENT','CANCELLED','UNCERTAIN') or (e.status='SENDING' and e.lease_until>now()) or e.next_attempt_at>now() then return null;end if;
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
create function public.interview_mgmt_mail_ready(p_event uuid,p_token uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.interview_mgmt_email_events e join public.interview_mgmt_email_drafts d on d.id=e.draft_id join public.interview_mgmt_interviews i on i.id=d.interview_id where e.id=p_event and e.lease_token=p_token and e.status='SENDING' and e.lease_until>now() and d.status='APPROVED' and e.content_version=d.content_version and public.interview_mgmt_mail_valid(d.id)
    and exists(select 1 from public.interview_mgmt_email_approvals a join public.interview_mgmt_users u on u.id=a.approved_by where a.draft_id=d.id and a.version=d.version and a.content_version=d.content_version and u.active and u.role='RECRUITER' and u.id in(i.recruiter_id,i.alternate_recruiter_id)));
$$;
create function public.interview_mgmt_mail_finish(p_event uuid,p_token uuid,p_provider text,p_error text,p_sent_at timestamptz default null) returns boolean language plpgsql security definer set search_path='' as $$
declare e public.interview_mgmt_email_events;
begin
  perform i.id from public.interview_mgmt_interviews i join public.interview_mgmt_email_drafts d on d.interview_id=i.id join public.interview_mgmt_email_events ee on ee.draft_id=d.id where ee.id=p_event for update of i;
  perform d.id from public.interview_mgmt_email_drafts d join public.interview_mgmt_email_events ee on ee.draft_id=d.id where ee.id=p_event for update of d;
  select * into e from public.interview_mgmt_email_events where id=p_event and lease_token=p_token and status='SENDING' for update;
  if not found then return false;end if;
  update public.interview_mgmt_email_events set status=case when p_provider is not null then 'SENT' else 'FAILED' end,provider_id=p_provider,sent_at=case when p_provider is not null then p_sent_at else null end,last_error=left(p_error,200),next_attempt_at=case when p_provider is null then now()+interval '5 minutes' else null end,lease_until=null where id=e.id;
  if p_provider is not null then update public.interview_mgmt_email_drafts set status=case when status='INVALIDATED' then status else 'SENT' end where id=e.draft_id;end if;
  return true;
end;
$$;
create function public.interview_mgmt_mail_record_time(p_event uuid,p_sent_at timestamptz) returns void language sql security definer set search_path='' as $$
  update public.interview_mgmt_email_events set sent_at=p_sent_at where id=p_event and status='SENT' and sent_at is null;
$$;
create function public.interview_mgmt_mail_reminders() returns integer language plpgsql security definer set search_path='' as $$
declare d public.interview_mgmt_email_drafts;p public.interview_mgmt_email_events;v_count integer:=0;v_next integer;
begin
  for d in select dd.* from public.interview_mgmt_email_drafts dd where dd.status='SENT' and dd.kind in('PROPOSAL','AVAILABILITY') and dd.reminder_number<2 order by dd.interview_id loop
    perform id from public.interview_mgmt_interviews where id=d.interview_id for update;
    if not public.interview_mgmt_mail_valid(d.id) then continue;end if;
    select * into p from public.interview_mgmt_email_events where draft_id=d.id and status='SENT' order by sent_at desc limit 1;
    if not found or p.sent_at is null or p.sent_at>now()-interval '24 hours' then continue;end if;
    v_next:=d.reminder_number+1;
    insert into public.interview_mgmt_email_drafts(interview_id,version,kind,recipient_id,subject,body,base_body,parent_id,reminder_number)
      values(d.interview_id,d.version,d.kind,d.recipient_id,'[리마인드] '||regexp_replace(d.subject,'^\[리마인드\] ',''),d.body,d.body,d.id,v_next) on conflict do nothing;
    if found then v_count:=v_count+1;end if;
  end loop;
  return v_count;
end;
$$;
revoke all on function public.interview_mgmt_mail_owner(uuid),public.interview_mgmt_mail_valid(uuid),public.interview_mgmt_create_mail(uuid,text,uuid),public.interview_mgmt_mail_audit_trigger(),public.interview_mgmt_mail_inbox(),public.interview_mgmt_mail_manage(text,jsonb,text),public.interview_mgmt_mail_claim(uuid,text),public.interview_mgmt_mail_ready(uuid,uuid),public.interview_mgmt_mail_finish(uuid,uuid,text,text,timestamptz),public.interview_mgmt_mail_record_time(uuid,timestamptz),public.interview_mgmt_mail_reminders() from public,anon,authenticated;
grant execute on function public.interview_mgmt_mail_inbox(),public.interview_mgmt_mail_manage(text,jsonb,text) to authenticated;
grant execute on function public.interview_mgmt_mail_claim(uuid,text),public.interview_mgmt_mail_ready(uuid,uuid),public.interview_mgmt_mail_finish(uuid,uuid,text,text,timestamptz),public.interview_mgmt_mail_record_time(uuid,timestamptz),public.interview_mgmt_mail_reminders() to service_role;
grant select on public.interview_mgmt_email_events to service_role;
commit;
