"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {nativeFixture}=require('./interview-management-native-fixture');
const {safeMember,legacyMatches}=require('../api/talent-auth');
const {createHash}=require('node:crypto');
test('password verification and public membership never expose hashes',()=>{
 const hash=createHash('sha256').update('fake@example.test:FakePassword123!').digest('hex');
 assert(legacyMatches('fake@example.test','FakePassword123!',hash));assert(!legacyMatches('fake@example.test','wrong',hash));assert(!legacyMatches('fake@example.test','wrong','bad'));
 assert(!('password_hash' in safeMember({password_hash:hash,profile:{passwordHash:hash}})));assert(!('profile' in safeMember({profile:{password:'secret'}})));
});
test('canonical membership migration and database enforcement',async t=>{
 const f=await nativeFixture(),db=f.admin,ids=f.ids;
 try{
  await db.query(`alter table auth.users add column email text;update auth.users a set email=u.email from public.interview_mgmt_users u where u.id=a.id;
   create table public.app_members(id text primary key,auth_user_id uuid,email text unique not null,name text not null,role text not null,status text not null,department text,position text,phone text,requested_at timestamptz default now(),approved_at timestamptz,approved_by text,last_login_at timestamptz,note text,profile jsonb not null default '{}',password_hash text,business_unit text);
   create table public.app_role_permissions(role text,view text check(view in ('dashboard','members')),enabled boolean default true,primary key(role,view));
   grant all on public.app_members,public.app_role_permissions to anon,authenticated;
   insert into public.app_members(id,email,name,role,status,password_hash) values('legacy-admin','fake0@example.test','기존 관리자','admin','active','legacy-hash');`);
  await db.query(fs.readFileSync(path.join(__dirname,'../supabase/migrations/20261016090000_talenthub_unified_members.sql'),'utf8'));
  const rpc=(who,action,id,data={})=>db.query('select public.interview_mgmt_member_manage($1,$2,$3,$4::jsonb) as member',[who,action,id,JSON.stringify(data)]);
  await t.test('imports preserve identity and legacy password requires verified linking',async()=>{
   assert.equal((await db.query('select count(*)::int n from app_members')).rows[0].n,8);
   assert.equal((await f.query('authenticated',ids[0],'select public.interview_mgmt_role() as role')).rows[0].role,null);
   await assert.rejects(db.query('select public.interview_mgmt_link_member($1,$2,$3)',['legacy-admin',ids[0],'wrong']));
   await db.query('select public.interview_mgmt_link_member($1,$2,$3)',['legacy-admin',ids[0],'legacy-hash']);
   assert.equal((await f.query('authenticated',ids[0],'select public.interview_mgmt_role() as role')).rows[0].role,'RECRUITER');
  });
  await t.test('browser cannot read hashes or mutate canonical or separate membership',async()=>{
   for(const role of ['anon','authenticated']){
    await assert.rejects(f.query(role,ids[0],'select * from app_members'));
    await assert.rejects(f.query(role,ids[0],"update app_members set role='admin'"));
    await assert.rejects(f.query(role,ids[0],"update app_role_permissions set enabled=true"));
    await assert.rejects(f.query(role,ids[0],"select interview_mgmt_member_manage($1,'delete','legacy-admin','{}')",[ids[0]]));
   }
   await assert.rejects(f.query('authenticated',ids[0],"select interview_mgmt_manage('user',$1)",[JSON.stringify({id:ids[3],role:'RECRUITER',active:true})]));
   await assert.rejects(f.query('authenticated',ids[0],"select interview_mgmt_manage_internal('user',$1)",[JSON.stringify({id:ids[3],role:'RECRUITER',active:true})]));
  });
  await t.test('SQL rechecks caller and disallows self escalation',async()=>{
   await assert.rejects(rpc(ids[3],'update','legacy-admin',{role:'applicant'}));
   await assert.rejects(rpc(ids[3],'update','interview-'+ids[3],{role:'admin'}));
   await assert.rejects(rpc(ids[0],'update','legacy-admin',{status:'suspended'}));
  });
  await t.test('status and HRBP grants reflect canonical writes immediately',async()=>{
   await rpc(ids[0],'update','interview-'+ids[1],{status:'suspended'});
   assert.equal((await f.query('authenticated',ids[1],'select interview_mgmt_role() as role')).rows[0].role,null);
   await rpc(ids[0],'update','interview-'+ids[1],{status:'active',profile:{interviewRole:'HRBP'}});
   assert.equal((await f.query('authenticated',ids[1],'select interview_mgmt_role() as role')).rows[0].role,'HRBP');
   await rpc(ids[0],'update','interview-'+ids[1],{profile:{interviewRole:'INTERVIEWER'}});
   assert.equal((await db.query('select count(*)::int n from interview_mgmt_department_access where user_id=$1',[ids[1]])).rows[0].n,0);
  });
  await t.test('deletion revokes access and keeps interview identities',async()=>{
   await rpc(ids[0],'delete','interview-'+ids[5]);
   assert.equal((await db.query('select active from interview_mgmt_users where id=$1',[ids[5]])).rows[0].active,false);
   assert.equal((await f.query('authenticated',ids[5],'select interview_mgmt_role() as role')).rows[0].role,null);
  });
 }finally{await f.close();}
});
