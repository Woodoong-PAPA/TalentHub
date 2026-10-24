"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {chromium}=require("@playwright/test");
const {candidateSafe,candidateSchedule}=require("../lib/interview-management-core.js");
const base=process.env.INTERVIEW_MGMT_TEST_URL||"http://127.0.0.1:5186";
const ids=Array.from({length:12},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`);
const users=[{id:ids[0],name:"가상 담당자",role:"RECRUITER"},{id:ids[1],name:"가상 HRBP",role:"HRBP"},{id:ids[2],name:"비공개 면접관",role:"INTERVIEWER"},{id:ids[3],name:"가상 지원자",role:"CANDIDATE"}].map(u=>({...u,email:`${u.role.toLowerCase()}@example.test`,active:true}));
const first="2099-10-13T00:00:00Z",end="2099-10-13T01:00:00Z",second="2099-10-13T02:00:00Z",secondEnd="2099-10-13T03:00:00Z";
async function main(){const browser=await chromium.launch({headless:true});const out=path.join(__dirname,"../.codex-artifacts/interview-management-phase2");fs.mkdirSync(out,{recursive:true});
  try{for(const width of [1440,390])for(const role of ["RECRUITER","HRBP","INTERVIEWER","CANDIDATE"]){
    const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),actor=users.find(u=>u.role===role),errors=[];page.on("pageerror",e=>errors.push(e.message));
    let conflicts=0;const calls=[];
    const row={id:ids[4],position:"가상 면접 포지션",type:"PHONE",duration_minutes:60,mode:"ONLINE",status:role==="CANDIDATE"?"PROPOSED":"COORDINATING",candidate_name:"가상 지원자",candidate_id:ids[3],department_name:"비공개 부서",recruiter_id:ids[0],interviewer_names:["비공개 면접관"],window_start:first,window_end:"2099-10-15T09:00:00Z",created_at:"2026-10-13T00:00Z"};
    const schedule={interview_id:row.id,version:1,booking:null,proposals:[{id:ids[5],starts_at:first,ends_at:end},{id:ids[6],starts_at:second,ends_at:secondEnd}],participants:[{id:ids[2],name:"비공개 면접관"}],availability:[],availability_requests:[],common_slots:[{starts_at:first,ends_at:end}],requests:role==="CANDIDATE"?[]:[{id:ids[7],requested_by:ids[3],kind:"COUNTER_PROPOSAL",status:"PENDING",reason:"가상 역제안",proposed_start:first,proposed_end:end}]};
    await page.route("**/runtime-config.js",r=>r.fulfill({contentType:"application/javascript",body:'window.__APP_CONFIG__={supabaseUrl:"https://auth.example.test",supabaseAnonKey:"fake"}'}));
    await page.route("**/vendor/supabase-global.js",r=>r.fulfill({contentType:"application/javascript",body:'window.supabase={createClient(){let session=null;return{auth:{getSession:async()=>({data:{session}}),signInWithPassword:async()=>{session={access_token:"test"};return{}},onAuthStateChange:()=>{},signOut:async()=>{session=null;return{}}}}}}'}));
    await page.route("**/api/interview-management/**",async route=>{
      const name=new URL(route.request().url()).pathname.split("/interview-management/")[1],body=JSON.parse(route.request().postData()||"{}");let result={ok:true},status=200;calls.push({name,body});
      if(name==="bootstrap")result={ok:true,actor,interviews:[role==="CANDIDATE"?candidateSafe(row):row],users:role==="CANDIDATE"?[]:users,departments:[],access:[],types:[{type:"PHONE",duration_minutes:60}],audit:[]};
      if(name==="schedule")result.schedule=role==="CANDIDATE"?candidateSchedule(schedule):schedule;
      if(name==="calendar")result.bookings=schedule.booking?[{interview_id:row.id,position:row.position,type:row.type,mode:row.mode,starts_at:schedule.booking.starts_at,ends_at:schedule.booking.ends_at}]:[];
      if(name==="coordinate"){
        const d=body.data;
        if(body.action==="availability"){assert.equal(d.user_id,ids[2]);const existing=schedule.availability.find(a=>a.id===d.id);if(existing)Object.assign(existing,d);else schedule.availability.push({id:ids[8],...d,entered_by:actor.id});}
        if(body.action==="availability_delete")schedule.availability=[];
        if(body.action==="request_availability")schedule.availability_requests.push({id:ids[9],user_id:ids[2]});
        if(body.action==="publish"){assert.equal(d.starts.length,1);row.status="PROPOSED";}
        if(body.action==="review_request"){if(role==="HRBP")assert.equal(d.decision,"REVIEW");schedule.requests[0].review_note=d.note;if(role==="RECRUITER")schedule.requests[0].status="ACCEPTED";}
        if(body.action==="change_request")schedule.requests.push({id:ids[10],requested_by:actor.id,status:"PENDING",kind:d.kind,reason:d.reason,proposed_start:d.starts_at,proposed_end:d.ends_at});
        if(body.action==="reopen")row.status="CHANGE_REQUESTED";
      }
      if(name==="proposals/select"){
        if(conflicts++===0){status=409;result={ok:false,error:"다른 예약이 먼저 확정되었습니다. 다른 시간을 선택해주세요."};}
        else{const p=schedule.proposals.find(p=>p.id===body.proposal_id);schedule.booking={id:ids[11],starts_at:p.starts_at,ends_at:p.ends_at};schedule.proposals=[];row.status="CONFIRMED";schedule.requests.forEach(r=>r.status="ACCEPTED");result.booking={id:ids[11],confirmed:true};}
      }
      await route.fulfill({status,contentType:"application/json",body:JSON.stringify(result)});
    });
    await page.goto(`${base}/interview-management`);await page.getByLabel("아이디 (이메일)").fill(actor.email);await page.getByLabel("비밀번호",{exact:true}).fill("TestOnly!password");await page.getByRole("button",{name:"로그인",exact:true}).click();await page.getByRole("button",{name:"상세",exact:true}).click();await page.getByRole("heading",{name:"제안된 일정",exact:true}).waitFor();
    if(["HRBP","INTERVIEWER"].includes(role)){
      const form=page.locator("#im-availability-form");await form.locator('[name="starts_at"]').fill("2099-10-13T09:00");await form.locator('[name="ends_at"]').fill("2099-10-13T10:00");await form.getByRole("button",{name:"가능 시간 저장",exact:true}).click();await page.getByText("일정 조율 내용을 저장했습니다.",{exact:true}).waitFor();
      await page.getByRole("button",{name:"시간 수정",exact:true}).click();await page.locator('#im-availability-form [name="ends_at"]').fill("2099-10-13T11:00");await page.getByRole("button",{name:"가능 시간 저장",exact:true}).click();await page.getByText("일정 조율 내용을 저장했습니다.",{exact:true}).waitFor();
      if(role==="HRBP"){await page.getByRole("button",{name:"면접관에게 직접 입력 요청",exact:true}).click();await page.getByText("일정 조율 내용을 저장했습니다.",{exact:true}).waitFor();}
    }
    if(["HRBP","RECRUITER"].includes(role)){
      await page.locator('#im-publish-form input[type="checkbox"]').check();await page.getByRole("button",{name:"선택한 시간을 지원자에게 제안",exact:true}).click();await page.getByText("일정 조율 내용을 저장했습니다.",{exact:true}).waitFor();
      await page.locator('.im-review-form textarea[name="note"]').fill("가상 검토 의견");await page.getByRole("button",{name:"검토 저장",exact:true}).click();await page.getByText("일정 조율 내용을 저장했습니다.",{exact:true}).waitFor();
      if(role==="RECRUITER"){await page.getByRole("button",{name:"조율 기간 변경 및 재조율 시작",exact:true}).click();await page.getByText("일정 조율 내용을 저장했습니다.",{exact:true}).waitFor();}
    }
    if(role==="CANDIDATE"){
      await page.locator('#im-change-request-form [name="starts_at"]').fill("2099-10-14T09:00");await page.locator('#im-change-request-form [name="ends_at"]').fill("2099-10-14T11:00");await page.locator('#im-change-request-form [name="reason"]').fill("가상 역제안 사유");await page.getByRole("button",{name:"담당자에게 검토 요청",exact:true}).click();await page.getByText("일정 조율 내용을 저장했습니다.",{exact:true}).waitFor();
      page.once("dialog",d=>d.accept());await page.getByRole("button",{name:"이 시간 선택",exact:true}).first().click();await page.getByText("다른 예약이 먼저 확정되었습니다. 다른 시간을 선택해주세요.",{exact:true}).waitFor();
      page.once("dialog",d=>d.accept());await page.getByRole("button",{name:"이 시간 선택",exact:true}).last().click();await page.getByText("면접 일정이 확정되었습니다.",{exact:false}).waitFor();
      const text=await page.locator("#im-content").innerText();for(const secret of ["비공개 면접관","비공개 부서","면접관 가능 시간"])assert.equal(text.includes(secret),false);
    }
    await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(out,`${role}-${width}.png`),fullPage:true});
    await page.getByRole("button",{name:"일정 캘린더",exact:true}).click();await page.getByRole("heading",{name:"일정 캘린더",exact:true}).waitFor();
    if(role==="CANDIDATE"){await page.getByText("가상 면접 포지션",{exact:true}).waitFor();assert.equal((await page.locator("#im-content").innerText()).includes("비공개"),false);}
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);assert.ok(calls.some(c=>c.name==="coordinate"),`${role} coordination mutation`);console.log(`PASS Phase 2 ${role} ${width}px workflows/calendar/privacy`);await context.close();
  }}finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
