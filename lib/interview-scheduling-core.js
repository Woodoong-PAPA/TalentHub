const crypto = require("crypto");

const SCHEDULING_STATUSES = Object.freeze({
  CREATED: "CREATED",
  COLLECTING_AVAILABILITY: "COLLECTING_AVAILABILITY",
  CLARIFICATION_REQUIRED: "CLARIFICATION_REQUIRED",
  NO_COMMON_SLOT: "NO_COMMON_SLOT",
  READY_TO_PROPOSE: "READY_TO_PROPOSE",
  OPTIONS_SENT: "OPTIONS_SENT",
  CONFIRMING: "CONFIRMING",
  CONFIRMED: "CONFIRMED",
  MANUAL_REVIEW: "MANUAL_REVIEW",
  RESCHEDULE_REQUESTED: "RESCHEDULE_REQUESTED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED"
});

const AUTOMATION_STATUSES = new Set([
  SCHEDULING_STATUSES.CREATED,
  SCHEDULING_STATUSES.COLLECTING_AVAILABILITY,
  SCHEDULING_STATUSES.CLARIFICATION_REQUIRED,
  SCHEDULING_STATUSES.NO_COMMON_SLOT,
  SCHEDULING_STATUSES.READY_TO_PROPOSE,
  SCHEDULING_STATUSES.OPTIONS_SENT,
  SCHEDULING_STATUSES.CONFIRMING
]);

const ALLOWED_TRANSITIONS = Object.freeze({
  [SCHEDULING_STATUSES.CREATED]: [
    SCHEDULING_STATUSES.COLLECTING_AVAILABILITY,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.COLLECTING_AVAILABILITY]: [
    SCHEDULING_STATUSES.CLARIFICATION_REQUIRED,
    SCHEDULING_STATUSES.NO_COMMON_SLOT,
    SCHEDULING_STATUSES.READY_TO_PROPOSE,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.EXPIRED,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.CLARIFICATION_REQUIRED]: [
    SCHEDULING_STATUSES.COLLECTING_AVAILABILITY,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.EXPIRED,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.NO_COMMON_SLOT]: [
    SCHEDULING_STATUSES.COLLECTING_AVAILABILITY,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.READY_TO_PROPOSE]: [
    SCHEDULING_STATUSES.OPTIONS_SENT,
    SCHEDULING_STATUSES.NO_COMMON_SLOT,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.OPTIONS_SENT]: [
    SCHEDULING_STATUSES.CONFIRMING,
    SCHEDULING_STATUSES.EXPIRED,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.CONFIRMING]: [
    SCHEDULING_STATUSES.CONFIRMED,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.CONFIRMED]: [
    SCHEDULING_STATUSES.RESCHEDULE_REQUESTED,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.MANUAL_REVIEW]: [
    SCHEDULING_STATUSES.COLLECTING_AVAILABILITY,
    SCHEDULING_STATUSES.READY_TO_PROPOSE,
    SCHEDULING_STATUSES.OPTIONS_SENT,
    SCHEDULING_STATUSES.CONFIRMING,
    SCHEDULING_STATUSES.CONFIRMED,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.RESCHEDULE_REQUESTED]: [
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.EXPIRED]: [
    SCHEDULING_STATUSES.COLLECTING_AVAILABILITY,
    SCHEDULING_STATUSES.MANUAL_REVIEW,
    SCHEDULING_STATUSES.CANCELLED
  ],
  [SCHEDULING_STATUSES.CANCELLED]: []
});

const EMAIL_TEMPLATES = Object.freeze({
  candidateAvailabilityRequest: {
    subject: "[면접일정 조율][{caseCode}] {positionName} {interviewStage}",
    body: [
      "안녕하세요, {candidateName} 님.",
      "",
      "{positionName} 직무의 {interviewStage} 면접 일정을 조율하고자 합니다.",
      "면접은 약 {durationMinutes}분간 진행될 예정입니다.",
      "",
      "아래 기간 중 가능한 날짜와 시간대를 2개 이상 회신해 주세요.",
      "",
      "조율 대상 기간: {schedulingWindow}",
      "기준 시간대: {timezoneDisplay}",
      "회신 기한: {candidateReplyDeadline}",
      "",
      "회신 예시:",
      "- 7월 1일 14:00~18:00",
      "- 7월 2일 오전 10:00~12:00",
      "- 7월 3일 오후 4시 이후",
      "",
      "조율번호: {caseCode}",
      "",
      "감사합니다."
    ].join("\n")
  },
  interviewerAvailabilityRequest: {
    subject: "[면접일정 조율][{caseCode}] {positionName} {interviewStage}",
    body: [
      "안녕하세요, {interviewerName} 님.",
      "",
      "{candidateName} 후보자의 {positionName} 직무 {interviewStage} 면접 일정을 조율하고 있습니다.",
      "면접은 약 {durationMinutes}분간 진행될 예정입니다.",
      "",
      "아래 기간 중 가능한 날짜와 시간대를 회신해 주세요.",
      "",
      "조율 대상 기간: {schedulingWindow}",
      "기준 시간대: {timezoneDisplay}",
      "회신 기한: {interviewerReplyDeadline}",
      "",
      "회신 예시:",
      "- 7월 1일 14:00~18:00",
      "- 7월 2일 오전 10:00~12:00",
      "- 7월 3일 오후 4시 이후",
      "",
      "회신해 주신 시간은 면접 일정 조율을 위한 가능 시간으로 사용됩니다.",
      "",
      "조율번호: {caseCode}",
      "",
      "감사합니다."
    ].join("\n")
  },
  clarificationRequest: {
    subject: "{threadSubject}",
    body: [
      "안녕하세요.",
      "",
      "정확한 면접 일정 조율을 위해 가능한 시간을 조금 더 구체적으로 확인 부탁드립니다.",
      "",
      "{clarificationReason}",
      "",
      "예:",
      "- 7월 1일 14:00~18:00",
      "- 7월 2일 오전 10:00~12:00",
      "",
      "기준 시간대: {timezoneDisplay}",
      "조율번호: {caseCode}",
      "",
      "감사합니다."
    ].join("\n")
  },
  candidateOptions: {
    subject: "{threadSubject}",
    body: [
      "안녕하세요, {candidateName} 님.",
      "",
      "전달해 주신 가능 시간을 바탕으로 아래 면접 일정을 제안드립니다.",
      "",
      "{formattedOptions}",
      "",
      "가능한 일정의 알파벳 또는 날짜와 시간을 회신해 주세요.",
      "",
      "예:",
      "B 일정으로 가능합니다.",
      "",
      "제안된 일정의 회신 기한: {optionExpiration}",
      "기준 시간대: {timezoneDisplay}",
      "조율번호: {caseCode}",
      "",
      "감사합니다."
    ].join("\n")
  },
  candidateConfirmed: {
    subject: "[면접일정 확정][{caseCode}] {positionName} {interviewStage}",
    body: [
      "안녕하세요, {candidateName} 님.",
      "",
      "{positionName} 직무의 {interviewStage} 면접 일정이 아래와 같이 확정되었습니다.",
      "",
      "일시: {confirmedDateTime}",
      "기준 시간대: {timezoneDisplay}",
      "예상 소요시간: {durationMinutes}분",
      "진행 방식: {meetingMethod}",
      "진행 장소 또는 접속 정보: {meetingDetails}",
      "",
      "일정 변경이 필요한 경우 이 메일에 회신해 주세요.",
      "확정 이후 변경 요청은 채용담당자가 별도로 확인하여 안내드릴 예정입니다.",
      "",
      "조율번호: {caseCode}",
      "",
      "감사합니다."
    ].join("\n")
  },
  interviewerConfirmed: {
    subject: "[면접일정 확정][{caseCode}] {positionName} {interviewStage}",
    body: [
      "안녕하세요, {interviewerName} 님.",
      "",
      "{candidateName} 후보자의 {positionName} 직무 {interviewStage} 면접 일정이 아래와 같이 확정되었습니다.",
      "",
      "일시: {confirmedDateTime}",
      "기준 시간대: {timezoneDisplay}",
      "예상 소요시간: {durationMinutes}분",
      "진행 방식: {meetingMethod}",
      "진행 장소 또는 접속 정보: {meetingDetails}",
      "",
      "일정 변경이 필요한 경우 이 메일에 회신해 주세요.",
      "",
      "조율번호: {caseCode}",
      "",
      "감사합니다."
    ].join("\n")
  }
});

function canTransition(fromStatus, toStatus) {
  if (AUTOMATION_STATUSES.has(fromStatus) && toStatus === SCHEDULING_STATUSES.MANUAL_REVIEW) {
    return true;
  }

  return (ALLOWED_TRANSITIONS[fromStatus] || []).includes(toStatus);
}

function assertTransition(fromStatus, toStatus) {
  if (!canTransition(fromStatus, toStatus)) {
    throw new Error(`Invalid scheduling transition: ${fromStatus} -> ${toStatus}`);
  }

  return toStatus;
}

function parseInstant(value) {
  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();

  if (!Number.isFinite(time)) {
    throw new Error(`Invalid datetime: ${value}`);
  }

  return time;
}

function normalizeInterval(interval) {
  const start = parseInstant(interval.start || interval.startAt);
  const end = parseInstant(interval.end || interval.endAt);

  if (start >= end) {
    throw new Error("Interval start must be before end");
  }

  return { start, end };
}

function intervalToIso(interval) {
  return {
    start: new Date(interval.start).toISOString(),
    end: new Date(interval.end).toISOString()
  };
}

function mergeIntervals(intervals = []) {
  const sorted = intervals
    .map(normalizeInterval)
    .sort((a, b) => a.start - b.start || a.end - b.end);

  const merged = [];

  for (const interval of sorted) {
    const previous = merged[merged.length - 1];

    if (previous && interval.start <= previous.end) {
      previous.end = Math.max(previous.end, interval.end);
    } else {
      merged.push({ ...interval });
    }
  }

  return merged;
}

function intersectTwoSets(left = [], right = []) {
  const a = mergeIntervals(left);
  const b = mergeIntervals(right);
  const result = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    const start = Math.max(a[i].start, b[j].start);
    const end = Math.min(a[i].end, b[j].end);

    if (start < end) {
      result.push({ start, end });
    }

    if (a[i].end < b[j].end) {
      i += 1;
    } else {
      j += 1;
    }
  }

  return result;
}

function intersectParticipantAvailability(participantWindows = []) {
  const requiredWindows = participantWindows
    .filter((entry) => entry.required !== false)
    .map((entry) => mergeIntervals(entry.windows || entry.availability || []));

  if (!requiredWindows.length || requiredWindows.some((windows) => !windows.length)) {
    return [];
  }

  return requiredWindows.reduce((current, windows) => intersectTwoSets(current, windows));
}

function ceilToStep(time, stepMinutes) {
  const step = Math.max(1, Number(stepMinutes) || 30) * 60_000;
  return Math.ceil(time / step) * step;
}

function generateSlots(intervals = [], options = {}) {
  const durationMs = Math.max(1, Number(options.durationMinutes) || 60) * 60_000;
  const intervalMs = Math.max(1, Number(options.slotIntervalMinutes) || 30) * 60_000;
  const slots = [];

  for (const interval of mergeIntervals(intervals)) {
    let cursor = ceilToStep(interval.start, options.slotIntervalMinutes || 30);

    while (cursor + durationMs <= interval.end) {
      slots.push({ start: cursor, end: cursor + durationMs });
      cursor += intervalMs;
    }
  }

  return slots;
}

function intervalsOverlap(left, right) {
  const a = normalizeInterval(left);
  const b = normalizeInterval(right);
  return a.start < b.end && b.start < a.end;
}

function removeConflictingSlots(slots = [], conflicts = []) {
  const conflictIntervals = mergeIntervals(conflicts);
  return slots.filter((slot) => !conflictIntervals.some((conflict) => intervalsOverlap(slot, conflict)));
}

function computeCommonSlotOptions(input = {}) {
  const participantWindows = input.participants || [];
  const windowStart = input.schedulingWindowStart ? parseInstant(input.schedulingWindowStart) : null;
  const windowEnd = input.schedulingWindowEnd ? parseInstant(input.schedulingWindowEnd) : null;
  let common = intersectParticipantAvailability(participantWindows);

  if (windowStart && windowEnd && windowStart < windowEnd) {
    common = intersectTwoSets(common, [{ start: windowStart, end: windowEnd }]);
  }

  const slots = generateSlots(common, {
    durationMinutes: input.durationMinutes,
    slotIntervalMinutes: input.slotIntervalMinutes
  });
  const filtered = removeConflictingSlots(slots, input.conflicts || [])
    .filter((slot) => slot.start > Date.now())
    .sort((a, b) => a.start - b.start)
    .slice(0, Number(input.limit || 3));

  return filtered.map((slot, index) => ({
    optionCode: String.fromCharCode(65 + index),
    ...intervalToIso(slot)
  }));
}

function validateAiAvailabilityResult(value, options = {}) {
  const result = value && typeof value === "object" ? value : {};
  const errors = [];
  const intentValues = new Set([
    "PROVIDE_AVAILABILITY",
    "CHANGE_AVAILABILITY",
    "SELECT_OPTION",
    "REQUEST_CLARIFICATION",
    "DECLINE",
    "CANCEL",
    "OTHER"
  ]);
  const senderRoleValues = new Set(["CANDIDATE", "INTERVIEWER", "UNKNOWN"]);

  if (!senderRoleValues.has(result.senderRole)) {
    errors.push("senderRole is invalid");
  }

  if (!intentValues.has(result.intent)) {
    errors.push("intent is invalid");
  }

  if (typeof result.confidence !== "number" || result.confidence < 0 || result.confidence > 1) {
    errors.push("confidence must be a number from 0 to 1");
  }

  if (result.timezone && !isValidTimeZone(result.timezone)) {
    errors.push("timezone is invalid");
  }

  const availability = Array.isArray(result.availability) ? result.availability : [];
  const normalizedAvailability = [];

  for (const item of availability) {
    try {
      const normalized = normalizeInterval(item);

      if (options.windowStart && normalized.start < parseInstant(options.windowStart)) {
        errors.push("availability starts before scheduling window");
      }

      if (options.windowEnd && normalized.end > parseInstant(options.windowEnd)) {
        errors.push("availability ends after scheduling window");
      }

      if (normalized.start < Date.now() - 60_000) {
        errors.push("availability is in the past");
      }

      normalizedAvailability.push(intervalToIso(normalized));
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (result.intent === "SELECT_OPTION") {
    const selected = Array.isArray(result.selectedOptionCodes)
      ? result.selectedOptionCodes.map((item) => String(item || "").trim().toUpperCase()).filter(Boolean)
      : [];

    if (!selected.length) {
      errors.push("selectedOptionCodes is required for SELECT_OPTION");
    }
  }

  const threshold = typeof options.confidenceThreshold === "number" ? options.confidenceThreshold : 0.9;

  if (result.confidence < threshold) {
    errors.push("confidence is below threshold");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      caseCode: result.caseCode || null,
      senderRole: result.senderRole || "UNKNOWN",
      intent: result.intent || "OTHER",
      timezone: result.timezone || options.defaultTimezone || "Asia/Seoul",
      availability: normalizedAvailability,
      selectedOptionCodes: Array.isArray(result.selectedOptionCodes)
        ? result.selectedOptionCodes.map((item) => String(item || "").trim().toUpperCase()).filter(Boolean)
        : [],
      confidence: Number(result.confidence || 0),
      needsClarification: Boolean(result.needsClarification),
      clarificationReason: result.clarificationReason || null
    }
  };
}

function isValidTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function renderTemplate(template, variables = {}) {
  return String(template || "").replace(/\{([A-Za-z0-9_]+)\}/g, (match, key) => {
    const value = variables[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

function createIdempotencyKey(parts = []) {
  return crypto
    .createHash("sha256")
    .update(parts.map((part) => String(part || "")).join("|"))
    .digest("hex");
}

function base64UrlDecode(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function base64UrlDecodeJson(value) {
  return JSON.parse(base64UrlDecode(value));
}

function stripQuotedEmailText(body = "") {
  return String(body || "")
    .split(/\nOn .+ wrote:\n/i)[0]
    .split(/\n-{2,}\s*Original Message\s*-{2,}/i)[0]
    .replace(/\n>.*$/gm, "")
    .replace(/\n--\s*\n[\s\S]*$/m, "")
    .trim();
}

function fakeParseKoreanAvailabilityEmail(input = {}) {
  const text = stripQuotedEmailText(input.body || input.text || "");
  const caseCode = (text.match(/INT-\d{4}-\d{4}/i) || input.subject?.match(/INT-\d{4}-\d{4}/i) || [null])[0];
  const baseDate = input.receivedAt ? new Date(input.receivedAt) : new Date();
  const year = baseDate.getUTCFullYear();

  if (/기존 지시를 무시|다른 후보자|ignore previous/i.test(text)) {
    return {
      caseCode,
      senderRole: input.senderRole || "UNKNOWN",
      intent: "OTHER",
      timezone: input.timezone || "Asia/Seoul",
      availability: [],
      selectedOptionCodes: [],
      confidence: 0.2,
      needsClarification: true,
      clarificationReason: "일정 조율과 무관하거나 보안상 자동 처리할 수 없는 문장이 포함되어 있습니다."
    };
  }

  const selected = [];
  for (const match of text.matchAll(/\b([ABC])\s*(?:번|일정)?/gi)) {
    selected.push(match[1].toUpperCase());
  }

  if (selected.length) {
    return {
      caseCode,
      senderRole: input.senderRole || "CANDIDATE",
      intent: "SELECT_OPTION",
      timezone: input.timezone || "Asia/Seoul",
      availability: [],
      selectedOptionCodes: [...new Set(selected)],
      confidence: 0.96,
      needsClarification: false,
      clarificationReason: null
    };
  }

  if (/다음 주 중|퇴근 후|대부분|오후 늦게/.test(text)) {
    return {
      caseCode,
      senderRole: input.senderRole || "UNKNOWN",
      intent: "REQUEST_CLARIFICATION",
      timezone: input.timezone || "Asia/Seoul",
      availability: [],
      selectedOptionCodes: [],
      confidence: 0.62,
      needsClarification: true,
      clarificationReason: "가능 시간 범위가 모호합니다. 시작 및 종료 시간을 구체적으로 확인해야 합니다."
    };
  }

  const availability = [];
  const pattern = /(\d{1,2})월\s*(\d{1,2})일[^\d오전후]*(오전|오후)?\s*(\d{1,2})(?::(\d{2}))?\s*(?:시)?\s*(?:부터|~|-|에서)?\s*(오전|오후)?\s*(\d{1,2})(?::(\d{2}))?\s*(?:시)?/g;

  for (const match of text.matchAll(pattern)) {
    const month = Number(match[1]);
    const day = Number(match[2]);
    const startMeridiem = match[3] || "";
    const startHour = normalizeKoreanHour(Number(match[4]), startMeridiem);
    const startMinute = Number(match[5] || 0);
    const endMeridiem = match[6] || startMeridiem;
    const endHour = normalizeKoreanHour(Number(match[7]), endMeridiem);
    const endMinute = Number(match[8] || 0);
    availability.push({
      start: buildSeoulIso(year, month, day, startHour, startMinute),
      end: buildSeoulIso(year, month, day, endHour, endMinute)
    });
  }

  return {
    caseCode,
    senderRole: input.senderRole || "UNKNOWN",
    intent: availability.length ? "PROVIDE_AVAILABILITY" : "REQUEST_CLARIFICATION",
    timezone: /한국시간|KST/i.test(text) ? "Asia/Seoul" : input.timezone || "Asia/Seoul",
    availability,
    selectedOptionCodes: [],
    confidence: availability.length ? 0.91 : 0.55,
    needsClarification: !availability.length,
    clarificationReason: availability.length ? null : "날짜와 시간이 명확하게 확인되지 않습니다."
  };
}

function normalizeKoreanHour(hour, meridiem) {
  if (meridiem === "오후" && hour < 12) {
    return hour + 12;
  }

  if (meridiem === "오전" && hour === 12) {
    return 0;
  }

  return hour;
}

function buildSeoulIso(year, month, day, hour, minute) {
  const utc = Date.UTC(year, month - 1, day, hour - 9, minute, 0, 0);
  return new Date(utc).toISOString();
}

function formatInTimeZone(value, timeZone = "Asia/Seoul", locale = "ko-KR") {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(value));
}

module.exports = {
  SCHEDULING_STATUSES,
  ALLOWED_TRANSITIONS,
  EMAIL_TEMPLATES,
  canTransition,
  assertTransition,
  normalizeInterval,
  intervalToIso,
  mergeIntervals,
  intersectTwoSets,
  intersectParticipantAvailability,
  generateSlots,
  removeConflictingSlots,
  computeCommonSlotOptions,
  validateAiAvailabilityResult,
  renderTemplate,
  createIdempotencyKey,
  base64UrlDecode,
  base64UrlDecodeJson,
  stripQuotedEmailText,
  fakeParseKoreanAvailabilityEmail,
  formatInTimeZone
};
