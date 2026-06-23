create extension if not exists btree_gist;

create sequence if not exists scheduling_case_code_seq;

create or replace function next_scheduling_case_code()
returns text
language sql
as $$
  select 'INT-' || to_char(now() at time zone 'Asia/Seoul', 'YYYY') || '-' || lpad(nextval('scheduling_case_code_seq')::text, 4, '0');
$$;

create table if not exists public.scheduling_cases (
  id text primary key,
  case_code text not null unique default next_scheduling_case_code(),
  candidate_name text not null default '',
  candidate_email text not null default '',
  position_name text not null default '',
  interview_stage text not null default '',
  duration_minutes integer not null default 60,
  slot_interval_minutes integer not null default 30,
  timezone text not null default 'Asia/Seoul',
  scheduling_window_start timestamptz,
  scheduling_window_end timestamptz,
  candidate_reply_deadline timestamptz,
  interviewer_reply_deadline timestamptz,
  meeting_method text not null default '',
  meeting_details text not null default '',
  status text not null default 'CREATED',
  assigned_user_id text,
  internal_note text not null default '',
  confirmed_start_at timestamptz,
  confirmed_end_at timestamptz,
  version integer not null default 1,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  constraint scheduling_cases_status_check check (status in (
    'CREATED',
    'COLLECTING_AVAILABILITY',
    'CLARIFICATION_REQUIRED',
    'NO_COMMON_SLOT',
    'READY_TO_PROPOSE',
    'OPTIONS_SENT',
    'CONFIRMING',
    'CONFIRMED',
    'MANUAL_REVIEW',
    'RESCHEDULE_REQUESTED',
    'EXPIRED',
    'CANCELLED'
  )),
  constraint scheduling_cases_duration_check check (duration_minutes > 0),
  constraint scheduling_cases_interval_check check (slot_interval_minutes > 0)
);

create table if not exists public.scheduling_participants (
  id text primary key,
  scheduling_case_id text not null references public.scheduling_cases(id) on delete cascade,
  role text not null,
  name text not null default '',
  email text not null default '',
  required boolean not null default true,
  response_status text not null default 'PENDING',
  last_responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scheduling_participants_role_check check (role in ('CANDIDATE', 'INTERVIEWER'))
);

create table if not exists public.scheduling_threads (
  id text primary key,
  scheduling_case_id text not null references public.scheduling_cases(id) on delete cascade,
  participant_id text not null references public.scheduling_participants(id) on delete cascade,
  gmail_account_id text,
  gmail_thread_id text,
  initial_message_id text,
  latest_message_id text,
  subject text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scheduling_availability_windows (
  id text primary key,
  scheduling_case_id text not null references public.scheduling_cases(id) on delete cascade,
  participant_id text not null references public.scheduling_participants(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'Asia/Seoul',
  source_message_id text,
  version integer not null default 1,
  active boolean not null default true,
  extraction_confidence numeric(4,3),
  created_at timestamptz not null default now(),
  superseded_at timestamptz,
  constraint scheduling_availability_range_check check (start_at < end_at)
);

create table if not exists public.scheduling_slot_options (
  id text primary key,
  scheduling_case_id text not null references public.scheduling_cases(id) on delete cascade,
  option_code text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'AVAILABLE',
  expires_at timestamptz,
  sent_at timestamptz,
  selected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scheduling_case_id, option_code),
  constraint scheduling_slot_options_status_check check (status in ('AVAILABLE', 'HELD', 'SELECTED', 'RELEASED', 'EXPIRED')),
  constraint scheduling_slot_options_range_check check (start_at < end_at)
);

create table if not exists public.scheduling_slot_reservations (
  id text primary key,
  scheduling_case_id text not null references public.scheduling_cases(id) on delete cascade,
  participant_id text,
  participant_email text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'SOFT_HOLD',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scheduling_slot_reservations_status_check check (status in ('SOFT_HOLD', 'CONFIRMED', 'RELEASED', 'EXPIRED')),
  constraint scheduling_slot_reservations_range_check check (start_at < end_at)
);

alter table public.scheduling_slot_reservations
drop constraint if exists scheduling_slot_reservations_no_overlap;

alter table public.scheduling_slot_reservations
add constraint scheduling_slot_reservations_no_overlap
exclude using gist (
  participant_email with =,
  tstzrange(start_at, end_at, '[)') with &&
)
where (status in ('SOFT_HOLD', 'CONFIRMED'));

create table if not exists public.scheduling_inbound_messages (
  id text primary key,
  gmail_message_id text not null unique,
  gmail_thread_id text,
  scheduling_case_id text references public.scheduling_cases(id) on delete set null,
  participant_id text references public.scheduling_participants(id) on delete set null,
  from_address text not null default '',
  subject text not null default '',
  received_at timestamptz,
  normalized_body text not null default '',
  body_hash text not null default '',
  processing_status text not null default 'PENDING',
  parsed_intent text,
  parsing_result jsonb not null default '{}'::jsonb,
  confidence numeric(4,3),
  error_code text,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.scheduling_email_outbox (
  id text primary key,
  scheduling_case_id text references public.scheduling_cases(id) on delete cascade,
  participant_id text references public.scheduling_participants(id) on delete set null,
  type text not null default '',
  recipient text not null default '',
  subject text not null default '',
  body text not null default '',
  gmail_thread_id text,
  in_reply_to_message_id text,
  idempotency_key text not null unique,
  status text not null default 'PENDING',
  attempt_count integer not null default 0,
  next_attempt_at timestamptz,
  gmail_message_id text,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scheduling_email_outbox_status_check check (status in ('PENDING', 'SENDING', 'SENT', 'FAILED'))
);

create table if not exists public.gmail_connections (
  id text primary key,
  user_id text not null,
  gmail_address text not null default '',
  encrypted_refresh_token text not null default '',
  granted_scopes text[] not null default '{}',
  history_id text,
  watch_expiration_at timestamptz,
  last_watch_renewed_at timestamptz,
  last_synced_at timestamptz,
  status text not null default 'DISCONNECTED',
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.scheduling_audit_logs (
  id text primary key,
  scheduling_case_id text references public.scheduling_cases(id) on delete cascade,
  actor_user_id text,
  actor_name text not null default '',
  actor_type text not null default 'SYSTEM',
  event_type text not null,
  event_summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists scheduling_cases_status_idx
on public.scheduling_cases (status, updated_at desc);

create index if not exists scheduling_cases_assigned_user_idx
on public.scheduling_cases (assigned_user_id, updated_at desc);

create index if not exists scheduling_participants_case_idx
on public.scheduling_participants (scheduling_case_id, role);

create index if not exists scheduling_threads_case_idx
on public.scheduling_threads (scheduling_case_id, participant_id);

create index if not exists scheduling_availability_case_idx
on public.scheduling_availability_windows (scheduling_case_id, participant_id, active);

create index if not exists scheduling_slot_options_case_idx
on public.scheduling_slot_options (scheduling_case_id, status);

create index if not exists scheduling_inbound_messages_case_idx
on public.scheduling_inbound_messages (scheduling_case_id, received_at desc);

create index if not exists scheduling_email_outbox_status_idx
on public.scheduling_email_outbox (status, next_attempt_at, created_at);

create index if not exists scheduling_audit_logs_case_idx
on public.scheduling_audit_logs (scheduling_case_id, created_at desc);

alter table public.scheduling_cases enable row level security;
alter table public.scheduling_participants enable row level security;
alter table public.scheduling_threads enable row level security;
alter table public.scheduling_availability_windows enable row level security;
alter table public.scheduling_slot_options enable row level security;
alter table public.scheduling_slot_reservations enable row level security;
alter table public.scheduling_inbound_messages enable row level security;
alter table public.scheduling_email_outbox enable row level security;
alter table public.gmail_connections enable row level security;
alter table public.scheduling_audit_logs enable row level security;

drop policy if exists "demo scheduling cases read" on public.scheduling_cases;
drop policy if exists "demo scheduling cases write" on public.scheduling_cases;
drop policy if exists "demo scheduling participants read" on public.scheduling_participants;
drop policy if exists "demo scheduling participants write" on public.scheduling_participants;
drop policy if exists "demo scheduling threads read" on public.scheduling_threads;
drop policy if exists "demo scheduling threads write" on public.scheduling_threads;
drop policy if exists "demo scheduling availability read" on public.scheduling_availability_windows;
drop policy if exists "demo scheduling availability write" on public.scheduling_availability_windows;
drop policy if exists "demo scheduling options read" on public.scheduling_slot_options;
drop policy if exists "demo scheduling options write" on public.scheduling_slot_options;
drop policy if exists "demo scheduling reservations read" on public.scheduling_slot_reservations;
drop policy if exists "demo scheduling reservations write" on public.scheduling_slot_reservations;
drop policy if exists "demo scheduling inbound read" on public.scheduling_inbound_messages;
drop policy if exists "demo scheduling inbound write" on public.scheduling_inbound_messages;
drop policy if exists "demo scheduling outbox read" on public.scheduling_email_outbox;
drop policy if exists "demo scheduling outbox write" on public.scheduling_email_outbox;
drop policy if exists "demo gmail connections read" on public.gmail_connections;
drop policy if exists "demo gmail connections write" on public.gmail_connections;
drop policy if exists "demo scheduling audit read" on public.scheduling_audit_logs;
drop policy if exists "demo scheduling audit write" on public.scheduling_audit_logs;

create policy "demo scheduling cases read" on public.scheduling_cases for select to anon, authenticated using (true);
create policy "demo scheduling cases write" on public.scheduling_cases for all to anon, authenticated using (true) with check (true);
create policy "demo scheduling participants read" on public.scheduling_participants for select to anon, authenticated using (true);
create policy "demo scheduling participants write" on public.scheduling_participants for all to anon, authenticated using (true) with check (true);
create policy "demo scheduling threads read" on public.scheduling_threads for select to anon, authenticated using (true);
create policy "demo scheduling threads write" on public.scheduling_threads for all to anon, authenticated using (true) with check (true);
create policy "demo scheduling availability read" on public.scheduling_availability_windows for select to anon, authenticated using (true);
create policy "demo scheduling availability write" on public.scheduling_availability_windows for all to anon, authenticated using (true) with check (true);
create policy "demo scheduling options read" on public.scheduling_slot_options for select to anon, authenticated using (true);
create policy "demo scheduling options write" on public.scheduling_slot_options for all to anon, authenticated using (true) with check (true);
create policy "demo scheduling reservations read" on public.scheduling_slot_reservations for select to anon, authenticated using (true);
create policy "demo scheduling reservations write" on public.scheduling_slot_reservations for all to anon, authenticated using (true) with check (true);
create policy "demo scheduling inbound read" on public.scheduling_inbound_messages for select to anon, authenticated using (true);
create policy "demo scheduling inbound write" on public.scheduling_inbound_messages for all to anon, authenticated using (true) with check (true);
create policy "demo scheduling outbox read" on public.scheduling_email_outbox for select to anon, authenticated using (true);
create policy "demo scheduling outbox write" on public.scheduling_email_outbox for all to anon, authenticated using (true) with check (true);
create policy "demo gmail connections read" on public.gmail_connections for select to anon, authenticated using (true);
create policy "demo gmail connections write" on public.gmail_connections for all to anon, authenticated using (true) with check (true);
create policy "demo scheduling audit read" on public.scheduling_audit_logs for select to anon, authenticated using (true);
create policy "demo scheduling audit write" on public.scheduling_audit_logs for all to anon, authenticated using (true) with check (true);

insert into public.app_settings (setting_key, payload, updated_at)
values (
  'interview_scheduling_cases',
  '{"cases":[],"selectedSchedulingCaseId":"","filters":{"query":"","status":"all","owner":"all","sortBy":"updatedAt"},"gmailConnection":{"connected":false,"mode":"mock"},"updatedAt":"","updatedBy":"migration"}'::jsonb,
  now()
)
on conflict (setting_key) do nothing;
