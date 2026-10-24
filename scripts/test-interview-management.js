"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const core = require("../lib/interview-management-core.js");
const { createHandler } = require("../api/interview-management/index.js");
const ids = Array.from({length:8},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`);
const valid = { candidate_id:ids[0],department_id:ids[1],recruiter_id:ids[2],alternate_recruiter_id:ids[3],hrbp_id:ids[4],interviewer_ids:[ids[5]],position:"테스트 개발자",type:"PHONE",duration_minutes:30,mode:"ONLINE",window_start:"2026-10-13T09:00:00+09:00",window_end:"2026-10-14T18:00:00+09:00" };
function mock(actor, options={}) {
  const calls=[];
  const db={ auth:{getUser:async()=>options.invalidToken?{error:{message:"expired"}}:{data:{user:{id:actor.id}}},updateUser:async()=>({data:{user:{id:actor.id}}})},
    from(table) { calls.push(table); const chain={select(){return chain;},eq(){return chain;},order(){return chain;},limit(){return chain;},maybeSingle:async()=>({data:actor}),then(resolve){resolve({data:[]});}};return chain; },
    rpc:async(name,args)=>{calls.push([name,args]);return {data:name.endsWith("list_interviews")?[{...valid,id:ids[7],interviewer_names:["내부 실명"],internal_email:"private@example.test"}]:ids[7]};}
  };
  return {db,calls};
}
async function request(actor, action="bootstrap", body, options={}) {
  const {db,calls}=mock(actor,options);
  let status,result;
  const handler=createHandler({env:{SUPABASE_URL:"https://example.test",SUPABASE_ANON_KEY:"anon"},clientFactory:()=>db});
  await handler({url:`/api/interview-management/${action}`,method:body?"POST":"GET",headers:{authorization:options.noToken?"":"Bearer test-token"},body},{writeHead(code){status=code;},end(raw){result=JSON.parse(raw);}});
  return {status,result,calls};
}
test("types enforce complete panel counts and duplicate prevention",()=>{
  assert.equal(core.validateInterview(valid).window_start,"2026-10-13T00:00:00.000Z");
  for(const type of ["TECHNICAL","EXECUTIVE","HR"])assert.throws(()=>core.validateInterview({...valid,type}));
  assert.doesNotThrow(()=>core.validateInterview({...valid,type:"HR",interviewer_ids:[ids[5],ids[6]]}));
  assert.throws(()=>core.validateInterview({...valid,interviewer_ids:[ids[5],ids[5]]}));
  assert.throws(()=>core.validateInterview({...valid,interviewer_ids:[...ids]}));
});
test("reject invalid identities, time ranges, duration and assignments",()=>{
  for(const patch of [{candidate_id:"bad"},{duration_minutes:0},{duration_minutes:30.5},{window_end:valid.window_start},{window_end:"invalid"},{mode:"other"},{type:"other"},{alternate_recruiter_id:valid.recruiter_id}]) assert.throws(()=>core.validateInterview({...valid,...patch}));
});
test("accounts validate roles and emails and never include passwords",()=>{
  assert.deepEqual(core.validateUser({name:"테스트 사용자",email:"TEST@example.test",role:"HRBP",password:"discard"}),{name:"테스트 사용자",email:"test@example.test",role:"HRBP"});
  assert.throws(()=>core.validateUser({name:"",email:"invalid",role:"ADMIN"}));
});
test("missing and invalid tokens fail closed",async()=>{
  const actor={id:ids[0],role:"RECRUITER",active:true};
  assert.equal((await request(actor,"bootstrap",null,{noToken:true})).status,401);
  assert.equal((await request(actor,"bootstrap",null,{invalidToken:true})).status,401);
  assert.equal((await request({...actor,active:false})).status,403);
});
test("HRBP interviewer candidate cannot invoke recruiter mutations",async()=>{
  for(const role of ["HRBP","INTERVIEWER","CANDIDATE"]) for(const action of ["interviews","interviews/update","interviews/cancel","users","users/update","users/reset-password","departments","department-access","type-settings"]) {
    const response=await request({id:ids[0],role,active:true},action,valid);
    assert.equal(response.status,403,`${role}/${action}`);
    assert.equal(response.calls.some(c=>Array.isArray(c)),false);
  }
});
test("candidate API projection excludes all internal fields and datasets",async()=>{
  const response=await request({id:ids[0],name:"테스트 지원자",email:"candidate@example.test",role:"CANDIDATE",active:true});
  assert.equal(response.status,200);
  const raw=JSON.stringify(response.result);
  for(const secret of ["interviewer_names","interviewer_ids","department_id","hrbp_id","recruiter_id","internal_email","내부 실명","private@example.test"])assert.equal(raw.includes(secret),false,secret);
  for(const key of ["users","departments","access","audit"])assert.deepEqual(response.result[key],[]);
});
test("recruiter saves validated interview using user-scoped transaction RPC",async()=>{
  const response=await request({id:ids[2],role:"RECRUITER",active:true},"interviews",valid);
  assert.equal(response.status,200);
  assert.equal(response.result.id,ids[7]);
  assert.equal(response.calls.at(-1)[0],"interview_mgmt_save_interview");
  assert.equal(response.calls.at(-1)[1].p_id,null);
});
test("unknown routes, invalid methods and disabled account configuration return errors",async()=>{
  const actor={id:ids[2],role:"RECRUITER",active:true};
  assert.equal((await request(actor,"unknown")).status,404);
  assert.equal((await request(actor,"users")).status,405);
  assert.equal((await request(actor,"users",{name:"가상 사용자",email:"fake@example.test",role:"INTERVIEWER"})).status,503);
});
test("account creation uses chosen password with managed Auth and never returns or stores credentials",async()=>{
  const actor={id:ids[0],role:"RECRUITER",active:true};const {db,calls}=mock(actor);
  let authArgs,adminKey,response;
  const admin={auth:{admin:{createUser:async args=>{authArgs=args;return {data:{user:{id:ids[6]}}};}}}};
  const handler=createHandler({env:{SUPABASE_URL:"https://example.test",SUPABASE_ANON_KEY:"anon",SUPABASE_SERVICE_ROLE_KEY:"server-only"},clientFactory:(_url,key)=>{if(key==="server-only"){adminKey=key;return admin;}return db;}});
  await handler({url:"/api/interview-management/users",method:"POST",headers:{authorization:"Bearer token"},body:{name:"테스트 사용자",email:"created@example.test",role:"INTERVIEWER",initial_password:"ChosenPassword!123"}},{writeHead(code,headers){assert.equal(code,200);assert.equal(headers["Cache-Control"],"no-store");},end(raw){response=JSON.parse(raw);}});
  assert.equal(adminKey,"server-only");assert.equal(authArgs.email_confirm,true);
  assert.equal(authArgs.password,"ChosenPassword!123");assert.equal(response.initialPassword,undefined);
  assert.equal(JSON.stringify(calls).includes(authArgs.password),false);
  assert.equal(JSON.stringify(response).includes("server-only"),false);
});
test("failed account profile persistence compensates by deleting only the newly created Auth account",async()=>{
  const {db}=mock({id:ids[0],role:"RECRUITER",active:true});db.rpc=async()=>({error:{code:"23505"}});
  const deleted=[];const admin={auth:{admin:{createUser:async()=>({data:{user:{id:ids[6]}}}),deleteUser:async id=>{deleted.push(id);return{};}}}};
  const handler=createHandler({env:{SUPABASE_URL:"https://example.test",SUPABASE_ANON_KEY:"anon",SUPABASE_SERVICE_ROLE_KEY:"service"},clientFactory:(_url,key)=>key==="service"?admin:db});
  let status,response;
  await handler({url:"/api/interview-management/users",method:"POST",headers:{authorization:"Bearer token"},body:{name:"테스트",email:"test@example.test",role:"INTERVIEWER",initial_password:"ChosenPassword!123"}},{writeHead(code){status=code;},end(raw){response=JSON.parse(raw);}});
  assert.equal(status,400);assert.deepEqual(deleted,[ids[6]]);assert.equal(response.initialPassword,undefined);
});
test("framework-parsed large bodies and JSON arrays are rejected",async()=>{
  const actor={id:ids[0],role:"RECRUITER",active:true};
  assert.equal((await request(actor,"departments",{name:"x".repeat(34000)})).status,413);
  assert.equal((await request(actor,"departments",["invalid"])).status,400);
});
test("coordination validation enforces role-specific actions and complete ranges",()=>{
  const base={interview_id:ids[7],action:"availability",data:{user_id:ids[5],starts_at:"2099-10-13T00:00Z",ends_at:"2099-10-13T01:00Z"}};
  assert.doesNotThrow(()=>core.validateCoordination(base,{id:ids[5],role:"INTERVIEWER"}));
  assert.doesNotThrow(()=>core.validateCoordination(base,{id:ids[4],role:"HRBP"}));
  assert.throws(()=>core.validateCoordination(base,{id:ids[6],role:"INTERVIEWER"}));
  assert.throws(()=>core.validateCoordination(base,{id:ids[0],role:"RECRUITER"}));
  assert.throws(()=>core.validateCoordination({...base,data:{...base.data,ends_at:base.data.starts_at}},{id:ids[4],role:"HRBP"}));
  assert.throws(()=>core.validateCoordination({...base,action:"publish",data:{version:1,starts:[base.data.starts_at,base.data.starts_at]}},{role:"HRBP"}));
  assert.throws(()=>core.validateCoordination({...base,action:"review_request",data:{id:ids[0],decision:"ACCEPT"}},{role:"HRBP"}));
});
test("candidate nested schedule projection removes internal data and review metadata",()=>{
  const safe=core.candidateSchedule({interview_id:ids[7],version:3,booking:{id:ids[6],starts_at:"2099",ends_at:"2099",interviewer_name:"secret"},participants:["secret"],availability:["secret"],requests:[{id:ids[0],kind:"CHANGE",status:"PENDING",reason:"own",reviewed_by:"secret",review_note:"secret"}],proposals:[{id:ids[1],starts_at:"2099",ends_at:"2099",email:"secret"}]});
  assert.equal(JSON.stringify(safe).includes("secret"),false);
});
test("non-candidates cannot confirm proposals through API",async()=>{
  for(const role of ["RECRUITER","HRBP","INTERVIEWER"]){const response=await request({id:ids[0],role,active:true},"proposals/select",{interview_id:ids[7],proposal_id:ids[6]});assert.equal(response.status,403);}
});
test("database conflicts map to 409 without exposing participant data",async()=>{
  for(const code of ["23P01","40001"]){
    const {db}=mock({id:ids[0],role:"CANDIDATE",active:true});db.rpc=async()=>({error:{code,message:"Internal panel: private@example.test"}});
    const handler=createHandler({env:{SUPABASE_URL:"https://example.test",SUPABASE_ANON_KEY:"anon"},clientFactory:()=>db});let status,raw;
    await handler({url:"/api/interview-management/proposals/select",method:"POST",headers:{authorization:"Bearer token"},body:{interview_id:ids[7],proposal_id:ids[6]}},{writeHead(value){status=value;},end(value){raw=value;}});
    assert.equal(status,409);assert.equal(raw.includes("private@example.test"),false);
  }
});
