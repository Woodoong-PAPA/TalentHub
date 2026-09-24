"use strict";

// Renders a reviewed candidate profile (JSON) into a Word (.docx) file and
// streams it back as a download. Input shape matches lib/profile-report-docx.js:
//   { format: "interview"|"basic"|"summary", data: <candidate|{groupLabel,candidates[]}> }

const { buildProfileReportDocx } = require("../lib/profile-report-docx.js");

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 5_000_000) {
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

function safeFileName(name) {
  const base = String(name || "profile").replace(/[^\w가-힣.\- ]+/g, "").trim().replace(/\s+/g, "_");
  return (base || "profile").slice(0, 60);
}

// Detect the image format from magic bytes. docx's ImageRun REQUIRES a valid
// type; embedding an image without one (or an unsupported format like HEIC)
// produces a broken media reference that Word refuses to open.
function detectImageType(buf) {
  if (!buf || buf.length < 4) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "gif";
  if (buf[0] === 0x42 && buf[1] === 0x4d) return "bmp";
  return null; // HEIC, WEBP, etc. are unsupported by docx — drop them.
}

// Convert an uploaded photo (data URL or raw base64) into the { buffer, type }
// shape the renderer expects. Returns undefined when there is no usable image
// (missing, corrupt, or an unsupported format) so the report renders without
// a photo instead of producing a file Word cannot open.
function decodePhoto(photo) {
  if (!photo) return undefined;
  const raw = typeof photo === "string" ? photo : photo.base64 || photo.dataUrl || "";
  const b64 = String(raw).replace(/^data:[^;]+;base64,/, "").trim();
  if (!b64) return undefined;
  try {
    const buffer = Buffer.from(b64, "base64");
    const type = detectImageType(buffer);
    if (!buffer.length || !type) return undefined;
    return { buffer, type, width: photo.width, height: photo.height };
  } catch (error) {
    return undefined;
  }
}

// Build "YY년생, NN세" from a 4-digit birth year; age = report year - birth year.
// When the birth year is unconfirmed, do not guess — mark it "출생연도·나이 미확인".
const BIRTH_UNKNOWN = "출생연도·나이 미확인";
function applyBirthLine(candidate) {
  if (!candidate || candidate.birthLine) return;
  const m = String(candidate.birthYear || "").match(/(\d{4})/);
  if (!m) {
    candidate.birthLine = BIRTH_UNKNOWN;
    return;
  }
  const year = Number(m[1]);
  if (year < 1900 || year > new Date().getFullYear()) {
    candidate.birthLine = BIRTH_UNKNOWN;
    return;
  }
  const age = new Date().getFullYear() - year;
  candidate.birthLine = String(year).slice(2) + "년생, " + age + "세";
}

// Decode photos and derive birth lines in-place for a candidate (or table).
function preparePhotos(format, data) {
  if (format === "summary") {
    (data.candidates || []).forEach((c) => {
      applyBirthLine(c);
      const p = decodePhoto(c.photo);
      if (p) c.photo = p; else delete c.photo;
    });
  } else {
    applyBirthLine(data);
    const p = decodePhoto(data.photo);
    if (p) data.photo = p; else delete data.photo;
  }
}

module.exports = async function profileReportDocx(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse((await readRequestBody(request)) || "{}");
    const format = ["interview", "basic", "summary"].includes(body.format) ? body.format : "interview";
    const data = body.data || {};
    // Annotation style: "inline" (mobile-safe) or "textbox" (PC, default).
    if (["inline", "textbox"].includes(body.variant)) data.variant = body.variant;

    if (format === "summary" && !(Array.isArray(data.candidates) && data.candidates.length)) {
      sendJson(response, 400, { ok: false, error: "summary format requires data.candidates[]" });
      return;
    }

    preparePhotos(format, data);
    const buffer = await buildProfileReportDocx(format, data);

    const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const nameForFile =
      format === "summary"
        ? [data.groupLabel || "candidate_table", ymd].join("_")
        : [data.name || "profile", data.orgShort, "Profile", ymd].filter(Boolean).join("_");
    const fileName = safeFileName(nameForFile) + ".docx";

    response.writeHead(200, {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Content-Length": buffer.length,
      "Cache-Control": "no-store"
    });
    response.end(buffer);
  } catch (error) {
    console.warn("Profile docx generation failed.", error);
    sendJson(response, 500, { ok: false, error: error.message || "Profile docx generation failed" });
  }
};
