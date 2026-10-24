"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {nativeFixture}=require("./interview-management-native-fixture.js");
test("native email concurrency and crash recovery",async t=>{
  const f=await nativeFixture();const {ids}=f;let interview,draft,event;
  const q=(sql,args=[])=>f.query("authenticated",ids[0],sql,args);
  const service=(name,args)=>f.query("service_role",null,`select public.interview_mgmt_mail_${name}(${args.map((_,i)=>`$${i+1}`).join(',')}) as r`,args);
  const claim=async()=> (await service("claim",[event,"onboarding@resend.dev"])).rows[0].r;
  try{
    interview=(await q("select public.interview_mgmt_save_interview(null,$1::jsonb) as id",[JSON.stringify({candidate_id:ids[3],department_id:ids[8],recruiter_id:ids[0],alternate_recruiter_id:ids[4],hrbp_id:ids[1],position:"가상 테스트",type:"PHONE",duration_minutes:30,mode:"ONLINE",window_start:"2099-10-13T00:00Z",window_end:"2099-10-13T09:00Z",interviewer_ids:[ids[2]]})])).rows[0].id;
    draft=(await q("select public.interview_mgmt_mail_inbox() as d")).rows[0].d;
    await q("select public.interview_mgmt_mail_manage('APPROVE',$1::jsonb,'')",[JSON.stringify([{id:draft.id,version:draft.version,content_version:draft.content_version}])]);event=(await f.admin.query("select id from public.interview_mgmt_email_events where draft_id=$1",[draft.id])).rows[0].id;
    let first,recovered;
    await t.test("two real workers contend for one event; only one receives a lease",async()=>{
      const a=await f.client("service_role"),b=await f.client("service_role");
      try{await a.query("begin");first=(await a.query("select public.interview_mgmt_mail_claim($1,$2) as r",[event,"onboarding@resend.dev"])).rows[0].r;
        let done=false;const pending=b.query("select public.interview_mgmt_mail_claim($1,$2) as r",[event,"other@resend.dev"]).then(r=>{done=true;return r;});await new Promise(r=>setTimeout(r,100));assert.equal(done,false);await a.query("commit");assert.equal((await pending).rows[0].r,null);
      }finally{await a.query("rollback");await a.end();await b.end();}
    });
    await t.test("crashed worker is recovered after lease expiry with identical payload and key",async()=>{
      await f.admin.query("update public.interview_mgmt_email_events set lease_until=now()-interval '1 minute' where id=$1",[event]);recovered=await claim();assert.notEqual(recovered.token,first.token);assert.equal(recovered.key,first.key);assert.deepEqual(recovered.payload,first.payload);
    });
    await t.test("old worker ACK cannot change a recovered lease; valid ACK prevents resend",async()=>{
      assert.equal((await service("finish",[event,first.token,"old-provider",null,new Date().toISOString()])).rows[0].r,false);
      assert.equal((await service("finish",[event,recovered.token,"mock-provider",null,new Date().toISOString()])).rows[0].r,true);assert.equal(await claim(),null);
    });
    await t.test("cancellation racing with an acquired lease blocks dispatch and retains audit history",async()=>{
      await q("select public.interview_mgmt_cancel_interview($1)",[interview]);const drafts=(await q("select public.interview_mgmt_mail_inbox() as d")).rows.map(r=>r.d);const d=drafts.find(d=>d.kind==='CANCELLATION');
      await q("select public.interview_mgmt_mail_manage('APPROVE',$1::jsonb,'')",[JSON.stringify([{id:d.id,version:d.version,content_version:d.content_version}])]);
      const e=(await f.admin.query("select id from public.interview_mgmt_email_events where draft_id=$1",[d.id])).rows[0].id;const c=(await service("claim",[e,"onboarding@resend.dev"])).rows[0].r;
      // Revoke the approving account after cancellation permits membership changes.
      await f.query("authenticated",ids[4],"select public.interview_mgmt_manage('user',$1::jsonb)",[JSON.stringify({id:ids[0],role:"RECRUITER",active:false})]);
      assert.equal((await service("ready",[e,c.token])).rows[0].r,false);assert.ok((await f.admin.query("select count(*)::integer as n from public.interview_mgmt_audit_logs where interview_id=$1",[interview])).rows[0].n>0);
    });
  }finally{await f.close();}
});
