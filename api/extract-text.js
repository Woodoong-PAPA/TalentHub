const zlib = require("zlib");

const MAX_BODY_LENGTH = 12_000_000;

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > MAX_BODY_LENGTH) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function normalizeDocumentText(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/\u0000/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\u00ad/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getFileExtension(fileName = "") {
  return String(fileName || "").split(".").pop()?.toLowerCase() || "";
}

function detectFileType(fileName, mimeType, buffer) {
  const extension = getFileExtension(fileName);
  const signature = buffer.slice(0, 8).toString("latin1");

  if (extension === "pdf" || signature.startsWith("%PDF")) return "pdf";
  if (extension === "docx") return "docx";
  if (extension === "hwpx") return "hwpx";
  if (extension === "hwp") return "hwp";
  if (extension === "doc") return "doc";
  if (["txt", "md", "csv", "json"].includes(extension) || /text|json|csv|markdown/i.test(mimeType || "")) return "text";
  if (buffer[0] === 0x50 && buffer[1] === 0x4b) return "zip";

  return "unknown";
}

function decodeBase64Payload(body) {
  const dataUrl = String(body.dataUrl || "");
  const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/s);

  if (match) {
    return match[2]
      ? Buffer.from(match[3] || "", "base64")
      : Buffer.from(decodeURIComponent(match[3] || ""), "utf8");
  }

  if (body.base64) {
    return Buffer.from(String(body.base64), "base64");
  }

  return Buffer.alloc(0);
}

function scoreText(text) {
  const normalized = normalizeDocumentText(text);
  const length = Math.max(normalized.length, 1);
  const useful = (normalized.match(/[A-Za-z0-9가-힣]/g) || []).length / length;
  const controls = (normalized.match(/[\u0001-\u0008\u000b\u000c\u000e-\u001f]/g) || []).length / length;
  const replacement = (normalized.match(/\uFFFD/g) || []).length / length;
  const binary = /%PDF|PK\u0003\u0004|\u0000\u0000/.test(normalized) ? 0.35 : 0;

  return useful - controls - replacement - binary;
}

function decodeTextBuffer(buffer) {
  const encodings = ["utf-8", "euc-kr", "utf-16le", "latin1"];
  const decoded = encodings
    .map((encoding) => {
      try {
        const decoder = encoding === "latin1"
          ? null
          : new TextDecoder(encoding, { fatal: false });
        const text = decoder ? decoder.decode(buffer) : buffer.toString("latin1");
        return { encoding, text: normalizeDocumentText(text), score: scoreText(text) };
      } catch (_) {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return decoded[0] || { encoding: "utf-8", text: "", score: 0 };
}

function readUint16(buffer, offset) {
  return buffer.readUInt16LE(offset);
}

function readUint32(buffer, offset) {
  return buffer.readUInt32LE(offset);
}

function findEndOfCentralDirectory(buffer) {
  for (let offset = buffer.length - 22; offset >= 0 && offset >= buffer.length - 66000; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }

  return -1;
}

function decodeZipFileName(bytes) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (_) {
    return new TextDecoder("euc-kr", { fatal: false }).decode(bytes);
  }
}

function inflateZipData(data) {
  try {
    return zlib.inflateRawSync(data);
  } catch (_) {
    return zlib.inflateSync(data);
  }
}

function readZipEntries(buffer, shouldReadEntry) {
  const eocdOffset = findEndOfCentralDirectory(buffer);

  if (eocdOffset < 0) {
    throw new Error("압축 문서 구조를 찾지 못했습니다.");
  }

  const entryCount = readUint16(buffer, eocdOffset + 10);
  let offset = readUint32(buffer, eocdOffset + 16);
  const entries = [];

  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > buffer.length || readUint32(buffer, offset) !== 0x02014b50) {
      break;
    }

    const method = readUint16(buffer, offset + 10);
    const compressedSize = readUint32(buffer, offset + 20);
    const fileNameLength = readUint16(buffer, offset + 28);
    const extraLength = readUint16(buffer, offset + 30);
    const commentLength = readUint16(buffer, offset + 32);
    const localHeaderOffset = readUint32(buffer, offset + 42);
    const fileNameBytes = buffer.subarray(offset + 46, offset + 46 + fileNameLength);
    const fileName = decodeZipFileName(fileNameBytes).replace(/\\/g, "/");

    if (shouldReadEntry(fileName)) {
      const localNameLength = readUint16(buffer, localHeaderOffset + 26);
      const localExtraLength = readUint16(buffer, localHeaderOffset + 28);
      const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressedData = buffer.subarray(dataOffset, dataOffset + compressedSize);
      const data = method === 0
        ? compressedData
        : method === 8
          ? inflateZipData(compressedData)
          : Buffer.alloc(0);

      entries.push({
        fileName,
        text: new TextDecoder("utf-8", { fatal: false }).decode(data)
      });
    }

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function decodeXmlEntities(text) {
  return String(text || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, value) => String.fromCharCode(Number(value)))
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCharCode(parseInt(value, 16)));
}

function extractTextFromXml(xml) {
  return normalizeDocumentText(
    decodeXmlEntities(xml)
      .replace(/<[^>]*(?:p|paragraph|sectPr|br|tab)[^>]*\/>/gi, "\n")
      .replace(/<\/(?:w:p|hp:p|p|text:p|a:p)>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
  );
}

function extractTextFromDocx(buffer) {
  const entries = readZipEntries(buffer, (fileName) =>
    /^word\/(?:document|header\d*|footer\d*|footnotes|endnotes|comments)\.xml$/i.test(fileName)
  );

  return normalizeDocumentText(entries.map((entry) => extractTextFromXml(entry.text)).join("\n"));
}

function extractTextFromHwpx(buffer) {
  const entries = readZipEntries(buffer, (fileName) =>
    /^Contents\/.*\.xml$/i.test(fileName) ||
    /^Preview\/.*\.(xml|txt)$/i.test(fileName) ||
    /^Sections\/.*\.xml$/i.test(fileName)
  );

  return normalizeDocumentText(entries.map((entry) => extractTextFromXml(entry.text)).join("\n"));
}

function unescapePdfLiteral(value) {
  return String(value || "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

function decodePdfHexString(hex) {
  const cleaned = String(hex || "").replace(/[^0-9a-f]/gi, "");

  if (!cleaned) {
    return "";
  }

  const buffer = Buffer.from(cleaned.length % 2 ? `${cleaned}0` : cleaned, "hex");

  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    let text = "";

    for (let index = 2; index + 1 < buffer.length; index += 2) {
      text += String.fromCharCode(buffer.readUInt16BE(index));
    }

    return text;
  }

  return decodeTextBuffer(buffer).text;
}

function extractPdfOperatorText(source) {
  const literalText = [...source.matchAll(/\((?:\\.|[^\\()]){1,}\)\s*Tj/g)]
    .map((match) => unescapePdfLiteral(match[0].replace(/\)\s*Tj$/, "").slice(1)))
    .join("\n");
  const arrayLiteralText = [...source.matchAll(/\[(.*?)\]\s*TJ/gs)]
    .flatMap((match) => [...match[1].matchAll(/\((?:\\.|[^\\()]){1,}\)/g)]
      .map((item) => unescapePdfLiteral(item[0].slice(1, -1))))
    .join(" ");
  const hexText = [...source.matchAll(/<([0-9a-fA-F\s]{4,})>\s*Tj/g)]
    .map((match) => decodePdfHexString(match[1]))
    .join("\n");
  const arrayHexText = [...source.matchAll(/\[(.*?)\]\s*TJ/gs)]
    .flatMap((match) => [...match[1].matchAll(/<([0-9a-fA-F\s]{4,})>/g)]
      .map((item) => decodePdfHexString(item[1])))
    .join(" ");

  return normalizeDocumentText([literalText, arrayLiteralText, hexText, arrayHexText].filter(Boolean).join("\n"));
}

function extractTextFromPdf(buffer) {
  const raw = buffer.toString("latin1");
  const chunks = [extractPdfOperatorText(raw)];
  const streamPattern = /<<(?:.|\r|\n){0,1600}?\/Filter\s*(?:\[[^\]]*)?\/FlateDecode(?:[^\]]*\])?(?:.|\r|\n){0,1600}?>>\s*stream\r?\n([\s\S]*?)\r?\nendstream/g;

  for (const match of raw.matchAll(streamPattern)) {
    try {
      const streamBuffer = Buffer.from(match[1], "latin1");
      const inflated = inflateZipData(streamBuffer);
      const inflatedText = inflated.toString("latin1");
      chunks.push(extractPdfOperatorText(inflatedText));
      chunks.push(decodeTextBuffer(inflated).text);
    } catch (_) {
      // Ignore streams that are not plain deflate text streams.
    }
  }

  return normalizeDocumentText(chunks.filter(Boolean).join("\n"));
}

function extractTextFromLegacyBinary(buffer) {
  const decoded = decodeTextBuffer(buffer).text;

  return normalizeDocumentText(
    decoded
      .replace(/[^\S\n]+/g, " ")
      .replace(/[^\n가-힣A-Za-z0-9.,:;()/'"~+\-@\s]/g, " ")
  );
}

function extractText({ fileName, mimeType, buffer }) {
  const fileType = detectFileType(fileName, mimeType, buffer);
  let text = "";
  let extractionMethod = fileType;

  if (fileType === "text") {
    const decoded = decodeTextBuffer(buffer);
    text = decoded.text;
    extractionMethod = `text-${decoded.encoding}`;
  } else if (fileType === "docx" || fileType === "zip") {
    text = extractTextFromDocx(buffer);
    extractionMethod = "docx-server-xml";
  } else if (fileType === "hwpx") {
    text = extractTextFromHwpx(buffer);
    extractionMethod = "hwpx-server-xml";
  } else if (fileType === "pdf") {
    text = extractTextFromPdf(buffer);
    extractionMethod = "pdf-server-stream";
  } else if (fileType === "hwp" || fileType === "doc") {
    text = extractTextFromLegacyBinary(buffer);
    extractionMethod = `${fileType}-binary-fallback`;
  } else {
    text = extractTextFromLegacyBinary(buffer);
    extractionMethod = "binary-fallback";
  }

  const normalized = normalizeDocumentText(text);

  if (!normalized) {
    throw new Error("파일에서 읽을 수 있는 텍스트를 찾지 못했습니다. 텍스트가 포함된 PDF, DOCX, HWPX 또는 TXT 파일로 다시 업로드해주세요.");
  }

  return {
    text: normalized,
    meta: {
      fileName,
      fileType,
      extractionMethod,
      textLength: normalized.length
    }
  };
}

module.exports = async function extractTextHandler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request) || "{}");
    const buffer = decodeBase64Payload(body);

    if (!buffer.length) {
      sendJson(response, 400, { ok: false, error: "업로드 파일 데이터가 비어 있습니다." });
      return;
    }

    const result = extractText({
      fileName: String(body.fileName || ""),
      mimeType: String(body.mimeType || ""),
      buffer
    });

    sendJson(response, 200, { ok: true, ...result });
  } catch (error) {
    console.error("Document text extraction failed.", error);
    sendJson(response, 500, {
      ok: false,
      error: error.message || "파일 텍스트 추출 중 오류가 발생했습니다."
    });
  }
};
