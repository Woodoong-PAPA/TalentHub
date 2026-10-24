-- Preserve provider acceptance time without treating retry response time as send time.
begin;
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
  return jsonb_build_object('first_attempt',e.first_attempt_at is null,'id',e.id,'token',v_token,'key',e.idempotency_key,'payload',v_payload);
end;
$$;
notify pgrst,'reload schema';
commit;
