const QRCode = require("qrcode");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

module.exports = async function interpreterQr(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);
  const text = String(url.searchParams.get("text") || "").trim();

  if (!text) {
    sendJson(response, 400, { ok: false, error: "text query parameter is required" });
    return;
  }

  if (text.length > 1200) {
    sendJson(response, 400, { ok: false, error: "text query parameter is too long" });
    return;
  }

  try {
    const svg = await QRCode.toString(text, {
      type: "svg",
      margin: 1,
      width: 220,
      color: {
        dark: "#111827",
        light: "#ffffff"
      }
    });

    response.writeHead(200, {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(svg);
  } catch (error) {
    sendJson(response, 500, { ok: false, error: error.message || "QR generation failed" });
  }
};
