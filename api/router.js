const routes = {
  "extract-text": () => require("./extract-text.js"),
  "interpreter-rooms": () => require("./interpreter-rooms.js"),
  "interpreter-qr": () => require("./interpreter-qr.js"),
  "interview-scheduling": () => require("./interview-scheduling.js"),
  "interview-scheduling-pubsub": () => require("./interview-scheduling.js"),
  "interview-scheduling-sync-cron": () => require("./interview-scheduling.js"),
  "interview-scheduling-watch-cron": () => require("./interview-scheduling.js"),
  "jd-enhance": () => require("./jd-enhance.js"),
  "job-fit-analysis": () => require("./job-fit-analysis.js"),
  "parse-resume": () => require("./parse-resume.js"),
  "policy-chat": () => require("./policy-chat.js"),
  "realtime-token": () => require("./realtime-token.js"),
  "recruiting-metrics-mail": () => require("./recruiting-metrics-mail.js"),
  "recruiting-metrics-request-cron": () => require("./recruiting-metrics-mail.js"),
  "runtime-config": () => require("./client-config.js"),
  "screening-mail": () => require("./screening-mail.js"),
  "search-candidates": () => require("./search-candidates.js"),
  "signup-alert": () => require("./signup-alert.js"),
  "translate-caption": () => require("./translate-caption.js"),
  "trending-mail": () => require("./trending-mail.js"),
  "trending-mail-cron": () => require("./trending-mail.js"),
  "trending-people": () => require("./trending-people.js"),
  "trending-people-cron": () => require("./trending-people-cron.js")
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function resolveRouteName(request) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const queryRoute = String(url.searchParams.get("route") || "").trim();

  if (queryRoute) {
    return queryRoute.replace(/^\/+|\/+$/g, "");
  }

  return url.pathname.replace(/^\/api\//, "").replace(/\.js$/, "").replace(/^\/+|\/+$/g, "");
}

module.exports = async function apiRouter(request, response) {
  const routeName = resolveRouteName(request);
  const loadHandler = routes[routeName];

  if (!loadHandler) {
    sendJson(response, 404, {
      ok: false,
      error: "API route not found.",
      route: routeName || null
    });
    return;
  }

  const handler = loadHandler();
  await handler(request, response);
};
