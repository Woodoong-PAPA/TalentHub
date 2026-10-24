"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("@playwright/test");
const { candidateSafe } = require("../lib/interview-management-core.js");
const base=process.env.INTERVIEW_MGMT_TEST_URL||"http://127.0.0.1:5186";
const ids=Array.from({length:8},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`);
const users=[{id:ids[0],name:"가상 채용담당자",email:"recruiter@example.test",role:"RECRUITER",active:true},{id:ids[1],name:"가상 지원자",email:"candidate@example.test",role:"CANDIDATE",active:true},{id:ids[2],name:"내부 면접관 테스트",email:"private@example.test",role:"INTERVIEWER",active:true},{id:ids[3],name:"가상 HRBP",email:"hrbp@example.test",role:"HRBP",active:true}];
async function main() {
  const browser=await chromium.launch({headless:true});
  const out=path.join(__dirname,"../.codex-artifacts/interview-management");fs.mkdirSync(out,{recursive:true});
  try {
    for(const width of [1440,390]) for(const role of ["RECRUITER","HRBP","INTERVIEWER","CANDIDATE"]) {
      const context=await browser.newContext({viewport:{width,height:960}});
      const page=await context.newPage();const errors=[];page.on("pageerror",error=>errors.push(error.message));
      const actor=users.find(user=>user.role===role);
      const fixture={...actor};let rows=[],calls=[],passwordChanges=0;
      const bootstrap=()=>({ok:true,actor:fixture,interviews:role==="CANDIDATE"?rows.map(candidateSafe):rows,users:role==="CANDIDATE"?[]:users,departments:role==="CANDIDATE"?[]:[{id:ids[4],name:"가상 부서"}],access:role==="CANDIDATE"?[]:[{user_id:ids[3],department_id:ids[4]}],types:[{type:"PHONE",duration_minutes:30},{type:"TECHNICAL",duration_minutes:60},{type:"EXECUTIVE",duration_minutes:60},{type:"HR",duration_minutes:60}],audit:[]});
      await page.route("**/runtime-config.js",route=>route.fulfill({contentType:"application/javascript",body:'window.__APP_CONFIG__={supabaseUrl:"https://auth.example.test",supabaseAnonKey:"test-anon"};'}));
      await page.route("**/vendor/supabase-global.js",route=>route.fulfill({contentType:"application/javascript",body:`window.supabase={createClient(url,key,options){window.__testStorageKey=options.auth.storageKey;let session=null,handler;return {auth:{getSession:async()=>({data:{session}}),signInWithPassword:async()=>{session={access_token:"test-token"};return {error:null}},signOut:async()=>{session=null;if(handler)handler("SIGNED_OUT");return{}},updateUser:async()=>{window.__passwordChanged=true;return {error:null}},onAuthStateChange:cb=>{handler=cb;return {}}}}}};`}));
      await page.route("**/api/interview-management/**",async route=>{
        const request=route.request(),action=new URL(request.url()).pathname.split("/interview-management/")[1];calls.push(action);
        assert.equal(request.headers().authorization,"Bearer test-token");
        let result={ok:true};const body=request.postData()?JSON.parse(request.postData()):{};
        if(action==="bootstrap")result=bootstrap();
        if(action==="interviews") {assert.equal(role,"RECRUITER");assert.deepEqual(body.interviewer_ids,[ids[2]]);assert.equal(body.coordination_start_mode,"IMMEDIATE");assert.equal(body.window_end,undefined);rows=[{...body,id:ids[5],candidate_name:"가상 지원자",department_name:"가상 부서",interviewer_names:["내부 면접관 테스트"],status:"COORDINATING",created_at:"2026-10-12T00:00:00Z"}];result.id=ids[5];}
        if(action==="interviews/update") {rows[0]={...rows[0],...body};result.id=body.id;}
        if(action==="interviews/cancel") rows[0].status="CANCELLED";
        if(action==="users"||action==="users/reset-password"){assert.equal(body.initial_password,"ManualPassword!123");assert.equal(body.initial_password_confirm,undefined);}
        await route.fulfill({contentType:"application/json",body:JSON.stringify(result)});
      });
      await page.goto(`${base}/interview-management`);
      await page.getByLabel("아이디 (이메일)").fill(actor.email);await page.getByLabel("비밀번호",{exact:true}).fill("TestOnly!password");await page.getByRole("button",{name:"로그인",exact:true}).click();
      await page.getByRole("button",{name:"대시보드",exact:true}).waitFor();
      assert.equal(await page.evaluate(()=>window.__testStorageKey),"talenthub-interview-mgmt-v2-auth");
      if(role==="RECRUITER") {
        await page.getByRole("button",{name:"면접 생성",exact:true}).click();
        await page.locator("select[name=candidate_id]").selectOption(ids[1]);await page.getByLabel("채용 포지션").fill("가상 개발자");await page.locator("select[name=department_id]").selectOption(ids[4]);await page.locator("select[name=hrbp_id]").selectOption(ids[3]);
        await page.getByLabel("조율 시작 방식").selectOption("SCHEDULED");await page.getByLabel("예약 시작 날짜·시간 (한국시간)").fill("2099-10-13T09:00");assert.equal(await page.getByLabel("예약 시작 날짜·시간 (한국시간)").isVisible(),true);await page.getByLabel("조율 시작 방식").selectOption("IMMEDIATE");assert.equal(await page.getByLabel("예약 시작 날짜·시간 (한국시간)").isVisible(),false);await page.getByLabel("내부 면접관 테스트",{exact:true}).check();
        await page.locator("#im-interview-form").getByRole("button",{name:"면접 생성",exact:true}).click();await page.getByRole("heading",{name:"면접 상세",exact:true}).waitFor();
        await page.getByRole("button",{name:"면접 수정",exact:true}).click();await page.getByLabel("채용 포지션").fill("가상 수정 개발자");await page.getByRole("button",{name:"수정 저장",exact:true}).click();await page.getByRole("heading",{name:"면접 상세",exact:true}).waitFor();
        assert.ok((await page.locator("#im-content").innerText()).includes("가상 수정 개발자"));
        await page.screenshot({path:path.join(out,`detail-${width}.png`),fullPage:true});
        await page.getByRole("button",{name:"면접 목록",exact:true}).click();await page.getByLabel("면접 검색").fill("없는포지션");await page.getByText("조회 가능한 면접이 없습니다.").waitFor();await page.getByLabel("면접 검색").fill("가상");await page.getByRole("button",{name:"상세",exact:true}).click();
        page.once("dialog",dialog=>dialog.accept());await page.getByRole("button",{name:"면접 취소",exact:true}).click();await page.getByText("면접을 취소했습니다.",{exact:true}).waitFor();
        await page.getByRole("button",{name:"사용자 관리",exact:true}).click();await page.getByLabel("이름",{exact:true}).fill("가상 신규 사용자");await page.getByLabel("로그인 이메일",{exact:true}).fill("new@example.test");await page.getByLabel("초기 비밀번호",{exact:true}).fill("ManualPassword!123");await page.getByLabel("초기 비밀번호 확인",{exact:true}).fill("ManualPassword!123");await page.getByRole("button",{name:"계정 생성 및 초기 비밀번호 발급",exact:true}).click();await page.getByText("저장했습니다.",{exact:true}).waitFor();assert.equal(await page.getByLabel("초기 비밀번호",{exact:true}).inputValue(),"");await page.locator("[data-reset]").first().click();await page.getByLabel("초기 비밀번호",{exact:true}).fill("ManualPassword!123");await page.getByLabel("초기 비밀번호 확인",{exact:true}).fill("ManualPassword!123");await page.getByRole("button",{name:"설정한 비밀번호로 초기화",exact:true}).click();await page.getByText("저장했습니다.",{exact:true}).waitFor();
        await page.getByRole("button",{name:"부서·기본 시간",exact:true}).click();await page.getByLabel("부서 이름").fill("가상 신규 부서");await page.getByRole("button",{name:"부서 추가",exact:true}).click();await page.getByText("저장했습니다.",{exact:true}).waitFor();
      } else {
        assert.equal(await page.getByRole("button",{name:"면접 생성",exact:true}).count(),0);
        assert.equal(await page.getByRole("button",{name:"사용자 관리",exact:true}).count(),0);
        if(role==="CANDIDATE") {
          rows=[{id:ids[5],position:"가상 지원 포지션",type:"PHONE",duration_minutes:30,mode:"ONLINE",status:"COORDINATING",window_start:"2026-10-13T00:00:00Z",window_end:"2026-10-15T00:00:00Z",created_at:"2026-10-12T00:00:00Z",interviewer_names:["내부 면접관 테스트"],department_name:"비공개 부서"}];
          // Sign out and in to obtain a fresh role-scoped response.
          await page.getByRole("button",{name:"로그아웃",exact:true}).click();await page.getByRole("button",{name:"로그인",exact:true}).waitFor();await page.getByLabel("비밀번호",{exact:true}).fill("TestOnly!password");await page.getByRole("button",{name:"로그인",exact:true}).click();await page.getByRole("button",{name:"내 면접",exact:true}).click();await page.getByRole("button",{name:"상세",exact:true}).click();
          const content=await page.locator("#im-content").innerText();for(const forbidden of ["내부 면접관 테스트","private@example.test","비공개 부서"])assert.equal(content.includes(forbidden),false);
          await page.screenshot({path:path.join(out,`candidate-${width}.png`),fullPage:true});
        }
      }
      await page.getByRole("button",{name:"비밀번호 변경",exact:true}).click();await page.getByLabel("새 비밀번호",{exact:true}).fill("NewTestPassword!123");await page.getByLabel("새 비밀번호 확인",{exact:true}).fill("NewTestPassword!123");await page.locator("#im-password-form").getByRole("button",{name:"비밀번호 변경",exact:true}).click();await page.getByText("비밀번호를 변경했습니다.",{exact:true}).waitFor();passwordChanges+=Number(await page.evaluate(()=>window.__passwordChanged));assert.equal(passwordChanges,1);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${role}/${width} overflow`);
      assert.deepEqual(errors,[]);console.log(`PASS ${role} ${width}px: login, role UI, workflows, privacy, password, no overflow`);await context.close();
    }
    const page=await browser.newPage();await page.route("**/runtime-config.js",route=>route.fulfill({contentType:"application/javascript",body:"window.__APP_CONFIG__={};"}));await page.goto(`${base}/interview-management`);await page.getByText("Supabase Auth 설정과 신규 DB 마이그레이션이 필요합니다.",{exact:false}).waitFor();assert.equal(await page.getByRole("button",{name:"로그인",exact:true}).isVisible(),false);await page.close();
    console.log("PASS unconfigured service fails closed");
  } finally {await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
