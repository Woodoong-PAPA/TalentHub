create extension if not exists pgcrypto;

create table if not exists public.candidates (
  id text primary key,
  name text not null,
  company text,
  role text,
  owner text,
  status text,
  updated_at timestamptz not null default now(),
  profile jsonb not null default '{}'::jsonb
);

create index if not exists candidates_owner_idx on public.candidates (owner);
create index if not exists candidates_status_idx on public.candidates (status);
create index if not exists candidates_name_idx on public.candidates (name);
create index if not exists candidates_profile_gin_idx on public.candidates using gin (profile);

create table if not exists public.audit_logs (
  id text primary key,
  created_at timestamptz not null default now(),
  actor text,
  action text,
  resource text,
  purpose text,
  time_text text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_actor_idx on public.audit_logs (actor);
create index if not exists audit_logs_action_idx on public.audit_logs (action);

create table if not exists public.app_members (
  id text primary key,
  auth_user_id uuid,
  email text not null unique,
  name text not null,
  password_hash text,
  role text not null default 'associate'
    check (role in ('associate', 'regular', 'operator', 'admin')),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'suspended', 'rejected')),
  department text,
  position text,
  phone text,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text,
  last_login_at timestamptz,
  note text,
  profile jsonb not null default '{}'::jsonb
);

create index if not exists app_members_email_idx on public.app_members (email);
create index if not exists app_members_role_idx on public.app_members (role);
create index if not exists app_members_status_idx on public.app_members (status);

create table if not exists public.app_role_permissions (
  role text not null check (role in ('associate', 'regular', 'operator', 'admin')),
  view text not null check (view in ('dashboard', 'pool', 'register', 'ai-search', 'audit', 'members')),
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (role, view)
);

alter table public.candidates enable row level security;
alter table public.audit_logs enable row level security;
alter table public.app_members enable row level security;
alter table public.app_role_permissions enable row level security;

drop policy if exists "demo candidates read" on public.candidates;
drop policy if exists "demo candidates write" on public.candidates;
drop policy if exists "demo audit logs read" on public.audit_logs;
drop policy if exists "demo audit logs write" on public.audit_logs;
drop policy if exists "demo app members read" on public.app_members;
drop policy if exists "demo app members write" on public.app_members;
drop policy if exists "demo role permissions read" on public.app_role_permissions;
drop policy if exists "demo role permissions write" on public.app_role_permissions;

create policy "demo candidates read"
on public.candidates
for select
to anon, authenticated
using (true);

create policy "demo candidates write"
on public.candidates
for all
to anon, authenticated
using (true)
with check (true);

create policy "demo audit logs read"
on public.audit_logs
for select
to anon, authenticated
using (true);

create policy "demo audit logs write"
on public.audit_logs
for all
to anon, authenticated
using (true)
with check (true);

create policy "demo app members read"
on public.app_members
for select
to anon, authenticated
using (true);

create policy "demo app members write"
on public.app_members
for all
to anon, authenticated
using (true)
with check (true);

create policy "demo role permissions read"
on public.app_role_permissions
for select
to anon, authenticated
using (true);

create policy "demo role permissions write"
on public.app_role_permissions
for all
to anon, authenticated
using (true)
with check (true);

insert into public.app_role_permissions (role, view, enabled)
values
  ('associate', 'dashboard', true),
  ('associate', 'pool', true),
  ('associate', 'ai-search', true),
  ('regular', 'dashboard', true),
  ('regular', 'pool', true),
  ('regular', 'register', true),
  ('regular', 'ai-search', true),
  ('operator', 'dashboard', true),
  ('operator', 'pool', true),
  ('operator', 'register', true),
  ('operator', 'ai-search', true),
  ('operator', 'audit', true),
  ('admin', 'dashboard', true),
  ('admin', 'pool', true),
  ('admin', 'register', true),
  ('admin', 'ai-search', true),
  ('admin', 'audit', true),
  ('admin', 'members', true)
on conflict (role, view) do update set
  enabled = excluded.enabled,
  updated_at = now();

insert into public.app_members (
  id,
  email,
  name,
  password_hash,
  role,
  status,
  department,
  position,
  requested_at,
  approved_at,
  approved_by,
  note,
  profile
)
values (
  'member-admin',
  'admin@samsung.com',
  '시스템 관리자',
  '5842a8aa177243bfa34305cfaceb69a124ad6ccee62ebd4bd149be39871eb160',
  'admin',
  'active',
  'People Team',
  'Talent Pool Owner',
  now(),
  now(),
  '시스템',
  '초기 관리자 계정',
  jsonb_build_object(
    'id', 'member-admin',
    'email', 'admin@samsung.com',
    'name', '시스템 관리자',
    'role', 'admin',
    'status', 'active',
    'department', 'People Team',
    'position', 'Talent Pool Owner',
    'requestedAt', to_char(now(), 'YYYY-MM-DD'),
    'approvedAt', to_char(now(), 'YYYY-MM-DD'),
    'approvedBy', '시스템',
    'note', '초기 관리자 계정'
  )
)
on conflict (email) do nothing;

insert into storage.buckets (id, name, public)
values ('candidate-assets', 'candidate-assets', false)
on conflict (id) do nothing;

drop policy if exists "demo candidate assets read" on storage.objects;
drop policy if exists "demo candidate assets write" on storage.objects;

create policy "demo candidate assets read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'candidate-assets');

create policy "demo candidate assets write"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'candidate-assets');
