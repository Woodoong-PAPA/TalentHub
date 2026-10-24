"use strict";
const { test } = require('node:test'), assert = require('node:assert/strict');
const { nativeFixture } = require('./interview-management-native-fixture');
const core = require('../lib/interview-management-core');
test('manual password policy and coordination start validation', () => {
  for (const value of [undefined,'short1','aaaaaaaaaaaa','123456789012','a1'.repeat(65)]) assert.throws(() => core.validateInitialPassword(value));
  assert.equal(core.validateInitialPassword('ChosenPassword!123'),'ChosenPassword!123');
  assert.deepEqual(core.coordinationStart({coordination_start_mode:'IMMEDIATE'},0),{coordination_start_mode:'IMMEDIATE',window_start:'1970-01-01T00:00:00.000Z',window_end:null});
  for (const input of [{coordination_start_mode:'OTHER'},{coordination_start_mode:'SCHEDULED'},{coordination_start_mode:'SCHEDULED',window_start:'2000-01-01'}]) assert.throws(() => core.coordinationStart(input));
});
test('native DB: optional end, scheduled activation and deferred dispatch', async t => {
  const f = await nativeFixture();
  const rpc = async (actor,sql,args=[]) => (await f.query('authenticated',f.ids[actor],sql,args)).rows;
  const data={candidate_id:f.ids[3],department_id:f.ids[8],recruiter_id:f.ids[0],alternate_recruiter_id:f.ids[4],hrbp_id:f.ids[1],position:'가상 시작 방식 검증',type:'PHONE',duration_minutes:60,mode:'ONLINE',interviewer_ids:[f.ids[2]],coordination_start_mode:'IMMEDIATE'};
  const create = async value => (await rpc(0,'select public.interview_mgmt_save_interview(null,$1::jsonb) id',[JSON.stringify(value)]))[0].id;
  const coord = (actor,id,action,value) => rpc(actor,'select public.interview_mgmt_coordinate($1,$2,$3::jsonb)',[id,action,JSON.stringify(value)]);
  try {
    let immediate, scheduled;
    await t.test('immediate mode uses DB clock and has no end, ignoring injected times', async () => {
      immediate=await create({...data,window_start:'2099-01-01',window_end:'2099-01-02'});
      const row=(await f.admin.query('select * from public.interview_mgmt_interviews where id=$1',[immediate])).rows[0];
      assert.equal(row.window_end,null);assert.equal(row.coordination_start_mode,'IMMEDIATE');assert.ok(Math.abs(Date.now()-row.window_start.getTime())<60000);
    });
    await t.test('scheduled mode rejects missing/past time directly in DB', async () => {
      await assert.rejects(create({...data,coordination_start_mode:'SCHEDULED'}));
      await assert.rejects(create({...data,coordination_start_mode:'SCHEDULED',window_start:'2000-01-01'}));
      scheduled=await create({...data,coordination_start_mode:'SCHEDULED',window_start:'2099-01-01T00:00:00Z'});
      await assert.rejects(coord(1,scheduled,'availability',{user_id:f.ids[2],starts_at:'2099-01-02',ends_at:'2099-01-03'}));
      assert.equal((await rpc(0,'select * from public.interview_mgmt_common_slots($1)',[scheduled])).length,0);
    });
    await t.test('approved future mail is deferred without attempts or failed status', async () => {
      const draft=(await rpc(0,'select public.interview_mgmt_mail_inbox() d')).map(r=>r.d).find(d=>d.interview_id===scheduled);
      await rpc(0,"select public.interview_mgmt_mail_manage('APPROVE',$1::jsonb,'')",[JSON.stringify([{id:draft.id,version:draft.version,content_version:draft.content_version}])]);
      const event=(await f.admin.query('select * from public.interview_mgmt_email_events where draft_id=$1',[draft.id])).rows[0];
      assert.equal(event.dispatch_after.toISOString(),'2099-01-01T00:00:00.000Z');
      const claim=await f.query('service_role',null,"select public.interview_mgmt_mail_claim($1,'onboarding@resend.dev') c",[event.id]);assert.equal(claim.rows[0].c,null);
      assert.equal((await f.admin.query('select attempts from public.interview_mgmt_email_events where id=$1',[event.id])).rows[0].attempts,0);
    });
    await t.test('no deadline allows distant finite availability and preserves intersection', async () => {
      await coord(1,immediate,'availability',{user_id:f.ids[2],starts_at:'2100-01-01T00:00Z',ends_at:'2100-01-01T03:00Z'});
      const slots=await rpc(0,'select * from public.interview_mgmt_common_slots($1)',[immediate]);assert.equal(slots.length,9);
      assert.equal(slots[0].starts_at.toISOString(),'2100-01-01T00:00:00.000Z');
      await assert.rejects(coord(1,immediate,'availability',{user_id:f.ids[2],starts_at:'2100-01-01',ends_at:'infinity'}));
      await coord(1,immediate,'availability',{user_id:f.ids[2],starts_at:'2101-01-01T00:00Z',ends_at:'2400-01-01T00:00Z'});
      assert.equal((await rpc(0,'select * from public.interview_mgmt_common_slots($1)',[immediate])).length,200);
    });
    await t.test('reopen immediately removes old end and scheduled mode is visible safely to candidate', async () => {
      const rows=(await rpc(3,'select public.interview_mgmt_list_interviews() d')).map(r=>r.d);
      const row=rows.find(r=>r.id===scheduled);assert.equal(row.coordination_start_mode,'SCHEDULED');assert.equal(row.window_end,null);assert.equal(row.interviewer_names,undefined);
      await coord(0,scheduled,'reopen',{coordination_start_mode:'IMMEDIATE'});
      const changed=(await f.admin.query('select coordination_start_mode,window_end from public.interview_mgmt_interviews where id=$1',[scheduled])).rows[0];assert.equal(changed.coordination_start_mode,'IMMEDIATE');assert.equal(changed.window_end,null);
    });
  } finally { await f.close(); }
});
