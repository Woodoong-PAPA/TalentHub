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

// Convert an uploaded photo (data URL or raw base64) into the { buffer, ... }
// shape the renderer expects. Returns the object unchanged if there's no image.
function decodePhoto(photo) {
  if (!photo) return undefined;
  const raw = typeof photo === "string" ? photo : photo.base64 || photo.dataUrl || "";
  const b64 = String(raw).replace(/^data:[^;]+;base64,/, "").trim();
  if (!b64) return undefined;
  try {
    const buffer = Buffer.from(b64, "base64");
    if (!buffer.length) return undefined;
    return { buffer, width: photo.width, height: photo.height };
  } catch (error) {
    return undefined;
  }
}

// Build "(yy년생, NN세)" from a 4-digit birth year; age = current year - birth.
function applyBirthLine(candidate) {
  if (!candidate || candidate.birthLine) return;
  const m = String(candidate.birthYear || "").match(/(\d{4})/);
  if (!m) return;
  const year = Number(m[1]);
  if (year < 1900 || year > new Date().getFullYear()) return;
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

    const nameForFile =
      format === "summary" ? data.groupLabel || "candidate_table" : data.name || "profile";
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
