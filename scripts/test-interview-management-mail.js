"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {createProvider,processMail}=require("../lib/interview-management-mail.js");
const {createHandler}=require("../api/interview-management/index.js");
const id="00000000-0000-4000-8000-000000000001";
const env={INTERVIEW_MGMT_MAIL_SEND_ENABLED:"true",INTERVIEW_MGMT_RESEND_API_KEY:"fake-key",INTERVIEW_MGMT_MAIL_ALLOWED_RECIPIENTS:"candidate@example.test"};
function dbMock({to="candidate@example.test",ready=true}={}){
  const calls=[];let query=0;
  const db={from(){const rows=query++===0?[]:[{id}];const q={select:()=>q,eq:()=>q,is:()=>q,limit:()=>q,lte:()=>q,in:()=>q,or:()=>q,order:()=>q,then(resolve){resolve({data:rows});}};return q;},async rpc(name,args){calls.push({name,args});if(name.endsWith("claim"))return {data:{id,token:id,key:"fixed-key",payload:{from:"onboarding@resend.dev",to:[to],reply_to:"recruiter@example.test",subject:"면접 일정",text:"공개 정보"}}};if(name.endsWith("ready"))return {data:ready};return {data:name.endsWith("reminders")?0:true};}};
  return {db,calls};
}
test("disabled sender performs no DB mutations or external calls",async()=>{
  let sent=0;const result=await processMail({db:null,env:{},provider:{send:async()=>sent++}});assert.equal(result.enabled,false);assert.equal(sent,0);
});

test("existing Resend key remains opt-in and provider response time works with send-only keys",async()=>{
  let calls=0;
  const provider=createProvider({env:{RESEND_API_KEY:'existing-key'},fetchImpl:async(_url,options)=>{
    calls++;assert.equal(options.headers.Authorization,'Bearer existing-key');
    return {ok:true,headers:{get:name=>name==='date'?'Thu, 15 Oct 2026 06:00:00 GMT':null},json:async()=>({id:'accepted-email'})};
  }});
  const id=await provider.send({to:['candidate@example.test']},'stable-key',{firstAttempt:true});
  assert.equal(await provider.sentTime(id),'2026-10-15T06:00:00.000Z');assert.equal(calls,1);
  assert.equal((await processMail({db:null,env:{RESEND_API_KEY:'existing-key'},provider})).enabled,false);
});

test("retry HTTP response time cannot restart the reminder clock",async()=>{
  const provider=createProvider({env:{RESEND_API_KEY:'existing-key'},fetchImpl:async(_url,options)=>options.method==='POST'?{ok:true,headers:{get:()=> 'Thu, 15 Oct 2026 06:00:00 GMT'},json:async()=>({id:'replayed-email'})}:{ok:false}});
  const id=await provider.send({},'stable-retry-key',{firstAttempt:false});
  assert.equal(await provider.sentTime(id),null);
});
test("provider request has stable idempotency, one recipient, reply-to and no CC/attachments",async()=>{
  const requests=[];const provider=createProvider({env,fetchImpl:async(url,options)=>{requests.push({url,options});return {ok:true,json:async()=>url.endsWith("/emails")?{id:"mock-provider"}:{created_at:"2026-10-13T00:00:00Z"}};}});
  const {db,calls}=dbMock();const result=await processMail({db,env,provider});assert.equal(result.sent,1);const send=requests.find(r=>r.options.method==="POST");assert.equal(send.options.headers["Idempotency-Key"],"fixed-key");const body=JSON.parse(send.options.body);assert.equal(body.reply_to,"recruiter@example.test");assert.equal(body.to.length,1);assert.equal(body.cc,undefined);assert.equal(body.attachments,undefined);assert.equal(calls.find(c=>c.name.endsWith("finish")).args.p_sent_at,"2026-10-13T00:00:00.000Z");
});
test("stale drafts and forbidden recipients never reach provider",async()=>{
  for(const options of [{ready:false},{to:"forbidden@example.test"}]){const {db,calls}=dbMock(options);let sent=0;const result=await processMail({db,env,provider:{send:async()=>sent++}});assert.equal(sent,0);assert.equal(result.failed,1);assert.equal(calls.at(-1).args.p_provider,null);}
});
test("provider errors are sanitized; missing timestamp remains unknown rather than starting reminder clock",async()=>{
  const first=dbMock();await processMail({db:first.db,env,provider:{send:async()=>{throw Error("secret-key recipient@example.test")}}});assert.equal(JSON.stringify(first.calls).includes("secret-key"),false);
  const second=dbMock();await processMail({db:second.db,env,provider:{send:async()=>"provider-id",sentTime:async()=>null}});const done=second.calls.find(c=>c.name.endsWith("finish"));assert.equal(done.args.p_provider,"provider-id");assert.equal(done.args.p_sent_at,null);
});
test("a stale worker acknowledgement cannot be counted as a successful send",async()=>{
  const {db}=dbMock();const original=db.rpc;db.rpc=async(name,args)=>name.endsWith("finish")?{data:false}:original(name,args);
  const result=await processMail({db,env,provider:{send:async()=>"mock-provider",sentTime:async()=>null}});
  assert.equal(result.sent,0);assert.equal(result.failed,1);
});
async function api(role,action,body){let status,result;const actor={id,role,active:true};const chain={select(){return chain;},eq(){return chain;},maybeSingle:async()=>({data:actor})};const db={auth:{getUser:async()=>({data:{user:{id}}})},from:()=>chain,rpc:async()=>({data:[]})};const handler=createHandler({env:{SUPABASE_URL:"https://example.test",SUPABASE_ANON_KEY:"fake"},clientFactory:()=>db});await handler({url:"/api/interview-management/"+action,method:body?"POST":"GET",headers:{authorization:"Bearer fake"},body},{writeHead(code){status=code;},end(raw){result=JSON.parse(raw)}});return {status,result};}
test("every mail API rejects HRBP interviewer and candidate",async()=>{for(const role of ["HRBP","INTERVIEWER","CANDIDATE"])for(const action of ["mail/inbox","mail/approve","mail/edit","mail/process"]){assert.equal((await api(role,action,action.endsWith("inbox")?null:{})).status,403);}});
test("approval APIs reject malformed version lists; worker disabled even for recruiter",async()=>{
  assert.equal((await api("RECRUITER","mail/approve",{items:[{id,version:1}]})).status,400);assert.equal((await api("RECRUITER","mail/approve",{items:[]})).status,400);assert.equal((await api("RECRUITER","mail/process",{})).result.enabled,false);
  assert.equal((await api("RECRUITER","mail/approve",{items:[null]})).status,400);
});
test("mail cron requires dedicated secret and cannot accidentally use a user token",async()=>{
  assert.equal((await api("RECRUITER","mail/cron",{})).status,401);
  let status;const handler=createHandler({env:{INTERVIEW_MGMT_MAIL_CRON_SECRET:"test-secret"},clientFactory:()=>{throw Error("must not connect when disabled")}});await handler({url:"/api/interview-management/mail/cron",method:"POST",headers:{authorization:"Bearer test-secret"}},{writeHead(code){status=code},end(){}});assert.equal(status,200);
});
