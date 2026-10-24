"use strict";
// Credentials are read from stdin, never included in files, screenshots or traces.
const {chromium}=require('@playwright/test'),assert=require('node:assert/strict');
async function verify(credentials){
 const base=process.env.TALENTHUB_TEST_URL||'http://127.0.0.1:5195';
 const url=new URL(base);assert(['127.0.0.1','localhost','talentpool-dx.com'].includes(url.hostname));
 const browser=await chromium.launch({headless:true});
 try{for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/?view=interview-management'); console.log('Login form loaded '+width);await page.locator('#login-email').fill(credentials.email);await page.locator('#login-password').fill(credentials.password);
  const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/talent-auth/login');await page.locator('#login-form button[type=submit]').click();
  assert.equal((await response).status(),200,'canonical login');console.log('Canonical login accepted '+width);await page.locator('body.is-authenticated').waitFor();
  await page.locator('.nav-list [data-view="interview-management"]').click();
  const frame=page.frameLocator('#interview-management-frame');await frame.locator('#im-app:not([hidden])').waitFor();console.log('Embedded interview loaded '+width);
  assert.equal(await frame.locator('#im-login').isVisible(),false);assert.equal(await frame.locator('.sidebar').isVisible(),false);
  assert.equal(await frame.locator('[data-tab="users"]').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.reload();await page.locator('body.is-authenticated').waitFor();await page.locator('.nav-list [data-view="interview-management"]').click();await page.frameLocator('#interview-management-frame').locator('#im-app:not([hidden])').waitFor();
  await page.evaluate(()=>logout());await page.locator('#login-form').waitFor();assert.equal(await page.locator('#interview-management-frame').getAttribute('src'),'about:blank');
  assert.deepEqual(errors,[]);await context.close();console.log('Real unified login, embedded management, session restore and logout passed at '+width+'px');
 }}finally{await browser.close();}
}
module.exports={verify};
if(require.main===module){let raw='';process.stdin.setEncoding('utf8');process.stdin.on('data',b=>raw+=b);process.stdin.on('end',()=>verify(JSON.parse(raw)).catch(e=>{console.error(e.message);process.exitCode=1;}));}
