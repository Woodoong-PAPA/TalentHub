create table if not exists public.trending_search_settings (
  id text primary key default 'default' check (id = 'default'),
  prompt text not null default 'AI, 로보틱스, 모바일, TV, 생활가전 등 삼성전자 DX부문 주요 사업분야 중심. DS/반도체 분야는 제외.',
  keywords jsonb not null default '["AI","인공지능","로보틱스","로봇","모바일","스마트폰","TV","생활가전","가전"]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text,
  payload jsonb not null default '{}'::jsonb
);

alter table public.trending_search_settings enable row level security;

drop policy if exists "demo trending search settings read" on public.trending_search_settings;
drop policy if exists "demo trending search settings write" on public.trending_search_settings;

create policy "demo trending search settings read"
on public.trending_search_settings
for select
to anon, authenticated
using (true);

create policy "demo trending search settings write"
on public.trending_search_settings
for all
to anon, authenticated
using (true)
with check (true);

insert into public.trending_search_settings (
  id,
  prompt,
  keywords,
  payload
)
values (
  'default',
  'AI, 로보틱스, 모바일, TV, 생활가전 등 삼성전자 DX부문 주요 사업분야 중심. DS/반도체 분야는 제외.',
  '["AI","인공지능","로보틱스","로봇","모바일","스마트폰","TV","생활가전","가전"]'::jsonb,
  jsonb_build_object(
    'prompt', 'AI, 로보틱스, 모바일, TV, 생활가전 등 삼성전자 DX부문 주요 사업분야 중심. DS/반도체 분야는 제외.',
    'keywords', jsonb_build_array('AI','인공지능','로보틱스','로봇','모바일','스마트폰','TV','생활가전','가전')
  )
)
on conflict (id) do nothing;
