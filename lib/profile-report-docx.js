"use strict";

// Generates candidate "Profile" Word reports (.docx) in the internal
// Samsung DX formats. Three layouts are supported, selectable per report:
//
//   A. Interview profile  (buildInterviewProfileDocx)
//   B. Basic profile      (buildBasicProfileDocx)
//   C. Summary table      (buildSummaryTableDocx)
//
// Typography / layout (internal spec):
//   • Font Batang (바탕체); 【 】/□ 14pt, "-" 13pt, "·" 12pt
//   • Line spacing 1.43; spacing-after 【 】16 / □ 12 / "-" 10 / "·" 6pt
//   • NO paragraph indentation in the body — alignment uses spaces only:
//       body "-" bullet = 2 leading spaces, "·" bullet = 4 leading spaces,
//       "-" bullet inside a table = no leading spaces.
//   • □ marker itself is NOT bold; only the text after it is bold.
//   • Sub-annotations render as borderless, no-fill "Simple Text Box" (VML
//     t202) floating in front of text, so they can be dragged into place.
//   • A face photo is placed per format (A/C 성명 cell, B top-right).
//   • Everything must fit on one page → keep text dense but single-line.

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Textbox,
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
const JSZip = require("jszip");

const FONT = "바탕체";
const HP = 2; // half-points per point

const SZ_TITLE = 14 * HP;
const SZ_HEADER = 14 * HP;
const SZ_DASH = 13 * HP;
const SZ_BULLET = 12 * HP;
const SZ_TABLE = 11 * HP;
const SZ_TABLE_SMALL = 10 * HP;
const SZ_NOTE = 8 * HP;
const SZ_SUBTITLE = 9 * HP;

const LINE = 343; // 1.43 * 240

const AF_TITLE = 16 * 20;
const AF_HEADER = 12 * 20;
const AF_DASH = 10 * 20;
const AF_BULLET = 6 * 20;
const AF_SET = 0;

const TITLE_INDENT = -168; // -0.6 char at 14pt
const GRAY = "808080";

// Strip stray markdown emphasis (_ , *) that the model sometimes wraps text
// with; these must never appear in the printed report.
function cleanText(value) {
  return String(value == null ? "" : value).replace(/[_*]/g, "").trim();
}

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

function bodyPara(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    spacing: sp(opts.after, opts.before),
    alignment: opts.alignment,
    tabStops: opts.tabStops
  });
}

// □ section header — the "□" marker is NOT bold, only the label is.
function sectionHeader(label, trailing) {
  const kids = [run("□ ", { size: SZ_HEADER, bold: false }), run(label, { size: SZ_HEADER, bold: true })];
  if (trailing) {
    kids.push(run(" : ", { size: SZ_HEADER, bold: true }));
    kids.push(run(trailing, { size: SZ_HEADER, bold: true }));
  }
  return new Paragraph({ children: kids, spacing: { before: 200, after: AF_HEADER, line: LINE, lineRule: "auto" } });
}

// Borderless, no-fill Simple Text Box (VML t202) floating in front of text.
// The library renders a valid t202 shape; packDoc() then strips its border
// and fill via post-processing (the library exposes no stroke/fill option).
function footnoteBox(text, opts = {}) {
  return new Textbox({
    style: {
      width: (opts.width || 300) + "pt",
      wrapStyle: "none",
      positionHorizontal: "left",
      positionHorizontalRelative: "text",
      positionVertical: "absolute",
      positionVerticalRelative: "line"
    },
    children: [
      new Paragraph({
        spacing: { after: 0, line: 240, lineRule: "auto" },
        children: [run(cleanText(text), { size: opts.size || SZ_NOTE, color: GRAY })]
      })
    ]
  });
}

function pushNotes(target, notes, width) {
  (notes || []).forEach((n) => target.push(footnoteBox(n, { width })));
}

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
function noBorders() {
  return { top: NONE, bottom: NONE, left: NONE, right: NONE };
}

function photoParagraph(photo, align) {
  return new Paragraph({
    alignment: align || AlignmentType.CENTER,
    spacing: { after: 40, line: LINE, lineRule: "auto" },
    children: [
      new ImageRun({ data: photo.buffer, transformation: { width: photo.width || 90, height: photo.height || 112 } })
    ]
  });
}

// Underlined "  - headline" + "    · bullet" detail lines + gray note boxes.
function competencyParagraphs(competencies) {
  const out = [];
  (competencies || []).forEach((block) => {
    out.push(
      bodyPara(
        [run("  - ", { size: SZ_DASH, bold: true }), run(cleanText(block.headline), { size: SZ_DASH, bold: true, underline: true })],
        { after: AF_DASH }
      )
    );
    (block.bullets || []).forEach((b) => {
      const text = typeof b === "string" ? b : b.text;
      out.push(bodyPara([run("    · " + cleanText(text), { size: SZ_BULLET })], { after: AF_BULLET }));
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
    const parts = [run((e.degree || "") + ") ", { size: sz }), run(cleanText(e.school), { size: sz })];
    if (e.major) parts.push(run(", " + cleanText(e.major), { size: sz }));
    if (e.year) {
      parts.push(new TextRun({ text: "\t", font: { name: FONT } }));
      parts.push(run("('" + String(e.year).replace(/^'/, "") + ")", { size: sz }));
    }
    out.push(new Paragraph({ spacing: { after: e.note ? 0 : 20, line: LINE, lineRule: "auto" }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: parts }));
    if (e.note) out.push(footnoteBox(e.note, { width: 180 }));
  });
  return out;
}

// Career lines for tables: no leading spaces before "-".
function careerLines(career, size) {
  const sz = size || SZ_TABLE;
  const out = [];
  (career || []).forEach((c) => {
    const head = [run("- ", { size: sz })];
    if (c.country) head.push(run(c.country, { size: sz }));
    head.push(run(cleanText(c.org), { size: sz }));
    if (c.title) head.push(run(", " + cleanText(c.title), { size: sz }));
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

  children.push(sectionHeader("전문 역량", cleanText(data.competencyTitle)));
  competencyParagraphs(data.competencies).forEach((p) => children.push(p));
  (data.competencyNotes || []).forEach((n) => {
    const obj = typeof n === "string" ? { text: n } : n;
    children.push(bodyPara([run("※ " + cleanText(obj.text), { size: SZ_DASH })], { after: obj.note ? AF_SET : AF_DASH }));
    if (obj.note) children.push(footnoteBox(obj.note, { width: 320 }));
  });

  children.push(sectionHeader("Talking Point"));
  (data.talkingPoints || []).forEach((tp) => children.push(bodyPara([run("  - " + cleanText(tp), { size: SZ_DASH })], { after: AF_DASH })));

  return packDoc(children);
}

// ======================================================================
// Format B — Basic profile
// ======================================================================

function personalBlockB(data) {
  const left = [];
  if (data.age || data.birthMark) {
    const ageText = (data.age ? data.age + "세" : "") + (data.birthMark ? " (" + data.birthMark + ")" : "");
    left.push(bodyPara([run("  - 연 령 : ", { size: SZ_DASH }), run(ageText.trim(), { size: SZ_DASH })], { after: AF_DASH }));
  }
  const edu = data.education || [];
  edu.forEach((e, i) => {
    const parts = [run(i === 0 ? "  - 학 력 : " : "            ", { size: SZ_DASH })];
    parts.push(run((e.degree || "") + ") " + cleanText(e.school) + (e.major ? ", " + cleanText(e.major) : ""), { size: SZ_DASH }));
    if (e.year) {
      parts.push(new TextRun({ text: "\t", font: { name: FONT } }));
      parts.push(run("('" + String(e.year).replace(/^'/, "") + ")", { size: SZ_DASH }));
    }
    const isLast = i === edu.length - 1;
    left.push(new Paragraph({ spacing: { after: e.note ? AF_SET : isLast ? AF_DASH : AF_SET, line: LINE, lineRule: "auto" }, tabStops: [{ type: TabStopType.LEFT, position: 3200 }], children: parts }));
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
    const head = [run("  - ", { size: SZ_DASH })];
    if (c.country) head.push(run(c.country, { size: SZ_DASH }));
    head.push(run(cleanText(c.org), { size: SZ_DASH }));
    if (c.title) head.push(run(", " + cleanText(c.title), { size: SZ_DASH }));
    if (c.period) {
      head.push(new TextRun({ text: "\t", font: { name: FONT } }));
      head.push(run("(" + c.period + ")", { size: SZ_DASH }));
    }
    out.push(new Paragraph({ spacing: { after: c.note ? AF_SET : AF_DASH, line: LINE, lineRule: "auto" }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: head }));
    if (c.note) out.push(footnoteBox(c.note, { width: 240 }));
  });
  return out;
}

function buildBasicProfileDocx(data) {
  const children = [];
  const titleLine = data.basicTitle || [data.orgShort, data.name].filter(Boolean).join(", ") + " 프로필";
  children.push(new Paragraph({ spacing: sp(AF_SET), indent: { left: TITLE_INDENT }, children: [run("【 " + cleanText(titleLine) + " 】", { size: SZ_TITLE, bold: true })] }));
  if (data.orgFull) children.push(new Paragraph({ spacing: { after: AF_TITLE, line: LINE, lineRule: "auto" }, children: [run("* " + cleanText(data.orgFull), { size: SZ_SUBTITLE, color: GRAY })] }));

  children.push(sectionHeader("인적사항"));
  personalBlockB(data).forEach((p) => children.push(p));

  children.push(sectionHeader("주요경력"));
  careerLinesB(data.career).forEach((p) => children.push(p));

  children.push(sectionHeader("참고사항"));
  competencyParagraphs(data.competencies).forEach((p) => children.push(p));
  (data.competencyNotes || []).forEach((n) => {
    const obj = typeof n === "string" ? { text: n } : n;
    children.push(bodyPara([run("※ " + cleanText(obj.text), { size: SZ_DASH, bold: true })], { before: 80, after: obj.note ? AF_SET : AF_DASH }));
    if (obj.note) children.push(footnoteBox(obj.note, { width: 360 }));
  });

  return packDoc(children);
}

// ======================================================================
// Format C — Summary table (3~5 candidates)
// ======================================================================

function summaryNameCell(data) {
  const kids = [];
  if (data.category) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40, line: LINE, lineRule: "auto" }, children: [run("【 " + cleanText(data.category) + " 】", { size: SZ_TABLE_SMALL, bold: true })] }));
  if (data.photo && data.photo.buffer) kids.push(photoParagraph({ buffer: data.photo.buffer, width: data.photo.width || 66, height: data.photo.height || 82 }, AlignmentType.CENTER));
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
  if (data.competencyTitle) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60, line: LINE, lineRule: "auto" }, children: [run(cleanText(data.competencyTitle), { size: SZ_TABLE, bold: true, underline: true })] }));
  (data.competencies || []).forEach((block) => {
    (block.bullets || []).forEach((b) => {
      const text = typeof b === "string" ? b : b.text;
      kids.push(new Paragraph({ spacing: { after: 40, line: LINE, lineRule: "auto" }, children: [run("· " + cleanText(text), { size: SZ_TABLE })] }));
    });
  });
  (data.summaryBullets || []).forEach((t) => kids.push(new Paragraph({ spacing: { after: 40, line: LINE, lineRule: "auto" }, children: [run("· " + cleanText(t), { size: SZ_TABLE })] })));
  if (data.reviewNote) kids.push(new Paragraph({ spacing: { before: 40, after: 0, line: LINE, lineRule: "auto" }, children: [run("※ " + cleanText(data.reviewNote), { size: SZ_TABLE })] }));
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

// Add stroked="f" filled="f" to every VML shape so the annotation text
// boxes render with no border and no fill (the library exposes no option).
async function makeTextboxesBorderless(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const entry = zip.file("word/document.xml");
  if (!entry) return buffer;
  let xml = await entry.async("string");
  xml = xml.replace(/<v:shape (?![^>]*\bstroked=)/g, '<v:shape stroked="f" filled="f" ');
  zip.file("word/document.xml", xml);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

async function packDoc(children) {
  const doc = new Document({
    styles: { default: { document: { run: { font: { name: FONT, hint: "eastAsia" }, size: SZ_BULLET } } } },
    sections: [{ properties: { page: { margin: { top: 1100, bottom: 1000, left: 1300, right: 1300 } } }, children }]
  });
  const buffer = await Packer.toBuffer(doc);
  return makeTextboxesBorderless(buffer);
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
