"use strict";
// Credentials arrive only on stdin; never write passwords, tokens or traces.
const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');
async function verifyLogin(credentials) {
  const base = process.env.INTERVIEW_MGMT_TEST_URL || 'http://127.0.0.1:5186';
  const url = new URL(base);
  assert.ok((url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname)) || (url.origin === 'https://talentpool-dx.com' && process.env.INTERVIEW_MGMT_PRODUCTION_CHECK === 'true'), 'Approved test server required');
  assert.ok(typeof credentials.email === 'string' && credentials.email.endsWith('.test'), 'Synthetic identity required');
  assert.ok(typeof credentials.initialPassword === 'string' && credentials.initialPassword.length >= 12, 'Password required');
  const anonymous = await fetch(`${base}/api/interview-management/bootstrap`);
  assert.equal(anonymous.status,401,'Anonymous access must be rejected');
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [1440,390]) {
      const context = await browser.newContext({viewport:{width,height:960}});
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', () => errors.push('pageerror'));
        await page.goto(`${base}/interview-management`);
        await page.getByLabel('아이디 (이메일)',{exact:true}).fill(credentials.email);
        await page.getByLabel('비밀번호',{exact:true}).fill(credentials.initialPassword);
        const bootstrap = page.waitForResponse(r => new URL(r.url()).pathname === '/api/interview-management/bootstrap');
        const inbox = page.waitForResponse(r => new URL(r.url()).pathname === '/api/interview-management/mail/inbox');
        await page.getByRole('button',{name:'로그인',exact:true}).click();
        const response = await bootstrap;
        assert.equal(response.status(),200,'Real authenticated bootstrap');
        const body = await response.json();
        assert.equal(body.actor.role,'RECRUITER');
        assert.equal(body.actor.email,credentials.email);
        const mailResponse = await inbox;
        assert.equal(mailResponse.status(),200,'Real mail inbox permission');
        assert.equal((await mailResponse.json()).sendEnabled,process.env.INTERVIEW_MGMT_EXPECT_SEND_ENABLED === 'true','Expected external sending setting');
        await page.locator('#im-app').waitFor({state:'visible'});
        assert.match(await page.locator('#im-identity').innerText(),/채용담당자/);
        await page.getByRole('button',{name:'사용자 관리',exact:true}).click();
        await page.getByRole('button',{name:'계정 생성 및 초기 비밀번호 발급',exact:true}).waitFor();
        assert.equal(await page.getByLabel('초기 비밀번호',{exact:true}).getAttribute('type'),'password');
        await page.getByLabel('초기 비밀번호 확인',{exact:true}).waitFor();
        await page.getByRole('button',{name:'면접 생성',exact:true}).click();
        assert.equal(await page.getByLabel('조율 시작 방식').inputValue(),'IMMEDIATE');
        assert.equal(await page.getByLabel('예약 시작 날짜·시간 (한국시간)').isVisible(),false);
        assert.equal(await page.getByLabel('조율 종료 (한국시간)').count(),0);
        await page.getByLabel('조율 시작 방식').selectOption('SCHEDULED');
        assert.equal(await page.getByLabel('예약 시작 날짜·시간 (한국시간)').isVisible(),true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false,'No horizontal overflow');
        await page.reload();
        await page.locator('#im-app').waitFor({state:'visible'});
        await page.getByRole('button',{name:'로그아웃',exact:true}).click();
        await page.locator('#im-login').waitFor({state:'visible'});
        await page.reload();
        await page.locator('#im-login').waitFor({state:'visible'});
        assert.deepEqual(errors,[]);
        console.log(`PASS actual Supabase Auth/API, recruiter UI, refresh, logout, ${width}px`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
}
if (require.main === module) {
  (async () => {
    let raw = '';
    for await (const chunk of process.stdin) { raw += chunk; if(raw.length > 8192) throw new Error('Input too large'); }
    await verifyLogin(JSON.parse(raw));
  })().catch(error => { console.error('FAIL live login verification: '+error.name+' '+error.message.split('\n')[0]); process.exitCode=1; });
}
module.exports = { verifyLogin };
