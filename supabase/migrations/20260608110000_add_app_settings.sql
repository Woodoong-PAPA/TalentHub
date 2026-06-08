create table if not exists public.app_settings (
  setting_key text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

drop policy if exists "demo app settings read" on public.app_settings;
drop policy if exists "demo app settings write" on public.app_settings;

create policy "demo app settings read"
on public.app_settings
for select
to anon, authenticated
using (true);

create policy "demo app settings write"
on public.app_settings
for all
to anon, authenticated
using (true)
with check (true);

insert into public.app_settings (setting_key, payload, updated_at)
values (
  'menu_order',
  '{"menuOrder":["dashboard","pool","screening","interview","ai-search","job-fit","jd-enhance","policy-chat","trending","members"]}'::jsonb,
  now()
)
on conflict (setting_key) do nothing;
