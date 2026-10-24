-- A counterproposal is a response, even before a new booking is chosen.
begin;
create or replace function public.interview_mgmt_mail_valid(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.interview_mgmt_email_drafts d join public.interview_mgmt_interviews i on i.id=d.interview_id join public.interview_mgmt_users u on u.id=d.recipient_id
    where d.id=p_id and u.active and i.version=d.version and d.status<>'INVALIDATED' and
    case d.kind when 'PROPOSAL' then i.status in('PROPOSED','CHANGE_REQUESTED') and exists(select 1 from public.interview_mgmt_proposals where interview_id=i.id and version=i.version and active and starts_at>now())
      and not exists(select 1 from public.interview_mgmt_change_requests c where c.interview_id=i.id and c.requested_by=i.candidate_id and (c.status='PENDING' or (d.reminder_number>0 and c.created_at>=(select dd.created_at from public.interview_mgmt_email_drafts dd where dd.interview_id=d.interview_id and dd.version=d.version and dd.kind=d.kind and dd.recipient_id=d.recipient_id and dd.reminder_number=0))))
    when 'AVAILABILITY' then i.status in('COORDINATING','CHANGE_REQUESTED') and not exists(select 1 from public.interview_mgmt_availability where interview_id=i.id and user_id=d.recipient_id)
    when 'CONFIRMATION' then exists(select 1 from public.interview_mgmt_bookings where interview_id=i.id and active)
    when 'CANCELLATION' then i.status='CANCELLED' else false end);
$$;
commit;
