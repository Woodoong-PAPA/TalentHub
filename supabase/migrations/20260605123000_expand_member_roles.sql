alter table public.app_members
drop constraint if exists app_members_role_check;

alter table public.app_role_permissions
drop constraint if exists app_role_permissions_role_check;

alter table public.app_members
alter column role set default 'general';

update public.app_members
set
  role = case role
    when 'associate' then 'general'
    when 'regular' then 'business_recruiter'
    when 'operator' then 'division_recruiter'
    else role
  end,
  profile = coalesce(profile, '{}'::jsonb) || jsonb_build_object(
    'role',
    case role
      when 'associate' then 'general'
      when 'regular' then 'business_recruiter'
      when 'operator' then 'division_recruiter'
      else role
    end
  )
where role in ('associate', 'regular', 'operator');

insert into public.app_role_permissions (role, view, enabled, updated_at)
select
  case role
    when 'associate' then 'general'
    when 'regular' then 'business_recruiter'
    when 'operator' then 'division_recruiter'
  end as role,
  view,
  enabled,
  now()
from public.app_role_permissions
where role in ('associate', 'regular', 'operator')
on conflict (role, view) do update set
  enabled = excluded.enabled,
  updated_at = now();

delete from public.app_role_permissions
where role in ('associate', 'regular', 'operator');

insert into public.app_role_permissions (role, view, enabled, updated_at)
values
  ('general', 'dashboard', true, now()),
  ('general', 'pool', true, now()),
  ('general', 'trending', true, now()),
  ('search_firm', 'dashboard', true, now()),
  ('search_firm', 'pool', true, now()),
  ('search_firm', 'register', true, now()),
  ('search_firm', 'ai-search', true, now()),
  ('hiring_manager', 'dashboard', true, now()),
  ('hiring_manager', 'pool', true, now()),
  ('hiring_manager', 'ai-search', true, now()),
  ('hiring_manager', 'trending', true, now()),
  ('business_recruiter', 'dashboard', true, now()),
  ('business_recruiter', 'pool', true, now()),
  ('business_recruiter', 'register', true, now()),
  ('business_recruiter', 'ai-search', true, now()),
  ('business_recruiter', 'trending', true, now()),
  ('division_recruiter', 'dashboard', true, now()),
  ('division_recruiter', 'pool', true, now()),
  ('division_recruiter', 'register', true, now()),
  ('division_recruiter', 'ai-search', true, now()),
  ('division_recruiter', 'trending', true, now()),
  ('division_recruiter', 'audit', true, now()),
  ('admin', 'dashboard', true, now()),
  ('admin', 'pool', true, now()),
  ('admin', 'register', true, now()),
  ('admin', 'ai-search', true, now()),
  ('admin', 'trending', true, now()),
  ('admin', 'audit', true, now()),
  ('admin', 'members', true, now())
on conflict (role, view) do nothing;

alter table public.app_members
add constraint app_members_role_check
check (role in ('general', 'search_firm', 'hiring_manager', 'business_recruiter', 'division_recruiter', 'admin'));

alter table public.app_role_permissions
add constraint app_role_permissions_role_check
check (role in ('general', 'search_firm', 'hiring_manager', 'business_recruiter', 'division_recruiter', 'admin'));
