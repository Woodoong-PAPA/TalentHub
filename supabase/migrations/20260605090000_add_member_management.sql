create table if not exists public.app_members (
  id text primary key,
  auth_user_id uuid,
  email text not null unique,
  name text not null,
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

alter table public.app_members enable row level security;
alter table public.app_role_permissions enable row level security;

drop policy if exists "demo app members read" on public.app_members;
drop policy if exists "demo app members write" on public.app_members;
drop policy if exists "demo role permissions read" on public.app_role_permissions;
drop policy if exists "demo role permissions write" on public.app_role_permissions;

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
