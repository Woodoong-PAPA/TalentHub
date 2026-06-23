const fs = require("fs");
const path = require("path");

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

function getClientConfig() {
  loadLocalEnv();

  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const supabaseAnonKey = String(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");
  const requestedDataSource = process.env.APP_DATA_SOURCE || "local";
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

  return {
    supabaseUrl,
    supabaseAnonKey,
    dataSource: requestedDataSource === "supabase" && hasSupabaseConfig ? "supabase" : "local"
  };
}

module.exports = async function clientConfig(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  const contents = `window.__APP_CONFIG__ = ${JSON.stringify(getClientConfig(), null, 2)};\n`;

  response.writeHead(200, {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "no-store"
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  response.end(contents);
};
