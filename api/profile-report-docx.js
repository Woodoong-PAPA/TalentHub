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

module.exports = async function profileReportDocx(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse((await readRequestBody(request)) || "{}");
    const format = ["interview", "basic", "summary"].includes(body.format) ? body.format : "interview";
    const data = body.data || {};

    if (format === "summary" && !(Array.isArray(data.candidates) && data.candidates.length)) {
      sendJson(response, 400, { ok: false, error: "summary format requires data.candidates[]" });
      return;
    }

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
