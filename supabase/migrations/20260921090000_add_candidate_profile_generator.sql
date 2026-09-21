create table if not exists public.candidate_master_profiles (
  id text primary key,
  name text not null,
  headline text,
  location text,
  photo_url text,
  linkedin_url text,
  current_company text,
  current_position text,
  candidate_type text not null default 'OTHER',
  identity_status text not null default 'LIKELY',
  research_status text not null default 'READY',
  research_purpose text,
  target_position text,
  summary text,
  last_researched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  constraint candidate_master_identity_status_check check (identity_status in ('VERIFIED', 'LIKELY', 'AMBIGUOUS')),
  constraint candidate_master_type_check check (candidate_type in ('RESEARCHER', 'ENGINEER', 'EXECUTIVE', 'INVESTOR', 'ENTREPRENEUR', 'OTHER'))
);

create unique index if not exists candidate_master_linkedin_unique_idx
on public.candidate_master_profiles (linkedin_url)
where linkedin_url is not null and linkedin_url <> '';

create index if not exists candidate_master_updated_idx
on public.candidate_master_profiles (updated_at desc);

create table if not exists public.candidate_profile_education (
  id text primary key,
  candidate_id text not null references public.candidate_master_profiles(id) on delete cascade,
  school text,
  degree text,
  major text,
  start_year text,
  end_year text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidate_profile_experience (
  id text primary key,
  candidate_id text not null references public.candidate_master_profiles(id) on delete cascade,
  company text,
  position text,
  start_date text,
  end_date text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidate_profile_sources (
  id text primary key,
  candidate_id text not null references public.candidate_master_profiles(id) on delete cascade,
  title text not null,
  publisher text,
  url text not null,
  source_type text,
  source_tier integer not null default 3,
  published_at date,
  accessed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint candidate_source_tier_check check (source_tier between 1 and 3)
);

create table if not exists public.candidate_profile_facts (
  id text primary key,
  candidate_id text not null references public.candidate_master_profiles(id) on delete cascade,
  source_id text references public.candidate_profile_sources(id) on delete set null,
  category text not null,
  claim text not null,
  value text not null,
  fact_type text not null default 'FACT',
  confidence text not null default 'UNVERIFIED',
  verification_status text not null default 'UNVERIFIED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_fact_type_check check (fact_type in ('FACT', 'AI_INTERPRETATION', 'INTERNAL_NOTE')),
  constraint candidate_fact_confidence_check check (confidence in ('HIGH', 'MEDIUM', 'UNVERIFIED')),
  constraint candidate_fact_verification_check check (verification_status in ('VERIFIED', 'LIKELY', 'AMBIGUOUS', 'UNVERIFIED', 'INCORRECT'))
);

create table if not exists public.candidate_profile_expertise (
  id text primary key,
  candidate_id text not null references public.candidate_master_profiles(id) on delete cascade,
  label text not null,
  fact_id text references public.candidate_profile_facts(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.candidate_profile_achievements (
  id text primary key,
  candidate_id text not null references public.candidate_master_profiles(id) on delete cascade,
  achievement_type text not null,
  title text not null,
  description text,
  fact_id text references public.candidate_profile_facts(id) on delete set null,
  occurred_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidate_research_runs (
  id text primary key,
  candidate_id text references public.candidate_master_profiles(id) on delete set null,
  linkedin_url text,
  research_mode text not null default 'deep',
  status text not null default 'PENDING',
  progress integer not null default 0,
  current_step text,
  requested_by text,
  error_message text,
  provider_metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_research_progress_check check (progress between 0 and 100)
);

create table if not exists public.candidate_internal_notes (
  id text primary key,
  candidate_id text not null references public.candidate_master_profiles(id) on delete cascade,
  note text not null,
  author_id text,
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidate_report_templates (
  id text primary key,
  name text not null,
  report_type text not null,
  description text,
  configuration jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_report_type_check check (report_type in ('basic', 'interview', 'multi'))
);

create table if not exists public.candidate_reports (
  id text primary key,
  template_id text references public.candidate_report_templates(id) on delete set null,
  report_type text not null,
  title text not null,
  status text not null default 'DRAFT',
  content jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_reports_type_check check (report_type in ('basic', 'interview', 'multi'))
);

create table if not exists public.candidate_report_candidates (
  report_id text not null references public.candidate_reports(id) on delete cascade,
  candidate_id text not null references public.candidate_master_profiles(id) on delete cascade,
  sort_order integer not null default 0,
  category_tag text,
  primary key (report_id, candidate_id)
);

create index if not exists candidate_education_candidate_idx on public.candidate_profile_education (candidate_id, sort_order);
create index if not exists candidate_experience_candidate_idx on public.candidate_profile_experience (candidate_id, sort_order);
create index if not exists candidate_sources_candidate_idx on public.candidate_profile_sources (candidate_id, source_tier);
create index if not exists candidate_facts_candidate_idx on public.candidate_profile_facts (candidate_id, category, verification_status);
create index if not exists candidate_expertise_candidate_idx on public.candidate_profile_expertise (candidate_id, sort_order);
create index if not exists candidate_achievements_candidate_idx on public.candidate_profile_achievements (candidate_id, occurred_at desc);
create index if not exists candidate_research_runs_candidate_idx on public.candidate_research_runs (candidate_id, created_at desc);
create index if not exists candidate_internal_notes_candidate_idx on public.candidate_internal_notes (candidate_id, created_at desc);
create index if not exists candidate_reports_updated_idx on public.candidate_reports (updated_at desc);

alter table public.candidate_master_profiles enable row level security;
alter table public.candidate_profile_education enable row level security;
alter table public.candidate_profile_experience enable row level security;
alter table public.candidate_profile_sources enable row level security;
alter table public.candidate_profile_facts enable row level security;
alter table public.candidate_profile_expertise enable row level security;
alter table public.candidate_profile_achievements enable row level security;
alter table public.candidate_research_runs enable row level security;
alter table public.candidate_internal_notes enable row level security;
alter table public.candidate_report_templates enable row level security;
alter table public.candidate_reports enable row level security;
alter table public.candidate_report_candidates enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'candidate_master_profiles',
    'candidate_profile_education',
    'candidate_profile_experience',
    'candidate_profile_sources',
    'candidate_profile_facts',
    'candidate_profile_expertise',
    'candidate_profile_achievements',
    'candidate_research_runs',
    'candidate_internal_notes',
    'candidate_report_templates',
    'candidate_reports',
    'candidate_report_candidates'
  ] loop
    execute format('drop policy if exists "demo %s read" on public.%I', table_name, table_name);
    execute format('drop policy if exists "demo %s write" on public.%I', table_name, table_name);
    execute format('create policy "demo %s read" on public.%I for select to anon, authenticated using (true)', table_name, table_name);
    execute format('create policy "demo %s write" on public.%I for all to anon, authenticated using (true) with check (true)', table_name, table_name);
  end loop;
end $$;

alter table public.app_role_permissions
drop constraint if exists app_role_permissions_view_check;

alter table public.app_role_permissions
add constraint app_role_permissions_view_check
check (view in (
  'dashboard',
  'profile-generator',
  'pool',
  'screening',
  'interview',
  'interview-report',
  'recruiting-metrics',
  'register',
  'ai-search',
  'job-fit',
  'jd-enhance',
  'policy-chat',
  'interpreter',
  'trending',
  'audit',
  'members'
));

insert into public.app_role_permissions (role, view, enabled)
values
  ('general', 'profile-generator', true),
  ('search_firm', 'profile-generator', true),
  ('hiring_manager', 'profile-generator', true),
  ('business_recruiter', 'profile-generator', true),
  ('division_recruiter', 'profile-generator', true),
  ('admin', 'profile-generator', true)
on conflict (role, view) do update set enabled = excluded.enabled, updated_at = now();

insert into public.candidate_report_templates (id, name, report_type, description, configuration)
values
  ('basic', '기본 프로필', 'basic', '일반 후보 검토용 1인 1페이지 보고서', '{"page":"A4","tone":"fact-heavy"}'::jsonb),
  ('interview', '인터뷰 프로필', 'interview', '경영진 면담 준비용 Executive Message 보고서', '{"page":"A4","talking_points":3}'::jsonb),
  ('multi', '복수 후보자 요약', 'multi', '3~5명 후보자 비교용 1페이지 보고서', '{"page":"A4","candidate_count_max":5}'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  configuration = excluded.configuration,
  updated_at = now();
