"use strict";

// Structures raw candidate sources (LinkedIn profile + pasted news/notes)
// into the internal Samsung DX profile schema consumed by
// lib/profile-report-docx.js. Returns editable JSON for the UI to review
// before the .docx is generated (see api/profile-report-docx.js).

const MAX_SOURCES_CHARS = 24000;

const CANDIDATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "name", "orgShort", "orgFull", "basicTitle", "category", "role",
    "birthYear", "birthLine", "age", "birthMark",
    "education", "career", "competencyTitle", "competencies",
    "competencyNotes", "summaryBullets", "reviewNote", "talkingPoints"
  ],
  properties: {
    name: { type: "string" },
    orgShort: { type: "string" },
    orgFull: { type: "string" },
    basicTitle: { type: "string" },
    category: { type: "string" },
    role: { type: "string" },
    birthYear: { type: "string" },
    birthLine: { type: "string" },
    age: { type: "string" },
    birthMark: { type: "string" },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["degree", "school", "major", "year", "note"],
        properties: {
          degree: { type: "string" },
          school: { type: "string" },
          major: { type: "string" },
          year: { type: "string" },
          note: { type: "string" }
        }
      }
    },
    career: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["country", "org", "title", "period", "note"],
        properties: {
          country: { type: "string" },
          org: { type: "string" },
          title: { type: "string" },
          period: { type: "string" },
          note: { type: "string" }
        }
      }
    },
    competencyTitle: { type: "string" },
    competencies: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["headline", "bullets"],
        properties: {
          headline: { type: "string" },
          bullets: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["text", "notes"],
              properties: {
                text: { type: "string" },
                notes: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    },
    competencyNotes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["text", "note"],
        properties: { text: { type: "string" }, note: { type: "string" } }
      }
    },
    summaryBullets: { type: "array", items: { type: "string" } },
    reviewNote: { type: "string" },
    talkingPoints: { type: "array", items: { type: "string" } }
  }
};

const FORMAT_GUIDES = {
  interview: [
    "형식 A(면접용 상세): 제목은 【 이름(소속) Profile 】.",
    "competencyTitle에 '전문 역량' 한 줄 요약을 쓴다(예: 'AI/Tech 분야 투자 전문가').",
    "competencies는 2~3개의 밑줄 헤드라인(headline)과 각 1~2개 근거 불릿(bullets)으로 구성한다.",
    "talkingPoints는 면접에서 다룰 논의 주제 3개를 명사형으로 작성한다.",
    "competencyNotes(※)에는 특이사항이 있으면 1개 이내로 작성한다. summaryBullets, category, reviewNote는 빈 값으로 둔다."
  ],
  basic: [
    "형식 B(기본 프로필): orgShort(소속 약칭), orgFull(정식명칭+국문), basicTitle('소속, 이름 프로필')을 채운다.",
    "age(나이, 숫자 문자열), birthMark(예: \"'85年生\")을 채운다. birthLine은 빈 값으로 둔다.",
    "career는 각 항목에 period(재직기간)를 포함한다.",
    "competencies는 '참고사항' 섹션으로, 밑줄 헤드라인 + 근거 불릿으로 구성한다.",
    "competencyNotes(※)에 산학협력/입사예정 등 핵심 특이사항을 작성한다. talkingPoints, summaryBullets, category, reviewNote는 빈 값으로 둔다."
  ],
  summary: [
    "형식 C(요약표 1인 행): category(분류 태그, 예: 'M&A','로봇(전략)')를 채운다.",
    "competencyTitle(전문역량 한 줄), summaryBullets(핵심 역량 2개)를 작성한다.",
    "reviewNote는 '~ 후보자로 검토' 형태로 작성한다(예: 'M&A 후보자로 검토').",
    "career/education은 표에 들어갈 핵심만 간결히. competencies, talkingPoints, competencyNotes는 빈 값으로 둔다."
  ]
};

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 3_000_000) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(payload));
}

function modelSupportsTemperature(model) {
  return !/^gpt-5(?:[.\-]|$)/i.test(String(model || ""));
}

function extractOutputText(responseJson) {
  if (typeof responseJson.output_text === "string") return responseJson.output_text;
  const chunks = [];
  for (const item of responseJson.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}

function buildPrompt(format, input) {
  const guide = FORMAT_GUIDES[format] || FORMAT_GUIDES.interview;
  return [
    "너는 삼성전자 DX부문 채용담당자를 위한 외부 인재 프로필 분석가다.",
    "웹 검색으로 해당 인물을 조사하고, 제공된 자료(LinkedIn 프로필, 뉴스/메모)와 종합해 사내 표준 양식의 후보자 프로필을 작성한다.",
    "",
    "[조사]",
    "- LinkedIn URL 유무와 무관하게, 먼저 웹 검색(web_search)으로 인물의 학력·경력·성과·근황을 조사해 데이터를 최대한 풍성하게 보완한다.",
    "- 이름과 소속/직급 힌트로 동일 인물을 특정하고, 신뢰 가능한 출처(기사, 공식 프로필, 회사 페이지)를 우선한다. 확신이 없으면 추측하지 않는다.",
    "",
    "[분량 — 가장 중요]",
    "- 결과 보고서는 반드시 A4 '1장'을 넘지 않는다. 모든 문구는 반드시 '한 줄' 안에 들어가야 한다(2줄 금지).",
    "- 한 줄 길이 기준: headline(-)/bullet(·)/talking point/※ 문구는 공백 포함 대략 '한글 38자(영문 위주면 70자)'를 넘기지 않는다. 이 한도에 최대한 가깝게, 빼곡하게 채운다(너무 짧으면 안 됨).",
    "- 학력의 전공명도 반드시 1줄에 맞춘다. 예: Aeronautical and Astronautical Engineering → '항공우주공학', Computer Science → 'CS' 또는 '컴퓨터과학', Mechanical Engineering → 'ME' 또는 '기계공학'.",
    "- 학교/기관: Massachusetts Institute of Technology→MIT, Stanford University→Stanford, The Ohio State University→Ohio State, 서울대학교→서울대.",
    "- 직급/직책: Chief Executive Officer→CEO, Chief Operating Officer→COO, Vice President→VP, Senior→Sr..",
    "- 경력 회사명이 길면 줄인다: Boston Dynamics→BD社, Honeywell FM&T→Honeywell社 등. 표 안에서 1줄을 넘기지 않도록 회사명·직책을 과감히 축약한다.",
    "- 위 예시 외에도 통용되는 약어/축약이 있으면 스스로 판단해 적극 적용한다. 축약이 자동화 효용의 핵심이다.",
    "",
    "[문장 작성]",
    "- 한국어 개조식(명사형 종결): '~ 전문가', '~ 보유', '~ 다수', '~ 中' 등으로 끝맺는다.",
    "- headline(-)/bullet(·)/talking point 문구 맨 앞에 '-','·' 같은 기호를 넣지 않는다(기호는 시스템이 붙인다).",
    "- talking point도 한 줄을 꽉 채우는 완결된 문장으로 작성한다. 너무 짧은 키워드 나열은 금지.",
    "- 밑줄기호나 마크다운 강조(_,*)를 넣지 않는다. 순수 텍스트만.",
    "- 자료·검색으로 확인되지 않는 사실은 만들지 않는다. 모르는 값은 빈 문자열/빈 배열.",
    "",
    "[표기 관례]",
    "- 국가 약어 美/韓/英/中/日 을 경력 org 앞 country에, 학위는 博/碩/學, 회사는 '社', 현재는 '現', 등은 '等', 내부는 '內'.",
    "- career.period 예: \"'20~ 現\", \"'18~'24\". education.year는 졸업연도 2자리(예: '15').",
    "- birthYear: 출생연도 4자리(예: '1961')를 신뢰 가능하게 알 때만 채우고, 모르면 빈 문자열. (나이는 시스템이 자동 계산하므로 age/birthLine은 비워도 됨)",
    "",
    "[각주(note/notes) 규칙]",
    "- 각주는 '전문용어·생소한 단어·약어를 풀어 설명'하는 부연설명 용도로만 쓴다(예: 'BofA = Bank of America', 'VLA = Vision-Language-Action').",
    "- 출처 표기는 각주에 절대 넣지 않는다: 'LinkedIn 기준', '보도자료 기반', '공식 프로필', '게시물 기준' 같은 출처·근거 문구 금지.",
    "- 설명할 약어/전문용어가 없으면 각주는 비운다.",
    "",
    "[형식 지침]",
    ...guide.map((g) => "- " + g),
    "",
    "[입력 자료]",
    "요청 힌트: " + JSON.stringify({ name: input.name || "", org: input.org || "", rank: input.rank || "", category: input.category || "" }),
    "LinkedIn 정규화 프로필: " + JSON.stringify(input.linkedinProfile || null),
    "추가 자료(뉴스/메모):",
    (input.sourcesText || "(없음)").slice(0, MAX_SOURCES_CHARS)
  ].join("\n");
}

async function callOpenAI(format, input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const model = process.env.OPENAI_PROFILE_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const requestBody = {
    model,
    input: [
      { role: "system", content: "You are a precise HR profile analyst. Research the person on the web, then return only schema-valid JSON. Never invent facts, and keep the whole report to a single page." },
      { role: "user", content: buildPrompt(format, input) }
    ],
    text: { format: { type: "json_schema", name: "candidate_profile", schema: CANDIDATE_SCHEMA, strict: true } }
  };
  if (String(process.env.PROFILE_WEB_SEARCH || "on").toLowerCase() !== "off") {
    requestBody.tools = [{ type: "web_search" }];
  }
  if (modelSupportsTemperature(model)) requestBody.temperature = 0.2;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  const responseText = await response.text();
  if (!response.ok) throw new Error(`OpenAI profile structuring failed: ${response.status} ${responseText.slice(0, 500)}`);

  const outputText = extractOutputText(JSON.parse(responseText));
  if (!outputText) throw new Error("OpenAI profile response did not include structured text");
  return JSON.parse(outputText);
}

module.exports = async function profileReport(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse((await readRequestBody(request)) || "{}");
    const format = ["interview", "basic", "summary"].includes(body.format) ? body.format : "interview";

    if (!body.name && !body.linkedinProfile && !body.sourcesText) {
      sendJson(response, 400, { ok: false, error: "name, linkedinProfile, or sourcesText is required" });
      return;
    }

    const candidate = await callOpenAI(format, {
      name: body.name,
      org: body.org || body.orgHint,
      rank: body.rank,
      category: body.category,
      linkedinProfile: body.linkedinProfile,
      sourcesText: body.sourcesText
    });

    sendJson(response, 200, { ok: true, format, candidate });
  } catch (error) {
    console.warn("Profile structuring failed.", error);
    sendJson(response, 500, { ok: false, error: error.message || "Profile structuring failed" });
  }
};
