create table if not exists public.competitor_companies (
  id text primary key,
  name text not null,
  website text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists competitor_companies_name_idx
on public.competitor_companies (name);

create index if not exists competitor_companies_updated_at_idx
on public.competitor_companies (updated_at desc);

create table if not exists public.competitor_employees (
  id text primary key,
  company_id text not null references public.competitor_companies(id) on delete cascade,
  name text not null,
  title text,
  location text,
  linkedin_url text,
  education jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  summary text,
  department_ai text,
  seniority_ai text,
  talent_score integer not null default 0,
  is_key_talent boolean not null default false,
  raw_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists competitor_employees_company_idx
on public.competitor_employees (company_id, talent_score desc);

create index if not exists competitor_employees_department_idx
on public.competitor_employees (company_id, department_ai);

create index if not exists competitor_employees_seniority_idx
on public.competitor_employees (company_id, seniority_ai);

create index if not exists competitor_employees_key_talent_idx
on public.competitor_employees (company_id, is_key_talent, talent_score desc);

create index if not exists competitor_employees_linkedin_idx
on public.competitor_employees (linkedin_url);

create index if not exists competitor_employees_raw_gin_idx
on public.competitor_employees using gin (raw_data);

create table if not exists public.competitor_org_reports (
  id text primary key,
  company_id text not null references public.competitor_companies(id) on delete cascade,
  title text not null,
  summary text,
  department_summary jsonb not null default '[]'::jsonb,
  key_talent_summary jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists competitor_org_reports_company_idx
on public.competitor_org_reports (company_id, generated_at desc);

create index if not exists competitor_org_reports_payload_gin_idx
on public.competitor_org_reports using gin (payload);

alter table public.competitor_companies enable row level security;
alter table public.competitor_employees enable row level security;
alter table public.competitor_org_reports enable row level security;

drop policy if exists "demo competitor companies read" on public.competitor_companies;
drop policy if exists "demo competitor companies write" on public.competitor_companies;
drop policy if exists "demo competitor employees read" on public.competitor_employees;
drop policy if exists "demo competitor employees write" on public.competitor_employees;
drop policy if exists "demo competitor org reports read" on public.competitor_org_reports;
drop policy if exists "demo competitor org reports write" on public.competitor_org_reports;

create policy "demo competitor companies read"
on public.competitor_companies
for select
to anon, authenticated
using (true);

create policy "demo competitor companies write"
on public.competitor_companies
for all
to anon, authenticated
using (true)
with check (true);

create policy "demo competitor employees read"
on public.competitor_employees
for select
to anon, authenticated
using (true);

create policy "demo competitor employees write"
on public.competitor_employees
for all
to anon, authenticated
using (true)
with check (true);

create policy "demo competitor org reports read"
on public.competitor_org_reports
for select
to anon, authenticated
using (true);

create policy "demo competitor org reports write"
on public.competitor_org_reports
for all
to anon, authenticated
using (true)
with check (true);
