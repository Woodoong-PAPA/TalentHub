"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const {createHandler}=require('../api/talent-auth');
const email='fake@example.test',password='FakePassword123!',hash=createHash('sha256').update(email+':'+password).digest('hex');
async function invoke(route,body,options={}){
 const calls=[],member={id:'legacy',auth_user_id:options.legacy?null:'auth-id',name:'가상 사용자',email,role:options.role||'admin',status:options.suspended?'suspended':'active',password_hash:options.legacy?hash:null,profile:{}};
 const db={from(){const chain={select(){return chain},eq(){return chain},order(){return chain},maybeSingle:async()=>({data:member}),then(fn){fn({data:[member]})}};return chain;},rpc:async(name,args)=>{
  calls.push([name,args]);if(name==='interview_mgmt_login_limit')return{data:!options.limited};
  if(name==='interview_mgmt_find_auth')return{data:options.existing?'auth-id':null};
  if(name==='interview_mgmt_link_member'){member.auth_user_id='auth-id';member.password_hash=null;}
  return{data:name==='interview_mgmt_member_manage'?member:null};
 },auth:{getUser:async()=>({data:{user:{id:'auth-id'}}}),signInWithPassword:async()=>{calls.push(['signIn']);return options.conflict?{error:{}}:{data:{user:{id:'auth-id'},session:{access_token:'token',refresh_token:'refresh'}}}},admin:{createUser:async input=>{calls.push(['createUser',input]);return{data:{user:{id:'auth-id'}}}},updateUserById:async()=>{calls.push(['updatePassword']);return{data:{}}}}}};
 let status,result;await createHandler({env:{TALENT_AUTH_UNIFIED_ENABLED:options.disabled?'false':'true',SUPABASE_URL:'https://fake.example.test',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'service'},clientFactory:()=>db})({url:'/api/talent-auth/'+route,method:body?'POST':'GET',headers:{authorization:options.noToken?'':'Bearer valid'},body},{writeHead(n){status=n},end(raw){result=JSON.parse(raw)}});
 return{status,result,calls};
}
test('legacy login migrates only a verified password without sending mail',async()=>{
 const r=await invoke('login',{email,password},{legacy:true});assert.equal(r.status,200);assert(r.calls.some(c=>c[0]==='createUser'&&c[1].email_confirm===true));assert(r.calls.some(c=>c[0]==='interview_mgmt_link_member'));assert(!JSON.stringify(r.result.member).includes(hash));
 const bad=await invoke('login',{email,password:'wrong'},{legacy:true});assert.equal(bad.status,401);assert(!bad.calls.some(c=>c[0]==='createUser'));
});
test('matching email never resets a pre-existing managed identity password',async()=>{
 const r=await invoke('login',{email,password},{legacy:true,existing:true,conflict:true});assert.equal(r.status,401);assert(!r.calls.some(c=>['updatePassword','createUser','interview_mgmt_link_member'].includes(c[0])));
});
test('disabled mode, missing session, suspended members and rate limits fail closed',async()=>{
 assert.equal((await invoke('session',null,{disabled:true})).status,503);
 assert.equal((await invoke('session',null,{noToken:true})).status,401);
 assert.equal((await invoke('session',null,{suspended:true})).status,403);
 assert.equal((await invoke('login',{email,password},{limited:true})).status,429);
});
test('candidate cannot create, reset, delete, grant menu permissions or escalate own role',async()=>{
 for(const route of ['members/create','members/reset-password','members/delete','permissions','members/update']){
  const r=await invoke(route,{id:'legacy',password,rows:[],member:{name:'가상 사용자',email,role:'admin'}},{role:'applicant'});
  assert.equal(r.status,403,route);assert(!r.calls.some(c=>['createUser','updatePassword','interview_mgmt_member_manage'].includes(c[0])));
 }
});
