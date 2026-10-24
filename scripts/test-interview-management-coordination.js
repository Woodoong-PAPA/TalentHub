"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),net=require("node:net"),os=require("node:os");
const {pathToFileURL}=require("node:url");
const {randomUUID}=require("node:crypto");
const ids=Array.from({length:12},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`);
const windowStart="2099-10-13T00:00:00Z",windowEnd="2099-10-13T09:00:00Z";
let pg,server;
const native=process.env.INTERVIEW_MGMT_NATIVE==="1";
async function actor(id,client=pg){await client.query("reset role");await client.query("select set_config('request.jwt.claim.sub',$1,false)",[id||""]);await client.query("set role authenticated");}
async function coord(id,action,data,client=pg){return (await client.query("select public.interview_mgmt_coordinate($1,$2,$3::jsonb) as result",[id,action,JSON.stringify(data)])).rows[0].result;}
async function schedule(id){return (await pg.query("select public.interview_mgmt_schedule($1) as schedule",[id])).rows[0].schedule;}
async function create(candidate=ids[3],panel=[ids[2],ids[5]]){await actor(ids[0]);return (await pg.query("select public.interview_mgmt_save_interview(null,$1::jsonb) as id",[JSON.stringify({candidate_id:candidate,department_id:ids[8],recruiter_id:ids[0],hrbp_id:ids[1],position:"가상 개발자",type:"TECHNICAL",duration_minutes:60,mode:"ONLINE",window_start:windowStart,window_end:windowEnd,interviewer_ids:panel})])).rows[0].id;}
async function fill(id){await actor(ids[1]);for(const user_id of (await schedule(id)).participants.map(p=>p.id))await coord(id,"availability",{user_id,starts_at:windowStart,ends_at:windowEnd});}
async function publish(id,start){await actor(ids[0]);const s=await schedule(id);await coord(id,"publish",{version:s.version,starts:[start||s.common_slots[0].starts_at]});return (await schedule(id)).proposals[0].id;}
async function choose(id,proposal,client=pg){return (await client.query("select public.interview_mgmt_select_proposal($1,$2) as booking",[id,proposal])).rows[0].booking;}
async function init(){
  if(native){
    const runtime=process.env.INTERVIEW_MGMT_NATIVE_PATH||path.join(os.tmpdir(),"talenthub-interview-native-runtime/node_modules");
    const {default:EmbeddedPostgres}=await import(pathToFileURL(require.resolve("embedded-postgres",{paths:[runtime]})).href);
    const port=await new Promise((resolve,reject)=>{const probe=net.createServer();probe.on("error",reject);probe.listen(0,"127.0.0.1",()=>{const value=probe.address().port;probe.close(()=>resolve(value));});});
    server=new EmbeddedPostgres({databaseDir:path.join(os.tmpdir(),`talenthub-interview-mgmt-test-${randomUUID()}`),user:"postgres",password:randomUUID(),port,persistent:true,initdbFlags:["--locale=C","--encoding=UTF8"],postgresFlags:["-h","127.0.0.1"],onLog:()=>{},onError:()=>{}});
    await server.initialise();await server.start();pg=server.getPgClient();await pg.connect();pg.exec=sql=>pg.query(sql);
  }else{
    const runtime=path.join(__dirname,"../.codex-artifacts/interview-mgmt-test/node_modules/@electric-sql/pglite");
    const {PGlite}=require(runtime),{btree_gist}=require(path.join(runtime,"dist/contrib/btree_gist.cjs"));pg=new PGlite({extensions:{btree_gist}});
  }
  await pg.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`);
  for(const file of ["20261012090000_interview_management_v2.sql","20261012110000_interview_management_v2_coordination.sql","20261013090000_interview_management_v2_mail.sql","20261013100000_interview_management_mail_response.sql","20261013103000_interview_management_mail_response_history.sql","20261015090000_interview_management_start_modes.sql","20261015110000_interview_management_mail_acceptance.sql","20261015120000_interview_management_slot_limit.sql"])await pg.exec(fs.readFileSync(path.join(__dirname,"../supabase/migrations",file),"utf8"));
  const roles=["RECRUITER","HRBP","INTERVIEWER","CANDIDATE","HRBP","INTERVIEWER","CANDIDATE","INTERVIEWER"];
  for(let i=0;i<roles.length;i++){await pg.query("insert into auth.users values($1)",[ids[i]]);await pg.query("insert into public.interview_mgmt_users(id,email,name,role) values($1,$2,$3,$4)",[ids[i],`fake${i}@example.test`,`가상 사용자 ${i}`,roles[i]]);}
  for(const index of [10,11]){await pg.query("insert into auth.users values($1)",[ids[index]]);await pg.query("insert into public.interview_mgmt_users(id,email,name,role) values($1,$2,$3,'INTERVIEWER')",[ids[index],`fake${index}@example.test`,`가상 면접관 ${index}`]);}
  await pg.query("insert into public.interview_mgmt_departments(id,name) values($1,'가상 부서')",[ids[8]]);
  await pg.query("insert into public.interview_mgmt_department_access values($1,$2)",[ids[1],ids[8]]);
}
test(`Phase 2 coordination database (${native?"native PostgreSQL":"PGlite"})`,async t=>{
  try{
    await init();let interview,proposal,booking;
    await t.test("migration, mixed direct/proxy entry, adjacent ranges and complete-panel intersection",async()=>{
      interview=await create();await actor(ids[2]);await coord(interview,"availability",{user_id:ids[2],starts_at:windowStart,ends_at:"2099-10-13T01:00:00Z"});
      assert.equal((await schedule(interview)).common_slots.length,0);
      await actor(ids[1]);await coord(interview,"availability",{user_id:ids[2],starts_at:"2099-10-13T01:00:00Z",ends_at:"2099-10-13T03:00:00Z"});await coord(interview,"availability",{user_id:ids[5],starts_at:"2099-10-13T00:30:00Z",ends_at:"2099-10-13T02:30:00Z"});
      const s=await schedule(interview);assert.equal(new Date(s.common_slots[0].starts_at).toISOString(),"2099-10-13T00:30:00.000Z");assert.equal(s.common_slots.length,5);
      assert.ok(s.availability.some(a=>a.entered_by===a.user_id));assert.ok(s.availability.some(a=>a.entered_by!==a.user_id));
    });
    await t.test("role/department/assignment checks protect reads, proxy edits and direct input requests",async()=>{
      await actor(ids[2]);await assert.rejects(coord(interview,"availability",{user_id:ids[5],starts_at:windowStart,ends_at:windowEnd}));
      await actor(ids[4]);await assert.rejects(schedule(interview));await assert.rejects(coord(interview,"request_availability",{user_id:ids[2]}));
      await actor(ids[1]);await coord(interview,"request_availability",{user_id:ids[2]});await coord(interview,"request_availability",{user_id:ids[2]});assert.equal((await schedule(interview)).availability_requests.length,1);
      await actor(ids[2]);const s=await schedule(interview);await coord(interview,"availability",{id:s.availability.find(a=>a.user_id===ids[2]).id,user_id:ids[2],starts_at:windowStart,ends_at:"2099-10-13T01:00:00Z"});assert.ok((await schedule(interview)).availability_requests[0].resolved_at);
      await actor(ids[7]);await assert.rejects(schedule(interview));
    });
    await t.test("proposal publishing validates intersection/version and availability updates invalidate proposals",async()=>{
      await actor(ids[0]);let s=await schedule(interview);await assert.rejects(coord(interview,"publish",{version:s.version,starts:["2099-10-13T08:00:00Z"]}));await assert.rejects(coord(interview,"publish",{version:s.version-1,starts:[s.common_slots[0].starts_at]}));
      proposal=await publish(interview);await actor(ids[5]);s=await schedule(interview);const a=s.availability.find(a=>a.user_id===ids[5]);await coord(interview,"availability",{id:a.id,user_id:ids[5],starts_at:a.starts_at,ends_at:a.ends_at});
      await actor(ids[3]);await assert.rejects(choose(interview,proposal));assert.equal((await schedule(interview)).proposals.length,0);
      proposal=await publish(interview);
    });
    await t.test("candidate schedule and calendar redact internal names, IDs and audit data",async()=>{
      await actor(ids[3]);const s=await schedule(interview);for(const key of ["participants","availability","availability_requests","common_slots","reviewed_by","department_id"])assert.equal(JSON.stringify(s).includes(key),false);
      await actor(ids[6]);await assert.rejects(schedule(interview));
    });
    await t.test("first valid selection immediately reserves every participant, retries are idempotent",async()=>{
      await actor(ids[3]);booking=await choose(interview,proposal);assert.equal(booking.confirmed,true);assert.equal((await choose(interview,proposal)).id,booking.id);
      const s=await schedule(interview);assert.equal(s.booking.id,booking.id);assert.equal(s.proposals.length,0);
      await pg.exec("reset role");assert.equal((await pg.query("select count(*)::integer as n from public.interview_mgmt_booking_resources where booking_id=$1 and active",[booking.id])).rows[0].n,3);
      await actor(ids[3]);const calendar=(await pg.query("select public.interview_mgmt_calendar() as row")).rows[0].row;assert.equal(calendar.interview_id,interview);assert.equal(JSON.stringify(calendar).includes("name"),false);
    });
    await t.test("counterproposal/HRBP review/recruiter decision keep existing reservation until replacement succeeds",async()=>{
      await actor(ids[3]);await coord(interview,"change_request",{kind:"COUNTER_PROPOSAL",starts_at:"2099-10-14T00:00:00Z",ends_at:"2099-10-14T03:00:00Z",reason:"가상 일정 역제안"});const request=(await schedule(interview)).requests[0];
      await actor(ids[1]);await assert.rejects(coord(interview,"review_request",{id:request.id,decision:"ACCEPT",note:""}));await coord(interview,"review_request",{id:request.id,decision:"REVIEW",note:"가상 검토"});
      await actor(ids[0]);await coord(interview,"review_request",{id:request.id,decision:"ACCEPT",note:"재조율"});assert.equal((await schedule(interview)).booking.id,booking.id);
      await actor(ids[1]);for(const user_id of [ids[2],ids[5]])await coord(interview,"availability",{user_id,starts_at:"2099-10-14T00:00:00Z",ends_at:"2099-10-14T03:00:00Z"});const next=await publish(interview,"2099-10-14T00:00:00+00:00");
      await actor(ids[3]);const replacement=await choose(interview,next);assert.notEqual(replacement.id,booking.id);await pg.exec("reset role");assert.equal((await pg.query("select active from public.interview_mgmt_bookings where id=$1",[booking.id])).rows[0].active,false);
      booking=replacement;
    });
    await t.test("duplicate proposals for two candidates are allowed; losing choice fails and old booking survives",async()=>{
      const first=await create(ids[3]),second=await create(ids[6]);await fill(first);await fill(second);const p1=await publish(first,"2099-10-13T07:00:00+00:00"),p2=await publish(second,"2099-10-13T07:00:00+00:00");
      await actor(ids[3]);await choose(first,p1);await actor(ids[6]);await assert.rejects(choose(second,p2),error=>error.code==="23P01");assert.equal((await schedule(second)).booking,null);
      // A failed replacement leaves both the original reservation and locks intact.
      await actor(ids[0]);await coord(interview,"reopen",{starts_at:windowStart,ends_at:windowEnd});await fill(interview);
      // Publish another valid slot, then reserve it elsewhere before replacement.
      const pOld=await publish(interview,"2099-10-13T05:00:00+00:00");const competitor=await create(ids[6]);await fill(competitor);const pc=await publish(competitor,"2099-10-13T05:00:00+00:00");await actor(ids[6]);await choose(competitor,pc);
      await actor(ids[3]);await assert.rejects(choose(interview,pOld),error=>error.code==="23P01");assert.equal((await schedule(interview)).booking.id,booking.id);
    });
    if(native)await t.test("two real DB connections contend for the same panel; only committed first choice wins",async()=>{
      const first=await create(ids[3]),second=await create(ids[6]);await fill(first);await fill(second);const p1=await publish(first,"2099-10-13T03:00:00+00:00"),p2=await publish(second,"2099-10-13T03:00:00+00:00");
      const a=server.getPgClient(),b=server.getPgClient();await a.connect();await b.connect();
      try{
        await a.query("begin");await actor(ids[3],a);await choose(first,p1,a);
        await b.query("begin");await actor(ids[6],b);let settled=false;
        const pending=choose(second,p2,b).then(value=>{settled=true;return {value};},error=>{settled=true;return {error};});
        await new Promise(resolve=>setTimeout(resolve,100));assert.equal(settled,false,"second transaction must wait on resource locks");
        await a.query("commit");const result=await pending;assert.equal(result.error?.code,"23P01");await b.query("rollback");
      }finally{await a.query("rollback");await b.query("rollback");await a.end();await b.end();}
    });
    await t.test("candidate resource also prevents overlapping interviews with disjoint panels",async()=>{
      const first=await create(ids[3]),second=await create(ids[3],[ids[10],ids[11]]);await fill(first);await fill(second);const p1=await publish(first,"2099-10-13T08:00:00+00:00"),p2=await publish(second,"2099-10-13T08:00:00+00:00");
      await actor(ids[3]);await choose(first,p1);await assert.rejects(choose(second,p2),error=>error.code==="23P01");
    });
    if(native)await t.test("rolled-back first attempt frees its locks and the waiting valid choice succeeds",async()=>{
      const first=await create(ids[3]),second=await create(ids[6]);await fill(first);await fill(second);const p1=await publish(first,"2099-10-13T01:30:00+00:00"),p2=await publish(second,"2099-10-13T01:30:00+00:00");
      const a=server.getPgClient(),b=server.getPgClient();await a.connect();await b.connect();
      try{
        await a.query("begin");await actor(ids[3],a);await choose(first,p1,a);await b.query("begin");await actor(ids[6],b);
        const pending=choose(second,p2,b);await new Promise(resolve=>setTimeout(resolve,100));await a.query("rollback");const result=await pending;assert.equal(result.confirmed,true);await b.query("commit");
        await actor(ids[3]);assert.equal((await schedule(first)).booking,null);await actor(ids[6]);assert.equal((await schedule(second)).booking.id,result.id);
      }finally{await a.query("rollback");await b.query("rollback");await a.end();await b.end();}
    });
    await t.test("cancel releases the retained reservation and stale proposals cannot reserve again",async()=>{
      await actor(ids[0]);await pg.query("select public.interview_mgmt_cancel_interview($1)",[interview]);
      await actor(ids[3]);assert.equal((await schedule(interview)).booking,null);await assert.rejects(choose(interview,proposal));
      await pg.exec("reset role");assert.equal((await pg.query("select count(*)::integer as n from public.interview_mgmt_booking_resources r join public.interview_mgmt_bookings b on b.id=r.booking_id where b.interview_id=$1 and r.active",[interview])).rows[0].n,0);
    });
  }finally{if(native){if(pg)await pg.end();if(server)await server.stop();}else if(pg)await pg.close();}
});
