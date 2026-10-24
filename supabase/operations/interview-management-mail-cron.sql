-- Apply only in the approved hosted project, after configuring the matching
-- Vercel INTERVIEW_MGMT_MAIL_CRON_SECRET and Vault secret. Contains no secrets.
begin;
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
create or replace function public.interview_mgmt_dispatch_approved_mail() returns bigint
language plpgsql security definer set search_path='' as $$
declare v_secret text;v_request bigint;
begin
  select decrypted_secret into v_secret from vault.decrypted_secrets where name='interview_mgmt_mail_cron_secret';
  if v_secret is null then raise exception 'Interview management worker secret required';end if;
  select net.http_post(
    url:='https://talentpool-dx.com/api/interview-management/mail/cron',
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_secret),
    body:='{}'::jsonb,timeout_milliseconds:=30000
  ) into v_request;
  return v_request;
end;
$$;
revoke all on function public.interview_mgmt_dispatch_approved_mail() from public,anon,authenticated;
select cron.schedule('interview_mgmt_approved_mail_every_5m','*/5 * * * *','select public.interview_mgmt_dispatch_approved_mail();');
commit;
