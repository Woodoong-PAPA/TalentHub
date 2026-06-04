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

alter table public.candidates enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "demo candidates read" on public.candidates;
drop policy if exists "demo candidates write" on public.candidates;
drop policy if exists "demo audit logs read" on public.audit_logs;
drop policy if exists "demo audit logs write" on public.audit_logs;

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
