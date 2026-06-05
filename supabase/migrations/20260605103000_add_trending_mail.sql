create table if not exists public.trending_mail_settings (
  id text primary key default 'default' check (id = 'default'),
  enabled boolean not null default false,
  send_time text not null default '07:30'
    check (send_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  timezone text not null default 'Asia/Seoul',
  recipients jsonb not null default '[]'::jsonb,
  subject_prefix text not null default '[TalentHub] 오늘의 화제 인물',
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

alter table public.trending_mail_settings enable row level security;
alter table public.trending_mail_events enable row level security;

drop policy if exists "demo trending mail settings read" on public.trending_mail_settings;
drop policy if exists "demo trending mail settings write" on public.trending_mail_settings;
drop policy if exists "demo trending mail events read" on public.trending_mail_events;
drop policy if exists "demo trending mail events write" on public.trending_mail_events;

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
  '[TalentHub] 오늘의 화제 인물',
  jsonb_build_object(
    'enabled', false,
    'sendTime', '07:30',
    'timezone', 'Asia/Seoul',
    'recipients', jsonb_build_array(),
    'subjectPrefix', '[TalentHub] 오늘의 화제 인물'
  )
)
on conflict (id) do nothing;
