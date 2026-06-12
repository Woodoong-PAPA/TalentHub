const DEFAULT_SETTINGS = {
  enabled: false,
  sendTime: "07:00",
  timezone: "Asia/Seoul",
  recipients: [],
  subjectPrefix: "[TalentHub] Today's Talent",
  lastSentReportDate: "",
  lastSentAt: "",
  providerConfigured: false,
  updatedAt: "",
  updatedBy: ""
};
const LEGACY_SUBJECT_PREFIX = "[TalentHub] 오늘의 화제 인물";
const APP_BASE_URL = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://talentpool-dx.com";
const DEFAULT_TRENDING_MAIL_FROM = "TA@talentpool-dx.com";

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

async function readJsonResponse(response, label) {
  const responseText = await response.text();
  const responseTrimmed = responseText.trim();

  if (!responseTrimmed) {
    return {};
  }

  try {
    return JSON.parse(responseTrimmed);
  } catch (error) {
    const preview = responseTrimmed.replace(/\s+/g, " ").slice(0, 160);
    const looksLikeHtml = /^<!doctype html|^<html|^<HTML|^</i.test(responseTrimmed);
    const detail = looksLikeHtml
      ? `${label} 응답이 JSON이 아니라 HTML입니다. API route 또는 배포 상태를 확인해주세요.`
      : `${label} 응답 JSON을 해석하지 못했습니다.`;
    throw new Error(`${detail} 상태 ${response.status}, 응답 시작: ${preview}`);
  }
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
    return null;
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

function getKstDateParts(date = new Date()) {
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

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute)
  };
}

function dateToKey(date) {
  return date.toISOString().slice(0, 10);
}

function kstDateKeyOffset(offsetDays = 0) {
  const { year, month, day } = getKstDateParts();
  const utc = new Date(Date.UTC(year, month - 1, day + offsetDays, 0, 0, 0));
  return dateToKey(utc);
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

function normalizeSendTime(value) {
  const match = String(value || "").trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return match ? `${match[1]}:${match[2]}` : DEFAULT_SETTINGS.sendTime;
}

function getTrendingMailFrom() {
  return String(
    process.env.TRENDING_RESEND_FROM ||
    process.env.TRENDING_MAIL_FROM ||
    process.env.RESEND_FROM ||
    process.env.MAIL_FROM ||
    DEFAULT_TRENDING_MAIL_FROM
  ).trim();
}

function isProviderConfigured() {
  return Boolean(process.env.RESEND_API_KEY && getTrendingMailFrom());
}

function normalizeSettings(settings = {}) {
  const recipients = normalizeEmailList(settings.recipients);
  const subjectPrefix = String(settings.subjectPrefix || settings.subject_prefix || DEFAULT_SETTINGS.subjectPrefix).trim();

  return {
    ...DEFAULT_SETTINGS,
    enabled: Boolean(settings.enabled),
    sendTime: normalizeSendTime(settings.sendTime || settings.send_time),
    timezone: settings.timezone || "Asia/Seoul",
    recipients,
    subjectPrefix: subjectPrefix === LEGACY_SUBJECT_PREFIX ? DEFAULT_SETTINGS.subjectPrefix : subjectPrefix,
    lastSentReportDate: String(settings.lastSentReportDate || settings.last_sent_report_date || "").trim(),
    lastSentAt: String(settings.lastSentAt || settings.last_sent_at || "").trim(),
    providerConfigured: isProviderConfigured(),
    updatedAt: String(settings.updatedAt || settings.updated_at || "").trim(),
    updatedBy: String(settings.updatedBy || settings.updated_by || "").trim()
  };
}

function settingsFromRow(row) {
  if (!row) {
    return normalizeSettings();
  }

  return normalizeSettings({
    enabled: row.enabled,
    sendTime: row.send_time,
    timezone: row.timezone,
    recipients: row.recipients,
    subjectPrefix: row.subject_prefix,
    lastSentReportDate: row.last_sent_report_date,
    lastSentAt: row.last_sent_at,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by
  });
}

function settingsToRow(settings) {
  const normalized = normalizeSettings(settings);

  return {
    id: "default",
    enabled: normalized.enabled,
    send_time: normalized.sendTime,
    timezone: normalized.timezone,
    recipients: normalized.recipients,
    subject_prefix: normalized.subjectPrefix,
    updated_at: new Date().toISOString(),
    updated_by: normalized.updatedBy || "",
    payload: normalized
  };
}

function validateSettings(settings, options = {}) {
  const invalidRecipients = settings.recipients.filter((email) => !isValidEmail(email));

  if (invalidRecipients.length) {
    throw new Error(`Invalid recipient email: ${invalidRecipients.join(", ")}`);
  }

  if ((settings.enabled || options.requireRecipients) && !settings.recipients.length) {
    throw new Error("At least one recipient is required.");
  }
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

async function loadSettings() {
  const rows = await supabaseRequest("trending_mail_settings?select=*&id=eq.default&limit=1");
  return settingsFromRow(Array.isArray(rows) ? rows[0] : null);
}

async function saveSettings(settings) {
  validateSettings(settings);
  const rows = await supabaseRequest("trending_mail_settings?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([settingsToRow(settings)])
  });

  return settingsFromRow(Array.isArray(rows) ? rows[0] : null);
}

async function updateLastSent(settings, reportDate) {
  const sentAt = new Date().toISOString();
  const rows = await supabaseRequest("trending_mail_settings?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{
      ...settingsToRow(settings),
      last_sent_report_date: reportDate,
      last_sent_at: sentAt
    }])
  });

  return settingsFromRow(Array.isArray(rows) ? rows[0] : null);
}

async function logMailEvent(event) {
  try {
    await supabaseRequest("trending_mail_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{
        event_type: event.eventType,
        report_date: event.reportDate || null,
        status: event.status,
        message: event.message || "",
        recipients: event.recipients || [],
        provider: event.provider || "",
        payload: event.payload || {}
      }])
    });
  } catch (error) {
    console.warn("Trending mail event could not be logged.", error);
  }
}

async function loadCachedReport(targetDate) {
  const rows = await supabaseRequest(`trending_people_reports?select=payload&report_date=eq.${targetDate}&limit=1`);
  return Array.isArray(rows) && rows[0]?.payload ? rows[0].payload : null;
}

function getRequestOrigin(request) {
  const host = request.headers.host || process.env.VERCEL_URL || "127.0.0.1:5177";
  const protocol = host.startsWith("127.0.0.1") || host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function ensureReport(request, providedReport) {
  const providedDate = providedReport?.targetDate || providedReport?.reportDate || "";

  if (providedDate) {
    const cachedProvided = await loadCachedReport(providedDate);

    if (cachedProvided?.people?.length) {
      return cachedProvided;
    }
  }

  if (providedReport?.people?.length) {
    return providedReport;
  }

  const targetDate = kstDateKeyOffset(-1);
  const cached = await loadCachedReport(targetDate);

  if (cached?.people?.length) {
    return cached;
  }

  const response = await fetch(`${getRequestOrigin(request)}/api/trending-people?cron=1`);
  const payload = await readJsonResponse(response, "Today's Talent 리포트 생성");

  if (!response.ok || !payload.ok || !payload.report?.people?.length) {
    throw new Error(payload.error || "Trending people report is not available.");
  }

  return payload.report;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatShortYear(value) {
  const text = String(value || "").trim();
  const year = text.match(/\d{4}/)?.[0] || text.match(/\d{2}/)?.[0] || "";
  return year ? `'${year.slice(-2)}` : "";
}

function normalizeSchoolName(value) {
  const school = String(value || "").trim();
  const compact = school.toLowerCase().replace(/[.\s-]+/g, "");
  const mappings = new Map([
    ["seoulnationaluniversity", "서울대학교"],
    ["snu", "서울대학교"],
    ["koreauniversity", "고려대학교"],
    ["yonseiuniversity", "연세대학교"],
    ["hanyanguniversity", "한양대학교"],
    ["sungkyunkwanuniversity", "성균관대학교"],
    ["skku", "성균관대학교"],
    ["postech", "포항공과대학교"],
    ["pohanguniversityofscienceandtechnology", "포항공과대학교"],
    ["koreaadvancedinstituteofscienceandtechnology", "KAIST"],
    ["kaist", "KAIST"]
  ]);

  return mappings.get(compact) || school;
}

function normalizeCountry(value) {
  const country = String(value || "").trim();

  if (/^(대한민국|한국|south korea|republic of korea|korea)$/i.test(country)) {
    return "한국";
  }

  return country;
}

function inferCareerCountry(item) {
  const company = String(item.company || "").toLowerCase();

  if (/nvidia|엔비디아/.test(company)) {
    return "미국";
  }

  if (/ncsoft|엔씨소프트|krafton|크래프톤|서울대학교|고려대학교|연세대학교|lg\b|삼성/.test(company)) {
    return "한국";
  }

  return normalizeCountry(item.country);
}

function formatEducation(item) {
  const degree = { 박사: "박", 석사: "석", 학사: "학", 박: "박", 석: "석", 학: "학" }[item.degree] || item.degree || "";
  const year = formatShortYear(item.year || item.end || item.graduationYear);
  const body = [normalizeSchoolName(item.school), item.major].filter(Boolean).join(", ");
  return `${degree ? `${degree}) ` : ""}${body}${year ? ` (${year})` : ""}`.trim();
}

function formatCareer(item) {
  const country = inferCareerCountry(item);
  const periodStart = formatShortYear(item.start || item.startYear);
  const periodEnd = item.end === "현재" || item.endYear === "현재"
    ? "현재"
    : formatShortYear(item.end || item.endYear);
  const period = periodStart || periodEnd ? `(${periodStart || ""}~${periodEnd || ""})` : "";
  const rankTitle = formatCareerRoleParts(item.rank, item.title || item.position, item.department || item.organization || item.org || item.team || item.division || "");
  const department = item.department || item.organization || item.org || item.team || item.division || "";
  const body = [[item.company, rankTitle, roleContainsDepartment(rankTitle, department) ? "" : department].filter(Boolean).join(", "), period].filter(Boolean).join(" ");
  return `${country ? `${country}) ` : ""}${body}`.trim();
}

function normalizeCareerToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\s·,./()\-_/]+/g, "");
}

function roleContainsDepartment(roleText, department) {
  const role = normalizeCareerToken(roleText);
  const dept = normalizeCareerToken(department);
  return Boolean(role && dept && role.includes(dept));
}

function appendDistinctCareerPart(parts, value) {
  const text = String(value || "").trim();

  if (!text) {
    return;
  }

  const comparable = normalizeCareerToken(text);
  const duplicateIndex = parts.findIndex((part) => {
    const existing = normalizeCareerToken(part);
    return existing === comparable || existing.includes(comparable) || comparable.includes(existing);
  });

  if (duplicateIndex === -1) {
    parts.push(text);
    return;
  }

  if (comparable.length > normalizeCareerToken(parts[duplicateIndex]).length) {
    parts[duplicateIndex] = text;
  }
}

function formatCareerRoleParts(rank, title, department) {
  const parts = [];
  appendDistinctCareerPart(parts, rank);
  appendDistinctCareerPart(parts, title);
  appendDistinctCareerPart(parts, department && parts.some((part) => roleContainsDepartment(part, department)) ? "" : department);
  return parts.join(", ");
}

function listItems(items) {
  return (items || []).filter(Boolean).map((item) => `- ${item}`).join("\n") || "-";
}

function normalizeReasonText(value) {
  return String(value || "")
    .replace(/^[-\s]+/, "")
    .replace(/^근거\s*기사\s*핵심\s*[:：]?\s*/i, "")
    .replace(/(?:DX|디엑스)\s*(?:사업\s*)?분야에서\s*(?:주목받음|중요 인물로 부각|주요 인물로 부각)\.?/gi, "")
    .replace(/(?:DX|디엑스)\s*(?:사업\s*)?분야\s*관련성이\s*(?:높음|확인됨)\.?/gi, "")
    .replace(/(논의|추진|확대|강화|모색|협의|발표|공개|참여|계획)(?:하며|하고)\.?$/g, "$1")
    .replace(/(?:하며|하면서|하고)\.?$/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.。]$/, "")
    .trim();
}

function cleanNewsTitle(title, source = "") {
  let text = String(title || "").trim();
  const sourceText = String(source || "").trim();

  if (sourceText) {
    const escapedSource = sourceText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text
      .replace(new RegExp(`\\s*[-·|]\\s*${escapedSource}\\s*$`, "i"), "")
      .replace(new RegExp(`^${escapedSource}\\s*[-·|]\\s*`, "i"), "")
      .replace(new RegExp(`\\s+${escapedSource}\\s*$`, "i"), "");
  }

  return text.replace(/\s+/g, " ").trim();
}

function formatNewsLinkLabel(link) {
  const source = String(link.source || "기사").trim();
  const title = cleanNewsTitle(link.title || link.url, source);
  return `[${source}] ${title}`;
}

function parseSerializedNewsLink(value) {
  const text = String(value || "").trim();

  if (!text.startsWith("@{") || !text.endsWith("}")) {
    return null;
  }

  const pairs = {};
  text.slice(2, -1).split(";").forEach((part) => {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex <= 0) {
      return;
    }

    const key = part.slice(0, separatorIndex).trim();
    const pairValue = part.slice(separatorIndex + 1).trim();

    if (key) {
      pairs[key] = pairValue;
    }
  });

  return pairs.url ? pairs : null;
}

function normalizeNewsLink(link) {
  const source = typeof link === "string" ? parseSerializedNewsLink(link) : link;

  if (!source || typeof source !== "object") {
    return null;
  }

  return {
    url: String(source.url || "").trim(),
    title: String(source.title || "").trim(),
    source: String(source.source || "").trim(),
    snippet: String(source.snippet || source.description || "").trim()
  };
}

function cleanArticleSummary(value, source = "") {
  return cleanNewsTitle(value, source)
    .replace(/^근거\s*기사\s*핵심\s*[:：]?\s*/i, "")
    .replace(/^\[[^\]]+\]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackReasonFromLink(link) {
  if (!link) {
    return "";
  }

  const snippet = cleanArticleSummary(link.snippet || link.description || "", link.source);

  if (snippet) {
    return snippet.length > 120 ? `${snippet.slice(0, 117).trim()}...` : snippet;
  }

  return cleanArticleSummary(link.title || "", link.source);
}

function splitReasonSentences(value) {
  const text = normalizeReasonText(value);

  if (!text) {
    return [];
  }

  const parts = text
    .split(/(?<=[.!?。！？])\s+|(?<=다)\s+(?=[가-힣A-Z0-9])/g)
    .map(normalizeReasonText)
    .filter(Boolean);

  return parts.length ? parts : [text];
}

function asDisplaySentence(value) {
  return normalizeReasonText(value);
}

function collectReasonLinks(reasons) {
  return (reasons || [])
    .filter((reason) => typeof reason === "object")
    .flatMap((reason) => reason.links || [])
    .map(normalizeNewsLink)
    .filter(Boolean)
    .filter((link, index, array) => link.url && array.findIndex((item) => item.url === link.url) === index)
    .slice(0, 1);
}

function trendingReasonLines(reasons) {
  const lines = [];
  const links = collectReasonLinks(reasons);

  (reasons || []).forEach((reason) => {
    const rawText = typeof reason === "object" ? reason.text : reason;
    const link = typeof reason === "object" ? (reason.links || []).map(normalizeNewsLink).find((item) => item?.url) : null;
    const cleanedRaw = normalizeReasonText(rawText);
    const cleanedTitle = normalizeReasonText(cleanNewsTitle(link?.title || "", link?.source || ""));
    const displayText = (
      /^근거\s*기사\s*핵심\s*[:：]?/i.test(String(rawText || "")) ||
      (cleanedTitle && cleanedRaw === cleanedTitle && (link?.snippet || link?.description))
    )
      ? fallbackReasonFromLink(link) || rawText
      : rawText;

    splitReasonSentences(displayText).forEach((line) => {
      if (line && !lines.includes(line)) {
        lines.push(asDisplaySentence(line));
      }
    });
  });

  const link = links[0];

  if (!lines.length && link?.title) {
    lines.push(asDisplaySentence(fallbackReasonFromLink(link)));
  }

  if (lines.length === 1) {
    const fallback = fallbackReasonFromLink(link);

    if (fallback && fallback !== lines[0]) {
      lines.push(asDisplaySentence(fallback));
    }
  }

  return lines.slice(0, 2);
}

function buildReportText(report) {
  return [
    `Today's Talent 리포트 (${report.targetDate || report.reportDate})`,
    "",
    ...(report.people || []).map((person) => [
      `${person.rank}. ${person.name} - ${[person.currentOrg, person.currentTitle].filter(Boolean).join(" · ")}`,
      "학력",
      listItems((person.education || []).map(formatEducation).filter(Boolean)),
      "경력",
      listItems((person.career || []).map(formatCareer).filter(Boolean)),
      "핵심 성과/실적",
      listItems(person.achievements || []),
      "Top5 선정 사유",
      listItems(trendingReasonLines(person.selectionReasons || []))
    ].join("\n")).join("\n\n")
  ].join("\n");
}

function renderSourceLinks(reason) {
  const links = (reason?.links || []).map(normalizeNewsLink).filter((link) => link?.url).slice(0, 1);

  if (!links.length) {
    return "";
  }

  return `
    <div style="margin-top:10px;mso-line-height-rule:exactly">
      ${links.map((link) => `
        <a href="${escapeHtml(link.url)}" target="_blank" style="display:inline-block;max-width:100%;border:1px solid #cfe3ff;border-radius:999px;padding:8px 12px;color:#1b64da;background:#e8f3ff;font-size:12px;font-weight:700;text-decoration:none;line-height:1.4;word-break:break-word">
          ${escapeHtml(formatNewsLinkLabel(link))}
        </a>
      `).join("")}
    </div>
  `;
}

function renderReasonSourceLinks(reasons) {
  return renderSourceLinks({ links: collectReasonLinks(reasons) });
}

function renderMailLineList(items) {
  const list = (items || []).filter(Boolean);

  if (!list.length) {
    return `<p style="margin:0;color:#8b95a1;font-size:13px">정보 없음</p>`;
  }

  return `
    <div>
      ${list.map((item) => `
        <div style="margin:0 0 8px;color:#191f28;font-size:14px;line-height:1.65;word-break:break-word">
          ${escapeHtml(item)}
        </div>
      `).join("")}
    </div>
  `;
}

function renderMailDashList(items) {
  const list = (items || []).filter(Boolean).slice(0, 3);

  if (!list.length) {
    return `<p style="margin:0;color:#8b95a1;font-size:13px">정보 없음</p>`;
  }

  return `
    <div>
      ${list.map((item) => `
        <div style="margin:0 0 8px;color:#191f28;font-size:14px;line-height:1.65;word-break:break-word">
          - ${escapeHtml(item)}
        </div>
      `).join("")}
    </div>
  `;
}

function renderMailReasons(reasons) {
  const lines = trendingReasonLines(reasons);

  if (!lines.length) {
    return `<p style="margin:0;color:#8b95a1;font-size:13px">정보 없음</p>`;
  }

  return `
    <div>
      ${lines.map((text) => `
        <div style="border-left:3px solid #3182f6;margin:0 0 12px;padding-left:10px">
          <p style="margin:0;color:#191f28;font-size:14px;line-height:1.65;word-break:break-word">${escapeHtml(text)}</p>
        </div>
      `).join("")}
      ${renderReasonSourceLinks(reasons)}
    </div>
  `;
}

function renderMailSection(title, body) {
  return `
    <div style="margin:0 0 18px">
      <div style="margin:0 0 8px;color:#6b7684;font-size:12px;font-weight:800">${escapeHtml(title)}</div>
      ${body}
    </div>
  `;
}

function renderMailRankMarker(person) {
  return `
    <div style="width:42px;height:42px;border-radius:999px;background:#3182f6;color:#ffffff;text-align:center;line-height:42px;font-size:17px;font-weight:800">
      ${escapeHtml(person.rank || "")}
    </div>
  `;
}

function renderPersonCard(person) {
  const education = (person.education || []).map(formatEducation).filter(Boolean);
  const career = (person.career || []).map(formatCareer).filter(Boolean);
  const meta = [person.birthYear ? `${person.birthYear}년생` : "", person.currentOrg, person.currentTitle].filter(Boolean).join(" · ");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;margin:0 0 16px;border:1px solid #e5e8eb;border-radius:12px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <tr>
        <td style="padding:18px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
            <tr>
              <td width="56" valign="top" style="width:56px;padding:2px 14px 14px 0">
                ${renderMailRankMarker(person)}
              </td>
              <td valign="top" style="padding:0 0 14px 0">
                <h3 style="margin:0 0 5px;color:#191f28;font-size:22px;line-height:1.25">${escapeHtml(person.name || "-")}</h3>
                <p style="margin:0;color:#6b7684;font-size:14px;line-height:1.5">${escapeHtml(meta || "-")}</p>
              </td>
            </tr>
          </table>

          <div style="border-top:1px solid #e5e8eb;margin:0 0 18px;font-size:0;line-height:0">&nbsp;</div>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
            <tr>
              <td valign="top" width="50%" style="width:50%;padding:0 14px 0 0">
                ${renderMailSection("학력", renderMailLineList(education))}
                ${renderMailSection("경력", renderMailLineList(career))}
              </td>
              <td valign="top" width="50%" style="width:50%;padding:0 0 0 14px">
                ${renderMailSection("주요 성과/실적", renderMailDashList(person.achievements || []))}
                ${renderMailSection("선정 사유", renderMailReasons(person.selectionReasons || []))}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function buildReportHtml(report) {
  const reportDate = report.targetDate || report.reportDate || "";

  return `
    <div style="margin:0;padding:0;background:#f9fafb;font-family:Arial,'Malgun Gothic','Apple SD Gothic Neo',sans-serif;color:#191f28;line-height:1.55">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f9fafb">
        <tr>
          <td align="center" style="padding:28px 14px">
            <table role="presentation" width="980" cellspacing="0" cellpadding="0" style="width:100%;max-width:980px;border-collapse:collapse">
              <tr>
                <td>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;margin:0 0 18px;border:1px solid #e5e8eb;border-radius:12px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
                    <tr>
                      <td style="padding:22px">
                        <a href="${escapeHtml(APP_BASE_URL)}" target="_blank" style="display:inline-block;margin:0 0 10px;color:#191f28;font-size:16px;font-weight:900;text-decoration:none">Talent Pool</a>
                        <p style="margin:0 0 6px;color:#8b95a1;font-size:12px;font-weight:800;letter-spacing:0;text-transform:uppercase">Daily News Radar</p>
                        <h2 style="margin:0 0 10px;color:#191f28;font-size:28px;line-height:1.25">Today's Talent</h2>
                        <p style="margin:0;color:#4e5968;font-size:15px;line-height:1.6">${escapeHtml(reportDate)} 00:00~24:00 기사 기준</p>
                        <p style="margin:6px 0 0;color:#6b7684;font-size:13px;line-height:1.6">한국 뉴스 · AI, 로보틱스, 모바일, TV, 생활가전 중심 · DS/반도체 제외</p>
                      </td>
                    </tr>
                  </table>
                  ${(report.people || []).map(renderPersonCard).join("")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

async function sendEmailViaResend(settings, report) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = getTrendingMailFrom();

  if (!apiKey || !from) {
    throw new Error("메일 provider가 설정되어 있지 않습니다. RESEND_API_KEY와 TRENDING_RESEND_FROM 또는 RESEND_FROM을 환경변수로 설정해주세요.");
  }

  const subject = `${settings.subjectPrefix} - ${report.targetDate || report.reportDate}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: settings.recipients,
      subject,
      html: buildReportHtml(report),
      text: buildReportText(report)
    })
  });
  const text = await response.text();
  let payload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch (error) {
    payload = { message: text.slice(0, 300) };
  }

  if (!response.ok) {
    const providerMessage = payload.message || payload.error || text.slice(0, 300);
    throw new Error(`메일 발송 실패: ${response.status} ${providerMessage}`);
  }

  return payload;
}

function isDue(settings) {
  const now = getKstDateParts();
  const [hour, minute] = settings.sendTime.split(":").map(Number);
  return now.hour * 60 + now.minute >= hour * 60 + minute;
}

async function sendReport({ request, settings, report, eventType }) {
  validateSettings(settings, { requireRecipients: true });

  if (!isProviderConfigured()) {
    throw new Error("메일 provider가 설정되어 있지 않습니다. RESEND_API_KEY와 TRENDING_RESEND_FROM 또는 RESEND_FROM을 환경변수로 설정해주세요.");
  }

  const finalReport = await ensureReport(request, report);
  const result = await sendEmailViaResend(settings, finalReport);
  const savedSettings = eventType === "test"
    ? normalizeSettings(settings)
    : await updateLastSent(settings, finalReport.targetDate || finalReport.reportDate);

  await logMailEvent({
    eventType,
    reportDate: finalReport.targetDate || finalReport.reportDate,
    status: "sent",
    message: "sent",
    recipients: settings.recipients,
    provider: "resend",
    payload: result
  });

  return {
    settings: savedSettings,
    report: finalReport,
    eventType,
    recipients: settings.recipients,
    recipientCount: settings.recipients.length,
    sentAt: new Date().toISOString(),
    providerConfigured: true,
    message: "메일 발송을 완료했습니다."
  };
}

async function handleCron(request) {
  const settings = await loadSettings();
  const targetDate = kstDateKeyOffset(-1);

  if (!settings.enabled) {
    return { skipped: true, settings, message: "메일링이 비활성화되어 있습니다." };
  }

  if (!settings.recipients.length) {
    return { skipped: true, settings, message: "수신처가 없습니다." };
  }

  if (settings.lastSentReportDate === targetDate) {
    return { skipped: true, settings, message: "이미 발송한 리포트입니다." };
  }

  if (!isDue(settings)) {
    return { skipped: true, settings, message: "아직 발송 시간이 아닙니다." };
  }

  try {
    return await sendReport({ request, settings, eventType: "cron" });
  } catch (error) {
    await logMailEvent({
      eventType: "cron",
      reportDate: targetDate,
      status: "failed",
      message: error.message,
      recipients: settings.recipients,
      provider: isProviderConfigured() ? "resend" : "not_configured"
    });
    throw error;
  }
}

module.exports = async function trendingMail(request, response) {
  if (!["GET", "PUT", "POST"].includes(request.method)) {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  loadLocalEnv();

  try {
    if (request.method === "GET") {
      const url = new URL(request.url, "http://localhost");

      if (url.pathname.endsWith("/trending-mail-cron") || url.searchParams.get("cron") === "1") {
        const result = await handleCron(request);
        sendJson(response, 200, { ok: true, ...result });
        return;
      }

      sendJson(response, 200, { ok: true, settings: await loadSettings() });
      return;
    }

    if (request.method === "PUT") {
      const body = await readJsonBody(request);
      const settings = await saveSettings(normalizeSettings(body));
      sendJson(response, 200, { ok: true, settings });
      return;
    }

    const body = await readJsonBody(request);
    const url = new URL(request.url, "http://localhost");
    const action = body.action || (url.searchParams.get("cron") === "1" ? "cron" : "test");

    if (action === "cron") {
      const result = await handleCron(request);
      sendJson(response, 200, { ok: true, ...result });
      return;
    }

    const settings = normalizeSettings(body.settings || await loadSettings());
    const result = await sendReport({
      request,
      settings,
      report: body.report,
      eventType: action === "send" ? "manual" : "test"
    });
    sendJson(response, 200, { ok: true, ...result });
  } catch (error) {
    console.warn("Trending mail failed.", error);
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Trending mail failed"
    });
  }
};
