alter table public.trending_mail_settings
  alter column subject_prefix set default '[TalentHub] Today''s Talent';

update public.trending_mail_settings
set
  subject_prefix = '[TalentHub] Today''s Talent',
  payload = coalesce(payload, '{}'::jsonb) || jsonb_build_object('subjectPrefix', '[TalentHub] Today''s Talent'),
  updated_at = now()
where id = 'default'
  and (
    subject_prefix = '[TalentHub] 오늘의 화제 인물'
    or payload->>'subjectPrefix' = '[TalentHub] 오늘의 화제 인물'
  );
