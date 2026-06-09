const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.argv[2]) || 5177;
const HOST = "127.0.0.1";
const ROOT = process.cwd();

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

function resolveRequestPath(url) {
  const requestPath = decodeURIComponent(url.split("?")[0]);
  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  return path.normalize(path.join(ROOT, relativePath));
}

const server = http.createServer((request, response) => {
  if (request.url.split("?")[0] === "/api/parse-resume") {
    const parseResume = require("./api/parse-resume.js");
    parseResume(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/extract-text") {
    const extractText = require("./api/extract-text.js");
    extractText(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/search-candidates") {
    const searchCandidates = require("./api/search-candidates.js");
    searchCandidates(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/policy-chat") {
    const policyChat = require("./api/policy-chat.js");
    policyChat(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/job-fit-analysis") {
    const jobFitAnalysis = require("./api/job-fit-analysis.js");
    jobFitAnalysis(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/jd-enhance") {
    const jdEnhance = require("./api/jd-enhance.js");
    jdEnhance(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/trending-people") {
    const trendingPeople = require("./api/trending-people.js");
    trendingPeople(request, response);
    return;
  }

  if (["/api/trending-mail", "/api/trending-mail-cron"].includes(request.url.split("?")[0])) {
    const trendingMail = require("./api/trending-mail.js");
    trendingMail(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/screening-mail") {
    const screeningMail = require("./api/screening-mail.js");
    screeningMail(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/signup-alert") {
    const signupAlert = require("./api/signup-alert.js");
    signupAlert(request, response);
    return;
  }

  if (request.url.split("?")[0] === "/api/recruiting-metrics-mail") {
    const recruitingMetricsMail = require("./api/recruiting-metrics-mail.js");
    recruitingMetricsMail(request, response);
    return;
  }

  const filePath = resolveRequestPath(request.url);

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": CONTENT_TYPES[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Talent Pool MVP running at http://${HOST}:${PORT}/`);
});
