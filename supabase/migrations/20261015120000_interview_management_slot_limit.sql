-- Keep open-ended coordination bounded to the first 200 slots without imposing a deadline.
begin;
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
    cross join lateral generate_series(lower(r),least(upper(r)-i.duration_minutes*interval '1 minute',lower(r)+199*interval '15 minutes'),interval '15 minutes') s
    order by s limit 200;
end;
$$;
notify pgrst,'reload schema';
commit;
