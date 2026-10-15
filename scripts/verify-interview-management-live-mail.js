"use strict";
const assert=require('node:assert/strict'),{createClient}=require('@supabase/supabase-js');
async function main(input){
  assert.ok(typeof input.recipient==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.recipient),'Approved test recipient required');
  const base='https://talentpool-dx.com',script=await(await fetch(base+'/runtime-config.js')).text();
  const cfg=JSON.parse(script.slice(script.indexOf('{'),script.lastIndexOf('}')+1));
  const client=createClient(cfg.interviewManagementSupabaseUrl,cfg.interviewManagementSupabaseAnonKey,{auth:{persistSession:false,autoRefreshToken:false}});
  try{
    const login=await client.auth.signInWithPassword({email:input.email,password:input.initialPassword});assert.ok(!login.error&&login.data.session,'Actual login failed');
    const token=login.data.session.access_token;
    async function api(action,body){const r=await fetch(base+'/api/interview-management/'+action,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();assert.equal(r.status,200,action+': '+(data.error||'unexpected status'));return data;}
    const inbox=await api('mail/inbox');assert.equal(inbox.sendEnabled,true);
    let draft=inbox.drafts.find(d=>d.interview_id===input.interview_id&&d.kind==='CONFIRMATION'&&d.recipient_email===input.recipient&&d.valid);assert.ok(draft,'Recipient-specific test draft required');
    if(draft.status==='PENDING'){
      await api('mail/edit',{items:[{id:draft.id,version:draft.version,content_version:draft.content_version}],note:'이 메일은 TalentHub 면접 일정 관리의 실제 발송 검증용입니다. 실제 채용 면접 안내가 아닙니다.'});
      draft=(await api('mail/inbox')).drafts.find(d=>d.id===draft.id);
      await api('mail/approve',{items:[{id:draft.id,version:draft.version,content_version:draft.content_version}]});
    }
    const result=await api('mail/process',{}),after=(await api('mail/inbox')).drafts.find(d=>d.id===draft.id);
    console.log(JSON.stringify({interview_id:input.interview_id,draft_id:draft.id,reply_to:draft.reply_to,sent:result.sent,failed:result.failed,events:after.events}));
    if(!after.events.some(e=>e.status==='SENT'))process.exitCode=2;
  }finally{await client.auth.signOut({scope:'local'});}
}
if(require.main===module)(async()=>{let raw='';for await(const b of process.stdin)raw+=b;await main(JSON.parse(raw));})().catch(error=>{console.error('Live mail verification failed: '+error.message);process.exitCode=1;});
