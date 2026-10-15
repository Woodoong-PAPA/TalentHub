"use strict";
const {chromium}=require('@playwright/test'),assert=require('node:assert/strict');
const base=process.env.TALENTHUB_TEST_URL||'http://127.0.0.1:5195';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[],calls=[];
  page.on('pageerror',e=>errors.push(e.message));
  const member={id:'canonical-admin',authUserId:'00000000-0000-4000-8000-000000000001',name:'통합 테스트 관리자',email:'fake-admin@example.test',role:'admin',status:'active',interviewRole:''};
  const other={...member,id:'canonical-other',authUserId:'00000000-0000-4000-8000-000000000002',name:'가상 면접관',email:'fake-interviewer@example.test',role:'hiring_manager',interviewRole:'INTERVIEWER'};
  let members=[member,other];
  await page.route('**/runtime-config.js*',r=>r.fulfill({contentType:'application/javascript',body:'window.__APP_CONFIG__={dataSource:"local",unifiedAuthEnabled:true,supabaseUrl:"https://fake.example.test",supabaseAnonKey:"fake"};'}));
  await page.route('**/vendor/supabase-global.js',r=>r.fulfill({contentType:'application/javascript',body:`window.supabase={createClient(){let session=null;return {auth:{getSession:async()=>({data:{session}}),setSession:async s=>{session=s;return{error:null}},signOut:async()=>{session=null;return{}},onAuthStateChange:()=>({}),updateUser:async()=>({error:null})}}}};`}));
  await page.route('**/api/**',async r=>{
   const url=new URL(r.request().url()),body=r.request().postDataJSON();let data={ok:true};
   calls.push({path:url.pathname,body});
   if(url.pathname==='/api/talent-auth/login'){assert.equal(body.password,'FakePassword123!');data={ok:true,member,session:{access_token:'fake-token',refresh_token:'fake-refresh'}};}
   else if(url.pathname==='/api/talent-auth/members')data.members=members;
   else if(url.pathname==='/api/talent-auth/members/create'){assert.equal(body.password,'ChosenPassword123!');data.member={...body.member,id:'created',authUserId:'created-auth'};members.push(data.member);}
   else if(url.pathname==='/api/talent-auth/members/reset-password')assert.equal(body.password,'ResetPassword123!');
   else if(url.pathname==='/api/talent-auth/members/update'){data.member=members.find(m=>m.id===body.id);Object.assign(data.member,body.member);}
   else if(url.pathname==='/api/interview-management/bootstrap')data={ok:true,actor:{id:member.authUserId,name:member.name,role:'RECRUITER'},users:[],departments:[],access:[],types:[],audit:[],interviews:[]};
   else if(url.pathname==='/api/interview-management/mail/inbox')data.drafts=[];
   else return r.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"error":"isolated test"}'});
   await r.fulfill({contentType:'application/json',body:JSON.stringify(data)});
  });
  await page.goto(base);await page.locator('#login-email').fill(member.email);await page.locator('#login-password').fill('FakePassword123!');await page.locator('#login-form button[type=submit]').click();await page.locator('body.is-authenticated').waitFor();
  const original=page.url();await page.locator('.nav-list [data-view="interview-management"]').click();
  await page.locator('#interview-management-view.is-active').waitFor();
  const frame=page.frameLocator('#interview-management-frame');await frame.locator('#im-app:not([hidden])').waitFor();
  assert.equal(page.url(),original);assert.equal(await frame.locator('.sidebar').isVisible(),false);assert.equal(await frame.locator('#im-login').isVisible(),false);assert.equal(await frame.locator('[data-tab="users"]').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.evaluate(()=>setView('members'));await page.locator('[data-member-interview-role="canonical-other"]').selectOption('HRBP');
  await page.waitForFunction(()=>state.members.find(m=>m.id==='canonical-other')?.interviewRole==='HRBP');
  await page.evaluate(()=>{ void resetMemberPassword('canonical-other'); });
  await page.locator('.im-shared-password-dialog input[name=password]').fill('ResetPassword123!');
  await page.locator('.im-shared-password-dialog input[name=confirm]').fill('ResetPassword123!');
  await page.locator('.im-shared-password-dialog button[type=submit]').click();
  await page.waitForFunction(()=>!document.querySelector('.im-shared-password-dialog'));
  assert(calls.some(c=>c.path==='/api/talent-auth/members/reset-password'));
  assert(!JSON.stringify(await page.evaluate(()=>({...localStorage}))).includes('ResetPassword123!'));
  await context.close();
  assert.deepEqual(errors,[]);console.log('Unified menu/session/member roles verified at '+width+'px');
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
