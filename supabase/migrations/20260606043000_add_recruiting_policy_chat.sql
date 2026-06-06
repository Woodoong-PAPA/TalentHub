alter table public.app_role_permissions
drop constraint if exists app_role_permissions_view_check;

alter table public.app_role_permissions
add constraint app_role_permissions_view_check
check (view in ('dashboard', 'pool', 'screening', 'register', 'ai-search', 'policy-chat', 'trending', 'audit', 'members'));

create table if not exists public.recruiting_policy_sources (
  id text primary key,
  title text not null,
  source_type text not null default 'manual'
    check (source_type in ('manual', 'file')),
  file_name text,
  file_type text,
  size_bytes integer,
  content text not null,
  created_by text,
  updated_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists recruiting_policy_sources_updated_at_idx
on public.recruiting_policy_sources (updated_at desc);

create index if not exists recruiting_policy_sources_title_idx
on public.recruiting_policy_sources (title);

create index if not exists recruiting_policy_sources_payload_gin_idx
on public.recruiting_policy_sources using gin (payload);

alter table public.recruiting_policy_sources enable row level security;

drop policy if exists "demo recruiting policy sources read" on public.recruiting_policy_sources;
drop policy if exists "demo recruiting policy sources write" on public.recruiting_policy_sources;

create policy "demo recruiting policy sources read"
on public.recruiting_policy_sources
for select
to anon, authenticated
using (true);

create policy "demo recruiting policy sources write"
on public.recruiting_policy_sources
for all
to anon, authenticated
using (true)
with check (true);

insert into public.app_role_permissions (role, view, enabled, updated_at)
values
  ('general', 'policy-chat', true, now()),
  ('search_firm', 'screening', true, now()),
  ('search_firm', 'policy-chat', true, now()),
  ('hiring_manager', 'screening', true, now()),
  ('hiring_manager', 'policy-chat', true, now()),
  ('business_recruiter', 'screening', true, now()),
  ('business_recruiter', 'policy-chat', true, now()),
  ('division_recruiter', 'screening', true, now()),
  ('division_recruiter', 'policy-chat', true, now()),
  ('admin', 'screening', true, now()),
  ('admin', 'policy-chat', true, now())
on conflict (role, view) do update set
  enabled = excluded.enabled,
  updated_at = now();
