alter table public.app_members
drop constraint if exists app_members_role_check;

alter table public.app_members
add constraint app_members_role_check
check (role in ('applicant', 'general', 'search_firm', 'hiring_manager', 'business_recruiter', 'division_recruiter', 'admin'));

alter table public.app_role_permissions
drop constraint if exists app_role_permissions_role_check;

alter table public.app_role_permissions
add constraint app_role_permissions_role_check
check (role in ('applicant', 'general', 'search_firm', 'hiring_manager', 'business_recruiter', 'division_recruiter', 'admin'));

alter table public.app_role_permissions
drop constraint if exists app_role_permissions_view_check;

alter table public.app_role_permissions
add constraint app_role_permissions_view_check
check (view in ('dashboard', 'pool', 'screening', 'register', 'ai-search', 'job-fit', 'policy-chat', 'trending', 'audit', 'members'));

create table if not exists public.job_fit_analyses (
  id text primary key,
  owner_id text,
  owner_email text,
  title text not null,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists job_fit_analyses_owner_id_idx
on public.job_fit_analyses (owner_id, created_at desc);

create index if not exists job_fit_analyses_owner_email_idx
on public.job_fit_analyses (owner_email, created_at desc);

create index if not exists job_fit_analyses_payload_gin_idx
on public.job_fit_analyses using gin (payload);

alter table public.job_fit_analyses enable row level security;

drop policy if exists "demo job fit analyses read" on public.job_fit_analyses;
drop policy if exists "demo job fit analyses write" on public.job_fit_analyses;

create policy "demo job fit analyses read"
on public.job_fit_analyses
for select
to anon, authenticated
using (true);

create policy "demo job fit analyses write"
on public.job_fit_analyses
for all
to anon, authenticated
using (true)
with check (true);

insert into public.app_role_permissions (role, view, enabled)
values
  ('applicant', 'screening', true),
  ('hiring_manager', 'job-fit', true),
  ('business_recruiter', 'job-fit', true),
  ('division_recruiter', 'job-fit', true),
  ('admin', 'job-fit', true)
on conflict (role, view) do update set
  enabled = excluded.enabled,
  updated_at = now();
