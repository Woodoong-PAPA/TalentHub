create table if not exists public.screening_folders (
  id text primary key,
  title text not null,
  business_unit text,
  created_by_id text,
  created_by_name text,
  updated_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists screening_folders_business_unit_idx
on public.screening_folders (business_unit, updated_at desc);

create index if not exists screening_folders_created_by_idx
on public.screening_folders (created_by_id, updated_at desc);

create index if not exists screening_folders_payload_gin_idx
on public.screening_folders using gin (payload);

alter table public.screening_folders enable row level security;

drop policy if exists "demo screening folders read" on public.screening_folders;
drop policy if exists "demo screening folders write" on public.screening_folders;

create policy "demo screening folders read"
on public.screening_folders
for select
to anon, authenticated
using (true);

create policy "demo screening folders write"
on public.screening_folders
for all
to anon, authenticated
using (true)
with check (true);

alter table public.app_role_permissions
drop constraint if exists app_role_permissions_view_check;

alter table public.app_role_permissions
add constraint app_role_permissions_view_check
check (view in ('dashboard', 'pool', 'screening', 'interview', 'register', 'ai-search', 'job-fit', 'policy-chat', 'trending', 'audit', 'members'));

insert into public.app_role_permissions (role, view, enabled)
values
  ('applicant', 'interview', true),
  ('hiring_manager', 'interview', true),
  ('business_recruiter', 'interview', true),
  ('division_recruiter', 'interview', true),
  ('admin', 'interview', true)
on conflict (role, view) do update set
  enabled = excluded.enabled,
  updated_at = now();
