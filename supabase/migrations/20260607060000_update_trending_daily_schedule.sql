alter table public.trending_mail_settings
  alter column send_time set default '07:00';

update public.trending_mail_settings
set
  send_time = '07:00',
  payload = jsonb_set(coalesce(payload, '{}'::jsonb), '{sendTime}', '"07:00"', true),
  updated_at = now()
where id = 'default'
  and coalesce(send_time, '07:30') = '07:30';
