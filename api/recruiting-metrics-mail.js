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

function assertProviderConfigured() {
  const apiKey = process.env.RESEND_API_KEY || "";
  const from = process.env.RESEND_FROM || process.env.MAIL_FROM || "";

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY와 RESEND_FROM 환경변수가 필요합니다.");
  }

  return { apiKey, from };
}

function buildSummaryHtml(rows = [], weekOf = "") {
  return `
    <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.6">
      <h2 style="margin:0 0 12px">주간 채용 지표 취합</h2>
      <p style="margin:0 0 16px;color:#6b7280">취합 기준 주: ${escapeHtml(weekOf || "-")}</p>
      <table style="border-collapse:collapse;width:100%;max-width:900px;font-size:14px">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:left">사업부</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">당해 목표</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">핵심인력 목표</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">확보 수</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">입사 완료</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">달성률</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(row.unit)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.hiringTarget)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.keyTalentTarget)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.offerSigned)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.joined)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.ratio)}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <p style="margin-top:16px;color:#6b7280">상세 취합표는 첨부 엑셀 파일을 확인해 주세요.</p>
    </div>
  `;
}

async function sendEmailViaResend(payload) {
  const config = assertProviderConfigured();
  const recipients = normalizeEmailList(payload.recipients);
  const invalidRecipients = recipients.filter((email) => !isValidEmail(email));

  if (!recipients.length) {
    throw new Error("메일 수신처가 없습니다.");
  }

  if (invalidRecipients.length) {
    throw new Error(`올바르지 않은 메일 주소입니다: ${invalidRecipients.join(", ")}`);
  }

  const weekOf = String(payload.weekOf || "").trim();
  const subject = String(payload.subject || "[TalentHub] 주간 채용 지표 취합").trim();
  const html = String(payload.html || "").trim();
  const fileName = `recruiting-metrics-${weekOf || "weekly"}.xls`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: config.from,
      to: recipients,
      subject,
      html: buildSummaryHtml(payload.rows, weekOf),
      attachments: html
        ? [{
          filename: fileName,
          content: Buffer.from(html, "utf8").toString("base64")
        }]
        : []
    })
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`메일 발송 실패: ${response.status} ${text.slice(0, 300)}`);
  }

  return text ? JSON.parse(text) : {};
}

module.exports = async function recruitingMetricsMail(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  loadLocalEnv();

  try {
    const body = await readJsonBody(request);
    const result = await sendEmailViaResend(body);

    sendJson(response, 200, {
      ok: true,
      message: "채용 지표 메일을 발송했습니다.",
      result
    });
  } catch (error) {
    console.warn("Recruiting metrics mail failed.", error);
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Recruiting metrics mail failed"
    });
  }
};
