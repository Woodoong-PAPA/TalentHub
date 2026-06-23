const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const OPENAI_TRANSLATION_CLIENT_SECRET_URL =
  "https://api.openai.com/v1/realtime/translations/client_secrets";

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
        process.env[match[1]] = match[2];
      }
    });
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 100_000) {
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

function isLanguageCode(value) {
  return value === "ko" || value === "en" || value === "zh";
}

function hashSafetyIdentifier(parts) {
  return crypto.createHash("sha256").update(parts.join(":")).digest("hex");
}

module.exports = async function realtimeToken(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  loadLocalEnv();

  if (!process.env.OPENAI_API_KEY) {
    sendJson(response, 500, {
      ok: false,
      error: "OPENAI_API_KEY is not configured on the server."
    });
    return;
  }

  try {
    const bodyText = await readRequestBody(request);
    const body = bodyText ? JSON.parse(bodyText) : {};
    const targetLanguage = body.targetLanguage;

    if (!isLanguageCode(targetLanguage)) {
      sendJson(response, 400, { ok: false, error: "targetLanguage must be ko, en, or zh." });
      return;
    }

    const safetyIdentifier = hashSafetyIdentifier([
      String(body.roomId || "room"),
      String(body.participantId || request.socket?.remoteAddress || "participant")
    ]);

    const tokenResponse = await fetch(OPENAI_TRANSLATION_CLIENT_SECRET_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": safetyIdentifier
      },
      body: JSON.stringify({
        expires_after: {
          anchor: "created_at",
          seconds: 600
        },
        session: {
          model: process.env.OPENAI_REALTIME_TRANSLATION_MODEL || "gpt-realtime-translate",
          audio: {
            input: {
              transcription: {
                model: process.env.OPENAI_REALTIME_TRANSCRIPTION_MODEL || "gpt-realtime-whisper"
              },
              noise_reduction: {
                type: "near_field"
              }
            },
            output: {
              language: targetLanguage
            }
          }
        }
      })
    });

    const data = await tokenResponse.json().catch(async () => ({
      error: await tokenResponse.text().catch(() => "OpenAI token request failed.")
    }));

    if (!tokenResponse.ok) {
      sendJson(response, tokenResponse.status, {
        ok: false,
        error: "Failed to create OpenAI Realtime translation client secret.",
        details: data
      });
      return;
    }

    sendJson(response, 200, { ok: true, ...data });
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Realtime token request failed."
    });
  }
};
