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
// Typography (per the internal spec):
//   • Font: Batang (바탕체)
//   • Sizes: 【 】 / □ = 14pt, "-" = 13pt, "·" = 12pt
//   • Line spacing: 1.43 multiple everywhere
//   • Paragraph spacing-after: 【 】 16pt · □ 12pt · "-" 10pt · "·" 6pt
//     (0pt between lines that belong to one continued statement/set)
//   • Title first line: left indent -0.6 char
//   • Sub-annotations render as borderless GRAY simple text boxes (VML t202)
//     so recruiters can reposition them under the exact word in Word.
//
// All renderers are data-driven from the shared candidate shape documented
// at the bottom of this file, so the AI extraction layer only produces JSON.

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  ImportedXmlComponent,
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
const HP = 2; // half-points per point (docx run sizes)

// Run sizes (half-points)
const SZ_TITLE = 14 * HP;
const SZ_HEADER = 14 * HP;
const SZ_DASH = 13 * HP;
const SZ_BULLET = 12 * HP;
const SZ_TABLE = 11 * HP;
const SZ_TABLE_SMALL = 10 * HP;
const SZ_NOTE = 8 * HP; // gray text-box annotations
const SZ_SUBTITLE = 9 * HP;

// Line spacing: 1.43 multiple -> 1.43 * 240 = 343 (lineRule auto)
const LINE = 343;

// Paragraph spacing-after (twips; 1pt = 20 twips)
const AF_TITLE = 16 * 20;
const AF_HEADER = 12 * 20;
const AF_DASH = 10 * 20;
const AF_BULLET = 6 * 20;
const AF_SET = 0; // between lines of one continued set

// Title first-line indent: -0.6 char at 14pt ≈ -0.6 * 14pt ≈ -168 twips
const TITLE_INDENT = -168;

const GRAY = "808080";

function run(text, opts = {}) {
  return new TextRun({
    text: text == null ? "" : String(text),
    font: { name: FONT, hint: "eastAsia" },
    size: opts.size || SZ_BULLET,
    bold: !!opts.bold,
    underline: opts.underline ? { type: "single" } : undefined,
    color: opts.color
  });
}

function sp(after, before) {
  return { after: after == null ? AF_BULLET : after, before, line: LINE, lineRule: "auto" };
}

function para(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    spacing: sp(opts.after, opts.before),
    indent: opts.indent,
    alignment: opts.alignment,
    tabStops: opts.tabStops
  });
}

// □ section header ("□ 인적 사항" / "□ 전문 역량 : ...").
function sectionHeader(label, trailing) {
  const kids = [run("□ ", { size: SZ_HEADER, bold: true }), run(label, { size: SZ_HEADER, bold: true })];
  if (trailing) {
    kids.push(run(" : ", { size: SZ_HEADER, bold: true }));
    kids.push(run(trailing, { size: SZ_HEADER, bold: true }));
  }
  return new Paragraph({ children: kids, spacing: { before: 200, after: AF_HEADER, line: LINE, lineRule: "auto" } });
}

function xmlEscape(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let fnSeq = 0;
// A borderless gray "Simple Text Box" (VML t202) holding an annotation.
// Floating + no wrap, so it sits just under the anchor line and can be
// dragged under the exact word in Word. Returned as a block-level child.
function footnoteBox(text, opts = {}) {
  const widthPt = opts.width || 320;
  const size = opts.size || SZ_NOTE;
  const id = "fn" + (++fnSeq);
  const xml =
    '<w:p><w:pPr><w:spacing w:after="0" w:line="' + LINE + '" w:lineRule="auto"/></w:pPr>' +
    "<w:r><w:pict>" +
    '<v:shape id="' + id + '" type="#_x0000_t202" ' +
    'style="position:absolute;left:0;width:' + widthPt + "pt;height:12pt;" +
    "mso-position-horizontal:left;mso-position-horizontal-relative:text;" +
    "mso-position-vertical:absolute;mso-position-vertical-relative:line;mso-wrap-style:none" +
    '" stroked="f" filled="f">' +
    '<v:textbox style="mso-fit-shape-to-text:t;" inset="0,0,0,0">' +
    '<w:txbxContent><w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>' +
    "<w:r><w:rPr>" +
    '<w:rFonts w:ascii="' + FONT + '" w:eastAsia="' + FONT + '" w:hAnsi="' + FONT + '" w:cs="' + FONT + '"/>' +
    '<w:color w:val="' + GRAY + '"/><w:sz w:val="' + size + '"/><w:szCs w:val="' + size + '"/>' +
    "</w:rPr>" +
    '<w:t xml:space="preserve">' + xmlEscape(text) + "</w:t></w:r></w:p></w:txbxContent>" +
    "</v:textbox></v:shape></w:pict></w:r></w:p>";
  return ImportedXmlComponent.fromXmlString(xml);
}

function pushNotes(target, notes, width) {
  (notes || []).forEach((n) => target.push(footnoteBox(n, { width })));
}

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
function noBorders() {
  return { top: NONE, bottom: NONE, left: NONE, right: NONE };
}

function photoParagraph(photo, align) {
  return new Paragraph({
    alignment: align || AlignmentType.CENTER,
    spacing: { after: 40, line: LINE, lineRule: "auto" },
    children: [
      new ImageRun({ data: photo.buffer, transformation: { width: photo.width || 90, height: photo.height || 110 } })
    ]
  });
}

// Underlined "- headline" + "· bullet" detail lines + gray note boxes.
// Shared by formats A and B.
function competencyParagraphs(competencies, bulletIndent) {
  const out = [];
  (competencies || []).forEach((block) => {
    out.push(
      para([run("- ", { size: SZ_DASH, bold: true }), run(block.headline || "", { size: SZ_DASH, bold: true, underline: true })], {
        after: AF_DASH
      })
    );
    (block.bullets || []).forEach((b) => {
      const text = typeof b === "string" ? b : b.text;
      out.push(para([run("· " + (text || ""), { size: SZ_BULLET })], { indent: { left: bulletIndent || 360 }, after: AF_BULLET }));
      pushNotes(out, typeof b === "string" ? [] : b.notes, 300);
    });
  });
  return out;
}

// ======================================================================
// Format A — Interview profile
// ======================================================================

function personCellA(data) {
  const kids = [];
  if (data.photo && data.photo.buffer) kids.push(photoParagraph(data.photo, AlignmentType.CENTER));
  kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE, lineRule: "auto" }, children: [run(data.name || "", { size: SZ_TABLE, bold: true })] }));
  if (data.birthLine) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE, lineRule: "auto" }, children: [run("(" + data.birthLine + ")", { size: SZ_TABLE_SMALL })] }));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: kids });
}

function educationLines(education, size) {
  const sz = size || SZ_TABLE;
  const out = [];
  (education || []).forEach((e) => {
    const parts = [run((e.degree || "") + ") ", { size: sz }), run(e.school || "", { size: sz })];
    if (e.major) parts.push(run(", " + e.major, { size: sz }));
    if (e.year) {
      parts.push(new TextRun({ text: "\t", font: { name: FONT } }));
      parts.push(run("('" + String(e.year).replace(/^'/, "") + ")", { size: sz }));
    }
    out.push(new Paragraph({ spacing: { after: e.note ? 0 : 20, line: LINE, lineRule: "auto" }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: parts }));
    if (e.note) out.push(footnoteBox(e.note, { width: 180 }));
  });
  return out;
}

function careerLines(career, size) {
  const sz = size || SZ_TABLE;
  const out = [];
  (career || []).forEach((c) => {
    const head = [run("- ", { size: sz })];
    if (c.country) head.push(run(c.country, { size: sz }));
    head.push(run(c.org || "", { size: sz }));
    if (c.title) head.push(run(", " + c.title, { size: sz }));
    if (c.period) {
      head.push(new TextRun({ text: "\t", font: { name: FONT } }));
      head.push(run("(" + c.period + ")", { size: sz }));
    }
    out.push(new Paragraph({ spacing: { after: c.note ? 0 : 20, line: LINE, lineRule: "auto" }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: head }));
    if (c.note) out.push(footnoteBox(c.note, { width: 220 }));
  });
  return out;
}

function personalTableA(data) {
  const headerCell = (label) =>
    new TableCell({ verticalAlign: VerticalAlign.CENTER, shading: { fill: "F2F2F2" }, margins: { top: 40, bottom: 40, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE, lineRule: "auto" }, children: [run(label, { size: SZ_TABLE, bold: true })] })] });
  const cell = (children) =>
    new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: children.length ? children : [new Paragraph({ children: [run("", { size: SZ_TABLE })] })] });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [2000, 3200, 4800],
    rows: [
      new TableRow({ tableHeader: true, children: [headerCell("성 명"), headerCell("학 력"), headerCell("주요 경력")] }),
      new TableRow({ children: [personCellA(data), cell(educationLines(data.education)), cell(careerLines(data.career))] })
    ]
  });
}

function buildInterviewProfileDocx(data) {
  const children = [];
  const titleOrg = data.orgShort ? "(" + data.orgShort + ")" : "";
  children.push(new Paragraph({ spacing: sp(AF_TITLE), indent: { left: TITLE_INDENT }, children: [run("【 " + (data.name || "") + titleOrg + " Profile 】", { size: SZ_TITLE, bold: true })] }));

  children.push(sectionHeader("인적 사항"));
  children.push(personalTableA(data));

  children.push(sectionHeader("전문 역량", data.competencyTitle || ""));
  competencyParagraphs(data.competencies).forEach((p) => children.push(p));
  (data.competencyNotes || []).forEach((n) => {
    const obj = typeof n === "string" ? { text: n } : n;
    children.push(para([run("※ " + (obj.text || ""), { size: SZ_DASH })], { after: obj.note ? AF_SET : AF_DASH }));
    if (obj.note) children.push(footnoteBox(obj.note, { width: 320 }));
  });

  children.push(sectionHeader("Talking Point"));
  (data.talkingPoints || []).forEach((tp) => children.push(para([run("- " + tp, { size: SZ_DASH })], { after: AF_DASH })));

  return packDoc(children);
}

// ======================================================================
// Format B — Basic profile
// ======================================================================

function personalBlockB(data) {
  const left = [];
  if (data.age || data.birthMark) {
    const ageText = (data.age ? data.age + "세" : "") + (data.birthMark ? " (" + data.birthMark + ")" : "");
    left.push(para([run("- 연 령 : ", { size: SZ_DASH }), run(ageText.trim(), { size: SZ_DASH })], { after: AF_DASH, indent: { left: 240 } }));
  }
  const edu = data.education || [];
  edu.forEach((e, i) => {
    const parts = [run(i === 0 ? "- 학 력 : " : "          ", { size: SZ_DASH })];
    parts.push(run((e.degree || "") + ") " + (e.school || "") + (e.major ? ", " + e.major : ""), { size: SZ_DASH }));
    if (e.year) {
      parts.push(new TextRun({ text: "\t", font: { name: FONT } }));
      parts.push(run("('" + String(e.year).replace(/^'/, "") + ")", { size: SZ_DASH }));
    }
    const isLast = i === edu.length - 1;
    left.push(new Paragraph({ spacing: { after: e.note ? AF_SET : isLast ? AF_DASH : AF_SET, line: LINE, lineRule: "auto" }, indent: { left: 240 }, tabStops: [{ type: TabStopType.LEFT, position: 3200 }], children: parts }));
    if (e.note) left.push(footnoteBox(e.note, { width: 200 }));
  });

  if (!(data.photo && data.photo.buffer)) return left;

  const row = new TableRow({
    children: [
      new TableCell({ borders: noBorders(), width: { size: 78, type: WidthType.PERCENTAGE }, children: left }),
      new TableCell({ borders: noBorders(), width: { size: 22, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.TOP, children: [photoParagraph(data.photo, AlignmentType.RIGHT)] })
    ]
  });
  return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: noBorders(), rows: [row] })];
}

function careerLinesB(career) {
  const out = [];
  (career || []).forEach((c) => {
    const head = [run("- ", { size: SZ_DASH })];
    if (c.country) head.push(run(c.country, { size: SZ_DASH }));
    head.push(run(c.org || "", { size: SZ_DASH }));
    if (c.title) head.push(run(", " + c.title, { size: SZ_DASH }));
    if (c.period) {
      head.push(new TextRun({ text: "\t", font: { name: FONT } }));
      head.push(run("(" + c.period + ")", { size: SZ_DASH }));
    }
    out.push(new Paragraph({ spacing: { after: c.note ? AF_SET : AF_DASH, line: LINE, lineRule: "auto" }, indent: { left: 240 }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: head }));
    if (c.note) out.push(footnoteBox(c.note, { width: 240 }));
  });
  return out;
}

function buildBasicProfileDocx(data) {
  const children = [];
  const titleLine = data.basicTitle || [data.orgShort, data.name].filter(Boolean).join(", ") + " 프로필";
  children.push(new Paragraph({ spacing: sp(AF_SET), indent: { left: TITLE_INDENT }, children: [run("【 " + titleLine + " 】", { size: SZ_TITLE, bold: true })] }));
  if (data.orgFull) children.push(new Paragraph({ spacing: { after: AF_TITLE, line: LINE, lineRule: "auto" }, indent: { left: 120 }, children: [run("* " + data.orgFull, { size: SZ_SUBTITLE, color: GRAY })] }));

  children.push(sectionHeader("인적사항"));
  personalBlockB(data).forEach((p) => children.push(p));

  children.push(sectionHeader("주요경력"));
  careerLinesB(data.career).forEach((p) => children.push(p));

  children.push(sectionHeader("참고사항"));
  competencyParagraphs(data.competencies, 300).forEach((p) => children.push(p));
  (data.competencyNotes || []).forEach((n) => {
    const obj = typeof n === "string" ? { text: n } : n;
    children.push(para([run("※ " + (obj.text || ""), { size: SZ_DASH, bold: true })], { before: 80, after: obj.note ? AF_SET : AF_DASH }));
    if (obj.note) children.push(footnoteBox(obj.note, { width: 360 }));
  });

  return packDoc(children);
}

// ======================================================================
// Format C — Summary table (3~5 candidates)
// ======================================================================

function summaryNameCell(data) {
  const kids = [];
  if (data.category) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40, line: LINE, lineRule: "auto" }, children: [run("【 " + data.category + " 】", { size: SZ_TABLE_SMALL, bold: true })] }));
  if (data.photo && data.photo.buffer) kids.push(photoParagraph(data.photo, AlignmentType.CENTER));
  kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE, lineRule: "auto" }, children: [run(data.name || "", { size: SZ_TABLE, bold: true })] }));
  if (data.birthLine) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE, lineRule: "auto" }, children: [run("(" + data.birthLine + ")", { size: SZ_TABLE_SMALL })] }));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 60, right: 60 }, children: kids });
}

function summaryCareerCell(data) {
  const kids = careerLines(data.career, SZ_TABLE);
  educationLines(data.education, SZ_TABLE).forEach((p) => kids.push(p));
  if (!kids.length) kids.push(new Paragraph({ children: [run("", { size: SZ_TABLE })] }));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 100, right: 80 }, children: kids });
}

function summaryCompetencyCell(data) {
  const kids = [];
  if (data.competencyTitle) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60, line: LINE, lineRule: "auto" }, children: [run(data.competencyTitle, { size: SZ_TABLE, bold: true, underline: true })] }));
  (data.competencies || []).forEach((block) => {
    (block.bullets || []).forEach((b) => {
      const text = typeof b === "string" ? b : b.text;
      kids.push(new Paragraph({ spacing: { after: 40, line: LINE, lineRule: "auto" }, children: [run("· " + (text || ""), { size: SZ_TABLE })] }));
    });
  });
  (data.summaryBullets || []).forEach((t) => kids.push(new Paragraph({ spacing: { after: 40, line: LINE, lineRule: "auto" }, children: [run("· " + t, { size: SZ_TABLE })] })));
  if (data.reviewNote) kids.push(new Paragraph({ spacing: { before: 40, after: 0, line: LINE, lineRule: "auto" }, children: [run("※ " + data.reviewNote, { size: SZ_TABLE })] }));
  if (!kids.length) kids.push(new Paragraph({ children: [run("", { size: SZ_TABLE })] }));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 100, right: 80 }, children: kids });
}

function buildSummaryTableDocx(input) {
  const candidates = (input && input.candidates) || [];
  const groupLabel = (input && input.groupLabel) || "Candidate Table";
  const children = [];
  children.push(sectionHeader(groupLabel, candidates.length + "名"));

  const headerCell = (label) =>
    new TableCell({ verticalAlign: VerticalAlign.CENTER, shading: { fill: "F2F2F2" }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE, lineRule: "auto" }, children: [run(label, { size: SZ_TABLE, bold: true })] })] });

  const rows = [new TableRow({ tableHeader: true, children: [headerCell("성 명"), headerCell("주요경력 및 학력"), headerCell("전문역량")] })];
  candidates.forEach((c) => rows.push(new TableRow({ children: [summaryNameCell(c), summaryCareerCell(c), summaryCompetencyCell(c)] })));

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, columnWidths: [1900, 4200, 3900], rows }));
  return packDoc(children);
}

// ======================================================================

function packDoc(children) {
  const doc = new Document({
    styles: { default: { document: { run: { font: { name: FONT, hint: "eastAsia" }, size: SZ_BULLET }, paragraph: { spacing: { line: LINE, lineRule: "auto" } } } } },
    sections: [{ properties: { page: { margin: { top: 1200, bottom: 1200, left: 1400, right: 1400 } } }, children }]
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
