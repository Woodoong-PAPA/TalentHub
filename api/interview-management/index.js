"use strict";

const { createClient } = require("@supabase/supabase-js");
const { timingSafeEqual } = require("node:crypto");
const { processMail } = require("../../lib/interview-management-mail.js");
const core = require("../../lib/interview-management-core.js");
const PREFIX = "interview_mgmt_";
const CLIENT_OPTIONS = { auth: { persistSession: false, autoRefreshToken: false } };

function unwrap(result) {
  if (result.error) {
    const code = result.error.code;
    if (code === "23P01") core.fail("다른 예약이 먼저 확정되었습니다. 다른 시간을 선택해주세요.", 409);
    if (code === "40001") core.fail("일정 정보가 변경되었습니다. 새로고침 후 다른 시간을 선택해주세요.", 409);
    core.fail(code === "42501" ? "접근 권한이 없습니다." : code === "23505" ? "이미 등록된 값입니다." : code === "P0001" || code === "23514" ? "입력 정보 또는 배정 조건을 확인해주세요." : "데이터 처리에 실패했습니다.", code === "42501" ? 403 : 400);
  }
  return result.data;
}
async function readBody(request) {
  if (request.body && typeof request.body === "object" && !Buffer.isBuffer(request.body)) {
    if (Array.isArray(request.body)) core.fail("잘못된 JSON 요청입니다.");
    if (Buffer.byteLength(JSON.stringify(request.body)) > 32768) core.fail("요청이 너무 큽니다.", 413);
    return request.body;
  }
  let raw = typeof request.body === "string" ? request.body : "";
  if (!raw) for await (const chunk of request) {
    raw += chunk.toString();
    if (Buffer.byteLength(raw) > 32768) core.fail("요청이 너무 큽니다.", 413);
  }
  if (Buffer.byteLength(raw) > 32768) core.fail("요청이 너무 큽니다.", 413);
  let parsed;
  try { parsed = JSON.parse(raw || "{}"); } catch { core.fail("잘못된 JSON 요청입니다."); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) core.fail("잘못된 JSON 요청입니다.");
  return parsed;
}
function createHandler({ clientFactory = createClient, env = process.env, mailProcessor = processMail } = {}) {
  async function worker() {
    if(env.INTERVIEW_MGMT_MAIL_SEND_ENABLED!=="true")return {enabled:false,sent:0,failed:0,reminders:0};
    if(!(env.INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY||env.SUPABASE_SERVICE_ROLE_KEY))core.fail("이메일 작업용 서버 설정이 필요합니다.",503);
    const db=clientFactory(env.INTERVIEW_MGMT_SUPABASE_URL||env.SUPABASE_URL||env.NEXT_PUBLIC_SUPABASE_URL,(env.INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY||env.SUPABASE_SERVICE_ROLE_KEY),CLIENT_OPTIONS);
    return mailProcessor({db,env});
  }
  return async function interviewManagement(request, response) {
    let status = 200;
    let payload;
    try {
      const url = new URL(request.url, "http://localhost");
      const route = url.searchParams.get("route") || url.pathname.replace(/^\/api\//, "");
      const action = route.replace(/^interview-management\/?/, "").replace(/\/$/, "") || "bootstrap";
      const methods = { bootstrap: "GET", "mail/inbox":"GET", "mail/approve":"POST", "mail/edit":"POST", "mail/process":"POST", "mail/cron":"POST", schedule: "GET", calendar: "GET", coordinate: "POST", "proposals/select": "POST", interviews: "POST", "interviews/update": "POST", "interviews/cancel": "POST", users: "POST", "users/update": "POST", "users/reset-password": "POST", departments: "POST", "department-access": "POST", "type-settings": "POST" };
      if (!methods[action]) core.fail("API를 찾을 수 없습니다.", 404);
      if (request.method !== methods[action]) core.fail("허용되지 않은 요청 방식입니다.", 405);
      const token = String(request.headers.authorization || "").match(/^Bearer ([^\s]+)$/)?.[1];
      if(action==="mail/cron"){
        const expected=env.INTERVIEW_MGMT_MAIL_CRON_SECRET||"";
        if(!expected||!token||Buffer.byteLength(token)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(token),Buffer.from(expected)))core.fail("이메일 작업 인증이 필요합니다.",401);
        const result=await worker();response.writeHead(200,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});response.end(JSON.stringify({ok:true,...result}));return;
      }
      if (!token) core.fail("신규 영역 로그인이 필요합니다.", 401);
      const supabaseUrl = env.INTERVIEW_MGMT_SUPABASE_URL || env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = env.INTERVIEW_MGMT_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) core.fail("Supabase Auth 설정이 필요합니다.", 503);
      const db = clientFactory(supabaseUrl, anonKey, { ...CLIENT_OPTIONS, global: { headers: { Authorization: `Bearer ${token}` } } });
      const auth = await db.auth.getUser(token);
      if (auth.error || !auth.data?.user) core.fail("로그인이 만료되었습니다.", 401);
      const actor = unwrap(await db.from(`${PREFIX}users`).select("id,name,email,role,active").eq("id", auth.data.user.id).maybeSingle());
      if (!actor?.active) core.fail("활성화된 신규 기능 계정이 필요합니다.", 403);
      if(action.startsWith("mail/")){
        core.requireRecruiter(actor);
        if(action==="mail/inbox")payload={drafts:unwrap(await db.rpc("interview_mgmt_mail_inbox")),sendEnabled:env.INTERVIEW_MGMT_MAIL_SEND_ENABLED==="true"};
        else if(action==="mail/process")payload=await worker();
        else{
          const input=await readBody(request);
          if(!Array.isArray(input.items)||input.items.length<1||input.items.length>50||new Set(input.items.map(i=>i?.id)).size!==input.items.length)core.fail("승인할 초안을 1~50개 선택해주세요.");
          const items=input.items.map(i=>{if(!i||typeof i!=="object"||Array.isArray(i)||!Number.isInteger(i.version)||i.version<1||!Number.isInteger(i.content_version)||i.content_version<1)core.fail("초안 버전을 확인해주세요.");return {id:core.uuid(i.id,"초안"),version:i.version,content_version:i.content_version};});
          if(action==="mail/edit"&&(items.length!==1||typeof input.note!=="string"||input.note.length>2000))core.fail("추가 안내는 2000자 이내로 입력해주세요.");
          payload={count:unwrap(await db.rpc("interview_mgmt_mail_manage",{p_action:action==="mail/edit"?"EDIT":"APPROVE",p_items:items,p_note:action==="mail/edit"?input.note:""}))};
        }
      } else if (action === "schedule") {
        const schedule = unwrap(await db.rpc(`${PREFIX}schedule`, { p_id: core.uuid(url.searchParams.get("interview_id"), "면접") }));
        payload = { schedule: actor.role === "CANDIDATE" ? core.candidateSchedule(schedule) : schedule };
      } else if (action === "calendar") {
        const bookings = unwrap(await db.rpc(`${PREFIX}calendar`));
        payload = { bookings: bookings.map(row => Object.fromEntries(["interview_id", "position", "type", "starts_at", "ends_at", "mode"].map(key => [key, row[key]]))) };
      } else if (action === "coordinate") {
        const validated = core.validateCoordination(await readBody(request), actor);
        payload = { result: unwrap(await db.rpc(`${PREFIX}coordinate`, { p_id: validated.interview_id, p_action: validated.action, p_data: validated.data })) };
      } else if (action === "proposals/select") {
        if (actor.role !== "CANDIDATE") core.fail("지원자만 일정을 선택할 수 있습니다.", 403);
        const input = await readBody(request);
        payload = { booking: unwrap(await db.rpc(`${PREFIX}select_proposal`, { p_id: core.uuid(input.interview_id, "면접"), p_proposal: core.uuid(input.proposal_id, "제안 시간") })) };
      } else if (action === "bootstrap") {
        const interviews = unwrap(await db.rpc(`${PREFIX}list_interviews`));
        const candidate = actor.role === "CANDIDATE";
        payload = { actor, interviews: candidate ? interviews.map(core.candidateSafe) : interviews,
          users: candidate ? [] : unwrap(await db.from(`${PREFIX}users`).select("id,name,email,role,active").order("name")),
          departments: candidate ? [] : unwrap(await db.from(`${PREFIX}departments`).select("id,name").order("name")),
          access: candidate ? [] : unwrap(await db.from(`${PREFIX}department_access`).select("user_id,department_id")),
          types: unwrap(await db.from(`${PREFIX}type_settings`).select("type,duration_minutes")),
          audit: candidate ? [] : unwrap(await db.from(`${PREFIX}audit_logs`).select("id,interview_id,action,created_at").order("created_at", { ascending: false }).limit(100)) };
      } else {
        const input = await readBody(request);
        core.requireRecruiter(actor);
        if (action === "interviews" || action === "interviews/update") {
          const data = core.validateInterview(input);
          payload = { id: unwrap(await db.rpc(`${PREFIX}save_interview`, { p_id: action.endsWith("update") ? core.uuid(input.id, "면접") : null, p_data: data })) };
        } else if (action === "interviews/cancel") {
          unwrap(await db.rpc(`${PREFIX}cancel_interview`, { p_id: core.uuid(input.id, "면접") }));
          payload = {};
        } else if (action === "departments") {
          payload = { department: unwrap(await db.rpc(`${PREFIX}manage`, { p_action: "department", p_data: { name: core.text(input.name, "부서 이름", 80) } })) };
        } else if (action === "department-access") {
          payload = { access: unwrap(await db.rpc(`${PREFIX}manage`, { p_action: "access", p_data: { user_id: core.uuid(input.user_id, "HRBP"), department_id: core.uuid(input.department_id, "부서"), enabled: input.enabled === true } })) };
        } else if (action === "type-settings") {
          if (!core.TYPES[input.type] || !Number.isInteger(input.duration_minutes) || input.duration_minutes < 15 || input.duration_minutes > 480) core.fail("기본 시간을 확인해주세요.");
          unwrap(await db.rpc(`${PREFIX}manage`, { p_action: "type", p_data: { type: input.type, duration_minutes: input.duration_minutes } }));
          payload = {};
        } else if (action === "users/update") {
          if (!core.ROLES.includes(input.role) || typeof input.active !== "boolean") core.fail("권한 및 활성 상태를 확인해주세요.");
          unwrap(await db.rpc(`${PREFIX}manage`, { p_action: "user", p_data: { id: core.uuid(input.id, "사용자"), role: input.role, active: input.active } }));
          payload = {};
        } else {
          if (!(env.INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY||env.SUPABASE_SERVICE_ROLE_KEY)) core.fail("계정 관리용 서버 설정이 필요합니다.", 503);
          const admin = clientFactory(supabaseUrl, (env.INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY||env.SUPABASE_SERVICE_ROLE_KEY), CLIENT_OPTIONS);
          const initialPassword = core.validateInitialPassword(input.initial_password);
          if (action === "users") {
            const profile = core.validateUser(input);
            const created = unwrap(await admin.auth.admin.createUser({ email: profile.email, password: initialPassword, email_confirm: true }));
            let saved;
            try {
              saved = unwrap(await db.rpc(`${PREFIX}manage`, { p_action: "create_user", p_data: { id: created.user.id, ...profile } }));
            } catch (error) {
              const cleanup = await admin.auth.admin.deleteUser(created.user.id);
              if (cleanup.error) core.fail("계정 프로필 저장에 실패했습니다. Auth 관리 화면에서 미완료 계정을 확인해주세요.", 500);
              throw error;
            }
            payload = { user: saved };
          } else {
            const id = core.uuid(input.id, "사용자");
            const target = unwrap(await db.from(`${PREFIX}users`).select("id,active").eq("id", id).maybeSingle());
            if (!target) core.fail("사용자를 찾을 수 없습니다.", 404);
            unwrap(await admin.auth.admin.updateUserById(id, { password: initialPassword }));
            unwrap(await db.rpc(`${PREFIX}manage`, { p_action: "reset_audit", p_data: { id } }));
            payload = {};
          }
        }
      }
    } catch (error) {
      status = error.status || 500;
      payload = { error: error.status ? error.message : "서버 처리에 실패했습니다." };
    }
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end(JSON.stringify({ ok: status < 400, ...payload }));
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
