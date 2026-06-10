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

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, ""),
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  };
}

async function supabaseRequest(path, options = {}) {
  const config = getSupabaseConfig();

  if (!config.url || !config.key) {
    throw new Error("SUPABASE_URL과 SUPABASE_ANON_KEY 환경변수가 필요합니다.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${detail}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function getKstNowParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const base = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
  const dayIndex = base.getUTCDay();
  const monday = new Date(base);
  monday.setUTCDate(base.getUTCDate() - ((dayIndex + 6) % 7));

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    dayIndex,
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    monthKey: `${parts.year}-${parts.month}`,
    weekKey: monday.toISOString().slice(0, 10)
  };
}

function normalizeRequestFrequency(value) {
  return ["manual", "weekly", "monthly"].includes(value) ? value : "weekly";
}

function normalizeRequestDay(value) {
  return ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(value) ? value : "monday";
}

function normalizeSendTime(value) {
  const match = String(value || "").trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return match ? `${match[1]}:${match[2]}` : "09:00";
}

function weekdayToIndex(value) {
  return {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  }[value] ?? 1;
}

function getRequestScheduleText(settings) {
  const dayLabels = {
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일"
  };
  const frequencyLabel = settings.frequency === "monthly"
    ? "매월"
    : settings.frequency === "weekly"
      ? `매주 ${dayLabels[settings.day] || "월요일"}`
      : "수동 발송";

  return `${frequencyLabel} ${settings.time}`;
}

function normalizeRecruitingRequestSettings(metrics = {}) {
  const draft = metrics.requestMailDraft && typeof metrics.requestMailDraft === "object" ? metrics.requestMailDraft : {};

  return {
    frequency: normalizeRequestFrequency(draft.frequency || metrics.requestMailFrequency),
    day: normalizeRequestDay(draft.day || metrics.requestMailDay),
    time: normalizeSendTime(draft.time || metrics.requestMailTime),
    subject: String(draft.subject || metrics.requestSubject || "[TalentHub] 채용 실적 상세 데이터시트 작성 요청").trim(),
    body: String(draft.body || metrics.requestMailBody || "각 사업부 채용 실적 상세 데이터시트 최신화를 요청드립니다.").trim(),
    recipients: normalizeEmailList(draft.recipients || metrics.requestRecipients || []),
    lastSentKey: String(metrics.requestLastSentKey || "").trim()
  };
}

function getRecruitingRequestDueKey(settings, nowParts = getKstNowParts()) {
  if (settings.frequency === "manual") {
    return "";
  }

  const [hour, minute] = settings.time.split(":").map(Number);
  const currentMinutes = nowParts.hour * 60 + nowParts.minute;
  const scheduledMinutes = hour * 60 + minute;

  if (currentMinutes < scheduledMinutes) {
    return "";
  }

  const targetDayIndex = weekdayToIndex(settings.day);

  if (settings.frequency === "weekly") {
    return nowParts.dayIndex === targetDayIndex
      ? `weekly:${nowParts.weekKey}:${settings.day}:${settings.time}`
      : "";
  }

  if (settings.frequency === "monthly") {
    return nowParts.day <= 7 && nowParts.dayIndex === targetDayIndex
      ? `monthly:${nowParts.monthKey}:${settings.day}:${settings.time}`
      : "";
  }

  return "";
}

async function loadRecruitingMetricsPayload() {
  const rows = await supabaseRequest("app_settings?setting_key=eq.recruiting_metrics&select=setting_key,payload,updated_at&limit=1");
  const row = Array.isArray(rows) ? rows[0] : null;
  return row?.payload && typeof row.payload === "object" ? row.payload : null;
}

async function saveRecruitingMetricsPayload(payload) {
  await supabaseRequest("app_settings?on_conflict=setting_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([{
      setting_key: "recruiting_metrics",
      payload,
      updated_at: new Date().toISOString()
    }])
  });
}

function buildSummaryHtml(rows = [], weekOf = "", body = "") {
  const total = rows.reduce((summary, row) => {
    summary.hiringTarget += Number(row.hiringTarget || 0) || 0;
    summary.keyTalentTarget += Number(row.keyTalentTarget || 0) || 0;
    summary.offerSigned += Number(row.offerSigned || 0) || 0;
    summary.keyTalentSecured += Number(row.keyTalentSecured || 0) || 0;
    summary.joined += Number(row.joined || 0) || 0;
    return summary;
  }, {
    unit: "합계",
    hiringTarget: 0,
    keyTalentTarget: 0,
    offerSigned: 0,
    keyTalentSecured: 0,
    joined: 0
  });
  total.ratio = total.hiringTarget ? Math.round((total.offerSigned / total.hiringTarget) * 1000) / 10 : 0;
  total.keyTalentRatio = total.keyTalentTarget ? Math.round((total.keyTalentSecured / total.keyTalentTarget) * 1000) / 10 : 0;
  const bodyParagraphs = String(body || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return `
    <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.6">
      <h2 style="margin:0 0 12px">주간 채용 지표 취합</h2>
      <p style="margin:0 0 16px;color:#6b7280">취합 기준 주: ${escapeHtml(weekOf || "-")}</p>
      ${bodyParagraphs.length ? `
        <div style="margin:0 0 18px;padding:14px 16px;border:1px solid #e5e8eb;border-radius:12px;background:#f8f9fa">
          ${bodyParagraphs.map((paragraph) => `<p style="margin:0 0 8px;white-space:pre-line">${escapeHtml(paragraph)}</p>`).join("")}
        </div>
      ` : ""}
      <table style="border-collapse:collapse;width:100%;max-width:900px;font-size:14px">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:left">사업부</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">당해 목표</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">핵심인력 목표</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">확보 수</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">핵심인력 확보</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">입사 완료</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">달성률</th>
            <th style="padding:8px;border:1px solid #e5e8eb;background:#f8f9fa;text-align:right">핵심인력 달성률</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td style="padding:8px;border:1px solid #e5e8eb">${escapeHtml(row.unit)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.hiringTarget)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.keyTalentTarget)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.offerSigned)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.keyTalentSecured)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.joined)}</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.ratio)}%</td>
              <td style="padding:8px;border:1px solid #e5e8eb;text-align:right">${escapeHtml(row.keyTalentRatio)}%</td>
            </tr>
          `).join("")}
          <tr>
            <td style="padding:8px;border:1px solid #cfe2ff;background:#f8fbff;font-weight:700">${escapeHtml(total.unit)}</td>
            <td style="padding:8px;border:1px solid #cfe2ff;background:#f8fbff;text-align:right;font-weight:700">${escapeHtml(total.hiringTarget)}</td>
            <td style="padding:8px;border:1px solid #cfe2ff;background:#f8fbff;text-align:right;font-weight:700">${escapeHtml(total.keyTalentTarget)}</td>
            <td style="padding:8px;border:1px solid #cfe2ff;background:#f8fbff;text-align:right;font-weight:700">${escapeHtml(total.offerSigned)}</td>
            <td style="padding:8px;border:1px solid #cfe2ff;background:#f8fbff;text-align:right;font-weight:700">${escapeHtml(total.keyTalentSecured)}</td>
            <td style="padding:8px;border:1px solid #cfe2ff;background:#f8fbff;text-align:right;font-weight:700">${escapeHtml(total.joined)}</td>
            <td style="padding:8px;border:1px solid #cfe2ff;background:#f8fbff;text-align:right;font-weight:700">${escapeHtml(total.ratio)}%</td>
            <td style="padding:8px;border:1px solid #cfe2ff;background:#f8fbff;text-align:right;font-weight:700">${escapeHtml(total.keyTalentRatio)}%</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top:16px;color:#6b7280">상세 취합표는 첨부 엑셀 파일을 확인해 주세요.</p>
    </div>
  `;
}

function buildRequestHtml(payload = {}) {
  const bodyParagraphs = String(payload.body || "")
    .split(/\n{1,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const scheduleText = String(payload.scheduleText || "").trim();

  return `
    <div style="font-family:Arial,'Malgun Gothic',sans-serif;color:#191f28;line-height:1.65;max-width:760px">
      <h2 style="margin:0 0 12px">채용 실적 상세 데이터시트 작성 요청</h2>
      ${scheduleText ? `<p style="margin:0 0 16px;color:#6b7280">정기 요청 기준: ${escapeHtml(scheduleText)}</p>` : ""}
      <div style="margin:0 0 18px;padding:16px 18px;border:1px solid #e5e8eb;border-radius:12px;background:#f8f9fa">
        ${bodyParagraphs.map((paragraph) => `<p style="margin:0 0 8px;white-space:pre-line">${escapeHtml(paragraph)}</p>`).join("")}
      </div>
      <p style="margin:0;color:#4e5968">Talent Pool 시스템의 채용 지표 메뉴에서 담당 사업부의 채용 실적 상세 데이터시트를 작성해 주세요.</p>
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
  const isRequestMail = payload.type === "request";

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
      html: isRequestMail ? buildRequestHtml(payload) : buildSummaryHtml(payload.rows, weekOf, payload.body),
      attachments: !isRequestMail && html
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

async function runRecruitingRequestCron() {
  const payload = await loadRecruitingMetricsPayload();

  if (!payload?.metrics) {
    return {
      ok: true,
      skipped: true,
      reason: "recruiting_metrics setting is not available"
    };
  }

  const settings = normalizeRecruitingRequestSettings(payload.metrics);
  const dueKey = getRecruitingRequestDueKey(settings);

  if (!dueKey) {
    return {
      ok: true,
      skipped: true,
      reason: "not scheduled time",
      scheduleText: getRequestScheduleText(settings)
    };
  }

  if (settings.lastSentKey === dueKey) {
    return {
      ok: true,
      skipped: true,
      reason: "already sent",
      dueKey
    };
  }

  if (!settings.recipients.length) {
    return {
      ok: true,
      skipped: true,
      reason: "no recipients",
      dueKey
    };
  }

  const result = await sendEmailViaResend({
    type: "request",
    recipients: settings.recipients,
    subject: settings.subject,
    body: settings.body,
    frequency: settings.frequency,
    day: settings.day,
    time: settings.time,
    scheduleText: getRequestScheduleText(settings),
    weekOf: payload.metrics.weekOf
  });

  payload.metrics.requestLastSentKey = dueKey;
  payload.metrics.requestLastSentAt = new Date().toISOString();
  payload.metrics.mailStatus = `채용 실적 상세 취합 요청 메일을 자동 발송했습니다. (${settings.recipients.length}명)`;
  payload.updatedAt = new Date().toISOString();
  payload.updatedBy = "recruiting-metrics-request-cron";
  await saveRecruitingMetricsPayload(payload);

  return {
    ok: true,
    skipped: false,
    dueKey,
    recipients: settings.recipients,
    result
  };
}

module.exports = async function recruitingMetricsMail(request, response) {
  loadLocalEnv();

  if (request.method === "GET") {
    try {
      const result = await runRecruitingRequestCron();
      sendJson(response, 200, result);
    } catch (error) {
      console.warn("Recruiting metrics request cron failed.", error);
      sendJson(response, 500, {
        ok: false,
        error: error.message || "Recruiting metrics request cron failed"
      });
    }
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

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
