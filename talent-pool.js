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
  { view: "dashboard", label: "Dashboard", description: "운영 현황과 KPI 조회" },
  { view: "pool", label: "Talent Pool", description: "후보자 목록과 상세 프로필 조회" },
  { view: "screening", label: "Screening", description: "포지션별 지원자 스크리닝과 전화면접 안내" },
  { view: "ai-search", label: "AI Search", description: "자연어/JD 기반 후보자 검색" },
  { view: "policy-chat", label: "채용 AI 챗봇", description: "채용 기준 문서 기반 질의응답" },
  { view: "trending", label: "Today's Talent", description: "전일 한국 뉴스 기반 DX 분야 화제 인물 확인" },
  { view: "members", label: "Management", description: "회원 승인, 등급, 메뉴 권한, Log 관리" }
];

const MEMBER_ROLES = {
  general: "일반회원",
  search_firm: "서치펌 담당자",
  hiring_manager: "현업 담당자",
  business_recruiter: "사업부 채용 담당자",
  division_recruiter: "부문 채용 담당자",
  admin: "관리자"
};

const MEMBER_ROLE_ORDER = ["general", "search_firm", "hiring_manager", "business_recruiter", "division_recruiter", "admin"];
const SIGNUP_ROLE_ORDER = MEMBER_ROLE_ORDER.filter((role) => role !== "admin");
const LEGACY_MEMBER_ROLE_MAP = {
  associate: "general",
  regular: "business_recruiter",
  operator: "division_recruiter"
};

const MEMBER_STATUSES = {
  pending: "승인 대기",
  active: "활성",
  suspended: "정지",
  rejected: "반려"
};

const MEMBER_STATUS_ORDER = ["pending", "active", "suspended", "rejected"];
const CANDIDATE_REGISTER_ROLES = new Set(["search_firm", "business_recruiter", "division_recruiter", "admin"]);

const DEFAULT_ROLE_PERMISSIONS = {
  general: ["dashboard", "pool", "policy-chat", "trending"],
  search_firm: ["dashboard", "pool", "screening", "ai-search", "policy-chat"],
  hiring_manager: ["dashboard", "pool", "screening", "ai-search", "policy-chat", "trending"],
  business_recruiter: ["dashboard", "pool", "screening", "ai-search", "policy-chat", "trending"],
  division_recruiter: ["dashboard", "pool", "screening", "ai-search", "policy-chat", "trending"],
  admin: MENU_CONFIG.map((item) => item.view)
};

const TEMP_PASSWORD = "Temp1234!";
const DEFAULT_TRENDING_MAIL_SETTINGS = {
  enabled: false,
  sendTime: "07:30",
  timezone: "Asia/Seoul",
  recipients: [],
  subjectPrefix: "[TalentHub] Today's Talent",
  lastSentReportDate: "",
  lastSentAt: "",
  providerConfigured: false,
  updatedAt: "",
  updatedBy: ""
};
const LEGACY_TRENDING_MAIL_SUBJECT_PREFIX = "[TalentHub] 오늘의 화제 인물";
const TRENDING_PROFILE_COMPLETENESS_VERSION = 5;
const BUSINESS_UNITS = ["VD", "MX", "DA", "NW", "CDO", "SR", "한총", "G.CS", "전사직속"];
const CANDIDATE_VISIBILITY_LABELS = {
  all: "전체 공개",
  business_unit: "사업부 공개"
};
const CANDIDATE_VISIBILITY_ORDER = ["all", "business_unit"];
const POLICY_CHAT_MAX_CONTEXTS = 4;
const POLICY_CHAT_MAX_MESSAGES = 20;
const POLICY_CHAT_MAX_CONTEXT_CHARS = 1800;
const VISIT_STATS_KEY = "samsung-talent-pool-visit-stats-v1";
const VISIT_SESSION_KEY = "samsung-talent-pool-visit-counted";
const SCREENING_STAGE_LABELS = {
  reception: "지원자 접수",
  registered: "1차 대상",
  first_pass: "1차 합격",
  first_reject: "1차 불합격",
  second_draft: "2차 통과 예정",
  second_pass: "2차 통과",
  second_reject: "2차 제외",
  contact_requested: "연락처 요청",
  contact_ready: "연락처 확인",
  interview_mail_sent: "전화면접 안내 발송"
};
const SCREENING_STAGE_ORDER = [
  "reception",
  "registered",
  "first_pass",
  "first_reject",
  "second_draft",
  "second_pass",
  "second_reject",
  "contact_requested",
  "contact_ready",
  "interview_mail_sent"
];
const FIT_GRADE_ORDER = ["A", "B", "C", "D", "E"];
const SCREENING_DETAIL_STEPS = [
  { id: "reception", label: "지원자 접수" },
  { id: "first", label: "1차 스크리닝" },
  { id: "second", label: "2차 스크리닝" },
  { id: "mail", label: "전화면접 안내" }
];

const DEFAULT_MEMBERS = [
  {
    id: "member-admin",
    name: "시스템 관리자",
    email: "admin@samsung.com",
    password: "",
    passwordHash: "5842a8aa177243bfa34305cfaceb69a124ad6ccee62ebd4bd149be39871eb160",
    role: "admin",
    status: "active",
    businessUnit: "전사직속",
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

const DEFAULT_SCREENING_FOLDERS = [
  {
    id: "screening-folder-001",
    title: "MX 온디바이스 AI PM",
    businessUnit: "MX",
    department: "MX AI Product팀",
    positionName: "On-device AI Product Manager",
    jdText: "모바일 온디바이스 AI 기능 기획, 생성형 AI 서비스 로드맵 수립, 글로벌 개발 조직과 제품 출시를 리딩할 PM을 찾습니다.",
    jdAttachment: null,
    createdById: "member-admin",
    createdByName: "시스템 관리자",
    createdAt: "2026-06-05",
    updatedAt: "2026-06-05",
    accessMemberIds: ["member-admin"],
    interviewPanel: {
      names: "",
      emails: "",
      availability: "평일 10:00~12:00, 14:00~17:00"
    },
    applicants: [
      {
        id: "screening-applicant-001",
        name: "정민재",
        sourceType: "direct",
        searchFirmMemberId: "",
        registeredById: "member-admin",
        registeredByName: "시스템 관리자",
        company: "카카오",
        currentRole: "AI 서비스 PM",
        email: "minjae@example.com",
        phone: "010-0000-0000",
        summary: "모바일 AI 서비스 출시와 개인화 추천 기능 기획 경험. 생성형 AI 기반 기능 실험과 데이터 기반 개선 경험 보유.",
        resumeAttachment: null,
        fitGrade: "B",
        fitComment: "JD 핵심어와 AI 서비스, 모바일, 기능 기획 경험이 일부 일치합니다. 제품 출시 리딩 경험 확인이 필요합니다.",
        stage: "registered",
        firstScreening: null,
        secondScreening: null,
        contactRequest: null,
        phoneInterviewMail: null,
        createdAt: "2026-06-05",
        updatedAt: "2026-06-05"
      }
    ]
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
    organization: "SR",
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
    organization: "SR",
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
    organization: "CDO",
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
    organization: "G.CS",
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
    organization: "MX",
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
  memberProfileModalOpen: false,
  members: structuredClone(DEFAULT_MEMBERS),
  rolePermissions: structuredClone(DEFAULT_ROLE_PERMISSIONS),
  memberFilters: {
    query: "",
    role: "all",
    status: "all"
  },
  managementTab: "members",
  candidates: structuredClone(ENRICHED_CANDIDATES),
  selectedCandidateId: "cand-001",
  isEditingCandidate: false,
  editSnapshot: null,
  screeningFolders: structuredClone(DEFAULT_SCREENING_FOLDERS),
  selectedScreeningFolderId: "screening-folder-001",
  screeningPage: "list",
  screeningDetailStep: "reception",
  screeningFilters: {
    businessUnit: "all",
    mineOnly: false
  },
  screeningPositionModalOpen: false,
  screeningApplicantModalOpen: false,
  screeningJdModalOpen: false,
  screeningAccessModalOpen: false,
  screeningApplicantDetailId: "",
  poolReturnScrollY: 0,
  poolFilters: {
    query: "",
    status: "all",
    owner: "all"
  },
  dashboardFilters: {
    organization: "all"
  },
  aiQuery: "",
  aiResults: [],
  aiSearchLoading: false,
  aiSearchFileName: "",
  policySources: [],
  policyChatMessages: [],
  policyChatQuestion: "",
  policyChatLoading: false,
  policyChatSourceLoading: false,
  policyChatSourceError: "",
  policySourceModalOpen: false,
  policyEditingSourceId: "",
  policyChatSelectedCitationId: "",
  trendingReport: null,
  trendingHistory: [],
  trendingSelectedDate: "",
  trendingLoading: false,
  trendingHistoryLoading: false,
  trendingError: "",
  trendingModal: "",
  trendingMailSettings: structuredClone(DEFAULT_TRENDING_MAIL_SETTINGS),
  trendingMailLoading: false,
  trendingMailError: "",
  trendingMailStatus: "",
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
  dashboard: "Dashboard",
  pool: "Talent Pool",
  screening: "Screening",
  register: "Add Talent",
  "ai-search": "AI Search",
  "policy-chat": "채용 AI 챗봇",
  trending: "Today's Talent",
  detail: "상세 프로필",
  audit: "Log",
  members: "Management"
};

const $ = (selector) => document.querySelector(selector);

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
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

function renderBusinessUnitOptions(selectedValue = "") {
  const selected = String(selectedValue || "").trim();

  return `
    <option value="">사업부 선택</option>
    ${BUSINESS_UNITS.map((unit) => `<option value="${escapeHtml(unit)}" ${unit === selected ? "selected" : ""}>${escapeHtml(unit)}</option>`).join("")}
  `;
}

function renderScreeningBusinessUnitOptions(selectedValue = "", member = getCurrentMember()) {
  let selected = normalizeBusinessUnit(selectedValue);
  if (!selected && canViewBusinessUnitScreeningFolders(member)) {
    selected = getMemberBusinessUnit(member);
  }
  const units = canViewAllScreeningFolders(member)
    ? BUSINESS_UNITS
    : canViewBusinessUnitScreeningFolders(member)
      ? [getMemberBusinessUnit(member)].filter(Boolean)
      : BUSINESS_UNITS;
  const optionUnits = [...new Set([...units, selected].filter(Boolean))];

  return `
    ${selected ? "" : `<option value="">사업부 선택</option>`}
    ${optionUnits.map((unit) => `<option value="${escapeHtml(unit)}" ${unit === selected ? "selected" : ""}>${escapeHtml(unit)}</option>`).join("")}
  `;
}

function normalizeBusinessUnit(value) {
  const rawValue = String(value || "").trim();
  const compact = rawValue.replace(/\s+/g, "").toLowerCase();
  const aliasMap = new Map([
    ["vd", "VD"],
    ["visualdisplay", "VD"],
    ["영상디스플레이", "VD"],
    ["mx", "MX"],
    ["mobileexperience", "MX"],
    ["모바일", "MX"],
    ["da", "DA"],
    ["digitalappliances", "DA"],
    ["생활가전", "DA"],
    ["nw", "NW"],
    ["network", "NW"],
    ["네트워크", "NW"],
    ["cdo", "CDO"],
    ["sr", "SR"],
    ["samsungresearch", "SR"],
    ["삼성리서치", "SR"],
    ["한총", "한총"],
    ["한국총괄", "한총"],
    ["g.cs", "G.CS"],
    ["gcs", "G.CS"],
    ["globalcs", "G.CS"],
    ["전사직속", "전사직속"]
  ]);

  if (BUSINESS_UNITS.includes(rawValue)) {
    return rawValue;
  }

  return aliasMap.get(compact) || "";
}

function normalizeCandidateVisibility(value) {
  const rawValue = String(value || "").trim();
  const aliasMap = new Map([
    ["public", "all"],
    ["global", "all"],
    ["company", "all"],
    ["all", "all"],
    ["전체", "all"],
    ["전체 공개", "all"],
    ["business", "business_unit"],
    ["business_unit", "business_unit"],
    ["division", "business_unit"],
    ["organization", "business_unit"],
    ["org", "business_unit"],
    ["사업부", "business_unit"],
    ["사업부 공개", "business_unit"]
  ]);

  return aliasMap.get(rawValue.toLowerCase()) || "all";
}

function getCandidateVisibilityLabel(value) {
  return CANDIDATE_VISIBILITY_LABELS[normalizeCandidateVisibility(value)] || CANDIDATE_VISIBILITY_LABELS.all;
}

function renderCandidateVisibilityOptions(selectedValue = "all") {
  const selected = normalizeCandidateVisibility(selectedValue);

  return CANDIDATE_VISIBILITY_ORDER.map((visibility) => `
    <option value="${escapeHtml(visibility)}" ${visibility === selected ? "selected" : ""}>${escapeHtml(CANDIDATE_VISIBILITY_LABELS[visibility])}</option>
  `).join("");
}

function loadVisitStats() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(VISIT_STATS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Visit stats could not be loaded.", error);
    return {};
  }
}

function saveVisitStats(stats) {
  try {
    window.localStorage.setItem(VISIT_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn("Visit stats could not be saved.", error);
  }
}

function recordPageVisit() {
  try {
    const today = getTodayDate();
    const sessionKey = `${VISIT_SESSION_KEY}:${today}`;

    if (window.sessionStorage.getItem(sessionKey)) {
      return;
    }

    const stats = loadVisitStats();
    stats[today] = Number(stats[today] || 0) + 1;

    Object.keys(stats).forEach((date) => {
      if (date < dateDaysAgo(60)) {
        delete stats[date];
      }
    });

    saveVisitStats(stats);
    window.sessionStorage.setItem(sessionKey, "1");
  } catch (error) {
    console.warn("Visit could not be recorded.", error);
  }
}

function getVisitStatsSummary() {
  const stats = loadVisitStats();
  const today = getTodayDate();
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => dateDaysAgo(index));
  const previousSevenDays = Array.from({ length: 7 }, (_, index) => dateDaysAgo(index + 7));
  const weekTotal = lastSevenDays.reduce((sum, date) => sum + Number(stats[date] || 0), 0);
  const previousWeekTotal = previousSevenDays.reduce((sum, date) => sum + Number(stats[date] || 0), 0);

  return {
    today: Number(stats[today] || 0),
    weekTotal,
    weekDelta: weekTotal - previousWeekTotal
  };
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
    visibility: "all",
    ...candidate
  });

  normalized.organization = normalizeBusinessUnit(normalized.organization);
  normalized.visibility = normalizeCandidateVisibility(normalized.visibility || normalized.profileVisibility);
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
  const rawRole = String(member.role || "").trim();
  const role = MEMBER_ROLES[rawRole] ? rawRole : LEGACY_MEMBER_ROLE_MAP[rawRole] || "general";
  const status = MEMBER_STATUSES[member.status] ? member.status : "pending";

  return {
    id: member.id || createId("member"),
    name: String(member.name || "").trim(),
    email: String(member.email || "").trim().toLowerCase(),
    password: String(member.password || ""),
    passwordHash: String(member.passwordHash || member.password_hash || member.profile?.passwordHash || ""),
    role,
    status,
    businessUnit: normalizeBusinessUnit(member.businessUnit || member.business_unit || member.profile?.businessUnit),
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

function normalizeScreeningApplicant(applicant = {}) {
  const sourceType = applicant.sourceType === "search_firm" ? "search_firm" : "direct";
  const stage = SCREENING_STAGE_LABELS[applicant.stage] ? applicant.stage : "registered";
  const fitGrade = FIT_GRADE_ORDER.includes(applicant.fitGrade) ? applicant.fitGrade : "C";

  return {
    id: applicant.id || createId("screening-applicant"),
    name: String(applicant.name || "").trim(),
    sourceType,
    searchFirmMemberId: String(applicant.searchFirmMemberId || "").trim(),
    registeredById: String(applicant.registeredById || "").trim(),
    registeredByName: String(applicant.registeredByName || "").trim(),
    company: String(applicant.company || "").trim(),
    currentRole: String(applicant.currentRole || "").trim(),
    email: String(applicant.email || "").trim().toLowerCase(),
    phone: String(applicant.phone || "").trim(),
    summary: String(applicant.summary || "").trim(),
    resumeAttachment: applicant.resumeAttachment || null,
    fitGrade,
    fitComment: String(applicant.fitComment || "").trim(),
    stage,
    submittedAt: applicant.submittedAt || "",
    submittedById: String(applicant.submittedById || "").trim(),
    submittedByName: String(applicant.submittedByName || "").trim(),
    firstScreening: applicant.firstScreening || null,
    secondScreening: applicant.secondScreening || null,
    contactRequest: applicant.contactRequest || null,
    phoneInterviewMail: applicant.phoneInterviewMail || null,
    createdAt: applicant.createdAt || getTodayDate(),
    updatedAt: applicant.updatedAt || applicant.createdAt || getTodayDate()
  };
}

function normalizeIdList(value) {
  return Array.isArray(value)
    ? value.map((id) => String(id || "").trim()).filter(Boolean)
    : [];
}

function inferMemberIdsByRole(ids, roles) {
  try {
    return ids.filter((id) => roles.includes(state.members.find((member) => member.id === id)?.role));
  } catch (error) {
    return [];
  }
}

function normalizeScreeningFolder(folder = {}) {
  const accessMemberIds = normalizeIdList(folder.accessMemberIds);
  const hasReceptionMemberIds = Object.prototype.hasOwnProperty.call(folder, "receptionMemberIds") ||
    Object.prototype.hasOwnProperty.call(folder.stageAccess || {}, "receptionMemberIds") ||
    Object.prototype.hasOwnProperty.call(folder.stageAccess || {}, "reception");
  const hasSecondScreeningMemberIds = Object.prototype.hasOwnProperty.call(folder, "secondScreeningMemberIds") ||
    Object.prototype.hasOwnProperty.call(folder.stageAccess || {}, "secondScreeningMemberIds") ||
    Object.prototype.hasOwnProperty.call(folder.stageAccess || {}, "second");
  const rawReceptionMemberIds = normalizeIdList(folder.receptionMemberIds || folder.stageAccess?.receptionMemberIds || folder.stageAccess?.reception);
  const rawSecondScreeningMemberIds = normalizeIdList(folder.secondScreeningMemberIds || folder.stageAccess?.secondScreeningMemberIds || folder.stageAccess?.second);
  const receptionMemberIds = hasReceptionMemberIds
    ? rawReceptionMemberIds
    : inferMemberIdsByRole(accessMemberIds, ["search_firm"]);
  const secondScreeningMemberIds = hasSecondScreeningMemberIds
    ? rawSecondScreeningMemberIds
    : inferMemberIdsByRole(accessMemberIds, ["hiring_manager"]);
  const createdById = String(folder.createdById || "").trim();

  if (createdById && !accessMemberIds.includes(createdById)) {
    accessMemberIds.unshift(createdById);
  }

  return {
    id: folder.id || createId("screening-folder"),
    title: String(folder.title || folder.positionName || "신규 포지션").trim(),
    businessUnit: normalizeBusinessUnit(folder.businessUnit || folder.organization) || "",
    department: String(folder.department || "").trim(),
    positionName: String(folder.positionName || folder.title || "").trim(),
    jdText: String(folder.jdText || "").trim(),
    jdAttachment: folder.jdAttachment || null,
    createdById,
    createdByName: String(folder.createdByName || "").trim(),
    createdAt: folder.createdAt || getTodayDate(),
    updatedAt: folder.updatedAt || folder.createdAt || getTodayDate(),
    accessMemberIds,
    receptionMemberIds,
    secondScreeningMemberIds,
    interviewPanel: {
      names: String(folder.interviewPanel?.names || "").trim(),
      emails: String(folder.interviewPanel?.emails || "").trim(),
      availability: String(folder.interviewPanel?.availability || "").trim()
    },
    applicants: Array.isArray(folder.applicants)
      ? folder.applicants.map(normalizeScreeningApplicant)
      : []
  };
}

function normalizePolicyText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizePolicySource(source = {}) {
  const content = normalizePolicyText(source.content || source.text || source.body);
  const title = String(source.title || source.fileName || source.file_name || "").trim();
  const createdAt = source.createdAt || source.created_at || getTimestampText();

  return {
    id: source.id || createId("policy-source"),
    title: title || "채용 기준 문서",
    sourceType: source.sourceType || source.source_type || (source.fileName || source.file_name ? "file" : "manual"),
    fileName: String(source.fileName || source.file_name || "").trim(),
    fileType: String(source.fileType || source.file_type || "").trim(),
    size: Number(source.size || 0) || 0,
    content,
    createdAt,
    updatedAt: source.updatedAt || source.updated_at || createdAt,
    createdBy: String(source.createdBy || source.created_by || "").trim()
  };
}

function ensurePolicySourceDefaults() {
  state.policySources = state.policySources
    .map(normalizePolicySource)
    .filter((source) => source.content);

  state.policyChatMessages = (state.policyChatMessages || [])
    .filter((message) => message && ["user", "assistant"].includes(message.role))
    .slice(-POLICY_CHAT_MAX_MESSAGES);

  if (
    state.policyChatSelectedCitationId &&
    !findPolicyCitation(state.policyChatSelectedCitationId)
  ) {
    state.policyChatSelectedCitationId = "";
  }

  if (
    state.policyEditingSourceId &&
    !state.policySources.some((source) => source.id === state.policyEditingSourceId)
  ) {
    state.policyEditingSourceId = "";
  }
}

function ensureScreeningDefaults() {
  state.screeningFolders = state.screeningFolders.map(normalizeScreeningFolder);
  normalizeScreeningFilters();

  if (!state.screeningFolders.length) {
    state.screeningFolders = structuredClone(DEFAULT_SCREENING_FOLDERS).map(normalizeScreeningFolder);
  }

  const folders = getAccessibleScreeningFolders(getCurrentMember(), { applyFilters: false });
  if (!folders.some((folder) => folder.id === state.selectedScreeningFolderId)) {
    state.selectedScreeningFolderId = folders[0]?.id || state.screeningFolders[0]?.id || "";
  }
}

function normalizeEmailList(value) {
  const rawList = Array.isArray(value)
    ? value
    : String(value || "").split(/[\n,;]+/);

  return [...new Set(rawList
    .map((item) => String(item || "").trim().toLowerCase())
    .filter(Boolean))];
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function normalizeSendTime(value) {
  const match = String(value || "").trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return match ? `${match[1]}:${match[2]}` : DEFAULT_TRENDING_MAIL_SETTINGS.sendTime;
}

function normalizeTrendingMailSettings(settings = {}) {
  const recipients = normalizeEmailList(settings.recipients);
  const subjectPrefix = String(settings.subjectPrefix || settings.subject_prefix || DEFAULT_TRENDING_MAIL_SETTINGS.subjectPrefix).trim();

  return {
    ...structuredClone(DEFAULT_TRENDING_MAIL_SETTINGS),
    ...settings,
    enabled: Boolean(settings.enabled),
    sendTime: normalizeSendTime(settings.sendTime || settings.send_time),
    timezone: settings.timezone || "Asia/Seoul",
    recipients,
    subjectPrefix: subjectPrefix === LEGACY_TRENDING_MAIL_SUBJECT_PREFIX ? DEFAULT_TRENDING_MAIL_SETTINGS.subjectPrefix : subjectPrefix,
    lastSentReportDate: String(settings.lastSentReportDate || settings.last_sent_report_date || "").trim(),
    lastSentAt: String(settings.lastSentAt || settings.last_sent_at || "").trim(),
    providerConfigured: Boolean(settings.providerConfigured || settings.provider_configured),
    updatedAt: String(settings.updatedAt || settings.updated_at || "").trim(),
    updatedBy: String(settings.updatedBy || settings.updated_by || "").trim()
  };
}

function sanitizeMemberForStorage(member) {
  const normalized = normalizeMember(member);
  const { password, ...safeMember } = normalized;
  return safeMember;
}

function publicMemberProfile(member) {
  const safeMember = sanitizeMemberForStorage(member);
  const { passwordHash, ...profile } = safeMember;
  return profile;
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(email, password) {
  if (!window.crypto?.subtle) {
    throw new Error("Password hashing is not available in this browser.");
  }

  const input = new TextEncoder().encode(`${String(email || "").trim().toLowerCase()}:${password}`);
  return toHex(await window.crypto.subtle.digest("SHA-256", input));
}

async function ensureMemberPasswordHashes() {
  let changed = false;

  for (const member of state.members) {
    if (!member.passwordHash && member.password) {
      member.passwordHash = await hashPassword(member.email, member.password);
      member.password = "";
      changed = true;
    }
  }

  return changed;
}

function normalizeRolePermissions(permissions = {}) {
  const sourcePermissions = { ...permissions };
  const normalized = structuredClone(DEFAULT_ROLE_PERMISSIONS);

  Object.entries(LEGACY_MEMBER_ROLE_MAP).forEach(([legacyRole, currentRole]) => {
    if (Array.isArray(sourcePermissions[legacyRole]) && !Array.isArray(sourcePermissions[currentRole])) {
      sourcePermissions[currentRole] = sourcePermissions[legacyRole];
    }
  });

  MEMBER_ROLE_ORDER.forEach((role) => {
    if (Array.isArray(sourcePermissions[role])) {
      normalized[role] = sourcePermissions[role].filter((view) => MENU_CONFIG.some((item) => item.view === view));
    }

    if (!normalized[role].includes("dashboard")) {
      normalized[role].unshift("dashboard");
    }

    ["screening", "trending"].forEach((view) => {
      if (DEFAULT_ROLE_PERMISSIONS[role]?.includes(view) && !normalized[role].includes(view)) {
        normalized[role].push(view);
      }
    });

    normalized[role] = MENU_CONFIG
      .map((item) => item.view)
      .filter((view) => normalized[role].includes(view));
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

  if (state.memberFilters.role !== "all" && !MEMBER_ROLES[state.memberFilters.role]) {
    state.memberFilters.role = "all";
  }

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

  if (view === "register") {
    return canManageCandidates(member);
  }

  if (view === "audit") {
    return false;
  }

  return getAllowedViewsForRole(member.role).includes(view);
}

function canManageCandidates(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && CANDIDATE_REGISTER_ROLES.has(member.role));
}

function isRecruitingRole(member = getCurrentMember()) {
  return Boolean(member && ["business_recruiter", "division_recruiter", "admin"].includes(member.role));
}

function isHiringManagerRole(member = getCurrentMember()) {
  return Boolean(member && ["hiring_manager", "admin"].includes(member.role));
}

function isSearchFirmRole(member = getCurrentMember()) {
  return member?.role === "search_firm";
}

function canViewAllCandidates(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && (isAdmin(member) || member.role === "division_recruiter"));
}

function getMemberBusinessUnit(member = getCurrentMember()) {
  return normalizeBusinessUnit(member?.businessUnit);
}

function canViewCandidate(candidate, member = getCurrentMember()) {
  if (!candidate || !member || member.status !== "active") {
    return false;
  }

  if (canViewAllCandidates(member)) {
    return true;
  }

  if (normalizeCandidateVisibility(candidate.visibility) === "all") {
    return true;
  }

  const memberBusinessUnit = getMemberBusinessUnit(member);
  const candidateBusinessUnit = getCandidateBusinessUnit(candidate);

  return Boolean(memberBusinessUnit && candidateBusinessUnit === memberBusinessUnit);
}

function getVisibleCandidates(member = getCurrentMember()) {
  return state.candidates.filter((candidate) => canViewCandidate(candidate, member));
}

function canManageCandidateProfile(candidate, member = getCurrentMember()) {
  return canManageCandidates(member) && canViewCandidate(candidate, member);
}

function canCreateScreeningFolder(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && (isAdmin(member) || ["business_recruiter", "division_recruiter"].includes(member.role)));
}

function canViewAllScreeningFolders(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && (isAdmin(member) || member.role === "division_recruiter"));
}

function canViewBusinessUnitScreeningFolders(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && member.role === "business_recruiter" && getMemberBusinessUnit(member));
}

function canManageScreeningFolder(folder, member = getCurrentMember()) {
  if (!folder || !member || member.status !== "active") {
    return false;
  }

  if (canViewAllScreeningFolders(member)) {
    return true;
  }

  if (member.role === "business_recruiter") {
    return Boolean(getMemberBusinessUnit(member) && normalizeBusinessUnit(folder.businessUnit) === getMemberBusinessUnit(member));
  }

  return folder.createdById === member.id;
}

function canAccessScreeningFolder(folder, member = getCurrentMember()) {
  if (!folder || !member || member.status !== "active") {
    return false;
  }

  if (canViewAllScreeningFolders(member)) {
    return true;
  }

  if (canViewBusinessUnitScreeningFolders(member)) {
    return normalizeBusinessUnit(folder.businessUnit) === getMemberBusinessUnit(member);
  }

  if (member.role === "search_firm") {
    return (folder.receptionMemberIds || []).includes(member.id);
  }

  if (member.role === "hiring_manager") {
    return (folder.secondScreeningMemberIds || []).includes(member.id);
  }

  return folder.createdById === member.id || (folder.accessMemberIds || []).includes(member.id);
}

function canAccessScreeningStep(folder, step, member = getCurrentMember()) {
  if (!canAccessScreeningFolder(folder, member)) {
    return false;
  }

  if (member?.role === "search_firm") {
    return step === "reception" && (folder.receptionMemberIds || []).includes(member.id);
  }

  if (member?.role === "hiring_manager") {
    return step === "second" && (folder.secondScreeningMemberIds || []).includes(member.id);
  }

  return true;
}

function canRunFirstScreening(folder, member = getCurrentMember()) {
  return canAccessScreeningStep(folder, "first", member) && isRecruitingRole(member);
}

function canRunSecondScreening(folder, member = getCurrentMember()) {
  return canAccessScreeningStep(folder, "second", member) && isHiringManagerRole(member);
}

function canManageScreeningContact(folder, applicant, member = getCurrentMember()) {
  return Boolean(
    canAccessScreeningFolder(folder, member) &&
    (isRecruitingRole(member) ||
      isAdmin(member) ||
      (isSearchFirmRole(member) && (applicant.searchFirmMemberId === member.id || applicant.registeredById === member.id)))
  );
}

function canViewScreeningApplicant(applicant, member = getCurrentMember()) {
  if (!applicant || !member || member.status !== "active") {
    return false;
  }

  if (isSearchFirmRole(member)) {
    return applicant.sourceType === "search_firm" &&
      (applicant.searchFirmMemberId === member.id || applicant.registeredById === member.id);
  }

  if (member.role === "hiring_manager") {
    return ["first_pass", "second_draft", "second_reject", "second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(applicant.stage);
  }

  return true;
}

function canSubmitScreeningApplicant(folder, applicant, member = getCurrentMember()) {
  if (!folder || !applicant || applicant.stage !== "reception" || !canAccessScreeningFolder(folder, member)) {
    return false;
  }

  if (isSearchFirmRole(member)) {
    return applicant.sourceType === "search_firm" &&
      (applicant.searchFirmMemberId === member.id || applicant.registeredById === member.id);
  }

  return isRecruitingRole(member);
}

function canRegisterScreeningApplicant(folder, member = getCurrentMember()) {
  return Boolean(
    canAccessScreeningStep(folder, "reception", member) &&
    (isSearchFirmRole(member) || isRecruitingRole(member) || canManageScreeningFolder(folder, member))
  );
}

function getDefaultView(member = getCurrentMember()) {
  return getAllowedViewsForRole(member?.role)
    .find((view) => MENU_CONFIG.some((item) => item.view === view)) || "dashboard";
}

function getCurrentActorName() {
  return getCurrentMember()?.name || "시스템";
}

function getAssignableMembers() {
  return state.members
    .filter((member) => member.status === "active")
    .sort((a, b) => {
      if (a.id === state.currentUserId) {
        return -1;
      }

      if (b.id === state.currentUserId) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });
}

function getDefaultOwnerName() {
  return getCurrentMember()?.name || getAssignableMembers()[0]?.name || "";
}

function isAssignableOwner(ownerName) {
  return getAssignableMembers().some((member) => member.name === ownerName);
}

function normalizeOwnerSelection(ownerName) {
  const owner = String(ownerName || "").trim();
  return isAssignableOwner(owner) ? owner : getDefaultOwnerName();
}

function renderOwnerOptions(selectedOwner = "", options = {}) {
  const members = getAssignableMembers();
  const selected = normalizeOwnerSelection(selectedOwner);
  const placeholder = options.includePlaceholder
    ? `<option value="" ${selected ? "" : "selected"}>담당자 선택</option>`
    : "";

  return `${placeholder}${members.map((member) => {
    const label = `${member.name} · ${getRoleLabel(member.role)}${member.businessUnit ? ` · ${member.businessUnit}` : ""}`;
    return `<option value="${escapeHtml(member.name)}" ${member.name === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("")}`;
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
        screeningFolders: state.screeningFolders,
        auditLogs: state.auditLogs,
        selectedCandidateId: state.selectedCandidateId,
        selectedScreeningFolderId: state.selectedScreeningFolderId,
        poolFilters: state.poolFilters,
        dashboardFilters: state.dashboardFilters,
        screeningFilters: state.screeningFilters,
        members: state.members.map(sanitizeMemberForStorage),
        rolePermissions: state.rolePermissions,
        memberFilters: state.memberFilters,
        managementTab: state.managementTab,
        currentUserId: state.currentUserId,
        trendingReport: state.trendingReport,
        trendingHistory: state.trendingHistory,
        trendingSelectedDate: state.trendingSelectedDate,
        trendingMailSettings: state.trendingMailSettings,
        policySources: state.policySources,
        policyChatMessages: state.policyChatMessages
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

  if (Array.isArray(persisted.screeningFolders) && persisted.screeningFolders.length) {
    state.screeningFolders = persisted.screeningFolders.map(normalizeScreeningFolder);
  }

  if (Array.isArray(persisted.auditLogs)) {
    state.auditLogs = persisted.auditLogs.map(normalizeAuditLog).filter(Boolean);
  }

  if (persisted.poolFilters && typeof persisted.poolFilters === "object") {
    state.poolFilters = { ...state.poolFilters, ...persisted.poolFilters };
  }

  if (persisted.dashboardFilters && typeof persisted.dashboardFilters === "object") {
    state.dashboardFilters = { ...state.dashboardFilters, ...persisted.dashboardFilters };
  }

  if (state.dashboardFilters.organization !== "all" && !BUSINESS_UNITS.includes(state.dashboardFilters.organization)) {
    state.dashboardFilters.organization = "all";
  }

  if (persisted.screeningFilters && typeof persisted.screeningFilters === "object") {
    state.screeningFilters = { ...state.screeningFilters, ...persisted.screeningFilters };
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

  if (["members", "logs"].includes(persisted.managementTab)) {
    state.managementTab = persisted.managementTab;
  }

  if (persisted.currentUserId) {
    state.currentUserId = persisted.currentUserId;
  }

  if (persisted.trendingReport && typeof persisted.trendingReport === "object") {
    state.trendingReport = persisted.trendingReport;
  }

  if (Array.isArray(persisted.trendingHistory)) {
    state.trendingHistory = persisted.trendingHistory;
  }

  if (persisted.trendingSelectedDate) {
    state.trendingSelectedDate = persisted.trendingSelectedDate;
  }

  if (persisted.trendingMailSettings && typeof persisted.trendingMailSettings === "object") {
    state.trendingMailSettings = normalizeTrendingMailSettings(persisted.trendingMailSettings);
  }

  if (Array.isArray(persisted.policySources)) {
    state.policySources = persisted.policySources.map(normalizePolicySource).filter((source) => source.content);
  }

  if (Array.isArray(persisted.policyChatMessages)) {
    state.policyChatMessages = persisted.policyChatMessages.slice(-POLICY_CHAT_MAX_MESSAGES);
  }

  if (state.candidates.some((candidate) => candidate.id === persisted.selectedCandidateId)) {
    state.selectedCandidateId = persisted.selectedCandidateId;
  } else {
    state.selectedCandidateId = state.candidates[0]?.id || "";
  }

  if (state.screeningFolders.some((folder) => folder.id === persisted.selectedScreeningFolderId)) {
    state.selectedScreeningFolderId = persisted.selectedScreeningFolderId;
  } else {
    state.selectedScreeningFolderId = state.screeningFolders[0]?.id || "";
  }

  ensureAuditLogIds();
  ensureMemberDefaults();
  ensureScreeningDefaults();
  ensurePolicySourceDefaults();
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

async function deleteSupabaseRecord(tableName, id) {
  if (!REMOTE_SYNC_ENABLED || !id) {
    return;
  }

  await supabaseRequest(`${tableName}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" }
  });
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

function toSupabaseTimestamp(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value).includes("T") ? String(value) : String(value).replace(" ", "T");
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

function memberToSupabaseRow(member) {
  const normalized = normalizeMember(member);

  return {
    id: normalized.id,
    email: normalized.email,
    name: normalized.name,
    role: normalized.role,
    status: normalized.status,
    department: normalized.department || null,
    position: normalized.position || null,
    phone: normalized.phone || null,
    password_hash: normalized.passwordHash || null,
    requested_at: toSupabaseTimestamp(normalized.requestedAt) || new Date().toISOString(),
    approved_at: toSupabaseTimestamp(normalized.approvedAt),
    approved_by: normalized.approvedBy || null,
    last_login_at: toSupabaseTimestamp(normalized.lastLoginAt),
    note: normalized.note || null,
    profile: publicMemberProfile(normalized)
  };
}

function memberFromSupabaseRow(row) {
  return normalizeMember({
    ...(row.profile || {}),
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    status: row.status,
    businessUnit: row.business_unit || row.profile?.businessUnit,
    department: row.department,
    position: row.position,
    phone: row.phone,
    passwordHash: row.password_hash,
    requestedAt: row.profile?.requestedAt || row.requested_at || "",
    approvedAt: row.profile?.approvedAt || row.approved_at || "",
    approvedBy: row.approved_by || row.profile?.approvedBy || "",
    lastLoginAt: row.profile?.lastLoginAt || row.last_login_at || "",
    note: row.note || row.profile?.note || ""
  });
}

function policySourceToSupabaseRow(source) {
  const normalized = normalizePolicySource(source);

  return {
    id: normalized.id,
    title: normalized.title,
    source_type: normalized.sourceType,
    file_name: normalized.fileName || null,
    file_type: normalized.fileType || null,
    size_bytes: normalized.size || null,
    content: normalized.content,
    created_by: normalized.createdBy || null,
    updated_at: new Date().toISOString(),
    payload: normalized
  };
}

function policySourceFromSupabaseRow(row) {
  return normalizePolicySource({
    ...(row.payload || {}),
    id: row.id,
    title: row.title,
    sourceType: row.source_type,
    fileName: row.file_name,
    fileType: row.file_type,
    size: row.size_bytes,
    content: row.content,
    createdBy: row.created_by,
    updatedAt: row.updated_at
  });
}

function mergeMembers(localMembers, remoteMembers) {
  const membersByEmail = new Map();

  remoteMembers.forEach((member) => {
    if (member.email) {
      membersByEmail.set(member.email, normalizeMember(member));
    }
  });

  localMembers.forEach((member) => {
    const normalized = normalizeMember(member);

    if (normalized.email && !membersByEmail.has(normalized.email)) {
      membersByEmail.set(normalized.email, normalized);
    }
  });

  return [...membersByEmail.values()].sort((a, b) =>
    MEMBER_STATUS_ORDER.indexOf(a.status) - MEMBER_STATUS_ORDER.indexOf(b.status) ||
    dateSortValue(b.requestedAt) - dateSortValue(a.requestedAt) ||
    a.name.localeCompare(b.name)
  );
}

function rolePermissionToSupabaseRows() {
  return MEMBER_ROLE_ORDER.flatMap((role) =>
    MENU_CONFIG.map((menu) => ({
      role,
      view: menu.view,
      enabled: getAllowedViewsForRole(role).includes(menu.view),
      updated_at: new Date().toISOString()
    }))
  );
}

function rolePermissionsFromSupabaseRows(rows) {
  const permissions = Object.fromEntries(MEMBER_ROLE_ORDER.map((role) => [role, []]));

  rows.forEach((row) => {
    if (row.enabled && permissions[row.role]) {
      permissions[row.role].push(row.view);
    }
  });

  return normalizeRolePermissions(permissions);
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
    await ensureMemberPasswordHashes();
    const candidateRows = state.candidates.map(candidateToSupabaseRow);
    const auditRows = state.auditLogs.map(auditLogToSupabaseRow);
    const memberRows = state.members.map(memberToSupabaseRow);
    const permissionRows = rolePermissionToSupabaseRows();
    const policySourceRows = state.policySources.map(policySourceToSupabaseRow);

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

    if (memberRows.length) {
      await supabaseRequest("app_members?on_conflict=id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(memberRows)
      });
    }

    if (permissionRows.length) {
      await supabaseRequest("app_role_permissions?on_conflict=role,view", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(permissionRows)
      });
    }

    if (policySourceRows.length) {
      try {
        await supabaseRequest("recruiting_policy_sources?on_conflict=id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(policySourceRows)
        });
      } catch (error) {
        console.warn("Policy sources could not be synced.", error);
      }
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
    const [candidateRows, auditRows, memberRows, permissionRows, policySourceRows] = await Promise.all([
      supabaseRequest("candidates?select=profile&order=updated_at.desc"),
      supabaseRequest("audit_logs?select=payload&order=created_at.desc&limit=200"),
      supabaseRequest("app_members?select=*&order=requested_at.desc"),
      supabaseRequest("app_role_permissions?select=*"),
      supabaseRequest("recruiting_policy_sources?select=*&order=updated_at.desc").catch((error) => {
        console.warn("Policy sources could not be loaded.", error);
        return [];
      })
    ]);

    if (Array.isArray(candidateRows) && candidateRows.length) {
      state.candidates = candidateRows.map((row) => row.profile).filter(Boolean).map(normalizeCandidate);
      state.selectedCandidateId = state.candidates[0]?.id || state.selectedCandidateId;
    }

    if (Array.isArray(auditRows) && auditRows.length) {
      state.auditLogs = auditRows.map((row) => row.payload).filter(Boolean).map(normalizeAuditLog).filter(Boolean);
      ensureAuditLogIds();
    }

    if (Array.isArray(memberRows) && memberRows.length) {
      state.members = mergeMembers(
        state.members,
        memberRows.map(memberFromSupabaseRow).filter((member) => member.email)
      );
    }

    if (Array.isArray(permissionRows) && permissionRows.length) {
      state.rolePermissions = rolePermissionsFromSupabaseRows(permissionRows);
    }

    if (Array.isArray(policySourceRows) && policySourceRows.length) {
      state.policySources = policySourceRows.map(policySourceFromSupabaseRow).filter((source) => source.content);
    }

    ensureMemberDefaults();
    ensureScreeningDefaults();
    ensurePolicySourceDefaults();
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

function decodeTextDataUrl(dataUrl = "") {
  const match = String(dataUrl || "").match(/^data:([^;,]+)?(;base64)?,(.*)$/);

  if (!match) {
    return "";
  }

  try {
    const encoded = match[3] || "";
    const raw = match[2]
      ? atob(encoded)
      : decodeURIComponent(encoded);
    const bytes = new Uint8Array([...raw].map((char) => char.charCodeAt(0)));

    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch (error) {
    console.warn("Text data URL decode failed.", error);
    return "";
  }
}

function dataUrlToUint8Array(dataUrl = "") {
  const match = String(dataUrl || "").match(/^data:([^;,]+)?(;base64)?,(.*)$/);

  if (!match) {
    return new Uint8Array();
  }

  const payload = match[3] || "";
  const raw = match[2]
    ? atob(payload)
    : decodeURIComponent(payload);
  const bytes = new Uint8Array(raw.length);

  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }

  return bytes;
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
  return findCandidate(id) || getVisibleCandidates()[0] || null;
}

function findCandidate(id) {
  const candidate = findAnyCandidate(id);
  return canViewCandidate(candidate) ? candidate : null;
}

function findAnyCandidate(id) {
  return state.candidates.find((candidate) => candidate.id === id) || null;
}

function replaceCandidate(candidate) {
  const index = state.candidates.findIndex((item) => item.id === candidate.id);

  if (index >= 0) {
    state.candidates[index] = candidate;
  }
}

function startCandidateEdit() {
  const candidate = getCandidate();

  if (!canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 수정할 수 없는 프로필입니다.");
    return;
  }

  if (!state.isEditingCandidate) {
    state.editSnapshot = structuredClone(candidate);
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
              <label for="signup-business-unit">소속 사업부</label>
              <select class="control-select" id="signup-business-unit" name="businessUnit">
                ${renderBusinessUnitOptions()}
              </select>
            </div>
            <div class="field">
              <label for="signup-department">부서</label>
              <input class="control-input" id="signup-department" name="department" autocomplete="organization" />
            </div>
          </div>
          <div class="field-grid">
            <div class="field">
              <label for="signup-position">직책</label>
              <input class="control-input" id="signup-position" name="position" autocomplete="organization-title" />
            </div>
            <div class="field">
              <label for="signup-phone">연락처</label>
              <input class="control-input" id="signup-phone" name="phone" type="tel" autocomplete="tel" />
            </div>
          </div>
          <div class="field-grid">
            <div class="field">
              <label for="signup-role">신청 등급</label>
              <select class="control-select" id="signup-role" name="role">
                ${SIGNUP_ROLE_ORDER.map((role) => `<option value="${role}">${escapeHtml(MEMBER_ROLES[role])}</option>`).join("")}
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
      <strong>${escapeHtml([getRoleLabel(member.role), member.businessUnit].filter(Boolean).join(" · "))}</strong>
    </div>
    <button class="ghost-button compact-button" type="button" data-open-member-profile>내 정보 수정</button>
    <button class="ghost-button compact-button" type="button" id="logout-button">로그아웃</button>
    ${renderMemberProfileModal(member)}
  `;
}

function renderMemberProfileModal(member) {
  if (!state.memberProfileModalOpen) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-member-profile-backdrop>
      <section class="trending-modal member-profile-modal" role="dialog" aria-modal="true" aria-labelledby="member-profile-title">
        <div class="trending-modal-header">
          <div>
            <strong id="member-profile-title">내 정보 수정</strong>
            <span>이름, 소속 정보, 연락처와 비밀번호를 직접 관리합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-member-profile>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form class="member-profile-form" id="member-profile-form">
            <div class="form-error" id="member-profile-error" hidden></div>
            <div class="field-grid">
              <div class="field">
                <label for="member-profile-name">이름</label>
                <input class="control-input" id="member-profile-name" name="name" value="${inputValue(member.name)}" autocomplete="name" />
              </div>
              <div class="field">
                <label for="member-profile-email">이메일</label>
                <input class="control-input" id="member-profile-email" name="email" value="${inputValue(member.email)}" readonly />
                <span class="field-caption">이메일은 로그인 ID로 사용되어 관리자에게 변경을 요청해주세요.</span>
              </div>
              <div class="field">
                <label for="member-profile-business-unit">소속 사업부</label>
                <select class="control-select" id="member-profile-business-unit" name="businessUnit">
                  ${renderBusinessUnitOptions(member.businessUnit)}
                </select>
                <span class="field-caption">사업부 공개 프로필 조회 범위에 사용됩니다.</span>
              </div>
              <div class="field">
                <label for="member-profile-department">부서</label>
                <input class="control-input" id="member-profile-department" name="department" value="${inputValue(member.department)}" autocomplete="organization" />
              </div>
              <div class="field">
                <label for="member-profile-position">직책</label>
                <input class="control-input" id="member-profile-position" name="position" value="${inputValue(member.position)}" autocomplete="organization-title" />
              </div>
              <div class="field">
                <label for="member-profile-phone">연락처</label>
                <input class="control-input" id="member-profile-phone" name="phone" type="tel" value="${inputValue(member.phone)}" autocomplete="tel" />
              </div>
              <div class="field">
                <label>회원 상태</label>
                <div class="readonly-profile-value">
                  <span>${escapeHtml(getRoleLabel(member.role))}</span>
                  <strong>${escapeHtml(getMemberStatusLabel(member.status))}</strong>
                </div>
              </div>
              <div class="field full">
                <label for="member-profile-note">사용 목적 / 메모</label>
                <textarea class="control-textarea" id="member-profile-note" name="note">${escapeHtml(member.note)}</textarea>
              </div>
            </div>

            <div class="member-password-section">
              <strong>비밀번호 변경</strong>
              <span>비밀번호를 바꾸지 않으려면 아래 칸은 비워두세요.</span>
              <div class="field-grid">
                <div class="field">
                  <label for="member-profile-current-password">현재 비밀번호</label>
                  <input class="control-input" id="member-profile-current-password" name="currentPassword" type="password" autocomplete="current-password" />
                </div>
                <div class="field">
                  <label for="member-profile-new-password">새 비밀번호</label>
                  <input class="control-input" id="member-profile-new-password" name="newPassword" type="password" autocomplete="new-password" />
                </div>
                <div class="field">
                  <label for="member-profile-confirm-password">새 비밀번호 확인</label>
                  <input class="control-input" id="member-profile-confirm-password" name="confirmPassword" type="password" autocomplete="new-password" />
                </div>
              </div>
            </div>

            <div class="member-profile-actions">
              <button class="ghost-button" type="button" data-close-member-profile>취소</button>
              <button class="primary-button" type="submit">저장</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `;
}

function applyAccessControls() {
  document.querySelectorAll("[data-view]").forEach((element) => {
    const view = element.dataset.view;
    element.hidden = !canAccessView(view);
  });
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

  const pageTitle = $("#page-title");

  if (pageTitle) {
    pageTitle.textContent = viewTitles[state.view] || "Talent Pool";
  }
}

function trendingReportNeedsRefresh(report) {
  if (!report || !Array.isArray(report.people) || !report.people.length) {
    return true;
  }

  if (Number(report.profileCompletenessVersion || 0) < TRENDING_PROFILE_COMPLETENESS_VERSION) {
    return true;
  }

  return false;
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

  const previousView = state.view;
  state.view = view;
  if (view !== "trending") {
    state.trendingModal = "";
  }
  if (view !== "screening") {
    state.screeningPositionModalOpen = false;
    state.screeningApplicantModalOpen = false;
    state.screeningJdModalOpen = false;
    state.screeningAccessModalOpen = false;
    state.screeningApplicantDetailId = "";
    state.screeningPage = "list";
    state.screeningDetailStep = "first";
  } else if (previousView !== "screening") {
    state.screeningPage = "list";
    state.screeningDetailStep = "first";
    state.screeningPositionModalOpen = false;
    state.screeningApplicantModalOpen = false;
    state.screeningJdModalOpen = false;
    state.screeningAccessModalOpen = false;
    state.screeningApplicantDetailId = "";
  }
  if (view !== "detail" && state.isEditingCandidate) {
    discardCandidateEditDraft();
  }
  syncActiveViewState();
  render();

  if (view === "trending" && trendingReportNeedsRefresh(state.trendingReport) && !state.trendingLoading) {
    fetchTrendingPeople();
  }

  if (view === "trending" && !state.trendingHistory.length && !state.trendingHistoryLoading) {
    fetchTrendingHistory();
  }

  if (view === "trending" && isAdmin()) {
    fetchTrendingMailSettings();
  }
}

function getCurrentScrollY() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function savePoolReturnPosition() {
  if (state.view === "pool") {
    state.poolReturnScrollY = getCurrentScrollY();
  }
}

function restorePoolReturnPosition() {
  const scrollY = Number(state.poolReturnScrollY || 0);
  window.setTimeout(() => {
    window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
  }, 0);
}

function openCandidateDetail(candidateId) {
  const candidate = findCandidate(candidateId);

  if (!candidate) {
    showToast("후보자 정보를 찾지 못했습니다.");
    return;
  }

  if (state.isEditingCandidate) {
    discardCandidateEditDraft();
  }

  savePoolReturnPosition();
  state.selectedCandidateId = candidate.id;
  state.isEditingCandidate = false;
  state.auditLogs.unshift({
    actor: candidate.owner,
    action: "후보자 상세 조회",
    resource: candidate.name,
    purpose: "프로필 검토",
    time: getTimestampText()
  });
  persistState();
  setView("detail");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function backToPoolList() {
  if (state.isEditingCandidate) {
    discardCandidateEditDraft();
  }

  setView("pool");
  restorePoolReturnPosition();
}

function getFilteredCandidates() {
  const query = state.poolFilters.query.trim().toLowerCase();

  return getVisibleCandidates().filter((candidate) => {
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

function ensureCandidateDefaults() {
  state.candidates = state.candidates.map(normalizeCandidate);

  if (state.selectedCandidateId && !findCandidate(state.selectedCandidateId)) {
    state.selectedCandidateId = getVisibleCandidates()[0]?.id || "";
    state.isEditingCandidate = false;
    state.editSnapshot = null;
  }

  state.aiResults = state.aiResults.filter((candidate) => canViewCandidate(candidate));
}

function render() {
  ensureMemberDefaults();
  renderAuth();

  if (!isAuthenticated()) {
    return;
  }

  ensureCandidateDefaults();
  ensureScreeningDefaults();
  ensurePolicySourceDefaults();
  ensureActiveViewAllowed();
  syncActiveViewState();
  renderSidePanel();
  renderDashboard();
  renderPool();
  renderScreening();
  renderRegister();
  renderAiSearch();
  renderPolicyChat();
  renderTrendingPeople();
  renderDetail();
  renderAudit();
  renderMembers();
  renderUserMenu();
  applyAccessControls();
}

function renderSidePanel() {
  const visitStats = getVisitStatsSummary();
  const count = $("#side-visit-count");
  const detail = $("#side-visit-detail");

  if (count) {
    count.textContent = `${visitStats.today}회`;
  }

  if (detail) {
    const delta = visitStats.weekDelta > 0 ? `+${visitStats.weekDelta}` : String(visitStats.weekDelta);
    detail.textContent = `최근 7일 ${visitStats.weekTotal}회 · 전주 대비 ${delta}`;
  }
}

function renderDashboard() {
  const selectedOrganization = getDashboardOrganizationFilter();
  const selectedLabel = selectedOrganization === "all" ? "전체" : selectedOrganization;
  const filteredCandidates = getDashboardFilteredCandidates();
  const total = filteredCandidates.length;
  const monthlyDelta = countCandidatesCreatedSince(dateDaysAgo(30), filteredCandidates);
  const weeklyDelta = countCandidatesCreatedSince(dateDaysAgo(7), filteredCandidates);
  const currentMonthKey = getMonthKey();
  const previousMonthKey = getMonthKey(addMonths(new Date(), -1));
  const currentMonthNew = countCandidatesCreatedInMonth(filteredCandidates, currentMonthKey);
  const previousMonthNew = countCandidatesCreatedInMonth(filteredCandidates, previousMonthKey);
  const monthlySeries = getMonthlyRegistrationSeries(filteredCandidates, 6);
  const businessUnitCounts = getBusinessUnitRegistrationCounts();
  const topViewedProfiles = getTopViewedProfiles(90, 5);

  $("#dashboard-content").innerHTML = `
    <div class="dashboard-grid">
      <div class="dashboard-filter-row">
        <div>
          <strong>월별 신규 인재 Pool 등록 수</strong>
          <span>전체 및 사업부별 필터 조회</span>
        </div>
        <select class="control-select" id="dashboard-organization-filter" aria-label="월별 신규 등록 사업부 필터">
          ${renderDashboardBusinessUnitOptions(selectedOrganization)}
        </select>
      </div>

      <div class="kpi-row">
        ${metricCard(`${selectedLabel} 후보자`, total, `전월 대비 ${formatSignedCount(monthlyDelta)}명 · 전주 대비 ${formatSignedCount(weeklyDelta)}명`)}
        ${metricCard("이번 달 신규 등록", currentMonthNew, `${formatMonthLabel(currentMonthKey)} · 전월 대비 ${formatSignedCount(currentMonthNew - previousMonthNew)}명`)}
      </div>

      <section class="content-panel span-12">
        <div class="panel-header">
          <h4>사업부별 누적 인재 Pool 등록 수</h4>
          <span class="small-pill">누적 기준</span>
        </div>
        ${renderBusinessUnitRegistrationChart(businessUnitCounts)}
      </section>

      <section class="content-panel span-5">
        <div class="panel-header">
          <h4>월별 신규 등록 추이</h4>
          <span class="small-pill">${escapeHtml(selectedLabel)} 기준</span>
        </div>
        ${renderMonthlyRegistrationChart(monthlySeries)}
      </section>

      <section class="content-panel span-7">
        <div class="panel-header">
          <h4>최근 3개월 조회 수 TOP5 프로필</h4>
          <span class="small-pill">상세 조회 로그 기준</span>
        </div>
        ${renderTopViewedProfiles(topViewedProfiles)}
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

function countCandidatesCreatedSince(date, candidates = state.candidates) {
  return candidates.filter((candidate) => String(candidate.createdAt || "") >= date).length;
}

function formatSignedCount(value) {
  return value > 0 ? `+${value}` : String(value);
}

function getDashboardOrganizationFilter() {
  const organization = state.dashboardFilters.organization;
  return organization === "all" || BUSINESS_UNITS.includes(organization) ? organization : "all";
}

function renderDashboardBusinessUnitOptions(selectedOrganization) {
  return `
    <option value="all" ${selectedOrganization === "all" ? "selected" : ""}>전체</option>
    ${BUSINESS_UNITS.map((unit) => `<option value="${escapeHtml(unit)}" ${unit === selectedOrganization ? "selected" : ""}>${escapeHtml(unit)}</option>`).join("")}
  `;
}

function getCandidateBusinessUnit(candidate) {
  return normalizeBusinessUnit(candidate.organization) || "미지정";
}

function getDashboardFilteredCandidates() {
  const organization = getDashboardOrganizationFilter();
  const candidates = getVisibleCandidates();

  return organization === "all"
    ? candidates
    : candidates.filter((candidate) => getCandidateBusinessUnit(candidate) === organization);
}

function getBusinessUnitRegistrationCounts() {
  const counts = new Map(BUSINESS_UNITS.map((unit) => [unit, 0]));
  let unassignedCount = 0;

  getVisibleCandidates().forEach((candidate) => {
    const unit = getCandidateBusinessUnit(candidate);

    if (counts.has(unit)) {
      counts.set(unit, counts.get(unit) + 1);
    } else {
      unassignedCount += 1;
    }
  });

  const rows = BUSINESS_UNITS.map((unit) => ({ unit, count: counts.get(unit) || 0 }));

  if (unassignedCount) {
    rows.push({ unit: "미지정", count: unassignedCount });
  }

  return rows;
}

function renderBusinessUnitRegistrationChart(rows) {
  const maxCount = Math.max(...rows.map((row) => row.count), 1);

  return `
    <div class="bar-list dashboard-bar-list">
      ${rows.map((row, index) => `
        <div class="bar-row dashboard-bar-row">
          <span class="truncate">${escapeHtml(row.unit)}</span>
          <div class="bar-track">
            <div class="bar-fill ${["", "green", "amber", "violet"][index % 4]}" style="width:${(row.count / maxCount) * 100}%"></div>
          </div>
          <strong>${row.count}명</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function addMonths(date, offset) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + offset);
  return nextDate;
}

function getMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function formatMonthLabel(monthKey) {
  const [year, month] = String(monthKey || "").split("-");
  return year && month ? `${year}.${month}` : "-";
}

function countCandidatesCreatedInMonth(candidates, monthKey) {
  return candidates.filter((candidate) => String(candidate.createdAt || "").slice(0, 7) === monthKey).length;
}

function getMonthlyRegistrationSeries(candidates, monthCount = 6) {
  return Array.from({ length: monthCount }, (_, index) => {
    const monthKey = getMonthKey(addMonths(new Date(), index - monthCount + 1));
    return {
      key: monthKey,
      label: formatMonthLabel(monthKey),
      count: countCandidatesCreatedInMonth(candidates, monthKey)
    };
  });
}

function renderMonthlyRegistrationChart(series) {
  const maxCount = Math.max(...series.map((item) => item.count), 1);

  return `
    <div class="bar-list">
      ${series.map((item, index) => `
        <div class="bar-row month-bar-row">
          <span>${escapeHtml(item.label)}</span>
          <div class="bar-track">
            <div class="bar-fill ${index === series.length - 1 ? "" : "green"}" style="width:${(item.count / maxCount) * 100}%"></div>
          </div>
          <strong>${item.count}명</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function getTopViewedProfiles(days = 90, limit = 5) {
  const since = dateDaysAgo(days);
  const counts = new Map();
  const visibleByName = new Map(getVisibleCandidates().map((candidate) => [candidate.name, candidate]));

  state.auditLogs.forEach((log) => {
    const action = String(log.action || "");
    const viewedAt = String(log.time || "").slice(0, 10);
    const candidateName = String(log.resource || "").trim();

    if (!action.includes("후보자 상세 조회") || !candidateName || viewedAt < since) {
      return;
    }

    counts.set(candidateName, (counts.get(candidateName) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([name, views]) => ({
      candidate: visibleByName.get(name),
      views
    }))
    .filter((item) => item.candidate)
    .sort((a, b) =>
      b.views - a.views ||
      dateSortValue(b.candidate.updatedAt) - dateSortValue(a.candidate.updatedAt) ||
      String(a.candidate.name).localeCompare(String(b.candidate.name))
    )
    .slice(0, limit);
}

function renderTopViewedProfiles(items) {
  if (!items.length) {
    return `<div class="empty-state">최근 3개월 상세 조회 이력이 없습니다.</div>`;
  }

  return `
    <div class="top-profile-list">
      ${items.map(({ candidate, views }, index) => `
        <article class="top-profile-card">
          <span class="top-rank">${index + 1}</span>
          ${candidateVisual(candidate, "pool")}
          <div class="top-profile-main">
            <button class="link-button strong" type="button" data-select-candidate="${escapeHtml(candidate.id)}">${escapeHtml(candidate.name)}</button>
            <span>${escapeHtml(formatBirthAge(candidate))}</span>
            <span>${escapeHtml(candidate.organization || "사업부 미입력")} · ${escapeHtml(candidate.role || "직무 미입력")}</span>
          </div>
          <strong class="top-profile-count">${views}회</strong>
        </article>
      `).join("")}
    </div>
  `;
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
          <col class="col-actions" />
        </colgroup>
        <thead>
          <tr>
            <th>사진</th>
            <th>후보자 이름</th>
            <th>학력</th>
            <th>경력</th>
            <th>직무</th>
            <th>사업부</th>
            <th>담당자</th>
            <th>관리</th>
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
              <td>${escapeHtml(candidate.organization || "사업부 미입력")}</td>
              <td>${escapeHtml(candidate.owner)}</td>
              <td>
                ${canManageCandidateProfile(candidate) ? `<button class="ghost-button danger-button compact-button" type="button" data-delete-candidate="${candidate.id}">삭제</button>` : `<span class="muted-text">-</span>`}
              </td>
            </tr>
          `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPool() {
  const owners = [...new Set(getVisibleCandidates().map((candidate) => candidate.owner))];
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

function getBaseAccessibleScreeningFolders(member = getCurrentMember()) {
  return state.screeningFolders
    .filter((folder) => canAccessScreeningFolder(folder, member))
    .sort((a, b) => dateSortValue(b.updatedAt) - dateSortValue(a.updatedAt) || a.title.localeCompare(b.title));
}

function getScreeningFilterBusinessUnits(member = getCurrentMember()) {
  if (canViewAllScreeningFolders(member)) {
    return BUSINESS_UNITS;
  }

  if (canViewBusinessUnitScreeningFolders(member)) {
    return [getMemberBusinessUnit(member)].filter(Boolean);
  }

  return [...new Set(getBaseAccessibleScreeningFolders(member)
    .map((folder) => normalizeBusinessUnit(folder.businessUnit))
    .filter(Boolean))];
}

function normalizeScreeningFilters(member = getCurrentMember()) {
  const filters = state.screeningFilters && typeof state.screeningFilters === "object"
    ? state.screeningFilters
    : {};
  const units = getScreeningFilterBusinessUnits(member);
  let businessUnit = String(filters.businessUnit || "all").trim();

  if (canViewBusinessUnitScreeningFolders(member)) {
    businessUnit = getMemberBusinessUnit(member) || "all";
  } else if (businessUnit !== "all" && !units.includes(businessUnit)) {
    businessUnit = "all";
  }

  state.screeningFilters = {
    businessUnit,
    mineOnly: Boolean(filters.mineOnly)
  };

  return state.screeningFilters;
}

function getAccessibleScreeningFolders(member = getCurrentMember(), options = {}) {
  const applyFilters = options.applyFilters !== false;
  const folders = getBaseAccessibleScreeningFolders(member);

  if (!applyFilters) {
    return folders;
  }

  const filters = normalizeScreeningFilters(member);

  return folders.filter((folder) => {
    const businessUnitMatch = filters.businessUnit === "all" || normalizeBusinessUnit(folder.businessUnit) === filters.businessUnit;
    const mineMatch = !filters.mineOnly || folder.createdById === member?.id;

    return businessUnitMatch && mineMatch;
  });
}

function getSelectedScreeningFolder() {
  const accessibleFolders = getAccessibleScreeningFolders(getCurrentMember(), { applyFilters: false });
  return accessibleFolders.find((folder) => folder.id === state.selectedScreeningFolderId) || accessibleFolders[0] || null;
}

function getScreeningFolder(folderId = state.selectedScreeningFolderId) {
  return state.screeningFolders.find((folder) => folder.id === folderId) || null;
}

function getScreeningApplicant(folder, applicantId) {
  return folder?.applicants.find((applicant) => applicant.id === applicantId) || null;
}

function replaceScreeningFolder(folder) {
  const index = state.screeningFolders.findIndex((item) => item.id === folder.id);

  if (index >= 0) {
    state.screeningFolders[index] = normalizeScreeningFolder(folder);
  }
}

function tokenizeScreeningText(value) {
  return [...new Set(String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2))];
}

function evaluateApplicantFit(folder, applicant) {
  const jdTokens = tokenizeScreeningText([
    folder.title,
    folder.department,
    folder.positionName,
    folder.jdText
  ].join(" "));
  const applicantTokens = tokenizeScreeningText([
    applicant.name,
    applicant.company,
    applicant.currentRole,
    applicant.summary
  ].join(" "));

  if (!jdTokens.length || !applicantTokens.length) {
    return {
      grade: "C",
      comment: "JD 또는 지원자 서술 정보가 부족하여 직접 검토가 필요합니다."
    };
  }

  const matches = jdTokens.filter((token) => applicantTokens.includes(token));
  const ratio = matches.length / Math.max(1, jdTokens.length);
  const grade = ratio >= 0.55 ? "A" : ratio >= 0.38 ? "B" : ratio >= 0.22 ? "C" : ratio >= 0.1 ? "D" : "E";
  const keywords = matches.slice(0, 5).join(", ");

  return {
    grade,
    comment: keywords
      ? `JD 핵심어 중 ${keywords} 항목이 지원자 정보와 일치합니다. 세부 경험 깊이는 면접 전 추가 확인이 필요합니다.`
      : "JD 핵심어와 지원자 정보의 직접 일치도가 낮습니다. 유관 경험 여부를 별도 확인해주세요."
  };
}

function screeningStageChip(stage) {
  const chipClass = {
    reception: "chip-amber",
    registered: "chip-blue",
    first_pass: "chip-green",
    first_reject: "chip-red",
    second_draft: "chip-amber",
    second_pass: "chip-green",
    second_reject: "chip-red",
    contact_requested: "chip-amber",
    contact_ready: "chip-violet",
    interview_mail_sent: "chip-blue"
  }[stage] || "chip-blue";

  return `<span class="status-chip ${chipClass}">${escapeHtml(SCREENING_STAGE_LABELS[stage] || stage)}</span>`;
}

function fitGradeChip(grade) {
  const chipClass = {
    A: "chip-green",
    B: "chip-blue",
    C: "chip-violet",
    D: "chip-amber",
    E: "chip-red"
  }[grade] || "chip-blue";

  return `<span class="status-chip ${chipClass}">적합도 ${escapeHtml(grade || "-")}</span>`;
}

function activeSearchFirmOptions(selectedId = "") {
  const firms = state.members.filter((member) => member.status === "active" && member.role === "search_firm");
  const selected = String(selectedId || "");

  return `
    <option value="">서치펌 담당자 선택</option>
    ${firms.map((member) => `<option value="${escapeHtml(member.id)}" ${member.id === selected ? "selected" : ""}>${escapeHtml(member.name)} · ${escapeHtml(member.email)}</option>`).join("")}
  `;
}

function getActiveScreeningAccessMembers(roleFilter = "") {
  const roles = String(roleFilter || "")
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

  return state.members
    .filter((member) => member.status === "active")
    .filter((member) => !roles.length || roles.includes(member.role))
    .sort((a, b) => {
      const roleOrder = MEMBER_ROLE_ORDER.indexOf(a.role) - MEMBER_ROLE_ORDER.indexOf(b.role);
      return roleOrder || a.name.localeCompare(b.name, "ko");
    });
}

function screeningAccessMemberSearchText(member) {
  return [
    member.name,
    member.email,
    getRoleLabel(member.role),
    member.department,
    member.position
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function renderScreeningAccessMemberChip(member, locked = false, fieldName = "accessMemberIds") {
  if (!member) {
    return "";
  }

  return `
    <div class="screening-access-chip" data-screening-access-member="${escapeHtml(member.id)}">
      <input type="hidden" name="${escapeHtml(fieldName)}" value="${escapeHtml(member.id)}" />
      <span>
        <strong>${escapeHtml(member.name)}</strong>
        <small>${escapeHtml(getRoleLabel(member.role))} · ${escapeHtml(member.email || "-")}</small>
      </span>
      ${locked
        ? `<em>생성자</em>`
        : `<button class="ghost-button compact-button" type="button" data-remove-screening-access-member="${escapeHtml(member.id)}">삭제</button>`}
    </div>
  `;
}

function renderScreeningAccessPicker(folder = null, options = {}) {
  const fieldName = options.fieldName || "accessMemberIds";
  const roleFilter = options.roleFilter || "";
  const creatorId = folder?.createdById || getCurrentMember()?.id || "";
  const baseSelectedIds = fieldName === "accessMemberIds"
    ? [creatorId, ...(folder?.accessMemberIds || [])]
    : folder?.[fieldName] || [];
  const selectedIds = [...new Set(baseSelectedIds.filter(Boolean))];
  const selectedMembers = selectedIds
    .map((id) => state.members.find((member) => member.id === id))
    .filter(Boolean);
  const placeholder = options.placeholder || "회원 이름, 이메일, 권한으로 검색";
  const helpText = options.helpText || "검색어를 입력하면 추가 가능한 회원이 표시됩니다.";

  return `
    <div class="screening-access-picker" data-screening-access-picker data-screening-access-field-name="${escapeHtml(fieldName)}" data-screening-access-role-filter="${escapeHtml(roleFilter)}">
      <div class="screening-access-selected" data-screening-access-selected>
        ${selectedMembers.map((member) => renderScreeningAccessMemberChip(member, fieldName === "accessMemberIds" && member.id === creatorId, fieldName)).join("")}
      </div>
      <div class="screening-access-search">
        <input class="control-input" type="search" data-screening-access-search placeholder="${escapeHtml(placeholder)}" autocomplete="off" />
      </div>
      <div class="screening-access-results" data-screening-access-results>
        <span class="form-help">${escapeHtml(helpText)}</span>
      </div>
    </div>
  `;
}

function renderPositionCreateModal() {
  if (!state.screeningPositionModalOpen || !canCreateScreeningFolder()) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-screening-position-modal-backdrop>
      <section class="trending-modal screening-position-modal" role="dialog" aria-modal="true" aria-labelledby="screening-position-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-position-modal-title">포지션 생성</strong>
            <span>JD 첨부 또는 직접 입력 후 저장하면 포지션 리스트에 추가됩니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-position-modal>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form id="screening-folder-form" class="screening-create-form">
            <div class="field-grid">
              <div class="field">
                <label for="screening-folder-title">포지션 리스트명</label>
                <input class="control-input" id="screening-folder-title" name="title" placeholder="예: MX 생성형 AI 서비스 PM" />
              </div>
              <div class="field">
                <label for="screening-folder-business-unit">사업부</label>
                <select class="control-select" id="screening-folder-business-unit" name="businessUnit">
                  ${renderScreeningBusinessUnitOptions()}
                </select>
              </div>
              <div class="field">
                <label for="screening-folder-department">채용 부서명</label>
                <input class="control-input" id="screening-folder-department" name="department" />
              </div>
              <div class="field">
                <label for="screening-folder-position">포지션명</label>
                <input class="control-input" id="screening-folder-position" name="positionName" />
              </div>
              <div class="field full">
                <label for="screening-folder-jd">JD 직접 입력</label>
                <textarea class="control-textarea" id="screening-folder-jd" name="jdText" rows="5"></textarea>
              </div>
              <div class="field full">
                <label for="screening-folder-jd-file">JD 첨부</label>
                <input class="control-input" id="screening-folder-jd-file" name="jdFile" type="file" />
              </div>
              <div class="field full">
                <label>기본 접근 회원</label>
                ${renderScreeningAccessPicker(null, {
                  helpText: "채용 담당자, 운영진 등 포지션 전반을 함께 볼 회원을 추가합니다."
                })}
              </div>
              <div class="field full">
                <label>지원자 접수 권한</label>
                ${renderScreeningAccessPicker(null, {
                  fieldName: "receptionMemberIds",
                  roleFilter: "search_firm",
                  placeholder: "서치펌 담당자 이름, 이메일 검색",
                  helpText: "서치펌 담당자만 추가할 수 있으며, 이 회원은 지원자 접수 단계만 조회합니다."
                })}
              </div>
              <div class="field full">
                <label>2차 스크리닝 권한</label>
                ${renderScreeningAccessPicker(null, {
                  fieldName: "secondScreeningMemberIds",
                  roleFilter: "hiring_manager",
                  placeholder: "현업 담당자 이름, 이메일 검색",
                  helpText: "현업 담당자만 추가할 수 있으며, 이 회원은 2차 스크리닝 단계만 조회합니다."
                })}
              </div>
            </div>
            <div class="form-actions">
              <button class="ghost-button" type="button" data-close-screening-position-modal>취소</button>
              <button class="primary-button" type="submit">저장</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `;
}

function getScreeningFolderCreatorName(folder) {
  const creator = state.members.find((member) => member.id === folder.createdById);
  return folder.createdByName || creator?.name || "담당자 미입력";
}

function renderScreeningListFilters(allFolders = []) {
  const member = getCurrentMember();
  const filters = normalizeScreeningFilters(member);
  const units = getScreeningFilterBusinessUnits(member);
  const businessUnitLocked = canViewBusinessUnitScreeningFolders(member);
  const filteredLabel = filters.mineOnly ? "내가 생성한 포지션" : "전체 생성자";

  return `
    <div class="filter-strip screening-filter-strip">
      <div class="field compact-field">
        <label for="screening-business-unit-filter">사업부 분류</label>
        <select class="control-select" id="screening-business-unit-filter" ${businessUnitLocked ? "disabled" : ""}>
          ${businessUnitLocked ? "" : `<option value="all" ${filters.businessUnit === "all" ? "selected" : ""}>전체 사업부</option>`}
          ${units.map((unit) => `<option value="${escapeHtml(unit)}" ${filters.businessUnit === unit ? "selected" : ""}>${escapeHtml(unit)}</option>`).join("")}
        </select>
      </div>
      <button class="soft-button screening-my-list-button ${filters.mineOnly ? "is-active" : ""}" type="button" data-toggle-screening-mine>
        My List
      </button>
      <span class="small-pill">${escapeHtml(filteredLabel)} · 접근 가능 ${allFolders.length}개</span>
    </div>
  `;
}

function updateScreeningBusinessUnitFilter(value) {
  state.screeningFilters.businessUnit = normalizeBusinessUnit(value) || "all";
  normalizeScreeningFilters();
  persistState();
  renderScreening();
}

function toggleScreeningMineFilter() {
  state.screeningFilters.mineOnly = !state.screeningFilters.mineOnly;
  normalizeScreeningFilters();
  persistState();
  renderScreening();
}

function renderScreeningFolderList(folders) {
  if (!folders.length) {
    return `<div class="empty-state">접근 가능한 포지션이 없습니다.</div>`;
  }

  return `
    <div class="screening-folder-list">
      ${folders.map((folder) => {
        const active = folder.id === state.selectedScreeningFolderId;
        const visibleApplicants = folder.applicants.filter((item) => canViewScreeningApplicant(item));
        const passed = visibleApplicants.filter((item) => ["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(item.stage)).length;

        return `
          <button class="screening-folder-card ${active ? "is-active" : ""}" type="button" data-select-screening-folder="${escapeHtml(folder.id)}">
            <strong>${escapeHtml(folder.title)}</strong>
            <span>${escapeHtml(folder.department || "채용 부서 미입력")} · ${escapeHtml(folder.positionName || "포지션 미입력")}</span>
            <small>${escapeHtml(folder.businessUnit || "사업부 미입력")} · 담당자 ${escapeHtml(getScreeningFolderCreatorName(folder))}</small>
            <small>지원자 ${visibleApplicants.length}명 · 2차 통과 ${passed}명</small>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function screeningJdSummary(folder) {
  const text = String(folder?.jdText || "").replace(/\s+/g, " ").trim();

  if (text) {
    return text.length > 130 ? `${text.slice(0, 130)}...` : text;
  }

  return folder?.jdAttachment
    ? `${folder.jdAttachment.name} 첨부 파일 기준으로 JD 확인 필요`
    : "JD 요약 정보가 아직 입력되지 않았습니다.";
}

function renderScreeningJdModal(folder) {
  if (!folder || !state.screeningJdModalOpen) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-screening-jd-modal-backdrop>
      <section class="trending-modal screening-jd-modal" role="dialog" aria-modal="true" aria-labelledby="screening-jd-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-jd-modal-title">JD 보기 및 수정</strong>
            <span>포지션 생성 시 입력한 정보와 첨부 JD 파일을 확인하고 수정합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-jd-modal>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form id="screening-jd-form" class="screening-create-form">
            <input type="hidden" name="folderId" value="${escapeHtml(folder.id)}" />
            <div class="field-grid">
              <div class="field">
                <label for="screening-jd-title">포지션 리스트명</label>
                <input class="control-input" id="screening-jd-title" name="title" value="${inputValue(folder.title)}" />
              </div>
              <div class="field">
                <label for="screening-jd-business-unit">사업부</label>
                <select class="control-select" id="screening-jd-business-unit" name="businessUnit">
                  ${renderScreeningBusinessUnitOptions(folder.businessUnit)}
                </select>
              </div>
              <div class="field">
                <label for="screening-jd-department">채용 부서명</label>
                <input class="control-input" id="screening-jd-department" name="department" value="${inputValue(folder.department)}" />
              </div>
              <div class="field">
                <label for="screening-jd-position">포지션명</label>
                <input class="control-input" id="screening-jd-position" name="positionName" value="${inputValue(folder.positionName)}" />
              </div>
              <div class="field full">
                <label for="screening-jd-text">JD 직접 입력</label>
                <textarea class="control-textarea" id="screening-jd-text" name="jdText" rows="7">${escapeHtml(folder.jdText || "")}</textarea>
              </div>
              <div class="field full">
                <label for="screening-jd-file">JD 첨부 변경</label>
                ${folder.jdAttachment ? `
                  <div class="screening-file-preview">
                    <span>
                      <strong>현재 첨부 파일</strong>
                      <small>${escapeHtml(folder.jdAttachment.name)} (${formatFileSize(folder.jdAttachment.size)})</small>
                    </span>
                    ${folder.jdAttachment.dataUrl ? `<a class="soft-button compact-button" href="${escapeHtml(folder.jdAttachment.dataUrl)}" download="${escapeHtml(folder.jdAttachment.name)}">다운로드</a>` : ""}
                  </div>
                ` : `<span class="form-help">첨부된 JD 파일이 없습니다.</span>`}
                <input class="control-input" id="screening-jd-file" name="jdFile" type="file" />
              </div>
            </div>
            <div class="form-actions">
              <button class="ghost-button" type="button" data-close-screening-jd-modal>취소</button>
              <button class="primary-button" type="submit">저장</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `;
}

function renderScreeningAccessModal(folder) {
  if (!folder || !state.screeningAccessModalOpen || !canManageScreeningFolder(folder)) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-screening-access-modal-backdrop>
      <section class="trending-modal screening-access-modal" role="dialog" aria-modal="true" aria-labelledby="screening-access-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-access-modal-title">권한 관리</strong>
            <span>포지션 기본 접근 권한과 단계별 조회 권한을 분리해 관리합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-access-modal>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form class="screening-access-panel" data-screening-access-form="${escapeHtml(folder.id)}">
            <section class="screening-access-section">
              <strong>기본 접근 회원</strong>
              <span>채용 담당자, 운영진 등 포지션 전반을 함께 볼 회원입니다.</span>
              ${renderScreeningAccessPicker(folder, {
                helpText: "회원 이름, 이메일, 권한으로 검색해 기본 접근 회원을 추가합니다."
              })}
            </section>
            <section class="screening-access-section">
              <strong>지원자 접수 권한</strong>
              <span>서치펌 담당자만 지정합니다. 지정된 회원은 지원자 접수 단계만 조회할 수 있습니다.</span>
              ${renderScreeningAccessPicker(folder, {
                fieldName: "receptionMemberIds",
                roleFilter: "search_firm",
                placeholder: "서치펌 담당자 이름, 이메일 검색",
                helpText: "서치펌 담당자만 검색 결과에 표시됩니다."
              })}
            </section>
            <section class="screening-access-section">
              <strong>2차 스크리닝 권한</strong>
              <span>현업 담당자만 지정합니다. 지정된 회원은 2차 스크리닝 단계만 조회할 수 있습니다.</span>
              ${renderScreeningAccessPicker(folder, {
                fieldName: "secondScreeningMemberIds",
                roleFilter: "hiring_manager",
                placeholder: "현업 담당자 이름, 이메일 검색",
                helpText: "현업 담당자만 검색 결과에 표시됩니다."
              })}
            </section>
            <div class="form-actions">
              <button class="ghost-button" type="button" data-close-screening-access-modal>취소</button>
              <button class="primary-button" type="submit">권한 저장</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `;
}

function renderApplicantRegistrationModal(folder) {
  if (!folder || !state.screeningApplicantModalOpen) {
    return "";
  }

  const searchFirmMember = isSearchFirmRole();
  const currentMember = getCurrentMember();

  return `
    <div class="trending-modal-backdrop" data-screening-applicant-modal-backdrop>
      <section class="trending-modal screening-applicant-modal" role="dialog" aria-modal="true" aria-labelledby="screening-applicant-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-applicant-modal-title">지원자 등록</strong>
            <span>${searchFirmMember
              ? "접수 저장 후 접수 탭에서 최종 제출하면 1차 스크리닝으로 이동합니다."
              : `${escapeHtml(folder.title)} 포지션에 지원자 정보를 등록합니다.`}</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-applicant-modal>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form id="screening-applicant-form" class="screening-applicant-form">
            <div class="field-grid">
              <input type="hidden" name="folderId" value="${escapeHtml(folder.id)}" />
              <div class="field">
                <label for="screening-applicant-name">이름</label>
                <input class="control-input" id="screening-applicant-name" name="name" />
              </div>
              <div class="field">
                <label for="screening-applicant-source">등록 경로</label>
                ${searchFirmMember
                  ? `<input type="hidden" name="sourceType" value="search_firm" /><input class="control-input" id="screening-applicant-source" value="서치펌 등록" disabled />`
                  : `<select class="control-select" id="screening-applicant-source" name="sourceType">
                      <option value="direct" selected>채용담당자 직접</option>
                      <option value="search_firm">서치펌 등록</option>
                    </select>`}
              </div>
              <div class="field">
                <label for="screening-applicant-firm">서치펌 담당자</label>
                ${searchFirmMember
                  ? `<input type="hidden" name="searchFirmMemberId" value="${escapeHtml(currentMember?.id || "")}" /><input class="control-input" id="screening-applicant-firm" value="${escapeHtml([currentMember?.name, currentMember?.email].filter(Boolean).join(" · "))}" disabled />`
                  : `<select class="control-select" id="screening-applicant-firm" name="searchFirmMemberId">
                      ${activeSearchFirmOptions()}
                    </select>`}
              </div>
              <div class="field">
                <label for="screening-applicant-company">현재/최근 회사</label>
                <input class="control-input" id="screening-applicant-company" name="company" />
              </div>
              <div class="field">
                <label for="screening-applicant-role">현재/최근 직무</label>
                <input class="control-input" id="screening-applicant-role" name="currentRole" />
              </div>
              <div class="field">
                <label for="screening-applicant-email">이메일</label>
                <input class="control-input" id="screening-applicant-email" name="email" type="email" />
              </div>
              <div class="field">
                <label for="screening-applicant-phone">휴대폰 번호</label>
                <input class="control-input" id="screening-applicant-phone" name="phone" type="tel" />
              </div>
              <div class="field">
                <label for="screening-applicant-resume">이력서 첨부</label>
                <input class="control-input" id="screening-applicant-resume" name="resumeFile" type="file" />
              </div>
              <div class="field full">
                <label for="screening-applicant-summary">지원자 핵심 경력/역량</label>
                <textarea class="control-textarea" id="screening-applicant-summary" name="summary" rows="4"></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button class="ghost-button" type="button" data-close-screening-applicant-modal>취소</button>
              <button class="primary-button" type="submit">${searchFirmMember ? "접수 저장" : "저장"}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `;
}

function screeningFitDetail(folder, applicant) {
  const jdTokens = tokenizeScreeningText([
    folder.title,
    folder.businessUnit,
    folder.department,
    folder.positionName,
    folder.jdText
  ].join(" "));
  const applicantTokens = tokenizeScreeningText([
    applicant.name,
    applicant.company,
    applicant.currentRole,
    applicant.summary
  ].join(" "));
  const matched = jdTokens.filter((token) => applicantTokens.includes(token));
  const missing = jdTokens.filter((token) => !applicantTokens.includes(token));
  const ratio = jdTokens.length ? matched.length / jdTokens.length : 0;
  const score = Math.round(ratio * 100);

  return {
    score,
    matched,
    missing,
    summary: applicant.fitComment || evaluateApplicantFit(folder, applicant).comment
  };
}

function renderScreeningTimeline(applicant) {
  const decisionLabels = {
    pass: "합격",
    reject: "불합격",
    draft_pass: "통과 예정",
    reopened: "재검토"
  };
  const rows = [
    { label: "지원자 등록", value: `${applicant.registeredByName || "-"} · ${applicant.createdAt || "-"}` },
    applicant.submittedAt
      ? { label: "최종 제출", value: `${applicant.submittedByName || "-"} · ${applicant.submittedAt || "-"}` }
      : null,
    applicant.firstScreening
      ? { label: "1차 스크리닝", value: `${decisionLabels[applicant.firstScreening.decision] || applicant.firstScreening.decision || "-"} · ${applicant.firstScreening.by || "-"} · ${applicant.firstScreening.at || "-"}` }
      : null,
    applicant.secondScreening
      ? { label: "2차 스크리닝", value: `${decisionLabels[applicant.secondScreening.decision] || applicant.secondScreening.decision || "-"} · ${applicant.secondScreening.by || "-"} · ${applicant.secondScreening.at || "-"}` }
      : null,
    applicant.contactRequest
      ? { label: "연락처 요청", value: `${applicant.contactRequest.recipient || "-"} · ${applicant.contactRequest.sentAt || "-"}` }
      : null,
    applicant.phoneInterviewMail
      ? { label: "전화면접 안내", value: `${applicant.phoneInterviewMail.recipient || "-"} · ${applicant.phoneInterviewMail.sentAt || "-"}` }
      : null
  ].filter(Boolean);

  return `
    <div class="screening-detail-list">
      ${rows.map((row) => `
        <div>
          <span>${escapeHtml(row.label)}</span>
          <strong>${escapeHtml(row.value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function attachmentFileType(attachment = {}) {
  const name = String(attachment.name || "").toLowerCase();
  const type = String(attachment.type || "").toLowerCase();
  const dataUrl = String(attachment.dataUrl || "").toLowerCase();

  if (type.includes("pdf") || name.endsWith(".pdf") || dataUrl.startsWith("data:application/pdf")) return "pdf";
  if (type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(name)) return "image";
  if (type.startsWith("text/") || /\.(txt|md|csv|log)$/i.test(name) || dataUrl.startsWith("data:text/")) return "text";
  if (/\.(docx|hwpx|hwp|doc)$/i.test(name)) return "document";
  return "unknown";
}

function renderResumeInlineViewer(attachment, applicant) {
  if (!attachment) {
    return `<div class="empty-state compact-empty">등록된 이력서 첨부 파일이 없습니다.</div>`;
  }

  const fileType = attachmentFileType(attachment);
  const fileName = attachment.name || `${applicant.name || "지원자"}_resume`;
  const extractedText = String(attachment.text || "").trim()
    || (fileType === "text" ? decodeTextDataUrl(attachment.dataUrl) : "").trim();

  if (fileType === "pdf" && attachment.dataUrl) {
    return `
      <div class="screening-resume-viewer screening-resume-pdf-viewer" data-screening-pdf-viewer="${escapeHtml(applicant.id)}">
        <div class="screening-resume-loading">
          <strong>PDF 이력서를 불러오는 중입니다.</strong>
          <span>브라우저 다운로드 화면으로 이동하지 않고 이 영역에 바로 표시합니다.</span>
        </div>
      </div>
    `;
  }

  if (fileType === "image" && attachment.dataUrl) {
    return `
      <div class="screening-resume-viewer">
        <img class="screening-resume-image" src="${escapeHtml(attachment.dataUrl)}" alt="${escapeHtml(fileName)} 이력서 미리보기" />
      </div>
    `;
  }

  if (extractedText) {
    return `
      <div class="screening-resume-viewer screening-resume-text-viewer">
        <pre>${escapeHtml(extractedText)}</pre>
      </div>
    `;
  }

  return `
    <div class="screening-resume-viewer screening-resume-placeholder">
      <strong>이 파일 형식은 브라우저 내 직접 미리보기가 제한됩니다.</strong>
      <span>PDF, 이미지, TXT 또는 텍스트 추출 가능한 DOCX/HWPX 파일을 등록하면 이 영역에서 바로 확인할 수 있습니다.</span>
    </div>
  `;
}

async function renderPdfAttachmentToViewer(viewer, attachment) {
  if (!viewer || !attachment?.dataUrl || viewer.dataset.rendered === "true") {
    return;
  }

  viewer.dataset.rendered = "true";

  try {
    const bytes = dataUrlToUint8Array(attachment.dataUrl);

    if (!bytes.length) {
      throw new Error("PDF 데이터를 읽을 수 없습니다.");
    }

    const pdfjs = await loadPdfJs();
    const pdf = await pdfjs.getDocument({ data: bytes, useWorkerFetch: true }).promise;
    const pageCount = pdf.numPages || 0;
    const maxWidth = Math.min(Math.max(320, viewer.clientWidth || 720), 900);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    viewer.innerHTML = "";

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = maxWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });
      const pageShell = document.createElement("div");
      const pageLabel = document.createElement("span");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      pageShell.className = "screening-pdf-page";
      pageLabel.textContent = `${pageNumber} / ${pageCount}`;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      pageShell.append(pageLabel, canvas);
      viewer.append(pageShell);

      await page.render({ canvasContext: context, viewport }).promise;
    }

    if (!pageCount) {
      throw new Error("PDF 페이지를 찾지 못했습니다.");
    }
  } catch (error) {
    console.warn("Inline PDF viewer failed.", error);
    const fallbackText = String(attachment.text || "").trim();
    viewer.classList.add("screening-resume-text-viewer");
    viewer.innerHTML = fallbackText
      ? `<pre>${escapeHtml(fallbackText)}</pre>`
      : `
        <div class="screening-resume-placeholder">
          <strong>PDF를 화면 안에서 렌더링하지 못했습니다.</strong>
          <span>파일 자체는 등록되어 있지만, 현재 브라우저가 PDF 렌더링을 차단했습니다.</span>
        </div>
      `;
  }
}

function hydrateScreeningResumeViewers(folder = getSelectedScreeningFolder()) {
  if (!folder) {
    return;
  }

  document.querySelectorAll("[data-screening-pdf-viewer]").forEach((viewer) => {
    const applicant = getScreeningApplicant(folder, viewer.dataset.screeningPdfViewer);
    const attachment = applicant?.resumeAttachment;

    if (attachmentFileType(attachment) === "pdf") {
      renderPdfAttachmentToViewer(viewer, attachment);
    }
  });
}

function renderScreeningApplicantDetailModal(folder) {
  if (!folder || !state.screeningApplicantDetailId) {
    return "";
  }

  const applicant = getScreeningApplicant(folder, state.screeningApplicantDetailId);

  if (!applicant || !canViewScreeningApplicant(applicant)) {
    return "";
  }

  const firm = applicant.searchFirmMemberId ? state.members.find((member) => member.id === applicant.searchFirmMemberId) : null;
  const fit = screeningFitDetail(folder, applicant);
  const sourceLabel = applicant.sourceType === "search_firm" ? "서치펌 등록" : "채용담당자 직접 등록";
  const sourceMeta = firm ? `${firm.name} · ${firm.email}` : applicant.registeredByName || "-";

  return `
    <div class="trending-modal-backdrop" data-screening-applicant-detail-backdrop>
      <section class="trending-modal screening-applicant-detail-modal" role="dialog" aria-modal="true" aria-labelledby="screening-applicant-detail-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-applicant-detail-title">${escapeHtml(applicant.name || "지원자 상세")}</strong>
            <span>${escapeHtml([applicant.company, applicant.currentRole].filter(Boolean).join(" · ") || "회사/직무 미입력")}</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-applicant-detail>닫기</button>
        </div>
        <div class="trending-modal-body screening-applicant-detail-body">
          <section class="screening-detail-block">
            <div class="panel-header">
              <h4>지원자 상세 정보</h4>
              ${screeningStageChip(applicant.stage)}
            </div>
            <div class="screening-detail-list">
              <div><span>등록 경로</span><strong>${escapeHtml(sourceLabel)}</strong><small>${escapeHtml(sourceMeta)}</small></div>
              <div><span>이메일</span><strong>${escapeHtml(applicant.email || "-")}</strong></div>
              <div><span>휴대폰 번호</span><strong>${escapeHtml(applicant.phone || "-")}</strong></div>
              <div><span>최초 등록일</span><strong>${escapeHtml(applicant.createdAt || "-")}</strong></div>
              <div><span>최종 업데이트</span><strong>${escapeHtml(applicant.updatedAt || "-")}</strong></div>
            </div>
            ${applicant.summary ? `<p class="screening-detail-note">${escapeHtml(applicant.summary)}</p>` : ""}
          </section>

          <section class="screening-detail-block">
            <div class="panel-header">
              <h4>이력서</h4>
              ${applicant.resumeAttachment ? `<span class="small-pill">${formatFileSize(applicant.resumeAttachment.size)}</span>` : ""}
            </div>
            ${applicant.resumeAttachment ? `
              <div class="screening-file-preview">
                <span>
                  <strong>${escapeHtml(applicant.resumeAttachment.name || "첨부 이력서")}</strong>
                  <small>${escapeHtml(applicant.resumeAttachment.type || "파일 형식 미확인")}</small>
                </span>
              </div>
              ${renderResumeInlineViewer(applicant.resumeAttachment, applicant)}
            ` : `<div class="empty-state compact-empty">등록된 이력서 첨부 파일이 없습니다.</div>`}
          </section>

          <section class="screening-detail-block">
            <div class="panel-header">
              <h4>직무적합도 상세 분석</h4>
              ${fitGradeChip(applicant.fitGrade)}
            </div>
            <div class="screening-fit-detail">
              <div><span>매칭 점수</span><strong>${fit.score}%</strong></div>
              <div><span>분석 의견</span><strong>${escapeHtml(fit.summary)}</strong></div>
              <div><span>일치 키워드</span><strong>${escapeHtml(fit.matched.slice(0, 12).join(", ") || "직접 일치 키워드 없음")}</strong></div>
              <div><span>추가 확인 키워드</span><strong>${escapeHtml(fit.missing.slice(0, 12).join(", ") || "추가 확인 항목 없음")}</strong></div>
            </div>
          </section>

          <section class="screening-detail-block">
            <div class="panel-header">
              <h4>진행 이력</h4>
            </div>
            ${renderScreeningTimeline(applicant)}
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderApplicantContactForm(folder, applicant, locked = false) {
  const canEdit = !locked && canManageScreeningContact(folder, applicant);

  if (!["second_pass", "contact_requested", "contact_ready"].includes(applicant.stage) && !(applicant.sourceType === "search_firm" && applicant.stage === "interview_mail_sent")) {
    return `
      <div class="summary-cell">
        <strong>${escapeHtml(applicant.email || "-")}</strong>
        <span>${escapeHtml(applicant.phone || "전화번호 미입력")}</span>
      </div>
    `;
  }

  return `
    <form class="screening-contact-form" data-screening-contact-form="${escapeHtml(applicant.id)}">
      <input class="control-input compact-input" name="email" type="email" placeholder="이메일" value="${inputValue(applicant.email)}" ${canEdit ? "" : "disabled"} />
      <input class="control-input compact-input" name="phone" type="tel" placeholder="휴대폰 번호" value="${inputValue(applicant.phone)}" ${canEdit ? "" : "disabled"} />
      ${canEdit ? `<button class="soft-button compact-button" type="submit">연락처 저장</button>` : ""}
    </form>
  `;
}

function renderApplicantActions(folder, applicant, step = state.screeningDetailStep) {
  const actions = [];
  const locked = isScreeningStageSnapshotLocked(applicant, step);
  const revertAction = {
    registered: "접수로 되돌리기",
    first_pass: "1차로 되돌리기",
    first_reject: "1차 재검토",
    second_draft: "통과 예정 취소",
    second_reject: "2차 재검토",
    second_pass: "2차로 되돌리기",
    contact_requested: "2차로 되돌리기",
    contact_ready: "2차로 되돌리기",
    interview_mail_sent: "2차로 되돌리기"
  }[applicant.stage];

  if (locked) {
    return `<span class="muted-text">${escapeHtml(SCREENING_STAGE_LABELS[applicant.stage] || applicant.stage)} · 잠금</span>`;
  }

  if (canSubmitScreeningApplicant(folder, applicant)) {
    actions.push(`<button class="primary-button compact-button" type="button" data-screening-submit-applicant="${applicant.id}">최종 제출</button>`);
  }

  if (applicant.stage === "registered" && canRunFirstScreening(folder)) {
    actions.push(`<button class="soft-button compact-button" type="button" data-screening-first-pass="${applicant.id}">1차 합격</button>`);
    actions.push(`<button class="ghost-button danger-button compact-button" type="button" data-screening-first-reject="${applicant.id}">불합격</button>`);
  }

  if (applicant.stage === "first_pass" && canRunSecondScreening(folder)) {
    actions.push(`<button class="soft-button compact-button" type="button" data-screening-second-draft="${applicant.id}">통과 예정 저장</button>`);
    actions.push(`<button class="ghost-button danger-button compact-button" type="button" data-screening-second-reject="${applicant.id}">2차 제외</button>`);
  }

  if (applicant.stage === "second_pass" && applicant.sourceType === "search_firm" && (!applicant.email || !applicant.phone)) {
    actions.push(`<button class="soft-button compact-button" type="button" data-screening-request-contact="${applicant.id}">서치펌 연락처 요청</button>`);
  }

  if (["second_pass", "contact_ready"].includes(applicant.stage) && applicant.email && applicant.phone && isRecruitingRole()) {
    actions.push(`<button class="primary-button compact-button" type="button" data-screening-send-interview="${applicant.id}">전화면접 안내 발송</button>`);
  }

  if (revertAction && canAccessScreeningFolder(folder) && (isRecruitingRole() || isHiringManagerRole())) {
    actions.push(`<button class="ghost-button compact-button" type="button" data-screening-revert="${applicant.id}">${revertAction}</button>`);
  }

  if (!actions.length && isSearchFirmRole() && applicant.sourceType === "search_firm" && applicant.stage !== "reception") {
    return `<span class="muted-text">제출 완료 · ${escapeHtml(SCREENING_STAGE_LABELS[applicant.stage] || applicant.stage)}</span>`;
  }

  if (!actions.length) {
    return `<span class="muted-text">대기</span>`;
  }

  return `<div class="member-actions">${actions.join("")}</div>`;
}

function getScreeningStepApplicants(folder, step = state.screeningDetailStep) {
  const stageMap = {
    reception: SCREENING_STAGE_ORDER,
    first: ["registered", "first_pass", "first_reject", "second_draft", "second_pass", "second_reject", "contact_requested", "contact_ready", "interview_mail_sent"],
    second: ["first_pass", "second_draft", "second_pass", "second_reject", "contact_requested", "contact_ready", "interview_mail_sent"],
    mail: ["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"]
  };
  const stages = stageMap[step] || stageMap.reception;

  return folder.applicants.filter((applicant) => {
    if (!canViewScreeningApplicant(applicant)) {
      return false;
    }

    if (step === "reception" && isSearchFirmRole()) {
      return applicant.sourceType === "search_firm" &&
        (applicant.searchFirmMemberId === state.currentUserId || applicant.registeredById === state.currentUserId);
    }

    return stages.includes(applicant.stage);
  });
}

function screeningStepCount(folder, step) {
  return getScreeningStepApplicants(folder, step).length;
}

function getScreeningStepRank(step) {
  return {
    reception: 0,
    first: 1,
    second: 2,
    mail: 3
  }[step] ?? 0;
}

function getScreeningApplicantActiveStep(applicant) {
  if (["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(applicant.stage)) {
    return "mail";
  }

  if (["first_pass", "second_draft", "second_reject"].includes(applicant.stage)) {
    return "second";
  }

  if (["registered", "first_reject"].includes(applicant.stage)) {
    return "first";
  }

  return "reception";
}

function isScreeningStageSnapshotLocked(applicant, step) {
  return getScreeningStepRank(getScreeningApplicantActiveStep(applicant)) > getScreeningStepRank(step);
}

function getScreeningStageSnapshotNote(applicant, step) {
  if (!isScreeningStageSnapshotLocked(applicant, step)) {
    return "";
  }

  const currentStep = SCREENING_DETAIL_STEPS.find((item) => item.id === getScreeningApplicantActiveStep(applicant))?.label || "다음 단계";
  const currentStage = SCREENING_STAGE_LABELS[applicant.stage] || applicant.stage;

  return `${currentStep}로 복사되어 진행 중입니다. 현재 상태: ${currentStage}`;
}

function getVisibleScreeningDetailSteps(folder, member = getCurrentMember()) {
  return SCREENING_DETAIL_STEPS.filter((step) => canAccessScreeningStep(folder, step.id, member));
}

function getCurrentScreeningDetailStep(folder) {
  const visibleSteps = getVisibleScreeningDetailSteps(folder);
  const currentStep = visibleSteps.some((step) => step.id === state.screeningDetailStep)
    ? state.screeningDetailStep
    : visibleSteps[0]?.id || "reception";

  state.screeningDetailStep = currentStep;
  return currentStep;
}

function renderScreeningStepNav(folder) {
  const visibleSteps = getVisibleScreeningDetailSteps(folder);
  const currentStep = getCurrentScreeningDetailStep(folder);

  return `
    <nav class="screening-step-nav" aria-label="스크리닝 단계">
      ${visibleSteps.map((step) => `
        <button class="${step.id === currentStep ? "is-active" : ""}" type="button" data-screening-detail-step="${step.id}">
          <span>${escapeHtml(step.label)}</span>
          <strong>${screeningStepCount(folder, step.id)}명</strong>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderApplicantCard(folder, applicant, step = state.screeningDetailStep) {
  const firm = applicant.searchFirmMemberId ? state.members.find((member) => member.id === applicant.searchFirmMemberId) : null;
  const sourceLabel = applicant.sourceType === "search_firm" ? "서치펌" : "직접 등록";
  const sourceMeta = firm ? `${firm.name} · ${firm.email}` : applicant.registeredByName || "-";
  const locked = isScreeningStageSnapshotLocked(applicant, step);
  const lockedNote = getScreeningStageSnapshotNote(applicant, step);

  return `
    <article class="screening-applicant-card ${locked ? "is-locked" : ""}">
      <div class="screening-applicant-main">
        <div class="summary-cell">
          <button class="screening-applicant-name-button" type="button" data-open-screening-applicant-detail="${escapeHtml(applicant.id)}">${escapeHtml(applicant.name || "-")}</button>
          <span>${escapeHtml([applicant.company, applicant.currentRole].filter(Boolean).join(" · ") || "회사/직무 미입력")}</span>
          ${applicant.resumeAttachment ? `<span>첨부: ${escapeHtml(applicant.resumeAttachment.name)} (${formatFileSize(applicant.resumeAttachment.size)})</span>` : ""}
          ${lockedNote ? `<span class="screening-lock-note">${escapeHtml(lockedNote)}</span>` : ""}
        </div>
        <div class="screening-card-tags">
          ${fitGradeChip(applicant.fitGrade)}
          ${screeningStageChip(applicant.stage)}
        </div>
      </div>
      <div class="screening-applicant-grid">
        <div class="summary-cell">
          <span>등록 경로</span>
          <strong>${escapeHtml(sourceLabel)}</strong>
          <small>${escapeHtml(sourceMeta)}</small>
        </div>
        <div class="summary-cell">
          <span>직무적합도 분석</span>
          <strong>${escapeHtml(applicant.fitComment || "분석 의견 없음")}</strong>
        </div>
        <div class="screening-card-field">
          <span>연락처</span>
          ${renderApplicantContactForm(folder, applicant, locked)}
        </div>
        <div class="screening-card-field">
          <span>액션</span>
          ${renderApplicantActions(folder, applicant, step)}
        </div>
      </div>
    </article>
  `;
}

function renderApplicantList(folder, applicants, emptyText, step = state.screeningDetailStep) {
  if (!applicants.length) {
    return `<div class="empty-state compact-empty">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="screening-applicant-list">
      ${applicants.map((applicant) => renderApplicantCard(folder, applicant, step)).join("")}
    </div>
  `;
}

function renderSecondScreeningPanel(folder) {
  const draftApplicants = folder.applicants.filter((applicant) => applicant.stage === "second_draft");
  const canFinalize = canRunSecondScreening(folder);

  return `
    <form class="profile-panel" id="screening-final-pass-form">
      <div class="panel-header">
        <h4>2단계 스크리닝 최종 통과</h4>
        <span class="small-pill">통과 예정 ${draftApplicants.length}명</span>
      </div>
      <input type="hidden" name="folderId" value="${escapeHtml(folder.id)}" />
      <div class="field-grid">
        <div class="field">
          <label for="screening-panel-names">면접위원 이름</label>
          <input class="control-input" id="screening-panel-names" name="names" value="${inputValue(folder.interviewPanel.names)}" placeholder="예: 김현업, 박리더" />
        </div>
        <div class="field">
          <label for="screening-panel-emails">면접위원 메일</label>
          <input class="control-input" id="screening-panel-emails" name="emails" value="${inputValue(folder.interviewPanel.emails)}" placeholder="쉼표로 여러 명 입력" />
        </div>
        <div class="field full">
          <label for="screening-panel-availability">면접 가능 시간대</label>
          <textarea class="control-textarea" id="screening-panel-availability" name="availability" rows="3">${escapeHtml(folder.interviewPanel.availability)}</textarea>
        </div>
      </div>
      <div class="screening-draft-list">
        ${draftApplicants.length ? draftApplicants.map((applicant) => `<span class="status-chip chip-amber">${escapeHtml(applicant.name)}</span>`).join("") : `<span class="muted-text">통과 예정으로 저장된 지원자가 없습니다.</span>`}
      </div>
      <div class="form-actions">
        <button class="primary-button" type="submit" ${draftApplicants.length && canFinalize ? "" : "disabled"}>최종 통과</button>
      </div>
    </form>
  `;
}

function renderScreeningMailQueue(folder) {
  const passedApplicants = folder.applicants.filter((applicant) => ["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(applicant.stage));

  return `
    <section class="profile-panel">
      <div class="panel-header">
        <h4>3단계 전화면접 안내</h4>
        <span class="small-pill">메일 발송 큐 ${passedApplicants.length}명</span>
      </div>
      <div class="screening-mail-guide">
        <strong>발송 규칙</strong>
        <span>직접 등록 지원자는 연락처가 있으면 후보자 및 면접위원에게 전화면접 안내 메일을 보냅니다.</span>
        <span>서치펌 등록 지원자 중 연락처가 없으면 서치펌 담당자에게 이메일/전화번호 요청 메일을 먼저 보냅니다.</span>
      </div>
    </section>
  `;
}

function renderScreeningStepContent(folder) {
  const step = getCurrentScreeningDetailStep(folder);

  if (step === "reception") {
    const applicants = getScreeningStepApplicants(folder, "reception");
    const title = isSearchFirmRole() ? "지원자 접수 및 진행 현황" : "지원자 접수";
    const emptyText = isSearchFirmRole()
      ? "아직 접수하거나 제출한 지원자가 없습니다."
      : "접수 대기 중인 지원자가 없습니다.";

    return `
      <section class="profile-panel">
        <div class="panel-header">
          <h4>${escapeHtml(title)}</h4>
          <span class="small-pill">접수 이력 ${applicants.length}명</span>
        </div>
        ${renderApplicantList(folder, applicants, emptyText, "reception")}
      </section>
    `;
  }

  if (step === "second") {
    const applicants = getScreeningStepApplicants(folder, "second");

    return `
      <section class="profile-panel">
        <div class="panel-header">
          <h4>2차 스크리닝 리스트</h4>
          <span class="small-pill">2차 도달 ${applicants.length}명</span>
        </div>
        ${renderApplicantList(folder, applicants, "1차 합격 처리된 지원자가 없습니다.", "second")}
      </section>
      ${renderSecondScreeningPanel(folder)}
    `;
  }

  if (step === "mail") {
    const applicants = getScreeningStepApplicants(folder, "mail");

    return `
      <section class="profile-panel">
        <div class="panel-header">
          <h4>전화면접 안내 대상</h4>
          <span class="small-pill">대상 ${applicants.length}명</span>
        </div>
        ${renderApplicantList(folder, applicants, "2차 최종 통과 지원자가 없습니다.", "mail")}
      </section>
      ${renderScreeningMailQueue(folder)}
    `;
  }

  const applicants = getScreeningStepApplicants(folder, "first");

  return `
    <section class="profile-panel">
      <div class="panel-header">
        <h4>지원자별 스크리닝 1차</h4>
        <span class="small-pill">1차 도달 ${applicants.length}명</span>
      </div>
      ${renderApplicantList(folder, applicants, "1차 스크리닝 대상 지원자가 없습니다.", "first")}
    </section>
  `;
}

function renderScreeningFolderDetail(folder) {
  if (!folder) {
    return `
      <section class="content-panel">
        <div class="empty-state">포지션 리스트에서 포지션을 선택하거나 새로 생성해주세요.</div>
      </section>
    `;
  }

  return `
    <div class="screening-detail">
      <section class="profile-panel screening-folder-hero">
        <div class="screening-folder-main">
          <p class="eyebrow">${escapeHtml(folder.businessUnit || "사업부 미입력")}</p>
          <h4>${escapeHtml(folder.title)}</h4>
          <p>${escapeHtml([folder.department, folder.positionName].filter(Boolean).join(" · ") || "채용 부서/포지션 미입력")}</p>
          <p class="screening-jd-summary"><strong>JD 요약</strong>${escapeHtml(screeningJdSummary(folder))}</p>
          ${folder.jdAttachment ? `<span class="small-pill">JD 첨부: ${escapeHtml(folder.jdAttachment.name)} (${formatFileSize(folder.jdAttachment.size)})</span>` : ""}
        </div>
        <div class="screening-folder-side">
          <div class="panel-actions">
            <button class="ghost-button compact-button" type="button" data-back-screening-list>포지션 리스트</button>
            <button class="ghost-button compact-button" type="button" data-open-screening-jd-modal>JD 보기</button>
            ${canManageScreeningFolder(folder) ? `<button class="ghost-button compact-button" type="button" data-open-screening-access-modal>권한 관리</button>` : ""}
            ${canRegisterScreeningApplicant(folder) ? `<button class="primary-button compact-button" type="button" data-open-screening-applicant-modal>지원자 등록</button>` : ""}
          </div>
        </div>
      </section>

      ${renderScreeningStepNav(folder)}
      ${renderScreeningStepContent(folder)}
    </div>
  `;
}

function renderScreening() {
  const container = $("#screening-content");

  if (!container) {
    return;
  }

  normalizeScreeningFilters();
  const allFolders = getAccessibleScreeningFolders(getCurrentMember(), { applyFilters: false });
  const folders = getAccessibleScreeningFolders();
  const selectedFolder = getSelectedScreeningFolder();

  if (selectedFolder && state.selectedScreeningFolderId !== selectedFolder.id) {
    state.selectedScreeningFolderId = selectedFolder.id;
  }

  if (state.screeningPage === "detail" && !selectedFolder) {
    state.screeningPage = "list";
  }

  if (selectedFolder && !canAccessScreeningStep(selectedFolder, state.screeningDetailStep)) {
    getCurrentScreeningDetailStep(selectedFolder);
  }

  if (state.screeningPage === "detail") {
    container.innerHTML = `
      <div class="screening-detail-page">
        ${renderScreeningFolderDetail(selectedFolder)}
      </div>
      ${renderApplicantRegistrationModal(selectedFolder)}
      ${renderScreeningJdModal(selectedFolder)}
      ${renderScreeningAccessModal(selectedFolder)}
      ${renderScreeningApplicantDetailModal(selectedFolder)}
    `;
    hydrateScreeningResumeViewers(selectedFolder);
    return;
  }

  container.innerHTML = `
    <div class="screening-list-page">
      <section class="content-panel">
        <div class="panel-header">
          <h4>포지션 리스트</h4>
          <div class="panel-actions">
            <span class="small-pill">${folders.length}개</span>
            ${canCreateScreeningFolder() ? `<button class="primary-button compact-button" type="button" data-open-screening-position-modal>포지션 생성</button>` : ""}
          </div>
        </div>
        ${renderScreeningListFilters(allFolders)}
        ${renderScreeningFolderList(folders)}
      </section>
    </div>
    ${renderPositionCreateModal()}
  `;
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
            <input class="control-input" id="candidate-name" name="name" autocomplete="off" />
          </div>
          <div class="field">
            <label for="candidate-company">현재/최근 회사</label>
            <input class="control-input" id="candidate-company" name="company" autocomplete="organization" />
          </div>
          <div class="field">
            <label for="candidate-role">직무</label>
            <input class="control-input" id="candidate-role" name="role" autocomplete="off" />
          </div>
          <div class="field">
            <label for="candidate-organization">사업부</label>
            <select class="control-select" id="candidate-organization" name="organization">
              ${renderBusinessUnitOptions()}
            </select>
          </div>
          <div class="field">
            <label for="candidate-visibility">공개 범위</label>
            <select class="control-select" id="candidate-visibility" name="visibility">
              ${renderCandidateVisibilityOptions("all")}
            </select>
            <span class="field-caption">사업부 공개는 해당 사업부 회원과 관리자/부문 담당자만 조회할 수 있습니다.</span>
          </div>
          <div class="field">
            <label for="candidate-owner">담당자</label>
            <select class="control-select" id="candidate-owner" name="owner">
              ${renderOwnerOptions(getDefaultOwnerName(), { includePlaceholder: !getAssignableMembers().length })}
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
      : `<div class="empty-state">찾고 싶은 인재 조건을 자연어로 입력하면 조회 가능한 Pool에서 적합도 높은 후보자를 찾아드립니다.</div>`;

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

function policySearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^0-9a-z가-힣+#.]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function policyTokens(value) {
  const baseTokens = policySearchText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !SEARCH_STOPWORDS.has(token));
  const expanded = [];

  baseTokens.forEach((token) => {
    expanded.push(token);

    if (token.includes("면접위원")) {
      expanded.push("면접", "위원", "면접관", "인터뷰어", "평가위원", "평가");
    }

    if (token.includes("평가위원")) {
      expanded.push("평가", "위원", "면접위원", "면접관", "인터뷰어");
    }
  });

  return [...new Set(expanded)];
}

const POLICY_HIGHLIGHT_GENERIC_TOKENS = new Set([
  "기준", "면접", "채용", "평가", "관련", "질문", "소스", "직무"
]);

function expandPolicyQueryTokens(rawQuery, queryTokens) {
  const expanded = [...queryTokens];
  const intent = getPolicyQuestionIntent(rawQuery);

  if (intent.committeeCount) {
    expanded.push(
      "위원",
      "평가위원",
      "평가 위원",
      "면접위원",
      "면접관",
      "인터뷰어",
      "패널",
      "구성",
      "인원",
      "참여",
      "3인",
      "명",
      "이상",
      "시니어",
      "파트장"
    );
  }

  return [...new Set(expanded.map((token) => policySearchText(token)).filter((token) => token.length >= 2))];
}

function splitPolicyContentIntoPassages(source) {
  const paragraphs = normalizePolicyText(source.content)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const passages = [];

  paragraphs.forEach((paragraph, paragraphIndex) => {
    if (paragraph.length <= 900) {
      passages.push({
        source,
        index: paragraphIndex,
        text: paragraph
      });
      return;
    }

    const sentences = paragraph
      .split(/(?<=[.!?。！？])\s+|(?<=다)\s+(?=[가-힣A-Z0-9])/g)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    let buffer = "";
    let chunkIndex = 0;

    sentences.forEach((sentence) => {
      if (`${buffer} ${sentence}`.trim().length > 850 && buffer) {
        passages.push({
          source,
          index: Number(`${paragraphIndex}${chunkIndex}`),
          text: buffer.trim()
        });
        buffer = sentence;
        chunkIndex += 1;
      } else {
        buffer = `${buffer} ${sentence}`.trim();
      }
    });

    if (buffer) {
      passages.push({
        source,
        index: Number(`${paragraphIndex}${chunkIndex}`),
        text: buffer.trim()
      });
    }
  });

  return passages;
}

function scorePolicyPassage(passage, queryTokens, rawQuery) {
  const text = policySearchText([passage.source.title, passage.text].join(" "));
  const exactQuery = policySearchText(rawQuery);
  const expandedTokens = expandPolicyQueryTokens(rawQuery, queryTokens);
  const intent = getPolicyQuestionIntent(rawQuery);
  let score = exactQuery && text.includes(exactQuery) ? 18 : 0;

  expandedTokens.forEach((token) => {
    if (text.includes(token)) {
      score += token.length >= 4 ? 5 : 3;
    }
  });

  const sentenceScores = splitPolicySentences(passage.text)
    .map((sentence) => scorePolicySentence(sentence, expandedTokens, rawQuery));

  if (sentenceScores.length) {
    score += Math.max(...sentenceScores);
  }

  if (intent.committeeCount) {
    const hasCommitteeTerm = /위원|면접관|인터뷰어|패널|interviewer/i.test(passage.text);
    const hasCountSignal = /\d+\s*(명|인)|[일이삼사오육칠팔구십]\s*(명|인)|이상|이내|이하|구성|참여/.test(passage.text);

    if (hasCommitteeTerm && hasCountSignal) {
      score += 45;
    } else if (!hasCommitteeTerm) {
      score -= 12;
    }
  }

  return score;
}

function splitPolicySentences(text) {
  const prepared = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\s+(?=(?:#{1,6}\s*)?\d+(?:\.\d+)*\s)/g, "\n")
    .replace(/\s+(?=(?:[-*]\s*)?\*{0,3}(?:평가 위원|면접 위원|면접위원|심사위원|면접관|인터뷰어|평가 방식|주요 평가 항목|기술의 깊이|조직 적합성)\s*[:：])/g, "\n");
  const sentences = [];

  prepared.split(/\n+/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return;
    }

    const parts = trimmed
      .split(/(?<=[.!?。！？])\s+|(?<=다)\s+(?=[가-힣A-Z0-9*#])/g)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    sentences.push(...(parts.length ? parts : [trimmed]));
  });

  return sentences;
}

function getPolicyQuestionIntent(referenceText) {
  const text = policySearchText(referenceText);
  const committeeTerms = ["위원", "면접관", "인터뷰어", "패널", "interviewer"];
  const countTerms = ["수", "인원", "몇", "구성", "명", "인", "number", "count"];

  return {
    committeeCount: committeeTerms.some((term) => text.includes(policySearchText(term))) &&
      countTerms.some((term) => text.includes(policySearchText(term)))
  };
}

function scorePolicySentence(sentence, queryTokens, referenceText = "") {
  const text = policySearchText(sentence);
  const intent = getPolicyQuestionIntent(referenceText || queryTokens.join(" "));
  let score = 0;

  queryTokens.forEach((token) => {
    if (!text.includes(token)) {
      return;
    }

    score += POLICY_HIGHLIGHT_GENERIC_TOKENS.has(token)
      ? 1
      : token.length >= 4 ? 4 : 3;
  });

  if (intent.committeeCount) {
    const hasCommitteeTerm = /위원|면접관|인터뷰어|패널|interviewer/i.test(sentence);
    const hasCountSignal = /\d+\s*(명|인)|[일이삼사오육칠팔구십]\s*(명|인)|이상|이내|이하|구성|참여/.test(sentence);
    const hasSenioritySignal = /시니어|파트장|리더|manager|담당자|현업|실무/.test(sentence);
    const isBroadHeading = /면접 및 심층 평가 체계|평가 방식|주요 평가 항목|기술의 깊이|조직 적합성/.test(sentence);

    if (hasCommitteeTerm) score += 20;
    if (hasCountSignal) score += 18;
    if (hasCommitteeTerm && hasCountSignal) score += 50;
    if (hasCommitteeTerm && hasSenioritySignal) score += 8;
    if (!hasCommitteeTerm) score -= 8;
    if (isBroadHeading && !hasCommitteeTerm) score -= 15;
  }

  if (/^\s*#{1,6}\s/.test(sentence) || sentence.length < 12) {
    score -= 2;
  }

  return score;
}

function selectPolicyHighlightSentences(passage, queryTokens, referenceText = "") {
  const sentences = splitPolicySentences(passage.text);

  if (!sentences.length) {
    return [];
  }

  const selected = sentences
    .map((sentence, index) => ({
      sentence,
      index,
      score: scorePolicySentence(sentence, queryTokens, referenceText)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);

  return selected.length ? selected : sentences.slice(0, 1);
}

function selectPolicyAnswerText(passage, queryTokens, referenceText = "") {
  const sentences = splitPolicySentences(passage.text);

  if (!sentences.length) {
    return passage.text.slice(0, 320);
  }

  const scored = sentences.map((sentence, index) => {
    return {
      sentence,
      index,
      score: scorePolicySentence(sentence, queryTokens, referenceText)
    };
  });
  const selected = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
  const text = selected.length ? selected.join(" ") : sentences.slice(0, 2).join(" ");

  return text.length > 340 ? `${text.slice(0, 337).trim()}...` : text;
}

function findPolicyContexts(question) {
  const queryTokens = expandPolicyQueryTokens(question, policyTokens(question));
  const passages = state.policySources.flatMap(splitPolicyContentIntoPassages);

  if (!passages.length) {
    return [];
  }

  const ranked = passages
    .map((passage) => ({
      ...passage,
      score: scorePolicyPassage(passage, queryTokens, question)
    }))
    .sort((a, b) => b.score - a.score || a.source.title.localeCompare(b.source.title));
  const directMatches = ranked.filter((passage) => passage.score > 0);

  return (directMatches.length ? directMatches : ranked)
    .slice(0, POLICY_CHAT_MAX_CONTEXTS);
}

function createPolicyCitations(contexts, createdAt, queryTokens = [], referenceText = "") {
  return contexts.map((context, index) => ({
    id: createId("policy-citation"),
    number: index + 1,
    sourceId: context.source.id,
    sourceTitle: context.source.title,
    fileName: context.source.fileName,
    passageIndex: context.index,
    quote: context.text,
    keySentences: selectPolicyHighlightSentences(context, queryTokens, referenceText),
    createdAt
  }));
}

function refreshPolicyCitationHighlights(citations, answerItems, question) {
  citations.forEach((citation) => {
    const relatedAnswerText = answerItems
      .filter((item) => item.citationId === citation.id)
      .map((item) => item.text)
      .join(" ");
    const referenceText = [question, relatedAnswerText].filter(Boolean).join(" ");
    const referenceTokens = policyTokens(referenceText);

    citation.keySentences = selectPolicyHighlightSentences(
      { text: citation.quote },
      referenceTokens.length ? referenceTokens : policyTokens(question),
      referenceText || question
    );
  });
}

function buildLocalPolicyAnswerItems(question, contexts, citations, queryTokens) {
  const sourceNames = [...new Set(contexts.map((context) => context.source.title))].slice(0, 3);
  const intro = sourceNames.length
    ? `질문은 ${sourceNames.join(", ")} 소스의 기준과 연결됩니다. 등록된 소스 기준으로 정리하면 다음과 같습니다.`
    : "등록된 소스 기준으로 정리하면 다음과 같습니다.";
  const answerItems = [{
    text: intro,
    citationId: citations[0]?.id || ""
  }];

  contexts.slice(0, 3).forEach((context, index) => {
    const evidence = selectPolicyAnswerText(context, queryTokens, question)
      .replace(/\s+/g, " ")
      .trim();
    const text = [
      `${index + 1}. ${context.source.title} 기준`,
      evidence
        ? `해당 소스의 핵심 취지는 ${evidence.replace(/[.。]$/, "")}로 해석됩니다.`
        : "해당 소스에서 질문과 관련된 기준 문구가 확인됩니다."
    ].join("\n");

    answerItems.push({
      text,
      citationId: citations[index]?.id || citations[0]?.id || ""
    });
  });

  return answerItems;
}

function normalizePolicyApiAnswerItems(payload, citations) {
  if (!payload?.ok || !Array.isArray(payload.answerItems)) {
    return [];
  }

  return payload.answerItems
    .map((item) => {
      const citation = citations.find((candidate) => candidate.number === Number(item.citationNumber));
      const text = String(item.text || "").trim();

      if (!text) {
        return null;
      }

      return {
        text,
        citationId: citation?.id || citations[0]?.id || ""
      };
    })
    .filter(Boolean)
    .slice(0, 5);
}

async function callPolicyChatApi(question, contexts, citations) {
  const response = await fetch("/api/policy-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      contexts: contexts.map((context, index) => ({
        number: citations[index].number,
        sourceTitle: context.source.title,
        fileName: context.source.fileName,
        text: context.text.slice(0, POLICY_CHAT_MAX_CONTEXT_CHARS)
      }))
    })
  });

  if (!response.ok) {
    throw new Error(`Policy chat API failed: ${response.status}`);
  }

  return response.json();
}

async function buildPolicyAssistantMessage(question) {
  const contexts = findPolicyContexts(question);
  const createdAt = getTimestampText();

  if (!state.policySources.length) {
    return {
      id: createId("policy-message"),
      role: "assistant",
      createdAt,
      answerItems: [{
        text: "등록된 채용 기준 소스가 없습니다. 관리자가 먼저 기준 문서를 업로드하거나 직접 입력해야 답변할 수 있습니다.",
        citationId: ""
      }],
      citations: []
    };
  }

  if (!contexts.length) {
    return {
      id: createId("policy-message"),
      role: "assistant",
      createdAt,
      answerItems: [{
        text: "등록된 소스 데이터에서 해당 질문과 직접 관련된 근거를 찾지 못했습니다. 질문 표현을 바꾸거나 관련 기준 문서를 추가해주세요.",
        citationId: ""
      }],
      citations: []
    };
  }

  const queryTokens = expandPolicyQueryTokens(question, policyTokens(question));
  const citations = createPolicyCitations(contexts, createdAt, queryTokens, question);
  let answerItems = [];

  try {
    answerItems = normalizePolicyApiAnswerItems(
      await callPolicyChatApi(question, contexts, citations),
      citations
    );
  } catch (error) {
    console.warn("Policy chat API failed. Using local grounded answer.", error);
  }

  if (!answerItems.length) {
    answerItems = buildLocalPolicyAnswerItems(question, contexts, citations, queryTokens);
  }

  refreshPolicyCitationHighlights(citations, answerItems, question);

  return {
    id: createId("policy-message"),
    role: "assistant",
    createdAt,
    answerItems,
    citations
  };
}

function findPolicyCitationContext(citationId) {
  const messages = state.policyChatMessages || [];

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];
    const citation = (message.citations || []).find((item) => item.id === citationId);

    if (!citation) {
      continue;
    }

    const question = [...messages.slice(0, index)]
      .reverse()
      .find((item) => item.role === "user")?.text || "";
    const answerText = (message.answerItems || [])
      .filter((item) => item.citationId === citationId)
      .map((item) => item.text)
      .join(" ");

    return {
      citation,
      question,
      answerText
    };
  }

  return null;
}

function findPolicyCitation(citationId) {
  return findPolicyCitationContext(citationId)?.citation || null;
}

function findPolicySource(sourceId) {
  return state.policySources.find((source) => source.id === sourceId) || null;
}

function renderHighlightedPolicyQuote(citation) {
  const keySentences = Array.isArray(citation.keySentences)
    ? citation.keySentences.map((sentence) => String(sentence || "").trim()).filter(Boolean)
    : [];

  if (!keySentences.length) {
    return escapeHtml(citation.quote);
  }

  let segments = [{ text: String(citation.quote || ""), highlighted: false }];

  keySentences.forEach((sentence) => {
    segments = segments.flatMap((segment) => {
      if (segment.highlighted || !segment.text) {
        return [segment];
      }

      const index = segment.text.indexOf(sentence);

      if (index < 0) {
        return [segment];
      }

      return [
        { text: segment.text.slice(0, index), highlighted: false },
        { text: segment.text.slice(index, index + sentence.length), highlighted: true },
        { text: segment.text.slice(index + sentence.length), highlighted: false }
      ].filter((item) => item.text);
    });
  });

  return segments
    .map((segment) => segment.highlighted
      ? `<mark class="policy-citation-highlight">${escapeHtml(segment.text)}</mark>`
      : escapeHtml(segment.text))
    .join("");
}

function renderPolicySourceForm() {
  const editingSource = findPolicySource(state.policyEditingSourceId);

  if (!isAdmin()) {
    const readableSource = editingSource || state.policySources[0] || null;

    return `
      <div class="policy-source-readonly">
        <strong>등록된 소스 ${state.policySources.length}개</strong>
        <span>관리자가 등록한 채용 기준 문서에 근거해 답변합니다.</span>
      </div>
      ${readableSource ? `
        <article class="policy-source-viewer">
          <div class="policy-source-viewer-header">
            <strong>${escapeHtml(readableSource.title)}</strong>
            <span>${escapeHtml([readableSource.fileName || readableSource.sourceType, readableSource.updatedAt].filter(Boolean).join(" · "))}</span>
          </div>
          <pre>${escapeHtml(readableSource.content)}</pre>
        </article>
      ` : ""}
    `;
  }

  return `
    <form id="policy-source-form" class="policy-source-form">
      <input type="hidden" name="sourceId" value="${escapeHtml(editingSource?.id || "")}" />
      <div class="field">
        <label for="policy-source-title">소스 제목</label>
        <input class="control-input" id="policy-source-title" name="title" placeholder="예: 경력 채용 운영 기준" value="${inputValue(editingSource?.title || "")}" />
      </div>
      <div class="field">
        <label for="policy-source-file">문서 업로드</label>
        <div class="dropzone policy-source-upload">
          <input id="policy-source-file" name="sourceFile" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
          <span id="policy-source-file-status" class="form-help">${state.policyChatSourceLoading ? "문서를 읽는 중입니다." : editingSource?.fileName ? `${escapeHtml(editingSource.fileName)} 기반 소스입니다. 새 파일을 업로드하면 본문과 파일 정보가 교체됩니다.` : "업로드하거나 아래에 직접 입력할 수 있습니다."}</span>
        </div>
      </div>
      <div class="field">
        <label for="policy-source-content">소스 본문</label>
        <textarea class="control-textarea" id="policy-source-content" name="content" placeholder="채용 기준, 면접 운영 규정, 평가 원칙 등을 붙여넣으세요.">${escapeHtml(editingSource?.content || "")}</textarea>
      </div>
      ${state.policyChatSourceError ? `<div class="form-error"><strong>소스 저장 오류</strong><span>${escapeHtml(state.policyChatSourceError)}</span></div>` : ""}
      <div class="policy-source-form-actions">
        <button class="primary-button" type="submit">${editingSource ? "수정 저장" : "소스 저장"}</button>
        ${editingSource ? `<button class="ghost-button" type="button" data-new-policy-source>신규 소스</button>` : ""}
      </div>
    </form>
  `;
}

function renderPolicySourceList() {
  if (!state.policySources.length) {
    return `<div class="empty-state">등록된 채용 기준 소스가 없습니다.</div>`;
  }

  return `
    <div class="policy-source-list">
      ${state.policySources.map((source) => `
        <article class="policy-source-card ${source.id === state.policyEditingSourceId ? "is-active" : ""}">
          <div>
            <strong>${escapeHtml(source.title)}</strong>
            <span>${escapeHtml([source.fileName || source.sourceType, source.createdBy, source.updatedAt].filter(Boolean).join(" · "))}</span>
            <small>${escapeHtml(`${source.content.length.toLocaleString()}자`)}</small>
          </div>
          <div class="policy-source-card-actions">
            <button class="ghost-button compact-button" type="button" data-edit-policy-source="${escapeHtml(source.id)}">${isAdmin() ? "수정" : "보기"}</button>
            ${isAdmin() ? `<button class="ghost-button danger-button compact-button" type="button" data-delete-policy-source="${escapeHtml(source.id)}">삭제</button>` : ""}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderPolicySourceModal() {
  if (!state.policySourceModalOpen) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-policy-source-modal-backdrop>
      <section class="trending-modal policy-source-modal" role="dialog" aria-modal="true" aria-labelledby="policy-source-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="policy-source-modal-title">소스 데이터</strong>
            <span>채용 기준 Q&A 답변에 사용되는 원본 문서와 문구를 관리합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-policy-source-modal>닫기</button>
        </div>
        <div class="trending-modal-body policy-source-modal-body">
          <section class="policy-source-modal-list">
            <div class="panel-header">
              <h4>등록 소스</h4>
              <span class="small-pill">${state.policySources.length}개</span>
            </div>
            ${renderPolicySourceList()}
          </section>
          <section class="policy-source-modal-editor">
            <div class="panel-header">
              <h4>${isAdmin() ? (findPolicySource(state.policyEditingSourceId) ? "소스 수정" : "신규 소스") : "소스 원문"}</h4>
              ${isAdmin() ? `<button class="ghost-button compact-button" type="button" data-new-policy-source>신규 소스</button>` : ""}
            </div>
            ${renderPolicySourceForm()}
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderPolicyMessage(message) {
  if (message.role === "user") {
    return `
      <article class="policy-message is-user">
        <p>${escapeHtml(message.text)}</p>
      </article>
    `;
  }

  return `
    <article class="policy-message is-assistant">
      ${(message.answerItems || []).map((item) => `
        <div class="policy-answer-item">
          <p>${escapeHtml(item.text)}</p>
          ${item.citationId ? `<button class="soft-button compact-button" type="button" data-policy-citation="${escapeHtml(item.citationId)}">근거 보기</button>` : ""}
        </div>
      `).join("")}
    </article>
  `;
}

function renderPolicyCitationPanel() {
  const citationContext = findPolicyCitationContext(state.policyChatSelectedCitationId);
  const citation = citationContext?.citation || null;

  if (!citation) {
    return `
      <aside class="policy-citation-panel">
        <div class="policy-citation-empty">
          <strong>근거 원문</strong>
          <span>답변의 근거 보기 버튼을 누르면 원본 문구가 이 영역에 표시됩니다.</span>
        </div>
      </aside>
    `;
  }

  const referenceText = [citationContext.question, citationContext.answerText].filter(Boolean).join(" ");
  const renderCitation = referenceText
    ? {
      ...citation,
      keySentences: selectPolicyHighlightSentences(
        { text: citation.quote },
        policyTokens(referenceText),
        referenceText
      )
    }
    : citation;

  return `
    <aside class="policy-citation-panel is-open">
      <div class="policy-citation-header">
        <div>
          <strong>${escapeHtml(citation.sourceTitle)}</strong>
          <span>${escapeHtml(citation.fileName || `문단 ${citation.passageIndex + 1}`)}</span>
        </div>
        <button class="ghost-button compact-button" type="button" data-close-policy-citation>닫기</button>
      </div>
      <blockquote>${renderHighlightedPolicyQuote(renderCitation)}</blockquote>
    </aside>
  `;
}

function renderPolicyChat() {
  const content = $("#policy-chat-content");

  if (!content) {
    return;
  }

  const messages = state.policyChatMessages.length
    ? state.policyChatMessages.map(renderPolicyMessage).join("")
    : `<div class="empty-state">채용 기준 문서에 대해 자연어로 질문해보세요. 답변은 등록된 소스 데이터에서 확인되는 내용만 사용합니다.</div>`;
  const loadingMessage = state.policyChatLoading
    ? `
      <article class="policy-message is-assistant">
        <div class="policy-answer-item">
          <p>소스 데이터를 읽고 질문 의도에 맞는 답변을 정리하는 중입니다.</p>
        </div>
      </article>
    `
    : "";

  content.innerHTML = `
    <div class="policy-chat-layout">
      <section class="content-panel policy-chat-panel">
        <div class="panel-header">
          <h4>채용 기준 Q&A</h4>
          <div class="policy-chat-actions">
            <button class="ghost-button compact-button" type="button" data-open-policy-sources>소스 데이터 ${state.policySources.length}개</button>
            <button class="ghost-button compact-button" type="button" data-clear-policy-chat>대화 초기화</button>
          </div>
        </div>
        <div class="policy-chat-notice">등록된 소스에 없는 내용은 답변하지 않습니다. 근거 버튼으로 원문 문구를 확인할 수 있습니다.</div>
        <div class="policy-message-list">${messages}${loadingMessage}</div>
        <form id="policy-chat-form" class="policy-chat-form">
          <textarea class="control-textarea" id="policy-chat-question" name="question" placeholder="예: 경력직 면접위원 구성 기준은 어떻게 돼?">${escapeHtml(state.policyChatQuestion)}</textarea>
          <button class="primary-button" type="submit" ${state.policyChatLoading ? "disabled" : ""}>${state.policyChatLoading ? "답변 정리 중" : "질문하기"}</button>
        </form>
      </section>

      ${renderPolicyCitationPanel()}
    </div>
    ${renderPolicySourceModal()}
  `;
}

async function savePolicySourceFromForm(form) {
  if (!isAdmin() || !form) {
    return;
  }

  const formData = new FormData(form);
  const file = formData.get("sourceFile");
  const sourceId = String(formData.get("sourceId") || "").trim();
  const existingSource = findPolicySource(sourceId);
  const title = String(formData.get("title") || "").trim();
  const content = normalizePolicyText(formData.get("content"));

  state.policyChatSourceError = "";

  if (!content) {
    state.policyChatSourceError = "소스 본문을 입력하거나 문서를 업로드해주세요.";
    renderPolicyChat();
    return;
  }

  const source = normalizePolicySource({
    ...(existingSource || {}),
    id: existingSource?.id || createId("policy-source"),
    title: title || file?.name || existingSource?.title || "채용 기준 문서",
    sourceType: file?.name ? "file" : existingSource?.sourceType || "manual",
    fileName: file?.name || existingSource?.fileName || "",
    fileType: file?.type || existingSource?.fileType || "",
    size: file?.size || existingSource?.size || content.length,
    content,
    createdAt: existingSource?.createdAt || getTimestampText(),
    updatedAt: getTimestampText(),
    createdBy: existingSource?.createdBy || getCurrentActorName()
  });

  state.policySources = [
    source,
    ...state.policySources.filter((item) => item.id !== source.id)
  ];
  state.policyChatSourceError = "";
  state.policySourceModalOpen = true;
  state.policyEditingSourceId = source.id;
  state.policyChatSelectedCitationId = "";
  addAuditLog(existingSource ? "채용 AI 소스 수정" : "채용 AI 소스 등록", source.title, `${source.content.length.toLocaleString()}자`);
  persistState();
  renderPolicyChat();
  showToast(existingSource ? "채용 기준 소스를 수정했습니다." : "채용 기준 소스를 저장했습니다.");
}

async function loadPolicySourceFile(file) {
  const status = $("#policy-source-file-status");
  const titleInput = $("#policy-source-title");
  const contentInput = $("#policy-source-content");

  if (!file || !contentInput) {
    return;
  }

  state.policyChatSourceLoading = true;
  state.policyChatSourceError = "";

  if (status) {
    status.textContent = "문서를 읽는 중입니다.";
  }

  try {
    const parsed = await readResumeText(file);
    const text = normalizePolicyText(parsed.text || parsed.rawText || "");

    if (!text) {
      throw new Error("파일에서 읽을 수 있는 텍스트를 찾지 못했습니다.");
    }

    if (titleInput && !titleInput.value.trim()) {
      titleInput.value = file.name.replace(/\.[^.]+$/, "");
    }

    contentInput.value = text;

    if (status) {
      status.textContent = `${file.name} 내용을 본문에 불러왔습니다. 저장 전 내용을 확인해주세요.`;
    }
  } catch (error) {
    console.warn("Policy source file read failed.", error);
    state.policyChatSourceError = error.message || "문서 읽기 중 오류가 발생했습니다.";

    if (status) {
      status.textContent = "문서 읽기에 실패했습니다. 직접 본문을 붙여넣어주세요.";
    }
  } finally {
    state.policyChatSourceLoading = false;
  }
}

async function askPolicyChat(form) {
  if (!form || state.policyChatLoading) {
    return;
  }

  const formData = new FormData(form);
  const question = String(formData.get("question") || "").trim();

  if (!question) {
    showToast("질문을 입력해주세요.");
    return;
  }

  state.policyChatQuestion = "";
  state.policyChatLoading = true;
  state.policyChatMessages.push({
    id: createId("policy-message"),
    role: "user",
    text: question,
    createdAt: getTimestampText()
  });
  persistState();
  renderPolicyChat();

  try {
    const answer = await buildPolicyAssistantMessage(question);
    state.policyChatMessages.push(answer);
    state.policyChatMessages = state.policyChatMessages.slice(-POLICY_CHAT_MAX_MESSAGES);
    state.policyChatSelectedCitationId = answer.citations?.[0]?.id || "";
    addAuditLog("채용 AI 챗봇 질문", "채용 기준 Q&A", question);
  } catch (error) {
    console.warn("Policy answer failed.", error);
    state.policyChatMessages.push({
      id: createId("policy-message"),
      role: "assistant",
      createdAt: getTimestampText(),
      answerItems: [{
        text: "답변 생성 중 오류가 발생했습니다. 잠시 후 다시 질문해주세요.",
        citationId: ""
      }],
      citations: []
    });
  } finally {
    state.policyChatLoading = false;
    persistState();
    renderPolicyChat();
  }
}

async function deletePolicySource(sourceId) {
  if (!isAdmin()) {
    return;
  }

  const source = state.policySources.find((item) => item.id === sourceId);

  if (!source) {
    return;
  }

  if (!window.confirm(`${source.title} 소스를 삭제할까요? 해당 소스 기반 근거는 더 이상 사용할 수 없습니다.`)) {
    return;
  }

  state.policySources = state.policySources.filter((item) => item.id !== sourceId);

  if (findPolicyCitation(state.policyChatSelectedCitationId)?.sourceId === sourceId) {
    state.policyChatSelectedCitationId = "";
  }

  if (state.policyEditingSourceId === sourceId) {
    state.policyEditingSourceId = "";
  }

  addAuditLog("채용 AI 소스 삭제", source.title, "소스 데이터 제거");
  persistState();
  renderPolicyChat();

  try {
    await deleteSupabaseRecord("recruiting_policy_sources", sourceId);
    showToast("채용 기준 소스를 삭제했습니다.");
  } catch (error) {
    console.warn("Policy source remote delete failed.", error);
    showToast("화면에서는 삭제됐지만 원격 DB 삭제 확인에 실패했습니다.");
  }
}

function clearPolicyChat() {
  state.policyChatMessages = [];
  state.policyChatSelectedCitationId = "";
  state.policyChatQuestion = "";
  state.policyChatLoading = false;
  persistState();
  renderPolicyChat();
}

function openPolicyCitation(citationId) {
  state.policyChatSelectedCitationId = citationId;
  persistState({ skipRemoteSync: true });
  renderPolicyChat();
}

function closePolicyCitation() {
  state.policyChatSelectedCitationId = "";
  persistState({ skipRemoteSync: true });
  renderPolicyChat();
}

function openPolicySourceModal() {
  state.policySourceModalOpen = true;
  state.policyChatSourceError = "";
  renderPolicyChat();
}

function closePolicySourceModal() {
  state.policySourceModalOpen = false;
  state.policyChatSourceError = "";
  state.policyChatSourceLoading = false;
  renderPolicyChat();
}

function editPolicySource(sourceId) {
  state.policySourceModalOpen = true;
  state.policyEditingSourceId = sourceId;
  state.policyChatSourceError = "";
  renderPolicyChat();
}

function newPolicySource() {
  state.policySourceModalOpen = true;
  state.policyEditingSourceId = "";
  state.policyChatSourceError = "";
  renderPolicyChat();
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

  return getVisibleCandidates()
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
      candidates: getVisibleCandidates().map((candidate) => ({
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
      const candidate = findCandidate(result.id);

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

function formatShortYear(value) {
  const text = String(value || "").trim();
  const year = text.match(/\d{4}/)?.[0] || text.match(/\d{2}/)?.[0] || "";

  if (!year) {
    return "";
  }

  return `'${year.slice(-2)}`;
}

function normalizeTrendingSchoolName(value) {
  const school = String(value || "").trim();
  const compact = school.toLowerCase().replace(/[.\s-]+/g, "");
  const mappings = new Map([
    ["seoulnationaluniversity", "서울대학교"],
    ["snu", "서울대학교"],
    ["koreauniversity", "고려대학교"],
    ["yonseiuniversity", "연세대학교"],
    ["hanyanguniversity", "한양대학교"],
    ["sungkyunkwanuniversity", "성균관대학교"],
    ["skku", "성균관대학교"],
    ["soganguniversity", "서강대학교"],
    ["ewhawomansuniversity", "이화여자대학교"],
    ["postech", "포항공과대학교"],
    ["pohanguniversityofscienceandtechnology", "포항공과대학교"],
    ["kaist", "KAIST"],
    ["koreaadvancedinstituteofscienceandtechnology", "KAIST"],
    ["unist", "UNIST"],
    ["ulsannationalinstituteofscienceandtechnology", "UNIST"],
    ["gist", "GIST"],
    ["gwangjuinstituteofscienceandtechnology", "GIST"],
    ["dgist", "DGIST"],
    ["daegyeongbukinstituteofscienceandtechnology", "DGIST"],
    ["pusannationaluniversity", "부산대학교"],
    ["kyungpooknationaluniversity", "경북대학교"],
    ["chungnamnationaluniversity", "충남대학교"]
  ]);

  return mappings.get(compact) || school;
}

function normalizeTrendingCountry(value) {
  const country = String(value || "").trim();

  if (/^(대한민국|한국|south korea|republic of korea|korea)$/i.test(country)) {
    return "한국";
  }

  return country;
}

function inferTrendingCareerCountry(item) {
  const company = String(item.company || "").toLowerCase();

  if (/nvidia|엔비디아/.test(company)) {
    return "미국";
  }

  if (/ncsoft|엔씨소프트|krafton|크래프톤|서울대학교|고려대학교|연세대학교|lg\b|삼성/.test(company)) {
    return "한국";
  }

  return normalizeTrendingCountry(item.country);
}

function formatTrendingEducation(item) {
  const degree = { "박사": "박", "석사": "석", "학사": "학", "박": "박", "석": "석", "학": "학" }[item.degree] || item.degree || "";
  const year = formatShortYear(item.year || item.end || item.graduationYear);
  const school = normalizeTrendingSchoolName(item.school);
  const major = String(item.major || "").trim();
  const body = [school, major].filter(Boolean).join(", ");
  const prefix = degree ? `${degree}) ` : "";
  const suffix = year ? ` (${year})` : "";

  return `${prefix}${body}${suffix}`.trim();
}

function formatTrendingCareer(item) {
  const normalizedCountry = inferTrendingCareerCountry(item);
  const country = normalizedCountry ? `${normalizedCountry})` : "";
  const periodStart = formatShortYear(item.start || item.startYear);
  const periodEnd = item.end === "현재" || item.endYear === "현재"
    ? "현재"
    : formatShortYear(item.end || item.endYear);
  const period = periodStart || periodEnd ? `(${periodStart || ""}~${periodEnd || ""})` : "";
  const rankTitle = formatCareerRoleParts(item.rank, item.title || item.position, item.department || item.organization || item.org || item.team || item.division || "");
  const department = item.department || item.organization || item.org || item.team || item.division || "";
  const details = [item.company, rankTitle, roleContainsDepartment(rankTitle, department) ? "" : department].filter(Boolean).join(", ");
  const careerText = [details, period].filter(Boolean).join(" ");

  if (country) {
    return `${country} ${careerText}`.trim();
  }

  return careerText;
}

function normalizeCareerToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\s·,./()\-_/]+/g, "");
}

function roleContainsDepartment(roleText, department) {
  const role = normalizeCareerToken(roleText);
  const dept = normalizeCareerToken(department);
  return Boolean(role && dept && role.includes(dept));
}

function appendDistinctCareerPart(parts, value) {
  const text = String(value || "").trim();

  if (!text) {
    return;
  }

  const comparable = normalizeCareerToken(text);
  const duplicateIndex = parts.findIndex((part) => {
    const existing = normalizeCareerToken(part);
    return existing === comparable || existing.includes(comparable) || comparable.includes(existing);
  });

  if (duplicateIndex === -1) {
    parts.push(text);
    return;
  }

  if (comparable.length > normalizeCareerToken(parts[duplicateIndex]).length) {
    parts[duplicateIndex] = text;
  }
}

function formatCareerRoleParts(rank, title, department) {
  const parts = [];
  appendDistinctCareerPart(parts, rank);
  appendDistinctCareerPart(parts, title);
  appendDistinctCareerPart(parts, department && parts.some((part) => roleContainsDepartment(part, department)) ? "" : department);
  return parts.join(", ");
}

function renderDashList(items) {
  const list = (items || []).filter(Boolean).slice(0, 3);

  if (!list.length) {
    return `<span class="muted-text">정보 없음</span>`;
  }

  return `<ul class="dash-list">${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderNewsLinks(reason) {
  const links = (reason.links || []).filter((link) => link.url).slice(0, 1);

  if (!links.length) {
    return "";
  }

  return `
    <div class="news-link-row">
      ${links.map((link) => `
        <a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">
          ${escapeHtml(formatNewsLinkLabel(link))}
        </a>
      `).join("")}
    </div>
  `;
}

function cleanNewsTitle(title, source = "") {
  let text = String(title || "").trim();
  const sourceText = String(source || "").trim();

  if (sourceText) {
    const escapedSource = sourceText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text
      .replace(new RegExp(`\\s*[-·|]\\s*${escapedSource}\\s*$`, "i"), "")
      .replace(new RegExp(`^${escapedSource}\\s*[-·|]\\s*`, "i"), "")
      .replace(new RegExp(`\\s+${escapedSource}\\s*$`, "i"), "");
  }

  return text.replace(/\s+/g, " ").trim();
}

function formatNewsLinkLabel(link) {
  const source = String(link.source || "기사").trim();
  const title = cleanNewsTitle(link.title || link.url, source);
  return `[${source}] ${title}`;
}

function cleanArticleSummary(value, source = "") {
  return cleanNewsTitle(value, source)
    .replace(/^근거\s*기사\s*핵심\s*[:：]?\s*/i, "")
    .replace(/^\[[^\]]+\]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackReasonFromLink(link) {
  if (!link) {
    return "";
  }

  const snippet = cleanArticleSummary(link.snippet || link.description || "", link.source);

  if (snippet) {
    return snippet.length > 120 ? `${snippet.slice(0, 117).trim()}...` : snippet;
  }

  return cleanArticleSummary(link.title || "", link.source);
}

function normalizeReasonText(value) {
  return String(value || "")
    .replace(/^[-\s]+/, "")
    .replace(/^근거\s*기사\s*핵심\s*[:：]?\s*/i, "")
    .replace(/(?:DX|디엑스)\s*(?:사업\s*)?분야에서\s*(?:주목받음|중요 인물로 부각|주요 인물로 부각)\.?/gi, "")
    .replace(/(?:DX|디엑스)\s*(?:사업\s*)?분야\s*관련성이\s*(?:높음|확인됨)\.?/gi, "")
    .replace(/전일\s*(?:DX|디엑스)\s*관심\s*분야\s*뉴스\s*흐름에서\s*주요\s*인물로\s*분류\.?/g, "")
    .replace(/(논의|추진|확대|강화|모색|협의|발표|공개|참여|계획)(?:하며|하고)\.?$/g, "$1")
    .replace(/(?:하며|하면서|하고)\.?$/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.。]$/, "")
    .trim();
}

function splitReasonSentences(value) {
  const text = normalizeReasonText(value);

  if (!text) {
    return [];
  }

  const parts = text
    .split(/(?<=[.!?。！？])\s+|(?<=다)\s+(?=[가-힣A-Z0-9])/g)
    .map(normalizeReasonText)
    .filter(Boolean);

  return parts.length ? parts : [text];
}

function asDisplaySentence(value) {
  const text = normalizeReasonText(value);
  return text;
}

function trendingReasonLines(reasons) {
  const lines = [];
  const links = (reasons || [])
    .filter((reason) => typeof reason === "object")
    .flatMap((reason) => reason.links || [])
    .filter((link, index, array) => link.url && array.findIndex((item) => item.url === link.url) === index)
    .slice(0, 1);

  (reasons || []).forEach((reason) => {
    const rawText = typeof reason === "object" ? reason.text : reason;
    const link = typeof reason === "object" ? (reason.links || []).find((item) => item.url) : null;
    const cleanedRaw = normalizeReasonText(rawText);
    const cleanedTitle = normalizeReasonText(cleanNewsTitle(link?.title || "", link?.source || ""));
    const displayText = (
      /^근거\s*기사\s*핵심\s*[:：]?/i.test(String(rawText || "")) ||
      (cleanedTitle && cleanedRaw === cleanedTitle && (link?.snippet || link?.description))
    )
      ? fallbackReasonFromLink(link) || rawText
      : rawText;

    splitReasonSentences(displayText).forEach((line) => {
      if (line && !lines.includes(line)) {
        lines.push(asDisplaySentence(line));
      }
    });
  });

  const link = links[0];

  if (!lines.length && link?.title) {
    lines.push(asDisplaySentence(fallbackReasonFromLink(link)));
  }

  if (lines.length === 1) {
    const fallback = fallbackReasonFromLink(link);

    if (fallback && fallback !== lines[0]) {
      lines.push(asDisplaySentence(fallback));
    }
  }

  return lines.slice(0, 2);
}

function renderSelectionReasons(reasons) {
  const lines = trendingReasonLines(reasons);
  const links = (reasons || [])
    .filter((reason) => typeof reason === "object")
    .flatMap((reason) => reason.links || [])
    .filter((link, index, array) => link.url && array.findIndex((item) => item.url === link.url) === index)
    .slice(0, 1);

  if (!lines.length) {
    return `<span class="muted-text">선정 사유 없음</span>`;
  }

  return `
    <div class="reason-block reason-summary">
      ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      ${renderNewsLinks({ links })}
    </div>
  `;
}

function renderTrendingHistoryPanel(options = {}) {
  const reports = state.trendingHistory || [];
  const selectedDate = state.trendingReport?.targetDate || state.trendingSelectedDate || "";
  const hideTitle = Boolean(options.hideTitle);
  const headerContent = hideTitle
    ? `<div><span>저장된 날짜를 클릭하면 해당 날짜 리포트를 그대로 조회합니다.</span></div>`
    : `
        <div>
          <strong>리포트 보관함</strong>
          <span>저장된 날짜를 클릭하면 해당 날짜 리포트를 그대로 조회합니다.</span>
        </div>
      `;

  if (state.trendingHistoryLoading && !reports.length) {
    return `
      <section class="trending-history-panel">
        <div class="trending-history-header">
          ${hideTitle ? "" : "<strong>리포트 보관함</strong>"}
          <span>날짜 목록을 불러오는 중입니다.</span>
        </div>
      </section>
    `;
  }

  return `
    <section class="trending-history-panel">
      <div class="trending-history-header">
        ${headerContent}
        <button class="ghost-button compact-button" type="button" data-refresh-trending-history ${state.trendingHistoryLoading ? "disabled" : ""}>목록 새로고침</button>
      </div>
      ${reports.length ? `
        <div class="trending-history-list">
          ${reports.map((report) => {
            const date = report.targetDate || report.reportDate;
            const names = (report.topPeople || []).slice(0, 3).join(", ");
            return `
              <button class="history-date-button ${date === selectedDate ? "is-active" : ""}" type="button" data-trending-date="${escapeHtml(date)}">
                <strong>${escapeHtml(date)}</strong>
                <span>${escapeHtml(names || `${report.peopleCount || 0}명`)}</span>
              </button>
            `;
          }).join("")}
        </div>
      ` : `<div class="empty-state compact-empty">저장된 리포트 날짜가 없습니다.</div>`}
    </section>
  `;
}

function trendingMailRecipientText() {
  return state.trendingMailSettings.recipients.join("\n");
}

function renderTrendingMailRecipientPreview() {
  const recipients = state.trendingMailSettings.recipients || [];

  if (!recipients.length) {
    return `<span class="muted-text">등록된 수신처 없음</span>`;
  }

  return `
    <div class="recipient-chip-list" aria-label="저장된 메일 수신처">
      ${recipients.map((recipient) => `<span class="recipient-chip">${escapeHtml(recipient)}</span>`).join("")}
    </div>
  `;
}

function renderTrendingMailPanel(options = {}) {
  if (!isAdmin()) {
    return "";
  }

  const settings = state.trendingMailSettings;
  const hideTitle = Boolean(options.hideTitle);
  const providerLabel = settings.providerConfigured ? "메일 provider 연결됨" : "메일 provider 미설정";
  const statusText = state.trendingMailError || state.trendingMailStatus || (
    settings.lastSentReportDate
      ? `마지막 발송: ${settings.lastSentReportDate}${settings.lastSentAt ? ` · ${settings.lastSentAt}` : ""}`
      : "발송 이력 없음"
  );

  return `
    <form class="trending-mail-panel" id="trending-mail-form">
      <div class="trending-mail-header">
        <div>
          ${hideTitle ? "" : "<strong>메일링 설정</strong>"}
          <span>${escapeHtml(providerLabel)} · ${escapeHtml(statusText)}</span>
        </div>
        <label class="inline-check">
          <input type="checkbox" id="trending-mail-enabled" name="enabled" ${settings.enabled ? "checked" : ""} />
          매일 발송
        </label>
      </div>
      <div class="trending-mail-grid">
        <div class="field">
          <label for="trending-mail-time">발송 시간</label>
          <input class="control-input" id="trending-mail-time" name="sendTime" type="time" value="${escapeHtml(settings.sendTime)}" />
        </div>
        <div class="field">
          <label for="trending-mail-subject">메일 제목</label>
          <input class="control-input" id="trending-mail-subject" name="subjectPrefix" value="${escapeHtml(settings.subjectPrefix)}" />
        </div>
        <div class="field full">
          <label for="trending-mail-recipients">수신처</label>
          <textarea class="control-textarea" id="trending-mail-recipients" name="recipients" rows="6" placeholder="name@samsung.com&#10;leader@samsung.com&#10;hr@samsung.com">${escapeHtml(trendingMailRecipientText())}</textarea>
          <div class="field-caption">줄바꿈, 쉼표, 세미콜론으로 여러 주소를 입력할 수 있습니다.</div>
          <div class="mail-recipient-summary">
            <strong>현재 수신처 ${settings.recipients.length}명</strong>
            ${renderTrendingMailRecipientPreview()}
          </div>
        </div>
      </div>
      <div class="trending-mail-actions">
        <button class="ghost-button compact-button" type="button" data-save-trending-mail ${state.trendingMailLoading ? "disabled" : ""}>설정 저장</button>
        <button class="primary-button compact-button" type="button" data-send-trending-mail-test ${state.trendingMailLoading ? "disabled" : ""}>테스트 발송</button>
      </div>
    </form>
  `;
}

function renderTrendingModal() {
  if (!state.trendingModal) {
    return "";
  }

  const isMailModal = state.trendingModal === "mail";
  const title = isMailModal ? "메일링 설정" : "리포트 보관함";
  const description = isMailModal
    ? "발송 시간과 복수 수신처를 설정하고 테스트 메일을 발송합니다."
    : "저장된 날짜를 선택해 과거 Today's Talent 리포트를 조회합니다.";
  const content = isMailModal
    ? renderTrendingMailPanel({ hideTitle: true })
    : renderTrendingHistoryPanel({ hideTitle: true });

  if (!content) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-trending-modal-backdrop>
      <section class="trending-modal" role="dialog" aria-modal="true" aria-labelledby="trending-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="trending-modal-title">${escapeHtml(title)}</strong>
            <span>${escapeHtml(description)}</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-trending-modal>닫기</button>
        </div>
        <div class="trending-modal-body">
          ${content}
        </div>
      </section>
    </div>
  `;
}

function openTrendingModal(type) {
  if (type === "mail" && !isAdmin()) {
    showToast("관리자만 메일링 설정을 변경할 수 있습니다.");
    return;
  }

  state.trendingModal = type === "mail" ? "mail" : "history";
  renderTrendingPeople();
}

function closeTrendingModal() {
  if (!state.trendingModal) {
    return;
  }

  state.trendingModal = "";
  renderTrendingPeople();
}

function trendingPersonCard(person) {
  const education = (person.education || []).map(formatTrendingEducation).filter(Boolean);
  const career = (person.career || []).map(formatTrendingCareer).filter(Boolean);
  const achievements = Array.isArray(person.achievements) ? person.achievements : [];
  const reasons = Array.isArray(person.selectionReasons) ? person.selectionReasons : [];
  const rank = person.rank || "";
  const photo = person.profileImageUrl
    ? `<img class="trending-photo" src="${escapeHtml(person.profileImageUrl)}" alt="${escapeHtml(person.name || "화제 인물")} 프로필 사진" loading="lazy" referrerpolicy="no-referrer" />`
    : `<div class="trending-photo-placeholder" aria-hidden="true">${escapeHtml(String(person.name || "?").slice(0, 1))}</div>`;
  const alreadyRegistered = getVisibleCandidates().some((candidate) =>
    candidate.name === person.name &&
    (!person.currentOrg || candidate.company === person.currentOrg)
  );

  return `
    <article class="trending-card">
      <div class="trending-media" data-trending-rank="${escapeHtml(rank)}">
        ${photo}
      </div>
      <div class="trending-profile">
        <div class="trending-card-header">
          <div class="trending-title-row">
            <span class="trending-title-rank">${escapeHtml(rank)}</span>
            <div>
              <h4>${escapeHtml(person.name || "-")}</h4>
              <p>${escapeHtml([person.birthYear ? `${person.birthYear}년생` : "", person.currentOrg, person.currentTitle].filter(Boolean).join(" · "))}</p>
            </div>
          </div>
          <div class="trending-actions">
            ${person.linkedinUrl ? `<a class="soft-button compact-button" href="${escapeHtml(person.linkedinUrl)}" target="_blank" rel="noreferrer">LinkedIn</a>` : ""}
            <button class="primary-button compact-button" type="button" data-register-trending-person="${escapeHtml(person.id || person.name)}" ${alreadyRegistered ? "disabled" : ""}>
              ${alreadyRegistered ? "등록됨" : "Pool 등록"}
            </button>
          </div>
        </div>

        <div class="trending-profile-grid">
          <div class="trending-profile-column">
            <section>
              <strong>학력</strong>
              ${education.length ? `<div class="plain-line-list">${education.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : `<span class="muted-text">정보 없음</span>`}
            </section>
            <section>
              <strong>경력</strong>
              ${career.length ? `<div class="plain-line-list">${career.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : `<span class="muted-text">정보 없음</span>`}
            </section>
          </div>
          <div class="trending-profile-column">
            <section>
              <strong>주요 성과/실적</strong>
              ${renderDashList(achievements)}
            </section>
            <section>
              <strong>선정 사유</strong>
              ${renderSelectionReasons(reasons)}
            </section>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderTrendingPeople() {
  const container = $("#trending-content");

  if (!container) {
    return;
  }

  const report = state.trendingReport;
  const people = report?.people || [];
  const body = state.trendingLoading
    ? `<div class="empty-state">전일 한국 뉴스에서 DX 분야 화제 인물을 분석하는 중입니다.</div>`
    : state.trendingError
      ? `<div class="empty-state">${escapeHtml(state.trendingError)}</div>`
      : people.length
        ? people.map(trendingPersonCard).join("")
        : `<div class="empty-state">아직 생성된 화제 인물 리포트가 없습니다. 새로고침을 눌러 전일 기사 기준 리포트를 생성해주세요.</div>`;

  container.innerHTML = `
    <div class="trending-toolbar">
      <div>
        <strong>${report?.targetDate ? `${escapeHtml(report.targetDate)} 00:00~24:00 기사 기준` : "전일 00:00~24:00 기사 기준"}</strong>
        <span>한국 뉴스 · AI, 로보틱스, 모바일, TV, 생활가전 중심 · DS/반도체 제외 · 최근 1개월 중복 제외</span>
        ${report?.generatedAt ? `<span>생성 시각 ${escapeHtml(report.generatedAt)}</span>` : ""}
      </div>
      <div class="trending-toolbar-actions">
        <button class="ghost-button" type="button" data-open-trending-modal="history">리포트 보관함</button>
        ${isAdmin() ? `<button class="ghost-button" type="button" data-open-trending-modal="mail">메일링 설정</button>` : ""}
        <button class="ghost-button" type="button" data-refresh-trending="latest" ${state.trendingLoading ? "disabled" : ""}>최신 리포트</button>
        <button class="primary-button" type="button" data-refresh-trending="force" ${state.trendingLoading ? "disabled" : ""}>현재 날짜 재생성</button>
      </div>
    </div>
    <div class="trending-scope">
      <span class="status-chip chip-blue">검색 범위: Google News 한국판 RSS, 한국 언론 기사 중심</span>
      <span class="status-chip chip-amber">추천 실행: 매일 06:00 KST Vercel Cron</span>
      <span class="status-chip chip-green">Pool 등록 가능</span>
    </div>
    <div class="trending-list">
      ${body}
    </div>
    ${renderTrendingModal()}
  `;
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

  if (!candidate) {
    $("#detail-actions").innerHTML = `<button class="ghost-button" type="button" data-back-to-pool>목록으로</button>`;
    $("#detail-content").innerHTML = `<div class="empty-state">조회할 후보자 프로필이 없습니다.</div>`;
    return;
  }

  const canManageProfile = canManageCandidateProfile(candidate);

  $("#detail-actions").innerHTML = state.isEditingCandidate
    ? `<button class="ghost-button" type="button" data-cancel-edit>수정 취소</button>`
    : `
      <button class="ghost-button" type="button" data-back-to-pool>목록으로</button>
      ${canManageProfile ? `
        <button class="ghost-button" type="button" data-start-edit>정보 수정</button>
        <button class="ghost-button" type="button" data-change-status="contacted">접촉 완료</button>
        <button class="primary-button" type="button" data-change-status="screening">전형 진행</button>
        <button class="ghost-button danger-button" type="button" data-delete-candidate="${candidate.id}">프로필 삭제</button>
      ` : ""}
    `;

  if (state.isEditingCandidate) {
    $("#detail-content").innerHTML = renderCandidateEditForm(candidate);
    return;
  }

  $("#detail-content").innerHTML = `
    <div class="detail-page-shell">
      <main class="detail-main-column">
        ${renderDetailHero(candidate)}
        ${renderDetailTabStrip()}
        ${renderFullDetailContent(candidate)}
      </main>
      <aside class="detail-side-column">
        ${renderDetailHistoryPanel(candidate)}
        ${renderDetailMemoPanel(candidate)}
      </aside>
    </div>
  `;
}

function renderDetailHero(candidate) {
  const primaryEducation = getPrimaryEducation(candidate);
  const primaryCareer = getPrimaryCareer(candidate);
  const titleLines = [
    [candidate.company, candidate.role].filter(Boolean).join(", "),
    primaryCareer
      ? [primaryCareer.company, primaryCareer.position || primaryCareer.rank, formatPeriod(primaryCareer.start, primaryCareer.end)].filter(Boolean).join(" · ")
      : "",
    primaryEducation
      ? [primaryEducation.school, primaryEducation.major, primaryEducation.degree].filter(Boolean).join(", ")
      : ""
  ].filter(Boolean);
  const linkedin = normalizeExternalUrl(candidate.linkedinUrl);
  const attachment = candidate.resumeAttachment?.dataUrl;

  return `
    <section class="detail-hero-card">
      <div class="detail-hero-photo">
        ${candidateVisual(candidate, "large")}
      </div>
      <div class="detail-hero-body">
        <div class="detail-hero-topline">
          <div>
            <h3>${escapeHtml(candidate.name)}</h3>
            <div class="detail-hero-badges">
              ${getStatusChip(candidate.status)}
              ${candidate.organization ? `<span class="status-chip chip-violet">${escapeHtml(candidate.organization)}</span>` : ""}
              <span class="status-chip chip-blue">${escapeHtml(getCandidateVisibilityLabel(candidate.visibility))}</span>
            </div>
          </div>
          <div class="detail-hero-actions">
            ${linkedin ? `<a class="icon-link-button" href="${escapeHtml(linkedin)}" target="_blank" rel="noreferrer" title="LinkedIn">in</a>` : ""}
            ${attachment ? `<a class="icon-link-button" href="${escapeHtml(attachment)}" download="${escapeHtml(candidate.resumeAttachment.name || `${candidate.name}_resume`)}" title="첨부 파일 다운로드">⇩</a>` : ""}
            ${canManageCandidateProfile(candidate) ? `<button class="icon-link-button" type="button" data-start-edit title="정보 수정">✎</button>` : ""}
          </div>
        </div>
        <div class="detail-hero-lines">
          ${titleLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}
        </div>
        <div class="detail-hero-footer">
          <span>Pool 관리 담당 : ${escapeHtml(candidate.owner || "-")}</span>
          <span>최초 등록일 : ${escapeHtml(candidate.createdAt || "-")}</span>
          <span>최종 업데이트 : ${escapeHtml(candidate.updatedAt || "-")}</span>
        </div>
      </div>
    </section>
  `;
}

function renderDetailTabStrip() {
  const tabs = [
    ["#detail-profile-section", "주요 프로필"],
    ["#detail-competency-section", "전문역량"],
    ["#detail-plan-section", "활용계획"],
    ["#detail-activity-section", "면담 기록"],
    ["#detail-application-section", "채용진행"]
  ];

  return `
    <nav class="detail-tab-strip" aria-label="상세 프로필 섹션">
      ${tabs.map(([href, label], index) => `<a class="${index === 0 ? "is-active" : ""}" href="${href}">${escapeHtml(label)}</a>`).join("")}
    </nav>
  `;
}

function renderDetailHistoryPanel(candidate) {
  const items = [
    { label: "최초 등록", text: `${candidate.source || "직접 등록"} · ${candidate.createdAt || "-"}` },
    { label: "최근 업데이트", text: `${candidate.updatedAt || "-"} · ${candidate.owner || "담당자 미입력"}` },
    ...((candidate.timeline || []).slice(0, 3).map((item) => ({
      label: item.type,
      text: `${item.text} · ${item.date}`
    })))
  ];

  return `
    <section class="detail-side-card">
      <div class="detail-side-card-header">
        <strong>Pool 관리 주요 히스토리</strong>
        <span class="side-subtle-action">재산정</span>
      </div>
      <div class="side-history-list">
        ${items.map((item) => `
          <div>
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.text)}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderDetailMemoPanel(candidate) {
  return `
    <section class="detail-side-card">
      <div class="detail-side-card-header">
        <strong>메모</strong>
        ${canManageCandidateProfile(candidate) ? `<button class="icon-mini-button" type="button" data-start-edit title="메모 수정">＋</button>` : ""}
      </div>
      <p class="side-note">${candidate.summary ? escapeHtml(candidate.summary) : "등록된 메모가 없습니다."}</p>
    </section>
  `;
}

function statBox(label, value) {
  return `
    <div class="stat-box">
      <span>${label}</span>
      <strong>${escapeHtml(value || "-")}</strong>
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

function detailSection(title, content, className = "", sectionId = "") {
  return `
    <section class="detail-section ${className}" ${sectionId ? `id="${escapeHtml(sectionId)}"` : ""}>
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
    { label: "사업부", value: candidate.organization },
    { label: "공개 범위", value: getCandidateVisibilityLabel(candidate.visibility) },
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

function renderUtilizationPlanSection(candidate) {
  const applications = candidate.applications || [];
  const latestApplication = applications[0];
  const focusText = candidate.skills?.length
    ? `${candidate.skills.slice(0, 4).join(", ")} 역량 기반 포지션 검토`
    : "후보자 역량 확인 후 적합 포지션 매칭";

  return `
    <div class="detail-plan-grid">
      ${statBox("활용 방향", focusText)}
      ${statBox("추천 액션", candidate.status === "contacted" ? "후속 면담 및 포지션 제안" : "담당자 검토 후 접촉")}
      ${statBox("최근 지원", latestApplication ? `${latestApplication.title} · ${latestApplication.stage}` : "등록된 지원 이력 없음")}
      ${statBox("관리 상태", STATUS_LABELS[candidate.status] || "-")}
    </div>
  `;
}

function renderFullDetailContent(candidate) {
  return `
    <div class="detail-section-stack">
      ${detailSection("경력사항", renderCareerTab(candidate), "", "detail-profile-section")}
      ${detailSection("학력사항", renderEducationTab(candidate))}
      ${detailSection("인적사항", renderOverviewSection(candidate))}
      ${detailSection("주요 역량/성과", renderCompetencySection(candidate), "is-primary", "detail-competency-section")}
      ${detailSection("활용계획", renderUtilizationPlanSection(candidate), "", "detail-plan-section")}
      ${detailSection("첨부파일", renderResumeAttachmentSection(candidate))}
      ${detailSection("면담 기록", renderActivitySection(candidate), "", "detail-activity-section")}
      ${detailSection("채용진행", renderApplicationsSection(candidate), "", "detail-application-section")}
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
        <article class="detail-record-card record-list-item">
          <div class="record-mainline">
            <strong>${escapeHtml(`${item.degree ? `${item.degree}) ` : ""}${[item.school, item.major].filter(Boolean).join(", ")}`.trim())}</strong>
            <span>${escapeHtml(formatPeriod(item.start, item.end))}</span>
          </div>
          <div class="record-subline">
            ${[item.school, item.major, item.degree].filter(Boolean).map((value) => `<span>${escapeHtml(value)}</span>`).join("")}
          </div>
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
        <article class="detail-record-card record-list-item">
          <div class="record-mainline">
            <strong>${escapeHtml([item.company, item.rank || item.position].filter(Boolean).join(", "))}</strong>
            <span>${escapeHtml(formatPeriod(item.start, item.end))}</span>
          </div>
          <div class="record-subline">
            ${[item.position, item.country, item.end === "현재" ? "현재 재직" : "경력"].filter(Boolean).map((value) => `<span>${escapeHtml(value)}</span>`).join("")}
          </div>
          ${item.achievements ? `<div class="achievement-box">
            <span>직장에서의 주요성과/실적</span>
            <p>${escapeHtml(item.achievements)}</p>
          </div>` : ""}
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
            <select class="control-select" id="edit-organization" name="editOrganization">
              ${renderBusinessUnitOptions(candidate.organization)}
            </select>
          </div>
          <div class="field">
            <label for="edit-visibility">공개 범위</label>
            <select class="control-select" id="edit-visibility" name="editVisibility">
              ${renderCandidateVisibilityOptions(candidate.visibility)}
            </select>
            <span class="field-caption">사업부 공개는 해당 사업부 회원과 관리자/부문 담당자만 조회할 수 있습니다.</span>
          </div>
          <div class="field">
            <label for="edit-owner">담당자</label>
            <select class="control-select" id="edit-owner" name="editOwner">
              ${renderOwnerOptions(candidate.owner, { includePlaceholder: true })}
            </select>
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
  showEditError([]);
  const candidate = getCandidate();

  if (!canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 수정할 수 없는 프로필입니다.");
    state.isEditingCandidate = false;
    state.editSnapshot = null;
    renderDetail();
    return false;
  }

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
  candidate.organization = normalizeBusinessUnit(getFormText(form, "editOrganization")) || candidate.organization;
  candidate.visibility = normalizeCandidateVisibility(getFormText(form, "editVisibility"));
  candidate.owner = normalizeOwnerSelection(getFormText(form, "editOwner")) || candidate.owner;
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

function renderAuditContent(options = {}) {
  const { manageable = false } = options;
  ensureAuditLogIds();
  const viewCount = state.auditLogs.filter((log) => log.action.includes("조회")).length;
  const aiCount = state.auditLogs.filter((log) => log.action.includes("AI") || log.actor.includes("AI")).length;

  return `
    <div class="audit-grid">
      ${metricCard("오늘 조회", viewCount, "권한 기반")}
      ${metricCard("AI 처리", aiCount, "모델 버전 기록")}
      ${metricCard("다운로드", 0, "승인 URL 없음")}
      ${metricCard("권한 실패", 0, "정상")}
    </div>
    ${manageable ? `
      <div class="audit-management-header">
        <div>
          <strong>Log 관리</strong>
          <span>${state.auditLogs.length}개 이력</span>
        </div>
        <button class="ghost-button danger-button compact-button" type="button" data-clear-audit-logs ${state.auditLogs.length ? "" : "disabled"}>전체 삭제</button>
      </div>
    ` : ""}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>시각</th>
            <th>사용자</th>
            <th>행위</th>
            <th>대상</th>
            <th>목적</th>
            ${manageable ? "<th>관리</th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${state.auditLogs.length ? state.auditLogs.map((log) => `
            <tr>
              <td>${log.time}</td>
              <td>${escapeHtml(log.actor)}</td>
              <td>${escapeHtml(log.action)}</td>
              <td>${escapeHtml(log.resource)}</td>
              <td>${escapeHtml(log.purpose)}</td>
              ${manageable ? `
                <td>
                  <button class="ghost-button danger-button compact-button" type="button" data-delete-audit-log="${log.id}">삭제</button>
                </td>
              ` : ""}
            </tr>
          `).join("") : `
            <tr>
              <td colspan="${manageable ? 6 : 5}">
                <div class="empty-state compact-empty">표시할 로그가 없습니다.</div>
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

function renderAudit() {
  const content = $("#audit-content");

  if (!content) {
    return;
  }

  content.innerHTML = renderAuditContent();
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
    general: "chip-blue",
    search_firm: "chip-amber",
    hiring_manager: "chip-green",
    business_recruiter: "chip-violet",
    division_recruiter: "chip-blue",
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
        member.businessUnit,
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
  actions.push(`<button class="ghost-button danger-button compact-button" type="button" data-delete-member="${member.id}">계정 삭제</button>`);

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
                <div class="member-role-cell">
                  <select class="control-select compact-select" data-member-business-unit="${member.id}">
                    ${renderBusinessUnitOptions(member.businessUnit)}
                  </select>
                  <span>${escapeHtml([member.department || "부서 미입력", member.position || "직책 미입력"].join(" · "))}</span>
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
    general: "기본 조회 중심의 일반 사용자 계정",
    search_firm: "외부 서치펌 후보자 발굴과 등록 계정",
    hiring_manager: "현업 검토와 후보자 탐색 중심 계정",
    business_recruiter: "사업부 단위 후보자 등록과 운영 계정",
    division_recruiter: "부문 단위 채용 운영 계정",
    admin: "회원 승인과 권한 설정까지 가능한 관리자"
  }[role] || "";
}

function renderManagementTabs() {
  const tabs = [
    { id: "members", label: "회원 관리" },
    { id: "logs", label: "Log 관리" }
  ];

  return `
    <div class="management-tabs" role="tablist" aria-label="Management tabs">
      ${tabs.map((tab) => `
        <button class="management-tab ${state.managementTab === tab.id ? "is-active" : ""}" type="button" role="tab" aria-selected="${state.managementTab === tab.id}" data-management-tab="${tab.id}">
          ${tab.label}
        </button>
      `).join("")}
    </div>
  `;
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

  if (!["members", "logs"].includes(state.managementTab)) {
    state.managementTab = "members";
  }

  const tabs = renderManagementTabs();

  if (state.managementTab === "logs") {
    content.innerHTML = `
      ${tabs}
      <div class="dashboard-grid member-dashboard">
        <section class="content-panel span-12">
          <div class="panel-header">
            <h4>Log 관리</h4>
            <span class="small-pill">관리자 전용</span>
          </div>
          ${renderAuditContent({ manageable: true })}
        </section>
      </div>
    `;
    return;
  }

  const pending = state.members.filter((member) => member.status === "pending").length;
  const active = state.members.filter((member) => member.status === "active").length;
  const suspended = state.members.filter((member) => member.status === "suspended").length;
  const filteredMembers = getFilteredMembers();

  content.innerHTML = `
    ${tabs}
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

async function fetchTrendingPeople(options = {}) {
  state.trendingLoading = true;
  state.trendingError = "";
  renderTrendingPeople();

  try {
    const params = new URLSearchParams();

    if (options.force) {
      params.set("force", "1");
    }

    if (options.date) {
      params.set("date", options.date);
    } else if (state.trendingSelectedDate && !options.forceLatest) {
      params.set("date", state.trendingSelectedDate);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`/api/trending-people${query}`);
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Trending people API failed: ${response.status}`);
    }

    state.trendingReport = payload.report;
    state.trendingSelectedDate = payload.report?.targetDate || options.date || "";
    state.trendingLoading = false;
    state.trendingError = "";
    persistState();
    renderTrendingPeople();
    fetchTrendingHistory({ silent: true });
    showToast("Today's Talent 리포트를 불러왔습니다.");
  } catch (error) {
    console.warn("Trending people report failed.", error);
    state.trendingLoading = false;
    state.trendingError = "Today's Talent 리포트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
    renderTrendingPeople();
  }
}

async function fetchTrendingHistory(options = {}) {
  state.trendingHistoryLoading = true;

  if (!options.silent) {
    renderTrendingPeople();
  }

  try {
    const response = await fetch("/api/trending-people?history=1");
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Trending history API failed: ${response.status}`);
    }

    state.trendingHistory = Array.isArray(payload.reports) ? payload.reports : [];
    state.trendingHistoryLoading = false;
    persistState();

    if (!options.silent) {
      renderTrendingPeople();
    }
  } catch (error) {
    console.warn("Trending report history failed.", error);
    state.trendingHistoryLoading = false;

    if (!options.silent) {
      renderTrendingPeople();
    }
  }
}

async function fetchTrendingMailSettings() {
  if (!isAdmin() || state.trendingMailLoading) {
    return;
  }

  state.trendingMailLoading = true;

  try {
    const response = await fetch("/api/trending-mail");
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Trending mail settings failed: ${response.status}`);
    }

    state.trendingMailSettings = normalizeTrendingMailSettings(payload.settings);
    state.trendingMailError = "";
    persistState({ skipRemoteSync: true });
  } catch (error) {
    console.warn("Trending mail settings failed.", error);
    state.trendingMailError = "메일링 설정을 불러오지 못했습니다.";
  } finally {
    state.trendingMailLoading = false;
    renderTrendingPeople();
  }
}

function collectTrendingMailSettingsFromForm(form) {
  const recipients = normalizeEmailList(form.recipients.value);
  const invalidRecipients = recipients.filter((email) => !isValidEmail(email));

  if (invalidRecipients.length) {
    throw new Error(`수신처 이메일 형식을 확인해주세요: ${invalidRecipients.join(", ")}`);
  }

  return normalizeTrendingMailSettings({
    enabled: form.enabled.checked,
    sendTime: form.sendTime.value,
    recipients,
    subjectPrefix: form.subjectPrefix.value,
    timezone: "Asia/Seoul",
    updatedBy: getCurrentActorName()
  });
}

async function saveTrendingMailSettings() {
  const form = $("#trending-mail-form");

  if (!form || !isAdmin()) {
    return;
  }

  try {
    state.trendingMailLoading = true;
    state.trendingMailError = "";
    renderTrendingPeople();
    const settings = collectTrendingMailSettingsFromForm(form);
    const response = await fetch("/api/trending-mail", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Trending mail save failed: ${response.status}`);
    }

    state.trendingMailSettings = normalizeTrendingMailSettings(payload.settings);
    state.trendingMailStatus = "메일링 설정을 저장했습니다.";
    addAuditLog("Today's Talent 메일링 설정", "Today's Talent", `${settings.sendTime} · ${settings.recipients.length}명`);
    persistState();
    showToast("메일링 설정을 저장했습니다.");
  } catch (error) {
    console.warn("Trending mail save failed.", error);
    state.trendingMailError = error.message || "메일링 설정 저장에 실패했습니다.";
    showToast(state.trendingMailError);
  } finally {
    state.trendingMailLoading = false;
    renderTrendingPeople();
  }
}

async function sendTrendingMailTest() {
  const form = $("#trending-mail-form");

  if (!form || !isAdmin()) {
    return;
  }

  try {
    state.trendingMailLoading = true;
    state.trendingMailError = "";
    renderTrendingPeople();
    const settings = collectTrendingMailSettingsFromForm(form);
    const response = await fetch("/api/trending-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "test",
        settings,
        report: state.trendingReport,
        requestedBy: getCurrentActorName()
      })
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Trending mail send failed: ${response.status}`);
    }

    state.trendingMailSettings = normalizeTrendingMailSettings(payload.settings || settings);
    state.trendingMailStatus = payload.message || "테스트 메일 발송을 요청했습니다.";
    addAuditLog("Today's Talent 테스트 메일", "Today's Talent", `${settings.recipients.length}명`);
    persistState();
    showToast(state.trendingMailStatus);
  } catch (error) {
    console.warn("Trending mail send failed.", error);
    state.trendingMailError = error.message || "테스트 메일 발송에 실패했습니다.";
    showToast(state.trendingMailError);
  } finally {
    state.trendingMailLoading = false;
    renderTrendingPeople();
  }
}

function normalizeTrendingDegree(value) {
  return { 박: "박사", 석: "석사", 학: "학사", 박사: "박사", 석사: "석사", 학사: "학사" }[value] || "";
}

function trendingEducationToCandidateEducation(item) {
  const year = String(item.year || item.graduationYear || "").match(/\d{4}/)?.[0] || "";

  return {
    degree: normalizeTrendingDegree(item.degree),
    school: normalizeTrendingSchoolName(item.school),
    major: item.major || "",
    start: "",
    end: year
  };
}

function trendingCareerToCandidateCareer(item) {
  return {
    country: normalizeTrendingCountry(item.country),
    company: item.company || "",
    rank: item.rank || "",
    position: [item.title || item.position || "", item.department || item.organization || item.team || ""].filter(Boolean).join(" · "),
    start: item.start || item.startYear || "",
    end: item.end || item.endYear || "",
    achievements: ""
  };
}

function findTrendingPerson(identifier) {
  const people = state.trendingReport?.people || [];
  return people.find((person) => String(person.id || person.name) === String(identifier));
}

function registerTrendingPerson(identifier) {
  const person = findTrendingPerson(identifier);

  if (!person) {
    showToast("등록할 Today's Talent 프로필을 찾지 못했습니다.");
    return;
  }

  const duplicate = getVisibleCandidates().find((candidate) =>
    candidate.name === person.name &&
    (!person.currentOrg || candidate.company === person.currentOrg)
  );

  if (duplicate) {
    state.selectedCandidateId = duplicate.id;
    setView("detail");
    showToast("이미 등록된 인재 프로필을 열었습니다.");
    return;
  }

  const today = getTodayDate();
  const achievements = Array.isArray(person.achievements) ? person.achievements.filter(Boolean) : [];
  const reasons = Array.isArray(person.selectionReasons)
    ? person.selectionReasons.map((reason) => typeof reason === "string" ? reason : reason.text).filter(Boolean)
    : [];
  const candidate = normalizeCandidate({
    id: createId("cand"),
    name: person.name,
    initials: `${String(person.name || "").slice(0, 1)}${String(person.name || "").slice(-1)}`,
    role: person.currentTitle || "Today's Talent",
    company: person.currentOrg || "소속 확인 필요",
    years: 0,
    jobFamily: "DX News Radar",
    organization: "",
    visibility: "all",
    status: "interested",
    owner: getCurrentActorName(),
    createdAt: today,
    updatedAt: today,
    lastContactedAt: "",
    location: "",
    source: `Today's Talent ${state.trendingReport?.targetDate || today}`,
    dataQuality: 82,
    parsingConfidence: 82,
    avatarColor: "#4e5968",
    photoUrl: person.profileImageUrl || "",
    birthYear: person.birthYear || "",
    linkedinUrl: person.linkedinUrl || "",
    referenceUrl: (person.selectionReasons || [])
      .flatMap((reason) => reason.links || [])
      .find((link) => link.url)?.url || "",
    skills: [...new Set([...(person.topics || []), "DX", "뉴스 화제 인물"].filter(Boolean))],
    tags: ["Today's Talent", "뉴스 기반 소싱", "검수 필요"],
    summary: [...achievements, ...reasons].slice(0, 4).join("\n"),
    evidence: reasons.slice(0, 4),
    education: (person.education || []).map(trendingEducationToCandidateEducation).filter(hasAnyRecordValue),
    career: (person.career || []).map(trendingCareerToCandidateCareer).filter(hasAnyRecordValue),
    applications: [],
    timeline: [
      {
        type: "등록",
        text: "Today's Talent 메뉴에서 인재 Pool로 등록",
        actor: getCurrentActorName(),
        date: today
      }
    ]
  });

  state.candidates.unshift(candidate);
  state.selectedCandidateId = candidate.id;
  addAuditLog("Today's Talent Pool 등록", candidate.name, "뉴스 기반 후보자 등록");
  persistState();
  render();
  showToast(`${candidate.name} 인물을 인재 Pool에 등록했습니다.`);
  setView("detail");
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
  const visibility = normalizeCandidateVisibility(form.get("visibility"));
  let organization = normalizeBusinessUnit(form.get("organization"));
  if (visibility === "business_unit" && !organization) {
    organization = getMemberBusinessUnit();
  }
  const birthYear = form.get("birthYear").toString().trim();
  const owner = normalizeOwnerSelection(form.get("owner"));
  const today = getTodayDate();
  const candidateName = name || "이름 미입력";
  const candidateCompany = company || "미입력";
  const candidateRole = role || "미입력";

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
    name: candidateName,
    initials: name ? `${name.slice(0, 1)}${name.slice(-1)}` : "미",
    role: candidateRole,
    company: candidateCompany,
    years: estimateCareerYears(career),
    jobFamily: "Equipment Software",
    organization,
    visibility,
    status: "interested",
    owner,
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
      { type: "등록", text: "후보자 신규 등록", actor: owner, date: today },
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

function updateDashboardFilters() {
  state.dashboardFilters.organization = $("#dashboard-organization-filter")?.value || "all";
  persistState();
  renderDashboard();
}

function getFormValues(form, name) {
  return [...new FormData(form).getAll(name)]
    .map((value) => value.toString().trim())
    .filter(Boolean);
}

function getSelectedScreeningAccessIds(picker) {
  const fieldName = picker?.dataset.screeningAccessFieldName || "accessMemberIds";

  return new Set(
    [...picker.querySelectorAll(`input[name="${fieldName}"]`)]
      .map((input) => input.value)
      .filter(Boolean)
  );
}

function updateScreeningAccessResults(searchInput) {
  const picker = searchInput.closest("[data-screening-access-picker]");
  const results = picker?.querySelector("[data-screening-access-results]");

  if (!picker || !results) {
    return;
  }

  const query = searchInput.value.trim().toLowerCase();
  const roleFilter = picker.dataset.screeningAccessRoleFilter || "";

  if (!query) {
    results.innerHTML = `<span class="form-help">검색어를 입력하면 추가 가능한 회원이 표시됩니다.</span>`;
    return;
  }

  const selectedIds = getSelectedScreeningAccessIds(picker);
  const members = getActiveScreeningAccessMembers(roleFilter)
    .filter((member) => !selectedIds.has(member.id))
    .filter((member) => screeningAccessMemberSearchText(member).includes(query))
    .slice(0, 8);

  if (!members.length) {
    results.innerHTML = `<span class="form-help">추가 가능한 회원이 없습니다.</span>`;
    return;
  }

  results.innerHTML = members.map((member) => `
    <button class="screening-access-result" type="button" data-add-screening-access-member="${escapeHtml(member.id)}">
      <span>
        <strong>${escapeHtml(member.name)}</strong>
        <small>${escapeHtml(getRoleLabel(member.role))} · ${escapeHtml(member.email || "-")}</small>
      </span>
      <em>추가</em>
    </button>
  `).join("");
}

function addScreeningAccessMember(button) {
  const member = state.members.find((item) => item.id === button.dataset.addScreeningAccessMember && item.status === "active");
  const picker = button.closest("[data-screening-access-picker]");
  const selected = picker?.querySelector("[data-screening-access-selected]");
  const searchInput = picker?.querySelector("[data-screening-access-search]");

  if (!member || !picker || !selected || getSelectedScreeningAccessIds(picker).has(member.id)) {
    return;
  }

  selected.insertAdjacentHTML("beforeend", renderScreeningAccessMemberChip(member, false, picker.dataset.screeningAccessFieldName || "accessMemberIds"));

  if (searchInput) {
    searchInput.value = "";
    updateScreeningAccessResults(searchInput);
    searchInput.focus();
  }
}

function removeScreeningAccessMember(button) {
  const picker = button.closest("[data-screening-access-picker]");
  const chip = button.closest("[data-screening-access-member]");
  const searchInput = picker?.querySelector("[data-screening-access-search]");

  chip?.remove();

  if (searchInput) {
    updateScreeningAccessResults(searchInput);
  }
}

async function attachmentFromFile(file) {
  if (!file || !file.size) {
    return null;
  }

  let text = "";

  try {
    const result = await readResumeText(file);
    text = result.text || "";
  } catch (error) {
    console.warn("Attachment text extraction failed.", error);
  }

  return {
    name: file.name,
    size: file.size,
    type: file.type || "",
    dataUrl: await readFileAsDataUrl(file),
    text
  };
}

function getScreeningFormBusinessUnit(value, member = getCurrentMember()) {
  const normalized = normalizeBusinessUnit(value);

  if (canViewBusinessUnitScreeningFolders(member)) {
    return getMemberBusinessUnit(member) || normalized;
  }

  return normalized;
}

async function createScreeningFolder(form) {
  if (!canCreateScreeningFolder()) {
    showToast("포지션 생성 권한이 없습니다.");
    return;
  }

  const currentMember = getCurrentMember();
  const jdFile = form.elements.jdFile?.files?.[0];
  const accessMemberIds = [...new Set([currentMember.id, ...getFormValues(form, "accessMemberIds")])];
  const receptionMemberIds = getFormValues(form, "receptionMemberIds");
  const secondScreeningMemberIds = getFormValues(form, "secondScreeningMemberIds");
  const title = getFormText(form, "title") || getFormText(form, "positionName") || "신규 포지션";
  const folder = normalizeScreeningFolder({
    id: createId("screening-folder"),
    title,
    businessUnit: getScreeningFormBusinessUnit(getFormText(form, "businessUnit"), currentMember),
    department: getFormText(form, "department"),
    positionName: getFormText(form, "positionName"),
    jdText: getFormText(form, "jdText"),
    jdAttachment: await attachmentFromFile(jdFile),
    createdById: currentMember.id,
    createdByName: currentMember.name,
    createdAt: getTodayDate(),
    updatedAt: getTodayDate(),
    accessMemberIds,
    receptionMemberIds,
    secondScreeningMemberIds,
    interviewPanel: { names: "", emails: "", availability: "" },
    applicants: []
  });

  state.screeningFolders.unshift(folder);
  state.selectedScreeningFolderId = folder.id;
  state.screeningPositionModalOpen = false;
  addAuditLog("Screening 포지션 생성", folder.title, "포지션 스크리닝 생성");
  persistState();
  showToast(`${folder.title} 포지션을 생성했습니다.`);
  render();
}

async function registerScreeningApplicant(form) {
  const folder = getScreeningFolder(getFormText(form, "folderId"));

  if (!folder || !canRegisterScreeningApplicant(folder)) {
    showToast("지원자를 등록할 수 없는 포지션입니다.");
    return;
  }

  const name = getFormText(form, "name");

  if (!name) {
    showToast("지원자 이름을 입력해주세요.");
    return;
  }

  const currentMember = getCurrentMember();
  const sourceType = isSearchFirmRole(currentMember) || getFormText(form, "sourceType") === "search_firm" ? "search_firm" : "direct";
  const searchFirmMemberId = sourceType === "search_firm" ? getFormText(form, "searchFirmMemberId") || (isSearchFirmRole() ? currentMember.id : "") : "";

  if (sourceType === "search_firm" && !searchFirmMemberId) {
    showToast("서치펌 등록 지원자는 서치펌 담당자를 선택해주세요.");
    return;
  }

  const resumeFile = form.elements.resumeFile?.files?.[0];
  const applicant = normalizeScreeningApplicant({
    id: createId("screening-applicant"),
    name,
    sourceType,
    searchFirmMemberId,
    registeredById: currentMember.id,
    registeredByName: currentMember.name,
    company: getFormText(form, "company"),
    currentRole: getFormText(form, "currentRole"),
    email: getFormText(form, "email"),
    phone: getFormText(form, "phone"),
    summary: getFormText(form, "summary"),
    resumeAttachment: await attachmentFromFile(resumeFile),
    stage: "reception",
    createdAt: getTodayDate(),
    updatedAt: getTodayDate()
  });
  const fit = evaluateApplicantFit(folder, applicant);
  applicant.fitGrade = fit.grade;
  applicant.fitComment = fit.comment;

  folder.applicants.unshift(applicant);
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  state.screeningApplicantModalOpen = false;
  state.screeningDetailStep = "reception";
  addAuditLog("Screening 지원자 등록", applicant.name, folder.title);
  persistState();
  showToast(isSearchFirmRole(currentMember)
    ? `${applicant.name} 지원자를 접수 저장했습니다. 최종 제출하면 1차 스크리닝으로 이동합니다.`
    : `${applicant.name} 지원자를 접수 단계에 등록했습니다.`);
  renderScreening();
}

async function saveScreeningPositionJd(form) {
  const folder = getScreeningFolder(getFormText(form, "folderId"));

  if (!folder || !canManageScreeningFolder(folder)) {
    showToast("JD 정보를 수정할 수 없습니다.");
    return;
  }

  const jdFile = form.elements.jdFile?.files?.[0];
  folder.title = getFormText(form, "title") || getFormText(form, "positionName") || folder.title || "신규 포지션";
  folder.businessUnit = getScreeningFormBusinessUnit(getFormText(form, "businessUnit"));
  folder.department = getFormText(form, "department");
  folder.positionName = getFormText(form, "positionName");
  folder.jdText = getFormText(form, "jdText");

  if (jdFile) {
    folder.jdAttachment = await attachmentFromFile(jdFile);
  }

  folder.applicants = folder.applicants.map((applicant) => {
    const fit = evaluateApplicantFit(folder, applicant);
    return {
      ...applicant,
      fitGrade: fit.grade,
      fitComment: fit.comment
    };
  });
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  state.screeningJdModalOpen = false;
  addAuditLog("Screening JD 수정", folder.title, "포지션 정보 및 JD 기준 변경");
  persistState();
  showToast("JD 정보를 저장했습니다.");
  renderScreening();
}

function updateScreeningApplicantStage(applicantId, stage, options = {}) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, applicantId);

  if (!folder || !applicant) {
    showToast("지원자 정보를 찾지 못했습니다.");
    return;
  }

  const actor = getCurrentActorName();
  applicant.stage = stage;
  applicant.updatedAt = getTodayDate();

  if (stage === "first_pass" || stage === "first_reject") {
    applicant.firstScreening = {
      decision: stage === "first_pass" ? "pass" : "reject",
      by: actor,
      at: getTimestampText(),
      note: options.note || ""
    };
  }

  if (stage === "second_draft" || stage === "second_reject" || stage === "second_pass") {
    applicant.secondScreening = {
      ...(applicant.secondScreening || {}),
      decision: stage === "second_reject" ? "reject" : stage === "second_pass" ? "pass" : "draft_pass",
      by: actor,
      at: getTimestampText(),
      note: options.note || ""
    };
  }

  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);

  if (stage === "first_pass") {
    state.screeningDetailStep = "second";
  } else if (stage === "second_pass") {
    state.screeningDetailStep = "mail";
  }

  addAuditLog("Screening 단계 변경", applicant.name, `${folder.title} · ${SCREENING_STAGE_LABELS[stage]}`);
  persistState();
  renderScreening();
}

function submitScreeningApplicant(applicantId) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, applicantId);

  if (!folder || !applicant || !canSubmitScreeningApplicant(folder, applicant)) {
    showToast("지원자 최종 제출 권한이 없습니다.");
    return;
  }

  const actor = getCurrentMember();
  applicant.stage = "registered";
  applicant.submittedAt = getTimestampText();
  applicant.submittedById = actor?.id || "";
  applicant.submittedByName = actor?.name || getCurrentActorName();
  applicant.updatedAt = getTodayDate();
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  addAuditLog("Screening 지원자 최종 제출", applicant.name, `${folder.title} · 1차 스크리닝 이동`);
  persistState();

  if (!isSearchFirmRole(actor)) {
    state.screeningDetailStep = "first";
  }

  showToast(`${applicant.name} 지원자를 1차 스크리닝으로 제출했습니다.`);
  renderScreening();
}

function revertScreeningApplicantStage(applicantId) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, applicantId);

  if (!folder || !applicant || !canAccessScreeningFolder(folder) || (!isRecruitingRole() && !isHiringManagerRole())) {
    showToast("단계 이동 권한이 없습니다.");
    return;
  }

  const previousStageMap = {
    registered: "reception",
    first_pass: "registered",
    first_reject: "registered",
    second_draft: "first_pass",
    second_reject: "first_pass",
    second_pass: "second_draft",
    contact_requested: "second_draft",
    contact_ready: "second_draft",
    interview_mail_sent: "second_draft"
  };
  const targetStage = previousStageMap[applicant.stage];

  if (!targetStage) {
    showToast("되돌릴 이전 단계가 없습니다.");
    return;
  }

  const actor = getCurrentActorName();
  const previousStage = applicant.stage;
  applicant.stage = targetStage;
  applicant.updatedAt = getTodayDate();

  if (targetStage === "reception") {
    applicant.submittedAt = "";
    applicant.submittedById = "";
    applicant.submittedByName = "";
    applicant.firstScreening = null;
    state.screeningDetailStep = "reception";
  } else if (targetStage === "registered") {
    applicant.firstScreening = {
      ...(applicant.firstScreening || {}),
      decision: "reopened",
      by: actor,
      at: getTimestampText(),
      note: "1차 판정 번복"
    };
    state.screeningDetailStep = "first";
  } else if (targetStage === "first_pass") {
    applicant.secondScreening = {
      ...(applicant.secondScreening || {}),
      decision: "reopened",
      by: actor,
      at: getTimestampText(),
      note: "2차 판정 번복"
    };
    state.screeningDetailStep = "second";
  } else if (targetStage === "second_draft") {
    applicant.secondScreening = {
      ...(applicant.secondScreening || {}),
      decision: "draft_pass",
      by: actor,
      at: getTimestampText(),
      note: "전화면접 단계에서 2차 통과 예정으로 되돌림"
    };
    state.screeningDetailStep = "second";
  }

  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  addAuditLog("Screening 단계 되돌리기", applicant.name, `${SCREENING_STAGE_LABELS[previousStage]} → ${SCREENING_STAGE_LABELS[targetStage]}`);
  persistState();
  showToast(`${applicant.name} 지원자를 ${SCREENING_STAGE_LABELS[targetStage]} 단계로 이동했습니다.`);
  renderScreening();
}

function saveScreeningAccess(form) {
  const folder = getScreeningFolder(form.dataset.screeningAccessForm);

  if (!folder || !canManageScreeningFolder(folder)) {
    showToast("포지션 접근 권한을 수정할 수 없습니다.");
    return;
  }

  folder.accessMemberIds = [...new Set([folder.createdById, ...getFormValues(form, "accessMemberIds")].filter(Boolean))];
  folder.receptionMemberIds = getFormValues(form, "receptionMemberIds")
    .filter((id) => state.members.find((member) => member.id === id)?.role === "search_firm");
  folder.secondScreeningMemberIds = getFormValues(form, "secondScreeningMemberIds")
    .filter((id) => state.members.find((member) => member.id === id)?.role === "hiring_manager");
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  state.screeningAccessModalOpen = false;
  addAuditLog("Screening 권한 관리", folder.title, "포지션 및 단계별 조회 권한 변경");
  persistState();
  showToast("포지션 권한을 저장했습니다.");
  renderScreening();
}

function finalPassSecondScreening(form) {
  const folder = getScreeningFolder(getFormText(form, "folderId"));

  if (!folder || !canRunSecondScreening(folder)) {
    showToast("2단계 스크리닝 최종 통과 권한이 없습니다.");
    return;
  }

  const draftApplicants = folder.applicants.filter((applicant) => applicant.stage === "second_draft");

  if (!draftApplicants.length) {
    showToast("통과 예정으로 저장된 지원자가 없습니다.");
    return;
  }

  folder.interviewPanel = {
    names: getFormText(form, "names"),
    emails: getFormText(form, "emails"),
    availability: getFormText(form, "availability")
  };

  draftApplicants.forEach((applicant) => {
    applicant.stage = "second_pass";
    applicant.updatedAt = getTodayDate();
    applicant.secondScreening = {
      ...(applicant.secondScreening || {}),
      decision: "pass",
      by: getCurrentActorName(),
      at: getTimestampText()
    };
  });

  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  state.screeningDetailStep = "mail";
  addAuditLog("Screening 2단계 최종 통과", folder.title, `${draftApplicants.length}명 통과`);
  persistState();
  showToast(`${draftApplicants.length}명을 2단계 통과 처리했습니다.`);
  renderScreening();
}

function saveScreeningContact(form) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, form.dataset.screeningContactForm);

  if (!folder || !applicant || !canManageScreeningContact(folder, applicant)) {
    showToast("연락처를 저장할 수 없습니다.");
    return;
  }

  applicant.email = getFormText(form, "email").toLowerCase();
  applicant.phone = getFormText(form, "phone");

  if (applicant.email && applicant.phone && applicant.stage === "contact_requested") {
    applicant.stage = "contact_ready";
  }

  applicant.updatedAt = getTodayDate();
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  addAuditLog("Screening 연락처 저장", applicant.name, folder.title);
  persistState();
  showToast("지원자 연락처를 저장했습니다.");
  renderScreening();
}

function getSearchFirmMember(applicant) {
  return state.members.find((member) => member.id === applicant.searchFirmMemberId || member.id === applicant.registeredById) || null;
}

async function sendScreeningMail(payload) {
  const response = await fetch("/api/screening-mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "메일 발송에 실패했습니다.");
  }

  return result;
}

async function requestScreeningContact(applicantId) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, applicantId);
  const searchFirm = applicant ? getSearchFirmMember(applicant) : null;

  if (!folder || !applicant || applicant.sourceType !== "search_firm") {
    showToast("서치펌 등록 지원자에게만 연락처 요청이 가능합니다.");
    return;
  }

  if (!searchFirm?.email) {
    showToast("서치펌 담당자 이메일이 없습니다.");
    return;
  }

  await sendScreeningMail({
    action: "contact_request",
    recipient: searchFirm.email,
    searchFirmName: searchFirm.name,
    folder,
    applicant
  });

  applicant.stage = "contact_requested";
  applicant.contactRequest = {
    sentAt: getTimestampText(),
    recipient: searchFirm.email,
    by: getCurrentActorName()
  };
  applicant.updatedAt = getTodayDate();
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  addAuditLog("Screening 연락처 요청 메일", applicant.name, searchFirm.email);
  persistState();
  showToast("서치펌 담당자에게 연락처 요청 메일을 발송했습니다.");
  renderScreening();
}

async function sendPhoneInterviewMail(applicantId) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, applicantId);

  if (!folder || !applicant) {
    showToast("지원자 정보를 찾지 못했습니다.");
    return;
  }

  if (!applicant.email || !applicant.phone) {
    showToast("지원자 이메일과 휴대폰 번호를 먼저 입력해주세요.");
    return;
  }

  if (!folder.interviewPanel.availability) {
    showToast("면접 가능 시간대를 먼저 입력해주세요.");
    return;
  }

  const interviewerEmails = normalizeEmailList(folder.interviewPanel.emails);

  await sendScreeningMail({
    action: "phone_interview",
    recipients: [applicant.email, ...interviewerEmails],
    folder,
    applicant,
    interviewPanel: folder.interviewPanel
  });

  applicant.stage = "interview_mail_sent";
  applicant.phoneInterviewMail = {
    sentAt: getTimestampText(),
    recipients: [applicant.email, ...interviewerEmails],
    by: getCurrentActorName()
  };
  applicant.updatedAt = getTodayDate();
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  addAuditLog("Screening 전화면접 안내 메일", applicant.name, folder.title);
  persistState();
  showToast("전화면접 안내 메일을 발송했습니다.");
  renderScreening();
}

async function deleteCandidateProfile(candidateId) {
  const candidate = findCandidate(candidateId);

  if (!candidate || !canManageCandidateProfile(candidate)) {
    return;
  }

  if (!window.confirm(`${candidate.name} 후보자 프로필을 삭제할까요? 삭제 후에는 목록에서 제거됩니다.`)) {
    return;
  }

  state.candidates = state.candidates.filter((item) => item.id !== candidate.id);

  if (state.selectedCandidateId === candidate.id) {
    state.selectedCandidateId = getVisibleCandidates()[0]?.id || "";
  }

  state.aiResults = state.aiResults.filter((item) => item.id !== candidate.id);
  state.isEditingCandidate = false;
  state.editSnapshot = null;
  addAuditLog("후보자 프로필 삭제", candidate.name, "인재 Pool 프로필 제거");
  persistState();

  if (state.view === "detail") {
    setView("pool");
    restorePoolReturnPosition();
  } else {
    render();
  }

  try {
    await deleteSupabaseRecord("candidates", candidate.id);
    showToast(`${candidate.name} 후보자 프로필을 삭제했습니다.`);
  } catch (error) {
    console.warn("Candidate remote delete failed.", error);
    showToast("프로필은 화면에서 삭제됐지만 원격 DB 삭제 확인에 실패했습니다.");
  }
}

function changeCandidateStatus(status) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 상태를 변경할 수 없는 프로필입니다.");
    return;
  }

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

async function verifyMemberPassword(member, password) {
  if (member.passwordHash) {
    return member.passwordHash === await hashPassword(member.email, password);
  }

  if (member.password && member.password === password) {
    member.passwordHash = await hashPassword(member.email, password);
    member.password = "";
    return true;
  }

  return false;
}

function showMemberProfileError(message) {
  const errorBox = $("#member-profile-error");

  if (!errorBox) {
    return;
  }

  errorBox.hidden = !message;
  errorBox.innerHTML = message ? `<strong>저장 전 확인이 필요합니다.</strong><span>${escapeHtml(message)}</span>` : "";
}

function openMemberProfileModal() {
  if (!getCurrentMember()) {
    return;
  }

  state.memberProfileModalOpen = true;
  renderUserMenu();
}

function closeMemberProfileModal() {
  if (!state.memberProfileModalOpen) {
    return;
  }

  state.memberProfileModalOpen = false;
  renderUserMenu();
}

async function saveCurrentMemberProfile(form) {
  const member = getCurrentMember();

  if (!member || !form) {
    return;
  }

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const businessUnit = normalizeBusinessUnit(formData.get("businessUnit"));
  const department = String(formData.get("department") || "").trim();
  const position = String(formData.get("position") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const passwordChangeRequested = Boolean(currentPassword || newPassword || confirmPassword);

  showMemberProfileError("");

  if (passwordChangeRequested) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMemberProfileError("비밀번호 변경 시 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인을 모두 입력해주세요.");
      return;
    }

    if (newPassword.length < 8) {
      showMemberProfileError("새 비밀번호는 8자 이상으로 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMemberProfileError("새 비밀번호와 확인 값이 일치하지 않습니다.");
      return;
    }

    if (!await verifyMemberPassword(member, currentPassword)) {
      showMemberProfileError("현재 비밀번호가 일치하지 않습니다.");
      return;
    }

    member.password = "";
    member.passwordHash = await hashPassword(member.email, newPassword);
  }

  const beforeName = member.name;
  member.name = name || member.name;
  member.businessUnit = businessUnit;
  member.department = department;
  member.position = position;
  member.phone = phone;
  member.note = note;

  addAuditLog(
    passwordChangeRequested ? "회원 정보 및 비밀번호 수정" : "회원 정보 수정",
    member.name,
    "본인 프로필 업데이트",
    beforeName || member.name
  );
  state.memberProfileModalOpen = false;
  persistState();
  render();
  showToast("내 정보를 저장했습니다.");
}

async function handleLoginSubmit(form) {
  const formData = new FormData(form);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const member = state.members.find((item) => item.email === email);

  if (!member || !await verifyMemberPassword(member, password)) {
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
  state.memberProfileModalOpen = false;
  state.view = canAccessView(state.view, member) ? state.view : getDefaultView(member);
  addAuditLog("로그인", member.name, "시스템 접속", member.name);
  persistState();
  render();
  showToast(`${member.name}님, 로그인되었습니다.`);
}

async function handleSignupSubmit(form) {
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");
  const rawRequestedRole = String(formData.get("role") || "general");
  const requestedRole = LEGACY_MEMBER_ROLE_MAP[rawRequestedRole] || rawRequestedRole;

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
    password: "",
    passwordHash: await hashPassword(email, password),
    role: requestedRole === "admin" || !MEMBER_ROLES[requestedRole] ? "general" : requestedRole,
    status: "pending",
    businessUnit: formData.get("businessUnit"),
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
  state.memberProfileModalOpen = false;
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

function setManagementTab(tab) {
  if (!["members", "logs"].includes(tab) || !isAdmin()) {
    return;
  }

  state.managementTab = tab;
  persistState();
  renderMembers();
}

async function deleteAuditLog(logId) {
  if (!isAdmin()) {
    return;
  }

  const log = state.auditLogs.find((item) => item.id === logId);

  if (!log) {
    return;
  }

  if (!window.confirm("선택한 로그를 삭제할까요?")) {
    return;
  }

  state.auditLogs = state.auditLogs.filter((item) => item.id !== logId);
  persistState();
  renderMembers();
  showToast("로그를 삭제했습니다.");

  try {
    await deleteSupabaseRecord("audit_logs", logId);
  } catch (error) {
    console.warn("Audit log remote delete failed.", error);
    showToast("화면에서는 삭제됐지만 원격 DB 삭제 확인에 실패했습니다.");
  }
}

async function clearAuditLogs() {
  if (!isAdmin() || !state.auditLogs.length) {
    return;
  }

  if (!window.confirm("전체 로그를 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) {
    return;
  }

  const logIds = state.auditLogs.map((log) => log.id).filter(Boolean);
  state.auditLogs = [];
  persistState();
  renderMembers();
  showToast("전체 로그를 삭제했습니다.");

  try {
    await Promise.allSettled(logIds.map((logId) => deleteSupabaseRecord("audit_logs", logId)));
  } catch (error) {
    console.warn("Audit logs remote clear failed.", error);
  }
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

async function resetMemberPassword(memberId) {
  const member = findMember(memberId);

  if (!member || !isAdmin()) {
    return;
  }

  member.password = "";
  member.passwordHash = await hashPassword(member.email, TEMP_PASSWORD);
  addAuditLog("회원 비밀번호 초기화", member.name, "임시 비밀번호 발급");
  persistState();
  renderMembers();
  showToast(`${member.name} 회원의 임시 비밀번호는 ${TEMP_PASSWORD} 입니다.`);
}

async function deleteMemberAccount(memberId) {
  const member = findMember(memberId);

  if (!member || !isAdmin() || member.id === state.currentUserId) {
    return;
  }

  const activeAdmins = state.members.filter((item) => item.role === "admin" && item.status === "active");

  if (member.role === "admin" && member.status === "active" && activeAdmins.length <= 1) {
    showToast("마지막 활성 관리자 계정은 삭제할 수 없습니다.");
    return;
  }

  if (!window.confirm(`${member.name} 회원 계정을 삭제할까요? 삭제 후 해당 계정은 로그인할 수 없습니다.`)) {
    return;
  }

  state.members = state.members.filter((item) => item.id !== member.id);

  if (state.memberFilters.role !== "all" && !state.members.some((item) => item.role === state.memberFilters.role)) {
    state.memberFilters.role = "all";
  }

  addAuditLog("회원 계정 삭제", member.name, `${member.email} 계정 제거`);
  persistState();
  render();

  try {
    await deleteSupabaseRecord("app_members", member.id);
    showToast(`${member.name} 회원 계정을 삭제했습니다.`);
  } catch (error) {
    console.warn("Member remote delete failed.", error);
    showToast("회원은 화면에서 삭제됐지만 원격 DB 삭제 확인에 실패했습니다.");
  }
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

function updateMemberBusinessUnit(memberId, businessUnit) {
  const member = findMember(memberId);

  if (!member || !isAdmin()) {
    return;
  }

  member.businessUnit = normalizeBusinessUnit(businessUnit);
  addAuditLog("회원 사업부 변경", member.name, member.businessUnit || "미지정");
  persistState();
  showToast(`${member.name} 회원의 사업부를 ${member.businessUnit || "미지정"}으로 변경했습니다.`);
  renderMembers();
}

function updateRolePermission(role, view, enabled) {
  if (!isAdmin() || !MEMBER_ROLES[role] || role === "admin" || view === "dashboard" || view === "members") {
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

    if (event.target.closest("[data-open-member-profile]")) {
      openMemberProfileModal();
      return;
    }

    if (event.target.closest("[data-close-member-profile]") || event.target.matches("[data-member-profile-backdrop]")) {
      closeMemberProfileModal();
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
      resetMemberPassword(resetMemberPasswordButton.dataset.resetMemberPassword).catch((error) => {
        console.warn(error);
        showToast("비밀번호 초기화 중 오류가 발생했습니다.");
      });
      return;
    }

    const deleteMemberButton = event.target.closest("[data-delete-member]");
    if (deleteMemberButton) {
      deleteMemberAccount(deleteMemberButton.dataset.deleteMember).catch((error) => {
        console.warn(error);
        showToast("회원 계정 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    const managementTabButton = event.target.closest("[data-management-tab]");
    if (managementTabButton) {
      setManagementTab(managementTabButton.dataset.managementTab);
      return;
    }

    const deleteAuditLogButton = event.target.closest("[data-delete-audit-log]");
    if (deleteAuditLogButton) {
      deleteAuditLog(deleteAuditLogButton.dataset.deleteAuditLog).catch((error) => {
        console.warn(error);
        showToast("로그 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.closest("[data-clear-audit-logs]")) {
      clearAuditLogs().catch((error) => {
        console.warn(error);
        showToast("로그 전체 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    const openTrendingModalButton = event.target.closest("[data-open-trending-modal]");
    if (openTrendingModalButton) {
      openTrendingModal(openTrendingModalButton.dataset.openTrendingModal);
      return;
    }

    if (event.target.closest("[data-close-trending-modal]") || event.target.matches("[data-trending-modal-backdrop]")) {
      closeTrendingModal();
      return;
    }

    if (event.target.closest("[data-open-screening-position-modal]")) {
      state.screeningPositionModalOpen = true;
      state.screeningApplicantModalOpen = false;
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    if (event.target.closest("[data-close-screening-position-modal]") || event.target.matches("[data-screening-position-modal-backdrop]")) {
      state.screeningPositionModalOpen = false;
      renderScreening();
      return;
    }

    if (event.target.closest("[data-open-screening-jd-modal]")) {
      state.screeningJdModalOpen = true;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantModalOpen = false;
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    if (event.target.closest("[data-close-screening-jd-modal]") || event.target.matches("[data-screening-jd-modal-backdrop]")) {
      state.screeningJdModalOpen = false;
      renderScreening();
      return;
    }

    if (event.target.closest("[data-open-screening-access-modal]")) {
      state.screeningAccessModalOpen = true;
      state.screeningJdModalOpen = false;
      state.screeningApplicantModalOpen = false;
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    if (event.target.closest("[data-close-screening-access-modal]") || event.target.matches("[data-screening-access-modal-backdrop]")) {
      state.screeningAccessModalOpen = false;
      renderScreening();
      return;
    }

    const addAccessMemberButton = event.target.closest("[data-add-screening-access-member]");
    if (addAccessMemberButton) {
      addScreeningAccessMember(addAccessMemberButton);
      return;
    }

    const removeAccessMemberButton = event.target.closest("[data-remove-screening-access-member]");
    if (removeAccessMemberButton) {
      removeScreeningAccessMember(removeAccessMemberButton);
      return;
    }

    if (event.target.closest("[data-toggle-screening-mine]")) {
      toggleScreeningMineFilter();
      return;
    }

    const refreshTrendingButton = event.target.closest("[data-refresh-trending]");
    if (refreshTrendingButton) {
      const mode = refreshTrendingButton.dataset.refreshTrending;
      fetchTrendingPeople({
        force: mode === "force",
        forceLatest: mode === "latest"
      });
      return;
    }

    const refreshTrendingHistoryButton = event.target.closest("[data-refresh-trending-history]");
    if (refreshTrendingHistoryButton) {
      fetchTrendingHistory();
      return;
    }

    const trendingDateButton = event.target.closest("[data-trending-date]");
    if (trendingDateButton) {
      state.trendingModal = "";
      fetchTrendingPeople({ date: trendingDateButton.dataset.trendingDate });
      return;
    }

    const registerTrendingButton = event.target.closest("[data-register-trending-person]");
    if (registerTrendingButton) {
      registerTrendingPerson(registerTrendingButton.dataset.registerTrendingPerson);
      return;
    }

    if (event.target.closest("[data-save-trending-mail]")) {
      saveTrendingMailSettings();
      return;
    }

    if (event.target.closest("[data-send-trending-mail-test]")) {
      sendTrendingMailTest();
      return;
    }

    const selectScreeningFolderButton = event.target.closest("[data-select-screening-folder]");
    if (selectScreeningFolderButton) {
      state.selectedScreeningFolderId = selectScreeningFolderButton.dataset.selectScreeningFolder;
      state.screeningPage = "detail";
      state.screeningDetailStep = "reception";
      state.screeningPositionModalOpen = false;
      state.screeningApplicantModalOpen = false;
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      persistState();
      renderScreening();
      return;
    }

    if (event.target.closest("[data-back-screening-list]")) {
      state.screeningPage = "list";
      state.screeningApplicantModalOpen = false;
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    if (event.target.closest("[data-open-screening-applicant-modal]")) {
      state.screeningApplicantModalOpen = true;
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    if (event.target.closest("[data-close-screening-applicant-modal]") || event.target.matches("[data-screening-applicant-modal-backdrop]")) {
      state.screeningApplicantModalOpen = false;
      renderScreening();
      return;
    }

    const openApplicantDetailButton = event.target.closest("[data-open-screening-applicant-detail]");
    if (openApplicantDetailButton) {
      state.screeningApplicantDetailId = openApplicantDetailButton.dataset.openScreeningApplicantDetail;
      state.screeningApplicantModalOpen = false;
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      renderScreening();
      return;
    }

    if (event.target.closest("[data-close-screening-applicant-detail]") || event.target.matches("[data-screening-applicant-detail-backdrop]")) {
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    const screeningStepButton = event.target.closest("[data-screening-detail-step]");
    if (screeningStepButton) {
      const folder = getSelectedScreeningFolder();
      const requestedStep = screeningStepButton.dataset.screeningDetailStep;

      if (!canAccessScreeningStep(folder, requestedStep)) {
        showToast("해당 스크리닝 단계 조회 권한이 없습니다.");
        return;
      }

      state.screeningDetailStep = requestedStep;
      renderScreening();
      return;
    }

    const submitScreeningApplicantButton = event.target.closest("[data-screening-submit-applicant]");
    if (submitScreeningApplicantButton) {
      submitScreeningApplicant(submitScreeningApplicantButton.dataset.screeningSubmitApplicant);
      return;
    }

    const firstPassButton = event.target.closest("[data-screening-first-pass]");
    if (firstPassButton) {
      updateScreeningApplicantStage(firstPassButton.dataset.screeningFirstPass, "first_pass");
      return;
    }

    const firstRejectButton = event.target.closest("[data-screening-first-reject]");
    if (firstRejectButton) {
      updateScreeningApplicantStage(firstRejectButton.dataset.screeningFirstReject, "first_reject");
      return;
    }

    const secondDraftButton = event.target.closest("[data-screening-second-draft]");
    if (secondDraftButton) {
      updateScreeningApplicantStage(secondDraftButton.dataset.screeningSecondDraft, "second_draft");
      return;
    }

    const secondRejectButton = event.target.closest("[data-screening-second-reject]");
    if (secondRejectButton) {
      updateScreeningApplicantStage(secondRejectButton.dataset.screeningSecondReject, "second_reject");
      return;
    }

    const revertScreeningButton = event.target.closest("[data-screening-revert]");
    if (revertScreeningButton) {
      revertScreeningApplicantStage(revertScreeningButton.dataset.screeningRevert);
      return;
    }

    const requestContactButton = event.target.closest("[data-screening-request-contact]");
    if (requestContactButton) {
      requestScreeningContact(requestContactButton.dataset.screeningRequestContact).catch((error) => {
        console.warn(error);
        showToast(error.message || "연락처 요청 메일 발송 중 오류가 발생했습니다.");
      });
      return;
    }

    const sendInterviewButton = event.target.closest("[data-screening-send-interview]");
    if (sendInterviewButton) {
      sendPhoneInterviewMail(sendInterviewButton.dataset.screeningSendInterview).catch((error) => {
        console.warn(error);
        showToast(error.message || "전화면접 안내 메일 발송 중 오류가 발생했습니다.");
      });
      return;
    }

    const policyCitationButton = event.target.closest("[data-policy-citation]");
    if (policyCitationButton) {
      openPolicyCitation(policyCitationButton.dataset.policyCitation);
      return;
    }

    if (event.target.closest("[data-close-policy-citation]")) {
      closePolicyCitation();
      return;
    }

    if (event.target.closest("[data-clear-policy-chat]")) {
      clearPolicyChat();
      return;
    }

    if (event.target.closest("[data-open-policy-sources]")) {
      openPolicySourceModal();
      return;
    }

    if (event.target.closest("[data-close-policy-source-modal]") || event.target.matches("[data-policy-source-modal-backdrop]")) {
      closePolicySourceModal();
      return;
    }

    const editPolicySourceButton = event.target.closest("[data-edit-policy-source]");
    if (editPolicySourceButton) {
      editPolicySource(editPolicySourceButton.dataset.editPolicySource);
      return;
    }

    if (event.target.closest("[data-new-policy-source]")) {
      newPolicySource();
      return;
    }

    const deletePolicySourceButton = event.target.closest("[data-delete-policy-source]");
    if (deletePolicySourceButton) {
      deletePolicySource(deletePolicySourceButton.dataset.deletePolicySource).catch((error) => {
        console.warn(error);
        showToast("채용 기준 소스 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      setView(viewButton.dataset.view);
      return;
    }

    if (event.target.closest("[data-back-to-pool]")) {
      backToPoolList();
      return;
    }

    const deleteCandidateButton = event.target.closest("[data-delete-candidate]");
    if (deleteCandidateButton) {
      deleteCandidateProfile(deleteCandidateButton.dataset.deleteCandidate).catch((error) => {
        console.warn(error);
        showToast("후보자 프로필 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    const selectButton = event.target.closest("[data-select-candidate]");
    if (selectButton) {
      openCandidateDetail(selectButton.dataset.selectCandidate);
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.trendingModal) {
      closeTrendingModal();
    }

    if (event.key === "Escape" && state.screeningPositionModalOpen) {
      state.screeningPositionModalOpen = false;
      renderScreening();
    }

    if (event.key === "Escape" && state.screeningApplicantModalOpen) {
      state.screeningApplicantModalOpen = false;
      renderScreening();
    }

    if (event.key === "Escape" && state.screeningJdModalOpen) {
      state.screeningJdModalOpen = false;
      renderScreening();
    }

    if (event.key === "Escape" && state.screeningAccessModalOpen) {
      state.screeningAccessModalOpen = false;
      renderScreening();
    }

    if (event.key === "Escape" && state.screeningApplicantDetailId) {
      state.screeningApplicantDetailId = "";
      renderScreening();
    }

    if (event.key === "Escape" && state.memberProfileModalOpen) {
      closeMemberProfileModal();
    }

    if (event.key === "Escape" && state.policySourceModalOpen) {
      closePolicySourceModal();
    }

    if (event.key === "Escape" && state.policyChatSelectedCitationId) {
      closePolicyCitation();
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.matches("#login-form")) {
      event.preventDefault();
      handleLoginSubmit(event.target).catch((error) => {
        console.warn(error);
        setAuthMessage("로그인 처리 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.matches("#signup-form")) {
      event.preventDefault();
      handleSignupSubmit(event.target).catch((error) => {
        console.warn(error);
        setAuthMessage("가입 신청 처리 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.matches("#member-profile-form")) {
      event.preventDefault();
      saveCurrentMemberProfile(event.target).catch((error) => {
        console.warn(error);
        showMemberProfileError("내 정보 저장 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.matches("#screening-folder-form")) {
      event.preventDefault();
      createScreeningFolder(event.target).catch((error) => {
        console.warn(error);
        showToast("포지션 생성 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.matches("#screening-jd-form")) {
      event.preventDefault();
      saveScreeningPositionJd(event.target).catch((error) => {
        console.warn(error);
        showToast("JD 정보 저장 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.matches("#screening-applicant-form")) {
      event.preventDefault();
      registerScreeningApplicant(event.target).catch((error) => {
        console.warn(error);
        showToast("지원자 등록 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.matches("[data-screening-access-form]")) {
      event.preventDefault();
      saveScreeningAccess(event.target);
      return;
    }

    if (event.target.matches("[data-screening-contact-form]")) {
      event.preventDefault();
      saveScreeningContact(event.target);
      return;
    }

    if (event.target.matches("#screening-final-pass-form")) {
      event.preventDefault();
      finalPassSecondScreening(event.target);
      return;
    }

    if (event.target.matches("#policy-source-form")) {
      event.preventDefault();
      savePolicySourceFromForm(event.target).catch((error) => {
        console.warn(error);
        state.policyChatSourceError = "소스 저장 중 오류가 발생했습니다.";
        renderPolicyChat();
      });
      return;
    }

    if (event.target.matches("#policy-chat-form")) {
      event.preventDefault();
      askPolicyChat(event.target).catch((error) => {
        console.warn(error);
        state.policyChatLoading = false;
        showToast("채용 AI 챗봇 답변 생성 중 오류가 발생했습니다.");
        renderPolicyChat();
      });
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
        const owner = $("#candidate-owner");

        if (status) {
          status.textContent = "이력서를 업로드하면 읽을 수 있는 정보만 아래 입력란에 자동 입력됩니다.";
        }

        if (preview) {
          preview.textContent = "사진 미리보기";
        }

        if (owner) {
          owner.value = getDefaultOwnerName();
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

    if (event.target.id === "candidate-birth-year") {
      updateAgeOutput("#candidate-birth-year", "#candidate-age");
    }

    if (event.target.id === "edit-birth-year") {
      updateAgeOutput("#edit-birth-year", "#edit-age");
    }

    if (event.target.matches("[data-screening-access-search]")) {
      updateScreeningAccessResults(event.target);
    }

    if (event.target.id === "policy-chat-question") {
      state.policyChatQuestion = event.target.value;
    }
  });

  document.addEventListener("error", (event) => {
    if (!event.target.classList?.contains("trending-photo")) {
      return;
    }

    const fallback = document.createElement("div");
    fallback.className = "trending-photo-placeholder";
    fallback.textContent = "사진";
    event.target.replaceWith(fallback);
  }, true);

  document.addEventListener("change", (event) => {
    if (event.target.id === "dashboard-organization-filter") {
      updateDashboardFilters();
    }

    if (event.target.id === "screening-business-unit-filter") {
      updateScreeningBusinessUnitFilter(event.target.value);
    }

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

    const memberBusinessUnitSelect = event.target.closest("[data-member-business-unit]");
    if (memberBusinessUnitSelect) {
      updateMemberBusinessUnit(memberBusinessUnitSelect.dataset.memberBusinessUnit, memberBusinessUnitSelect.value);
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

    if (event.target.id === "policy-source-file") {
      const file = event.target.files?.[0];

      if (file) {
        loadPolicySourceFile(file);
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

async function initializeApp() {
  restorePersistedState();
  ensureMemberDefaults();
  recordPageVisit();
  bindEvents();

  try {
    if (await ensureMemberPasswordHashes()) {
      persistState({ skipRemoteSync: true });
    }
  } catch (error) {
    console.warn("Member password hashes could not be migrated.", error);
  }

  render();
  loadStateFromSupabase();
}

initializeApp();
