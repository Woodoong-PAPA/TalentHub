function loadLocalEnv() {
  try {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.join(process.cwd(), ".env");

    if (!fs.existsSync(envPath)) {
      return;
    }

    fs.readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .forEach((line) => {
        const match = line.match(/^([A-Z0-9_]+)=(.*)$/);

        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2];
        }
      });
  } catch (error) {
    console.warn("Local env could not be loaded.", error);
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

function normalizeEmailList(value) {
  const rawList = Array.isArray(value)
    ? value
    : String(value || "").split(/[\n,;]+/);

  return [...new Set(rawList
    .map((item) => String(item || "").trim().toLowerCase())
    .filter(Boolean))];
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getProviderConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY || "",
    from: process.env.RESEND_FROM || process.env.MAIL_FROM || ""
  };
}

function assertProviderConfigured() {
  const config = getProviderConfig();

  if (!config.apiKey || !config.from) {
    throw new Error("메일 provider가 설정되어 있지 않습니다. RESEND_API_KEY와 RESEND_FROM을 환경변수로 설정해주세요.");
  }

  return config;
}

function buildContactRequestMail(body) {
  const folder = body.folder || {};
  const applicant = body.applicant || {};
  const searchFirmName = body.searchFirmName || "서치펌 담당자";

  return {
    to: normalizeEmailList(body.recipient),
    subject: `[TalentHub Screening] ${applicant.name || "지원자"} 연락처 정보 요청`,
    text: [
      `${searchFirmName}님,`,
      "",
      "아래 지원자가 2단계 스크리닝을 통과하여 전화면접 안내 전 연락처 확인이 필요합니다.",
      "",
      `지원자명: ${applicant.name || "-"}`,
      `채용 부서명: ${folder.department || "-"}`,
      `포지션명: ${folder.positionName || folder.title || "-"}`,
      "",
      "TalentHub Screening 메뉴에서 지원자의 이메일 주소와 휴대폰 번호를 입력해주세요."
    ].join("\n"),
    html: `
      <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.6">
        <h2 style="margin:0 0 12px">지원자 연락처 정보 요청</h2>
        <p>${escapeHtml(searchFirmName)}님, 아래 지원자가 2단계 스크리닝을 통과하여 전화면접 안내 전 연락처 확인이 필요합니다.</p>
        <table style="border-collapse:collapse;width:100%;max-width:620px">
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">지원자명</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(applicant.name || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">채용 부서명</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(folder.department || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">포지션명</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(folder.positionName || folder.title || "-")}</td></tr>
        </table>
        <p style="margin-top:16px">TalentHub Screening 메뉴에서 지원자의 이메일 주소와 휴대폰 번호를 입력해주세요.</p>
      </div>
    `
  };
}

function buildPhoneInterviewMail(body) {
  const folder = body.folder || {};
  const applicant = body.applicant || {};
  const interviewPanel = body.interviewPanel || {};
  const availability = interviewPanel.availability || "";
  const positionName = folder.positionName || folder.title || "";
  const department = folder.department || "";

  return {
    to: normalizeEmailList(body.recipients),
    subject: `[TalentHub Screening] ${applicant.name || "후보자"} 전화면접 안내`,
    text: [
      `${applicant.name || "후보자"}님,`,
      "",
      "전화면접 가능 시간대를 안내드립니다.",
      "",
      `후보자 이름: ${applicant.name || "-"}`,
      `면접 가능 시간대: ${availability || "-"}`,
      `채용 부서명: ${department || "-"}`,
      `포지션명: ${positionName || "-"}`,
      "",
      "위 시간대 중 가능한 시간을 회신해주세요."
    ].join("\n"),
    html: `
      <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.6">
        <h2 style="margin:0 0 12px">전화면접 안내</h2>
        <p>${escapeHtml(applicant.name || "후보자")}님, 전화면접 가능 시간대를 안내드립니다.</p>
        <table style="border-collapse:collapse;width:100%;max-width:620px">
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">후보자 이름</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(applicant.name || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">면접 가능 시간대</th><td style="padding:8px;border:1px solid #e5e8eb;white-space:pre-line">${escapeHtml(availability || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">채용 부서명</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(department || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">포지션명</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(positionName || "-")}</td></tr>
        </table>
        <p style="margin-top:16px">위 시간대 중 가능한 시간을 회신해주세요.</p>
      </div>
    `
  };
}

function buildInterviewStepRequestMail(body) {
  const interviewCase = body.interviewCase || {};
  const stage = body.stage || {};
  const stageData = body.stageData || {};
  const documents = Array.isArray(stage.documents) ? stage.documents : [];
  const scheduleText = body.scheduleText || "";
  const panel = Array.isArray(stageData.panel) ? stageData.panel : [];

  return {
    to: normalizeEmailList(body.recipients),
    subject: `[TalentHub Interview] ${interviewCase.candidateName || "지원자"} ${stage.label || "인터뷰"} 입력 요청`,
    text: [
      `${interviewCase.candidateName || "지원자"} 인터뷰 진행을 위해 아래 정보 확인이 필요합니다.`,
      "",
      `포지션: ${interviewCase.positionName || "-"}`,
      `채용 부서: ${interviewCase.department || "-"}`,
      `인터뷰 단계: ${stage.label || "-"}`,
      `참석 기준: ${stage.requirement || "-"}`,
      "",
      documents.length ? "요청 제출자료:" : "",
      ...documents.map((item) => `- ${item.owner || "대상자"}: ${item.label || "-"}`),
      "",
      panel.length ? "면접위원 정보:" : "",
      ...panel.map((member) => `- ${[member.role, member.level, member.name, member.email].filter(Boolean).join(" / ")}`),
      "",
      scheduleText ? `일정 참고:\n${scheduleText}` : "가능 시간대를 TalentHub Interview 메뉴에 입력 또는 회신해주세요."
    ].filter((line) => line !== "").join("\n"),
    html: `
      <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.6">
        <h2 style="margin:0 0 12px">인터뷰 입력 요청</h2>
        <p>${escapeHtml(interviewCase.candidateName || "지원자")} 인터뷰 진행을 위해 아래 정보 확인이 필요합니다.</p>
        <table style="border-collapse:collapse;width:100%;max-width:680px">
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">포지션</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(interviewCase.positionName || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">채용 부서</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(interviewCase.department || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">인터뷰 단계</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(stage.label || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">참석 기준</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(stage.requirement || "-")}</td></tr>
        </table>
        ${documents.length ? `
          <h3 style="margin:18px 0 8px;font-size:15px">요청 제출자료</h3>
          <ul style="margin:0;padding-left:18px">${documents.map((item) => `<li>${escapeHtml(item.owner || "대상자")}: ${escapeHtml(item.label || "-")}</li>`).join("")}</ul>
        ` : ""}
        ${panel.length ? `
          <h3 style="margin:18px 0 8px;font-size:15px">면접위원 정보</h3>
          <ul style="margin:0;padding-left:18px">${panel.map((member) => `<li>${escapeHtml([member.role, member.level, member.name, member.email].filter(Boolean).join(" / ") || "-")}</li>`).join("")}</ul>
        ` : ""}
        ${scheduleText ? `<p style="margin-top:16px;white-space:pre-line">${escapeHtml(scheduleText)}</p>` : `<p style="margin-top:16px">가능 시간대를 TalentHub Interview 메뉴에 입력 또는 회신해주세요.</p>`}
      </div>
    `
  };
}

function buildInterviewScheduleConfirmedMail(body) {
  const interviewCase = body.interviewCase || {};
  const stage = body.stage || {};
  const stageData = body.stageData || {};
  const scheduleText = body.scheduleText || "";

  return {
    to: normalizeEmailList(body.recipients),
    subject: `[TalentHub Interview] ${interviewCase.candidateName || "지원자"} ${stage.label || "인터뷰"} 일정 확정`,
    text: [
      `${interviewCase.candidateName || "지원자"} ${stage.label || "인터뷰"} 일정이 확정되었습니다.`,
      "",
      `포지션: ${interviewCase.positionName || "-"}`,
      `채용 부서: ${interviewCase.department || "-"}`,
      `확정 일정: ${scheduleText || stageData.confirmedAt || "-"}`,
      "",
      "일정 변경이 필요한 경우 TalentHub Interview 메뉴에서 변경 요청 내용을 기록한 뒤 재안내해주세요."
    ].join("\n"),
    html: `
      <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.6">
        <h2 style="margin:0 0 12px">인터뷰 일정 확정</h2>
        <p>${escapeHtml(interviewCase.candidateName || "지원자")} ${escapeHtml(stage.label || "인터뷰")} 일정이 확정되었습니다.</p>
        <table style="border-collapse:collapse;width:100%;max-width:680px">
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">포지션</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(interviewCase.positionName || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">채용 부서</th><td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(interviewCase.department || "-")}</td></tr>
          <tr><th align="left" style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa">확정 일정</th><td style="padding:8px;border:1px solid #e5e8eb;white-space:pre-line">${escapeHtml(scheduleText || stageData.confirmedAt || "-")}</td></tr>
        </table>
        <p style="margin-top:16px">일정 변경이 필요한 경우 TalentHub Interview 메뉴에서 변경 요청 내용을 기록한 뒤 재안내해주세요.</p>
      </div>
    `
  };
}

function buildInterviewRejectNoticeMail(body) {
  const interviewCase = body.interviewCase || {};
  const stage = body.stage || {};

  return {
    to: normalizeEmailList(body.recipients),
    subject: `[TalentHub Interview] ${interviewCase.candidateName || "지원자"} 전형 결과 안내`,
    text: [
      `${interviewCase.candidateName || "지원자"}님,`,
      "",
      `${interviewCase.positionName || "지원 포지션"} 전형 결과를 안내드립니다.`,
      `${stage.label || "인터뷰"} 단계 검토 결과, 이번 전형은 더 진행하지 않는 것으로 결정되었습니다.`,
      "",
      "지원해주셔서 감사합니다."
    ].join("\n"),
    html: `
      <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.6">
        <h2 style="margin:0 0 12px">전형 결과 안내</h2>
        <p>${escapeHtml(interviewCase.candidateName || "지원자")}님,</p>
        <p>${escapeHtml(interviewCase.positionName || "지원 포지션")} 전형 결과를 안내드립니다.</p>
        <p>${escapeHtml(stage.label || "인터뷰")} 단계 검토 결과, 이번 전형은 더 진행하지 않는 것으로 결정되었습니다.</p>
        <p style="margin-top:16px">지원해주셔서 감사합니다.</p>
      </div>
    `
  };
}

function buildMailPayload(body) {
  if (body.action === "contact_request") {
    return buildContactRequestMail(body);
  }

  if (body.action === "phone_interview") {
    return buildPhoneInterviewMail(body);
  }

  if (body.action === "interview_step_request") {
    return buildInterviewStepRequestMail(body);
  }

  if (body.action === "interview_schedule_confirmed") {
    return buildInterviewScheduleConfirmedMail(body);
  }

  if (body.action === "interview_reject_notice") {
    return buildInterviewRejectNoticeMail(body);
  }

  throw new Error("지원하지 않는 Screening 메일 액션입니다.");
}

async function sendEmailViaResend(mail) {
  const config = assertProviderConfigured();
  const invalidRecipients = mail.to.filter((email) => !isValidEmail(email));

  if (!mail.to.length) {
    throw new Error("메일 수신처가 없습니다.");
  }

  if (invalidRecipients.length) {
    throw new Error(`올바르지 않은 메일 주소입니다: ${invalidRecipients.join(", ")}`);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: config.from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text
    })
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`메일 발송 실패: ${response.status} ${text.slice(0, 300)}`);
  }

  return text ? JSON.parse(text) : {};
}

module.exports = async function screeningMail(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  loadLocalEnv();

  try {
    const body = await readJsonBody(request);
    const mail = buildMailPayload(body);
    const result = await sendEmailViaResend(mail);

    sendJson(response, 200, {
      ok: true,
      message: "메일 발송을 완료했습니다.",
      recipients: mail.to,
      result
    });
  } catch (error) {
    console.warn("Screening mail failed.", error);
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Screening mail failed"
    });
  }
};
