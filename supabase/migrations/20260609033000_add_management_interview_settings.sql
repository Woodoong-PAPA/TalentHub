alter table public.app_role_permissions
drop constraint if exists app_role_permissions_view_check;

alter table public.app_role_permissions
add constraint app_role_permissions_view_check
check (view in (
  'dashboard',
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
  'trending',
  'audit',
  'members'
));

insert into public.app_role_permissions (role, view, enabled, updated_at)
values
  ('hiring_manager', 'interview-report', true, now()),
  ('business_recruiter', 'interview-report', true, now()),
  ('business_recruiter', 'recruiting-metrics', true, now()),
  ('division_recruiter', 'interview-report', true, now()),
  ('division_recruiter', 'recruiting-metrics', true, now()),
  ('admin', 'interview-report', true, now()),
  ('admin', 'recruiting-metrics', true, now())
on conflict (role, view) do update
set updated_at = excluded.updated_at;

insert into public.app_settings (setting_key, payload, updated_at)
values
  (
    'role_permissions',
    '{
      "permissions": {
        "applicant": ["screening","interview"],
        "general": ["dashboard","pool","policy-chat","trending"],
        "search_firm": ["dashboard","pool","screening","ai-search","policy-chat"],
        "hiring_manager": ["dashboard","pool","screening","interview","interview-report","ai-search","job-fit","jd-enhance","policy-chat","trending"],
        "business_recruiter": ["dashboard","pool","screening","interview","interview-report","recruiting-metrics","ai-search","job-fit","jd-enhance","policy-chat","trending","members"],
        "division_recruiter": ["dashboard","pool","screening","interview","interview-report","recruiting-metrics","ai-search","job-fit","jd-enhance","policy-chat","trending","members"],
        "admin": ["dashboard","pool","screening","interview","interview-report","recruiting-metrics","ai-search","job-fit","jd-enhance","policy-chat","trending","members"]
      },
      "updatedAt": "",
      "updatedBy": "migration"
    }'::jsonb,
    now()
  ),
  (
    'interview_cases',
    '{"cases":[],"selectedInterviewCaseId":"","selectedInterviewStage":"phone","updatedAt":"","updatedBy":"migration"}'::jsonb,
    now()
  ),
  (
    'recruiting_metrics',
    '{"metrics":{},"updatedAt":"","updatedBy":"migration"}'::jsonb,
    now()
  )
on conflict (setting_key) do nothing;
