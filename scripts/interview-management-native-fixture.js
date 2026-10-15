"use strict";
const fs=require("node:fs"),path=require("node:path"),os=require("node:os"),net=require("node:net");
const {randomUUID}=require("node:crypto"),{pathToFileURL}=require("node:url");
async function nativeFixture(){
  const runtime=process.env.INTERVIEW_MGMT_NATIVE_PATH||path.join(os.tmpdir(),"talenthub-interview-native-runtime/node_modules");
  const {default:EmbeddedPostgres}=await import(pathToFileURL(require.resolve("embedded-postgres",{paths:[runtime]})).href);
  const port=await new Promise((resolve,reject)=>{const s=net.createServer();s.on("error",reject);s.listen(0,"127.0.0.1",()=>{const n=s.address().port;s.close(()=>resolve(n));});});
  const server=new EmbeddedPostgres({databaseDir:path.join(os.tmpdir(),`talenthub-interview-integration-${randomUUID()}`),user:"postgres",password:randomUUID(),port,persistent:true,initdbFlags:["--locale=C","--encoding=UTF8"],postgresFlags:["-h","127.0.0.1"],onLog:()=>{},onError:()=>{}});
  await server.initialise();await server.start();const admin=server.getPgClient();await admin.connect();
  await admin.query("create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;");
  const migrations=fs.readdirSync(path.join(__dirname,"../supabase/migrations")).filter(n=>/^202610\d+_interview_management.*\.sql$/.test(n)).sort();
  for(const name of migrations)await admin.query(fs.readFileSync(path.join(__dirname,"../supabase/migrations",name),"utf8"));
  const ids=Array.from({length:10},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`);
  const roles=["RECRUITER","HRBP","INTERVIEWER","CANDIDATE","RECRUITER","INTERVIEWER","CANDIDATE","RECRUITER"];
  for(let i=0;i<roles.length;i++){await admin.query("insert into auth.users values($1)",[ids[i]]);await admin.query("insert into public.interview_mgmt_users(id,email,name,role) values($1,$2,$3,$4)",[ids[i],`fake${i}@example.test`,`가상 사용자 ${i}`,roles[i]]);}
  await admin.query("insert into public.interview_mgmt_departments values($1,'비공개 테스트 부서')",[ids[8]]);await admin.query("insert into public.interview_mgmt_department_access values($1,$2)",[ids[1],ids[8]]);
  async function client(role="authenticated",id=ids[0]){const c=server.getPgClient();await c.connect();await c.query("set role "+role);if(role==="authenticated")await c.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);return c;}
  async function query(role,id,sql,args=[]){const c=await client(role,id);try{return await c.query(sql,args);}finally{await c.end();}}
  return {server,admin,ids,roles,client,query,close:async()=>{await admin.end();await server.stop();}};
}
module.exports={nativeFixture};
