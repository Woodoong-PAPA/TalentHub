"use strict";
(() => {
  const cfg=window.__APP_CONFIG__||{};
  const enabled=cfg.unifiedAuthEnabled===true;
  const client=enabled&&window.supabase?.createClient?window.supabase.createClient(
    cfg.interviewManagementSupabaseUrl||cfg.supabaseUrl,cfg.interviewManagementSupabaseAnonKey||cfg.supabaseAnonKey,
    {auth:{storageKey:'talenthub-unified-auth-v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}}
  ):null;
  async function request(action,body){
    const session=client?(await client.auth.getSession()).data.session:null;
    const response=await fetch('/api/talent-auth/'+action,{method:body?'POST':'GET',headers:{...(session?{Authorization:'Bearer '+session.access_token}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
    const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.error||'회원 처리에 실패했습니다.');return data;
  }
  async function login(email,password){
    const result=await request('login',{email,password});
    const saved=await client.auth.setSession({access_token:result.session.access_token,refresh_token:result.session.refresh_token});
    if(saved.error)throw new Error('로그인 세션을 저장하지 못했습니다.');return result.member;
  }
  async function restore(){
    if(!client||(await client.auth.getSession()).data.session===null)return null;
    try{return (await request('session')).member;}catch{await client.auth.signOut({scope:'local'});return null;}
  }
  async function verifyPassword(email,password){
    const isolated=window.supabase.createClient(cfg.interviewManagementSupabaseUrl||cfg.supabaseUrl,cfg.interviewManagementSupabaseAnonKey||cfg.supabaseAnonKey,{auth:{persistSession:false,autoRefreshToken:false}});
    try{const result=await isolated.auth.signInWithPassword({email,password});return !result.error;}finally{await isolated.auth.signOut({scope:'local'});}
  }
  async function memberRequest(path,options={}){
    const method=options.method||'GET',url=new URL(path,'https://local.invalid');
    if(method==='GET'){
      if(!(await client.auth.getSession()).data.session)return [];
      const rows=(await request('members')).members;
      return rows.map(m=>({id:m.id,auth_user_id:m.authUserId,email:m.email,name:m.name,role:m.role,status:m.status,business_unit:m.businessUnit,department:m.department,position:m.position,phone:m.phone,note:m.note,requested_at:m.requestedAt,approved_at:m.approvedAt,approved_by:m.approvedBy,last_login_at:m.lastLoginAt,profile:m}));
    }
    if(method==='DELETE'){await request('members/delete',{id:(url.searchParams.get('id')||'').replace(/^eq\./,'')});return null;}
    const rows=JSON.parse(options.body||'[]');
    for(const row of rows){
      await request('members/update',{id:row.id,member:{...row.profile,name:row.name,role:row.role,status:row.status,businessUnit:row.business_unit||'',department:row.department||'',position:row.position||'',phone:row.phone||'',note:row.note||''}});
    }
    return null;
  }
  async function choosePassword(name){
    return new Promise(resolve=>{
      const dialog=document.createElement('dialog');dialog.className='im-shared-password-dialog';
      const form=document.createElement('form');form.method='dialog';
      const title=document.createElement('h3');title.textContent=name+' 비밀번호 초기화';form.append(title);
      for(const [labelText,key]of [['새 비밀번호','password'],['비밀번호 확인','confirm']]){const label=document.createElement('label');label.textContent=labelText;const input=document.createElement('input');input.name=key;input.type='password';input.autocomplete='new-password';input.required=true;input.minLength=8;input.maxLength=128;label.append(input);form.append(label);}
      const error=document.createElement('p');error.setAttribute('role','alert');form.append(error);
      const cancel=document.createElement('button');cancel.type='button';cancel.textContent='취소';cancel.onclick=()=>dialog.close();
      const save=document.createElement('button');save.type='submit';save.textContent='비밀번호 초기화';form.append(cancel,save);dialog.append(form);document.body.append(dialog);
      let value=null;form.onsubmit=event=>{event.preventDefault();if(form.elements.password.value!==form.elements.confirm.value){error.textContent='비밀번호 확인이 일치하지 않습니다.';return;}value=form.elements.password.value;dialog.close();};
      dialog.onclose=()=>{form.reset();dialog.remove();resolve(value);};dialog.showModal();
    });
  }
  window.TalentAuth={enabled,client,request,login,restore,verifyPassword,memberRequest,choosePassword,logout:()=>client?.auth.signOut({scope:'local'})};
})();
