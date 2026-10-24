"use strict";
const {fail}=require("./interview-management-core.js");
function value(result){if(result.error)fail("이메일 처리 상태를 저장하지 못했습니다.",503);return result.data;}
function createProvider({env=process.env,fetchImpl=fetch}={}){
  const key=env.INTERVIEW_MGMT_RESEND_API_KEY||env.RESEND_API_KEY;
  const acceptedTimes=new Map();
  async function send(payload,idempotencyKey,{firstAttempt=false}={}){
    const response=await fetchImpl("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json","Idempotency-Key":idempotencyKey},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error(`Provider HTTP ${response.status}`);
    const result=await response.json();if(typeof result.id!=="string"||!result.id)throw new Error("Provider response missing ID");
    // A replay's HTTP Date is not the original acceptance time.
    const accepted=Date.parse(result.created_at||(firstAttempt?response.headers?.get?.("date"):undefined));
    if(Number.isFinite(accepted))acceptedTimes.set(result.id,new Date(accepted).toISOString());
    return result.id;
  }
  async function sentTime(id){
    if(acceptedTimes.has(id))return acceptedTimes.get(id);
    try{const response=await fetchImpl(`https://api.resend.com/emails/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(10000)});if(!response.ok)return null;
      const body=await response.json(),time=Date.parse(body.created_at);return Number.isFinite(time)?new Date(time).toISOString():null;
    }catch{return null;}
  }
  return {send,sentTime};
}
async function processMail({db,env=process.env,provider=createProvider({env})}){
  // Independent opt-in; existing TalentHub Resend settings never enable v2 sends.
  if(env.INTERVIEW_MGMT_MAIL_SEND_ENABLED!=="true")return {enabled:false,sent:0,failed:0,reminders:0};
  const allowed=new Set(String(env.INTERVIEW_MGMT_MAIL_ALLOWED_RECIPIENTS||"").split(",").map(v=>v.trim().toLowerCase()).filter(Boolean));
  const from=env.INTERVIEW_MGMT_MAIL_FROM||env.RESEND_FROM||"onboarding@resend.dev";
  if(!(env.INTERVIEW_MGMT_RESEND_API_KEY||env.RESEND_API_KEY)||!allowed.size||/[\r\n]/.test(from))fail("테스트 이메일 발신 설정과 수신 허용 목록이 필요합니다.",503);
  const deadline=Date.now()+20000;
  const pendingTimes=value(await db.from("interview_mgmt_email_events").select("id,provider_id").eq("status","SENT").is("sent_at",null).limit(5));
  for(const event of pendingTimes){if(Date.now()>=deadline)break;const time=await provider.sentTime(event.provider_id);if(time)value(await db.rpc("interview_mgmt_mail_record_time",{p_event:event.id,p_sent_at:time}));}
  const reminders=value(await db.rpc("interview_mgmt_mail_reminders"));
  const now=new Date().toISOString();
  const events=value(await db.from("interview_mgmt_email_events").select("id").lte("dispatch_after",now).in("status",["QUEUED","FAILED","SENDING"]).or(`lease_until.is.null,lease_until.lte.${now}`).or(`next_attempt_at.is.null,next_attempt_at.lte.${now}`).order("created_at").limit(5));
  let sent=0,failed=0;
  for(const event of events){
    if(Date.now()>=deadline)break;
    const claim=value(await db.rpc("interview_mgmt_mail_claim",{p_event:event.id,p_from:from}));if(!claim)continue;
    try{
      if(!claim.payload.to.every(email=>allowed.has(String(email).toLowerCase())))throw new Error("Recipient not in test allowlist");
      if(!value(await db.rpc("interview_mgmt_mail_ready",{p_event:event.id,p_token:claim.token})))throw new Error("Draft invalidated before dispatch");
      const id=await provider.send(claim.payload,claim.key,{firstAttempt:claim.first_attempt===true}),time=await provider.sentTime(id);
      const acknowledged=value(await db.rpc("interview_mgmt_mail_finish",{p_event:event.id,p_token:claim.token,p_provider:id,p_error:null,p_sent_at:time}));
      if(!acknowledged)throw new Error("Worker acknowledgement no longer owns lease");
      sent++;
    }catch(error){
      // Never log provider bodies, addresses, access keys or message content.
      const reason=/^(Provider HTTP \d{3}|Provider response missing ID|Recipient not in test allowlist|Draft invalidated before dispatch)$/.test(error.message)?error.message:"Provider request failed or acknowledgement unavailable";
      value(await db.rpc("interview_mgmt_mail_finish",{p_event:event.id,p_token:claim.token,p_provider:null,p_error:reason,p_sent_at:null}));failed++;
    }
  }
  return {enabled:true,sent,failed,reminders};
}
module.exports={createProvider,processMail};
