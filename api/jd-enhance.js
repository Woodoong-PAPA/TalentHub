const MAX_JD_CHARS = 22000;
const MAX_GUIDELINE_CHARS = 14000;
const interviewReport = require("../lib/interview-report.js");

const JD_ENHANCEMENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["score", "summary", "revisedDocument", "items"],
  properties: {
    score: { type: "number" },
    summary: { type: "string" },
    revisedDocument: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "section", "title", "status", "issue", "originalText", "suggestedText", "rationale"],
        properties: {
          id: { type: "string" },
          section: { type: "string" },
          title: { type: "string" },
          status: { type: "string", enum: ["pass", "needs_revision", "missing"] },
          issue: { type: "string" },
          originalText: { type: "string" },
          suggestedText: { type: "string" },
          rationale: { type: "string" }
        }
      }
    }
  }
};

function loadLocalEnv() {
  if (process.env.OPENAI_API_KEY) {
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
    console.warn("Local env could not be loaded.", error.message);
  }
}

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

function normalizeText(value) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeItem(item = {}, index = 0) {
  const status = ["pass", "needs_revision", "missing"].includes(item.status) ? item.status : "needs_revision";

  return {
    id: String(item.id || `jd-review-${index + 1}`),
    section: String(item.section || "공통").trim(),
    title: String(item.title || "검토 항목").trim(),
    status,
    issue: String(item.issue || "").trim(),
    originalText: normalizeText(item.originalText || ""),
    suggestedText: normalizeText(item.suggestedText || ""),
    rationale: String(item.rationale || "").trim()
  };
}

function normalizeResult(result = {}, jdText = "") {
  const items = Array.isArray(result.items)
    ? result.items.map(normalizeItem).filter((item) => item.title).slice(0, 16)
    : [];
  const rawScore = Number(result.score || 0);
  const score = Math.max(0, Math.min(100, Math.round(Number.isFinite(rawScore) ? rawScore : 0)));

  return {
    score,
    summary: String(result.summary || "").trim(),
    revisedDocument: normalizeText(result.revisedDocument || jdText),
    items
  };
}

async function callOpenAI({ jdText, guidelineText, fileName }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_JD_ENHANCE_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "당신은 삼성전자 DX부문 채용 담당자를 돕는 JD 작성 품질 검수 전문가입니다.",
    "현업 담당자가 작성한 JD를 최신 JD 작성 가이드라인과 비교해 점검합니다.",
    "단순 맞춤법 교정보다 직무 목적, 수행업무, 필수/우대요건, 필요역량, 운영정보, 차별/모호 표현을 종합 검토합니다.",
    "문제가 없는 항목은 pass, 수정이 필요한 항목은 needs_revision, 빠진 항목은 missing으로 표시합니다.",
    "수정 제안은 채용 담당자가 바로 적용할 수 있는 간결한 보고서형 문구로 작성합니다.",
    "originalText는 JD 원문에 실제로 문제가 되는 문구가 있을 때만 발췌합니다. 누락 항목이면 빈 문자열로 둡니다.",
    "suggestedText는 채용 담당자가 확인 후 바로 반영 가능한 문구로 작성합니다.",
    "revisedDocument는 모든 제안을 반영한 최종 JD 초안으로 작성합니다.",
    "차별 소지가 있는 표현, 과도하게 넓은 요구사항, 검증 불가능한 표현, 중복 표현은 반드시 지적합니다.",
    "확인되지 않은 회사 내부 사실은 만들지 말고, JD 원문과 가이드라인에 근거해 작성합니다.",
    "",
    `파일명: ${fileName || "JD"}`,
    "",
    "JD 작성 가이드라인:",
    guidelineText,
    "",
    "현업 작성 JD:",
    jdText
  ].join("\n");
  const requestBody = {
    model,
    input: [
      {
        role: "system",
        content: "Return only schema-valid JSON. Write Korean content for all human-readable fields."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "jd_enhancement_review",
        schema: JD_ENHANCEMENT_SCHEMA,
        strict: true
      }
    }
  };

  if (modelSupportsTemperature(model)) {
    requestBody.temperature = 0.15;
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
    throw new Error(`OpenAI JD enhancement failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const outputText = extractOutputText(JSON.parse(responseText));

  if (!outputText) {
    throw new Error("OpenAI JD enhancement response did not include structured text");
  }

  return JSON.parse(outputText);
}

function findLine(text, pattern) {
  return text.split("\n").map((line) => line.trim()).find((line) => pattern.test(line)) || "";
}

function makeItem(index, item) {
  return normalizeItem({
    id: `jd-review-${index}`,
    ...item
  }, index - 1);
}

function buildHeuristicReview(jdText, guidelineText, errorMessage = "") {
  const text = normalizeText(jdText);
  const items = [];
  let index = 1;

  const checks = [
    {
      section: "기본 정보",
      title: "포지션/채용 부서 명확성",
      pattern: /(포지션|직무명|채용\s*부서|소속|조직|사업부|근무지)/i,
      suggestion: "포지션명, 채용 부서/사업부, 근무지를 JD 상단에 명확히 기재"
    },
    {
      section: "직무 목적",
      title: "직무 목적/역할 정의",
      pattern: /(직무\s*목적|역할|mission|purpose|담당\s*역할|채용\s*목적)/i,
      suggestion: "해당 포지션이 조직에서 수행할 핵심 역할과 채용 필요성을 1~2문장으로 작성"
    },
    {
      section: "수행업무",
      title: "수행업무 구체성",
      pattern: /(수행\s*업무|담당\s*업무|주요\s*업무|업무\s*내용|responsibilit)/i,
      suggestion: "실제 담당할 업무를 4~7개 항목으로 나누고 산출물, 협업 대상, 기술 범위를 구체화"
    },
    {
      section: "자격요건",
      title: "필수 자격요건 구분",
      pattern: /(필수|자격\s*요건|required|qualification|지원\s*자격)/i,
      suggestion: "반드시 필요한 경력연차, 기술스택, 학위/전공, 프로젝트 경험을 필수요건으로 분리 작성"
    },
    {
      section: "우대사항",
      title: "우대사항 분리",
      pattern: /(우대|preferred|plus|가점)/i,
      suggestion: "필수요건과 겹치지 않도록 있으면 좋은 경험과 역량을 우대사항으로 별도 작성"
    },
    {
      section: "역량",
      title: "필요역량 명확성",
      pattern: /(필요\s*역량|핵심\s*역량|역량|skill|competenc)/i,
      suggestion: "기술역량, 문제해결, 협업/커뮤니케이션 역량을 검증 가능한 표현으로 구분 작성"
    }
  ];

  checks.forEach((check) => {
    const matchedLine = findLine(text, check.pattern);

    items.push(makeItem(index, {
      section: check.section,
      title: check.title,
      status: matchedLine ? "pass" : "missing",
      issue: matchedLine
        ? "가이드라인에서 요구하는 항목이 JD에 포함되어 있음"
        : "가이드라인에서 요구하는 항목이 JD에서 명확히 확인되지 않음",
      originalText: matchedLine,
      suggestedText: matchedLine ? "" : check.suggestion,
      rationale: "JD 작성 가이드라인의 기본 구성 항목 평가"
    }));
    index += 1;
  });

  const vagueLine = findLine(text, /(우수한|능숙한|열정|적극|원활|뛰어난|전문성|보유자)/);

  if (vagueLine) {
    items.push(makeItem(index, {
      section: "표현 품질",
      title: "모호한 표현 구체화",
      status: "needs_revision",
      issue: "검증 기준이 불명확한 표현이 포함되어 있음",
      originalText: vagueLine,
      suggestedText: vagueLine
        .replace(/우수한/g, "관련 프로젝트에서 검증된")
        .replace(/능숙한/g, "실무 적용 경험이 있는")
        .replace(/열정/g, "문제 해결 과정을 구조화하고 실행할 수 있는")
        .replace(/적극/g, "유관부서 요구사항을 정리하고 합의할 수 있는")
        .replace(/원활/g, "협업 상황에서 이슈를 문서화하고 조율할 수 있는")
        .replace(/뛰어난/g, "성과로 검증된")
        .replace(/전문성/g, "해당 기술 또는 도메인 실무 경험")
        .replace(/보유자/g, "경험 보유자"),
      rationale: "지원자와 평가자가 같은 기준으로 이해할 수 있도록 검증 가능한 표현 필요"
    }));
    index += 1;
  }

  const discriminatoryLine = findLine(text, /(남성|여성|나이|연령|미혼|기혼|군필|외모|용모|신체)/);

  if (discriminatoryLine) {
    items.push(makeItem(index, {
      section: "리스크",
      title: "차별 소지 표현 제거",
      status: "needs_revision",
      issue: "채용 공정성 관점에서 부적절하거나 차별 소지가 있는 표현이 포함되어 있음",
      originalText: discriminatoryLine,
      suggestedText: "직무 수행과 직접 관련 있는 역량, 경험, 자격 기준으로 대체 작성",
      rationale: "성별, 연령, 혼인 여부, 외모 등 직무와 무관한 기준은 JD에서 제외 필요"
    }));
  }

  const issueCount = items.filter((item) => item.status !== "pass").length;
  const score = Math.max(30, 100 - issueCount * 10);
  const suggestedAppendix = items
    .filter((item) => item.status !== "pass" && item.suggestedText)
    .map((item) => `[${item.section}] ${item.title}\n${item.suggestedText}`)
    .join("\n\n");

  return {
    score,
    summary: [
      errorMessage
        ? `AI 점검 연결 문제로 기본 체크리스트 기반 평가를 수행했습니다. (${errorMessage.slice(0, 120)})`
        : "기본 체크리스트 기반 평가 결과입니다.",
      `수정 또는 보완이 필요한 항목 ${issueCount}개가 확인되었습니다.`
    ].join("\n"),
    revisedDocument: suggestedAppendix ? `${text}\n\n[JD 개선 제안]\n${suggestedAppendix}` : text,
    items
  };
}

module.exports = async function jdEnhance(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  if (/[?&]feature=interview-report(?:&|$)/.test(String(request.url || ""))) {
    await interviewReport(request, response);
    return;
  }

  loadLocalEnv();

  try {
    const body = JSON.parse(await readRequestBody(request) || "{}");
    const jdText = normalizeText(body.jdText).slice(0, MAX_JD_CHARS);
    const guidelineText = normalizeText(body.guidelineText).slice(0, MAX_GUIDELINE_CHARS);
    const fileName = String(body.fileName || "").trim();

    if (!jdText || !guidelineText) {
      sendJson(response, 400, { ok: false, error: "jdText and guidelineText are required" });
      return;
    }

    try {
      const result = normalizeResult(await callOpenAI({ jdText, guidelineText, fileName }), jdText);
      sendJson(response, 200, { ok: true, source: "openai", result });
    } catch (error) {
      console.warn("OpenAI JD enhancement failed. Using heuristic fallback.", error.message);
      sendJson(response, 200, {
        ok: true,
        source: "heuristic",
        warning: error.message,
        result: normalizeResult(buildHeuristicReview(jdText, guidelineText, error.message), jdText)
      });
    }
  } catch (error) {
    console.warn("JD enhancement failed.", error);
    sendJson(response, 500, { ok: false, error: error.message || "JD enhancement failed" });
  }
};
