alter table public.app_members
add column if not exists password_hash text;

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
