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
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }

  const body = Buffer.concat(chunks).toString("utf8");

  if (!body.trim()) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    const parseError = new Error("요청 본문을 JSON으로 해석하지 못했습니다.");
    parseError.statusCode = 400;
    parseError.cause = error;
    throw parseError;
  }
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
    const error = new Error("메일 발송 환경변수 RESEND_API_KEY와 RESEND_FROM을 설정해주세요.");
    error.statusCode = 503;
    throw error;
  }

  return config;
}

function tableRows(rows) {
  return rows
    .map(([label, value]) => `
      <tr>
        <th align="left" style="width:160px;padding:10px;border:1px solid #e5e8eb;background:#f8f9fa;font-weight:700">${escapeHtml(label)}</th>
        <td style="padding:10px;border:1px solid #e5e8eb;white-space:pre-line">${escapeHtml(value || "-")}</td>
      </tr>
    `)
    .join("");
}

function buildMailFrame(title, intro, rows, footer = "") {
  return `
    <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.65;max-width:720px;margin:0 auto">
      <h2 style="margin:0 0 14px;font-size:22px;line-height:1.35">${escapeHtml(title)}</h2>
      ${intro ? `<p style="margin:0 0 18px">${escapeHtml(intro)}</p>` : ""}
      <table style="border-collapse:collapse;width:100%;margin:0 0 16px">
        ${tableRows(rows)}
      </table>
      ${footer ? `<p style="margin:14px 0 0;white-space:pre-line">${escapeHtml(footer)}</p>` : ""}
    </div>
  `;
}

function buildContactRequestMail(body) {
  const folder = body.folder || {};
  const applicant = body.applicant || {};
  const searchFirmName = body.searchFirmName || "서치펌 담당자";
  const positionName = folder.positionName || folder.title || "";

  const text = [
    `${searchFirmName}님,`,
    "",
    "아래 지원자가 서류 스크리닝 이후 전화면접 안내 대상자로 검토되고 있어 연락처 확인이 필요합니다.",
    "",
    `지원자명: ${applicant.name || "-"}`,
    `채용 부서명: ${folder.department || "-"}`,
    `포지션명: ${positionName || "-"}`,
    "",
    "Talent Pool 서류 평가 지원 메뉴에서 지원자의 이메일 주소와 휴대폰 번호를 입력해주세요."
  ].join("\n");

  return {
    to: normalizeEmailList(body.recipient),
    subject: `[TalentHub Screening] ${applicant.name || "지원자"} 연락처 정보 요청`,
    text,
    html: buildMailFrame(
      "지원자 연락처 정보 요청",
      `${searchFirmName}님, 아래 지원자의 전화면접 안내를 위해 연락처 확인이 필요합니다.`,
      [
        ["지원자명", applicant.name],
        ["채용 부서명", folder.department],
        ["포지션명", positionName]
      ],
      "Talent Pool 서류 평가 지원 메뉴에서 지원자의 이메일 주소와 휴대폰 번호를 입력해주세요."
    )
  };
}

function buildPhoneInterviewMail(body) {
  const folder = body.folder || {};
  const applicant = body.applicant || {};
  const interviewPanel = body.interviewPanel || {};
  const availability = interviewPanel.availability || "";
  const positionName = folder.positionName || folder.title || "";
  const department = folder.department || "";

  const text = [
    `${applicant.name || "후보자"}님,`,
    "",
    "전화면접 가능 시간대를 안내드립니다.",
    "",
    `후보자 이름: ${applicant.name || "-"}`,
    `면접 가능 시간대: ${availability || "-"}`,
    `채용 부서명: ${department || "-"}`,
    `포지션명: ${positionName || "-"}`,
    "",
    "가능한 일정 확인 후 회신 부탁드립니다."
  ].join("\n");

  return {
    to: normalizeEmailList(body.recipients),
    subject: `[TalentHub Screening] ${applicant.name || "후보자"} 전화면접 안내`,
    text,
    html: buildMailFrame(
      "전화면접 안내",
      `${applicant.name || "후보자"}님, 전화면접 가능 시간대를 안내드립니다.`,
      [
        ["후보자 이름", applicant.name],
        ["면접 가능 시간대", availability],
        ["채용 부서명", department],
        ["포지션명", positionName]
      ],
      "가능한 일정 확인 후 회신 부탁드립니다."
    )
  };
}

function buildInterviewStepRequestMail(body) {
  const interviewCase = body.interviewCase || {};
  const stage = body.stage || {};
  const stageData = body.stageData || {};
  const documents = Array.isArray(stage.documents) ? stage.documents : [];
  const scheduleText = body.scheduleText || "";
  const panel = Array.isArray(stageData.panel) ? stageData.panel : [];
  const documentText = documents
    .map((item) => `- ${item.owner || "대상자"}: ${item.label || "-"}`)
    .join("\n");
  const panelText = panel
    .map((member) => `- ${[member.role, member.level, member.name, member.email].filter(Boolean).join(" / ")}`)
    .join("\n");

  const text = [
    `${interviewCase.candidateName || "지원자"} 인터뷰 진행을 위해 아래 정보 확인이 필요합니다.`,
    "",
    `포지션: ${interviewCase.positionName || "-"}`,
    `채용 부서: ${interviewCase.department || "-"}`,
    `인터뷰 단계: ${stage.label || "-"}`,
    `참석 기준: ${stage.requirement || "-"}`,
    documentText ? `\n요청 제출자료:\n${documentText}` : "",
    panelText ? `\n면접위원 정보:\n${panelText}` : "",
    scheduleText ? `\n일정 참고:\n${scheduleText}` : "\n가능 시간대를 Talent Pool Interview 메뉴에 입력하거나 회신해주세요."
  ].filter(Boolean).join("\n");

  return {
    to: normalizeEmailList(body.recipients),
    subject: `[TalentHub Interview] ${interviewCase.candidateName || "지원자"} ${stage.label || "인터뷰"} 입력 요청`,
    text,
    html: buildMailFrame(
      "인터뷰 입력 요청",
      `${interviewCase.candidateName || "지원자"} 인터뷰 진행을 위해 아래 정보 확인이 필요합니다.`,
      [
        ["포지션", interviewCase.positionName],
        ["채용 부서", interviewCase.department],
        ["인터뷰 단계", stage.label],
        ["참석 기준", stage.requirement],
        ["요청 제출자료", documentText],
        ["면접위원 정보", panelText],
        ["일정 참고", scheduleText || "가능 시간대를 Talent Pool Interview 메뉴에 입력하거나 회신해주세요."]
      ]
    )
  };
}

function buildInterviewScheduleConfirmedMail(body) {
  const interviewCase = body.interviewCase || {};
  const stage = body.stage || {};
  const stageData = body.stageData || {};
  const scheduleText = body.scheduleText || stageData.confirmedAt || "";

  return {
    to: normalizeEmailList(body.recipients),
    subject: `[TalentHub Interview] ${interviewCase.candidateName || "지원자"} ${stage.label || "인터뷰"} 일정 확정`,
    text: [
      `${interviewCase.candidateName || "지원자"} ${stage.label || "인터뷰"} 일정이 확정되었습니다.`,
      "",
      `포지션: ${interviewCase.positionName || "-"}`,
      `채용 부서: ${interviewCase.department || "-"}`,
      `확정 일정: ${scheduleText || "-"}`,
      "",
      "일정 변경이 필요한 경우 Talent Pool Interview 메뉴에서 변경 요청 내용을 기록한 후 재안내해주세요."
    ].join("\n"),
    html: buildMailFrame(
      "인터뷰 일정 확정",
      `${interviewCase.candidateName || "지원자"} ${stage.label || "인터뷰"} 일정이 확정되었습니다.`,
      [
        ["포지션", interviewCase.positionName],
        ["채용 부서", interviewCase.department],
        ["확정 일정", scheduleText]
      ],
      "일정 변경이 필요한 경우 Talent Pool Interview 메뉴에서 변경 요청 내용을 기록한 후 재안내해주세요."
    )
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
    html: buildMailFrame(
      "전형 결과 안내",
      `${interviewCase.candidateName || "지원자"}님, ${interviewCase.positionName || "지원 포지션"} 전형 결과를 안내드립니다.`,
      [
        ["포지션", interviewCase.positionName],
        ["전형 단계", stage.label],
        ["결과", "이번 전형은 더 진행하지 않는 것으로 결정되었습니다."]
      ],
      "지원해주셔서 감사합니다."
    )
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

  const error = new Error("지원하지 않는 Screening 메일 액션입니다.");
  error.statusCode = 400;
  throw error;
}

function textToHtml(text) {
  return `
    <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.7;max-width:720px;margin:0 auto">
      ${escapeHtml(text).replace(/\r?\n/g, "<br>")}
    </div>
  `;
}

function applyMailOverride(mail, override = {}) {
  if (!override || typeof override !== "object") {
    return mail;
  }

  const recipients = normalizeEmailList(override.recipients || override.to || override.recipient);
  const subject = String(override.subject || "").trim();
  const text = String(override.text || "").trim();
  const html = String(override.html || "").trim();

  return {
    ...mail,
    to: recipients.length ? recipients : mail.to,
    subject: subject || mail.subject,
    text: text || mail.text,
    html: html || (text ? textToHtml(text) : mail.html)
  };
}

async function sendEmailViaResend(mail) {
  const config = assertProviderConfigured();
  const invalidRecipients = mail.to.filter((email) => !isValidEmail(email));

  if (!mail.to.length) {
    const error = new Error("메일 수신처가 없습니다.");
    error.statusCode = 400;
    throw error;
  }

  if (invalidRecipients.length) {
    const error = new Error(`올바르지 않은 메일 주소입니다: ${invalidRecipients.join(", ")}`);
    error.statusCode = 400;
    throw error;
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
  let payload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch (error) {
    payload = { raw: text.slice(0, 500) };
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || payload?.raw || "Resend API error";
    const error = new Error(`메일 발송 실패: ${response.status} ${message}`);
    error.statusCode = response.status >= 400 && response.status < 500 ? 400 : 502;
    throw error;
  }

  return payload;
}

module.exports = async function screeningMail(request, response) {
  loadLocalEnv();

  if (request.method === "OPTIONS") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const mail = applyMailOverride(buildMailPayload(body), body.mailOverride);
    const result = await sendEmailViaResend(mail);

    sendJson(response, 200, {
      ok: true,
      message: "메일 발송이 완료되었습니다.",
      recipients: mail.to,
      result
    });
  } catch (error) {
    console.warn("Screening mail failed.", error);
    sendJson(response, error.statusCode || 500, {
      ok: false,
      error: error.message || "Screening mail failed"
    });
  }
};
