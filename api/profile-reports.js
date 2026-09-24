"use strict";

// Shared, persistent storage for generated candidate profile reports so a
// recruiter can re-download them later from any device. Backed by Supabase
// (public.profile_reports) via the server-only service role key; the browser
// only talks to this endpoint. Mirrors the interpreter-rooms pattern.
//
//   GET    /api/profile-reports            → list metadata (no data blob)
//   GET    /api/profile-reports?id=<uuid>  → one report including its data
//   POST   /api/profile-reports            → { format, title, data } → saved row
//   DELETE /api/profile-reports?id=<uuid>  → soft-delete one report

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const TABLE_NAME = "profile_reports";
const LIST_LIMIT = 200;
const FORMATS = new Set(["interview", "basic", "summary"]);

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8_000_000) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function getSupabaseClient() {
  loadLocalEnv();
  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  // Prefer the service role key when available; otherwise fall back to the anon
  // key, which is how the rest of this app reads/writes Supabase (candidates,
  // trending_people_reports use anon + permissive RLS). profile_reports has the
  // matching "demo profile reports" policies so anon access works.
  const key = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""
  );
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

function mapMeta(row) {
  return {
    id: row.id,
    format: row.format,
    title: row.title || "무제",
    ts: new Date(row.created_at || Date.now()).getTime()
  };
}

function tableUnavailablePayload(error) {
  return {
    ok: false,
    error: "Profile report table is unavailable. Create public.profile_reports in Supabase.",
    details: (error && error.message) || error || "unknown error"
  };
}

async function listReports(response, supabase) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id, format, title, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);
  if (error) {
    sendJson(response, 503, tableUnavailablePayload(error));
    return;
  }
  sendJson(response, 200, { ok: true, source: "supabase", reports: (data || []).map(mapMeta) });
}

async function getReport(response, supabase, id) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id, format, title, data, created_at")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (error) {
    sendJson(response, 404, { ok: false, error: "Report not found.", details: error.message });
    return;
  }
  sendJson(response, 200, { ok: true, report: { id: data.id, format: data.format, title: data.title || "무제", ts: new Date(data.created_at).getTime(), data: data.data } });
}

async function createReport(request, response, supabase) {
  const bodyText = await readRequestBody(request);
  const body = bodyText ? JSON.parse(bodyText) : {};
  const format = FORMATS.has(body.format) ? body.format : null;
  if (!format) {
    sendJson(response, 400, { ok: false, error: "format must be interview, basic, or summary." });
    return;
  }
  if (!body.data || typeof body.data !== "object") {
    sendJson(response, 400, { ok: false, error: "data object is required." });
    return;
  }
  const title = String(body.title || "무제").slice(0, 200);
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({ format, title, data: body.data })
    .select("id, format, title, created_at")
    .single();
  if (error) {
    sendJson(response, 503, tableUnavailablePayload(error));
    return;
  }
  sendJson(response, 200, { ok: true, source: "supabase", report: mapMeta(data) });
}

async function deleteReport(request, response, supabase) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  let id = String(url.searchParams.get("id") || "").trim();
  if (!id) {
    const bodyText = await readRequestBody(request);
    const body = bodyText ? JSON.parse(bodyText) : {};
    id = String(body.id || "").trim();
  }
  if (!id) {
    sendJson(response, 400, { ok: false, error: "id is required." });
    return;
  }
  const { error } = await supabase.from(TABLE_NAME).update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) {
    sendJson(response, 503, tableUnavailablePayload(error));
    return;
  }
  sendJson(response, 200, { ok: true, source: "supabase", id });
}

module.exports = async function profileReports(request, response) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    sendJson(response, 503, {
      ok: false,
      error: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) to enable shared report storage."
    });
    return;
  }

  try {
    if (request.method === "GET" || request.method === "HEAD") {
      const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
      const id = String(url.searchParams.get("id") || "").trim();
      if (id) {
        await getReport(response, supabase, id);
      } else {
        await listReports(response, supabase);
      }
      return;
    }
    if (request.method === "POST") {
      await createReport(request, response, supabase);
      return;
    }
    if (request.method === "DELETE") {
      await deleteReport(request, response, supabase);
      return;
    }
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    sendJson(response, 500, { ok: false, error: error.message || "Profile report request failed." });
  }
};
