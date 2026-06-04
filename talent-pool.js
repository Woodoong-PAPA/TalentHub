const STATUS_LABELS = {
  interested: "관심",
  contact_planned: "접촉 예정",
  contacted: "접촉 완료",
  nurture: "지원 유도",
  screening: "전형 진행",
  hold: "보류",
  inactive: "비활성"
};

const CONSENT_LABELS = {
  consented: "동의",
  expiring: "만료 예정",
  expired: "만료",
  revoked: "철회",
  unknown: "미확인"
};

const STATUS_ORDER = [
  "interested",
  "contact_planned",
  "contacted",
  "nurture",
  "screening",
  "hold",
  "inactive"
];

const SAMPLE_CANDIDATES = [
  {
    id: "cand-001",
    name: "김도현",
    initials: "김D",
    role: "반도체 공정 AI 엔지니어",
    company: "SK hynix",
    years: 6,
    jobFamily: "Semiconductor AI",
    organization: "DS",
    status: "contact_planned",
    consent: "consented",
    owner: "이지원",
    updatedAt: "2026-06-02",
    lastContactedAt: "2026-05-21",
    location: "경기 화성",
    source: "리퍼럴",
    dataQuality: 94,
    parsingConfidence: 91,
    avatarColor: "#4e5968",
    skills: ["NAND", "Python", "공정 데이터", "수율 분석", "ML"],
    tags: ["핵심 기술", "재접촉 우선", "검수 완료"],
    summary:
      "NAND 공정 데이터 분석과 수율 개선 프로젝트를 수행한 6년차 엔지니어. Python 기반 이상 탐지 모델과 공정 변수 최적화 경험이 강점이다.",
    evidence: [
      "NAND 공정 수율 예측 모델 개발",
      "Python 기반 공정 데이터 자동 분석 파이프라인 구축",
      "제조/품질 조직과 글로벌 개선 과제 수행"
    ],
    applications: [
      { title: "DS 공정 AI 경력 채용", stage: "지원 유도", result: "진행 가능", date: "2026-05-22" }
    ],
    timeline: [
      { type: "상태 변경", text: "접촉 예정으로 변경", actor: "이지원", date: "2026-06-02" },
      { type: "AI 요약", text: "이력서 파싱 및 경력 요약 생성", actor: "AI Worker", date: "2026-06-01" },
      { type: "접촉", text: "리퍼럴 경로로 관심 여부 확인", actor: "박민수", date: "2026-05-21" }
    ]
  },
  {
    id: "cand-002",
    name: "박서연",
    initials: "박S",
    role: "온디바이스 AI 리서처",
    company: "Samsung Research",
    years: 8,
    jobFamily: "AI Research",
    organization: "DX",
    status: "screening",
    consent: "consented",
    owner: "최유진",
    updatedAt: "2026-06-03",
    lastContactedAt: "2026-06-01",
    location: "서울",
    source: "이전 지원",
    dataQuality: 97,
    parsingConfidence: 95,
    avatarColor: "#333d4b",
    skills: ["On-device AI", "LLM", "C++", "TensorRT", "논문"],
    tags: ["석박사", "전형 진행", "논문 실적"],
    summary:
      "온디바이스 AI 추론 최적화와 모델 경량화 경험을 가진 연구자. 모바일 NPU 환경에서 LLM 추론 성능 개선 프로젝트를 리드했다.",
    evidence: [
      "NPU 대상 모델 경량화 프로젝트 리드",
      "국제 학회 논문 3건",
      "C++/TensorRT 기반 추론 최적화 경험"
    ],
    applications: [
      { title: "DX 온디바이스 AI", stage: "기술 면접", result: "진행 중", date: "2026-06-01" }
    ],
    timeline: [
      { type: "전형", text: "기술 면접 일정 확정", actor: "최유진", date: "2026-06-03" },
      { type: "메모", text: "모델 경량화 경험 우수", actor: "현업 면접관", date: "2026-06-02" },
      { type: "접촉", text: "전화 인터뷰 완료", actor: "최유진", date: "2026-06-01" }
    ]
  },
  {
    id: "cand-003",
    name: "이준호",
    initials: "이J",
    role: "클라우드 보안 아키텍트",
    company: "Naver Cloud",
    years: 11,
    jobFamily: "Cloud Security",
    organization: "DX",
    status: "nurture",
    consent: "expiring",
    owner: "이지원",
    updatedAt: "2026-05-18",
    lastContactedAt: "2026-05-19",
    location: "성남",
    source: "소싱",
    dataQuality: 88,
    parsingConfidence: 84,
    avatarColor: "#6b7684",
    skills: ["Cloud", "Zero Trust", "Kubernetes", "IAM", "보안"],
    tags: ["동의 갱신", "고경력", "지원 유도"],
    summary:
      "클라우드 보안과 IAM 정책 설계 경험이 깊은 11년차 아키텍트. Kubernetes 보안 표준과 Zero Trust 전환 프로젝트 경험이 있다.",
    evidence: [
      "대규모 IAM 정책 재설계",
      "Kubernetes 보안 운영 기준 수립",
      "Zero Trust 기반 접근 통제 프로젝트"
    ],
    applications: [],
    timeline: [
      { type: "동의", text: "개인정보 활용 동의 만료 18일 전", actor: "Compliance", date: "2026-06-04" },
      { type: "접촉", text: "하반기 포지션 안내", actor: "이지원", date: "2026-05-19" }
    ]
  },
  {
    id: "cand-004",
    name: "정하늘",
    initials: "정H",
    role: "글로벌 품질 엔지니어",
    company: "LG Energy Solution",
    years: 5,
    jobFamily: "Quality Engineering",
    organization: "DS",
    status: "contacted",
    consent: "consented",
    owner: "박민수",
    updatedAt: "2026-05-28",
    lastContactedAt: "2026-05-28",
    location: "충남 아산",
    source: "채용 행사",
    dataQuality: 90,
    parsingConfidence: 88,
    avatarColor: "#4e5968",
    skills: ["품질", "Global CS", "8D", "영어", "제조"],
    tags: ["글로벌", "접촉 완료", "품질"],
    summary:
      "글로벌 고객 품질 대응과 제조 품질 개선 과제를 수행한 품질 엔지니어. 영어 커뮤니케이션과 8D 리포트 경험이 강점이다.",
    evidence: [
      "북미 고객 품질 이슈 대응",
      "8D 기반 재발 방지 프로세스 운영",
      "제조 라인 품질 지표 개선"
    ],
    applications: [],
    timeline: [
      { type: "접촉", text: "채용 행사 후속 연락 완료", actor: "박민수", date: "2026-05-28" },
      { type: "등록", text: "채용 행사 리드로 등록", actor: "박민수", date: "2026-05-20" }
    ]
  },
  {
    id: "cand-005",
    name: "최민재",
    initials: "최M",
    role: "임베디드 SW 엔지니어",
    company: "Hyundai Mobis",
    years: 4,
    jobFamily: "Embedded Software",
    organization: "DX",
    status: "hold",
    consent: "unknown",
    owner: "한소라",
    updatedAt: "2026-04-22",
    lastContactedAt: "2026-04-23",
    location: "서울",
    source: "리퍼럴",
    dataQuality: 72,
    parsingConfidence: 76,
    avatarColor: "#8b95a1",
    skills: ["Embedded C", "RTOS", "Automotive", "Linux", "검수 필요"],
    tags: ["검수 필요", "동의 확인", "보류"],
    summary:
      "임베디드 C와 RTOS 기반 제어 SW 경험이 있는 엔지니어. 최근 프로필 검수와 개인정보 동의 확인이 필요하다.",
    evidence: [
      "RTOS 기반 제어기 펌웨어 개발",
      "Automotive Linux 디버깅 경험",
      "동의 상태 확인 전 추천 제외"
    ],
    applications: [],
    timeline: [
      { type: "검수", text: "파싱 필드 신뢰도 낮음", actor: "AI Worker", date: "2026-04-22" },
      { type: "등록", text: "리퍼럴 후보로 등록", actor: "한소라", date: "2026-04-21" }
    ]
  }
];

const CANDIDATE_DETAILS = {
  "cand-001": {
    photoUrl: "",
    education: [
      { degree: "석사", school: "KAIST", major: "산업및시스템공학", start: "2014-03", end: "2016-02" },
      { degree: "학사", school: "한양대학교", major: "기계공학", start: "2010-03", end: "2014-02" }
    ],
    career: [
      {
        country: "대한민국",
        company: "SK hynix",
        rank: "책임",
        position: "공정 데이터 분석 리드",
        start: "2020-01",
        end: "현재",
        achievements: "NAND 공정 수율 예측 모델을 구축하고 이상 탐지 리드타임을 단축했다."
      },
      {
        country: "대한민국",
        company: "DB HiTek",
        rank: "선임",
        position: "공정 엔지니어",
        start: "2016-03",
        end: "2019-12",
        achievements: "공정 변수 최적화 실험을 주도해 월간 불량률을 개선했다."
      }
    ]
  },
  "cand-002": {
    photoUrl: "",
    education: [
      { degree: "박사", school: "서울대학교", major: "전기컴퓨터공학", start: "2014-03", end: "2019-08" },
      { degree: "학사", school: "POSTECH", major: "컴퓨터공학", start: "2010-03", end: "2014-02" }
    ],
    career: [
      {
        country: "대한민국",
        company: "Samsung Research",
        rank: "Staff Engineer",
        position: "온디바이스 AI 리서치 리드",
        start: "2021-04",
        end: "현재",
        achievements: "모바일 NPU 환경에서 LLM 추론 최적화 PoC를 리드하고 국제 학회 논문 3건을 발표했다."
      },
      {
        country: "미국",
        company: "Qualcomm AI Research",
        rank: "Research Engineer",
        position: "모델 경량화 연구원",
        start: "2019-09",
        end: "2021-03",
        achievements: "TensorRT 기반 모델 압축 실험과 엣지 추론 성능 개선 과제를 수행했다."
      }
    ]
  },
  "cand-003": {
    photoUrl: "",
    education: [
      { degree: "학사", school: "고려대학교", major: "정보보호학", start: "2006-03", end: "2010-02" }
    ],
    career: [
      {
        country: "대한민국",
        company: "Naver Cloud",
        rank: "Principal",
        position: "클라우드 보안 아키텍트",
        start: "2018-05",
        end: "현재",
        achievements: "Zero Trust 접근 통제 체계와 Kubernetes 보안 운영 표준을 설계했다."
      },
      {
        country: "대한민국",
        company: "AhnLab",
        rank: "선임",
        position: "보안 컨설턴트",
        start: "2010-03",
        end: "2018-04",
        achievements: "대기업 IAM 진단과 보안 정책 개선 프로젝트를 수행했다."
      }
    ]
  },
  "cand-004": {
    photoUrl: "",
    education: [
      { degree: "학사", school: "부산대학교", major: "산업공학", start: "2013-03", end: "2017-02" }
    ],
    career: [
      {
        country: "대한민국",
        company: "LG Energy Solution",
        rank: "선임",
        position: "글로벌 품질 엔지니어",
        start: "2020-07",
        end: "현재",
        achievements: "북미 고객 품질 이슈 대응과 8D 재발 방지 프로세스를 운영했다."
      },
      {
        country: "대한민국",
        company: "Hyundai AutoEver",
        rank: "매니저",
        position: "품질 분석 담당",
        start: "2017-03",
        end: "2020-06",
        achievements: "제조 데이터 기반 품질 지표 분석 체계를 구축했다."
      }
    ]
  },
  "cand-005": {
    photoUrl: "",
    education: [
      { degree: "학사", school: "인하대학교", major: "전자공학", start: "2016-03", end: "2020-02" }
    ],
    career: [
      {
        country: "대한민국",
        company: "Hyundai Mobis",
        rank: "매니저",
        position: "임베디드 SW 엔지니어",
        start: "2020-03",
        end: "현재",
        achievements: "RTOS 기반 제어기 펌웨어와 Automotive Linux 디버깅 업무를 수행했다."
      }
    ]
  }
};

const ENRICHED_CANDIDATES = SAMPLE_CANDIDATES.map((candidate) => ({
  ...candidate,
  photoUrl: "",
  education: [],
  career: [],
  ...CANDIDATE_DETAILS[candidate.id]
}));

const STORAGE_KEY = "samsung-talent-pool-state-v1";
const STORAGE_VERSION = 1;
const APP_CONFIG = window.__APP_CONFIG__ || {};
const SUPABASE_URL = (APP_CONFIG.supabaseUrl || "").replace(/\/$/, "");
const SUPABASE_ANON_KEY = APP_CONFIG.supabaseAnonKey || "";
const DATA_SOURCE = APP_CONFIG.dataSource || "local";
const REMOTE_SYNC_ENABLED = DATA_SOURCE === "supabase" && SUPABASE_URL && SUPABASE_ANON_KEY;

const state = {
  view: "dashboard",
  candidates: structuredClone(ENRICHED_CANDIDATES),
  selectedCandidateId: "cand-001",
  detailTab: "overview",
  isEditingCandidate: false,
  editSnapshot: null,
  poolFilters: {
    query: "",
    status: "all",
    consent: "all",
    owner: "all"
  },
  aiQuery: "NAND 공정 개발 경험이 있고 Python 데이터 분석 역량이 있는 3~7년차 후보자",
  aiResults: [],
  remoteSyncStatus: REMOTE_SYNC_ENABLED ? "대기" : "로컬",
  auditLogs: [
    { actor: "이지원", action: "후보자 상세 조회", resource: "김도현", purpose: "DS 공정 AI 후보 검토", time: "2026-06-04 09:18" },
    { actor: "AI Worker", action: "이력서 파싱", resource: "박서연", purpose: "경력 요약 생성", time: "2026-06-04 09:12" },
    { actor: "최유진", action: "AI 검색", resource: "온디바이스 AI", purpose: "DX 리서처 Shortlist", time: "2026-06-04 08:57" },
    { actor: "Compliance", action: "동의 만료 스캔", resource: "이준호", purpose: "30일 내 만료 후보 확인", time: "2026-06-04 08:30" }
  ]
};

const viewTitles = {
  dashboard: "대시보드",
  pool: "인재 Pool",
  register: "인재 등록",
  "ai-search": "AI 검색",
  detail: "상세 프로필",
  audit: "감사 로그"
};

const $ = (selector) => document.querySelector(selector);

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ensureAuditLogIds() {
  state.auditLogs.forEach((log) => {
    if (!log.id) {
      log.id = createId("audit");
    }
  });
}

function loadPersistedState() {
  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      return null;
    }

    const parsed = JSON.parse(rawState);
    return parsed?.version === STORAGE_VERSION ? parsed : null;
  } catch (error) {
    console.warn("Persisted state could not be loaded.", error);
    return null;
  }
}

function persistState(options = {}) {
  try {
    ensureAuditLogIds();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        candidates: state.candidates,
        auditLogs: state.auditLogs,
        selectedCandidateId: state.selectedCandidateId,
        poolFilters: state.poolFilters
      })
    );
  } catch (error) {
    console.warn("Talent pool state could not be saved.", error);
  }

  if (!options.skipRemoteSync) {
    scheduleRemoteSync();
  }
}

function restorePersistedState() {
  const persisted = loadPersistedState();

  if (!persisted) {
    return;
  }

  if (Array.isArray(persisted.candidates) && persisted.candidates.length) {
    state.candidates = persisted.candidates;
  }

  if (Array.isArray(persisted.auditLogs)) {
    state.auditLogs = persisted.auditLogs;
  }

  if (persisted.poolFilters && typeof persisted.poolFilters === "object") {
    state.poolFilters = { ...state.poolFilters, ...persisted.poolFilters };
  }

  if (state.candidates.some((candidate) => candidate.id === persisted.selectedCandidateId)) {
    state.selectedCandidateId = persisted.selectedCandidateId;
  } else {
    state.selectedCandidateId = state.candidates[0]?.id || "";
  }

  ensureAuditLogIds();
}

function getSupabaseHeaders(extraHeaders = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extraHeaders
  };
}

async function supabaseRequest(path, options = {}) {
  if (!REMOTE_SYNC_ENABLED) {
    return null;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: getSupabaseHeaders(options.headers)
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${detail}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function candidateToSupabaseRow(candidate) {
  return {
    id: candidate.id,
    name: candidate.name,
    company: candidate.company,
    role: candidate.role,
    owner: candidate.owner,
    status: candidate.status,
    updated_at: new Date().toISOString(),
    profile: candidate
  };
}

function auditLogToSupabaseRow(log) {
  return {
    id: log.id,
    actor: log.actor,
    action: log.action,
    resource: log.resource,
    purpose: log.purpose,
    time_text: log.time,
    payload: log
  };
}

let remoteSyncTimer = null;
let remoteSyncInFlight = false;

function scheduleRemoteSync() {
  if (!REMOTE_SYNC_ENABLED) {
    return;
  }

  window.clearTimeout(remoteSyncTimer);
  remoteSyncTimer = window.setTimeout(() => {
    syncStateToSupabase();
  }, 600);
}

async function syncStateToSupabase() {
  if (!REMOTE_SYNC_ENABLED || remoteSyncInFlight) {
    return;
  }

  remoteSyncInFlight = true;
  state.remoteSyncStatus = "동기화 중";

  try {
    ensureAuditLogIds();
    const candidateRows = state.candidates.map(candidateToSupabaseRow);
    const auditRows = state.auditLogs.map(auditLogToSupabaseRow);

    if (candidateRows.length) {
      await supabaseRequest("candidates?on_conflict=id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(candidateRows)
      });
    }

    if (auditRows.length) {
      await supabaseRequest("audit_logs?on_conflict=id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(auditRows)
      });
    }

    state.remoteSyncStatus = "Supabase 연결됨";
  } catch (error) {
    state.remoteSyncStatus = "Supabase 동기화 실패";
    console.warn(error);
  } finally {
    remoteSyncInFlight = false;
  }
}

async function loadStateFromSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return;
  }

  try {
    state.remoteSyncStatus = "Supabase 불러오는 중";
    const [candidateRows, auditRows] = await Promise.all([
      supabaseRequest("candidates?select=profile&order=updated_at.desc"),
      supabaseRequest("audit_logs?select=payload&order=created_at.desc&limit=200")
    ]);

    if (Array.isArray(candidateRows) && candidateRows.length) {
      state.candidates = candidateRows.map((row) => row.profile).filter(Boolean);
      state.selectedCandidateId = state.candidates[0]?.id || state.selectedCandidateId;
    }

    if (Array.isArray(auditRows) && auditRows.length) {
      state.auditLogs = auditRows.map((row) => row.payload).filter(Boolean);
      ensureAuditLogIds();
    }

    state.remoteSyncStatus = "Supabase 연결됨";
    persistState({ skipRemoteSync: true });
    render();

    if (!candidateRows?.length) {
      scheduleRemoteSync();
    }
  } catch (error) {
    state.remoteSyncStatus = "Supabase 불러오기 실패";
    console.warn(error);
    showToast("Supabase 연결을 확인해주세요. 로컬 데이터로 표시합니다.");
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.size) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result.toString()));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCandidate(id = state.selectedCandidateId) {
  return state.candidates.find((candidate) => candidate.id === id) || state.candidates[0];
}

function replaceCandidate(candidate) {
  const index = state.candidates.findIndex((item) => item.id === candidate.id);

  if (index >= 0) {
    state.candidates[index] = candidate;
  }
}

function startCandidateEdit() {
  if (!state.isEditingCandidate) {
    state.editSnapshot = structuredClone(getCandidate());
  }

  state.isEditingCandidate = true;
  renderDetail();
}

function discardCandidateEditDraft() {
  if (state.editSnapshot) {
    replaceCandidate(structuredClone(state.editSnapshot));
    state.selectedCandidateId = state.editSnapshot.id;
  }

  state.editSnapshot = null;
  state.isEditingCandidate = false;
}

function getStatusChip(status) {
  const chipClass = {
    interested: "chip-blue",
    contact_planned: "chip-amber",
    contacted: "chip-green",
    nurture: "chip-violet",
    screening: "chip-blue",
    hold: "chip-amber",
    inactive: "chip-red"
  }[status] || "chip-blue";

  return `<span class="status-chip ${chipClass}">${STATUS_LABELS[status]}</span>`;
}

function getConsentChip(consent) {
  const chipClass = {
    consented: "chip-green",
    expiring: "chip-amber",
    expired: "chip-red",
    revoked: "chip-red",
    unknown: "chip-violet"
  }[consent] || "chip-violet";

  return `<span class="status-chip ${chipClass}">${CONSENT_LABELS[consent]}</span>`;
}

function candidateVisual(candidate, size = "") {
  const className = `avatar ${size}`.trim();

  if (candidate.photoUrl) {
    return `<img class="${className}" src="${escapeHtml(candidate.photoUrl)}" alt="${escapeHtml(candidate.name)} 프로필 사진" />`;
  }

  return `<span class="${className}" style="background:${candidate.avatarColor}">${candidate.initials}</span>`;
}

function getPrimaryEducation(candidate) {
  return candidate.education?.[0] || null;
}

function getPrimaryCareer(candidate) {
  return candidate.career?.[0] || null;
}

function formatPeriod(start, end) {
  if (!start && !end) {
    return "-";
  }

  return `${start || "-"} ~ ${end || "-"}`;
}

function formatEducationSummary(candidate) {
  const education = getPrimaryEducation(candidate);

  if (!education) {
    return { title: "-", meta: "학력 정보 없음" };
  }

  return {
    title: `${education.degree} · ${education.school}`,
    meta: `${education.major} · ${formatPeriod(education.start, education.end)}`
  };
}

function formatCareerSummary(candidate) {
  const career = getPrimaryCareer(candidate);

  if (!career) {
    return { title: "-", meta: "경력 정보 없음" };
  }

  return {
    title: `${career.company} · ${career.rank}`,
    meta: `${career.position} · ${formatPeriod(career.start, career.end)}`
  };
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

function setView(view) {
  state.view = view;
  if (view !== "detail" && state.isEditingCandidate) {
    discardCandidateEditDraft();
  }
  $(".view.is-active")?.classList.remove("is-active");
  $(`#${view}-view`)?.classList.add("is-active");
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view || (view === "detail" && button.dataset.view === "pool"));
  });
  $("#page-title").textContent = viewTitles[view] || "Talent Pool";
  render();
}

function getFilteredCandidates() {
  const query = state.poolFilters.query.trim().toLowerCase();

  return state.candidates.filter((candidate) => {
    const text = [
      candidate.name,
      candidate.role,
      candidate.company,
      candidate.jobFamily,
      candidate.organization,
      candidate.owner,
      ...candidate.skills,
      ...candidate.tags,
      ...(candidate.education || []).flatMap((item) => [item.degree, item.school, item.major, item.start, item.end]),
      ...(candidate.career || []).flatMap((item) => [item.country, item.company, item.rank, item.position, item.start, item.end, item.achievements])
    ]
      .join(" ")
      .toLowerCase();

    const queryMatch = !query || text.includes(query);
    const statusMatch = state.poolFilters.status === "all" || candidate.status === state.poolFilters.status;
    const consentMatch = state.poolFilters.consent === "all" || candidate.consent === state.poolFilters.consent;
    const ownerMatch = state.poolFilters.owner === "all" || candidate.owner === state.poolFilters.owner;

    return queryMatch && statusMatch && consentMatch && ownerMatch;
  });
}

function render() {
  renderSidePanel();
  renderDashboard();
  renderPool();
  renderRegister();
  renderAiSearch();
  renderDetail();
  renderAudit();
}

function renderSidePanel() {
  const expiring = state.candidates.filter((candidate) => candidate.consent === "expiring").length;
  $("#side-expiring-count").textContent = `${expiring}명`;
}

function renderDashboard() {
  const total = state.candidates.length;
  const active = state.candidates.filter((candidate) => candidate.status !== "inactive" && candidate.consent === "consented").length;
  const reviewRequired = state.candidates.filter((candidate) => candidate.parsingConfidence < 85 || candidate.consent === "unknown").length;
  const expiring = state.candidates.filter((candidate) => candidate.consent === "expiring").length;
  const screening = state.candidates.filter((candidate) => candidate.status === "screening").length;

  const skillCounts = getSkillCounts().slice(0, 6);
  const maxSkill = Math.max(...skillCounts.map((item) => item.count), 1);
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: state.candidates.filter((candidate) => candidate.status === status).length
  }));
  const maxStatus = Math.max(...statusCounts.map((item) => item.count), 1);
  const actionCandidates = state.candidates
    .filter((candidate) => candidate.consent !== "consented" || candidate.parsingConfidence < 88 || candidate.status === "contact_planned")
    .slice(0, 5);

  $("#dashboard-content").innerHTML = `
    <div class="dashboard-grid">
      <div class="kpi-row">
        ${metricCard("전체 후보자", total, "전월 대비 +14명")}
        ${metricCard("활성 후보자", active, "동의 유효 후보")}
        ${metricCard("검수 대기", reviewRequired, "파싱/동의 확인")}
        ${metricCard("전형 진행", screening, "현업 검토 포함")}
        ${metricCard("동의 만료 예정", expiring, "30일 이내")}
      </div>

      <section class="content-panel span-7">
        <div class="panel-header">
          <h4>직무 상태 파이프라인</h4>
          <span class="small-pill">MVP 운영</span>
        </div>
        <div class="pipeline">
          ${statusCounts.map((item) => `
            <div class="pipeline-row">
              <span>${STATUS_LABELS[item.status]}</span>
              <div class="pipeline-track">
                <div class="pipeline-fill" style="width:${Math.max(10, (item.count / maxStatus) * 100)}%"></div>
              </div>
              <strong>${item.count}</strong>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="content-panel span-5">
        <div class="panel-header">
          <h4>상위 기술 키워드</h4>
          <span class="small-pill">검색 인덱스</span>
        </div>
        <div class="bar-list">
          ${skillCounts.map((item, index) => `
            <div class="bar-row">
              <span class="truncate">${escapeHtml(item.skill)}</span>
              <div class="bar-track">
                <div class="bar-fill ${["", "green", "amber", "violet"][index % 4]}" style="width:${(item.count / maxSkill) * 100}%"></div>
              </div>
              <strong>${item.count}</strong>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="content-panel span-8">
        <div class="panel-header">
          <h4>운영 액션 큐</h4>
          <button class="soft-button" type="button" data-view="pool">목록 보기</button>
        </div>
        ${candidateTable(actionCandidates)}
      </section>

      <section class="content-panel span-4">
        <div class="panel-header">
          <h4>AI 추천 시그널</h4>
          <span class="small-pill">근거 기반</span>
        </div>
        <div class="bar-list">
          ${signalRow("재접촉 우선", 82, "green")}
          ${signalRow("동의 갱신 필요", 34, "amber")}
          ${signalRow("파싱 신뢰도 낮음", 26, "violet")}
          ${signalRow("전형 전환 가능", 67, "")}
        </div>
      </section>
    </div>
  `;
}

function metricCard(label, value, trend) {
  return `
    <article class="metric-card">
      <p class="metric-label">${label}</p>
      <div class="metric-value">${value}<span>명</span></div>
      <div class="metric-trend">${trend}</div>
    </article>
  `;
}

function signalRow(label, value, color) {
  return `
    <div class="bar-row">
      <span>${label}</span>
      <div class="bar-track">
        <div class="bar-fill ${color}" style="width:${value}%"></div>
      </div>
      <strong>${value}</strong>
    </div>
  `;
}

function getSkillCounts() {
  const counts = new Map();
  state.candidates.forEach((candidate) => {
    candidate.skills.forEach((skill) => {
      counts.set(skill, (counts.get(skill) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill));
}

function candidateTable(candidates) {
  if (!candidates.length) {
    return `<div class="empty-state">표시할 후보자가 없습니다.</div>`;
  }

  return `
    <div class="table-wrap">
      <table class="candidate-table">
        <colgroup>
          <col class="col-photo" />
          <col class="col-name" />
          <col class="col-education" />
          <col class="col-career" />
          <col class="col-role" />
          <col class="col-status" />
          <col class="col-owner" />
        </colgroup>
        <thead>
          <tr>
            <th>사진</th>
            <th>후보자 이름</th>
            <th>학력</th>
            <th>경력</th>
            <th>직무</th>
            <th>상태</th>
            <th>담당자</th>
          </tr>
        </thead>
        <tbody>
          ${candidates.map((candidate) => {
            const educationSummary = formatEducationSummary(candidate);
            const careerSummary = formatCareerSummary(candidate);

            return `
            <tr>
              <td class="photo-cell">${candidateVisual(candidate)}</td>
              <td class="candidate-cell">
                <div class="candidate-name candidate-name-compact">
                  <span>
                    <button class="candidate-name-button" type="button" data-select-candidate="${candidate.id}">${escapeHtml(candidate.name)}</button>
                    <span>${escapeHtml(candidate.company)} · ${candidate.years}년</span>
                  </span>
                </div>
              </td>
              <td class="summary-cell">
                <strong>${escapeHtml(educationSummary.title)}</strong>
                <span>${escapeHtml(educationSummary.meta)}</span>
              </td>
              <td class="summary-cell">
                <strong>${escapeHtml(careerSummary.title)}</strong>
                <span>${escapeHtml(careerSummary.meta)}</span>
              </td>
              <td class="role-cell">${escapeHtml(candidate.role)}</td>
              <td>${getStatusChip(candidate.status)}</td>
              <td>${escapeHtml(candidate.owner)}</td>
            </tr>
          `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPool() {
  const owners = [...new Set(state.candidates.map((candidate) => candidate.owner))];
  const candidates = getFilteredCandidates();

  $("#pool-content").innerHTML = `
    <div class="filter-strip">
      <input class="control-input" id="pool-query" type="search" value="${escapeHtml(state.poolFilters.query)}" placeholder="이름, 회사, 기술, 태그" />
      <select class="control-select" id="pool-status">
        <option value="all">전체 상태</option>
        ${STATUS_ORDER.map((status) => `<option value="${status}" ${state.poolFilters.status === status ? "selected" : ""}>${STATUS_LABELS[status]}</option>`).join("")}
      </select>
      <select class="control-select" id="pool-owner">
        <option value="all">전체 담당자</option>
        ${owners.map((owner) => `<option value="${owner}" ${state.poolFilters.owner === owner ? "selected" : ""}>${owner}</option>`).join("")}
      </select>
    </div>
    ${candidateTable(candidates)}
  `;
}

function renderRegister() {
  $("#register-content").innerHTML = `
    <div class="form-grid">
      <form class="form-panel" id="register-form">
        <div class="field-grid">
          <div class="field">
            <label for="candidate-name">이름</label>
            <input class="control-input" id="candidate-name" name="name" required value="문지훈" />
          </div>
          <div class="field">
            <label for="candidate-company">현재/최근 회사</label>
            <input class="control-input" id="candidate-company" name="company" required value="ASML Korea" />
          </div>
          <div class="field">
            <label for="candidate-role">직무</label>
            <input class="control-input" id="candidate-role" name="role" required value="반도체 장비 SW 엔지니어" />
          </div>
          <div class="field">
            <label for="candidate-years">총 경력</label>
            <input class="control-input" id="candidate-years" name="years" type="number" min="0" max="40" value="7" />
          </div>
          <div class="field">
            <label for="candidate-owner">담당자</label>
            <select class="control-select" id="candidate-owner" name="owner">
              <option>이지원</option>
              <option>박민수</option>
              <option>최유진</option>
              <option>한소라</option>
            </select>
          </div>
          <div class="field">
            <label for="candidate-consent">동의 상태</label>
            <select class="control-select" id="candidate-consent" name="consent">
              <option value="consented">동의</option>
              <option value="expiring">만료 예정</option>
              <option value="unknown">미확인</option>
            </select>
          </div>
          <div class="field full">
            <label for="profile-photo">얼굴 프로필 사진</label>
            <div class="dropzone profile-upload">
              <input id="profile-photo" name="photo" type="file" accept="image/*" />
              <div id="photo-preview" class="photo-preview">사진 미리보기</div>
              <span>업로드한 사진은 상세 프로필 상단에 표시됩니다.</span>
            </div>
          </div>
          <div class="field full form-section-title">학력 정보</div>
          <div class="field">
            <label for="education-degree">학위</label>
            <input class="control-input" id="education-degree" name="educationDegree" value="학사" />
          </div>
          <div class="field">
            <label for="education-school">학교명</label>
            <input class="control-input" id="education-school" name="educationSchool" value="성균관대학교" />
          </div>
          <div class="field">
            <label for="education-major">전공명</label>
            <input class="control-input" id="education-major" name="educationMajor" value="전자전기공학" />
          </div>
          <div class="field">
            <label for="education-start">학위 시작</label>
            <input class="control-input" id="education-start" name="educationStart" type="month" value="2012-03" />
          </div>
          <div class="field">
            <label for="education-end">학위 종료</label>
            <input class="control-input" id="education-end" name="educationEnd" type="month" value="2016-02" />
          </div>
          <div class="field full form-section-title">경력 정보</div>
          <div class="field">
            <label for="career-country">직장 소재 국가</label>
            <input class="control-input" id="career-country" name="careerCountry" value="대한민국" />
          </div>
          <div class="field">
            <label for="career-company">직장명</label>
            <input class="control-input" id="career-company" name="careerCompany" value="ASML Korea" />
          </div>
          <div class="field">
            <label for="career-rank">직급</label>
            <input class="control-input" id="career-rank" name="careerRank" value="Senior Engineer" />
          </div>
          <div class="field">
            <label for="career-position">직책</label>
            <input class="control-input" id="career-position" name="careerPosition" value="장비 제어 SW 담당" />
          </div>
          <div class="field">
            <label for="career-start">근무 시작</label>
            <input class="control-input" id="career-start" name="careerStart" type="month" value="2019-01" />
          </div>
          <div class="field">
            <label for="career-end">근무 종료</label>
            <input class="control-input" id="career-end" name="careerEnd" type="month" value="2026-06" />
            <label class="inline-check"><input type="checkbox" name="careerCurrent" checked /> 현재 재직 중</label>
          </div>
          <div class="field full">
            <label for="career-achievements">직장에서의 주요성과/실적</label>
            <textarea class="control-textarea" id="career-achievements" name="careerAchievements">EUV 장비 제어 SW 안정화와 제조 현장 이슈 분석 자동화를 수행.</textarea>
          </div>
          <div class="field full">
            <label for="candidate-skills">핵심 기술</label>
            <input class="control-input" id="candidate-skills" name="skills" value="EUV, C++, Python, 장비 제어, Linux" />
          </div>
          <div class="field full">
            <label for="candidate-summary">담당자 메모</label>
            <textarea class="control-textarea" id="candidate-summary" name="summary">EUV 장비 제어 SW와 제조 현장 이슈 분석 경험이 있어 DS 장비 SW 포지션에 적합.</textarea>
          </div>
          <div class="field full">
            <label for="resume-file">이력서 파일</label>
            <div class="dropzone">
              <input id="resume-file" name="resume" type="file" accept=".pdf,.doc,.docx,.hwp" />
            </div>
          </div>
        </div>
        <div class="actions-cell" style="margin-top:16px">
          <button class="primary-button" type="button" data-register-submit>등록 및 파싱</button>
          <button class="ghost-button" type="reset">초기화</button>
        </div>
      </form>

      <aside class="form-panel parse-preview">
        <div class="panel-header">
          <h4>파싱 검수 미리보기</h4>
          <span class="status-chip chip-green">88%</span>
        </div>
        <div class="confidence-ring"><strong>88%</strong></div>
        ${parseField("경력", "7년", "높음")}
        ${parseField("직무", "장비 SW", "높음")}
        ${parseField("기술", "EUV, C++, Python", "중간")}
        ${parseField("출처", "직접 등록", "확인")}
        ${parseField("상태", "검수 필요", "대기")}
      </aside>
    </div>
  `;
}

function parseField(label, value, confidence) {
  return `
    <div class="parse-field">
      <span class="muted">${label}</span>
      <strong>${value}</strong>
      <span class="small-pill">${confidence}</span>
    </div>
  `;
}

function renderAiSearch() {
  if (!state.aiResults.length) {
    state.aiResults = runAiSearch(state.aiQuery);
  }

  const interpreted = interpretQuery(state.aiQuery);

  $("#ai-search-content").innerHTML = `
    <div class="ai-layout">
      <section class="form-panel query-box">
        <label class="visually-hidden" for="ai-query">AI 검색어</label>
        <textarea class="control-textarea" id="ai-query">${escapeHtml(state.aiQuery)}</textarea>
        <div class="suggestion-row">
          <button type="button" data-ai-suggestion="온디바이스 AI 또는 임베디드 ML 프로젝트 경험이 있는 SW 엔지니어">온디바이스 AI</button>
          <button type="button" data-ai-suggestion="글로벌 고객 대응 경험이 있는 반도체 품질 엔지니어">글로벌 품질</button>
          <button type="button" data-ai-suggestion="클라우드 보안과 Kubernetes 운영 경험이 있는 8년 이상 후보자">클라우드 보안</button>
        </div>
        <button class="primary-button" type="button" id="run-ai-search">검색 실행</button>
        <div class="tag-row">
          ${interpreted.map((item) => `<span class="status-chip chip-blue">${escapeHtml(item)}</span>`).join("")}
        </div>
      </section>

      <section class="search-results">
        ${state.aiResults.map((result) => searchResultCard(result)).join("")}
      </section>
    </div>
  `;
}

function interpretQuery(query) {
  const tokens = [];
  const keywordMap = [
    ["NAND", "NAND"],
    ["Python", "Python"],
    ["AI", "AI"],
    ["온디바이스", "On-device AI"],
    ["임베디드", "Embedded"],
    ["글로벌", "Global"],
    ["품질", "Quality"],
    ["클라우드", "Cloud"],
    ["보안", "Security"],
    ["Kubernetes", "Kubernetes"]
  ];

  keywordMap.forEach(([needle, label]) => {
    if (query.toLowerCase().includes(needle.toLowerCase()) && !tokens.includes(label)) {
      tokens.push(label);
    }
  });

  const yearMatch = query.match(/(\d+)\s*[~\-]\s*(\d+)년/);
  if (yearMatch) {
    tokens.push(`${yearMatch[1]}-${yearMatch[2]}년`);
  }

  if (!tokens.length) {
    tokens.push("자연어 조건", "동의 유효 후보", "접근 권한 반영");
  }

  return tokens;
}

function runAiSearch(query) {
  const interpreted = interpretQuery(query).map((item) => item.toLowerCase());
  const queryText = query.toLowerCase();

  return state.candidates
    .filter((candidate) => candidate.consent === "consented" || candidate.consent === "expiring")
    .map((candidate) => {
      const profileText = [
        candidate.role,
        candidate.jobFamily,
        candidate.company,
        candidate.summary,
        ...candidate.skills,
        ...candidate.tags,
        ...candidate.evidence
      ]
        .join(" ")
        .toLowerCase();

      const keywordHits = interpreted.filter((token) => profileText.includes(token)).length;
      const directHits = candidate.skills.filter((skill) => queryText.includes(skill.toLowerCase())).length;
      const yearFit = queryText.includes("3~7") || queryText.includes("3-7") ? candidate.years >= 3 && candidate.years <= 7 : true;
      const score = Math.min(98, Math.round(58 + keywordHits * 9 + directHits * 11 + (yearFit ? 7 : -9) + candidate.dataQuality / 10));

      return { ...candidate, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
}

function searchResultCard(candidate) {
  return `
    <article class="search-result">
      <div>
        <div class="candidate-name">
          ${candidateVisual(candidate)}
          <span>
            <strong>${escapeHtml(candidate.name)}</strong>
            <span>${escapeHtml(candidate.role)} · ${candidate.company}</span>
          </span>
        </div>
        <p>${escapeHtml(candidate.summary)}</p>
        <div class="tag-row">
          ${candidate.skills.slice(0, 5).map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
          ${getStatusChip(candidate.status)}
          ${getConsentChip(candidate.consent)}
        </div>
        <ul class="evidence-list">
          ${candidate.evidence.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <div class="actions-cell" style="margin-top:12px">
          <button class="primary-button" type="button" data-select-candidate="${candidate.id}">상세 보기</button>
          <button class="ghost-button" type="button" data-shortlist="${candidate.id}">Shortlist</button>
        </div>
      </div>
      <div class="match-score">${candidate.matchScore}%</div>
    </article>
  `;
}

function renderDetail() {
  const candidate = getCandidate();
  $("#detail-actions").innerHTML = state.isEditingCandidate
    ? `<button class="ghost-button" type="button" data-cancel-edit>수정 취소</button>`
    : `
      <button class="ghost-button" type="button" data-start-edit>정보 수정</button>
      <button class="ghost-button" type="button" data-change-status="contacted">접촉 완료</button>
      <button class="primary-button" type="button" data-change-status="screening">전형 진행</button>
    `;

  if (state.isEditingCandidate) {
    $("#detail-content").innerHTML = renderCandidateEditForm(candidate);
    return;
  }

  $("#detail-content").innerHTML = `
    <div class="detail-grid">
      <aside class="profile-panel">
        <div class="profile-hero">
          ${candidateVisual(candidate, "large")}
          <div>
            <h4>${escapeHtml(candidate.name)}</h4>
            <span class="muted">${escapeHtml(candidate.company)} · ${candidate.years}년</span>
          </div>
        </div>
        <p>${escapeHtml(candidate.summary)}</p>
        <div class="tag-row">
          ${getStatusChip(candidate.status)}
          ${getConsentChip(candidate.consent)}
        </div>
        <div class="profile-stats">
          ${statBox("품질 점수", `${candidate.dataQuality}`)}
          ${statBox("파싱 신뢰도", `${candidate.parsingConfidence}%`)}
          ${statBox("담당자", candidate.owner)}
          ${statBox("조직", candidate.organization)}
        </div>
      </aside>

      <section class="profile-panel">
        <div class="tabs">
          ${detailTabButton("overview", "요약")}
          ${detailTabButton("resume", "이력서")}
          ${detailTabButton("education", "학력")}
          ${detailTabButton("career", "경력")}
          ${detailTabButton("activity", "이력")}
          ${detailTabButton("applications", "지원")}
          ${detailTabButton("compliance", "컴플라이언스")}
        </div>
        ${renderDetailTab(candidate)}
      </section>
    </div>
  `;
}

function statBox(label, value) {
  return `
    <div class="stat-box">
      <span>${label}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function detailTabButton(tab, label) {
  return `<button class="tab-button ${state.detailTab === tab ? "is-active" : ""}" type="button" data-detail-tab="${tab}">${label}</button>`;
}

function detailInfoGrid(items) {
  return `
    <div class="detail-info-grid">
      ${items.map((item) => `
        <div class="detail-info-item">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value || "-")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEducationTab(candidate) {
  if (!candidate.education?.length) {
    return `<div class="empty-state">등록된 학력 정보가 없습니다.</div>`;
  }

  return `
    <div class="detail-card-list">
      ${candidate.education.map((item) => `
        <article class="detail-record-card">
          <div class="record-card-header">
            <strong>${escapeHtml(item.school)}</strong>
            <span class="status-chip chip-blue">${escapeHtml(item.degree)}</span>
          </div>
          ${detailInfoGrid([
            { label: "학위", value: item.degree },
            { label: "학교명", value: item.school },
            { label: "전공명", value: item.major },
            { label: "학위 시작", value: item.start },
            { label: "학위 종료", value: item.end }
          ])}
        </article>
      `).join("")}
    </div>
  `;
}

function renderCareerTab(candidate) {
  if (!candidate.career?.length) {
    return `<div class="empty-state">등록된 경력 정보가 없습니다.</div>`;
  }

  return `
    <div class="detail-card-list">
      ${candidate.career.map((item) => `
        <article class="detail-record-card">
          <div class="record-card-header">
            <strong>${escapeHtml(item.company)}</strong>
            <span class="status-chip ${item.end === "현재" ? "chip-green" : "chip-blue"}">${escapeHtml(item.end === "현재" ? "현재 재직" : "경력")}</span>
          </div>
          ${detailInfoGrid([
            { label: "직장 소재 국가", value: item.country },
            { label: "직장명", value: item.company },
            { label: "직급", value: item.rank },
            { label: "직책", value: item.position },
            { label: "근무 시작", value: item.start },
            { label: "근무 종료", value: item.end }
          ])}
          <div class="achievement-box">
            <span>직장에서의 주요성과/실적</span>
            <p>${escapeHtml(item.achievements)}</p>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function inputValue(value) {
  return escapeHtml(value || "");
}

function renderCandidateEditForm(candidate) {
  const education = candidate.education?.length ? candidate.education : [{ degree: "", school: "", major: "", start: "", end: "" }];
  const career = candidate.career?.length
    ? candidate.career
    : [{ country: "", company: "", rank: "", position: "", start: "", end: "", achievements: "" }];

  return `
    <form class="profile-panel edit-form" id="candidate-edit-form">
      <div class="edit-form-header">
        <div>
          <p class="eyebrow">Profile Edit</p>
          <h4>${escapeHtml(candidate.name)} 정보 수정</h4>
        </div>
        <div class="actions-cell">
          <button class="ghost-button" type="button" data-cancel-edit>취소</button>
          <button class="primary-button" type="button" data-save-candidate>저장</button>
        </div>
      </div>
      <div class="form-error" id="candidate-edit-error" hidden></div>

      <section class="edit-section">
        <h5>기본 정보</h5>
        <div class="field-grid">
          <div class="field">
            <label for="edit-name">이름</label>
            <input class="control-input" id="edit-name" name="editName" value="${inputValue(candidate.name)}" />
          </div>
          <div class="field">
            <label for="edit-company">현재/최근 회사</label>
            <input class="control-input" id="edit-company" name="editCompany" value="${inputValue(candidate.company)}" />
          </div>
          <div class="field">
            <label for="edit-role">직무</label>
            <input class="control-input" id="edit-role" name="editRole" value="${inputValue(candidate.role)}" />
          </div>
          <div class="field">
            <label for="edit-years">총 경력</label>
            <input class="control-input" id="edit-years" name="editYears" type="number" min="0" max="40" value="${inputValue(candidate.years)}" />
          </div>
          <div class="field">
            <label for="edit-owner">담당자</label>
            <input class="control-input" id="edit-owner" name="editOwner" value="${inputValue(candidate.owner)}" />
          </div>
          <div class="field">
            <label for="edit-status">상태</label>
            <select class="control-select" id="edit-status" name="editStatus">
              ${STATUS_ORDER.map((status) => `<option value="${status}" ${candidate.status === status ? "selected" : ""}>${STATUS_LABELS[status]}</option>`).join("")}
            </select>
          </div>
          <div class="field full">
            <label for="edit-photo">얼굴 프로필 사진</label>
            <div class="dropzone profile-upload">
              <input id="edit-photo" name="editPhoto" type="file" accept="image/*" />
              <div id="edit-photo-preview" class="photo-preview">
                ${candidate.photoUrl ? `<img src="${escapeHtml(candidate.photoUrl)}" alt="${escapeHtml(candidate.name)} 프로필 사진 미리보기" />` : "사진 미리보기"}
              </div>
              <span>새 사진을 선택하면 저장 후 상세 프로필에 반영됩니다.</span>
            </div>
          </div>
          <div class="field full">
            <label for="edit-skills">핵심 기술</label>
            <input class="control-input" id="edit-skills" name="editSkills" value="${inputValue(candidate.skills.join(", "))}" />
          </div>
          <div class="field full">
            <label for="edit-summary">요약</label>
            <textarea class="control-textarea" id="edit-summary" name="editSummary">${inputValue(candidate.summary)}</textarea>
          </div>
        </div>
      </section>

      <section class="edit-section">
        <div class="edit-section-header">
          <h5>학력 정보</h5>
          <button class="soft-button" type="button" data-add-education>학력 추가</button>
        </div>
        <div class="edit-record-list">
          ${education.map((item, index) => renderEducationEditRecord(item, index)).join("")}
        </div>
      </section>

      <section class="edit-section">
        <div class="edit-section-header">
          <h5>경력 정보</h5>
          <button class="soft-button" type="button" data-add-career>경력 추가</button>
        </div>
        <div class="edit-record-list">
          ${career.map((item, index) => renderCareerEditRecord(item, index)).join("")}
        </div>
      </section>

      <div class="edit-form-actions">
        <button class="ghost-button" type="button" data-cancel-edit>취소</button>
        <button class="primary-button" type="button" data-save-candidate>저장</button>
      </div>
    </form>
  `;
}

function renderEducationEditRecord(item, index) {
  return `
    <article class="edit-record" data-education-index="${index}">
      <div class="edit-record-header">
        <strong>학력 ${index + 1}</strong>
        <button class="ghost-button danger-button compact-button" type="button" data-remove-education="${index}">삭제</button>
      </div>
      <div class="field-grid">
        <div class="field">
          <label for="education-degree-${index}">학위</label>
          <input class="control-input" id="education-degree-${index}" name="education-degree-${index}" value="${inputValue(item.degree)}" />
        </div>
        <div class="field">
          <label for="education-school-${index}">학교명</label>
          <input class="control-input" id="education-school-${index}" name="education-school-${index}" value="${inputValue(item.school)}" />
        </div>
        <div class="field">
          <label for="education-major-${index}">전공명</label>
          <input class="control-input" id="education-major-${index}" name="education-major-${index}" value="${inputValue(item.major)}" />
        </div>
        <div class="field">
          <label for="education-start-${index}">학위 시작</label>
          <input class="control-input" id="education-start-${index}" name="education-start-${index}" type="month" value="${inputValue(item.start)}" />
        </div>
        <div class="field">
          <label for="education-end-${index}">학위 종료</label>
          <input class="control-input" id="education-end-${index}" name="education-end-${index}" type="month" value="${inputValue(item.end)}" />
        </div>
      </div>
    </article>
  `;
}

function renderCareerEditRecord(item, index) {
  const isCurrent = item.end === "현재";

  return `
    <article class="edit-record" data-career-index="${index}">
      <div class="edit-record-header">
        <strong>경력 ${index + 1}</strong>
        <button class="ghost-button danger-button compact-button" type="button" data-remove-career="${index}">삭제</button>
      </div>
      <div class="field-grid">
        <div class="field">
          <label for="career-country-${index}">직장 소재 국가</label>
          <input class="control-input" id="career-country-${index}" name="career-country-${index}" value="${inputValue(item.country)}" />
        </div>
        <div class="field">
          <label for="career-company-${index}">직장명</label>
          <input class="control-input" id="career-company-${index}" name="career-company-${index}" value="${inputValue(item.company)}" />
        </div>
        <div class="field">
          <label for="career-rank-${index}">직급</label>
          <input class="control-input" id="career-rank-${index}" name="career-rank-${index}" value="${inputValue(item.rank)}" />
        </div>
        <div class="field">
          <label for="career-position-${index}">직책</label>
          <input class="control-input" id="career-position-${index}" name="career-position-${index}" value="${inputValue(item.position)}" />
        </div>
        <div class="field">
          <label for="career-start-${index}">근무 시작</label>
          <input class="control-input" id="career-start-${index}" name="career-start-${index}" type="month" value="${inputValue(item.start)}" />
        </div>
        <div class="field">
          <label for="career-end-${index}">근무 종료</label>
          <input class="control-input" id="career-end-${index}" name="career-end-${index}" type="month" value="${isCurrent ? "" : inputValue(item.end)}" ${isCurrent ? "disabled" : ""} />
          <label class="inline-check"><input type="checkbox" name="career-current-${index}" ${isCurrent ? "checked" : ""} /> 현재 재직 중</label>
        </div>
        <div class="field full">
          <label for="career-achievements-${index}">직장에서의 주요성과/실적</label>
          <textarea class="control-textarea" id="career-achievements-${index}" name="career-achievements-${index}">${inputValue(item.achievements)}</textarea>
        </div>
      </div>
    </article>
  `;
}

function renderDetailTab(candidate) {
  if (state.detailTab === "resume") {
    return `
      <div class="parse-preview">
        ${parseField("원본 파일", `${candidate.name}_resume.pdf`, "권한 필요")}
        ${parseField("경력 요약", candidate.jobFamily, "확정")}
        ${parseField("핵심 기술", candidate.skills.slice(0, 4).join(", "), "검수")}
        ${parseField("AI 신뢰도", `${candidate.parsingConfidence}%`, candidate.parsingConfidence >= 88 ? "높음" : "중간")}
      </div>
    `;
  }

  if (state.detailTab === "education") {
    return renderEducationTab(candidate);
  }

  if (state.detailTab === "career") {
    return renderCareerTab(candidate);
  }

  if (state.detailTab === "activity") {
    return `
      <div class="timeline">
        ${candidate.timeline.map((item) => `
          <article class="activity-item">
            <strong>${escapeHtml(item.type)} · ${escapeHtml(item.text)}</strong>
            <span class="activity-meta">${escapeHtml(item.actor)} · ${item.date}</span>
          </article>
        `).join("")}
      </div>
    `;
  }

  if (state.detailTab === "applications") {
    if (!candidate.applications.length) {
      return `<div class="empty-state">등록된 지원 이력이 없습니다.</div>`;
    }

    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>포지션</th><th>단계</th><th>결과</th><th>일자</th></tr></thead>
          <tbody>
            ${candidate.applications.map((item) => `
              <tr><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.stage)}</td><td>${escapeHtml(item.result)}</td><td>${item.date}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  if (state.detailTab === "compliance") {
    return `
      <div class="parse-preview">
        ${parseField("동의 상태", CONSENT_LABELS[candidate.consent], candidate.consent === "consented" ? "유효" : "확인")}
        ${parseField("보존 기한", candidate.consent === "expiring" ? "2026-06-22" : "2027-06-04", "정책")}
        ${parseField("원본 접근", "담당자/리더", "제한")}
        ${parseField("최근 조회", "2026-06-04 09:18", "기록")}
      </div>
    `;
  }

  return `
    <div class="bar-list">
      <div class="tag-row">
        ${candidate.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
      </div>
      <p>${escapeHtml(candidate.summary)}</p>
      ${detailInfoGrid([
        {
          label: "최종 학력",
          value: getPrimaryEducation(candidate)
            ? `${getPrimaryEducation(candidate).degree} · ${getPrimaryEducation(candidate).school} · ${getPrimaryEducation(candidate).major}`
            : "-"
        },
        {
          label: "최근 경력",
          value: getPrimaryCareer(candidate)
            ? `${getPrimaryCareer(candidate).company} · ${getPrimaryCareer(candidate).position}`
            : "-"
        }
      ])}
      <div>
        <h4>추천 근거</h4>
        <ul class="evidence-list">
          ${candidate.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function getFormText(form, name) {
  return (new FormData(form).get(name) || "").toString().trim();
}

function collectEducationFromForm(form, preserveBlank = false) {
  const formData = new FormData(form);
  const records = [...form.querySelectorAll("[data-education-index]")]
    .map((record) => Number(record.dataset.educationIndex))
    .map((index) => ({
      degree: (formData.get(`education-degree-${index}`) || "").toString().trim(),
      school: (formData.get(`education-school-${index}`) || "").toString().trim(),
      major: (formData.get(`education-major-${index}`) || "").toString().trim(),
      start: (formData.get(`education-start-${index}`) || "").toString(),
      end: (formData.get(`education-end-${index}`) || "").toString()
    }));

  return preserveBlank ? records : records.filter((item) => item.degree || item.school || item.major || item.start || item.end);
}

function collectCareerFromForm(form, preserveBlank = false) {
  const formData = new FormData(form);
  const records = [...form.querySelectorAll("[data-career-index]")]
    .map((record) => Number(record.dataset.careerIndex))
    .map((index) => ({
      country: (formData.get(`career-country-${index}`) || "").toString().trim(),
      company: (formData.get(`career-company-${index}`) || "").toString().trim(),
      rank: (formData.get(`career-rank-${index}`) || "").toString().trim(),
      position: (formData.get(`career-position-${index}`) || "").toString().trim(),
      start: (formData.get(`career-start-${index}`) || "").toString(),
      end: formData.get(`career-current-${index}`) ? "현재" : (formData.get(`career-end-${index}`) || "").toString(),
      achievements: (formData.get(`career-achievements-${index}`) || "").toString().trim()
    }));

  return preserveBlank
    ? records
    : records.filter((item) => item.country || item.company || item.rank || item.position || item.start || item.end || item.achievements);
}

function hasAnyRecordValue(record) {
  return Object.values(record).some((value) => value);
}

function isMonthValue(value) {
  return /^\d{4}-\d{2}$/.test(value);
}

function showEditError(errors) {
  const errorBox = $("#candidate-edit-error");

  if (!errorBox) {
    return;
  }

  errorBox.hidden = !errors.length;
  errorBox.innerHTML = errors.length
    ? `<strong>저장 전 확인이 필요합니다.</strong><span>${errors.map(escapeHtml).join("<br>")}</span>`
    : "";
}

function validateCandidateEditForm(form) {
  const errors = [];
  const education = collectEducationFromForm(form, true).filter(hasAnyRecordValue);
  const career = collectCareerFromForm(form, true).filter(hasAnyRecordValue);

  if (!getFormText(form, "editName")) {
    errors.push("이름을 입력해주세요.");
  }

  if (!getFormText(form, "editRole")) {
    errors.push("직무를 입력해주세요.");
  }

  if (!getFormText(form, "editOwner")) {
    errors.push("담당자를 입력해주세요.");
  }

  if (!education.length) {
    errors.push("학력 정보를 1개 이상 입력해주세요.");
  }

  education.forEach((item, index) => {
    const missing = ["degree", "school", "major", "start", "end"].filter((key) => !item[key]);

    if (missing.length) {
      errors.push(`학력 ${index + 1}의 학위, 학교명, 전공명, 시작/종료 시점을 모두 입력해주세요.`);
    }

    if ((item.start && !isMonthValue(item.start)) || (item.end && !isMonthValue(item.end))) {
      errors.push(`학력 ${index + 1}의 기간은 년/월 형식으로 입력해주세요.`);
    }
  });

  if (!career.length) {
    errors.push("경력 정보를 1개 이상 입력해주세요.");
  }

  career.forEach((item, index) => {
    const missing = ["country", "company", "rank", "position", "start", "end", "achievements"].filter((key) => !item[key]);

    if (missing.length) {
      errors.push(`경력 ${index + 1}의 국가, 직장명, 직급, 직책, 기간, 주요성과를 모두 입력해주세요.`);
    }

    if (item.start && !isMonthValue(item.start)) {
      errors.push(`경력 ${index + 1}의 시작 시점은 년/월 형식으로 입력해주세요.`);
    }

    if (item.end && item.end !== "현재" && !isMonthValue(item.end)) {
      errors.push(`경력 ${index + 1}의 종료 시점은 년/월 또는 현재로 입력해주세요.`);
    }
  });

  return errors;
}

async function saveCandidateEdits(form, options = {}) {
  const validationErrors = options.preserveBlankRecords ? [] : validateCandidateEditForm(form);

  if (validationErrors.length) {
    showEditError(validationErrors);
    return false;
  }

  showEditError([]);
  const candidate = getCandidate();
  const formData = new FormData(form);
  const photoFile = formData.get("editPhoto");
  const skills = getFormText(form, "editSkills")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const name = getFormText(form, "editName") || candidate.name;
  const company = getFormText(form, "editCompany") || candidate.company;

  candidate.name = name;
  candidate.initials = `${name.slice(0, 1)}${name.slice(-1)}`;
  candidate.company = company;
  candidate.role = getFormText(form, "editRole") || candidate.role;
  candidate.years = Number(getFormText(form, "editYears")) || 0;
  candidate.owner = getFormText(form, "editOwner") || candidate.owner;
  candidate.status = getFormText(form, "editStatus") || candidate.status;
  candidate.skills = skills.length ? skills : candidate.skills;
  candidate.summary = getFormText(form, "editSummary") || candidate.summary;
  candidate.education = collectEducationFromForm(form, options.preserveBlankRecords);
  candidate.career = collectCareerFromForm(form, options.preserveBlankRecords);
  candidate.updatedAt = "2026-06-04";

  if (photoFile && photoFile.size) {
    try {
      candidate.photoUrl = await readFileAsDataUrl(photoFile);
    } catch (error) {
      console.warn("Profile photo could not be read.", error);
      showToast("사진 파일을 읽지 못했습니다. 다른 파일을 선택해주세요.");
      return false;
    }
  }

  state.aiResults = [];

  if (!options.silent) {
    state.auditLogs.unshift({
      actor: candidate.owner,
      action: "후보자 정보 수정",
      resource: candidate.name,
      purpose: "프로필 최신화",
      time: "2026-06-04 09:40"
    });
    persistState();
    showToast(`${candidate.name} 후보자 정보가 저장되었습니다.`);
  }

  if (!options.keepEditing) {
    state.isEditingCandidate = false;
    state.editSnapshot = null;
    state.detailTab = "overview";
  }

  render();
  return true;
}

async function syncEditDraftBeforeAppend() {
  const form = $("#candidate-edit-form");
  if (form) {
    await saveCandidateEdits(form, { silent: true, keepEditing: true, preserveBlankRecords: true });
  }
}

async function addEducationRecord() {
  await syncEditDraftBeforeAppend();
  const candidate = getCandidate();
  candidate.education.push({ degree: "", school: "", major: "", start: "", end: "" });
  state.isEditingCandidate = true;
  renderDetail();
}

async function addCareerRecord() {
  await syncEditDraftBeforeAppend();
  const candidate = getCandidate();
  candidate.career.push({ country: "", company: "", rank: "", position: "", start: "", end: "", achievements: "" });
  state.isEditingCandidate = true;
  renderDetail();
}

async function removeEducationRecord(index) {
  await syncEditDraftBeforeAppend();
  const candidate = getCandidate();
  candidate.education.splice(index, 1);

  if (!candidate.education.length) {
    candidate.education.push({ degree: "", school: "", major: "", start: "", end: "" });
  }

  state.isEditingCandidate = true;
  renderDetail();
}

async function removeCareerRecord(index) {
  await syncEditDraftBeforeAppend();
  const candidate = getCandidate();
  candidate.career.splice(index, 1);

  if (!candidate.career.length) {
    candidate.career.push({ country: "", company: "", rank: "", position: "", start: "", end: "", achievements: "" });
  }

  state.isEditingCandidate = true;
  renderDetail();
}

function renderAudit() {
  const viewCount = state.auditLogs.filter((log) => log.action.includes("조회")).length;
  const aiCount = state.auditLogs.filter((log) => log.action.includes("AI") || log.actor.includes("AI")).length;

  $("#audit-content").innerHTML = `
    <div class="audit-grid">
      ${metricCard("오늘 조회", viewCount, "권한 기반")}
      ${metricCard("AI 처리", aiCount, "모델 버전 기록")}
      ${metricCard("다운로드", 0, "승인 URL 없음")}
      ${metricCard("권한 실패", 0, "정상")}
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>시각</th><th>사용자</th><th>행위</th><th>대상</th><th>목적</th></tr>
        </thead>
        <tbody>
          ${state.auditLogs.map((log) => `
            <tr>
              <td>${log.time}</td>
              <td>${escapeHtml(log.actor)}</td>
              <td>${escapeHtml(log.action)}</td>
              <td>${escapeHtml(log.resource)}</td>
              <td>${escapeHtml(log.purpose)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function registerCandidate(eventOrForm) {
  eventOrForm?.preventDefault?.();
  const formElement = eventOrForm?.target?.matches?.("#register-form")
    ? eventOrForm.target
    : eventOrForm?.currentTarget?.matches?.("#register-form")
      ? eventOrForm.currentTarget
      : eventOrForm?.closest?.("#register-form")
        ? eventOrForm.closest("#register-form")
        : eventOrForm;

  if (!formElement) {
    return;
  }

  const form = new FormData(formElement);
  const name = form.get("name").toString().trim();
  const skills = form
    .get("skills")
    .toString()
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const photoFile = form.get("photo");
  let photoUrl = "";

  if (photoFile && photoFile.size) {
    try {
      photoUrl = await readFileAsDataUrl(photoFile);
    } catch (error) {
      console.warn("Profile photo could not be read.", error);
      showToast("사진 파일을 읽지 못했습니다. 다른 파일을 선택해주세요.");
      return;
    }
  }
  const education = [
    {
      degree: form.get("educationDegree").toString().trim(),
      school: form.get("educationSchool").toString().trim(),
      major: form.get("educationMajor").toString().trim(),
      start: form.get("educationStart").toString(),
      end: form.get("educationEnd").toString()
    }
  ];
  const career = [
    {
      country: form.get("careerCountry").toString().trim(),
      company: form.get("careerCompany").toString().trim(),
      rank: form.get("careerRank").toString().trim(),
      position: form.get("careerPosition").toString().trim(),
      start: form.get("careerStart").toString(),
      end: form.get("careerCurrent") ? "현재" : form.get("careerEnd").toString(),
      achievements: form.get("careerAchievements").toString().trim()
    }
  ];

  const candidate = {
    id: `cand-${Date.now()}`,
    name,
    initials: `${name.slice(0, 1)}${name.slice(-1)}`,
    role: form.get("role").toString().trim(),
    company: form.get("company").toString().trim(),
    years: Number(form.get("years")) || 0,
    jobFamily: "Equipment Software",
    organization: "DS",
    status: "interested",
    consent: form.get("consent").toString(),
    owner: form.get("owner").toString(),
    updatedAt: "2026-06-04",
    lastContactedAt: "-",
    location: "미확인",
    source: "직접 등록",
    dataQuality: 86,
    parsingConfidence: 88,
    avatarColor: "#4e5968",
    photoUrl,
    education,
    career,
    skills,
    tags: ["신규 등록", "검수 필요"],
    summary: form.get("summary").toString().trim(),
    evidence: [
      "업로드 이력서에서 장비 제어 SW 경험 추출",
      "핵심 기술 태그 자동 생성",
      "담당자 검수 대기 상태"
    ],
    applications: [],
    timeline: [
      { type: "등록", text: "후보자 신규 등록", actor: form.get("owner").toString(), date: "2026-06-04" },
      { type: "AI 요약", text: "이력서 파싱 결과 생성", actor: "AI Worker", date: "2026-06-04" }
    ]
  };

  state.candidates.unshift(candidate);
  state.selectedCandidateId = candidate.id;
  state.detailTab = "overview";
  state.auditLogs.unshift({
    actor: candidate.owner,
    action: "후보자 등록",
    resource: candidate.name,
    purpose: "인재 Pool 신규 등록",
    time: "2026-06-04 09:31"
  });
  state.aiResults = [];
  persistState();
  showToast(`${candidate.name} 후보자가 등록되었습니다.`);
  setView("detail");
}

function updatePoolFilters() {
  state.poolFilters.query = $("#pool-query")?.value || "";
  state.poolFilters.status = $("#pool-status")?.value || "all";
  state.poolFilters.consent = $("#pool-consent")?.value || "all";
  state.poolFilters.owner = $("#pool-owner")?.value || "all";
  persistState();
  renderPool();
}

function changeCandidateStatus(status) {
  const candidate = getCandidate();
  const previous = candidate.status;
  candidate.status = status;
  candidate.updatedAt = "2026-06-04";
  candidate.timeline.unshift({
    type: "상태 변경",
    text: `${STATUS_LABELS[previous]}에서 ${STATUS_LABELS[status]}으로 변경`,
    actor: candidate.owner,
    date: "2026-06-04"
  });
  state.auditLogs.unshift({
    actor: candidate.owner,
    action: "상태 변경",
    resource: candidate.name,
    purpose: STATUS_LABELS[status],
    time: "2026-06-04 09:32"
  });
  persistState();
  showToast(`${candidate.name} 상태가 변경되었습니다.`);
  render();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      setView(viewButton.dataset.view);
      return;
    }

    const selectButton = event.target.closest("[data-select-candidate]");
    if (selectButton) {
      if (state.isEditingCandidate) {
        discardCandidateEditDraft();
      }

      state.selectedCandidateId = selectButton.dataset.selectCandidate;
      state.detailTab = "overview";
      state.isEditingCandidate = false;
      const candidate = getCandidate();
      state.auditLogs.unshift({
        actor: candidate.owner,
        action: "후보자 상세 조회",
        resource: candidate.name,
        purpose: "프로필 검토",
        time: "2026-06-04 09:33"
      });
      persistState();
      setView("detail");
      return;
    }

    const startEditButton = event.target.closest("[data-start-edit]");
    if (startEditButton) {
      startCandidateEdit();
      return;
    }

    const cancelEditButton = event.target.closest("[data-cancel-edit]");
    if (cancelEditButton) {
      discardCandidateEditDraft();
      renderDetail();
      return;
    }

    const addEducationButton = event.target.closest("[data-add-education]");
    if (addEducationButton) {
      addEducationRecord();
      return;
    }

    const addCareerButton = event.target.closest("[data-add-career]");
    if (addCareerButton) {
      addCareerRecord();
      return;
    }

    const removeEducationButton = event.target.closest("[data-remove-education]");
    if (removeEducationButton) {
      removeEducationRecord(Number(removeEducationButton.dataset.removeEducation));
      return;
    }

    const removeCareerButton = event.target.closest("[data-remove-career]");
    if (removeCareerButton) {
      removeCareerRecord(Number(removeCareerButton.dataset.removeCareer));
      return;
    }

    const saveCandidateButton = event.target.closest("[data-save-candidate]");
    if (saveCandidateButton) {
      const form = saveCandidateButton.closest("#candidate-edit-form");
      if (form) {
        saveCandidateEdits(form);
      }
      return;
    }

    const tabButton = event.target.closest("[data-detail-tab]");
    if (tabButton) {
      state.detailTab = tabButton.dataset.detailTab;
      renderDetail();
      return;
    }

    const statusButton = event.target.closest("[data-change-status]");
    if (statusButton) {
      changeCandidateStatus(statusButton.dataset.changeStatus);
      return;
    }

    const registerButton = event.target.closest("[data-register-submit]");
    if (registerButton) {
      event.preventDefault();
      registerCandidate(registerButton.closest("#register-form"));
      return;
    }

    const suggestionButton = event.target.closest("[data-ai-suggestion]");
    if (suggestionButton) {
      state.aiQuery = suggestionButton.dataset.aiSuggestion;
      state.aiResults = runAiSearch(state.aiQuery);
      renderAiSearch();
      return;
    }

    const shortlistButton = event.target.closest("[data-shortlist]");
    if (shortlistButton) {
      const candidate = getCandidate(shortlistButton.dataset.shortlist);
      state.auditLogs.unshift({
        actor: candidate.owner,
        action: "Shortlist 추가",
        resource: candidate.name,
        purpose: "AI 검색 결과",
        time: "2026-06-04 09:34"
      });
      persistState();
      showToast(`${candidate.name} 후보자를 Shortlist에 추가했습니다.`);
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.matches("#register-form")) {
      registerCandidate(event);
    }

    if (event.target.matches("#candidate-edit-form")) {
      event.preventDefault();
      saveCandidateEdits(event.target);
    }
  });

  document.addEventListener("input", (event) => {
    if (["pool-query", "pool-status", "pool-consent", "pool-owner"].includes(event.target.id)) {
      updatePoolFilters();
    }

    if (event.target.id === "global-search") {
      state.poolFilters.query = event.target.value;
      persistState();
      if (state.view !== "pool") {
        setView("pool");
      } else {
        renderPool();
      }
    }
  });

  document.addEventListener("change", (event) => {
    if (["pool-status", "pool-consent", "pool-owner"].includes(event.target.id)) {
      updatePoolFilters();
    }

    if (event.target.id === "profile-photo") {
      const preview = $("#photo-preview");
      const file = event.target.files?.[0];

      if (preview && file) {
        preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="업로드한 얼굴 프로필 사진 미리보기" />`;
      }
    }

    if (event.target.id === "edit-photo") {
      const preview = $("#edit-photo-preview");
      const file = event.target.files?.[0];

      if (preview && file) {
        preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="업로드한 얼굴 프로필 사진 미리보기" />`;
      }
    }

    if (event.target.name?.startsWith("career-current-")) {
      const index = event.target.name.replace("career-current-", "");
      const endInput = $(`#career-end-${index}`);

      if (endInput) {
        endInput.disabled = event.target.checked;

        if (event.target.checked) {
          endInput.value = "";
        }
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.id === "run-ai-search") {
      state.aiQuery = $("#ai-query").value.trim();
      state.aiResults = runAiSearch(state.aiQuery);
      state.auditLogs.unshift({
        actor: "이지원",
        action: "AI 검색",
        resource: state.aiQuery.slice(0, 32),
        purpose: "후보자 Shortlist 탐색",
        time: "2026-06-04 09:35"
      });
      persistState();
      renderAiSearch();
      showToast("AI 검색 결과가 갱신되었습니다.");
    }
  });
}

restorePersistedState();
bindEvents();
render();
loadStateFromSupabase();
