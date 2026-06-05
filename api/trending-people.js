const MAX_ARTICLES = 90;
const GOOGLE_NEWS_DECODE_CONCURRENCY = 4;
const GOOGLE_NEWS_BATCH_URL = "https://news.google.com/_/DotsSplashUi/data/batchexecute";
const GOOGLE_NEWS_USER_AGENT = "Mozilla/5.0 (compatible; SamsungTalentPoolNewsRadar/1.0)";
const PROFILE_COMPLETENESS_VERSION = 5;
const KNOWN_PROFILE_IMAGE_URLS = [
  {
    name: "구광모",
    organizationPattern: /lg|엘지/i,
    url: "https://www.businesspost.co.kr/news/photo/202307/20230704112634_119248.jpg"
  }
];
const TOPIC_KEYWORDS = ["AI", "인공지능", "로보틱스", "로봇", "모바일", "스마트폰", "TV", "생활가전", "가전"];
const EXCLUDE_KEYWORDS = ["반도체", "DS부문", "DS 부문", "HBM", "메모리", "파운드리", "웨이퍼", "낸드", "D램"];

const TRENDING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["people"],
  properties: {
    people: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "name",
          "birthYear",
          "currentOrg",
          "currentTitle",
          "education",
          "career",
          "achievements",
          "selectionReasons",
          "linkedinUrl",
          "profileImageUrl",
          "topics",
          "mentionCount"
        ],
        properties: {
          name: { type: "string" },
          birthYear: { type: "string" },
          currentOrg: { type: "string" },
          currentTitle: { type: "string" },
          education: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["degree", "school", "major", "year"],
              properties: {
                degree: { type: "string", enum: ["", "박사", "석사", "학사", "박", "석", "학"] },
                school: { type: "string" },
                major: { type: "string" },
                year: { type: "string" }
              }
            }
          },
          career: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["country", "company", "rank", "title", "department", "start", "end"],
              properties: {
                country: { type: "string" },
                company: { type: "string" },
                rank: { type: "string" },
                title: { type: "string" },
                department: { type: "string" },
                start: { type: "string" },
                end: { type: "string" }
              }
            }
          },
          achievements: {
            type: "array",
            items: { type: "string" }
          },
          selectionReasons: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["text", "articleIds"],
              properties: {
                text: { type: "string" },
                articleIds: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          },
          linkedinUrl: { type: "string" },
          profileImageUrl: { type: "string" },
          topics: {
            type: "array",
            items: { type: "string" }
          },
          mentionCount: { type: "number" }
        }
      }
    }
  }
};

const PROFILE_ENRICHMENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["people"],
  properties: {
    people: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "name",
          "birthYear",
          "currentOrg",
          "currentTitle",
          "education",
          "career",
          "achievements",
          "linkedinUrl",
          "profileImageUrl"
        ],
        properties: {
          name: { type: "string" },
          birthYear: { type: "string" },
          currentOrg: { type: "string" },
          currentTitle: { type: "string" },
          education: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["degree", "school", "major", "year"],
              properties: {
                degree: { type: "string", enum: ["", "박사", "석사", "학사", "박", "석", "학"] },
                school: { type: "string" },
                major: { type: "string" },
                year: { type: "string" }
              }
            }
          },
          career: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["country", "company", "rank", "title", "department", "start", "end"],
              properties: {
                country: { type: "string" },
                company: { type: "string" },
                rank: { type: "string" },
                title: { type: "string" },
                department: { type: "string" },
                start: { type: "string" },
                end: { type: "string" }
              }
            }
          },
          achievements: {
            type: "array",
            items: { type: "string" }
          },
          linkedinUrl: { type: "string" },
          profileImageUrl: { type: "string" }
        }
      }
    }
  }
};

function loadLocalEnv() {
  if (process.env.OPENAI_API_KEY && process.env.SUPABASE_URL) {
    return;
  }

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

function getKstDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const [year, month, day] = formatter.format(date).split("-");
  return { year: Number(year), month: Number(month), day: Number(day) };
}

function dateToKey(date) {
  return date.toISOString().slice(0, 10);
}

function kstDateKeyOffset(offsetDays = 0) {
  const { year, month, day } = getKstDateParts();
  const utc = new Date(Date.UTC(year, month - 1, day + offsetDays, 0, 0, 0));
  return dateToKey(utc);
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return dateToKey(date);
}

function getTargetDate(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  const date = url.searchParams.get("date");
  return /^\d{4}-\d{2}-\d{2}$/.test(date || "") ? date : kstDateKeyOffset(-1);
}

function forceRefresh(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  return url.searchParams.get("force") === "1" || url.searchParams.get("cron") === "1";
}

function decodeXml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function extractTag(xml, tag) {
  return decodeXml(xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "");
}

function extractSource(xml) {
  return decodeXml(xml.match(/<source[^>]*>([\s\S]*?)<\/source>/i)?.[1] || "");
}

function parseRssItems(xml, topic) {
  return [...String(xml || "").matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match, index) => {
      const itemXml = match[1];
      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const description = extractTag(itemXml, "description");
      const pubDate = extractTag(itemXml, "pubDate");

      return {
        id: `${topic}-${index}`,
        title,
        url: link,
        snippet: description,
        source: extractSource(itemXml),
        publishedAt: pubDate ? new Date(pubDate).toISOString() : "",
        topic
      };
    })
    .filter((item) => item.title && item.url);
}

function isKoreanNewsInTargetDate(article, targetDate) {
  if (!article.publishedAt) {
    return true;
  }

  const published = new Date(article.publishedAt);
  const kst = new Date(published.getTime() + 9 * 60 * 60 * 1000);
  return dateToKey(kst) === targetDate;
}

function isDxArticle(article) {
  const text = `${article.title} ${article.snippet}`;
  const hasTopic = TOPIC_KEYWORDS.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));
  const hasExcluded = EXCLUDE_KEYWORDS.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));
  return hasTopic && !hasExcluded;
}

function extractGoogleNewsArticleId(url) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname !== "news.google.com") {
      return "";
    }

    const match = parsed.pathname.match(/\/(?:rss\/)?articles\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  } catch (error) {
    return "";
  }
}

function isGoogleNewsArticleUrl(url) {
  return Boolean(extractGoogleNewsArticleId(url));
}

function isPublisherUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return !hostname.endsWith("google.com") && !hostname.endsWith("googleusercontent.com");
  } catch (error) {
    return false;
  }
}

async function mapWithConcurrency(items, limit, iteratee) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await iteratee(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function loadGoogleNewsDecodeParams(articleId) {
  const candidates = [
    `https://news.google.com/articles/${encodeURIComponent(articleId)}`,
    `https://news.google.com/rss/articles/${encodeURIComponent(articleId)}`
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": GOOGLE_NEWS_USER_AGENT
        }
      });

      if (!response.ok) {
        continue;
      }

      const html = await response.text();
      const signature = html.match(/data-n-a-sg=["']([^"']+)["']/)?.[1];
      const timestamp = html.match(/data-n-a-ts=["']([^"']+)["']/)?.[1];

      if (signature && timestamp) {
        return { signature, timestamp };
      }
    } catch (error) {
      console.warn("Google News decode params failed.", error.message);
    }
  }

  return null;
}

function findPublisherUrl(value) {
  if (typeof value === "string") {
    if (value.includes("garturlres")) {
      try {
        return findPublisherUrl(JSON.parse(value));
      } catch (error) {
        // Continue with regex fallback below.
      }
    }

    const unescaped = value
      .replace(/\\"/g, '"')
      .replace(/\\u003d/g, "=")
      .replace(/\\u0026/g, "&");
    const matches = [...unescaped.matchAll(/https?:\/\/[^"\\\]\s]+/g)].map((match) => match[0]);
    return matches.find(isPublisherUrl) || "";
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findPublisherUrl(item);

      if (found) {
        return found;
      }
    }
  }

  return "";
}

function extractPublisherUrlFromBatchResponse(text) {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("["));

  for (const line of lines) {
    try {
      const found = findPublisherUrl(JSON.parse(line));

      if (found) {
        return found;
      }
    } catch (error) {
      const found = findPublisherUrl(line);

      if (found) {
        return found;
      }
    }
  }

  return findPublisherUrl(text);
}

async function decodeGoogleNewsArticleUrl(url) {
  const articleId = extractGoogleNewsArticleId(url);

  if (!articleId) {
    return url;
  }

  const params = await loadGoogleNewsDecodeParams(articleId);

  if (!params) {
    return url;
  }

  try {
    const request = [
      "garturlreq",
      [["X", "X", ["X", "X"], null, null, 1, 1, "KR:ko", null, 1, null, null, null, null, null, 0, 1], "X", "X", 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0],
      articleId,
      Number(params.timestamp),
      params.signature
    ];
    const body = new URLSearchParams({
      "f.req": JSON.stringify([[["Fbv4je", JSON.stringify(request)]]])
    });
    const response = await fetch(GOOGLE_NEWS_BATCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": GOOGLE_NEWS_USER_AGENT
      },
      body
    });

    if (!response.ok) {
      return url;
    }

    const publisherUrl = sanitizeUrl(extractPublisherUrlFromBatchResponse(await response.text()));
    return publisherUrl || url;
  } catch (error) {
    console.warn("Google News article URL decode failed.", error.message);
    return url;
  }
}

async function resolveArticleUrl(article) {
  if (!isGoogleNewsArticleUrl(article.url)) {
    return article;
  }

  const resolvedUrl = await decodeGoogleNewsArticleUrl(article.url);

  if (!resolvedUrl || resolvedUrl === article.url) {
    return article;
  }

  return {
    ...article,
    googleNewsUrl: article.googleNewsUrl || article.url,
    url: resolvedUrl
  };
}

function collectSelectionArticleIds(people) {
  const ids = new Set();

  (people || []).forEach((person) => {
    (person.selectionReasons || []).forEach((reason) => {
      (reason.articleIds || []).forEach((id) => {
        if (id) {
          ids.add(id);
        }
      });
    });
  });

  return [...ids];
}

async function resolveReferencedArticleUrls(articleById, people) {
  const articles = collectSelectionArticleIds(people)
    .map((id) => articleById.get(id))
    .filter((article) => article && isGoogleNewsArticleUrl(article.url));

  if (!articles.length) {
    return;
  }

  const resolvedArticles = await mapWithConcurrency(
    articles,
    GOOGLE_NEWS_DECODE_CONCURRENCY,
    resolveArticleUrl
  );

  resolvedArticles.forEach((article) => {
    articleById.set(article.id, article);
  });
}

async function resolveReportNewsLinks(report) {
  if (!report || !Array.isArray(report.people)) {
    return report;
  }

  const urls = new Set();

  report.people.forEach((person) => {
    (person.selectionReasons || []).forEach((reason) => {
      (reason.links || []).forEach((link) => {
        if (isGoogleNewsArticleUrl(link.url)) {
          urls.add(link.url);
        }
      });
    });
  });

  if (Array.isArray(report.articles)) {
    report.articles.forEach((article) => {
      if (isGoogleNewsArticleUrl(article.url)) {
        urls.add(article.url);
      }
    });
  }

  if (!urls.size) {
    return report;
  }

  const resolvedPairs = await mapWithConcurrency(
    [...urls],
    GOOGLE_NEWS_DECODE_CONCURRENCY,
    async (url) => [url, await decodeGoogleNewsArticleUrl(url)]
  );
  const resolvedByUrl = new Map(resolvedPairs.filter(([original, resolved]) => resolved && resolved !== original));

  if (!resolvedByUrl.size) {
    return report;
  }

  const rewriteLink = (link) => {
    const resolvedUrl = resolvedByUrl.get(link.url);

    if (!resolvedUrl) {
      return link;
    }

    return {
      ...link,
      googleNewsUrl: link.googleNewsUrl || link.url,
      url: resolvedUrl
    };
  };
  const people = report.people.map((person) => ({
    ...person,
    selectionReasons: (person.selectionReasons || []).map((reason) => ({
      ...reason,
      links: (reason.links || []).map(rewriteLink)
    }))
  }));
  const articles = Array.isArray(report.articles)
    ? report.articles.map((article) => {
      const resolvedUrl = resolvedByUrl.get(article.url);

      if (!resolvedUrl) {
        return article;
      }

      return {
        ...article,
        googleNewsUrl: article.googleNewsUrl || article.url,
        url: resolvedUrl
      };
    })
    : report.articles;

  return {
    ...report,
    articles,
    people
  };
}

async function fetchNewsArticles(targetDate) {
  const nextDate = addDays(targetDate, 1);
  const baseFilter = `after:${targetDate} before:${nextDate} -반도체 -메모리 -HBM -파운드리 -웨이퍼 -낸드 -D램 -"DS부문"`;
  const personFilter = `("대표" OR "CEO" OR "창업자" OR "교수" OR "연구원" OR "개발자" OR "사장" OR "회장" OR "임원" OR "리더")`;
  const queries = [
    `("AI" OR "인공지능") ${personFilter} ${baseFilter}`,
    `("로봇" OR "로보틱스") ${personFilter} ${baseFilter}`,
    `("모바일" OR "스마트폰" OR "갤럭시") ${personFilter} ${baseFilter}`,
    `("TV" OR "디스플레이") ${personFilter} ${baseFilter}`,
    `("생활가전" OR "가전" OR "냉장고" OR "세탁기") ${personFilter} ${baseFilter}`
  ];
  const batches = await Promise.all(queries.map(async (query, index) => {
    const topic = ["AI", "로보틱스", "모바일", "TV", "생활가전"][index];
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SamsungTalentPoolNewsRadar/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`Google News RSS failed: ${response.status}`);
    }

    return parseRssItems(await response.text(), topic);
  }));
  const deduped = new Map();

  batches.flat().forEach((article) => {
    const key = article.url || article.title;

    if (!deduped.has(key) && isKoreanNewsInTargetDate(article, targetDate) && isDxArticle(article)) {
      deduped.set(key, {
        ...article,
        id: `news-${deduped.size + 1}`
      });
    }
  });

  return [...deduped.values()].slice(0, MAX_ARTICLES);
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

async function fetchWithTimeout(url, options = {}) {
  const { timeoutMs = 15000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 SamsungTalentPoolNewsRadar/1.0",
        ...(fetchOptions.headers || {})
      }
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchText(url, options = {}) {
  const response = await fetchWithTimeout(url, options);

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }

  return response.text();
}

async function fetchJson(url, options = {}) {
  return JSON.parse(await fetchText(url, options));
}

async function loadCachedReport(targetDate) {
  const rows = await supabaseRequest(`trending_people_reports?select=payload&report_date=eq.${targetDate}&limit=1`);
  return Array.isArray(rows) && rows[0]?.payload ? rows[0].payload : null;
}

async function loadExcludedNames(targetDate) {
  const since = addDays(targetDate, -30);
  const rows = await supabaseRequest(`trending_people_reports?select=people&report_date=gte.${since}&report_date=lt.${targetDate}`);

  if (!Array.isArray(rows)) {
    return [];
  }

  return [...new Set(rows
    .flatMap((row) => Array.isArray(row.people) ? row.people : [])
    .map((person) => String(person.name || "").trim())
    .filter(Boolean))];
}

async function saveReport(report) {
  await supabaseRequest("trending_people_reports?on_conflict=report_date", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([{
      report_date: report.targetDate,
      target_date: report.targetDate,
      generated_at: new Date().toISOString(),
      topics: TOPIC_KEYWORDS,
      excluded_names: report.excludedNames || [],
      articles: report.articles || [],
      people: report.people || [],
      payload: report
    }])
  });
}

function extractOutputText(responseJson) {
  if (typeof responseJson.output_text === "string") {
    return responseJson.output_text;
  }

  const chunks = [];

  for (const item of responseJson.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function articlePromptBlock(articles) {
  return articles.map((article) => ({
    id: article.id,
    topic: article.topic,
    title: article.title,
    source: article.source,
    publishedAt: article.publishedAt,
    snippet: article.snippet.slice(0, 700),
    url: article.url
  }));
}

async function requestOpenAIJson({ apiKey, model, prompt, schema, schemaName, errorLabel, useWebSearch = false }) {
  const body = {
    model,
    input: [
      {
        role: "system",
        content: "Return only schema-valid JSON. Do not include markdown."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        schema,
        strict: true
      }
    },
    temperature: 0.1
  };

  if (useWebSearch) {
    body.tools = [
      {
        type: "web_search",
        external_web_access: true,
        search_context_size: "high",
        user_location: {
          type: "approximate",
          country: "KR",
          city: "Seoul",
          timezone: "Asia/Seoul"
        }
      }
    ];
    body.tool_choice = "required";
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`${errorLabel}: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const outputText = extractOutputText(JSON.parse(responseText));

  if (!outputText) {
    throw new Error(`${errorLabel}: response did not include structured text`);
  }

  return JSON.parse(outputText);
}

async function callOpenAIForPeople(targetDate, articles, excludedNames) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_TRENDING_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "너는 삼성전자 DX부문 채용 담당자를 위한 한국 뉴스 기반 인물 리서치 애널리스트다.",
    `대상 기사 기간: ${targetDate} 00:00~24:00 KST.`,
    "검색 범위는 한국 뉴스 기사이며, 관심 분야는 AI, 로보틱스, 모바일, TV, 생활가전 등 DX 사업분야다.",
    "DS부문 반도체, 메모리, HBM, 파운드리, 웨이퍼, 낸드, D램 중심 인물은 제외한다.",
    "기사 제목/요약에서 많이 언급되고 DX 관심 분야와 관련성이 높은 인물 Top 5를 선정한다.",
    "회사명, 브랜드명, 서비스명, 단체명, 직함만 있는 표현은 인물로 선정하지 않는다.",
    "성씨 또는 일부 이름만 확인되는 경우 제외하고, 기사에서 확인되는 전체 인물명만 선정한다.",
    "최근 1개월 내 이미 제공된 이름은 절대 다시 선정하지 않는다.",
    "프로필 정보는 기사 스니펫과 일반적으로 알려진 공개 프로필 이력에 근거해 최대한 보강한다.",
    "다만 확인이 어려운 출생년도/학력/링크드인은 추정하지 말고 빈 문자열로 둔다.",
    "대표 프로필 사진 URL은 이 단계에서 확실하지 않으면 빈 문자열로 둔다. 후속 공개 웹 프로필 보강 단계에서 다시 조사한다.",
    "현재소속, 현재직책, 과거경력, 핵심 성과는 공개적으로 널리 알려진 사실이면 기사 스니펫에 없더라도 작성한다.",
    "학력은 박사, 석사, 학사 순서로 정리한다. 고등학교 학력은 제외한다.",
    "한국 학교명은 반드시 한국 공식 표기명으로 쓴다. 예: Seoul National University가 아니라 서울대학교, Korea University가 아니라 고려대학교.",
    "경력은 최근 경력부터 나열하고 각 경력의 최종 직급/직책 기준으로 쓴다.",
    "경력 country는 기사 발행국이 아니라 해당 직장/학교/기관의 소재국가다. 예: NVIDIA는 미국, 서울대학교는 한국.",
    "경력 country에서 대한민국 또는 South Korea는 반드시 한국으로 쓴다.",
    "경력 department에는 확인 가능한 소속부서, 연구실, 조직명, 사업부, 팀명을 쓴다. 없으면 빈 문자열.",
    "핵심 성과/실적과 선정 사유는 보고서 문장처럼 짧게 끊고, '~했습니다' 같은 종결 문장을 쓰지 않는다.",
    "선정 사유마다 근거 기사 id를 articleIds에 반드시 포함한다.",
    "",
    `최근 1개월 제외 이름: ${excludedNames.join(", ") || "없음"}`,
    "",
    "기사 목록 JSON:",
    JSON.stringify(articlePromptBlock(articles), null, 2)
  ].join("\n");

  return requestOpenAIJson({
    apiKey,
    model,
    prompt,
    schema: TRENDING_SCHEMA,
    schemaName: "daily_trending_people",
    errorLabel: "OpenAI trending people failed"
  });
}

async function callOpenAIForProfileEnrichment(targetDate, people) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !people.length) {
    return { people: [] };
  }

  const model = process.env.OPENAI_PROFILE_MODEL || process.env.OPENAI_MODEL || "gpt-4.1";
  const prompt = [
    "너는 삼성전자 DX부문 채용 담당자를 위한 공개 웹 프로필 리서치 애널리스트다.",
    `대상 리포트 기사일: ${targetDate}.`,
    "아래 인물에 대해 반드시 web_search 도구로 공개 웹을 검색하고 신뢰 가능한 프로필 정보를 다시 조사해 보강한다.",
    "모델의 기억만으로 빈 값을 확정하지 말고, 공개 웹 검색에서 확인되는 자료를 우선한다.",
    "검색은 인물명+현재소속, 인물명+현재직책, 인물명+학력, 인물명+경력, 영문 이름 조합을 각각 확인한다.",
    "인물 본인/소속기관/상장사 공시/공식 약력/신뢰 가능한 언론 인물소개 자료를 우선한다.",
    "검색은 한국어와 영어를 모두 활용하고, 이름만으로 동명이인 혼동이 있으면 현재소속/현재직책/뉴스 근거 링크와 맞는 인물만 사용한다.",
    "반드시 같은 이름과 같은 순서로 반환한다. 새 인물을 추가하거나 삭제하지 않는다.",
    "학력은 고등학교를 제외하고 박사, 석사, 학사 순으로 모든 확인 가능한 학위 정보를 기재한다.",
    "학위취득년도나 전공 일부만 확인되어도 해당 학력 항목을 포함한다. 학위 자체가 불명확하면 degree는 빈 문자열로 두되 학교/전공/연도는 기재한다.",
    "한국 학교명은 반드시 한국 공식 표기명으로 쓴다. 예: Seoul National University가 아니라 서울대학교, Korea University가 아니라 고려대학교.",
    "학력 year는 학위취득년도를 YYYY 또는 'YY 형태로 쓴다. 확인 불가하면 빈 문자열.",
    "경력은 역대 확인 가능한 모든 주요 경력을 최근 경력부터 기재한다.",
    "현재소속과 현재직책은 반드시 career의 첫 항목에 포함한다. 시작시점을 모르면 start는 빈 문자열, end는 현재로 둔다.",
    "임원 승진, 창업, 교수 임용, 연구원/포닥, 이전 회사 재직처럼 공개 약력에서 확인 가능한 경력은 빠뜨리지 않는다.",
    "경력 country는 기사 발행국이 아니라 해당 직장/학교/기관의 소재국가다. 예: NVIDIA는 미국, 서울대학교는 한국.",
    "경력 country에서 대한민국 또는 South Korea는 반드시 한국으로 쓴다.",
    "경력 department에는 확인 가능한 소속부서, 연구실, 조직명, 사업부, 팀명을 쓴다. 없으면 빈 문자열.",
    "경력 start/end는 YYYY-MM, YYYY, 현재 중 가능한 수준으로만 기재한다. 월 정보가 없으면 YYYY만 쓴다.",
    "직급/직책은 각 경력에서 확인 가능한 최종 직급/직책 기준으로 쓴다. 불확실하면 빈 문자열.",
    "LinkedIn은 공식 개인 프로필이라고 판단되는 경우만 URL을 기재한다. 동명이인 가능성이 있거나 확증이 없으면 빈 문자열.",
    "profileImageUrl은 얼굴이 잘 보이는 대표 프로필 사진의 직접 이미지 URL만 기재한다. 로고, 기사 썸네일 합성, 회사 건물, 비인물 이미지는 제외한다.",
    "이미지 URL을 확실히 제공할 수 없으면 빈 문자열. 추정하거나 존재하지 않는 URL을 만들지 않는다.",
    "핵심 성과/실적은 보고서 항목처럼 짧게 끊고, '~했습니다' 같은 종결 문장을 쓰지 않는다.",
    "",
    "Top5 인물 JSON:",
    JSON.stringify(people.map((person) => ({
      rank: person.rank,
      name: person.name,
      birthYear: person.birthYear,
      currentOrg: person.currentOrg,
      currentTitle: person.currentTitle,
      topics: person.topics,
      linkedinUrl: person.linkedinUrl,
      profileImageUrl: person.profileImageUrl,
      education: person.education,
      career: person.career,
      achievements: person.achievements,
      sourceLinks: (person.selectionReasons || []).flatMap((reason) => reason.links || []).slice(0, 6)
    })), null, 2)
  ].join("\n");

  try {
    return await requestOpenAIJson({
      apiKey,
      model,
      prompt,
      schema: PROFILE_ENRICHMENT_SCHEMA,
      schemaName: "daily_trending_people_profile_enrichment",
      errorLabel: "OpenAI profile enrichment failed",
      useWebSearch: true
    });
  } catch (error) {
    console.warn("OpenAI web profile enrichment failed. Retrying without web search.", error.message);
    return requestOpenAIJson({
      apiKey,
      model,
      prompt,
      schema: PROFILE_ENRICHMENT_SCHEMA,
      schemaName: "daily_trending_people_profile_enrichment",
      errorLabel: "OpenAI profile enrichment fallback failed"
    });
  }
}

function normalizePerson(person, index, articleById) {
  const id = `trend-${String(person.name || index + 1).replace(/\s+/g, "-")}-${index + 1}`;

  return {
    id,
    rank: index + 1,
    name: String(person.name || "").trim(),
    birthYear: String(person.birthYear || "").match(/\b(19\d{2}|20\d{2})\b/)?.[1] || "",
    currentOrg: String(person.currentOrg || "").trim(),
    currentTitle: String(person.currentTitle || "").trim(),
    education: normalizeEducationRecords(person.education).slice(0, 8),
    career: normalizeCareerRecords(person.career).slice(0, 20),
    achievements: Array.isArray(person.achievements)
      ? person.achievements.map((item) => String(item || "").replace(/^[-\s]+/, "").trim()).filter(Boolean).slice(0, 3)
      : [],
    selectionReasons: Array.isArray(person.selectionReasons)
      ? person.selectionReasons.map((reason) => {
        const articleIds = Array.isArray(reason.articleIds) ? reason.articleIds : [];
        return {
          text: String(reason.text || "").replace(/^[-\s]+/, "").trim(),
          links: articleIds
            .map((idValue) => articleById.get(idValue))
            .filter(Boolean)
            .slice(0, 3)
            .map((article) => ({
              title: article.title,
              source: article.source,
              url: article.url
            }))
        };
      }).filter((reason) => reason.text).slice(0, 3)
      : [],
    linkedinUrl: String(person.linkedinUrl || "").trim(),
    profileImageUrl: sanitizeUrl(person.profileImageUrl),
    topics: Array.isArray(person.topics) ? person.topics.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 5) : [],
    mentionCount: Number(person.mentionCount || 0)
  };
}

function sanitizeUrl(value) {
  const url = String(value || "").trim();

  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch (error) {
    return "";
  }
}

function normalizeKoreanSchoolName(value) {
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
    ["soganguniversity", "서강대학교"],
    ["ewhawomansuniversity", "이화여자대학교"],
    ["postech", "포항공과대학교"],
    ["pohanguniversityofscienceandtechnology", "포항공과대학교"],
    ["kaist", "KAIST"],
    ["koreaadvancedinstituteofscienceandtechnology", "KAIST"],
    ["unist", "UNIST"],
    ["ulsannationalinstituteofscienceandtechnology", "UNIST"],
    ["gist", "GIST"],
    ["gwangjuinstituteofscienceandtechnology", "GIST"],
    ["dgist", "DGIST"]
  ]);

  return mappings.get(compact) || school;
}

function normalizeCountryLabel(value) {
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

  return normalizeCountryLabel(item.country);
}

function normalizeEducationRecords(records) {
  return (Array.isArray(records) ? records : []).map((item) => ({
    degree: String(item.degree || "").trim(),
    school: normalizeKoreanSchoolName(item.school),
    major: String(item.major || "").trim(),
    year: String(item.year || item.graduationYear || item.end || "").trim()
  })).filter((item) => item.degree || item.school || item.major || item.year);
}

function normalizeCareerRecords(records) {
  return (Array.isArray(records) ? records : []).map((item) => ({
    country: inferCareerCountry(item),
    company: String(item.company || "").trim(),
    rank: String(item.rank || "").trim(),
    title: String(item.title || item.position || "").trim(),
    department: String(item.department || item.organization || item.org || item.team || item.division || "").trim(),
    start: String(item.start || item.startYear || "").trim(),
    end: String(item.end || item.endYear || "").trim()
  })).filter((item) => item.country || item.company || item.rank || item.title || item.department || item.start || item.end);
}

function normalizePersonProfileBasics(person) {
  const currentOrg = String(person.currentOrg || "").trim();
  const currentTitle = String(person.currentTitle || "").trim();
  const career = normalizeCareerRecords(person.career);

  if (!career.length && (currentOrg || currentTitle)) {
    career.push({
      country: inferCareerCountry({ company: currentOrg }),
      company: currentOrg,
      rank: "",
      title: currentTitle,
      department: "",
      start: "",
      end: "현재"
    });
  }

  return {
    ...person,
    education: normalizeEducationRecords(person.education).slice(0, 8),
    career: career.slice(0, 20),
    profileImageUrl: sanitizeUrl(person.profileImageUrl),
    linkedinUrl: sanitizeUrl(person.linkedinUrl)
  };
}

function reportNeedsProfileRepair(report) {
  if (!report || !Array.isArray(report.people) || !report.people.length) {
    return false;
  }

  return Number(report.profileCompletenessVersion || 0) < PROFILE_COMPLETENESS_VERSION;
}

function mergePersonProfile(basePerson, enrichedPerson) {
  if (!enrichedPerson) {
    return normalizePersonProfileBasics(basePerson);
  }

  const education = Array.isArray(enrichedPerson.education) && enrichedPerson.education.length
    ? enrichedPerson.education
    : basePerson.education;
  const career = Array.isArray(enrichedPerson.career) && enrichedPerson.career.length
    ? enrichedPerson.career
    : basePerson.career;
  const achievements = Array.isArray(enrichedPerson.achievements) && enrichedPerson.achievements.length
    ? enrichedPerson.achievements
    : basePerson.achievements;

  return normalizePersonProfileBasics({
    ...basePerson,
    birthYear: String(enrichedPerson.birthYear || basePerson.birthYear || "").match(/\b(19\d{2}|20\d{2})\b/)?.[1] || basePerson.birthYear,
    currentOrg: String(enrichedPerson.currentOrg || basePerson.currentOrg || "").trim(),
    currentTitle: String(enrichedPerson.currentTitle || basePerson.currentTitle || "").trim(),
    education: normalizeEducationRecords(education).slice(0, 8),
    career: normalizeCareerRecords(career).slice(0, 20),
    achievements: achievements.map((item) => String(item || "").replace(/^[-\s]+/, "").trim()).filter(Boolean).slice(0, 5),
    linkedinUrl: sanitizeUrl(enrichedPerson.linkedinUrl) || basePerson.linkedinUrl,
    profileImageUrl: sanitizeUrl(enrichedPerson.profileImageUrl) || basePerson.profileImageUrl
  });
}

async function enrichPeopleProfiles(targetDate, people) {
  if (!people.length) {
    return people;
  }

  const enrichedResults = await Promise.allSettled(people.map(async (person) => {
    const enriched = await callOpenAIForProfileEnrichment(targetDate, [person]);
    const enrichedPerson = (enriched.people || []).find((item) => String(item.name || "").trim() === person.name);
    return mergePersonProfile(person, enrichedPerson);
  }));

  return people.map((person, index) => {
    const result = enrichedResults[index];

    if (result.status === "fulfilled") {
      return result.value;
    }

    console.warn(`Profile enrichment skipped for ${person.name}.`, result.reason?.message || result.reason);
    return person;
  });
}

function personAssetSearchQueries(person) {
  return [
    `${person.name} ${person.currentOrg || ""}`,
    `${person.name} ${person.currentTitle || ""}`,
    person.name
  ].map((query) => query.trim()).filter(Boolean);
}

function scoreWikiPage(page, person) {
  const text = `${page.title || ""} ${page.extract || ""}`.toLowerCase();
  const name = String(person.name || "").toLowerCase();
  const org = String(person.currentOrg || "").toLowerCase();
  const title = String(person.currentTitle || "").toLowerCase();
  let score = 0;

  if (name && text.includes(name)) {
    score += 4;
  }

  if (org && text.includes(org)) {
    score += 3;
  }

  if (title && text.includes(title)) {
    score += 1;
  }

  if (page.thumbnail?.source) {
    score += 2;
  }

  if (/(기업인|창업자|ceo|chief executive|businessperson|entrepreneur|회장|대표|사장|founder)/i.test(text)) {
    score += 1;
  }

  return score;
}

function wikiPageMatchesPerson(page, person) {
  const name = String(person.name || "").replace(/\s+/g, "").toLowerCase();
  const text = `${page.title || ""} ${page.extract || ""}`.replace(/\s+/g, "").toLowerCase();
  return Boolean(name && text.includes(name));
}

async function fetchWikipediaProfileImage(person) {
  const hosts = ["ko.wikipedia.org", "en.wikipedia.org"];

  for (const host of hosts) {
    for (const query of personAssetSearchQueries(person)) {
      const url = `https://${host}/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=4&prop=pageimages|extracts&pithumbsize=640&exintro=1&explaintext=1&origin=*`;

      try {
        const json = await fetchJson(url);
        const pages = Object.values(json.query?.pages || {})
          .filter((page) => page.title && page.thumbnail?.source)
          .filter((page) => wikiPageMatchesPerson(page, person))
          .sort((a, b) => scoreWikiPage(b, person) - scoreWikiPage(a, person));
        const best = pages[0];

        if (best && scoreWikiPage(best, person) >= 4) {
          return sanitizeUrl(best.thumbnail.source);
        }
      } catch (error) {
        console.warn(`Wikipedia image lookup failed for ${person.name}.`, error.message);
      }
    }
  }

  return "";
}

function extractLinkedInUrls(html) {
  const decoded = decodeHtml(html);
  const urls = new Set();
  const directMatches = decoded.match(/https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[^"'<>\s&]+/gi) || [];

  directMatches.forEach((url) => urls.add(url));

  for (const match of decoded.matchAll(/[?&]uddg=([^&"']+)/g)) {
    try {
      urls.add(decodeURIComponent(match[1]));
    } catch (error) {
      // Ignore malformed redirect values.
    }
  }

  return [...urls]
    .map((url) => sanitizeUrl(url.split("?")[0]))
    .filter((url) => /^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[^/?#]+/i.test(url));
}

function extractSearchResultUrls(html) {
  const decoded = decodeHtml(html);
  const urls = new Set();

  for (const match of decoded.matchAll(/[?&]uddg=([^&"']+)/g)) {
    try {
      urls.add(decodeURIComponent(match[1]));
    } catch (error) {
      // Ignore malformed redirect values.
    }
  }

  for (const match of decoded.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)) {
    urls.add(match[1]);
  }

  return [...urls]
    .map(sanitizeUrl)
    .filter(Boolean)
    .filter((url) => !/duckduckgo\.com|google\.com|bing\.com|naver\.com\/search/i.test(url))
    .slice(0, 8);
}

function expandImageUrlCandidates(url) {
  const safeUrl = sanitizeUrl(url);

  if (!safeUrl) {
    return [];
  }

  const candidates = new Set([safeUrl]);

  if (safeUrl.includes("/thumbnail/")) {
    const photoUrl = safeUrl
      .replace("/thumbnail/", "/photo/")
      .replace(/_v\d+(?=\.[a-z0-9]+(?:[?#]|$))/i, "");
    candidates.add(photoUrl);

    if (/\.jpg(?:[?#]|$)/i.test(photoUrl)) {
      candidates.add(photoUrl.replace(/\.jpg(?=([?#]|$))/i, ".jpeg"));
    }

    if (/\.jpeg(?:[?#]|$)/i.test(photoUrl)) {
      candidates.add(photoUrl.replace(/\.jpeg(?=([?#]|$))/i, ".jpg"));
    }
  }

  return [...candidates];
}

function extractImageCandidateUrls(html, pageUrl, options = {}) {
  const { person = null, requireNameInImageTag = false } = options;
  const name = String(person?.name || "").replace(/\s+/g, "").toLowerCase();
  const urls = new Set();

  for (const match of String(html || "").matchAll(/<meta\b[^>]+>/gi)) {
    const tag = match[0];

    if (!/(?:property|name)=["'](?:og:image|twitter:image|image)["']/i.test(tag)) {
      continue;
    }

    const content = tag.match(/content=["']([^"']+)["']/i)?.[1];

    if (content) {
      expandImageUrlCandidates(new URL(decodeHtml(content), pageUrl).href).forEach((url) => urls.add(url));
    }
  }

  for (const match of String(html || "").matchAll(/<img\b[^>]+>/gi)) {
    const tag = match[0];
    const compactTag = decodeHtml(tag).replace(/\s+/g, "").toLowerCase();

    if (requireNameInImageTag && name && !compactTag.includes(name)) {
      continue;
    }

    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || tag.match(/\bdata-src=["']([^"']+)["']/i)?.[1];

    if (src) {
      expandImageUrlCandidates(new URL(decodeHtml(src), pageUrl).href).forEach((url) => urls.add(url));
    }
  }

  return [...urls]
    .filter((url) => !/logo|symbol|emblem|banner|share_sns|printlogo|toplogo|icon[-_]/i.test(url))
    .slice(0, 16);
}

function findKnownProfileImageUrl(person) {
  const name = String(person.name || "").trim();
  const organization = String(person.currentOrg || "").trim();
  const match = KNOWN_PROFILE_IMAGE_URLS.find((item) =>
    item.name === name &&
    (!item.organizationPattern || item.organizationPattern.test(organization))
  );

  return match?.url || "";
}

function collectPersonSourceUrls(person) {
  const urls = new Set();

  (person.selectionReasons || []).forEach((reason) => {
    (reason.links || []).forEach((link) => {
      const safeUrl = sanitizeUrl(link.url);

      if (safeUrl) {
        urls.add(safeUrl);
      }
    });
  });

  return [...urls].slice(0, 8);
}

async function fetchProfileImageFromSourceLinks(person) {
  for (const sourceUrl of collectPersonSourceUrls(person)) {
    try {
      const html = await fetchText(sourceUrl, { timeoutMs: 12000 });

      for (const candidateUrl of extractImageCandidateUrls(html, sourceUrl, { person })) {
        const imageUrl = await validateImageUrl(candidateUrl);

        if (imageUrl) {
          return imageUrl;
        }
      }
    } catch (error) {
      console.warn(`Source article image lookup failed for ${person.name}.`, error.message);
    }
  }

  return "";
}

async function fetchProfileImageFromSearch(person) {
  const queries = [
    `"${person.name}" "${person.currentOrg || ""}" 프로필 사진`,
    `"${person.name}" "${person.currentOrg || ""}" profile photo`,
    `"${person.name}" "${person.currentOrg || ""}" faculty profile`,
    `"${person.name}" "${person.currentOrg || ""}" CEO profile`
  ].map((query) => query.replace(/\s+/g, " ").trim());

  for (const query of queries) {
    try {
      const searchHtml = await fetchText(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { timeoutMs: 12000 });
      const resultUrls = extractSearchResultUrls(searchHtml);

      for (const resultUrl of resultUrls) {
        const directImage = await validateImageUrl(resultUrl);

        if (directImage) {
          return directImage;
        }

        try {
          const pageHtml = await fetchText(resultUrl, { timeoutMs: 12000 });

          for (const candidateUrl of extractImageCandidateUrls(pageHtml, resultUrl, { person, requireNameInImageTag: true })) {
            const imageUrl = await validateImageUrl(candidateUrl);

            if (imageUrl) {
              return imageUrl;
            }
          }
        } catch (error) {
          // Continue through other public profile result pages.
        }
      }
    } catch (error) {
      console.warn(`Profile image search failed for ${person.name}.`, error.message);
    }
  }

  return "";
}

async function fetchLinkedInProfileUrl(person) {
  const queries = [
    `site:linkedin.com/in "${person.name}" "${person.currentOrg || ""}"`,
    `site:linkedin.com/in "${person.name}" "${person.currentTitle || ""}"`,
    `site:linkedin.com/in "${person.name}"`
  ].map((query) => query.trim());

  for (const query of queries) {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

    try {
      const html = await fetchText(url);
      const urls = extractLinkedInUrls(html);
      const org = String(person.currentOrg || "").toLowerCase();
      const preferred = urls.find((candidate) => org && candidate.toLowerCase().includes(org.replace(/[^a-z0-9]/g, ""))) || urls[0];

      if (preferred) {
        return preferred;
      }
    } catch (error) {
      console.warn(`LinkedIn lookup failed for ${person.name}.`, error.message);
    }
  }

  return "";
}

async function validateImageUrl(url) {
  const safeUrl = sanitizeUrl(url);

  if (!safeUrl || /%e2%80%a6|…|logo|symbol|emblem|\/[a-z0-9_-]*ci[._-]/i.test(safeUrl) || /\.svg(?:[?#]|$)/i.test(safeUrl)) {
    return "";
  }

  try {
    let response = await fetchWithTimeout(safeUrl, {
      method: "HEAD",
      timeoutMs: 8000,
      headers: { "User-Agent": "Mozilla/5.0 SamsungTalentPoolNewsRadar/1.0" }
    });

    if (response.status === 405 || response.status === 403) {
      response = await fetchWithTimeout(safeUrl, {
        method: "GET",
        timeoutMs: 8000,
        headers: {
          "User-Agent": "Mozilla/5.0 SamsungTalentPoolNewsRadar/1.0",
          Range: "bytes=0-0"
        }
      });
    }

    const contentType = response.headers.get("content-type") || "";
    return response.ok && contentType.toLowerCase().startsWith("image/") ? safeUrl : "";
  } catch (error) {
    return "";
  }
}

async function supplementPublicProfileAssets(people) {
  const results = await Promise.allSettled(people.map(async (rawPerson) => {
    const person = normalizePersonProfileBasics(rawPerson);
    let imageUrl = await validateImageUrl(person.profileImageUrl);

    if (!imageUrl) {
      imageUrl = await validateImageUrl(await fetchWikipediaProfileImage(person));
    }

    if (!imageUrl) {
      imageUrl = await validateImageUrl(findKnownProfileImageUrl(person));
    }

    if (!imageUrl) {
      imageUrl = await fetchProfileImageFromSourceLinks(person);
    }

    if (!imageUrl) {
      imageUrl = await fetchProfileImageFromSearch(person);
    }

    const linkedinUrl = person.linkedinUrl || await fetchLinkedInProfileUrl(person);

    return {
      ...person,
      profileImageUrl: imageUrl,
      linkedinUrl: sanitizeUrl(person.linkedinUrl) || sanitizeUrl(linkedinUrl)
    };
  }));

  return people.map((person, index) => {
    const result = results[index];
    return result.status === "fulfilled" ? result.value : person;
  });
}

async function repairReportProfiles(report) {
  if (!report || !Array.isArray(report.people)) {
    return report;
  }

  const targetDate = report.targetDate || report.reportDate || kstDateKeyOffset(-1);
  const normalizedPeople = report.people.map(normalizePersonProfileBasics);
  const enrichedPeople = await enrichPeopleProfiles(targetDate, normalizedPeople);
  const people = await supplementPublicProfileAssets(enrichedPeople);

  return {
    ...report,
    people,
    profileCompletenessVersion: PROFILE_COMPLETENESS_VERSION,
    profileRepairedAt: new Date().toISOString()
  };
}

function isLikelyPersonName(person) {
  const name = String(person.name || "").trim();
  const currentOrg = String(person.currentOrg || "").trim();

  if (!name) {
    return false;
  }

  if (/(대표|회장|사장|부사장|상무|전무|임원|팀장|관계자|지도사|전문가|업계|법인|회사|기업|그룹|홀딩스|로보틱스|테크|전자|모빌리티|AI|뉴스|부문|사업부)/i.test(name)) {
    return false;
  }

  if (currentOrg && currentOrg.includes(name) && name.replace(/\s+/g, "").length <= 4) {
    return false;
  }

  if (/^[A-Za-z]+$/.test(name)) {
    return false;
  }

  return /^[가-힣A-Za-z\s.'-]{2,40}$/.test(name);
}

async function generateReport(targetDate) {
  const excludedNames = await loadExcludedNames(targetDate);
  const articles = await fetchNewsArticles(targetDate);

  if (!articles.length) {
    throw new Error("No Korean DX news articles were found for the target date.");
  }

  const articleById = new Map(articles.map((article) => [article.id, article]));
  const ranked = await callOpenAIForPeople(targetDate, articles, excludedNames);
  const rankedCandidates = (ranked.people || [])
    .filter((person) => person.name && !excludedNames.includes(person.name) && isLikelyPersonName(person))
    .slice(0, 5);
  await resolveReferencedArticleUrls(articleById, rankedCandidates);

  const articlesWithResolvedLinks = articles.map((article) => articleById.get(article.id) || article);
  const rankedPeople = rankedCandidates.map((person, index) => normalizePerson(person, index, articleById));
  const enrichedPeople = await enrichPeopleProfiles(targetDate, rankedPeople);
  const people = await supplementPublicProfileAssets(enrichedPeople);
  const report = {
    reportDate: targetDate,
    targetDate,
    generatedAt: new Date().toISOString(),
    profileCompletenessVersion: PROFILE_COMPLETENESS_VERSION,
    searchScope: "Google News 한국판 RSS, hl=ko, gl=KR, ceid=KR:ko",
    topics: TOPIC_KEYWORDS,
    excludedNames,
    articleCount: articlesWithResolvedLinks.length,
    articles: articlesWithResolvedLinks,
    people
  };

  await saveReport(report);
  return report;
}

module.exports = async function trendingPeople(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  loadLocalEnv();

  try {
    const targetDate = getTargetDate(request.url);
    const shouldForce = forceRefresh(request.url);
    const cached = shouldForce ? null : await loadCachedReport(targetDate);
    const sourceReport = cached || await generateReport(targetDate);
    let report = await resolveReportNewsLinks(sourceReport);

    if (cached && reportNeedsProfileRepair(report)) {
      report = await repairReportProfiles(report);
    }

    if (cached && report !== sourceReport) {
      await saveReport(report).catch((saveError) => {
        console.warn("Trending people report migration save failed.", saveError.message);
      });
    }

    sendJson(response, 200, {
      ok: true,
      cached: Boolean(cached),
      report
    });
  } catch (error) {
    console.warn("Trending people report failed.", error);
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Trending people report failed"
    });
  }
};
