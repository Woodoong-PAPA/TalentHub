"use strict";

const ROLES = ["RECRUITER", "HRBP", "INTERVIEWER", "CANDIDATE"];
const TYPES = {
  PHONE: { label: "전화면접", min: 1, max: 4, duration: 30 },
  TECHNICAL: { label: "1차 전문성 면접", min: 2, max: 4, duration: 60 },
  EXECUTIVE: { label: "2차 임원·부서장 면접", min: 2, max: 4, duration: 60 },
  HR: { label: "3차 HR 면접", min: 2, max: 2, duration: 60 }
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function fail(message, status = 400) {
  throw Object.assign(new Error(message), { status });
}
function text(value, label, max = 200) {
  if (typeof value !== "string" || !value.trim() || value.length > max) fail(`${label}을 확인해주세요.`);
  return value.trim();
}
function uuid(value, label) {
  if (!UUID.test(value || "")) fail(`${label}을 선택해주세요.`);
  return value;
}
function requireRecruiter(actor) {
  if (actor?.role !== "RECRUITER" || !actor.active) fail("채용담당자 권한이 필요합니다.", 403);
}
function coordinationStart(input, now = Date.now()) {
  const mode = input.coordination_start_mode;
  if (!["IMMEDIATE", "SCHEDULED"].includes(mode)) fail("조율 시작 방식을 선택해주세요.");
  const start = mode === "IMMEDIATE" ? now : Date.parse(input.window_start);
  if (!Number.isFinite(start) || (mode === "SCHEDULED" && start <= now)) fail("예약 시작 날짜와 시간은 현재 이후로 입력해주세요.");
  return { coordination_start_mode: mode, window_start: new Date(start).toISOString(), window_end: null };
}
function validateInitialPassword(value) {
  if (typeof value !== "string" || value.length < 12 || value.length > 128 || !/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) fail("초기 비밀번호는 영문과 숫자를 포함하여 12~128자로 입력해주세요.");
  return value;
}
function validateInterview(input) {
  const type = TYPES[input.type];
  if (!type) fail("면접 유형을 확인해주세요.");
  const panel = input.interviewer_ids;
  if (!Array.isArray(panel) || new Set(panel).size !== panel.length || panel.length < type.min || panel.length > type.max) {
    fail(`${type.label}의 면접관은 ${type.min}~${type.max}명이어야 합니다.`);
  }
  panel.forEach(id => uuid(id, "면접관"));
  if (!Number.isInteger(input.duration_minutes) || input.duration_minutes < 15 || input.duration_minutes > 480) fail("소요 시간은 15~480분이어야 합니다.");
  let timing;
  if (input.coordination_start_mode !== undefined) timing = coordinationStart(input);
  else {
    const start = Date.parse(input.window_start), end = Date.parse(input.window_end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end || end - start < input.duration_minutes * 60000) fail("일정 조율 기간을 확인해주세요.");
    timing = { window_start: new Date(start).toISOString(), window_end: new Date(end).toISOString() };
  }
  if (!["ONLINE", "ONSITE", "PHONE"].includes(input.mode)) fail("진행 방식을 확인해주세요.");
  const recruiter = uuid(input.recruiter_id, "주 담당자");
  const alternate = input.alternate_recruiter_id ? uuid(input.alternate_recruiter_id, "대체 담당자") : null;
  if (recruiter === alternate) fail("대체 담당자는 주 담당자와 달라야 합니다.");
  return {
    candidate_id: uuid(input.candidate_id, "지원자"), department_id: uuid(input.department_id, "부서"),
    position: text(input.position, "채용 포지션"), type: input.type, duration_minutes: input.duration_minutes,
    interviewer_ids: panel, hrbp_id: uuid(input.hrbp_id, "HRBP"), recruiter_id: recruiter,
    alternate_recruiter_id: alternate, mode: input.mode,
    ...timing
  };
}
function validateUser(input) {
  if (!ROLES.includes(input.role)) fail("사용자 권한을 확인해주세요.");
  const email = text(input.email, "로그인 이메일", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("이메일을 확인해주세요.");
  return { name: text(input.name, "이름", 80), email, role: input.role };
}
function validateCoordination(input, actor) {
  const actions = ["availability", "availability_delete", "request_availability", "publish", "change_request", "review_request", "reopen"];
  if (!actions.includes(input.action)) fail("일정 조율 요청을 확인해주세요.");
  const result = { action: input.action, interview_id: uuid(input.interview_id, "면접"), data: {} };
  const value = input.data || {};
  const out = result.data;
  const role = actor.role;
  const requireRoles = allowed => { if (!allowed.includes(role)) fail("일정 조율 권한이 없습니다.", 403); };
  const range = (optional = false) => {
    if (optional && !value.starts_at && !value.ends_at) return;
    const start = Date.parse(value.starts_at), end = Date.parse(value.ends_at);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) fail("시작·종료 시간을 확인해주세요.");
    out.starts_at = new Date(start).toISOString(); out.ends_at = new Date(end).toISOString();
  };
  if (["availability", "availability_delete"].includes(input.action)) {
    requireRoles(["HRBP", "INTERVIEWER"]);
    out.user_id = uuid(value.user_id, "면접관");
    if (role === "INTERVIEWER" && out.user_id !== actor.id) fail("본인의 가능 시간만 입력할 수 있습니다.", 403);
    if (value.id || input.action === "availability_delete") out.id = uuid(value.id, "가능 시간");
    if (input.action === "availability") range();
  } else if (input.action === "request_availability") {
    requireRoles(["RECRUITER", "HRBP"]); out.user_id = uuid(value.user_id, "면접관");
  } else if (input.action === "publish") {
    requireRoles(["RECRUITER", "HRBP"]);
    if (!Number.isInteger(value.version) || value.version < 1 || !Array.isArray(value.starts) || value.starts.length < 1 || value.starts.length > 20) fail("제안할 시간을 1~20개 선택해주세요.");
    out.version = value.version;
    out.starts = value.starts.map(start => { if (!Number.isFinite(Date.parse(start))) fail("제안 시간을 확인해주세요."); return new Date(start).toISOString(); });
    if (new Set(out.starts).size !== out.starts.length) fail("제안 시간이 중복되었습니다.");
  } else if (input.action === "change_request") {
    requireRoles(["CANDIDATE", "INTERVIEWER"]);
    if (!["COUNTER_PROPOSAL", "CHANGE"].includes(value.kind)) fail("요청 유형을 확인해주세요.");
    if (value.kind === "COUNTER_PROPOSAL" && role !== "CANDIDATE") fail("지원자만 역제안할 수 있습니다.", 403);
    out.kind = value.kind; out.reason = text(value.reason, "요청 사유", 1000); range(value.kind === "CHANGE");
  } else if (input.action === "review_request") {
    requireRoles(["RECRUITER", "HRBP"]); out.id = uuid(value.id, "변경 요청");
    if (!(role === "HRBP" ? ["REVIEW"] : ["ACCEPT", "REJECT"]).includes(value.decision)) fail("검토 권한 또는 결정을 확인해주세요.", 403);
    out.decision = value.decision;
    if (typeof (value.note ?? "") !== "string" || (value.note || "").length > 1000) fail("검토 의견을 확인해주세요.");
    out.note = (value.note || "").trim();
  } else if (input.action === "reopen") {
    requireRoles(["RECRUITER"]);
    if (value.coordination_start_mode !== undefined) Object.assign(out, coordinationStart(value));
    else range();
  }
  return result;
}
function candidateSchedule(row) {
  const pick = (value, keys) => value ? Object.fromEntries(keys.map(key => [key, value[key]])) : null;
  return { interview_id: row.interview_id, version: row.version,
    proposals: (row.proposals || []).map(p => pick(p, ["id", "starts_at", "ends_at"])),
    booking: pick(row.booking, ["id", "starts_at", "ends_at"]),
    requests: (row.requests || []).map(r => pick(r, ["id", "kind", "status", "proposed_start", "proposed_end", "reason", "created_at"])) };
}
function candidateSafe(row) {
  return Object.fromEntries(["id", "position", "type", "duration_minutes", "mode", "status", "coordination_start_mode", "window_start", "window_end", "created_at"].map(key => [key, row[key]]));
}
module.exports = { ROLES, TYPES, fail, text, uuid, requireRecruiter, validateInterview, validateUser, validateInitialPassword, coordinationStart, validateCoordination, candidateSchedule, candidateSafe };
