"use strict";
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { setupAccount, configuration } = require('./setup-interview-management-account');
const ref = 'abcdefghijklmnopqrst';
const env = { SUPABASE_URL: `https://${ref}.supabase.co`, SUPABASE_ANON_KEY: 'test-anon', SUPABASE_SERVICE_ROLE_KEY: 'test-service' };
const id = '00000000-0000-4000-8000-000000000001';
test('bootstrap prefers isolated v2 project settings over shared application credentials', () => {
  const result = configuration({ ...env, SUPABASE_URL:'https://unrelated.example.test', INTERVIEW_MGMT_SUPABASE_URL:env.SUPABASE_URL, INTERVIEW_MGMT_SUPABASE_ANON_KEY:'v2-anon', INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY:'v2-service' },ref);
  assert.deepEqual(result,{url:env.SUPABASE_URL,anon:'v2-anon',service:'v2-service'});
});
function mock({ count = 0, profileError = false, loginError = false } = {}) {
  const calls = [];
  const admin = {
    from: () => ({ select: async () => ({ count }) }),
    auth: { admin: {
      createUser: async args => { calls.push(['create', args]); return { data: { user: { id } } }; },
      deleteUser: async value => { calls.push(['delete', value]); return {}; }
    } },
    rpc: async (_name,args) => { calls.push(['profile', args]); return profileError ? { error: {} } : { data: id }; }
  };
  const client = {
    auth: {
      signInWithPassword: async () => loginError ? { error: {} } : { data: { user: { id } } },
      signOut: async () => { calls.push(['signout']); }
    },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'RECRUITER', active: true } }) }) }) }),
    rpc: async () => ({ data: [] })
  };
  return { calls, clientFactory: (_url,key) => key === env.SUPABASE_SERVICE_ROLE_KEY ? admin : client };
}
test('bootstrap refuses wrong project, missing key, real email and enabled mail before creating Auth users', async () => {
  for (const patch of [{ SUPABASE_URL: 'https://wrong.example.test' }, { SUPABASE_SERVICE_ROLE_KEY: '' }, { INTERVIEW_MGMT_MAIL_SEND_ENABLED: 'true' }])
    assert.throws(() => configuration({ ...env, ...patch }, ref));
  const m = mock();
  await assert.rejects(setupAccount({ env, projectRef: ref, create: true, email: 'person@example.com', ...m }));
  assert.equal(m.calls.length, 0);
});
test('check is read-only and existing profiles block bootstrap', async () => {
  const m = mock({ count: 1 });
  assert.deepEqual(await setupAccount({ env, projectRef: ref, ...m }), { ready: true, initialized: true, users: 1 });
  await assert.rejects(setupAccount({ env, projectRef: ref, create: true, email: 'recruiter@example.test', ...m }));
  assert.equal(m.calls.length, 0);
});
test('confirmed managed Auth, one-time credentials and real user-scoped verification', async () => {
  const m = mock();
  const result = await setupAccount({ env, projectRef: ref, create: true, email: 'recruiter@example.test', ...m });
  assert.equal(result.verified, true);
  assert.ok(result.initialPassword.length >= 32);
  assert.equal(m.calls[0][1].email_confirm, true);
  assert.equal(m.calls[0][1].password, result.initialPassword);
  assert.equal(JSON.stringify(m.calls.find(c => c[0] === 'profile')).includes(result.initialPassword), false);
  assert.equal(m.calls.at(-1)[0], 'signout');
});
test('failed profile creation deletes only newly created Auth user; verification failure preserves issued credentials', async () => {
  const m = mock({ profileError: true });
  await assert.rejects(setupAccount({ env, projectRef: ref, create: true, email: 'recruiter@example.test', ...m }));
  assert.deepEqual(m.calls.at(-1), ['delete', id]);
  const other = mock({ loginError: true });
  const result = await setupAccount({ env, projectRef: ref, create: true, email: 'recruiter@example.test', ...other });
  assert.equal(result.verified, false);
  assert.ok(result.initialPassword);
  assert.equal(other.calls.some(c => c[0] === 'delete'), false);
});
test('DB bootstrap is service-only, bound to confirmed Auth email, atomic and one-time', async () => {
  const runtime = path.join(__dirname, '../.codex-artifacts/interview-mgmt-test/node_modules/@electric-sql/pglite');
  const { PGlite } = require(runtime), { btree_gist } = require(path.join(runtime, 'dist/contrib/btree_gist.cjs'));
  const pg = new PGlite({ extensions: { btree_gist } });
  try {
    await pg.exec("create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;");
    for (const name of ['20261012090000_interview_management_v2.sql', '20261013120000_interview_management_bootstrap.sql'])
      await pg.exec(fs.readFileSync(path.join(__dirname, '../supabase/migrations', name), 'utf8'));
    await pg.query('insert into auth.users values($1,$2,now())', [id,'recruiter@example.test']);
    const sql = 'select public.interview_mgmt_bootstrap_recruiter($1,$2,$3)';
    for (const role of ['anon','authenticated']) {
      await pg.exec(`set role ${role}`);
      await assert.rejects(pg.query(sql,[id,'recruiter@example.test','테스트 채용담당자']), { code: '42501' });
      await pg.exec('reset role');
    }
    await pg.exec('set role service_role');
    await assert.rejects(pg.query(sql,[id,'other@example.test','테스트 채용담당자']));
    await assert.rejects(pg.query(sql,[id,'recruiter@example.com','테스트 채용담당자']));
    await pg.exec('reset role');
    assert.equal((await pg.query('select count(*)::integer n from public.interview_mgmt_users')).rows[0].n,0);
    await pg.exec('set role service_role');
    await pg.query(sql,[id,'recruiter@example.test','테스트 채용담당자']);
    await assert.rejects(pg.query(sql,[id,'recruiter@example.test','테스트 채용담당자']));
    await pg.exec('reset role');
    assert.equal((await pg.query('select role from public.interview_mgmt_users')).rows[0].role,'RECRUITER');
    assert.equal((await pg.query('select count(*)::integer n from public.interview_mgmt_audit_logs')).rows[0].n,1);
  } finally { await pg.close(); }
});
