alter table public.app_role_permissions
drop constraint if exists app_role_permissions_view_check;

alter table public.app_role_permissions
add constraint app_role_permissions_view_check
check (view in ('dashboard', 'pool', 'register', 'ai-search', 'trending', 'audit', 'members'));

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

create index if not exists trending_people_generated_at_idx
on public.trending_people_reports (generated_at desc);

create index if not exists trending_people_people_gin_idx
on public.trending_people_reports using gin (people);

alter table public.trending_people_reports enable row level security;

drop policy if exists "demo trending people read" on public.trending_people_reports;
drop policy if exists "demo trending people write" on public.trending_people_reports;

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

insert into public.app_role_permissions (role, view, enabled)
values
  ('associate', 'trending', true),
  ('regular', 'trending', true),
  ('operator', 'trending', true),
  ('admin', 'trending', true)
on conflict (role, view) do update set
  enabled = excluded.enabled,
  updated_at = now();
