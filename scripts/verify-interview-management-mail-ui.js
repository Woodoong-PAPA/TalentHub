"use strict";
const {chromium}=require("@playwright/test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const base=process.env.INTERVIEW_MGMT_TEST_URL||"http://127.0.0.1:5186";
const ids=Array.from({length:5},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`);
async function main(){const browser=await chromium.launch({headless:true});const out=path.join(__dirname,"../.codex-artifacts/interview-management-phase3");fs.mkdirSync(out,{recursive:true});
  try{for(const width of [1440,390])for(const role of ["RECRUITER","HRBP","INTERVIEWER","CANDIDATE"]){
    const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));let inboxCalls=0;
    const drafts=[{id:ids[1],interview_id:ids[0],version:1,content_version:1,subject:"면접 일정 선택 요청",body:"한국시간 2099-10-13 09:00\n기본 본문",note:"",status:"PENDING",valid:true,recipient_name:"가상 지원자",recipient_email:"candidate@example.test",reply_to:"recruiter@example.test",events:[]},{id:ids[2],interview_id:ids[0],version:1,content_version:1,subject:"면접 가능 시간 입력 요청",body:"가능 시간을 등록해주세요.",note:"",status:"PENDING",valid:true,recipient_name:"가상 면접관",recipient_email:"panel@example.test",reply_to:"recruiter@example.test",events:[]},{id:ids[3],interview_id:ids[0],version:1,content_version:1,subject:"무효화된 초안",body:"오래된 일정",status:"INVALIDATED",valid:false,events:[]}];
    await page.route("**/runtime-config.js",r=>r.fulfill({contentType:"application/javascript",body:'window.__APP_CONFIG__={supabaseUrl:"https://example.test",supabaseAnonKey:"fake"}'}));
    await page.route("**/vendor/supabase-global.js",r=>r.fulfill({contentType:"application/javascript",body:'window.supabase={createClient(){let session=null;return{auth:{getSession:async()=>({data:{session}}),signInWithPassword:async()=>{session={access_token:"fake"};return{}},onAuthStateChange:()=>{}}}}}'}));
    await page.route("**/api/interview-management/**",async route=>{
      const action=new URL(route.request().url()).pathname.split("/interview-management/")[1],body=JSON.parse(route.request().postData()||"{}");let result={ok:true};
      if(action==="bootstrap")result={ok:true,actor:{id:ids[0],name:"가상 사용자",role},interviews:[],users:[],departments:[],types:[],audit:[],access:[]};
      if(action==="mail/inbox"){inboxCalls++;assert.equal(role,"RECRUITER");result={ok:true,drafts,sendEnabled:false};}
      if(action==="mail/edit"){assert.equal(body.items.length,1);const d=drafts.find(d=>d.id===body.items[0].id);assert.equal(body.items[0].content_version,d.content_version);d.note=body.note;d.body="한국시간 2099-10-13 09:00\n기본 본문\n"+d.note;d.content_version++;d.status="PENDING";}
      if(action==="mail/approve"){assert.equal(body.items.length,2);assert.equal(body.items.some(i=>i.id===ids[3]),false);for(const item of body.items){const d=drafts.find(d=>d.id===item.id);assert.equal(item.content_version,d.content_version);d.status="APPROVED";d.events=[{status:"QUEUED",attempts:0}];}}
      await route.fulfill({contentType:"application/json",body:JSON.stringify(result)});
    });
    await page.goto(`${base}/interview-management`);await page.getByLabel("아이디 (이메일)").fill("fake@example.test");await page.getByLabel("비밀번호",{exact:true}).fill("TestOnlyPassword!");await page.getByRole("button",{name:"로그인",exact:true}).click();await page.getByRole("button",{name:"대시보드",exact:true}).waitFor();
    if(role==="RECRUITER"){
      await page.getByRole("button",{name:"이메일 승인함",exact:true}).click();await page.getByText("외부 이메일 발송이 비활성화되어 있습니다.",{exact:false}).waitFor();assert.equal(await page.getByRole("button",{name:"승인 이메일 처리·재시도",exact:true}).count(),0);
      await page.getByRole("button",{name:"추가 안내 수정",exact:true}).first().click();await page.getByLabel("추가 안내문",{exact:true}).fill("가상 테스트 안내");await page.getByRole("button",{name:"수정 저장 및 승인 초기화",exact:true}).click();await page.getByText("초안을 수정했습니다. 다시 승인해주세요.",{exact:true}).waitFor();
      await page.getByRole("button",{name:"승인 대기 전체 선택",exact:true}).click();assert.equal(await page.locator('input[data-mail-select]:checked').count(),2);await page.getByRole("button",{name:"선택한 초안 일괄 승인",exact:true}).click();await page.getByText("선택한 초안을 승인했습니다.",{exact:true}).waitFor();assert.equal(await page.getByText("승인 완료",{exact:true}).count(),2);assert.equal(await page.getByText("발송 대기 · 시도 0회",{exact:true}).count(),2);
      await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,`inbox-${width}.png`),fullPage:true});
    }else{assert.equal(await page.getByRole("button",{name:"이메일 승인함",exact:true}).count(),0);assert.equal(inboxCalls,0);assert.equal((await page.locator("#im-content").innerText()).includes("panel@example.test"),false);}
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);console.log(`PASS Phase 3 ${role} ${width}px: preview/edit/bulk approval/disabled send/access`);await context.close();
  }}finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
