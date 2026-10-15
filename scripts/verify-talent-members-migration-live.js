"use strict";
// Synthetic legacy account, generated password in memory, always removed afterward.
const {createClient}=require('@supabase/supabase-js'),{randomUUID,randomBytes,createHash}=require('node:crypto'),assert=require('node:assert/strict');
(async()=>{
 const url=process.env.INTERVIEW_MGMT_SUPABASE_URL||process.env.SUPABASE_URL,key=process.env.INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 assert.equal(new URL(url).hostname,'pefsetlczrrlvlehealp.supabase.co');
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}),id='unified-test-'+randomUUID(),email=id+'@example.test',password=randomBytes(24).toString('hex')+'!Aa1';let authId;
 const base=process.env.TALENTHUB_TEST_URL||'http://127.0.0.1:5195';
 const request=async(action,body,token)=>{const r=await fetch(base+'/api/talent-auth/'+action,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json()};};
 try{
  const added=await db.from('app_members').insert({id,email,name:'가상 통합 검증 사용자',role:'hiring_manager',status:'active',password_hash:createHash('sha256').update(email+':'+password).digest('hex')});assert.ifError(added.error);
  const signed=await request('login',{email,password});assert.equal(signed.status,200);authId=signed.data.member.authUserId;assert(authId);
  const current=await db.from('app_members').select('auth_user_id,password_hash').eq('id',id).single();assert.equal(current.data.password_hash,null);assert.equal(current.data.auth_user_id,authId);
  const token=signed.data.session.access_token,listed=await request('members',null,token);assert.equal(listed.status,200);assert.equal(listed.data.members.length,1);assert(!JSON.stringify(listed.data).includes('password'));
  assert.equal((await request('members/update',{id,member:{role:'admin'}},token)).status,403);
  let r=await fetch(base+'/api/interview-management/bootstrap',{headers:{Authorization:'Bearer '+token}});assert.equal(r.status,200);assert.equal((await r.json()).actor.role,'INTERVIEWER');
  await db.from('app_members').update({status:'suspended'}).eq('id',id);
  assert.equal((await request('session',null,token)).status,403);
  r=await fetch(base+'/api/interview-management/bootstrap',{headers:{Authorization:'Bearer '+token}});assert.equal(r.status,403);
  console.log('Actual legacy password migration, canonical role mapping, own-member scope and immediate suspension verified.');
 }finally{
  if(!authId){const found=await db.from('app_members').select('auth_user_id').eq('id',id).maybeSingle();authId=found.data?.auth_user_id;}
  const deleted=await db.from('app_members').delete().eq('id',id);assert.ifError(deleted.error);
  if(authId){
    // This synthetic identity has no interviews or audit records. Remove its
    // test projection before Auth because the normal history FK is restrictive.
    const projection=await db.from('interview_mgmt_users').delete().eq('id',authId).eq('email',email);assert.ifError(projection.error);
    const deletedAuth=await db.auth.admin.deleteUser(authId);assert.ifError(deletedAuth.error);
  }
 }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
