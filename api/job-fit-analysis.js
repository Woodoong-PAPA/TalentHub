const MAX_RESUMES = 20;
const MAX_JD_CHARS = 16000;
const MAX_RESUME_CHARS = 28000;

const JOB_FIT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["results"],
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "resumeId",
          "score",
          "grade",
          "comment",
          "fulfilledDetails",
          "missingDetails",
          "evidence",
          "recommendation"
        ],
        properties: {
          resumeId: { type: "string" },
          score: { type: "number" },
          grade: { type: "string", enum: ["A", "B", "C", "D", "E"] },
          comment: { type: "string" },
          fulfilledDetails: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["title", "basis"],
              properties: {
                title: { type: "string" },
                basis: { type: "string" }
              }
            }
          },
          missingDetails: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["title", "note"],
              properties: {
                title: { type: "string" },
                note: { type: "string" }
              }
            }
          },
          evidence: {
            type: "array",
            items: { type: "string" }
          },
          recommendation: { type: "string" }
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

function compactRecordList(records, limit) {
  return Array.isArray(records)
    ? records.slice(0, limit).map((record) => ({
      degree: String(record.degree || ""),
      school: String(record.school || ""),
      major: String(record.major || ""),
      affiliation: String(record.affiliation || record.organization || record.department || ""),
      country: String(record.country || ""),
      company: String(record.company || ""),
      rank: String(record.rank || ""),
      position: String(record.position || record.department || record.organization || record.team || record.division || ""),
      start: String(record.start || ""),
      end: String(record.end || ""),
      achievements: String(record.achievements || "").slice(0, 900)
    }))
    : [];
}

function compactResume(resume) {
  const id = String(resume.id || resume.resumeId || "").trim();
  const text = String(resume.text || "").slice(0, MAX_RESUME_CHARS);

  if (!id || !text) {
    return null;
  }

  return {
    id,
    candidateName: String(resume.candidateName || "").trim(),
    source: String(resume.source || "").trim(),
    candidateId: String(resume.candidateId || resume.candidate_id || "").trim(),
    education: compactRecordList(resume.education, 5),
    career: compactRecordList(resume.career, 8),
    text
  };
}

function gradeFromScore(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "E";
}

function normalizeResults(results, resumeIds) {
  if (!Array.isArray(results)) {
    return [];
  }

  return results
    .map((item) => {
      const score = Math.max(0, Math.min(100, Math.round(Number(item.score || 0))));

      return {
        resumeId: String(item.resumeId || "").trim(),
        score,
        grade: gradeFromScore(score),
        comment: sanitizeJobFitComment(String(item.comment || "").trim()),
        fulfilledDetails: Array.isArray(item.fulfilledDetails)
          ? item.fulfilledDetails.map((detail) => ({
            title: String(detail.title || "").trim(),
            basis: String(detail.basis || "").trim()
          })).filter((detail) => detail.title).slice(0, 8)
          : [],
        missingDetails: Array.isArray(item.missingDetails)
          ? item.missingDetails.map((detail) => ({
            title: String(detail.title || "").trim(),
            note: String(detail.note || "").trim()
          })).filter((detail) => detail.title).slice(0, 8)
          : [],
        evidence: Array.isArray(item.evidence)
          ? item.evidence.map((text) => String(text || "").trim()).filter(Boolean).slice(0, 5)
          : [],
        recommendation: ""
      };
    })
    .filter((item) => resumeIds.has(item.resumeId));
}

function sanitizeJobFitComment(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();

  if (!text) {
    return "";
  }

  return text
    .replace(/[^.!?。！？]*(?:합격|불합격|다음 단계|진행하|진행해야|면접|인터뷰|질문 구성|추가 자료|우선 검토|검토 대상|채용 액션)[^.!?。！？]*(?:[.!?。！？]|$)/g, "")
    .trim();
}

async function callOpenAI(jdText, resumes) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_JOB_FIT_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "삼성전자 채용담당자가 업로드한 직무기술서와 여러 이력서를 비교해 직무적합도를 평가하라.",
    "단순 키워드 매칭이 아니라 역할, 도메인, 경력 수준, 성과, 학력, 직무 전환 가능성을 종합해 판단한다.",
    "후보자 이력서에 없는 사실은 만들지 않는다. 불확실한 항목은 missingDetails에 추가 확인 필요로 정리한다.",
    "fulfilledDetails는 JD 요구 중 충족되는 항목과, 이력서의 어떤 경력/성과/학력 맥락을 근거로 충족 판단했는지 작성한다.",
    "missingDetails는 JD 요구 중 이력서에서 직접 입증되지 않는 항목과 추가 확인이 필요한 이유를 작성한다.",
    "comment는 후보자가 해당 포지션에 적합한지 여부만 설명하는 종합 검토 의견으로 450~550자 분량 작성한다.",
    "comment에는 후보자명, 핵심 충족 근거, 부족하거나 불확실한 부분, 포지션과의 종합 적합성 판단을 자연스럽게 포함한다.",
    "comment와 recommendation에는 다음 단계를 진행하라, 합격시키라, 인터뷰를 하라, 추가 자료를 받아라 같은 직접적인 채용 액션 지시를 쓰지 않는다.",
    "recommendation은 빈 문자열로 반환한다.",
    "source가 pool인 항목은 Talent Pool에 저장된 구조화 프로필이다. education과 career 배열의 값을 이력서 텍스트보다 우선해 근거로 활용한다.",
    "학력은 degree, school, major, affiliation, start, end를 함께 보고 판단하고, 경력은 company, rank, position, start, end, achievements를 함께 보고 판단한다.",
    "점수는 0~100으로 산정하고 등급은 A 90점 이상, B 80점 이상, C 60점 이상, D 40점 이상, E 40점 미만 기준으로 부여한다. 결과는 적합도 높은 순서로 반환한다.",
    "",
    "직무기술서:",
    jdText,
    "",
    "이력서 목록:",
    JSON.stringify(resumes, null, 2)
  ].join("\n");
  const requestBody = {
    model,
    input: [
      {
        role: "system",
        content: "You are a rigorous HR job-fit evaluator. Return only schema-valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "job_fit_analysis_results",
        schema: JOB_FIT_SCHEMA,
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
    throw new Error(`OpenAI job fit analysis failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const outputText = extractOutputText(JSON.parse(responseText));

  if (!outputText) {
    throw new Error("OpenAI job fit response did not include structured text");
  }

  return JSON.parse(outputText);
}

module.exports = async function jobFitAnalysis(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request) || "{}");
    const jdText = String(body.jdText || "").trim().slice(0, MAX_JD_CHARS);
    const resumes = Array.isArray(body.resumes)
      ? body.resumes.slice(0, MAX_RESUMES).map(compactResume).filter(Boolean)
      : [];

    if (!jdText || !resumes.length) {
      sendJson(response, 400, { ok: false, error: "jdText and resumes are required" });
      return;
    }

    const resumeIds = new Set(resumes.map((resume) => resume.id));
    const result = await callOpenAI(jdText, resumes);
    const results = normalizeResults(result.results, resumeIds);

    if (!results.length) {
      throw new Error("Job fit analysis response did not include usable results");
    }

    sendJson(response, 200, { ok: true, results });
  } catch (error) {
    console.warn("Job fit analysis failed.", error);
    sendJson(response, 500, { ok: false, error: error.message || "Job fit analysis failed" });
  }
};
