const fs = require("fs");
const path = require("path");

function loadLocalEnv() {
  if (process.env.OPENAI_API_KEY) {
    return;
  }

  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    });
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 50_000) {
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

const LANGUAGES = {
  ko: "Korean",
  en: "English",
  zh: "Chinese (Simplified)"
};

function isLanguageCode(value) {
  return Object.prototype.hasOwnProperty.call(LANGUAGES, value);
}

function languageName(language) {
  return LANGUAGES[language] || language;
}

function modelSupportsTemperature(model) {
  return !/^gpt-5(?:[.\-]|$)/i.test(String(model || ""));
}

function extractOutputText(responseJson) {
  if (typeof responseJson.output_text === "string") {
    return responseJson.output_text.trim();
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

async function translateText({ text, sourceLanguage, targetLanguage }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (sourceLanguage === targetLanguage) {
    return text;
  }

  const model = process.env.OPENAI_INTERPRETER_TRANSLATION_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const requestBody = {
    model,
    input: [
      {
        role: "system",
        content: [
          "You are a real-time subtitle translator for a multilingual interpreter room.",
          "Translate only the user's utterance into the requested target language.",
          "For Chinese output, use natural Simplified Chinese unless the user explicitly asks otherwise.",
          "Keep the meaning, tone, names, numbers, and formatting. Do not add explanations, labels, quotes, or alternatives."
        ].join(" ")
      },
      {
        role: "user",
        content: [
          `Source language: ${languageName(sourceLanguage)}`,
          `Target language: ${languageName(targetLanguage)}`,
          "",
          "Utterance:",
          text
        ].join("\n")
      }
    ]
  };

  if (modelSupportsTemperature(model)) {
    requestBody.temperature = 0.1;
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
    throw new Error(`OpenAI translation failed: ${response.status} ${responseText.slice(0, 500)}`);
  }

  const translatedText = extractOutputText(JSON.parse(responseText));

  if (!translatedText) {
    throw new Error("OpenAI translation response did not include text");
  }

  return translatedText;
}

module.exports = async function translateCaption(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  loadLocalEnv();

  try {
    const bodyText = await readRequestBody(request);
    const body = bodyText ? JSON.parse(bodyText) : {};
    const text = String(body.text || "").trim().slice(0, 4000);
    const sourceLanguage = body.sourceLanguage;
    const targetLanguage = body.targetLanguage;

    if (!text) {
      sendJson(response, 400, { ok: false, error: "text is required." });
      return;
    }

    if (!isLanguageCode(sourceLanguage) || !isLanguageCode(targetLanguage)) {
      sendJson(response, 400, { ok: false, error: "sourceLanguage and targetLanguage must be ko, en, or zh." });
      return;
    }

    const translatedText = await translateText({ text, sourceLanguage, targetLanguage });
    sendJson(response, 200, {
      ok: true,
      translatedText,
      sourceLanguage,
      targetLanguage
    });
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Caption translation failed."
    });
  }
};
