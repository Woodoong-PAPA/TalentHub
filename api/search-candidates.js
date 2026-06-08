const MAX_CANDIDATES = 30;

const SEARCH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["results"],
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "score", "reasons"],
        properties: {
          id: { type: "string" },
          score: { type: "number" },
          reasons: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    }
  }
};

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_500_000) {
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

function compactCandidate(candidate) {
  return {
    id: String(candidate.id || ""),
    name: String(candidate.name || ""),
    company: String(candidate.company || ""),
    role: String(candidate.role || ""),
    organization: String(candidate.organization || ""),
    years: Number(candidate.years || 0),
    skills: Array.isArray(candidate.skills) ? candidate.skills.slice(0, 12) : [],
    summary: String(candidate.summary || "").slice(0, 900),
    education: Array.isArray(candidate.education) ? candidate.education.slice(0, 4) : [],
    career: Array.isArray(candidate.career)
      ? candidate.career.slice(0, 6).map((item) => ({
        country: item.country || "",
        company: item.company || "",
        rank: item.rank || "",
        position: item.position || "",
        start: item.start || "",
        end: item.end || "",
        achievements: String(item.achievements || "").slice(0, 700)
      }))
      : []
  };
}

function normalizeResults(results, candidateIds) {
  if (!Array.isArray(results)) {
    return [];
  }

  return results
    .map((item) => ({
      id: String(item.id || ""),
      score: Math.max(0, Math.min(100, Math.round(Number(item.score || 0)))),
      reasons: Array.isArray(item.reasons)
        ? item.reasons.map((reason) => String(reason || "").trim()).filter(Boolean).slice(0, 4)
        : []
    }))
    .filter((item) => candidateIds.has(item.id));
}

async function callOpenAI(query, candidates) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_SEARCH_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "Scoring calibration: be conservative. Use 90+ only when almost every core requirement is directly supported by the profile.",
    "Use 80-89 for strong fit, 60-79 for partial fit, 40-59 for weak fit, and below 40 for low relevance.",
    "Do not give 70+ for one or two keyword overlaps unless role, career context, achievements, and required domain also align.",
    "삼성전자 채용담당자의 인재 Pool에서 자연어 조건에 가장 적합한 후보자를 찾아라.",
    "후보자 정보 안에 있는 사실만 사용하고, 민감한 개인 속성은 평가하지 않는다.",
    "요청 조건과 직무/경력/성과/학력/기술의 의미적 관련성을 종합해 0~100점으로 점수화한다.",
    "점수는 상대 순위가 분명히 드러나도록 차등을 둔다.",
    "각 후보자의 추천 근거는 이력서/프로필에 있는 업무, 기술, 성과 중심으로 짧게 작성한다.",
    "",
    `검색 요청: ${query}`,
    "",
    "후보자 목록:",
    JSON.stringify(candidates, null, 2)
  ].join("\n");
  const requestBody = {
    model,
    input: [
      {
        role: "system",
        content: "You are a precise talent search ranking engine. Return only schema-valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "talent_search_results",
        schema: SEARCH_SCHEMA,
        strict: true
      }
    }
  };

  if (modelSupportsTemperature(model)) {
    requestBody.temperature = 0;
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
    throw new Error(`OpenAI search failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const outputText = extractOutputText(JSON.parse(responseText));

  if (!outputText) {
    throw new Error("OpenAI search response did not include structured text");
  }

  return JSON.parse(outputText);
}

module.exports = async function searchCandidates(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request) || "{}");
    const query = String(body.query || "").trim();
    const candidates = Array.isArray(body.candidates)
      ? body.candidates.slice(0, MAX_CANDIDATES).map(compactCandidate).filter((candidate) => candidate.id)
      : [];

    if (!query || !candidates.length) {
      sendJson(response, 400, { ok: false, error: "query and candidates are required" });
      return;
    }

    const candidateIds = new Set(candidates.map((candidate) => candidate.id));
    const ranked = await callOpenAI(query, candidates);
    sendJson(response, 200, {
      ok: true,
      results: normalizeResults(ranked.results, candidateIds)
    });
  } catch (error) {
    console.warn("AI candidate search failed.", error);
    sendJson(response, 500, { ok: false, error: error.message || "AI candidate search failed" });
  }
};
