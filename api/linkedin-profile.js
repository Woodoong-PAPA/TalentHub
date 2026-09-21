"use strict";

// Fetches a public LinkedIn profile via an Apify actor (default:
// HarvestAPI "LinkedIn Profile Scraper") and returns a normalized profile
// the report generator / AI structuring step can consume.
//
// Required env:
//   APIFY_TOKEN                 Apify personal API token (apify_api_...)
// Optional env (defaults target harvestapi/linkedin-profile-scraper):
//   APIFY_LINKEDIN_ACTOR        actor id, "~" form (default below)
//   APIFY_LINKEDIN_MODE         profileScraperMode value
//
// The exact Apify input field names live in buildActorInput() so they can be
// adjusted in one place to match the actor's JSON input schema.

const DEFAULT_ACTOR = "harvestapi~linkedin-profile-scraper";
const DEFAULT_MODE = "Profile details no email ($4 per 1k)";
const APIFY_TIMEOUT_MS = 120000;

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
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

function normalizeLinkedinUrl(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  const withScheme = /^https?:\/\//i.test(value) ? value : "https://" + value.replace(/^\/+/, "");
  try {
    const url = new URL(withScheme);
    if (!/linkedin\.com$/i.test(url.hostname.replace(/^www\./i, ""))) return "";
    return url.origin + url.pathname.replace(/\/+$/, "");
  } catch (error) {
    return "";
  }
}

// The Apify actor input. Field names match harvestapi/linkedin-profile-scraper;
// override the URL key here if the actor's JSON input differs.
function buildActorInput(urls, mode) {
  return {
    profileScraperMode: mode,
    queries: urls
  };
}

async function runApifyActor(urls, { token, actor, mode }) {
  const endpoint =
    "https://api.apify.com/v2/acts/" +
    encodeURIComponent(actor) +
    "/run-sync-get-dataset-items?token=" +
    encodeURIComponent(token);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), APIFY_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildActorInput(urls, mode)),
      signal: controller.signal
    });
    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Apify run failed: ${response.status} ${text.slice(0, 400)}`);
    }

    let items;
    try {
      items = JSON.parse(text);
    } catch (error) {
      throw new Error("Apify returned a non-JSON response");
    }
    return Array.isArray(items) ? items : [];
  } finally {
    clearTimeout(timer);
  }
}

function pick(obj, keys) {
  for (const key of keys) {
    const value = obj && obj[key];
    if (value != null && String(value).trim() !== "") return value;
  }
  return "";
}

// Map an Apify dataset item into a stable shape regardless of the actor's
// exact key naming. The raw item is preserved so the AI step keeps every field.
function normalizeProfile(item) {
  if (!item || typeof item !== "object") return null;

  const experienceRaw = item.experience || item.experiences || item.positions || item.workExperience || [];
  const educationRaw = item.education || item.educations || item.schools || [];

  const experience = (Array.isArray(experienceRaw) ? experienceRaw : []).map((e) => ({
    title: String(pick(e, ["title", "position", "role", "jobTitle"])),
    company: String(pick(e, ["companyName", "company", "organisation", "organization", "subtitle"])),
    location: String(pick(e, ["location", "geoLocation"])),
    start: String(pick(e, ["startDate", "start", "from", "starts_at"])),
    end: String(pick(e, ["endDate", "end", "to", "ends_at"])),
    duration: String(pick(e, ["duration", "dateRange", "caption", "period"])),
    description: String(pick(e, ["description", "summary"])).slice(0, 1200)
  }));

  const education = (Array.isArray(educationRaw) ? educationRaw : []).map((e) => ({
    school: String(pick(e, ["schoolName", "school", "title", "institution", "name"])),
    degree: String(pick(e, ["degree", "degreeName"])),
    field: String(pick(e, ["fieldOfStudy", "field", "major", "subtitle"])),
    start: String(pick(e, ["startDate", "start"])),
    end: String(pick(e, ["endDate", "end", "graduationYear"])),
    duration: String(pick(e, ["duration", "dateRange", "caption", "period"]))
  }));

  return {
    fullName: String(pick(item, ["fullName", "name", "displayName"])) ||
      [pick(item, ["firstName"]), pick(item, ["lastName"])].filter(Boolean).join(" ").trim(),
    headline: String(pick(item, ["headline", "occupation", "subtitle"])),
    location: String(pick(item, ["location", "geoLocation", "addressWithCountry", "locationName"])),
    about: String(pick(item, ["about", "summary", "bio"])).slice(0, 4000),
    currentCompany: String(pick(item, ["companyName", "currentCompany", "company"])),
    currentTitle: String(pick(item, ["jobTitle", "currentPosition", "title"])),
    photoUrl: String(pick(item, ["photo", "profilePicture", "profilePic", "pictureUrl", "avatar"])),
    linkedinUrl: String(pick(item, ["linkedinUrl", "url", "profileUrl", "publicUrl"])),
    experience,
    education,
    raw: item
  };
}

module.exports = async function linkedinProfile(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const token = process.env.APIFY_TOKEN;
  if (!token) {
    sendJson(response, 400, { ok: false, error: "APIFY_TOKEN is not configured on the server." });
    return;
  }

  try {
    const body = JSON.parse((await readRequestBody(request)) || "{}");
    const rawUrls = Array.isArray(body.urls) ? body.urls : [body.url];
    const urls = rawUrls.map(normalizeLinkedinUrl).filter(Boolean).slice(0, 5);

    if (!urls.length) {
      sendJson(response, 400, { ok: false, error: "A valid LinkedIn profile URL is required." });
      return;
    }

    const actor = process.env.APIFY_LINKEDIN_ACTOR || DEFAULT_ACTOR;
    const mode = process.env.APIFY_LINKEDIN_MODE || DEFAULT_MODE;

    const items = await runApifyActor(urls, { token, actor, mode });
    const profiles = items.map(normalizeProfile).filter(Boolean);

    if (!profiles.length) {
      sendJson(response, 502, { ok: false, error: "Apify returned no profile data for the given URL(s)." });
      return;
    }

    sendJson(response, 200, { ok: true, profiles, count: profiles.length });
  } catch (error) {
    console.warn("LinkedIn profile fetch failed.", error);
    sendJson(response, 500, { ok: false, error: error.message || "LinkedIn profile fetch failed" });
  }
};
