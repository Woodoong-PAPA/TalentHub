-- One-time test recruiter bootstrap; ordinary accounts use the recruiter API.
begin;
create function public.interview_mgmt_bootstrap_recruiter(p_id uuid,p_email text,p_name text)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('interview_mgmt_bootstrap_recruiter',0));
  if exists(select 1 from public.interview_mgmt_users) then
    raise exception 'Interview management is already initialized';
  end if;
  if p_id is null or p_email is null or p_name is null or length(trim(p_name)) not between 1 and 80
    or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.]test$' then
    raise exception 'Synthetic test identity required';
  end if;
  if not exists(select 1 from auth.users where id=p_id and lower(email)=lower(p_email) and email_confirmed_at is not null) then
    raise exception 'Confirmed Auth identity required';
  end if;
  insert into public.interview_mgmt_users(id,email,name,role,active)
    values(p_id,lower(p_email),trim(p_name),'RECRUITER',true);
  insert into public.interview_mgmt_audit_logs(actor_id,target_user_id,action)
    values(p_id,p_id,'관리: 최초 테스트 채용담당자 발급');
  return p_id;
end;
$$;
revoke all on function public.interview_mgmt_bootstrap_recruiter(uuid,text,text) from public,anon,authenticated;
grant execute on function public.interview_mgmt_bootstrap_recruiter(uuid,text,text) to service_role;
notify pgrst,'reload schema';
commit;
