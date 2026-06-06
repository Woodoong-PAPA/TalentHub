alter table public.candidates
add column if not exists business_unit text;

alter table public.candidates
add column if not exists profile_visibility text not null default 'all';

alter table public.candidates
drop constraint if exists candidates_profile_visibility_check;

alter table public.candidates
add constraint candidates_profile_visibility_check
check (profile_visibility in ('all', 'business_unit'));

create index if not exists candidates_business_unit_idx on public.candidates (business_unit);
create index if not exists candidates_profile_visibility_idx on public.candidates (profile_visibility);

update public.candidates
set
  business_unit = nullif(profile->>'organization', ''),
  profile_visibility = coalesce(nullif(profile->>'visibility', ''), 'all')
where business_unit is null
   or profile_visibility is null;

alter table public.app_members
add column if not exists business_unit text;

create index if not exists app_members_business_unit_idx on public.app_members (business_unit);

update public.app_members
set business_unit = nullif(profile->>'businessUnit', '')
where business_unit is null;
