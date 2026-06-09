const APP_BASE_URL = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://talentpool-dx.com";

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

function formatField(value) {
  const text = String(value || "").trim();
  return text || "-";
}

function buildInfoRow(label, value) {
  return `
    <tr>
      <th align="left" style="width:150px;padding:10px 12px;border:1px solid #e5e8eb;background:#f8f9fa;color:#6b7684;font-size:13px">${escapeHtml(label)}</th>
      <td style="padding:10px 12px;border:1px solid #e5e8eb;color:#191f28;font-size:14px">${escapeHtml(formatField(value))}</td>
    </tr>
  `;
}

function buildSignupAlertMail(recipients, member) {
  const memberName = member.name || member.email || "회원가입 신청자";
  const subject = `[Talent Pool] 회원가입 승인 요청 - ${memberName}`;
  const rows = [
    ["이름", member.name],
    ["이메일", member.email],
    ["신청 등급", member.roleLabel || member.role],
    ["사업부", member.businessUnit],
    ["부서", member.department],
    ["직급/직책", member.position],
    ["연락처", member.phone],
    ["사용 목적", member.note],
    ["신청일", member.requestedAt]
  ];

  const text = [
    "Talent Pool 회원가입 승인 요청이 접수되었습니다.",
    "",
    `이름: ${formatField(member.name)}`,
    `이메일: ${formatField(member.email)}`,
    `신청 등급: ${formatField(member.roleLabel || member.role)}`,
    `사업부: ${formatField(member.businessUnit)}`,
    `부서: ${formatField(member.department)}`,
    `직급/직책: ${formatField(member.position)}`,
    `연락처: ${formatField(member.phone)}`,
    `사용 목적: ${formatField(member.note)}`,
    `신청일: ${formatField(member.requestedAt)}`,
    "",
    `관리 페이지: ${APP_BASE_URL}`
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f6f7f9">
        <tr>
          <td align="center" style="padding:28px 16px">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;border-collapse:collapse;background:#ffffff;border:1px solid #e5e8eb;border-radius:12px;overflow:hidden">
              <tr>
                <td style="padding:24px 28px 10px">
                  <a href="${escapeHtml(APP_BASE_URL)}" style="display:inline-block;color:#3182f6;font-weight:800;text-decoration:none">Talent Pool</a>
                  <h1 style="margin:10px 0 4px;font-size:24px;line-height:1.35;color:#191f28">회원가입 승인 요청</h1>
                  <p style="margin:0;color:#6b7684;font-size:14px;line-height:1.6">새로운 회원가입 신청이 접수되었습니다. Management 메뉴에서 신청자를 확인하고 승인 여부를 처리해주세요.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 28px 4px">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                    ${rows.map(([label, value]) => buildInfoRow(label, value)).join("")}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 28px 28px">
                  <a href="${escapeHtml(APP_BASE_URL)}" style="display:inline-block;padding:11px 18px;border-radius:10px;background:#3182f6;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none">관리 화면 열기</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  return {
    to: recipients,
    subject,
    text,
    html
  };
}

async function sendEmailViaResend(mail) {
  const config = assertProviderConfigured();
  const invalidRecipients = mail.to.filter((email) => !isValidEmail(email));

  if (!mail.to.length) {
    throw new Error("관리자 메일 주소가 없습니다.");
  }

  if (invalidRecipients.length) {
    throw new Error(`올바르지 않은 관리자 메일 주소입니다: ${invalidRecipients.join(", ")}`);
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

module.exports = async function signupAlert(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  loadLocalEnv();

  try {
    const body = await readJsonBody(request);
    const recipients = normalizeEmailList(body.admins || body.recipients);
    const member = body.member || {};
    const mail = buildSignupAlertMail(recipients, member);
    const result = await sendEmailViaResend(mail);

    sendJson(response, 200, {
      ok: true,
      message: "관리자 알림 메일을 발송했습니다.",
      recipientCount: recipients.length,
      recipients,
      result
    });
  } catch (error) {
    console.warn("Signup alert mail failed.", error);
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Signup alert mail failed"
    });
  }
};
