"use strict";
// Real application API + native PostgreSQL + browser. Only Auth and email
// transport are simulated; this cannot authenticate tokens in the normal app.
const {nativeFixture}=require("./interview-management-native-fixture.js");
const {createHandler}=require("../api/interview-management/index.js");
const {processMail}=require("../lib/interview-management-mail.js");
const {chromium}=require("@playwright/test"),assert=require("node:assert/strict"),http=require("node:http"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const identifier=name=>{if(!/^[a-z_]+$/.test(name))throw Error("Invalid test identifier");return '"'+name+'"';};
async function main(){
  const f=await nativeFixture();let server,browser;
  const sent=new Map();let sendCalls=0;
  const env={SUPABASE_URL:"https://auth.example.test",SUPABASE_ANON_KEY:"test-anon",SUPABASE_SERVICE_ROLE_KEY:"test-service",INTERVIEW_MGMT_MAIL_SEND_ENABLED:"true",INTERVIEW_MGMT_RESEND_API_KEY:"not-a-real-key",INTERVIEW_MGMT_MAIL_ALLOWED_RECIPIENTS:f.ids.map((_,i)=>`fake${i}@example.test`).join(',')};
  function clientFactory(_url,key,options={}){
    const token=String(options.global?.headers?.Authorization||"").replace(/^Bearer /,'');
    const index=/^test-([0-7])$/.test(token)?Number(token.slice(5)):-1;
    const role=key==="test-service"?"service_role":"authenticated",user=index>=0?f.ids[index]:null;
    async function query(sql,args=[]){try{return {data:await f.query(role,user,sql,args)};}catch(error){return {error:{code:error.code,message:error.message}};}}
    return {auth:{getUser:async()=>index>=0?{data:{user:{id:user}}}:{error:{message:"Invalid test token"}}},
      from(table){
        if(!/^interview_mgmt_[a-z_]+$/.test(table))throw Error("Invalid test table");let columns='*',where=[],args=[],order='',limit='',single=false;
        const add=(column,operator,value)=>{args.push(value);where.push(identifier(column)+operator+'$'+args.length);};
        const q={select(cols){columns=cols.split(',').map(identifier).join(',');return q;},eq(col,val){add(col,'=',val);return q;},lte(col,val){add(col,'<=',val);return q;},is(col,val){assert.equal(val,null);where.push(identifier(col)+' is null');return q;},
          in(col,values){add(col,'=any(',values);where[where.length-1]+=')';return q;},
          or(expr){const terms=expr.split(',').map(term=>{const [col,op,...rest]=term.split('.');if(op==='is'){assert.equal(rest.join('.'),'null');return identifier(col)+' is null';}assert.equal(op,'lte');args.push(rest.join('.'));return identifier(col)+' <= $'+args.length;});where.push('('+terms.join(' or ')+')');return q;},
          order(col,opts={}){order=' order by '+identifier(col)+(opts.ascending===false?' desc':' asc');return q;},limit(n){assert.ok(Number.isInteger(n)&&n>0);limit=' limit '+n;return q;},maybeSingle(){single=true;return q;},
          async then(resolve,reject){try{const result=await query('select '+columns+' from public.'+identifier(table)+(where.length?' where '+where.join(' and '):'')+order+limit,args);resolve(result.error?result:{data:single?(result.data.rows[0]||null):result.data.rows});}catch(error){reject(error);}}};return q;
      },async rpc(name,params={}){
        if(!/^interview_mgmt_[a-z_]+$/.test(name))throw Error("Invalid test function");const args=Object.values(params).map(v=>v&&typeof v==='object'?JSON.stringify(v):v);
        const named=Object.keys(params).map((key,i)=>{if(!/^p_[a-z_]+$/.test(key))throw Error("Invalid test parameter");return key+' => $'+(i+1);});
        const result=await query('select public.'+identifier(name)+'('+named.join(',')+') as value',args);
        if(result.error)return result;return {data:["interview_mgmt_list_interviews","interview_mgmt_mail_inbox","interview_mgmt_calendar"].includes(name)?result.data.rows.map(r=>r.value):result.data.rows[0]?.value};
      }};
  }
  const provider={send:async(payload,key)=>{sendCalls++;if(!sent.has(key))sent.set(key,{id:"mock-provider-"+sent.size,payload,created:new Date().toISOString()});return sent.get(key).id;},sentTime:async id=>[...sent.values()].find(v=>v.id===id)?.created||null};
  const handler=createHandler({env,clientFactory,mailProcessor:options=>processMail({...options,provider})});
  try{
    server=http.createServer((req,res)=>{
      const url=new URL(req.url,'http://localhost');
      if(url.pathname.startsWith('/api/interview-management/')){handler(req,res);return;}
      const pathname=url.pathname==='/interview-management'?'/interview-management.html':url.pathname;
      const files=['/interview-management.html','/interview-management.css','/interview-management.js','/styles.css','/vendor/supabase.js','/vendor/supabase-global.js'];
      if(!files.includes(pathname)){res.writeHead(404);res.end();return;}
      const mime=pathname.endsWith('.html')?'text/html':pathname.endsWith('.css')?'text/css':'application/javascript';res.writeHead(200,{'Content-Type':mime+'; charset=utf-8'});res.end(fs.readFileSync(path.join(root,pathname.slice(1))));
    });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
    async function api(index,action,body,expected=200){const response=await fetch(base+'/api/interview-management/'+action,{method:body?'POST':'GET',headers:{Authorization:'Bearer test-'+index,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const result=await response.json();assert.equal(response.status,expected,JSON.stringify(result));return result;}
    const created=await api(0,'interviews',{candidate_id:f.ids[3],department_id:f.ids[8],recruiter_id:f.ids[0],alternate_recruiter_id:f.ids[4],hrbp_id:f.ids[1],position:'가상 API 통합 포지션',type:'PHONE',duration_minutes:60,mode:'ONLINE',window_start:'2099-10-13T00:00Z',window_end:'2099-10-13T09:00Z',interviewer_ids:[f.ids[2]]});
    const id=created.id;await api(3,'coordinate',{interview_id:id,action:'availability',data:{user_id:f.ids[2],starts_at:'2099-10-13T00:00Z',ends_at:'2099-10-13T03:00Z'}},403);
    await api(1,'coordinate',{interview_id:id,action:'availability',data:{user_id:f.ids[2],starts_at:'2099-10-13T00:00Z',ends_at:'2099-10-13T03:00Z'}});
    let schedule=(await api(1,'schedule?interview_id='+id)).schedule;await api(0,'coordinate',{interview_id:id,action:'publish',data:{version:schedule.version,starts:[schedule.common_slots[0].starts_at]}});
    await api(6,'schedule?interview_id='+id,null,403);await api(1,'mail/inbox',null,403);await api(3,'mail/inbox',null,403);
    const safe=await api(3,'schedule?interview_id='+id);for(const secret of ['가상 사용자 2','fake2@example.test','비공개 테스트 부서','participants','availability'])assert.equal(JSON.stringify(safe).includes(secret),false);
    browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:960}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/runtime-config.js',r=>r.fulfill({contentType:'application/javascript',body:'window.__APP_CONFIG__={supabaseUrl:"https://auth.example.test",supabaseAnonKey:"test-anon"}'}));
    await page.route('**/vendor/supabase-global.js',r=>r.fulfill({contentType:'application/javascript',body:'window.supabase={createClient(){let session=null,callback;return{auth:{getSession:async()=>({data:{session}}),signInWithPassword:async({email})=>{session={access_token:"test-"+email.match(/fake([0-7])/)[1]};return{}},signOut:async()=>{session=null;callback?.("SIGNED_OUT");return{}},onAuthStateChange:cb=>{callback=cb}}}}}'}));
    await page.goto(base+'/interview-management');await page.getByLabel('아이디 (이메일)').fill('fake3@example.test');await page.getByLabel('비밀번호',{exact:true}).fill('TestOnlyPassword!');await page.getByRole('button',{name:'로그인',exact:true}).click();await page.getByRole('button',{name:'상세',exact:true}).click();await page.getByRole('button',{name:'이 시간 선택',exact:true}).waitFor();
    page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'이 시간 선택',exact:true}).click();await page.getByText('면접 일정이 확정되었습니다.',{exact:false}).waitFor();
    const content=await page.locator('#im-content').innerText();for(const secret of ['가상 사용자 2','fake2@example.test','비공개 테스트 부서'])assert.equal(content.includes(secret),false);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const booking=(await api(3,'schedule?interview_id='+id)).schedule.booking;assert.ok(booking);assert.equal((await api(3,'calendar')).bookings.length,1);
    await page.getByRole('button',{name:'로그아웃',exact:true}).click();await page.getByLabel('아이디 (이메일)').fill('fake0@example.test');await page.getByLabel('비밀번호',{exact:true}).fill('TestOnlyPassword!');await page.getByRole('button',{name:'로그인',exact:true}).click();await page.getByRole('button',{name:'이메일 승인함',exact:true}).click();await page.getByRole('button',{name:'승인 대기 전체 선택',exact:true}).click();await page.getByRole('button',{name:'선택한 초안 일괄 승인',exact:true}).click();await page.getByText('선택한 초안을 승인했습니다.',{exact:true}).waitFor();
    const [a,b]=await Promise.all([api(0,'mail/process',{}),api(4,'mail/process',{})]);assert.equal(a.sent+b.sent,3);assert.equal(sent.size,3);assert.equal(sendCalls,3);
    await page.getByRole('button',{name:'새로고침',exact:true}).click();await page.getByText('초안 목록을 갱신했습니다.',{exact:true}).waitFor();assert.equal(await page.getByText('전송 접수',{exact:true}).count(),3);assert.deepEqual(errors,[]);
    const candidateMail=[...sent.values()].find(m=>m.payload.to[0]==='fake3@example.test');for(const secret of ['가상 사용자 2','fake2@example.test','비공개 테스트 부서'])assert.equal(JSON.stringify(candidateMail).includes(secret),false);
    assert.equal((await api(0,'mail/process',{})).sent,0);await api(-1,'bootstrap',null,401);
    console.log('PASS API/native DB/browser integration: role/RLS, proxy availability, proposal, candidate booking/privacy, calendar, bulk approval, concurrent workers and no resend');
  }finally{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));await f.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
