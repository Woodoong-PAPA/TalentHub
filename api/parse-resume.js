const MAX_TEXT_LENGTH = 60000;

const RESUME_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["name", "company", "role", "coreCompetency", "achievementSummary", "birthYear", "email", "phone", "linkedinUrl", "referenceUrl", "referenceUrls", "skills", "education", "career", "warnings"],
  properties: {
    name: { type: "string" },
    company: { type: "string" },
    role: { type: "string" },
    coreCompetency: { type: "string" },
    achievementSummary: {
      type: "array",
      items: { type: "string" }
    },
    birthYear: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    linkedinUrl: { type: "string" },
    referenceUrl: { type: "string" },
    referenceUrls: {
      type: "array",
      items: { type: "string" }
    },
    skills: {
      type: "array",
      items: { type: "string" }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["degree", "school", "major", "start", "end"],
        properties: {
          degree: { type: "string", enum: ["", "박사", "석사", "학사"] },
          school: { type: "string" },
          major: { type: "string" },
          start: { type: "string" },
          end: { type: "string" }
        }
      }
    },
    career: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["country", "company", "rank", "position", "start", "end", "achievements"],
        properties: {
          country: { type: "string" },
          company: { type: "string" },
          rank: { type: "string" },
          position: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          achievements: { type: "string" }
        }
      }
    },
    warnings: {
      type: "array",
      items: { type: "string" }
    }
  }
};

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 2_000_000) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function modelSupportsTemperature(model) {
  return !/^gpt-5(?:[.\-]|$)/i.test(String(model || ""));
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

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeDate(value) {
  const text = normalizeString(value);

  if (!text || text === "0") {
    return "";
  }

  if (/현재|재직|present|current/i.test(text)) {
    return "현재";
  }

  const monthMatch = text.match(/(\d{4})[.\-\/년\s]+(\d{1,2})/);

  if (monthMatch) {
    return `${monthMatch[1]}-${monthMatch[2].padStart(2, "0")}`;
  }

  const yearMatch = text.match(/\b(\d{4})\b/);
  return yearMatch ? yearMatch[1] : "";
}

function recentSortValue(record) {
  const end = normalizeDate(record.end);
  const start = normalizeDate(record.start);
  const value = end === "현재" ? "9999-12" : end || start || "";
  const normalized = value.length === 4 ? `${value}-00` : value;

  return normalized || "0000-00";
}

function uniqueTextParts(parts) {
  return [...new Set(parts.map(normalizeString).filter(Boolean))];
}

function looksLikeCareerRank(value) {
  return /(?:CL\d|사원|주임|대리|과장|차장|부장|이사|상무|전무|부사장|사장|대표|대표이사|회장|의장|고문|창업자|교수|원장|연구원|연구위원|선임|책임|수석|전임|Staff|Senior|Sr\.?|Principal|Lead|Manager|Director|VP|CEO|CTO|CFO|COO|Founder|Engineer|Developer|Designer|Researcher|Scientist|Architect|PM|PO|팀장|파트장|그룹장|실장|센터장|본부장|부문장|Lab장|랩장|리더|Head)/i.test(normalizeString(value));
}

function looksLikeCareerDepartment(value) {
  const text = normalizeString(value);

  if (!text || looksLikeCareerRank(text)) {
    return false;
  }

  return /(?:팀|그룹|센터|실|본부|부문|사업부|연구소|연구실|랩|Lab|Laboratory|Department|Division|Office|Unit|TF|조직|파트|Chapter|Squad|Cell|Tribe)/i.test(text);
}

function normalizeCareerRoleFields(rank, position) {
  const rankParts = [];
  const positionParts = [];

  [rank, position]
    .flatMap((value) => String(value || "").split(/\s*,\s*/))
    .map(normalizeString)
    .filter(Boolean)
    .forEach((value) => {
      if (looksLikeCareerDepartment(value)) {
        positionParts.push(value);
      } else if (looksLikeCareerRank(value)) {
        rankParts.push(value);
      } else if (!rankParts.length) {
        rankParts.push(value);
      } else {
        positionParts.push(value);
      }
    });

  return {
    rank: uniqueTextParts(rankParts).join(", "),
    position: uniqueTextParts(positionParts).join(", ")
  };
}

function normalizeResult(result) {
  const education = Array.isArray(result.education)
    ? result.education
      .map((item) => ({
        degree: ["박사", "석사", "학사"].includes(normalizeString(item.degree)) ? normalizeString(item.degree) : "",
        school: normalizeString(item.school),
        major: normalizeString(item.major),
        start: normalizeDate(item.start),
        end: normalizeDate(item.end)
      }))
      .filter((item) => item.degree || item.school || item.major || item.start || item.end)
      .sort((a, b) => recentSortValue(b).localeCompare(recentSortValue(a)))
    : [];
  const career = Array.isArray(result.career)
    ? result.career
      .map((item) => {
        const roleFields = normalizeCareerRoleFields(item.rank, item.position || item.department || item.title);

        return {
          country: normalizeString(item.country),
          company: normalizeString(item.company),
          rank: roleFields.rank,
          position: roleFields.position,
          start: normalizeDate(item.start),
          end: normalizeDate(item.end),
          achievements: normalizeString(item.achievements)
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean)
            .join("\n")
        };
      })
      .filter((item) => item.country || item.company || item.rank || item.position || item.start || item.end || item.achievements)
      .sort((a, b) => recentSortValue(b).localeCompare(recentSortValue(a)))
    : [];

  return {
    name: normalizeString(result.name),
    company: normalizeString(result.company || career[0]?.company),
    role: normalizeString(result.role || career[0]?.rank || career[0]?.position),
    coreCompetency: normalizeString(result.coreCompetency),
    achievementSummary: Array.isArray(result.achievementSummary)
      ? result.achievementSummary.map(normalizeString).filter(Boolean).slice(0, 3)
      : [],
    birthYear: normalizeString(result.birthYear).match(/\b(19\d{2}|20\d{2})\b/)?.[1] || "",
    email: normalizeString(result.email),
    phone: normalizeString(result.phone),
    linkedinUrl: normalizeString(result.linkedinUrl),
    referenceUrl: normalizeString(result.referenceUrl),
    referenceUrls: Array.isArray(result.referenceUrls)
      ? [...new Set(result.referenceUrls.map(normalizeString).filter(Boolean))].slice(0, 3)
      : [normalizeString(result.referenceUrl)].filter(Boolean),
    skills: Array.isArray(result.skills)
      ? [...new Set(result.skills.map(normalizeString).filter(Boolean))].slice(0, 12)
      : [],
    summary: "",
    education,
    career,
    warnings: Array.isArray(result.warnings) ? result.warnings.map(normalizeString).filter(Boolean) : []
  };
}

function mergeParsedResult(primary, fallback) {
  const normalizedPrimary = normalizeResult(primary || {});
  const normalizedFallback = normalizeResult(fallback || {});
  const career = normalizedPrimary.career.length ? normalizedPrimary.career : normalizedFallback.career;
  const mergedCareer = career.map((item) => {
    const fallbackItem = findMatchingCareer(item, normalizedFallback.career);

    return {
      ...item,
      country: fallbackItem?.country || item.country,
      rank: item.rank || fallbackItem?.rank || "",
      position: item.position || fallbackItem?.position || "",
      achievements: item.achievements || fallbackItem?.achievements || ""
    };
  });

  return {
    ...normalizedPrimary,
    name: normalizedPrimary.name || normalizedFallback.name,
    company: normalizedPrimary.company || normalizedFallback.company,
    role: normalizedPrimary.role || normalizedFallback.role,
    coreCompetency: normalizedPrimary.coreCompetency || normalizedFallback.coreCompetency,
    achievementSummary: normalizedPrimary.achievementSummary.length ? normalizedPrimary.achievementSummary : normalizedFallback.achievementSummary,
    birthYear: normalizedPrimary.birthYear || normalizedFallback.birthYear,
    email: normalizedPrimary.email || normalizedFallback.email,
    phone: normalizedPrimary.phone || normalizedFallback.phone,
    linkedinUrl: normalizedPrimary.linkedinUrl || normalizedFallback.linkedinUrl,
    referenceUrl: normalizedPrimary.referenceUrl || normalizedFallback.referenceUrl,
    referenceUrls: normalizedPrimary.referenceUrls.length ? normalizedPrimary.referenceUrls : normalizedFallback.referenceUrls,
    skills: normalizedPrimary.skills.length ? normalizedPrimary.skills : normalizedFallback.skills,
    education: normalizedPrimary.education.length ? normalizedPrimary.education : normalizedFallback.education,
    career: mergedCareer,
    warnings: [...normalizedPrimary.warnings, ...normalizedFallback.warnings]
  };
}

function companyKey(value) {
  return normalizeString(value).toLowerCase();
}

function findMatchingCareer(record, records) {
  const recordCompany = companyKey(record.company);
  const recordPosition = companyKey(record.position);

  return records.find((item) =>
    (recordCompany && companyKey(item.company) === recordCompany) ||
    (recordPosition && companyKey(item.position) === recordPosition)
  );
}

async function enrichCareerCountriesWithWeb(parsed) {
  const missingCompanies = [...new Set((parsed.career || [])
    .filter((item) => item.company && !item.country)
    .map((item) => item.company))];

  if (!missingCompanies.length || !process.env.OPENAI_API_KEY) {
    return { parsed, enriched: false };
  }

  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["companies"],
    properties: {
      companies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["company", "country"],
          properties: {
            company: { type: "string" },
            country: { type: "string" }
          }
        }
      }
    }
  };
  const requestBody = {
    model: process.env.OPENAI_RESUME_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: "Find the headquarters or primary operating country for each company. Return schema-valid JSON only."
      },
      {
        role: "user",
        content: `회사 목록의 소재 국가를 확인해라. 확실하지 않으면 country를 빈 문자열로 둬라.\n${missingCompanies.map((company) => `- ${company}`).join("\n")}`
      }
    ],
    tools: [{ type: "web_search" }],
    tool_choice: "auto",
    text: {
      format: {
        type: "json_schema",
        name: "company_country_result",
        schema,
        strict: true
      }
    }
  };
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`OpenAI company country lookup failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const outputText = extractOutputText(JSON.parse(responseText));
  const lookup = JSON.parse(outputText);
  const countryByCompany = new Map((lookup.companies || [])
    .map((item) => [companyKey(item.company), normalizeString(item.country)]));

  return {
    enriched: true,
    parsed: {
      ...parsed,
      career: parsed.career.map((item) => ({
        ...item,
        country: item.country || countryByCompany.get(companyKey(item.company)) || ""
      }))
    }
  };
}

async function callOpenAI({ text, fileName, deterministic, useWebSearch }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_RESUME_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "업로드된 이력서 텍스트를 삼성전자 채용담당자의 인재 등록 폼에 맞게 구조화해라.",
    "",
    "추출 규칙:",
    "- 이름, 학력, 경력처럼 텍스트에 명시된 정보는 반드시 누락하지 않는다.",
    "- 문서 첫 줄 또는 상단에 한글 2~5자 단독 이름이 있으면 이름으로 사용한다.",
    "- 이름: 한글 이름과 영어 이름이 모두 있으면 한글 이름을 사용한다.",
    "- 출생년도: 생년월일 또는 출생년도 정보가 있으면 YYYY만 추출한다. 없으면 빈 문자열.",
    "- 이메일 주소, 휴대폰 번호, 링크드인 주소, 기타 참고 URL이 있으면 그대로 추출한다. 없으면 빈 문자열.",
    "- 기타 참고 URL은 GitHub, 포트폴리오, 개인 홈페이지, 논문/프로젝트 URL 등 링크드인 외 참고 URL 중 유용한 URL을 최대 3개까지 referenceUrls에 넣고, 가장 유용한 1개는 referenceUrl에도 넣는다.",
    "- 현재/최근회사: 현재 또는 가장 최근까지 다녔던 직장의 회사명.",
    "- 현재/최근직무: 현재 또는 가장 최근 직장에서 맡은 직무명. 지원 직무가 아니라 실제 경력상의 직무를 우선한다.",
    "- coreCompetency: 이 사람이 어떠한 전문가인지 20자 내외의 1줄 문구로 작성한다. 예: 온디바이스 AI 전문가, 휴머노이드 제어 전문가.",
    "- achievementSummary: 주요성과/실적을 정확히 3줄로 요약한다. 각 줄은 한 문장, 20자 내외로 작성한다.",
    "- skills: 핵심기술/툴/도메인 키워드만 배열로 정리한다. 주요성과/실적 문장은 skills에 넣지 않는다.",
    "- career.rank: 직급/직책/역할만 입력한다. 예: CL4, 책임, 선임연구원, 팀장, Manager, Engineer.",
    "- career.position: 소속부서/조직명만 입력한다. 예: 개발팀, 상품기획그룹, AI연구소, MX사업부.",
    "- 팀장, 파트장, 그룹장, Lab장, Head, Lead는 부서명이 아니라 직책이므로 career.rank에 넣는다.",
    "- 학력: 고등학교는 제외한다. 박사, 석사, 학사만 사용한다. 여러 개면 최근 학력부터 정렬한다.",
    "- 경력: 여러 개면 최근 경력부터 정렬한다.",
    "- 직장소재국가: 이력서에 있으면 그대로 쓰고, 없으면 가능한 경우 웹 검색으로 회사 소재 국가를 보강한다. 불확실하면 빈 문자열.",
    "- 날짜: YYYY-MM을 우선하고, 월 정보가 없으면 YYYY만 쓴다. 정보가 없으면 빈 문자열. 현재 재직은 end를 현재로 쓴다.",
    "- 주요성과/실적: 이력서에 실제 표기된 수행업무, 성과, 실적만 간결히 요약하고 여러 내용은 줄바꿈으로 나눈다.",
    "- 담당자 메모는 채우지 않는다. summary는 항상 빈 문자열로 둘 것이다.",
    "- 이력서 텍스트에 없는 정보는 추측하지 않는다. 단, 직장소재국가만 웹 검색으로 보강 가능하다.",
    "- JSON schema에 맞는 값만 반환한다.",
    "",
    `파일명: ${fileName || ""}`,
    "",
    "브라우저 1차 파서 결과:",
    JSON.stringify(deterministic || {}, null, 2),
    "",
    "이력서 텍스트:",
    text.slice(0, MAX_TEXT_LENGTH)
  ].join("\n");
  const requestBody = {
    model,
    input: [
      {
        role: "system",
        content: "You are a precise Korean resume information extraction engine. Return only schema-valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "resume_parse_result",
        schema: RESUME_SCHEMA,
        strict: true
      }
    }
  };

  if (modelSupportsTemperature(model)) {
    requestBody.temperature = 0;
  }

  if (useWebSearch) {
    requestBody.tools = [{ type: "web_search" }];
    requestBody.tool_choice = "auto";
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`OpenAI response failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const responseJson = JSON.parse(responseText);
  const outputText = extractOutputText(responseJson);

  if (!outputText) {
    throw new Error("OpenAI response did not include structured text");
  }

  return normalizeResult(JSON.parse(outputText));
}

module.exports = async function parseResume(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request));
    const text = normalizeString(body.text);

    if (!text) {
      sendJson(response, 400, { ok: false, error: "Resume text is required" });
      return;
    }

    try {
      const aiParsed = await callOpenAI({
        text,
        fileName: normalizeString(body.fileName),
        deterministic: body.deterministic || null,
        useWebSearch: false
      });
      const parsed = mergeParsedResult(aiParsed, body.deterministic || {});

      try {
        const enriched = await enrichCareerCountriesWithWeb(parsed);
        sendJson(response, 200, {
          ok: true,
          source: enriched.enriched ? "openai-web" : "openai",
          parsed: enriched.parsed
        });
      } catch (webError) {
        console.warn("OpenAI company country enrichment failed.", webError);
        sendJson(response, 200, { ok: true, source: "openai", parsed, warning: "web_search_failed" });
      }
    } catch (aiError) {
      console.warn("OpenAI resume parsing failed.", aiError);
      const parsed = mergeParsedResult(body.deterministic || {}, {});
      sendJson(response, 200, { ok: true, source: "browser-fallback", parsed, warning: "openai_failed" });
    }
  } catch (error) {
    console.error("Resume parse API failed.", error);
    sendJson(response, 200, {
      ok: false,
      error: "AI 구조화에 실패했습니다. 브라우저 기본 파서 결과를 사용합니다."
    });
  }
};
