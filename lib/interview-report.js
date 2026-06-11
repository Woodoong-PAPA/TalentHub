const MAX_SCRIPT_CHARS = 120000;
const MAX_TEMPLATE_CHARS = 60000;
const MAX_TEMPLATE_COUNT = 5;
const MAX_CHUNKS = 14;
const CHUNK_CHARS = 9000;

const INTERVIEW_REPORT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["reportText", "executiveSummary", "formatNotes", "riskNotes"],
  properties: {
    reportText: { type: "string" },
    executiveSummary: { type: "string" },
    formatNotes: {
      type: "array",
      items: { type: "string" }
    },
    riskNotes: {
      type: "array",
      items: { type: "string" }
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

      if (body.length > 3_500_000) {
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

function clipText(value, limit) {
  const text = normalizeText(value);

  if (text.length <= limit) {
    return text;
  }

  const headLength = Math.floor(limit * 0.68);
  const tailLength = Math.max(0, limit - headLength - 120);

  return [
    text.slice(0, headLength),
    `[중간 원문 일부 생략: 전체 ${text.length.toLocaleString()}자 중 보고서 작성에 필요한 앞/뒤 구간 우선 제공]`,
    text.slice(-tailLength)
  ].join("\n\n").trim();
}

function splitTextIntoChunks(text, chunkSize = CHUNK_CHARS) {
  const paragraphs = normalizeText(text).split(/\n{2,}/);
  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;

    if (next.length <= chunkSize) {
      current = next;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    if (paragraph.length <= chunkSize) {
      current = paragraph;
      continue;
    }

    for (let index = 0; index < paragraph.length; index += chunkSize) {
      chunks.push(paragraph.slice(index, index + chunkSize));
    }

    current = "";
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.slice(0, MAX_CHUNKS);
}

function compactTemplates(templates) {
  return Array.isArray(templates)
    ? templates
      .map((template, index) => ({
        name: String(template.name || `면담록 샘플 ${index + 1}`).trim(),
        text: clipText(template.text, Math.floor(MAX_TEMPLATE_CHARS / Math.max(1, Math.min(MAX_TEMPLATE_COUNT, templates.length)))),
        profile: template.profile && typeof template.profile === "object" ? template.profile : null
      }))
      .filter((template) => template.text)
      .slice(0, MAX_TEMPLATE_COUNT)
    : [];
}

async function callOpenAI({ scriptText, templates, prompt }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_INTERVIEW_REPORT_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const chunks = splitTextIntoChunks(clipText(scriptText, MAX_SCRIPT_CHARS));
  const templateText = templates.map((template, index) => [
    `### 샘플 ${index + 1}: ${template.name}`,
    template.profile ? `양식 특징: ${JSON.stringify(template.profile)}` : "",
    template.text
  ].filter(Boolean).join("\n")).join("\n\n");
  const scriptPayload = chunks.map((chunk, index) => [
    `### 스크립트 청크 ${index + 1}/${chunks.length}`,
    chunk
  ].join("\n")).join("\n\n");
  const userPrompt = [
    "삼성전자 DX부문 채용 담당자가 C-level 또는 현업 리더에게 공유할 수 있는 면담록 보고서를 작성합니다.",
    "면담 스크립트의 사실 관계만 근거로 삼고, 확인되지 않은 내용은 추정하지 말고 '추가 확인 필요'로 정리합니다.",
    "우수사례 샘플의 문장 길이, 제목 구조, 보고서 톤, 줄바꿈 방식을 참고하되 샘플의 사실 내용은 복사하지 않습니다.",
    "보고서는 Word 문서로 바로 내려받아 사용할 수 있게 제목과 섹션이 명확한 한국어 보고서 형태로 작성합니다.",
    "과도하게 장황한 문장 대신 보고서형 간결체를 사용합니다.",
    "",
    "보고서 작성 프롬프트:",
    normalizeText(prompt) || "면담 핵심 발언, 후보자 강점, 리스크, 추가 확인 필요 사항, 종합 의견 중심으로 정리",
    "",
    "우수사례 샘플:",
    templateText || "제공된 샘플 없음",
    "",
    "면담 스크립트:",
    scriptPayload
  ].join("\n");
  const requestBody = {
    model,
    input: [
      {
        role: "system",
        content: "Return only schema-valid JSON. Write all human-readable fields in Korean."
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "interview_note_report",
        schema: INTERVIEW_REPORT_SCHEMA,
        strict: true
      }
    },
    max_output_tokens: 4500
  };

  if (modelSupportsTemperature(model)) {
    requestBody.temperature = 0.2;
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
    throw new Error(`OpenAI interview report failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const outputText = extractOutputText(JSON.parse(responseText));

  if (!outputText) {
    throw new Error("OpenAI interview report response did not include structured text");
  }

  const parsed = JSON.parse(outputText);

  return {
    model,
    chunkCount: chunks.length,
    reportText: normalizeText(parsed.reportText),
    executiveSummary: normalizeText(parsed.executiveSummary),
    formatNotes: Array.isArray(parsed.formatNotes) ? parsed.formatNotes.map(String).filter(Boolean) : [],
    riskNotes: Array.isArray(parsed.riskNotes) ? parsed.riskNotes.map(String).filter(Boolean) : []
  };
}

function splitReportSentences(text) {
  return normalizeText(text)
    .split(/(?<=[.!?。！？])\s+|\n+/)
    .map((line) => line.replace(/^[-*ㆍ•]\s*/, "").trim())
    .filter(Boolean);
}

function extractTemplateTitles(templates) {
  return templates
    .flatMap((template) => normalizeText(template.text).split("\n"))
    .map((line) => line.trim())
    .filter((line) => line.length >= 2 && line.length <= 36)
    .filter((line) => /^(#+\s*)?(\d+[.)]\s*)?[\w가-힣][\w가-힣\s/·()\[\]-]{1,34}$/.test(line))
    .map((line) => line.replace(/^#+\s*/, ""))
    .filter((line, index, array) => array.indexOf(line) === index)
    .slice(0, 5);
}

function buildFallbackReport({ scriptText, templates, prompt, errorMessage = "" }) {
  const sentences = splitReportSentences(scriptText);
  const titles = extractTemplateTitles(templates);
  const summary = sentences.slice(0, 4);
  const keyPoints = sentences.filter((line) => line.length >= 18).slice(0, 6);
  const followUps = sentences
    .filter((line) => /(확인|검토|리스크|보완|우려|추가|질문|필요|희망|조건|협의)/.test(line))
    .slice(0, 5);
  const sections = [
    {
      title: titles[0] || "1. 면담 요약",
      lines: summary.length ? summary : ["면담 스크립트의 핵심 내용을 자동 추출하지 못했습니다."]
    },
    {
      title: titles[1] || "2. 핵심 확인 사항",
      lines: keyPoints.length ? keyPoints : summary
    },
    {
      title: titles[2] || "3. 후속 검토 필요 사항",
      lines: followUps.length ? followUps : ["면담 내용상 즉시 확인이 필요한 특이 리스크는 제한적으로 확인됩니다."]
    },
    {
      title: titles[3] || "4. 종합 의견",
      lines: [
        "면담 스크립트에 나타난 발언과 확인 사항을 중심으로 정리했습니다.",
        "최종 판단 전 이력서, 직무 요건, 면접 평가 결과와 함께 교차 검토가 필요합니다."
      ]
    }
  ];
  const reportText = [
    "면담록 보고서",
    "",
    prompt ? `작성 지시사항: ${normalizeText(prompt)}` : "작성 지시사항: 면담 핵심 발언, 강점, 리스크, 추가 확인 사항 중심 정리",
    templates.length ? `참고 샘플: ${templates.length}개 우수사례 양식 참고` : "참고 샘플: 기본 양식 사용",
    errorMessage ? `비고: AI 정교화 실패로 기본 생성 로직 사용 (${errorMessage.slice(0, 160)})` : "",
    "",
    ...sections.flatMap((section) => [
      section.title,
      ...section.lines.filter(Boolean).slice(0, 6).map((line) => `- ${line}`),
      ""
    ])
  ].filter((line) => line !== "").join("\n").trim();

  return {
    model: "local-fallback",
    chunkCount: splitTextIntoChunks(scriptText).length,
    reportText,
    executiveSummary: summary.join(" "),
    formatNotes: templates.length ? [`우수사례 샘플 ${templates.length}개 섹션 제목 일부 반영`] : ["기본 면담록 섹션 사용"],
    riskNotes: followUps
  };
}

module.exports = async function interviewReport(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  loadLocalEnv();

  try {
    const body = JSON.parse(await readRequestBody(request) || "{}");
    const scriptText = clipText(body.scriptText, MAX_SCRIPT_CHARS);
    const templates = compactTemplates(body.templates);
    const prompt = normalizeText(body.prompt);

    if (!scriptText) {
      sendJson(response, 400, { ok: false, error: "면담 스크립트 내용이 없습니다." });
      return;
    }

    if (!templates.length) {
      sendJson(response, 400, { ok: false, error: "면담록 작성 양식 샘플이 없습니다." });
      return;
    }

    let result;

    try {
      result = await callOpenAI({ scriptText, templates, prompt });
    } catch (error) {
      console.warn("OpenAI interview report failed. Using fallback report.", error.message);
      result = buildFallbackReport({ scriptText, templates, prompt, errorMessage: error.message || "" });
    }

    sendJson(response, 200, {
      ok: true,
      ...result
    });
  } catch (error) {
    console.error("Interview report API failed.", error);
    sendJson(response, 500, {
      ok: false,
      error: error.message || "면담록 보고서 생성에 실패했습니다."
    });
  }
};
