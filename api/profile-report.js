"use strict";

// Structures raw candidate sources (LinkedIn profile + pasted news/notes)
// into the internal Samsung DX profile schema consumed by
// lib/profile-report-docx.js. Returns editable JSON for the UI to review
// before the .docx is generated (see api/profile-report-docx.js).

const MAX_SOURCES_CHARS = 24000;

// Per-fact source, rendered as a real Word comment (검토 메모). name is the
// source label (예: 'MIT 공식 프로필'); url the link the model actually saw (빈
// 문자열 가능). The confirmation date is stamped by the renderer.
const SOURCE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["name", "url"],
  properties: { name: { type: "string" }, url: { type: "string" } }
};

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
        required: ["degree", "school", "major", "year", "note", "source"],
        properties: {
          degree: { type: "string" },
          school: { type: "string" },
          major: { type: "string" },
          year: { type: "string" },
          note: { type: "string" },
          source: SOURCE_SCHEMA
        }
      }
    },
    career: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["country", "org", "title", "period", "note", "source"],
        properties: {
          country: { type: "string" },
          org: { type: "string" },
          title: { type: "string" },
          period: { type: "string" },
          note: { type: "string" },
          source: SOURCE_SCHEMA
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
              required: ["text", "notes", "source"],
              properties: {
                text: { type: "string" },
                notes: { type: "array", items: { type: "string" } },
                source: SOURCE_SCHEMA
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
    "형식 A(면접용 상세) — 대기업 경영진 면담 준비용 한국어 1쪽 프로필. 아래 기준을 엄격히 따른다.",
    "[식별] 이름·소속으로 동일 인물을 먼저 특정하고 직급/직책은 별도로 검증한다. 동명이인 판단이 어려우면 무리하게 확정하지 않는다.",
    "[검증] 출처 우선순위: 회사·대학 공식 프로필 → 본인 홈페이지 → LinkedIn → 신뢰할 만한 언론. 학력·생년·재직기간·직책·성과 수치·수상은 각각 근거를 확인한다. 언론 1건에만 실린 성과도 사용 가능하나 그 사실의 note에 근거 범위를 남긴다. 로그인해야 보이는 LinkedIn 비공개 정보는 실제 접근 자료가 있을 때만 사용한다.",
    "[미확인] 조사로 찾지 못한 값은 지어내지 말고 '미확인'으로 표기한다(생년 미확인이면 birthYear는 빈 문자열로 두되, 확인 자체가 불가함을 competencyNotes 등으로 알릴 수 있다). 확인된 근거가 없는 성과·역량 주장은 아예 작성하지 않는다.",
    "[출처] 주요 학력·경력·근거(bullet)의 source(출처명·URL)를 가능한 한 채운다 — 각 사실에 Word 검토 메모로 삽입된다. 출처 충돌·언론 1건 근거·입력 직책과 조사 결과 차이도 해당 항목의 source.name에 짧게 남긴다.",
    "[중립성] '세계적 석학','업계 최고 수준' 같은 강한 평가는 객관적 근거가 있을 때만. 근거가 없으면 확인된 전문 분야를 중립적으로 기술한다.",
    "[제목/식별필드] 제목은 시스템이 【 이름(소속) Profile 】로 만든다(직급은 제목에 넣지 않음). orgShort에 소속 약칭(학교·회사 병기는 'MIT/Meta'처럼 슬래시), role에 직급/직책을 채운다. competencyTitle에는 확인된 전문 분야 요약 한 줄(예: '생체모사 로보틱스·휴머노이드 R&D 전문가').",
    "[인적사항 표] education/career에는 '핵심 명칭과 연도'만 넣는다. 담당 업무·성과·배경 설명은 표에 쓰지 말고 전문역량 bullet 본문으로 옮긴다. 긴 공식 명칭은 식별 가능한 약칭으로. 표가 좁으면 중요도 낮은 과거 경력을 먼저 생략하고, 사실을 합치거나 연도를 임의로 단축하지 않는다.",
    "[전문역량] competencies는 핵심 주장(headline) 2개가 기본. 객관적으로 뛰어난 성취를 우선하되, 검토 분야(포지션)가 주어지면 관련성도 함께 고려한다.",
    "[근거] 각 headline의 bullets(근거)는 2개가 기본이나, 양질의 근거가 하나뿐이면 1개만 쓴다. 각 bullet은 정확히 두 줄 분량(공백 포함 46~64자)으로 편집한다. 줄 수를 맞추려 사실을 부풀리거나 왜곡하지 않는다. 근거 없는 주장은 만들지 않는다. bullet 뒷받침 태그(bullets.notes: 기관명·지표·약어)는 0~2개 선택적으로.",
    "[영입 메모] competencyNotes(※)는 사용자가 '영입 검토 포지션' 또는 '확인된 내부 진행 상황'을 제공한 경우에만 1개 작성한다. 제공하지 않았으면 빈 배열([]).",
    "[Talking Point] talkingPoints는 짧은 면담 주제형 문구(완성형 질문 금지) 정확히 3개를 이 순서로: (1) 대표 성과의 배경과 본인 기여 (2) 해당 분야의 기술·시장 전망 (3) 향후 협업 또는 합류 가능성. 영입 정보가 없으면 (3)은 공개된 전문성·협업 가능성 중심으로 쓰고 합류 의향을 추측하지 않는다.",
    "summaryBullets, category, reviewNote는 빈 값으로 둔다."
  ],
  basic: [
    "형식 B(기본 프로필): 인적 사항 / 주요 사항(경력) / 참고 사항 3개 섹션으로 구성한다. orgShort(소속 약칭), orgFull(정식명칭+국문), basicTitle('소속, 이름 프로필'), role(직급)을 채운다.",
    "age(나이, 숫자 문자열), birthMark(예: \"'85年生\")을 채운다(연령은 \"41세 ('85年生)\" 형태로 표시됨). birthLine은 빈 값으로 둔다.",
    "education은 학위 1개당 1개 항목(博)/碩)/學)). career(주요 사항)는 각 항목에 period(재직기간)를 포함하고 최신순으로 정렬한다. '인턴(Intern)' 경력은 목록에서 제외한다.",
    "competencies(참고 사항)는 '- 개조식 헤드라인'(32~40자, 밑줄 아님) + 그 아래 '· 두 줄 근거 불릿'(46~64자)으로 구성한다.",
    "참고 사항에는 학력·전공·소속(창업 포함) 같은 '사실 나열'을 되풀이하지 않는다 — 그 정보는 인적 사항·주요 사항에서 이미 확인된다. 대신 각 소속·학위 기간 동안 '무엇을 했는지'(구체적 연구·프로젝트·핵심 기술·성과·수상·특허·전문성)를 웹 조사해 실질적으로 유익한 내용을 담는다.",
    "competencyNotes(※)에 산학협력/입사예정 등 핵심 특이사항을 1개 이내로 작성한다(예: \"'휴머노이드 전신제어 AI 개발' 주제로 삼성과 산학협력 진행 中\"). talkingPoints, summaryBullets, category, reviewNote는 빈 값으로 둔다."
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
    "- 결과 보고서는 반드시 A4 '1장'을 넘지 않는다.",
    "- headline(-), talking point, ※ 참고사항: 각각 '한 줄'을 거의 꽉 채우되 절대 2줄을 넘기지 않는다. 길이(엄격): 공백 포함 한글 32~40자(영문 위주면 64~80자). 31자 이하는 반려 사유이니 구체 기관명·수치·성과·맥락을 덧붙여 보강하고, 42자를 넘으면 줄인다.",
    "- bullet(·): '두 줄'로 풍부하게 작성한다. 길이(권장): 공백 포함 한글 46~64자. 한 줄로 끝날 만큼 짧게 쓰지 말고, 근거·수치·맥락을 담아 두 줄을 채운다(단, 3줄은 넘기지 않는다).",
    "- 특히 headline과 talking point가 짧아지기 쉬우니, 구체 기관명·수치·성과·맥락·시사점을 덧붙여 한 줄을 꽉 채운다. bullet은 그보다 더 길게(두 줄) 쓴다.",
    "- 예(나쁨→좋음): headline '바이오모방 로보틱스 설계 강점' → '생체모사·휴머노이드 로봇을 장기 구축한 세계적 연구 리더'. talking point '메타 합류 배경과 역할' → 'Meta Robotics Studio 합류 배경과 로봇 R&D 총괄 역할'.",
    "- 학력의 전공명도 반드시 1줄에 맞춘다. 예: Aeronautical and Astronautical Engineering → '항공우주공학', Computer Science → 'CS' 또는 '컴퓨터과학', Mechanical Engineering → 'ME' 또는 '기계공학'.",
    "- 학교/기관: Massachusetts Institute of Technology→MIT, Stanford University→Stanford, The Ohio State University→Ohio State, 서울대학교→서울대.",
    "- 직급/직책: Chief Executive Officer→CEO, Chief Operating Officer→COO, Vice President→VP, Senior→Sr..",
    "- 경력 회사명이 길면 줄인다: Boston Dynamics→BD社, Honeywell FM&T→Honeywell社 등. 표 안에서 1줄을 넘기지 않도록 회사명·직책을 과감히 축약한다.",
    "- 위 예시 외에도 통용되는 약어/축약이 있으면 스스로 판단해 적극 적용한다. 축약이 자동화 효용의 핵심이다.",
    "",
    "[문장 작성]",
    "- 한국어 개조식(명사형 종결): '~ 전문가', '~ 보유', '~ 다수', '~ 中' 등으로 끝맺는다.",
    "- headline(-)/bullet(·)/talking point 문구 맨 앞에 '-','·' 같은 기호를 넣지 않는다(기호는 시스템이 붙인다).",
    "- 밑줄기호나 마크다운 강조(_,*)를 넣지 않는다. 순수 텍스트만.",
    "- 자료·검색으로 확인되지 않는 사실은 만들지 않는다. 모르는 값은 빈 문자열/빈 배열.",
    "",
    "[학력 표기]",
    "- education 배열은 학위 1개당 항목 1개로 분리한다. 같은 학교에서 석사·박사를 모두 받았어도 반드시 별도 항목 2개로 나눈다.",
    "- 각 항목의 degree는 반드시 학위 한 글자만: 學(학사)/碩(석사)/博(박사). '碩博'처럼 두 글자를 한 항목에 합치지 않는다.",
    "",
    "[경력 표기]",
    "- 같은 기관에서 직급/직책만 바뀌며 재직한 경우(예: 조교수→부교수→교수) 여러 줄로 쪼개지 말고 '한 줄로 통합'한다. 직책은 '최종(최상위) 직책' 하나만, 기간은 전체 기간(가장 이른 시작 ~ 가장 최근 종료)으로 표기한다.",
    "- 학위 취득 과정(박사과정/석사과정/PhD Candidate/대학원 재학 등)은 '경력이 아니라 학력'이다. career에 넣지 말고 education으로만 표기한다. (Post-doc 등 연구직은 경력으로 인정)",
    "- career 항목은 핵심 위주로 간결하게. 1장을 넘기지 않도록 필요 시 오래된·비핵심 경력은 생략한다.",
    "",
    "[표기 관례]",
    "- 국가 약어 美/韓/英/中/日 을 경력 org 앞 country에, 회사는 '社', 현재는 '現', 진행 중은 '中', 등은 '等', 내부는 '內'.",
    "- 본문(headline/bullet/talking point) 속 연도는 '\\'09年', '\\'25年'처럼 두 자리+年으로, 잡지는 'Time誌'처럼 誌를 쓴다.",
    "- career.period 예: \"'20~ 現\", \"'18~'24\". education.year는 졸업연도 2자리(예: '15').",
    "- birthYear: 웹 검색으로 인물의 출생연도(4자리, 예: '1976')를 최대한 찾아서 채운다. 표에 'YY년생, NN세'가 표기되므로 중요하다. 정말로 확인 불가할 때만 빈 문자열로 두면 시스템이 '출생연도·나이 미확인'으로 표기한다(추정 금지). 나이·birthLine은 시스템이 자동 계산하므로 비워도 됨.",
    "",
    "[각주(note/notes) 규칙]",
    "- 각주는 본문 옆에 회색 작은 글씨(텍스트 상자)로 떠서 붙는 '짧은 보조 태그'다. 두 종류로 쓴다:",
    "  (1) 경력 각주(career.note): 그 경력에서의 '핵심 역할/조직/상태'를 8~16자로 압축. 예: 'Reality Lab R&D 총괄 역할', 'Biomimetic Robotics Lab 리딩 (現 휴직 中)'.",
    "  (2) 불릿 각주(bullets.notes): 문장을 뒷받침하는 '기관명·지표·약어' 태그. 예: 'Biomimetic Robotics Lab', 'h-index 60', 'VLA = Vision-Language-Action'.",
    "- 각주는 짧은 명사구로만. 완결 문장·중복 설명 금지, 한 각주당 20자 이내 권장.",
    "- 출처 표기는 각주에 절대 넣지 않는다: 'LinkedIn 기준', '보도자료 기반', '공식 프로필', '게시물 기준' 같은 출처·근거 문구 금지.",
    "- 덧붙일 역할/기관/지표가 없으면 각주는 비운다.",
    "",
    "[출처 메모(source)]",
    "- education/career/각 bullet의 source에는 그 사실의 출처를 넣는다. 이 값은 Word '검토 메모(코멘트)'로 문서에 삽입되며, 확인일은 시스템이 자동 기록한다.",
    "- source.name: 출처 라벨(예: 'MIT 공식 프로필','회사 보도자료','OO 홈페이지 약력'). source.url: 실제로 확인한 링크만 넣고, 없거나 불확실하면 빈 문자열. URL을 지어내지 않는다.",
    "- 언론 1건에만 근거한 성과는 source.name에 그 범위를 드러낸다(예: 'ㅇㅇ일보 기사 1건'). 출처를 특정하지 못하면 source는 빈 값({name:'', url:''})으로 둔다.",
    "- 출처는 본문(headline/bullet/표)에 절대 쓰지 말고 source에만 담는다.",
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

// ---- Length enforcement ----------------------------------------------
// Headlines / talking points must nearly fill ONE line; · bullets should fill
// TWO. Prompting alone is unreliable, so anything shorter than its threshold is
// expanded in one follow-up call using the same source material (no fabrication).
const MIN_HEAD = 30; // headline / talking point: one full line (~32-40 chars)
const MIN_BULLET = 44; // · bullet: two lines (~46-64 chars)

function visLen(s) {
  let n = 0;
  for (const ch of String(s == null ? "" : s)) n += ch.charCodeAt(0) < 128 ? 0.5 : 1;
  return n;
}

function collectShort(candidate) {
  const items = [];
  (candidate.competencies || []).forEach((blk, bi) => {
    if (blk && String(blk.headline || "").trim() && visLen(blk.headline) < MIN_HEAD) items.push({ key: "h:" + bi, text: blk.headline });
    (blk && blk.bullets ? blk.bullets : []).forEach((b, ui) => {
      const t = typeof b === "string" ? b : b && b.text;
      if (t && visLen(t) < MIN_BULLET) items.push({ key: "b:" + bi + ":" + ui, text: t });
    });
  });
  (candidate.talkingPoints || []).forEach((t, i) => {
    if (t && visLen(t) < MIN_HEAD) items.push({ key: "t:" + i, text: t });
  });
  return items;
}

function applyExpansions(candidate, map) {
  (candidate.competencies || []).forEach((blk, bi) => {
    if (map["h:" + bi]) blk.headline = map["h:" + bi];
    (blk && blk.bullets ? blk.bullets : []).forEach((b, ui) => {
      const k = "b:" + bi + ":" + ui;
      if (!map[k]) return;
      if (typeof b === "string") blk.bullets[ui] = map[k];
      else b.text = map[k];
    });
  });
  (candidate.talkingPoints || []).forEach((t, i) => {
    if (map["t:" + i]) candidate.talkingPoints[i] = map["t:" + i];
  });
}

const EXPAND_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["key", "text"],
        properties: { key: { type: "string" }, text: { type: "string" } }
      }
    }
  }
};

async function expandShortSentences(candidate, input) {
  const short = collectShort(candidate);
  if (!short.length) return;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return;
  const model = process.env.OPENAI_PROFILE_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "다음 각 문구는 보고서 한 칸을 채우기엔 너무 짧다. key 접두어에 따라 목표 길이가 다르니 그에 맞춰 더 구체적이고 풍부하게 늘려라.",
    "- key가 'h:'(headline) 또는 't:'(talking point)이면: 공백 포함 한글 32~40자(한 줄을 꽉 채움). 42자를 넘기지 않는다.",
    "- key가 'b:'(bullet)이면: 공백 포함 한글 46~64자(두 줄 분량). 한 줄로 끝날 만큼 짧게 쓰지 않는다.",
    "- 제공 자료(LinkedIn/뉴스/메모)에 근거한 구체 정보(기관·직책·기술·성과·맥락)를 덧붙여 늘린다. 없는 사실은 절대 지어내지 않는다.",
    "- 한국어 개조식 명사형 종결 유지. 기호(-,·,_,*) 없이 순수 텍스트.",
    "- key는 그대로 두고 text만 늘려, 입력과 동일 개수·동일 key로 반환한다.",
    "",
    "[자료]",
    "LinkedIn: " + JSON.stringify(input.linkedinProfile || null),
    "메모/뉴스: " + String(input.sourcesText || "").slice(0, 8000),
    "",
    "[늘릴 문구]",
    JSON.stringify(short)
  ].join("\n");
  const body = {
    model,
    input: [
      { role: "system", content: "You expand short Korean report sentences to fill one line using only the provided facts. Return schema-valid JSON." },
      { role: "user", content: prompt }
    ],
    text: { format: { type: "json_schema", name: "expanded_sentences", schema: EXPAND_SCHEMA, strict: true } }
  };
  if (modelSupportsTemperature(model)) body.temperature = 0.3;
  try {
    const r = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) return;
    const out = extractOutputText(JSON.parse(await r.text()));
    if (!out) return;
    const map = {};
    (JSON.parse(out).items || []).forEach((it) => {
      if (it && it.key && it.text) map[it.key] = String(it.text).replace(/[_*]/g, "").trim();
    });
    applyExpansions(candidate, map);
  } catch (error) {
    // best-effort: keep the original text if expansion fails
  }
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

    // Enforce the minimum one-line density by expanding any short sentences.
    await expandShortSentences(candidate, { linkedinProfile: body.linkedinProfile, sourcesText: body.sourcesText });

    sendJson(response, 200, { ok: true, format, candidate });
  } catch (error) {
    console.warn("Profile structuring failed.", error);
    sendJson(response, 500, { ok: false, error: error.message || "Profile structuring failed" });
  }
};
