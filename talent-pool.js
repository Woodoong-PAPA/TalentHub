const STATUS_LABELS = {
  interested: "관심",
  contact_planned: "접촉 예정",
  contacted: "접촉 완료",
  nurture: "지원 유도",
  screening: "전형 진행",
  hold: "보류",
  inactive: "비활성"
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

const MENU_CONFIG = [
  { view: "dashboard", label: "대시보드", description: "운영 현황과 KPI 조회" },
  { view: "pool", label: "인재 Pool", description: "후보자 목록과 상세 프로필 조회" },
  { view: "register", label: "인재 등록", description: "후보자 신규 등록과 이력서 파싱" },
  { view: "ai-search", label: "AI 검색", description: "자연어/JD 기반 후보자 검색" },
  { view: "audit", label: "감사 로그", description: "사용자·AI 처리 이력 확인" },
  { view: "members", label: "회원관리", description: "회원 승인, 등급, 메뉴 권한 관리" }
];

const MEMBER_ROLES = {
  associate: "준회원",
  regular: "정회원",
  operator: "운영진",
  admin: "관리자"
};

const MEMBER_ROLE_ORDER = ["associate", "regular", "operator", "admin"];

const MEMBER_STATUSES = {
  pending: "승인 대기",
  active: "활성",
  suspended: "정지",
  rejected: "반려"
};

const MEMBER_STATUS_ORDER = ["pending", "active", "suspended", "rejected"];

const DEFAULT_ROLE_PERMISSIONS = {
  associate: ["dashboard", "pool", "ai-search"],
  regular: ["dashboard", "pool", "register", "ai-search"],
  operator: ["dashboard", "pool", "register", "ai-search", "audit"],
  admin: MENU_CONFIG.map((item) => item.view)
};

const DEFAULT_MEMBERS = [
  {
    id: "member-admin",
    name: "시스템 관리자",
    email: "admin@samsung.com",
    password: "Admin1234!",
    role: "admin",
    status: "active",
    department: "People Team",
    position: "Talent Pool Owner",
    phone: "",
    requestedAt: "2026-06-05",
    approvedAt: "2026-06-05",
    approvedBy: "시스템",
    lastLoginAt: "",
    note: "초기 관리자 계정"
  }
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
    owner: "이지원",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-02",
    lastContactedAt: "2026-05-21",
    location: "경기 화성",
    source: "리퍼럴",
    dataQuality: 94,
    parsingConfidence: 91,
    avatarColor: "#4e5968",
    skills: ["NAND", "Python", "공정 데이터", "수율 분석", "ML"],
    tags: ["주요 역량/성과", "재접촉 우선", "검수 완료"],
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
      { type: "AI 요약", text: "이력서 파싱 결과 생성", actor: "AI Worker", date: "2026-06-01" },
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
    owner: "최유진",
    createdAt: "2026-05-30",
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
    owner: "이지원",
    createdAt: "2026-05-12",
    updatedAt: "2026-05-18",
    lastContactedAt: "2026-05-19",
    location: "성남",
    source: "소싱",
    dataQuality: 88,
    parsingConfidence: 84,
    avatarColor: "#6b7684",
    skills: ["Cloud", "Zero Trust", "Kubernetes", "IAM", "보안"],
    tags: ["고경력", "지원 유도"],
    summary:
      "클라우드 보안과 IAM 정책 설계 경험이 깊은 11년차 아키텍트. Kubernetes 보안 표준과 Zero Trust 전환 프로젝트 경험이 있다.",
    evidence: [
      "대규모 IAM 정책 재설계",
      "Kubernetes 보안 운영 기준 수립",
      "Zero Trust 기반 접근 통제 프로젝트"
    ],
    applications: [],
    timeline: [
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
    owner: "박민수",
    createdAt: "2026-05-20",
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
    owner: "한소라",
    createdAt: "2026-04-21",
    updatedAt: "2026-04-22",
    lastContactedAt: "2026-04-23",
    location: "서울",
    source: "리퍼럴",
    dataQuality: 72,
    parsingConfidence: 76,
    avatarColor: "#8b95a1",
    skills: ["Embedded C", "RTOS", "Automotive", "Linux", "검수 필요"],
    tags: ["검수 필요", "보류"],
    summary:
      "임베디드 C와 RTOS 기반 제어 SW 경험이 있는 엔지니어. 최근 프로필 검수와 경력 정보 확인이 필요하다.",
    evidence: [
      "RTOS 기반 제어기 펌웨어 개발",
      "Automotive Linux 디버깅 경험",
      "최근 프로젝트 검수 후 추천 가능"
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
})).map(normalizeCandidate);

const STORAGE_KEY = "samsung-talent-pool-state-v1";
const STORAGE_VERSION = 1;
const APP_CONFIG = window.__APP_CONFIG__ || {};
const SUPABASE_URL = (APP_CONFIG.supabaseUrl || "").replace(/\/$/, "");
const SUPABASE_ANON_KEY = APP_CONFIG.supabaseAnonKey || "";
const DATA_SOURCE = APP_CONFIG.dataSource || "local";
const REMOTE_SYNC_ENABLED = DATA_SOURCE === "supabase" && SUPABASE_URL && SUPABASE_ANON_KEY;

const state = {
  view: "dashboard",
  authView: "login",
  currentUserId: "",
  authMessage: "",
  members: structuredClone(DEFAULT_MEMBERS),
  rolePermissions: structuredClone(DEFAULT_ROLE_PERMISSIONS),
  memberFilters: {
    query: "",
    role: "all",
    status: "all"
  },
  candidates: structuredClone(ENRICHED_CANDIDATES),
  selectedCandidateId: "cand-001",
  isEditingCandidate: false,
  editSnapshot: null,
  poolFilters: {
    query: "",
    status: "all",
    owner: "all"
  },
  aiQuery: "",
  aiResults: [],
  aiSearchLoading: false,
  aiSearchFileName: "",
  registerExtractedPhotoUrl: "",
  remoteSyncStatus: REMOTE_SYNC_ENABLED ? "대기" : "로컬",
  auditLogs: [
    { actor: "이지원", action: "후보자 상세 조회", resource: "김도현", purpose: "DS 공정 AI 후보 검토", time: "2026-06-04 09:18" },
    { actor: "AI Worker", action: "이력서 파싱", resource: "박서연", purpose: "파싱 결과 생성", time: "2026-06-04 09:12" },
    { actor: "최유진", action: "AI 검색", resource: "온디바이스 AI", purpose: "DX 리서처 Shortlist", time: "2026-06-04 08:57" },
    { actor: "AI Worker", action: "파싱 품질 스캔", resource: "최민재", purpose: "필수 정보 검수", time: "2026-06-04 08:30" }
  ]
};

const viewTitles = {
  dashboard: "대시보드",
  pool: "인재 Pool",
  register: "인재 등록",
  "ai-search": "AI 검색",
  detail: "상세 프로필",
  audit: "감사 로그",
  members: "회원관리"
};

const $ = (selector) => document.querySelector(selector);

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function calculateAge(birthYear) {
  const year = Number(String(birthYear || "").trim());
  const currentYear = getCurrentYear();

  if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
    return "";
  }

  return String(currentYear - year);
}

function dateSortValue(value) {
  const parsed = Date.parse(String(value || ""));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function inferCreatedAt(candidate) {
  if (candidate.createdAt) {
    return candidate.createdAt;
  }

  const registration = (candidate.timeline || []).find((item) => item.type === "등록" && item.date);
  if (registration?.date) {
    return registration.date;
  }

  const datedTimeline = (candidate.timeline || [])
    .map((item) => item.date)
    .filter(Boolean)
    .sort((a, b) => dateSortValue(a) - dateSortValue(b));

  return datedTimeline[0] || candidate.updatedAt || getTodayDate();
}

function sortCandidatesByCreatedAt(candidates) {
  return [...candidates].sort((a, b) =>
    dateSortValue(b.createdAt) - dateSortValue(a.createdAt) ||
    dateSortValue(b.updatedAt) - dateSortValue(a.updatedAt) ||
    String(b.id).localeCompare(String(a.id))
  );
}

function ensureAuditLogIds() {
  state.auditLogs.forEach((log) => {
    if (!log.id) {
      log.id = createId("audit");
    }
  });
}

function removeConsentFields(candidate) {
  const sanitized = { ...candidate };
  delete sanitized.consent;
  const retiredPrivacyTerm = "\uB3D9\uC758";

  sanitized.tags = (sanitized.tags || [])
    .filter((item) => !String(item).includes(retiredPrivacyTerm))
    .map((item) => String(item).replace("핵심 기술", "주요 역량/성과"));
  sanitized.evidence = (sanitized.evidence || [])
    .filter((item) => !String(item).includes(retiredPrivacyTerm))
    .map((item) => String(item).replace("핵심 기술", "주요 역량/성과"));
  sanitized.timeline = (sanitized.timeline || [])
    .filter((item) => {
      const text = `${item.type || ""} ${item.text || ""} ${item.actor || ""}`;
      return !text.includes(retiredPrivacyTerm) && !text.includes("Compliance");
    })
    .map((item) => ({
      ...item,
      text: String(item.text || "").replace("이력서 파싱 및 경력 요약 생성", "이력서 파싱 결과 생성")
    }));

  if (sanitized.summary?.includes(retiredPrivacyTerm)) {
    sanitized.summary = sanitized.summary
      .replace(`최근 프로필 검수와 개인정보 ${retiredPrivacyTerm} 확인이 필요하다.`, "최근 프로필 검수와 경력 정보 확인이 필요하다.")
      .replace(`개인정보 ${retiredPrivacyTerm} 확인`, "경력 정보 확인")
      .replace(`${retiredPrivacyTerm} 확인`, "정보 확인");
  }

  return sanitized;
}

function normalizeCandidate(candidate) {
  const normalized = removeConsentFields({
    photoUrl: "",
    resumeAttachment: null,
    birthYear: "",
    age: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    referenceUrl: "",
    education: [],
    career: [],
    skills: [],
    tags: [],
    evidence: [],
    applications: [],
    timeline: [],
    ...candidate
  });

  normalized.createdAt = inferCreatedAt(normalized);
  normalized.updatedAt = normalized.updatedAt || normalized.createdAt;
  normalized.age = calculateAge(normalized.birthYear);

  return normalized;
}

function normalizeAuditLog(log) {
  const text = `${log.actor || ""} ${log.action || ""} ${log.resource || ""} ${log.purpose || ""}`;
  if (text.includes("\uB3D9\uC758")) {
    return null;
  }

  return {
    ...log,
    purpose: String(log.purpose || "").replace("경력 요약 생성", "파싱 결과 생성")
  };
}

function normalizeMember(member) {
  const role = MEMBER_ROLES[member.role] ? member.role : "associate";
  const status = MEMBER_STATUSES[member.status] ? member.status : "pending";

  return {
    id: member.id || createId("member"),
    name: String(member.name || "").trim(),
    email: String(member.email || "").trim().toLowerCase(),
    password: String(member.password || ""),
    role,
    status,
    department: String(member.department || "").trim(),
    position: String(member.position || "").trim(),
    phone: String(member.phone || "").trim(),
    requestedAt: member.requestedAt || getTodayDate(),
    approvedAt: member.approvedAt || "",
    approvedBy: member.approvedBy || "",
    lastLoginAt: member.lastLoginAt || "",
    note: String(member.note || "").trim()
  };
}

function normalizeRolePermissions(permissions = {}) {
  const normalized = structuredClone(DEFAULT_ROLE_PERMISSIONS);

  MEMBER_ROLE_ORDER.forEach((role) => {
    if (Array.isArray(permissions[role])) {
      normalized[role] = permissions[role].filter((view) => MENU_CONFIG.some((item) => item.view === view));
    }

    if (!normalized[role].includes("dashboard")) {
      normalized[role].unshift("dashboard");
    }
  });

  normalized.admin = MENU_CONFIG.map((item) => item.view);

  return normalized;
}

function ensureMemberDefaults() {
  state.members = state.members.map(normalizeMember);

  if (!state.members.some((member) => member.role === "admin" && member.status === "active")) {
    state.members.unshift(...structuredClone(DEFAULT_MEMBERS).map(normalizeMember));
  }

  state.rolePermissions = normalizeRolePermissions(state.rolePermissions);

  const currentMember = state.members.find((member) => member.id === state.currentUserId);
  if (!currentMember || currentMember.status !== "active") {
    state.currentUserId = "";
  }
}

function getCurrentMember() {
  return state.members.find((member) => member.id === state.currentUserId) || null;
}

function isAuthenticated() {
  return Boolean(getCurrentMember());
}

function isAdmin(member = getCurrentMember()) {
  return member?.role === "admin" && member.status === "active";
}

function getRoleLabel(role) {
  return MEMBER_ROLES[role] || role || "-";
}

function getMemberStatusLabel(status) {
  return MEMBER_STATUSES[status] || status || "-";
}

function getAllowedViewsForRole(role) {
  return state.rolePermissions[role] || [];
}

function canAccessView(view, member = getCurrentMember()) {
  if (!member || member.status !== "active") {
    return false;
  }

  if (view === "detail") {
    return getAllowedViewsForRole(member.role).includes("pool");
  }

  return getAllowedViewsForRole(member.role).includes(view);
}

function getDefaultView(member = getCurrentMember()) {
  return getAllowedViewsForRole(member?.role)
    .find((view) => MENU_CONFIG.some((item) => item.view === view)) || "dashboard";
}

function getCurrentActorName() {
  return getCurrentMember()?.name || "시스템";
}

function getTimestampText() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return `${date} ${time}`;
}

function addAuditLog(action, resource, purpose, actor = getCurrentActorName()) {
  state.auditLogs.unshift({
    id: createId("audit"),
    actor,
    action,
    resource,
    purpose,
    time: getTimestampText()
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
        poolFilters: state.poolFilters,
        members: state.members,
        rolePermissions: state.rolePermissions,
        memberFilters: state.memberFilters,
        currentUserId: state.currentUserId
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
    state.candidates = persisted.candidates.map(normalizeCandidate);
  }

  if (Array.isArray(persisted.auditLogs)) {
    state.auditLogs = persisted.auditLogs.map(normalizeAuditLog).filter(Boolean);
  }

  if (persisted.poolFilters && typeof persisted.poolFilters === "object") {
    state.poolFilters = { ...state.poolFilters, ...persisted.poolFilters };
  }

  if (Array.isArray(persisted.members) && persisted.members.length) {
    state.members = persisted.members.map(normalizeMember);
  }

  if (persisted.rolePermissions && typeof persisted.rolePermissions === "object") {
    state.rolePermissions = normalizeRolePermissions(persisted.rolePermissions);
  }

  if (persisted.memberFilters && typeof persisted.memberFilters === "object") {
    state.memberFilters = { ...state.memberFilters, ...persisted.memberFilters };
  }

  if (persisted.currentUserId) {
    state.currentUserId = persisted.currentUserId;
  }

  if (state.candidates.some((candidate) => candidate.id === persisted.selectedCandidateId)) {
    state.selectedCandidateId = persisted.selectedCandidateId;
  } else {
    state.selectedCandidateId = state.candidates[0]?.id || "";
  }

  ensureAuditLogIds();
  ensureMemberDefaults();
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
  const normalizedCandidate = normalizeCandidate(candidate);

  return {
    id: normalizedCandidate.id,
    name: normalizedCandidate.name,
    company: normalizedCandidate.company,
    role: normalizedCandidate.role,
    owner: normalizedCandidate.owner,
    status: normalizedCandidate.status,
    updated_at: new Date().toISOString(),
    profile: normalizedCandidate
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
      state.candidates = candidateRows.map((row) => row.profile).filter(Boolean).map(normalizeCandidate);
      state.selectedCandidateId = state.candidates[0]?.id || state.selectedCandidateId;
    }

    if (Array.isArray(auditRows) && auditRows.length) {
      state.auditLogs = auditRows.map((row) => row.payload).filter(Boolean).map(normalizeAuditLog).filter(Boolean);
      ensureAuditLogIds();
    }

    state.remoteSyncStatus = "Supabase 연결됨";
    persistState({ skipRemoteSync: true });
    render();
    scheduleRemoteSync();
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

function formatFileSize(bytes = 0) {
  if (!bytes) {
    return "-";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeTypeFromFileName(fileName) {
  const lower = String(fileName || "").toLowerCase();

  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".bmp")) return "image/bmp";
  return "image/jpeg";
}

function bytesToDataUrl(bytes, mimeType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result.toString()));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(new Blob([bytes], { type: mimeType }));
  });
}

function loadImageElement(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = dataUrl;
  });
}

function expandedSquareCropBox(box, imageWidth, imageHeight, marginRatio = 0.42) {
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const side = Math.min(
    Math.max(box.width, box.height) * (1 + marginRatio),
    imageWidth,
    imageHeight
  );
  const x = Math.max(0, Math.min(imageWidth - side, centerX - side / 2));
  const y = Math.max(0, Math.min(imageHeight - side, centerY - side / 2));

  return { x, y, width: side, height: side };
}

function centerSquareCropBox(imageWidth, imageHeight) {
  const side = Math.min(imageWidth, imageHeight);
  return {
    x: Math.max(0, (imageWidth - side) / 2),
    y: Math.max(0, (imageHeight - side) / 2),
    width: side,
    height: side
  };
}

function drawCroppedProfileImage(image, box) {
  const canvas = document.createElement("canvas");
  const size = 360;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.drawImage(image, box.x, box.y, box.width, box.height, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", 0.9);
}

async function detectFaceBox(image) {
  if (!("FaceDetector" in window)) {
    return null;
  }

  try {
    const detector = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    const faces = await detector.detect(image);
    const face = faces?.[0]?.boundingBox;

    if (!face || face.width < 24 || face.height < 24) {
      return null;
    }

    return { x: face.x, y: face.y, width: face.width, height: face.height };
  } catch (error) {
    console.warn("Face detection failed.", error);
    return null;
  }
}

function profileImageScore({ width, height, fileName }) {
  const minSide = Math.min(width, height);
  const maxSide = Math.max(width, height);
  const ratio = width / Math.max(1, height);

  if (minSide < 72 || maxSide < 96) {
    return -100;
  }

  let score = 20;
  if (ratio >= 0.55 && ratio <= 1.35) score += 45;
  if (ratio >= 0.7 && ratio <= 1.05) score += 20;
  if (/profile|photo|picture|avatar|face|증명|사진|프로필/i.test(fileName)) score += 20;
  if (width * height > 90000) score += 10;

  return score;
}

async function cropProfilePhotoCandidate(dataUrl, options = {}) {
  const image = await loadImageElement(dataUrl);
  const faceBox = await detectFaceBox(image);

  if (faceBox) {
    return {
      dataUrl: drawCroppedProfileImage(image, expandedSquareCropBox(faceBox, image.naturalWidth, image.naturalHeight)),
      confidence: "face",
      width: image.naturalWidth,
      height: image.naturalHeight
    };
  }

  if (!options.allowCenterCrop) {
    return null;
  }

  return {
    dataUrl: drawCroppedProfileImage(image, centerSquareCropBox(image.naturalWidth, image.naturalHeight)),
    confidence: "center",
    width: image.naturalWidth,
    height: image.naturalHeight
  };
}

async function extractImageCandidatesFromResumeZip(buffer, fileType) {
  const imagePattern = fileType === "docx"
    ? /^word\/media\/.+\.(?:png|jpe?g|webp)$/i
    : /^(?:BinData|Preview|Contents)\/.*\.(?:png|jpe?g|webp)$/i;
  const entries = await readZipEntries(buffer, (fileName) => imagePattern.test(fileName));

  return Promise.all(entries.map(async (entry) => ({
    fileName: entry.fileName,
    dataUrl: await bytesToDataUrl(entry.bytes, mimeTypeFromFileName(entry.fileName))
  })));
}

async function renderPdfFirstPageImage(buffer) {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer), useWorkerFetch: true });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.8 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/png");
}

async function extractProfilePhotoFromResume(file) {
  const buffer = await file.arrayBuffer();
  const fileType = detectResumeFileType(file, buffer);
  const candidates = [];

  if (fileType === "docx" || fileType === "hwpx") {
    candidates.push(...await extractImageCandidatesFromResumeZip(buffer, fileType));
  } else if (fileType === "pdf") {
    try {
      candidates.push({ fileName: `${file.name}-first-page.png`, dataUrl: await renderPdfFirstPageImage(buffer), requireFace: true });
    } catch (error) {
      console.warn("PDF profile photo extraction failed.", error);
    }
  }

  const scored = [];

  for (const candidate of candidates) {
    try {
      const cropped = await cropProfilePhotoCandidate(candidate.dataUrl, { allowCenterCrop: !candidate.requireFace });

      if (!cropped) {
        continue;
      }

      scored.push({
        ...cropped,
        score: profileImageScore({ width: cropped.width, height: cropped.height, fileName: candidate.fileName }) + (cropped.confidence === "face" ? 70 : 0),
        fileName: candidate.fileName
      });
    } catch (error) {
      console.warn("Profile photo candidate could not be processed.", error);
    }
  }

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0] || null;
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

function candidateVisual(candidate, size = "") {
  const className = `avatar ${size}`.trim();

  if (candidate.photoUrl) {
    return `<img class="${className}" src="${escapeHtml(candidate.photoUrl)}" alt="${escapeHtml(candidate.name)} 프로필 사진" />`;
  }

  return `<span class="${className}" style="background:${candidate.avatarColor}">${candidate.initials}</span>`;
}

function formatBirthAge(candidate) {
  const birthYear = String(candidate.birthYear || "").trim();
  const age = calculateAge(birthYear) || candidate.age;

  if (!birthYear && !age) {
    return "출생년도 미입력";
  }

  return [
    birthYear ? `${birthYear}년생` : "",
    age ? `${age}세` : ""
  ].filter(Boolean).join(" · ");
}

function getPrimaryEducation(candidate) {
  return candidate.education?.[0] || null;
}

function getPrimaryCareer(candidate) {
  return candidate.career?.[0] || null;
}

function formatMonthPart(value, suffix) {
  const normalized = String(value || "").trim();
  return /^\d+$/.test(normalized) && normalized !== "0" && normalized !== "00" ? `${normalized}${suffix}` : "";
}

function formatYearMonth(value) {
  const normalized = String(value || "").trim();

  if (!normalized || normalized === "0" || normalized === "00" || normalized === "0000-00") {
    return "";
  }

  if (normalized === "현재") {
    return "현재";
  }

  const parts = normalized.split(/[-./년월\s]+/).filter((part) => part !== "");
  const [year, month] = parts;
  const yearText = formatMonthPart(year, "년");
  const monthText = formatMonthPart(month, "월");

  return [yearText, monthText].filter(Boolean).join(" ");
}

function formatPeriod(start, end) {
  const startText = formatYearMonth(start);
  const endText = end === "현재" ? "현재" : formatYearMonth(end);

  if (!startText && !endText) {
    return "-";
  }

  return `${startText || "-"} ~ ${endText || "-"}`;
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

function renderAuth() {
  const authContent = $("#auth-content");
  const authenticated = isAuthenticated();

  document.body.classList.toggle("is-authenticated", authenticated);

  if (!authContent) {
    return;
  }

  if (authenticated) {
    authContent.innerHTML = "";
    return;
  }

  const message = state.authMessage
    ? `<div class="auth-message">${escapeHtml(state.authMessage)}</div>`
    : "";

  authContent.innerHTML = state.authView === "signup"
    ? `
      <section class="auth-card">
        <div class="auth-brand">
          <div class="brand-mark">S</div>
          <div>
            <p class="brand-kicker">Samsung HR</p>
            <h1>회원가입 신청</h1>
          </div>
        </div>
        <p class="auth-copy">가입 신청은 관리자 승인 후 활성화됩니다. 승인 전에는 시스템에 접속할 수 없습니다.</p>
        ${message}
        <form id="signup-form" class="auth-form">
          <div class="field">
            <label for="signup-name">이름</label>
            <input class="control-input" id="signup-name" name="name" required autocomplete="name" />
          </div>
          <div class="field">
            <label for="signup-email">이메일</label>
            <input class="control-input" id="signup-email" name="email" type="email" required autocomplete="email" />
          </div>
          <div class="field-grid">
            <div class="field">
              <label for="signup-password">비밀번호</label>
              <input class="control-input" id="signup-password" name="password" type="password" required autocomplete="new-password" />
            </div>
            <div class="field">
              <label for="signup-password-confirm">비밀번호 확인</label>
              <input class="control-input" id="signup-password-confirm" name="passwordConfirm" type="password" required autocomplete="new-password" />
            </div>
          </div>
          <div class="field-grid">
            <div class="field">
              <label for="signup-department">부서</label>
              <input class="control-input" id="signup-department" name="department" autocomplete="organization" />
            </div>
            <div class="field">
              <label for="signup-position">직책</label>
              <input class="control-input" id="signup-position" name="position" autocomplete="organization-title" />
            </div>
          </div>
          <div class="field-grid">
            <div class="field">
              <label for="signup-phone">연락처</label>
              <input class="control-input" id="signup-phone" name="phone" type="tel" autocomplete="tel" />
            </div>
            <div class="field">
              <label for="signup-role">신청 등급</label>
              <select class="control-select" id="signup-role" name="role">
                <option value="associate">준회원</option>
                <option value="regular">정회원</option>
                <option value="operator">운영진</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="signup-note">사용 목적</label>
            <textarea class="control-textarea" id="signup-note" name="note" placeholder="담당 포지션, 소속 조직, 필요한 메뉴 등을 간단히 입력"></textarea>
          </div>
          <button class="primary-button" type="submit">가입 신청</button>
          <button class="ghost-button" type="button" data-auth-view="login">로그인으로 돌아가기</button>
        </form>
      </section>
    `
    : `
      <section class="auth-card">
        <div class="auth-brand">
          <div class="brand-mark">S</div>
          <div>
            <p class="brand-kicker">Samsung HR</p>
            <h1>Talent Pool 로그인</h1>
          </div>
        </div>
        <p class="auth-copy">승인된 회원만 인재 Pool 시스템에 접속할 수 있습니다.</p>
        ${message}
        <form id="login-form" class="auth-form">
          <div class="field">
            <label for="login-email">이메일</label>
            <input class="control-input" id="login-email" name="email" type="email" required autocomplete="email" />
          </div>
          <div class="field">
            <label for="login-password">비밀번호</label>
            <input class="control-input" id="login-password" name="password" type="password" required autocomplete="current-password" />
          </div>
          <button class="primary-button" type="submit">로그인</button>
          <button class="ghost-button" type="button" data-auth-view="signup">회원가입 신청</button>
        </form>
        <div class="auth-demo-note">
          <strong>초기 관리자 계정</strong>
          <span>admin@samsung.com / Admin1234!</span>
        </div>
      </section>
    `;
}

function renderUserMenu() {
  const userMenu = $("#user-menu");
  const member = getCurrentMember();

  if (!userMenu || !member) {
    return;
  }

  userMenu.innerHTML = `
    <div class="user-summary">
      <span>${escapeHtml(member.name)}</span>
      <strong>${escapeHtml(getRoleLabel(member.role))}</strong>
    </div>
    <button class="ghost-button compact-button" type="button" id="logout-button">로그아웃</button>
  `;
}

function applyAccessControls() {
  document.querySelectorAll("[data-view]").forEach((element) => {
    const view = element.dataset.view;
    element.hidden = !canAccessView(view);
  });

  $(".global-search")?.classList.toggle("is-hidden", !canAccessView("pool"));
}

function ensureActiveViewAllowed() {
  if (!canAccessView(state.view)) {
    state.view = getDefaultView();
  }
}

function syncActiveViewState() {
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${state.view}-view`);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.view || (state.view === "detail" && button.dataset.view === "pool"));
  });

  $("#page-title").textContent = viewTitles[state.view] || "Talent Pool";
}

function setView(view) {
  if (!isAuthenticated()) {
    renderAuth();
    return;
  }

  if (!canAccessView(view)) {
    showToast("현재 회원등급으로 접근할 수 없는 메뉴입니다.");
    view = getDefaultView();
  }

  state.view = view;
  if (view !== "detail" && state.isEditingCandidate) {
    discardCandidateEditDraft();
  }
  syncActiveViewState();
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
      candidate.birthYear,
      candidate.age,
      candidate.email,
      candidate.phone,
      candidate.linkedinUrl,
      candidate.referenceUrl,
      ...candidate.skills,
      ...candidate.tags,
      ...(candidate.education || []).flatMap((item) => [item.degree, item.school, item.major, item.start, item.end]),
      ...(candidate.career || []).flatMap((item) => [item.country, item.company, item.rank, item.position, item.start, item.end, item.achievements])
    ]
      .join(" ")
      .toLowerCase();

    const queryMatch = !query || text.includes(query);
    const statusMatch = state.poolFilters.status === "all" || candidate.status === state.poolFilters.status;
    const ownerMatch = state.poolFilters.owner === "all" || candidate.owner === state.poolFilters.owner;

    return queryMatch && statusMatch && ownerMatch;
  });
}

function render() {
  ensureMemberDefaults();
  renderAuth();

  if (!isAuthenticated()) {
    return;
  }

  ensureActiveViewAllowed();
  syncActiveViewState();
  renderSidePanel();
  renderDashboard();
  renderPool();
  renderRegister();
  renderAiSearch();
  renderDetail();
  renderAudit();
  renderMembers();
  renderUserMenu();
  applyAccessControls();
}

function renderSidePanel() {
  const reviewRequired = state.candidates.filter((candidate) => candidate.parsingConfidence < 88).length;
  $("#side-review-count").textContent = `${reviewRequired}명`;
}

function renderDashboard() {
  const total = state.candidates.length;
  const active = state.candidates.filter((candidate) => candidate.status !== "inactive").length;
  const reviewRequired = state.candidates.filter((candidate) => candidate.parsingConfidence < 85).length;
  const screening = state.candidates.filter((candidate) => candidate.status === "screening").length;

  const skillCounts = getSkillCounts().slice(0, 6);
  const maxSkill = Math.max(...skillCounts.map((item) => item.count), 1);
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: state.candidates.filter((candidate) => candidate.status === status).length
  }));
  const maxStatus = Math.max(...statusCounts.map((item) => item.count), 1);
  const actionCandidates = state.candidates
    .filter((candidate) => candidate.parsingConfidence < 88 || candidate.status === "contact_planned")
    .slice(0, 5);

  $("#dashboard-content").innerHTML = `
    <div class="dashboard-grid">
      <div class="kpi-row">
        ${metricCard("전체 후보자", total, "전월 대비 +14명")}
        ${metricCard("활성 후보자", active, "운영 중 후보")}
        ${metricCard("검수 대기", reviewRequired, "파싱/필수 정보 확인")}
        ${metricCard("전형 진행", screening, "현업 검토 포함")}
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
          ${signalRow("파싱 검수 필요", 34, "amber")}
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
              <td class="photo-cell">${candidateVisual(candidate, "pool")}</td>
              <td class="candidate-cell">
                <div class="candidate-name candidate-name-compact">
                  <span>
                    <button class="candidate-name-button" type="button" data-select-candidate="${candidate.id}">${escapeHtml(candidate.name)}</button>
                    <span>${escapeHtml(formatBirthAge(candidate))}</span>
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
  const candidates = sortCandidatesByCreatedAt(getFilteredCandidates());

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
    <div id="pool-table-content">
      ${candidateTable(candidates)}
    </div>
  `;
}

function renderPoolTable() {
  const tableContent = $("#pool-table-content");
  const candidates = sortCandidatesByCreatedAt(getFilteredCandidates());

  if (!tableContent) {
    renderPool();
    return;
  }

  tableContent.innerHTML = candidateTable(candidates);
}

function renderRegister() {
  $("#register-content").innerHTML = `
    <div class="form-grid">
      <form class="form-panel register-form-panel" id="register-form">
        <div class="field-grid">
          <div class="field full">
            <label for="resume-file">이력서 파일</label>
            <div class="dropzone">
              <input id="resume-file" name="resume" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
              <span id="resume-parse-status" class="form-help">이력서를 업로드하면 읽을 수 있는 정보만 아래 입력란에 자동 입력됩니다.</span>
            </div>
          </div>
          <div class="field">
            <label for="candidate-name">이름</label>
            <input class="control-input" id="candidate-name" name="name" required autocomplete="off" />
          </div>
          <div class="field">
            <label for="candidate-company">현재/최근 회사</label>
            <input class="control-input" id="candidate-company" name="company" required autocomplete="organization" />
          </div>
          <div class="field">
            <label for="candidate-role">직무</label>
            <input class="control-input" id="candidate-role" name="role" required autocomplete="off" />
          </div>
          <div class="field">
            <label for="candidate-organization">사업부</label>
            <input class="control-input" id="candidate-organization" name="organization" autocomplete="off" />
          </div>
          <div class="field">
            <label for="candidate-owner">담당자</label>
            <select class="control-select" id="candidate-owner" name="owner">
              <option value="">담당자 선택</option>
              <option>이지원</option>
              <option>박민수</option>
              <option>최유진</option>
              <option>한소라</option>
            </select>
          </div>
          <div class="field">
            <label for="candidate-birth-year">출생년도</label>
            <input class="control-input" id="candidate-birth-year" name="birthYear" type="number" inputmode="numeric" min="1900" max="${getCurrentYear()}" autocomplete="bday-year" />
          </div>
          <div class="field">
            <label for="candidate-age">나이</label>
            <input class="control-input" id="candidate-age" name="age" type="text" readonly />
          </div>
          <div class="field">
            <label for="candidate-email">이메일 주소</label>
            <input class="control-input" id="candidate-email" name="email" type="email" autocomplete="email" />
          </div>
          <div class="field">
            <label for="candidate-phone">휴대폰 번호</label>
            <input class="control-input" id="candidate-phone" name="phone" type="tel" autocomplete="tel" />
          </div>
          <div class="field">
            <label for="candidate-linkedin">링크드인 주소</label>
            <input class="control-input" id="candidate-linkedin" name="linkedinUrl" type="url" autocomplete="url" />
          </div>
          <div class="field">
            <label for="candidate-reference-url">기타 참고 URL</label>
            <input class="control-input" id="candidate-reference-url" name="referenceUrl" type="url" autocomplete="url" />
          </div>
          <div class="field full">
            <label for="profile-photo">얼굴 프로필 사진</label>
            <div class="dropzone profile-upload">
              <input id="profile-photo" name="photo" type="file" accept="image/*" />
              <div id="photo-preview" class="photo-preview">사진 미리보기</div>
              <span>업로드한 사진은 상세 프로필 상단에 표시됩니다.</span>
            </div>
          </div>
          <div class="field full">
            <label for="candidate-skills">주요 역량/성과</label>
            <input class="control-input" id="candidate-skills" name="skills" autocomplete="off" />
          </div>
          <div class="field full">
            <label for="candidate-summary">담당자 메모</label>
            <textarea class="control-textarea" id="candidate-summary" name="summary"></textarea>
          </div>
        </div>

        <section class="edit-section register-section">
          <div class="edit-section-header">
            <h5>학력 정보</h5>
            <button class="soft-button" type="button" data-add-register-education>학력 추가</button>
          </div>
          <div class="edit-record-list" id="register-education-list">
            ${renderRegisterEducationRecord({}, 0)}
          </div>
        </section>

        <section class="edit-section register-section">
          <div class="edit-section-header">
            <h5>경력 정보</h5>
            <button class="soft-button" type="button" data-add-register-career>경력 추가</button>
          </div>
          <div class="edit-record-list" id="register-career-list">
            ${renderRegisterCareerRecord({}, 0)}
          </div>
        </section>

        <div class="actions-cell" style="margin-top:16px">
          <button class="primary-button" type="button" data-register-submit>등록</button>
          <button class="ghost-button" type="reset">초기화</button>
        </div>
      </form>
    </div>
  `;
}

function renderRegisterEducationRecord(item = {}, index = 0) {
  return `
    <article class="edit-record" data-register-education-index="${index}">
      <div class="edit-record-header">
        <strong>학력 ${index + 1}</strong>
        <button class="ghost-button danger-button compact-button" type="button" data-remove-register-education="${index}">삭제</button>
      </div>
      <div class="field-grid">
        <div class="field">
          <label for="register-education-degree-${index}">학위</label>
          <input class="control-input" id="register-education-degree-${index}" name="register-education-degree-${index}" value="${inputValue(item.degree)}" />
        </div>
        <div class="field">
          <label for="register-education-school-${index}">학교명</label>
          <input class="control-input" id="register-education-school-${index}" name="register-education-school-${index}" value="${inputValue(item.school)}" />
        </div>
        <div class="field">
          <label for="register-education-major-${index}">전공명</label>
          <input class="control-input" id="register-education-major-${index}" name="register-education-major-${index}" value="${inputValue(item.major)}" />
        </div>
        <div class="field">
          <label for="register-education-start-${index}">학위 시작</label>
          <input class="control-input" id="register-education-start-${index}" name="register-education-start-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.start)}" />
        </div>
        <div class="field">
          <label for="register-education-end-${index}">학위 종료</label>
          <input class="control-input" id="register-education-end-${index}" name="register-education-end-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.end)}" />
        </div>
      </div>
    </article>
  `;
}

function renderRegisterCareerRecord(item = {}, index = 0) {
  const isCurrent = item.end === "현재";

  return `
    <article class="edit-record" data-register-career-index="${index}">
      <div class="edit-record-header">
        <strong>경력 ${index + 1}</strong>
        <button class="ghost-button danger-button compact-button" type="button" data-remove-register-career="${index}">삭제</button>
      </div>
      <div class="field-grid">
        <div class="field">
          <label for="register-career-country-${index}">직장 소재 국가</label>
          <input class="control-input" id="register-career-country-${index}" name="register-career-country-${index}" value="${inputValue(item.country)}" />
        </div>
        <div class="field">
          <label for="register-career-company-${index}">직장명</label>
          <input class="control-input" id="register-career-company-${index}" name="register-career-company-${index}" value="${inputValue(item.company)}" />
        </div>
        <div class="field">
          <label for="register-career-rank-${index}">직급</label>
          <input class="control-input" id="register-career-rank-${index}" name="register-career-rank-${index}" value="${inputValue(item.rank)}" />
        </div>
        <div class="field">
          <label for="register-career-position-${index}">직책</label>
          <input class="control-input" id="register-career-position-${index}" name="register-career-position-${index}" value="${inputValue(item.position)}" />
        </div>
        <div class="field">
          <label for="register-career-start-${index}">근무 시작</label>
          <input class="control-input" id="register-career-start-${index}" name="register-career-start-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.start)}" />
        </div>
        <div class="field ${isCurrent ? "is-hidden" : ""}" data-career-end-field>
          <label for="register-career-end-${index}">근무 종료</label>
          <input class="control-input" id="register-career-end-${index}" name="register-career-end-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${isCurrent ? "" : inputValue(item.end)}" ${isCurrent ? "disabled" : ""} />
        </div>
        <div class="field">
          <label class="inline-check"><input type="checkbox" name="register-career-current-${index}" ${isCurrent ? "checked" : ""} /> 현재 재직 중</label>
        </div>
        <div class="field full">
          <label for="register-career-achievements-${index}">직장에서의 주요성과/실적</label>
          <textarea class="control-textarea" id="register-career-achievements-${index}" name="register-career-achievements-${index}">${inputValue(item.achievements)}</textarea>
        </div>
      </div>
    </article>
  `;
}

function renderAiSearch() {
  const interpreted = state.aiQuery ? interpretQuery(state.aiQuery) : [];
  const resultContent = state.aiSearchLoading
    ? `<div class="empty-state">자연어 조건을 분석하고 후보자 적합도를 계산하는 중입니다.</div>`
    : state.aiQuery
      ? state.aiResults.length
        ? state.aiResults.map((result) => searchResultCard(result)).join("")
        : `<div class="empty-state">검색 조건에 맞는 후보자를 찾지 못했습니다. 조건을 조금 넓혀 다시 검색해주세요.</div>`
      : `<div class="empty-state">찾고 싶은 인재 조건을 자연어로 입력하면 Pool 전체에서 적합도 높은 후보자를 찾아드립니다.</div>`;

  $("#ai-search-content").innerHTML = `
    <div class="ai-layout">
      <section class="form-panel query-box">
        <label class="visually-hidden" for="ai-query">AI 검색어</label>
        <textarea class="control-textarea" id="ai-query" placeholder="예: NAND 공정 수율 개선 경험이 있고 Python 데이터 분석이 가능한 3~7년차 엔지니어">${escapeHtml(state.aiQuery)}</textarea>
        <div class="dropzone ai-file-upload">
          <input id="ai-search-file" name="aiSearchFile" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
          <span id="ai-file-status" class="form-help">${state.aiSearchFileName ? `${escapeHtml(state.aiSearchFileName)} 내용을 검색 조건으로 반영했습니다.` : "직무기술서, JD, 포지션 설명 파일을 업로드하면 내용을 읽어 적합도를 분석합니다."}</span>
        </div>
        <button class="primary-button" type="button" id="run-ai-search" ${state.aiSearchLoading ? "disabled" : ""}>${state.aiSearchLoading ? "검색 중" : "검색 실행"}</button>
        ${interpreted.length ? `<div class="tag-row">${interpreted.map((item) => `<span class="status-chip chip-blue">${escapeHtml(item)}</span>`).join("")}</div>` : ""}
      </section>

      <section class="search-results">
        ${resultContent}
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
    tokens.push("자연어 조건", "경력 정보", "접근 권한 반영");
  }

  return tokens;
}

const AI_SEARCH_CONCEPTS = [
  { label: "반도체 공정", aliases: ["반도체", "공정", "NAND", "EUV", "수율", "fab", "wafer"] },
  { label: "AI/ML", aliases: ["AI", "ML", "머신러닝", "딥러닝", "모델", "예측", "이상 탐지"] },
  { label: "데이터 분석", aliases: ["데이터", "분석", "Python", "SQL", "파이썬", "통계"] },
  { label: "온디바이스 AI", aliases: ["온디바이스", "on-device", "NPU", "TensorRT", "경량화", "추론 최적화"] },
  { label: "클라우드 보안", aliases: ["클라우드", "Cloud", "보안", "Security", "Zero Trust", "IAM", "Kubernetes"] },
  { label: "임베디드 SW", aliases: ["임베디드", "Embedded", "RTOS", "Linux", "펌웨어", "Automotive"] },
  { label: "글로벌 품질", aliases: ["글로벌", "품질", "Quality", "8D", "고객 대응", "CS", "영어"] },
  { label: "연구 역량", aliases: ["연구", "논문", "PhD", "박사", "리서처", "Research"] }
];

const SEARCH_STOPWORDS = new Set([
  "있는", "하고", "하며", "또는", "그리고", "후보자", "인재", "경험", "가능한", "적합한",
  "찾아줘", "찾아", "추천", "직무", "업무", "프로필", "pool", "POOL", "the", "and", "with"
]);

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^0-9a-z가-힣+#.]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeSearchText(value) {
  return normalizeSearchText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !SEARCH_STOPWORDS.has(token));
}

function candidateSearchText(candidate) {
  return normalizeSearchText([
    candidate.name,
    candidate.company,
    candidate.role,
    candidate.jobFamily,
    candidate.organization,
    candidate.summary,
    ...candidate.skills,
    ...candidate.tags,
    ...candidate.evidence,
    ...(candidate.education || []).flatMap((item) => [item.degree, item.school, item.major]),
    ...(candidate.career || []).flatMap((item) => [
      item.country,
      item.company,
      item.rank,
      item.position,
      item.start,
      item.end,
      item.achievements
    ])
  ].join(" "));
}

function parseYearCondition(query) {
  const normalized = query.replace(/\s+/g, "");
  const range = normalized.match(/(\d+)(?:~|-|부터)(\d+)년/);
  if (range) {
    return { min: Number(range[1]), max: Number(range[2]), label: `${range[1]}-${range[2]}년` };
  }

  const min = normalized.match(/(\d+)년(?:이상|초과|이후)/);
  if (min) {
    return { min: Number(min[1]), max: Infinity, label: `${min[1]}년 이상` };
  }

  const max = normalized.match(/(\d+)년(?:이하|미만|까지)/);
  if (max) {
    return { min: 0, max: Number(max[1]), label: `${max[1]}년 이하` };
  }

  if (/신입|주니어/i.test(query)) {
    return { min: 0, max: 3, label: "주니어" };
  }

  if (/시니어|고경력|리드|Principal/i.test(query)) {
    return { min: 8, max: Infinity, label: "시니어" };
  }

  return null;
}

function parseDegreeCondition(query) {
  if (query.includes("박사")) return "박사";
  if (query.includes("석사")) return "석사";
  if (query.includes("학사")) return "학사";
  return "";
}

function includesAny(text, aliases) {
  return aliases.some((alias) => text.includes(normalizeSearchText(alias)));
}

function runLocalAiSearch(query) {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return [];
  }

  const queryText = normalizeSearchText(cleanQuery);
  const queryTokens = tokenizeSearchText(cleanQuery);
  const requestedConcepts = AI_SEARCH_CONCEPTS.filter((concept) => includesAny(queryText, concept.aliases));
  const yearCondition = parseYearCondition(cleanQuery);
  const degreeCondition = parseDegreeCondition(cleanQuery);

  return state.candidates
    .map((candidate) => {
      const profileText = candidateSearchText(candidate);
      const tokenHits = queryTokens.filter((token) => profileText.includes(token));
      const conceptHits = requestedConcepts.filter((concept) => includesAny(profileText, concept.aliases));
      const skillHits = (candidate.skills || []).filter((skill) => queryText.includes(normalizeSearchText(skill)));
      const reasons = [];
      let score = 28;

      score += Math.min(30, tokenHits.length * 5);
      score += conceptHits.length * 13;
      score += skillHits.length * 8;

      if (conceptHits.length) {
        reasons.push(`${conceptHits.slice(0, 3).map((concept) => concept.label).join(", ")} 조건과 프로필이 일치`);
      }

      if (skillHits.length) {
        reasons.push(`${skillHits.slice(0, 4).join(", ")} 역량이 검색 조건과 직접 일치`);
      }

      if (yearCondition) {
        const yearFit = candidate.years >= yearCondition.min && candidate.years <= yearCondition.max;
        score += yearFit ? 14 : -18;
        reasons.push(yearFit ? `${candidate.years}년 경력이 ${yearCondition.label} 조건에 부합` : `${candidate.years}년 경력이 ${yearCondition.label} 조건과 차이`);
      }

      if (degreeCondition) {
        const degreeFit = (candidate.education || []).some((item) => item.degree === degreeCondition);
        score += degreeFit ? 10 : -8;
        if (degreeFit) {
          reasons.push(`${degreeCondition} 학력 조건 충족`);
        }
      }

      const primaryCareer = getPrimaryCareer(candidate);
      if (primaryCareer?.achievements && tokenHits.length) {
        reasons.push(`${primaryCareer.company} 주요성과가 검색 의도와 관련`);
      }

      if (!requestedConcepts.length && tokenHits.length) {
        reasons.push(`${tokenHits.slice(0, 4).join(", ")} 키워드가 프로필에 포함`);
      }

      const matchScore = Math.max(0, Math.min(98, Math.round(score)));

      return {
        ...candidate,
        matchScore,
        matchReasons: reasons.filter(Boolean).slice(0, 4)
      };
    })
    .filter((candidate) => candidate.matchScore >= 35)
    .sort((a, b) => b.matchScore - a.matchScore || dateSortValue(b.createdAt) - dateSortValue(a.createdAt))
    .slice(0, 6);
}

async function searchCandidatesWithServer(query) {
  const response = await fetch("/api/search-candidates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      candidates: state.candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        company: candidate.company,
        role: candidate.role,
        organization: candidate.organization,
        years: candidate.years,
        skills: candidate.skills,
        summary: candidate.summary,
        education: candidate.education,
        career: candidate.career
      }))
    })
  });

  if (!response.ok) {
    throw new Error(`AI search API failed: ${response.status}`);
  }

  const payload = await response.json();

  if (!payload.ok || !Array.isArray(payload.results)) {
    throw new Error(payload.error || "AI search API did not return results.");
  }

  return payload.results;
}

function mergeServerSearchResults(localResults, serverResults) {
  const localById = new Map(localResults.map((candidate) => [candidate.id, candidate]));
  const merged = serverResults
    .map((result) => {
      const candidate = state.candidates.find((item) => item.id === result.id);

      if (!candidate) {
        return null;
      }

      const local = localById.get(result.id);
      return {
        ...candidate,
        matchScore: Math.max(result.score, local?.matchScore || 0),
        matchReasons: result.reasons?.length ? result.reasons : local?.matchReasons || []
      };
    })
    .filter(Boolean);

  localResults.forEach((candidate) => {
    if (!merged.some((item) => item.id === candidate.id)) {
      merged.push(candidate);
    }
  });

  return merged
    .sort((a, b) => b.matchScore - a.matchScore || dateSortValue(b.createdAt) - dateSortValue(a.createdAt))
    .slice(0, 6);
}

async function runAiSearch(query) {
  const localResults = runLocalAiSearch(query);

  try {
    const serverResults = await searchCandidatesWithServer(query);
    return mergeServerSearchResults(localResults, serverResults);
  } catch (error) {
    console.warn("Server AI search failed. Using local semantic search.", error);
    return localResults;
  }
}

function buildAiQueryFromUploadedFile(text, fileName) {
  const normalized = normalizeResumeText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 6000);

  return [
    `업로드한 직무기술서 파일: ${fileName}`,
    "",
    "아래 직무기술서의 역할, 필수역량, 우대사항, 수행업무와 가장 잘 맞는 후보자를 찾아줘.",
    "",
    normalized
  ].join("\n");
}

function searchResultCard(candidate) {
  const reasons = candidate.matchReasons?.length ? candidate.matchReasons : candidate.evidence.slice(0, 3);

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
        </div>
        <ul class="evidence-list">
          ${reasons.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
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
    <div class="profile-panel detail-profile-panel">
      <div class="detail-profile-header">
        <div class="profile-hero profile-hero-large">
          ${candidateVisual(candidate, "large")}
          <div>
            <h4>${escapeHtml(candidate.name)}</h4>
            <span class="muted">${escapeHtml(candidate.company)} · ${escapeHtml(candidate.role)}</span>
          </div>
        </div>
        <div class="profile-stats detail-header-stats">
          ${statBox("담당자", candidate.owner)}
          ${statBox("사업부", candidate.organization)}
          ${statBox("상태", STATUS_LABELS[candidate.status])}
          ${statBox("최종 업데이트", candidate.updatedAt)}
          ${statBox("최초 등록일", candidate.createdAt)}
        </div>
      </div>
      ${renderFullDetailContent(candidate)}
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

function detailInfoGrid(items) {
  return `
    <div class="detail-info-grid">
      ${items.map((item) => `
        <div class="detail-info-item">
          <span>${escapeHtml(item.label)}</span>
          <strong>${item.html || escapeHtml(item.value || "-")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function normalizeExternalUrl(value) {
  const url = String(value || "").trim();

  if (!url) {
    return "";
  }

  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function detailLink(value) {
  const url = normalizeExternalUrl(value);

  if (!url) {
    return "";
  }

  return `<a class="detail-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(value)}</a>`;
}

function detailSection(title, content, className = "") {
  return `
    <section class="detail-section ${className}">
      <div class="detail-section-header">
        <h4>${escapeHtml(title)}</h4>
      </div>
      ${content}
    </section>
  `;
}

function renderCompetencySection(candidate) {
  const tags = candidate.skills?.length
    ? candidate.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")
    : `<span class="muted">등록된 주요 역량/성과가 없습니다.</span>`;

  return `
    <div class="bar-list">
      <div class="tag-row competency-tags">${tags}</div>
      ${candidate.summary ? `<p class="detail-summary">${escapeHtml(candidate.summary)}</p>` : ""}
    </div>
  `;
}

function renderResumeAttachmentSection(candidate) {
  const attachment = candidate.resumeAttachment;

  if (!attachment?.dataUrl) {
    return `<div class="empty-state">등록된 첨부 파일이 없습니다.</div>`;
  }

  return `
    <div class="attachment-row">
      <div>
        <span class="muted">첨부 파일</span>
        <strong>${escapeHtml(attachment.name || `${candidate.name}_resume`)}</strong>
        <small>${escapeHtml(formatFileSize(attachment.size))}${attachment.uploadedAt ? ` · ${escapeHtml(attachment.uploadedAt)}` : ""}</small>
      </div>
      <a class="soft-button" href="${escapeHtml(attachment.dataUrl)}" download="${escapeHtml(attachment.name || `${candidate.name}_resume`)}">다운로드</a>
    </div>
  `;
}

function renderOverviewSection(candidate) {
  return detailInfoGrid([
    { label: "이름", value: candidate.name },
    { label: "현재/최근 회사", value: candidate.company },
    { label: "현재/최근 직무", value: candidate.role },
    { label: "출생년도", value: candidate.birthYear },
    { label: "나이", value: candidate.age ? `${candidate.age}세` : "" },
    { label: "이메일 주소", value: candidate.email },
    { label: "휴대폰 번호", value: candidate.phone },
    { label: "링크드인 주소", html: detailLink(candidate.linkedinUrl) },
    { label: "기타 참고 URL", html: detailLink(candidate.referenceUrl) },
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
  ]);
}

function renderActivitySection(candidate) {
  if (!candidate.timeline?.length) {
    return `<div class="empty-state">등록된 이력이 없습니다.</div>`;
  }

  return `
    <div class="timeline">
      ${candidate.timeline.map((item) => `
        <article class="activity-item">
          <strong>${escapeHtml(item.type)} · ${escapeHtml(item.text)}</strong>
          <span class="activity-meta">${escapeHtml(item.actor)} · ${escapeHtml(item.date)}</span>
        </article>
      `).join("")}
    </div>
  `;
}

function renderApplicationsSection(candidate) {
  if (!candidate.applications?.length) {
    return `<div class="empty-state">등록된 지원 이력이 없습니다.</div>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>포지션</th><th>단계</th><th>결과</th><th>일자</th></tr></thead>
        <tbody>
          ${candidate.applications.map((item) => `
            <tr><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.stage)}</td><td>${escapeHtml(item.result)}</td><td>${escapeHtml(item.date)}</td></tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderFullDetailContent(candidate) {
  return `
    <div class="detail-section-stack">
      ${detailSection("주요 역량/성과", renderCompetencySection(candidate), "is-primary")}
      ${detailSection("학력", renderEducationTab(candidate))}
      ${detailSection("경력", renderCareerTab(candidate))}
      ${detailSection("이력서", renderResumeAttachmentSection(candidate))}
      ${detailSection("기본 정보", renderOverviewSection(candidate))}
      ${detailSection("이력", renderActivitySection(candidate))}
      ${detailSection("지원", renderApplicationsSection(candidate))}
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
            { label: "학위 시작", value: formatYearMonth(item.start) || "-" },
            { label: "학위 종료", value: formatYearMonth(item.end) || "-" }
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
            { label: "근무 시작", value: formatYearMonth(item.start) || "-" },
            { label: "근무 종료", value: item.end === "현재" ? "현재" : formatYearMonth(item.end) || "-" }
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
            <label for="edit-organization">사업부</label>
            <input class="control-input" id="edit-organization" name="editOrganization" value="${inputValue(candidate.organization)}" />
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
          <div class="field">
            <label for="edit-birth-year">출생년도</label>
            <input class="control-input" id="edit-birth-year" name="editBirthYear" type="number" inputmode="numeric" min="1900" max="${getCurrentYear()}" value="${inputValue(candidate.birthYear)}" />
          </div>
          <div class="field">
            <label for="edit-age">나이</label>
            <input class="control-input" id="edit-age" name="editAge" type="text" value="${inputValue(candidate.age ? `${candidate.age}세` : "")}" readonly />
          </div>
          <div class="field">
            <label for="edit-email">이메일 주소</label>
            <input class="control-input" id="edit-email" name="editEmail" type="email" value="${inputValue(candidate.email)}" />
          </div>
          <div class="field">
            <label for="edit-phone">휴대폰 번호</label>
            <input class="control-input" id="edit-phone" name="editPhone" type="tel" value="${inputValue(candidate.phone)}" />
          </div>
          <div class="field">
            <label for="edit-linkedin">링크드인 주소</label>
            <input class="control-input" id="edit-linkedin" name="editLinkedinUrl" type="url" value="${inputValue(candidate.linkedinUrl)}" />
          </div>
          <div class="field">
            <label for="edit-reference-url">기타 참고 URL</label>
            <input class="control-input" id="edit-reference-url" name="editReferenceUrl" type="url" value="${inputValue(candidate.referenceUrl)}" />
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
            <label for="edit-skills">주요 역량/성과</label>
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
          <input class="control-input" id="education-start-${index}" name="education-start-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.start)}" />
        </div>
        <div class="field">
          <label for="education-end-${index}">학위 종료</label>
          <input class="control-input" id="education-end-${index}" name="education-end-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.end)}" />
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
          <input class="control-input" id="career-start-${index}" name="career-start-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.start)}" />
        </div>
        <div class="field ${isCurrent ? "is-hidden" : ""}" data-career-end-field>
          <label for="career-end-${index}">근무 종료</label>
          <input class="control-input" id="career-end-${index}" name="career-end-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${isCurrent ? "" : inputValue(item.end)}" ${isCurrent ? "disabled" : ""} />
        </div>
        <div class="field">
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
  const normalized = String(value || "").trim();
  return normalized === "0" || /^\d{1,4}([-./]\d{1,2})?$/.test(normalized);
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
  candidate.organization = getFormText(form, "editOrganization") || candidate.organization;
  candidate.owner = getFormText(form, "editOwner") || candidate.owner;
  candidate.status = getFormText(form, "editStatus") || candidate.status;
  candidate.birthYear = getFormText(form, "editBirthYear");
  candidate.age = calculateAge(candidate.birthYear);
  candidate.email = getFormText(form, "editEmail");
  candidate.phone = getFormText(form, "editPhone");
  candidate.linkedinUrl = getFormText(form, "editLinkedinUrl");
  candidate.referenceUrl = getFormText(form, "editReferenceUrl");
  candidate.skills = skills.length ? skills : candidate.skills;
  candidate.summary = getFormText(form, "editSummary") || candidate.summary;
  candidate.education = collectEducationFromForm(form, options.preserveBlankRecords);
  candidate.career = collectCareerFromForm(form, options.preserveBlankRecords);
  candidate.years = estimateCareerYears(candidate.career);
  candidate.updatedAt = getTodayDate();

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

function getMemberStatusChip(status) {
  const chipClass = {
    pending: "chip-amber",
    active: "chip-green",
    suspended: "chip-red",
    rejected: "chip-violet"
  }[status] || "chip-blue";

  return `<span class="status-chip ${chipClass}">${escapeHtml(getMemberStatusLabel(status))}</span>`;
}

function getRoleChip(role) {
  const chipClass = {
    associate: "chip-blue",
    regular: "chip-green",
    operator: "chip-violet",
    admin: "chip-red"
  }[role] || "chip-blue";

  return `<span class="status-chip ${chipClass}">${escapeHtml(getRoleLabel(role))}</span>`;
}

function getFilteredMembers() {
  const query = state.memberFilters.query.trim().toLowerCase();

  return state.members
    .filter((member) => {
      const text = [
        member.name,
        member.email,
        member.department,
        member.position,
        member.phone,
        member.note,
        getRoleLabel(member.role),
        getMemberStatusLabel(member.status)
      ].join(" ").toLowerCase();

      const queryMatch = !query || text.includes(query);
      const roleMatch = state.memberFilters.role === "all" || member.role === state.memberFilters.role;
      const statusMatch = state.memberFilters.status === "all" || member.status === state.memberFilters.status;

      return queryMatch && roleMatch && statusMatch;
    })
    .sort((a, b) =>
      MEMBER_STATUS_ORDER.indexOf(a.status) - MEMBER_STATUS_ORDER.indexOf(b.status) ||
      dateSortValue(b.requestedAt) - dateSortValue(a.requestedAt) ||
      a.name.localeCompare(b.name)
    );
}

function renderMemberActionButtons(member) {
  if (member.id === state.currentUserId) {
    return `<span class="muted-text">본인 계정</span>`;
  }

  const actions = [];

  if (member.status === "pending" || member.status === "rejected") {
    actions.push(`<button class="soft-button compact-button" type="button" data-approve-member="${member.id}">승인</button>`);
  }

  if (member.status === "pending") {
    actions.push(`<button class="ghost-button danger-button compact-button" type="button" data-reject-member="${member.id}">반려</button>`);
  }

  if (member.status === "active") {
    actions.push(`<button class="ghost-button danger-button compact-button" type="button" data-suspend-member="${member.id}">정지</button>`);
  }

  if (member.status === "suspended") {
    actions.push(`<button class="soft-button compact-button" type="button" data-activate-member="${member.id}">재활성</button>`);
  }

  actions.push(`<button class="ghost-button compact-button" type="button" data-reset-member-password="${member.id}">비밀번호 초기화</button>`);

  return `<div class="member-actions">${actions.join("")}</div>`;
}

function memberTable(members) {
  if (!members.length) {
    return `<div class="empty-state">조건에 맞는 회원이 없습니다.</div>`;
  }

  return `
    <div class="table-wrap">
      <table class="member-table">
        <thead>
          <tr>
            <th>회원</th>
            <th>등급</th>
            <th>상태</th>
            <th>소속</th>
            <th>가입 신청</th>
            <th>최근 로그인</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          ${members.map((member) => `
            <tr>
              <td>
                <div class="member-identity">
                  <strong>${escapeHtml(member.name)}</strong>
                  <span>${escapeHtml(member.email)}</span>
                  ${member.note ? `<small>${escapeHtml(member.note)}</small>` : ""}
                </div>
              </td>
              <td>
                <select class="control-select compact-select" data-member-role="${member.id}" ${member.id === state.currentUserId ? "disabled" : ""}>
                  ${MEMBER_ROLE_ORDER.map((role) => `<option value="${role}" ${member.role === role ? "selected" : ""}>${MEMBER_ROLES[role]}</option>`).join("")}
                </select>
              </td>
              <td>${getMemberStatusChip(member.status)}</td>
              <td>
                <div class="summary-cell">
                  <strong>${escapeHtml(member.department || "-")}</strong>
                  <span>${escapeHtml(member.position || "직책 미입력")}</span>
                </div>
              </td>
              <td>${escapeHtml(member.requestedAt || "-")}</td>
              <td>${escapeHtml(member.lastLoginAt || "-")}</td>
              <td>${renderMemberActionButtons(member)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRolePermissionMatrix() {
  return `
    <div class="table-wrap">
      <table class="permission-table">
        <thead>
          <tr>
            <th>회원등급</th>
            ${MENU_CONFIG.map((menu) => `<th>${escapeHtml(menu.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${MEMBER_ROLE_ORDER.map((role) => `
            <tr>
              <th>
                <div class="member-role-cell">
                  ${getRoleChip(role)}
                  <span>${escapeHtml(rolePermissionDescription(role))}</span>
                </div>
              </th>
              ${MENU_CONFIG.map((menu) => {
                const checked = getAllowedViewsForRole(role).includes(menu.view);
                const locked = role === "admin" || menu.view === "dashboard" || menu.view === "members";

                return `
                  <td>
                    <label class="permission-toggle" title="${escapeHtml(menu.description)}">
                      <input type="checkbox" data-role-permission-role="${role}" data-role-permission-view="${menu.view}" ${checked ? "checked" : ""} ${locked ? "disabled" : ""} />
                      <span>${checked ? "허용" : "차단"}</span>
                    </label>
                  </td>
                `;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function rolePermissionDescription(role) {
  return {
    associate: "조회와 AI 검색 중심의 제한 계정",
    regular: "후보자 등록까지 가능한 실무 계정",
    operator: "운영 로그까지 확인하는 운영 계정",
    admin: "회원 승인과 권한 설정까지 가능한 관리자"
  }[role] || "";
}

function renderMembers() {
  const content = $("#members-content");

  if (!content) {
    return;
  }

  if (!isAdmin()) {
    content.innerHTML = `<div class="empty-state">회원관리 메뉴는 관리자만 사용할 수 있습니다.</div>`;
    return;
  }

  const pending = state.members.filter((member) => member.status === "pending").length;
  const active = state.members.filter((member) => member.status === "active").length;
  const suspended = state.members.filter((member) => member.status === "suspended").length;
  const filteredMembers = getFilteredMembers();

  content.innerHTML = `
    <div class="dashboard-grid member-dashboard">
      <div class="kpi-row">
        ${metricCard("전체 회원", state.members.length, "등록된 계정")}
        ${metricCard("승인 대기", pending, "관리자 확인 필요")}
        ${metricCard("활성 회원", active, "로그인 가능")}
        ${metricCard("정지 회원", suspended, "접속 차단")}
        ${metricCard("회원 등급", MEMBER_ROLE_ORDER.length, "권한표 운영")}
      </div>

      <section class="content-panel span-12">
        <div class="panel-header">
          <h4>회원 목록 및 승인 관리</h4>
          <span class="small-pill">승인 후 접속 가능</span>
        </div>
        <div class="filter-strip">
          <input class="control-input" id="member-query" type="search" value="${escapeHtml(state.memberFilters.query)}" placeholder="이름, 이메일, 부서, 사용 목적 검색" />
          <select class="control-select" id="member-role-filter">
            <option value="all">전체 등급</option>
            ${MEMBER_ROLE_ORDER.map((role) => `<option value="${role}" ${state.memberFilters.role === role ? "selected" : ""}>${MEMBER_ROLES[role]}</option>`).join("")}
          </select>
          <select class="control-select" id="member-status-filter">
            <option value="all">전체 상태</option>
            ${MEMBER_STATUS_ORDER.map((status) => `<option value="${status}" ${state.memberFilters.status === status ? "selected" : ""}>${MEMBER_STATUSES[status]}</option>`).join("")}
          </select>
        </div>
        <div id="member-table-content">
          ${memberTable(filteredMembers)}
        </div>
      </section>

      <section class="content-panel span-12">
        <div class="panel-header">
          <h4>등급별 메뉴 접근 권한</h4>
          <span class="small-pill">관리자 등급은 전체 권한 고정</span>
        </div>
        ${renderRolePermissionMatrix()}
      </section>
    </div>
  `;
}

function renderMemberTable() {
  const tableContent = $("#member-table-content");

  if (!tableContent) {
    renderMembers();
    return;
  }

  tableContent.innerHTML = memberTable(getFilteredMembers());
}

function collectRegisterEducationFromForm(formElement, preserveBlank = false) {
  const formData = new FormData(formElement);
  const records = [...formElement.querySelectorAll("[data-register-education-index]")]
    .map((record) => Number(record.dataset.registerEducationIndex))
    .map((index) => ({
      degree: (formData.get(`register-education-degree-${index}`) || "").toString().trim(),
      school: (formData.get(`register-education-school-${index}`) || "").toString().trim(),
      major: (formData.get(`register-education-major-${index}`) || "").toString().trim(),
      start: (formData.get(`register-education-start-${index}`) || "").toString().trim(),
      end: (formData.get(`register-education-end-${index}`) || "").toString().trim()
    }));

  return preserveBlank ? records : records.filter(hasAnyRecordValue);
}

function collectRegisterCareerFromForm(formElement, preserveBlank = false) {
  const formData = new FormData(formElement);
  const records = [...formElement.querySelectorAll("[data-register-career-index]")]
    .map((record) => Number(record.dataset.registerCareerIndex))
    .map((index) => ({
      country: (formData.get(`register-career-country-${index}`) || "").toString().trim(),
      company: (formData.get(`register-career-company-${index}`) || "").toString().trim(),
      rank: (formData.get(`register-career-rank-${index}`) || "").toString().trim(),
      position: (formData.get(`register-career-position-${index}`) || "").toString().trim(),
      start: (formData.get(`register-career-start-${index}`) || "").toString().trim(),
      end: formData.get(`register-career-current-${index}`) ? "현재" : (formData.get(`register-career-end-${index}`) || "").toString().trim(),
      achievements: (formData.get(`register-career-achievements-${index}`) || "").toString().trim()
    }));

  return preserveBlank ? records : records.filter(hasAnyRecordValue);
}

function periodYear(value) {
  const formatted = String(value || "").trim();

  if (!formatted || formatted === "0") {
    return null;
  }

  if (formatted === "현재") {
    return new Date().getFullYear();
  }

  const year = Number(formatted.split(/[-./년월\s]+/).find((part) => part && part !== "0"));
  return Number.isFinite(year) && year > 0 ? year : null;
}

function estimateCareerYears(career) {
  const spans = career
    .map((item) => ({ start: periodYear(item.start), end: periodYear(item.end) }))
    .filter((item) => item.start || item.end);

  if (!spans.length) {
    return 0;
  }

  const start = Math.min(...spans.map((item) => item.start || item.end));
  const end = Math.max(...spans.map((item) => item.end || item.start));
  return Math.max(0, end - start);
}

function getRegisterEducationRecords() {
  const form = $("#register-form");
  return form ? collectRegisterEducationFromForm(form, true) : [];
}

function getRegisterCareerRecords() {
  const form = $("#register-form");
  return form ? collectRegisterCareerFromForm(form, true) : [];
}

function setRegisterEducationRecords(records) {
  const list = $("#register-education-list");
  const items = records.length ? records : [{}];

  if (list) {
    list.innerHTML = items.map((item, index) => renderRegisterEducationRecord(item, index)).join("");
  }
}

function setRegisterCareerRecords(records) {
  const list = $("#register-career-list");
  const items = records.length ? records : [{}];

  if (list) {
    list.innerHTML = items.map((item, index) => renderRegisterCareerRecord(item, index)).join("");
  }
}

function addRegisterEducationRecord() {
  setRegisterEducationRecords([...getRegisterEducationRecords(), {}]);
}

function addRegisterCareerRecord() {
  setRegisterCareerRecords([...getRegisterCareerRecords(), {}]);
}

function removeRegisterEducationRecord(index) {
  const records = getRegisterEducationRecords();
  records.splice(index, 1);
  setRegisterEducationRecords(records);
}

function removeRegisterCareerRecord(index) {
  const records = getRegisterCareerRecords();
  records.splice(index, 1);
  setRegisterCareerRecords(records);
}

function updateCareerCurrentControl(checkbox) {
  const record = checkbox.closest("[data-register-career-index], [data-career-index]");
  const endField = record?.querySelector("[data-career-end-field]");
  const endInput = endField?.querySelector("input");

  if (!endField || !endInput) {
    return;
  }

  endField.classList.toggle("is-hidden", checkbox.checked);
  endInput.disabled = checkbox.checked;

  if (checkbox.checked) {
    endInput.value = "";
  }
}

function normalizeResumeText(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/\u0000/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\u00ad/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

const PDFJS_DIST_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs";
const PDFJS_WORKER_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";

let pdfJsLoader = null;

function createResumeParseError(message, warnings = []) {
  const error = new Error(message);
  error.isResumeParseError = true;
  error.warnings = warnings;
  return error;
}

function getFileExtension(fileName = "") {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function bytesToAscii(bytes, length = 12) {
  return Array.from(bytes.slice(0, length))
    .map((byte) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : " "))
    .join("");
}

function detectResumeFileType(file, buffer) {
  const extension = getFileExtension(file?.name);
  const bytes = new Uint8Array(buffer || new ArrayBuffer(0));
  const signature = bytesToAscii(bytes, 8);

  if (extension === "pdf" || signature.startsWith("%PDF")) return "pdf";
  if (extension === "docx") return "docx";
  if (extension === "hwpx") return "hwpx";
  if (extension === "hwp") return "hwp";
  if (extension === "doc") return "doc";
  if (["txt", "md", "csv", "json"].includes(extension) || /text|json|csv|markdown/.test(file?.type || "")) return "text";
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return "zip";

  return "unknown";
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function scoreExtractedTextQuality(text) {
  const normalized = normalizeResumeText(text);
  const length = Math.max(normalized.length, 1);
  const warnings = [];
  let score = 100;

  const replacementRate = countMatches(normalized, /\uFFFD/g) / length;
  const controlRate = countMatches(normalized, /[\u0001-\u0008\u000b\u000c\u000e-\u001f]/g) / length;
  const mojibakeRate = countMatches(normalized, /[ìíîïëêÃÂÐÑ\uFFFD]/g) / length;
  const usefulCount = countMatches(normalized, /[A-Za-z0-9가-힣]/g);
  const usefulRate = usefulCount / length;
  const pdfArtifactCount = countMatches(normalized, /\b(?:endobj|xref|stream|endstream|obj\s*<<|\/Font|\/Type|\/Length|\/Filter)\b/g);
  const xmlTagCount = countMatches(normalized, /<\/?[A-Za-z][^>\n]{0,80}>/g);
  const binarySignature = /%PDF|PK\u0003\u0004|\u0000\u0000/.test(normalized);

  if (replacementRate > 0.01) {
    score -= 35;
    warnings.push("깨진 대체 문자가 많습니다.");
  }

  if (controlRate > 0.01) {
    score -= 30;
    warnings.push("바이너리 제어 문자가 남아 있습니다.");
  }

  if (mojibakeRate > 0.01) {
    score -= 35;
    warnings.push("문자 인코딩이 깨진 패턴이 감지되었습니다.");
  }

  if (usefulRate < 0.25) {
    score -= 25;
    warnings.push("이름/회사/학력/경력으로 보이는 유효 텍스트가 부족합니다.");
  }

  if (pdfArtifactCount >= 3) {
    score -= 35;
    warnings.push("PDF 내부 명령어가 텍스트에 남아 있습니다.");
  }

  if (xmlTagCount >= 3) {
    score -= 20;
    warnings.push("문서 XML 태그가 텍스트에 남아 있습니다.");
  }

  if (binarySignature) {
    score -= 40;
    warnings.push("문서 바이너리 시그니처가 감지되었습니다.");
  }

  if (normalized.length < 20 || usefulCount < 8) {
    score -= 30;
    warnings.push("추출된 텍스트가 너무 짧습니다.");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    text: normalized,
    warnings
  };
}

function ensureReadableResumeText(text, context = {}) {
  const quality = scoreExtractedTextQuality(text);

  if (quality.score < 55) {
    throw createResumeParseError(
      "이 파일에서 읽을 수 있는 텍스트를 충분히 추출하지 못했습니다. DOCX 또는 텍스트 PDF로 다시 업로드해주세요.",
      quality.warnings
    );
  }

  return {
    text: quality.text,
    meta: {
      fileName: context.fileName || "",
      fileType: context.fileType || "unknown",
      extractionMethod: context.extractionMethod || "unknown",
      textQuality: quality.score,
      warnings: quality.warnings
    }
  };
}

function decodeBufferWithBestEncoding(buffer) {
  const candidates = ["utf-8", "euc-kr", "utf-16le"]
    .map((encoding) => {
      try {
        const text = new TextDecoder(encoding, { fatal: false }).decode(buffer);
        return { encoding, ...scoreExtractedTextQuality(text) };
      } catch (_) {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return candidates[0] || { encoding: "utf-8", text: "", score: 0, warnings: ["텍스트 인코딩을 판별하지 못했습니다."] };
}

function readUint16(view, offset) {
  return view.getUint16(offset, true);
}

function readUint32(view, offset) {
  return view.getUint32(offset, true);
}

function decodeZipFileName(bytes) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (_) {
    return new TextDecoder("euc-kr", { fatal: false }).decode(bytes);
  }
}

function findEndOfCentralDirectory(bytes) {
  for (let offset = bytes.length - 22; offset >= 0 && offset >= bytes.length - 66000; offset -= 1) {
    if (bytes[offset] === 0x50 && bytes[offset + 1] === 0x4b && bytes[offset + 2] === 0x05 && bytes[offset + 3] === 0x06) {
      return offset;
    }
  }

  return -1;
}

async function inflateZipEntry(data) {
  if (typeof DecompressionStream === "undefined") {
    throw createResumeParseError("이 브라우저에서 압축 문서 텍스트 추출을 지원하지 않습니다.");
  }

  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readZipEntries(buffer, shouldReadEntry) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const eocdOffset = findEndOfCentralDirectory(bytes);

  if (eocdOffset < 0) {
    throw createResumeParseError("압축 문서 구조를 찾지 못했습니다.");
  }

  const entryCount = readUint16(view, eocdOffset + 10);
  const centralDirectoryOffset = readUint32(view, eocdOffset + 16);
  const entries = [];
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (readUint32(view, offset) !== 0x02014b50) break;

    const method = readUint16(view, offset + 10);
    const compressedSize = readUint32(view, offset + 20);
    const fileNameLength = readUint16(view, offset + 28);
    const extraLength = readUint16(view, offset + 30);
    const commentLength = readUint16(view, offset + 32);
    const localHeaderOffset = readUint32(view, offset + 42);
    const fileNameBytes = bytes.slice(offset + 46, offset + 46 + fileNameLength);
    const fileName = decodeZipFileName(fileNameBytes).replace(/\\/g, "/");

    if (shouldReadEntry(fileName)) {
      const localNameLength = readUint16(view, localHeaderOffset + 26);
      const localExtraLength = readUint16(view, localHeaderOffset + 28);
      const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressedData = bytes.slice(dataOffset, dataOffset + compressedSize);
      let data;

      if (method === 0) {
        data = compressedData;
      } else if (method === 8) {
        data = await inflateZipEntry(compressedData);
      } else {
        data = new Uint8Array();
      }

      entries.push({
        fileName,
        bytes: data,
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
  return normalizeResumeText(
    decodeXmlEntities(xml)
      .replace(/<[^>]*(?:p|paragraph|sectPr|br|tab)[^>]*\/>/gi, "\n")
      .replace(/<\/(?:w:p|hp:p|p|text:p|a:p)>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
  );
}

async function extractTextFromDocx(buffer) {
  const entries = await readZipEntries(buffer, (fileName) =>
    /^word\/(?:document|header\d*|footer\d*)\.xml$/i.test(fileName)
  );

  return entries.map((entry) => extractTextFromXml(entry.text)).join("\n");
}

async function extractTextFromHwpx(buffer) {
  const entries = await readZipEntries(buffer, (fileName) =>
    /^Contents\/.*\.xml$/i.test(fileName) || /^Preview\/.*\.xml$/i.test(fileName)
  );

  return entries.map((entry) => extractTextFromXml(entry.text)).join("\n");
}

function unescapePdfLiteral(value) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

function extractTextFromSimplePdf(buffer) {
  const text = new TextDecoder("iso-8859-1", { fatal: false }).decode(buffer);
  const literalText = [...text.matchAll(/\((?:\\.|[^\\()]){2,}\)\s*Tj/g)]
    .map((match) => unescapePdfLiteral(match[0].replace(/\)\s*Tj$/, "").slice(1)))
    .join("\n");
  const arrayText = [...text.matchAll(/\[(.*?)\]\s*TJ/gs)]
    .flatMap((match) => [...match[1].matchAll(/\((?:\\.|[^\\()]){2,}\)/g)].map((item) => unescapePdfLiteral(item[0].slice(1, -1))))
    .join(" ");

  return normalizeResumeText([literalText, arrayText].filter(Boolean).join("\n"));
}

async function loadPdfJs() {
  if (!pdfJsLoader) {
    pdfJsLoader = import(PDFJS_DIST_URL).then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      return pdfjs;
    });
  }

  return pdfJsLoader;
}

async function extractTextFromPdf(buffer) {
  try {
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer), useWorkerFetch: true });
    const pdf = await loadingTask.promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(" "));
    }

    return normalizeResumeText(pages.join("\n"));
  } catch (error) {
    console.warn("PDF.js extraction failed. Trying a simple PDF text fallback.", error);
    return extractTextFromSimplePdf(buffer);
  }
}

function extractReadableTextFromBytes(buffer) {
  return decodeBufferWithBestEncoding(buffer).text;
}

async function readResumeText(file) {
  if (!file) {
    return ensureReadableResumeText("", { fileType: "unknown", extractionMethod: "empty" });
  }

  const buffer = await file.arrayBuffer();
  const fileType = detectResumeFileType(file, buffer);
  let text = "";
  let extractionMethod = fileType;

  if (fileType === "text") {
    const decoded = decodeBufferWithBestEncoding(buffer);
    text = decoded.text;
    extractionMethod = `text-${decoded.encoding}`;
  } else if (fileType === "docx") {
    text = await extractTextFromDocx(buffer);
    extractionMethod = "docx-xml";
  } else if (fileType === "hwpx") {
    text = await extractTextFromHwpx(buffer);
    extractionMethod = "hwpx-xml";
  } else if (fileType === "pdf") {
    text = await extractTextFromPdf(buffer);
    extractionMethod = "pdf-text-layer";
  } else if (fileType === "hwp" || fileType === "doc") {
    throw createResumeParseError("이 파일 형식은 브라우저에서 안정적으로 읽기 어렵습니다. DOCX, HWPX 또는 텍스트 PDF로 변환해 업로드해주세요.");
  } else {
    throw createResumeParseError("지원하지 않는 이력서 파일 형식입니다. DOCX, HWPX, PDF, TXT 파일을 업로드해주세요.");
  }

  return ensureReadableResumeText(text, {
    fileName: file.name,
    fileType,
    extractionMethod
  });
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanParsedValue(value) {
  const cleaned = normalizeResumeText(value)
    .replace(/^(?:이름|성명|Name|현재\s*회사|최근\s*회사|회사|근무처|지원\s*직무|희망직무|직무|포지션|출생년도|생년|이메일|Email|휴대폰|전화|Phone|LinkedIn|링크드인|기타\s*URL|참고\s*URL|학력|경력|기술|Skills)\s*[:：-]?\s*/i, "")
    .replace(/\b(?:endobj|xref|stream|endstream|obj|\/Font|\/Type|\/Length|\/Filter)\b/gi, " ")
    .replace(/<\/?[A-Za-z][^>\n]{0,80}>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!cleaned || /%PDF|PK\u0003\u0004|\uFFFD/.test(cleaned)) {
    return "";
  }

  return cleaned;
}

function labeledValueFromLine(line, labels) {
  const pattern = new RegExp(`^(?:${labels.map(escapeRegExp).join("|")})(?:\\s*[:：-]|\\s+)\\s*(.+)$`, "i");
  const match = cleanParsedValue(line).match(pattern) || line.match(pattern);

  return cleanParsedValue(match?.[1] || "");
}

function findLabeledValue(lines, labels) {
  for (const line of lines) {
    const value = labeledValueFromLine(line, labels);

    if (value) {
      return value;
    }
  }

  return "";
}

function splitResumeParts(line) {
  return cleanParsedValue(line)
    .split(/[,|;\t]/)
    .map((part) => cleanParsedValue(part))
    .filter(Boolean);
}

function normalizeDatePart(year, month = "0") {
  const normalizedYear = String(year || "").trim();
  const normalizedMonth = String(month || "0").trim();

  if (!normalizedYear) {
    return "";
  }

  if (normalizedMonth === "0" || !normalizedMonth) {
    return normalizedYear;
  }

  return `${normalizedYear}-${normalizedMonth.padStart(2, "0")}`;
}

function extractPeriodValues(line) {
  const current = /현재|재직|재직중|present|current|ongoing/i.test(line);
  const normalizedLine = String(line || "")
    .replace(/(\d{4}|0)\s*년\s*(\d{1,2}|0)?\s*월?/g, (_, year, month) => `${year}-${month || "0"}`)
    .replace(/(\d{4}|0)\s*[.\/]\s*(\d{1,2}|0)/g, "$1-$2");
  const matches = [...normalizedLine.matchAll(/(\d{4}|0)(?:\s*[-]\s*(\d{1,2}|0))?/g)]
    .map((match) => normalizeDatePart(match[1], match[2] || "0"));

  return {
    start: matches[0] || "",
    end: current ? "현재" : matches[1] || ""
  };
}

function parseEducationLine(line) {
  const body = cleanParsedValue(line).replace(/^(?:학력|Education)[:：\s-]*/i, "");
  const parts = splitResumeParts(body);
  const degree = cleanParsedValue(parts.find((part) => /(박사|석사|학사|전문학사|Ph\.?D|Master|Bachelor)/i.test(part)) ||
    firstMatch(body, [/(박사|석사|학사|전문학사|Ph\.?D|Master|Bachelor)/i]));
  const school = cleanParsedValue(parts.find((part) => /(대학교|대학원|University|College|Institute|KAIST|POSTECH)/i.test(part)) ||
    firstMatch(body, [/([가-힣A-Za-z0-9\s]+(?:대학교|대학원|University|College|Institute|KAIST|POSTECH))/i]));
  const major = cleanParsedValue(labeledValueFromLine(body, ["전공", "Major"]) || parts.find((part) =>
    !part.includes(degree) &&
    !part.includes(school) &&
    !extractPeriodValues(part).start &&
    /(공학|학과|전공|Science|Engineering|Management|Business|AI|SW|컴퓨터|전자|기계|산업)/i.test(part)
  ) || firstMatch(body, [
    /전공[:\s]+([가-힣A-Za-z0-9\s/·&+-]+)/,
    /([가-힣A-Za-z0-9\s]+(?:공학|학과|전공|Science|Engineering|Management|Business))/i
  ]));
  const period = extractPeriodValues(body);

  return { degree, school, major, ...period };
}

function parseCareerLine(line) {
  const period = extractPeriodValues(line);
  const body = cleanParsedValue(line).replace(/^(?:경력|Career|Experience|Work Experience)[:：\s-]*/i, "");
  const parts = splitResumeParts(body);
  const structuredCareerLine = parts.length >= 4 &&
    (line.includes("경력") || /Career|Experience/i.test(line) || period.start || parts.some((part) => /(사원|주임|대리|과장|차장|부장|책임|선임|수석|Staff|Senior|Principal|Manager)/i.test(part)));

  if (structuredCareerLine) {
    const periodIndex = parts.findIndex((part) => extractPeriodValues(part).start || extractPeriodValues(part).end);
    const achievementStart = periodIndex >= 0 ? periodIndex + 1 : 4;

    return {
      country: cleanParsedValue(parts[0]),
      company: cleanParsedValue(parts[1]),
      rank: cleanParsedValue(parts[2]),
      position: cleanParsedValue(parts[3]),
      start: period.start,
      end: period.end,
      achievements: cleanParsedValue(parts.slice(achievementStart).join(", "))
    };
  }

  const company = cleanParsedValue(labeledValueFromLine(body, ["회사", "직장", "근무처", "Company"]) || firstMatch(body, [
    /(?:회사|직장|근무처)[:\s]+([가-힣A-Za-z0-9\s.&+-]+)/,
    /([가-힣A-Za-z0-9\s.&+-]+(?:전자|반도체|리서치|Research|Cloud|Mobis|hynix|ASML|Samsung|Naver|LG|SK|Inc\.?|Corp\.?|Korea))/i
  ]));
  const position = cleanParsedValue(labeledValueFromLine(body, ["직책", "담당", "포지션", "Position"]) || firstMatch(body, [
    /(?:직책|담당|포지션)[:\s]+([가-힣A-Za-z0-9\s/·&+-]+)/,
    /([가-힣A-Za-z0-9\s]+(?:엔지니어|개발자|리서처|아키텍트|컨설턴트|분석|리드|Engineer|Researcher|Architect|Developer))/i
  ]));
  const rank = cleanParsedValue(firstMatch(body, [/(사원|주임|대리|과장|차장|부장|책임|선임|수석|Staff|Senior|Principal|Manager)/i]));

  return {
    country: body.includes("미국") || /USA|United States/i.test(body) ? "미국" : body.includes("대한민국") ? "대한민국" : "",
    company,
    rank,
    position,
    start: period.start,
    end: period.end,
    achievements: body.length > 30 ? body : ""
  };
}

function inferSkills(text) {
  const skillPool = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Embedded C", "Linux", "RTOS",
    "NAND", "EUV", "LLM", "TensorRT", "Kubernetes", "Cloud", "IAM", "Zero Trust", "AI", "ML",
    "On-device AI", "품질", "8D", "반도체", "데이터 분석", "보안", "장비 제어"
  ];

  const lowerText = text.toLowerCase();

  return skillPool.filter((skill) => {
    const lowerSkill = skill.toLowerCase();

    if (["ai", "ml"].includes(lowerSkill)) {
      return new RegExp(`(^|[^a-z])${lowerSkill}([^a-z]|$)`, "i").test(text);
    }

    return lowerText.includes(lowerSkill);
  });
}

function extractEmail(text) {
  return cleanParsedValue(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "");
}

function extractPhone(text) {
  return cleanParsedValue(text.match(/(?:\+82[-.\s]?)?0?1[016789][-\s.]?\d{3,4}[-\s.]?\d{4}/)?.[0] || "");
}

function extractBirthYear(text, lines = []) {
  const labeled = findLabeledValue(lines, ["출생년도", "생년", "생년월일", "Birth Year", "Birth"]);
  const fromLabel = labeled.match(/\b(19\d{2}|20\d{2})\b/)?.[1];

  if (fromLabel) {
    return fromLabel;
  }

  return text.match(/(?:출생|생년|Birth)[^\d]{0,12}(19\d{2}|20\d{2})/)?.[1] || "";
}

function extractLinkedinUrl(text) {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s<>)"']+/i);
  return cleanParsedValue(match?.[0] || "");
}

function extractReferenceUrl(text) {
  const urls = [...text.matchAll(/https?:\/\/[^\s<>)"']+|(?:www\.)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}\/[^\s<>)"']*/g)]
    .map((match) => cleanParsedValue(match[0]))
    .filter((url) =>
      url &&
      !url.includes("@") &&
      !/linkedin\.com/i.test(url) &&
      !/\.(?:com|co\.kr|net|org)$/i.test(url)
    );

  return urls[0] || "";
}

function parseResumeText(text, filename = "") {
  const normalized = normalizeResumeText(text);
  const lines = normalized
    .split("\n")
    .map((line) => cleanParsedValue(line))
    .filter((line) => line && !/^(이력서|자기소개서|경력기술서)$/i.test(line));
  const compact = lines.join("\n");
  const educationLines = lines.filter((line) =>
    /(학력|Education|대학교|대학원|University|College|KAIST|POSTECH|학사|석사|박사|전공)/i.test(line) &&
    !/(경력|Experience|회사|근무|재직)/i.test(line)
  );
  const careerLines = lines.filter((line) => {
    const hasCareerContext = /(경력|재직|근무|직장|Experience|Career|Work)/i.test(line);
    const hasPeriodAndCompany = !!extractPeriodValues(line).start &&
      /(회사|직장|Samsung|Naver|SK|LG|ASML|Cloud|Mobis|Inc\.?|Corp\.?|Korea)/i.test(line);
    const isProfileSummaryLine = /(현재\s*회사|최근\s*회사|현재\/최근|지원\s*직무|희망직무|지원분야|직무[:\s]|포지션[:\s])/i.test(line);
    const isEducationLine = /(대학교|대학원|University|College|학사|석사|박사|전공)/i.test(line);

    return (hasCareerContext || hasPeriodAndCompany) && !isProfileSummaryLine && !isEducationLine;
  });
  const education = educationLines.map(parseEducationLine).filter(hasAnyRecordValue).slice(0, 5);
  const career = careerLines.map(parseCareerLine).filter(hasAnyRecordValue).slice(0, 6);
  const skills = inferSkills(compact);
  const name = findLabeledValue(lines, ["이름", "성명", "Name"]) ||
    cleanParsedValue(lines.find((line) => (/^[가-힣]{2,5}$|^[A-Z][a-z]+ [A-Z][a-z]+$/.test(line)) && !/(이력서|자기소개|경력)/.test(line)) || "");
  const role = cleanParsedValue(findLabeledValue(lines, ["희망직무", "지원분야", "지원 직무", "직무", "포지션", "Position"]) || firstMatch(compact, [
    /([가-힣A-Za-z0-9 /·&+-]+(?:엔지니어|개발자|리서처|아키텍트|분석가|Engineer|Developer|Researcher|Architect))/
  ]));
  const company = cleanParsedValue(findLabeledValue(lines, ["현재 회사", "최근 회사", "현재/최근 회사", "회사", "근무처", "Company"]) || career[0]?.company);
  return {
    name,
    company,
    role: role || career[0]?.position || "",
    birthYear: extractBirthYear(compact, lines),
    email: extractEmail(compact),
    phone: extractPhone(compact),
    linkedinUrl: extractLinkedinUrl(compact),
    referenceUrl: extractReferenceUrl(compact),
    skills,
    summary: "",
    education: education.length ? education : [{}],
    career: career.length ? career : [{}]
  };
}

function normalizeParsedDate(value) {
  const text = String(value || "").trim();

  if (!text || text === "0") {
    return "";
  }

  if (/현재|재직|present|current/i.test(text)) {
    return "현재";
  }

  const monthMatch = text.match(/(\d{4})[.\-/년\s]+(\d{1,2})/);

  if (monthMatch) {
    return `${monthMatch[1]}-${monthMatch[2].padStart(2, "0")}`;
  }

  const yearMatch = text.match(/\b(\d{4})\b/);
  return yearMatch ? yearMatch[1] : "";
}

function recentRecordSortValue(record) {
  const end = normalizeParsedDate(record.end);
  const start = normalizeParsedDate(record.start);
  const value = end === "현재" ? "9999-12" : end || start || "";

  if (!value) {
    return "0000-00";
  }

  return value.length === 4 ? `${value}-00` : value;
}

function normalizeParsedResumeForForm(parsed = {}) {
  const career = Array.isArray(parsed.career)
    ? parsed.career
      .map((item) => ({
        country: cleanParsedValue(item.country),
        company: cleanParsedValue(item.company),
        rank: cleanParsedValue(item.rank),
        position: cleanParsedValue(item.position),
        start: normalizeParsedDate(item.start),
        end: normalizeParsedDate(item.end),
        achievements: String(item.achievements || "")
          .split(/\n+/)
          .map((line) => cleanParsedValue(line))
          .filter(Boolean)
          .join("\n")
      }))
      .filter(hasAnyRecordValue)
      .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)))
    : [];
  const education = Array.isArray(parsed.education)
    ? parsed.education
      .map((item) => ({
        degree: ["박사", "석사", "학사"].includes(cleanParsedValue(item.degree)) ? cleanParsedValue(item.degree) : "",
        school: cleanParsedValue(item.school),
        major: cleanParsedValue(item.major),
        start: normalizeParsedDate(item.start),
        end: normalizeParsedDate(item.end)
      }))
      .filter(hasAnyRecordValue)
      .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)))
    : [];
  const skills = Array.isArray(parsed.skills)
    ? parsed.skills.map(cleanParsedValue).filter(Boolean)
    : String(parsed.skills || "")
      .split(/[,;\n]/)
      .map(cleanParsedValue)
      .filter(Boolean);

  return {
    name: cleanParsedValue(parsed.name),
    company: cleanParsedValue(parsed.company || career[0]?.company),
    role: cleanParsedValue(parsed.role || career[0]?.position),
    birthYear: cleanParsedValue(parsed.birthYear).match(/\b(19\d{2}|20\d{2})\b/)?.[1] || "",
    email: extractEmail(String(parsed.email || "")),
    phone: cleanParsedValue(parsed.phone),
    linkedinUrl: cleanParsedValue(parsed.linkedinUrl),
    referenceUrl: cleanParsedValue(parsed.referenceUrl),
    skills: [...new Set(skills)].slice(0, 12),
    summary: "",
    education: education.length ? education : [{}],
    career: career.length ? career : [{}],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.map(cleanParsedValue).filter(Boolean) : []
  };
}

async function parseResumeWithServer(text, fileName, deterministic) {
  const response = await fetch("/api/parse-resume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      fileName,
      deterministic
    })
  });

  if (!response.ok) {
    throw new Error(`Resume parser API failed: ${response.status}`);
  }

  const payload = await response.json();

  if (!payload.ok || !payload.parsed) {
    throw new Error(payload.error || "Resume parser API did not return structured data.");
  }

  return {
    parsed: normalizeParsedResumeForForm(payload.parsed),
    source: payload.source || "server",
    warning: payload.warning || ""
  };
}

function hasParsedResumeValues(parsed) {
  return Boolean(
    parsed?.name ||
    parsed?.company ||
    parsed?.role ||
    parsed?.birthYear ||
    parsed?.email ||
    parsed?.phone ||
    parsed?.linkedinUrl ||
    parsed?.referenceUrl ||
    parsed?.skills?.length ||
    parsed?.education?.some(hasAnyRecordValue) ||
    parsed?.career?.some(hasAnyRecordValue)
  );
}

function registerFormHasEnteredValues() {
  const fields = [
    "#candidate-name",
    "#candidate-company",
    "#candidate-role",
    "#candidate-organization",
    "#candidate-owner",
    "#candidate-birth-year",
    "#candidate-email",
    "#candidate-phone",
    "#candidate-linkedin",
    "#candidate-reference-url",
    "#candidate-skills",
    "#candidate-summary"
  ];
  const hasBasicValue = fields.some((selector) => $(selector)?.value?.trim());
  const hasEducationValue = collectRegisterEducationFromForm($("#register-form"), true).some(hasAnyRecordValue);
  const hasCareerValue = collectRegisterCareerFromForm($("#register-form"), true).some(hasAnyRecordValue);

  return hasBasicValue || hasEducationValue || hasCareerValue;
}

function setFieldValue(selector, value, overwrite = true) {
  const field = $(selector);

  if (field && value && (overwrite || !field.value.trim())) {
    field.value = value;
  }
}

function updateAgeOutput(inputSelector, outputSelector) {
  const input = $(inputSelector);
  const output = $(outputSelector);

  if (input && output) {
    const age = calculateAge(input.value);
    output.value = age ? `${age}세` : "";
  }
}

function applyParsedResumeToRegisterForm(parsed, options = {}) {
  const overwrite = options.overwrite !== false;
  const education = (parsed.education || []).filter(hasAnyRecordValue);
  const career = (parsed.career || []).filter(hasAnyRecordValue);
  const currentEducationIsBlank = !collectRegisterEducationFromForm($("#register-form"), true).some(hasAnyRecordValue);
  const currentCareerIsBlank = !collectRegisterCareerFromForm($("#register-form"), true).some(hasAnyRecordValue);

  setFieldValue("#candidate-name", parsed.name, overwrite);
  setFieldValue("#candidate-company", parsed.company, overwrite);
  setFieldValue("#candidate-role", parsed.role, overwrite);
  setFieldValue("#candidate-birth-year", parsed.birthYear, overwrite);
  setFieldValue("#candidate-email", parsed.email, overwrite);
  setFieldValue("#candidate-phone", parsed.phone, overwrite);
  setFieldValue("#candidate-linkedin", parsed.linkedinUrl, overwrite);
  setFieldValue("#candidate-reference-url", parsed.referenceUrl, overwrite);
  setFieldValue("#candidate-skills", parsed.skills.join(", "), overwrite);
  updateAgeOutput("#candidate-birth-year", "#candidate-age");

  if (education.length && (overwrite || currentEducationIsBlank)) {
    setRegisterEducationRecords(education);
  }

  if (career.length && (overwrite || currentCareerIsBlank)) {
    setRegisterCareerRecords(career);
  }
}

async function applyResumeProfilePhotoToRegisterForm(file, status) {
  const manualPhotoSelected = Boolean($("#profile-photo")?.files?.length);

  if (manualPhotoSelected) {
    return false;
  }

  try {
    if (status) {
      status.textContent = `${status.textContent} 프로필 사진 후보를 확인하는 중입니다.`;
    }

    const extracted = await extractProfilePhotoFromResume(file);

    if (!extracted?.dataUrl || $("#profile-photo")?.files?.length) {
      return false;
    }

    state.registerExtractedPhotoUrl = extracted.dataUrl;
    const preview = $("#photo-preview");

    if (preview) {
      preview.innerHTML = `<img src="${escapeHtml(extracted.dataUrl)}" alt="이력서에서 추출한 프로필 사진 미리보기" />`;
    }

    if (status) {
      status.textContent = `${status.textContent} 이력서 내 사진을 프로필 사진으로 반영했습니다.`;
    }

    showToast("이력서 사진을 프로필 사진으로 자동 반영했습니다.");
    return true;
  } catch (error) {
    console.warn("Resume profile photo extraction failed.", error);
    return false;
  }
}

async function parseResumeIntoRegisterForm(file) {
  const status = $("#resume-parse-status");

  if (status) {
    status.textContent = "이력서를 읽고 구조화하는 중입니다.";
  }

  try {
    const result = await readResumeText(file);

    if (!result.text || result.text.length < 20) {
      if (status) {
        status.textContent = "읽을 수 있는 텍스트가 부족합니다. 스캔 PDF는 수동 입력해주세요.";
      }
      showToast("이력서 텍스트를 충분히 읽지 못했습니다.");
      return;
    }

    const deterministicParsed = normalizeParsedResumeForForm(parseResumeText(result.text, file.name));
    let parsed = deterministicParsed;
    let parserSource = "브라우저 기본 파서";

    try {
      if (status) {
        status.textContent = "이력서 내용을 구조화하고 회사 소재국가를 보강하는 중입니다.";
      }

      const serverResult = await parseResumeWithServer(result.text, file.name, deterministicParsed);
      parsed = serverResult.parsed;
      parserSource = serverResult.source === "openai-web" ? "AI 구조화 및 회사 소재국가 보강" : "AI 구조화";
    } catch (serverError) {
      console.warn("Structured resume parser failed. Falling back to browser parser.", serverError);
      parserSource = "브라우저 기본 파서";
    }

    if (!hasParsedResumeValues(parsed)) {
      if (status) {
        status.textContent = "이력서는 읽었지만 등록 필드에 매핑할 수 있는 값이 부족합니다. 내용을 확인해 수동 입력해주세요.";
      }
      showToast("매핑 가능한 이력서 정보를 찾지 못했습니다.");
      return;
    }

    const overwrite = registerFormHasEnteredValues()
      ? window.confirm("현재 입력값을 이력서에서 읽은 정보로 덮어쓸까요?")
      : true;

    applyParsedResumeToRegisterForm(parsed, { overwrite });
    const profilePhotoApplied = await applyResumeProfilePhotoToRegisterForm(file, status);

    if (status) {
      const quality = result.meta?.textQuality ? ` 텍스트 품질 ${Math.round(result.meta.textQuality)}점.` : "";
      const photoMessage = profilePhotoApplied ? " 프로필 사진도 자동 반영했습니다." : "";
      status.textContent = `${parserSource} 결과를 입력했습니다.${quality}${photoMessage} 실제 이력서와 비교 후 등록해주세요.`;
    }

    showToast("이력서 정보를 입력란에 자동 반영했습니다.");
  } catch (error) {
    console.warn("Resume parsing failed.", error);

    if (status) {
      status.textContent = error.isResumeParseError
        ? error.message
        : "이력서 파일을 읽지 못했습니다. 파일 형식을 확인해주세요.";
    }

    showToast(error.isResumeParseError ? "이력서 텍스트 추출이 중단되었습니다." : "이력서 파일을 읽지 못했습니다.");
  }
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
  const company = form.get("company").toString().trim();
  const role = form.get("role").toString().trim();
  const organization = form.get("organization").toString().trim();
  const birthYear = form.get("birthYear").toString().trim();
  const today = getTodayDate();

  if (!name || !company || !role) {
    showToast("이름, 현재/최근 회사, 직무를 입력해주세요.");
    return;
  }

  const education = collectRegisterEducationFromForm(formElement);
  const career = collectRegisterCareerFromForm(formElement);
  const skills = form
    .get("skills")
    .toString()
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const photoFile = form.get("photo");
  const resumeFile = form.get("resume");
  let photoUrl = state.registerExtractedPhotoUrl || "";
  let resumeAttachment = null;

  if (photoFile && photoFile.size) {
    try {
      photoUrl = await readFileAsDataUrl(photoFile);
    } catch (error) {
      console.warn("Profile photo could not be read.", error);
      showToast("사진 파일을 읽지 못했습니다. 다른 파일을 선택해주세요.");
      return;
    }
  }

  if (resumeFile && resumeFile.size) {
    try {
      resumeAttachment = {
        name: resumeFile.name,
        type: resumeFile.type || "application/octet-stream",
        size: resumeFile.size,
        uploadedAt: new Date().toISOString().slice(0, 10),
        dataUrl: await readFileAsDataUrl(resumeFile)
      };
    } catch (error) {
      console.warn("Resume attachment could not be read.", error);
      showToast("이력서 첨부 파일을 저장하지 못했습니다. 다른 파일을 선택해주세요.");
      return;
    }
  }

  const candidate = {
    id: `cand-${Date.now()}`,
    name,
    initials: `${name.slice(0, 1)}${name.slice(-1)}`,
    role,
    company,
    years: estimateCareerYears(career),
    jobFamily: "Equipment Software",
    organization: organization || "미입력",
    status: "interested",
    owner: form.get("owner").toString(),
    createdAt: today,
    updatedAt: today,
    lastContactedAt: "-",
    location: "미확인",
    source: "직접 등록",
    dataQuality: 86,
    parsingConfidence: 88,
    avatarColor: "#4e5968",
    photoUrl,
    resumeAttachment,
    birthYear,
    age: calculateAge(birthYear),
    email: form.get("email").toString().trim(),
    phone: form.get("phone").toString().trim(),
    linkedinUrl: form.get("linkedinUrl").toString().trim(),
    referenceUrl: form.get("referenceUrl").toString().trim(),
    education,
    career,
    skills,
    tags: ["신규 등록", "검수 필요"],
    summary: form.get("summary").toString().trim(),
    evidence: [
      "업로드 이력서에서 후보자 정보를 자동 입력",
      "주요 역량/성과 태그 자동 생성",
      "담당자 검수 대기 상태"
    ],
    applications: [],
    timeline: [
      { type: "등록", text: "후보자 신규 등록", actor: form.get("owner").toString(), date: today },
      { type: "AI 요약", text: "이력서 파싱 결과 생성", actor: "AI Worker", date: today }
    ]
  };

  state.candidates.unshift(candidate);
  state.selectedCandidateId = candidate.id;
  state.registerExtractedPhotoUrl = "";
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
  state.poolFilters.owner = $("#pool-owner")?.value || "all";
  persistState();
  renderPoolTable();
}

function changeCandidateStatus(status) {
  const candidate = getCandidate();
  const previous = candidate.status;
  const today = getTodayDate();
  candidate.status = status;
  candidate.updatedAt = today;
  candidate.timeline.unshift({
    type: "상태 변경",
    text: `${STATUS_LABELS[previous]}에서 ${STATUS_LABELS[status]}으로 변경`,
    actor: candidate.owner,
    date: today
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

async function executeAiSearchWithQuery(query, options = {}) {
  state.aiQuery = query.trim();

  if (!state.aiQuery) {
    state.aiResults = [];
    state.aiSearchLoading = false;
    renderAiSearch();
    showToast("검색 조건을 자연어로 입력해주세요.");
    return;
  }

  state.aiSearchLoading = true;
  state.aiResults = runLocalAiSearch(state.aiQuery);
  renderAiSearch();

  try {
    state.aiResults = await runAiSearch(state.aiQuery);
    state.auditLogs.unshift({
      actor: "이지원",
      action: options.fileName ? "AI 파일 검색" : "AI 검색",
      resource: options.fileName || state.aiQuery.slice(0, 32),
      purpose: "후보자 Shortlist 탐색",
      time: "2026-06-04 09:35"
    });
    persistState();
    showToast(options.fileName ? "직무기술서 기반 AI 검색 결과가 갱신되었습니다." : "AI 검색 결과가 갱신되었습니다.");
  } catch (error) {
    console.warn("AI search execution failed.", error);
    showToast("AI 검색 중 오류가 발생해 로컬 검색 결과를 표시합니다.");
  } finally {
    state.aiSearchLoading = false;
    renderAiSearch();
  }
}

async function executeAiSearch() {
  state.aiSearchFileName = "";
  await executeAiSearchWithQuery($("#ai-query")?.value.trim() || "");
}

async function handleAiSearchFileUpload(file) {
  const status = $("#ai-file-status");

  if (!file) {
    return;
  }

  state.aiSearchFileName = file.name;
  state.aiSearchLoading = true;
  state.aiResults = [];

  if (status) {
    status.textContent = "직무기술서 파일을 읽고 검색 조건을 구성하는 중입니다.";
  }

  renderAiSearch();

  try {
    const result = await readResumeText(file);

    if (!result.text || result.text.length < 20) {
      state.aiSearchLoading = false;
      renderAiSearch();
      showToast("파일에서 읽을 수 있는 직무기술서 텍스트가 부족합니다.");
      return;
    }

    await executeAiSearchWithQuery(buildAiQueryFromUploadedFile(result.text, file.name), { fileName: file.name });
  } catch (error) {
    console.warn("AI search file could not be read.", error);
    state.aiSearchLoading = false;
    renderAiSearch();
    showToast(error.isResumeParseError ? error.message : "직무기술서 파일을 읽지 못했습니다.");
  }
}

function setAuthMessage(message) {
  state.authMessage = message;
  render();
}

function handleLoginSubmit(form) {
  const formData = new FormData(form);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const member = state.members.find((item) => item.email === email);

  if (!member || member.password !== password) {
    setAuthMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
    return;
  }

  if (member.status !== "active") {
    setAuthMessage(`${getMemberStatusLabel(member.status)} 상태입니다. 관리자 승인 또는 상태 변경 후 접속할 수 있습니다.`);
    return;
  }

  member.lastLoginAt = getTimestampText();
  state.currentUserId = member.id;
  state.authMessage = "";
  state.view = canAccessView(state.view, member) ? state.view : getDefaultView(member);
  addAuditLog("로그인", member.name, "시스템 접속", member.name);
  persistState();
  render();
  showToast(`${member.name}님, 로그인되었습니다.`);
}

function handleSignupSubmit(form) {
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");
  const requestedRole = String(formData.get("role") || "associate");

  if (!name || !email || !password) {
    setAuthMessage("이름, 이메일, 비밀번호를 입력해주세요.");
    return;
  }

  if (state.members.some((member) => member.email === email)) {
    setAuthMessage("이미 등록되었거나 승인 대기 중인 이메일입니다.");
    return;
  }

  if (password.length < 8) {
    setAuthMessage("비밀번호는 8자 이상으로 입력해주세요.");
    return;
  }

  if (password !== passwordConfirm) {
    setAuthMessage("비밀번호 확인이 일치하지 않습니다.");
    return;
  }

  const member = normalizeMember({
    id: createId("member"),
    name,
    email,
    password,
    role: requestedRole === "admin" ? "associate" : requestedRole,
    status: "pending",
    department: formData.get("department"),
    position: formData.get("position"),
    phone: formData.get("phone"),
    requestedAt: getTodayDate(),
    note: formData.get("note")
  });

  state.members.unshift(member);
  state.authView = "login";
  state.authMessage = "가입 신청이 접수되었습니다. 관리자가 승인하면 로그인할 수 있습니다.";
  addAuditLog("회원가입 신청", member.name, `${getRoleLabel(member.role)} 권한 요청`, "가입 신청자");
  persistState();
  render();
}

function logout() {
  const member = getCurrentMember();
  if (member) {
    addAuditLog("로그아웃", member.name, "시스템 접속 종료", member.name);
  }

  state.currentUserId = "";
  state.authMessage = "";
  persistState();
  render();
}

function updateMemberFilters() {
  state.memberFilters.query = $("#member-query")?.value || "";
  state.memberFilters.role = $("#member-role-filter")?.value || "all";
  state.memberFilters.status = $("#member-status-filter")?.value || "all";
  persistState();
  renderMemberTable();
}

function findMember(memberId) {
  return state.members.find((member) => member.id === memberId);
}

function approveMember(memberId) {
  const member = findMember(memberId);

  if (!member || !isAdmin()) {
    return;
  }

  member.status = "active";
  member.approvedAt = getTodayDate();
  member.approvedBy = getCurrentActorName();
  addAuditLog("회원 승인", member.name, `${getRoleLabel(member.role)} 등급 활성화`);
  persistState();
  render();
  showToast(`${member.name} 회원을 승인했습니다.`);
}

function rejectMember(memberId) {
  const member = findMember(memberId);

  if (!member || !isAdmin()) {
    return;
  }

  member.status = "rejected";
  addAuditLog("회원 반려", member.name, "가입 신청 반려");
  persistState();
  render();
  showToast(`${member.name} 회원 신청을 반려했습니다.`);
}

function suspendMember(memberId) {
  const member = findMember(memberId);

  if (!member || !isAdmin() || member.id === state.currentUserId) {
    return;
  }

  member.status = "suspended";
  addAuditLog("회원 정지", member.name, "시스템 접속 차단");
  persistState();
  render();
  showToast(`${member.name} 회원을 정지했습니다.`);
}

function activateMember(memberId) {
  const member = findMember(memberId);

  if (!member || !isAdmin()) {
    return;
  }

  member.status = "active";
  member.approvedAt = member.approvedAt || getTodayDate();
  member.approvedBy = member.approvedBy || getCurrentActorName();
  addAuditLog("회원 재활성", member.name, "시스템 접속 재허용");
  persistState();
  render();
  showToast(`${member.name} 회원을 재활성화했습니다.`);
}

function resetMemberPassword(memberId) {
  const member = findMember(memberId);

  if (!member || !isAdmin()) {
    return;
  }

  member.password = "Temp1234!";
  addAuditLog("회원 비밀번호 초기화", member.name, "임시 비밀번호 발급");
  persistState();
  renderMembers();
  showToast(`${member.name} 회원의 임시 비밀번호는 Temp1234! 입니다.`);
}

function updateMemberRole(memberId, role) {
  const member = findMember(memberId);

  if (!member || !isAdmin() || member.id === state.currentUserId || !MEMBER_ROLES[role]) {
    return;
  }

  member.role = role;
  addAuditLog("회원 등급 변경", member.name, getRoleLabel(role));
  persistState();
  render();
  showToast(`${member.name} 회원 등급을 ${getRoleLabel(role)}으로 변경했습니다.`);
}

function updateRolePermission(role, view, enabled) {
  if (!isAdmin() || role === "admin" || view === "dashboard" || view === "members") {
    renderMembers();
    return;
  }

  const permissions = new Set(getAllowedViewsForRole(role));

  if (enabled) {
    permissions.add(view);
  } else {
    permissions.delete(view);
  }

  permissions.add("dashboard");
  state.rolePermissions[role] = MENU_CONFIG
    .map((item) => item.view)
    .filter((menuView) => permissions.has(menuView));

  addAuditLog("등급 메뉴 권한 변경", getRoleLabel(role), `${MENU_CONFIG.find((item) => item.view === view)?.label || view} ${enabled ? "허용" : "차단"}`);
  persistState();
  render();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const authViewButton = event.target.closest("[data-auth-view]");
    if (authViewButton) {
      state.authView = authViewButton.dataset.authView;
      state.authMessage = "";
      render();
      return;
    }

    if (event.target.closest("#logout-button")) {
      logout();
      return;
    }

    const approveMemberButton = event.target.closest("[data-approve-member]");
    if (approveMemberButton) {
      approveMember(approveMemberButton.dataset.approveMember);
      return;
    }

    const rejectMemberButton = event.target.closest("[data-reject-member]");
    if (rejectMemberButton) {
      rejectMember(rejectMemberButton.dataset.rejectMember);
      return;
    }

    const suspendMemberButton = event.target.closest("[data-suspend-member]");
    if (suspendMemberButton) {
      suspendMember(suspendMemberButton.dataset.suspendMember);
      return;
    }

    const activateMemberButton = event.target.closest("[data-activate-member]");
    if (activateMemberButton) {
      activateMember(activateMemberButton.dataset.activateMember);
      return;
    }

    const resetMemberPasswordButton = event.target.closest("[data-reset-member-password]");
    if (resetMemberPasswordButton) {
      resetMemberPassword(resetMemberPasswordButton.dataset.resetMemberPassword);
      return;
    }

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

    const addRegisterEducationButton = event.target.closest("[data-add-register-education]");
    if (addRegisterEducationButton) {
      addRegisterEducationRecord();
      return;
    }

    const addRegisterCareerButton = event.target.closest("[data-add-register-career]");
    if (addRegisterCareerButton) {
      addRegisterCareerRecord();
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

    const removeRegisterEducationButton = event.target.closest("[data-remove-register-education]");
    if (removeRegisterEducationButton) {
      removeRegisterEducationRecord(Number(removeRegisterEducationButton.dataset.removeRegisterEducation));
      return;
    }

    const removeRegisterCareerButton = event.target.closest("[data-remove-register-career]");
    if (removeRegisterCareerButton) {
      removeRegisterCareerRecord(Number(removeRegisterCareerButton.dataset.removeRegisterCareer));
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
    if (event.target.matches("#login-form")) {
      event.preventDefault();
      handleLoginSubmit(event.target);
      return;
    }

    if (event.target.matches("#signup-form")) {
      event.preventDefault();
      handleSignupSubmit(event.target);
      return;
    }

    if (event.target.matches("#register-form")) {
      registerCandidate(event);
    }

    if (event.target.matches("#candidate-edit-form")) {
      event.preventDefault();
      saveCandidateEdits(event.target);
    }
  });

  document.addEventListener("reset", (event) => {
    if (event.target.matches("#register-form")) {
      window.setTimeout(() => {
        setRegisterEducationRecords([{}]);
        setRegisterCareerRecords([{}]);
        state.registerExtractedPhotoUrl = "";
        const status = $("#resume-parse-status");
        const preview = $("#photo-preview");

        if (status) {
          status.textContent = "이력서를 업로드하면 읽을 수 있는 정보만 아래 입력란에 자동 입력됩니다.";
        }

        if (preview) {
          preview.textContent = "사진 미리보기";
        }
      });
    }
  });

  document.addEventListener("input", (event) => {
    if (["pool-query", "pool-status", "pool-owner"].includes(event.target.id)) {
      updatePoolFilters();
    }

    if (["member-query", "member-role-filter", "member-status-filter"].includes(event.target.id)) {
      updateMemberFilters();
    }

    if (event.target.id === "global-search") {
      state.poolFilters.query = event.target.value;
      persistState();
      if (state.view !== "pool") {
        setView("pool");
      } else {
        const poolQuery = $("#pool-query");
        if (poolQuery) {
          poolQuery.value = state.poolFilters.query;
        }
        renderPoolTable();
      }
    }

    if (event.target.id === "candidate-birth-year") {
      updateAgeOutput("#candidate-birth-year", "#candidate-age");
    }

    if (event.target.id === "edit-birth-year") {
      updateAgeOutput("#edit-birth-year", "#edit-age");
    }
  });

  document.addEventListener("change", (event) => {
    if (["pool-status", "pool-owner"].includes(event.target.id)) {
      updatePoolFilters();
    }

    if (["member-role-filter", "member-status-filter"].includes(event.target.id)) {
      updateMemberFilters();
    }

    const memberRoleSelect = event.target.closest("[data-member-role]");
    if (memberRoleSelect) {
      updateMemberRole(memberRoleSelect.dataset.memberRole, memberRoleSelect.value);
    }

    const rolePermissionToggle = event.target.closest("[data-role-permission-role]");
    if (rolePermissionToggle) {
      updateRolePermission(
        rolePermissionToggle.dataset.rolePermissionRole,
        rolePermissionToggle.dataset.rolePermissionView,
        rolePermissionToggle.checked
      );
    }

    if (event.target.id === "profile-photo") {
      const preview = $("#photo-preview");
      const file = event.target.files?.[0];

      if (preview && file) {
        state.registerExtractedPhotoUrl = "";
        preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="업로드한 얼굴 프로필 사진 미리보기" />`;
      }
    }

    if (event.target.id === "resume-file") {
      const file = event.target.files?.[0];

      if (file) {
        parseResumeIntoRegisterForm(file);
      }
    }

    if (event.target.id === "ai-search-file") {
      const file = event.target.files?.[0];

      if (file) {
        handleAiSearchFileUpload(file);
      }
    }

    if (event.target.id === "edit-photo") {
      const preview = $("#edit-photo-preview");
      const file = event.target.files?.[0];

      if (preview && file) {
        preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="업로드한 얼굴 프로필 사진 미리보기" />`;
      }
    }

    if (event.target.name?.startsWith("career-current-") || event.target.name?.startsWith("register-career-current-")) {
      updateCareerCurrentControl(event.target);
    }
  });

  document.addEventListener("click", async (event) => {
    if (event.target.id === "run-ai-search") {
      await executeAiSearch();
    }
  });
}

restorePersistedState();
ensureMemberDefaults();
bindEvents();
render();
loadStateFromSupabase();
