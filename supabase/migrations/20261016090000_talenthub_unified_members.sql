-- Talent Pool app_members becomes the single membership authority.
-- Existing rows/password hashes are retained until verified first login.
begin;
-- Extend the existing menu constraint while retaining every previously allowed view.
do $$ declare definition text; begin
  select pg_get_constraintdef(oid) into definition from pg_constraint where conrelid='public.app_role_permissions'::regclass and conname='app_role_permissions_view_check';
  if definition is not null then
    alter table public.app_role_permissions drop constraint app_role_permissions_view_check;
    execute 'alter table public.app_role_permissions add constraint app_role_permissions_view_check check (view=''interview-management'' or ('||substr(definition,7)||'))';
  end if;
end $$;
create or replace function public.interview_mgmt_member_role(p_role text,p_profile jsonb) returns text
language sql immutable set search_path='' as $$
  select case when p_profile->>'interviewRole' in ('RECRUITER','HRBP','INTERVIEWER','CANDIDATE') then p_profile->>'interviewRole'
    when p_role in ('admin','division_recruiter','business_recruiter') then 'RECRUITER'
    when p_role='hiring_manager' then 'INTERVIEWER' when p_role='applicant' then 'CANDIDATE' else null end;
$$;
revoke all on function public.interview_mgmt_member_role(text,jsonb) from public,anon,authenticated;

create or replace function public.interview_mgmt_sync_member() returns trigger
language plpgsql security definer set search_path='' as $$
declare v_role text;
begin
  if tg_op='DELETE' then
    update public.interview_mgmt_users set active=false where id=old.auth_user_id;
    return old;
  end if;
  if new.auth_user_id is null then return new;end if;
  v_role:=public.interview_mgmt_member_role(new.role,new.profile);
  insert into public.interview_mgmt_users(id,email,name,role,active)
    values(new.auth_user_id,lower(new.email),new.name,coalesce(v_role,'INTERVIEWER'),new.status='active' and v_role is not null)
    on conflict(id) do update set email=excluded.email,name=excluded.name,role=excluded.role,active=excluded.active;
  if v_role is distinct from 'HRBP' then delete from public.interview_mgmt_department_access where user_id=new.auth_user_id;end if;
  return new;
end;
$$;
revoke all on function public.interview_mgmt_sync_member() from public,anon,authenticated;
create trigger interview_mgmt_sync_member after insert or update or delete on public.app_members for each row execute function public.interview_mgmt_sync_member();

-- Preserve Auth IDs and interview foreign keys of the original separate area.
update public.app_members m set auth_user_id=u.id from public.interview_mgmt_users u where lower(m.email)=lower(u.email) and m.auth_user_id is null;
insert into public.app_members(id,auth_user_id,email,name,role,status,profile)
  select 'interview-'||u.id,u.id,u.email,u.name,
    case u.role when 'RECRUITER' then 'business_recruiter' when 'CANDIDATE' then 'applicant' else 'hiring_manager' end,
    case when u.active then 'active' else 'suspended' end,jsonb_build_object('interviewRole',u.role)
  from public.interview_mgmt_users u where not exists(select 1 from public.app_members m where lower(m.email)=lower(u.email));
create unique index interview_mgmt_member_auth_unique on public.app_members(auth_user_id) where auth_user_id is not null;

-- Account writes are accepted only through the canonical membership trigger.
create function public.interview_mgmt_guard_member_projection() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_op='UPDATE' and not new.active and not exists(select 1 from public.app_members where auth_user_id=new.id) then return new;end if;
  if not exists(select 1 from public.app_members m where m.auth_user_id=new.id and lower(m.email)=lower(new.email) and m.name=new.name
    and new.role=coalesce(public.interview_mgmt_member_role(m.role,m.profile),'INTERVIEWER')
    and new.active=(m.status='active' and public.interview_mgmt_member_role(m.role,m.profile) is not null)) then
    raise exception 'Manage members in Talent Pool' using errcode='42501';
  end if;return new;
end;
$$;
revoke all on function public.interview_mgmt_guard_member_projection() from public,anon,authenticated;
create trigger interview_mgmt_guard_member_projection before insert or update on public.interview_mgmt_users for each row execute function public.interview_mgmt_guard_member_projection();
alter function public.interview_mgmt_manage(text,jsonb) rename to interview_mgmt_manage_internal;
revoke all on function public.interview_mgmt_manage_internal(text,jsonb) from public,anon,authenticated;
create function public.interview_mgmt_manage(p_action text,p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
begin
  if p_action not in ('department','access','type') then raise exception 'Manage members in Talent Pool' using errcode='42501';end if;
  return public.interview_mgmt_manage_internal(p_action,p_data);
end;
$$;
revoke all on function public.interview_mgmt_manage(text,jsonb) from public,anon;
grant execute on function public.interview_mgmt_manage(text,jsonb) to authenticated;

create or replace function public.interview_mgmt_role() returns text language sql stable security definer set search_path='' as $$
  select u.role from public.interview_mgmt_users u join public.app_members m on m.auth_user_id=u.id
    where u.id=auth.uid() and u.active and m.status='active' and m.password_hash is null and u.role=public.interview_mgmt_member_role(m.role,m.profile);
$$;

create function public.interview_mgmt_find_auth(p_email text) returns uuid language sql stable security definer set search_path='' as $$
  select id from auth.users where lower(email)=lower(p_email);
$$;
create function public.interview_mgmt_link_member(p_id text,p_auth uuid,p_expected_hash text) returns void
language plpgsql security definer set search_path='' as $$
declare m public.app_members;
begin
  select * into m from public.app_members where id=p_id for update;
  if not found or m.status<>'active' or m.password_hash is distinct from p_expected_hash
    or (m.auth_user_id is not null and m.auth_user_id<>p_auth)
    or not exists(select 1 from auth.users where id=p_auth and lower(email)=lower(m.email)) then raise exception 'Membership changed' using errcode='42501';end if;
  update public.app_members set auth_user_id=p_auth,password_hash=null,last_login_at=now() where id=p_id;
end;
$$;
revoke all on function public.interview_mgmt_find_auth(text),public.interview_mgmt_link_member(text,uuid,text) from public,anon,authenticated;
grant execute on function public.interview_mgmt_find_auth(text),public.interview_mgmt_link_member(text,uuid,text) to service_role;

create table public.interview_mgmt_login_limits(key text primary key,attempts integer not null,expires_at timestamptz not null);
alter table public.interview_mgmt_login_limits enable row level security;
revoke all on public.interview_mgmt_login_limits from public,anon,authenticated;
create function public.interview_mgmt_login_limit(p_key text) returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;
begin
  insert into public.interview_mgmt_login_limits values(p_key,1,now()+interval '15 minutes') on conflict(key) do update
    set attempts=case when interview_mgmt_login_limits.expires_at<=now() then 1 else interview_mgmt_login_limits.attempts+1 end,
    expires_at=case when interview_mgmt_login_limits.expires_at<=now() then now()+interval '15 minutes' else interview_mgmt_login_limits.expires_at end returning attempts into n;
  return n<=15;
end;
$$;
revoke all on function public.interview_mgmt_login_limit(text) from public,anon,authenticated;
grant execute on function public.interview_mgmt_login_limit(text) to service_role;

-- Legacy browser writes/hashes must not remain a route to role escalation.
revoke all on public.app_members from public,anon,authenticated;
grant all on public.app_members to service_role;
revoke insert,update,delete on public.app_role_permissions from anon,authenticated;
grant all on public.app_role_permissions to service_role;
create function public.interview_mgmt_member_manage(p_actor uuid,p_action text,p_id text,p_data jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare a public.app_members;m public.app_members;v public.app_members;r record;
begin
  perform id from public.app_members where auth_user_id=p_actor or id=p_id order by id for update;
  select * into a from public.app_members where auth_user_id=p_actor and status='active' and password_hash is null;
  if p_action<>'signup' and a.id is null then raise exception 'Forbidden' using errcode='42501';end if;
  if p_action in ('signup','create') then
    v:=jsonb_populate_record(null::public.app_members,p_data);
    if p_action='signup' then
      if v.status<>'pending' or v.role='admin' or coalesce(v.profile->>'interviewRole','')<>'' then raise exception 'Forbidden' using errcode='42501';end if;
    elsif a.role<>'admin' and (a.role not in ('business_recruiter','division_recruiter') or v.role not in ('applicant','hiring_manager','search_firm') or coalesce(v.profile->>'interviewRole','')<>'') then raise exception 'Forbidden' using errcode='42501';end if;
    if not exists(select 1 from auth.users where id=v.auth_user_id and lower(email)=lower(v.email)) then raise exception 'Auth mismatch';end if;
    insert into public.app_members(id,auth_user_id,email,name,role,status,business_unit,department,position,phone,note,profile,approved_at,approved_by)
      values(v.id,v.auth_user_id,lower(v.email),v.name,v.role,v.status,v.business_unit,v.department,v.position,v.phone,v.note,coalesce(v.profile,'{}'),v.approved_at,v.approved_by) returning * into m;
  elsif p_action='permissions' then
    if a.role<>'admin' or jsonb_typeof(p_data->'rows')<>'array' then raise exception 'Forbidden' using errcode='42501';end if;
    for r in select * from jsonb_to_recordset(p_data->'rows') as x(role text,view text,enabled boolean) loop
      insert into public.app_role_permissions(role,view,enabled) values(r.role,r.view,r.enabled) on conflict(role,view)do update set enabled=excluded.enabled;
    end loop;return '{}'::jsonb;
  else
    select * into m from public.app_members where id=p_id;
    if not found then raise exception 'Unknown member';end if;
    if p_action='update' then
      if a.role<>'admin' and (a.id<>m.id or (p_data ? 'role' and p_data->>'role'<>m.role) or (p_data ? 'status' and p_data->>'status'<>m.status) or p_data ? 'profile') then raise exception 'Forbidden' using errcode='42501';end if;
      if a.id=m.id and ((p_data ? 'role' and p_data->>'role'<>m.role) or (p_data ? 'status' and p_data->>'status'<>'active')) then raise exception 'Self privilege change prohibited';end if;
      if p_data ? 'profile' and coalesce(p_data->'profile'->>'interviewRole','') not in ('','RECRUITER','HRBP','INTERVIEWER','CANDIDATE') then raise exception 'Invalid interview role';end if;
      update public.app_members set name=coalesce(p_data->>'name',name),department=coalesce(p_data->>'department',department),position=coalesce(p_data->>'position',position),phone=coalesce(p_data->>'phone',phone),note=coalesce(p_data->>'note',note),business_unit=coalesce(p_data->>'business_unit',business_unit),role=coalesce(p_data->>'role',role),status=coalesce(p_data->>'status',status),
        profile=case when p_data ? 'profile' then profile||jsonb_build_object('interviewRole',p_data->'profile'->>'interviewRole') else profile end,
        approved_at=coalesce((p_data->>'approved_at')::timestamptz,approved_at),approved_by=coalesce(p_data->>'approved_by',approved_by)
        where id=p_id returning * into m;
    elsif p_action='reset' then
      if a.role<>'admin' then raise exception 'Forbidden' using errcode='42501';end if;
      if not exists(select 1 from auth.users where id=(p_data->>'auth_user_id')::uuid and lower(email)=lower(m.email)) then raise exception 'Auth mismatch';end if;
      update public.app_members set auth_user_id=(p_data->>'auth_user_id')::uuid,password_hash=null where id=p_id returning * into m;
    elsif p_action='delete' then
      if a.role<>'admin' or a.id=m.id then raise exception 'Forbidden' using errcode='42501';end if;
      delete from public.app_members where id=p_id;return '{}'::jsonb;
    else raise exception 'Unknown action';end if;
  end if;
  return to_jsonb(m);
end;
$$;
revoke all on function public.interview_mgmt_member_manage(uuid,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.interview_mgmt_member_manage(uuid,text,text,jsonb) to service_role;
insert into public.app_role_permissions(role,view,enabled) values
  ('admin','interview-management',true),('division_recruiter','interview-management',true),('business_recruiter','interview-management',true),
  ('hiring_manager','interview-management',true),('applicant','interview-management',true) on conflict(role,view) do nothing;
notify pgrst,'reload schema';
commit;
