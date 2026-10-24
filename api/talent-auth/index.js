"use strict";
const {createClient}=require('@supabase/supabase-js');
const {createHash,timingSafeEqual,randomUUID}=require('node:crypto');
const OPTIONS={auth:{persistSession:false,autoRefreshToken:false}};
const ROLES=['applicant','general','search_firm','hiring_manager','business_recruiter','division_recruiter','admin'];
const RECRUITERS=['admin','division_recruiter','business_recruiter'];
const INTERVIEW_ROLES=['RECRUITER','HRBP','INTERVIEWER','CANDIDATE'];
function fail(message,status=400){throw Object.assign(new Error(message),{status});}
function unwrap(r){if(r.error)fail('회원 정보를 처리하지 못했습니다.',400);return r.data;}
function safeMember(m){
  return {id:m.id,authUserId:m.auth_user_id,email:m.email,name:m.name,role:m.role,status:m.status,
    businessUnit:m.business_unit||'',department:m.department||'',position:m.position||'',phone:m.phone||'',note:m.note||'',
    requestedAt:m.requested_at,approvedAt:m.approved_at,approvedBy:m.approved_by,lastLoginAt:m.last_login_at,
    interviewRole:m.profile?.interviewRole||''};
}
function legacyMatches(email,password,hash){
  if(!/^[a-f0-9]{64}$/i.test(hash||''))return false;
  const actual=createHash('sha256').update(email+':'+password).digest();return timingSafeEqual(actual,Buffer.from(hash,'hex'));
}
function profileInput(input){
  if(!input||typeof input!=='object'||Array.isArray(input))fail('회원 정보를 확인해주세요.');
  const out={};
  for(const key of ['name','department','position','phone','note','businessUnit']){
    if(input[key]!==undefined){if(typeof input[key]!=='string'||input[key].length>(key==='note'?2000:200))fail('회원 입력값을 확인해주세요.');out[key]=input[key].trim();}
  }
  return out;
}
function passwordInput(value){if(typeof value!=='string'||value.length<8||value.length>128)fail('비밀번호는 8~128자로 입력해주세요.');return value;}
async function readBody(req){
  if(req.body&&typeof req.body==='object'&&!Buffer.isBuffer(req.body)){if(Array.isArray(req.body)||Buffer.byteLength(JSON.stringify(req.body))>16384)fail('잘못된 요청입니다.');return req.body;}
  let raw=typeof req.body==='string'?req.body:'';
  if(!raw)for await(const chunk of req){raw+=chunk.toString();if(Buffer.byteLength(raw)>16384)fail('요청이 너무 큽니다.',413);}
  if(Buffer.byteLength(raw)>16384)fail('요청이 너무 큽니다.',413);
  try{const value=JSON.parse(raw||'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value;}catch{fail('잘못된 요청입니다.');}
}
function createHandler({env=process.env,clientFactory=createClient}={}){
  return async(req,res)=>{
    let status=200,payload;
    try{
      if(env.TALENT_AUTH_UNIFIED_ENABLED!=='true')fail('통합 회원 인증이 활성화되지 않았습니다.',503);
      const url=env.INTERVIEW_MGMT_SUPABASE_URL||env.SUPABASE_URL;
      const anon=env.INTERVIEW_MGMT_SUPABASE_ANON_KEY||env.SUPABASE_ANON_KEY;
      const key=env.INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY||env.SUPABASE_SERVICE_ROLE_KEY;
      if(!url||!anon||!key)fail('서버 회원 인증 설정이 필요합니다.',503);
      const db=clientFactory(url,key,OPTIONS),authClient=()=>clientFactory(url,anon,OPTIONS);
      const parsed=new URL(req.url,'http://localhost');
      const route=(parsed.searchParams.get('route')||parsed.pathname.replace(/^\/api\//,'')).replace(/^talent-auth\/?/,'').replace(/\/$/,'')||'session';
      const methods={login:'POST',signup:'POST',session:'GET',members:'GET','members/create':'POST','members/update':'POST','members/delete':'POST','members/reset-password':'POST',permissions:'POST'};
      if(!methods[route])fail('API를 찾을 수 없습니다.',404);
      if(req.method!==methods[route])fail('허용되지 않은 요청입니다.',405);
      const body=req.method==='POST'?await readBody(req):{};
      let actor,token;
      if(!['login','signup'].includes(route)){
        token=String(req.headers.authorization||'').match(/^Bearer (\S+)$/)?.[1];
        if(!token)fail('로그인이 필요합니다.',401);
        const identity=await authClient().auth.getUser(token);
        if(identity.error||!identity.data?.user)fail('로그인이 만료되었습니다.',401);
        actor=unwrap(await db.from('app_members').select('*').eq('auth_user_id',identity.data.user.id).maybeSingle());
        if(!actor||actor.status!=='active'||actor.password_hash)fail('기존 Talent Pool 계정으로 다시 로그인해주세요.',403);
      }
      if(route==='login'){
        const email=String(body.email||'').trim().toLowerCase(),password=body.password;
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=='string'||password.length>128)fail('이메일 또는 비밀번호가 일치하지 않습니다.',401);
        const limited=unwrap(await db.rpc('interview_mgmt_login_limit',{p_key:createHash('sha256').update(email).digest('hex')}));
        if(!limited)fail('로그인 시도가 많습니다. 잠시 후 다시 시도해주세요.',429);
        const member=unwrap(await db.from('app_members').select('*').eq('email',email).maybeSingle());
        if(!member||member.status!=='active')fail('이메일·비밀번호 또는 회원 승인 상태를 확인해주세요.',401);
        if(member.password_hash){
          if(!legacyMatches(email,password,member.password_hash))fail('이메일 또는 비밀번호가 일치하지 않습니다.',401);
          let id=member.auth_user_id||unwrap(await db.rpc('interview_mgmt_find_auth',{p_email:email}));
          if(id){
            const existing=await authClient().auth.signInWithPassword({email,password});
            if(existing.error||existing.data?.user?.id!==id)fail('기존 계정과 면접 계정의 비밀번호가 다릅니다. 관리자 메뉴에서 비밀번호를 초기화해주세요.',401);
          }else id=unwrap(await db.auth.admin.createUser({email,password,email_confirm:true})).user.id;
          unwrap(await db.rpc('interview_mgmt_link_member',{p_id:member.id,p_auth:id,p_expected_hash:member.password_hash}));
          member.auth_user_id=id;
        }
        const signed=await authClient().auth.signInWithPassword({email,password});
        if(signed.error||!signed.data?.session||signed.data.user.id!==member.auth_user_id)fail('이메일 또는 비밀번호가 일치하지 않습니다.',401);
        const current=unwrap(await db.from('app_members').select('*').eq('id',member.id).maybeSingle());
        if(current.status!=='active')fail('회원 권한이 변경되었습니다.',403);
        payload={session:signed.data.session,member:safeMember(current)};
      }else if(route==='session')payload={member:safeMember(actor)};
      else if(route==='members'){
        const rows=RECRUITERS.includes(actor.role)?unwrap(await db.from('app_members').select('*').order('name')):[actor];
        payload={members:rows.map(safeMember)};
      }else if(route==='signup'||route==='members/create'){
        const input=body.member||{},fields=profileInput(input),email=String(input.email||'').trim().toLowerCase();
        const password=passwordInput(body.password);
        if(!fields.name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail('이름과 이메일을 확인해주세요.');
        const role=ROLES.includes(input.role)?input.role:'general';
        if(route==='signup'&&role==='admin')fail('관리자 가입 신청은 허용되지 않습니다.',403);
        if(route!=='signup'&&(!RECRUITERS.includes(actor.role)||(actor.role!=='admin'&&!['applicant','search_firm','hiring_manager'].includes(role))))fail('계정 생성 권한이 없습니다.',403);
        const interviewRole=route==='signup'?'':String(input.interviewRole||'');
        if(interviewRole&&actor?.role!=='admin')fail('면접 권한 별도 지정은 관리자만 가능합니다.',403);
        if(interviewRole&&!INTERVIEW_ROLES.includes(interviewRole))fail('면접 권한을 확인해주세요.');
        const auth=unwrap(await db.auth.admin.createUser({email,password,email_confirm:true}));
        const row={id:'member-'+randomUUID(),auth_user_id:auth.user.id,email,name:fields.name,role,status:route==='signup'?'pending':'active',
          business_unit:fields.businessUnit||null,department:fields.department||null,position:fields.position||null,phone:fields.phone||null,note:fields.note||null,
          profile:{interviewRole},approved_by:actor?.name||null,approved_at:actor?new Date().toISOString():null};
        const saved=await db.rpc('interview_mgmt_member_manage',{p_actor:actor?.auth_user_id||null,p_action:route==='signup'?'signup':'create',p_id:null,p_data:row});
        if(saved.error){await db.auth.admin.deleteUser(auth.user.id);fail('계정 저장에 실패했습니다.');}
        payload={member:safeMember(saved.data)};
      }else if(route==='permissions'){
        if(actor.role!=='admin')fail('관리자 권한이 필요합니다.',403);
        if(!Array.isArray(body.rows)||body.rows.length>500||body.rows.some(r=>!ROLES.includes(r.role)||typeof r.view!=='string'||r.view.length>80||typeof r.enabled!=='boolean'))fail('메뉴 권한을 확인해주세요.');
        unwrap(await db.rpc('interview_mgmt_member_manage',{p_actor:actor.auth_user_id,p_action:'permissions',p_id:null,p_data:{rows:body.rows.map(r=>({role:r.role,view:r.view,enabled:r.enabled}))}}));payload={};
      }else{
        const target=unwrap(await db.from('app_members').select('*').eq('id',String(body.id||'')).maybeSingle());
        if(!target)fail('회원을 찾을 수 없습니다.',404);
        if(route==='members/update'){
          const input=body.member||{},fields=profileInput(input),self=target.id===actor.id;
          if(actor.role!=='admin'&&!self)fail('관리자 권한이 필요합니다.',403);
          const patch={};for(const [src,dst]of Object.entries({name:'name',businessUnit:'business_unit',department:'department',position:'position',phone:'phone',note:'note'}))if(fields[src]!==undefined)patch[dst]=fields[src];
          if(actor.role==='admin'){
            if(input.role!==undefined){if(!ROLES.includes(input.role))fail('등급을 확인해주세요.');if(self&&input.role!==actor.role)fail('본인 등급을 변경할 수 없습니다.');patch.role=input.role;}
            if(input.status!==undefined){if(!['pending','active','suspended','rejected'].includes(input.status))fail('상태를 확인해주세요.');if(self&&input.status!=='active')fail('본인을 정지할 수 없습니다.');patch.status=input.status;}
            if(input.interviewRole!==undefined){if(input.interviewRole!==''&&!INTERVIEW_ROLES.includes(input.interviewRole))fail('면접 권한을 확인해주세요.');patch.profile={...target.profile,interviewRole:input.interviewRole};}
          }else if((input.role&&input.role!==target.role)||(input.status&&input.status!==target.status)||(input.interviewRole!==undefined&&input.interviewRole!==(target.profile?.interviewRole||'')))fail('권한을 변경할 수 없습니다.',403);
          if(input.approvedAt&&actor.role==='admin')patch.approved_at=input.approvedAt;
          if(actor.role==='admin'&&patch.status==='active')patch.approved_by=actor.name;
          payload={member:safeMember(unwrap(await db.rpc('interview_mgmt_member_manage',{p_actor:actor.auth_user_id,p_action:'update',p_id:target.id,p_data:patch})))};
        }else{
          if(actor.role!=='admin')fail('관리자 권한이 필요합니다.',403);
          if(route==='members/delete'){
            if(target.id===actor.id)fail('본인 계정을 삭제할 수 없습니다.');
            unwrap(await db.rpc('interview_mgmt_member_manage',{p_actor:actor.auth_user_id,p_action:'delete',p_id:target.id,p_data:{}}));payload={};
          }else{
            const password=passwordInput(body.password);
            let id=target.auth_user_id||unwrap(await db.rpc('interview_mgmt_find_auth',{p_email:target.email}));
            if(id)unwrap(await db.auth.admin.updateUserById(id,{password}));
            else id=unwrap(await db.auth.admin.createUser({email:target.email,password,email_confirm:true})).user.id;
            unwrap(await db.rpc('interview_mgmt_member_manage',{p_actor:actor.auth_user_id,p_action:'reset',p_id:target.id,p_data:{auth_user_id:id}}));
            payload={};
          }
        }
      }
    }catch(error){status=error.status||500;payload={error:error.status?error.message:'회원 인증 처리에 실패했습니다.'};}
    res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify({ok:status<400,...payload}));
  };
}
module.exports=createHandler();module.exports.createHandler=createHandler;module.exports.legacyMatches=legacyMatches;module.exports.safeMember=safeMember;
