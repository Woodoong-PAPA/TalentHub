const MAX_ARTICLES = 90;
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
              required: ["country", "company", "rank", "title", "start", "end"],
              properties: {
                country: { type: "string" },
                company: { type: "string" },
                rank: { type: "string" },
                title: { type: "string" },
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
    "현재소속, 현재직책, 과거경력, 핵심 성과는 공개적으로 널리 알려진 사실이면 기사 스니펫에 없더라도 작성한다.",
    "학력은 박사, 석사, 학사 순서로 정리한다. 고등학교 학력은 제외한다.",
    "경력은 최근 경력부터 나열하고 각 경력의 최종 직급/직책 기준으로 쓴다.",
    "핵심 성과/실적과 선정 사유는 보고서 문장처럼 짧게 끊고, '~했습니다' 같은 종결 문장을 쓰지 않는다.",
    "선정 사유마다 근거 기사 id를 articleIds에 반드시 포함한다.",
    "",
    `최근 1개월 제외 이름: ${excludedNames.join(", ") || "없음"}`,
    "",
    "기사 목록 JSON:",
    JSON.stringify(articlePromptBlock(articles), null, 2)
  ].join("\n");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
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
          name: "daily_trending_people",
          schema: TRENDING_SCHEMA,
          strict: true
        }
      },
      temperature: 0.1
    })
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`OpenAI trending people failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const outputText = extractOutputText(JSON.parse(responseText));

  if (!outputText) {
    throw new Error("OpenAI trending people response did not include structured text");
  }

  return JSON.parse(outputText);
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
    education: Array.isArray(person.education) ? person.education.slice(0, 5) : [],
    career: Array.isArray(person.career) ? person.career.slice(0, 8) : [],
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
    topics: Array.isArray(person.topics) ? person.topics.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 5) : [],
    mentionCount: Number(person.mentionCount || 0)
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
  const people = (ranked.people || [])
    .filter((person) => person.name && !excludedNames.includes(person.name) && isLikelyPersonName(person))
    .slice(0, 5)
    .map((person, index) => normalizePerson(person, index, articleById));
  const report = {
    reportDate: targetDate,
    targetDate,
    generatedAt: new Date().toISOString(),
    searchScope: "Google News 한국판 RSS, hl=ko, gl=KR, ceid=KR:ko",
    topics: TOPIC_KEYWORDS,
    excludedNames,
    articleCount: articles.length,
    articles,
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
    const report = cached || await generateReport(targetDate);

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
