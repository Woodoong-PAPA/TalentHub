const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const TABLE_NAME = "interpreter_rooms";
const ROOM_LIMIT = 30;
const LANGUAGES = new Set(["ko", "en", "zh"]);

function loadLocalEnv() {
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

      if (body.length > 50_000) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function normalizeRoomId(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
}

function normalizeLanguage(value, fallback = "ko") {
  return LANGUAGES.has(value) ? value : fallback;
}

function normalizeRole(value) {
  return value === "c" ? "c" : value === "b" ? "b" : "a";
}

function getSupabaseAdmin() {
  loadLocalEnv();

  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "");

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

function mapRoom(row) {
  return {
    roomId: row.room_id,
    role: normalizeRole(row.role),
    language: normalizeLanguage(row.language, row.role === "c" ? "zh" : row.role === "b" ? "en" : "ko"),
    status: row.status === "ended" || row.ended_at ? "ended" : "active",
    createdAt: new Date(row.created_at || Date.now()).getTime(),
    updatedAt: new Date(row.updated_at || row.created_at || Date.now()).getTime(),
    endedAt: row.ended_at ? new Date(row.ended_at).getTime() : null
  };
}

function tableUnavailablePayload(error) {
  return {
    ok: false,
    error: "Interpreter room list table is unavailable. Create public.interpreter_rooms in Supabase or keep using local fallback.",
    details: error?.message || error || "unknown error"
  };
}

async function listRooms(request, response, supabase) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || ROOM_LIMIT, 1), ROOM_LIMIT);
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("room_id, role, language, status, created_at, updated_at, ended_at")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    sendJson(response, 503, tableUnavailablePayload(error));
    return;
  }

  sendJson(response, 200, {
    ok: true,
    source: "supabase",
    rooms: (data || []).map(mapRoom)
  });
}

async function upsertRoom(request, response, supabase) {
  const bodyText = await readRequestBody(request);
  const body = bodyText ? JSON.parse(bodyText) : {};
  const roomId = normalizeRoomId(body.roomId);

  if (!roomId) {
    sendJson(response, 400, { ok: false, error: "roomId is required." });
    return;
  }

  const now = new Date().toISOString();
  const role = normalizeRole(body.role);
  const endedAt = Number(body.endedAt || 0) ? new Date(Number(body.endedAt)).toISOString() : null;
  const row = {
    room_id: roomId,
    role,
    language: normalizeLanguage(body.language, role === "c" ? "zh" : role === "b" ? "en" : "ko"),
    status: body.status === "ended" || endedAt ? "ended" : "active",
    updated_at: now,
    ended_at: endedAt,
    deleted_at: null
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(row, { onConflict: "room_id" })
    .select("room_id, role, language, status, created_at, updated_at, ended_at")
    .single();

  if (error) {
    sendJson(response, 503, tableUnavailablePayload(error));
    return;
  }

  sendJson(response, 200, {
    ok: true,
    source: "supabase",
    room: mapRoom(data)
  });
}

async function deleteRoom(request, response, supabase) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  let roomId = normalizeRoomId(url.searchParams.get("roomId"));

  if (!roomId) {
    const bodyText = await readRequestBody(request);
    const body = bodyText ? JSON.parse(bodyText) : {};
    roomId = normalizeRoomId(body.roomId);
  }

  if (!roomId) {
    sendJson(response, 400, { ok: false, error: "roomId is required." });
    return;
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("room_id", roomId);

  if (error) {
    sendJson(response, 503, tableUnavailablePayload(error));
    return;
  }

  sendJson(response, 200, {
    ok: true,
    source: "supabase",
    roomId
  });
}

module.exports = async function interpreterRooms(request, response) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    sendJson(response, 503, {
      ok: false,
      error: "Supabase service role is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable the shared room list."
    });
    return;
  }

  try {
    if (request.method === "GET" || request.method === "HEAD") {
      await listRooms(request, response, supabase);
      return;
    }

    if (request.method === "POST") {
      await upsertRoom(request, response, supabase);
      return;
    }

    if (request.method === "DELETE") {
      await deleteRoom(request, response, supabase);
      return;
    }

    sendJson(response, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Interpreter room list request failed."
    });
  }
};
