"use strict";

// Generates candidate "Profile" Word reports (.docx) in the internal
// Samsung DX formats (A interview / B basic / C summary table).
//
// Layout rules (internal spec, refined from real output review):
//   • Font Batang (바탕체); 【 】/□ 14pt, "-" 13pt, "·" 12pt.
//   • Body line spacing 1.43; the 인적사항 table uses 1.0.
//   • NO indentation in the body — spaces only: "-" bullet = 2 leading
//     spaces, "·" bullet = 4, table "-" = none.
//   • □ marker not bold (only its label). Headlines/bullets never keep a
//     leading dash/bullet from the model (avoids double "- -").
//   • Every headline / bullet / talking point must fit ONE line. When a line
//     is slightly too long the run is condensed up to 0.3pt (character
//     spacing) to pull it back; the model is also told to keep them short.
//   • Annotations render as transparent Simple Text Boxes (VML t202) that float
//     just below their anchor line (positive z-index, in front of text), like
//     the internal sample. Source citations are not annotations and are dropped.
//   • Photo per format; 성명 column fixed to 2.7cm with name + (yy년생, NN세).

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
  TableLayoutType,
  TabStopType,
  TabStopPosition,
  CommentRangeStart,
  CommentRangeEnd,
  CommentReference
} = require("docx");
const JSZip = require("jszip");

const FONT = "바탕체";
const HP = 2;

const SZ_TITLE = 14 * HP;
const SZ_HEADER = 14 * HP;
const SZ_DASH = 13 * HP; // headline / talking point
const SZ_BULLET = 12 * HP; // · bullet body
const SZ_NAME = 13 * HP; // 성명 cell name (sample)
const SZ_TABLE_A = 12 * HP; // interview table education/career (sample default)
const SZ_TABLE = 11 * HP; // summary table body
const SZ_TABLE_SMALL = 10 * HP;
const SZ_NOTE = 9 * HP; // gray annotation (sample = 9pt)
const SZ_SUBTITLE = 9 * HP;

const LINE = 343; // body 1.43
const LINE_TIGHT = 240; // table 1.0

const AF_TITLE = 16 * 20;
const AF_HEADER = 12 * 20;
const AF_DASH = 10 * 20;
const AF_BULLET = 6 * 20;
const AF_SET = 0;

const TITLE_INDENT = -168;
const GRAY = "808080";

const MARGIN = 1134; // 2cm on every side (2 * 566.93 twips)
const MARGIN_SIDE = MARGIN;
const PAGE_W = 11906; // A4 width in twips
const BODY_BUDGET = PAGE_W - MARGIN_SIDE * 2 - 120; // usable width for one body line
const MAX_CONDENSE = 6; // 0.3pt in twips

// Gray annotation text boxes (role/context tags) are disabled: the floating VML
// shapes caused editing problems in Word. Sources now live in Word comments
// instead. Flip to true to bring the gray annotation boxes back.
const SHOW_TEXTBOX_NOTES = false;

// A note is an explanatory annotation, never a source citation.
function noteAllowed(text) {
  if (!SHOW_TEXTBOX_NOTES) return false;
  const t = String(text || "").trim();
  if (!t) return false;
  return !/linkedin|보도\s*자료|보도자료|출처|게시물|게시글|기사\s*(?:기준|기반)|프로필\s*(?:기준|기반)|공개\s*자료|공식\s*(?:발표|프로필|홈페이지|사이트)|기준\s*$|기반\s*$/i.test(t);
}

// Strip markdown emphasis and any leading bullet/dash the model added.
function cleanText(value) {
  return String(value == null ? "" : value).replace(/[_*]/g, "").trim();
}
function stripLead(value) {
  return String(value == null ? "" : value).replace(/^\s*[-·•∙*]+\s*/, "").trim();
}

function run(text, opts = {}) {
  return new TextRun({
    text: text == null ? "" : String(text),
    font: { name: FONT, hint: "eastAsia" },
    size: opts.size || SZ_BULLET,
    bold: !!opts.bold,
    underline: opts.underline ? { type: "single" } : undefined,
    color: opts.color,
    scale: opts.scale, // horizontal glyph scaling %, e.g. 90 = 장평 90%
    characterSpacing: opts.characterSpacing
  });
}

// Approximate rendered width (twips) of a line at the given half-point size.
function estimateWidthTwips(text, sizeHalf) {
  const pt = sizeHalf / 2;
  let w = 0;
  for (const ch of String(text)) {
    if (ch === " " || ch === "\t") w += pt * 20 * 0.42;
    else if (ch.charCodeAt(0) < 128) w += pt * 20 * 0.52;
    else w += pt * 20;
  }
  return w;
}
// Character spacing (<=0) needed to keep `fullText` within one body line,
// capped at -0.3pt. 0 when it already fits.
function condenseFor(fullText, sizeHalf, budget) {
  const w = estimateWidthTwips(fullText, sizeHalf);
  const b = budget || BODY_BUDGET;
  if (w <= b) return undefined;
  const chars = Array.from(String(fullText)).length || 1;
  const need = Math.ceil((w - b) / chars);
  return -Math.min(need, MAX_CONDENSE);
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

function sectionHeader(label, trailing, opts = {}) {
  const u = !!opts.underline;
  const kids = [run("□ ", { size: SZ_HEADER, bold: false }), run(label, { size: SZ_HEADER, bold: true, underline: u })];
  if (trailing) {
    kids.push(run(" : ", { size: SZ_HEADER, bold: true, underline: u }));
    kids.push(run(trailing, { size: SZ_HEADER, bold: true, underline: u }));
  }
  return new Paragraph({
    children: kids,
    spacing: { before: opts.before == null ? 240 : opts.before, after: opts.after == null ? AF_HEADER : opts.after, line: LINE, lineRule: "auto" }
  });
}

// Annotation rendering has two variants, chosen per request:
//   • "textbox" (PC, default) — a visible floating VML Simple Text Box (t202),
//     draggable/editable in Word. Like the internal sample it is transparent
//     (no fill, no border) and dropped just below its anchor line; the fill/
//     border/offset are applied via post-processing (docx exposes none of them
//     on Textbox).
//   • "inline" (mobile) — a plain gray paragraph. Mobile Word refuses files
//     with floating VML shapes, so mobile downloads use this instead.
let INLINE_NOTES = false;

// Per-document collector of Word review comments (검토 메모). Each fact's
// `source` ({name, url}) becomes a real comment anchored on the fact text, with
// a confirmation date stamped here. Reset per document in buildProfileReportDocx.
let COMMENTS = [];
let COMMENT_SEQ = 0;

function commentAnchor(source) {
  if (!source) return null;
  const name = cleanText(source.name);
  const url = cleanText(source.url);
  if (!name && !url) return null;
  const id = COMMENT_SEQ++;
  const today = new Date().toISOString().slice(0, 10);
  const lines = [new Paragraph({ children: [run("출처: " + (name || "미상"), { size: SZ_NOTE })] })];
  if (url) lines.push(new Paragraph({ children: [run(url, { size: SZ_NOTE })] }));
  lines.push(new Paragraph({ children: [run("확인일: " + today, { size: SZ_NOTE })] }));
  COMMENTS.push({ id, author: "TalentHub", date: new Date(), children: lines });
  return { start: new CommentRangeStart(id), end: new CommentRangeEnd(id), ref: new TextRun({ children: [new CommentReference(id)] }) };
}

// Wrap fact text runs so a Word comment (from `source`) spans them.
function wrapWithComment(textRuns, source) {
  const c = commentAnchor(source);
  if (!c) return textRuns;
  return [c.start, ...textRuns, c.end, c.ref];
}

function textboxNote(text, opts = {}) {
  return new Textbox({
    style: {
      width: (opts.width || 300) + "pt",
      wrapStyle: "none",
      zIndex: 251, // positive → "in front of text"
      positionHorizontal: "left",
      positionHorizontalRelative: "text",
      positionVertical: "absolute",
      positionVerticalRelative: "line"
    },
    children: [
      new Paragraph({
        spacing: { after: 0, line: LINE_TIGHT, lineRule: "auto" },
        children: [run(cleanText(text), { size: opts.size || SZ_NOTE, color: GRAY })]
      })
    ]
  });
}
function inlineNote(text, opts = {}) {
  return new Paragraph({
    spacing: { after: AF_SET, line: LINE_TIGHT, lineRule: "auto" },
    children: [run("      " + cleanText(text), { size: opts.size || SZ_NOTE, color: GRAY })]
  });
}
function footnoteBox(text, opts = {}) {
  return INLINE_NOTES ? inlineNote(text, opts) : textboxNote(text, opts);
}
function pushNotes(target, notes, width) {
  (notes || []).filter(noteAllowed).forEach((n) => target.push(footnoteBox(n, { width })));
}

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
function noBorders() {
  return { top: NONE, bottom: NONE, left: NONE, right: NONE };
}

function photoParagraph(photo, align) {
  return new Paragraph({
    alignment: align || AlignmentType.CENTER,
    spacing: { after: 40, line: LINE_TIGHT, lineRule: "auto" },
    children: [
      new ImageRun({ type: photo.type || "png", data: photo.buffer, transformation: { width: photo.width || 84, height: photo.height || 104 } })
    ]
  });
}

// True only for a usable, format-detected photo (renderer never embeds one
// without a type, which would corrupt the document).
function hasPhoto(data) {
  return !!(data && data.photo && data.photo.buffer && data.photo.type);
}

// Split a bullet into two aligned lines like the sample: line 1 is
// "     ·<text…>", line 2 is "       <…rest>" (continuation aligned under the
// text). The break is the last word that still fits one line. Returns one
// string when the whole bullet already fits a single line.
function splitBulletLines(text, sizeHalf) {
  const prefix = "     ·"; // 5 spaces + bullet, no trailing space
  const cont = "       "; // 7 spaces so line 2 starts one space further in
  const budget = BODY_BUDGET;
  if (estimateWidthTwips(prefix + text, sizeHalf) <= budget) return [prefix + text];
  const words = String(text).split(/\s+/).filter(Boolean);
  let acc = "";
  for (const w of words) {
    const trial = acc ? acc + " " + w : w;
    if (acc && estimateWidthTwips(prefix + trial, sizeHalf) > budget) break;
    acc = trial;
  }
  const rest = String(text).slice(acc.length).replace(/^\s+/, "");
  if (!acc || !rest) return [prefix + text];
  return [prefix + acc, cont + rest];
}

// "   - headline" + two-line "     ·" bullets + gray note boxes. Sizing varies
// by format via opts: interview 전문역량 uses 13pt underlined headlines + 12pt
// bullets; basic 참고사항 uses 14pt bold (no underline) headlines + 14pt bullets.
// Headlines stay one line via auto character-condensing; bullets fill two lines
// with the first line tight to the second (첫줄 뒷단락 0pt).
function competencyParagraphs(competencies, opts = {}) {
  const headSize = opts.headSize || SZ_DASH;
  const bulletSize = opts.bulletSize || SZ_BULLET;
  const underline = opts.underline !== false;
  const out = [];
  const blocks = competencies || [];
  blocks.forEach((block, bi) => {
    const headline = cleanText(stripLead(block.headline));
    const cs = condenseFor("   - " + headline, headSize);
    out.push(
      bodyPara(
        [run("   - ", { size: headSize, bold: true, characterSpacing: cs }), run(headline, { size: headSize, bold: true, underline, characterSpacing: cs })],
        { after: AF_DASH }
      )
    );
    const bullets = block.bullets || [];
    bullets.forEach((b, i) => {
      const text = cleanText(stripLead(typeof b === "string" ? b : b.text));
      const isLastBullet = i === bullets.length - 1;
      // Gap before the next headline (opts.blockGap, default 14pt), else 10pt.
      const lastBeforeNextBlock = isLastBullet && bi < blocks.length - 1;
      const tail = lastBeforeNextBlock ? (opts.blockGap == null ? 280 : opts.blockGap) : 200;
      const notes = (typeof b === "string" ? [] : b.notes || []).filter(noteAllowed);
      const src = typeof b === "string" ? null : b.source;
      const lines = splitBulletLines(text, bulletSize);
      const mk = (txt, after, noteList, source) => {
        const kids = wrapWithComment([run(txt, { size: bulletSize })], source);
        if (!INLINE_NOTES) noteList.forEach((n) => kids.push(textboxNote(n, { width: 300 })));
        return new Paragraph({ children: kids, spacing: { after, line: LINE, lineRule: "auto" } });
      };
      if (lines.length === 1) {
        out.push(mk(lines[0], tail, notes, src));
      } else {
        // 첫줄 뒷단락 0pt: line 1 hugs line 2. The source comment anchors on
        // line 1; note[0] anchors to line 1, the rest to line 2 (sample layout).
        out.push(mk(lines[0], 0, notes.slice(0, 1), src));
        out.push(mk(lines[1], tail, notes.slice(1), null));
      }
      if (INLINE_NOTES) notes.forEach((n) => out.push(inlineNote(n, { width: 300 })));
    });
  });
  return out;
}

// ======================================================================
// Format A — Interview profile
// ======================================================================

// Space out a short Korean name for the 성명 cell ("김상배" → "김 상 배").
function spaceName(name) {
  const n = cleanText(name);
  return /^[가-힣]{2,4}$/.test(n) ? n.split("").join(" ") : n;
}

// The birth line under a name: "(YY년생, NN세)" at 10pt, 장평 90%, 단락 뒤 0pt.
// When unconfirmed the value is "출생연도·나이 미확인" and is shown without parens.
function birthLineParagraph(birthLine) {
  const unconfirmed = String(birthLine).indexOf("미확인") >= 0;
  const text = unconfirmed ? cleanText(birthLine) : "(" + cleanText(birthLine) + ")";
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 0, line: LINE_TIGHT, lineRule: "auto" },
    children: [run(text, { size: SZ_TABLE_SMALL, scale: 90 })]
  });
}

function personCellA(data) {
  const kids = [];
  if (hasPhoto(data)) kids.push(photoParagraph(data.photo, AlignmentType.CENTER));
  kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE_TIGHT, lineRule: "auto" }, children: [run(spaceName(data.name), { size: SZ_NAME, bold: true })] }));
  if (data.birthLine) kids.push(birthLineParagraph(data.birthLine));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 40, bottom: 40, left: 40, right: 40 }, children: kids });
}

// A career line that is really a degree program (should live under 학력, not
// 경력) — dropped from the career list.
function isEducationRole(title) {
  return /ph\.?\s*d\.?\s*(candidate|student)|박사\s*과정|석사\s*과정|학사\s*과정|대학원\s*(재학|생)|박사\s*수료|\bcandidate\b/i.test(String(title || ""));
}

// An internship — excluded from the basic profile's 주요 사항 list.
function isInternRole(title) {
  return /\bintern(ship)?\b|인턴/i.test(String(title || ""));
}

function orgKey(org) {
  return String(org || "").replace(/[\s·,]|社/g, "").toLowerCase();
}
function periodBounds(p) {
  const s = String(p || "").split("~");
  return { start: (s[0] || "").trim(), end: (s[1] || "").trim() };
}

// Drop degree-program rows and merge consecutive rows at the same
// organization (a promotion track) into one line: keep the newest title, and
// widen the period to span the whole tenure. Careers are listed newest-first.
function normalizeCareer(career) {
  const list = (career || []).filter((c) => c && !isEducationRole(c.title));
  const out = [];
  list.forEach((c) => {
    const prev = out[out.length - 1];
    if (prev && (prev.country || "") === (c.country || "") && orgKey(prev.org) === orgKey(c.org)) {
      const pb = periodBounds(prev.period);
      const cb = periodBounds(c.period);
      prev.period = (cb.start || pb.start) + "~" + (pb.end || cb.end);
    } else {
      out.push(Object.assign({}, c));
    }
  });
  return out;
}

// Each degree must show a single hanja marker (學/碩/博). If the model merged
// several into one entry (e.g. "碩博"), split it into one line per degree.
function expandEducation(education) {
  const out = [];
  (education || []).forEach((e) => {
    const marks = String(e.degree || "").match(/[學碩博]/g);
    if (marks && marks.length > 1) marks.forEach((m) => out.push(Object.assign({}, e, { degree: m })));
    else out.push(Object.assign({}, e, { degree: (marks && marks[0]) || e.degree }));
  });
  return out;
}

// Table rows for education/career: 3pt (60 twips) after each line, and
// `lastAfter` (default 0pt) after the final line of the cell.
const ROW_AFTER = 60; // 3pt

function educationLines(education, opts = {}) {
  const sz = opts.size || SZ_TABLE;
  const scale = opts.scale;
  const rowAfter = opts.rowAfter == null ? ROW_AFTER : opts.rowAfter;
  const lastAfter = opts.lastAfter == null ? 0 : opts.lastAfter;
  const out = [];
  const list = expandEducation(education);
  list.forEach((e, i) => {
    // Degree marker + school in bold, major/year normal (sample style).
    const textParts = [run((e.degree || "") + ") ", { size: sz, bold: true, scale }), run(cleanText(e.school), { size: sz, bold: true, scale })];
    if (e.major) textParts.push(run(", " + cleanText(e.major), { size: sz, scale }));
    if (e.year) {
      textParts.push(new TextRun({ text: "\t", font: { name: FONT } }));
      textParts.push(run("('" + String(e.year).replace(/^'/, "") + ")", { size: sz, scale }));
    }
    const parts = wrapWithComment(textParts, e.source);
    const isLast = i === list.length - 1;
    const note = e.note && noteAllowed(e.note) ? e.note : null;
    if (note && !INLINE_NOTES) parts.push(textboxNote(note, { width: 180 }));
    out.push(new Paragraph({ spacing: { after: isLast ? lastAfter : rowAfter, line: LINE_TIGHT, lineRule: "auto" }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: parts }));
    if (note && INLINE_NOTES) out.push(inlineNote(note, { width: 180 }));
  });
  return out;
}

function careerLines(career, opts = {}) {
  const sz = opts.size || SZ_TABLE;
  const scale = opts.scale;
  const rowAfter = opts.rowAfter == null ? ROW_AFTER : opts.rowAfter;
  const lastAfter = opts.lastAfter == null ? 0 : opts.lastAfter;
  const out = [];
  const list = normalizeCareer(career);
  list.forEach((c, i) => {
    // Country + organization in bold, title/period normal (sample style).
    const textRuns = [run("- ", { size: sz, scale })];
    if (c.country) textRuns.push(run(c.country, { size: sz, bold: true, scale }));
    textRuns.push(run(cleanText(c.org), { size: sz, bold: true, scale }));
    if (c.title) textRuns.push(run(", " + cleanText(c.title), { size: sz, scale }));
    if (c.period) {
      textRuns.push(new TextRun({ text: "\t", font: { name: FONT } }));
      textRuns.push(run("(" + c.period + ")", { size: sz, scale }));
    }
    const head = wrapWithComment(textRuns, c.source);
    const isLast = i === list.length - 1;
    const note = c.note && noteAllowed(c.note) ? c.note : null;
    if (note && !INLINE_NOTES) head.push(textboxNote(note, { width: 220 }));
    out.push(new Paragraph({ spacing: { after: isLast ? lastAfter : rowAfter, line: LINE_TIGHT, lineRule: "auto" }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: head }));
    if (note && INLINE_NOTES) out.push(inlineNote(note, { width: 220 }));
  });
  return out;
}

function personalTableA(data) {
  const headerCell = (label) =>
    new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 30, bottom: 30, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE_TIGHT, lineRule: "auto" }, children: [run(label, { size: SZ_TABLE_A, bold: true })] })] });
  const cell = (children) =>
    new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 40, bottom: 40, left: 80, right: 80 }, children: children.length ? children : [new Paragraph({ children: [run("", { size: SZ_TABLE_A })] })] });

  // 성명 fixed to 2.7cm (~1531 twips); remaining split for 학력 / 주요 경력.
  const NAME_W = 1531;
  const total = PAGE_W - MARGIN_SIDE * 2; // 9306
  const eduW = Math.round((total - NAME_W) * 0.4);
  const careerW = total - NAME_W - eduW;
  const tblOpts = { size: SZ_TABLE_A, rowAfter: 120, scale: 90 };
  return new Table({
    width: { size: total, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [NAME_W, eduW, careerW],
    rows: [
      new TableRow({ tableHeader: true, children: [headerCell("성 명"), headerCell("학 력"), headerCell("주요 경력")] }),
      new TableRow({ children: [personCellA(data), cell(educationLines(data.education, tblOpts)), cell(careerLines(data.career, tblOpts))] })
    ]
  });
}

function buildInterviewProfileDocx(data) {
  const children = [];
  // Title: 【 이름(소속) Profile 】 — 직급은 제목에 넣지 않는다(spec).
  const titleOrg = data.orgShort ? "(" + cleanText(data.orgShort) + ")" : "";
  children.push(new Paragraph({ spacing: sp(AF_TITLE), indent: { left: TITLE_INDENT }, children: [run("【 " + cleanText(data.name) + titleOrg + " Profile 】", { size: SZ_TITLE, bold: true })] }));

  children.push(sectionHeader("인적 사항", null, { before: 0, after: 200 }));
  children.push(personalTableA(data));

  // 전문 역량: header bold+underline; claims bold (no underline).
  children.push(sectionHeader("전문 역량", cleanText(data.competencyTitle), { before: 480, after: 200, underline: true }));
  competencyParagraphs(data.competencies, { underline: false }).forEach((p) => children.push(p));
  // ※ 영입 메모 — only present when the model added a note (position/internal status).
  (data.competencyNotes || []).forEach((n) => {
    const obj = typeof n === "string" ? { text: n } : n;
    const t = "※ " + cleanText(obj.text);
    children.push(bodyPara([run(t, { size: SZ_DASH, bold: true, characterSpacing: condenseFor(t, SZ_DASH) })], { after: obj.note && noteAllowed(obj.note) ? AF_SET : AF_DASH }));
    if (obj.note && noteAllowed(obj.note)) children.push(footnoteBox(obj.note, { width: 320 }));
  });

  children.push(sectionHeader("Talking Point", null, { before: 240, after: 200 }));
  (data.talkingPoints || []).forEach((tp) => {
    const t = "   - " + cleanText(stripLead(tp));
    children.push(bodyPara([run(t, { size: SZ_DASH, characterSpacing: condenseFor(t, SZ_DASH) })], { after: AF_DASH }));
  });

  return packDoc(children, { marginTB: MARGIN_TB });
}

// ======================================================================
// Format B — Basic profile
// ======================================================================

function personalBlockB(data) {
  const left = [];
  // Rows: optional 연령 + one per degree. 13pt bold, before 0, after 10pt; the
  // block's LAST line is 14pt (spec). Spacing is controlled only via after.
  const edu = expandEducation(data.education);
  const rows = [];
  if (data.age || data.birthMark) rows.push({ type: "age" });
  edu.forEach((e, i) => rows.push({ type: "edu", e: e, first: i === 0 }));
  rows.forEach((r, idx) => {
    const isLast = idx === rows.length - 1;
    const sz = isLast ? SZ_HEADER : SZ_DASH; // 14pt last line, else 13pt
    let parts;
    if (r.type === "age") {
      const ageText = (data.age ? data.age + "세" : "") + (data.birthMark ? " (" + data.birthMark + ")" : "");
      parts = [run("   - 연  령 : ", { size: sz, bold: true }), run(ageText.trim(), { size: sz, bold: true })];
    } else {
      const e = r.e;
      parts = [run(r.first ? "   - 학  력 : " : "              ", { size: sz, bold: true })];
      parts.push(run((e.degree || "") + ") " + cleanText(e.school) + (e.major ? ", " + cleanText(e.major) : ""), { size: sz, bold: true }));
      if (e.year) {
        parts.push(new TextRun({ text: "\t", font: { name: FONT } }));
        parts.push(run("('" + String(e.year).replace(/^'/, "") + ")", { size: sz, bold: true }));
      }
    }
    left.push(new Paragraph({ spacing: { before: 0, after: 200, line: LINE, lineRule: "auto" }, tabStops: [{ type: TabStopType.LEFT, position: 3400 }], children: parts }));
  });

  if (!hasPhoto(data)) return left;

  const row = new TableRow({
    children: [
      new TableCell({ borders: noBorders(), width: { size: 78, type: WidthType.PERCENTAGE }, children: left }),
      new TableCell({ borders: noBorders(), width: { size: 22, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.TOP, children: [photoParagraph(data.photo, AlignmentType.RIGHT)] })
    ]
  });
  return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: noBorders(), rows: [row] })];
}

function careerLinesB(career) {
  // 주요 사항: 13pt bold, period right-tabbed, before 0 / after 10pt; the LAST
  // line is 14pt (spec). Internships are excluded from the list.
  const out = [];
  const list = normalizeCareer(career).filter(function (c) { return !isInternRole(c.title); });
  list.forEach((c, i) => {
    const isLast = i === list.length - 1;
    const sz = isLast ? SZ_HEADER : SZ_DASH; // 14pt last line, else 13pt
    const head = [run("   - ", { size: sz, bold: true })];
    if (c.country) head.push(run(c.country, { size: sz, bold: true }));
    head.push(run(cleanText(c.org), { size: sz, bold: true }));
    if (c.title) head.push(run(", " + cleanText(c.title), { size: sz, bold: true }));
    if (c.period) {
      head.push(new TextRun({ text: "\t", font: { name: FONT } }));
      head.push(run("(" + c.period + ")", { size: sz, bold: true }));
    }
    out.push(new Paragraph({ spacing: { before: 0, after: 200, line: LINE, lineRule: "auto" }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: head }));
  });
  return out;
}

function buildBasicProfileDocx(data) {
  const children = [];
  // First line: title with 단락 위 16pt; no gray subtitle beneath it. All other
  // lines keep 단락 앞 0pt and use 단락 뒤 only for spacing.
  const titleLine = data.basicTitle || [data.orgShort, data.name].filter(Boolean).join(", ") + " 프로필";
  children.push(new Paragraph({ spacing: { before: AF_TITLE, after: 240, line: LINE, lineRule: "auto" }, indent: { left: TITLE_INDENT }, children: [run("【 " + cleanText(titleLine) + " 】", { size: SZ_TITLE, bold: true })] }));

  children.push(sectionHeader("인적 사항", null, { before: 0, after: 240 }));
  personalBlockB(data).forEach((p) => children.push(p));

  children.push(sectionHeader("주요 사항", null, { before: 0, after: 240 }));
  careerLinesB(data.career).forEach((p) => children.push(p));

  children.push(sectionHeader("참고 사항", null, { before: 0, after: 240 }));
  // Basic 참고사항: 13pt bold headlines (no underline) + 12pt two-line bullets;
  // 단락 뒤 10pt throughout (bullet line 1 hugs line 2).
  competencyParagraphs(data.competencies, { headSize: SZ_DASH, bulletSize: SZ_BULLET, underline: false, blockGap: 200 }).forEach((p) => children.push(p));
  (data.competencyNotes || []).forEach((n) => {
    const obj = typeof n === "string" ? { text: n } : n;
    const t = "※ " + cleanText(obj.text);
    children.push(bodyPara([run(t, { size: SZ_DASH, bold: true, characterSpacing: condenseFor(t, SZ_DASH) })], { after: obj.note && noteAllowed(obj.note) ? AF_SET : AF_DASH }));
    if (obj.note && noteAllowed(obj.note)) children.push(footnoteBox(obj.note, { width: 360 }));
  });

  return packDoc(children);
}

// ======================================================================
// Format C — Summary table
// ======================================================================

function summaryNameCell(data) {
  const kids = [];
  if (data.category) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30, line: LINE_TIGHT, lineRule: "auto" }, children: [run("【 " + cleanText(data.category) + " 】", { size: SZ_TABLE_SMALL, bold: true })] }));
  if (hasPhoto(data)) kids.push(photoParagraph({ buffer: data.photo.buffer, type: data.photo.type, width: data.photo.width || 60, height: data.photo.height || 74 }, AlignmentType.CENTER));
  kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE_TIGHT, lineRule: "auto" }, children: [run(data.name || "", { size: SZ_TABLE, bold: true })] }));
  if (data.birthLine) kids.push(birthLineParagraph(data.birthLine));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 40, bottom: 40, left: 40, right: 40 }, children: kids });
}

function summaryCareerCell(data) {
  const kids = careerLines(data.career, { size: SZ_TABLE, lastAfter: ROW_AFTER });
  educationLines(data.education, { size: SZ_TABLE, lastAfter: 0 }).forEach((p) => kids.push(p));
  if (!kids.length) kids.push(new Paragraph({ children: [run("", { size: SZ_TABLE })] }));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 40, bottom: 40, left: 80, right: 60 }, children: kids });
}

function summaryCompetencyCell(data) {
  const kids = [];
  if (data.competencyTitle) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 50, line: LINE_TIGHT, lineRule: "auto" }, children: [run(cleanText(data.competencyTitle), { size: SZ_TABLE, bold: true, underline: true })] }));
  const bullets = [];
  (data.competencies || []).forEach((block) => (block.bullets || []).forEach((b) => bullets.push(typeof b === "string" ? b : b.text)));
  (data.summaryBullets || []).forEach((t) => bullets.push(t));
  bullets.forEach((t) => kids.push(new Paragraph({ spacing: { after: 30, line: LINE_TIGHT, lineRule: "auto" }, children: [run("· " + cleanText(stripLead(t)), { size: SZ_TABLE })] })));
  if (data.reviewNote) kids.push(new Paragraph({ spacing: { before: 30, after: 0, line: LINE_TIGHT, lineRule: "auto" }, children: [run("※ " + cleanText(data.reviewNote), { size: SZ_TABLE })] }));
  if (!kids.length) kids.push(new Paragraph({ children: [run("", { size: SZ_TABLE })] }));
  return new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 40, bottom: 40, left: 80, right: 60 }, children: kids });
}

function buildSummaryTableDocx(input) {
  const candidates = (input && input.candidates) || [];
  const groupLabel = (input && input.groupLabel) || "Candidate Table";
  const children = [];
  children.push(sectionHeader(groupLabel, candidates.length + "名"));

  const headerCell = (label) =>
    new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { top: 30, bottom: 30, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: LINE_TIGHT, lineRule: "auto" }, children: [run(label, { size: SZ_TABLE, bold: true })] })] });

  const rows = [new TableRow({ tableHeader: true, children: [headerCell("성 명"), headerCell("주요경력 및 학력"), headerCell("전문역량")] })];
  candidates.forEach((c) => rows.push(new TableRow({ children: [summaryNameCell(c), summaryCareerCell(c), summaryCompetencyCell(c)] })));

  const total = PAGE_W - MARGIN_SIDE * 2;
  children.push(new Table({ width: { size: total, type: WidthType.DXA }, layout: TableLayoutType.FIXED, columnWidths: [1700, 4100, total - 5800], rows }));
  return packDoc(children);
}

// ======================================================================

async function makeTextboxesSimple(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const entry = zip.file("word/document.xml");
  if (!entry) return buffer;
  let xml = await entry.async("string");
  // Match the internal sample's annotations: a transparent (no fill, no border)
  // Simple Text Box, positioned absolutely and dropped ~11pt below its anchor
  // line so the gray note sits in the line gap instead of covering body text.
  xml = xml.replace(/<v:shape (?![^>]*\bstroked=)/g, '<v:shape stroked="f" filled="f" ');
  xml = xml.replace(/(<v:shape\b[^>]*\bstyle=")/g, "$1position:absolute;margin-top:11pt;");
  zip.file("word/document.xml", xml);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

const MARGIN_TB = 1417; // 2.5cm (top/bottom) for the interview format
async function packDoc(children, opts = {}) {
  const top = opts.marginTB || MARGIN;
  const doc = new Document({
    styles: { default: { document: { run: { font: { name: FONT, hint: "eastAsia" }, size: SZ_BULLET } } } },
    comments: COMMENTS.length ? { children: COMMENTS } : undefined,
    sections: [{ properties: { page: { margin: { top, bottom: top, left: MARGIN, right: MARGIN } } }, children }]
  });
  const buffer = await Packer.toBuffer(doc);
  // The VML post-processing is only needed when gray annotation text boxes are
  // emitted; they are currently disabled, so skip the zip re-compression.
  return SHOW_TEXTBOX_NOTES && !INLINE_NOTES ? makeTextboxesSimple(buffer) : buffer;
}

function buildProfileReportDocx(format, data) {
  // Annotations always render as floating "Simple Text Box" (VML t202) in
  // front of text on every device; the earlier "unreadable on mobile" issue
  // was the untyped image, now fixed, not the text boxes. The inline variant
  // is retained only as an explicit opt-out via data.variant === "inline".
  INLINE_NOTES = data && data.variant === "inline";
  COMMENTS = [];
  COMMENT_SEQ = 0;
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
