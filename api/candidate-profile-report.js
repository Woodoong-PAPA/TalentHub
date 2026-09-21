const {
  AlignmentType,
  Document,
  Footer,
  PageNumber,
  Packer,
  Paragraph,
  TextRun
} = require("docx");

const MAX_BODY_BYTES = 500_000;

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

function cleanText(value, limit = 8000) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .trim()
    .slice(0, limit);
}

function safeFileName(value) {
  return cleanText(value, 100).replace(/[\\/:*?"<>|]/g, "_") || "candidate-profile";
}

function textParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { after: options.after == null ? 80 : options.after, line: 320 },
    children: [new TextRun({
      text,
      bold: Boolean(options.bold),
      size: options.size || 21,
      font: "Batang"
    })]
  });
}

function sectionParagraphs(section) {
  const title = cleanText(section.title, 240);
  const body = cleanText(section.body);
  const paragraphs = [
    new Paragraph({
      spacing: { before: 180, after: 90 },
      children: [new TextRun({ text: `□ ${title}`, bold: true, size: 28, font: "Batang" })]
    })
  ];

  body.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed) paragraphs.push(textParagraph(trimmed));
  });
  return paragraphs;
}

module.exports = async function candidateProfileReport(request, response) {
  if (request.method !== "POST") {
    response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: false, error: "Method not allowed." }));
    return;
  }

  try {
    const payload = JSON.parse((await readRequestBody(request)) || "{}");
    const report = payload.report && typeof payload.report === "object" ? payload.report : {};
    const sections = Array.isArray(report.sections) ? report.sections.slice(0, 12) : [];

    if (!cleanText(report.title, 200) || !sections.length) {
      response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: false, error: "보고서 제목과 내용이 필요합니다." }));
      return;
    }

    const children = [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        children: [new TextRun({ text: "CONFIDENTIAL · TALENT ACQUISITION", size: 16, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 220 },
        children: [new TextRun({ text: cleanText(report.title, 200), bold: true, size: 34, font: "Batang" })]
      }),
      ...sections.flatMap(sectionParagraphs)
    ];
    const document = new Document({
      styles: {
        default: {
          document: {
            run: { font: "Batang", size: 21 },
            paragraph: { spacing: { line: 320 } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 850, right: 850, bottom: 760, left: 850 }
          }
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: "Candidate Profile Generator · ", size: 16, font: "Arial" }), new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "Arial" })]
            })]
          })
        },
        children
      }]
    });
    const buffer = await Packer.toBuffer(document);
    const fileName = `${safeFileName(report.title)}.docx`;
    response.writeHead(200, {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Content-Length": buffer.length,
      "Cache-Control": "no-store"
    });
    response.end(buffer);
  } catch (error) {
    console.error("Candidate profile DOCX generation failed.", error.message);
    response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: false, error: "DOCX 생성 중 오류가 발생했습니다." }));
  }
};
