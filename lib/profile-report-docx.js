"use strict";

// Generates candidate "Profile" Word reports (.docx) in the internal
// Samsung DX formats. Three layouts are supported, selectable per report:
//
//   A. Interview profile  (buildInterviewProfileDocx)
//      【 {name}({orgShort}) Profile 】
//      □ 인적 사항 (photo/성명/학력/주요경력 table)
//      □ 전문 역량 : ...   □ Talking Point
//
//   B. Basic profile      (buildBasicProfileDocx)
//      【 {orgShort}, {name} 프로필 】  (+ org full-name subtitle, photo top-right)
//      □ 인적사항 (연령/학력 inline)   □ 주요경력   □ 참고사항
//
//   C. Summary table      (buildSummaryTableDocx)
//      □ {groupLabel} : {N}名
//      성명 | 주요경력 및 학력 | 전문역량   (one row per candidate)
//
// Main body text is Batang (바탕체) 14pt; sub-annotations render smaller.
// All renderers are data-driven from the shared candidate shape documented
// at the bottom of this file, so the AI extraction layer only produces JSON.

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  VerticalAlign,
  TabStopType,
  TabStopPosition
} = require("docx");

const FONT = "바탕체";
const PT = 2; // docx sizes are in half-points, so 14pt -> 28

const SIZE_BODY = 14 * PT;
const SIZE_HEADER = 15 * PT;
const SIZE_TITLE = 15 * PT;
const SIZE_SUBTITLE = 9 * PT;
const SIZE_NOTE = 9 * PT;
const SIZE_TABLE = 11 * PT;
const SIZE_TABLE_NOTE = 8 * PT;

function run(text, opts = {}) {
  return new TextRun({
    text: text == null ? "" : String(text),
    font: { name: FONT, hint: "eastAsia" },
    size: opts.size || SIZE_BODY,
    bold: !!opts.bold,
    underline: opts.underline ? { type: "single" } : undefined,
    color: opts.color
  });
}

function para(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    spacing: { after: opts.after == null ? 60 : opts.after, line: opts.line || 300, before: opts.before },
    indent: opts.indent,
    alignment: opts.alignment,
    tabStops: opts.tabStops
  });
}

// A section header line such as "□ 인적 사항" or "□ 전문 역량 : ...".
function sectionHeader(label, trailing) {
  const kids = [run("□ ", { size: SIZE_HEADER, bold: true }), run(label, { size: SIZE_HEADER, bold: true })];
  if (trailing) {
    kids.push(run(" : ", { size: SIZE_HEADER, bold: true }));
    kids.push(run(trailing, { size: SIZE_HEADER, bold: true }));
  }
  return new Paragraph({ children: kids, spacing: { before: 240, after: 120, line: 300 } });
}

function smallNote(text, leftIndent) {
  return new Paragraph({
    spacing: { after: 40, line: 240 },
    indent: { left: leftIndent || 560 },
    children: [run("* " + text, { size: SIZE_NOTE })]
  });
}

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const LINE = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
function noBorders() {
  return { top: NONE, bottom: NONE, left: NONE, right: NONE };
}
function cellBorders() {
  return { top: LINE, bottom: LINE, left: LINE, right: LINE, insideHorizontal: LINE, insideVertical: LINE };
}

function photoParagraph(photo, align) {
  return new Paragraph({
    alignment: align || AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [
      new ImageRun({
        data: photo.buffer,
        transformation: { width: photo.width || 90, height: photo.height || 110 }
      })
    ]
  });
}

// Renders competency blocks (shared by A and B). Each block is an
// underlined "- headline" followed by "· bullet" detail lines and optional
// "* note" annotations.
function competencyParagraphs(competencies, bulletIndent) {
  const paras = [];
  (competencies || []).forEach((block) => {
    paras.push(
      para([run("- ", { bold: true }), run(block.headline || "", { bold: true, underline: true })], {
        after: 80,
        line: 320
      })
    );
    (block.bullets || []).forEach((b) => {
      const text = typeof b === "string" ? b : b.text;
      paras.push(para([run("· " + (text || ""))], { indent: { left: bulletIndent || 360 }, after: 40, line: 320 }));
      const notes = typeof b === "string" ? [] : b.notes || [];
      notes.forEach((n) => paras.push(smallNote(n, (bulletIndent || 360) + 200)));
    });
  });
  return paras;
}

// ======================================================================
// Format A — Interview profile
// ======================================================================

function personCellA(data) {
  const kids = [];
  if (data.photo && data.photo.buffer) kids.push(photoParagraph(data.photo, AlignmentType.CENTER));
  kids.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [run(data.name || "", { size: SIZE_TABLE, bold: true })]
    })
  );
  if (data.birthLine) {
    kids.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
        children: [run("(" + data.birthLine + ")", { size: SIZE_TABLE_NOTE })]
      })
    );
  }
  return new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: kids
  });
}

function educationLines(education, size) {
  const sz = size || SIZE_TABLE;
  const lines = [];
  (education || []).forEach((e) => {
    const parts = [run((e.degree || "") + ") ", { size: sz }), run(e.school || "", { size: sz })];
    if (e.major) parts.push(run(", " + e.major, { size: sz }));
    if (e.year) {
      parts.push(new TextRun({ text: "\t", font: { name: FONT } }));
      parts.push(run("('" + String(e.year).replace(/^'/, "") + ")", { size: sz }));
    }
    lines.push(
      new Paragraph({
        spacing: { after: e.note ? 0 : 20, line: 260 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: parts
      })
    );
    if (e.note) lines.push(smallNote(e.note, 220));
  });
  return lines;
}

function careerLines(career, size) {
  const sz = size || SIZE_TABLE;
  const lines = [];
  (career || []).forEach((c) => {
    const head = [run("- ", { size: sz })];
    if (c.country) head.push(run(c.country, { size: sz }));
    head.push(run(c.org || "", { size: sz }));
    if (c.title) head.push(run(", " + c.title, { size: sz }));
    if (c.period) {
      head.push(new TextRun({ text: "\t", font: { name: FONT } }));
      head.push(run("(" + c.period + ")", { size: sz }));
    }
    lines.push(
      new Paragraph({
        spacing: { after: c.note ? 0 : 20, line: 260 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: head
      })
    );
    if (c.note) lines.push(smallNote(c.note, 220));
  });
  return lines;
}

function personalTableA(data) {
  const headerCell = (label) =>
    new TableCell({
      verticalAlign: VerticalAlign.CENTER,
      shading: { fill: "F2F2F2" },
      margins: { top: 40, bottom: 40, left: 80, right: 80 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
          children: [run(label, { size: SIZE_TABLE, bold: true })]
        })
      ]
    });
  const cell = (children) =>
    new TableCell({
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: children.length ? children : [new Paragraph({ children: [run("", { size: SIZE_TABLE })] })]
    });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [2000, 3200, 4800],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [headerCell("성 명"), headerCell("학 력"), headerCell("주요 경력")]
      }),
      new TableRow({
        children: [personCellA(data), cell(educationLines(data.education)), cell(careerLines(data.career))]
      })
    ]
  });
}

function buildInterviewProfileDocx(data) {
  const children = [];
  const titleOrg = data.orgShort ? "(" + data.orgShort + ")" : "";
  children.push(
    new Paragraph({
      spacing: { after: 200, line: 320 },
      children: [run("【 " + (data.name || "") + titleOrg + " Profile 】", { size: SIZE_TITLE, bold: true })]
    })
  );

  children.push(sectionHeader("인적 사항"));
  children.push(personalTableA(data));

  children.push(sectionHeader("전문 역량", data.competencyTitle || ""));
  competencyParagraphs(data.competencies).forEach((p) => children.push(p));
  (data.competencyNotes || []).forEach((n) => children.push(para([run("※ " + n)], { after: 60, line: 300 })));

  children.push(sectionHeader("Talking Point"));
  (data.talkingPoints || []).forEach((tp) => children.push(para([run("- " + tp)], { after: 100, line: 320 })));

  return packDoc(children);
}

// ======================================================================
// Format B — Basic profile
// ======================================================================

function personalBlockB(data) {
  const left = [];
  if (data.age || data.birthMark) {
    const ageText =
      (data.age ? data.age + "세" : "") + (data.birthMark ? " (" + data.birthMark + ")" : "");
    left.push(para([run("- 연 령 : "), run(ageText.trim())], { after: 60, line: 320, indent: { left: 240 } }));
  }
  // Education, with the label only on the first line.
  const edu = data.education || [];
  edu.forEach((e, i) => {
    const parts = [run(i === 0 ? "- 학 력 : " : "          ")];
    parts.push(run((e.degree || "") + ") " + (e.school || "") + (e.major ? ", " + e.major : "")));
    if (e.year) {
      parts.push(new TextRun({ text: "\t", font: { name: FONT } }));
      parts.push(run("('" + String(e.year).replace(/^'/, "") + ")"));
    }
    left.push(
      new Paragraph({
        spacing: { after: e.note ? 0 : 40, line: 320 },
        indent: { left: 240 },
        tabStops: [{ type: TabStopType.LEFT, position: 3200 }],
        children: parts
      })
    );
    if (e.note) left.push(smallNote(e.note, 900));
  });

  if (!(data.photo && data.photo.buffer)) return left;

  // Put the photo at top-right using a borderless 2-column table.
  const row = new TableRow({
    children: [
      new TableCell({ borders: noBorders(), width: { size: 78, type: WidthType.PERCENTAGE }, children: left }),
      new TableCell({
        borders: noBorders(),
        width: { size: 22, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        children: [photoParagraph(data.photo, AlignmentType.RIGHT)]
      })
    ]
  });
  return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: noBorders(), rows: [row] })];
}

function careerLinesB(career) {
  const lines = [];
  (career || []).forEach((c) => {
    const head = [run("- ")];
    if (c.country) head.push(run(c.country));
    head.push(run(c.org || ""));
    if (c.title) head.push(run(", " + c.title));
    if (c.period) {
      head.push(new TextRun({ text: "\t", font: { name: FONT } }));
      head.push(run("(" + c.period + ")"));
    }
    lines.push(
      new Paragraph({
        spacing: { after: c.note ? 0 : 80, line: 320 },
        indent: { left: 240 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: head
      })
    );
    if (c.note) lines.push(smallNote(c.note, 600));
  });
  return lines;
}

function buildBasicProfileDocx(data) {
  const children = [];
  const titleLine = data.basicTitle || [data.orgShort, data.name].filter(Boolean).join(", ") + " 프로필";
  children.push(new Paragraph({ spacing: { after: 20, line: 320 }, children: [run("【 " + titleLine + " 】", { size: SIZE_TITLE, bold: true })] }));
  if (data.orgFull) {
    children.push(new Paragraph({ spacing: { after: 160 }, indent: { left: 120 }, children: [run("* " + data.orgFull, { size: SIZE_SUBTITLE })] }));
  }

  children.push(sectionHeader("인적사항"));
  personalBlockB(data).forEach((p) => children.push(p));

  children.push(sectionHeader("주요경력"));
  careerLinesB(data.career).forEach((p) => children.push(p));

  children.push(sectionHeader("참고사항"));
  competencyParagraphs(data.competencies, 300).forEach((p) => children.push(p));
  (data.competencyNotes || []).forEach((n) => {
    const obj = typeof n === "string" ? { text: n } : n;
    children.push(para([run("※ " + (obj.text || "")), ], { before: 80, after: obj.note ? 0 : 60, line: 320 }));
    if (obj.note) children.push(smallNote(obj.note, 400));
  });

  return packDoc(children);
}

// ======================================================================
// Format C — Summary table (3~5 candidates)
// ======================================================================

function summaryNameCell(data) {
  const kids = [];
  if (data.category) {
    kids.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [run("【 " + data.category + " 】", { size: SIZE_TABLE_NOTE, bold: true })]
      })
    );
  }
  if (data.photo && data.photo.buffer) kids.push(photoParagraph(data.photo, AlignmentType.CENTER));
  kids.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [run(data.name || "", { size: SIZE_TABLE, bold: true })]
    })
  );
  if (data.birthLine) {
    kids.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
        children: [run("(" + data.birthLine + ")", { size: SIZE_TABLE_NOTE })]
      })
    );
  }
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 60, right: 60 }, children: kids });
}

function summaryCareerCell(data) {
  const kids = careerLines(data.career, SIZE_TABLE);
  educationLines(data.education, SIZE_TABLE).forEach((p) => kids.push(p));
  if (!kids.length) kids.push(new Paragraph({ children: [run("", { size: SIZE_TABLE })] }));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 100, right: 80 }, children: kids });
}

function summaryCompetencyCell(data) {
  const kids = [];
  if (data.competencyTitle) {
    kids.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60, line: 260 },
        children: [run(data.competencyTitle, { size: SIZE_TABLE, bold: true, underline: true })]
      })
    );
  }
  (data.competencies || []).forEach((block) => {
    (block.bullets || []).forEach((b) => {
      const text = typeof b === "string" ? b : b.text;
      kids.push(new Paragraph({ spacing: { after: 40, line: 260 }, children: [run("· " + (text || ""), { size: SIZE_TABLE })] }));
    });
  });
  // Some summary rows carry the short competency bullets directly.
  (data.summaryBullets || []).forEach((t) =>
    kids.push(new Paragraph({ spacing: { after: 40, line: 260 }, children: [run("· " + t, { size: SIZE_TABLE })] }))
  );
  if (data.reviewNote) {
    kids.push(new Paragraph({ spacing: { before: 40, after: 0, line: 260 }, children: [run("※ " + data.reviewNote, { size: SIZE_TABLE })] }));
  }
  if (!kids.length) kids.push(new Paragraph({ children: [run("", { size: SIZE_TABLE })] }));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 100, right: 80 }, children: kids });
}

function buildSummaryTableDocx(input) {
  const candidates = (input && input.candidates) || [];
  const groupLabel = (input && input.groupLabel) || "Candidate Table";
  const children = [];

  children.push(sectionHeader(groupLabel, candidates.length + "名"));

  const headerCell = (label) =>
    new TableCell({
      verticalAlign: VerticalAlign.CENTER,
      shading: { fill: "F2F2F2" },
      margins: { top: 40, bottom: 40, left: 60, right: 60 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [run(label, { size: SIZE_TABLE, bold: true })] })]
    });

  const rows = [
    new TableRow({ tableHeader: true, children: [headerCell("성 명"), headerCell("주요경력 및 학력"), headerCell("전문역량")] })
  ];
  candidates.forEach((c) => {
    rows.push(new TableRow({ children: [summaryNameCell(c), summaryCareerCell(c), summaryCompetencyCell(c)] }));
  });

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, columnWidths: [1900, 4200, 3900], rows }));

  return packDoc(children);
}

// ======================================================================

function packDoc(children) {
  const doc = new Document({
    styles: { default: { document: { run: { font: { name: FONT, hint: "eastAsia" }, size: SIZE_BODY } } } },
    sections: [
      {
        properties: { page: { margin: { top: 1200, bottom: 1200, left: 1400, right: 1400 } } },
        children
      }
    ]
  });
  return Packer.toBuffer(doc);
}

// Dispatch by format id: "interview" (A) | "basic" (B) | "summary" (C).
function buildProfileReportDocx(format, data) {
  switch (format) {
    case "basic":
      return buildBasicProfileDocx(data);
    case "summary":
      return buildSummaryTableDocx(data);
    case "interview":
    default:
      return buildInterviewProfileDocx(data);
  }
}

module.exports = {
  buildProfileReportDocx,
  buildInterviewProfileDocx,
  buildBasicProfileDocx,
  buildSummaryTableDocx
};

// ----------------------------------------------------------------------
// Shared candidate shape (all fields optional unless noted):
//
// {
//   name, orgShort, orgFull, basicTitle, category, role,
//   photo: { buffer, width, height },
//   birthLine,          // "'86生, 40세"  (A/C 성명 cell)
//   age, birthMark,     // 41, "'85年生"  (B 연령 line)
//   education: [{ degree:"博|碩|學", school, major, year, note }],
//   career:    [{ country:"美|韓|英", org, title, period, note }],
//   competencyTitle,    // "AI/Tech 분야 투자 전문가"
//   competencies: [{ headline, bullets: [ "text" | { text, notes:[..] } ] }],
//   competencyNotes: [ "text" | { text, note } ],   // ※ lines (A/B)
//   summaryBullets: [ "..." ],   // optional short bullets for C
//   reviewNote,         // "M&A 후보자로 검토"  (C ※ line)
//   talkingPoints: [ "..." ]     // A only
// }
//
// For format C, buildSummaryTableDocx expects { groupLabel, candidates:[...] }.
// ----------------------------------------------------------------------
