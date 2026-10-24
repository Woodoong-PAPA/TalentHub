"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const runtime=path.join(__dirname,"../.codex-artifacts/interview-mgmt-test/node_modules/@electric-sql/pglite");
const {PGlite}=require(runtime),{btree_gist}=require(path.join(runtime,"dist/contrib/btree_gist.cjs"));
const ids=Array.from({length:10},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`);
let pg;
async function actor(id){await pg.exec("reset role");await pg.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await pg.exec("set role authenticated");}
async function inbox(){return (await pg.query("select public.interview_mgmt_mail_inbox() as d")).rows.map(r=>r.d);}
const item=d=>({id:d.id,version:d.version,content_version:d.content_version});
async function manage(action,drafts,note=""){return pg.query("select public.interview_mgmt_mail_manage($1,$2::jsonb,$3)",[action,JSON.stringify(drafts.map(item)),note]);}
async function worker(name,args=[]){await pg.exec("reset role;set role service_role");return (await pg.query(`select public.interview_mgmt_mail_${name}(${args.map((_,i)=>`$${i+1}`).join(',')}) as result`,args)).rows[0].result;}
async function create(owner=ids[0]){await actor(ids[0]);return (await pg.query("select public.interview_mgmt_save_interview(null,$1::jsonb) as id",[JSON.stringify({candidate_id:ids[3],department_id:ids[8],recruiter_id:owner,alternate_recruiter_id:ids[4],hrbp_id:ids[1],position:"가상 포지션",type:"PHONE",duration_minutes:60,mode:"ONLINE",window_start:"2099-10-13T00:00Z",window_end:"2099-10-13T09:00Z",interviewer_ids:[ids[2],ids[5]]})])).rows[0].id;}
async function coord(id,action,data){return pg.query("select public.interview_mgmt_coordinate($1,$2,$3::jsonb)",[id,action,JSON.stringify(data)]);}
async function event(d){await pg.exec("reset role");return (await pg.query("select * from public.interview_mgmt_email_events where draft_id=$1 order by created_at desc limit 1",[d.id])).rows[0];}
test("Phase 3 email DB: generation, approval, versions, leases and reminders",async t=>{
  pg=new PGlite({extensions:{btree_gist}});
  try{
    await pg.exec("create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;");
    for(const file of ["20261012090000_interview_management_v2.sql","20261012110000_interview_management_v2_coordination.sql","20261013090000_interview_management_v2_mail.sql","20261013100000_interview_management_mail_response.sql","20261013103000_interview_management_mail_response_history.sql","20261015090000_interview_management_start_modes.sql","20261015110000_interview_management_mail_acceptance.sql","20261015120000_interview_management_slot_limit.sql"])await pg.exec(fs.readFileSync(path.join(__dirname,"../supabase/migrations",file),"utf8"));
    const roles=["RECRUITER","HRBP","INTERVIEWER","CANDIDATE","RECRUITER","INTERVIEWER","CANDIDATE","RECRUITER"];
    for(let i=0;i<8;i++){await pg.query("insert into auth.users values($1)",[ids[i]]);await pg.query("insert into public.interview_mgmt_users(id,name,email,role) values($1,$2,$3,$4)",[ids[i],`비공개 면접관 ${i}`,`fake${i}@example.test`,roles[i]]);}
    await pg.query("insert into public.interview_mgmt_departments values($1,'비공개 조직')",[ids[8]]);await pg.query("insert into public.interview_mgmt_department_access values($1,$2)",[ids[1],ids[8]]);
    let interview,draft,proposalDraft;
    await t.test("creating interview auto-generates only pending individual availability drafts",async()=>{interview=await create();const drafts=await inbox();assert.equal(drafts.length,2);assert.ok(drafts.every(d=>d.status==='PENDING'));draft=drafts[0];});
    await t.test("HRBP interviewer candidate and unrelated recruiter cannot read/approve/send",async()=>{
      for(const id of [ids[1],ids[2],ids[3]]){await actor(id);await assert.rejects(inbox());await assert.rejects(manage("APPROVE",[draft]));await assert.rejects(pg.query("select public.interview_mgmt_mail_claim($1,'test@resend.dev')",[ids[9]]));}
      await actor(ids[7]);assert.equal((await inbox()).length,0);await assert.rejects(manage("APPROVE",[draft]));
    });
    await t.test("bulk approval is atomic and alternate recruiter can approve; repeated approval cannot duplicate queue",async()=>{
      const foreign=await create(ids[7]);await actor(ids[7]);const fd=(await inbox()).find(d=>d.interview_id===foreign);await actor(ids[0]);await assert.rejects(manage("APPROVE",[draft,fd]));assert.equal((await inbox()).find(d=>d.id===draft.id).status,'PENDING');
      await actor(ids[4]);await manage("APPROVE",[draft]);await manage("APPROVE",[draft]);await pg.exec("reset role");assert.equal((await pg.query("select count(*)::integer as n from public.interview_mgmt_email_events where draft_id=$1",[draft.id])).rows[0].n,1);
    });
    await t.test("editing increases content version, removes approval and rejects stale approval",async()=>{
      await actor(ids[0]);await manage("EDIT",[draft],"가상 추가 안내");const updated=(await inbox()).find(d=>d.id===draft.id);assert.equal(updated.content_version,2);assert.equal(updated.status,'PENDING');await assert.rejects(manage("APPROVE",[draft]));draft=updated;await manage("APPROVE",[draft]);
    });
    await t.test("claim serializes sends, snapshot and idempotency key stay fixed across retry",async()=>{
      const e=await event(draft);const first=await worker("claim",[e.id,"onboarding@resend.dev"]);assert.equal(first.payload.reply_to,'fake0@example.test');assert.equal(first.payload.to.length,1);assert.equal(await worker("claim",[e.id,"other@resend.dev"]),null);assert.equal(await worker("ready",[e.id,first.token]),true);
      await worker("finish",[e.id,first.token,null,"Provider HTTP 429",null]);await actor(ids[0]);await assert.rejects(manage("EDIT",[draft],"unsafe retry edit"));
      await pg.exec("reset role");await pg.query("update public.interview_mgmt_email_events set next_attempt_at=now()-interval '1 minute' where id=$1",[e.id]);const retry=await worker("claim",[e.id,"other@resend.dev"]);assert.deepEqual(retry.payload,first.payload);assert.equal(retry.key,first.key);
      await worker("finish",[e.id,retry.token,"mock-provider",null,new Date().toISOString()]);assert.equal(await worker("claim",[e.id,"test@resend.dev"]),null);
    });
    await t.test("reminders use actual sent time; at most two with fresh approvals each",async()=>{
      assert.equal(await worker("reminders"),0);await pg.exec("reset role");await pg.query("update public.interview_mgmt_email_events set sent_at=now()-interval '25 hours' where draft_id=$1 and status='SENT'",[draft.id]);assert.equal(await worker("reminders"),1);assert.equal(await worker("reminders"),0);
      await actor(ids[0]);let reminder=(await inbox()).find(d=>d.parent_id===draft.id);assert.equal(reminder.status,'PENDING');await manage("APPROVE",[reminder]);let e=await event(reminder),claim=await worker("claim",[e.id,"onboarding@resend.dev"]);await worker("finish",[e.id,claim.token,"mock-second",null,new Date(Date.now()-25*3600000).toISOString()]);assert.equal(await worker("reminders"),1);
      await actor(ids[0]);const last=(await inbox()).find(d=>d.reminder_number===2);assert.equal(last.status,'PENDING');await manage("APPROVE",[last]);e=await event(last);claim=await worker("claim",[e.id,"onboarding@resend.dev"]);await worker("finish",[e.id,claim.token,"mock-third",null,new Date(Date.now()-25*3600000).toISOString()]);assert.equal(await worker("reminders"),0);
    });
    await t.test("availability response invalidates stale drafts and stops reminders; proposal contains no internal identity",async()=>{
      await actor(ids[1]);for(const user_id of [ids[2],ids[5]])await coord(interview,"availability",{user_id,starts_at:"2099-10-13T00:00Z",ends_at:"2099-10-13T03:00Z"});assert.equal(await worker("reminders"),0);
      await actor(ids[0]);const s=(await pg.query("select public.interview_mgmt_schedule($1) as s",[interview])).rows[0].s;await coord(interview,"publish",{version:s.version,starts:[s.common_slots[0].starts_at]});proposalDraft=(await inbox()).find(d=>d.interview_id===interview&&d.kind==='PROPOSAL');assert.ok(proposalDraft);
      for(const secret of ["비공개 면접관",'fake2@example.test','fake5@example.test','비공개 조직'])assert.equal(proposalDraft.body.includes(secret),false);
      for(const secret of ["비공개 면접관 2","fake5@example.test","비공개 조직"])await assert.rejects(manage("EDIT",[proposalDraft],secret));
    });
    await t.test("confirmation reservation remains immediate and confirmation mail waits for approval",async()=>{
      await actor(ids[3]);const s=(await pg.query("select public.interview_mgmt_schedule($1) as s",[interview])).rows[0].s;await pg.query("select public.interview_mgmt_select_proposal($1,$2)",[interview,s.proposals[0].id]);await actor(ids[0]);const drafts=await inbox();assert.equal(drafts.find(d=>d.id===proposalDraft.id).status,'INVALIDATED');assert.equal(drafts.filter(d=>d.interview_id===interview&&d.kind==='CONFIRMATION').length,4);assert.ok(drafts.filter(d=>d.kind==='CONFIRMATION').every(d=>d.status==='PENDING'));
    });
    await t.test("unknown actual sent time creates no reminder; expired idempotency window needs manual review",async()=>{
      const newInterview=await create();await actor(ids[0]);const d=(await inbox()).find(d=>d.interview_id===newInterview);await manage("APPROVE",[d]);const e=await event(d),claim=await worker("claim",[e.id,"onboarding@resend.dev"]);await worker("finish",[e.id,claim.token,"unknown-time",null,null]);assert.equal(await worker("reminders"),0);
      const other=(await create());await actor(ids[0]);const d2=(await inbox()).find(d=>d.interview_id===other);await manage("APPROVE",[d2]);const e2=await event(d2);await pg.query("update public.interview_mgmt_email_events set first_attempt_at=now()-interval '25 hours',status='FAILED' where id=$1",[e2.id]);assert.equal(await worker("claim",[e2.id,"onboarding@resend.dev"]),null);await pg.exec("reset role");assert.equal((await pg.query("select status from public.interview_mgmt_email_events where id=$1",[e2.id])).rows[0].status,'UNCERTAIN');
    });
    await t.test("candidate counterproposal counts as response and cancels pending reminder dispatch",async()=>{
      const id=await create();await actor(ids[1]);for(const user_id of [ids[2],ids[5]])await coord(id,"availability",{user_id,starts_at:"2099-10-13T04:00Z",ends_at:"2099-10-13T07:00Z"});
      await actor(ids[0]);const s=(await pg.query("select public.interview_mgmt_schedule($1) as s",[id])).rows[0].s;await coord(id,"publish",{version:s.version,starts:[s.common_slots[0].starts_at]});const d=(await inbox()).find(d=>d.interview_id===id&&d.kind==='PROPOSAL');await manage("APPROVE",[d]);let e=await event(d),claim=await worker("claim",[e.id,"onboarding@resend.dev"]);await worker("finish",[e.id,claim.token,"mock-proposal",null,new Date(Date.now()-25*3600000).toISOString()]);await worker("reminders");
      await actor(ids[0]);
      const pending=(await inbox()).find(r=>r.parent_id===d.id);assert.ok(pending);await manage("APPROVE",[pending]);e=await event(pending);
      await actor(ids[3]);await coord(id,"change_request",{kind:"COUNTER_PROPOSAL",starts_at:"2099-10-14T00:00Z",ends_at:"2099-10-14T03:00Z",reason:"가상 일정 응답"});assert.equal(await worker("claim",[e.id,"onboarding@resend.dev"]),null);assert.equal(await worker("reminders"),0);
      await actor(ids[0]);const current=(await pg.query("select public.interview_mgmt_schedule($1) as s",[id])).rows[0].s;await coord(id,"review_request",{id:current.requests[0].id,decision:"REJECT",note:"다른 일정을 다시 조율"});assert.equal((await inbox()).find(r=>r.id===d.id).valid,false);assert.equal(await worker("reminders"),0);
    });
  }finally{await pg.close();}
});
