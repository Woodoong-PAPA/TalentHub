const core = require("../lib/candidate-profile-core.js");
const fs = require("fs");
const path = require("path");

const MAX_BODY_BYTES = 250_000;

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, "utf8").split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  });
}

loadLocalEnv();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function text(value) {
  return String(value == null ? "" : value).trim();
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeDateValue(value, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string" || typeof value === "number") return text(value);
  if (typeof value !== "object") return fallback;
  if (value.text) return text(value.text);
  return [value.month, value.year].filter(Boolean).join(" ") || fallback;
}

function normalizeLocation(value) {
  if (!value) return "";
  if (typeof value === "string") return text(value);
  if (typeof value !== "object") return "";
  return text(value.parsed?.text || value.linkedinText || value.text || value.name);
}

function getApifyConfig() {
  return {
    token: process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN || "",
    actorId: process.env.APIFY_LINKEDIN_ACTOR_ID || process.env.APIFY_LINKEDIN_ACTOR || "",
    mode: process.env.APIFY_LINKEDIN_MODE || "Profile details no email ($4 per 1k)"
  };
}

function normalizeApifyProfile(raw, input) {
  const profile = raw && typeof raw === "object" ? raw : {};
  const fullName = text(profile.fullName || profile.name || [profile.firstName, profile.lastName].filter(Boolean).join(" "));
  const experiences = list(profile.experience || profile.experiences || profile.positions).map((item) => ({
    company: text(item.companyName || item.company || item.organization),
    position: text(item.title || item.position),
    startDate: normalizeDateValue(item.startDate || item.start),
    endDate: normalizeDateValue(item.endDate || item.end, item.current ? "현재" : ""),
    description: text(item.description || item.summary)
  })).filter((item) => item.company || item.position);
  const education = list(profile.education || profile.educations).map((item) => ({
    school: text(item.schoolName || item.school),
    degree: text(item.degreeName || item.degree),
    major: text(item.fieldOfStudy || item.major),
    startYear: normalizeDateValue(item.startYear || item.startDate || item.start),
    endYear: normalizeDateValue(item.endYear || item.endDate || item.end)
  })).filter((item) => item.school);
  const currentExperience = experiences.find((item) => !item.endDate || item.endDate === "현재") || experiences[0] || {};
  const skills = list(profile.skills).map((item) => text(item.name || item)).filter(Boolean).slice(0, 8);
  const candidate = core.createMockCandidate({
    ...input,
    candidateName: fullName || input.candidateName,
    currentCompany: currentExperience.company || input.currentCompany,
    currentPosition: currentExperience.position || profile.headline || input.currentPosition
  });

  candidate.headline = text(profile.headline) || candidate.headline;
  candidate.location = normalizeLocation(profile.location || profile.addressWithCountry) || candidate.location;
  candidate.photoUrl = text(profile.photo || profile.profilePic || profile.profilePicture || profile.photoUrl);
  candidate.summary = text(profile.about || profile.summary) || candidate.summary;
  candidate.experience = experiences.length ? experiences : candidate.experience;
  candidate.education = education.length ? education : candidate.education;
  candidate.expertise = skills.length ? skills.slice(0, 5) : candidate.expertise;
  candidate.candidateType = core.classifyCandidateType(candidate);
  candidate.identityStatus = fullName ? "LIKELY" : "AMBIGUOUS";
  candidate.updatedAt = new Date().toISOString();
  candidate.lastResearchedAt = candidate.updatedAt;
  return core.normalizeCandidate(candidate);
}

async function fetchApifyProfile(input) {
  const { token, actorId, mode } = getApifyConfig();

  if (!token || !actorId) {
    return null;
  }

  const endpoint = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?timeout=90&memory=512&maxItems=1`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      profileScraperMode: mode,
      queries: [input.linkedinUrl],
      urls: [input.linkedinUrl]
    })
  });

  if (!response.ok) {
    throw new Error(`Apify request failed (${response.status})`);
  }

  const items = await response.json();
  return Array.isArray(items) ? items[0] || null : null;
}

module.exports = async function candidateProfileResearch(request, response) {
  if (request.method === "GET") {
    const apify = getApifyConfig();
    sendJson(response, 200, {
      ok: true,
      providers: {
        apifyConfigured: Boolean(apify.token && apify.actorId),
        openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
        webSearchConfigured: Boolean(process.env.CANDIDATE_WEB_SEARCH_PROVIDER)
      }
    });
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  try {
    const body = JSON.parse((await readRequestBody(request)) || "{}");
    const input = body.input && typeof body.input === "object" ? body.input : {};
    const linkedinUrl = core.normalizeLinkedInUrl(input.linkedinUrl);

    if (!linkedinUrl) {
      sendJson(response, 400, { ok: false, error: "올바른 LinkedIn 개인 프로필 URL이 필요합니다." });
      return;
    }

    const safeInput = {
      linkedinUrl,
      candidateName: text(input.candidateName).slice(0, 100),
      currentCompany: text(input.currentCompany).slice(0, 160),
      currentPosition: text(input.currentPosition).slice(0, 160),
      reviewPurpose: text(input.reviewPurpose).slice(0, 300),
      targetPosition: text(input.targetPosition).slice(0, 200),
      additionalNotes: text(input.additionalNotes).slice(0, 3000),
      researchMode: input.researchMode === "materials" ? "materials" : "deep"
    };
    let candidate;
    let provider = "mock";

    try {
      const rawProfile = await fetchApifyProfile(safeInput);
      if (rawProfile) {
        candidate = normalizeApifyProfile(rawProfile, safeInput);
        provider = "apify";
      }
    } catch (error) {
      console.warn("Candidate profile Apify connector failed; mock normalization is used.", error.message);
    }

    candidate = candidate || core.createMockCandidate(safeInput);
    const apify = getApifyConfig();
    sendJson(response, 200, {
      ok: true,
      candidate,
      provider,
      providers: {
        apifyConfigured: Boolean(apify.token && apify.actorId),
        openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
        webSearchConfigured: Boolean(process.env.CANDIDATE_WEB_SEARCH_PROVIDER)
      }
    });
  } catch (error) {
    console.error("Candidate profile research failed.", error.message);
    sendJson(response, 500, { ok: false, error: "후보자 리서치 처리 중 오류가 발생했습니다." });
  }
};
