"use strict";
const { createClient } = require('@supabase/supabase-js');
const { randomBytes } = require('node:crypto');
const OPTIONS = { auth: { persistSession: false, autoRefreshToken: false } };

function configuration(env, projectRef) {
  if (!/^[a-z]{20}$/.test(projectRef || '')) throw new Error('테스트 프로젝트 ref를 --project-ref로 지정해주세요.');
  const url = env.INTERVIEW_MGMT_SUPABASE_URL || env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || new URL(url).origin !== `https://${projectRef}.supabase.co` || new URL(url).pathname !== '/')
    throw new Error('지정한 테스트 프로젝트와 SUPABASE_URL이 일치하지 않습니다.');
  const anon = env.INTERVIEW_MGMT_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anon) throw new Error('SUPABASE_ANON_KEY 설정이 필요합니다.');
  const service = env.INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!service) throw new Error('INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY 또는 SUPABASE_SERVICE_ROLE_KEY를 로컬 .env에 설정해주세요. 키를 채팅에 보내지 마세요.');
  if (env.INTERVIEW_MGMT_MAIL_SEND_ENABLED === 'true') throw new Error('계정 준비 중에는 INTERVIEW_MGMT_MAIL_SEND_ENABLED=false로 설정해주세요.');
  return { url, anon, service };
}

async function setupAccount({ env = process.env, projectRef, email, create = false, clientFactory = createClient }) {
  const config = configuration(env, projectRef);
  const admin = clientFactory(config.url, config.service, OPTIONS);
  const current = await admin.from('interview_mgmt_users').select('id', { count: 'exact', head: true });
  if (current.error) throw new Error('신규 사용자 테이블 접근에 실패했습니다. 마이그레이션과 서버 키를 확인해주세요.');
  if (!Number.isInteger(current.count)) throw new Error('신규 계정 수를 확인하지 못했습니다.');
  if (!create) return { ready: true, initialized: current.count > 0, users: current.count };
  if (current.count > 0) throw new Error('신규 계정이 이미 있습니다. 기존 채용담당자로 로그인하여 사용자 관리에서 발급해주세요.');
  if (!/^[a-z0-9._+-]+@[a-z0-9.-]+\.test$/i.test(email || '')) throw new Error('실제 개인정보 대신 .test 도메인의 합성 이메일을 지정해주세요.');
  const initialPassword = `Th!${randomBytes(24).toString('base64url')}9a`;
  const result = await admin.auth.admin.createUser({ email: email.toLowerCase(), password: initialPassword, email_confirm: true });
  if (result.error || !result.data?.user?.id) throw new Error('Auth 계정 발급에 실패했습니다. 기존 계정 또는 Auth 설정을 확인해주세요.');
  const id = result.data.user.id;
  let saved;
  try {
    saved = await admin.rpc('interview_mgmt_bootstrap_recruiter', { p_id: id, p_email: email.toLowerCase(), p_name: '테스트 채용담당자' });
    if (saved.error || saved.data !== id) throw new Error('bootstrap');
  } catch {
    let cleanup;
    try { cleanup = await admin.auth.admin.deleteUser(id); } catch { cleanup = { error: true }; }
    throw new Error(cleanup.error ? `신규 프로필 저장 및 Auth 정리에 실패했습니다. Auth 관리 화면에서 미완료 계정 ${id}를 확인해주세요.` : '최초 프로필 저장에 실패했습니다. bootstrap 마이그레이션을 확인해주세요. 이번에 생성한 Auth 계정은 정리했습니다.');
  }
  // Never persist tokens or passwords. No email invitation/reset is sent.
  const client = clientFactory(config.url, config.anon, OPTIONS);
  let verified = false;
  try {
    const login = await client.auth.signInWithPassword({ email: email.toLowerCase(), password: initialPassword });
    if (!login.error && login.data?.user?.id === id) {
      const profile = await client.from('interview_mgmt_users').select('id,role,active').eq('id', id).single();
      const interviews = await client.rpc('interview_mgmt_list_interviews');
      verified = !profile.error && profile.data?.role === 'RECRUITER' && profile.data.active === true && !interviews.error;
    }
  } catch { /* Return credentials for the saved account even if verification fails. */ }
  finally { try { await client.auth.signOut({ scope: 'local' }); } catch {} }
  return { id, email: email.toLowerCase(), initialPassword, verified };
}

async function main() {
  const args = process.argv.slice(2);
  const allowed = new Set(['--create','--check','--project-ref','--email']);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (!allowed.has(args[i])) throw new Error('지원하지 않는 옵션입니다.');
    const name = args[i];
    if (name === '--create' || name === '--check') options[name] = true;
    else { if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('옵션 값을 지정해주세요.'); options[name] = args[++i]; }
  }
  if (options['--create'] && options['--check']) throw new Error('--create와 --check 중 하나를 지정해주세요.');
  const result = await setupAccount({ projectRef: options['--project-ref'], email: options['--email'], create: !!options['--create'] });
  if (!options['--create']) { console.log(`설정 확인 완료: 신규 계정 ${result.users}개, 최초 발급 ${result.initialized ? '완료' : '가능'}`); return; }
  console.log(`테스트 채용담당자 발급 완료\n아이디: ${result.email}\n초기 비밀번호 (파일에 저장하지 않음): ${result.initialPassword}\n실제 Auth/DB 검증: ${result.verified ? '통과' : '실패 — 계정은 발급됐으므로 로그인 및 설정을 확인해주세요.'}`);
  if (!result.verified) process.exitCode = 2;
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { setupAccount, configuration };
