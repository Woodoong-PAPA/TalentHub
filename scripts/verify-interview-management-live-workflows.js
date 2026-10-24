"use strict";
const assert=require('node:assert/strict'),{createClient}=require('@supabase/supabase-js'),{randomBytes}=require('node:crypto');
async function main(input){
  const base=input.base||'http://127.0.0.1:5186',target=new URL(base);
  assert.ok(['127.0.0.1','localhost','talentpool-dx.com'].includes(target.hostname),'Approved test target required');
  const script=await (await fetch(base+'/runtime-config.js')).text();
  const config=JSON.parse(script.slice(script.indexOf('{'),script.lastIndexOf('}')+1));
  const url=config.interviewManagementSupabaseUrl||config.supabaseUrl,key=config.interviewManagementSupabaseAnonKey||config.supabaseAnonKey;
  const clients=[];
  async function login(email,password){const c=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});clients.push(c);const r=await c.auth.signInWithPassword({email,password});assert.ok(!r.error&&r.data.session,'Actual login failed');return r.data.session.access_token;}
  async function api(token,action,data,expected=200){const r=await fetch(base+'/api/interview-management/'+action,{method:data?'POST':'GET',headers:{Authorization:'Bearer '+token,...(data?{'Content-Type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{})});const body=await r.json();assert.equal(r.status,expected,action+': '+(body.error||'Unexpected status'));return body;}
  try{
    const primary=await login(input.email,input.initialPassword),actor=(await api(primary,'bootstrap')).actor;
    const suffix=Date.now().toString(36),users={};
    for(const [name,role] of [['recruiter','RECRUITER'],['hrbp','HRBP'],['panel1','INTERVIEWER'],['panel2','INTERVIEWER'],['candidate','CANDIDATE']]){
      const email=name==='recruiter'?input.recipient:`v2-${name}-${suffix}@example.test`,password='Manual!'+randomBytes(18).toString('base64url')+'8a';
      const created=await api(primary,'users',{name:'검증용 '+name,email,role,initial_password:password});assert.equal(created.initialPassword,undefined);
      users[name]={...created.user,token:await login(email,password)};
    }
    const reset='Reset!'+randomBytes(18).toString('base64url')+'8a';
    await api(primary,'users/reset-password',{id:users.panel2.id,initial_password:reset});users.panel2.token=await login(users.panel2.email,reset);
    const dept=(await api(primary,'departments',{name:'면접 v2 발송 검증 '+suffix})).department;
    await api(primary,'department-access',{user_id:users.hrbp.id,department_id:dept.id,enabled:true});
    const interview={candidate_id:users.candidate.id,department_id:dept.id,recruiter_id:users.recruiter.id,alternate_recruiter_id:actor.id,hrbp_id:users.hrbp.id,position:'[테스트] 면접 일정 관리 배포 검증',type:'PHONE',duration_minutes:30,mode:'ONLINE',interviewer_ids:[users.panel1.id,users.panel2.id],coordination_start_mode:'IMMEDIATE'};
    const id=(await api(primary,'interviews',interview)).id;
    const future=new Date(Date.now()+7*86400000).toISOString();
    const scheduled=(await api(primary,'interviews',{...interview,coordination_start_mode:'SCHEDULED',window_start:future})).id;
    const start=new Date(Math.ceil((Date.now()+2*86400000)/900000)*900000).toISOString(),end=new Date(Date.parse(start)+7200000).toISOString();
    await api(users.hrbp.token,'coordinate',{interview_id:scheduled,action:'availability',data:{user_id:users.panel2.id,starts_at:start,ends_at:end}},400);
    const list=(await api(primary,'bootstrap')).interviews;assert.equal(list.find(i=>i.id===id).window_end,null);assert.equal(list.find(i=>i.id===scheduled).coordination_start_mode,'SCHEDULED');
    await api(users.panel1.token,'coordinate',{interview_id:id,action:'availability',data:{user_id:users.panel1.id,starts_at:start,ends_at:end}});
    await api(users.hrbp.token,'coordinate',{interview_id:id,action:'availability',data:{user_id:users.panel2.id,starts_at:start,ends_at:end}});
    for(const user of [users.hrbp,users.panel1,users.candidate]){await api(user.token,'users',{name:'차단 확인',email:'blocked@example.test',role:'RECRUITER',initial_password:'BlockedPassword!123'},403);await api(user.token,'mail/inbox',null,403);}
    const schedule=(await api(users.hrbp.token,'schedule?interview_id='+id)).schedule;assert.ok(schedule.common_slots.length);
    await api(users.recruiter.token,'coordinate',{interview_id:id,action:'publish',data:{version:schedule.version,starts:[schedule.common_slots[0].starts_at]}});
    const candidate=(await api(users.candidate.token,'schedule?interview_id='+id)).schedule;
    for(const forbidden of [users.panel1.email,users.panel2.email,dept.name,'검증용 panel'])assert.equal(JSON.stringify(candidate).includes(forbidden),false);
    await api(users.candidate.token,'proposals/select',{interview_id:id,proposal_id:candidate.proposals[0].id});
    assert.ok((await api(users.candidate.token,'calendar')).bookings.some(b=>b.interview_id===id));
    const inbox=await api(primary,'mail/inbox'),draft=inbox.drafts.find(d=>d.interview_id===id&&d.kind==='CONFIRMATION'&&d.recipient_id===users.recruiter.id);
    let mail={attempted:false};
    if(input.sendMail){
      assert.ok(draft&&draft.valid,'Prepare a recipient-specific test draft before requesting a send');
      assert.equal(inbox.sendEnabled,true);
      await api(primary,'mail/edit',{items:[{id:draft.id,version:draft.version,content_version:draft.content_version}],note:'이 메일은 TalentHub 면접 일정 관리의 실제 발송 검증용입니다. 실제 채용 면접 안내가 아닙니다.'});
      const edited=(await api(primary,'mail/inbox')).drafts.find(d=>d.id===draft.id);
      await api(primary,'mail/approve',{items:[{id:edited.id,version:edited.version,content_version:edited.content_version}]});
      const result=await api(primary,'mail/process',{});
      const after=(await api(primary,'mail/inbox')).drafts.find(d=>d.id===draft.id);
      mail={attempted:true,sent:result.sent,failed:result.failed,status:after.events?.[0]?.status,sent_at:after.events?.[0]?.sent_at,error:after.events?.[0]?.last_error};
    }
    await api(primary,'interviews/cancel',{id:scheduled});
    return {passed:true,base,interview_id:id,mail_draft_id:draft?.id||null,users:Object.fromEntries(Object.entries(users).map(([k,v])=>[k,v.id])),checks:['manual password create/reset','actual Auth and four roles','immediate/scheduled without deadline','direct and proxy availability','candidate booking/privacy','calendar'],mail};
  }finally{for(const c of clients)await c.auth.signOut({scope:'local'});}
}
if(require.main===module)(async()=>{let raw='';for await(const b of process.stdin)raw+=b;const result=await main(JSON.parse(raw));console.log(JSON.stringify(result));})().catch(error=>{console.error('Live workflow verification failed: '+error.message);process.exitCode=1;});
module.exports={main};
