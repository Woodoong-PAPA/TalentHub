"use strict";
// Optional isolated PostgreSQL runtime; no connection to the configured Supabase.
// npm install --prefix .codex-artifacts/interview-mgmt-test --no-save --package-lock=false @electric-sql/pglite
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const runtime = process.env.INTERVIEW_MGMT_PGLITE_PATH || path.join(__dirname,"../.codex-artifacts/interview-mgmt-test/node_modules/@electric-sql/pglite");
const { PGlite } = require(runtime);
const { btree_gist } = require(path.join(runtime,"dist/contrib/btree_gist.cjs"));
const ids=Array.from({length:10},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`);
let pg, interviewId;
const input={candidate_id:ids[3],department_id:ids[8],recruiter_id:ids[0],alternate_recruiter_id:ids[7],hrbp_id:ids[1],position:"가상 포지션",type:"PHONE",duration_minutes:30,mode:"ONLINE",window_start:"2026-10-13T00:00:00Z",window_end:"2026-10-15T09:00:00Z",interviewer_ids:[ids[2]]};
async function actor(id) { await pg.exec("reset role"); await pg.query("select set_config('request.jwt.claim.sub',$1,false)",[id||""]);await pg.exec("set role authenticated"); }
async function save(value=input,id=null) { return (await pg.query("select public.interview_mgmt_save_interview($1,$2::jsonb) as id",[id,JSON.stringify(value)])).rows[0].id; }
async function list() { return (await pg.query("select public.interview_mgmt_list_interviews() as item")).rows.map(row=>row.item); }
test("isolated PostgreSQL migration and database security",async t=>{
  pg=new PGlite({extensions:{btree_gist}});
  try {
    await t.test("migration executes with auth schema and leaves existing tables intact",async()=>{
      await pg.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated; create table public.existing_talenthub(id integer primary key); insert into public.existing_talenthub values(1);`);
      await pg.exec(fs.readFileSync(path.join(__dirname,"../supabase/migrations/20261012090000_interview_management_v2.sql"),"utf8"));
      assert.equal((await pg.query("select count(*) as n from public.existing_talenthub")).rows[0].n,1);
      const roles=["RECRUITER","HRBP","INTERVIEWER","CANDIDATE","HRBP","INTERVIEWER","CANDIDATE","RECRUITER"];
      for(let i=0;i<8;i++) {
        await pg.query("insert into auth.users values($1)",[ids[i]]);
        await pg.query("insert into public.interview_mgmt_users(id,name,email,role) values($1,$2,$3,$4)",[ids[i],`가상 사용자 ${i}`,`user${i}@example.test`,roles[i]]);
      }
      await pg.query("insert into public.interview_mgmt_departments(id,name) values($1,'가상 부서 A'),($2,'가상 부서 B')",[ids[8],ids[9]]);
      await pg.query("insert into public.interview_mgmt_department_access values($1,$2)",[ids[1],ids[8]]);
    });
    await t.test("recruiter creation is atomic and enforces roles, panel counts and department scope",async()=>{
      await actor(ids[0]);interviewId=await save();
      assert.equal((await list()).length,1);
      for(const patch of [{interviewer_ids:[ids[2],ids[2]]},{type:"HR"},{candidate_id:ids[2]},{hrbp_id:ids[4]},{department_id:ids[9]},{recruiter_id:ids[2]},{duration_minutes:0},{window_end:input.window_start},{alternate_recruiter_id:ids[0]}])await assert.rejects(save({...input,...patch}));
      assert.equal((await list()).length,1);
      assert.equal((await pg.query("select count(*) as n from public.interview_mgmt_participants")).rows[0].n,1);
      assert.equal((await pg.query("select count(*) as n from public.interview_mgmt_audit_logs")).rows[0].n,1);
    });
    await t.test("candidate sees only own public fields and cannot read internal tables",async()=>{
      await actor(ids[3]);const rows=await list();assert.equal(rows.length,1);
      assert.deepEqual(Object.keys(rows[0]).sort(),["id","position","type","duration_minutes","mode","status","window_start","window_end","created_at"].sort());
      for(const table of ["interviews","participants","departments","department_access","audit_logs","availability","email_drafts"])assert.equal((await pg.query(`select * from public.interview_mgmt_${table}`)).rows.length,0,table);
      assert.equal((await pg.query("select * from public.interview_mgmt_users")).rows.length,1);
      await actor(ids[6]);assert.equal((await list()).length,0);
    });
    await t.test("HRBP department grants and interviewer assignments enforce row scope",async()=>{
      for(const [id,count] of [[ids[1],1],[ids[4],0],[ids[2],1],[ids[5],0]]){await actor(id);assert.equal((await list()).length,count);}
    });
    await t.test("all non-recruiter roles are denied RPC writes and direct table writes",async()=>{
      for(const id of [ids[1],ids[2],ids[3]]) {
        await actor(id);await assert.rejects(save());
        await assert.rejects(pg.query("select public.interview_mgmt_cancel_interview($1)",[interviewId]));
        await assert.rejects(pg.query("select public.interview_mgmt_manage('department','{\"name\":\"불가\"}')"));
        await assert.rejects(pg.query("update public.interview_mgmt_users set role='RECRUITER' where id=$1",[id]));
      }
      await pg.exec("reset role; set role anon");await assert.rejects(pg.query("select public.interview_mgmt_list_interviews()"));
    });
    await t.test("management actions enforce account and assignment constraints",async()=>{
      await actor(ids[0]);
      const manage=(action,data)=>pg.query("select public.interview_mgmt_manage($1,$2::jsonb)",[action,JSON.stringify(data)]);
      await manage("department",{name:"가상 부서 C"});await manage("type",{type:"PHONE",duration_minutes:45});
      await manage("access",{user_id:ids[4],department_id:ids[9],enabled:true});
      await assert.rejects(manage("access",{user_id:ids[2],department_id:ids[8],enabled:true}));
      await assert.rejects(manage("access",{user_id:ids[1],department_id:ids[8],enabled:false}));
      await assert.rejects(manage("user",{id:ids[0],role:"CANDIDATE",active:true}));
      await assert.rejects(manage("user",{id:ids[2],role:"CANDIDATE",active:true}));
      await manage("user",{id:ids[5],role:"INTERVIEWER",active:false});
      await actor(ids[5]);await assert.rejects(list());
    });
    await t.test("edit updates panel and audit together, cancel invalidates interview",async()=>{
      await actor(ids[0]);await save({...input,position:"가상 수정 포지션"},interviewId);
      assert.equal((await list())[0].version,2);
      await pg.query("select public.interview_mgmt_cancel_interview($1)",[interviewId]);
      assert.equal((await list())[0].status,"CANCELLED");await assert.rejects(save(input,interviewId));
    });
    await t.test("reservation schema rejects overlapping resource locks and permits adjacent times",async()=>{
      await pg.exec("reset role");
      const proposal=(await pg.query("insert into public.interview_mgmt_proposals(interview_id,version,starts_at,ends_at) values($1,1,'2026-10-13 00:00Z','2026-10-13 00:30Z') returning id",[interviewId])).rows[0].id;
      const booking=(await pg.query("insert into public.interview_mgmt_bookings(interview_id,proposal_id,starts_at,ends_at) values($1,$2,'2026-10-13 00:00Z','2026-10-13 00:30Z') returning id",[interviewId,proposal])).rows[0].id;
      await pg.query("insert into public.interview_mgmt_booking_resources values($1,$2,'2026-10-13 00:00Z','2026-10-13 00:30Z',true)",[booking,ids[2]]);
      const other=(await pg.query("insert into public.interview_mgmt_bookings(interview_id,proposal_id,starts_at,ends_at,active) values($1,$2,'2026-10-13 00:30Z','2026-10-13 01:00Z',false) returning id",[interviewId,proposal])).rows[0].id;
      await assert.rejects(pg.query("insert into public.interview_mgmt_booking_resources values($1,$2,'2026-10-13 00:15Z','2026-10-13 00:45Z',true)",[other,ids[2]]));
      await pg.query("insert into public.interview_mgmt_booking_resources values($1,$2,'2026-10-13 00:30Z','2026-10-13 01:00Z',true)",[other,ids[2]]);
    });
  } finally {await pg.close();}
});
