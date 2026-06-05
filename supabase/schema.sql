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
  view text not null check (view in ('dashboard', 'pool', 'register', 'ai-search', 'trending', 'audit', 'members')),
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (role, view)
);

create table if not exists public.trending_people_reports (
  report_date date primary key,
  target_date date not null,
  generated_at timestamptz not null default now(),
  topics text[] not null default '{}'::text[],
  excluded_names text[] not null default '{}'::text[],
  articles jsonb not null default '[]'::jsonb,
  people jsonb not null default '[]'::jsonb,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists trending_people_generated_at_idx on public.trending_people_reports (generated_at desc);
create index if not exists trending_people_people_gin_idx on public.trending_people_reports using gin (people);

create table if not exists public.trending_mail_settings (
  id text primary key default 'default' check (id = 'default'),
  enabled boolean not null default false,
  send_time text not null default '07:30'
    check (send_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  timezone text not null default 'Asia/Seoul',
  recipients jsonb not null default '[]'::jsonb,
  subject_prefix text not null default '[TalentHub] Today''s Talent',
  last_sent_report_date date,
  last_sent_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by text,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.trending_mail_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  report_date date,
  status text not null,
  message text,
  recipients jsonb not null default '[]'::jsonb,
  provider text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists trending_mail_events_created_at_idx on public.trending_mail_events (created_at desc);
create index if not exists trending_mail_events_report_date_idx on public.trending_mail_events (report_date desc);

alter table public.candidates enable row level security;
alter table public.audit_logs enable row level security;
alter table public.app_members enable row level security;
alter table public.app_role_permissions enable row level security;
alter table public.trending_people_reports enable row level security;
alter table public.trending_mail_settings enable row level security;
alter table public.trending_mail_events enable row level security;

drop policy if exists "demo candidates read" on public.candidates;
drop policy if exists "demo candidates write" on public.candidates;
drop policy if exists "demo audit logs read" on public.audit_logs;
drop policy if exists "demo audit logs write" on public.audit_logs;
drop policy if exists "demo app members read" on public.app_members;
drop policy if exists "demo app members write" on public.app_members;
drop policy if exists "demo role permissions read" on public.app_role_permissions;
drop policy if exists "demo role permissions write" on public.app_role_permissions;
drop policy if exists "demo trending people read" on public.trending_people_reports;
drop policy if exists "demo trending people write" on public.trending_people_reports;
drop policy if exists "demo trending mail settings read" on public.trending_mail_settings;
drop policy if exists "demo trending mail settings write" on public.trending_mail_settings;
drop policy if exists "demo trending mail events read" on public.trending_mail_events;
drop policy if exists "demo trending mail events write" on public.trending_mail_events;

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

create policy "demo trending people read"
on public.trending_people_reports
for select
to anon, authenticated
using (true);

create policy "demo trending people write"
on public.trending_people_reports
for all
to anon, authenticated
using (true)
with check (true);

create policy "demo trending mail settings read"
on public.trending_mail_settings
for select
to anon, authenticated
using (true);

create policy "demo trending mail settings write"
on public.trending_mail_settings
for all
to anon, authenticated
using (true)
with check (true);

create policy "demo trending mail events read"
on public.trending_mail_events
for select
to anon, authenticated
using (true);

create policy "demo trending mail events write"
on public.trending_mail_events
for all
to anon, authenticated
using (true)
with check (true);

insert into public.app_role_permissions (role, view, enabled)
values
  ('associate', 'dashboard', true),
  ('associate', 'pool', true),
  ('associate', 'ai-search', true),
  ('associate', 'trending', true),
  ('regular', 'dashboard', true),
  ('regular', 'pool', true),
  ('regular', 'register', true),
  ('regular', 'ai-search', true),
  ('regular', 'trending', true),
  ('operator', 'dashboard', true),
  ('operator', 'pool', true),
  ('operator', 'register', true),
  ('operator', 'ai-search', true),
  ('operator', 'trending', true),
  ('operator', 'audit', true),
  ('admin', 'dashboard', true),
  ('admin', 'pool', true),
  ('admin', 'register', true),
  ('admin', 'ai-search', true),
  ('admin', 'trending', true),
  ('admin', 'audit', true),
  ('admin', 'members', true)
on conflict (role, view) do update set
  enabled = excluded.enabled,
  updated_at = now();

insert into public.trending_mail_settings (
  id,
  enabled,
  send_time,
  timezone,
  recipients,
  subject_prefix,
  payload
)
values (
  'default',
  false,
  '07:30',
  'Asia/Seoul',
  '[]'::jsonb,
  '[TalentHub] Today''s Talent',
  jsonb_build_object(
    'enabled', false,
    'sendTime', '07:30',
    'timezone', 'Asia/Seoul',
    'recipients', jsonb_build_array(),
    'subjectPrefix', '[TalentHub] Today''s Talent'
  )
)
on conflict (id) do nothing;

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
