"use strict";
(() => {
  const unified = window.__APP_CONFIG__?.unifiedAuthEnabled === true;
  const embedded = new URLSearchParams(location.search).get("embedded") === "1" && window.parent !== window;
  if (unified && !embedded) { location.replace("/?view=interview-management"); return; }
  if (embedded) document.body.classList.add("im-embedded");
  const root = document.querySelector("#im-content");
  const types = { PHONE:"전화면접", TECHNICAL:"1차 전문성 면접", EXECUTIVE:"2차 임원·부서장 면접", HR:"3차 HR 면접" };
  const roles = { RECRUITER:"채용담당자", HRBP:"HRBP", INTERVIEWER:"면접관", CANDIDATE:"지원자" };
  const statuses = { COORDINATING:"조율 중", PROPOSED:"제안 중", CONFIRMED:"확정", CHANGE_REQUESTED:"변경 요청", CANCELLED:"취소" };
  const modes = { ONLINE:"온라인", ONSITE:"대면", PHONE:"전화" };
  let client, data, tab="dashboard", selectedId="", busy=false, secret=null, schedule=null, availabilityEdit="", calendarRows=[],mailDrafts=[],mailSendEnabled=false,mailEditId="";
  const mailSelected=new Set();
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  const recruiter = () => data?.actor.role === "RECRUITER";
  const option = (value,label,selected) => `<option value="${escape(value)}" ${value===selected?"selected":""}>${escape(label)}</option>`;
  const formatDate = value => value ? new Intl.DateTimeFormat("ko-KR", { timeZone:"Asia/Seoul", dateStyle:"medium", timeStyle:"short" }).format(new Date(value)) : "-";
  const localTime = value => value ? new Date(new Date(value).getTime()+9*3600000).toISOString().slice(0,16) : "";
  const kstTime = value => new Date(`${value}:00+09:00`).toISOString();
  function message(value,error=false) {
    const node=document.querySelector("#im-message"); node.textContent=value; node.classList.toggle("im-error",error);
  }
  async function api(action="bootstrap", body) {
    const { data:sessionData } = await client.auth.getSession();
    if (!sessionData.session) throw new Error("Talent Pool 로그인이 필요합니다.");
    const response=await fetch(`/api/interview-management/${action}`, { method:body?"POST":"GET", headers:{ Authorization:`Bearer ${sessionData.session.access_token}`, ...(body?{"Content-Type":"application/json"}:{}) }, ...(body?{body:JSON.stringify(body)}:{}) });
    const result=await response.json();
    if(!response.ok || !result.ok) throw new Error(result.error || "처리에 실패했습니다.");
    return result;
  }
  async function refresh() {
    data=await api();
    if(recruiter()){const mail=await api("mail/inbox");mailDrafts=mail.drafts||[];mailSendEnabled=mail.sendEnabled===true;}else{mailDrafts=[];mailSendEnabled=false;}
    if(tab==="detail"&&selectedId) schedule=(await api(`schedule?interview_id=${encodeURIComponent(selectedId)}`)).schedule||null;
    if(tab==="calendar") calendarRows=(await api("calendar")).bookings||[];
    document.querySelector("#im-login").hidden=true;
    document.querySelector("#im-app").hidden=false;
    document.querySelector("#im-logout").hidden=false;
    document.querySelector("#im-identity").textContent=`${data.actor.name} · ${roles[data.actor.role]}`;
    render();
  }
  function showLogin() {
    data=null; secret=null; selectedId=""; schedule=null; calendarRows=[]; availabilityEdit="";mailDrafts=[];mailSelected.clear();mailEditId=""; tab="dashboard"; root.replaceChildren();
    document.querySelector("#im-login").hidden=false;
    document.querySelector("#im-app").hidden=true;
    document.querySelector("#im-logout").hidden=true;
    document.querySelector("#im-identity").textContent="별도 계정 로그인";
    if (unified) { document.querySelector("#im-login").hidden=true; message("Talent Pool에서 로그인한 뒤 이용해주세요.",true); }
  }
  function startFields(row={}) {
    const mode=row.coordination_start_mode==="SCHEDULED"&&Date.parse(row.window_start)>Date.now()?"SCHEDULED":"IMMEDIATE";
    return `<label>조율 시작 방식<select name="coordination_start_mode">${option("IMMEDIATE","즉시 시작",mode)}${option("SCHEDULED","예약",mode)}</select></label><label data-scheduled-start ${mode==="SCHEDULED"?"":"hidden"}>예약 시작 날짜·시간 (한국시간)<input name="window_start" type="datetime-local" ${mode==="SCHEDULED"?"required":"disabled"} value="${mode==="SCHEDULED"?localTime(row.window_start):""}"></label>`;
  }
  function initialPasswordFields() {
    return '<label>초기 비밀번호<input name="initial_password" type="password" autocomplete="new-password" required minlength="12" maxlength="128"></label><label>초기 비밀번호 확인<input name="initial_password_confirm" type="password" autocomplete="new-password" required minlength="12" maxlength="128"></label><p class="im-muted">영문과 숫자를 포함하여 12~128자로 설정해주세요. 로그인 후 사용자가 변경할 수 있습니다.</p>';
  }
  function resetPasswordForm() {
    const user=data.users.find(user=>user.id===selectedId);
    return `<section class="im-card"><h3>${escape(user.name)} 비밀번호 초기화</h3><form id="im-reset-form" class="im-form">${initialPasswordFields()}<div class="im-actions"><button class="im-button im-primary">설정한 비밀번호로 초기화</button><button type="button" class="im-button" data-tab="users">돌아가기</button></div></form></section>`;
  }
  function userSelect(name,label,role,value="",optional=false) {
    return `<label>${label}<select name="${name}" ${optional?"":"required"}>${option("",optional?"지정 안 함":"선택해주세요",value)}${data.users.filter(user=>user.active&&user.role===role).map(user=>option(user.id,user.name,value)).join("")}</select></label>`;
  }
  function table(rows) {
    return `<div class="im-table-wrap"><table class="im-table"><thead><tr>${data.actor.role!=="CANDIDATE"?"<th>지원자</th>":""}<th>포지션</th><th>면접 유형</th><th>상태</th><th>조회</th></tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${data.actor.role!=="CANDIDATE"?`<td>${escape(row.candidate_name)}</td>`:""}<td>${escape(row.position)}</td><td>${types[row.type]}</td><td><span class="im-badge">${statuses[row.status]}</span></td><td><button type="button" class="im-button" data-detail="${escape(row.id)}">상세</button></td></tr>`).join(""):"<tr><td colspan='5'>조회 가능한 면접이 없습니다.</td></tr>"}</tbody></table></div>`;
  }
  function dashboard() {
    const rows=data.interviews.filter(row=>!recruiter()||row.recruiter_id===data.actor.id||row.alternate_recruiter_id===data.actor.id);
    return `<div class="im-metrics">${[["담당 면접",rows.filter(r=>r.status!=="CANCELLED").length],["조율 중",rows.filter(r=>["COORDINATING","PROPOSED"].includes(r.status)).length],["확정",rows.filter(r=>r.status==="CONFIRMED").length],["변경 요청",rows.filter(r=>r.status==="CHANGE_REQUESTED").length]].map(([label,count])=>`<div class="im-card">${label}<strong>${count}</strong></div>`).join("")}</div>${recruiter()?`<section class="im-card"><h3>이메일 처리 현황</h3><p>승인 대기 ${mailDrafts.filter(d=>d.valid&&d.status==="PENDING").length}건 · 미응답 리마인드 ${mailDrafts.filter(d=>d.valid&&d.reminder_number>0&&d.status==="PENDING").length}건 · 발송 실패 ${mailDrafts.filter(d=>d.events?.some(e=>e.status==="FAILED"||e.status==="UNCERTAIN")).length}건</p><button class="im-button" data-tab="emails">이메일 승인함 열기</button></section>`:""}<section class="im-card"><h3>담당 면접 현황</h3>${table(rows)}</section>`;
  }
  function list() {
    return `<section class="im-card"><h3>면접 목록</h3><div class="im-filter"><input id="im-search" aria-label="면접 검색" placeholder="지원자 또는 포지션 검색"><select id="im-filter" aria-label="면접 상태 필터">${option("","전체 상태","")}${Object.entries(statuses).map(([key,label])=>option(key,label,"")).join("")}</select></div><div id="im-results">${table(data.interviews)}</div></section>`;
  }
  function detail() {
    const row=data.interviews.find(row=>row.id===selectedId);
    if(!row) return list();
    const items=[["포지션",row.position],["면접 유형",types[row.type]],["상태",statuses[row.status]],["소요 시간",`${row.duration_minutes}분`],["진행 방식",modes[row.mode]],["조율 시작",row.coordination_start_mode==="SCHEDULED"?`예약 · ${formatDate(row.window_start)}`:"즉시 시작"]];
    if(data.actor.role!=="CANDIDATE") items.unshift(["지원자",row.candidate_name],["부서",row.department_name],["필수 면접관",row.interviewer_names?.join(", ")]);
    return `<section class="im-card"><h3>면접 상세</h3><dl class="im-detail">${items.map(([label,value])=>`<dt>${label}</dt><dd>${escape(value)}</dd>`).join("")}</dl><div class="im-actions"><button class="im-button" data-tab="list">목록</button><button class="im-button" data-refresh-schedule>일정 새로고침</button>${recruiter()&&row.status==="COORDINATING"?`<button class="im-button" data-edit="${escape(row.id)}">면접 수정</button>`:""}${recruiter()&&row.status!=="CANCELLED"?`<button class="im-button im-danger" data-cancel="${escape(row.id)}">면접 취소</button>`:""}</div></section>${coordination(row)}${data.actor.role!=="CANDIDATE"?`<section class="im-card"><h3>진행 이력</h3>${data.audit.filter(log=>log.interview_id===row.id).map(log=>`<p>${escape(formatDate(log.created_at))} · ${escape(log.action)}</p>`).join("")||"<p>기록된 이력이 없습니다.</p>"}</section>`:""}`;
  }
  function rangeFields(start="",end="",required=true) {
    return `<div class="im-grid"><label>시작 시간 (한국시간)<input type="datetime-local" name="starts_at" value="${localTime(start)}" ${required?"required":""}></label><label>종료 시간 (한국시간)<input type="datetime-local" name="ends_at" value="${localTime(end)}" ${required?"required":""}></label></div>`;
  }
  function coordination(row) {
    if(row.coordination_start_mode==="SCHEDULED"&&Date.parse(row.window_start)>Date.now())return `<section class="im-card"><h3>조율 시작 예약</h3><p>${escape(formatDate(row.window_start))}부터 가능 시간 등록과 일정 조율을 시작할 수 있습니다. 승인된 요청 이메일도 예약 시각 이후에 발송됩니다.</p></section>`;
    if(!schedule)return '<section class="im-card"><p>일정 정보를 불러오려면 일정 새로고침을 눌러주세요.</p></section>';
    const role=data.actor.role, coordinator=["RECRUITER","HRBP"].includes(role), live=row.status!=="CANCELLED";
    let html=`<section class="im-card"><h3>확정 일정</h3>${schedule.booking?`<p>${escape(formatDate(schedule.booking.starts_at))} ~ ${escape(formatDate(schedule.booking.ends_at))}</p><p class="im-muted">변경 조율 중에도 이 예약은 유지됩니다. 새 일정 확정 후 이전 예약이 해제됩니다.</p>`:'<p>아직 확정된 일정이 없습니다.</p>'}</section>`;
    if(role!=="CANDIDATE") {
      const participants=schedule.participants||[], edit=(schedule.availability||[]).find(a=>a.id===availabilityEdit);
      html+=`<section class="im-card"><h3>면접관 가능 시간</h3>${(schedule.availability_requests||[]).filter(r=>!r.resolved_at&&(role!=="INTERVIEWER"||r.user_id===data.actor.id)).map(r=>`<p class="im-muted">${escape(participants.find(p=>p.id===r.user_id)?.name)} · 가능 시간 직접 입력 요청</p>`).join("")}<div class="im-availability-list">${(schedule.availability||[]).map(a=>`<article><strong>${escape(participants.find(p=>p.id===a.user_id)?.name)}</strong><p>${escape(formatDate(a.starts_at))} ~ ${escape(formatDate(a.ends_at))}</p><span class="im-badge">${a.entered_by===a.user_id?"직접 입력":"HRBP 대리 입력 · 사전 협의 완료"}</span>${live&&row.status!=="CONFIRMED"&&(role==="HRBP"||(role==="INTERVIEWER"&&a.user_id===data.actor.id))?`<div class="im-actions"><button class="im-button" data-availability-edit="${escape(a.id)}">시간 수정</button><button class="im-button im-danger" data-availability-delete="${escape(a.id)}">시간 삭제</button></div>`:""}</article>`).join("")||"<p>등록된 가능 시간이 없습니다.</p>"}</div>`;
      if(live&&row.status!=="CONFIRMED"&&["HRBP","INTERVIEWER"].includes(role)) html+=`<form id="im-availability-form" class="im-form"><h4>${edit?"가능 시간 수정":"가능 시간 추가"}</h4>${role==="HRBP"?`<label>입력 대상 면접관<select name="user_id" required>${participants.map(p=>option(p.id,p.name,edit?.user_id)).join("")}</select></label><p class="im-muted">대리 입력은 해당 면접관과 사전 협의한 가능 시간으로 처리됩니다.</p>`:`<input type="hidden" name="user_id" value="${escape(data.actor.id)}">`}${rangeFields(edit?.starts_at,edit?.ends_at)}<p class="im-muted">개별 시간은 종료를 면접 소요 시간만큼 뒤로 지정하고, 시간 범위는 전체 가능 구간을 입력해주세요.</p><button class="im-button im-primary">가능 시간 저장</button>${edit?'<button class="im-button" type="button" data-availability-edit-clear>수정 취소</button>':""}</form>`;
      if(live&&coordinator)html+=`<form id="im-request-availability-form" class="im-form"><label>직접 입력 요청할 면접관<select name="user_id" required>${participants.map(p=>option(p.id,p.name,"")).join("")}</select></label><button class="im-button">면접관에게 직접 입력 요청</button><p class="im-muted">면접관의 면접 상세에 요청이 표시됩니다.</p></form>`;
      html+='</section>';
      if(live&&row.status!=="CONFIRMED")html+=`<section class="im-card"><h3>전체 면접관의 공통 시간</h3><p class="im-muted">전원 참석 가능 시간에서 이미 확정된 다른 예약을 제외했습니다. 시간 선택은 15분 간격으로 제공됩니다.</p>${coordinator?'<form id="im-publish-form" class="im-form">':""}<div class="im-slot-list">${(schedule.common_slots||[]).map(s=>`<label class="im-slot">${coordinator?`<input type="checkbox" name="starts" value="${escape(s.starts_at)}">`:""}<span>${escape(formatDate(s.starts_at))} ~ ${escape(formatDate(s.ends_at))}</span></label>`).join("")||'<p>공통 시간이 없습니다. 모든 면접관의 가능 시간을 등록하거나 조율 기간을 변경해주세요.</p>'}</div>${coordinator&&schedule.common_slots?.length?'<button class="im-button im-primary">선택한 시간을 지원자에게 제안</button>':""}${coordinator?"</form>":""}</section>`;
    }
    html+=`<section class="im-card"><h3>제안된 일정</h3><div class="im-slot-list">${(schedule.proposals||[]).map(p=>`<div class="im-slot"><span>${escape(formatDate(p.starts_at))} ~ ${escape(formatDate(p.ends_at))}</span>${role==="CANDIDATE"&&live?`<button class="im-button im-primary" data-select-proposal="${escape(p.id)}">이 시간 선택</button>`:""}</div>`).join("")||'<p>현재 선택할 수 있는 제안 시간이 없습니다.</p>'}</div>${role==="CANDIDATE"&&live?'<p class="im-muted">선택 시 예약이 즉시 확정됩니다. 다른 예약이 먼저 확정된 경우 다른 시간을 선택해주세요.</p>':""}</section>`;
    if(live&&["CANDIDATE","INTERVIEWER"].includes(role)) html+=`<section class="im-card"><h3>${role==="CANDIDATE"?"다른 일정 역제안·변경 요청":"확정 일정 변경 요청"}</h3>${(schedule.requests||[]).some(r=>r.status==="PENDING"&&(role==="CANDIDATE"||r.requested_by===data.actor.id))?'<p>담당자가 검토 중인 요청이 있습니다.</p>':(role==="CANDIDATE"||schedule.booking)?`<form id="im-change-request-form" class="im-form"><label>요청 유형<select name="kind">${role==="CANDIDATE"?option("COUNTER_PROPOSAL","다른 일정 역제안",""):""}${schedule.booking?option("CHANGE","확정 일정 변경",role==="INTERVIEWER"?"CHANGE":""):""}</select></label>${rangeFields("","",false)}<p class="im-muted">역제안은 시작·종료 시간이 필요합니다. 변경 요청은 사유만 등록할 수도 있습니다.</p><label>요청 사유<textarea name="reason" maxlength="1000" required rows="3"></textarea></label><button class="im-button im-primary">담당자에게 검토 요청</button></form>`:'<p>일정이 확정되면 변경을 요청할 수 있습니다.</p>'}</section>`;
    html+=`<section class="im-card"><h3>역제안·변경 요청 이력</h3>${(schedule.requests||[]).map(r=>`<article class="im-request"><p><span class="im-badge">${({PENDING:"검토 대기",ACCEPTED:"반영",REJECTED:"반려",RESOLVED:"예약 확정으로 종료"})[r.status]}</span> ${r.kind==="COUNTER_PROPOSAL"?"역제안":"변경 요청"}</p>${r.proposed_start?`<p>${escape(formatDate(r.proposed_start))} ~ ${escape(formatDate(r.proposed_end))}</p>`:""}<p>${escape(r.reason)}</p>${role!=="CANDIDATE"&&r.review_note?`<p class="im-muted">검토 의견: ${escape(r.review_note)}</p>`:""}${coordinator&&r.status==="PENDING"&&live?`<form class="im-form im-review-form" data-request-id="${escape(r.id)}"><label>검토 의견<textarea name="note" maxlength="1000" rows="2"></textarea></label><label>검토 결과<select name="decision">${role==="HRBP"?option("REVIEW","검토 의견 전달",""):option("ACCEPT","반영 후 재조율","")+option("REJECT","반려","")}</select></label><button class="im-button">검토 저장</button></form>`:""}</article>`).join("")||'<p>요청 이력이 없습니다.</p>'}</section>`;
    if(recruiter()&&live)html+=`<section class="im-card"><h3>일정 재조율</h3><form id="im-reopen-form" class="im-form">${startFields()}<button class="im-button">재조율 시작</button><p class="im-muted">이전에 제안한 시간은 무효화되며, 확정된 예약은 새 일정이 확정될 때까지 유지됩니다.</p></form></section>`;
    return html;
  }
  function calendar() {
    const groups=new Map();
    for(const row of calendarRows){const day=new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",dateStyle:"full"}).format(new Date(row.starts_at));if(!groups.has(day))groups.set(day,[]);groups.get(day).push(row);}
    return `<section class="im-card"><h3>일정 캘린더</h3><p class="im-muted">접근 가능한 확정 면접을 날짜별로 표시합니다. 변경 조율 중인 면접은 기존 예약이 표시됩니다.</p>${[...groups].map(([day,rows])=>`<section class="im-calendar-day"><h4>${escape(day)}</h4>${rows.map(row=>`<article class="im-slot"><span><strong>${escape(row.position)}</strong><br>${escape(formatDate(row.starts_at))} ~ ${escape(formatDate(row.ends_at))} · ${modes[row.mode]}</span><button class="im-button" data-detail="${escape(row.interview_id)}">상세</button></article>`).join("")}</section>`).join("")||'<p>확정된 면접이 없습니다.</p>'}</section>`;
  }
  const mailItem=d=>({id:d.id,version:d.version,content_version:d.content_version});
  function emails(){
    const labels={PENDING:"승인 대기",APPROVED:"승인 완료",INVALIDATED:"무효",SENT:"전송 접수",FAILED:"실패"};
    const events={QUEUED:"발송 대기",SENDING:"처리 중",SENT:"전송 접수",FAILED:"재시도 대기",CANCELLED:"발송 취소",UNCERTAIN:"발송 여부 확인 필요"};
    return `<section class="im-card"><h3>이메일 승인함</h3><p>주 담당자 또는 지정된 대체 담당자의 초안만 표시됩니다. 초안을 수정하면 다시 승인해야 합니다.</p><p class="im-muted">${mailSendEnabled?"승인된 이메일만 테스트 수신 허용 목록으로 발송됩니다.":"외부 이메일 발송이 비활성화되어 있습니다. 승인해도 현재는 발송되지 않습니다."}</p><div class="im-actions"><button class="im-button" data-mail-select-all>승인 대기 전체 선택</button><button class="im-button im-primary" data-mail-approve>선택한 초안 일괄 승인</button><button class="im-button" data-mail-refresh>새로고침</button>${mailSendEnabled?'<button class="im-button" data-mail-process>승인 이메일 처리·재시도</button>':""}</div>${mailDrafts.map(d=>{const attempted=d.events?.some(e=>e.attempts>0);return `<article class="im-mail-draft"><div class="im-actions">${d.valid&&d.status==="PENDING"?`<label><input type="checkbox" data-mail-select="${escape(d.id)}" aria-label="${escape(d.subject)} 선택" ${mailSelected.has(d.id)?"checked":""}> 선택</label>`:""}<span class="im-badge">${labels[d.status]||d.status}${!d.valid&&d.status!=="INVALIDATED"?" · 현재 일정과 불일치":""}</span><span class="im-muted">일정 버전 ${d.version} · 내용 버전 ${d.content_version}${d.reminder_number?` · 리마인드 ${d.reminder_number}/2`:""}</span></div><h4>${escape(d.subject)}</h4><p class="im-muted">수신: ${escape(d.recipient_name)} (${escape(d.recipient_email)}) · 회신: ${escape(d.reply_to)}</p><pre class="im-mail-body">${escape(d.body)}</pre>${d.valid&&["PENDING","APPROVED"].includes(d.status)&&!attempted?`<button class="im-button" data-mail-edit="${escape(d.id)}">추가 안내 수정</button>`:""}${mailEditId===d.id?`<form class="im-form im-mail-edit-form" data-draft-id="${escape(d.id)}"><label>추가 안내문<textarea name="note" rows="4" maxlength="2000">${escape(d.note)}</textarea></label><p class="im-muted">지원자 안내문에 내부 면접관의 이름·이메일이나 조직을 입력하지 마세요. 기본 일정 본문은 자동 생성되며 변경할 수 없습니다.</p><button class="im-button im-primary">수정 저장 및 승인 초기화</button></form>`:""}${d.events?.map(e=>`<p class="im-muted">${events[e.status]||e.status} · 시도 ${e.attempts}회${e.sent_at?` · 전송 시각 ${escape(formatDate(e.sent_at))}`:e.status==="SENT"?" · 전송 시각 확인 중":""}${e.last_error?` · ${escape(e.last_error)}`:""}</p>`).join("")||""}</article>`;}).join("")||'<p>검토할 이메일 초안이 없습니다.</p>'}</section>`;
  }
  function interviewForm() {
    const row=data.interviews.find(row=>row.id===selectedId)||{};
    return `<section class="im-card"><h3>${row.id?"면접 수정":"면접 생성"}</h3><form class="im-form" id="im-interview-form"><div class="im-grid">${userSelect("candidate_id","지원자","CANDIDATE",row.candidate_id)}<label>채용 포지션<input name="position" required maxlength="200" value="${escape(row.position)}"></label><label>부서<select name="department_id" required>${option("","선택해주세요","")}${data.departments.map(d=>option(d.id,d.name,row.department_id)).join("")}</select></label><label>면접 유형<select name="type">${Object.entries(types).map(([key,label])=>option(key,label,row.type||"PHONE")).join("")}</select></label><label>소요 시간 (분)<input name="duration_minutes" type="number" min="15" max="480" required value="${row.duration_minutes||data.types.find(t=>t.type==="PHONE")?.duration_minutes||30}"></label><label>진행 방식<select name="mode">${Object.entries(modes).map(([key,label])=>option(key,label,row.mode||"ONLINE")).join("")}</select></label>${userSelect("hrbp_id","HRBP (부서 접근 권한 필요)","HRBP",row.hrbp_id)}${userSelect("recruiter_id","주 담당 채용담당자","RECRUITER",row.recruiter_id||data.actor.id)}${userSelect("alternate_recruiter_id","대체 채용담당자","RECRUITER",row.alternate_recruiter_id,true)}${startFields(row)}</div><fieldset><legend>필수 참석 면접관</legend><p class="im-muted">전화 1~4명 · 전문성/임원 2~4명 · HR 2명. 배정 면접관 전원이 참석해야 합니다.</p><div class="im-checks">${data.users.filter(user=>user.active&&user.role==="INTERVIEWER").map(user=>`<label><input type="checkbox" name="interviewer_ids" value="${escape(user.id)}" ${row.interviewer_ids?.includes(user.id)?"checked":""}>${escape(user.name)}</label>`).join("")||"활성 면접관 계정을 먼저 생성해주세요."}</div></fieldset><div class="im-actions"><button class="im-button im-primary" type="submit">${row.id?"수정 저장":"면접 생성"}</button><button class="im-button" type="button" data-tab="list">돌아가기</button></div></form></section>`;
  }
  function users() {
    return `${secret?`<div class="im-secret" role="status"><strong>초기 비밀번호 (이번 화면에서만 표시)</strong><code>${escape(secret)}</code><p>해당 사용자에게 안전한 방법으로 전달하고 로그인 후 변경을 안내해주세요.</p><button class="im-button" data-dismiss-secret>닫기</button></div>`:""}<section class="im-card"><h3>계정 생성</h3><form id="im-user-form" class="im-form"><div class="im-grid"><label>이름<input name="name" required maxlength="80"></label><label>로그인 이메일<input name="email" type="email" required maxlength="254"></label><label>권한<select name="role">${Object.entries(roles).map(([key,label])=>option(key,label,"INTERVIEWER")).join("")}</select></label>${initialPasswordFields()}</div><button class="im-button im-primary">계정 생성 및 초기 비밀번호 발급</button></form></section><section class="im-card"><h3>사용자 관리</h3><p class="im-muted">배정 중인 계정의 권한·활성 상태 변경은 차단됩니다.</p><div class="im-table-wrap"><table class="im-table"><thead><tr><th>이름 / 아이디</th><th>권한</th><th>상태</th><th>관리</th></tr></thead><tbody>${data.users.map(user=>`<tr><td>${escape(user.name)}<br><span class="im-muted">${escape(user.email)}</span></td><td>${roles[user.role]}</td><td>${user.active?"활성":"정지"}</td><td><button class="im-button" data-user="${escape(user.id)}">권한 관리</button> <button class="im-button" data-reset="${escape(user.id)}">비밀번호 초기화</button></td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function userEdit() {
    const user=data.users.find(user=>user.id===selectedId);
    return `<section class="im-card"><h3>${escape(user.name)} 계정 관리</h3><form id="im-user-edit" class="im-form"><label>권한<select name="role">${Object.entries(roles).map(([key,label])=>option(key,label,user.role)).join("")}</select></label><label>상태<select name="active">${option("true","활성",String(user.active))}${option("false","정지",String(user.active))}</select></label><button class="im-button im-primary">저장</button></form></section>`;
  }
  function departments() {
    return `<section class="im-card"><h3>부서 관리</h3><form id="im-department-form" class="im-form"><label>부서 이름<input name="name" required maxlength="80"></label><button class="im-button im-primary">부서 추가</button></form><p>${data.departments.map(d=>escape(d.name)).join(" · ")||"등록된 부서가 없습니다."}</p></section><section class="im-card"><h3>HRBP 부서 접근 권한</h3><form id="im-access-form" class="im-form"><div class="im-grid">${userSelect("user_id","HRBP","HRBP")}<label>부서<select name="department_id" required>${option("","선택해주세요","")}${data.departments.map(d=>option(d.id,d.name,"")).join("")}</select></label><label>접근 설정<select name="enabled">${option("true","허용","true")}${option("false","해제","true")}</select></label></div><button class="im-button im-primary">접근 권한 저장</button></form><ul>${data.access.map(a=>`<li>${escape(data.users.find(u=>u.id===a.user_id)?.name)} · ${escape(data.departments.find(d=>d.id===a.department_id)?.name)}</li>`).join("")}</ul></section><section class="im-card"><h3>유형별 기본 소요 시간</h3><form id="im-type-form" class="im-form"><label>면접 유형<select name="type">${Object.entries(types).map(([key,label])=>option(key,label,"PHONE")).join("")}</select></label><label>기본 소요 시간 (분)<input name="duration_minutes" type="number" min="15" max="480" required value="${data.types.find(t=>t.type==="PHONE")?.duration_minutes||30}"></label><button class="im-button im-primary">기본 시간 저장</button></form></section>`;
  }
  function render() {
    const tabs=[["dashboard","대시보드"],["list",data.actor.role==="CANDIDATE"?"내 면접":"면접 목록"],["calendar","일정 캘린더"],...(recruiter()?[["create","면접 생성"],["emails","이메일 승인함"],["users","사용자 관리"],["departments","부서·기본 시간"]]:[]),["password","비밀번호 변경"]];
    if(![...tabs.map(t=>t[0]),"detail",...(recruiter()?["user-edit","reset-password"]:[])].includes(tab)) tab="dashboard";
    document.querySelector("#im-tabs").innerHTML=tabs.filter(([key])=>!unified||!["users","password"].includes(key)).map(([key,label])=>`<button type="button" class="im-button ${tab===key?"is-active":""}" data-tab="${key}" ${tab===key?'aria-current="page"':""}>${label}</button>`).join("");
    const views={ dashboard, list, detail, calendar, emails, create:interviewForm, users, departments, "user-edit":userEdit,"reset-password":resetPasswordForm, password:()=>`<section class="im-card im-login"><h3>내 비밀번호 변경</h3><form id="im-password-form" class="im-form"><label>새 비밀번호<input name="password" type="password" autocomplete="new-password" required minlength="12" maxlength="128"></label><label>새 비밀번호 확인<input name="confirm" type="password" autocomplete="new-password" required minlength="12" maxlength="128"></label><button class="im-button im-primary">비밀번호 변경</button></form></section>` };
    root.innerHTML=views[tab]();
  }
  async function run(action) {
    if(busy)return; busy=true;
    document.querySelectorAll("button").forEach(b=>b.disabled=true);
    message("처리 중입니다.");
    try { await action(); } catch(error) { message(error.message,true); }
    finally { busy=false; document.querySelectorAll("button").forEach(b=>b.disabled=false); }
  }
  document.addEventListener("click",event=>{
    const button=event.target.closest("button"); if(!button||busy)return;
    if(button.dataset.tab) { if(tab!==button.dataset.tab)secret=null; tab=button.dataset.tab; selectedId=""; schedule=null; availabilityEdit=""; message("");render();if(tab==="calendar")run(async()=>{await refresh();message("");}); }
    if(button.dataset.detail) { selectedId=button.dataset.detail; tab="detail";schedule=null;availabilityEdit="";run(async()=>{await refresh();message("");}); }
    if(button.dataset.edit) { selectedId=button.dataset.edit; tab="create"; render(); }
    if(button.dataset.user) { selectedId=button.dataset.user; tab="user-edit"; secret=null; render(); }
    if(button.hasAttribute("data-dismiss-secret")) { secret=null; render(); }
    if(button.hasAttribute("data-mail-refresh"))run(async()=>{await refresh();message("초안 목록을 갱신했습니다.");});
    if(button.hasAttribute("data-mail-select-all")){mailSelected.clear();mailDrafts.filter(d=>d.valid&&d.status==="PENDING").slice(0,50).forEach(d=>mailSelected.add(d.id));render();}
    if(button.dataset.mailEdit){mailEditId=button.dataset.mailEdit;render();}
    if(button.hasAttribute("data-mail-approve"))run(async()=>{const items=mailDrafts.filter(d=>mailSelected.has(d.id)&&d.valid&&d.status==="PENDING").map(mailItem);if(!items.length)throw new Error("승인할 초안을 선택해주세요.");await api("mail/approve",{items});mailSelected.clear();await refresh();message("선택한 초안을 승인했습니다.");});
    if(button.hasAttribute("data-mail-process"))run(async()=>{const result=await api("mail/process",{});await refresh();message(result.enabled?`이메일 처리 완료: 전송 접수 ${result.sent}건, 실패 ${result.failed}건`:"외부 이메일 발송이 비활성화되어 있습니다.");});
    if(button.hasAttribute("data-refresh-schedule"))run(async()=>{availabilityEdit="";await refresh();message("일정 정보를 갱신했습니다.");});
    if(button.dataset.availabilityEdit){availabilityEdit=button.dataset.availabilityEdit;render();document.querySelector("#im-availability-form")?.scrollIntoView({block:"center"});}
    if(button.hasAttribute("data-availability-edit-clear")){availabilityEdit="";render();}
    if(button.dataset.availabilityDelete&&window.confirm("등록된 가능 시간을 삭제하시겠습니까?"))run(async()=>{const row=schedule.availability.find(a=>a.id===button.dataset.availabilityDelete);await api("coordinate",{interview_id:selectedId,action:"availability_delete",data:{id:row.id,user_id:row.user_id}});availabilityEdit="";await refresh();message("가능 시간을 삭제했습니다.");});
    if(button.dataset.selectProposal&&window.confirm("이 시간으로 면접을 확정하시겠습니까?"))run(async()=>{try{await api("proposals/select",{interview_id:selectedId,proposal_id:button.dataset.selectProposal});await refresh();message("면접 일정이 확정되었습니다. 확정 안내 이메일은 담당자 승인 후 발송됩니다.");}catch(error){await refresh();throw error;}});
    if(button.dataset.cancel&&window.confirm("면접을 취소하시겠습니까?")) run(async()=>{await api("interviews/cancel",{id:button.dataset.cancel});await refresh();message("면접을 취소했습니다.");});
    if(button.dataset.reset) { selectedId=button.dataset.reset;tab="reset-password";secret=null;render(); }
    if(button.id==="im-logout") run(async()=>{const result=await client.auth.signOut();if(result.error)throw result.error;showLogin();message("로그아웃했습니다.");});
  });
  document.addEventListener("submit",event=>{
    const form=event.target; if(!form.id.startsWith("im-")&&!form.matches(".im-review-form,.im-mail-edit-form"))return;event.preventDefault();
    run(async()=>{
      const values=Object.fromEntries(new FormData(form));
      if(form.matches(".im-mail-edit-form")){const draft=mailDrafts.find(d=>d.id===form.dataset.draftId);await api("mail/edit",{items:[mailItem(draft)],note:values.note});mailEditId="";mailSelected.clear();await refresh();message("초안을 수정했습니다. 다시 승인해주세요.");return;}
      if(form.id==="im-login-form") {
        const { error }=await client.auth.signInWithPassword({email:values.email,password:values.password});
        form.elements.password.value="";
        if(error) throw new Error("아이디 또는 비밀번호를 확인해주세요.");
        try { await refresh(); } catch(error) { await client.auth.signOut(); showLogin(); throw error; }
        message("로그인했습니다.");return;
      }
      if(form.id==="im-password-form") {
        if(values.password!==values.confirm)throw new Error("비밀번호 확인이 일치하지 않습니다.");
        const {error}=await client.auth.updateUser({password:values.password});
        if(error)throw new Error("비밀번호를 변경하지 못했습니다. 다시 로그인한 후 시도해주세요.");
        form.reset();message("비밀번호를 변경했습니다.");return;
      }
      const coordinationForms={"im-availability-form":"availability","im-request-availability-form":"request_availability","im-publish-form":"publish","im-change-request-form":"change_request","im-reopen-form":"reopen"};
      if(coordinationForms[form.id]||form.matches(".im-review-form")){
        const action=coordinationForms[form.id]||"review_request";
        const input={...values};
        if(values.starts_at)input.starts_at=kstTime(values.starts_at);else delete input.starts_at;
        if(values.ends_at)input.ends_at=kstTime(values.ends_at);else delete input.ends_at;
        if(action==="reopen"&&values.coordination_start_mode==="SCHEDULED")input.window_start=kstTime(values.window_start);
        if(action==="availability"&&availabilityEdit)input.id=availabilityEdit;
        if(action==="publish"){input.starts=new FormData(form).getAll("starts");input.version=schedule.version;}
        if(action==="review_request")input.id=form.dataset.requestId;
        await api("coordinate",{interview_id:selectedId,action,data:input});availabilityEdit="";await refresh();message("일정 조율 내용을 저장했습니다.");return;
      }
      if(form.id==="im-interview-form") {
        values.duration_minutes=Number(values.duration_minutes);
        values.interviewer_ids=new FormData(form).getAll("interviewer_ids");
        if(values.coordination_start_mode==="SCHEDULED")values.window_start=kstTime(values.window_start);else delete values.window_start;
        const saved=await api(selectedId?"interviews/update":"interviews",{...values,...(selectedId?{id:selectedId}:{})});
        selectedId=saved.id;tab="detail";
      } else if(form.id==="im-user-form") {
        if(values.initial_password!==values.initial_password_confirm)throw new Error("초기 비밀번호 확인이 일치하지 않습니다.");
        delete values.initial_password_confirm;
        await api("users",values);form.reset();secret=null;
      } else if(form.id==="im-reset-form") {
        if(values.initial_password!==values.initial_password_confirm)throw new Error("초기 비밀번호 확인이 일치하지 않습니다.");
        await api("users/reset-password",{id:selectedId,initial_password:values.initial_password});form.reset();secret=null;tab="users";
      } else if(form.id==="im-user-edit") { await api("users/update",{id:selectedId,role:values.role,active:values.active==="true"});tab="users";
      } else if(form.id==="im-department-form") { await api("departments",values);
      } else if(form.id==="im-access-form") { await api("department-access",{...values,enabled:values.enabled==="true"});
      } else if(form.id==="im-type-form") { await api("type-settings",{...values,duration_minutes:Number(values.duration_minutes)}); }
      await refresh();message("저장했습니다.");
    });
  });
  document.addEventListener("input",event=>{
    if(!["im-search","im-filter"].includes(event.target.id))return;
    const query=document.querySelector("#im-search").value.toLowerCase();
    const status=document.querySelector("#im-filter").value;
    document.querySelector("#im-results").innerHTML=table(data.interviews.filter(row=>(!status||row.status===status)&&`${row.position} ${row.candidate_name||""}`.toLowerCase().includes(query)));
  });
  document.addEventListener("change",event=>{
    if(event.target.name==="coordination_start_mode") {const form=event.target.form,scheduled=event.target.value==="SCHEDULED",label=form.querySelector("[data-scheduled-start]");label.hidden=!scheduled;form.elements.window_start.disabled=!scheduled;form.elements.window_start.required=scheduled;}
    if(event.target.dataset.mailSelect){if(event.target.checked)mailSelected.add(event.target.dataset.mailSelect);else mailSelected.delete(event.target.dataset.mailSelect);}
    if(event.target.name==="type") { const form=event.target.form;if(form?.elements.duration_minutes)form.elements.duration_minutes.value=data.types.find(t=>t.type===event.target.value)?.duration_minutes||60; }
  });
  async function init() {
    const shared=window.__APP_CONFIG__||{};
    const config={supabaseUrl:shared.interviewManagementSupabaseUrl||shared.supabaseUrl,supabaseAnonKey:shared.interviewManagementSupabaseAnonKey||shared.supabaseAnonKey};
    if(!config.supabaseUrl||!config.supabaseAnonKey||!window.supabase?.createClient) {
      document.querySelector("#im-login-form").hidden=true;
      message("Supabase Auth 설정과 신규 DB 마이그레이션이 필요합니다. 기존 TalentHub 계정과 별도 영역입니다.");return;
    }
    client=unified && embedded ? window.parent.TalentAuth?.client : window.supabase.createClient(config.supabaseUrl,config.supabaseAnonKey,{auth:{storageKey:"talenthub-interview-mgmt-v2-auth",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    if (!client) { showLogin(); return; }
    const {data:sessionData}=await client.auth.getSession();
    if(sessionData.session) await run(async()=>{try { await refresh();message(""); } catch(error) { showLogin();throw error; }});
    client.auth.onAuthStateChange(event=>{if(event==="SIGNED_OUT") {showLogin();message("로그인이 종료되었습니다.");}});
  }
  init().catch(error=>message(error.message,true));
})();
