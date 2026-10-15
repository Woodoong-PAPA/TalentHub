-- Independent v2 schema. Does not alter existing TalentHub tables.
begin;
create extension if not exists btree_gist;

create table public.interview_mgmt_users (
  id uuid primary key references auth.users(id),
  email text not null unique, name text not null check (length(name) between 1 and 80),
  role text not null check (role in ('RECRUITER','HRBP','INTERVIEWER','CANDIDATE')),
  active boolean not null default true, created_at timestamptz not null default now()
);
create table public.interview_mgmt_departments (
  id uuid primary key default gen_random_uuid(), name text not null unique check (length(name) between 1 and 80)
);
create table public.interview_mgmt_department_access (
  user_id uuid references public.interview_mgmt_users(id),
  department_id uuid references public.interview_mgmt_departments(id), primary key(user_id,department_id)
);
create table public.interview_mgmt_type_settings (
  type text primary key check (type in ('PHONE','TECHNICAL','EXECUTIVE','HR')),
  duration_minutes integer not null check (duration_minutes between 15 and 480)
);
insert into public.interview_mgmt_type_settings values ('PHONE',30),('TECHNICAL',60),('EXECUTIVE',60),('HR',60);
create table public.interview_mgmt_interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.interview_mgmt_users(id),
  department_id uuid not null references public.interview_mgmt_departments(id),
  recruiter_id uuid not null references public.interview_mgmt_users(id),
  alternate_recruiter_id uuid references public.interview_mgmt_users(id),
  hrbp_id uuid not null references public.interview_mgmt_users(id),
  position text not null check(length(position) between 1 and 200),
  type text not null references public.interview_mgmt_type_settings(type),
  duration_minutes integer not null check(duration_minutes between 15 and 480),
  mode text not null check(mode in ('ONLINE','ONSITE','PHONE')),
  status text not null default 'COORDINATING' check(status in ('COORDINATING','PROPOSED','CONFIRMED','CHANGE_REQUESTED','CANCELLED')),
  window_start timestamptz not null, window_end timestamptz not null,
  version integer not null default 1,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(window_end >= window_start + duration_minutes * interval '1 minute'),
  check(alternate_recruiter_id is distinct from recruiter_id)
);
create table public.interview_mgmt_participants (
  interview_id uuid references public.interview_mgmt_interviews(id) on delete cascade,
  user_id uuid references public.interview_mgmt_users(id), required boolean not null default true check(required),
  primary key(interview_id,user_id)
);
create table public.interview_mgmt_availability (
  id uuid primary key default gen_random_uuid(), interview_id uuid not null references public.interview_mgmt_interviews(id),
  user_id uuid not null references public.interview_mgmt_users(id), entered_by uuid not null references public.interview_mgmt_users(id),
  starts_at timestamptz not null, ends_at timestamptz not null, check(starts_at < ends_at),
  foreign key(interview_id,user_id) references public.interview_mgmt_participants(interview_id,user_id)
);
create table public.interview_mgmt_proposals (
  id uuid primary key default gen_random_uuid(), interview_id uuid not null references public.interview_mgmt_interviews(id),
  version integer not null, starts_at timestamptz not null, ends_at timestamptz not null,
  active boolean not null default true, check(starts_at < ends_at)
);
create table public.interview_mgmt_bookings (
  id uuid primary key default gen_random_uuid(), interview_id uuid not null references public.interview_mgmt_interviews(id),
  proposal_id uuid not null references public.interview_mgmt_proposals(id),
  starts_at timestamptz not null, ends_at timestamptz not null, active boolean not null default true,
  created_at timestamptz not null default now(), check(starts_at < ends_at)
);
create unique index interview_mgmt_one_active_booking on public.interview_mgmt_bookings(interview_id) where active;
-- Phase 2 will create all candidate/interviewer locks in the selection transaction.
-- Half-open ranges allow adjacent interviews; inactive old locks are kept for history.
create table public.interview_mgmt_booking_resources (
  booking_id uuid references public.interview_mgmt_bookings(id), user_id uuid references public.interview_mgmt_users(id),
  starts_at timestamptz not null, ends_at timestamptz not null, active boolean not null default true,
  primary key(booking_id,user_id), check(starts_at < ends_at),
  exclude using gist (user_id with =, tstzrange(starts_at,ends_at,'[)') with &&) where(active)
);
create table public.interview_mgmt_change_requests (
  id uuid primary key default gen_random_uuid(), interview_id uuid not null references public.interview_mgmt_interviews(id),
  requested_by uuid not null references public.interview_mgmt_users(id),
  kind text not null check(kind in ('COUNTER_PROPOSAL','CHANGE')), proposed_start timestamptz, proposed_end timestamptz,
  reason text, status text not null default 'PENDING' check(status in ('PENDING','ACCEPTED','REJECTED')),
  created_at timestamptz not null default now(), check(proposed_end > proposed_start)
);
create table public.interview_mgmt_email_drafts (
  id uuid primary key default gen_random_uuid(), interview_id uuid not null references public.interview_mgmt_interviews(id),
  version integer not null, kind text not null, recipient_id uuid not null references public.interview_mgmt_users(id),
  subject text not null, body text not null,
  status text not null default 'PENDING' check(status in ('PENDING','APPROVED','INVALIDATED','SENT','FAILED')),
  reminder_number integer not null default 0 check(reminder_number between 0 and 2),
  created_at timestamptz not null default now()
);
create table public.interview_mgmt_email_approvals (
  id uuid primary key default gen_random_uuid(), draft_id uuid not null references public.interview_mgmt_email_drafts(id),
  version integer not null, approved_by uuid not null references public.interview_mgmt_users(id), approved_at timestamptz not null default now(),
  unique(draft_id,version)
);
create table public.interview_mgmt_email_events (
  id uuid primary key default gen_random_uuid(), draft_id uuid not null references public.interview_mgmt_email_drafts(id),
  idempotency_key text not null unique, provider_id text, attempts integer not null default 0,
  status text not null check(status in ('QUEUED','SENDING','SENT','FAILED')), sent_at timestamptz, last_error text,
  created_at timestamptz not null default now()
);
create table public.interview_mgmt_audit_logs (
  id uuid primary key default gen_random_uuid(), interview_id uuid references public.interview_mgmt_interviews(id),
  actor_id uuid not null references public.interview_mgmt_users(id), target_user_id uuid references public.interview_mgmt_users(id),
  action text not null, created_at timestamptz not null default now()
);
create index interview_mgmt_candidate_idx on public.interview_mgmt_interviews(candidate_id);
create index interview_mgmt_department_status_idx on public.interview_mgmt_interviews(department_id,status);
create index interview_mgmt_recruiter_idx on public.interview_mgmt_interviews(recruiter_id);
create index interview_mgmt_alternate_idx on public.interview_mgmt_interviews(alternate_recruiter_id);
create index interview_mgmt_participant_user_idx on public.interview_mgmt_participants(user_id);
create index interview_mgmt_availability_idx on public.interview_mgmt_availability(interview_id,user_id,starts_at);
create index interview_mgmt_proposal_idx on public.interview_mgmt_proposals(interview_id,version);
create index interview_mgmt_change_idx on public.interview_mgmt_change_requests(interview_id,status);
create index interview_mgmt_draft_idx on public.interview_mgmt_email_drafts(status,interview_id,version);
create index interview_mgmt_event_idx on public.interview_mgmt_email_events(status,sent_at);
create index interview_mgmt_audit_idx on public.interview_mgmt_audit_logs(interview_id,created_at desc);

create function public.interview_mgmt_role() returns text language sql stable security definer set search_path = '' as $$
  select role from public.interview_mgmt_users where id = auth.uid() and active;
$$;
create function public.interview_mgmt_can_view(p_id uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.interview_mgmt_interviews i where i.id=p_id and (
    public.interview_mgmt_role()='RECRUITER'
    or (public.interview_mgmt_role()='CANDIDATE' and i.candidate_id=auth.uid())
    or (public.interview_mgmt_role()='INTERVIEWER' and exists(select 1 from public.interview_mgmt_participants p where p.interview_id=i.id and p.user_id=auth.uid()))
    or (public.interview_mgmt_role()='HRBP' and exists(select 1 from public.interview_mgmt_department_access a where a.department_id=i.department_id and a.user_id=auth.uid()))
  ));
$$;
create function public.interview_mgmt_list_interviews() returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if public.interview_mgmt_role() is null then raise exception 'Forbidden' using errcode='42501'; end if;
  return query select case when public.interview_mgmt_role()='CANDIDATE' then
    jsonb_build_object('id',i.id,'position',i.position,'type',i.type,'duration_minutes',i.duration_minutes,'mode',i.mode,'status',i.status,'window_start',i.window_start,'window_end',i.window_end,'created_at',i.created_at)
  else to_jsonb(i) || jsonb_build_object(
    'candidate_name',c.name,'department_name',d.name,
    'interviewer_ids',coalesce((select jsonb_agg(p.user_id order by p.user_id) from public.interview_mgmt_participants p where p.interview_id=i.id),'[]'::jsonb),
    'interviewer_names',coalesce((select jsonb_agg(u.name order by u.id) from public.interview_mgmt_participants p join public.interview_mgmt_users u on u.id=p.user_id where p.interview_id=i.id),'[]'::jsonb)) end
  from public.interview_mgmt_interviews i join public.interview_mgmt_users c on c.id=i.candidate_id join public.interview_mgmt_departments d on d.id=i.department_id
  where public.interview_mgmt_can_view(i.id) order by i.created_at desc;
end;
$$;

create function public.interview_mgmt_save_interview(p_id uuid,p_data jsonb) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_count integer; v_min integer; v_max integer; v_old public.interview_mgmt_interviews;
begin
  perform id from public.interview_mgmt_users where id=auth.uid() for share;
  if public.interview_mgmt_role() is distinct from 'RECRUITER' then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_id is not null then
    select * into v_old from public.interview_mgmt_interviews where id=p_id for update;
    if not found or v_old.status <> 'COORDINATING' then raise exception 'Only coordinating interviews can be edited'; end if;
  end if;
  -- Serialize assignment validation with user changes to prevent role/status races.
  perform id from public.interview_mgmt_users where id in (
    select value::uuid from jsonb_array_elements_text(p_data->'interviewer_ids')
    union select (p_data->>'candidate_id')::uuid union select (p_data->>'recruiter_id')::uuid
    union select (p_data->>'alternate_recruiter_id')::uuid union select (p_data->>'hrbp_id')::uuid
  ) order by id for share;
  if not exists(select 1 from public.interview_mgmt_users where id=(p_data->>'candidate_id')::uuid and role='CANDIDATE' and active)
    or not exists(select 1 from public.interview_mgmt_users where id=(p_data->>'recruiter_id')::uuid and role='RECRUITER' and active)
    or not exists(select 1 from public.interview_mgmt_users where id=(p_data->>'hrbp_id')::uuid and role='HRBP' and active)
    or (p_data->>'alternate_recruiter_id' is not null and not exists(select 1 from public.interview_mgmt_users where id=(p_data->>'alternate_recruiter_id')::uuid and role='RECRUITER' and active))
  then raise exception 'Invalid assignment'; end if;
  if not exists(select 1 from public.interview_mgmt_department_access where user_id=(p_data->>'hrbp_id')::uuid and department_id=(p_data->>'department_id')::uuid) then raise exception 'HRBP department access required'; end if;
  if jsonb_typeof(p_data->'interviewer_ids') is distinct from 'array' then raise exception 'Panel required'; end if;
  v_min := case when p_data->>'type'='PHONE' then 1 else 2 end;
  v_max := case when p_data->>'type'='HR' then 2 else 4 end;
  select count(distinct u.id) into v_count from jsonb_array_elements_text(p_data->'interviewer_ids') p(id) join public.interview_mgmt_users u on u.id=p.id::uuid where u.role='INTERVIEWER' and u.active;
  if v_count < v_min or v_count > v_max or v_count <> jsonb_array_length(p_data->'interviewer_ids') then raise exception 'Invalid panel count or role'; end if;
  if p_id is null then
    insert into public.interview_mgmt_interviews(candidate_id,department_id,recruiter_id,alternate_recruiter_id,hrbp_id,position,type,duration_minutes,mode,window_start,window_end)
    values ((p_data->>'candidate_id')::uuid,(p_data->>'department_id')::uuid,(p_data->>'recruiter_id')::uuid,(p_data->>'alternate_recruiter_id')::uuid,(p_data->>'hrbp_id')::uuid,p_data->>'position',p_data->>'type',(p_data->>'duration_minutes')::integer,p_data->>'mode',(p_data->>'window_start')::timestamptz,(p_data->>'window_end')::timestamptz) returning id into v_id;
  else
    v_id := p_id;
    update public.interview_mgmt_interviews set candidate_id=(p_data->>'candidate_id')::uuid,department_id=(p_data->>'department_id')::uuid,recruiter_id=(p_data->>'recruiter_id')::uuid,alternate_recruiter_id=(p_data->>'alternate_recruiter_id')::uuid,hrbp_id=(p_data->>'hrbp_id')::uuid,position=p_data->>'position',type=p_data->>'type',duration_minutes=(p_data->>'duration_minutes')::integer,mode=p_data->>'mode',window_start=(p_data->>'window_start')::timestamptz,window_end=(p_data->>'window_end')::timestamptz,version=version+1,updated_at=now() where id=v_id;
    delete from public.interview_mgmt_participants where interview_id=v_id;
    update public.interview_mgmt_email_drafts set status='INVALIDATED' where interview_id=v_id and status in ('PENDING','APPROVED','FAILED');
    update public.interview_mgmt_proposals set active=false where interview_id=v_id;
  end if;
  insert into public.interview_mgmt_participants(interview_id,user_id) select v_id,value::uuid from jsonb_array_elements_text(p_data->'interviewer_ids');
  insert into public.interview_mgmt_audit_logs(interview_id,actor_id,action) values(v_id,auth.uid(),case when p_id is null then '면접 생성' else '면접 수정' end);
  return v_id;
end;
$$;
create function public.interview_mgmt_cancel_interview(p_id uuid) returns void language plpgsql security definer set search_path = '' as $$
begin
  perform id from public.interview_mgmt_users where id=auth.uid() for share;
  if public.interview_mgmt_role() is distinct from 'RECRUITER' then raise exception 'Forbidden' using errcode='42501'; end if;
  perform id from public.interview_mgmt_interviews where id=p_id and status <> 'CANCELLED' for update;
  if not found then raise exception 'Interview unavailable'; end if;
  update public.interview_mgmt_interviews set status='CANCELLED',version=version+1,updated_at=now() where id=p_id;
  update public.interview_mgmt_booking_resources set active=false where booking_id in(select id from public.interview_mgmt_bookings where interview_id=p_id);
  update public.interview_mgmt_bookings set active=false where interview_id=p_id;
  update public.interview_mgmt_proposals set active=false where interview_id=p_id;
  update public.interview_mgmt_email_drafts set status='INVALIDATED' where interview_id=p_id and status in('PENDING','APPROVED','FAILED');
  insert into public.interview_mgmt_audit_logs(interview_id,actor_id,action) values(p_id,auth.uid(),'면접 취소');
end;
$$;
create function public.interview_mgmt_manage(p_action text,p_data jsonb) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_result jsonb; v_id uuid; v_role text; v_active boolean;
begin
  -- Lock the actor and target in UUID order before privilege checks.
  perform id from public.interview_mgmt_users where id=auth.uid() or id=(p_data->>'id')::uuid or id=(p_data->>'user_id')::uuid order by id for update;
  if public.interview_mgmt_role() is distinct from 'RECRUITER' then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_action='department' then
    insert into public.interview_mgmt_departments(name) values(p_data->>'name') returning to_jsonb(interview_mgmt_departments.*) into v_result;
  elsif p_action='create_user' then
    insert into public.interview_mgmt_users(id,email,name,role) values((p_data->>'id')::uuid,p_data->>'email',p_data->>'name',p_data->>'role') returning to_jsonb(interview_mgmt_users.*) into v_result;
  elsif p_action='user' then
    v_id := (p_data->>'id')::uuid; v_role := p_data->>'role'; v_active := (p_data->>'active')::boolean;
    if v_id=auth.uid() then raise exception 'Self privilege changes prohibited'; end if;
    if exists(select 1 from public.interview_mgmt_interviews i where i.status <> 'CANCELLED' and (v_id in(i.candidate_id,i.recruiter_id,i.alternate_recruiter_id,i.hrbp_id) or exists(select 1 from public.interview_mgmt_participants p where p.interview_id=i.id and p.user_id=v_id))) then raise exception 'User has assigned interviews'; end if;
    update public.interview_mgmt_users set role=v_role,active=v_active where id=v_id returning to_jsonb(interview_mgmt_users.*) into v_result;
    if not found then raise exception 'User unavailable'; end if;
    if v_role <> 'HRBP' or not v_active then delete from public.interview_mgmt_department_access where user_id=v_id; end if;
  elsif p_action='access' then
    if not exists(select 1 from public.interview_mgmt_users where id=(p_data->>'user_id')::uuid and role='HRBP' and active) then raise exception 'Active HRBP required'; end if;
    if (p_data->>'enabled')::boolean then
      insert into public.interview_mgmt_department_access values((p_data->>'user_id')::uuid,(p_data->>'department_id')::uuid) on conflict do nothing;
    else
      if exists(select 1 from public.interview_mgmt_interviews where hrbp_id=(p_data->>'user_id')::uuid and department_id=(p_data->>'department_id')::uuid and status <> 'CANCELLED') then raise exception 'Department has assigned interviews'; end if;
      delete from public.interview_mgmt_department_access where user_id=(p_data->>'user_id')::uuid and department_id=(p_data->>'department_id')::uuid;
    end if;
  elsif p_action='type' then
    update public.interview_mgmt_type_settings set duration_minutes=(p_data->>'duration_minutes')::integer where type=p_data->>'type';
    if not found then raise exception 'Unknown type'; end if;
  elsif p_action='reset_audit' then
    if not exists(select 1 from public.interview_mgmt_users where id=(p_data->>'id')::uuid) then raise exception 'Unknown user'; end if;
  else raise exception 'Unknown management action'; end if;
  insert into public.interview_mgmt_audit_logs(actor_id,target_user_id,action) values(auth.uid(),coalesce((p_data->>'id')::uuid,(p_data->>'user_id')::uuid),'관리: '||p_action);
  return coalesce(v_result,'{}'::jsonb);
end;
$$;

-- All writes go through restricted transactional functions. Future Phase 2/3
-- tables have no client policies until their secure APIs are implemented.
do $$ declare v_table text; begin
  foreach v_table in array array['users','departments','department_access','type_settings','interviews','participants','availability','proposals','bookings','booking_resources','change_requests','email_drafts','email_approvals','email_events','audit_logs'] loop
    execute format('alter table public.%I enable row level security','interview_mgmt_'||v_table);
    execute format('revoke all on public.%I from anon, authenticated','interview_mgmt_'||v_table);
    execute format('grant select on public.%I to authenticated','interview_mgmt_'||v_table);
  end loop;
end $$;
create policy interview_mgmt_user_read on public.interview_mgmt_users for select to authenticated using(public.interview_mgmt_role()='RECRUITER' or (id=auth.uid() and active));
create policy interview_mgmt_department_read on public.interview_mgmt_departments for select to authenticated using(public.interview_mgmt_role()='RECRUITER' or (public.interview_mgmt_role()='HRBP' and exists(select 1 from public.interview_mgmt_department_access a where a.department_id=id and a.user_id=auth.uid())));
create policy interview_mgmt_access_read on public.interview_mgmt_department_access for select to authenticated using(public.interview_mgmt_role()='RECRUITER' or (public.interview_mgmt_role()='HRBP' and user_id=auth.uid()));
create policy interview_mgmt_types_read on public.interview_mgmt_type_settings for select to authenticated using(public.interview_mgmt_role() is not null);
create policy interview_mgmt_internal_read on public.interview_mgmt_interviews for select to authenticated using(public.interview_mgmt_role() <> 'CANDIDATE' and public.interview_mgmt_can_view(id));
create policy interview_mgmt_participant_read on public.interview_mgmt_participants for select to authenticated using(public.interview_mgmt_role() <> 'CANDIDATE' and public.interview_mgmt_can_view(interview_id));
create policy interview_mgmt_audit_read on public.interview_mgmt_audit_logs for select to authenticated using(public.interview_mgmt_role()='RECRUITER' or (public.interview_mgmt_role() in('HRBP','INTERVIEWER') and public.interview_mgmt_can_view(interview_id)));

revoke all on function public.interview_mgmt_role(),public.interview_mgmt_can_view(uuid),public.interview_mgmt_list_interviews(),public.interview_mgmt_save_interview(uuid,jsonb),public.interview_mgmt_cancel_interview(uuid),public.interview_mgmt_manage(text,jsonb) from public,anon;
grant execute on function public.interview_mgmt_role(),public.interview_mgmt_can_view(uuid),public.interview_mgmt_list_interviews(),public.interview_mgmt_save_interview(uuid,jsonb),public.interview_mgmt_cancel_interview(uuid),public.interview_mgmt_manage(text,jsonb) to authenticated;
commit;
