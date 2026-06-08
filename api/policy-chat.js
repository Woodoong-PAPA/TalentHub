const MAX_CONTEXTS = 6;
const MAX_CONTEXT_CHARS = 1800;

const POLICY_CHAT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["answerItems"],
  properties: {
    answerItems: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["text", "citationNumber"],
        properties: {
          text: { type: "string" },
          citationNumber: { type: "integer" }
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

function normalizeContext(context) {
  const number = Number(context.number);
  const text = String(context.text || "").trim().slice(0, MAX_CONTEXT_CHARS);

  if (!Number.isInteger(number) || number < 1 || !text) {
    return null;
  }

  return {
    number,
    sourceTitle: String(context.sourceTitle || "채용 기준 소스").trim(),
    fileName: String(context.fileName || "").trim(),
    text
  };
}

function normalizeAnswerItems(answerItems, citationNumbers) {
  if (!Array.isArray(answerItems)) {
    return [];
  }

  return answerItems
    .map((item) => ({
      text: String(item.text || "").trim(),
      citationNumber: Number(item.citationNumber)
    }))
    .filter((item) => item.text && citationNumbers.has(item.citationNumber))
    .slice(0, 5);
}

async function callOpenAI(question, contexts) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_POLICY_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const sourceText = contexts
    .map((context) => [
      `[근거 ${context.number}] ${context.sourceTitle}${context.fileName ? ` / ${context.fileName}` : ""}`,
      context.text
    ].join("\n"))
    .join("\n\n");
  const prompt = [
    "사용자 질문을 이해하고, 제공된 채용 기준 소스의 사실만 사용해 답변하라.",
    "원문을 그대로 길게 복사하지 말고, 질문 의도에 맞게 기준/절차/예외/주의사항을 정돈해 설명하라.",
    "소스에서 확인되지 않는 내용은 추측하지 말고 확인 불가라고 말하라.",
    "각 답변 문단은 하나의 근거 번호를 citationNumber로 지정해야 한다.",
    "답변은 한국어로 작성하고, 실무자가 바로 이해할 수 있게 간결한 문단 또는 번호형 문장으로 구성하라.",
    "",
    `질문: ${question}`,
    "",
    "사용 가능한 소스:",
    sourceText
  ].join("\n");
  const requestBody = {
    model,
    input: [
      {
        role: "system",
        content: "You are a grounded HR policy Q&A assistant. Return only schema-valid JSON. Never use facts outside the provided sources."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "recruiting_policy_answer",
        schema: POLICY_CHAT_SCHEMA,
        strict: true
      }
    }
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
    throw new Error(`OpenAI policy chat failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const outputText = extractOutputText(JSON.parse(responseText));

  if (!outputText) {
    throw new Error("OpenAI policy chat response did not include structured text");
  }

  return JSON.parse(outputText);
}

module.exports = async function policyChat(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request) || "{}");
    const question = String(body.question || "").trim();
    const contexts = Array.isArray(body.contexts)
      ? body.contexts.slice(0, MAX_CONTEXTS).map(normalizeContext).filter(Boolean)
      : [];

    if (!question || !contexts.length) {
      sendJson(response, 400, { ok: false, error: "question and contexts are required" });
      return;
    }

    const citationNumbers = new Set(contexts.map((context) => context.number));
    const result = await callOpenAI(question, contexts);
    const answerItems = normalizeAnswerItems(result.answerItems, citationNumbers);

    if (!answerItems.length) {
      throw new Error("Policy chat response did not include usable answer items");
    }

    sendJson(response, 200, { ok: true, answerItems });
  } catch (error) {
    console.warn("Policy chat failed.", error);
    sendJson(response, 500, { ok: false, error: error.message || "Policy chat failed" });
  }
};
