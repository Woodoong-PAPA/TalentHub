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
  { view: "interview", label: "Interview", description: "면접 일정 조율, 제출자료, 결과 관리" },
  { view: "interview-report", label: "면담록 생성", description: "면담 스크립트 기반 보고서 생성" },
  { view: "recruiting-metrics", label: "채용 지표", description: "사업부별 채용 실적 취합과 보고" },
  { view: "ai-search", label: "AI Search", description: "자연어/JD 기반 후보자 검색" },
  { view: "job-fit", label: "직무적합도 분석", description: "JD와 다수 이력서 기반 적합도 평가" },
  { view: "jd-enhance", label: "채용공고 작성", description: "작성 가이드라인 기반 JD 점검과 문구 개선" },
  { view: "policy-chat", label: "채용 AI 챗봇", description: "채용 기준 문서 기반 질의응답" },
  { view: "trending", label: "Today's Talent", description: "전일 한국 뉴스 기반 DX 분야 화제 인물 확인" },
  { view: "members", label: "Management", description: "회원 승인, 등급, 메뉴 권한, Log 관리" }
];

const DEFAULT_MENU_ORDER = MENU_CONFIG.map((item) => item.view);
const DEFAULT_MENU_LABELS = Object.fromEntries(MENU_CONFIG.map((item) => [item.view, item.label]));
const MENU_SETTING_KEY = "menu_order";
const SCREENING_DELETED_FOLDERS_SETTING_KEY = "screening_deleted_folder_ids";
const ROLE_PERMISSIONS_SETTING_KEY = "role_permissions";
const INTERVIEW_CASES_SETTING_KEY = "interview_cases";
const RECRUITING_METRICS_SETTING_KEY = "recruiting_metrics";
const JD_ENHANCEMENT_SETTING_KEY = "jd_enhancement";
const VISIT_STATS_SETTING_KEY = "visit_stats";
const VISIT_STATS_RETENTION_DAYS = 1095;
const ROLE_PERMISSION_TABLE_VIEWS = new Set([
  "dashboard",
  "pool",
  "screening",
  "interview",
  "register",
  "ai-search",
  "job-fit",
  "policy-chat",
  "trending",
  "audit",
  "members"
]);

const MEMBER_ROLES = {
  applicant: "지원자",
  general: "일반회원",
  search_firm: "서치펌 담당자",
  hiring_manager: "현업 담당자",
  business_recruiter: "사업부 채용 담당자",
  division_recruiter: "부문 채용 담당자",
  admin: "관리자"
};

const MEMBER_ROLE_ORDER = ["applicant", "general", "search_firm", "hiring_manager", "business_recruiter", "division_recruiter", "admin"];
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
const MEMBER_ROLES_WITHOUT_BUSINESS_UNIT = new Set(["applicant", "search_firm", "hiring_manager"]);

const DEFAULT_ROLE_PERMISSIONS = {
  applicant: ["screening", "interview"],
  general: ["dashboard", "pool", "policy-chat", "trending"],
  search_firm: ["dashboard", "pool", "screening", "ai-search", "policy-chat"],
  hiring_manager: ["dashboard", "pool", "screening", "interview", "interview-report", "ai-search", "job-fit", "jd-enhance", "policy-chat", "trending"],
  business_recruiter: ["dashboard", "pool", "screening", "interview", "interview-report", "recruiting-metrics", "ai-search", "job-fit", "jd-enhance", "policy-chat", "trending", "members"],
  division_recruiter: ["dashboard", "pool", "screening", "interview", "interview-report", "recruiting-metrics", "ai-search", "job-fit", "jd-enhance", "policy-chat", "trending", "members"],
  admin: MENU_CONFIG.map((item) => item.view)
};

const TEMP_PASSWORD = "Temp1234!";
const DEFAULT_TRENDING_MAIL_SETTINGS = {
  enabled: false,
  sendTime: "07:00",
  timezone: "Asia/Seoul",
  recipients: [],
  subjectPrefix: "[TalentHub] Today's Talent",
  lastSentReportDate: "",
  lastSentAt: "",
  providerConfigured: false,
  updatedAt: "",
  updatedBy: ""
};
const DEFAULT_TRENDING_SEARCH_SETTINGS = {
  prompt: "AI, 로보틱스, 모바일, TV, 생활가전 등 삼성전자 DX부문 주요 사업분야 중심. DS/반도체 분야는 제외.",
  keywords: ["AI", "인공지능", "로보틱스", "로봇", "모바일", "스마트폰", "TV", "생활가전", "가전"],
  updatedAt: "",
  updatedBy: ""
};
const DEFAULT_JD_GUIDELINE = [
  "JD 작성 가이드라인",
  "",
  "1. 포지션명과 직무 목적을 명확히 작성한다.",
  "2. 수행업무는 실제 담당할 업무 중심으로 4~7개 항목으로 구체화한다.",
  "3. 필수 자격요건은 경력, 기술, 학위, 어학, 자격 등 반드시 필요한 기준만 작성한다.",
  "4. 우대사항은 필수요건과 구분하고, 있으면 좋은 경험/역량만 작성한다.",
  "5. 필요역량은 기술역량과 협업/리더십/문제해결 역량을 구분해 작성한다.",
  "6. 모호한 표현(우수한, 능숙한, 열정적인 등)은 가능한 검증 가능한 기준으로 바꾼다.",
  "7. 특정 성별, 연령, 국적 등 차별 소지가 있는 표현은 제외한다.",
  "8. 채용 부서, 근무지, 직급/직책, 고용형태 등 운영상 필요한 정보를 빠뜨리지 않는다.",
  "9. 문장은 간결한 보고서형 표현으로 작성하고 중복 내용을 줄인다.",
  "10. 최종 JD는 현업과 지원자가 모두 이해할 수 있는 구조로 정리한다."
].join("\n");
const LEGACY_TRENDING_MAIL_SUBJECT_PREFIX = "[TalentHub] 오늘의 화제 인물";
const BUSINESS_UNITS = ["VD", "MX", "DA", "NW", "CDO", "SR", "한총", "G.CS", "전사직속"];
const DEFAULT_RECRUITING_METRICS_TARGETS = Object.fromEntries(BUSINESS_UNITS.map((unit) => [unit, {
  hiringTarget: 0,
  keyTalentTarget: 0,
  weeklyNote: "",
  completed: false,
  completedAt: "",
  completedBy: ""
}]));
const RECRUITING_METRICS_TABS = [
  { key: "details", label: "채용 실적 상세" },
  { key: "progress", label: "채용 진행 경과" }
];
const RECRUITING_METRICS_DETAIL_COLUMNS = [
  "이름",
  "출생년도",
  "사업부",
  "직무",
  "최종학위",
  "학교명",
  "전공",
  "직장명",
  "직급/직책",
  "소속부서",
  "채용유형",
  "핵심인력 여부",
  "오퍼서명일",
  "입사예정일",
  "입사완료일",
  "담당자",
  "비고"
];
const RECRUITING_TALENT_GRADE_OPTIONS = ["S급", "A급", "H급", "Z급", "기타"];
const RECRUITING_KEY_TALENT_GRADES = new Set(["S급", "A급", "H급"]);
const RECRUITING_METRICS_PROGRESS_COLUMNS = [
  "사업부",
  "당해 채용 목표",
  "핵심인력 채용 목표",
  "오퍼서명(확보) 완료",
  "확보완료(핵심인력)",
  "입사 완료",
  "목표 달성률",
  "목표 달성률 (핵심인력)",
  "작성 상태",
  "비고"
];
const RECRUITING_METRICS_MIN_ROWS = 8;
const SCREENING_JOB_CATEGORIES = [
  "연구개발",
  "SW연구개발",
  "디자인",
  "영업",
  "마케팅",
  "구매",
  "SCM/물류",
  "제조",
  "생산기술",
  "환경안전",
  "품질/서비스",
  "인사",
  "재무",
  "법무",
  "대외협력",
  "경영관리",
  "조직총괄"
];
const CANDIDATE_VISIBILITY_LABELS = {
  all: "전체 공개",
  business_unit: "사업부 공개"
};
const CANDIDATE_VISIBILITY_ORDER = ["all", "business_unit"];
const POLICY_CHAT_MAX_CONTEXTS = 4;
const POLICY_CHAT_MAX_MESSAGES = 20;
const POLICY_CHAT_MAX_CONTEXT_CHARS = 1800;
const JOB_FIT_MAX_JD_CHARS = 16000;
const JOB_FIT_MAX_RESUME_CHARS = 50000;
const JOB_FIT_MAX_KEYWORD_TOKENS = 180;
const INTERVIEW_REPORT_SERVER_UPLOAD_LIMIT_BYTES = 8 * 1024 * 1024;
const INTERVIEW_REPORT_MAX_SCRIPT_CHARS = 90000;
const INTERVIEW_REPORT_MAX_TEMPLATE_CHARS = 36000;
const INTERVIEW_REPORT_MAX_SENTENCES = 140;
const VISIT_STATS_KEY = "samsung-talent-pool-visit-stats-v1";
const REMEMBERED_LOGIN_EMAIL_KEY = "samsung-talent-pool-remembered-email-v1";
const SCREENING_STAGE_LABELS = {
  reception: "지원자 접수",
  registered: "1차 대상",
  first_draft: "1차 합격 예정",
  first_pass: "1차 합격",
  first_reject: "1차 불합격",
  second_draft: "2차 합격 예정",
  second_pass: "2차 통과",
  second_reject: "2차 제외",
  contact_requested: "연락처 요청",
  contact_ready: "연락처 확인",
  interview_mail_sent: "전화면접 안내 발송"
};
const SCREENING_STAGE_ORDER = [
  "registered",
  "first_draft",
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
const INTERVIEW_STAGE_CONFIG = [
  {
    id: "phone",
    label: "전화면접",
    requirement: "CL3 1명 이상 참석",
    documents: [{ id: "privacyConsent", label: "개인정보 수집이용 동의서", owner: "지원자" }]
  },
  {
    id: "technical",
    label: "기술면접",
    requirement: "전문성 면접위원 CL3 이상 2명, 부서장 면접위원 임원 2명 참석",
    documents: [
      { id: "selfIntroPpt", label: "자기소개 PPT 자료", owner: "지원자" },
      { id: "assignmentPpt", label: "직무수행과제 PPT 자료", owner: "지원자" }
    ]
  },
  {
    id: "hr",
    label: "HR면접",
    requirement: "HR담당자 CL3 이상 1명, CL4 이상 1명 참석",
    documents: [
      { id: "utilizationPlan", label: "후보자 활용계획서", owner: "현업 담당자" },
      { id: "productEssay", label: "자사 제품 사용 경험 에세이", owner: "지원자" }
    ]
  }
];
const INTERVIEW_STAGE_IDS = INTERVIEW_STAGE_CONFIG.map((stage) => stage.id);
const INTERVIEW_STATUS_LABELS = {
  waiting: "입력 대기",
  scheduling: "일정 조율",
  scheduled: "일정 확정",
  passed: "합격",
  failed: "불합격"
};
const SCREENING_DETAIL_STEPS = [
  { id: "first", label: "1차 스크리닝(인사)" },
  { id: "second", label: "2차 스크리닝(현업)" },
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
    tags: ["키워드", "재접촉 우선", "검수 완료"],
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
  menuOrder: [...DEFAULT_MENU_ORDER],
  menuLabels: {},
  menuSettingsUpdatedAt: "",
  memberFilters: {
    query: "",
    role: "all",
    status: "all"
  },
  managementTab: "members",
  visitStats: null,
  visitStatsRemoteLoaded: false,
  candidates: REMOTE_SYNC_ENABLED ? [] : structuredClone(ENRICHED_CANDIDATES),
  selectedCandidateId: REMOTE_SYNC_ENABLED ? "" : "cand-001",
  isEditingCandidate: false,
  editSnapshot: null,
  detailTab: "profile",
  editingInterviewId: "",
  editingMemoId: "",
  screeningFolders: structuredClone(DEFAULT_SCREENING_FOLDERS),
  screeningDeletedFolderIds: [],
  selectedScreeningFolderId: "screening-folder-001",
  screeningPage: "list",
  screeningDetailStep: "first",
  screeningFilters: {
    businessUnit: "all",
    mineOnly: false
  },
  interviewCases: [],
  interviewDeletedCaseIds: [],
  selectedInterviewCaseId: "",
  selectedInterviewStage: "phone",
  interviewMailPreview: null,
  screeningPositionModalOpen: false,
  screeningApplicantModalOpen: false,
  screeningBulkApplicantModalOpen: false,
  screeningEditingApplicantId: "",
  screeningJdModalOpen: false,
  screeningAccessModalOpen: false,
  screeningApplicantDetailId: "",
  screeningMailPreview: null,
  screeningMailTemplates: {},
  screeningResultPanelOpen: false,
  screeningTimelineDrag: null,
  poolReturnScrollY: 0,
  poolFilters: {
    query: "",
    status: "all",
    businessUnit: "all",
    owner: "all",
    sortBy: "createdAt"
  },
  dashboardFilters: {
    organization: "all"
  },
  aiQuery: "",
  aiResults: [],
  aiSearchLoading: false,
  aiSearchFileName: "",
  aiSearchStatus: "",
  aiSearchProgress: 0,
  jobFitAnalysis: {
    jdText: "",
    jdFile: null,
    resumes: [],
    results: [],
    savedAnalyses: [],
    jdLoading: false,
    resumeLoading: false,
    analysisLoading: false,
    jdProgress: 0,
    resumeProgress: 0,
    analysisProgress: 0,
    jdStatus: "",
    resumeStatus: "",
    analysisStatus: "",
    hasAnalyzed: false,
    poolPickerOpen: false,
    poolPickerQuery: "",
    poolPickerSelectedIds: []
  },
  interviewReport: {
    scriptText: "",
    scriptFile: null,
    scriptFileName: "",
    scriptStatus: "",
    scriptLoading: false,
    scriptProgress: 0,
    templateText: "",
    templateFileName: "",
    templateSamples: [],
    templateStatus: "",
    templateLoading: false,
    templateProgress: 0,
    templateProfile: null,
    prompt: "",
    reportText: "",
    status: ""
  },
  interviewReportPromptModalOpen: false,
  recruitingMetrics: {
    activeTab: "details",
    detailUnitFilter: "all",
    progressUnitFilter: "all",
    weekOf: getTodayDate(),
    targets: structuredClone(DEFAULT_RECRUITING_METRICS_TARGETS),
    detailSheet: null,
    progressSheet: null,
    mailModalOpen: false,
    mailFrequency: "weekly",
    mailBody: "",
    mailDraft: null,
    requestMailFrequency: "weekly",
    requestMailDay: "monday",
    requestMailTime: "09:00",
    requestMailBody: "",
    requestMailDraft: null,
    requestRecipients: [],
    requestSubject: "[TalentHub] 채용 실적 상세 데이터시트 작성 요청",
    requestLastSentKey: "",
    requestLastSentAt: "",
    saveStatus: "",
    recipients: [],
    subject: "[TalentHub] 주간 채용 지표 취합",
    mailStatus: "",
    autoSendOnComplete: false,
    lastAutoSentWeek: ""
  },
  jdEnhancement: {
    guidelineText: DEFAULT_JD_GUIDELINE,
    jdText: "",
    jdFile: null,
    finalText: "",
    reviewItems: [],
    score: 0,
    summary: "",
    loading: false,
    fileLoading: false,
    status: "",
    fileStatus: "",
    appliedSuggestionIds: [],
    savedDocuments: []
  },
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
  trendingEditingPersonId: "",
  trendingProfileSaving: false,
  trendingProfileError: "",
  trendingMailSettings: structuredClone(DEFAULT_TRENDING_MAIL_SETTINGS),
  trendingSearchSettings: structuredClone(DEFAULT_TRENDING_SEARCH_SETTINGS),
  trendingMailLoading: false,
  trendingSearchLoading: false,
  trendingMailError: "",
  trendingMailStatus: "",
  registerExtractedPhotoUrl: "",
  editExtractedPhotoUrl: "",
  remoteSyncStatus: REMOTE_SYNC_ENABLED ? "대기" : "로컬",
  auditLogs: [
    { actor: "이지원", action: "후보자 상세 조회", resource: "김도현", purpose: "DS 공정 AI 후보 검토", time: "2026-06-04 09:18" },
    { actor: "AI Worker", action: "이력서 파싱", resource: "박서연", purpose: "파싱 결과 생성", time: "2026-06-04 09:12" },
    { actor: "최유진", action: "AI 검색", resource: "온디바이스 AI", purpose: "DX 리서처 Shortlist", time: "2026-06-04 08:57" },
    { actor: "AI Worker", action: "파싱 품질 스캔", resource: "최민재", purpose: "필수 정보 검수", time: "2026-06-04 08:30" }
  ]
};

const interviewReportFileStore = new Map();

const viewTitles = {
  dashboard: "Dashboard",
  pool: "Talent Pool",
  screening: "Screening",
  interview: "Interview",
  "interview-report": "면담록 생성",
  "recruiting-metrics": "채용 지표",
  register: "Add Talent",
  "ai-search": "AI Search",
  "job-fit": "직무적합도 분석",
  "jd-enhance": "채용공고 작성",
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

function createRecruitingSheetRow(columnCount, cells = []) {
  const normalizedCells = Array.from({ length: columnCount }, (_, index) => String(cells[index] ?? "").trim());

  return {
    id: createId("metric-row"),
    cells: normalizedCells
  };
}

function normalizeRecruitingSheetColumnName(column) {
  const value = String(column || "").trim();
  const aliases = {
    "확보 완료": "오퍼서명(확보) 완료",
    "확보완료": "오퍼서명(확보) 완료",
    "확보 완료 (핵심인력)": "확보완료(핵심인력)",
    "핵심인력 확보": "확보완료(핵심인력)",
    "핵심인력 달성률": "목표 달성률 (핵심인력)",
    "핵심인력 목표 달성률": "목표 달성률 (핵심인력)"
  };

  return aliases[value] || value;
}

function normalizeRecruitingSheet(value, defaultColumns, minRows = RECRUITING_METRICS_MIN_ROWS) {
  const sourceColumns = Array.isArray(value?.columns) ? value.columns : [];
  const normalizedSourceColumns = sourceColumns
    .map(normalizeRecruitingSheetColumnName)
    .filter(Boolean);
  const defaultColumnSet = new Set(defaultColumns);
  const safeColumns = [
    ...defaultColumns,
    ...normalizedSourceColumns.filter((column) => !defaultColumnSet.has(column))
  ];
  const sourceRows = Array.isArray(value?.rows) ? value.rows : [];
  const rows = sourceRows.map((row) => {
    const cells = Array.isArray(row?.cells)
      ? row.cells
      : Array.isArray(row)
        ? row
        : [];

    return {
      id: String(row?.id || createId("metric-row")),
      cells: safeColumns.map((column, index) => {
        const sourceIndex = normalizedSourceColumns.indexOf(column);
        const valueIndex = sourceIndex >= 0
          ? sourceIndex
          : normalizedSourceColumns.length
            ? -1
            : index;
        return String(cells[valueIndex] ?? "").trim();
      })
    };
  });

  while (rows.length < minRows) {
    rows.push(createRecruitingSheetRow(safeColumns.length));
  }

  return {
    columns: safeColumns,
    rows
  };
}

function buildRecruitingProgressSheetFromTargets(sourceTargets = {}) {
  const rows = BUSINESS_UNITS.map((unit) => {
    const target = sourceTargets[unit] || {};
    const hiringTarget = Number(target.hiringTarget || 0) || 0;
    const keyTalentTarget = Number(target.keyTalentTarget || 0) || 0;
    const completed = target.completed ? "완료" : "진행 중";
    const weeklyNote = String(target.weeklyNote || "").trim();

    return createRecruitingSheetRow(RECRUITING_METRICS_PROGRESS_COLUMNS.length, [
      unit,
      hiringTarget ? String(hiringTarget) : "",
      keyTalentTarget ? String(keyTalentTarget) : "",
      "",
      "",
      "",
      "",
      "",
      completed,
      weeklyNote
    ]);
  });

  return {
    columns: [...RECRUITING_METRICS_PROGRESS_COLUMNS],
    rows
  };
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getKstDateKey(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const date = new Date(Date.UTC(Number(byType.year), Number(byType.month) - 1, Number(byType.day) + offsetDays));
  return date.toISOString().slice(0, 10);
}

function getTrendingTargetDate() {
  return getKstDateKey(-1);
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

function normalizeScreeningJobCategory(value) {
  const rawValue = String(value || "").trim();
  return SCREENING_JOB_CATEGORIES.includes(rawValue) ? rawValue : "";
}

function renderScreeningJobCategoryOptions(selectedValue = "") {
  const selected = normalizeScreeningJobCategory(selectedValue);

  return `
    <option value="" ${selected ? "" : "selected"}>직무 선택</option>
    ${SCREENING_JOB_CATEGORIES.map((category) => `<option value="${escapeHtml(category)}" ${category === selected ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
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

function createEmptyVisitStats() {
  return {
    version: 2,
    totalVisits: 0,
    daily: {},
    updatedAt: "",
    updatedBy: ""
  };
}

function normalizeVisitUserStats(value = {}, fallback = {}) {
  const source = typeof value === "number" ? { count: value } : value && typeof value === "object" ? value : {};
  const count = Math.max(0, Math.round(Number(source.count || source.visits || source.total || 0) || 0));

  return {
    count,
    name: String(source.name || fallback.name || "").trim(),
    email: String(source.email || fallback.email || "").trim().toLowerCase(),
    role: String(source.role || fallback.role || "").trim(),
    businessUnit: String(source.businessUnit || source.business_unit || fallback.businessUnit || "").trim(),
    lastVisitedAt: String(source.lastVisitedAt || source.last_visited_at || fallback.lastVisitedAt || "").trim()
  };
}

function normalizeVisitDayStats(value = {}) {
  const source = typeof value === "number" ? { total: value } : value && typeof value === "object" ? value : {};
  const rawUsers = source.users && typeof source.users === "object" ? source.users : source.byUser && typeof source.byUser === "object" ? source.byUser : {};
  const users = {};

  Object.entries(rawUsers).forEach(([userId, userValue]) => {
    const id = String(userId || "").trim();
    const normalized = normalizeVisitUserStats(userValue);

    if (id && normalized.count > 0) {
      users[id] = normalized;
    }
  });

  const userTotal = Object.values(users).reduce((sum, item) => sum + Number(item.count || 0), 0);
  const total = Math.max(0, Math.round(Number(source.total || source.count || source.visits || 0) || 0), userTotal);

  return { total, users };
}

function pruneVisitStats(stats) {
  const normalized = normalizeVisitStatsState(stats);
  const minDate = getKstDateKey(-VISIT_STATS_RETENTION_DAYS);
  const daily = {};

  Object.entries(normalized.daily).forEach(([date, day]) => {
    if (date >= minDate) {
      daily[date] = normalizeVisitDayStats(day);
    }
  });

  const totalVisits = Object.values(daily).reduce((sum, day) => sum + Number(day.total || 0), 0);

  return {
    ...normalized,
    totalVisits,
    daily
  };
}

function normalizeVisitStatsState(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  const rawDaily = source.daily && typeof source.daily === "object" ? source.daily : source;
  const daily = {};

  Object.entries(rawDaily).forEach(([date, day]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return;
    }

    const normalizedDay = normalizeVisitDayStats(day);

    if (normalizedDay.total > 0 || Object.keys(normalizedDay.users).length) {
      daily[date] = normalizedDay;
    }
  });

  const totalFromDays = Object.values(daily).reduce((sum, day) => sum + Number(day.total || 0), 0);
  const totalVisits = Math.max(0, Math.round(Number(source.totalVisits || source.total || 0) || 0), totalFromDays);

  return {
    version: 2,
    totalVisits,
    daily,
    updatedAt: String(source.updatedAt || source.updated_at || "").trim(),
    updatedBy: String(source.updatedBy || source.updated_by || "").trim()
  };
}

function mergeVisitStats(...items) {
  const merged = createEmptyVisitStats();

  items.forEach((item) => {
    const stats = normalizeVisitStatsState(item);

    Object.entries(stats.daily).forEach(([date, day]) => {
      const targetDay = normalizeVisitDayStats(merged.daily[date]);
      const sourceDay = normalizeVisitDayStats(day);

      Object.entries(sourceDay.users).forEach(([userId, userStats]) => {
        const current = normalizeVisitUserStats(targetDay.users[userId]);
        const next = normalizeVisitUserStats(userStats);
        targetDay.users[userId] = next.count >= current.count ? next : current;
      });

      const usersTotal = Object.values(targetDay.users).reduce((sum, user) => sum + Number(user.count || 0), 0);
      targetDay.total = Math.max(targetDay.total, sourceDay.total, usersTotal);
      merged.daily[date] = targetDay;
    });

    if (dateSortValue(stats.updatedAt) > dateSortValue(merged.updatedAt)) {
      merged.updatedAt = stats.updatedAt;
      merged.updatedBy = stats.updatedBy;
    }
  });

  return pruneVisitStats(merged);
}

function loadVisitStats() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(VISIT_STATS_KEY) || "{}");
    return normalizeVisitStatsState(parsed);
  } catch (error) {
    console.warn("Visit stats could not be loaded.", error);
    return createEmptyVisitStats();
  }
}

function saveVisitStats(stats) {
  try {
    window.localStorage.setItem(VISIT_STATS_KEY, JSON.stringify(normalizeVisitStatsState(stats)));
  } catch (error) {
    console.warn("Visit stats could not be saved.", error);
  }
}

function getVisitMemberSnapshot(member = getCurrentMember()) {
  return {
    id: member?.id || state.currentUserId || "anonymous",
    name: member?.name || "anonymous",
    email: member?.email || "",
    role: member?.role || "",
    businessUnit: member?.businessUnit || ""
  };
}

function applyVisitEventToStats(stats, member = getCurrentMember(), options = {}) {
  const snapshot = getVisitMemberSnapshot(member);
  const date = options.date || getKstDateKey(0);
  const visitedAt = options.visitedAt || new Date().toISOString();
  const next = normalizeVisitStatsState(stats);
  const day = normalizeVisitDayStats(next.daily[date]);
  const userKey = snapshot.id || "anonymous";
  const user = normalizeVisitUserStats(day.users[userKey], {
    ...snapshot,
    lastVisitedAt: visitedAt
  });

  user.count += 1;
  user.name = snapshot.name || user.name;
  user.email = snapshot.email || user.email;
  user.role = snapshot.role || user.role;
  user.businessUnit = snapshot.businessUnit || user.businessUnit;
  user.lastVisitedAt = visitedAt;
  day.users[userKey] = user;
  day.total += 1;
  next.daily[date] = day;
  next.totalVisits = Object.values(next.daily).reduce((sum, item) => sum + Number(item.total || 0), 0);
  next.updatedAt = visitedAt;
  next.updatedBy = snapshot.name || userKey;

  return pruneVisitStats(next);
}

function buildVisitStatsFromLoginAudits() {
  const stats = createEmptyVisitStats();

  state.auditLogs.forEach((log) => {
    const action = String(log.action || "");
    const purpose = String(log.purpose || "");

    if (!action.includes("로그인") && !purpose.includes("시스템 접속")) {
      return;
    }

    const date = String(log.time || "").slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return;
    }

    const day = normalizeVisitDayStats(stats.daily[date]);
    day.total += 1;
    stats.daily[date] = day;
  });

  stats.totalVisits = Object.values(stats.daily).reduce((sum, day) => sum + Number(day.total || 0), 0);
  return stats;
}

async function fetchVisitStatsFromSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return createEmptyVisitStats();
  }

  const rows = await supabaseRequest(`app_settings?select=*&setting_key=eq.${VISIT_STATS_SETTING_KEY}&limit=1`);
  return normalizeVisitStatsState(Array.isArray(rows) && rows[0]?.payload ? rows[0].payload : {});
}

async function saveVisitStatsToSupabase(stats) {
  if (!REMOTE_SYNC_ENABLED) {
    return false;
  }

  await supabaseRequest("app_settings?on_conflict=setting_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([appSettingToSupabaseRow(VISIT_STATS_SETTING_KEY, normalizeVisitStatsState(stats))])
  });

  return true;
}

async function recordVisitStatsToSupabase(member, baseStats) {
  if (!REMOTE_SYNC_ENABLED) {
    return;
  }

  try {
    const remoteStats = await fetchVisitStatsFromSupabase();
    const mergedBase = mergeVisitStats(remoteStats, baseStats);
    const nextStats = applyVisitEventToStats(mergedBase, member);
    await saveVisitStatsToSupabase(nextStats);
    state.visitStats = mergeVisitStats(state.visitStats, nextStats);
    state.visitStatsRemoteLoaded = true;
    saveVisitStats(state.visitStats);
    renderSidePanel();
  } catch (error) {
    console.warn("Visit stats could not be synced.", error);
  }
}

function recordPageVisit(member = getCurrentMember()) {
  try {
    const baseStats = mergeVisitStats(state.visitStats, loadVisitStats(), buildVisitStatsFromLoginAudits());
    const nextStats = applyVisitEventToStats(baseStats, member);
    state.visitStats = nextStats;
    saveVisitStats(nextStats);
    recordVisitStatsToSupabase(member, baseStats);
  } catch (error) {
    console.warn("Visit could not be recorded.", error);
  }
}

function getVisitStatsSummary() {
  const stats = mergeVisitStats(state.visitStats, loadVisitStats(), buildVisitStatsFromLoginAudits());
  const today = getKstDateKey(0);
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => getKstDateKey(-index));
  const previousSevenDays = Array.from({ length: 7 }, (_, index) => getKstDateKey(-(index + 7)));
  const yearPrefix = today.slice(0, 4);
  const collectUsers = (dates) => {
    const users = new Set();

    dates.forEach((date) => {
      Object.entries(normalizeVisitDayStats(stats.daily[date]).users).forEach(([userId, user]) => {
        if (Number(user.count || 0) > 0) {
          users.add(userId);
        }
      });
    });

    return users;
  };
  const getDateCount = (date) => normalizeVisitDayStats(stats.daily[date]).total;
  const weekTotal = lastSevenDays.reduce((sum, date) => sum + getDateCount(date), 0);
  const previousWeekTotal = previousSevenDays.reduce((sum, date) => sum + getDateCount(date), 0);
  const yearDates = Object.keys(stats.daily).filter((date) => date.startsWith(yearPrefix));
  const yearTotal = yearDates.reduce((sum, date) => sum + getDateCount(date), 0);
  const weekVisitors = collectUsers(lastSevenDays).size;
  const yearVisitors = collectUsers(yearDates).size;

  return {
    today: getDateCount(today),
    todayVisitors: collectUsers([today]).size,
    weekTotal,
    weekVisitors,
    weekDelta: weekTotal - previousWeekTotal,
    yearTotal,
    yearVisitors,
    perUserWeekAverage: weekVisitors ? weekTotal / weekVisitors : 0
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

function normalizePoolSortBy(value) {
  return ["createdAt", "updatedAt"].includes(value) ? value : "createdAt";
}

function sortPoolCandidates(candidates) {
  const sortBy = normalizePoolSortBy(state.poolFilters.sortBy);

  if (sortBy === "updatedAt") {
    return [...candidates].sort((a, b) =>
      dateSortValue(b.updatedAt || b.createdAt) - dateSortValue(a.updatedAt || a.createdAt) ||
      dateSortValue(b.createdAt) - dateSortValue(a.createdAt) ||
      String(b.id).localeCompare(String(a.id))
    );
  }

  return sortCandidatesByCreatedAt(candidates);
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
    .map((item) => String(item).replace("핵심 기술", "키워드").replace("주요 역량/성과", "키워드"));
  sanitized.evidence = (sanitized.evidence || [])
    .filter((item) => !String(item).includes(retiredPrivacyTerm))
    .map((item) => String(item).replace("핵심 기술", "키워드").replace("주요 역량/성과", "키워드"));
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
    englishName: "",
    birthYear: "",
    age: "",
    email: "",
    phone: "",
    nationality: "",
    linkedinUrl: "",
    referenceUrl: "",
    referenceUrl2: "",
    referenceUrl3: "",
    attachments: [],
    education: [],
    career: [],
    skills: [],
    summary: "",
    tags: [],
    evidence: [],
    applications: [],
    timeline: [],
    interviews: [],
    memos: [],
    visibility: "all",
    recommended: false,
    recommendedAt: "",
    recommendedBy: "",
    syncUpdatedAt: "",
    ...candidate
  });

  normalized.organization = normalizeBusinessUnit(normalized.organization);
  normalized.visibility = normalizeCandidateVisibility(normalized.visibility || normalized.profileVisibility);
  normalized.createdAt = inferCreatedAt(normalized);
  normalized.updatedAt = normalized.updatedAt || normalized.createdAt;
  normalized.syncUpdatedAt = normalized.syncUpdatedAt || normalized.updatedAt || normalized.createdAt;
  normalized.age = calculateAge(normalized.birthYear);
  normalized.attachments = Array.isArray(normalized.attachments)
    ? normalized.attachments.filter((attachment) => attachment && (attachment.name || attachment.dataUrl))
    : [];
  normalized.education = (normalized.education || []).map(normalizeEducationRecord).filter(hasAnyRecordValue);
  normalized.career = (normalized.career || []).map(normalizeCareerRecord).filter(hasAnyRecordValue);
  normalized.interviews = Array.isArray(normalized.interviews)
    ? normalized.interviews.map(normalizeInterviewRecord).filter(Boolean)
    : [];
  normalized.memos = normalizeMemoRecords(normalized);

  return normalized;
}

function normalizeEducationRecord(record = {}) {
  return {
    degree: String(record.degree || "").trim(),
    school: String(record.school || "").trim(),
    major: String(record.major || "").trim(),
    affiliation: String(record.affiliation || record.department || record.organization || "").trim(),
    start: String(record.start || "").trim(),
    end: String(record.end || "").trim()
  };
}

function normalizeCareerRecord(record = {}) {
  const roleFields = normalizeCareerRoleFields(record.rank, record.position || record.department || record.title);

  return {
    country: String(record.country || "").trim(),
    company: String(record.company || "").trim(),
    rank: roleFields.rank,
    position: roleFields.position,
    start: String(record.start || "").trim(),
    end: String(record.end || "").trim(),
    achievements: String(record.achievements || "").trim()
  };
}

function normalizeInterviewRecord(record = {}) {
  const content = String(record.content || record.text || "").trim();

  if (!content && !record.date && !record.interviewer && !record.nextAction) {
    return null;
  }

  return {
    id: record.id || createId("interview"),
    date: String(record.date || getTodayDate()).trim(),
    interviewer: String(record.interviewer || record.actor || "").trim(),
    method: String(record.method || "").trim(),
    content,
    nextAction: String(record.nextAction || "").trim(),
    updatedAt: record.updatedAt || getTodayDate()
  };
}

function normalizeMemoRecord(record = {}) {
  const content = String(record.content || record.text || "").trim();

  if (!content) {
    return null;
  }

  return {
    id: record.id || createId("memo"),
    content,
    actor: String(record.actor || record.createdBy || getCurrentActorName()).trim(),
    createdAt: String(record.createdAt || record.date || getTodayDate()).trim(),
    updatedAt: String(record.updatedAt || record.createdAt || record.date || getTodayDate()).trim()
  };
}

function normalizeMemoRecords(candidate) {
  const memos = Array.isArray(candidate.memos)
    ? candidate.memos.map(normalizeMemoRecord).filter(Boolean)
    : [];

  if (!memos.length && candidate.summary) {
    const legacyMemo = normalizeMemoRecord({
      content: candidate.summary,
      actor: candidate.owner || getCurrentActorName(),
      createdAt: candidate.updatedAt || candidate.createdAt || getTodayDate(),
      updatedAt: candidate.updatedAt || candidate.createdAt || getTodayDate()
    });

    if (legacyMemo) {
      memos.push(legacyMemo);
    }
  }

  return memos;
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

function normalizeScreeningFitResultForApplicant(applicant = {}) {
  const score = Number(applicant.fitScore ?? applicant.score ?? 0);
  const fulfilledDetails = normalizeJobFitReportItems(applicant.fitFulfilledDetails || applicant.fulfilledDetails || [], "basis");
  const missingDetails = normalizeJobFitReportItems(applicant.fitMissingDetails || applicant.missingDetails || [], "note");

  return {
    fitScore: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
    fitFulfilledDetails: fulfilledDetails,
    fitMissingDetails: missingDetails,
    fitEducation: normalizeJobFitEducationRecords(applicant.fitEducation || applicant.education || []),
    fitCareer: normalizeJobFitCareerRecords(applicant.fitCareer || applicant.career || [])
  };
}

function normalizeInterviewPanelMembers(panel = {}) {
  const rawMembers = Array.isArray(panel.members) ? panel.members : [];
  const normalizedMembers = rawMembers
    .map((member) => ({
      name: String(member?.name || "").trim(),
      email: String(member?.email || "").trim().toLowerCase()
    }))
    .filter((member) => member.name || member.email);

  if (normalizedMembers.length) {
    return normalizedMembers;
  }

  const names = String(panel.names || "")
    .split(/[,\n]+/)
    .map((name) => name.trim())
    .filter(Boolean);
  const emails = String(panel.emails || "")
    .split(/[,\n]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const max = Math.max(names.length, emails.length);

  return Array.from({ length: max }, (_, index) => ({
    name: names[index] || "",
    email: emails[index] || ""
  })).filter((member) => member.name || member.email);
}

function normalizeInterviewPanelSlots(panel = {}) {
  return (Array.isArray(panel.slots) ? panel.slots : [])
    .map((slot) => String(slot || "").trim())
    .filter(Boolean);
}

function normalizeScreeningEducationRecords(records = []) {
  return (Array.isArray(records) ? records : [])
    .map(normalizeEducationRecord)
    .filter(hasAnyRecordValue)
    .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)));
}

function normalizeScreeningCareerRecords(records = []) {
  return (Array.isArray(records) ? records : [])
    .map((item = {}) => ({
      country: String(item.country || "").trim(),
      company: String(item.company || "").trim(),
      rank: String(item.rank || "").trim(),
      position: String(item.position || item.department || item.title || "").trim(),
      start: String(item.start || "").trim(),
      end: String(item.end || "").trim(),
      achievements: String(item.achievements || "").trim()
    }))
    .filter(hasAnyRecordValue)
    .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)));
}

function getScreeningCurrentProfileFromCareer(career = []) {
  const current = Array.isArray(career) ? career.find(hasAnyRecordValue) || {} : {};
  return {
    company: String(current.company || "").trim(),
    currentRole: uniqueTextParts([current.rank, current.position]).join(", ")
  };
}

function normalizeScreeningApplicant(applicant = {}) {
  const sourceType = applicant.sourceType === "search_firm" ? "search_firm" : "direct";
  const requestedStage = applicant.stage === "reception" ? "registered" : applicant.stage;
  const stage = SCREENING_STAGE_LABELS[requestedStage] ? requestedStage : "registered";
  const fitGrade = FIT_GRADE_ORDER.includes(applicant.fitGrade) ? applicant.fitGrade : "C";
  const education = normalizeScreeningEducationRecords(applicant.education || []);
  const career = normalizeScreeningCareerRecords(applicant.career || []);
  const currentProfile = getScreeningCurrentProfileFromCareer(career);
  const fit = normalizeScreeningFitResultForApplicant(applicant);
  const birthYear = String(applicant.birthYear || applicant.birth_year || "").trim();

  return {
    id: applicant.id || createId("screening-applicant"),
    name: String(applicant.name || "").trim(),
    sourceType,
    searchFirmMemberId: String(applicant.searchFirmMemberId || "").trim(),
    registeredById: String(applicant.registeredById || "").trim(),
    registeredByName: String(applicant.registeredByName || "").trim(),
    company: String(applicant.company || currentProfile.company || "").trim(),
    currentRole: String(applicant.currentRole || currentProfile.currentRole || "").trim(),
    birthYear,
    age: calculateAge(birthYear),
    nationality: String(applicant.nationality || "").trim(),
    email: String(applicant.email || "").trim().toLowerCase(),
    phone: String(applicant.phone || "").trim(),
    summary: String(applicant.summary || "").trim(),
    resumeAttachment: applicant.resumeAttachment || null,
    attachments: Array.isArray(applicant.attachments)
      ? applicant.attachments.filter((attachment) => attachment && (attachment.name || attachment.dataUrl))
      : [],
    education,
    career,
    fitGrade,
    fitScore: fit.fitScore,
    fitComment: String(applicant.fitComment || "").trim(),
    fitFulfilledDetails: fit.fitFulfilledDetails,
    fitMissingDetails: fit.fitMissingDetails,
    fitEducation: fit.fitEducation,
    fitCareer: fit.fitCareer,
    receptionOpinion: String(applicant.receptionOpinion || applicant.opinions?.reception || "").trim(),
    firstOpinion: String(applicant.firstOpinion || applicant.opinions?.first || "").trim(),
    secondOpinion: String(applicant.secondOpinion || applicant.opinions?.second || "").trim(),
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
    syncUpdatedAt: folder.syncUpdatedAt || folder.updatedAt || folder.createdAt || getTodayDate(),
    accessMemberIds,
    receptionMemberIds,
    secondScreeningMemberIds,
    interviewPanel: {
      names: String(folder.interviewPanel?.names || "").trim(),
      emails: String(folder.interviewPanel?.emails || "").trim(),
      availability: String(folder.interviewPanel?.availability || "").trim(),
      members: normalizeInterviewPanelMembers(folder.interviewPanel || {}),
      slots: normalizeInterviewPanelSlots(folder.interviewPanel || {}),
      timelineDate: String(folder.interviewPanel?.timelineDate || "").trim(),
      timelineStartHour: Number(folder.interviewPanel?.timelineStartHour || 0) || 0,
      timelineEndHour: Number(folder.interviewPanel?.timelineEndHour || 0) || 0
    },
    applicants: Array.isArray(folder.applicants)
      ? folder.applicants.map(normalizeScreeningApplicant)
      : []
  };
}

function getInterviewStageConfig(stageId) {
  return INTERVIEW_STAGE_CONFIG.find((stage) => stage.id === stageId) || INTERVIEW_STAGE_CONFIG[0];
}

function defaultInterviewPanel(stageId) {
  if (stageId === "phone") {
    return [{ role: "CL3 참석자", level: "CL3", name: "", email: "" }];
  }

  if (stageId === "technical") {
    return [
      { role: "전문성 면접위원", level: "CL3 이상", name: "", email: "" },
      { role: "전문성 면접위원", level: "CL3 이상", name: "", email: "" },
      { role: "부서장 면접위원", level: "임원", name: "", email: "" },
      { role: "부서장 면접위원", level: "임원", name: "", email: "" }
    ];
  }

  return [
    { role: "HR담당자", level: "CL3 이상", name: "", email: "" },
    { role: "HR담당자", level: "CL4 이상", name: "", email: "" }
  ];
}

function normalizeInterviewAttachment(attachment = null) {
  if (!attachment || typeof attachment !== "object") {
    return null;
  }

  return {
    name: String(attachment.name || "").trim(),
    size: Number(attachment.size || 0),
    type: String(attachment.type || "").trim(),
    dataUrl: String(attachment.dataUrl || "").trim(),
    uploadedAt: attachment.uploadedAt || getTimestampText(),
    uploadedBy: String(attachment.uploadedBy || "").trim()
  };
}

function normalizePhoneOperationStatus(value, fallback = "pending") {
  return ["pending", "available", "unavailable", "sent", "confirmed", "change_requested"].includes(value)
    ? value
    : fallback;
}

function normalizePhoneInterviewOperation(operation = {}) {
  return {
    autoMail: Boolean(operation.autoMail),
    candidateStatus: normalizePhoneOperationStatus(operation.candidateStatus),
    interviewerStatus: normalizePhoneOperationStatus(operation.interviewerStatus),
    candidateRequestSentAt: String(operation.candidateRequestSentAt || "").trim(),
    panelRequestSentAt: String(operation.panelRequestSentAt || "").trim(),
    candidateConfirmedSentAt: String(operation.candidateConfirmedSentAt || "").trim(),
    panelConfirmedSentAt: String(operation.panelConfirmedSentAt || "").trim(),
    lastChangedBy: String(operation.lastChangedBy || "").trim(),
    lastChangedAt: String(operation.lastChangedAt || "").trim(),
    changeReason: String(operation.changeReason || "").trim()
  };
}

function normalizeInterviewStage(stageId, stage = {}) {
  const config = getInterviewStageConfig(stageId);
  const status = INTERVIEW_STATUS_LABELS[stage.status] ? stage.status : "waiting";
  const documents = {};

  config.documents.forEach((document) => {
    documents[document.id] = normalizeInterviewAttachment(stage.documents?.[document.id]);
  });

  return {
    status,
    candidateSlots: Array.isArray(stage.candidateSlots) ? stage.candidateSlots.map(String).filter(Boolean) : [],
    interviewerSlots: Array.isArray(stage.interviewerSlots) ? stage.interviewerSlots.map(String).filter(Boolean) : [],
    confirmedAt: String(stage.confirmedAt || "").trim(),
    panel: (Array.isArray(stage.panel) && stage.panel.length ? stage.panel : defaultInterviewPanel(stageId)).map((member) => ({
      role: String(member.role || "").trim(),
      level: String(member.level || "").trim(),
      name: String(member.name || "").trim(),
      email: String(member.email || "").trim().toLowerCase()
    })),
    documents,
    note: String(stage.note || "").trim(),
    phoneOperation: stageId === "phone"
      ? normalizePhoneInterviewOperation(stage.phoneOperation || stage.operation || {})
      : normalizePhoneInterviewOperation({}),
    mailHistory: Array.isArray(stage.mailHistory) ? stage.mailHistory : []
  };
}

function normalizeInterviewCase(interviewCase = {}) {
  const stages = {};

  INTERVIEW_STAGE_IDS.forEach((stageId) => {
    stages[stageId] = normalizeInterviewStage(stageId, interviewCase.stages?.[stageId] || interviewCase[stageId] || {});
  });

  const currentStage = INTERVIEW_STAGE_IDS.includes(interviewCase.currentStage) ? interviewCase.currentStage : "phone";
  const status = ["in_progress", "passed", "failed"].includes(interviewCase.status) ? interviewCase.status : "in_progress";

  return {
    id: interviewCase.id || createId("interview"),
    sourceFolderId: String(interviewCase.sourceFolderId || "").trim(),
    sourceApplicantId: String(interviewCase.sourceApplicantId || "").trim(),
    candidateName: String(interviewCase.candidateName || interviewCase.name || "").trim(),
    company: String(interviewCase.company || "").trim(),
    currentRole: String(interviewCase.currentRole || "").trim(),
    birthYear: String(interviewCase.birthYear || interviewCase.birth_year || "").trim(),
    nationality: String(interviewCase.nationality || "").trim(),
    education: Array.isArray(interviewCase.education)
      ? interviewCase.education.map(normalizeEducationRecord).filter(hasAnyRecordValue)
      : [],
    career: Array.isArray(interviewCase.career)
      ? interviewCase.career.map(normalizeCareerRecord).filter(hasAnyRecordValue)
      : [],
    email: String(interviewCase.email || "").trim().toLowerCase(),
    phone: String(interviewCase.phone || "").trim(),
    businessUnit: normalizeBusinessUnit(interviewCase.businessUnit) || "",
    department: String(interviewCase.department || "").trim(),
    positionName: String(interviewCase.positionName || "").trim(),
    currentStage,
    status,
    stages,
    finalDecision: String(interviewCase.finalDecision || "").trim(),
    offerSignedAt: String(interviewCase.offerSignedAt || interviewCase.offer_signed_at || "").trim(),
    offerSignedBy: String(interviewCase.offerSignedBy || interviewCase.offer_signed_by || "").trim(),
    recruitingMetricRowId: String(interviewCase.recruitingMetricRowId || interviewCase.recruiting_metric_row_id || "").trim(),
    offerSyncedToMetricsAt: String(interviewCase.offerSyncedToMetricsAt || interviewCase.offer_synced_to_metrics_at || "").trim(),
    joinedAt: String(interviewCase.joinedAt || interviewCase.joined_at || "").trim(),
    joinedBy: String(interviewCase.joinedBy || interviewCase.joined_by || "").trim(),
    createdAt: interviewCase.createdAt || getTodayDate(),
    updatedAt: interviewCase.updatedAt || interviewCase.createdAt || getTodayDate()
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

function normalizeInterviewReportUpload(upload = {}) {
  if (!upload || typeof upload !== "object") {
    return null;
  }

  const dataUrl = String(upload.persistDataUrl ? (upload.dataUrl || upload.url || "") : "").trim();
  const storeKey = String(upload.storeKey || upload.fileStoreKey || "").trim();
  const name = String(upload.name || upload.fileName || "").trim();

  if (!name || (!dataUrl && !storeKey)) {
    return null;
  }

  return {
    id: upload.id || createId("interview-report-file"),
    name,
    size: Number(upload.size || 0) || 0,
    type: String(upload.type || upload.fileType || "").trim(),
    dataUrl,
    storeKey,
    uploadedAt: upload.uploadedAt || getTimestampText()
  };
}

function createInterviewReportStoredUpload(file) {
  if (!file || !file.size) {
    return null;
  }

  const storeKey = createId("interview-report-file");
  interviewReportFileStore.set(storeKey, file);

  return normalizeInterviewReportUpload({
    id: storeKey,
    storeKey,
    name: file.name,
    size: file.size,
    type: file.type || "",
    uploadedAt: getTimestampText()
  });
}

function getInterviewReportStoredFile(upload) {
  const normalizedUpload = normalizeInterviewReportUpload(upload);

  if (!normalizedUpload?.storeKey) {
    return null;
  }

  return interviewReportFileStore.get(normalizedUpload.storeKey) || null;
}

function canReadInterviewReportUpload(upload) {
  const normalizedUpload = normalizeInterviewReportUpload(upload);

  if (!normalizedUpload) {
    return false;
  }

  return Boolean(normalizedUpload.dataUrl || getInterviewReportStoredFile(normalizedUpload));
}

function normalizeInterviewTemplateSample(sample = {}) {
  const text = normalizePolicyText(sample.text || sample.content || sample.templateText);
  const dataUrl = String(sample.persistDataUrl ? sample.dataUrl || "" : "").trim();
  const storeKey = String(sample.storeKey || sample.fileStoreKey || "").trim();

  if (!text && !dataUrl && !storeKey) {
    return null;
  }

  const name = String(sample.name || sample.fileName || sample.templateFileName || "면담록 샘플").trim();

  return {
    id: sample.id || createId("interview-template-sample"),
    name,
    size: Number(sample.size || 0) || 0,
    type: String(sample.type || sample.fileType || "").trim(),
    dataUrl,
    storeKey,
    text,
    profile: sample.profile && typeof sample.profile === "object"
      ? sample.profile
      : text
        ? analyzeInterviewTemplateProfile(text, name)
        : null,
    uploadedAt: sample.uploadedAt || getTimestampText()
  };
}

function normalizeInterviewReportState(value = {}) {
  const rawSamples = Array.isArray(value.templateSamples) ? value.templateSamples : [];
  const templateSamples = rawSamples.map(normalizeInterviewTemplateSample).filter(Boolean);
  const legacyTemplateText = normalizePolicyText(value.templateText || "");
  const legacyTemplateFileName = String(value.templateFileName || "").trim();

  if (legacyTemplateText && legacyTemplateFileName && !templateSamples.some((sample) => sample.text === legacyTemplateText)) {
    const legacySample = normalizeInterviewTemplateSample({
      name: legacyTemplateFileName,
      text: legacyTemplateText,
      uploadedAt: value.templateUploadedAt || getTimestampText()
    });

    if (legacySample) {
      templateSamples.push(legacySample);
    }
  }

  return {
    scriptText: String(value.scriptText || "").trim(),
    scriptFile: normalizeInterviewReportUpload(value.scriptFile || value.scriptUpload || null),
    scriptFileName: String(value.scriptFileName || "").trim(),
    scriptStatus: String(value.scriptStatus || "").trim(),
    scriptLoading: Boolean(value.scriptLoading),
    scriptProgress: Number(value.scriptProgress || 0) || 0,
    templateText: legacyTemplateFileName ? "" : legacyTemplateText,
    templateFileName: String(value.templateFileName || "").trim(),
    templateSamples,
    templateStatus: String(value.templateStatus || "").trim(),
    templateLoading: Boolean(value.templateLoading),
    templateProgress: Number(value.templateProgress || 0) || 0,
    templateProfile: value.templateProfile && typeof value.templateProfile === "object" ? value.templateProfile : null,
    prompt: String(value.prompt || "").trim(),
    reportText: String(value.reportText || "").trim(),
    reportLoading: Boolean(value.reportLoading),
    reportProgress: Number(value.reportProgress || 0) || 0,
    generationLogs: Array.isArray(value.generationLogs) ? value.generationLogs.map(String).filter(Boolean).slice(-10) : [],
    usedAi: Boolean(value.usedAi),
    status: String(value.status || "").trim()
  };
}

function normalizeRecruitingMetricsState(value = {}) {
  const sourceTargets = value.targets && typeof value.targets === "object" ? value.targets : {};
  const targets = Object.fromEntries(BUSINESS_UNITS.map((unit) => {
    const target = sourceTargets[unit] || {};

    return [unit, {
      hiringTarget: Number(target.hiringTarget || 0) || 0,
      keyTalentTarget: Number(target.keyTalentTarget || 0) || 0,
      weeklyNote: String(target.weeklyNote || "").trim(),
      completed: Boolean(target.completed),
      completedAt: String(target.completedAt || "").trim(),
      completedBy: String(target.completedBy || "").trim()
    }];
  }));
  const activeTab = RECRUITING_METRICS_TABS.some((tab) => tab.key === value.activeTab)
    ? value.activeTab
    : "details";
  const detailUnitFilter = normalizeBusinessUnit(value.detailUnitFilter) || "all";
  const progressUnitFilter = normalizeBusinessUnit(value.progressUnitFilter) || "all";
  const detailSheet = normalizeRecruitingSheet(
    value.detailSheet,
    RECRUITING_METRICS_DETAIL_COLUMNS,
    RECRUITING_METRICS_MIN_ROWS
  );
  const progressSheet = normalizeRecruitingSheet(
    value.progressSheet || buildRecruitingProgressSheetFromTargets(sourceTargets),
    RECRUITING_METRICS_PROGRESS_COLUMNS,
    BUSINESS_UNITS.length
  );
  ensureRecruitingProgressSheetRows(progressSheet, targets);

  return {
    activeTab,
    detailUnitFilter,
    progressUnitFilter,
    weekOf: String(value.weekOf || getTodayDate()).trim(),
    targets,
    detailSheet,
    progressSheet,
    mailModalOpen: Boolean(value.mailModalOpen),
    mailFrequency: ["manual", "weekly", "monthly"].includes(value.mailFrequency) ? value.mailFrequency : "weekly",
    mailBody: String(value.mailBody || "").trim(),
    mailDraft: value.mailDraft && typeof value.mailDraft === "object" ? {
      frequency: ["manual", "weekly", "monthly"].includes(value.mailDraft.frequency) ? value.mailDraft.frequency : "weekly",
      subject: String(value.mailDraft.subject || value.subject || "[TalentHub] 채용 진행 경과").trim(),
      body: String(value.mailDraft.body || value.mailBody || "").trim(),
      recipients: normalizeEmailList(value.mailDraft.recipients || value.recipients || [])
    } : null,
    requestMailFrequency: ["manual", "weekly", "monthly"].includes(value.requestMailFrequency) ? value.requestMailFrequency : "weekly",
    requestMailDay: ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(value.requestMailDay) ? value.requestMailDay : "monday",
    requestMailTime: String(value.requestMailTime || "09:00").trim(),
    requestMailBody: String(value.requestMailBody || "").trim(),
    requestMailDraft: value.requestMailDraft && typeof value.requestMailDraft === "object" ? {
      frequency: ["manual", "weekly", "monthly"].includes(value.requestMailDraft.frequency) ? value.requestMailDraft.frequency : "weekly",
      day: ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(value.requestMailDraft.day) ? value.requestMailDraft.day : "monday",
      time: String(value.requestMailDraft.time || value.requestMailTime || "09:00").trim(),
      subject: String(value.requestMailDraft.subject || value.requestSubject || "[TalentHub] 채용 실적 상세 데이터시트 작성 요청").trim(),
      body: String(value.requestMailDraft.body || value.requestMailBody || "").trim(),
      recipients: normalizeEmailList(value.requestMailDraft.recipients || value.requestRecipients || [])
    } : null,
    saveStatus: String(value.saveStatus || "").trim(),
    recipients: normalizeEmailList(value.recipients || []),
    subject: String(value.subject || "[TalentHub] 주간 채용 지표 취합").trim(),
    requestRecipients: normalizeEmailList(value.requestRecipients || []),
    requestSubject: String(value.requestSubject || "[TalentHub] 채용 실적 상세 데이터시트 작성 요청").trim(),
    requestLastSentKey: String(value.requestLastSentKey || "").trim(),
    requestLastSentAt: String(value.requestLastSentAt || "").trim(),
    mailStatus: String(value.mailStatus || "").trim(),
    autoSendOnComplete: Boolean(value.autoSendOnComplete),
    lastAutoSentWeek: String(value.lastAutoSentWeek || "").trim()
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
  state.screeningDeletedFolderIds = normalizeIdList(state.screeningDeletedFolderIds);
  state.screeningFolders = filterDeletedScreeningFolders(state.screeningFolders.map(normalizeScreeningFolder));
  normalizeScreeningFilters();

  if (!state.screeningFolders.length && !state.screeningDeletedFolderIds.length) {
    state.screeningFolders = structuredClone(DEFAULT_SCREENING_FOLDERS).map(normalizeScreeningFolder);
  }

  const folders = getAccessibleScreeningFolders(getCurrentMember(), { applyFilters: false });
  if (!folders.some((folder) => folder.id === state.selectedScreeningFolderId)) {
    state.selectedScreeningFolderId = folders[0]?.id || state.screeningFolders[0]?.id || "";
  }
}

function createInterviewCaseFromScreening(folder, applicant) {
  return normalizeInterviewCase({
    id: `interview-${folder.id}-${applicant.id}`,
    sourceFolderId: folder.id,
    sourceApplicantId: applicant.id,
    candidateName: applicant.name,
    company: applicant.company,
    currentRole: applicant.currentRole,
    birthYear: applicant.birthYear,
    nationality: applicant.nationality,
    education: applicant.education,
    career: applicant.career,
    email: applicant.email,
    phone: applicant.phone,
    businessUnit: folder.businessUnit,
    department: folder.department,
    positionName: folder.positionName || folder.title,
    currentStage: "phone",
    status: "in_progress",
    createdAt: getTodayDate(),
    updatedAt: getTodayDate()
  });
}

function getDeletedInterviewCaseIdSet() {
  return new Set(normalizeIdList(state.interviewDeletedCaseIds));
}

function isInterviewCaseDeletedId(interviewCaseId) {
  return getDeletedInterviewCaseIdSet().has(String(interviewCaseId || "").trim());
}

function filterDeletedInterviewCases(interviewCases = []) {
  const deletedIds = getDeletedInterviewCaseIdSet();

  if (!deletedIds.size) {
    return Array.isArray(interviewCases) ? interviewCases : [];
  }

  return (Array.isArray(interviewCases) ? interviewCases : []).filter((interviewCase) => interviewCase?.id && !deletedIds.has(interviewCase.id));
}

function rememberDeletedInterviewCaseId(interviewCaseId) {
  const id = String(interviewCaseId || "").trim();

  if (!id) {
    return;
  }

  state.interviewDeletedCaseIds = normalizeIdList([...(state.interviewDeletedCaseIds || []), id]);
  state.interviewCases = filterDeletedInterviewCases(state.interviewCases);
}

function syncInterviewCasesFromScreening() {
  state.interviewDeletedCaseIds = normalizeIdList(state.interviewDeletedCaseIds);
  state.interviewCases = filterDeletedInterviewCases(state.interviewCases);
  const existingKeys = new Set(state.interviewCases.map((item) => `${item.sourceFolderId}:${item.sourceApplicantId}`));
  let changed = false;

  state.screeningFolders.forEach((folder) => {
    folder.applicants
      .filter((applicant) => ["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(applicant.stage))
      .forEach((applicant) => {
        const key = `${folder.id}:${applicant.id}`;
        const nextCaseId = `interview-${folder.id}-${applicant.id}`;

        if (isInterviewCaseDeletedId(nextCaseId)) {
          return;
        }

        const existingCase = state.interviewCases.find((item) => `${item.sourceFolderId}:${item.sourceApplicantId}` === key);

        if (existingCase) {
          const nextEmail = String(applicant.email || "").trim().toLowerCase();
          const nextPhone = String(applicant.phone || "").trim();
          const nextCompany = String(applicant.company || "").trim();
          const nextRole = String(applicant.currentRole || "").trim();
          const nextBirthYear = String(applicant.birthYear || "").trim();
          const nextNationality = String(applicant.nationality || "").trim();
          const nextEducation = Array.isArray(applicant.education) ? applicant.education.map(normalizeEducationRecord).filter(hasAnyRecordValue) : [];
          const nextCareer = Array.isArray(applicant.career) ? applicant.career.map(normalizeCareerRecord).filter(hasAnyRecordValue) : [];

          if (
            (nextEmail && existingCase.email !== nextEmail) ||
            (nextPhone && existingCase.phone !== nextPhone) ||
            (nextCompany && existingCase.company !== nextCompany) ||
            (nextRole && existingCase.currentRole !== nextRole) ||
            (nextBirthYear && existingCase.birthYear !== nextBirthYear) ||
            (nextNationality && existingCase.nationality !== nextNationality) ||
            (nextEducation.length && JSON.stringify(existingCase.education || []) !== JSON.stringify(nextEducation)) ||
            (nextCareer.length && JSON.stringify(existingCase.career || []) !== JSON.stringify(nextCareer)) ||
            existingCase.businessUnit !== folder.businessUnit ||
            existingCase.department !== folder.department ||
            existingCase.positionName !== (folder.positionName || folder.title)
          ) {
            existingCase.email = nextEmail || existingCase.email;
            existingCase.phone = nextPhone || existingCase.phone;
            existingCase.company = nextCompany || existingCase.company;
            existingCase.currentRole = nextRole || existingCase.currentRole;
            existingCase.birthYear = nextBirthYear || existingCase.birthYear;
            existingCase.nationality = nextNationality || existingCase.nationality;
            existingCase.education = nextEducation.length ? nextEducation : existingCase.education;
            existingCase.career = nextCareer.length ? nextCareer : existingCase.career;
            existingCase.businessUnit = folder.businessUnit;
            existingCase.department = folder.department;
            existingCase.positionName = folder.positionName || folder.title;
            existingCase.updatedAt = getTodayDate();
            changed = true;
          }
        } else if (!existingKeys.has(key)) {
          state.interviewCases.unshift(createInterviewCaseFromScreening(folder, applicant));
          existingKeys.add(key);
          changed = true;
        }
      });
  });

  return changed;
}

function canViewInterviewCase(interviewCase, member = getCurrentMember()) {
  if (!member || member.status !== "active") {
    return false;
  }

  if (isAdmin(member) || member.role === "division_recruiter") {
    return true;
  }

  if (member.role === "business_recruiter") {
    return !interviewCase.businessUnit || getMemberBusinessUnit(member) === interviewCase.businessUnit;
  }

  if (member.role === "hiring_manager") {
    const email = String(member.email || "").toLowerCase();
    return INTERVIEW_STAGE_IDS.some((stageId) =>
      (interviewCase.stages?.[stageId]?.panel || []).some((panelMember) => panelMember.email === email || panelMember.name === member.name)
    ) || true;
  }

  if (member.role === "applicant") {
    return String(member.email || "").toLowerCase() === String(interviewCase.email || "").toLowerCase();
  }

  return canAccessView("interview", member);
}

function getVisibleInterviewCases() {
  return state.interviewCases
    .map(normalizeInterviewCase)
    .filter((item) => !isInterviewCaseDeletedId(item.id))
    .filter((item) => canViewInterviewCase(item))
    .sort((a, b) => dateSortValue(b.updatedAt) - dateSortValue(a.updatedAt) || a.candidateName.localeCompare(b.candidateName, "ko"));
}

function ensureInterviewDefaults() {
  state.interviewDeletedCaseIds = normalizeIdList(state.interviewDeletedCaseIds);
  state.interviewCases = filterDeletedInterviewCases(state.interviewCases.map(normalizeInterviewCase));
  const changed = syncInterviewCasesFromScreening();
  const visibleCases = getVisibleInterviewCases();

  if (!visibleCases.some((item) => item.id === state.selectedInterviewCaseId)) {
    state.selectedInterviewCaseId = visibleCases[0]?.id || "";
  }

  if (!INTERVIEW_STAGE_IDS.includes(state.selectedInterviewStage)) {
    state.selectedInterviewStage = "phone";
  }

  if (changed) {
    persistState();
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

function normalizeTrendingSearchSettings(settings = {}) {
  const prompt = String(settings.prompt || settings.interest_prompt || settings.payload?.prompt || DEFAULT_TRENDING_SEARCH_SETTINGS.prompt).trim();
  const keywords = Array.isArray(settings.keywords)
    ? settings.keywords
    : Array.isArray(settings.payload?.keywords)
      ? settings.payload.keywords
      : DEFAULT_TRENDING_SEARCH_SETTINGS.keywords;

  return {
    ...structuredClone(DEFAULT_TRENDING_SEARCH_SETTINGS),
    ...settings,
    prompt: prompt || DEFAULT_TRENDING_SEARCH_SETTINGS.prompt,
    keywords: [...new Set(keywords.map((item) => String(item || "").trim()).filter(Boolean))],
    updatedAt: String(settings.updatedAt || settings.updated_at || settings.payload?.updatedAt || "").trim(),
    updatedBy: String(settings.updatedBy || settings.updated_by || settings.payload?.updatedBy || "").trim()
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

    normalized[role] = MENU_CONFIG
      .map((item) => item.view)
      .filter((view) => normalized[role].includes(view));
  });

  normalized.admin = MENU_CONFIG.map((item) => item.view);

  return normalized;
}

function normalizeMenuOrder(order = []) {
  const knownViews = new Set(DEFAULT_MENU_ORDER);
  const ordered = Array.isArray(order)
    ? order.map((view) => String(view || "").trim()).filter((view) => knownViews.has(view))
    : [];
  const unique = [...new Set(ordered)];
  const missing = DEFAULT_MENU_ORDER.filter((view) => !unique.includes(view));

  return unique.concat(missing);
}

function normalizeMenuLabels(labels = {}) {
  if (!labels || typeof labels !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(labels)
      .map(([view, label]) => {
        const normalizedView = String(view || "").trim();
        const normalizedLabel = String(label || "").trim();

        if (normalizedView === "jd-enhance" && ["JD 고도화", "JD Advancement", "직무기술서 작성"].includes(normalizedLabel)) {
          return [normalizedView, "채용공고 작성"];
        }

        return [normalizedView, normalizedLabel];
      })
      .filter(([view, label]) => DEFAULT_MENU_ORDER.includes(view) && label)
      .map(([view, label]) => [view, label.slice(0, 40)])
  );
}

function getMenuLabel(view) {
  const labels = normalizeMenuLabels(state.menuLabels);
  return labels[view] || DEFAULT_MENU_LABELS[view] || view || "";
}

function normalizeMenuSettingsUpdatedAt(value) {
  const text = String(value || "").trim();
  return Number.isNaN(Date.parse(text)) ? "" : text;
}

function markMenuSettingsChanged() {
  state.menuSettingsUpdatedAt = new Date().toISOString();
}

function getOrderedMenuConfig() {
  const order = normalizeMenuOrder(state.menuOrder);
  const menuMap = new Map(MENU_CONFIG.map((item) => [item.view, item]));

  return order
    .map((view) => menuMap.get(view))
    .filter(Boolean)
    .map((item) => ({
      ...item,
      label: getMenuLabel(item.view),
      defaultLabel: DEFAULT_MENU_LABELS[item.view] || item.label
    }));
}

function getMenuConfigItem(view) {
  return MENU_CONFIG.find((item) => item.view === view) || null;
}

function ensureMemberDefaults() {
  state.members = state.members.map(normalizeMember);

  if (!state.members.some((member) => member.role === "admin" && member.status === "active")) {
    state.members.unshift(...structuredClone(DEFAULT_MEMBERS).map(normalizeMember));
  }

  state.rolePermissions = normalizeRolePermissions(state.rolePermissions);
  state.menuOrder = normalizeMenuOrder(state.menuOrder);
  state.menuLabels = normalizeMenuLabels(state.menuLabels);
  state.menuSettingsUpdatedAt = normalizeMenuSettingsUpdatedAt(state.menuSettingsUpdatedAt);

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

  if (view === "members") {
    return getAllowedViewsForRole(member.role).includes("members") && canUseManagement(member);
  }

  return getAllowedViewsForRole(member.role).includes(view);
}

function canManageCandidates(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && CANDIDATE_REGISTER_ROLES.has(member.role));
}

function canCreateMemberAccounts(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && ["business_recruiter", "division_recruiter", "admin"].includes(member.role));
}

function canUseManagement(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && (isAdmin(member) || canCreateMemberAccounts(member)));
}

function resetAccountScopedWorkspaceForCurrentUser() {
  const savedAnalyses = (state.jobFitAnalysis?.savedAnalyses || [])
    .map(normalizeSavedJobFitAnalysis)
    .filter((analysis) => analysis && belongsToCurrentAccount(analysis));

  state.jobFitAnalysis = normalizeJobFitState({ savedAnalyses });
  state.policyChatQuestion = "";
  state.policyChatSelectedCitationId = "";
  state.policyChatLoading = false;
}

function getCreatableMemberRoles(member = getCurrentMember()) {
  if (!canCreateMemberAccounts(member)) {
    return [];
  }

  if (isAdmin(member)) {
    return MEMBER_ROLE_ORDER;
  }

  return ["applicant", "search_firm", "hiring_manager"];
}

function memberRoleNeedsBusinessUnit(role) {
  return Boolean(role && !MEMBER_ROLES_WITHOUT_BUSINESS_UNIT.has(role));
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
    return step === "first" && (folder.receptionMemberIds || []).includes(member.id);
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

function canRegisterScreeningApplicant(folder, member = getCurrentMember()) {
  return Boolean(
    canAccessScreeningFolder(folder, member) &&
    (isSearchFirmRole(member) || isRecruitingRole(member) || canManageScreeningFolder(folder, member))
  );
}

function isScreeningApplicantOwner(applicant, member = getCurrentMember()) {
  if (!applicant || !member) {
    return false;
  }

  return applicant.registeredById === member.id ||
    applicant.searchFirmMemberId === member.id;
}

function canEditScreeningApplicantCore(folder, applicant, member = getCurrentMember()) {
  if (!folder || !applicant || applicant.stage !== "registered" || !canAccessScreeningStep(folder, "first", member)) {
    return false;
  }

  if (isSearchFirmRole(member)) {
    return applicant.sourceType === "search_firm" && isScreeningApplicantOwner(applicant, member);
  }

  return isRecruitingRole(member) || canManageScreeningFolder(folder, member) || isScreeningApplicantOwner(applicant, member);
}

function canEditScreeningApplicantContact(folder, applicant, member = getCurrentMember()) {
  return Boolean(applicant && canManageScreeningContact(folder, applicant, member));
}

function canEditScreeningApplicant(folder, applicant, member = getCurrentMember()) {
  return canEditScreeningApplicantCore(folder, applicant, member) ||
    canEditScreeningApplicantContact(folder, applicant, member);
}

function canDeleteScreeningApplicant(folder, applicant, member = getCurrentMember()) {
  return canEditScreeningApplicantCore(folder, applicant, member);
}

function getDefaultView(member = getCurrentMember()) {
  return getOrderedMenuConfig()
    .map((item) => item.view)
    .find((view) => canAccessView(view, member)) || "";
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

function getRememberedLoginEmail() {
  try {
    return String(window.localStorage.getItem(REMEMBERED_LOGIN_EMAIL_KEY) || "").trim();
  } catch (error) {
    return "";
  }
}

function setRememberedLoginEmail(email) {
  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (normalizedEmail) {
      window.localStorage.setItem(REMEMBERED_LOGIN_EMAIL_KEY, normalizedEmail);
    } else {
      window.localStorage.removeItem(REMEMBERED_LOGIN_EMAIL_KEY);
    }
  } catch (error) {
    console.warn("Remembered login email could not be saved.", error);
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
        screeningDeletedFolderIds: state.screeningDeletedFolderIds,
        interviewCases: state.interviewCases,
        interviewDeletedCaseIds: state.interviewDeletedCaseIds,
        selectedInterviewCaseId: state.selectedInterviewCaseId,
        selectedInterviewStage: state.selectedInterviewStage,
        auditLogs: state.auditLogs,
        selectedCandidateId: state.selectedCandidateId,
        selectedScreeningFolderId: state.selectedScreeningFolderId,
        screeningMailTemplates: state.screeningMailTemplates,
        poolFilters: state.poolFilters,
        dashboardFilters: state.dashboardFilters,
        screeningFilters: state.screeningFilters,
        members: state.members.map(sanitizeMemberForStorage),
        rolePermissions: state.rolePermissions,
        menuOrder: state.menuOrder,
        menuLabels: state.menuLabels,
        menuSettingsUpdatedAt: state.menuSettingsUpdatedAt,
        memberFilters: state.memberFilters,
        managementTab: state.managementTab,
        visitStats: normalizeVisitStatsState(state.visitStats),
        currentUserId: state.currentUserId,
        jobFitAnalysis: state.jobFitAnalysis,
        interviewReport: state.interviewReport,
        recruitingMetrics: state.recruitingMetrics,
        jdEnhancement: state.jdEnhancement,
        trendingReport: state.trendingReport,
        trendingHistory: state.trendingHistory,
        trendingSelectedDate: state.trendingSelectedDate,
        trendingMailSettings: state.trendingMailSettings,
        trendingSearchSettings: state.trendingSearchSettings,
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

  if (Array.isArray(persisted.screeningDeletedFolderIds)) {
    state.screeningDeletedFolderIds = normalizeIdList(persisted.screeningDeletedFolderIds);
    state.screeningFolders = filterDeletedScreeningFolders(state.screeningFolders);
  }

  if (Array.isArray(persisted.interviewDeletedCaseIds)) {
    state.interviewDeletedCaseIds = normalizeIdList(persisted.interviewDeletedCaseIds);
  }

  if (Array.isArray(persisted.interviewCases)) {
    state.interviewCases = filterDeletedInterviewCases(persisted.interviewCases.map(normalizeInterviewCase));
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

  if (persisted.screeningMailTemplates && typeof persisted.screeningMailTemplates === "object") {
    state.screeningMailTemplates = persisted.screeningMailTemplates;
  }

  if (Array.isArray(persisted.members) && persisted.members.length) {
    state.members = persisted.members.map(normalizeMember);
  }

  if (persisted.rolePermissions && typeof persisted.rolePermissions === "object") {
    state.rolePermissions = normalizeRolePermissions(persisted.rolePermissions);
  }

  if (Array.isArray(persisted.menuOrder)) {
    state.menuOrder = normalizeMenuOrder(persisted.menuOrder);
  }

  if (persisted.menuLabels && typeof persisted.menuLabels === "object") {
    state.menuLabels = normalizeMenuLabels(persisted.menuLabels);
  }

  if (persisted.menuSettingsUpdatedAt) {
    state.menuSettingsUpdatedAt = normalizeMenuSettingsUpdatedAt(persisted.menuSettingsUpdatedAt);
  }

  if (persisted.memberFilters && typeof persisted.memberFilters === "object") {
    state.memberFilters = { ...state.memberFilters, ...persisted.memberFilters };
  }

  if (["members", "create", "menu-order", "logs"].includes(persisted.managementTab)) {
    state.managementTab = persisted.managementTab;
  }

  if (persisted.visitStats && typeof persisted.visitStats === "object") {
    state.visitStats = mergeVisitStats(state.visitStats, persisted.visitStats);
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

  if (persisted.trendingSearchSettings && typeof persisted.trendingSearchSettings === "object") {
    state.trendingSearchSettings = normalizeTrendingSearchSettings(persisted.trendingSearchSettings);
  }

  if (Array.isArray(persisted.policySources)) {
    state.policySources = persisted.policySources.map(normalizePolicySource).filter((source) => source.content);
  }

  if (Array.isArray(persisted.policyChatMessages)) {
    state.policyChatMessages = persisted.policyChatMessages.slice(-POLICY_CHAT_MAX_MESSAGES);
  }

  if (persisted.jobFitAnalysis && typeof persisted.jobFitAnalysis === "object") {
    state.jobFitAnalysis = normalizeJobFitState(persisted.jobFitAnalysis);
    state.jobFitAnalysis.jdLoading = false;
    state.jobFitAnalysis.resumeLoading = false;
    state.jobFitAnalysis.analysisLoading = false;
    if (persisted.jobFitAnalysis.analysisLoading || persisted.jobFitAnalysis.loading) {
      state.jobFitAnalysis.analysisStatus = "이전 분석이 완료되지 않아 대기 상태로 복구했습니다. 평가 분석 시작 버튼을 다시 눌러 주세요.";
    }
  }

  if (persisted.interviewReport && typeof persisted.interviewReport === "object") {
    state.interviewReport = normalizeInterviewReportState(persisted.interviewReport);
    state.interviewReport.scriptLoading = false;
    state.interviewReport.templateLoading = false;
  }

  if (persisted.recruitingMetrics && typeof persisted.recruitingMetrics === "object") {
    state.recruitingMetrics = normalizeRecruitingMetricsState(persisted.recruitingMetrics);
  }

  if (persisted.jdEnhancement && typeof persisted.jdEnhancement === "object") {
    state.jdEnhancement = normalizeJdEnhancementState(persisted.jdEnhancement);
    state.jdEnhancement.loading = false;
    state.jdEnhancement.fileLoading = false;
    if (persisted.jdEnhancement.loading || persisted.jdEnhancement.fileLoading) {
      state.jdEnhancement.status = "이전 작업이 완료되지 않아 대기 상태로 복구했습니다. JD 점검 시작 버튼을 다시 눌러 주세요.";
    }
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

  if (state.interviewCases.some((item) => item.id === persisted.selectedInterviewCaseId)) {
    state.selectedInterviewCaseId = persisted.selectedInterviewCaseId;
  }

  if (INTERVIEW_STAGE_IDS.includes(persisted.selectedInterviewStage)) {
    state.selectedInterviewStage = persisted.selectedInterviewStage;
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
  const normalizedCandidate = normalizeCandidate({
    ...candidate,
    syncUpdatedAt: candidate.syncUpdatedAt || new Date().toISOString()
  });

  return {
    id: normalizedCandidate.id,
    name: normalizedCandidate.name,
    company: normalizedCandidate.company,
    role: normalizedCandidate.role,
    owner: normalizedCandidate.owner,
    status: normalizedCandidate.status,
    business_unit: normalizedCandidate.organization || null,
    profile_visibility: normalizedCandidate.visibility || "all",
    updated_at: normalizedCandidate.syncUpdatedAt,
    profile: normalizedCandidate
  };
}

function candidateFromSupabaseRow(row) {
  if (!row?.profile) {
    return null;
  }

  return normalizeCandidate({
    ...row.profile,
    id: row.id || row.profile.id,
    name: row.name || row.profile.name,
    company: row.company || row.profile.company,
    role: row.role || row.profile.role,
    owner: row.owner || row.profile.owner,
    status: row.status || row.profile.status,
    organization: row.business_unit || row.profile.organization,
    visibility: row.profile_visibility || row.profile.visibility,
    syncUpdatedAt: row.profile.syncUpdatedAt || row.updated_at || row.profile.updatedAt
  });
}

function entityFreshness(value) {
  const normalized = value || {};
  return Math.max(
    dateSortValue(normalized.syncUpdatedAt),
    dateSortValue(normalized.updatedAt),
    dateSortValue(normalized.createdAt)
  );
}

function mergeByLatest(localItems = [], remoteItems = [], normalizer = (item) => item) {
  const byId = new Map();

  [...remoteItems, ...localItems].forEach((item) => {
    const normalized = normalizer(item);

    if (!normalized?.id) {
      return;
    }

    const existing = byId.get(normalized.id);

    if (!existing || entityFreshness(normalized) >= entityFreshness(existing)) {
      byId.set(normalized.id, normalized);
    }
  });

  return [...byId.values()];
}

function touchCandidate(candidate) {
  if (!candidate) {
    return null;
  }

  candidate.updatedAt = getTodayDate();
  candidate.syncUpdatedAt = new Date().toISOString();
  return candidate;
}

async function upsertCandidateToSupabase(candidate) {
  if (!REMOTE_SYNC_ENABLED || !candidate?.id) {
    return;
  }

  await supabaseRequest("candidates?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([candidateToSupabaseRow(candidate)])
  });
}

function screeningFolderToSupabaseRow(folder) {
  const normalized = normalizeScreeningFolder({
    ...folder,
    syncUpdatedAt: folder.syncUpdatedAt || new Date().toISOString()
  });

  return {
    id: normalized.id,
    title: normalized.title,
    business_unit: normalized.businessUnit || null,
    created_by_id: normalized.createdById || null,
    created_by_name: normalized.createdByName || null,
    updated_at: normalized.syncUpdatedAt,
    payload: normalized
  };
}

function screeningFolderFromSupabaseRow(row) {
  if (!row?.payload) {
    return null;
  }

  return normalizeScreeningFolder({
    ...row.payload,
    id: row.id || row.payload.id,
    title: row.title || row.payload.title,
    businessUnit: row.business_unit || row.payload.businessUnit,
    createdById: row.created_by_id || row.payload.createdById,
    createdByName: row.created_by_name || row.payload.createdByName,
    syncUpdatedAt: row.payload.syncUpdatedAt || row.updated_at || row.payload.updatedAt
  });
}

function touchScreeningFolder(folder) {
  if (!folder) {
    return null;
  }

  folder.updatedAt = getTodayDate();
  folder.syncUpdatedAt = new Date().toISOString();
  return folder;
}

async function upsertScreeningFolderToSupabase(folder) {
  if (!REMOTE_SYNC_ENABLED || !folder?.id) {
    return;
  }

  await supabaseRequest("screening_folders?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([screeningFolderToSupabaseRow(folder)])
  });
}

async function deleteScreeningFolderFromSupabase(folderId) {
  await deleteSupabaseRecord("screening_folders", folderId);
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
    business_unit: normalized.businessUnit || null,
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

async function upsertMemberToSupabase(member) {
  if (!REMOTE_SYNC_ENABLED || !member?.id) {
    return;
  }

  await supabaseRequest("app_members?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([memberToSupabaseRow(member)])
  });
}

function queueMemberRemoteSave(member) {
  upsertMemberToSupabase(member).catch((error) => {
    console.warn("Member remote save failed.", error);
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

function getJobFitAnalysisOwner() {
  const member = getCurrentMember();

  return {
    ownerId: member?.id || state.currentUserId || "",
    ownerEmail: member?.email || ""
  };
}

function currentAccountOwnerFields() {
  const owner = getJobFitAnalysisOwner();

  return {
    ownerId: owner.ownerId,
    ownerEmail: owner.ownerEmail
  };
}

function belongsToCurrentAccount(item = {}) {
  const owner = currentAccountOwnerFields();
  const itemOwnerId = String(item.ownerId || item.owner_id || "").trim();
  const itemOwnerEmail = String(item.ownerEmail || item.owner_email || "").trim().toLowerCase();

  if (!owner.ownerId && !owner.ownerEmail) {
    return false;
  }

  return Boolean(
    (owner.ownerId && itemOwnerId && owner.ownerId === itemOwnerId) ||
    (owner.ownerEmail && itemOwnerEmail && owner.ownerEmail.toLowerCase() === itemOwnerEmail)
  );
}

function withCurrentAccountOwner(payload = {}) {
  return {
    ...payload,
    ...currentAccountOwnerFields()
  };
}

function jobFitAnalysisToSupabaseRow(analysis) {
  const normalized = normalizeSavedJobFitAnalysis(analysis);
  const owner = getJobFitAnalysisOwner();

  return {
    id: normalized.id,
    owner_id: normalized.ownerId || owner.ownerId || null,
    owner_email: normalized.ownerEmail || owner.ownerEmail || null,
    title: normalized.title,
    created_by: normalized.createdBy || null,
    created_at: toSupabaseTimestamp(normalized.createdAt) || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    payload: normalized
  };
}

function jobFitAnalysisFromSupabaseRow(row) {
  return normalizeSavedJobFitAnalysis({
    ...(row.payload || {}),
    id: row.id,
    ownerId: row.owner_id || row.payload?.ownerId || "",
    ownerEmail: row.owner_email || row.payload?.ownerEmail || "",
    title: row.title,
    createdBy: row.created_by || row.payload?.createdBy || "",
    createdAt: row.payload?.createdAt || row.created_at || ""
  });
}

function mergeJobFitSavedAnalyses(localAnalyses = [], remoteAnalyses = []) {
  const byId = new Map();

  remoteAnalyses.forEach((analysis) => {
    if (analysis?.id) {
      byId.set(analysis.id, normalizeSavedJobFitAnalysis(analysis));
    }
  });

  localAnalyses.forEach((analysis) => {
    const normalized = normalizeSavedJobFitAnalysis(analysis);

    if (normalized?.id && !byId.has(normalized.id)) {
      byId.set(normalized.id, normalized);
    }
  });

  return [...byId.values()]
    .filter(Boolean)
    .sort((a, b) => dateSortValue(b.createdAt) - dateSortValue(a.createdAt))
    .slice(0, 30);
}

async function loadJobFitAnalysesFromSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return [];
  }

  const owner = getJobFitAnalysisOwner();

  if (!owner.ownerId && !owner.ownerEmail) {
    return [];
  }

  const filter = owner.ownerId
    ? `owner_id=eq.${encodeURIComponent(owner.ownerId)}`
    : `owner_email=eq.${encodeURIComponent(owner.ownerEmail)}`;
  const rows = await supabaseRequest(`job_fit_analyses?select=*&${filter}&order=created_at.desc&limit=50`);

  return Array.isArray(rows)
    ? rows.map(jobFitAnalysisFromSupabaseRow).filter(Boolean)
    : [];
}

async function mergeCurrentUserJobFitAnalysesFromSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return false;
  }

  try {
    const remoteAnalyses = await loadJobFitAnalysesFromSupabase();

    if (!remoteAnalyses.length) {
      return false;
    }

    const jobFit = getJobFitState();
    jobFit.savedAnalyses = mergeJobFitSavedAnalyses(jobFit.savedAnalyses, remoteAnalyses);
    persistState({ skipRemoteSync: true });
    return true;
  } catch (error) {
    console.warn("Saved job fit analyses could not be loaded from Supabase.", error);
    return false;
  }
}

async function upsertJobFitAnalysisToSupabase(analysis) {
  if (!REMOTE_SYNC_ENABLED) {
    return;
  }

  await supabaseRequest("job_fit_analyses?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([jobFitAnalysisToSupabaseRow(analysis)])
  });
}

async function deleteJobFitAnalysisFromSupabase(analysisId) {
  await deleteSupabaseRecord("job_fit_analyses", analysisId);
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
    MENU_CONFIG
      .filter((menu) => ROLE_PERMISSION_TABLE_VIEWS.has(menu.view))
      .map((menu) => ({
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

  const normalized = normalizeRolePermissions(permissions);

  MEMBER_ROLE_ORDER.forEach((role) => {
    const merged = new Set(normalized[role] || []);

    (DEFAULT_ROLE_PERMISSIONS[role] || []).forEach((view) => {
      if (!ROLE_PERMISSION_TABLE_VIEWS.has(view)) {
        merged.add(view);
      }
    });

    normalized[role] = MENU_CONFIG
      .map((item) => item.view)
      .filter((view) => merged.has(view));
  });

  normalized.admin = MENU_CONFIG.map((item) => item.view);
  return normalized;
}

function appSettingToSupabaseRow(settingKey, payload) {
  return {
    setting_key: settingKey,
    payload,
    updated_at: new Date().toISOString()
  };
}

function buildMenuSettingPayload() {
  return {
    menuOrder: normalizeMenuOrder(state.menuOrder),
    menuLabels: normalizeMenuLabels(state.menuLabels),
    menuSettingsUpdatedAt: state.menuSettingsUpdatedAt || new Date().toISOString()
  };
}

function buildRolePermissionsPayload() {
  return {
    permissions: normalizeRolePermissions(state.rolePermissions),
    updatedAt: new Date().toISOString(),
    updatedBy: getCurrentActorName()
  };
}

function buildInterviewCasesPayload() {
  return {
    cases: filterDeletedInterviewCases(state.interviewCases.map(normalizeInterviewCase)),
    deletedCaseIds: normalizeIdList(state.interviewDeletedCaseIds),
    selectedInterviewCaseId: state.selectedInterviewCaseId || "",
    selectedInterviewStage: state.selectedInterviewStage || "phone",
    updatedAt: new Date().toISOString(),
    updatedBy: getCurrentActorName()
  };
}

function buildRecruitingMetricsPayload() {
  return {
    metrics: normalizeRecruitingMetricsState(state.recruitingMetrics),
    updatedAt: new Date().toISOString(),
    updatedBy: getCurrentActorName()
  };
}

function buildJdEnhancementPayload() {
  const jd = normalizeJdEnhancementState(state.jdEnhancement);

  return {
    guidelineText: jd.guidelineText,
    savedDocuments: jd.savedDocuments,
    updatedAt: new Date().toISOString(),
    updatedBy: getCurrentActorName()
  };
}

function buildScreeningDeletedFoldersPayload() {
  return {
    ids: normalizeIdList(state.screeningDeletedFolderIds),
    updatedAt: new Date().toISOString(),
    updatedBy: getCurrentActorName()
  };
}

function getDeletedScreeningFolderIdSet() {
  return new Set(normalizeIdList(state.screeningDeletedFolderIds));
}

function filterDeletedScreeningFolders(folders = []) {
  const deletedIds = getDeletedScreeningFolderIdSet();

  if (!deletedIds.size) {
    return Array.isArray(folders) ? folders : [];
  }

  return (Array.isArray(folders) ? folders : []).filter((folder) => folder?.id && !deletedIds.has(folder.id));
}

function rememberDeletedScreeningFolderId(folderId) {
  const id = String(folderId || "").trim();

  if (!id) {
    return;
  }

  state.screeningDeletedFolderIds = normalizeIdList([...(state.screeningDeletedFolderIds || []), id]);
  state.screeningFolders = filterDeletedScreeningFolders(state.screeningFolders);
}

function getRemoteMenuSettingsUpdatedAt(row) {
  return normalizeMenuSettingsUpdatedAt(
    row?.payload?.menuSettingsUpdatedAt ||
    row?.payload?.menu_settings_updated_at ||
    row?.payload?.updatedAt ||
    row?.updated_at
  );
}

async function syncMenuSettingsToSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return false;
  }

  await supabaseRequest("app_settings?on_conflict=setting_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([appSettingToSupabaseRow(MENU_SETTING_KEY, buildMenuSettingPayload())])
  });

  return true;
}

async function syncScreeningDeletedFoldersToSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return false;
  }

  await supabaseRequest("app_settings?on_conflict=setting_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([appSettingToSupabaseRow(SCREENING_DELETED_FOLDERS_SETTING_KEY, buildScreeningDeletedFoldersPayload())])
  });

  return true;
}

async function syncRolePermissionsToSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return false;
  }

  await supabaseRequest("app_settings?on_conflict=setting_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([appSettingToSupabaseRow(ROLE_PERMISSIONS_SETTING_KEY, buildRolePermissionsPayload())])
  });

  return true;
}

async function syncInterviewCasesToSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return false;
  }

  await supabaseRequest("app_settings?on_conflict=setting_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([appSettingToSupabaseRow(INTERVIEW_CASES_SETTING_KEY, buildInterviewCasesPayload())])
  });

  return true;
}

async function syncRecruitingMetricsToSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return false;
  }

  await supabaseRequest("app_settings?on_conflict=setting_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([appSettingToSupabaseRow(RECRUITING_METRICS_SETTING_KEY, buildRecruitingMetricsPayload())])
  });

  return true;
}

async function syncJdEnhancementToSupabase() {
  if (!REMOTE_SYNC_ENABLED) {
    return false;
  }

  await supabaseRequest("app_settings?on_conflict=setting_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([appSettingToSupabaseRow(JD_ENHANCEMENT_SETTING_KEY, buildJdEnhancementPayload())])
  });

  return true;
}

function applyAppSettingsFromSupabaseRows(rows = []) {
  const settings = Array.isArray(rows) ? rows : [];
  const menuOrderSetting = settings.find((row) => row.setting_key === MENU_SETTING_KEY);
  const deletedFoldersSetting = settings.find((row) => row.setting_key === SCREENING_DELETED_FOLDERS_SETTING_KEY);
  const rolePermissionsSetting = settings.find((row) => row.setting_key === ROLE_PERMISSIONS_SETTING_KEY);
  const interviewCasesSetting = settings.find((row) => row.setting_key === INTERVIEW_CASES_SETTING_KEY);
  const recruitingMetricsSetting = settings.find((row) => row.setting_key === RECRUITING_METRICS_SETTING_KEY);
  const jdEnhancementSetting = settings.find((row) => row.setting_key === JD_ENHANCEMENT_SETTING_KEY);
  const visitStatsSetting = settings.find((row) => row.setting_key === VISIT_STATS_SETTING_KEY);

  if (deletedFoldersSetting?.payload) {
    const remoteDeletedIds = normalizeIdList(
      deletedFoldersSetting.payload.ids ||
      deletedFoldersSetting.payload.screeningDeletedFolderIds ||
      deletedFoldersSetting.payload.screening_deleted_folder_ids ||
      []
    );

    if (remoteDeletedIds.length) {
      state.screeningDeletedFolderIds = normalizeIdList([...(state.screeningDeletedFolderIds || []), ...remoteDeletedIds]);
      state.screeningFolders = filterDeletedScreeningFolders(state.screeningFolders);
    }
  }

  if (rolePermissionsSetting?.payload?.permissions) {
    state.rolePermissions = normalizeRolePermissions(rolePermissionsSetting.payload.permissions);
  }

  if (interviewCasesSetting?.payload) {
    const remoteDeletedCaseIds = normalizeIdList(
      interviewCasesSetting.payload.deletedCaseIds ||
      interviewCasesSetting.payload.deleted_case_ids ||
      interviewCasesSetting.payload.interviewDeletedCaseIds ||
      []
    );

    if (remoteDeletedCaseIds.length) {
      state.interviewDeletedCaseIds = normalizeIdList([...(state.interviewDeletedCaseIds || []), ...remoteDeletedCaseIds]);
      state.interviewCases = filterDeletedInterviewCases(state.interviewCases);
    }

    const cases = interviewCasesSetting.payload.cases || interviewCasesSetting.payload.interviewCases || [];

    if (Array.isArray(cases)) {
      state.interviewCases = filterDeletedInterviewCases(mergeByLatest(state.interviewCases, cases, normalizeInterviewCase))
        .sort((a, b) => dateSortValue(b.updatedAt) - dateSortValue(a.updatedAt) || String(b.id).localeCompare(String(a.id)));
    }

    const selectedCaseId = String(interviewCasesSetting.payload.selectedInterviewCaseId || "").trim();
    const selectedStage = String(interviewCasesSetting.payload.selectedInterviewStage || "").trim();

    if (selectedCaseId && state.interviewCases.some((item) => item.id === selectedCaseId)) {
      state.selectedInterviewCaseId = selectedCaseId;
    }

    if (INTERVIEW_STAGE_IDS.includes(selectedStage)) {
      state.selectedInterviewStage = selectedStage;
    }
  }

  if (recruitingMetricsSetting?.payload?.metrics) {
    state.recruitingMetrics = normalizeRecruitingMetricsState(recruitingMetricsSetting.payload.metrics);
  }

  if (jdEnhancementSetting?.payload) {
    const currentJd = getJdEnhancementState();
    state.jdEnhancement = normalizeJdEnhancementState({
      ...currentJd,
      guidelineText: jdEnhancementSetting.payload.guidelineText || currentJd.guidelineText,
      savedDocuments: mergeSavedJdDocuments(currentJd.savedDocuments, jdEnhancementSetting.payload.savedDocuments || [])
    });
  }

  if (visitStatsSetting?.payload) {
    state.visitStats = mergeVisitStats(state.visitStats, visitStatsSetting.payload);
    state.visitStatsRemoteLoaded = true;
    saveVisitStats(state.visitStats);
  }

  if (!menuOrderSetting) {
    return;
  }

  const remoteUpdatedAt = getRemoteMenuSettingsUpdatedAt(menuOrderSetting);
  const localUpdatedAt = normalizeMenuSettingsUpdatedAt(state.menuSettingsUpdatedAt);

  if (localUpdatedAt && remoteUpdatedAt && dateSortValue(localUpdatedAt) > dateSortValue(remoteUpdatedAt)) {
    return;
  }

  const menuOrder = menuOrderSetting?.payload?.menuOrder || menuOrderSetting?.payload?.menu_order;
  const menuLabels = menuOrderSetting?.payload?.menuLabels || menuOrderSetting?.payload?.menu_labels;

  if (Array.isArray(menuOrder)) {
    state.menuOrder = normalizeMenuOrder(menuOrder);
  }

  if (menuLabels && typeof menuLabels === "object") {
    state.menuLabels = normalizeMenuLabels(menuLabels);
  }

  state.menuSettingsUpdatedAt = remoteUpdatedAt || localUpdatedAt;
}

let remoteSyncTimer = null;
let remoteSyncInFlight = false;
let remoteSyncReady = !REMOTE_SYNC_ENABLED;
let recruitingMetricsMailModalOpen = false;
let recruitingMetricsRequestMailModalOpen = false;

function scheduleRemoteSync() {
  if (!REMOTE_SYNC_ENABLED || !remoteSyncReady) {
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
    state.screeningFolders = filterDeletedScreeningFolders(state.screeningFolders);
    state.interviewDeletedCaseIds = normalizeIdList(state.interviewDeletedCaseIds);
    state.interviewCases = filterDeletedInterviewCases(state.interviewCases);
    const screeningFolderRows = state.screeningFolders.map(screeningFolderToSupabaseRow);
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

    if (screeningFolderRows.length) {
      try {
        await supabaseRequest("screening_folders?on_conflict=id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(screeningFolderRows)
        });
      } catch (error) {
        console.warn("Screening folders could not be synced.", error);
      }
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

    try {
      await syncMenuSettingsToSupabase();
      await syncScreeningDeletedFoldersToSupabase();
      await syncRolePermissionsToSupabase();
      await syncInterviewCasesToSupabase();
      await syncRecruitingMetricsToSupabase();
      await syncJdEnhancementToSupabase();
    } catch (error) {
      console.warn("App settings could not be synced.", error);
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
    remoteSyncReady = false;
    state.remoteSyncStatus = "Supabase 불러오는 중";
    const settingKeys = [
      MENU_SETTING_KEY,
      SCREENING_DELETED_FOLDERS_SETTING_KEY,
      ROLE_PERMISSIONS_SETTING_KEY,
      INTERVIEW_CASES_SETTING_KEY,
      RECRUITING_METRICS_SETTING_KEY,
      JD_ENHANCEMENT_SETTING_KEY,
      VISIT_STATS_SETTING_KEY
    ].join(",");
    const [candidateRows, screeningFolderRows, auditRows, memberRows, permissionRows, policySourceRows, appSettingRows] = await Promise.all([
      supabaseRequest("candidates?select=*&order=updated_at.desc"),
      supabaseRequest("screening_folders?select=*&order=updated_at.desc").catch((error) => {
        console.warn("Screening folders could not be loaded.", error);
        return [];
      }),
      supabaseRequest("audit_logs?select=payload&order=created_at.desc&limit=200"),
      supabaseRequest("app_members?select=*&order=requested_at.desc"),
      supabaseRequest("app_role_permissions?select=*"),
      supabaseRequest("recruiting_policy_sources?select=*&order=updated_at.desc").catch((error) => {
        console.warn("Policy sources could not be loaded.", error);
        return [];
      }),
      supabaseRequest(`app_settings?select=*&setting_key=in.(${settingKeys})`).catch((error) => {
        console.warn("App settings could not be loaded.", error);
        return [];
      })
    ]);
    const hasRolePermissionsSetting = Array.isArray(appSettingRows) && appSettingRows.some((row) => row.setting_key === ROLE_PERMISSIONS_SETTING_KEY);

    if (Array.isArray(appSettingRows) && appSettingRows.length) {
      applyAppSettingsFromSupabaseRows(appSettingRows);
    }

    if (Array.isArray(candidateRows)) {
      const remoteCandidates = candidateRows.map(candidateFromSupabaseRow).filter(Boolean);
      state.candidates = sortPoolCandidates(remoteCandidates);
      state.selectedCandidateId = state.candidates.some((candidate) => candidate.id === state.selectedCandidateId)
        ? state.selectedCandidateId
        : state.candidates[0]?.id || "";
    }

    if (Array.isArray(screeningFolderRows) && screeningFolderRows.length) {
      const remoteFolders = filterDeletedScreeningFolders(screeningFolderRows.map(screeningFolderFromSupabaseRow).filter(Boolean));
      state.screeningFolders = filterDeletedScreeningFolders(mergeByLatest(state.screeningFolders, remoteFolders, normalizeScreeningFolder))
        .sort((a, b) => dateSortValue(b.updatedAt) - dateSortValue(a.updatedAt) || a.title.localeCompare(b.title));
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

    if (!hasRolePermissionsSetting && Array.isArray(permissionRows) && permissionRows.length) {
      state.rolePermissions = rolePermissionsFromSupabaseRows(permissionRows);
    }

    if (Array.isArray(policySourceRows) && policySourceRows.length) {
      state.policySources = policySourceRows.map(policySourceFromSupabaseRow).filter((source) => source.content);
    }

    await mergeCurrentUserJobFitAnalysesFromSupabase();

    ensureMemberDefaults();
    ensureScreeningDefaults();
    ensurePolicySourceDefaults();
    state.remoteSyncStatus = "Supabase 연결됨";
    remoteSyncReady = true;
    Promise.allSettled([
      syncRolePermissionsToSupabase(),
      syncInterviewCasesToSupabase(),
      syncRecruitingMetricsToSupabase()
    ]).catch((error) => {
      console.warn("App settings warm sync failed.", error);
    });
    persistState({ skipRemoteSync: true });
    render();
  } catch (error) {
    remoteSyncReady = false;
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

function waitForUiPaint() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(() => window.setTimeout(resolve, 0));
      return;
    }

    setTimeout(resolve, 0);
  });
}

async function readProfilePhotoAsDataUrl(file) {
  const dataUrl = await readFileAsDataUrl(file);

  if (!dataUrl) {
    return "";
  }

  try {
    const cropped = await cropProfilePhotoCandidate(dataUrl, { allowCenterCrop: true });
    return cropped?.dataUrl || dataUrl;
  } catch (error) {
    console.warn("Profile photo resize failed. Original image will be used.", error);
    return dataUrl;
  }
}

function renderProgressStatus(message, percent = 0) {
  const clamped = Math.max(0, Math.min(100, Number(percent) || 0));

  return `
    <span class="ai-progress-status">
      <span class="ai-progress-status-text">${escapeHtml(message)}</span>
      <span class="ai-progress-track" aria-hidden="true"><span style="width:${clamped}%"></span></span>
      <span class="ai-progress-percent">${clamped}%</span>
    </span>
  `;
}

function setProgressStatus(target, message, percent = 0) {
  const element = typeof target === "string" ? $(target) : target;

  if (!element) {
    return;
  }

  element.innerHTML = renderProgressStatus(message, percent);
}

function renderMaybeProgressStatus(message, isLoading = false, percent = 0) {
  return isLoading ? renderProgressStatus(message, percent) : escapeHtml(message);
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

function clampCropBox(box, imageWidth, imageHeight) {
  const x = Math.max(0, Math.min(imageWidth - 1, box.x));
  const y = Math.max(0, Math.min(imageHeight - 1, box.y));
  const width = Math.max(1, Math.min(imageWidth - x, box.width));
  const height = Math.max(1, Math.min(imageHeight - y, box.height));

  return { x, y, width, height };
}

function relativeCropBox(imageWidth, imageHeight, x, y, width, height) {
  return clampCropBox({
    x: imageWidth * x,
    y: imageHeight * y,
    width: imageWidth * width,
    height: imageHeight * height
  }, imageWidth, imageHeight);
}

function drawRawImageCrop(image, box) {
  const crop = clampCropBox(box, image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement("canvas");
  const maxSide = 720;
  const scale = Math.min(1, maxSide / Math.max(crop.width, crop.height));
  canvas.width = Math.max(1, Math.round(crop.width * scale));
  canvas.height = Math.max(1, Math.round(crop.height * scale));
  const context = canvas.getContext("2d");
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

function pdfProfileRegionBoxes(imageWidth, imageHeight) {
  return [
    relativeCropBox(imageWidth, imageHeight, 0.035, 0.025, 0.26, 0.24),
    relativeCropBox(imageWidth, imageHeight, 0.70, 0.025, 0.26, 0.24),
    relativeCropBox(imageWidth, imageHeight, 0.035, 0.03, 0.32, 0.32),
    relativeCropBox(imageWidth, imageHeight, 0.63, 0.03, 0.33, 0.32),
    relativeCropBox(imageWidth, imageHeight, 0.05, 0.12, 0.24, 0.28),
    relativeCropBox(imageWidth, imageHeight, 0.71, 0.12, 0.24, 0.28)
  ].filter((box) => Math.min(box.width, box.height) >= 80);
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

async function extractPdfProfileRegionCandidates(firstPageDataUrl, fileName) {
  const pageImage = await loadImageElement(firstPageDataUrl);

  return pdfProfileRegionBoxes(pageImage.naturalWidth, pageImage.naturalHeight)
    .map((box, index) => ({
      fileName: `${fileName}-profile-region-${index + 1}.png`,
      dataUrl: drawRawImageCrop(pageImage, box),
      scoreBoost: 45
    }));
}

async function extractProfilePhotoFromResume(file) {
  const buffer = await file.arrayBuffer();
  const fileType = detectResumeFileType(file, buffer);
  const candidates = [];

  if (fileType === "docx" || fileType === "hwpx") {
    candidates.push(...await extractImageCandidatesFromResumeZip(buffer, fileType));
  } else if (fileType === "pdf") {
    try {
      const firstPageDataUrl = await renderPdfFirstPageImage(buffer);
      candidates.push({ fileName: `${file.name}-first-page.png`, dataUrl: firstPageDataUrl, requireFace: true });
      candidates.push(...await extractPdfProfileRegionCandidates(firstPageDataUrl, file.name));
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
        score: profileImageScore({ width: cropped.width, height: cropped.height, fileName: candidate.fileName }) + (cropped.confidence === "face" ? 70 : 0) + (candidate.scoreBoost || 0),
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
    state.editExtractedPhotoUrl = "";
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
  state.editExtractedPhotoUrl = "";
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

function candidatePhotoButton(candidate, size = "pool") {
  return `
    <button class="candidate-photo-button" type="button" data-select-candidate="${escapeHtml(candidate.id)}" aria-label="${escapeHtml(candidate.name)} 상세 프로필 보기">
      ${candidateVisual(candidate, size)}
    </button>
  `;
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

function formatDisplayPeriodPart(value) {
  const normalized = String(value || "").trim();

  if (/^(현재|재직\s*중|present|current|ongoing)$/i.test(normalized)) {
    return "현재";
  }

  if (!normalized || normalized === "0" || normalized === "00" || normalized === "0000-00") {
    return "";
  }

  if (normalized === "현재") {
    return "현재";
  }

  const match = normalized.match(/^(\d{2,4})(?:[-./년\s]*(\d{1,2}))?/);

  if (!match) {
    return "";
  }

  const year = match[1];
  const month = match[2] && match[2] !== "0" && match[2] !== "00"
    ? match[2].padStart(2, "0")
    : "";
  const yearText = `'${year.slice(-2)}`;

  return month ? `${yearText}.${month}` : yearText;
}

function formatDisplayPeriod(start, end) {
  const startText = formatDisplayPeriodPart(start);
  const endText = String(end || "").trim() === "현재" ? "현재" : formatDisplayPeriodPart(end);

  if (!startText || !endText) {
    return "";
  }

  return `(${startText}~${endText})`;
}

function formatSingleDisplayPeriod(value) {
  const text = formatDisplayPeriodPart(value);
  return text && text !== "현재" ? `(${text})` : "";
}

function formatPeriod(start, end) {
  return formatDisplayPeriod(start, end);
}

function formatEducationDegreeShort(degree) {
  const normalized = String(degree || "").trim();

  if (!normalized) {
    return "";
  }

  if (/박사|ph\.?\s*d|doctor/i.test(normalized)) return "박";
  if (/석사|master|m\.?\s*s|m\.?\s*a|mba/i.test(normalized)) return "석";
  if (/학사|bachelor|b\.?\s*s|b\.?\s*a/i.test(normalized)) return "학";

  if (normalized.includes("박")) return "박";
  if (normalized.includes("석")) return "석";
  if (normalized.includes("학")) return "학";
  return normalized;
}

function formatEducationMainLine(item, options = {}) {
  const degree = formatEducationDegreeShort(item?.degree);
  const title = [
    degree ? `${degree}) ${item.school || ""}`.trim() : item?.school,
    item?.major
  ].filter(Boolean).join(", ");
  const period = options.useGraduationOnly
    ? formatSingleDisplayPeriod(item?.end)
    : formatDisplayPeriod(item?.start, item?.end);

  return [title, period].filter(Boolean).join(" ");
}

function formatCareerMainLine(item) {
  const title = uniqueTextParts([item?.company, item?.rank, item?.position]).join(", ");
  const period = formatDisplayPeriod(item?.start, item?.end);
  return [title, period].filter(Boolean).join(" ");
}

function formatEducationSummary(candidate) {
  return (candidate.education || [])
    .map((item) => formatEducationMainLine(item, { useGraduationOnly: true }))
    .filter(Boolean)
    .slice(0, 3);
}

function formatCareerSummary(candidate) {
  return (candidate.career || [])
    .map(formatCareerMainLine)
    .filter(Boolean)
    .slice(0, 3);
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
  const rememberedLoginEmail = getRememberedLoginEmail();

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
              <label for="signup-position">직급/직책</label>
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
            <input class="control-input" id="login-email" name="email" type="email" required autocomplete="email" value="${escapeHtml(rememberedLoginEmail)}" />
          </div>
          <div class="field">
            <label for="login-password">비밀번호</label>
            <input class="control-input" id="login-password" name="password" type="password" required autocomplete="current-password" />
          </div>
          <label class="inline-check auth-remember">
            <input type="checkbox" name="rememberEmail" ${rememberedLoginEmail ? "checked" : ""} />
            이메일(ID) 저장
          </label>
          <button class="primary-button" type="submit">로그인</button>
          <button class="ghost-button" type="button" data-auth-view="signup">회원가입 신청</button>
        </form>
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
  applyMenuOrderToSidebar();

  document.querySelectorAll("[data-view]").forEach((element) => {
    const view = element.dataset.view;
    element.hidden = !canAccessView(view);
  });
}

function applyMenuOrderToSidebar() {
  const navList = document.querySelector(".nav-list");

  if (!navList) {
    return;
  }

  const navItems = new Map([...navList.querySelectorAll(".nav-item[data-view]")].map((item) => [item.dataset.view, item]));

  getOrderedMenuConfig().forEach((menu) => {
    const item = navItems.get(menu.view) || createSidebarMenuItem(menu);

    if (item) {
      const labelElement = [...item.querySelectorAll("span")].find((span) => !span.classList.contains("nav-icon"));

      if (labelElement) {
        labelElement.textContent = menu.label;
      }

      if (!navItems.has(menu.view)) {
        navItems.set(menu.view, item);
      }

      navList.appendChild(item);
    }
  });
}

function createSidebarMenuItem(menu) {
  if (!menu?.view) {
    return null;
  }

  const item = document.createElement("button");
  const icon = document.createElement("span");
  const label = document.createElement("span");
  const labelText = String(menu.label || menu.view || "").trim();

  item.className = "nav-item";
  item.type = "button";
  item.dataset.view = menu.view;
  icon.className = "nav-icon";
  icon.textContent = getMenuIcon(menu.view, labelText);
  label.textContent = labelText;
  item.append(icon, label);

  return item;
}

function getMenuIcon(view, label = "") {
  const explicitIcons = {
    dashboard: "D",
    pool: "P",
    screening: "S",
    interview: "I",
    "interview-report": "R",
    "recruiting-metrics": "M",
    "ai-search": "A",
    "job-fit": "J",
    "jd-enhance": "G",
    "policy-chat": "C",
    trending: "T",
    members: "M"
  };

  return explicitIcons[view] || label.charAt(0).toUpperCase() || "?";
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
    pageTitle.textContent = getMenuConfigItem(state.view) ? getMenuLabel(state.view) : viewTitles[state.view] || "Talent Pool";
  }
}

function trendingReportNeedsRefresh(report) {
  if (!report || !Array.isArray(report.people) || !getDisplayTrendingPeople(report).length) {
    return true;
  }

  if (!state.trendingSelectedDate && (report.targetDate || report.reportDate) !== getTrendingTargetDate()) {
    return true;
  }

  return false;
}

function isDisplayableTrendingPerson(person) {
  const name = String(person?.name || "").trim();
  const blocked = new Set([
    "원내", "선거", "선거일", "투표", "모바일", "주행", "행사장", "박람회",
    "시장", "검토", "연기", "대표", "사장", "회장", "의장", "총괄", "최초"
  ]);

  if (!name || blocked.has(name)) {
    return false;
  }

  if (/(대표|회장|사장|임원|회사|기업|그룹|뉴스|부문|사업부)$/i.test(name)) {
    return false;
  }

  return /^[가-힣A-Za-z\s.'-]{2,40}$/.test(name);
}

function getDisplayTrendingPeople(report) {
  return (Array.isArray(report?.people) ? report.people : []).filter(isDisplayableTrendingPerson);
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
    state.trendingEditingPersonId = "";
    state.trendingProfileError = "";
  } else if (previousView !== "trending") {
    state.trendingSelectedDate = "";
  }
  if (view !== "screening") {
    state.screeningPositionModalOpen = false;
    state.screeningApplicantModalOpen = false;
    state.screeningEditingApplicantId = "";
    state.screeningJdModalOpen = false;
    state.screeningAccessModalOpen = false;
    state.screeningApplicantDetailId = "";
    state.screeningResultPanelOpen = false;
    state.screeningPage = "list";
    state.screeningDetailStep = "first";
  } else if (previousView !== "screening") {
    state.screeningPage = "list";
    state.screeningDetailStep = "first";
    state.screeningPositionModalOpen = false;
    state.screeningApplicantModalOpen = false;
    state.screeningEditingApplicantId = "";
    state.screeningJdModalOpen = false;
    state.screeningAccessModalOpen = false;
    state.screeningApplicantDetailId = "";
    state.screeningResultPanelOpen = false;
  }
  if (view !== "detail" && state.isEditingCandidate) {
    discardCandidateEditDraft();
  }
  if (view !== "detail") {
    state.editingInterviewId = "";
    state.editingMemoId = "";
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
    fetchTrendingSearchSettings();
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
  state.detailTab = "profile";
  state.editingInterviewId = "";
  state.editingMemoId = "";
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
      candidate.englishName,
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
      candidate.referenceUrl2,
      candidate.referenceUrl3,
      ...candidate.skills,
      ...candidate.tags,
      ...(candidate.education || []).flatMap((item) => [item.degree, item.school, item.major, item.start, item.end]),
      ...(candidate.career || []).flatMap((item) => [item.country, item.company, item.rank, item.position, item.start, item.end, item.achievements])
    ]
      .join(" ")
      .toLowerCase();

    const queryMatch = !query || text.includes(query);
    const statusMatch = state.poolFilters.status === "all" || candidate.status === state.poolFilters.status;
    const businessUnitMatch = state.poolFilters.businessUnit === "all" || getCandidateBusinessUnit(candidate) === state.poolFilters.businessUnit;
    const ownerMatch = state.poolFilters.owner === "all" || candidate.owner === state.poolFilters.owner;

    return queryMatch && statusMatch && businessUnitMatch && ownerMatch;
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
  ensureInterviewDefaults();
  ensurePolicySourceDefaults();
  ensureActiveViewAllowed();
  syncActiveViewState();
  renderSidePanel();
  renderDashboard();
  renderPool();
  renderScreening();
  renderInterviewView();
  renderInterviewReport();
  renderRecruitingMetrics();
  renderRegister();
  renderAiSearch();
  renderJobFitAnalysis();
  renderJdEnhancement();
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
    detail.textContent = `최근 7일 ${visitStats.weekTotal}회/${visitStats.weekVisitors}명 · 전주 대비 ${delta}`;
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
  const recommendedProfiles = getRecommendedProfiles(5);

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

      <section class="content-panel span-6">
        <div class="panel-header">
          <h4>사업부별 누적 인재 Pool 등록 수</h4>
          <span class="small-pill">누적 기준</span>
        </div>
        ${renderBusinessUnitRegistrationChart(businessUnitCounts)}
      </section>

      <section class="content-panel span-6">
        <div class="panel-header">
          <h4>월별 신규 Pool 등록 수</h4>
          <span class="small-pill">${escapeHtml(selectedLabel)} 기준</span>
        </div>
        ${renderMonthlyRegistrationChart(monthlySeries)}
      </section>

      <section class="content-panel span-6">
        <div class="panel-header">
          <h4>최근 3개월 조회 수 TOP5 프로필</h4>
          <span class="small-pill">상세 조회 로그 기준</span>
        </div>
        ${renderTopViewedProfiles(topViewedProfiles)}
      </section>

      <section class="content-panel span-6">
        <div class="panel-header">
          <h4>채용담당자 추천 프로필</h4>
          <span class="small-pill">추천 ${recommendedProfiles.length}명</span>
        </div>
        ${renderRecommendedProfiles(recommendedProfiles)}
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
    <div class="column-chart dashboard-column-chart">
      ${rows.map((row, index) => `
        <div class="column-chart-item">
          <div class="column-track">
            <div class="column-fill ${["", "green", "amber", "violet"][index % 4]}" style="height:${(row.count / maxCount) * 100}%"></div>
          </div>
          <strong>${row.count}명</strong>
          <span>${escapeHtml(row.unit)}</span>
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
    <div class="column-chart monthly-column-chart">
      ${series.map((item, index) => `
        <div class="column-chart-item">
          <div class="column-track">
            <div class="column-fill ${index === series.length - 1 ? "" : "green"}" style="height:${(item.count / maxCount) * 100}%"></div>
          </div>
          <strong>${item.count}명</strong>
          <span>${escapeHtml(item.label)}</span>
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

function getRecommendedProfiles(limit = 5) {
  return getVisibleCandidates()
    .filter((candidate) => candidate.recommended)
    .sort((a, b) =>
      dateSortValue(b.recommendedAt || b.updatedAt) - dateSortValue(a.recommendedAt || a.updatedAt) ||
      String(a.name).localeCompare(String(b.name), "ko")
    )
    .slice(0, limit);
}

function renderRecommendedProfiles(candidates) {
  if (!candidates.length) {
    return `<div class="empty-state">추천 버튼을 누른 프로필이 아직 없습니다.</div>`;
  }

  return `
    <div class="top-profile-list">
      ${candidates.map((candidate, index) => `
        <article class="top-profile-card recommended-profile-card">
          <span class="top-rank">${index + 1}</span>
          ${candidateVisual(candidate, "pool")}
          <div class="top-profile-main">
            <button class="link-button strong" type="button" data-select-candidate="${escapeHtml(candidate.id)}">${escapeHtml(candidate.name)}</button>
            <span>${escapeHtml(candidate.organization || "사업부 미입력")} · ${escapeHtml(candidate.role || "핵심역량 미입력")}</span>
            <span>${escapeHtml(candidate.recommendedBy || "추천자 미입력")} · ${escapeHtml(candidate.recommendedAt || "-")}</span>
          </div>
          <strong class="top-profile-count">추천</strong>
        </article>
      `).join("")}
    </div>
  `;
}

function renderCandidateSummaryScroll(lines, emptyText) {
  return `
    <div class="summary-lines">
      ${lines.length
        ? lines.map((line) => `<span class="summary-line">${escapeHtml(line)}</span>`).join("")
        : `<span class="muted-text">${escapeHtml(emptyText)}</span>`}
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
          <col class="col-competency" />
          <col class="col-status" />
          <col class="col-owner" />
          <col class="col-linkedin" />
          <col class="col-actions" />
        </colgroup>
        <thead>
          <tr>
            <th>사진</th>
            <th>후보자 이름</th>
            <th>학력</th>
            <th>경력</th>
            <th>핵심역량</th>
            <th>사업부</th>
            <th>담당자</th>
            <th>Linkedin</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          ${candidates.map((candidate) => {
            const educationSummary = formatEducationSummary(candidate);
            const careerSummary = formatCareerSummary(candidate);
            const competencyLines = [candidate.role || candidate.skills?.[0] || ""].filter(Boolean);
            const linkedin = normalizeExternalUrl(candidate.linkedinUrl);

            return `
            <tr>
              <td class="photo-cell">${candidatePhotoButton(candidate)}</td>
              <td class="candidate-cell">
                <div class="candidate-name candidate-name-compact">
                  <span>
                    <button class="candidate-name-button" type="button" data-select-candidate="${candidate.id}">${escapeHtml(candidate.name)}</button>
                    <span class="candidate-birth-line">${escapeHtml(formatBirthAge(candidate))}</span>
                  </span>
                </div>
              </td>
              <td class="summary-cell">
                ${renderCandidateSummaryScroll(educationSummary, "학력 정보 없음")}
              </td>
              <td class="summary-cell">
                ${renderCandidateSummaryScroll(careerSummary, "경력 정보 없음")}
              </td>
              <td class="role-cell">${renderCandidateSummaryScroll(competencyLines, "핵심역량 미입력")}</td>
              <td>${escapeHtml(candidate.organization || "사업부 미입력")}</td>
              <td>${escapeHtml(candidate.owner)}</td>
              <td class="linkedin-cell">
                ${linkedin ? `<a class="linkedin-icon-link" href="${escapeHtml(linkedin)}" target="_blank" rel="noreferrer" title="${escapeHtml(candidate.name)} LinkedIn">in</a>` : ""}
              </td>
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

function updatePoolTitleCount(count) {
  const title = $("#pool-title");

  if (!title) {
    return;
  }

  title.innerHTML = `Talent Pool <span class="pool-title-count">${Number(count || 0).toLocaleString()}명</span>`;
}

function renderPool() {
  const owners = [...new Set(getVisibleCandidates().map((candidate) => candidate.owner))];
  const candidates = sortPoolCandidates(getFilteredCandidates());
  const sortBy = normalizePoolSortBy(state.poolFilters.sortBy);
  const businessUnits = [...new Set(getVisibleCandidates().map(getCandidateBusinessUnit))]
    .filter(Boolean)
    .sort((a, b) => {
      const indexA = BUSINESS_UNITS.indexOf(a);
      const indexB = BUSINESS_UNITS.indexOf(b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB) || a.localeCompare(b, "ko");
    });
  updatePoolTitleCount(candidates.length);

  $("#pool-content").innerHTML = `
    <div class="filter-strip pool-filter-strip">
      <input class="control-input" id="pool-query" type="search" value="${escapeHtml(state.poolFilters.query)}" placeholder="이름, 회사, 기술, 태그" />
      <select class="control-select" id="pool-status">
        <option value="all">전체 상태</option>
        ${STATUS_ORDER.map((status) => `<option value="${status}" ${state.poolFilters.status === status ? "selected" : ""}>${STATUS_LABELS[status]}</option>`).join("")}
      </select>
      <select class="control-select" id="pool-business-unit">
        <option value="all">전체 사업부</option>
        ${businessUnits.map((unit) => `<option value="${escapeHtml(unit)}" ${state.poolFilters.businessUnit === unit ? "selected" : ""}>${escapeHtml(unit)}</option>`).join("")}
      </select>
      <select class="control-select" id="pool-owner">
        <option value="all">전체 담당자</option>
        ${owners.map((owner) => `<option value="${owner}" ${state.poolFilters.owner === owner ? "selected" : ""}>${owner}</option>`).join("")}
      </select>
      <select class="control-select" id="pool-sort">
        <option value="createdAt" ${sortBy === "createdAt" ? "selected" : ""}>등록일 순</option>
        <option value="updatedAt" ${sortBy === "updatedAt" ? "selected" : ""}>수정일 순</option>
      </select>
    </div>
    <div id="pool-table-content">
      ${candidateTable(candidates)}
    </div>
  `;
}

function renderPoolTable() {
  const tableContent = $("#pool-table-content");
  const candidates = sortPoolCandidates(getFilteredCandidates());
  updatePoolTitleCount(candidates.length);

  if (!tableContent) {
    renderPool();
    return;
  }

  tableContent.innerHTML = candidateTable(candidates);
}

function getBaseAccessibleScreeningFolders(member = getCurrentMember()) {
  return filterDeletedScreeningFolders(state.screeningFolders)
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
  if (getDeletedScreeningFolderIdSet().has(folderId)) {
    return null;
  }

  return state.screeningFolders.find((folder) => folder.id === folderId) || null;
}

function getScreeningApplicant(folder, applicantId) {
  return folder?.applicants.find((applicant) => applicant.id === applicantId) || null;
}

function replaceScreeningFolder(folder) {
  if (getDeletedScreeningFolderIdSet().has(folder?.id)) {
    return null;
  }

  const index = state.screeningFolders.findIndex((item) => item.id === folder.id);
  const nextFolder = normalizeScreeningFolder(touchScreeningFolder(folder));

  if (index >= 0) {
    state.screeningFolders[index] = nextFolder;
  }

  upsertScreeningFolderToSupabase(nextFolder).catch((error) => {
    console.warn("Screening folder remote save failed.", error);
  });

  return nextFolder;
}

async function deleteScreeningFolder(folderId) {
  const folder = getScreeningFolder(folderId);

  if (!folder || !canManageScreeningFolder(folder)) {
    showToast("현재 권한으로 삭제할 수 없는 포지션입니다.");
    return;
  }

  const applicantCount = folder.applicants?.length || 0;
  const message = applicantCount
    ? `${folder.title} 포지션과 등록된 지원자 ${applicantCount}명을 삭제할까요? 삭제 후에는 복구할 수 없습니다.`
    : `${folder.title} 포지션을 삭제할까요? 삭제 후에는 복구할 수 없습니다.`;

  if (!window.confirm(message)) {
    return;
  }

  rememberDeletedScreeningFolderId(folder.id);
  state.screeningFolders = state.screeningFolders.filter((item) => item.id !== folder.id);

  if (state.selectedScreeningFolderId === folder.id) {
    state.selectedScreeningFolderId = getAccessibleScreeningFolders(getCurrentMember(), { applyFilters: false })[0]?.id || "";
    state.screeningPage = "list";
    state.screeningApplicantModalOpen = false;
    state.screeningEditingApplicantId = "";
    state.screeningJdModalOpen = false;
    state.screeningAccessModalOpen = false;
    state.screeningApplicantDetailId = "";
    state.screeningResultPanelOpen = false;
  }

  addAuditLog("Screening 포지션 삭제", folder.title, `${folder.businessUnit || "사업부 미입력"} · 지원자 ${applicantCount}명`);
  persistState();
  renderScreening();

  try {
    const results = await Promise.allSettled([
      deleteScreeningFolderFromSupabase(folder.id),
      syncScreeningDeletedFoldersToSupabase()
    ]);
    const failed = results.find((result) => result.status === "rejected");

    if (failed) {
      throw failed.reason;
    }
    showToast(`${folder.title} 포지션을 삭제했습니다.`);
  } catch (error) {
    console.warn("Screening folder remote delete failed.", error);
    showToast("포지션은 화면에서 삭제됐지만 원격 DB 삭제 확인에 실패했습니다.");
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

function getScreeningJdAnalysisText(folder) {
  return normalizeResumeText([
    folder.title,
    folder.businessUnit,
    folder.department,
    folder.positionName,
    folder.jdText
  ].filter(Boolean).join("\n"));
}

function getScreeningApplicantResumeText(applicant) {
  const educationText = (applicant.education || [])
    .map(formatJobFitEducationSummaryLine)
    .filter(Boolean)
    .join("\n");
  const careerText = (applicant.career || [])
    .map(formatJobFitCareerSummaryLine)
    .filter(Boolean)
    .join("\n");

  return normalizeResumeText([
    applicant.resumeAttachment?.text,
    applicant.name ? `이름: ${applicant.name}` : "",
    applicant.company ? `현재/최근 회사: ${applicant.company}` : "",
    applicant.currentRole ? `현재/최근 직무: ${applicant.currentRole}` : "",
    educationText ? `등록 학력:\n${educationText}` : "",
    careerText ? `등록 경력:\n${careerText}` : "",
    applicant.summary
  ].filter(Boolean).join("\n"));
}

function getScreeningApplicantJobFitResume(applicant) {
  const resumeAttachment = applicant.resumeAttachment || {};

  return normalizeJobFitResume({
    id: applicant.id,
    fileName: resumeAttachment.name || `${applicant.name || "지원자"}_screening_resume.txt`,
    size: resumeAttachment.size || 0,
    type: resumeAttachment.type || "text/plain",
    dataUrl: resumeAttachment.dataUrl || "",
    text: getScreeningApplicantResumeText(applicant),
    candidateName: applicant.name
  });
}

function applyScreeningFitResult(applicant, result) {
  const resultEducation = (Array.isArray(result.education) ? result.education : Array.isArray(result.fitEducation) ? result.fitEducation : []).filter(hasAnyRecordValue);
  const resultCareer = (Array.isArray(result.career) ? result.career : Array.isArray(result.fitCareer) ? result.fitCareer : []).filter(hasAnyRecordValue);
  const normalized = normalizeJobFitResult({
    ...result,
    candidateName: getBestJobFitCandidateName(result.candidateName, applicant.name, result.fileName),
    education: resultEducation.length ? resultEducation : applicant.fitEducation || applicant.education || [],
    career: resultCareer.length ? resultCareer : applicant.fitCareer || applicant.career || []
  });

  applicant.fitGrade = normalized.grade;
  applicant.fitScore = normalized.score;
  applicant.fitComment = normalized.comment;
  applicant.fitFulfilledDetails = normalized.fulfilledDetails;
  applicant.fitMissingDetails = normalized.missingDetails;
  applicant.fitEducation = normalized.education;
  applicant.fitCareer = normalized.career;

  return normalized;
}

function evaluateApplicantFit(folder, applicant) {
  const jdText = getScreeningJdAnalysisText(folder);
  const resume = getScreeningApplicantJobFitResume(applicant);

  if (!jdText || !resume.text) {
    const fallback = {
      resumeId: applicant.id,
      candidateName: applicant.name,
      fileName: resume.fileName,
      score: 50,
      grade: "C",
      fulfilledDetails: [],
      missingDetails: [],
      education: resume.education || [],
      career: resume.career || [],
      comment: "JD 또는 지원자 이력서 정보가 부족하여 직무 요구사항과의 세부 적합도를 안정적으로 판단하기 어렵습니다."
    };

    return applyScreeningFitResult(applicant, fallback);
  }

  return applyScreeningFitResult(applicant, evaluateJobFitResume(jdText, resume));
}

async function refreshScreeningApplicantFit(folder, applicant) {
  const jdText = getScreeningJdAnalysisText(folder);
  const resume = getScreeningApplicantJobFitResume(applicant);

  if (!jdText || !resume.text) {
    return evaluateApplicantFit(folder, applicant);
  }

  const localResult = evaluateApplicantFit(folder, applicant);

  try {
    const [serverResult] = await analyzeJobFitWithServer(jdText, [resume]);

    if (serverResult) {
      return applyScreeningFitResult(applicant, serverResult);
    }
  } catch (error) {
    console.warn("Screening job fit API fallback used.", error);
  }

  return localResult;
}

function ensureScreeningFitSnapshot(folder) {
  if (!folder) {
    return false;
  }

  let changed = false;

  folder.applicants.forEach((applicant) => {
    if (!applicant.fitScore || !applicant.fitFulfilledDetails?.length && !applicant.fitMissingDetails?.length) {
      evaluateApplicantFit(folder, applicant);
      changed = true;
    }
  });

  return changed;
}

function getScreeningStageDisplayLabel(stageOrApplicant) {
  const applicant = typeof stageOrApplicant === "object" ? stageOrApplicant : null;
  const stage = applicant?.stage || stageOrApplicant;

  if (["first_reject", "second_reject"].includes(stage)) {
    return "서류 탈락";
  }

  if (stage === "registered" && applicant?.submittedAt) {
    return "서류 스크리닝(평가) 진행 중";
  }

  if (stage === "first_pass") {
    return "서류 스크리닝(평가) 진행 중";
  }

  if (["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(stage)) {
    return "서류 스크리닝(평가) 통과";
  }

  return SCREENING_STAGE_LABELS[stage] || stage;
}

function screeningStageChip(stageOrApplicant) {
  const stage = typeof stageOrApplicant === "object" ? stageOrApplicant.stage : stageOrApplicant;
  const chipClass = {
    reception: "chip-amber",
    registered: "chip-blue",
    first_draft: "chip-amber",
    first_pass: "chip-blue",
    first_reject: "chip-red",
    second_draft: "chip-amber",
    second_pass: "chip-green",
    second_reject: "chip-red",
    contact_requested: "chip-amber",
    contact_ready: "chip-violet",
    interview_mail_sent: "chip-blue"
  }[stage] || "chip-blue";

  return `<span class="status-chip ${chipClass}">${escapeHtml(getScreeningStageDisplayLabel(stageOrApplicant))}</span>`;
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
                <label for="screening-folder-title">포지션명</label>
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
                <label for="screening-folder-position">직무</label>
                <select class="control-select" id="screening-folder-position" name="positionName">
                  ${renderScreeningJobCategoryOptions()}
                </select>
              </div>
              <div class="field full">
                <label for="screening-folder-jd">JD 직접 입력</label>
                <textarea class="control-textarea" id="screening-folder-jd" name="jdText" rows="5"></textarea>
              </div>
              <div class="field full">
                <label for="screening-folder-jd-file">JD 첨부</label>
                <input class="control-input" id="screening-folder-jd-file" name="jdFile" type="file" />
                <span class="form-help" id="screening-folder-jd-file-status">JD 파일을 첨부하면 텍스트를 추출해 직접 입력란에 반영합니다.</span>
              </div>
              <div class="field full">
                <label>기본 접근 회원</label>
                ${renderScreeningAccessPicker(null, {
                  helpText: "채용 담당자, 운영진 등 포지션 전반을 함께 볼 회원을 추가합니다."
                })}
              </div>
              <div class="field full">
                <label>지원자 등록 권한</label>
                ${renderScreeningAccessPicker(null, {
                  fieldName: "receptionMemberIds",
                  roleFilter: "search_firm",
                  placeholder: "서치펌 담당자 이름, 이메일 검색",
                  helpText: "서치펌 담당자만 추가할 수 있으며, 이 회원은 지원자를 1차 스크리닝에 바로 등록할 수 있습니다."
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
        const canDelete = canManageScreeningFolder(folder);

        return `
          <div class="screening-folder-row ${active ? "is-active" : ""}">
            <button class="screening-folder-card ${active ? "is-active" : ""}" type="button" data-select-screening-folder="${escapeHtml(folder.id)}">
              <strong>${escapeHtml(folder.title)}</strong>
              <span>${escapeHtml(folder.department || "채용 부서 미입력")} · ${escapeHtml(folder.positionName || "포지션 미입력")}</span>
              <small>${escapeHtml(folder.businessUnit || "사업부 미입력")} · 담당자 ${escapeHtml(getScreeningFolderCreatorName(folder))}</small>
              <small>지원자 ${visibleApplicants.length}명 · 2차 통과 ${passed}명</small>
            </button>
            ${canDelete ? `<button class="ghost-button danger-button compact-button screening-folder-delete" type="button" data-delete-screening-folder="${escapeHtml(folder.id)}">삭제</button>` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function screeningJdSummary(folder) {
  const text = getScreeningJdAnalysisText(folder);

  if (text) {
    const requirements = extractJobFitRequirements(text)
      .map((item) => item.replace(/[.。!?！？]+$/, "").trim())
      .filter(Boolean)
      .slice(0, 3);
    const roleName = folder?.positionName || folder?.title || "해당 포지션";

    if (requirements.length) {
      return `${roleName}은 ${requirements.join(", ")} 역량을 바탕으로 채용 부서의 핵심 업무를 수행할 인재를 찾는 포지션입니다.`;
    }

    return `${roleName}은 입력된 JD를 기준으로 직무 수행 경험과 조직 적합성을 함께 검토하는 포지션입니다.`;
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
                <label for="screening-jd-title">포지션명</label>
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
                <label for="screening-jd-position">직무</label>
                <select class="control-select" id="screening-jd-position" name="positionName">
                  ${renderScreeningJobCategoryOptions(folder.positionName)}
                </select>
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
                <span class="form-help" id="screening-jd-file-status">JD 파일을 첨부하면 텍스트를 추출해 직접 입력란에 반영합니다.</span>
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
              <strong>지원자 등록 권한</strong>
              <span>서치펌 담당자만 지정합니다. 지정된 회원은 지원자를 1차 스크리닝에 바로 등록하고 본인 등록 건의 진행 현황을 확인할 수 있습니다.</span>
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

  const editingApplicant = state.screeningEditingApplicantId
    ? getScreeningApplicant(folder, state.screeningEditingApplicantId)
    : null;
  const isEditing = Boolean(editingApplicant);
  const currentMember = getCurrentMember();
  const searchFirmMember = isSearchFirmRole(currentMember);
  const coreEditable = isEditing
    ? canEditScreeningApplicantCore(folder, editingApplicant, currentMember)
    : canRegisterScreeningApplicant(folder, currentMember);
  const contactEditable = isEditing
    ? canEditScreeningApplicantContact(folder, editingApplicant, currentMember)
    : true;

  if (isEditing && !canEditScreeningApplicant(folder, editingApplicant, currentMember)) {
    return "";
  }

  const sourceType = editingApplicant?.sourceType || (searchFirmMember ? "search_firm" : "direct");
  const selectedFirmId = editingApplicant?.searchFirmMemberId || (searchFirmMember ? currentMember?.id || "" : "");
  const coreDisabled = isEditing && !coreEditable;
  const coreDisabledAttr = coreDisabled ? "disabled" : "";
  const contactDisabledAttr = contactEditable ? "" : "disabled";
  const modalTitle = isEditing ? "지원자 정보 수정" : "지원자 등록";
  const modalDescription = isEditing
    ? coreDisabled
      ? "스크리닝 단계로 이동한 지원자는 이메일과 휴대폰 번호만 수정할 수 있습니다."
      : "1차 스크리닝에 등록된 지원자 정보를 수정할 수 있습니다."
    : searchFirmMember
      ? "등록하면 바로 1차 스크리닝에 표시되며 직무적합도 분석 결과를 확인할 수 있습니다."
      : `${escapeHtml(folder.title)} 포지션에 지원자 정보를 등록합니다.`;
  const educationRecords = editingApplicant?.education?.length ? editingApplicant.education : [{}];
  const careerRecords = editingApplicant?.career?.length ? editingApplicant.career : [{}];
  const otherAttachments = Array.isArray(editingApplicant?.attachments) ? editingApplicant.attachments : [];

  return `
    <div class="trending-modal-backdrop" data-screening-applicant-modal-backdrop>
      <section class="trending-modal screening-applicant-modal" role="dialog" aria-modal="true" aria-labelledby="screening-applicant-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-applicant-modal-title">${escapeHtml(modalTitle)}</strong>
            <span>${modalDescription}</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-applicant-modal>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form id="screening-applicant-form" class="screening-applicant-form">
            <div class="field-grid">
              <input type="hidden" name="folderId" value="${escapeHtml(folder.id)}" />
              <input type="hidden" name="applicantId" value="${escapeHtml(editingApplicant?.id || "")}" />
              <div class="field">
                <label for="screening-applicant-name">이름</label>
                <input class="control-input" id="screening-applicant-name" name="name" value="${inputValue(editingApplicant?.name || "")}" ${coreDisabledAttr} />
              </div>
              <div class="field">
                <label for="screening-applicant-source">등록 경로</label>
                ${searchFirmMember
                  ? `<input type="hidden" name="sourceType" value="search_firm" /><input class="control-input" id="screening-applicant-source" value="서치펌 등록" disabled />`
                  : `<select class="control-select" id="screening-applicant-source" name="sourceType" ${coreDisabledAttr}>
                      <option value="direct" ${sourceType === "direct" ? "selected" : ""}>채용담당자 직접</option>
                      <option value="search_firm" ${sourceType === "search_firm" ? "selected" : ""}>서치펌 등록</option>
                    </select>`}
              </div>
              <div class="field">
                <label for="screening-applicant-firm">서치펌 담당자</label>
                ${searchFirmMember
                  ? `<input type="hidden" name="searchFirmMemberId" value="${escapeHtml(selectedFirmId)}" /><input class="control-input" id="screening-applicant-firm" value="${escapeHtml([currentMember?.name, currentMember?.email].filter(Boolean).join(" · "))}" disabled />`
                  : `<select class="control-select" id="screening-applicant-firm" name="searchFirmMemberId" ${coreDisabledAttr}>
                      ${activeSearchFirmOptions(selectedFirmId)}
                    </select>`}
              </div>
              <div class="field">
                <label for="screening-applicant-birth-year">출생년도</label>
                <input class="control-input" id="screening-applicant-birth-year" name="birthYear" type="number" inputmode="numeric" min="1900" max="${getCurrentYear()}" value="${inputValue(editingApplicant?.birthYear || "")}" ${coreDisabledAttr} />
              </div>
              <div class="field">
                <label for="screening-applicant-age">나이</label>
                <input class="control-input" id="screening-applicant-age" name="age" type="text" value="${inputValue(calculateAge(editingApplicant?.birthYear) ? `${calculateAge(editingApplicant?.birthYear)}세` : "")}" readonly />
              </div>
              <div class="field">
                <label for="screening-applicant-nationality">국적</label>
                <input class="control-input" id="screening-applicant-nationality" name="nationality" value="${inputValue(editingApplicant?.nationality || "")}" ${coreDisabledAttr} />
              </div>
              <div class="field">
                <label for="screening-applicant-email">이메일</label>
                <input class="control-input" id="screening-applicant-email" name="email" type="email" value="${inputValue(editingApplicant?.email || "")}" ${contactDisabledAttr} />
              </div>
              <div class="field">
                <label for="screening-applicant-phone">휴대폰 번호</label>
                <input class="control-input" id="screening-applicant-phone" name="phone" type="tel" value="${inputValue(editingApplicant?.phone || "")}" ${contactDisabledAttr} />
              </div>
              <div class="field">
                <label for="screening-applicant-resume">이력서 첨부</label>
                ${editingApplicant?.resumeAttachment ? `
                  <div class="screening-file-preview compact-file-preview">
                    <span>
                      <strong>현재 이력서</strong>
                      <small>${escapeHtml(editingApplicant.resumeAttachment.name)} (${formatFileSize(editingApplicant.resumeAttachment.size)})</small>
                    </span>
                    ${editingApplicant.resumeAttachment.dataUrl ? `<a class="soft-button compact-button" href="${escapeHtml(editingApplicant.resumeAttachment.dataUrl)}" download="${escapeHtml(editingApplicant.resumeAttachment.name)}">다운로드</a>` : ""}
                  </div>
                ` : ""}
                <div class="dropzone compact-upload">
                  <input id="screening-applicant-resume" name="resumeFile" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" ${coreDisabledAttr} />
                  <span id="screening-resume-parse-status" class="form-help">이력서를 업로드하면 이름, 연락처, 학력, 경력 정보를 자동 입력합니다.</span>
                </div>
              </div>
              ${coreDisabled ? `<div class="field full"><span class="form-help strong-help">이미 스크리닝 단계로 이동한 지원자입니다. 이메일과 휴대폰 번호만 수정됩니다.</span></div>` : ""}
            </div>
            <section class="edit-section register-section">
              <div class="edit-section-header">
                <h5>학력 정보</h5>
                <button class="soft-button" type="button" data-add-screening-education ${coreDisabledAttr}>학력 추가</button>
              </div>
              <div class="edit-record-list" id="screening-education-list">
                ${educationRecords.map((item, index) => renderScreeningEducationRecord(item, index, coreDisabledAttr)).join("")}
              </div>
            </section>
            <section class="edit-section register-section">
              <div class="edit-section-header">
                <h5>경력 정보</h5>
                <button class="soft-button" type="button" data-add-screening-career ${coreDisabledAttr}>경력 추가</button>
              </div>
              <div class="edit-record-list" id="screening-career-list">
                ${careerRecords.map((item, index) => renderScreeningCareerRecord(item, index, coreDisabledAttr)).join("")}
              </div>
            </section>
            <section class="edit-section register-section">
              <div class="edit-section-header">
                <h5>기타 첨부파일</h5>
              </div>
              ${otherAttachments.length ? `
                <div class="screening-file-preview compact-file-preview">
                  <span>
                    <strong>등록된 첨부파일</strong>
                    <small>${otherAttachments.map((attachment) => attachment.name).filter(Boolean).join(", ")}</small>
                  </span>
                </div>
              ` : ""}
              <div class="field">
                <label for="screening-applicant-other-attachments">개인정보동의서, 포트폴리오 등</label>
                <div class="dropzone compact-upload">
                  <input id="screening-applicant-other-attachments" name="otherAttachments" type="file" multiple accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png" ${coreDisabledAttr} />
                  <span class="form-help">이력서 외 보관이 필요한 자료를 여러 개 첨부할 수 있습니다.</span>
                </div>
              </div>
            </section>
            <div class="form-actions">
              <button class="ghost-button" type="button" data-close-screening-applicant-modal>취소</button>
              <button class="primary-button" type="submit">${isEditing ? "수정 저장" : "저장"}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `;
}

function renderBulkApplicantRegistrationModal(folder) {
  if (!folder || !state.screeningBulkApplicantModalOpen || !canRegisterScreeningApplicant(folder)) {
    return "";
  }

  const currentMember = getCurrentMember();
  const searchFirmMember = isSearchFirmRole(currentMember);
  const sourceType = searchFirmMember ? "search_firm" : "direct";
  const selectedFirmId = searchFirmMember ? currentMember?.id || "" : "";

  return `
    <div class="trending-modal-backdrop" data-screening-bulk-applicant-backdrop>
      <section class="trending-modal screening-bulk-applicant-modal" role="dialog" aria-modal="true" aria-labelledby="screening-bulk-applicant-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-bulk-applicant-title">지원자 대량 등록</strong>
            <span>여러 이력서를 업로드한 뒤 등록 실행을 누르면 파싱부터 저장까지 자동으로 완료합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-bulk-applicant>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form id="screening-bulk-applicant-form" class="screening-bulk-applicant-form">
            <input type="hidden" name="folderId" value="${escapeHtml(folder.id)}" />
            <div class="field-grid">
              <div class="field">
                <label for="screening-bulk-source">등록 경로</label>
                ${searchFirmMember
                  ? `<input type="hidden" name="sourceType" value="search_firm" /><input class="control-input" id="screening-bulk-source" value="서치펌 등록" disabled />`
                  : `<select class="control-select" id="screening-bulk-source" name="sourceType">
                      <option value="direct" ${sourceType === "direct" ? "selected" : ""}>채용담당자 직접</option>
                      <option value="search_firm">서치펌 등록</option>
                    </select>`}
              </div>
              <div class="field">
                <label for="screening-bulk-firm">서치펌 담당자</label>
                ${searchFirmMember
                  ? `<input type="hidden" name="searchFirmMemberId" value="${escapeHtml(selectedFirmId)}" /><input class="control-input" id="screening-bulk-firm" value="${escapeHtml([currentMember?.name, currentMember?.email].filter(Boolean).join(" · "))}" disabled />`
                  : `<select class="control-select" id="screening-bulk-firm" name="searchFirmMemberId">
                      ${activeSearchFirmOptions(selectedFirmId)}
                    </select>`}
              </div>
            </div>
            <div class="field">
              <label for="screening-bulk-resumes">이력서 파일</label>
              <div class="dropzone compact-upload screening-bulk-upload">
                <input id="screening-bulk-resumes" name="resumeFiles" type="file" multiple accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
                <span id="screening-bulk-status" class="form-help">파일을 여러 개 선택하거나 드래그앤드랍한 뒤 등록 실행을 눌러주세요.</span>
              </div>
            </div>
            <div class="screening-bulk-note">
              <strong>자동 등록 방식</strong>
              <span>각 이력서에서 이름, 연락처, 학력, 경력을 추출해 1차 스크리닝에 바로 저장합니다. 파싱 실패 파일은 건너뛰지 않고 파일명 기반 기본 정보로 등록합니다.</span>
            </div>
            <div class="form-actions">
              <button class="ghost-button" type="button" data-close-screening-bulk-applicant>취소</button>
              <button class="primary-button" type="submit">등록 실행</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `;
}

function screeningFitDetail(folder, applicant) {
  if (!applicant.fitScore && !applicant.fitFulfilledDetails?.length && !applicant.fitMissingDetails?.length) {
    evaluateApplicantFit(folder, applicant);
  }

  return {
    score: applicant.fitScore || 0,
    matched: (applicant.fitFulfilledDetails || []).map((item) => item.title).filter(Boolean),
    missing: (applicant.fitMissingDetails || []).map((item) => item.title).filter(Boolean),
    fulfilledDetails: applicant.fitFulfilledDetails || [],
    missingDetails: applicant.fitMissingDetails || [],
    summary: applicant.fitComment || "분석 의견 없음"
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

function renderScreeningFitAnalysisPanel(applicant, fit) {
  return `
    <section class="screening-detail-block screening-fit-analysis-block">
      <div class="panel-header">
        <h4>직무적합도 상세 분석</h4>
        ${fitGradeChip(applicant.fitGrade)}
      </div>
      <div class="screening-fit-opinion">
        <strong>분석 의견</strong>
        <p>${escapeHtml(fit.summary || "분석 의견 없음")}</p>
      </div>
      <div class="screening-fit-report-grid">
        <section class="job-fit-report-section is-fulfilled">
          <strong>충족된 직무 요건</strong>
          ${renderJobFitReportItems(fit.fulfilledDetails || [], "basis", "충족으로 판단된 항목이 없습니다.")}
        </section>
        <section class="job-fit-report-section is-missing">
          <strong>추가 확인이 필요한 요건</strong>
          ${renderJobFitReportItems(fit.missingDetails || [], "note", "추가 확인이 필요한 항목이 없습니다.")}
        </section>
      </div>
    </section>
  `;
}

function renderScreeningApplicantDetailModal(folder) {
  if (!folder || !state.screeningApplicantDetailId) {
    return "";
  }

  const applicant = getScreeningApplicant(folder, state.screeningApplicantDetailId);

  if (!applicant || !canViewScreeningApplicant(applicant)) {
    return "";
  }

  const fit = screeningFitDetail(folder, applicant);
  const showFit = applicant.stage !== "reception";
  const canDownloadResume = state.screeningDetailStep === "first" && applicant.resumeAttachment?.dataUrl;

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
          <div class="screening-detail-two-column ${showFit ? "has-fit" : ""}">
            <section class="screening-detail-block screening-resume-block">
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
                  ${canDownloadResume ? `<a class="soft-button compact-button screening-resume-download-button" href="${escapeHtml(applicant.resumeAttachment.dataUrl)}" download="${escapeHtml(applicant.resumeAttachment.name || "resume")}">다운로드</a>` : ""}
                </div>
                ${renderResumeInlineViewer(applicant.resumeAttachment, applicant)}
              ` : `<div class="empty-state compact-empty">등록된 이력서 첨부 파일이 없습니다.</div>`}
            </section>

            ${showFit ? renderScreeningFitAnalysisPanel(applicant, fit) : ""}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderApplicantContactForm(folder, applicant, locked = false) {
  const canEdit = canManageScreeningContact(folder, applicant);

  if (!canEdit && !["second_pass", "contact_requested", "contact_ready"].includes(applicant.stage) && !(applicant.sourceType === "search_firm" && applicant.stage === "interview_mail_sent")) {
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
    first_draft: "1차 합격 예정 취소",
    first_pass: "1차로 되돌리기",
    first_reject: "1차 재검토",
    second_draft: "2차 합격 예정 취소",
    second_reject: "2차 재검토",
    second_pass: "2차로 되돌리기",
    contact_requested: "2차로 되돌리기",
    contact_ready: "2차로 되돌리기",
    interview_mail_sent: "2차로 되돌리기"
  }[applicant.stage];

  if (locked) {
    const lockedActions = [`<span class="muted-text">${escapeHtml(getScreeningStageDisplayLabel(applicant))} · 잠금</span>`];
    if (canEditScreeningApplicantContact(folder, applicant)) {
      lockedActions.push(`<button class="ghost-button compact-button" type="button" data-edit-screening-applicant="${escapeHtml(applicant.id)}">연락처 수정</button>`);
    }
    return `<div class="member-actions">${lockedActions.join("")}</div>`;
  }

  if (canEditScreeningApplicantCore(folder, applicant)) {
    actions.push(`<button class="ghost-button compact-button" type="button" data-edit-screening-applicant="${escapeHtml(applicant.id)}">정보 수정</button>`);
  } else if (canEditScreeningApplicantContact(folder, applicant)) {
    actions.push(`<button class="ghost-button compact-button" type="button" data-edit-screening-applicant="${escapeHtml(applicant.id)}">연락처 수정</button>`);
  }

  if (canDeleteScreeningApplicant(folder, applicant)) {
    actions.push(`<button class="ghost-button danger-button compact-button" type="button" data-delete-screening-applicant="${escapeHtml(applicant.id)}">삭제</button>`);
  }

  if (applicant.stage === "registered" && canRunFirstScreening(folder)) {
    actions.push(`<button class="soft-button compact-button" type="button" data-screening-first-pass="${applicant.id}">1차 합격</button>`);
    actions.push(`<button class="ghost-button danger-button compact-button" type="button" data-screening-first-reject="${applicant.id}">1차 불합격</button>`);
  }

  if (applicant.stage === "first_pass" && canRunSecondScreening(folder)) {
    actions.push(`<button class="soft-button compact-button" type="button" data-screening-second-draft="${applicant.id}">2차 합격</button>`);
    actions.push(`<button class="ghost-button danger-button compact-button" type="button" data-screening-second-reject="${applicant.id}">2차 불합격</button>`);
  }

  if (applicant.stage === "contact_requested" && applicant.contactRequest) {
    actions.push(`<button class="soft-button compact-button" type="button" disabled>연락처 요청 완료</button>`);
  } else if (applicant.stage === "second_pass" && applicant.sourceType === "search_firm" && (!applicant.email || !applicant.phone)) {
    actions.push(`<button class="soft-button compact-button" type="button" data-screening-request-contact="${applicant.id}">서치펌 연락처 요청</button>`);
  }

  if (applicant.stage === "interview_mail_sent" && applicant.phoneInterviewMail) {
    actions.push(`<button class="primary-button compact-button" type="button" disabled>전화면접 안내 발송 완료</button>`);
  } else if (["second_pass", "contact_ready"].includes(applicant.stage) && applicant.email && applicant.phone && isRecruitingRole()) {
    actions.push(`<button class="primary-button compact-button" type="button" data-screening-send-interview="${applicant.id}">전화면접 안내 발송</button>`);
  }

  if (revertAction && canAccessScreeningFolder(folder) && (isRecruitingRole() || isHiringManagerRole())) {
    actions.push(`<button class="ghost-button compact-button" type="button" data-screening-revert="${applicant.id}">${revertAction}</button>`);
  }

  if (!actions.length && isSearchFirmRole() && applicant.sourceType === "search_firm" && applicant.stage !== "reception") {
    return `<span class="muted-text">등록 완료 · ${escapeHtml(getScreeningStageDisplayLabel(applicant))}</span>`;
  }

  if (!actions.length) {
    return `<span class="muted-text">대기</span>`;
  }

  return `<div class="member-actions">${actions.join("")}</div>`;
}

function getScreeningStepApplicants(folder, step = state.screeningDetailStep) {
  const stageMap = {
    first: ["registered", "first_draft", "first_pass", "first_reject", "second_draft", "second_pass", "second_reject", "contact_requested", "contact_ready", "interview_mail_sent"],
    second: ["first_pass", "second_draft", "second_pass", "second_reject", "contact_requested", "contact_ready", "interview_mail_sent"],
    mail: ["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"]
  };
  const stages = stageMap[step] || stageMap.first;

  return folder.applicants.filter((applicant) => {
    if (!canViewScreeningApplicant(applicant)) {
      return false;
    }

    return stages.includes(applicant.stage);
  });
}

function screeningStepCount(folder, step) {
  return getScreeningStepApplicants(folder, step).length;
}

function getScreeningDecisionCounts(folder, step) {
  const applicants = (folder?.applicants || []).filter((applicant) => canViewScreeningApplicant(applicant));

  if (step === "first") {
    return {
      passed: applicants.filter((applicant) => [
        "first_pass",
        "second_draft",
        "second_pass",
        "second_reject",
        "contact_requested",
        "contact_ready",
        "interview_mail_sent"
      ].includes(applicant.stage)).length,
      rejected: applicants.filter((applicant) => applicant.stage === "first_reject").length
    };
  }

  if (step === "second") {
    return {
      passed: applicants.filter((applicant) => [
        "second_pass",
        "contact_requested",
        "contact_ready",
        "interview_mail_sent"
      ].includes(applicant.stage)).length,
      rejected: applicants.filter((applicant) => applicant.stage === "second_reject").length
    };
  }

  return { passed: 0, rejected: 0 };
}

function renderScreeningStepDecisionMeta(folder, step) {
  if (!["first", "second"].includes(step)) {
    return "";
  }

  const counts = getScreeningDecisionCounts(folder, step);
  return `<small>합격 ${counts.passed}명 · 불합격 ${counts.rejected}명</small>`;
}

function getScreeningStepRank(step) {
  return {
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

  if (["registered", "first_draft", "first_reject"].includes(applicant.stage)) {
    return "first";
  }

  return "first";
}

function isScreeningStageSnapshotLocked(applicant, step) {
  return getScreeningStepRank(getScreeningApplicantActiveStep(applicant)) > getScreeningStepRank(step);
}

function getScreeningStageSnapshotNote(applicant, step) {
  if (!isScreeningStageSnapshotLocked(applicant, step)) {
    return "";
  }

  if (step === "reception" && applicant.stage === "registered") {
    return "서류 스크리닝(평가) 진행 중";
  }

  if (step === "reception" && ["first_reject", "second_reject"].includes(applicant.stage)) {
    return "서류 탈락";
  }

  return `현재 상태: ${getScreeningStageDisplayLabel(applicant)}`;
}

function getVisibleScreeningDetailSteps(folder, member = getCurrentMember()) {
  return SCREENING_DETAIL_STEPS.filter((step) => canAccessScreeningStep(folder, step.id, member));
}

function getCurrentScreeningDetailStep(folder) {
  const visibleSteps = getVisibleScreeningDetailSteps(folder);
  const currentStep = visibleSteps.some((step) => step.id === state.screeningDetailStep)
    ? state.screeningDetailStep
    : visibleSteps[0]?.id || "first";

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
          ${renderScreeningStepDecisionMeta(folder, step.id)}
        </button>
      `).join("")}
    </nav>
  `;
}

function getScreeningApplicantCardClass(applicant) {
  if (["first_reject", "second_reject"].includes(applicant.stage)) {
    return "is-rejected";
  }

  if (["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(applicant.stage)) {
    return "is-passed";
  }

  if (["first_draft", "second_draft"].includes(applicant.stage)) {
    return "is-draft";
  }

  if (["registered", "first_pass"].includes(applicant.stage)) {
    return "is-reviewing";
  }

  return "";
}

function getScreeningOpinionValue(applicant, step) {
  if (step === "first") return applicant.firstOpinion || "";
  if (step === "second") return applicant.secondOpinion || "";
  return applicant.receptionOpinion || "";
}

function canEditScreeningOpinion(folder, step, applicant, member = getCurrentMember()) {
  if (!folder || !applicant || !canAccessScreeningStep(folder, step, member)) {
    return false;
  }

  if (step === "first") {
    return canRunFirstScreening(folder, member);
  }

  if (step === "second") {
    return canRunSecondScreening(folder, member);
  }

  return canAccessScreeningStep(folder, "reception", member);
}

function renderScreeningOpinionField(folder, applicant, step, options = {}) {
  if (!["reception", "first", "second"].includes(step)) {
    return "";
  }

  const canEdit = canEditScreeningOpinion(folder, step, applicant);
  const label = {
    reception: "접수 평가의견",
    first: "1차 평가의견",
    second: "2차 평가의견"
  }[step] || "평가의견";
  const fieldLabel = options.label || label;
  const rows = options.rows || 3;
  const extraClass = options.className || "";

  return `
    <div class="screening-card-field screening-opinion-field ${escapeHtml(extraClass)}">
      <span>${escapeHtml(fieldLabel)}</span>
      <textarea
        class="control-textarea compact-textarea"
        rows="${rows}"
        data-screening-opinion-applicant="${escapeHtml(applicant.id)}"
        data-screening-opinion-stage="${escapeHtml(step)}"
        placeholder="담당자 검토 의견을 입력하세요."
        ${canEdit ? "" : "disabled"}>${escapeHtml(getScreeningOpinionValue(applicant, step))}</textarea>
    </div>
  `;
}

function renderScreeningFitCriteria(folder) {
  const requirements = extractJobFitRequirements(getScreeningJdAnalysisText(folder)).slice(0, 8);

  if (!requirements.length) {
    return "";
  }

  return `
    <section class="profile-panel screening-fit-criteria-panel">
      <div class="panel-header">
        <h4>적합도 기준</h4>
        <span class="small-pill">JD 기반 ${requirements.length}개 항목</span>
      </div>
      <div class="screening-fit-criteria-list">
        ${requirements.map((requirement) => `<span>${escapeHtml(requirement)}</span>`).join("")}
      </div>
    </section>
  `;
}

function getScreeningApplicantEducationLines(applicant) {
  return (applicant.education || [])
    .map(formatJobFitEducationSummaryLine)
    .filter(Boolean)
    .slice(0, 3);
}

function getScreeningApplicantCareerLines(applicant) {
  return (applicant.career || [])
    .map(formatJobFitCareerSummaryLine)
    .filter(Boolean)
    .slice(0, 3);
}

function renderScreeningApplicantProfileSummary(applicant) {
  const educationLines = getScreeningApplicantEducationLines(applicant);
  const careerLines = getScreeningApplicantCareerLines(applicant);

  if (!educationLines.length && !careerLines.length) {
    return `
      <div class="screening-applicant-profile-summary is-empty">
        <span>학력/경력 정보가 아직 입력되지 않았습니다.</span>
      </div>
    `;
  }

  return `
    <div class="screening-applicant-profile-summary">
      <section>
        <strong>학력</strong>
        ${educationLines.length
          ? educationLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")
          : `<span class="muted-text">학력 정보 없음</span>`}
      </section>
      <section>
        <strong>경력</strong>
        ${careerLines.length
          ? careerLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")
          : `<span class="muted-text">경력 정보 없음</span>`}
      </section>
    </div>
  `;
}

function renderScreeningCompactLines(lines, emptyText = "정보 없음") {
  const normalizedLines = (lines || []).map((line) => String(line || "").trim()).filter(Boolean);

  if (!normalizedLines.length) {
    return `<p class="screening-structured-empty">${escapeHtml(emptyText)}</p>`;
  }

  return normalizedLines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function formatScreeningBirthAge(applicant) {
  const birthYear = String(applicant.birthYear || applicant.birth_year || "").trim();
  const age = applicant.age || calculateAge(birthYear);
  const parts = [];

  if (birthYear) {
    parts.push(`${birthYear}년생`);
  }

  if (age) {
    parts.push(`${age}세`);
  }

  return parts.join(", ") || "출생년도, 나이";
}

function renderScreeningApplicantSpecialBox(folder, applicant, step) {
  if (step === "reception") {
    return renderScreeningOpinionField(folder, applicant, "reception", {
      label: "특이사항",
      rows: 4,
      className: "screening-structured-special-input"
    });
  }

  const specialText = [applicant.summary, applicant.receptionOpinion]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join("\n");

  return `
    <div class="screening-structured-special">
      <strong>특이사항</strong>
      <div class="screening-structured-special-box">
        ${specialText
          ? splitNonEmptyLines(specialText).map((line) => `<p>${escapeHtml(line)}</p>`).join("")
          : `<p class="screening-structured-empty">특이사항 없음</p>`}
      </div>
    </div>
  `;
}

function renderScreeningStructuredFitPanel(folder, applicant) {
  const fit = screeningFitDetail(folder, applicant);

  return `
    <section class="screening-structured-fit">
      <div class="screening-structured-fit-title">
        <strong>직무적합도 분석</strong>
        ${fitGradeChip(applicant.fitGrade)}
      </div>
      <p>${escapeHtml(fit.summary || applicant.fitComment || "분석 의견 없음")}</p>
    </section>
  `;
}

function renderScreeningStructuredApplicantCard(folder, applicant, step) {
  const firm = applicant.searchFirmMemberId ? state.members.find((member) => member.id === applicant.searchFirmMemberId) : null;
  const sourceLabel = applicant.sourceType === "search_firm" ? "서치펌" : "직접 등록";
  const sourceMeta = firm ? `${firm.name} · ${firm.email}` : applicant.registeredByName || "-";
  const educationLines = getScreeningApplicantEducationLines(applicant);
  const careerLines = getScreeningApplicantCareerLines(applicant);
  const locked = isScreeningStageSnapshotLocked(applicant, step);
  const cardClass = [locked ? "is-locked" : "", getScreeningApplicantCardClass(applicant)].filter(Boolean).join(" ");
  const showReviewArea = step !== "reception";
  const opinionStage = step === "second" ? "second" : step === "first" ? "first" : "";
  const lockedNote = getScreeningStageSnapshotNote(applicant, step);

  return `
    <article class="screening-applicant-card screening-structured-card ${cardClass}">
      <div class="screening-structured-top">
        <div class="screening-structured-identity">
          <button class="screening-applicant-name-button screening-structured-name" type="button" data-open-screening-applicant-detail="${escapeHtml(applicant.id)}">${escapeHtml(applicant.name || "-")}</button>
          <span>${escapeHtml(formatScreeningBirthAge(applicant))}</span>
          ${lockedNote ? `<em class="screening-lock-note">${escapeHtml(lockedNote)}</em>` : ""}
        </div>
        <div class="screening-structured-status">
          ${screeningStageChip(applicant)}
          <span>등록 경로 : ${escapeHtml(sourceLabel)} (${escapeHtml(sourceMeta)})</span>
          <span>최초 등록일 : ${escapeHtml(applicant.createdAt || getTodayDate())}</span>
        </div>
      </div>

      <div class="screening-structured-info-grid">
        <section>
          <h5>학력</h5>
          ${renderScreeningCompactLines(educationLines, "학력 정보 없음")}
        </section>
        <section>
          <h5>경력</h5>
          ${renderScreeningCompactLines(careerLines, "경력 정보 없음")}
        </section>
        <section>
          <h5>연락처</h5>
          <p>이메일 : ${escapeHtml(applicant.email || "-")}</p>
          <p>전화번호 : ${escapeHtml(applicant.phone || "-")}</p>
        </section>
      </div>

      ${renderScreeningApplicantSpecialBox(folder, applicant, step)}

      ${showReviewArea ? `
        <div class="screening-structured-review-row">
          ${renderScreeningStructuredFitPanel(folder, applicant)}
          <aside class="screening-structured-actions">
            <strong>액션</strong>
            ${renderApplicantActions(folder, applicant, step)}
          </aside>
        </div>
        ${opinionStage ? renderScreeningOpinionField(folder, applicant, opinionStage, {
          label: "평가의견",
          rows: 4,
          className: "screening-structured-opinion"
        }) : ""}
      ` : `
        <div class="screening-structured-bottom-actions">
          ${renderApplicantActions(folder, applicant, step)}
        </div>
      `}
    </article>
  `;
}

function renderApplicantCard(folder, applicant, step = state.screeningDetailStep) {
  return renderScreeningStructuredApplicantCard(folder, applicant, step);

  if (step === "reception" || step === "first") {
    return renderScreeningStructuredApplicantCard(folder, applicant, step);
  }

  const firm = applicant.searchFirmMemberId ? state.members.find((member) => member.id === applicant.searchFirmMemberId) : null;
  const sourceLabel = applicant.sourceType === "search_firm" ? "서치펌" : "직접 등록";
  const sourceMeta = firm ? `${firm.name} · ${firm.email}` : applicant.registeredByName || "-";
  const locked = isScreeningStageSnapshotLocked(applicant, step);
  const lockedNote = getScreeningStageSnapshotNote(applicant, step);
  const showFit = step !== "reception" && applicant.stage !== "reception";
  const cardClass = [locked ? "is-locked" : "", getScreeningApplicantCardClass(applicant)].filter(Boolean).join(" ");

  return `
    <article class="screening-applicant-card ${cardClass}">
      <div class="screening-applicant-main">
        <div class="summary-cell">
          <button class="screening-applicant-name-button" type="button" data-open-screening-applicant-detail="${escapeHtml(applicant.id)}">${escapeHtml(applicant.name || "-")}</button>
          <span>${escapeHtml([applicant.company, applicant.currentRole].filter(Boolean).join(" · ") || "회사/직무 미입력")}</span>
          ${applicant.resumeAttachment ? `<span>첨부: ${escapeHtml(applicant.resumeAttachment.name)} (${formatFileSize(applicant.resumeAttachment.size)})</span>` : ""}
          ${lockedNote ? `<span class="screening-lock-note">${escapeHtml(lockedNote)}</span>` : ""}
        </div>
        <div class="screening-card-tags">
          ${showFit ? fitGradeChip(applicant.fitGrade) : ""}
          ${screeningStageChip(applicant)}
        </div>
      </div>
      ${renderScreeningApplicantProfileSummary(applicant)}
      <div class="screening-applicant-grid">
        <div class="summary-cell">
          <span>등록 경로</span>
          <strong>${escapeHtml(sourceLabel)}</strong>
          <small>${escapeHtml(sourceMeta)}</small>
        </div>
        ${showFit ? `<div class="summary-cell">
          <span>직무적합도 분석</span>
          <strong>${escapeHtml(applicant.fitComment || "분석 의견 없음")}</strong>
        </div>` : ""}
        <div class="screening-card-field">
          <span>연락처</span>
          ${renderApplicantContactForm(folder, applicant, false)}
        </div>
        <div class="screening-card-field">
          <span>액션</span>
          ${renderApplicantActions(folder, applicant, step)}
        </div>
        ${renderScreeningOpinionField(folder, applicant, step)}
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

function formatScreeningAvailabilitySlot(slot) {
  const value = String(slot || "").trim();

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function buildScreeningAvailabilityText(slots = [], fallback = "") {
  const slotLines = slots
    .map(formatScreeningAvailabilitySlot)
    .filter(Boolean)
    .map((slot) => `- ${slot}`);

  return slotLines.length ? slotLines.join("\n") : String(fallback || "").trim();
}

const SCREENING_TIMELINE_HOURS = Array.from({ length: 13 }, (_, index) => index + 8);

function normalizeScreeningTimelineDate(value = "") {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : getTodayDate();
}

function normalizeScreeningTimelineHour(value, fallback) {
  const hour = Number(value);
  return Number.isFinite(hour)
    ? Math.max(8, Math.min(20, Math.round(hour)))
    : fallback;
}

function getScreeningTimelineState(folder = {}) {
  const panel = folder.interviewPanel || {};
  const date = normalizeScreeningTimelineDate(panel.timelineDate);
  const startHour = normalizeScreeningTimelineHour(panel.timelineStartHour, 10);
  const endHour = Math.max(startHour + 1, normalizeScreeningTimelineHour(panel.timelineEndHour, 14));

  return {
    date,
    startHour: Math.min(startHour, 19),
    endHour: Math.min(endHour, 20)
  };
}

function formatScreeningTimelineRange(dateValue, startHour, endHour) {
  const date = new Date(`${normalizeScreeningTimelineDate(dateValue)}T00:00:00`);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = weekdays[date.getDay()] || "";
  const start = String(normalizeScreeningTimelineHour(startHour, 10)).padStart(2, "0");
  const end = String(Math.max(Number(startHour) + 1, normalizeScreeningTimelineHour(endHour, 14))).padStart(2, "0");

  return `${year}.${month}.${day}(${weekday}) ${start}:00~${end}:00`;
}

function renderScreeningAvailabilityTimeline(folder) {
  const timeline = getScreeningTimelineState(folder);
  const previewText = formatScreeningTimelineRange(timeline.date, timeline.startHour, timeline.endHour);

  return `
    <div class="screening-timeline-picker" data-screening-timeline-picker>
      <label class="field compact-field">
        <span>면접 날짜</span>
        <input class="control-input" type="date" name="timelineDate" value="${inputValue(timeline.date)}" data-screening-timeline-date />
      </label>
      <input type="hidden" name="timelineStartHour" value="${escapeHtml(timeline.startHour)}" data-screening-timeline-start />
      <input type="hidden" name="timelineEndHour" value="${escapeHtml(timeline.endHour)}" data-screening-timeline-end />
      <div class="screening-time-range" data-screening-time-range aria-label="면접 가능 시간대 드래그 선택">
        ${SCREENING_TIMELINE_HOURS.map((hour) => {
          const selected = hour >= timeline.startHour && hour < timeline.endHour;
          return `<button class="screening-time-cell ${selected ? "is-selected" : ""}" type="button" data-screening-time-cell="${hour}">${String(hour).padStart(2, "0")}:00</button>`;
        }).join("")}
      </div>
      <span class="form-help">타임라인을 마우스로 드래그해 가능 시간 범위를 선택하세요.</span>
      <textarea class="control-textarea" id="screening-panel-availability" name="availability" rows="3" readonly>${escapeHtml(previewText)}</textarea>
    </div>
  `;
}

function renderScreeningInterviewerRows(folder) {
  const members = normalizeInterviewPanelMembers(folder.interviewPanel || {});
  const rows = members.length ? members : [{ name: "", email: "" }];

  return rows.map((member, index) => `
    <div class="screening-interviewer-row" data-screening-interviewer-row>
      <input class="control-input" name="interviewerName" value="${inputValue(member.name)}" placeholder="면접위원 이름" />
      <input class="control-input" name="interviewerEmail" type="email" value="${inputValue(member.email)}" placeholder="면접위원 메일" />
      <button class="ghost-button compact-button" type="button" data-remove-screening-interviewer ${rows.length === 1 && index === 0 ? "disabled" : ""}>삭제</button>
    </div>
  `).join("");
}

function renderScreeningAvailabilityRows(folder) {
  const slots = normalizeInterviewPanelSlots(folder.interviewPanel || {});
  const rows = slots.length ? slots : [""];

  return rows.map((slot, index) => `
    <div class="screening-slot-row" data-screening-slot-row>
      <input class="control-input" name="availabilitySlot" type="datetime-local" value="${inputValue(slot)}" data-screening-slot-input />
      <button class="ghost-button compact-button" type="button" data-remove-screening-slot ${rows.length === 1 && index === 0 ? "disabled" : ""}>삭제</button>
    </div>
  `).join("");
}

function renderSecondScreeningPanel(folder) {
  const draftApplicants = folder.applicants.filter((applicant) => applicant.stage === "second_draft");
  const passedApplicants = folder.applicants.filter((applicant) => ["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(applicant.stage));
  const canFinalize = canRunSecondScreening(folder);

  return `
    <div class="trending-modal-backdrop" data-screening-result-panel-backdrop>
      <section class="trending-modal screening-result-modal" role="dialog" aria-modal="true" aria-labelledby="screening-result-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-result-modal-title">결과 발송</strong>
            <span>2차 합격 예정자와 면접위원, 가능 시간대를 확인한 뒤 저장합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-result-panel>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form id="screening-final-pass-form">
            <div class="panel-header">
              <h4>합격자 확정 정보</h4>
              <span class="small-pill">2차 합격 예정 ${draftApplicants.length}명 · 확정 ${passedApplicants.length}명</span>
            </div>
            <input type="hidden" name="folderId" value="${escapeHtml(folder.id)}" />
            <div class="screening-pass-summary">
              <strong>합격자 리스트</strong>
              <div>
                ${[...draftApplicants, ...passedApplicants].length
                  ? [...draftApplicants, ...passedApplicants].map((applicant) => `<span class="status-chip ${applicant.stage === "second_draft" ? "chip-amber" : "chip-green"}">${escapeHtml(applicant.name)}</span>`).join("")
                  : `<span class="muted-text">2차 합격으로 선택된 지원자가 없습니다.</span>`}
              </div>
            </div>
            <div class="screening-result-send-grid">
              <section class="screening-result-send-block">
                <div class="panel-header compact-panel-header">
                  <h5>면접위원</h5>
                  <button class="ghost-button compact-button" type="button" data-add-screening-interviewer>면접위원 추가</button>
                </div>
                <div class="screening-interviewer-list" data-screening-interviewer-list>
                  ${renderScreeningInterviewerRows(folder)}
                </div>
              </section>
              <section class="screening-result-send-block">
                <div class="panel-header compact-panel-header">
                  <h5>면접 가능 시간대</h5>
                </div>
                <label class="screening-availability-preview-label" for="screening-panel-availability">메일 표기 문구</label>
                ${renderScreeningAvailabilityTimeline(folder)}
              </section>
            </div>
            <div class="form-actions screening-final-form-actions">
              <button class="primary-button" type="submit" ${([draftApplicants.length, passedApplicants.length].some(Boolean) && canFinalize) ? "" : "disabled"}>합격자 확정 및 저장</button>
            </div>
          </form>
        </div>
      </section>
    </div>
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

function renderScreeningInterviewPanelSummary(folder) {
  const panel = folder?.interviewPanel || {};
  const members = normalizeInterviewPanelMembers(panel);
  const availability = buildScreeningAvailabilityText(normalizeInterviewPanelSlots(panel), panel.availability);

  return `
    <section class="profile-panel screening-interview-summary-panel">
      <div class="panel-header">
        <h4>전화면접 진행 정보</h4>
        <span class="small-pill">${members.length}명 · ${availability ? "시간대 입력" : "시간대 미입력"}</span>
      </div>
      <div class="screening-interview-summary-grid">
        <section>
          <strong>면접위원</strong>
          ${members.length
            ? members.map((member) => `
              <p>
                <span>${escapeHtml(member.name || "이름 미입력")}</span>
                <small>${escapeHtml(member.email || "메일 미입력")}</small>
              </p>
            `).join("")
            : `<p class="muted-text">저장된 면접위원 정보가 없습니다.</p>`}
        </section>
        <section>
          <strong>면접 가능 시간대</strong>
          ${availability
            ? splitNonEmptyLines(availability).map((line) => `<p>${escapeHtml(line.replace(/^-\s*/, ""))}</p>`).join("")
            : `<p class="muted-text">저장된 면접 가능 시간대가 없습니다.</p>`}
        </section>
      </div>
    </section>
  `;
}

function renderScreeningMailPreviewModal() {
  const preview = state.screeningMailPreview;

  if (!preview) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-screening-mail-preview-backdrop>
      <section class="trending-modal screening-mail-preview-modal" role="dialog" aria-modal="true" aria-labelledby="screening-mail-preview-title">
        <div class="trending-modal-header">
          <div>
            <strong id="screening-mail-preview-title">${escapeHtml(preview.title || "메일 발송 검토")}</strong>
            <span>수신자, 제목, 본문을 확인한 뒤 필요한 부분을 수정해서 발송합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-screening-mail-preview>닫기</button>
        </div>
        <div class="trending-modal-body">
          <form id="screening-mail-preview-form" class="screening-mail-preview-form">
            <div class="field">
              <label for="screening-mail-preview-recipients">수신자</label>
              <textarea class="control-textarea" id="screening-mail-preview-recipients" name="recipients" rows="3">${escapeHtml(preview.recipientsText || "")}</textarea>
              <span class="form-help">여러 명에게 보낼 경우 줄바꿈, 쉼표, 세미콜론으로 구분합니다.</span>
            </div>
            <div class="field">
              <label for="screening-mail-preview-subject">제목</label>
              <input class="control-input" id="screening-mail-preview-subject" name="subject" value="${inputValue(preview.subject || "")}" />
            </div>
            <div class="field">
              <label for="screening-mail-preview-body">본문</label>
              <textarea class="control-textarea mail-body-editor" id="screening-mail-preview-body" name="body" rows="14">${escapeHtml(preview.body || "")}</textarea>
            </div>
            <div class="form-actions">
              <button class="ghost-button" type="button" data-close-screening-mail-preview>취소</button>
              <button class="ghost-button" type="button" data-save-screening-mail-template>양식 저장</button>
              <button class="primary-button" type="submit">수정 내용으로 발송</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `;
}

function renderScreeningStepContent(folder) {
  const step = getCurrentScreeningDetailStep(folder);

  if (step === "second") {
    const applicants = getScreeningStepApplicants(folder, "second");
    const draftCount = folder.applicants.filter((applicant) => applicant.stage === "second_draft").length;
    const passedCount = folder.applicants.filter((applicant) => ["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(applicant.stage)).length;
    const canOpenResultPanel = canRunSecondScreening(folder) && (draftCount || passedCount);

    return `
      <section class="profile-panel">
        <div class="panel-header">
          <h4>2차 스크리닝(현업) 리스트</h4>
          <div class="panel-actions">
            <button class="primary-button compact-button" type="button" data-open-screening-result-panel ${canOpenResultPanel ? "" : "disabled"}>결과 발송</button>
            <span class="small-pill">2차 도달 ${applicants.length}명</span>
          </div>
        </div>
        ${renderApplicantList(folder, applicants, "1차 합격 처리된 지원자가 없습니다.", "second")}
      </section>
      ${state.screeningResultPanelOpen ? renderSecondScreeningPanel(folder) : ""}
    `;
  }

  if (step === "mail") {
    const applicants = getScreeningStepApplicants(folder, "mail");

    return `
      ${renderScreeningInterviewPanelSummary(folder)}
      <section class="profile-panel">
        <div class="panel-header">
          <h4>전화면접 안내 대상</h4>
          <span class="small-pill">대상 ${applicants.length}명</span>
        </div>
        ${renderApplicantList(folder, applicants, "2차 최종 통과 지원자가 없습니다.", "mail")}
      </section>
    `;
  }

  const applicants = getScreeningStepApplicants(folder, "first");
  const firstDraftCount = folder.applicants.filter((applicant) => applicant.stage === "first_draft").length;
  const canFinalizeFirst = canRunFirstScreening(folder) && firstDraftCount;

  return `
    <section class="profile-panel">
      <div class="panel-header">
        <h4>1차 스크리닝(인사) 리스트</h4>
        <div class="panel-actions">
          <button class="primary-button compact-button" type="button" data-finalize-first-screening ${canFinalizeFirst ? "" : "disabled"}>결과 발송</button>
          <span class="small-pill">1차 도달 ${applicants.length}명</span>
        </div>
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
            ${canRegisterScreeningApplicant(folder) ? `<button class="ghost-button compact-button" type="button" data-open-screening-bulk-applicant>지원자 대량 등록</button>` : ""}
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

  if (selectedFolder && ensureScreeningFitSnapshot(selectedFolder)) {
    replaceScreeningFolder(selectedFolder);
    persistState();
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
      ${renderBulkApplicantRegistrationModal(selectedFolder)}
      ${renderScreeningJdModal(selectedFolder)}
      ${renderScreeningAccessModal(selectedFolder)}
      ${renderScreeningApplicantDetailModal(selectedFolder)}
      ${renderScreeningMailPreviewModal()}
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

function getInterviewCaseStatusLabel(interviewCase) {
  if (interviewCase.status === "passed") {
    return "면접 합격";
  }

  if (interviewCase.status === "failed") {
    return "면접 불합격";
  }

  return `${getInterviewStageConfig(interviewCase.currentStage).label} 진행`;
}

function interviewStatusChip(status) {
  const chipClass = {
    waiting: "chip-amber",
    scheduling: "chip-blue",
    scheduled: "chip-violet",
    passed: "chip-green",
    failed: "chip-red"
  }[status] || "chip-amber";

  return `<span class="status-chip ${chipClass}">${escapeHtml(INTERVIEW_STATUS_LABELS[status] || status || "대기")}</span>`;
}

function interviewCaseStatusChip(interviewCase) {
  const chipClass = {
    in_progress: "chip-blue",
    passed: "chip-green",
    failed: "chip-red"
  }[interviewCase.status] || "chip-blue";

  return `<span class="status-chip ${chipClass}">${escapeHtml(getInterviewCaseStatusLabel(interviewCase))}</span>`;
}

function findInterviewCase(interviewCaseId) {
  return state.interviewCases.find((item) => item.id === interviewCaseId) || null;
}

function getSelectedInterviewCase() {
  const visibleCases = getVisibleInterviewCases();
  return visibleCases.find((item) => item.id === state.selectedInterviewCaseId) || visibleCases[0] || null;
}

function replaceInterviewCase(interviewCase) {
  const normalized = normalizeInterviewCase(interviewCase);
  const index = state.interviewCases.findIndex((item) => item.id === normalized.id);

  if (index >= 0) {
    state.interviewCases[index] = normalized;
  } else {
    state.interviewCases.unshift(normalized);
  }

  return normalized;
}

function mutateInterviewCase(interviewCaseId, updater, options = {}) {
  const current = findInterviewCase(interviewCaseId);

  if (!current || !canViewInterviewCase(current)) {
    showToast("인터뷰 정보를 찾을 수 없습니다.");
    return null;
  }

  const next = normalizeInterviewCase(structuredClone(current));
  updater(next);
  next.updatedAt = getTodayDate();
  const saved = replaceInterviewCase(next);

  if (options.persist !== false) {
    persistState();
    syncInterviewCasesToSupabase().catch((error) => {
      console.warn("Interview cases remote save failed.", error);
    });
  }

  return saved;
}

function getInterviewStage(interviewCase, stageId = state.selectedInterviewStage) {
  const normalizedStageId = INTERVIEW_STAGE_IDS.includes(stageId) ? stageId : "phone";
  return interviewCase?.stages?.[normalizedStageId] || normalizeInterviewStage(normalizedStageId);
}

function renderInterviewCaseList(cases) {
  if (!cases.length) {
    return `
      <div class="empty-state compact-empty">
        Screening에서 2차 합격이 확정된 지원자가 생기면 Interview 메뉴에 자동으로 표시됩니다.
      </div>
    `;
  }

  return `
    <div class="interview-case-list">
      ${cases.map((interviewCase) => `
        <article class="interview-case-card ${interviewCase.id === state.selectedInterviewCaseId ? "is-active" : ""}">
          <button class="interview-case-select" type="button" data-select-interview-case="${escapeHtml(interviewCase.id)}">
          <span>
            <strong>${escapeHtml(interviewCase.candidateName || "-")}</strong>
            <small>${escapeHtml([interviewCase.company, interviewCase.currentRole].filter(Boolean).join(" · ") || "지원자 정보 미입력")}</small>
          </span>
          <em>${escapeHtml([interviewCase.businessUnit, interviewCase.positionName].filter(Boolean).join(" · ") || "포지션 미입력")}</em>
          ${interviewCaseStatusChip(interviewCase)}
          </button>
          <div class="interview-case-actions">
            <button class="ghost-button danger-button compact-button" type="button" data-delete-interview-case="${escapeHtml(interviewCase.id)}">삭제</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderInterviewStageNav(interviewCase) {
  return `
    <nav class="interview-stage-nav" aria-label="인터뷰 단계">
      ${INTERVIEW_STAGE_CONFIG.map((stage) => {
        const stageData = getInterviewStage(interviewCase, stage.id);
        return `
          <button class="${stage.id === state.selectedInterviewStage ? "is-active" : ""}" type="button" data-select-interview-stage="${escapeHtml(stage.id)}">
            <span>${escapeHtml(stage.label)}</span>
            <strong>${escapeHtml(stage.requirement)}</strong>
            ${interviewStatusChip(stageData.status)}
          </button>
        `;
      }).join("")}
    </nav>
  `;
}

function renderInterviewSlotRows(interviewCase, stageId, slotType, title, helpText) {
  const stage = getInterviewStage(interviewCase, stageId);
  const savedSlots = Array.isArray(stage[slotType]) ? stage[slotType] : [];
  const rows = savedSlots.length ? savedSlots : [""];

  return `
    <section class="interview-slot-box">
      <div class="panel-header compact-panel-header">
        <div>
          <h5>${escapeHtml(title)}</h5>
          <span>${escapeHtml(helpText)}</span>
        </div>
        <button class="ghost-button compact-button" type="button" data-add-interview-slot="${escapeHtml(slotType)}" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">시간 추가</button>
      </div>
      <div class="interview-slot-list">
        ${rows.map((slot, index) => `
          <div class="interview-slot-row">
            <input
              class="control-input"
              type="datetime-local"
              value="${inputValue(slot)}"
              data-interview-slot-input
              data-interview-case-id="${escapeHtml(interviewCase.id)}"
              data-interview-stage="${escapeHtml(stageId)}"
              data-interview-slot-type="${escapeHtml(slotType)}"
              data-interview-slot-index="${index}"
            />
            <button class="ghost-button compact-button" type="button" data-remove-interview-slot="${index}" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" data-interview-slot-type="${escapeHtml(slotType)}" ${savedSlots.length ? "" : "disabled"}>삭제</button>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderInterviewPanelRows(interviewCase, stageId) {
  const stage = getInterviewStage(interviewCase, stageId);

  return `
    <section class="interview-stage-card">
      <div class="panel-header compact-panel-header">
        <div>
          <h5>면접위원</h5>
          <span>${escapeHtml(getInterviewStageConfig(stageId).requirement)}</span>
        </div>
        <button class="ghost-button compact-button" type="button" data-add-interview-panel-member data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">위원 추가</button>
      </div>
      <div class="interview-panel-list">
        ${stage.panel.map((member, index) => `
          <div class="interview-panel-row">
            <input class="control-input" value="${inputValue(member.role)}" placeholder="역할" data-interview-panel-field="role" data-interview-panel-index="${index}" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" />
            <input class="control-input" value="${inputValue(member.level)}" placeholder="CL/직급" data-interview-panel-field="level" data-interview-panel-index="${index}" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" />
            <input class="control-input" value="${inputValue(member.name)}" placeholder="이름" data-interview-panel-field="name" data-interview-panel-index="${index}" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" />
            <input class="control-input" type="email" value="${inputValue(member.email)}" placeholder="메일" data-interview-panel-field="email" data-interview-panel-index="${index}" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" />
            <button class="ghost-button compact-button" type="button" data-remove-interview-panel-member="${index}" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" ${stage.panel.length <= 1 ? "disabled" : ""}>삭제</button>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderInterviewDocumentRows(interviewCase, stageId) {
  const stage = getInterviewStage(interviewCase, stageId);
  const config = getInterviewStageConfig(stageId);

  if (!config.documents.length) {
    return "";
  }

  return `
    <section class="interview-stage-card">
      <div class="panel-header compact-panel-header">
        <div>
          <h5>제출자료</h5>
          <span>단계별 필수 자료를 수신 후 이곳에 보관합니다.</span>
        </div>
      </div>
      <div class="interview-document-list">
        ${config.documents.map((document) => {
          const attachment = stage.documents?.[document.id];
          return `
            <article class="interview-document-card">
              <div>
                <strong>${escapeHtml(document.label)}</strong>
                <span>${escapeHtml(document.owner)} 제출</span>
                ${attachment ? `<small>${escapeHtml(attachment.name)} · ${formatFileSize(attachment.size)} · ${escapeHtml(attachment.uploadedBy || "등록자 미입력")}</small>` : `<small>등록된 파일 없음</small>`}
              </div>
              <div class="member-actions">
                ${attachment?.dataUrl ? `<a class="ghost-button compact-button" href="${escapeHtml(attachment.dataUrl)}" download="${escapeHtml(attachment.name || document.label)}">다운로드</a>` : ""}
                <label class="ghost-button compact-button">
                  업로드
                  <input class="visually-hidden" type="file" data-interview-document-upload="${escapeHtml(document.id)}" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" />
                </label>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderInterviewMailHistory(stage) {
  const history = (stage.mailHistory || []).slice(0, 4);

  if (!history.length) {
    return `<span class="muted-text">아직 발송된 메일이 없습니다.</span>`;
  }

  return `
    <div class="interview-mail-history">
      ${history.map((mail) => `
        <span>${escapeHtml(mail.sentAt || "-")} · ${escapeHtml(mail.label || mail.type || "메일")} · ${escapeHtml((mail.recipients || []).join(", "))}</span>
      `).join("")}
    </div>
  `;
}

function phoneOperationStatusChip(status) {
  const label = {
    pending: "대기",
    available: "참석 가능",
    unavailable: "참석 불가",
    sent: "발송됨",
    confirmed: "확정",
    change_requested: "변경 요청"
  }[status] || "대기";
  const chipClass = {
    pending: "chip-gray",
    available: "chip-green",
    unavailable: "chip-red",
    sent: "chip-blue",
    confirmed: "chip-green",
    change_requested: "chip-amber"
  }[status] || "chip-gray";

  return `<span class="status-chip ${chipClass}">${escapeHtml(label)}</span>`;
}

function getInterviewPanelSummary(stage) {
  const members = (stage.panel || [])
    .map((member) => [member.name, member.role, member.email].filter(Boolean).join(" / "))
    .filter(Boolean);

  return members.length ? members.join("\n") : "면접위원 미입력";
}

function getPhoneOperationNextText(interviewCase, stage) {
  const operation = stage.phoneOperation || normalizePhoneInterviewOperation();

  if (!operation.candidateRequestSentAt) {
    return "후보자에게 일정 가능 여부와 개인정보 수집이용 동의서 서명을 요청하세요.";
  }

  if (operation.candidateStatus === "available" && !stage.confirmedAt) {
    return "후보자가 가능 일정을 회신했습니다. 적정 시간대를 선택해 확정 일정을 입력하세요.";
  }

  if (operation.candidateStatus === "unavailable" && !operation.panelRequestSentAt) {
    return "후보자가 기존 시간대 참석이 어렵습니다. 후보자 가능 시간 기준으로 면접위원 참석 가능 여부를 확인하세요.";
  }

  if (operation.interviewerStatus === "unavailable") {
    return "면접위원 참석이 어렵습니다. 후보자에게 가능한 다른 일정 문의 후 첫 단계로 되돌려 조율하세요.";
  }

  if (stage.confirmedAt && (!operation.candidateConfirmedSentAt || !operation.panelConfirmedSentAt)) {
    return "확정 일정을 기준으로 후보자와 면접위원에게 안내 메일을 발송하세요.";
  }

  if (stage.status === "scheduled") {
    return "전화면접 일정 조율이 완료되었습니다. 변경 요청 발생 시 해당 버튼으로 재조율을 시작하세요.";
  }

  return `${interviewCase.candidateName || "지원자"} 전화면접 일정 조율을 진행하세요.`;
}

function renderPhoneInterviewOperationBoard(interviewCase, stageId) {
  const stage = getInterviewStage(interviewCase, stageId);
  const operation = stage.phoneOperation || normalizePhoneInterviewOperation();
  const confirmedText = formatScreeningAvailabilitySlot(stage.confirmedAt);
  const candidateSlots = (stage.candidateSlots || []).map(formatScreeningAvailabilitySlot).filter(Boolean);
  const interviewerSlots = (stage.interviewerSlots || []).map(formatScreeningAvailabilitySlot).filter(Boolean);

  return `
    <section class="interview-stage-card interview-phone-operation-card">
      <div class="panel-header compact-panel-header">
        <div>
          <h5>전화면접 일정 조율 오퍼레이션</h5>
          <span>후보자와 면접위원 가능 여부를 기록하고, 필요한 안내 메일을 검수 후 발송합니다.</span>
        </div>
        <label class="interview-auto-mail-toggle">
          <input type="checkbox" data-interview-auto-mail data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" ${operation.autoMail ? "checked" : ""} />
          <span>자동 연락 준비</span>
        </label>
      </div>
      <div class="interview-operation-summary">
        <div>
          <span>후보자 상태</span>
          ${phoneOperationStatusChip(operation.candidateStatus)}
        </div>
        <div>
          <span>면접위원 상태</span>
          ${phoneOperationStatusChip(operation.interviewerStatus)}
        </div>
        <div>
          <span>확정 일정</span>
          <strong>${escapeHtml(confirmedText || "미확정")}</strong>
        </div>
      </div>
      <p class="interview-operation-next">${escapeHtml(getPhoneOperationNextText(interviewCase, stage))}</p>
      <div class="interview-operation-flow">
        <article>
          <strong>1. 후보자 일정 확인</strong>
          <span>가능 여부 및 개인정보 수집이용 동의서 서명 요청</span>
          <button class="ghost-button compact-button" type="button" data-open-interview-mail-preview="candidate_request" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">후보자 안내 메일</button>
        </article>
        <article>
          <strong>2. 후보자 회신 기록</strong>
          <span>${escapeHtml(candidateSlots.length ? candidateSlots.join(" / ") : "가능 시간 미입력")}</span>
          <div class="member-actions">
            <button class="soft-button compact-button" type="button" data-phone-operation-status="candidate:available" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">참석 가능</button>
            <button class="ghost-button danger-button compact-button" type="button" data-phone-operation-status="candidate:unavailable" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">참석 불가</button>
          </div>
        </article>
        <article>
          <strong>3. 면접위원 확인</strong>
          <span>${escapeHtml(getInterviewPanelSummary(stage))}</span>
          <button class="ghost-button compact-button" type="button" data-open-interview-mail-preview="panel_request" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">면접위원 문의</button>
          <div class="member-actions">
            <button class="soft-button compact-button" type="button" data-phone-operation-status="interviewer:available" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">참석 가능</button>
            <button class="ghost-button danger-button compact-button" type="button" data-phone-operation-status="interviewer:unavailable" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">참석 불가</button>
          </div>
        </article>
        <article>
          <strong>4. 확정 안내</strong>
          <span>${escapeHtml(interviewerSlots.length ? interviewerSlots.join(" / ") : confirmedText || "확정 일정 입력 필요")}</span>
          <button class="primary-button compact-button" type="button" data-open-interview-mail-preview="combined_schedule" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" ${stage.confirmedAt ? "" : "disabled"}>확정 안내 메일</button>
        </article>
      </div>
      <div class="interview-change-actions">
        <button class="ghost-button compact-button" type="button" data-phone-operation-status="candidate:change_requested" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">후보자 일정 변경 요청</button>
        <button class="ghost-button compact-button" type="button" data-phone-operation-status="interviewer:change_requested" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">면접위원 일정 변경 요청</button>
      </div>
      <small class="form-help">자동 연락 준비를 켜면 상태 변경 후 필요한 메일 미리보기 창이 자동으로 열립니다. 실제 발송은 담당자가 본문을 확인하고 최종 발송을 눌러야 진행됩니다.</small>
    </section>
  `;
}

function renderInterviewStagePanel(interviewCase, stageId) {
  const config = getInterviewStageConfig(stageId);
  const stage = getInterviewStage(interviewCase, stageId);
  const confirmedText = formatScreeningAvailabilitySlot(stage.confirmedAt);

  return `
    <section class="profile-panel interview-stage-panel">
      <div class="panel-header">
        <div>
          <h4>${escapeHtml(config.label)}</h4>
          <span>${escapeHtml(config.requirement)}</span>
        </div>
        ${interviewStatusChip(stage.status)}
      </div>
      ${stageId === "phone" ? renderPhoneInterviewOperationBoard(interviewCase, stageId) : ""}
      <div class="interview-stage-grid">
        <section class="interview-stage-card">
          <div class="panel-header compact-panel-header">
            <div>
              <h5>캘린더 일정 조율</h5>
              <span>지원자와 면접위원의 가능 시간대를 모은 뒤 확정 일정을 입력합니다.</span>
            </div>
          </div>
          <div class="interview-schedule-grid">
            ${renderInterviewSlotRows(interviewCase, stageId, "candidateSlots", "지원자 가능 시간", "지원자가 회신한 가능 시간대")}
            ${renderInterviewSlotRows(interviewCase, stageId, "interviewerSlots", "면접위원 가능 시간", "면접위원이 회신한 가능 시간대")}
          </div>
          <div class="interview-confirm-row">
            <label>
              <span>확정 일정</span>
              <input class="control-input" type="datetime-local" value="${inputValue(stage.confirmedAt)}" data-interview-confirmed data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" />
            </label>
            <strong>${escapeHtml(confirmedText || "확정 일정 미입력")}</strong>
          </div>
        </section>
        ${renderInterviewPanelRows(interviewCase, stageId)}
        ${renderInterviewDocumentRows(interviewCase, stageId)}
        <section class="interview-stage-card">
          <div class="panel-header compact-panel-header">
            <div>
              <h5>운영 메모</h5>
              <span>일정 변경 사유, 후보자/면접위원 요청사항을 기록합니다.</span>
            </div>
          </div>
          <textarea class="control-textarea" rows="4" data-interview-note data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">${escapeHtml(stage.note)}</textarea>
          <div class="interview-mail-history-wrap">
            <strong>메일 발송 이력</strong>
            ${renderInterviewMailHistory(stage)}
          </div>
        </section>
      </div>
      <div class="interview-action-row">
        ${stage.status === "passed" ? `<button class="ghost-button" type="button" data-interview-revert-stage data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">${escapeHtml(config.label)} 합격 취소</button>` : ""}
        <button class="ghost-button" type="button" data-send-interview-mail="request" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">입력 요청 메일</button>
        <button class="ghost-button" type="button" data-send-interview-mail="schedule" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}" ${stage.confirmedAt ? "" : "disabled"}>확정 일정 안내</button>
        <button class="soft-button" type="button" data-interview-pass-stage data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">${escapeHtml(config.label)} 합격</button>
        <button class="ghost-button danger-button" type="button" data-interview-fail-stage data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">${escapeHtml(config.label)} 불합격</button>
        <button class="ghost-button danger-button" type="button" data-send-interview-mail="reject" data-interview-case-id="${escapeHtml(interviewCase.id)}" data-interview-stage="${escapeHtml(stageId)}">탈락 안내 메일</button>
      </div>
    </section>
  `;
}

function renderInterviewFinalPanel(interviewCase) {
  const statusText = interviewCase.status === "passed"
    ? "HR면접까지 통과하여 면접 합격자로 확정되었습니다."
    : interviewCase.status === "failed"
      ? "인터뷰 프로세스가 불합격으로 종료되었습니다."
      : "HR면접 종료 후 최종 면접 합격 여부를 확정할 수 있습니다.";

  const offerActions = interviewCase.status === "passed"
    ? `
      <div class="interview-offer-actions">
        <button class="soft-button compact-button" type="button" data-mark-offer-signed="${escapeHtml(interviewCase.id)}">
          ${interviewCase.offerSignedAt ? "오퍼서명 완료됨" : "오퍼서명(확보) 완료"}
        </button>
        <button class="ghost-button compact-button" type="button" data-mark-joined="${escapeHtml(interviewCase.id)}" ${interviewCase.offerSignedAt ? "" : "disabled"}>
          ${interviewCase.joinedAt ? "입사 완료됨" : "입사 완료"}
        </button>
        ${interviewCase.offerSignedAt ? `<span>${escapeHtml(interviewCase.offerSignedAt)} · ${escapeHtml(interviewCase.offerSignedBy || "-")}</span>` : ""}
      </div>
    `
    : "";

  return `
    <section class="profile-panel interview-final-panel">
      <div>
        <strong>최종 결과</strong>
        <span>${escapeHtml(statusText)}</span>
      </div>
      ${offerActions}
      <div class="member-actions">
        ${interviewCase.status === "passed" ? `<button class="ghost-button compact-button" type="button" data-revert-final-interview-case="${escapeHtml(interviewCase.id)}">최종 합격 취소</button>` : ""}
        <button class="primary-button compact-button" type="button" data-finalize-interview-case="passed" data-interview-case-id="${escapeHtml(interviewCase.id)}">면접 합격 확정</button>
        <button class="ghost-button danger-button compact-button" type="button" data-finalize-interview-case="failed" data-interview-case-id="${escapeHtml(interviewCase.id)}">면접 불합격 확정</button>
      </div>
    </section>
  `;
}

function renderInterviewDetail(interviewCase) {
  if (!interviewCase) {
    return `
      <section class="content-panel">
        <div class="empty-state">인터뷰 대상자를 선택해주세요.</div>
      </section>
    `;
  }

  const selectedStage = INTERVIEW_STAGE_IDS.includes(state.selectedInterviewStage)
    ? state.selectedInterviewStage
    : interviewCase.currentStage || "phone";

  state.selectedInterviewStage = selectedStage;

  return `
    <div class="interview-detail">
      <section class="profile-panel interview-hero">
        <div>
          <p class="eyebrow">${escapeHtml(interviewCase.businessUnit || "사업부 미입력")}</p>
          <h4>${escapeHtml(interviewCase.candidateName || "-")}</h4>
          <p>${escapeHtml([interviewCase.company, interviewCase.currentRole].filter(Boolean).join(" · ") || "지원자 정보 미입력")}</p>
          <span>${escapeHtml([interviewCase.department, interviewCase.positionName].filter(Boolean).join(" · ") || "포지션 정보 미입력")}</span>
        </div>
        <div class="interview-hero-meta">
          ${interviewCaseStatusChip(interviewCase)}
          <span>이메일 ${escapeHtml(interviewCase.email || "-")}</span>
          <span>휴대폰 ${escapeHtml(interviewCase.phone || "-")}</span>
        </div>
      </section>
      ${renderInterviewStageNav(interviewCase)}
      ${renderInterviewStagePanel(interviewCase, selectedStage)}
      ${renderInterviewFinalPanel(interviewCase)}
    </div>
  `;
}

function renderInterviewView() {
  const container = $("#interview-content");

  if (!container) {
    return;
  }

  ensureInterviewDefaults();
  const cases = getVisibleInterviewCases();
  const selectedCase = getSelectedInterviewCase();

  container.innerHTML = `
    <div class="interview-layout">
      <aside class="interview-sidebar">
        <div class="panel-header">
          <div>
            <h4>인터뷰 대상자</h4>
            <span>Screening 2차 합격 확정자 기반</span>
          </div>
          <span class="small-pill">${cases.length}명</span>
        </div>
        ${renderInterviewCaseList(cases)}
      </aside>
      ${renderInterviewDetail(selectedCase)}
    </div>
    ${renderInterviewMailPreviewModal()}
  `;
}

function getInterviewReportState() {
  state.interviewReport = normalizeInterviewReportState(state.interviewReport);
  return state.interviewReport;
}

function summarizeInterviewScriptText(text) {
  const normalized = normalizePolicyText(text);
  const sentences = normalized
    .split(/(?<=[.!?。！？])\s+|\n+/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
  const topSentences = sentences.slice(0, 6);
  const longLines = sentences.filter((line) => line.length >= 24).slice(0, 4);

  return {
    summary: (topSentences.length ? topSentences : [normalized]).slice(0, 4),
    keyPoints: (longLines.length ? longLines : topSentences).slice(0, 4),
    followUps: sentences
      .filter((line) => /확인|검토|리스크|보완|우려|추가|질문|필요|희망|조건/.test(line))
      .slice(0, 4)
  };
}

function analyzeInterviewTemplateProfile(templateText = "", fileName = "") {
  const normalized = normalizePolicyText(templateText);
  const lines = normalized.split("\n");
  const nonEmptyLines = lines.map((line) => line.trim()).filter(Boolean);
  const avgLineLength = nonEmptyLines.length
    ? Math.round(nonEmptyLines.reduce((sum, line) => sum + line.length, 0) / nonEmptyLines.length)
    : 48;
  const sectionTitles = nonEmptyLines
    .filter((line) => line.length <= 34)
    .filter((line) => /^(#+\s*)?(\d+[.)]\s*)?[\w가-힣][\w가-힣\s\/·()\[\]-]{1,32}$/.test(line))
    .map((line) => line.replace(/^#+\s*/, "").trim())
    .filter((line, index, array) => array.indexOf(line) === index)
    .slice(0, 5);
  const bulletLine = nonEmptyLines.find((line) => /^[-*ㆍ•]\s+/.test(line));
  const blankRatio = lines.length ? lines.filter((line) => !line.trim()).length / lines.length : 0.18;

  return {
    fileName: String(fileName || "").trim(),
    sectionTitles,
    bulletPrefix: bulletLine ? bulletLine.trim().slice(0, 1) : "-",
    estimatedCharsPerLine: Math.max(34, Math.min(76, avgLineLength || 48)),
    lineHeight: blankRatio > 0.24 ? 1.75 : blankRatio > 0.12 ? 1.6 : 1.45,
    fontFamily: /[가-힣]/.test(normalized) ? "Malgun Gothic" : "Arial",
    fontSizePt: avgLineLength > 68 ? 10 : 10.5,
    layoutNote: sectionTitles.length
      ? `${sectionTitles.length}개 섹션 제목과 문단 길이 패턴을 반영`
      : "문단 길이와 줄 간격 패턴을 반영"
  };
}

function getInterviewTemplateProfile(report) {
  const templateCorpus = getInterviewTemplateCorpus(report);

  if (templateCorpus) {
    return analyzeInterviewTemplateProfile(templateCorpus, getInterviewTemplateSourceLabel(report));
  }

  return report.templateProfile && typeof report.templateProfile === "object"
    ? report.templateProfile
    : analyzeInterviewTemplateProfile("", "");
}

function getInterviewTemplateSamples(report) {
  return Array.isArray(report.templateSamples)
    ? report.templateSamples.map(normalizeInterviewTemplateSample).filter(Boolean)
    : [];
}

function getInterviewTemplateCorpus(report) {
  return [
    ...getInterviewTemplateSamples(report).map((sample) => sample.text),
    normalizePolicyText(report.templateText || "")
  ].filter(Boolean).join("\n\n---\n\n");
}

function getInterviewTemplateSourceLabel(report) {
  const sampleNames = getInterviewTemplateSamples(report).map((sample) => sample.name).filter(Boolean);

  if (sampleNames.length) {
    return sampleNames.join(", ");
  }

  return report.templateFileName || "직접 입력 양식";
}

function renderInterviewTemplateSampleList(report) {
  const samples = getInterviewTemplateSamples(report);

  if (!samples.length) {
    return `<div class="empty-state compact-empty">저장된 면담록 샘플이 없습니다.</div>`;
  }

  return `
    <div class="interview-template-sample-list">
      ${samples.map((sample, index) => `
        <div class="interview-template-sample-row">
          <span>
            <strong>${escapeHtml(sample.name || `샘플 ${index + 1}`)}</strong>
            <small>${escapeHtml([formatFileSize(sample.size), sample.profile?.layoutNote].filter(Boolean).join(" · "))}</small>
          </span>
          <button class="ghost-button danger-button compact-button" type="button" data-remove-interview-template-sample="${escapeHtml(sample.id)}">삭제</button>
        </div>
      `).join("")}
    </div>
  `;
}

function renderInterviewReportPromptModal(report) {
  if (!state.interviewReportPromptModalOpen) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-interview-report-prompt-backdrop>
      <section class="trending-modal interview-report-prompt-modal" role="dialog" aria-modal="true" aria-labelledby="interview-report-prompt-title">
        <div class="modal-header">
          <div>
            <p class="section-kicker">REPORT PROMPT</p>
            <h4 id="interview-report-prompt-title">보고서 작성 프롬프트</h4>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-interview-report-prompt>닫기</button>
        </div>
        <label class="field">
          <span>작성 지시사항</span>
          <textarea id="interview-report-prompt" class="control-textarea" rows="8" placeholder="예: 임원 보고용으로 리스크와 활용 가능성을 중심으로 정리">${escapeHtml(report.prompt)}</textarea>
        </label>
        <div class="modal-actions">
          <button class="primary-button" type="button" data-close-interview-report-prompt>저장</button>
        </div>
      </section>
    </div>
  `;
}

function wrapInterviewReportLine(line, maxChars) {
  const text = String(line || "").trim();

  if (!text || text.length <= maxChars) {
    return [text];
  }

  const words = text.split(/\s+/);
  const wrapped = [];
  let current = "";

  words.forEach((word) => {
    if (!current) {
      current = word;
      return;
    }

    if ((current.length + word.length + 1) > maxChars) {
      wrapped.push(current);
      current = word;
      return;
    }

    current = `${current} ${word}`;
  });

  if (current) {
    wrapped.push(current);
  }

  return wrapped.length ? wrapped : [text];
}

function buildInterviewReportText() {
  const report = getInterviewReportState();
  const summary = summarizeInterviewScriptText(report.scriptText);
  const templateProfile = getInterviewTemplateProfile(report);
  const templateCorpus = getInterviewTemplateCorpus(report);
  const bullet = templateProfile.bulletPrefix || "-";
  const maxChars = templateProfile.estimatedCharsPerLine || 52;
  const sectionTitles = templateProfile.sectionTitles || [];
  const templateNote = templateCorpus
    ? `참고 양식의 구성과 톤을 반영했습니다. (${templateProfile.layoutNote})`
    : "일반 면담록 양식 기준으로 면담 핵심 내용, 판단 근거, 후속 확인 사항 순으로 정리했습니다.";
  const promptNote = report.prompt
    ? `작성 지시사항: ${report.prompt}`
    : "작성 지시사항: C-level 및 채용 의사결정자가 빠르게 검토할 수 있는 보고서 형태";
  const sections = [
    {
      title: sectionTitles[0] || "1. 면담 요약",
      lines: summary.summary.length ? summary.summary : ["면담 스크립트 내 핵심 내용을 확인할 수 없습니다."]
    },
    {
      title: sectionTitles[1] || "2. 핵심 확인 사항",
      lines: summary.keyPoints.length ? summary.keyPoints : ["추가 확인 사항 없음"]
    },
    {
      title: sectionTitles[2] || "3. 후속 검토 필요 사항",
      lines: summary.followUps.length ? summary.followUps : ["면담 내용상 즉시 확인이 필요한 특이 리스크는 제한적입니다."]
    },
    {
      title: sectionTitles[3] || "4. 종합 의견",
      lines: [
        "면담 내용은 후보자의 경험, 관심사, 조건, 리스크를 중심으로 검토 가능한 형태로 정리되었습니다. 최종 판단 전에는 이력서, 직무 요건, 면접 평가 결과와 함께 교차 확인하는 것이 적절합니다."
      ]
    }
  ];

  return [
    "면담록 보고서",
    "",
    `작성 기준: ${templateNote}`,
    promptNote,
    "",
    ...sections.flatMap((section) => [
      section.title,
      ...section.lines.flatMap((line) => wrapInterviewReportLine(line, maxChars).map((wrappedLine) => `${bullet} ${wrappedLine}`)),
      ""
    ])
  ].join("\n");
}

function renderInterviewReport() {
  const container = $("#interview-report-content");

  if (!container) {
    return;
  }

  const report = getInterviewReportState();
  const templateSamples = getInterviewTemplateSamples(report);
  const hasScriptSource = Boolean(report.scriptText.trim() || canReadInterviewReportUpload(report.scriptFile));
  const hasTemplateSource = templateSamples.some((sample) => sample.text || canReadInterviewReportUpload(sample));
  const canGenerateReport = Boolean(hasScriptSource && hasTemplateSource && !report.scriptLoading && !report.templateLoading);
  const scriptUploadStatus = report.scriptStatus || report.scriptFile?.name || report.scriptFileName || "파일을 선택하거나 드래그앤드랍";
  const templateUploadStatus = report.templateStatus || (templateSamples.length ? `저장된 샘플 ${templateSamples.length}개` : "복수 샘플 선택 가능");

  container.innerHTML = `
    <div class="report-workspace">
      <section class="content-panel report-input-panel">
        <div class="panel-header">
          <div>
            <h4>면담 스크립트</h4>
            <span>스크립트 파일과 면담록 작성 양식 샘플을 업로드하면 보고서를 생성할 수 있습니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-reset-interview-report>초기화</button>
        </div>
        <div class="interview-report-grid">
          <label class="dropzone report-upload-box" for="interview-report-script-file">
            <input id="interview-report-script-file" type="file" accept=".txt,.pdf,.doc,.docx,.hwp,.hwpx" />
            <strong>스크립트 파일 업로드</strong>
            <span class="report-upload-status">${renderMaybeProgressStatus(scriptUploadStatus, report.scriptLoading, report.scriptProgress)}</span>
          </label>
          <label class="dropzone report-upload-box" for="interview-report-template-file">
            <input id="interview-report-template-file" type="file" accept=".txt,.pdf,.doc,.docx,.hwp,.hwpx" multiple />
            <strong>면담록 작성 양식 샘플 업로드</strong>
            <span class="report-upload-status">${renderMaybeProgressStatus(templateUploadStatus, report.templateLoading, report.templateProgress)}</span>
          </label>
        </div>
        <div class="report-prompt-row">
          <button class="ghost-button" type="button" data-open-interview-report-prompt>보고서 작성 프롬프트</button>
          <span>${escapeHtml(report.prompt ? "작성 프롬프트가 저장되어 있습니다." : "필요 시 보고서 작성 방향을 추가로 입력할 수 있습니다.")}</span>
        </div>
        ${renderInterviewTemplateSampleList(report)}
        <div class="member-actions">
          <button class="primary-button" type="button" data-generate-interview-report ${canGenerateReport ? "" : "disabled"}>면담록 보고서 생성</button>
          <button class="ghost-button" type="button" data-download-interview-report ${report.reportText ? "" : "disabled"}>Word 다운로드</button>
        </div>
        ${report.status ? `<p class="job-fit-inline-status">${escapeHtml(report.status)}</p>` : ""}
      </section>
      <section class="content-panel generated-report-panel">
        <div class="panel-header">
          <div>
            <h4>생성된 면담록 보고서</h4>
            <span>필요 시 문구를 직접 다듬은 후 다운로드할 수 있습니다.</span>
          </div>
        </div>
        <textarea id="interview-report-output" class="control-textarea report-output-textarea" rows="22" placeholder="면담록 보고서 생성 결과가 여기에 표시됩니다.">${escapeHtml(report.reportText)}</textarea>
      </section>
      ${renderInterviewReportPromptModal(report)}
    </div>
  `;
}

async function loadInterviewReportFile(file, field) {
  if (!file) {
    return;
  }

  const report = getInterviewReportState();
  const isScript = field === "script";
  const statusKey = isScript ? "scriptStatus" : "templateStatus";
  const loadingKey = isScript ? "scriptLoading" : "templateLoading";
  const progressKey = isScript ? "scriptProgress" : "templateProgress";

  report[loadingKey] = true;
  report[progressKey] = 12;
  report[statusKey] = `${file.name} 파일을 저장하는 중입니다.`;
  report.status = "";
  renderInterviewReport();

  try {
    await waitForUiPaint();
    const upload = createInterviewReportStoredUpload(file);

    if (!upload) {
      throw createResumeParseError("파일을 저장할 수 없습니다.");
    }

    report[progressKey] = 100;
    renderInterviewReport();

    if (isScript) {
      report.scriptFile = upload;
      report.scriptFileName = file.name;
      report.scriptText = "";
      report.scriptStatus = `${file.name} 스크립트 파일을 저장했습니다. 보고서 생성 시 내용을 읽어 분석합니다.`;
      report.status = "스크립트 파일이 저장되었습니다. 면담록 보고서 생성 버튼을 누르면 샘플과 함께 분석합니다.";
    } else {
      const sample = normalizeInterviewTemplateSample({
        name: file.name,
        size: file.size,
        type: file.type || "",
        storeKey: upload.storeKey,
        text: "",
        uploadedAt: getTimestampText()
      });

      if (sample) {
        report.templateSamples = [
          ...getInterviewTemplateSamples(report).filter((item) => item.name !== sample.name || item.text !== sample.text),
          sample
        ];
        report.templateProfile = null;
      }

      report.templateStatus = `${file.name} 샘플 파일을 저장했습니다. 보고서 생성 시 내용을 읽어 분석합니다.`;
      report.status = `면담록 작성 양식 샘플 ${getInterviewTemplateSamples(report).length}개가 저장되었습니다. 생성 버튼을 누르면 종합 분석합니다.`;
    }

    report.reportText = "";
    persistState({ skipRemoteSync: true });
  } catch (error) {
    console.warn(error);
    report[progressKey] = 0;
    report[statusKey] = error.isResumeParseError ? error.message : "파일을 읽는 중 오류가 발생했습니다.";
    report.status = report[statusKey];
  } finally {
    report[loadingKey] = false;
  }

  renderInterviewReport();
}

async function loadInterviewReportTemplateFiles(fileList) {
  const files = [...(fileList || [])].filter((file) => file && file.size);

  if (!files.length) {
    return;
  }

  const report = getInterviewReportState();
  report.templateLoading = true;
  report.templateProgress = 8;
  report.templateStatus = `${files.length}개 면담록 샘플을 저장하는 중입니다.`;
  report.status = "";
  renderInterviewReport();

  const loadedSamples = [];
  const failedNames = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    report.templateProgress = Math.max(12, Math.round(((index + 1) / files.length) * 88));
    report.templateStatus = `${index + 1}/${files.length} ${file.name} 샘플 파일을 저장하는 중입니다.`;
    renderInterviewReport();

    try {
      await waitForUiPaint();
      const upload = createInterviewReportStoredUpload(file);

      if (!upload) {
        throw createResumeParseError("샘플 파일을 저장할 수 없습니다.");
      }

      const sample = normalizeInterviewTemplateSample({
        name: file.name,
        size: file.size,
        type: file.type || "",
        storeKey: upload.storeKey,
        text: "",
        uploadedAt: getTimestampText()
      });

      if (sample) {
        loadedSamples.push(sample);
      }
    } catch (error) {
      console.warn("Interview report template sample read failed.", file.name, error);
      failedNames.push(file.name);
    }
  }

  const existingSamples = getInterviewTemplateSamples(report);
  const mergedSamples = [...existingSamples];

  loadedSamples.forEach((sample) => {
    const duplicateIndex = mergedSamples.findIndex((item) => item.name === sample.name && item.text === sample.text);

    if (duplicateIndex >= 0) {
      mergedSamples[duplicateIndex] = sample;
      return;
    }

    mergedSamples.push(sample);
  });

  report.templateSamples = mergedSamples;
  report.templateProfile = null;
  report.templateLoading = false;
  report.templateProgress = loadedSamples.length ? 100 : 0;
  report.templateStatus = loadedSamples.length
    ? `면담록 샘플 ${loadedSamples.length}개를 저장했습니다. 총 ${mergedSamples.length}개 샘플이 준비되었습니다.`
    : "저장된 면담록 샘플이 없습니다.";
  report.status = failedNames.length
    ? `일부 샘플을 읽지 못했습니다: ${failedNames.join(", ")}`
    : "면담록 샘플을 저장했습니다. 생성 버튼을 누르면 스크립트와 샘플을 종합 분석합니다.";
  report.reportText = "";
  persistState({ skipRemoteSync: true });
  renderInterviewReport();
}

function updateInterviewReportField(field, value) {
  const report = getInterviewReportState();
  report[field] = String(value || "");
  if (field === "templateText") {
    report.templateProfile = null;
    report.reportText = "";
  }
  if (field === "scriptText") {
    report.reportText = "";
  }
  persistState({ skipRemoteSync: true });
}

function openInterviewReportPromptModal() {
  state.interviewReportPromptModalOpen = true;
  renderInterviewReport();
}

function closeInterviewReportPromptModal() {
  state.interviewReportPromptModalOpen = false;
  renderInterviewReport();
}

function removeInterviewTemplateSample(sampleId) {
  const report = getInterviewReportState();
  report.templateSamples = getInterviewTemplateSamples(report).filter((sample) => sample.id !== sampleId);
  report.templateProfile = null;
  report.templateStatus = report.templateSamples.length
    ? `면담록 샘플 ${report.templateSamples.length}개가 저장되어 있습니다.`
    : "저장된 면담록 샘플이 없습니다.";
  report.reportText = "";
  persistState({ skipRemoteSync: true });
  renderInterviewReport();
}

async function generateInterviewReport() {
  const report = getInterviewReportState();
  let templateSamples = getInterviewTemplateSamples(report);
  const sampleCount = templateSamples.length;

  if (!report.scriptText.trim() && !canReadInterviewReportUpload(report.scriptFile)) {
    showToast("면담 스크립트 파일을 먼저 업로드해 주세요.");
    return;
  }

  if (!sampleCount) {
    showToast("면담록 작성 양식 샘플 파일을 먼저 업로드해 주세요.");
    return;
  }

  report.scriptLoading = true;
  report.templateLoading = true;
  report.scriptProgress = report.scriptText.trim() ? 100 : 18;
  report.templateProgress = templateSamples.every((sample) => sample.text) ? 100 : 18;
  report.scriptStatus = report.scriptText.trim()
    ? "저장된 스크립트 텍스트를 사용합니다."
    : `${report.scriptFile?.name || report.scriptFileName || "스크립트 파일"} 내용을 읽는 중입니다.`;
  report.templateStatus = "저장된 면담록 샘플을 분석하는 중입니다.";
  report.status = "면담 스크립트와 샘플 파일을 분석하는 중입니다.";
  renderInterviewReport();

  try {
    await waitForUiPaint();

    if (!report.scriptText.trim()) {
      const scriptResult = await readStoredInterviewReportUploadText(report.scriptFile, "면담 스크립트");
      report.scriptText = scriptResult.text;
      report.scriptStatus = `${report.scriptFile?.name || report.scriptFileName || "스크립트 파일"} 내용을 읽었습니다. (${scriptResult.text.length.toLocaleString("ko-KR")}자)`;
      report.scriptProgress = 100;
      renderInterviewReport();
    }

    const extractedSamples = [];

    for (let index = 0; index < templateSamples.length; index += 1) {
      const sample = templateSamples[index];

      if (sample.text) {
        extractedSamples.push(sample);
        continue;
      }

      report.templateProgress = Math.max(24, Math.round(((index + 1) / templateSamples.length) * 92));
      report.templateStatus = `${index + 1}/${templateSamples.length} ${sample.name} 샘플 내용을 읽는 중입니다.`;
      renderInterviewReport();

      const sampleResult = await readStoredInterviewReportUploadText(sample, `면담록 샘플 ${sample.name}`);
      extractedSamples.push({
        ...sample,
        text: sampleResult.text,
        profile: analyzeInterviewTemplateProfile(sampleResult.text, sample.name)
      });
    }

    report.templateSamples = extractedSamples;
    templateSamples = getInterviewTemplateSamples(report);
    report.templateProgress = 100;
    report.templateStatus = `면담록 샘플 ${templateSamples.length}개 내용을 읽었습니다.`;
  } catch (error) {
    console.warn("Interview report generation file read failed.", error);
    report.status = error.isResumeParseError ? error.message : "면담록 보고서 생성 중 파일을 읽지 못했습니다.";
    report.scriptLoading = false;
    report.templateLoading = false;
    report.scriptProgress = report.scriptText.trim() ? 100 : 0;
    report.templateProgress = templateSamples.some((sample) => sample.text) ? report.templateProgress : 0;
    renderInterviewReport();
    return;
  }

  const templateCorpus = getInterviewTemplateCorpus(report);

  if (templateCorpus) {
    report.templateProfile = analyzeInterviewTemplateProfile(templateCorpus, getInterviewTemplateSourceLabel(report));
  }

  report.reportText = buildInterviewReportText();
  report.status = sampleCount
    ? `스크립트와 면담록 샘플 ${sampleCount}개를 종합 분석해 보고서를 생성했습니다.`
    : templateCorpus
      ? "스크립트와 직접 입력 양식 기준을 분석해 보고서를 생성했습니다."
      : "스크립트 내용을 기준으로 면담록 보고서를 생성했습니다.";
  report.scriptLoading = false;
  report.templateLoading = false;
  report.scriptProgress = 100;
  report.templateProgress = 100;
  persistState({ skipRemoteSync: true });
  addAuditLog("면담록 보고서 생성", "면담록 생성", `스크립트 및 샘플 ${sampleCount}개 기반 보고서 생성`);
  renderInterviewReport();
}

function buildInterviewReportWordHtml() {
  const report = getInterviewReportState();
  const templateProfile = getInterviewTemplateProfile(report);
  const generatedAt = getTimestampText();
  const paragraphs = normalizePolicyText(report.reportText)
    .split("\n")
    .map((line) => line.trim())
    .map((line) => {
      if (!line) {
        return "<br>";
      }

      if (/^\d+\./.test(line)) {
        return `<h2>${escapeHtml(line)}</h2>`;
      }

      if (line === "면담록 보고서") {
        return `<h1>${escapeHtml(line)}</h1>`;
      }

      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("");

  return [
    "<!doctype html><html><head><meta charset=\"utf-8\"><style>",
    "@page { size: A4; margin: 18mm 18mm; }",
    `body { font-family:'${escapeHtml(templateProfile.fontFamily || "Malgun Gothic")}',Arial,sans-serif; color:#111827; font-size:${Number(templateProfile.fontSizePt || 10.5)}pt; line-height:${Number(templateProfile.lineHeight || 1.6)}; }`,
    "h1 { font-size:20pt; margin:0 0 12px; border-bottom:2px solid #111827; padding-bottom:10px; }",
    "h2 { font-size:13pt; margin:18px 0 8px; color:#111827; }",
    "p { margin:0 0 6px; max-width: 72ch; }",
    ".meta { color:#6b7280; font-size:9pt; margin-bottom:16px; }",
    "</style></head><body>",
    `<div class=\"meta\">생성 시각 ${escapeHtml(generatedAt)} KST</div>`,
    paragraphs,
    "</body></html>"
  ].join("");
}

function downloadInterviewReportDocument() {
  const report = getInterviewReportState();

  if (!report.reportText.trim()) {
    showToast("다운로드할 면담록 보고서가 없습니다.");
    return;
  }

  const blob = new Blob([buildInterviewReportWordHtml()], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `면담록_보고서_${getTodayDate()}.doc`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  addAuditLog("면담록 보고서 다운로드", "면담록 생성", "Word 문서 다운로드");
}

function resetInterviewReport() {
  state.interviewReportPromptModalOpen = false;
  state.interviewReport = normalizeInterviewReportState();
  persistState({ skipRemoteSync: true });
  renderInterviewReport();
}

function getInterviewReportUploadLabel(upload) {
  const normalizedUpload = normalizeInterviewReportUpload(upload);

  if (!normalizedUpload) {
    return "";
  }

  return `${normalizedUpload.name}${normalizedUpload.size ? ` (${formatFileSize(normalizedUpload.size)})` : ""}`;
}

function getInterviewReportSampleRows(report) {
  return getInterviewTemplateSamples(report)
    .map((sample) => ({
      ...sample,
      readable: Boolean(sample.text || canReadInterviewReportUpload(sample))
    }));
}

function renderInterviewTemplateSampleList(report) {
  const samples = getInterviewReportSampleRows(report);

  if (!samples.length) {
    return `<div class="empty-state compact-empty">저장된 면담록 샘플이 없습니다.</div>`;
  }

  return `
    <div class="interview-template-sample-list">
      ${samples.map((sample, index) => `
        <div class="interview-template-sample-row">
          <span>
            <strong>${escapeHtml(sample.name || `샘플 ${index + 1}`)}</strong>
            <small>${escapeHtml([formatFileSize(sample.size), sample.readable ? "생성 시 분석" : "재업로드 필요"].filter(Boolean).join(" · "))}</small>
          </span>
          <button class="ghost-button danger-button compact-button" type="button" data-remove-interview-template-sample="${escapeHtml(sample.id)}">삭제</button>
        </div>
      `).join("")}
    </div>
  `;
}

function renderInterviewReportPromptModal(report) {
  if (!state.interviewReportPromptModalOpen) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-interview-report-prompt-backdrop>
      <section class="trending-modal interview-report-prompt-modal" role="dialog" aria-modal="true" aria-labelledby="interview-report-prompt-title">
        <div class="modal-header">
          <div>
            <p class="section-kicker">REPORT PROMPT</p>
            <h4 id="interview-report-prompt-title">보고서 작성 프롬프트</h4>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-interview-report-prompt>닫기</button>
        </div>
        <label class="field">
          <span>작성 지시사항</span>
          <textarea id="interview-report-prompt" class="control-textarea" rows="8" placeholder="예: 임원 보고용으로 핵심 역량, 리스크, 후속 확인 사항을 간결하게 정리">${escapeHtml(report.prompt || "")}</textarea>
        </label>
        <div class="modal-actions">
          <button class="primary-button" type="button" data-close-interview-report-prompt>저장</button>
        </div>
      </section>
    </div>
  `;
}

function renderInterviewReport() {
  const container = $("#interview-report-content");

  if (!container) {
    return;
  }

  const report = getInterviewReportState();
  const samples = getInterviewReportSampleRows(report);
  const hasScript = Boolean(report.scriptText.trim() || canReadInterviewReportUpload(report.scriptFile));
  const hasSamples = samples.some((sample) => sample.readable);
  const isBusy = Boolean(report.scriptLoading || report.templateLoading || report.reportLoading);
  const canGenerateReport = hasScript && hasSamples && !isBusy;
  const generateButtonText = report.reportLoading
    ? `생성 중 ${Math.max(0, Math.min(100, Math.round(Number(report.reportProgress) || 0)))}%`
    : "면담록 보고서 생성";
  const scriptStatus = report.scriptStatus || getInterviewReportUploadLabel(report.scriptFile) || "파일을 선택하거나 드래그앤드랍";
  const templateStatus = report.templateStatus || (samples.length ? `저장된 샘플 ${samples.length}개` : "복수 샘플 선택 가능");

  container.innerHTML = `
    <div class="report-workspace">
      <section class="content-panel report-input-panel">
        <div class="panel-header">
          <div>
            <h4>면담 스크립트</h4>
            <span>스크립트 파일과 면담록 작성 우수사례 샘플을 업로드하면 보고서를 생성할 수 있습니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-reset-interview-report>초기화</button>
        </div>
        <div class="interview-report-grid">
          <div class="dropzone report-upload-box">
            <input id="interview-report-script-file" type="file" accept=".txt,.pdf,.doc,.docx,.hwp,.hwpx" />
            <strong>스크립트 파일 업로드</strong>
            <span class="report-upload-status">${renderMaybeProgressStatus(scriptStatus, report.scriptLoading, report.scriptProgress)}</span>
          </div>
          <div class="dropzone report-upload-box">
            <input id="interview-report-template-file" type="file" accept=".txt,.pdf,.doc,.docx,.hwp,.hwpx" multiple />
            <strong>면담록 작성 양식 샘플 업로드</strong>
            <span class="report-upload-status">${renderMaybeProgressStatus(templateStatus, report.templateLoading, report.templateProgress)}</span>
          </div>
        </div>
        <div class="report-prompt-row">
          <button class="ghost-button" type="button" data-open-interview-report-prompt>보고서 작성 프롬프트</button>
          <span>${escapeHtml(report.prompt ? "작성 프롬프트가 저장되어 있습니다." : "필요 시 보고서 작성 방향을 추가로 입력할 수 있습니다.")}</span>
        </div>
        ${renderInterviewTemplateSampleList(report)}
        <div class="member-actions">
          <button class="primary-button" type="button" data-generate-interview-report ${canGenerateReport ? "" : "disabled"}>${escapeHtml(generateButtonText)}</button>
          <button class="ghost-button" type="button" data-download-interview-report ${report.reportText ? "" : "disabled"}>Word 다운로드</button>
        </div>
        ${report.status ? `<p class="job-fit-inline-status">${escapeHtml(report.status)}</p>` : ""}
      </section>
      <section class="content-panel generated-report-panel">
        <div class="panel-header">
          <div>
            <h4>생성된 면담록 보고서</h4>
            <span>필요 시 문구를 직접 다듬은 후 다운로드할 수 있습니다.</span>
          </div>
        </div>
        ${renderInterviewReportGenerationStatus(report)}
        <textarea id="interview-report-output" class="control-textarea report-output-textarea" rows="22" placeholder="면담록 보고서 생성 결과가 여기에 표시됩니다.">${escapeHtml(report.reportText || "")}</textarea>
      </section>
      ${renderInterviewReportPromptModal(report)}
    </div>
  `;
}

async function loadInterviewReportFile(file, field) {
  if (!file) {
    return;
  }

  const report = getInterviewReportState();
  const isScript = field === "script";
  const upload = createInterviewReportStoredUpload(file);

  if (!upload) {
    showToast("파일을 저장하지 못했습니다. 다시 선택해주세요.");
    return;
  }

  if (isScript) {
    report.scriptFile = upload;
    report.scriptFileName = upload.name;
    report.scriptText = "";
    report.scriptProgress = 100;
    report.scriptLoading = false;
    report.scriptStatus = `${upload.name} 스크립트 파일을 저장했습니다.`;
    report.status = "스크립트 파일이 저장되었습니다. 보고서 생성 버튼을 누르면 내용을 읽어 분석합니다.";
  } else {
    const sample = normalizeInterviewTemplateSample({
      id: upload.id,
      name: upload.name,
      size: upload.size,
      type: upload.type,
      storeKey: upload.storeKey,
      text: "",
      uploadedAt: upload.uploadedAt
    });

    if (sample) {
      report.templateSamples = [
        ...getInterviewTemplateSamples(report).filter((item) => item.id !== sample.id),
        sample
      ];
    }

    report.templateProgress = 100;
    report.templateLoading = false;
    report.templateProfile = null;
    report.templateStatus = `${upload.name} 샘플 파일을 저장했습니다.`;
    report.status = `면담록 작성 우수사례 샘플 ${getInterviewTemplateSamples(report).length}개가 저장되었습니다.`;
  }

  report.reportText = "";
  persistState({ skipRemoteSync: true });
  renderInterviewReport();
}

async function loadInterviewReportTemplateFiles(fileList) {
  const files = [...(fileList || [])].filter((file) => file && file.size);

  if (!files.length) {
    return;
  }

  const report = getInterviewReportState();
  const samples = files
    .map((file) => {
      const upload = createInterviewReportStoredUpload(file);

      if (!upload) {
        return null;
      }

      return normalizeInterviewTemplateSample({
        id: upload.id,
        name: upload.name,
        size: upload.size,
        type: upload.type,
        storeKey: upload.storeKey,
        text: "",
        uploadedAt: upload.uploadedAt
      });
    })
    .filter(Boolean);

  if (!samples.length) {
    showToast("샘플 파일을 저장하지 못했습니다. 다시 선택해주세요.");
    return;
  }

  const existing = getInterviewTemplateSamples(report);
  const merged = [...existing];

  samples.forEach((sample) => {
    const index = merged.findIndex((item) => item.id === sample.id || item.name === sample.name);

    if (index >= 0) {
      merged[index] = sample;
      return;
    }

    merged.push(sample);
  });

  report.templateSamples = merged;
  report.templateLoading = false;
  report.templateProgress = 100;
  report.templateProfile = null;
  report.templateStatus = `면담록 작성 우수사례 샘플 ${samples.length}개를 저장했습니다. 총 ${merged.length}개 샘플이 준비되었습니다.`;
  report.status = "샘플 파일이 저장되었습니다. 보고서 생성 버튼을 누르면 스크립트와 함께 분석합니다.";
  report.reportText = "";
  persistState({ skipRemoteSync: true });
  renderInterviewReport();
}

function extractInterviewReportSectionTitles(templateText = "") {
  return normalizePolicyText(templateText)
    .split("\n")
    .map((line) => line.replace(/^[-*#\d.)\s]+/, "").trim())
    .filter((line) => line.length >= 2 && line.length <= 28)
    .filter((line) => /(개요|요약|평가|역량|경험|리스크|확인|의견|종합|면담|후속|검토)/.test(line))
    .filter((line, index, array) => array.indexOf(line) === index)
    .slice(0, 5);
}

function splitInterviewReportSentences(text = "") {
  return normalizePolicyText(text)
    .split(/\n+|(?<=[.!?。]|다\.|요\.|음\.)\s+/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, INTERVIEW_REPORT_MAX_SENTENCES);
}

function trimInterviewReportAnalysisText(text = "", maxChars = INTERVIEW_REPORT_MAX_SCRIPT_CHARS) {
  const normalized = normalizePolicyText(text);

  if (!normalized || normalized.length <= maxChars) {
    return {
      text: normalized,
      truncated: false,
      originalLength: normalized.length
    };
  }

  const headLength = Math.round(maxChars * 0.72);
  const tailLength = maxChars - headLength;
  const head = normalized.slice(0, headLength).trim();
  const tail = normalized.slice(-tailLength).trim();

  return {
    text: `${head}\n\n[중간부 일부 생략: 원문 ${normalized.length.toLocaleString()}자 중 보고서 생성용 핵심 구간만 분석]\n\n${tail}`.trim(),
    truncated: true,
    originalLength: normalized.length
  };
}

function getInterviewReportTextLimitNotice(kind, result) {
  if (!result?.truncated) {
    return "";
  }

  return `${kind} 원문이 ${result.originalLength.toLocaleString()}자로 길어 보고서 생성용 핵심 구간 ${result.text.length.toLocaleString()}자만 우선 분석했습니다.`;
}

function setInterviewReportProgress(report, area, percent, status = "") {
  const progressKey = area === "template" ? "templateProgress" : "scriptProgress";
  const statusKey = area === "template" ? "templateStatus" : "scriptStatus";

  report[progressKey] = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));

  if (status) {
    report[statusKey] = status;
  }
}

function startInterviewReportProgressPulse(report, area, start, end, status) {
  setInterviewReportProgress(report, area, start, status);
  renderInterviewReport();

  if (typeof window === "undefined" || typeof window.setInterval !== "function") {
    return () => {};
  }

  let current = start;
  const step = Math.max(1, Math.round((end - start) / 8));
  const timer = window.setInterval(() => {
    current = Math.min(end, current + step);
    setInterviewReportProgress(report, area, current, status);
    renderInterviewReport();

    if (current >= end) {
      window.clearInterval(timer);
    }
  }, 900);

  return () => {
    window.clearInterval(timer);
  };
}

function setInterviewReportGenerationProgress(report, percent, message = "") {
  report.reportProgress = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));

  if (message) {
    report.status = message;
    report.generationLogs = [
      ...(Array.isArray(report.generationLogs) ? report.generationLogs : []),
      message
    ].filter(Boolean).slice(-8);
  }
}

function renderInterviewReportGenerationStatus(report) {
  const logs = Array.isArray(report.generationLogs) ? report.generationLogs.filter(Boolean) : [];

  if (!report.reportLoading && !logs.length) {
    return "";
  }

  return `
    <div class="report-generation-status ${report.reportLoading ? "is-loading" : ""}">
      <div class="report-generation-head">
        <strong>${report.reportLoading ? "면담록 보고서 생성 중" : "면담록 보고서 생성 상태"}</strong>
        <span>${renderMaybeProgressStatus(report.status || "보고서 생성 상태를 확인 중입니다.", report.reportLoading, report.reportProgress)}</span>
      </div>
      ${logs.length ? `
        <ol class="report-generation-log">
          ${logs.map((log) => `<li>${escapeHtml(log)}</li>`).join("")}
        </ol>
      ` : ""}
    </div>
  `;
}

function buildInterviewReportApiPayload(report, loadedSamples) {
  return {
    scriptText: normalizePolicyText(report.scriptText || ""),
    prompt: normalizePolicyText(report.prompt || ""),
    templates: loadedSamples
      .filter((sample) => sample && sample.text)
      .slice(0, 5)
      .map((sample) => ({
        name: sample.name || sample.fileName || "면담록 샘플",
        text: normalizePolicyText(sample.text || ""),
        profile: sample.profile || null
      }))
  };
}

async function generateInterviewReportWithAi(report, loadedSamples) {
  const response = await fetch("/api/jd-enhance?feature=interview-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(buildInterviewReportApiPayload(report, loadedSamples))
  });
  const responseText = await response.text();
  let payload = null;

  try {
    payload = JSON.parse(responseText);
  } catch (error) {
    throw new Error(`면담록 보고서 API 응답이 JSON이 아닙니다. ${response.status} ${responseText.slice(0, 120)}`);
  }

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || "면담록 보고서 AI 생성에 실패했습니다.");
  }

  return payload;
}

function buildInterviewReportText() {
  const report = getInterviewReportState();
  const scriptText = normalizePolicyText(report.scriptText || "");
  const templateCorpus = getInterviewTemplateCorpus(report);
  const sentences = splitInterviewReportSentences(scriptText);
  const sectionTitles = extractInterviewReportSectionTitles(templateCorpus);
  const promptLine = report.prompt ? `작성 프롬프트: ${report.prompt}` : "작성 프롬프트: 우수사례 샘플의 구조를 참고해 핵심 내용 중심으로 정리";
  const summaryLines = sentences.slice(0, 4);
  const evidenceLines = sentences.filter((line) => line.length >= 18).slice(0, 5);
  const riskLines = sentences
    .filter((line) => /(확인|검토|보완|우려|리스크|추가|필요|조건|질문|협의)/.test(line))
    .slice(0, 4);
  const sections = [
    {
      title: sectionTitles[0] || "1. 면담 개요",
      lines: summaryLines.length ? summaryLines : ["면담 스크립트의 주요 내용을 확인할 수 없습니다."]
    },
    {
      title: sectionTitles[1] || "2. 핵심 발언 및 확인 내용",
      lines: evidenceLines.length ? evidenceLines : summaryLines
    },
    {
      title: sectionTitles[2] || "3. 후보자 역량 및 경험 판단",
      lines: evidenceLines.slice(0, 3).map((line) => `${line} 근거로 직무 관련 경험과 설명 내용을 확인`)
    },
    {
      title: sectionTitles[3] || "4. 리스크 및 추가 확인 사항",
      lines: riskLines.length ? riskLines : ["추가 확인이 필요한 특이 리스크는 스크립트상 명확히 확인되지 않음"]
    },
    {
      title: sectionTitles[4] || "5. 종합 의견",
      lines: [
        "면담 내용의 핵심 발언, 경험 근거, 추가 확인 사항을 중심으로 정리",
        "최종 판단 전 직무 요구사항과 면접 평가 결과를 함께 교차 검토 필요"
      ]
    }
  ];

  return [
    "면담록 보고서",
    "",
    promptLine,
    templateCorpus ? `참고 샘플: ${getInterviewTemplateSamples(report).length}개 우수사례 양식 참고` : "참고 샘플: 없음",
    "",
    ...sections.flatMap((section) => [
      section.title,
      ...section.lines.filter(Boolean).slice(0, 6).map((line) => `- ${line}`),
      ""
    ])
  ].join("\n").trim();
}

async function generateInterviewReport() {
  const report = getInterviewReportState();
  const samples = getInterviewReportSampleRows(report);

  if (!report.scriptText.trim() && !canReadInterviewReportUpload(report.scriptFile)) {
    showToast("면담 스크립트 파일을 먼저 업로드해 주세요.");
    return;
  }

  if (!samples.some((sample) => sample.readable)) {
    showToast("면담록 작성 우수사례 샘플 파일을 먼저 업로드해 주세요.");
    return;
  }

  report.scriptLoading = true;
  report.templateLoading = true;
  report.scriptProgress = report.scriptText.trim() ? 52 : 24;
  report.templateProgress = 12;
  report.scriptStatus = report.scriptText.trim()
    ? "입력된 스크립트를 분석용으로 정리하는 중입니다."
    : `${report.scriptFile?.name || "스크립트 파일"} 텍스트를 추출하는 중입니다.`;
  report.templateStatus = "면담록 샘플 분석을 준비하는 중입니다.";
  report.status = "면담 스크립트와 우수사례 샘플을 분석하는 중입니다.";
  renderInterviewReport();
  await waitForUiPaint();

  try {
    const notices = [];

    if (!report.scriptText.trim()) {
      const stopScriptPulse = startInterviewReportProgressPulse(
        report,
        "script",
        24,
        48,
        `${report.scriptFile?.name || "스크립트 파일"} 텍스트를 추출하는 중입니다.`
      );
      let result;

      try {
        result = await readStoredInterviewReportUploadText(report.scriptFile, "면담 스크립트");
      } finally {
        stopScriptPulse();
      }

      const preparedScript = trimInterviewReportAnalysisText(result.text, INTERVIEW_REPORT_MAX_SCRIPT_CHARS);
      const limitNotice = getInterviewReportTextLimitNotice("스크립트", preparedScript);

      if (limitNotice) {
        notices.push(limitNotice);
      }

      report.scriptText = preparedScript.text;
      report.scriptProgress = 58;
      report.scriptStatus = limitNotice || `${report.scriptFile?.name || "스크립트 파일"} 내용을 읽었습니다.`;
      renderInterviewReport();
      await waitForUiPaint();
    } else {
      const preparedScript = trimInterviewReportAnalysisText(report.scriptText, INTERVIEW_REPORT_MAX_SCRIPT_CHARS);
      const limitNotice = getInterviewReportTextLimitNotice("스크립트", preparedScript);

      if (limitNotice) {
        notices.push(limitNotice);
      }

      report.scriptText = preparedScript.text;
      report.scriptProgress = 58;
      report.scriptStatus = limitNotice || "입력된 스크립트를 분석용으로 정리했습니다.";
      renderInterviewReport();
      await waitForUiPaint();
    }

    const loadedSamples = [];

    for (let index = 0; index < samples.length; index += 1) {
      const sample = samples[index];
      const baseProgress = Math.max(20, Math.round((index / samples.length) * 72) + 18);

      report.templateProgress = baseProgress;
      report.templateStatus = `${index + 1}/${samples.length}개 샘플 텍스트 추출 중`;
      renderInterviewReport();
      await waitForUiPaint();

      if (sample.text) {
        const preparedSample = trimInterviewReportAnalysisText(sample.text, INTERVIEW_REPORT_MAX_TEMPLATE_CHARS);
        loadedSamples.push({
          ...sample,
          text: preparedSample.text,
          profile: analyzeInterviewTemplateProfile(preparedSample.text, sample.name)
        });
      } else if (sample.readable) {
        const stopTemplatePulse = startInterviewReportProgressPulse(
          report,
          "template",
          baseProgress,
          Math.min(86, baseProgress + 18),
          `${index + 1}/${samples.length}개 샘플 텍스트 추출 중`
        );
        let result;

        try {
          result = await readStoredInterviewReportUploadText(sample, `면담록 샘플 ${sample.name}`);
        } finally {
          stopTemplatePulse();
        }

        const preparedSample = trimInterviewReportAnalysisText(result.text, INTERVIEW_REPORT_MAX_TEMPLATE_CHARS);
        loadedSamples.push({
          ...sample,
          text: preparedSample.text,
          profile: analyzeInterviewTemplateProfile(preparedSample.text, sample.name)
        });
      }

      report.templateProgress = Math.max(35, Math.round(((index + 1) / samples.length) * 88));
      report.templateStatus = `${index + 1}/${samples.length}개 샘플 분석 완료`;
      renderInterviewReport();
      await waitForUiPaint();
    }

    report.templateSamples = loadedSamples;
    report.scriptProgress = 82;
    report.templateProgress = 92;
    report.status = "면담록 보고서 문안을 조립하는 중입니다.";
    renderInterviewReport();
    await waitForUiPaint();

    report.templateProfile = analyzeInterviewTemplateProfile(getInterviewTemplateCorpus(report), getInterviewTemplateSourceLabel(report));
    report.reportText = buildInterviewReportText();
    report.scriptLoading = false;
    report.templateLoading = false;
    report.scriptProgress = 100;
    report.templateProgress = 100;
    report.scriptStatus = "스크립트 분석 완료";
    report.templateStatus = `우수사례 샘플 ${loadedSamples.length}개 분석 완료`;
    report.status = [
      `스크립트와 우수사례 샘플 ${loadedSamples.length}개를 참고해 면담록 보고서를 생성했습니다.`,
      ...notices
    ].join(" ");
    persistState({ skipRemoteSync: true });
    addAuditLog("면담록 보고서 생성", "면담록 생성", `스크립트 및 샘플 ${loadedSamples.length}개 기반 보고서 생성`);
  } catch (error) {
    console.warn("Interview report generation failed.", error);
    report.scriptLoading = false;
    report.templateLoading = false;
    report.scriptProgress = report.scriptText.trim() ? report.scriptProgress : 0;
    report.templateProgress = samples.some((sample) => sample.text) ? report.templateProgress : 0;
    report.scriptStatus = report.scriptText.trim() ? report.scriptStatus : getInterviewReportUploadLabel(report.scriptFile);
    report.templateStatus = samples.length ? `저장된 샘플 ${samples.length}개` : "복수 샘플 선택 가능";
    report.status = error.isResumeParseError ? error.message : "면담록 보고서 생성 중 파일 분석에 실패했습니다.";
  }

  renderInterviewReport();
}

async function generateInterviewReport() {
  const report = getInterviewReportState();
  const samples = getInterviewReportSampleRows(report);

  if (!report.scriptText.trim() && !canReadInterviewReportUpload(report.scriptFile)) {
    showToast("면담 스크립트 파일을 먼저 업로드해 주세요.");
    return;
  }

  if (!samples.some((sample) => sample.readable)) {
    showToast("면담록 작성 우수사례 샘플 파일을 먼저 업로드해 주세요.");
    return;
  }

  report.scriptLoading = true;
  report.templateLoading = true;
  report.reportLoading = true;
  report.usedAi = false;
  report.reportText = "";
  report.generationLogs = [];
  report.scriptProgress = report.scriptText.trim() ? 56 : 18;
  report.templateProgress = 10;
  setInterviewReportGenerationProgress(report, 5, "보고서 생성 작업을 시작했습니다.");
  report.scriptStatus = report.scriptText.trim()
    ? "입력된 스크립트를 분석용으로 정리하는 중입니다."
    : `${report.scriptFile?.name || "스크립트 파일"} 텍스트를 추출하는 중입니다.`;
  report.templateStatus = "면담록 샘플 분석을 준비하는 중입니다.";
  renderInterviewReport();
  await waitForUiPaint();

  try {
    const notices = [];

    if (!report.scriptText.trim()) {
      setInterviewReportGenerationProgress(report, 12, "스크립트 파일에서 텍스트를 추출하고 있습니다.");
      const stopScriptPulse = startInterviewReportProgressPulse(
        report,
        "script",
        18,
        50,
        `${report.scriptFile?.name || "스크립트 파일"} 텍스트를 추출하는 중입니다.`
      );
      let result;

      try {
        result = await readStoredInterviewReportUploadText(report.scriptFile, "면담 스크립트");
      } finally {
        stopScriptPulse();
      }

      const preparedScript = trimInterviewReportAnalysisText(result.text, INTERVIEW_REPORT_MAX_SCRIPT_CHARS);
      const limitNotice = getInterviewReportTextLimitNotice("스크립트", preparedScript);

      if (limitNotice) {
        notices.push(limitNotice);
      }

      report.scriptText = preparedScript.text;
      report.scriptProgress = 62;
      report.scriptStatus = limitNotice || `${report.scriptFile?.name || "스크립트 파일"} 내용을 읽었습니다.`;
      setInterviewReportGenerationProgress(report, 30, `스크립트 ${report.scriptText.length.toLocaleString()}자를 분석 준비했습니다.`);
      renderInterviewReport();
      await waitForUiPaint();
    } else {
      const preparedScript = trimInterviewReportAnalysisText(report.scriptText, INTERVIEW_REPORT_MAX_SCRIPT_CHARS);
      const limitNotice = getInterviewReportTextLimitNotice("스크립트", preparedScript);

      if (limitNotice) {
        notices.push(limitNotice);
      }

      report.scriptText = preparedScript.text;
      report.scriptProgress = 62;
      report.scriptStatus = limitNotice || "입력된 스크립트를 분석용으로 정리했습니다.";
      setInterviewReportGenerationProgress(report, 30, `스크립트 ${report.scriptText.length.toLocaleString()}자를 분석 준비했습니다.`);
      renderInterviewReport();
      await waitForUiPaint();
    }

    const loadedSamples = [];

    for (let index = 0; index < samples.length; index += 1) {
      const sample = samples[index];
      const baseProgress = Math.max(18, Math.round((index / samples.length) * 55) + 25);

      report.templateProgress = baseProgress;
      report.templateStatus = `${index + 1}/${samples.length}개 샘플 텍스트 추출 중`;
      setInterviewReportGenerationProgress(report, Math.min(70, baseProgress), `${index + 1}/${samples.length}개 샘플을 읽고 있습니다.`);
      renderInterviewReport();
      await waitForUiPaint();

      if (sample.text) {
        const preparedSample = trimInterviewReportAnalysisText(sample.text, INTERVIEW_REPORT_MAX_TEMPLATE_CHARS);
        loadedSamples.push({
          ...sample,
          text: preparedSample.text,
          profile: analyzeInterviewTemplateProfile(preparedSample.text, sample.name)
        });
      } else if (sample.readable) {
        const stopTemplatePulse = startInterviewReportProgressPulse(
          report,
          "template",
          baseProgress,
          Math.min(84, baseProgress + 16),
          `${index + 1}/${samples.length}개 샘플 텍스트 추출 중`
        );
        let result;

        try {
          result = await readStoredInterviewReportUploadText(sample, `면담록 샘플 ${sample.name}`);
        } finally {
          stopTemplatePulse();
        }

        const preparedSample = trimInterviewReportAnalysisText(result.text, INTERVIEW_REPORT_MAX_TEMPLATE_CHARS);
        loadedSamples.push({
          ...sample,
          text: preparedSample.text,
          profile: analyzeInterviewTemplateProfile(preparedSample.text, sample.name)
        });
      }

      report.templateProgress = Math.max(35, Math.round(((index + 1) / samples.length) * 86));
      report.templateStatus = `${index + 1}/${samples.length}개 샘플 분석 완료`;
      renderInterviewReport();
      await waitForUiPaint();
    }

    if (!loadedSamples.length) {
      throw createResumeParseError("읽을 수 있는 면담록 샘플 텍스트가 없습니다. 샘플 파일을 다시 업로드해 주세요.");
    }

    report.templateSamples = loadedSamples;
    report.templateProfile = analyzeInterviewTemplateProfile(getInterviewTemplateCorpus(report), getInterviewTemplateSourceLabel(report));
    report.scriptProgress = 82;
    report.templateProgress = 90;
    report.templateStatus = `우수사례 샘플 ${loadedSamples.length}개 분석 완료`;
    setInterviewReportGenerationProgress(report, 74, "AI 모델로 면담록 보고서 문안을 작성하는 중입니다.");
    renderInterviewReport();
    await waitForUiPaint();

    try {
      const aiResult = await generateInterviewReportWithAi(report, loadedSamples);
      report.reportText = normalizePolicyText(aiResult.reportText || "");
      report.usedAi = true;
      setInterviewReportGenerationProgress(
        report,
        94,
        `${aiResult.model || "AI 모델"}이 스크립트 ${aiResult.chunkCount || 1}개 구간을 반영해 보고서를 작성했습니다.`
      );
    } catch (aiError) {
      console.warn("Interview report AI generation failed. Falling back to local report.", aiError);
      setInterviewReportGenerationProgress(report, 86, `AI 생성 실패: ${aiError.message || "원인 확인 필요"}`);
      setInterviewReportGenerationProgress(report, 90, "로컬 규칙 기반 보고서 초안으로 전환합니다.");
      report.reportText = buildInterviewReportText();
      report.usedAi = false;
    }

    if (!report.reportText.trim()) {
      report.reportText = buildInterviewReportText();
      report.usedAi = false;
    }

    report.scriptLoading = false;
    report.templateLoading = false;
    report.reportLoading = false;
    report.scriptProgress = 100;
    report.templateProgress = 100;
    report.reportProgress = 100;
    report.scriptStatus = "스크립트 분석 완료";
    report.templateStatus = `우수사례 샘플 ${loadedSamples.length}개 분석 완료`;
    report.status = [
      `스크립트와 우수사례 샘플 ${loadedSamples.length}개를 참고해 면담록 보고서를 생성했습니다.`,
      report.usedAi ? "AI 기반 생성 결과입니다." : "AI 응답 문제로 로컬 규칙 기반 초안을 생성했습니다.",
      ...notices
    ].filter(Boolean).join(" ");
    setInterviewReportGenerationProgress(report, 100, "면담록 보고서 생성이 완료되었습니다.");
    persistState({ skipRemoteSync: true });
    addAuditLog("면담록 보고서 생성", "면담록 생성", `스크립트 및 샘플 ${loadedSamples.length}개 기반 보고서 생성`);
  } catch (error) {
    console.warn("Interview report generation failed.", error);
    report.scriptLoading = false;
    report.templateLoading = false;
    report.reportLoading = false;
    report.reportProgress = 0;
    report.scriptProgress = report.scriptText.trim() ? report.scriptProgress : 0;
    report.templateProgress = samples.some((sample) => sample.text) ? report.templateProgress : 0;
    report.scriptStatus = report.scriptText.trim() ? report.scriptStatus : getInterviewReportUploadLabel(report.scriptFile);
    report.templateStatus = samples.length ? `저장된 샘플 ${samples.length}개` : "복수 샘플 선택 가능";
    report.status = error.isResumeParseError ? error.message : "면담록 보고서 생성 중 파일 분석 또는 AI 생성에 실패했습니다.";
    setInterviewReportGenerationProgress(report, 0, report.status);
    persistState({ skipRemoteSync: true });
  }

  renderInterviewReport();
}

function buildInterviewReportWordHtml() {
  const report = getInterviewReportState();
  const generatedAt = getTimestampText();
  const paragraphs = normalizePolicyText(report.reportText)
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return "<br>";
      }

      if (trimmed === "면담록 보고서") {
        return `<h1>${escapeHtml(trimmed)}</h1>`;
      }

      if (/^\d+\./.test(trimmed)) {
        return `<h2>${escapeHtml(trimmed)}</h2>`;
      }

      return `<p>${escapeHtml(trimmed)}</p>`;
    })
    .join("");

  return [
    "<!doctype html><html><head><meta charset=\"utf-8\"><style>",
    "@page { size: A4; margin: 18mm 18mm; }",
    "body { font-family:'Malgun Gothic',Arial,sans-serif; color:#111827; font-size:10.5pt; line-height:1.6; }",
    "h1 { font-size:20pt; margin:0 0 12px; border-bottom:2px solid #111827; padding-bottom:10px; }",
    "h2 { font-size:13pt; margin:18px 0 8px; }",
    "p { margin:0 0 6px; }",
    ".meta { color:#6b7280; font-size:9pt; margin-bottom:16px; }",
    "</style></head><body>",
    `<div class=\"meta\">생성 시각 ${escapeHtml(generatedAt)} KST</div>`,
    paragraphs,
    "</body></html>"
  ].join("");
}

function downloadInterviewReportDocument() {
  const report = getInterviewReportState();

  if (!report.reportText.trim()) {
    showToast("다운로드할 면담록 보고서가 없습니다.");
    return;
  }

  const blob = new Blob([buildInterviewReportWordHtml()], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `면담록_보고서_${getTodayDate()}.doc`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  addAuditLog("면담록 보고서 다운로드", "면담록 생성", "Word 문서 다운로드");
}

function removeInterviewTemplateSample(sampleId) {
  const report = getInterviewReportState();
  const removed = getInterviewTemplateSamples(report).find((sample) => sample.id === sampleId);

  if (removed?.storeKey) {
    interviewReportFileStore.delete(removed.storeKey);
  }

  report.templateSamples = getInterviewTemplateSamples(report).filter((sample) => sample.id !== sampleId);
  report.templateProfile = null;
  report.templateStatus = report.templateSamples.length
    ? `면담록 샘플 ${report.templateSamples.length}개가 저장되어 있습니다.`
    : "저장된 면담록 샘플이 없습니다.";
  report.reportText = "";
  persistState({ skipRemoteSync: true });
  renderInterviewReport();
}

function resetInterviewReport() {
  interviewReportFileStore.clear();
  state.interviewReportPromptModalOpen = false;
  state.interviewReport = normalizeInterviewReportState();
  persistState({ skipRemoteSync: true });
  renderInterviewReport();
}

function getRecruitingMetricsState() {
  state.recruitingMetrics = normalizeRecruitingMetricsState(state.recruitingMetrics);
  return state.recruitingMetrics;
}

function canEditRecruitingMetricsUnit(unit) {
  const member = getCurrentMember();
  const normalizedUnit = normalizeBusinessUnit(unit);

  if (isAdmin(member) || member?.role === "division_recruiter") {
    return true;
  }

  return member?.role === "business_recruiter" && getMemberBusinessUnit(member) === normalizedUnit;
}

function getRecruitingMetricInterviewCases(unit) {
  return state.interviewCases
    .map(normalizeInterviewCase)
    .filter((interviewCase) => normalizeBusinessUnit(interviewCase.businessUnit) === unit);
}

function getRecruitingMetricsRows() {
  const metrics = getRecruitingMetricsState();
  syncRecruitingTargetsFromProgressSheet(metrics);

  return BUSINESS_UNITS.map((unit) => {
    const target = metrics.targets[unit] || {};
    const cases = getRecruitingMetricInterviewCases(unit);
    const offerSigned = cases.filter((item) => item.offerSignedAt).length;
    const joined = cases.filter((item) => item.joinedAt).length;
    const hiringTarget = Number(target.hiringTarget || 0) || 0;
    const ratio = hiringTarget ? Math.round((offerSigned / hiringTarget) * 1000) / 10 : 0;

    return {
      unit,
      hiringTarget,
      keyTalentTarget: Number(target.keyTalentTarget || 0) || 0,
      offerSigned,
      joined,
      ratio,
      weeklyNote: target.weeklyNote || "",
      completed: Boolean(target.completed),
      completedAt: target.completedAt || "",
      completedBy: target.completedBy || ""
    };
  });
}

function renderRecruitingMetrics() {
  const container = $("#recruiting-metrics-content");

  if (!container) {
    return;
  }

  const metrics = getRecruitingMetricsState();
  const rows = getRecruitingMetricsRows();
  const recipientsText = metrics.recipients.join("\n");

  container.innerHTML = `
    <div class="metrics-workspace">
      <section class="content-panel">
        <div class="panel-header">
          <div>
            <h4>주간 채용 지표 취합</h4>
            <span>오퍼서명 완료 인원은 Interview 메뉴에서 자동 반영됩니다.</span>
          </div>
          <div class="job-fit-result-actions">
            <button class="ghost-button compact-button" type="button" data-download-recruiting-metrics>엑셀 다운로드</button>
            <button class="primary-button compact-button" type="button" data-send-recruiting-metrics>취합 메일 발송</button>
          </div>
        </div>
        <div class="metrics-control-grid">
          <label class="field">
            <span>취합 기준 주</span>
            <input id="recruiting-metrics-week" class="control-input" type="date" value="${inputValue(metrics.weekOf)}" />
          </label>
          <label class="field">
            <span>메일 제목</span>
            <input id="recruiting-metrics-subject" class="control-input" value="${inputValue(metrics.subject)}" />
          </label>
          <label class="field">
            <span>부문 담당자 메일 수신처</span>
            <textarea id="recruiting-metrics-recipients" class="control-textarea compact-textarea" rows="3" placeholder="여러 명은 줄바꿈 또는 쉼표로 입력">${escapeHtml(recipientsText)}</textarea>
          </label>
          <label class="compact-check metrics-auto-send-check">
            <input id="recruiting-metrics-auto-send" type="checkbox" ${metrics.autoSendOnComplete ? "checked" : ""} />
            <span>전체 취합 완료 시 자동 발송</span>
          </label>
        </div>
        ${metrics.mailStatus ? `<p class="job-fit-inline-status">${escapeHtml(metrics.mailStatus)}</p>` : ""}
        <div class="table-scroll metrics-table-wrap">
          <table class="metrics-table">
            <thead>
              <tr>
                <th>사업부</th>
                <th>당해 채용 목표</th>
                <th>핵심인력 목표</th>
                <th>확보 수</th>
                <th>입사 완료 수</th>
                <th>달성률</th>
                <th>작성 완료</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => {
                const editable = canEditRecruitingMetricsUnit(row.unit);

                return `
                  <tr>
                    <th>${escapeHtml(row.unit)}</th>
                    <td><input class="control-input compact-input" type="number" min="0" value="${inputValue(row.hiringTarget)}" data-recruiting-target-field="hiringTarget" data-recruiting-unit="${escapeHtml(row.unit)}" ${editable ? "" : "disabled"} /></td>
                    <td><input class="control-input compact-input" type="number" min="0" value="${inputValue(row.keyTalentTarget)}" data-recruiting-target-field="keyTalentTarget" data-recruiting-unit="${escapeHtml(row.unit)}" ${editable ? "" : "disabled"} /></td>
                    <td><strong>${escapeHtml(row.offerSigned)}</strong></td>
                    <td><strong>${escapeHtml(row.joined)}</strong></td>
                    <td><span class="status-chip chip-blue">${escapeHtml(row.ratio)}%</span></td>
                    <td>
                      <label class="compact-check">
                        <input type="checkbox" data-recruiting-complete="${escapeHtml(row.unit)}" ${row.completed ? "checked" : ""} ${editable ? "" : "disabled"} />
                        <span>${row.completed ? "완료" : "진행 중"}</span>
                      </label>
                      ${row.completedAt ? `<small>${escapeHtml(row.completedAt)} · ${escapeHtml(row.completedBy || "-")}</small>` : ""}
                    </td>
                    <td><textarea class="control-textarea compact-textarea metrics-note-input" rows="2" data-recruiting-target-field="weeklyNote" data-recruiting-unit="${escapeHtml(row.unit)}" ${editable ? "" : "disabled"}>${escapeHtml(row.weeklyNote)}</textarea></td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function updateRecruitingMetricsField(field, value) {
  const metrics = getRecruitingMetricsState();

  if (field === "recipients") {
    metrics.recipients = normalizeEmailList(value);
  } else {
    metrics[field] = String(value || "").trim();
  }

  if (field === "weekOf") {
    metrics.lastAutoSentWeek = "";
  }

  persistState({ skipRemoteSync: true });
}

function updateRecruitingTargetField(input) {
  const metrics = getRecruitingMetricsState();
  const unit = normalizeBusinessUnit(input.dataset.recruitingUnit);
  const field = input.dataset.recruitingTargetField;

  if (!unit || !metrics.targets[unit] || !canEditRecruitingMetricsUnit(unit)) {
    return;
  }

  metrics.targets[unit][field] = field === "weeklyNote" ? input.value : Number(input.value || 0) || 0;
  persistState({ skipRemoteSync: true });
}

function toggleRecruitingMetricsComplete(input) {
  const metrics = getRecruitingMetricsState();
  const unit = normalizeBusinessUnit(input.dataset.recruitingComplete);

  if (!unit || !metrics.targets[unit] || !canEditRecruitingMetricsUnit(unit)) {
    return;
  }

  metrics.targets[unit].completed = input.checked;
  metrics.targets[unit].completedAt = input.checked ? getTimestampText() : "";
  metrics.targets[unit].completedBy = input.checked ? getCurrentMember()?.name || "시스템" : "";
  persistState();
  renderRecruitingMetrics();
  maybeAutoSendRecruitingMetrics();
}

function buildRecruitingMetricsExcelHtml() {
  const rows = getRecruitingMetricsRows();
  const metrics = getRecruitingMetricsState();

  return [
    "<html><head><meta charset=\"utf-8\"><style>",
    "table{border-collapse:collapse;font-family:'Malgun Gothic',Arial,sans-serif;font-size:11pt}th,td{border:1px solid #d1d5db;padding:8px;text-align:left}th{background:#eef4ff;font-weight:700}.num{text-align:right}",
    "</style></head><body>",
    `<h2>주간 채용 지표 취합 (${escapeHtml(metrics.weekOf)})</h2>`,
    "<table>",
    "<thead><tr><th>사업부</th><th>당해 채용 목표</th><th>핵심인력 목표</th><th>확보 수</th><th>입사 완료 수</th><th>달성률</th><th>작성 완료</th><th>비고</th></tr></thead>",
    "<tbody>",
    rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.unit)}</td>
        <td class="num">${escapeHtml(row.hiringTarget)}</td>
        <td class="num">${escapeHtml(row.keyTalentTarget)}</td>
        <td class="num">${escapeHtml(row.offerSigned)}</td>
        <td class="num">${escapeHtml(row.joined)}</td>
        <td class="num">${escapeHtml(row.ratio)}%</td>
        <td>${row.completed ? "완료" : "진행 중"}</td>
        <td>${escapeHtml(row.weeklyNote)}</td>
      </tr>
    `).join(""),
    "</tbody></table></body></html>"
  ].join("");
}

function downloadRecruitingMetricsExcel() {
  const metrics = getRecruitingMetricsState();
  const blob = new Blob([buildRecruitingMetricsExcelHtml()], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `채용지표_${metrics.weekOf || getTodayDate()}.xls`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  addAuditLog("채용 지표 엑셀 다운로드", "채용 지표", metrics.weekOf || getTodayDate());
}

async function sendRecruitingMetricsMail() {
  const metrics = getRecruitingMetricsState();
  metrics.mailStatus = "채용 지표 메일을 발송 중입니다.";
  renderRecruitingMetrics();

  try {
    const recipients = normalizeEmailList(metrics.recipients);

    if (!recipients.length) {
      throw new Error("부문 담당자 메일 수신처를 입력해 주세요.");
    }

    const response = await fetch("/api/recruiting-metrics-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipients,
        subject: metrics.subject || "[TalentHub] 주간 채용 지표 취합",
        weekOf: metrics.weekOf,
        html: buildRecruitingMetricsExcelHtml(),
        rows: getRecruitingMetricsRows()
      })
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "메일 발송에 실패했습니다.");
    }

    metrics.mailStatus = `채용 지표 메일을 발송했습니다. (${recipients.length}명)`;
    metrics.lastAutoSentWeek = metrics.weekOf || getTodayDate();
    addAuditLog("채용 지표 메일 발송", "채용 지표", recipients.join(", "));
  } catch (error) {
    console.warn(error);
    metrics.mailStatus = error.message || "채용 지표 메일 발송 중 오류가 발생했습니다.";
  }

  persistState();
  renderRecruitingMetrics();
}

function maybeAutoSendRecruitingMetrics() {
  const metrics = getRecruitingMetricsState();

  if (!metrics.autoSendOnComplete || metrics.lastAutoSentWeek === metrics.weekOf) {
    return;
  }

  const rows = getRecruitingMetricsRows();
  const allCompleted = rows.length > 0 && rows.every((row) => row.completed);

  if (!allCompleted) {
    return;
  }

  sendRecruitingMetricsMail();
}

function syncRecruitingTargetsFromProgressSheet(metrics = getRecruitingMetricsState()) {
  const sheet = metrics.progressSheet;

  if (!sheet?.columns?.length || !sheet?.rows?.length) {
    return;
  }

  const indexes = getRecruitingProgressColumnIndexes(sheet);

  if (indexes.unit < 0) {
    return;
  }

  sheet.rows.forEach((row) => {
    const unit = normalizeBusinessUnit(row.cells[indexes.unit]);

    if (!unit || !metrics.targets[unit]) {
      return;
    }

    if (indexes.hiringTarget >= 0) {
      metrics.targets[unit].hiringTarget = Number(String(row.cells[indexes.hiringTarget] || "").replace(/[^\d.]/g, "")) || 0;
    }

    if (indexes.keyTalentTarget >= 0) {
      metrics.targets[unit].keyTalentTarget = Number(String(row.cells[indexes.keyTalentTarget] || "").replace(/[^\d.]/g, "")) || 0;
    }

    if (indexes.completed >= 0) {
      const completed = /완료|done|complete/i.test(String(row.cells[indexes.completed] || ""));
      metrics.targets[unit].completed = completed;
      metrics.targets[unit].completedAt = completed
        ? metrics.targets[unit].completedAt || getTimestampText()
        : "";
      metrics.targets[unit].completedBy = completed
        ? metrics.targets[unit].completedBy || getCurrentMember()?.name || "시스템"
        : "";
    }

    if (indexes.weeklyNote >= 0) {
      metrics.targets[unit].weeklyNote = row.cells[indexes.weeklyNote] || "";
    }
  });
}

function getRecruitingMetricsActiveTab() {
  const metrics = getRecruitingMetricsState();
  return RECRUITING_METRICS_TABS.some((tab) => tab.key === metrics.activeTab)
    ? metrics.activeTab
    : "details";
}

function getRecruitingMetricsTabLabel(sheetKey = getRecruitingMetricsActiveTab()) {
  return RECRUITING_METRICS_TABS.find((tab) => tab.key === sheetKey)?.label || "채용 지표";
}

function getRecruitingMetricsSheet(sheetKey = getRecruitingMetricsActiveTab()) {
  const metrics = getRecruitingMetricsState();
  return sheetKey === "progress" ? metrics.progressSheet : metrics.detailSheet;
}

function syncRecruitingProgressSheetComputedValues(metrics = getRecruitingMetricsState()) {
  const sheet = metrics.progressSheet;

  if (!sheet?.columns?.length || !sheet?.rows?.length) {
    return;
  }

  const indexes = getRecruitingProgressColumnIndexes(sheet);

  if (indexes.unit < 0) {
    return;
  }

  const rowsByUnit = new Map(getRecruitingMetricsRows().map((row) => [row.unit, row]));

  sheet.rows.forEach((row) => {
    const unit = normalizeBusinessUnit(row.cells[indexes.unit]);
    const summary = rowsByUnit.get(unit);

    if (!summary) {
      return;
    }

    if (indexes.offerSigned >= 0) {
      row.cells[indexes.offerSigned] = String(summary.offerSigned);
    }

    if (indexes.joined >= 0) {
      row.cells[indexes.joined] = String(summary.joined);
    }

    if (indexes.ratio >= 0) {
      row.cells[indexes.ratio] = `${summary.ratio}%`;
    }
  });
}

function renderRecruitingMetrics() {
  const container = $("#recruiting-metrics-content");

  if (!container) {
    return;
  }

  const metrics = getRecruitingMetricsState();
  const activeTab = getRecruitingMetricsActiveTab();
  const recipientsText = metrics.recipients.join("\n");
  syncRecruitingProgressSheetComputedValues(metrics);

  container.innerHTML = `
    <div class="metrics-workspace">
      <section class="content-panel">
        <div class="panel-header">
          <div>
            <h4>${escapeHtml(getRecruitingMetricsTabLabel(activeTab))}</h4>
            <span>${activeTab === "details" ? "엑셀처럼 채용 인물별 상세 데이터를 붙여넣고 관리합니다." : "사업부별 채용 목표와 진행 경과를 취합합니다."}</span>
          </div>
          <div class="job-fit-result-actions">
            <button class="ghost-button compact-button" type="button" data-download-recruiting-metrics>엑셀 다운로드</button>
            ${activeTab === "progress" ? `<button class="primary-button compact-button" type="button" data-send-recruiting-metrics>취합 메일 발송</button>` : ""}
          </div>
        </div>
        <div class="metrics-tab-list" role="tablist" aria-label="채용 지표 탭">
          ${RECRUITING_METRICS_TABS.map((tab) => `
            <button class="metrics-tab ${activeTab === tab.key ? "is-active" : ""}" type="button" role="tab" aria-selected="${activeTab === tab.key}" data-recruiting-metrics-tab="${escapeHtml(tab.key)}">
              ${escapeHtml(tab.label)}
            </button>
          `).join("")}
        </div>
        ${activeTab === "progress" ? `
          <div class="metrics-control-grid">
            <label class="field">
              <span>취합 기준 주</span>
              <input id="recruiting-metrics-week" class="control-input" type="date" value="${inputValue(metrics.weekOf)}" />
            </label>
            <label class="field">
              <span>메일 제목</span>
              <input id="recruiting-metrics-subject" class="control-input" value="${inputValue(metrics.subject)}" />
            </label>
            <label class="field">
              <span>수신처</span>
              <textarea id="recruiting-metrics-recipients" class="control-textarea compact-textarea" rows="3" placeholder="여러 명은 줄바꿈 또는 쉼표로 입력">${escapeHtml(recipientsText)}</textarea>
            </label>
            <label class="compact-check metrics-auto-send-check">
              <input id="recruiting-metrics-auto-send" type="checkbox" ${metrics.autoSendOnComplete ? "checked" : ""} />
              <span>전체 취합 완료 시 자동 발송</span>
            </label>
          </div>
        ` : ""}
        ${metrics.mailStatus ? `<p class="job-fit-inline-status">${escapeHtml(metrics.mailStatus)}</p>` : ""}
        ${renderRecruitingMetricsSheet(activeTab)}
      </section>
    </div>
  `;
}

function renderRecruitingMetricsSheet(sheetKey) {
  const sheet = getRecruitingMetricsSheet(sheetKey);

  return `
    <div class="metrics-sheet-toolbar">
      <div>
        <strong>${escapeHtml(getRecruitingMetricsTabLabel(sheetKey))} 데이터시트</strong>
        <span>엑셀에서 복사한 여러 행/열을 그대로 붙여넣을 수 있습니다.</span>
      </div>
      <div class="job-fit-result-actions">
        <button class="ghost-button compact-button" type="button" data-add-recruiting-row="${escapeHtml(sheetKey)}">행 추가</button>
        <button class="ghost-button compact-button" type="button" data-add-recruiting-column="${escapeHtml(sheetKey)}">열 추가</button>
      </div>
    </div>
    <div class="table-scroll metrics-table-wrap metrics-sheet-wrap">
      <table class="metrics-table metrics-sheet-table">
        <thead>
          <tr>
            <th class="metrics-row-number">#</th>
            ${sheet.columns.map((column, columnIndex) => `
              <th>
                <div class="metrics-column-header">
                  <input class="metrics-column-input" value="${inputValue(column)}" aria-label="열 이름" data-recruiting-column="${escapeHtml(sheetKey)}" data-col="${columnIndex}" />
                  <button class="icon-button tiny-icon-button" type="button" aria-label="열 삭제" data-delete-recruiting-column="${escapeHtml(sheetKey)}" data-col="${columnIndex}" ${sheet.columns.length <= 1 ? "disabled" : ""}>×</button>
                </div>
              </th>
            `).join("")}
            <th class="metrics-action-column">관리</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.rows.map((row, rowIndex) => `
            <tr>
              <th class="metrics-row-number">${rowIndex + 1}</th>
              ${sheet.columns.map((_, columnIndex) => `
                <td>
                  <textarea class="metrics-sheet-cell" rows="1" data-recruiting-cell="${escapeHtml(sheetKey)}" data-row="${rowIndex}" data-col="${columnIndex}">${escapeHtml(row.cells[columnIndex] || "")}</textarea>
                </td>
              `).join("")}
              <td class="metrics-action-column">
                <button class="ghost-button compact-button metrics-row-delete" type="button" data-delete-recruiting-row="${escapeHtml(sheetKey)}" data-row="${rowIndex}" ${sheet.rows.length <= 1 ? "disabled" : ""}>삭제</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function setRecruitingMetricsTab(tabKey) {
  const metrics = getRecruitingMetricsState();

  if (!RECRUITING_METRICS_TABS.some((tab) => tab.key === tabKey)) {
    return;
  }

  metrics.activeTab = tabKey;
  if (tabKey === "progress") {
    syncRecruitingTargetsFromProgressSheet(metrics);
    syncRecruitingProgressSheetComputedValues(metrics);
  }
  persistState();
  renderRecruitingMetrics();
}

function updateRecruitingMetricsField(field, value) {
  const metrics = getRecruitingMetricsState();

  if (field === "recipients") {
    metrics.recipients = normalizeEmailList(value);
  } else {
    metrics[field] = String(value || "").trim();
  }

  if (field === "weekOf") {
    metrics.lastAutoSentWeek = "";
  }

  persistState();
}

function updateRecruitingSheetCell(input) {
  const sheetKey = input.dataset.recruitingCell;
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const rowIndex = Number(input.dataset.row);
  const columnIndex = Number(input.dataset.col);

  if (!sheet?.rows?.[rowIndex] || !Number.isInteger(columnIndex)) {
    return;
  }

  sheet.rows[rowIndex].cells[columnIndex] = input.value;
  if (sheetKey === "progress") {
    syncRecruitingTargetsFromProgressSheet();
  }
  persistState();
}

function updateRecruitingSheetColumn(input) {
  const sheetKey = input.dataset.recruitingColumn;
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const columnIndex = Number(input.dataset.col);

  if (!sheet?.columns || !Number.isInteger(columnIndex) || columnIndex < 0 || columnIndex >= sheet.columns.length) {
    return;
  }

  sheet.columns[columnIndex] = input.value.trim() || `항목 ${columnIndex + 1}`;
  if (sheetKey === "progress") {
    syncRecruitingTargetsFromProgressSheet();
  }
  persistState();
}

function addRecruitingSheetRow(sheetKey) {
  const sheet = getRecruitingMetricsSheet(sheetKey);

  if (!sheet) {
    return;
  }

  sheet.rows.push(createRecruitingSheetRow(sheet.columns.length));
  if (sheetKey === "progress") {
    syncRecruitingTargetsFromProgressSheet();
  }
  persistState();
  renderRecruitingMetrics();
}

function deleteRecruitingSheetRow(sheetKey, rowIndex) {
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const index = Number(rowIndex);

  if (!sheet || sheet.rows.length <= 1 || !Number.isInteger(index) || index < 0 || index >= sheet.rows.length) {
    return;
  }

  sheet.rows.splice(index, 1);
  if (sheetKey === "progress") {
    syncRecruitingTargetsFromProgressSheet();
  }
  persistState();
  renderRecruitingMetrics();
}

function addRecruitingSheetColumn(sheetKey) {
  const sheet = getRecruitingMetricsSheet(sheetKey);

  if (!sheet) {
    return;
  }

  sheet.columns.push(`추가 항목 ${sheet.columns.length + 1}`);
  sheet.rows.forEach((row) => row.cells.push(""));
  if (sheetKey === "progress") {
    syncRecruitingTargetsFromProgressSheet();
  }
  persistState();
  renderRecruitingMetrics();
}

function deleteRecruitingSheetColumn(sheetKey, columnIndex) {
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const index = Number(columnIndex);

  if (!sheet || sheet.columns.length <= 1 || !Number.isInteger(index) || index < 0 || index >= sheet.columns.length) {
    return;
  }

  sheet.columns.splice(index, 1);
  sheet.rows.forEach((row) => row.cells.splice(index, 1));
  if (sheetKey === "progress") {
    syncRecruitingTargetsFromProgressSheet();
  }
  persistState();
  renderRecruitingMetrics();
}

function ensureRecruitingSheetSize(sheet, minRows, minColumns) {
  while (sheet.columns.length < minColumns) {
    sheet.columns.push(`추가 항목 ${sheet.columns.length + 1}`);
  }

  sheet.rows.forEach((row) => {
    while (row.cells.length < sheet.columns.length) {
      row.cells.push("");
    }
  });

  while (sheet.rows.length < minRows) {
    sheet.rows.push(createRecruitingSheetRow(sheet.columns.length));
  }
}

function handleRecruitingSheetPaste(event) {
  const input = event.target.closest("[data-recruiting-cell]");

  if (!input) {
    return;
  }

  const text = event.clipboardData?.getData("text/plain") || "";

  if (!text.includes("\t") && !text.includes("\n")) {
    return;
  }

  event.preventDefault();

  const sheet = getRecruitingMetricsSheet(input.dataset.recruitingCell);
  const startRow = Number(input.dataset.row);
  const startColumn = Number(input.dataset.col);

  if (!sheet || !Number.isInteger(startRow) || !Number.isInteger(startColumn)) {
    return;
  }

  const rows = text
    .replace(/\r/g, "")
    .replace(/\n$/, "")
    .split("\n")
    .map((line) => line.split("\t"));
  const requiredRows = startRow + rows.length;
  const requiredColumns = startColumn + Math.max(...rows.map((row) => row.length), 1);

  ensureRecruitingSheetSize(sheet, requiredRows, requiredColumns);

  rows.forEach((cells, rowOffset) => {
    cells.forEach((cell, columnOffset) => {
      sheet.rows[startRow + rowOffset].cells[startColumn + columnOffset] = cell.trim();
    });
  });

  if (input.dataset.recruitingCell === "progress") {
    syncRecruitingTargetsFromProgressSheet();
  }
  persistState();
  renderRecruitingMetrics();
}

function buildRecruitingMetricsExcelHtml(sheetKey = getRecruitingMetricsActiveTab()) {
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const title = getRecruitingMetricsTabLabel(sheetKey);

  return [
    "<html><head><meta charset=\"utf-8\"><style>",
    "table{border-collapse:collapse;font-family:'Malgun Gothic',Arial,sans-serif;font-size:11pt}th,td{border:1px solid #d1d5db;padding:8px;text-align:left;vertical-align:top}th{background:#eef4ff;font-weight:700}",
    "</style></head><body>",
    `<h2>${escapeHtml(title)} (${escapeHtml(getRecruitingMetricsState().weekOf || getTodayDate())})</h2>`,
    "<table><thead><tr>",
    sheet.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join(""),
    "</tr></thead><tbody>",
    sheet.rows.map((row) => `
      <tr>
        ${sheet.columns.map((_, index) => `<td>${escapeHtml(row.cells[index] || "")}</td>`).join("")}
      </tr>
    `).join(""),
    "</tbody></table></body></html>"
  ].join("");
}

function downloadRecruitingMetricsExcel() {
  const metrics = getRecruitingMetricsState();
  const activeTab = getRecruitingMetricsActiveTab();
  const blob = new Blob([buildRecruitingMetricsExcelHtml(activeTab)], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `채용지표_${getRecruitingMetricsTabLabel(activeTab)}_${metrics.weekOf || getTodayDate()}.xls`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  addAuditLog("채용 지표 엑셀 다운로드", "채용 지표", getRecruitingMetricsTabLabel(activeTab));
}

async function sendRecruitingMetricsMail() {
  const metrics = getRecruitingMetricsState();
  const draft = getRecruitingMailDraft();
  metrics.mailStatus = "채용 진행 경과 메일을 발송 중입니다.";
  renderRecruitingMetrics();

  try {
    const recipients = normalizeEmailList(draft.recipients);

    if (!recipients.length) {
      throw new Error("메일 수신처를 입력해 주세요.");
    }

    const response = await fetch("/api/recruiting-metrics-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "result",
        recipients,
        subject: metrics.subject || "[TalentHub] 채용 진행 경과",
        weekOf: metrics.weekOf,
        html: buildRecruitingMetricsExcelHtml("progress"),
        rows: getRecruitingMetricsRows()
      })
    });
    const result = await parseJsonMailResponse(response, "채용 진행 경과 메일 발송");

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "메일 발송에 실패했습니다.");
    }

    metrics.mailStatus = `채용 진행 경과 메일을 발송했습니다. (${recipients.length}명)`;
    showToast(metrics.mailStatus);
    metrics.lastAutoSentWeek = metrics.weekOf || getTodayDate();
    addAuditLog("채용 지표 메일 발송", "채용 지표", recipients.join(", "));
  } catch (error) {
    console.warn(error);
    metrics.mailStatus = error.message || "채용 지표 메일 발송 중 오류가 발생했습니다.";
    showToast(metrics.mailStatus);
  }

  persistState();
  renderRecruitingMetrics();
}

async function sendRecruitingMetricsRequestMail() {
  const metrics = getRecruitingMetricsState();
  const draft = getRecruitingRequestMailDraft();
  metrics.mailStatus = "채용 실적 상세 취합 요청 메일을 발송 중입니다.";
  renderRecruitingMetrics();

  try {
    const recipients = normalizeEmailList(draft.recipients);

    if (!recipients.length) {
      throw new Error("요청 메일 수신처를 입력해 주세요.");
    }

    const response = await fetch("/api/recruiting-metrics-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "request",
        recipients,
        subject: draft.subject || "[TalentHub] 채용 실적 상세 데이터시트 작성 요청",
        body: draft.body,
        frequency: draft.frequency,
        day: draft.day,
        time: draft.time,
        scheduleText: getRecruitingRequestScheduleText(draft),
        weekOf: metrics.weekOf
      })
    });
    const result = await parseJsonMailResponse(response, "채용 실적 상세 취합 요청 메일 발송");

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "요청 메일 발송에 실패했습니다.");
    }

    metrics.mailStatus = `채용 실적 상세 취합 요청 메일을 발송했습니다. (${recipients.length}명)`;
    recruitingMetricsRequestMailModalOpen = false;
    metrics.requestMailFrequency = draft.frequency;
    metrics.requestMailDay = draft.day;
    metrics.requestMailTime = draft.time;
    metrics.requestSubject = draft.subject;
    metrics.requestMailBody = draft.body;
    metrics.requestRecipients = recipients;
    metrics.requestMailDraft = draft;
    addAuditLog("채용 지표 취합 요청 메일 발송", "채용 지표", recipients.join(", "));
    showToast(metrics.mailStatus);
  } catch (error) {
    console.warn(error);
    metrics.mailStatus = error.message || "채용 실적 상세 취합 요청 메일 발송 중 오류가 발생했습니다.";
    showToast(metrics.mailStatus);
  }

  persistState();
  renderRecruitingMetrics();
}

function canViewAllRecruitingMetrics(member = getCurrentMember()) {
  return Boolean(member && member.status === "active" && (isAdmin(member) || member.role === "division_recruiter"));
}

function getRecruitingMetricsAllowedUnits(member = getCurrentMember()) {
  if (canViewAllRecruitingMetrics(member)) {
    return [...BUSINESS_UNITS];
  }

  if (member?.role === "business_recruiter") {
    return [getMemberBusinessUnit(member)].filter(Boolean);
  }

  return [];
}

function getRecruitingMetricsUnitFilter(sheetKey = getRecruitingMetricsActiveTab()) {
  const metrics = getRecruitingMetricsState();
  const allowedUnits = getRecruitingMetricsAllowedUnits();
  const rawFilter = sheetKey === "progress" ? metrics.progressUnitFilter : metrics.detailUnitFilter;
  const normalizedFilter = normalizeBusinessUnit(rawFilter);

  if (canViewAllRecruitingMetrics()) {
    return normalizedFilter || "all";
  }

  return allowedUnits[0] || "";
}

function setRecruitingMetricsUnitFilter(sheetKey, value) {
  const metrics = getRecruitingMetricsState();
  const filter = canViewAllRecruitingMetrics() ? normalizeBusinessUnit(value) || "all" : getRecruitingMetricsUnitFilter(sheetKey);

  if (sheetKey === "progress") {
    metrics.progressUnitFilter = filter;
  } else {
    metrics.detailUnitFilter = filter;
  }

  persistState({ skipRemoteSync: true });
  renderRecruitingMetrics();
}

function renderRecruitingMetricsUnitFilter(sheetKey) {
  const allowedUnits = getRecruitingMetricsAllowedUnits();
  const selected = getRecruitingMetricsUnitFilter(sheetKey);
  const canSelectAll = canViewAllRecruitingMetrics();
  const options = canSelectAll
    ? [`<option value="all" ${selected === "all" ? "selected" : ""}>전체 사업부</option>`, ...BUSINESS_UNITS.map((unit) => `<option value="${escapeHtml(unit)}" ${selected === unit ? "selected" : ""}>${escapeHtml(unit)}</option>`)]
    : allowedUnits.map((unit) => `<option value="${escapeHtml(unit)}" selected>${escapeHtml(unit)}</option>`);

  return `
    <label class="field metrics-unit-filter">
      <span>사업부</span>
      <select class="control-input" data-recruiting-unit-filter="${escapeHtml(sheetKey)}" ${canSelectAll ? "" : "disabled"}>
        ${options.join("")}
      </select>
    </label>
  `;
}

function getRecruitingSheetColumnIndex(sheet, names = []) {
  return names.map((name) => sheet.columns.indexOf(name)).find((index) => index >= 0) ?? -1;
}

function getRecruitingProgressColumnIndex(sheet, names = [], fallbackIndex = -1) {
  const exactIndex = getRecruitingSheetColumnIndex(sheet, names);

  if (exactIndex >= 0) {
    return exactIndex;
  }

  return Number.isInteger(fallbackIndex) && fallbackIndex >= 0 && sheet?.columns?.length > fallbackIndex
    ? fallbackIndex
    : -1;
}

function getRecruitingProgressColumnIndexes(sheet = getRecruitingMetricsSheet("progress")) {
  return {
    unit: getRecruitingProgressColumnIndex(sheet, ["사업부"], 0),
    hiringTarget: getRecruitingProgressColumnIndex(sheet, ["당해 채용 목표"], 1),
    keyTalentTarget: getRecruitingProgressColumnIndex(sheet, ["핵심인력 채용 목표"], 2),
    offerSigned: getRecruitingProgressColumnIndex(sheet, ["오퍼서명(확보) 완료"], 3),
    keyTalentSecured: getRecruitingProgressColumnIndex(sheet, ["확보완료(핵심인력)"], 4),
    joined: getRecruitingProgressColumnIndex(sheet, ["입사 완료"], 5),
    ratio: getRecruitingProgressColumnIndex(sheet, ["목표 달성률"], 6),
    keyTalentRatio: getRecruitingProgressColumnIndex(sheet, ["목표 달성률 (핵심인력)"], 7),
    completed: getRecruitingProgressColumnIndex(sheet, ["작성 상태"], 8),
    weeklyNote: getRecruitingProgressColumnIndex(sheet, ["비고"], 9)
  };
}

function createRecruitingProgressRowForUnit(sheet, unit, target = {}) {
  const row = createRecruitingSheetRow(sheet.columns.length);
  const indexes = getRecruitingProgressColumnIndexes(sheet);

  if (indexes.unit >= 0) {
    row.cells[indexes.unit] = unit;
  }

  if (indexes.hiringTarget >= 0) {
    const hiringTarget = Number(target.hiringTarget || 0) || 0;
    row.cells[indexes.hiringTarget] = hiringTarget ? String(hiringTarget) : "";
  }

  if (indexes.keyTalentTarget >= 0) {
    const keyTalentTarget = Number(target.keyTalentTarget || 0) || 0;
    row.cells[indexes.keyTalentTarget] = keyTalentTarget ? String(keyTalentTarget) : "";
  }

  if (indexes.completed >= 0) {
    row.cells[indexes.completed] = target.completed ? "완료" : "진행 중";
  }

  if (indexes.weeklyNote >= 0) {
    row.cells[indexes.weeklyNote] = String(target.weeklyNote || "").trim();
  }

  return row;
}

function ensureRecruitingProgressSheetRows(sheet, targets = {}) {
  if (!sheet?.columns?.length) {
    return sheet;
  }

  const indexes = getRecruitingProgressColumnIndexes(sheet);

  if (indexes.unit < 0) {
    return sheet;
  }

  sheet.rows = (Array.isArray(sheet.rows) ? sheet.rows : [])
    .filter((row) => normalizeBusinessUnit(row.cells[indexes.unit]) || row.cells.some((cell) => String(cell || "").trim()));

  const existingUnits = new Set(sheet.rows
    .map((row) => normalizeBusinessUnit(row.cells[indexes.unit]))
    .filter(Boolean));

  BUSINESS_UNITS.forEach((unit) => {
    if (!existingUnits.has(unit)) {
      sheet.rows.push(createRecruitingProgressRowForUnit(sheet, unit, targets[unit] || {}));
    }
  });

  sheet.rows.sort((a, b) => {
    const unitA = normalizeBusinessUnit(a.cells[indexes.unit]);
    const unitB = normalizeBusinessUnit(b.cells[indexes.unit]);
    const orderA = BUSINESS_UNITS.indexOf(unitA);
    const orderB = BUSINESS_UNITS.indexOf(unitB);
    return (orderA < 0 ? Number.MAX_SAFE_INTEGER : orderA) - (orderB < 0 ? Number.MAX_SAFE_INTEGER : orderB);
  });

  return sheet;
}

function getRecruitingDetailBusinessUnitIndex(sheet = getRecruitingMetricsSheet("details")) {
  return getRecruitingSheetColumnIndex(sheet, ["사업부"]);
}

function getRecruitingDetailRowUnit(row, sheet = getRecruitingMetricsSheet("details")) {
  const unitIndex = getRecruitingDetailBusinessUnitIndex(sheet);
  return unitIndex >= 0 ? normalizeBusinessUnit(row.cells[unitIndex]) : "";
}

function isRecruitingDetailRowEmpty(row) {
  return !row?.cells?.some((cell) => String(cell || "").trim());
}

function canEditRecruitingDetailRow(row, sheet = getRecruitingMetricsSheet("details")) {
  const unit = getRecruitingDetailRowUnit(row, sheet);

  if (!unit) {
    return getRecruitingMetricsAllowedUnits().length > 0;
  }

  return canEditRecruitingMetricsUnit(unit);
}

function shouldShowRecruitingSheetRow(sheetKey, row) {
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const filter = getRecruitingMetricsUnitFilter(sheetKey);

  if (sheetKey === "details") {
    const unit = getRecruitingDetailRowUnit(row, sheet);

    if (!unit) {
      return filter !== "all" || canViewAllRecruitingMetrics();
    }

    if (!canViewAllRecruitingMetrics() && !canEditRecruitingMetricsUnit(unit)) {
      return false;
    }

    return filter === "all" || unit === filter;
  }

  const unitIndex = getRecruitingProgressColumnIndexes(sheet).unit;
  const unit = unitIndex >= 0 ? normalizeBusinessUnit(row.cells[unitIndex]) : "";

  if (!unit) {
    return false;
  }

  if (!canViewAllRecruitingMetrics() && !canEditRecruitingMetricsUnit(unit)) {
    return false;
  }

  return filter === "all" || unit === filter;
}

function getRecruitingVisibleRows(sheetKey) {
  const sheet = getRecruitingMetricsSheet(sheetKey);
  return sheet.rows
    .map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row }) => shouldShowRecruitingSheetRow(sheetKey, row));
}

function ensureRecruitingDetailRowUnit(row, sheet = getRecruitingMetricsSheet("details")) {
  const unitIndex = getRecruitingDetailBusinessUnitIndex(sheet);

  if (unitIndex < 0) {
    return;
  }

  const currentUnit = normalizeBusinessUnit(row.cells[unitIndex]);

  if (currentUnit && canEditRecruitingMetricsUnit(currentUnit)) {
    row.cells[unitIndex] = currentUnit;
    return;
  }

  const fallbackUnit = getRecruitingMetricsUnitFilter("details") !== "all"
    ? getRecruitingMetricsUnitFilter("details")
    : getRecruitingMetricsAllowedUnits()[0] || "";

  if (fallbackUnit) {
    row.cells[unitIndex] = fallbackUnit;
  }
}

function renderRecruitingBusinessUnitCell(sheetKey, row, rowIndex, columnIndex, disabled) {
  const currentUnit = normalizeBusinessUnit(row.cells[columnIndex]);
  const allowedUnits = getRecruitingMetricsAllowedUnits();
  const units = canViewAllRecruitingMetrics()
    ? BUSINESS_UNITS
    : [...new Set([...allowedUnits, currentUnit].filter(Boolean))];

  return `
    <select class="metrics-sheet-cell metrics-sheet-select" data-recruiting-cell="${escapeHtml(sheetKey)}" data-row="${rowIndex}" data-col="${columnIndex}" ${disabled ? "disabled" : ""}>
      <option value="" ${currentUnit ? "" : "selected"}>사업부 선택</option>
      ${units.map((unit) => `<option value="${escapeHtml(unit)}" ${unit === currentUnit ? "selected" : ""}>${escapeHtml(unit)}</option>`).join("")}
    </select>
  `;
}

function normalizeRecruitingTalentGrade(value) {
  const grade = String(value || "").trim();
  return RECRUITING_TALENT_GRADE_OPTIONS.includes(grade) ? grade : "";
}

function renderRecruitingTalentGradeCell(sheetKey, row, rowIndex, columnIndex, disabled) {
  const currentGrade = normalizeRecruitingTalentGrade(row.cells[columnIndex]);

  return `
    <select class="metrics-sheet-cell metrics-sheet-select" data-recruiting-cell="${escapeHtml(sheetKey)}" data-row="${rowIndex}" data-col="${columnIndex}" ${disabled ? "disabled" : ""}>
      <option value="" ${currentGrade ? "" : "selected"}>등급 선택</option>
      ${RECRUITING_TALENT_GRADE_OPTIONS.map((grade) => `<option value="${escapeHtml(grade)}" ${grade === currentGrade ? "selected" : ""}>${escapeHtml(grade)}</option>`).join("")}
    </select>
  `;
}

function isRecruitingProgressComputedColumn(sheet, columnIndex) {
  return ["오퍼서명(확보) 완료", "확보완료(핵심인력)", "입사 완료", "목표 달성률", "목표 달성률 (핵심인력)"].includes(sheet.columns[columnIndex])
    || [3, 4, 5, 6, 7].includes(columnIndex);
}

function getRecruitingDetailSummaryByUnit(unit) {
  const sheet = getRecruitingMetricsSheet("details");
  const unitIndex = getRecruitingSheetColumnIndex(sheet, ["사업부"]);
  const offerIndex = getRecruitingSheetColumnIndex(sheet, ["오퍼서명일", "오퍼서명(확보)일", "오퍼서명"]);
  const joinedIndex = getRecruitingSheetColumnIndex(sheet, ["입사완료일", "입사 완료일", "입사완료"]);
  const gradeIndex = getRecruitingSheetColumnIndex(sheet, ["핵심인력 여부"]);
  let rowCount = 0;
  let offerSigned = 0;
  let keyTalentSecured = 0;
  let joined = 0;

  if (unitIndex < 0) {
    return { rowCount, offerSigned, keyTalentSecured, joined };
  }

  sheet.rows.forEach((row) => {
    if (normalizeBusinessUnit(row.cells[unitIndex]) !== unit || isRecruitingDetailRowEmpty(row)) {
      return;
    }

    rowCount += 1;

    const hasOfferSigned = offerIndex >= 0 && String(row.cells[offerIndex] || "").trim();

    if (hasOfferSigned) {
      offerSigned += 1;

      if (gradeIndex >= 0 && RECRUITING_KEY_TALENT_GRADES.has(normalizeRecruitingTalentGrade(row.cells[gradeIndex]))) {
        keyTalentSecured += 1;
      }
    }

    if (joinedIndex >= 0 && String(row.cells[joinedIndex] || "").trim()) {
      joined += 1;
    }
  });

  return { rowCount, offerSigned, keyTalentSecured, joined };
}

function getRecruitingMetricsComputedSummary(unit, metrics = getRecruitingMetricsState()) {
  const target = metrics.targets[unit] || {};
  const detailSummary = getRecruitingDetailSummaryByUnit(unit);
  const cases = getRecruitingMetricInterviewCases(unit);
  const fallbackOfferSigned = cases.filter((item) => item.offerSignedAt).length;
  const fallbackJoined = cases.filter((item) => item.joinedAt).length;
  const offerSigned = detailSummary.rowCount ? detailSummary.offerSigned : fallbackOfferSigned;
  const keyTalentSecured = detailSummary.rowCount ? detailSummary.keyTalentSecured : 0;
  const joined = detailSummary.rowCount ? detailSummary.joined : fallbackJoined;
  const hiringTarget = Number(target.hiringTarget || 0) || 0;
  const keyTalentTarget = Number(target.keyTalentTarget || 0) || 0;
  const ratio = hiringTarget ? Math.round((offerSigned / hiringTarget) * 1000) / 10 : 0;
  const keyTalentRatio = keyTalentTarget ? Math.round((keyTalentSecured / keyTalentTarget) * 1000) / 10 : 0;

  return {
    unit,
    hiringTarget,
    keyTalentTarget,
    offerSigned,
    keyTalentSecured,
    joined,
    ratio,
    keyTalentRatio,
    weeklyNote: target.weeklyNote || "",
    completed: Boolean(target.completed),
    completedAt: target.completedAt || "",
    completedBy: target.completedBy || ""
  };
}

function writeRecruitingProgressSummaryForUnit(unit, metrics = getRecruitingMetricsState()) {
  const normalizedUnit = normalizeBusinessUnit(unit);
  const sheet = metrics.progressSheet;

  if (!normalizedUnit || !sheet?.rows?.length) {
    return false;
  }

  const indexes = getRecruitingProgressColumnIndexes(sheet);

  if (indexes.unit < 0) {
    return false;
  }

  const progressRow = sheet.rows.find((row) => normalizeBusinessUnit(row.cells[indexes.unit]) === normalizedUnit);

  if (!progressRow) {
    return false;
  }

  const summary = getRecruitingMetricsComputedSummary(normalizedUnit, metrics);

  if (indexes.offerSigned >= 0) {
    progressRow.cells[indexes.offerSigned] = String(summary.offerSigned);
  }

  if (indexes.keyTalentSecured >= 0) {
    progressRow.cells[indexes.keyTalentSecured] = String(summary.keyTalentSecured);
  }

  if (indexes.joined >= 0) {
    progressRow.cells[indexes.joined] = String(summary.joined);
  }

  if (indexes.ratio >= 0) {
    progressRow.cells[indexes.ratio] = `${summary.ratio}%`;
  }

  if (indexes.keyTalentRatio >= 0) {
    progressRow.cells[indexes.keyTalentRatio] = `${summary.keyTalentRatio}%`;
  }

  return true;
}

function getRecruitingMetricsRows() {
  const metrics = getRecruitingMetricsState();
  syncRecruitingTargetsFromProgressSheet(metrics);

  return BUSINESS_UNITS.map((unit) => getRecruitingMetricsComputedSummary(unit, metrics));
}

function getRecruitingMetricsTotalRow(rows = getRecruitingMetricsRows()) {
  const total = rows.reduce((summary, row) => {
    summary.hiringTarget += Number(row.hiringTarget || 0) || 0;
    summary.keyTalentTarget += Number(row.keyTalentTarget || 0) || 0;
    summary.offerSigned += Number(row.offerSigned || 0) || 0;
    summary.keyTalentSecured += Number(row.keyTalentSecured || 0) || 0;
    summary.joined += Number(row.joined || 0) || 0;
    return summary;
  }, {
    unit: "합계",
    hiringTarget: 0,
    keyTalentTarget: 0,
    offerSigned: 0,
    keyTalentSecured: 0,
    joined: 0
  });

  total.ratio = total.hiringTarget ? Math.round((total.offerSigned / total.hiringTarget) * 1000) / 10 : 0;
  total.keyTalentRatio = total.keyTalentTarget ? Math.round((total.keyTalentSecured / total.keyTalentTarget) * 1000) / 10 : 0;
  total.weeklyNote = "";
  total.completed = rows.length > 0 && rows.every((row) => row.completed);
  return total;
}

function getRecruitingProgressDisplayValue(columnIndex, row, sheet = getRecruitingMetricsSheet("progress")) {
  const indexes = getRecruitingProgressColumnIndexes(sheet);
  const unit = indexes.unit >= 0 ? normalizeBusinessUnit(row.cells[indexes.unit]) : "";
  const summary = unit ? getRecruitingMetricsComputedSummary(unit) : null;

  if (!summary) {
    return row.cells[columnIndex] || "";
  }

  if (columnIndex === indexes.offerSigned) {
    return String(summary.offerSigned);
  }

  if (columnIndex === indexes.keyTalentSecured) {
    return String(summary.keyTalentSecured);
  }

  if (columnIndex === indexes.joined) {
    return String(summary.joined);
  }

  if (columnIndex === indexes.ratio) {
    return `${summary.ratio}%`;
  }

  if (columnIndex === indexes.keyTalentRatio) {
    return `${summary.keyTalentRatio}%`;
  }

  return row.cells[columnIndex] || "";
}

function getRecruitingProgressTotalDisplayValue(columnIndex, total, sheet = getRecruitingMetricsSheet("progress")) {
  const indexes = getRecruitingProgressColumnIndexes(sheet);

  if (columnIndex === indexes.unit) {
    return total.unit;
  }

  if (columnIndex === indexes.hiringTarget) {
    return String(total.hiringTarget);
  }

  if (columnIndex === indexes.keyTalentTarget) {
    return String(total.keyTalentTarget);
  }

  if (columnIndex === indexes.offerSigned) {
    return String(total.offerSigned);
  }

  if (columnIndex === indexes.keyTalentSecured) {
    return String(total.keyTalentSecured);
  }

  if (columnIndex === indexes.joined) {
    return String(total.joined);
  }

  if (columnIndex === indexes.ratio) {
    return `${total.ratio}%`;
  }

  if (columnIndex === indexes.keyTalentRatio) {
    return `${total.keyTalentRatio}%`;
  }

  return "";
}

function syncRecruitingProgressSheetComputedValues(metrics = getRecruitingMetricsState()) {
  const sheet = metrics.progressSheet;

  if (!sheet?.columns?.length || !sheet?.rows?.length) {
    return;
  }

  const indexes = getRecruitingProgressColumnIndexes(sheet);

  if (indexes.unit < 0) {
    return;
  }

  sheet.rows.forEach((row) => {
    const unit = normalizeBusinessUnit(row.cells[indexes.unit]);

    if (!unit) {
      return;
    }

    writeRecruitingProgressSummaryForUnit(unit, metrics);
  });
}

function saveRecruitingMetrics() {
  const metrics = getRecruitingMetricsState();
  syncRecruitingTargetsFromProgressSheet(metrics);
  syncRecruitingProgressSheetComputedValues(metrics);
  metrics.saveStatus = `저장 완료 · ${getTimestampText()}`;
  persistState();
  renderRecruitingMetrics();
  showToast("채용 지표 데이터가 저장되었습니다.");
}

function getRecruitingMailDraft() {
  const metrics = getRecruitingMetricsState();
  const draft = metrics.mailDraft || {};

  return {
    frequency: draft.frequency || metrics.mailFrequency || "weekly",
    subject: draft.subject || metrics.subject || "[TalentHub] 채용 진행 경과",
    body: draft.body || metrics.mailBody || "채용 진행 경과 취합 결과를 공유드립니다.",
    recipients: normalizeEmailList(draft.recipients || metrics.recipients || [])
  };
}

function openRecruitingMetricsMailModal() {
  const metrics = getRecruitingMetricsState();
  metrics.mailDraft = getRecruitingMailDraft();
  recruitingMetricsMailModalOpen = true;
  renderRecruitingMetrics();
}

function closeRecruitingMetricsMailModal() {
  recruitingMetricsMailModalOpen = false;
  renderRecruitingMetrics();
}

function updateRecruitingMailDraft(field, value) {
  const metrics = getRecruitingMetricsState();
  metrics.mailDraft = getRecruitingMailDraft();

  if (field === "recipients") {
    metrics.mailDraft.recipients = normalizeEmailList(value);
  } else if (field === "frequency") {
    metrics.mailDraft.frequency = ["manual", "weekly", "monthly"].includes(value) ? value : "weekly";
  } else {
    metrics.mailDraft[field] = String(value || "").trim();
  }

  state.recruitingMetrics.mailDraft = metrics.mailDraft;
}

function saveRecruitingMailTemplate() {
  const metrics = getRecruitingMetricsState();
  const draft = getRecruitingMailDraft();
  metrics.mailFrequency = draft.frequency;
  metrics.subject = draft.subject;
  metrics.mailBody = draft.body;
  metrics.recipients = draft.recipients;
  metrics.mailDraft = draft;
  metrics.saveStatus = `메일 양식 저장 완료 · ${getTimestampText()}`;
  persistState();
  renderRecruitingMetrics();
  showToast("채용 지표 메일 양식이 저장되었습니다.");
}

function getRecruitingMetricsDefaultRequestRecipients() {
  return (state.members || [])
    .filter((member) => member?.status === "active" && member?.role === "business_recruiter")
    .map((member) => member.email)
    .filter(Boolean);
}

function getRecruitingRequestMailDraft() {
  const metrics = getRecruitingMetricsState();
  const draft = metrics.requestMailDraft || {};
  const defaultBody = [
    "각 사업부 채용 실적 상세 데이터시트 최신화를 요청드립니다.",
    "담당 사업부의 오퍼서명일, 입사완료일, 핵심인력 여부를 확인하여 정해진 취합 일정 전까지 입력해 주세요."
  ].join("\n");

  return {
    frequency: draft.frequency || metrics.requestMailFrequency || "weekly",
    day: draft.day || metrics.requestMailDay || "monday",
    time: draft.time || metrics.requestMailTime || "09:00",
    subject: draft.subject || metrics.requestSubject || "[TalentHub] 채용 실적 상세 데이터시트 작성 요청",
    body: draft.body || metrics.requestMailBody || defaultBody,
    recipients: normalizeEmailList(draft.recipients || metrics.requestRecipients || getRecruitingMetricsDefaultRequestRecipients())
  };
}

function getRecruitingRequestScheduleText(draft = getRecruitingRequestMailDraft()) {
  const dayLabels = {
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일"
  };
  const frequencyLabel = {
    manual: "수동 발송",
    weekly: `매주 ${dayLabels[draft.day] || "월요일"}`,
    monthly: "매월"
  }[draft.frequency] || "매주";

  return `${frequencyLabel} ${draft.time || "09:00"}`;
}

function openRecruitingMetricsRequestMailModal() {
  const metrics = getRecruitingMetricsState();
  metrics.requestMailDraft = getRecruitingRequestMailDraft();
  recruitingMetricsRequestMailModalOpen = true;
  renderRecruitingMetrics();
}

function closeRecruitingMetricsRequestMailModal() {
  recruitingMetricsRequestMailModalOpen = false;
  renderRecruitingMetrics();
}

function updateRecruitingRequestMailDraft(field, value) {
  const metrics = getRecruitingMetricsState();
  metrics.requestMailDraft = getRecruitingRequestMailDraft();

  if (field === "recipients") {
    metrics.requestMailDraft.recipients = normalizeEmailList(value);
  } else if (field === "frequency") {
    metrics.requestMailDraft.frequency = ["manual", "weekly", "monthly"].includes(value) ? value : "weekly";
  } else if (field === "day") {
    metrics.requestMailDraft.day = ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(value) ? value : "monday";
  } else if (field === "time") {
    metrics.requestMailDraft.time = String(value || "09:00").trim();
  } else {
    metrics.requestMailDraft[field] = String(value || "").trim();
  }

  state.recruitingMetrics.requestMailDraft = metrics.requestMailDraft;
}

function saveRecruitingRequestMailTemplate() {
  const metrics = getRecruitingMetricsState();
  const draft = getRecruitingRequestMailDraft();
  metrics.requestMailFrequency = draft.frequency;
  metrics.requestMailDay = draft.day;
  metrics.requestMailTime = draft.time;
  metrics.requestSubject = draft.subject;
  metrics.requestMailBody = draft.body;
  metrics.requestRecipients = draft.recipients;
  metrics.requestMailDraft = draft;
  metrics.saveStatus = `취합 요청 메일 양식 저장 완료 · ${getTimestampText()}`;
  persistState();
  renderRecruitingMetrics();
  showToast("취합 요청 메일 양식이 저장되었습니다.");
}

async function parseJsonMailResponse(response, fallbackMessage) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`${fallbackMessage} 응답이 JSON이 아닙니다. (${response.status})`);
  }
}

function renderRecruitingMetricsRequestMailModal() {
  if (!recruitingMetricsRequestMailModalOpen) {
    return "";
  }

  const draft = getRecruitingRequestMailDraft();
  const recipientsText = draft.recipients.join("\n");
  const scheduleText = getRecruitingRequestScheduleText(draft);

  return `
    <div class="trending-modal-backdrop" data-recruiting-request-mail-backdrop>
      <section class="trending-modal recruiting-mail-modal" role="dialog" aria-modal="true" aria-labelledby="recruiting-request-mail-title">
        <div class="trending-modal-header">
          <div>
            <strong id="recruiting-request-mail-title">취합 요청 메일발송</strong>
            <span>사업부 담당자에게 채용 실적 상세 데이터시트 작성을 요청합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-recruiting-request-mail>닫기</button>
        </div>
        <div class="trending-modal-body recruiting-mail-modal-body">
          <div class="metrics-control-grid">
            <label class="field">
              <span>발송 주기</span>
              <select class="control-input" data-recruiting-request-mail-draft="frequency">
                <option value="manual" ${draft.frequency === "manual" ? "selected" : ""}>수동 발송</option>
                <option value="weekly" ${draft.frequency === "weekly" ? "selected" : ""}>주간</option>
                <option value="monthly" ${draft.frequency === "monthly" ? "selected" : ""}>월간</option>
              </select>
            </label>
            <label class="field">
              <span>발송 요일</span>
              <select class="control-input" data-recruiting-request-mail-draft="day">
                <option value="monday" ${draft.day === "monday" ? "selected" : ""}>월요일</option>
                <option value="tuesday" ${draft.day === "tuesday" ? "selected" : ""}>화요일</option>
                <option value="wednesday" ${draft.day === "wednesday" ? "selected" : ""}>수요일</option>
                <option value="thursday" ${draft.day === "thursday" ? "selected" : ""}>목요일</option>
                <option value="friday" ${draft.day === "friday" ? "selected" : ""}>금요일</option>
              </select>
            </label>
            <label class="field">
              <span>발송 시간</span>
              <input class="control-input" type="time" value="${inputValue(draft.time)}" data-recruiting-request-mail-draft="time" />
            </label>
          </div>
          <div class="metrics-control-grid">
            <label class="field">
              <span>메일 제목</span>
              <input class="control-input" value="${inputValue(draft.subject)}" data-recruiting-request-mail-draft="subject" />
            </label>
            <label class="field">
              <span>수신처</span>
              <textarea class="control-textarea compact-textarea" rows="4" data-recruiting-request-mail-draft="recipients" placeholder="사업부 담당자 메일을 줄바꿈 또는 쉼표로 입력">${escapeHtml(recipientsText)}</textarea>
            </label>
          </div>
          <label class="field">
            <span>메일 본문</span>
            <textarea class="control-textarea" rows="8" data-recruiting-request-mail-draft="body">${escapeHtml(draft.body)}</textarea>
          </label>
          <div class="metrics-mail-preview">
            <strong>요청 메일 미리보기</strong>
            <p class="muted-text">예약 기준: ${escapeHtml(scheduleText)}</p>
            <p>${escapeHtml(draft.subject)}</p>
            <p class="pre-line">${escapeHtml(draft.body)}</p>
          </div>
          <div class="modal-actions">
            <button class="ghost-button" type="button" data-save-recruiting-request-mail-template>양식 저장</button>
            <button class="primary-button" type="button" data-send-recruiting-request-mail-final>요청 발송</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderRecruitingMetricsMailModal() {
  const metrics = getRecruitingMetricsState();

  if (!recruitingMetricsMailModalOpen) {
    return "";
  }

  const draft = getRecruitingMailDraft();
  const recipientsText = draft.recipients.join("\n");
  const filter = getRecruitingMetricsUnitFilter("progress");
  const previewRows = getRecruitingMetricsRows()
    .filter((row) => filter === "all" || row.unit === filter)
    .filter((row) => canViewAllRecruitingMetrics() || canEditRecruitingMetricsUnit(row.unit));
  const totalRow = getRecruitingMetricsTotalRow(previewRows);

  return `
    <div class="trending-modal-backdrop" data-recruiting-mail-backdrop>
      <section class="trending-modal recruiting-mail-modal" role="dialog" aria-modal="true" aria-labelledby="recruiting-mail-title">
        <div class="trending-modal-header">
          <div>
            <strong id="recruiting-mail-title">취합 결과 발송 설정</strong>
            <span>발송 전 결과 메일 양식과 수신처를 확인하고 저장할 수 있습니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-recruiting-mail>닫기</button>
        </div>
        <div class="trending-modal-body recruiting-mail-modal-body">
          <div class="metrics-control-grid">
            <label class="field">
              <span>발송 주기</span>
              <select class="control-input" data-recruiting-mail-draft="frequency">
                <option value="manual" ${draft.frequency === "manual" ? "selected" : ""}>수동 발송</option>
                <option value="weekly" ${draft.frequency === "weekly" ? "selected" : ""}>주간</option>
                <option value="monthly" ${draft.frequency === "monthly" ? "selected" : ""}>월간</option>
              </select>
            </label>
            <label class="field">
              <span>메일 제목</span>
              <input class="control-input" value="${inputValue(draft.subject)}" data-recruiting-mail-draft="subject" />
            </label>
            <label class="field">
              <span>수신처</span>
              <textarea class="control-textarea compact-textarea" rows="4" data-recruiting-mail-draft="recipients" placeholder="여러 명은 줄바꿈 또는 쉼표로 입력">${escapeHtml(recipientsText)}</textarea>
            </label>
          </div>
          <label class="field">
            <span>메일 본문</span>
            <textarea class="control-textarea" rows="8" data-recruiting-mail-draft="body">${escapeHtml(draft.body)}</textarea>
          </label>
          <div class="metrics-mail-preview">
            <strong>발송 데이터 미리보기</strong>
            <div class="table-scroll metrics-table-wrap">
              <table class="metrics-table">
                <thead>
                  <tr>
                    <th>사업부</th>
                    <th>당해 목표</th>
                    <th>핵심인력 목표</th>
                    <th>오퍼서명</th>
                    <th>핵심인력 확보</th>
                    <th>입사 완료</th>
                    <th>달성률</th>
                    <th>핵심인력 달성률</th>
                  </tr>
                </thead>
                <tbody>
                  ${previewRows.map((row) => `
                    <tr>
                      <td>${escapeHtml(row.unit)}</td>
                      <td>${escapeHtml(row.hiringTarget)}</td>
                      <td>${escapeHtml(row.keyTalentTarget)}</td>
                      <td>${escapeHtml(row.offerSigned)}</td>
                      <td>${escapeHtml(row.keyTalentSecured)}</td>
                      <td>${escapeHtml(row.joined)}</td>
                      <td>${escapeHtml(row.ratio)}%</td>
                      <td>${escapeHtml(row.keyTalentRatio)}%</td>
                    </tr>
                  `).join("")}
                  <tr class="metrics-total-row">
                    <td>${escapeHtml(totalRow.unit)}</td>
                    <td>${escapeHtml(totalRow.hiringTarget)}</td>
                    <td>${escapeHtml(totalRow.keyTalentTarget)}</td>
                    <td>${escapeHtml(totalRow.offerSigned)}</td>
                    <td>${escapeHtml(totalRow.keyTalentSecured)}</td>
                    <td>${escapeHtml(totalRow.joined)}</td>
                    <td>${escapeHtml(totalRow.ratio)}%</td>
                    <td>${escapeHtml(totalRow.keyTalentRatio)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-actions">
            <button class="ghost-button" type="button" data-save-recruiting-mail-template>양식 저장</button>
            <button class="primary-button" type="button" data-send-recruiting-mail-final>결과 발송</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderRecruitingMetrics() {
  const container = $("#recruiting-metrics-content");

  if (!container) {
    return;
  }

  const metrics = getRecruitingMetricsState();
  const activeTab = getRecruitingMetricsActiveTab();
  syncRecruitingProgressSheetComputedValues(metrics);

  container.innerHTML = `
    <div class="metrics-workspace">
      <section class="content-panel">
        <div class="panel-header">
          <div>
            <h4>${escapeHtml(getRecruitingMetricsTabLabel(activeTab))}</h4>
            <span>${activeTab === "details" ? "사업부 권한에 맞춰 채용 인물별 상세 데이터를 관리합니다." : "채용 실적 상세 값과 사업부별 목표를 기준으로 진행 경과를 취합합니다."}</span>
          </div>
          <div class="job-fit-result-actions">
            <button class="ghost-button compact-button" type="button" data-save-recruiting-metrics>저장</button>
            <button class="ghost-button compact-button" type="button" data-download-recruiting-metrics>엑셀 다운로드</button>
            ${activeTab === "details" ? `<button class="primary-button compact-button" type="button" data-open-recruiting-request-mail>취합 요청 메일발송</button>` : ""}
            ${activeTab === "progress" ? `<button class="primary-button compact-button" type="button" data-open-recruiting-mail>취합 결과 발송</button>` : ""}
          </div>
        </div>
        <div class="metrics-tab-list" role="tablist" aria-label="채용 지표 탭">
          ${RECRUITING_METRICS_TABS.map((tab) => `
            <button class="metrics-tab ${activeTab === tab.key ? "is-active" : ""}" type="button" role="tab" aria-selected="${activeTab === tab.key}" data-recruiting-metrics-tab="${escapeHtml(tab.key)}">
              ${escapeHtml(tab.label)}
            </button>
          `).join("")}
        </div>
        <div class="metrics-filter-row">
          ${renderRecruitingMetricsUnitFilter(activeTab)}
          ${activeTab === "progress" ? `
            <label class="field">
              <span>취합 기준 주</span>
              <input id="recruiting-metrics-week" class="control-input" type="date" value="${inputValue(metrics.weekOf)}" />
            </label>
          ` : ""}
        </div>
        ${renderRecruitingMetricsSheet(activeTab)}
      </section>
    </div>
    ${renderRecruitingMetricsMailModal()}
    ${renderRecruitingMetricsRequestMailModal()}
  `;
}

function renderRecruitingMetricsSheet(sheetKey) {
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const visibleRows = getRecruitingVisibleRows(sheetKey);

  return `
    <div class="metrics-sheet-toolbar">
      <div>
        <strong>${escapeHtml(getRecruitingMetricsTabLabel(sheetKey))} 데이터시트</strong>
        <span>${sheetKey === "details" ? "사업부 열은 드롭다운으로 입력하며, 권한 범위 밖의 데이터는 표시되지 않습니다." : "오퍼서명·입사완료·달성률은 채용 실적 상세 값으로 자동 반영됩니다."}</span>
      </div>
      <div class="job-fit-result-actions">
        <button class="ghost-button compact-button" type="button" data-add-recruiting-row="${escapeHtml(sheetKey)}">행 추가</button>
        <button class="ghost-button compact-button" type="button" data-add-recruiting-column="${escapeHtml(sheetKey)}">열 추가</button>
      </div>
    </div>
    <div class="table-scroll metrics-table-wrap metrics-sheet-wrap">
      <table class="metrics-table metrics-sheet-table">
        <thead>
          <tr>
            <th class="metrics-row-number">#</th>
            ${sheet.columns.map((column, columnIndex) => `
              <th>
                <div class="metrics-column-header">
                  <input class="metrics-column-input" value="${inputValue(column)}" aria-label="열 이름" data-recruiting-column="${escapeHtml(sheetKey)}" data-col="${columnIndex}" />
                  <button class="icon-button tiny-icon-button" type="button" aria-label="열 삭제" data-delete-recruiting-column="${escapeHtml(sheetKey)}" data-col="${columnIndex}" ${sheet.columns.length <= 1 ? "disabled" : ""}>×</button>
                </div>
              </th>
            `).join("")}
            <th class="metrics-action-column">관리</th>
          </tr>
        </thead>
        <tbody>
          ${visibleRows.map(({ row, rowIndex }, visibleIndex) => {
            const detailEditable = sheetKey === "details" ? canEditRecruitingDetailRow(row, sheet) : true;
            const progressUnitIndex = sheetKey === "progress" ? getRecruitingProgressColumnIndexes(sheet).unit : -1;
            const progressUnit = progressUnitIndex >= 0 ? normalizeBusinessUnit(row.cells[progressUnitIndex]) : "";
            const progressEditable = sheetKey !== "progress" || canEditRecruitingMetricsUnit(progressUnit);

            return `
              <tr>
                <th class="metrics-row-number">${visibleIndex + 1}</th>
                ${sheet.columns.map((column, columnIndex) => {
                  const isBusinessUnitCell = sheetKey === "details" && column === "사업부";
                  const disabled = sheetKey === "details"
                    ? !detailEditable
                    : !progressEditable || isRecruitingProgressComputedColumn(sheet, columnIndex);
                  let cellValue = row.cells[columnIndex] || "";

                  if (sheetKey === "progress") {
                    const indexes = getRecruitingProgressColumnIndexes(sheet);
                    const unit = indexes.unit >= 0 ? normalizeBusinessUnit(row.cells[indexes.unit]) : "";
                    const summary = unit ? getRecruitingMetricsComputedSummary(unit) : null;

                    if (summary && columnIndex === indexes.offerSigned) {
                      cellValue = String(summary.offerSigned);
                      row.cells[columnIndex] = cellValue;
                    } else if (summary && columnIndex === indexes.keyTalentSecured) {
                      cellValue = String(summary.keyTalentSecured);
                      row.cells[columnIndex] = cellValue;
                    } else if (summary && columnIndex === indexes.joined) {
                      cellValue = String(summary.joined);
                      row.cells[columnIndex] = cellValue;
                    } else if (summary && columnIndex === indexes.ratio) {
                      cellValue = `${summary.ratio}%`;
                      row.cells[columnIndex] = cellValue;
                    } else if (summary && columnIndex === indexes.keyTalentRatio) {
                      cellValue = `${summary.keyTalentRatio}%`;
                      row.cells[columnIndex] = cellValue;
                    }
                  }

                  return `
                    <td>
                      ${isBusinessUnitCell
                        ? renderRecruitingBusinessUnitCell(sheetKey, row, rowIndex, columnIndex, disabled)
                        : sheetKey === "details" && column === "핵심인력 여부"
                          ? renderRecruitingTalentGradeCell(sheetKey, row, rowIndex, columnIndex, disabled)
                          : `<textarea class="metrics-sheet-cell" rows="1" data-recruiting-cell="${escapeHtml(sheetKey)}" data-row="${rowIndex}" data-col="${columnIndex}" ${disabled ? "disabled" : ""}>${escapeHtml(cellValue)}</textarea>`}
                    </td>
                  `;
                }).join("")}
                <td class="metrics-action-column">
                  <button class="ghost-button compact-button metrics-row-delete" type="button" data-delete-recruiting-row="${escapeHtml(sheetKey)}" data-row="${rowIndex}" ${(sheet.rows.length <= 1 || (sheetKey === "details" && !detailEditable) || (sheetKey === "progress" && !progressEditable)) ? "disabled" : ""}>삭제</button>
                </td>
              </tr>
            `;
          }).join("")}
          ${sheetKey === "progress" ? (() => {
            const visibleUnits = visibleRows
              .map(({ row }) => {
                const indexes = getRecruitingProgressColumnIndexes(sheet);
                return indexes.unit >= 0 ? normalizeBusinessUnit(row.cells[indexes.unit]) : "";
              })
              .filter(Boolean);
            const rows = getRecruitingMetricsRows().filter((row) => visibleUnits.includes(row.unit));
            const total = getRecruitingMetricsTotalRow(rows);

            return `
              <tr class="metrics-total-row">
                <th class="metrics-row-number">합계</th>
                ${sheet.columns.map((_, columnIndex) => `<td>${escapeHtml(getRecruitingProgressTotalDisplayValue(columnIndex, total, sheet))}</td>`).join("")}
                <td class="metrics-action-column"></td>
              </tr>
            `;
          })() : ""}
        </tbody>
      </table>
    </div>
  `;
}

function updateRecruitingSheetCell(input) {
  const sheetKey = input.dataset.recruitingCell;
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const rowIndex = Number(input.dataset.row);
  const columnIndex = Number(input.dataset.col);

  if (!sheet?.rows?.[rowIndex] || !Number.isInteger(columnIndex)) {
    return;
  }

  const row = sheet.rows[rowIndex];

  if (sheetKey === "details") {
    const previousUnit = getRecruitingDetailRowUnit(row, sheet);
    const unitIndex = getRecruitingDetailBusinessUnitIndex(sheet);

    if (columnIndex === unitIndex) {
      const requestedUnit = normalizeBusinessUnit(input.value);

      if (requestedUnit && !canEditRecruitingMetricsUnit(requestedUnit)) {
        input.value = getRecruitingDetailRowUnit(row, sheet) || "";
        showToast("권한이 있는 사업부만 선택할 수 있습니다.");
        return;
      }

      row.cells[columnIndex] = requestedUnit;
    } else {
      if (!canEditRecruitingDetailRow(row, sheet)) {
        return;
      }

      ensureRecruitingDetailRowUnit(row, sheet);
      row.cells[columnIndex] = sheet.columns[columnIndex] === "핵심인력 여부"
        ? normalizeRecruitingTalentGrade(input.value)
        : input.value;
      input.value = row.cells[columnIndex];
    }

    syncRecruitingProgressSheetComputedValues();
    writeRecruitingProgressSummaryForUnit(previousUnit);
    writeRecruitingProgressSummaryForUnit(getRecruitingDetailRowUnit(row, sheet));
  } else {
    const unitIndex = getRecruitingProgressColumnIndexes(sheet).unit;
    const unit = unitIndex >= 0 ? normalizeBusinessUnit(row.cells[unitIndex]) : "";

    if (!canEditRecruitingMetricsUnit(unit) || isRecruitingProgressComputedColumn(sheet, columnIndex)) {
      return;
    }

    row.cells[columnIndex] = input.value;
    syncRecruitingTargetsFromProgressSheet();
    syncRecruitingProgressSheetComputedValues();
  }

  const metrics = getRecruitingMetricsState();
  metrics.saveStatus = "저장 전 변경사항이 있습니다.";
  persistState({ skipRemoteSync: true });
  syncRecruitingProgressSheetComputedValues(metrics);
}

function addRecruitingSheetRow(sheetKey) {
  const sheet = getRecruitingMetricsSheet(sheetKey);

  if (!sheet) {
    return;
  }

  const row = createRecruitingSheetRow(sheet.columns.length);

  if (sheetKey === "details") {
    ensureRecruitingDetailRowUnit(row, sheet);
  } else {
    const unitIndex = getRecruitingProgressColumnIndexes(sheet).unit;
    const unit = getRecruitingMetricsUnitFilter("progress") !== "all"
      ? getRecruitingMetricsUnitFilter("progress")
      : getRecruitingMetricsAllowedUnits()[0] || "";

    if (unitIndex >= 0 && unit) {
      row.cells[unitIndex] = unit;
    }
  }

  sheet.rows.push(row);
  getRecruitingMetricsState().saveStatus = "저장 전 변경사항이 있습니다.";
  persistState({ skipRemoteSync: true });
  renderRecruitingMetrics();
}

function handleRecruitingSheetPaste(event) {
  const input = event.target.closest("[data-recruiting-cell]");

  if (!input) {
    return;
  }

  const text = event.clipboardData?.getData("text/plain") || "";

  if (!text.includes("\t") && !text.includes("\n")) {
    return;
  }

  event.preventDefault();

  const sheetKey = input.dataset.recruitingCell;
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const startRow = Number(input.dataset.row);
  const startColumn = Number(input.dataset.col);

  if (!sheet || !Number.isInteger(startRow) || !Number.isInteger(startColumn)) {
    return;
  }

  const rows = text
    .replace(/\r/g, "")
    .replace(/\n$/, "")
    .split("\n")
    .map((line) => line.split("\t"));
  const requiredRows = startRow + rows.length;
  const requiredColumns = startColumn + Math.max(...rows.map((row) => row.length), 1);

  ensureRecruitingSheetSize(sheet, requiredRows, requiredColumns);

  rows.forEach((cells, rowOffset) => {
    const targetRow = sheet.rows[startRow + rowOffset];

    if (sheetKey === "details") {
      ensureRecruitingDetailRowUnit(targetRow, sheet);
    }

    cells.forEach((cell, columnOffset) => {
      const columnIndex = startColumn + columnOffset;

      if (sheetKey === "details" && !canEditRecruitingDetailRow(targetRow, sheet)) {
        return;
      }

      if (sheetKey === "progress" && isRecruitingProgressComputedColumn(sheet, columnIndex)) {
        return;
      }

      targetRow.cells[columnIndex] = sheetKey === "details" && sheet.columns[columnIndex] === "핵심인력 여부"
        ? normalizeRecruitingTalentGrade(cell)
        : cell.trim();
    });
  });

  if (sheetKey === "progress") {
    syncRecruitingTargetsFromProgressSheet();
  }

  syncRecruitingProgressSheetComputedValues();
  getRecruitingMetricsState().saveStatus = "저장 전 변경사항이 있습니다.";
  persistState({ skipRemoteSync: true });
  renderRecruitingMetrics();
}

function buildRecruitingMetricsExcelHtml(sheetKey = getRecruitingMetricsActiveTab()) {
  const sheet = getRecruitingMetricsSheet(sheetKey);
  const title = getRecruitingMetricsTabLabel(sheetKey);
  const visibleRows = getRecruitingVisibleRows(sheetKey);

  return [
    "<html><head><meta charset=\"utf-8\"><style>",
    "table{border-collapse:collapse;font-family:'Malgun Gothic',Arial,sans-serif;font-size:11pt}th,td{border:1px solid #d1d5db;padding:8px;text-align:left;vertical-align:top}th{background:#eef4ff;font-weight:700}",
    "</style></head><body>",
    `<h2>${escapeHtml(title)} (${escapeHtml(getRecruitingMetricsState().weekOf || getTodayDate())})</h2>`,
    "<table><thead><tr>",
    sheet.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join(""),
    "</tr></thead><tbody>",
    visibleRows.map(({ row }) => {
      const progressIndexes = sheetKey === "progress" ? getRecruitingProgressColumnIndexes(sheet) : null;

      return `
        <tr>
          ${sheet.columns.map((_, index) => {
            let value = row.cells[index] || "";

            if (sheetKey === "progress" && progressIndexes) {
              value = getRecruitingProgressDisplayValue(index, row, sheet);
            }

            return `<td>${escapeHtml(value)}</td>`;
          }).join("")}
        </tr>
      `;
    }).join(""),
    sheetKey === "progress" ? (() => {
      const visibleUnits = visibleRows
        .map(({ row }) => {
          const indexes = getRecruitingProgressColumnIndexes(sheet);
          return indexes.unit >= 0 ? normalizeBusinessUnit(row.cells[indexes.unit]) : "";
        })
        .filter(Boolean);
      const total = getRecruitingMetricsTotalRow(getRecruitingMetricsRows().filter((row) => visibleUnits.includes(row.unit)));
      return `
        <tr>
          ${sheet.columns.map((_, index) => `<td>${escapeHtml(getRecruitingProgressTotalDisplayValue(index, total, sheet))}</td>`).join("")}
        </tr>
      `;
    })() : "",
    "</tbody></table></body></html>"
  ].join("");
}

async function sendRecruitingMetricsMail() {
  const metrics = getRecruitingMetricsState();
  const draft = getRecruitingMailDraft();
  metrics.mailStatus = "채용 진행 경과 메일을 발송 중입니다.";
  renderRecruitingMetrics();

  try {
    const recipients = normalizeEmailList(draft.recipients);

    if (!recipients.length) {
      throw new Error("메일 수신처를 입력해 주세요.");
    }

    const response = await fetch("/api/recruiting-metrics-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "result",
        recipients,
        subject: draft.subject || "[TalentHub] 채용 진행 경과",
        body: draft.body,
        frequency: draft.frequency,
        weekOf: metrics.weekOf,
        html: buildRecruitingMetricsExcelHtml("progress"),
        rows: getRecruitingMetricsRows()
      })
    });
    const result = await parseJsonMailResponse(response, "채용 진행 경과 메일 발송");

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "메일 발송에 실패했습니다.");
    }

    metrics.mailStatus = `채용 진행 경과 메일을 발송했습니다. (${recipients.length}명)`;
    showToast(metrics.mailStatus);
    metrics.lastAutoSentWeek = metrics.weekOf || getTodayDate();
    recruitingMetricsMailModalOpen = false;
    metrics.mailFrequency = draft.frequency;
    metrics.subject = draft.subject;
    metrics.mailBody = draft.body;
    metrics.recipients = recipients;
    metrics.mailDraft = draft;
    addAuditLog("채용 지표 메일 발송", "채용 지표", recipients.join(", "));
  } catch (error) {
    console.warn(error);
    metrics.mailStatus = error.message || "채용 지표 메일 발송 중 오류가 발생했습니다.";
    showToast(metrics.mailStatus);
  }

  persistState();
  renderRecruitingMetrics();
}

function getDateOnly(value) {
  const text = String(value || "").trim();
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : text;
}

function setRecruitingRowValue(row, sheet, names, value, options = {}) {
  const index = getRecruitingSheetColumnIndex(sheet, names);
  const nextValue = String(value || "").trim();

  if (index < 0 || !nextValue) {
    return;
  }

  if (options.overwrite || !String(row.cells[index] || "").trim()) {
    row.cells[index] = nextValue;
  }
}

function getRecruitingDetailNoteWithInterviewId(note, interviewCaseId, positionName) {
  const current = String(note || "").trim();
  const marker = `Interview ID: ${interviewCaseId}`;

  if (current.includes(marker)) {
    return current;
  }

  const syncNote = ["Interview 연동", positionName, marker].filter(Boolean).join(" · ");
  return current ? `${current}\n${syncNote}` : syncNote;
}

function findRecruitingMetricRowForInterviewCase(interviewCase, sheet) {
  if (!sheet?.rows?.length) {
    return null;
  }

  if (interviewCase.recruitingMetricRowId) {
    const matchedById = sheet.rows.find((row) => row.id === interviewCase.recruitingMetricRowId);

    if (matchedById) {
      return matchedById;
    }
  }

  const noteIndex = getRecruitingSheetColumnIndex(sheet, ["비고"]);

  if (noteIndex >= 0) {
    const marker = `Interview ID: ${interviewCase.id}`;
    const matchedByNote = sheet.rows.find((row) => String(row.cells[noteIndex] || "").includes(marker));

    if (matchedByNote) {
      return matchedByNote;
    }
  }

  return null;
}

function syncInterviewOfferToRecruitingMetrics(interviewCase) {
  const normalizedCase = normalizeInterviewCase(interviewCase);

  if (!normalizedCase.offerSignedAt) {
    return "";
  }

  const metrics = getRecruitingMetricsState();
  const sheet = metrics.detailSheet;

  if (!sheet?.columns?.length) {
    return "";
  }

  let row = findRecruitingMetricRowForInterviewCase(normalizedCase, sheet);
  const isNewRow = !row;

  if (!row) {
    row = createRecruitingSheetRow(sheet.columns.length);
    sheet.rows.push(row);
  }

  const education = normalizedCase.education?.[0] || {};
  const career = normalizedCase.career?.[0] || {};
  const rankAndTitle = uniqueTextParts([career.rank, career.position]).join(", ");
  const owner = normalizedCase.offerSignedBy || getCurrentActorName();

  setRecruitingRowValue(row, sheet, ["이름"], normalizedCase.candidateName, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["출생년도"], normalizedCase.birthYear, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["사업부"], normalizedCase.businessUnit, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["직무"], normalizedCase.positionName || normalizedCase.currentRole, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["최종학위"], education.degree, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["학교명"], education.school, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["전공"], education.major, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["직장명"], career.company || normalizedCase.company, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["직급/직책"], rankAndTitle || normalizedCase.currentRole, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["소속부서"], normalizedCase.department, { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["채용유형"], "면접운영", { overwrite: isNewRow });
  setRecruitingRowValue(row, sheet, ["오퍼서명일"], getDateOnly(normalizedCase.offerSignedAt), { overwrite: true });
  setRecruitingRowValue(row, sheet, ["담당자"], owner, { overwrite: isNewRow });

  const noteIndex = getRecruitingSheetColumnIndex(sheet, ["비고"]);

  if (noteIndex >= 0) {
    row.cells[noteIndex] = getRecruitingDetailNoteWithInterviewId(row.cells[noteIndex], normalizedCase.id, normalizedCase.positionName);
  }

  syncRecruitingTargetsFromProgressSheet(metrics);
  syncRecruitingProgressSheetComputedValues(metrics);
  metrics.saveStatus = `Interview 오퍼서명 정보가 채용 실적 상세에 반영되었습니다. · ${getTimestampText()}`;
  syncRecruitingMetricsToSupabase().catch((error) => {
    console.warn("Recruiting metrics remote save failed.", error);
  });

  return row.id;
}

function markInterviewOfferSigned(interviewCaseId) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    interviewCase.offerSignedAt = interviewCase.offerSignedAt || getTimestampText();
    interviewCase.offerSignedBy = interviewCase.offerSignedBy || getCurrentMember()?.name || "시스템";
  });

  const saved = findInterviewCase(interviewCaseId);

  if (saved) {
    const metricRowId = syncInterviewOfferToRecruitingMetrics(saved);

    if (metricRowId) {
      saved.recruitingMetricRowId = metricRowId;
      saved.offerSyncedToMetricsAt = getTimestampText();
      replaceInterviewCase(saved);
      persistState();
      syncInterviewCasesToSupabase().catch((error) => {
        console.warn("Interview cases remote save failed.", error);
      });
    }
  }

  showToast("오퍼서명 완료 정보가 채용 실적 상세에 반영되었습니다.");
  render();
}

function markInterviewJoined(interviewCaseId) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    interviewCase.joinedAt = getTimestampText();
    interviewCase.joinedBy = getCurrentMember()?.name || "시스템";
  });
  showToast("입사 완료로 반영했습니다.");
  render();
}

function renderRegister() {
  $("#register-content").innerHTML = `
    <div class="form-grid">
      <form class="form-panel register-form-panel" id="register-form">
        <div class="field-grid">
          <div class="field">
            <label for="profile-photo">프로필 사진</label>
            <div class="dropzone profile-upload compact-upload">
              <input id="profile-photo" name="photo" type="file" accept="image/*" />
              <div id="photo-preview" class="photo-preview">사진 미리보기</div>
              <span>상세 프로필 상단에 표시됩니다.</span>
              <button class="ghost-button compact-button" type="button" data-clear-register-photo>선택 취소</button>
            </div>
          </div>
          <div class="field">
            <label for="resume-file">이력서</label>
            <div class="dropzone compact-upload">
              <input id="resume-file" name="resume" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
              <span id="resume-parse-status" class="form-help">이력서를 업로드하면 읽을 수 있는 정보만 아래 입력란에 자동 입력됩니다.</span>
              <button class="ghost-button compact-button" type="button" data-clear-register-resume>선택 취소</button>
            </div>
          </div>
          <div class="field">
            <label for="candidate-name">이름</label>
            <input class="control-input" id="candidate-name" name="name" autocomplete="off" />
          </div>
          <div class="field">
            <label for="candidate-english-name">이름(영문)</label>
            <input class="control-input" id="candidate-english-name" name="englishName" autocomplete="off" />
          </div>
          <div class="field">
            <label for="candidate-role">핵심 역량</label>
            <textarea class="control-textarea compact-textarea" id="candidate-role" name="role" rows="4"></textarea>
          </div>
          <div class="field">
            <label for="candidate-summary">주요성과/실적</label>
            <textarea class="control-textarea compact-textarea" id="candidate-summary" name="summary" rows="4"></textarea>
          </div>
          <div class="field">
            <label for="candidate-organization">사업부</label>
            <select class="control-select" id="candidate-organization" name="organization">
              ${renderBusinessUnitOptions(getMemberBusinessUnit())}
            </select>
          </div>
          <div class="field">
            <label for="candidate-visibility">공개 범위</label>
            <select class="control-select" id="candidate-visibility" name="visibility">
              ${renderCandidateVisibilityOptions("all")}
            </select>
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
            <label for="candidate-nationality">국적</label>
            <input class="control-input" id="candidate-nationality" name="nationality" autocomplete="off" />
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
            <label for="candidate-reference-url">기타 참고 URL 1</label>
            <input class="control-input" id="candidate-reference-url" name="referenceUrl" type="url" autocomplete="url" />
          </div>
          <div class="field">
            <label for="candidate-reference-url-2">기타 참고 URL 2</label>
            <input class="control-input" id="candidate-reference-url-2" name="referenceUrl2" type="url" autocomplete="url" />
          </div>
          <div class="field">
            <label for="candidate-reference-url-3">기타 참고 URL 3</label>
            <input class="control-input" id="candidate-reference-url-3" name="referenceUrl3" type="url" autocomplete="url" />
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

        <section class="edit-section register-section">
          <div class="edit-section-header">
            <h5>키워드</h5>
          </div>
          <div class="field">
            <label for="candidate-skills">키워드</label>
            <textarea class="control-textarea compact-textarea" id="candidate-skills" name="skills" rows="3"></textarea>
            <span class="form-help">기술, 도메인, 툴, 핵심 키워드를 줄바꿈 또는 쉼표로 입력합니다.</span>
          </div>
        </section>

        <section class="edit-section register-section">
          <div class="edit-section-header">
            <h5>기타 첨부파일</h5>
          </div>
          <div class="field">
            <label for="candidate-other-attachments">개인정보동의서, 포트폴리오 등</label>
            <div class="dropzone compact-upload">
              <input id="candidate-other-attachments" name="otherAttachments" type="file" multiple accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png" />
              <span class="form-help">이력서 외 보관이 필요한 자료를 여러 개 첨부할 수 있습니다.</span>
              <button class="ghost-button compact-button" type="button" data-clear-register-attachments>선택 취소</button>
            </div>
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
          <label for="register-education-affiliation-${index}">소속</label>
          <input class="control-input" id="register-education-affiliation-${index}" name="register-education-affiliation-${index}" value="${inputValue(item.affiliation)}" />
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
          <label for="register-career-rank-${index}">직급/직책</label>
          <input class="control-input" id="register-career-rank-${index}" name="register-career-rank-${index}" value="${inputValue(item.rank)}" />
        </div>
        <div class="field">
          <label for="register-career-position-${index}">소속부서</label>
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
          <label for="register-career-achievements-${index}">주요성과/실적</label>
          <textarea class="control-textarea" id="register-career-achievements-${index}" name="register-career-achievements-${index}">${inputValue(item.achievements)}</textarea>
        </div>
      </div>
    </article>
  `;
}

function renderScreeningEducationRecord(item = {}, index = 0, disabledAttr = "") {
  return `
    <article class="edit-record" data-screening-education-index="${index}">
      <div class="edit-record-header">
        <strong>학력 ${index + 1}</strong>
        <button class="ghost-button danger-button compact-button" type="button" data-remove-screening-education="${index}" ${disabledAttr}>삭제</button>
      </div>
      <div class="field-grid">
        <div class="field">
          <label for="screening-education-degree-${index}">학위</label>
          <input class="control-input" id="screening-education-degree-${index}" name="screening-education-degree-${index}" value="${inputValue(item.degree)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-education-school-${index}">학교명</label>
          <input class="control-input" id="screening-education-school-${index}" name="screening-education-school-${index}" value="${inputValue(item.school)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-education-major-${index}">전공명</label>
          <input class="control-input" id="screening-education-major-${index}" name="screening-education-major-${index}" value="${inputValue(item.major)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-education-affiliation-${index}">소속</label>
          <input class="control-input" id="screening-education-affiliation-${index}" name="screening-education-affiliation-${index}" value="${inputValue(item.affiliation)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-education-start-${index}">학위 시작</label>
          <input class="control-input" id="screening-education-start-${index}" name="screening-education-start-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.start)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-education-end-${index}">학위 종료</label>
          <input class="control-input" id="screening-education-end-${index}" name="screening-education-end-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.end)}" ${disabledAttr} />
        </div>
      </div>
    </article>
  `;
}

function renderScreeningCareerRecord(item = {}, index = 0, disabledAttr = "") {
  const isCurrent = item.end === "현재";
  const endDisabledAttr = isCurrent ? "disabled" : disabledAttr;

  return `
    <article class="edit-record" data-screening-career-index="${index}">
      <div class="edit-record-header">
        <strong>경력 ${index + 1}</strong>
        <button class="ghost-button danger-button compact-button" type="button" data-remove-screening-career="${index}" ${disabledAttr}>삭제</button>
      </div>
      <div class="field-grid">
        <div class="field">
          <label for="screening-career-country-${index}">직장 소재 국가</label>
          <input class="control-input" id="screening-career-country-${index}" name="screening-career-country-${index}" value="${inputValue(item.country)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-career-company-${index}">직장명</label>
          <input class="control-input" id="screening-career-company-${index}" name="screening-career-company-${index}" value="${inputValue(item.company)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-career-rank-${index}">직급/직책</label>
          <input class="control-input" id="screening-career-rank-${index}" name="screening-career-rank-${index}" value="${inputValue(item.rank)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-career-position-${index}">소속부서</label>
          <input class="control-input" id="screening-career-position-${index}" name="screening-career-position-${index}" value="${inputValue(item.position)}" ${disabledAttr} />
        </div>
        <div class="field">
          <label for="screening-career-start-${index}">근무 시작</label>
          <input class="control-input" id="screening-career-start-${index}" name="screening-career-start-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${inputValue(item.start)}" ${disabledAttr} />
        </div>
        <div class="field ${isCurrent ? "is-hidden" : ""}" data-career-end-field>
          <label for="screening-career-end-${index}">근무 종료</label>
          <input class="control-input" id="screening-career-end-${index}" name="screening-career-end-${index}" type="text" inputmode="numeric" placeholder="YYYY-MM 또는 0" value="${isCurrent ? "" : inputValue(item.end)}" ${endDisabledAttr} />
        </div>
        <div class="field">
          <label class="inline-check"><input type="checkbox" name="screening-career-current-${index}" ${isCurrent ? "checked" : ""} ${disabledAttr} /> 현재 재직 중</label>
        </div>
        <div class="field full">
          <label for="screening-career-achievements-${index}">주요성과/실적</label>
          <textarea class="control-textarea" id="screening-career-achievements-${index}" name="screening-career-achievements-${index}" ${disabledAttr}>${inputValue(item.achievements)}</textarea>
        </div>
      </div>
    </article>
  `;
}

function renderAiSearch() {
  const interpreted = state.aiQuery ? interpretQuery(state.aiQuery) : [];
  const aiFileStatus = state.aiSearchStatus
    ? renderMaybeProgressStatus(state.aiSearchStatus, state.aiSearchLoading, state.aiSearchProgress)
    : state.aiSearchFileName
      ? `${escapeHtml(state.aiSearchFileName)} 내용을 검색 조건으로 반영했습니다.`
      : "직무기술서, JD, 포지션 설명 파일을 업로드하면 내용을 읽어 적합도를 분석합니다.";
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
          <span id="ai-file-status" class="form-help">${aiFileStatus}</span>
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

function normalizeJobFitResume(resume = {}) {
  const text = normalizeResumeText(resume.text || "");
  const fileName = String(resume.fileName || resume.name || "이력서").trim();
  const existingName = normalizeInferredCandidateName(resume.candidateName);
  const hasResumeEducation = Array.isArray(resume.education) && resume.education.some(hasAnyRecordValue);
  const hasResumeCareer = Array.isArray(resume.career) && resume.career.some(hasAnyRecordValue);
  const needsProfileExtraction = text && (!existingName || !hasResumeEducation || !hasResumeCareer);
  const parsedProfile = needsProfileExtraction
    ? normalizeParsedResumeForForm(parseResumeText(text, fileName))
    : {};
  const enhancedProfile = needsProfileExtraction
    ? extractEnhancedJobFitResumeProfile(text, fileName)
    : {};
  const education = normalizeJobFitEducationRecords(
    hasResumeEducation
      ? resume.education
      : chooseBetterJobFitRecords(enhancedProfile.education, parsedProfile.education)
  );
  const career = normalizeJobFitCareerRecords(
    hasResumeCareer
      ? resume.career
      : chooseBetterJobFitRecords(enhancedProfile.career, parsedProfile.career)
  );

  return {
    id: resume.id || createId("job-fit-resume"),
    fileName,
    source: String(resume.source || "").trim(),
    candidateId: String(resume.candidateId || resume.candidate_id || "").trim(),
    size: Number(resume.size || 0),
    type: String(resume.type || "").trim(),
    dataUrl: String(resume.dataUrl || resume.downloadUrl || "").trim(),
    text,
    candidateName: getBestJobFitCandidateName(existingName, enhancedProfile.name, parsedProfile.name, inferCandidateNameFromResume(text, fileName)),
    education,
    career,
    uploadedAt: resume.uploadedAt || getTimestampText()
  };
}

function chooseBetterJobFitRecords(primary = [], fallback = []) {
  const primaryRecords = Array.isArray(primary) ? primary.filter(hasAnyRecordValue) : [];
  const fallbackRecords = Array.isArray(fallback) ? fallback.filter(hasAnyRecordValue) : [];
  const scoreRecords = (records) => records.reduce((sum, item) =>
    sum + Object.values(item || {}).filter((value) => cleanParsedValue(value)).length, 0);

  return scoreRecords(primaryRecords) >= scoreRecords(fallbackRecords)
    ? primaryRecords
    : fallbackRecords;
}

function normalizeEnhancedResumeLine(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/[•·●◆■▶▷]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitEnhancedResumeLines(text) {
  const normalized = normalizeResumeText(text)
    .replace(/\r/g, "\n")
    .replace(/[|]/g, "\n")
    .replace(/([가-힣A-Za-z])\s{3,}([가-힣A-Za-z])/g, "$1\n$2");

  return normalized
    .split(/\n+/)
    .map(normalizeEnhancedResumeLine)
    .filter(Boolean)
    .slice(0, 800);
}

function extractEnhancedSectionLines(lines, headerPattern, boundaryPattern) {
  const sectionLines = [];
  let inSection = false;

  lines.forEach((line) => {
    if (headerPattern.test(line)) {
      inSection = true;
      const withoutHeader = normalizeEnhancedResumeLine(line.replace(headerPattern, ""));

      if (withoutHeader) {
        sectionLines.push(withoutHeader);
      }
      return;
    }

    if (inSection && boundaryPattern.test(line)) {
      inSection = false;
      return;
    }

    if (inSection) {
      sectionLines.push(line);
    }
  });
  return sectionLines;
}

function normalizeEnhancedSchoolName(value) {
  const text = normalizeEnhancedResumeLine(value);

  if (!text) {
    return "";
  }

  const replacements = [
    [/카이스트|Korea Advanced Institute of Science and Technology/gi, "KAIST"],
    [/서울대(?!학교)|Seoul National University/gi, "서울대학교"],
    [/연세대(?!학교)/g, "연세대학교"],
    [/고려대(?!학교)/g, "고려대학교"],
    [/한양대(?!학교)/g, "한양대학교"],
    [/성균관대(?!학교)/g, "성균관대학교"],
    [/포스텍|포항공대|Pohang University of Science and Technology/gi, "POSTECH"]
  ];

  return replacements.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
}

function extractEnhancedPeriod(value) {
  const text = String(value || "");
  const current = /(현재|재직|present|current|ongoing)/i.test(text);
  const normalized = text
    .replace(/(\d{4})\s*년\s*(\d{1,2})?\s*월?/g, (_, year, month) => `${year}-${month || "0"}`)
    .replace(/(\d{4})\s*[.\/]\s*(\d{1,2})/g, "$1-$2");
  const matches = [...normalized.matchAll(/(\d{4})(?:\s*[-]\s*(\d{1,2}))?/g)]
    .map((match) => normalizeDatePart(match[1], match[2] || "0"));

  return {
    start: matches[0] || "",
    end: current ? "현재" : matches[1] || ""
  };
}

function removeEnhancedPeriodText(value) {
  return normalizeEnhancedResumeLine(value)
    .replace(/(?:19|20)\d{2}\s*(?:년|[.\-/])?\s*(?:\d{1,2})?\s*(?:월)?\s*(?:~|～|-|–|—|to)\s*(?:현재|재직\s*중|present|current|(?:19|20)\d{2}\s*(?:년|[.\-/])?\s*(?:\d{1,2})?\s*(?:월)?)/gi, " ")
    .replace(/(?:19|20)\d{2}\s*(?:년|[.\-/])?\s*(?:\d{1,2})?\s*(?:월)?/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectEnhancedDegree(value) {
  const text = String(value || "");

  if (/박사|ph\.?\s*d|doctor/i.test(text)) return "박사";
  if (/석사|master|m\.?\s*s|m\.?\s*a|mba/i.test(text)) return "석사";
  if (/학사|bachelor|b\.?\s*s|b\.?\s*a/i.test(text)) return "학사";
  return "";
}

function extractEnhancedSchool(value) {
  const text = normalizeEnhancedSchoolName(value);
  const match = text.match(/(KAIST|POSTECH|UNIST|DGIST|GIST|[가-힣A-Za-z .&-]+?(?:대학교|대학원|대학|University|College|Institute))/i);

  return normalizeEnhancedSchoolName(match?.[1] || "");
}

function extractEnhancedMajor(value, school, degree) {
  const text = normalizeEnhancedResumeLine(value);
  const explicit = text.match(/(?:전공|Major)\s*[:：]?\s*([가-힣A-Za-z0-9 /&.+-]{2,40})/i)?.[1] || "";

  if (explicit) {
    return normalizeEnhancedResumeLine(explicit)
      .replace(/[()]/g, "")
      .trim();
  }

  let stripped = removeEnhancedPeriodText(text);
  [school, normalizeEnhancedSchoolName(school), degree, "박사", "석사", "학사", "Ph.D", "Master", "Bachelor"].filter(Boolean)
    .forEach((token) => {
      stripped = stripped.replace(new RegExp(escapeRegExp(token), "gi"), " ");
    });
  stripped = stripped
    .replace(/졸업|수료|취득|지도교수\s*[:：]?\s*[가-힣A-Za-z\s]+/g, " ")
    .replace(/[()[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const parts = stripped
    .split(/[,;/]/)
    .map(normalizeEnhancedResumeLine)
    .filter(Boolean);
  const major = parts.find((part) =>
    /(학과|전공|공학|과학|디자인|경영|경제|통계|컴퓨터|전자|전기|기계|로봇|Robotics|Science|Engineering|Design|Business|Statistics)/i.test(part)
  ) || parts.at(-1) || "";

  return normalizeEnhancedResumeLine(major).slice(0, 60);
}

function parseEnhancedEducationLine(line) {
  if (/고등학교/.test(line)) {
    return null;
  }

  const degree = detectEnhancedDegree(line);
  const school = extractEnhancedSchool(line);

  if (!degree && !school) {
    return null;
  }

  const period = extractEnhancedPeriod(line);
  const major = extractEnhancedMajor(line, school, degree);

  return {
    degree,
    school,
    major,
    start: period.start,
    end: period.end
  };
}

function extractEnhancedEducation(text, lines) {
  const sectionLines = extractEnhancedSectionLines(
    lines,
    /^(?:학력|교육|Education|Academic Background|Education Background)\s*[:：\-]*/i,
    /^(?:경력|상세\s*경력|Professional Experience|Work Experience|Experience|Career|프로젝트|Project|기술|Skills|자격|Certification|수상|Awards?)/i
  );
  const candidates = [...sectionLines, ...lines]
    .filter((line) =>
      /(박사|석사|학사|Ph\.?\s*D|Master|Bachelor|대학교|대학원|University|College|KAIST|POSTECH|전공|Major)/i.test(line) &&
      !/(경력|Experience|회사|근무|재직|Project|프로젝트)/i.test(line)
    );
  const records = candidates
    .map(parseEnhancedEducationLine)
    .filter(Boolean)
    .filter(hasAnyRecordValue);
  const byKey = new Map();

  records.forEach((record) => {
    const key = [record.degree, record.school, record.major, record.start, record.end].join("|").toLowerCase();

    if (!byKey.has(key)) {
      byKey.set(key, record);
    }
  });

  return [...byKey.values()]
    .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)))
    .slice(0, 5);
}

function looksLikeEnhancedCareerCompany(value) {
  return /(삼성|LG|SK|현대|네이버|NAVER|카카오|Kakao|크래프톤|Bluehole|본엔젤스|미래로봇|뉴로메카트로닉스|아모레퍼시픽|백화점|전자|SDS|로보틱스|연구소|기술연구소|테크|랩|Labs?|Studio|Group|Inc\.?|Corp\.?|Corporation|Research|Technology|Technologies|Company|Co\.?)/i.test(value);
}

function looksLikeEnhancedCareerRole(value) {
  return /(사원|주임|대리|과장|차장|부장|상무|전무|부사장|사장|회장|대표|고문|이사회|의장|창업자|교수|연구원|선임|책임|수석|엔지니어|개발자|디자이너|매니저|Manager|Director|Engineer|Developer|Designer|Researcher|Scientist|Professor|Principal|Staff|Senior|Lead|Associate|Founder|CEO|CTO|CFO|COO|Head|VP)/i.test(value);
}

function looksLikeEnhancedDepartment(value) {
  const text = normalizeEnhancedResumeLine(value);

  if (!text || looksLikeEnhancedCareerRole(text)) {
    return false;
  }

  return /(팀|그룹|센터|실|본부|사업부|부문|부서|연구소|랩|Lab|Team|Group|Center|Division|Department|Office|Unit|TF|조직|파트|Chapter|Squad|Cell|Tribe)/i.test(text);
}

function splitEnhancedCareerParts(value) {
  return removeEnhancedPeriodText(value)
    .split(/[,;|\t/]+/)
    .map(normalizeEnhancedResumeLine)
    .filter(Boolean);
}

function extractEnhancedCompany(line, parts) {
  const partCompany = parts.find(looksLikeEnhancedCareerCompany);

  if (partCompany) {
    return partCompany;
  }

  const match = line.match(/([가-힣A-Za-z0-9 .&+-]{2,45}(?:전자|로보틱스|연구소|기술연구소|메카트로닉스|백화점|퍼시픽|SDS|랩|Labs?|Studio|Group|Inc\.?|Corp\.?|Corporation|Research|Technology|Technologies|Company|Co\.?))/i);
  return normalizeEnhancedResumeLine(match?.[1] || "");
}

function parseEnhancedCareerLine(line) {
  const period = extractEnhancedPeriod(line);
  const parts = splitEnhancedCareerParts(line);
  const company = extractEnhancedCompany(line, parts);

  if (!company && !period.start) {
    return null;
  }

  const roleParts = parts
    .filter((part) => part !== company)
    .filter((part) => !/^(대한민국|한국|미국|일본|중국|Korea|USA|United States)$/i.test(part));
  const rankParts = [];
  const departmentParts = [];

  roleParts.forEach((part) => {
    if (looksLikeEnhancedDepartment(part)) {
      departmentParts.push(part);
    } else if (looksLikeEnhancedCareerRole(part)) {
      rankParts.push(part);
    }
  });

  if (!rankParts.length) {
    const roleMatch = line.match(/(CL\d|사원|주임|대리|과장|차장|부장|상무|전무|대표|고문|의장|창업자|교수|선임\s*연구원|책임\s*연구원|수석\s*연구원|연구원|엔지니어|개발자|디자이너|Manager|Director|Engineer|Developer|Designer|Researcher|Scientist|Professor|Principal|Staff|Senior|Lead|Associate|Founder|CEO|CTO|Head)/i);

    if (roleMatch) {
      rankParts.push(roleMatch[1]);
    }
  }

  if (!departmentParts.length) {
    const departmentMatch = line.match(/([가-힣A-Za-z0-9 .&+-]{2,35}(?:팀|그룹|센터|실|본부|사업부|부문|연구소|랩|Lab|Team|Group|Center|Division|Department|Office|Unit|TF))/i);

    if (departmentMatch && departmentMatch[1] !== company) {
      departmentParts.push(departmentMatch[1]);
    }
  }

  return {
    country: "",
    company,
    rank: uniqueTextParts(rankParts).join(", "),
    position: uniqueTextParts(departmentParts.filter((part) => part !== company)).join(", "),
    start: period.start,
    end: period.end,
    achievements: ""
  };
}

function extractEnhancedCareer(text, lines) {
  const sectionLines = extractEnhancedSectionLines(
    lines,
    /^(?:상세\s*)?(?:경력|경력사항|경력정보|Professional Experience|Work Experience|Experience|Career)\s*[:：\-]*/i,
    /^(?:학력|Education|프로젝트|Project|기술|Skills|자격|Certification|수상|Awards?|논문|Publication)/i
  );
  const sourceLines = sectionLines.length ? sectionLines : lines;
  const candidates = [];

  sourceLines.forEach((line, index) => {
    const previous = sourceLines[index - 1] || "";
    const next = sourceLines[index + 1] || "";
    const nextAfter = sourceLines[index + 2] || "";
    const hasPeriod = Boolean(extractEnhancedPeriod(line).start);
    const companyLike = looksLikeEnhancedCareerCompany(line);
    const roleLike = looksLikeEnhancedCareerRole(line);

    if ((hasPeriod && (companyLike || roleLike)) || (companyLike && (hasPeriod || roleLike || extractEnhancedPeriod(next).start))) {
      candidates.push([previous, line, next, nextAfter].filter(Boolean).join(" "));
    } else if (sectionLines.length && (hasPeriod || companyLike || roleLike)) {
      candidates.push([line, next].filter(Boolean).join(" "));
    }
  });

  const records = candidates
    .map(parseEnhancedCareerLine)
    .filter(Boolean)
    .filter((record) => record.company || record.rank || record.position)
    .filter((record) => !/(대학교|대학원|University|College|학사|석사|박사|전공)/i.test(record.company || ""));
  const byKey = new Map();

  records.forEach((record) => {
    const key = [record.company, record.rank, record.position, record.start, record.end].join("|").toLowerCase();

    if (!byKey.has(key)) {
      byKey.set(key, record);
    }
  });

  return [...byKey.values()]
    .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)))
    .slice(0, 8);
}

function extractEnhancedJobFitResumeProfile(text, fileName = "") {
  try {
    const lines = splitEnhancedResumeLines(text);
    const labeledName = normalizeInferredCandidateName(findLabeledValue(lines, ["이름", "성명", "Name", "Full Name"]));
    const simpleName = lines
      .slice(0, 80)
      .map((line) => normalizeInferredCandidateName(line.match(/\b([가-힣]{2,5})\b/)?.[1] || line))
      .find(Boolean);

    return {
      name: labeledName || simpleName || inferCandidateNameFromResume(text, fileName),
      education: extractEnhancedEducation(text, lines),
      career: extractEnhancedCareer(text, lines)
    };
  } catch (error) {
    console.warn("Enhanced job fit resume profile extraction failed.", error);
    return {
      name: inferCandidateNameFromResume(text, fileName),
      education: [],
      career: []
    };
  }
}

function normalizeEnhancedCareerRoleFields(rank, position) {
  const rankParts = [];
  const departmentParts = [];

  [rank, position]
    .flatMap((value) => String(value || "").split(/\s*,\s*/))
    .map(normalizeEnhancedResumeLine)
    .filter(Boolean)
    .forEach((value) => {
      if (looksLikeEnhancedDepartment(value)) {
        departmentParts.push(value);
      } else if (looksLikeEnhancedCareerRole(value)) {
        rankParts.push(value);
      } else if (!rankParts.length && value.length <= 35) {
        rankParts.push(value);
      } else if (value.length <= 35) {
        departmentParts.push(value);
      }
    });

  return {
    rank: uniqueTextParts(rankParts).join(", "),
    position: uniqueTextParts(departmentParts).join(", ")
  };
}

function normalizeJobFitDegree(value) {
  const koreanDegreeText = String(value || "").trim();

  if (/박사|ph\.?\s*d|doctor/i.test(koreanDegreeText)) return "박사";
  if (/석사|master|m\.?\s*s|m\.?\s*a|mba/i.test(koreanDegreeText)) return "석사";
  if (/학사|bachelor|b\.?\s*s|b\.?\s*a/i.test(koreanDegreeText)) return "학사";

  const text = String(value || "").trim();

  if (/박사|ph\.?d|doctor/i.test(text)) return "박사";
  if (/석사|master|m\.?s\.?|m\.?a\.?/i.test(text)) return "석사";
  if (/학사|bachelor|b\.?s\.?|b\.?a\.?/i.test(text)) return "학사";
  return text;
}

function normalizeJobFitEducationRecords(records = []) {
  return (Array.isArray(records) ? records : [])
    .map((item) => ({
      degree: normalizeJobFitDegree(item?.degree),
      school: cleanParsedValue(item?.school),
      major: cleanParsedValue(item?.major),
      start: normalizeParsedDate(item?.start),
      end: normalizeParsedDate(item?.end),
      affiliation: cleanParsedValue(item?.affiliation || item?.organization || item?.department || "")
    }))
    .filter(hasAnyRecordValue)
    .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)))
    .slice(0, 5);
}

function normalizeJobFitCareerRecords(records = []) {
  return (Array.isArray(records) ? records : [])
    .map((item) => {
      const rawRank = cleanParsedValue(item?.rank || item?.title || "");
      const rawPosition = cleanParsedValue(item?.position || item?.department || item?.organization || item?.team || item?.division || "");
      const roleFields = normalizeEnhancedCareerRoleFields(rawRank, rawPosition);

      return {
        country: cleanParsedValue(item?.country),
        company: cleanParsedValue(item?.company),
        rank: roleFields.rank,
        position: roleFields.position,
        start: normalizeParsedDate(item?.start),
        end: normalizeParsedDate(item?.end),
        achievements: normalizeResumeText(item?.achievements || "")
      };
    })
    .filter(hasAnyRecordValue)
    .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)))
    .slice(0, 8);
}

function extractJobFitProfileFromResume(text, fileName = "") {
  try {
    const parsed = normalizeParsedResumeForForm(parseResumeText(text, fileName));
    return {
      name: parsed.name,
      education: parsed.education || [],
      career: parsed.career || []
    };
  } catch (error) {
    console.warn("Job fit resume profile extraction failed.", error);
    return {
      name: inferCandidateNameFromResume(text, fileName),
      education: [],
      career: []
    };
  }
}

function normalizeJobFitReportItems(items, detailKey) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: item.trim(),
          [detailKey]: ""
        };
      }

      return {
        title: String(item?.title || item?.requirement || item?.name || "").trim(),
        [detailKey]: String(item?.[detailKey] || item?.basis || item?.note || item?.detail || "").trim()
      };
    })
    .filter((item) => item.title)
    .slice(0, 8);
}

function sanitizeJobFitComment(value) {
  const text = normalizeResumeText(value);

  if (!text) {
    return "";
  }

  const sentences = text
    .split(/(?<=[.!?。！？])\s+|(?<=다)\s+(?=[가-힣A-Z0-9])/g)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const filtered = sentences.filter((sentence) =>
    !/(합격|불합격|다음 단계|진행하|진행해야|면접|인터뷰|질문 구성|추가 자료|우선 검토|검토 대상|채용 액션)/.test(sentence)
  );

  if (filtered.length) {
    return filtered.join(" ").trim();
  }

  return text
    .replace(/[^.!?。！？]*(?:합격|불합격|다음 단계|진행하|진행해야|면접|인터뷰|질문 구성|추가 자료|우선 검토|검토 대상|채용 액션)[^.!?。！？]*(?:[.!?。！？]|$)/g, "")
    .trim();
}

function normalizeJobFitResult(result = {}) {
  const fulfilledDetails = normalizeJobFitReportItems(result.fulfilledDetails || result.fulfilled, "basis");
  const missingDetails = normalizeJobFitReportItems(result.missingDetails || result.missing, "note");
  const score = Math.max(0, Math.min(100, Number(result.score || 0)));
  const candidateName = getBestJobFitCandidateName(
    result.candidateName,
    result.name,
    extractLikelyPersonNameFromResumeText(result.comment || result.fitSummary || ""),
    result.fileName
  );

  return {
    resumeId: String(result.resumeId || "").trim(),
    candidateName,
    fileName: String(result.fileName || "").trim(),
    score,
    grade: gradeFromJobFitScore(score),
    fulfilled: fulfilledDetails.map((item) => item.title),
    missing: missingDetails.map((item) => item.title),
    fulfilledDetails,
    missingDetails,
    evidence: Array.isArray(result.evidence) ? result.evidence.filter(Boolean) : [],
    education: normalizeJobFitEducationRecords(result.education || []),
    career: normalizeJobFitCareerRecords(result.career || []),
    comment: sanitizeJobFitComment(result.comment || result.fitSummary || ""),
    recommendation: String(result.recommendation || "").trim()
  };
}

function normalizeJobFitState(value = {}) {
  const resumes = Array.isArray(value.resumes) ? value.resumes.map(normalizeJobFitResume).filter((resume) => resume.text) : [];
  const resumeMap = new Map(resumes.map((resume) => [resume.id, resume]));
  const results = Array.isArray(value.results)
    ? value.results.map((result) => {
      const resume = resumeMap.get(result.resumeId);

      return normalizeJobFitResult({
        ...result,
        candidateName: getBestJobFitCandidateName(result.candidateName, resume?.candidateName, result.fileName || resume?.fileName),
        education: result.education || resume?.education || [],
        career: result.career || resume?.career || []
      });
    })
    : [];

  return {
    jdText: normalizeResumeText(value.jdText || ""),
    jdFile: value.jdFile && typeof value.jdFile === "object"
      ? {
          name: String(value.jdFile.name || "").trim(),
          size: Number(value.jdFile.size || 0),
          type: String(value.jdFile.type || "").trim(),
          dataUrl: String(value.jdFile.dataUrl || value.jdFile.downloadUrl || "").trim(),
          uploadedAt: value.jdFile.uploadedAt || ""
        }
      : null,
    resumes,
    results,
    savedAnalyses: Array.isArray(value.savedAnalyses)
      ? value.savedAnalyses.map(normalizeSavedJobFitAnalysis).filter(Boolean).slice(0, 20)
      : [],
    jdLoading: Boolean(value.jdLoading),
    resumeLoading: Boolean(value.resumeLoading),
    analysisLoading: Boolean(value.analysisLoading || value.loading),
    jdProgress: Math.max(0, Math.min(100, Number(value.jdProgress) || 0)),
    resumeProgress: Math.max(0, Math.min(100, Number(value.resumeProgress) || 0)),
    analysisProgress: Math.max(0, Math.min(100, Number(value.analysisProgress) || 0)),
    jdStatus: String(value.jdStatus || "").trim(),
    resumeStatus: String(value.resumeStatus || "").trim(),
    analysisStatus: String(value.analysisStatus || value.status || "").trim(),
    hasAnalyzed: Boolean(value.hasAnalyzed || (Array.isArray(value.results) && value.results.length)),
    poolPickerOpen: Boolean(value.poolPickerOpen),
    poolPickerQuery: String(value.poolPickerQuery || "").trim(),
    poolPickerSelectedIds: Array.isArray(value.poolPickerSelectedIds)
      ? value.poolPickerSelectedIds.map((id) => String(id || "").trim()).filter(Boolean)
      : []
  };
}

function normalizeSavedJobFitAnalysis(analysis = {}) {
  if (!analysis || typeof analysis !== "object") {
    return null;
  }

  const resumes = Array.isArray(analysis.resumes) ? analysis.resumes.map(normalizeJobFitResume) : [];
  const resumeMap = new Map(resumes.map((resume) => [resume.id, resume]));
  const results = Array.isArray(analysis.results)
    ? analysis.results.map((result) => {
      const resume = resumeMap.get(result.resumeId);

      return normalizeJobFitResult({
        ...result,
        candidateName: getBestJobFitCandidateName(result.candidateName, resume?.candidateName, result.fileName || resume?.fileName),
        education: result.education || resume?.education || [],
        career: result.career || resume?.career || []
      });
    })
    : [];

  return {
    id: analysis.id || createId("job-fit-saved"),
    ownerId: String(analysis.ownerId || analysis.owner_id || "").trim(),
    ownerEmail: String(analysis.ownerEmail || analysis.owner_email || "").trim().toLowerCase(),
    title: String(analysis.title || "저장된 직무적합도 분석").trim(),
    createdAt: analysis.createdAt || getTimestampText(),
    createdBy: analysis.createdBy || getCurrentActorName(),
    jdText: normalizeResumeText(analysis.jdText || ""),
    jdFile: analysis.jdFile || null,
    resumes,
    results
  };
}

function getJobFitState() {
  const current = state.jobFitAnalysis && typeof state.jobFitAnalysis === "object"
    ? state.jobFitAnalysis
    : {};
  Object.assign(current, normalizeJobFitState(current));
  state.jobFitAnalysis = current;
  return state.jobFitAnalysis;
}

function normalizeJdReviewItem(item = {}, index = 0) {
  const status = ["pass", "needs_revision", "missing"].includes(item.status) ? item.status : "needs_revision";

  return {
    id: String(item.id || `jd-review-${index + 1}`).trim(),
    section: String(item.section || "공통").trim(),
    title: String(item.title || "검토 항목").trim(),
    status,
    issue: String(item.issue || "").trim(),
    originalText: normalizeResumeText(item.originalText || ""),
    suggestedText: normalizeResumeText(item.suggestedText || ""),
    rationale: String(item.rationale || "").trim()
  };
}

function inferJdDocumentTitle(finalText = "", sourceFileName = "") {
  const firstLine = normalizeResumeText(finalText)
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  const sourceTitle = String(sourceFileName || "").replace(/\.[^.]+$/, "").trim();
  const title = firstLine || sourceTitle || "채용공고 작성 결과";

  return `${title.slice(0, 48)}${title.length > 48 ? "..." : ""}`;
}

function normalizeSavedJdEnhancementDocument(value = {}, index = 0) {
  const finalText = normalizeResumeText(value.finalText || value.revisedDocument || "");
  const jdText = normalizeResumeText(value.jdText || "");
  const sourceFileName = String(value.sourceFileName || value.jdFile?.name || "").trim();

  if (!finalText && !jdText) {
    return null;
  }

  return {
    id: String(value.id || createId("jd-saved")).trim(),
    title: String(value.title || inferJdDocumentTitle(finalText || jdText, sourceFileName) || `채용공고 ${index + 1}`).trim(),
    sourceFileName,
    createdAt: String(value.createdAt || getTimestampText()).trim(),
    updatedAt: String(value.updatedAt || value.createdAt || getTimestampText()).trim(),
    createdBy: String(value.createdBy || getCurrentActorName()).trim(),
    guidelineText: normalizeResumeText(value.guidelineText || DEFAULT_JD_GUIDELINE),
    jdText,
    finalText,
    reviewItems: Array.isArray(value.reviewItems)
      ? value.reviewItems.map(normalizeJdReviewItem).filter((item) => item.title).slice(0, 20)
      : [],
    score: Math.max(0, Math.min(100, Math.round(Number(value.score || 0)))),
    summary: String(value.summary || "").trim()
  };
}

function mergeSavedJdDocuments(localItems = [], remoteItems = []) {
  return mergeByLatest(localItems, remoteItems, normalizeSavedJdEnhancementDocument)
    .sort((a, b) =>
      dateSortValue(b.updatedAt || b.createdAt) - dateSortValue(a.updatedAt || a.createdAt) ||
      String(b.id).localeCompare(String(a.id))
    )
    .slice(0, 30);
}

function normalizeJdEnhancementState(value = {}) {
  return {
    guidelineText: normalizeResumeText(value.guidelineText || DEFAULT_JD_GUIDELINE),
    jdText: normalizeResumeText(value.jdText || ""),
    jdFile: value.jdFile && typeof value.jdFile === "object"
      ? {
          name: String(value.jdFile.name || "").trim(),
          size: Number(value.jdFile.size || 0),
          type: String(value.jdFile.type || "").trim(),
          dataUrl: String(value.jdFile.dataUrl || "").trim(),
          uploadedAt: value.jdFile.uploadedAt || ""
        }
      : null,
    finalText: normalizeResumeText(value.finalText || value.revisedText || value.jdText || ""),
    reviewItems: Array.isArray(value.reviewItems)
      ? value.reviewItems.map(normalizeJdReviewItem).filter((item) => item.title).slice(0, 20)
      : [],
    score: Math.max(0, Math.min(100, Math.round(Number(value.score || 0)))),
    summary: String(value.summary || "").trim(),
    revisedDocument: normalizeResumeText(value.revisedDocument || ""),
    loading: Boolean(value.loading),
    fileLoading: Boolean(value.fileLoading),
    status: String(value.status || "").trim(),
    fileStatus: String(value.fileStatus || "").trim(),
    guidelineModalOpen: Boolean(value.guidelineModalOpen),
    guidelineDraft: String(value.guidelineDraft || value.guidelineText || DEFAULT_JD_GUIDELINE).replace(/\r\n?/g, "\n"),
    appliedSuggestionIds: Array.isArray(value.appliedSuggestionIds)
      ? value.appliedSuggestionIds.map((id) => String(id || "")).filter(Boolean)
      : [],
    savedDocuments: Array.isArray(value.savedDocuments)
      ? value.savedDocuments.map(normalizeSavedJdEnhancementDocument).filter(Boolean).sort((a, b) =>
          dateSortValue(b.updatedAt || b.createdAt) - dateSortValue(a.updatedAt || a.createdAt) ||
          String(b.id).localeCompare(String(a.id))
        ).slice(0, 30)
      : []
  };
}

function getJdEnhancementState() {
  const current = state.jdEnhancement && typeof state.jdEnhancement === "object"
    ? state.jdEnhancement
    : {};
  Object.assign(current, normalizeJdEnhancementState(current));
  state.jdEnhancement = current;
  return state.jdEnhancement;
}

function getCurrentUserSavedJobFitAnalyses() {
  return (getJobFitState().savedAnalyses || []).filter(belongsToCurrentAccount);
}

function inferCandidateNameFromResume(text, fileName = "") {
  const normalized = normalizeResumeText(text);
  const explicitName = normalizeInferredCandidateName(firstMatch(normalized, [
    /(?:이름|성명|Name)\s*[:：]\s*([^\n\r]{2,40})/i
  ]));

  if (explicitName) {
    return explicitName;
  }

  const textName = extractLikelyPersonNameFromResumeText(normalized);

  if (textName) {
    return textName;
  }

  const baseName = String(fileName || "")
    .replace(/\.[^.]+$/, "")
    .replace(/\b(?:resume|cv|curriculum|vitae)\b/gi, "")
    .replace(/(?:이력서|경력기술서|프로필|지원서)/g, "")
    .replace(/[()[\]{}_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalizeInferredCandidateName(baseName) || "이름 미확인";
}

function isGenericCandidateName(value) {
  const text = cleanParsedValue(value).replace(/\s+/g, "");

  if (!text) {
    return true;
  }

  return /^(프로필|이력서|지원서|경력기술서|자기소개서|소개서|resume|cv|profile|curriculumvitae|주소|연락처|이메일|휴대폰|전화번호|전화|국적|생년|생년월일|출생년도|미확인|이름미확인|역할|직무|직급|직책|부서|소속|학위|학교|전공)$/i.test(text) ||
    /(대학교|대학원|연구소|회사|팀|그룹|센터|부문|사업부|프로젝트|포트폴리오|경력|학력|요약|직무|기술|사항|첨부|파일|주소|연락처|이메일|휴대폰|전화|국적|생년|출생|역할|직급|직책|부서|소속|학위|학교|전공)/.test(text);
}

function normalizeInferredCandidateName(value) {
  const cleaned = cleanParsedValue(value)
    .split(/\s{2,}|[|,;:：/]/)[0]
    .replace(/(?:후보자?|님|씨|프로필|이력서|지원서|resume|cv|profile)$/gi, "")
    .trim();

  if (isGenericCandidateName(cleaned)) {
    return "";
  }

  if (/^[가-힣]{2,5}$/.test(cleaned) || /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/.test(cleaned)) {
    return cleaned;
  }

  const koreanName = cleaned.match(/\b([가-힣]{2,5})\b/)?.[1] || "";
  return koreanName && !isGenericCandidateName(koreanName) ? koreanName : "";
}

function extractLikelyPersonNameFromResumeText(text) {
  const lines = normalizeResumeText(text)
    .split("\n")
    .map((line) => cleanParsedValue(line))
    .filter(Boolean)
    .slice(0, 80);
  const labeledName = normalizeInferredCandidateName(findLabeledValue(lines, ["이름", "성명", "한글이름", "Name", "Full Name"]));

  if (labeledName) {
    return labeledName;
  }

  for (const pattern of [
    /([가-힣]{2,5})\s*(?:후보자?|지원자|님|씨)(?:는|은|가|이|의|\s|$)/,
    /(?:candidate|applicant|name)\s*[:：-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i
  ]) {
    const matched = normalizeInferredCandidateName(firstMatch(text, [pattern]));

    if (matched) {
      return matched;
    }
  }

  for (const line of lines) {
    const candidate = normalizeInferredCandidateName(line);

    if (candidate && line.length <= 28) {
      return candidate;
    }
  }

  return "";
}

function getBestJobFitCandidateName(...values) {
  for (const value of values) {
    const name = normalizeInferredCandidateName(value);

    if (name) {
      return name;
    }
  }

  return "이름 미확인";
}

function splitJobFitSentences(text) {
  return normalizeResumeText(text)
    .split(/\n+|(?<=[.!?。！？])\s+|[•·]\s*/g)
    .map((line) => line.replace(/^[-*ㆍ·•\d.()\s]+/, "").trim())
    .filter(Boolean);
}

function extractJobFitRequirements(jdText) {
  const lines = splitJobFitSentences(String(jdText || "").slice(0, JOB_FIT_MAX_JD_CHARS))
    .map((line) => line.replace(/^(?:자격요건|우대사항|담당업무|필수요건|주요업무|Requirements?|Preferred)\s*[:：-]?\s*/i, "").trim())
    .filter((line) => line.length >= 5 && line.length <= 180);
  const strongLines = lines.filter((line) =>
    /(경험|역량|기술|개발|기획|운영|분석|리딩|관리|설계|전공|학위|커뮤니케이션|영어|논문|프로젝트|필수|우대|가능|보유|이상|년)/i.test(line)
  );
  const requirements = (strongLines.length ? strongLines : lines)
    .filter((line, index, array) => array.findIndex((item) => normalizeSearchText(item) === normalizeSearchText(line)) === index)
    .slice(0, 12);

  if (requirements.length >= 3) {
    return requirements;
  }

  const keywords = tokenizeSearchText(jdText)
    .filter((token) => token.length >= 3 && !SEARCH_STOPWORDS.has(token))
    .slice(0, 10);

  return [...requirements, ...keywords.map((keyword) => `${keyword} 관련 경험 또는 역량`)]
    .filter((line, index, array) => array.indexOf(line) === index)
    .slice(0, 12);
}

function scoreRequirementAgainstResume(requirement, resumeText) {
  const requirementText = normalizeSearchText(requirement);
  const resumeSearchText = normalizeSearchText(String(resumeText || "").slice(0, JOB_FIT_MAX_RESUME_CHARS));
  const tokens = tokenizeSearchText(requirement)
    .filter((token) => token.length >= 2 && !SEARCH_STOPWORDS.has(token));
  const uniqueTokens = [...new Set(tokens)];
  const matchedTokens = uniqueTokens.filter((token) => resumeSearchText.includes(token));
  const directMatch = requirementText.length >= 6 && resumeSearchText.includes(requirementText);
  const ratio = uniqueTokens.length ? matchedTokens.length / uniqueTokens.length : 0;
  const fulfilled = directMatch || ratio >= 0.38 || (matchedTokens.length >= 2 && ratio >= 0.25);

  return {
    requirement,
    fulfilled,
    ratio,
    matchedTokens
  };
}

function findJobFitEvidenceSentence(requirement, resumeText, matchedTokens = []) {
  const requirementTokens = tokenizeSearchText(requirement)
    .filter((token) => token.length >= 2 && !SEARCH_STOPWORDS.has(token));
  const tokens = [...new Set([...requirementTokens, ...matchedTokens])];
  const sentences = splitJobFitSentences(resumeText)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 12 && sentence.length <= 260)
    .slice(0, 160);

  if (!sentences.length || !tokens.length) {
    return "";
  }

  const ranked = sentences
    .map((sentence, index) => {
      const searchText = normalizeSearchText(sentence);
      const tokenHits = tokens.filter((token) => searchText.includes(token));
      const score = tokenHits.reduce((sum, token) => sum + Math.min(5, token.length), 0) +
        (matchedTokens.some((token) => searchText.includes(token)) ? 8 : 0);

      return {
        sentence,
        index,
        score,
        tokenHits
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return ranked[0]?.sentence || "";
}

function summarizeJobFitRequirement(requirement) {
  return String(requirement || "")
    .replace(/\s+/g, " ")
    .replace(/[.。!?！？]+$/, "")
    .trim()
    .slice(0, 90);
}

function buildJobFitFulfilledDetail(check, resumeText) {
  const title = summarizeJobFitRequirement(check.requirement);
  const evidenceSentence = findJobFitEvidenceSentence(check.requirement, resumeText, check.matchedTokens);
  const keywordText = check.matchedTokens.slice(0, 5).join(", ");
  const basis = evidenceSentence
    ? `이력서의 "${evidenceSentence}" 내용을 근거로 해당 요구와 직접 연결되는 경험이 확인됩니다.`
    : keywordText
      ? `${keywordText} 관련 경험/역량 표현이 이력서에서 확인되어 충족 가능성이 있습니다.`
      : "이력서의 수행 경험과 JD 요구 맥락이 연결되어 충족 가능성이 있습니다.";

  return { title, basis };
}

function buildJobFitMissingDetail(check) {
  const title = summarizeJobFitRequirement(check.requirement);

  return {
    title,
    note: "이력서에서 해당 요구를 직접 입증할 수행 기간, 역할, 성과 근거가 명확히 확인되지 않습니다. 면접 또는 추가 자료로 확인 필요합니다."
  };
}

function gradeFromJobFitScore(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "E";
}

function buildJobFitComment(result, totalRequirements) {
  const fulfilledCount = result.fulfilledDetails?.length || result.fulfilled?.length || 0;
  const missingCount = result.missingDetails?.length || result.missing?.length || 0;
  const candidateName = normalizeInferredCandidateName(result.candidateName) || "해당 후보자";
  const matchedTitles = (result.fulfilledDetails || [])
    .map((item) => item.title)
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
  const missingTitles = (result.missingDetails || [])
    .map((item) => item.title)
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

  if (!totalRequirements) {
    return `${candidateName}의 이력서는 현재 입력된 직무기술서 기준을 충분히 구조화하기 어려운 상태에서 평가되었습니다. 이력서에 드러난 경력과 역량만으로는 포지션과의 직접 연결성을 안정적으로 판단하기 어렵고, 요구 역할과 수행 경험 사이의 대응 관계도 제한적으로 확인됩니다. 따라서 현재 결과는 참고용 적합도 해석으로 보아야 하며, 직무 요구가 더 명확해질수록 판단의 신뢰도가 높아질 수 있습니다.`;
  }

  if (result.grade === "A") {
    return `${candidateName}의 이력서는 직무기술서의 핵심 요구와 매우 높은 연관성을 보입니다. ${matchedTitles || "주요 수행 경험"}이 포지션에서 기대하는 역할과 직접 맞닿아 있고, 관련 기술과 경력의 지속성도 충분히 확인됩니다. 충족 항목 ${fulfilledCount}개가 이력서의 구체적인 경험으로 설명되는 반면, 추가 확인 필요 항목은 ${missingCount}개로 제한적입니다. 전반적으로 해당 인물은 포지션에서 요구하는 전문성과 수행 맥락에 잘 부합하는 것으로 판단됩니다.`;
  }

  if (result.grade === "B") {
    return `${candidateName}의 이력서는 직무기술서의 핵심 요구와 상당한 접점이 있습니다. ${matchedTitles || "주요 경력과 기술 역량"}이 포지션의 주요 업무와 연결되며, 직무 수행에 필요한 기반 역량도 비교적 명확하게 드러납니다. 다만 ${missingTitles || "일부 세부 요건"}은 이력서에서 직접적인 근거가 충분히 확인되지 않아 적합도 판단에 약간의 불확실성이 남습니다. 전체적으로는 포지션과의 실질적 관련성이 높은 후보로 해석됩니다.`;
  }

  if (result.grade === "C") {
    return `${candidateName}의 이력서는 직무기술서의 일부 요구와 연결되지만, 핵심 역할 전체를 충분히 뒷받침한다고 보기는 어렵습니다. ${matchedTitles || "일부 경험"}은 포지션과 관련성이 있으나, ${missingTitles || "핵심 세부 요건"}에 대해서는 이력서 내 직접 근거가 제한적입니다. 충족 항목과 추가 확인 필요 항목이 함께 나타나므로, 적합도는 중간 수준으로 해석됩니다. 직무 전환 가능성은 있으나 현재 이력서만으로는 강한 적합성을 단정하기 어렵습니다.`;
  }

  if (result.grade === "D") {
    return `${candidateName}의 이력서는 직무기술서와 연결되는 경험이 일부 확인되지만, 포지션 핵심 요구와의 직접성은 낮은 편입니다. ${matchedTitles || "일부 기술 또는 경력"}은 참고할 수 있으나, ${missingTitles || "주요 요구 요건"}에 대한 근거가 부족해 직무 적합성을 높게 보기 어렵습니다. 요구 직무의 핵심 수행 범위와 이력서상 경험 사이에 간극이 있어, 현재 정보 기준으로는 제한적 적합도로 해석됩니다.`;
  }

  return `${candidateName}의 이력서는 현재 직무기술서의 핵심 요구와 직접적으로 맞닿는 근거가 매우 제한적입니다. 이력서에 나타난 경력과 기술은 일부 참고 가능하지만, 포지션에서 요구하는 주요 역할과 성과 맥락을 충분히 설명하지 못합니다. 충족 항목보다 추가 확인 필요 항목의 비중이 높아, 현재 이력서만으로는 해당 포지션과의 적합성을 낮게 해석하는 것이 자연스럽습니다.`;
}

function evaluateJobFitResume(jdText, resume) {
  const normalizedJdText = normalizeResumeText(jdText).slice(0, JOB_FIT_MAX_JD_CHARS);
  const normalizedResumeText = normalizeResumeText(resume.text).slice(0, JOB_FIT_MAX_RESUME_CHARS);
  const requirements = extractJobFitRequirements(normalizedJdText);
  const checks = requirements.map((requirement) => scoreRequirementAgainstResume(requirement, normalizedResumeText));
  const fulfilledDetails = checks.filter((item) => item.fulfilled).map((item) => buildJobFitFulfilledDetail(item, normalizedResumeText));
  const missingDetails = checks.filter((item) => !item.fulfilled).map(buildJobFitMissingDetail);
  const fulfilled = fulfilledDetails.map((item) => item.title);
  const missing = missingDetails.map((item) => item.title);
  const evidence = fulfilledDetails.map((item) => item.basis).filter(Boolean).slice(0, 5);
  const requirementScore = requirements.length ? (fulfilled.length / requirements.length) * 74 : 0;
  const jdTokens = tokenizeSearchText(normalizedJdText)
    .filter((token) => token.length >= 3 && !SEARCH_STOPWORDS.has(token))
    .slice(0, JOB_FIT_MAX_KEYWORD_TOKENS);
  const resumeSearchText = normalizeSearchText(normalizedResumeText);
  const keywordHits = [...new Set(jdTokens)].filter((token) => resumeSearchText.includes(token));
  const keywordScore = Math.min(22, keywordHits.length * 2);
  const textVolumeScore = normalizedResumeText.length >= 400 ? 4 : normalizedResumeText.length >= 120 ? 2 : 0;
  const score = Math.round(Math.max(0, Math.min(100, requirementScore + keywordScore + textVolumeScore)));
  const grade = gradeFromJobFitScore(score);
  const result = {
    resumeId: resume.id,
    candidateName: resume.candidateName,
    fileName: resume.fileName,
    score,
    grade,
    fulfilled,
    missing,
    fulfilledDetails,
    missingDetails,
    evidence,
    education: resume.education || [],
    career: resume.career || [],
    comment: ""
  };

  result.comment = buildJobFitComment(result, requirements.length);
  result.recommendation = "";
  return result;
}

async function analyzeJobFitWithServer(jdText, resumes) {
  const response = await fetch("/api/job-fit-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jdText,
      resumes: resumes.map((resume) => ({
        id: resume.id,
        candidateName: resume.candidateName,
        source: resume.source,
        candidateId: resume.candidateId,
        fileName: resume.fileName,
        text: resume.text,
        education: resume.education,
        career: resume.career
      }))
    })
  });

  if (!response.ok) {
    throw new Error(`Job fit API failed: ${response.status}`);
  }

  const payload = await response.json();

  if (!payload.ok || !Array.isArray(payload.results)) {
    throw new Error(payload.error || "Job fit API did not return results.");
  }

  const resumeMap = new Map(resumes.map((resume) => [resume.id, resume]));
  return payload.results
    .map((result) => {
      const resume = resumeMap.get(result.resumeId);

      if (!resume) {
        return null;
      }

      return normalizeJobFitResult({
        ...result,
        candidateName: getBestJobFitCandidateName(result.candidateName, resume.candidateName, result.comment, resume.fileName),
        fileName: resume.fileName,
        education: resume.education,
        career: resume.career
      });
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || FIT_GRADE_ORDER.indexOf(a.grade) - FIT_GRADE_ORDER.indexOf(b.grade));
}

function refreshJobFitResults() {
  const jobFit = getJobFitState();
  const jdText = normalizeResumeText(jobFit.jdText);

  if (!jdText || !jobFit.resumes.length) {
    jobFit.results = [];
    return jobFit.results;
  }

  jobFit.results = jobFit.resumes
    .map((resume) => evaluateJobFitResume(jdText, resume))
    .sort((a, b) => b.score - a.score || FIT_GRADE_ORDER.indexOf(a.grade) - FIT_GRADE_ORDER.indexOf(b.grade));

  return jobFit.results;
}

function jobFitGradeChip(grade) {
  const chipClass = {
    A: "chip-green",
    B: "chip-blue",
    C: "chip-violet",
    D: "chip-amber",
    E: "chip-red"
  }[grade] || "chip-blue";

  return `<span class="status-chip ${chipClass}">적합도 ${escapeHtml(grade)}</span>`;
}

function formatJobFitEducationSummaryLine(item = {}) {
  const degree = formatEducationDegreeShort(item.degree);
  const school = cleanParsedValue(item.school);
  const major = cleanParsedValue(item.major);
  const affiliation = cleanParsedValue(item.affiliation || item.organization || item.department || "");
  const title = [
    degree ? `${degree}) ${school}`.trim() : school,
    major,
    affiliation
  ].filter(Boolean).join(", ");
  const period = formatDisplayPeriod(item.start, item.end);

  return [title, period].filter(Boolean).join(" ");
}

function formatJobFitCareerSummaryLine(item = {}) {
  const company = cleanParsedValue(item.company);
  const rank = cleanParsedValue(item.rank);
  const position = cleanParsedValue(item.position || item.department);
  const title = uniqueTextParts([company, rank, position]).join(", ");
  const period = formatDisplayPeriod(item.start, item.end);

  return [title, period].filter(Boolean).join(" ");
}

function formatPoolProfileEducationForJobFit(item = {}) {
  const degree = formatEducationDegreeShort(item.degree);
  const school = cleanParsedValue(item.school);
  const major = cleanParsedValue(item.major);
  const affiliation = cleanParsedValue(item.affiliation || item.organization || item.department || item.majorDepartment || "");
  const title = [
    degree ? `${degree}) ${school}`.trim() : school,
    major,
    affiliation
  ].filter(Boolean).join(", ");
  const period = formatDisplayPeriod(item.start, item.end);

  return [title, period].filter(Boolean).join(" ");
}

function formatPoolProfileCareerForJobFit(item = {}) {
  const company = cleanParsedValue(item.company);
  const rank = cleanParsedValue(item.rank);
  const position = cleanParsedValue(item.position || item.department || item.organization || item.team || item.division || "");
  const title = uniqueTextParts([company, rank, position]).join(", ");
  const period = formatDisplayPeriod(item.start, item.end);

  return [title, period].filter(Boolean).join(" ");
}

function buildPoolProfileJobFitText(candidate = {}) {
  const educationLines = (candidate.education || [])
    .filter(hasAnyRecordValue)
    .map(formatPoolProfileEducationForJobFit)
    .filter(Boolean);
  const careerLines = (candidate.career || [])
    .filter(hasAnyRecordValue)
    .map((item) => {
      const base = formatPoolProfileCareerForJobFit(item);
      const achievements = normalizeResumeText(item.achievements || "");

      return [base, achievements ? `주요성과/실적: ${achievements}` : ""].filter(Boolean).join("\n");
    })
    .filter(Boolean);
  const skillText = Array.isArray(candidate.skills) ? candidate.skills.filter(Boolean).join(", ") : String(candidate.skills || "");
  const tagText = Array.isArray(candidate.tags) ? candidate.tags.filter(Boolean).join(", ") : String(candidate.tags || "");
  const summary = normalizeResumeText(candidate.summary || candidate.achievements || "");

  return normalizeResumeText([
    `이름: ${candidate.name || ""}`,
    candidate.englishName ? `이름(영문): ${candidate.englishName}` : "",
    candidate.birthYear ? `출생년도: ${candidate.birthYear}` : "",
    candidate.role ? `핵심역량: ${candidate.role}` : "",
    candidate.company ? `현재/최근회사: ${candidate.company}` : "",
    candidate.jobFamily ? `직무분야: ${candidate.jobFamily}` : "",
    candidate.organization ? `사업부: ${candidate.organization}` : "",
    skillText ? `키워드: ${skillText}` : "",
    tagText ? `태그: ${tagText}` : "",
    summary ? `주요성과/실적:\n${summary}` : "",
    educationLines.length ? `학력:\n${educationLines.join("\n")}` : "",
    careerLines.length ? `경력:\n${careerLines.join("\n\n")}` : ""
  ].filter(Boolean).join("\n\n"));
}

function candidateToJobFitResume(candidate) {
  const normalizedCandidate = normalizeCandidate(candidate);
  const text = buildPoolProfileJobFitText(normalizedCandidate);

  return normalizeJobFitResume({
    id: `job-fit-pool-${normalizedCandidate.id}`,
    source: "pool",
    candidateId: normalizedCandidate.id,
    fileName: `${normalizedCandidate.name || "Talent Pool 프로필"} · Talent Pool`,
    candidateName: normalizedCandidate.name,
    text,
    education: normalizedCandidate.education || [],
    career: normalizedCandidate.career || [],
    uploadedAt: getTimestampText()
  });
}

function renderJobFitProfileSummary(result) {
  const educationLines = (result.education || [])
    .map(formatJobFitEducationSummaryLine)
    .filter(Boolean)
    .slice(0, 3);
  const careerLines = (result.career || [])
    .map(formatJobFitCareerSummaryLine)
    .filter(Boolean)
    .slice(0, 3);

  if (!educationLines.length && !careerLines.length) {
    return "";
  }

  return `
    <div class="job-fit-profile-summary">
      ${educationLines.length ? `
        <section>
          <strong>학력</strong>
          ${educationLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}
        </section>
      ` : ""}
      ${careerLines.length ? `
        <section>
          <strong>경력</strong>
          ${careerLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}
        </section>
      ` : ""}
    </div>
  `;
}

function renderJobFitRequirementList(items, emptyText) {
  if (!items.length) {
    return `<span class="muted-text">${escapeHtml(emptyText)}</span>`;
  }

  return `<ul class="job-fit-requirement-list">${items.slice(0, 8).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderJobFitReportItems(items, detailKey, emptyText) {
  if (!items.length) {
    return `<span class="muted-text">${escapeHtml(emptyText)}</span>`;
  }

  return `
    <ul class="job-fit-report-list">
      ${items.slice(0, 8).map((item) => `
        <li>
          <strong>${escapeHtml(item.title)}</strong>
          ${item[detailKey] ? `<span>${escapeHtml(item[detailKey])}</span>` : ""}
        </li>
      `).join("")}
    </ul>
  `;
}

function renderJobFitFileLink(file) {
  const fileName = String(file?.fileName || file?.name || "").trim() || "업로드 파일";
  const dataUrl = String(file?.dataUrl || "").trim();

  if (!dataUrl) {
    return `<strong>${escapeHtml(fileName)}</strong>`;
  }

  return `<a class="job-fit-file-link" href="${escapeHtml(dataUrl)}" download="${escapeHtml(fileName)}">${escapeHtml(fileName)}</a>`;
}

function renderJobFitJdFileList() {
  const jdFile = getJobFitState().jdFile;

  if (!jdFile) {
    return "";
  }

  return `
    <div class="job-fit-file-list">
      <div class="job-fit-file-row is-single">
        <span>${renderJobFitFileLink(jdFile)}</span>
      </div>
    </div>
  `;
}

function renderJobFitResultCard(result, index) {
  return `
    <article class="job-fit-result-card">
      <div class="job-fit-result-rank">${index + 1}</div>
      <div class="job-fit-result-main">
        <div class="job-fit-result-header">
          <div>
            <strong>${escapeHtml(result.candidateName || "이름 미확인")}</strong>
          </div>
          <div class="job-fit-score-box">
            ${jobFitGradeChip(result.grade)}
            <strong>${escapeHtml(String(result.score))}%</strong>
          </div>
        </div>
        ${renderJobFitProfileSummary(result)}
        ${result.comment ? `<p class="job-fit-comment">${escapeHtml(result.comment)}</p>` : ""}
        <div class="job-fit-match-grid">
          <section class="job-fit-report-section is-fulfilled">
            <strong>충족된 직무 요건</strong>
            ${renderJobFitReportItems(result.fulfilledDetails || [], "basis", "충족으로 판단된 항목이 없습니다.")}
          </section>
          <section class="job-fit-report-section is-missing">
            <strong>추가 확인이 필요한 요건</strong>
            ${renderJobFitReportItems(result.missingDetails || [], "note", "추가 확인이 필요한 항목이 없습니다.")}
          </section>
        </div>
      </div>
    </article>
  `;
}

function renderJobFitResultsPanel() {
  const jobFit = getJobFitState();
  const hasJd = Boolean(normalizeResumeText(jobFit.jdText));
  const hasResumes = jobFit.resumes.length > 0;
  const canAnalyze = hasJd && hasResumes && !jobFit.jdLoading && !jobFit.resumeLoading && !jobFit.analysisLoading;
  const hasResults = Boolean(jobFit.results.length || jobFit.hasAnalyzed || jobFit.analysisStatus);
  const resultBody = jobFit.analysisLoading
    ? `<div class="empty-state">직무기술서와 분석 대상 풀을 기준으로 적합도를 분석하는 중입니다.</div>`
    : jobFit.hasAnalyzed
      ? jobFit.results.length
        ? jobFit.results.map(renderJobFitResultCard).join("")
        : `<div class="empty-state">분석 가능한 결과가 없습니다. JD와 이력서 텍스트를 확인한 뒤 다시 분석해 주세요.</div>`
      : hasJd && hasResumes
        ? `<div class="empty-state">업로드된 JD와 분석 대상이 준비되었습니다. 평가 분석 시작 버튼을 눌러 결과를 생성해 주세요.</div>`
        : `<div class="empty-state">왼쪽에 직무기술서를 입력하고 오른쪽에 이력서를 업로드하거나 Talent Pool 프로필을 추가한 뒤 평가 분석을 시작해 주세요.</div>`;

  return `
    <section class="form-panel job-fit-results-panel" id="job-fit-results-section">
      <div class="job-fit-panel-header">
        <div>
          <strong>직무적합도 분석 결과</strong>
          <span>${hasJd ? "JD 입력 완료" : "JD 미입력"} · 분석 대상 ${jobFit.resumes.length}개 · 결과 ${jobFit.results.length}개</span>
        </div>
        <div class="job-fit-result-actions">
          <button class="primary-button compact-button" type="button" data-run-job-fit-analysis ${canAnalyze ? "" : "disabled"}>${jobFit.analysisLoading ? "분석 중" : "평가 분석 시작"}</button>
          <button class="ghost-button compact-button" type="button" data-save-job-fit-analysis ${jobFit.results.length && !jobFit.analysisLoading ? "" : "disabled"}>분석 결과 저장</button>
          <button class="ghost-button compact-button" type="button" data-clear-job-fit-results ${hasResults && !jobFit.analysisLoading ? "" : "disabled"}>초기화</button>
        </div>
      </div>
      ${jobFit.analysisStatus ? `<div class="job-fit-inline-status">${renderMaybeProgressStatus(jobFit.analysisStatus, jobFit.analysisLoading, jobFit.analysisProgress)}</div>` : ""}
      <div class="job-fit-result-list">
        ${resultBody}
      </div>
    </section>
  `;
}

function renderJobFitResumeList() {
  const resumes = getJobFitState().resumes;

  if (!resumes.length) {
    return `<div class="empty-state compact-empty">업로드 이력서 또는 Talent Pool에서 추가한 프로필이 없습니다.</div>`;
  }

  return `
    <div class="job-fit-file-list">
      ${resumes.map((resume) => `
        <div class="job-fit-file-row">
          <span>
            ${renderJobFitFileLink(resume)}
            ${resume.source === "pool" ? `<small>Talent Pool 프로필 · ${escapeHtml(resume.candidateName || "")}</small>` : `<small>업로드 이력서</small>`}
          </span>
          <button class="ghost-button danger-button compact-button" type="button" data-remove-job-fit-resume="${escapeHtml(resume.id)}">삭제</button>
        </div>
      `).join("")}
    </div>
  `;
}

function getJobFitPoolPickerCandidates() {
  const jobFit = getJobFitState();
  const query = normalizeSearchText(jobFit.poolPickerQuery);
  const addedIds = new Set(jobFit.resumes.map((resume) => resume.candidateId).filter(Boolean));

  return sortPoolCandidates(getVisibleCandidates())
    .filter((candidate) => {
      if (!query) {
        return true;
      }

      const searchText = normalizeSearchText([
        candidate.name,
        candidate.englishName,
        candidate.company,
        candidate.role,
        candidate.jobFamily,
        candidate.organization,
        candidate.owner,
        ...(candidate.skills || []),
        ...(candidate.tags || []),
        ...(candidate.education || []).flatMap((item) => [item.degree, item.school, item.major, item.affiliation]),
        ...(candidate.career || []).flatMap((item) => [item.company, item.rank, item.position, item.achievements])
      ].filter(Boolean).join(" "));

      return searchText.includes(query);
    })
    .map((candidate) => ({
      ...candidate,
      isAddedToJobFit: addedIds.has(candidate.id)
    }));
}

function renderJobFitPoolPickerModal() {
  const jobFit = getJobFitState();

  if (!jobFit.poolPickerOpen) {
    return "";
  }

  const candidates = getJobFitPoolPickerCandidates();
  const selectedIds = new Set(jobFit.poolPickerSelectedIds || []);

  return `
    <div class="trending-modal-backdrop" data-job-fit-pool-picker-backdrop>
      <section class="trending-modal job-fit-pool-picker-modal" role="dialog" aria-modal="true" aria-labelledby="job-fit-pool-picker-title">
        <div class="trending-modal-header">
          <div>
            <strong id="job-fit-pool-picker-title">Talent Pool 프로필 추가</strong>
            <span>저장된 프로필의 학력, 경력, 키워드, 주요성과를 이용해 직무적합도를 분석합니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-job-fit-pool-picker>닫기</button>
        </div>
        <div class="trending-modal-body job-fit-pool-picker-body">
          <input class="control-input" id="job-fit-pool-picker-query" value="${inputValue(jobFit.poolPickerQuery)}" placeholder="이름, 회사, 기술, 사업부 검색" />
          <div class="job-fit-pool-picker-list">
            ${candidates.length ? candidates.map((candidate) => {
              const educationLines = (candidate.education || []).map(formatPoolProfileEducationForJobFit).filter(Boolean).slice(0, 2);
              const careerLines = (candidate.career || []).map(formatPoolProfileCareerForJobFit).filter(Boolean).slice(0, 2);
              const disabled = candidate.isAddedToJobFit;
              const checked = selectedIds.has(candidate.id);

              return `
                <label class="job-fit-pool-candidate ${disabled ? "is-disabled" : ""}">
                  <input type="checkbox" data-job-fit-pool-candidate="${escapeHtml(candidate.id)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
                  <span class="job-fit-pool-candidate-main">
                    <strong>${escapeHtml(candidate.name || "이름 미입력")}</strong>
                    <small>${escapeHtml([candidate.organization, candidate.role].filter(Boolean).join(" · ") || "프로필 정보")}</small>
                    ${educationLines.length ? `<em>학력: ${escapeHtml(educationLines.join(" / "))}</em>` : ""}
                    ${careerLines.length ? `<em>경력: ${escapeHtml(careerLines.join(" / "))}</em>` : ""}
                  </span>
                  ${disabled ? `<span class="status-chip chip-gray">추가됨</span>` : ""}
                </label>
              `;
            }).join("") : `<div class="empty-state compact-empty">검색 결과가 없습니다.</div>`}
          </div>
          <div class="form-actions">
            <button class="ghost-button" type="button" data-close-job-fit-pool-picker>취소</button>
            <button class="primary-button" type="button" data-add-job-fit-pool-profiles ${selectedIds.size ? "" : "disabled"}>선택 프로필 추가</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderSavedJobFitAnalyses() {
  const savedAnalyses = getCurrentUserSavedJobFitAnalyses();

  if (!savedAnalyses.length) {
    return `<div class="empty-state compact-empty">저장된 분석 결과가 없습니다.</div>`;
  }

  return `
    <div class="job-fit-saved-list">
      ${savedAnalyses.map((analysis) => `
        <article class="job-fit-saved-card">
          <div>
            <strong>${escapeHtml(analysis.title)}</strong>
            <span>${escapeHtml(analysis.createdAt)} · ${escapeHtml(analysis.createdBy)} · 결과 ${analysis.results.length}개</span>
          </div>
          <div class="member-actions">
            <button class="ghost-button compact-button" type="button" data-load-job-fit-analysis="${escapeHtml(analysis.id)}">불러오기</button>
            <button class="ghost-button danger-button compact-button" type="button" data-delete-job-fit-analysis="${escapeHtml(analysis.id)}">삭제</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderJobFitAnalysis() {
  const container = $("#job-fit-content");

  if (!container) {
    return;
  }

  const jobFit = getJobFitState();

  container.innerHTML = `
    <div class="job-fit-workspace">
      <div class="job-fit-top-actions">
        <button class="ghost-button compact-button" type="button" data-clear-job-fit-all ${jobFit.jdText || jobFit.jdFile || jobFit.resumes.length || jobFit.results.length || jobFit.hasAnalyzed ? "" : "disabled"}>전체 초기화</button>
      </div>
      <div class="job-fit-upload-grid">
        <section class="form-panel job-fit-upload-card">
          <div class="job-fit-panel-header">
            <div>
              <strong>직무기술서</strong>
              <span>직접 입력하거나 JD 파일을 업로드하세요.</span>
            </div>
            <button class="ghost-button compact-button" type="button" data-clear-job-fit-jd ${jobFit.jdText || jobFit.jdFile ? "" : "disabled"}>초기화</button>
          </div>
          <div class="dropzone compact-upload">
            <input id="job-fit-jd-file" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
            <span class="form-help">JD 파일을 선택하거나 끌어놓으세요. 파일을 읽으면 아래 입력란에 자동 반영됩니다.</span>
            ${jobFit.jdStatus ? `<strong class="job-fit-upload-status ${jobFit.jdLoading ? "is-loading" : ""}">${renderMaybeProgressStatus(jobFit.jdStatus, jobFit.jdLoading, jobFit.jdProgress)}</strong>` : ""}
          </div>
          ${renderJobFitJdFileList()}
          <textarea class="control-textarea" id="job-fit-jd-text" rows="10" placeholder="직무의 역할, 필수 경험, 우대 요건, 수행 업무를 입력하세요.">${escapeHtml(jobFit.jdText)}</textarea>
        </section>

        <section class="form-panel job-fit-upload-card">
          <div class="job-fit-panel-header">
            <div>
              <div class="job-fit-title-line">
                <strong>분석 대상 풀</strong>
                <span class="status-chip chip-blue">${jobFit.resumes.length}개</span>
              </div>
              <span>이력서 파일을 업로드하거나 Talent Pool 프로필을 추가할 수 있습니다.</span>
            </div>
            <div class="job-fit-header-actions">
              <button class="ghost-button compact-button" type="button" data-open-job-fit-pool-picker>Pool 프로필 추가</button>
              <button class="ghost-button compact-button" type="button" data-clear-job-fit-resumes ${jobFit.resumes.length ? "" : "disabled"}>초기화</button>
            </div>
          </div>
          <div class="dropzone job-fit-resume-dropzone">
            <input id="job-fit-resume-files" type="file" multiple accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
            <span class="form-help">이력서 또는 Pool 프로필을 추가한 뒤 평가 분석 시작 버튼을 눌러 결과를 생성합니다.</span>
            ${jobFit.resumeStatus ? `<strong class="job-fit-upload-status ${jobFit.resumeLoading ? "is-loading" : ""}">${renderMaybeProgressStatus(jobFit.resumeStatus, jobFit.resumeLoading, jobFit.resumeProgress)}</strong>` : ""}
          </div>
          <div id="job-fit-resume-list">
            ${renderJobFitResumeList()}
          </div>
        </section>
      </div>

      ${renderJobFitResultsPanel()}

      <section class="form-panel job-fit-saved-panel" id="job-fit-saved-section">
        <div class="job-fit-panel-header">
          <div>
            <strong>저장된 분석 결과</strong>
            <span>저장한 결과는 나중에 다시 불러와 검토할 수 있습니다.</span>
          </div>
        </div>
        ${renderSavedJobFitAnalyses()}
      </section>
    </div>
    ${renderJobFitPoolPickerModal()}
  `;
}

function jdReviewStatusLabel(status) {
  return {
    pass: "양호",
    needs_revision: "수정 필요",
    missing: "누락"
  }[status] || "수정 필요";
}

function jdReviewStatusClass(status) {
  return {
    pass: "chip-green",
    needs_revision: "chip-amber",
    missing: "chip-red"
  }[status] || "chip-amber";
}

function renderJdEnhanceFileLink(file) {
  const fileName = String(file?.name || "").trim() || "업로드 파일";

  if (!file?.dataUrl) {
    return `<strong>${escapeHtml(fileName)}</strong>`;
  }

  return `<a class="job-fit-file-link" href="${escapeHtml(file.dataUrl)}" download="${escapeHtml(fileName)}">${escapeHtml(fileName)}</a>`;
}

function renderJdReviewItems() {
  const jd = getJdEnhancementState();

  if (jd.loading) {
    return `<div class="empty-state">최신 JD 작성 가이드라인 기준으로 문서 품질을 점검하는 중입니다.</div>`;
  }

  if (!jd.reviewItems.length) {
    return `<div class="empty-state">JD 파일 또는 본문을 입력한 뒤 JD 점검 시작 버튼을 눌러 주세요.</div>`;
  }

  return `
    <div class="jd-review-list">
      ${jd.reviewItems.map((item) => {
        const applied = jd.appliedSuggestionIds.includes(item.id);
        const canApply = item.suggestedText && item.status !== "pass";

        return `
          <article class="jd-review-card ${item.status === "pass" ? "is-pass" : ""}">
            <div class="jd-review-card-header">
              <div>
                <span class="status-chip ${jdReviewStatusClass(item.status)}">${escapeHtml(jdReviewStatusLabel(item.status))}</span>
                <strong>${escapeHtml(item.title)}</strong>
                <small>${escapeHtml(item.section)}</small>
              </div>
              <button class="ghost-button compact-button" type="button" data-apply-jd-suggestion="${escapeHtml(item.id)}" ${canApply && !applied ? "" : "disabled"}>${applied ? "반영됨" : "제안 적용"}</button>
            </div>
            ${item.issue ? `<p class="jd-review-issue">${escapeHtml(item.issue)}</p>` : ""}
            ${item.originalText ? `
              <section class="jd-review-snippet">
                <strong>기존 문구</strong>
                <p>${escapeHtml(item.originalText)}</p>
              </section>
            ` : ""}
            ${item.suggestedText ? `
              <section class="jd-review-suggestion">
                <strong>추천 수정문구</strong>
                <p>${escapeHtml(item.suggestedText)}</p>
              </section>
            ` : ""}
            ${item.rationale ? `<small class="jd-review-rationale">${escapeHtml(item.rationale)}</small>` : ""}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderSavedJdDocuments() {
  const savedDocuments = getJdEnhancementState().savedDocuments || [];

  if (!savedDocuments.length) {
    return `<div class="empty-state compact-empty">저장된 채용공고 작성 결과물이 없습니다.</div>`;
  }

  return `
    <div class="job-fit-saved-list">
      ${savedDocuments.map((document) => `
        <article class="job-fit-saved-card">
          <div>
            <strong>${escapeHtml(document.title)}</strong>
            <span>${escapeHtml(document.createdAt || document.updatedAt || "")} · ${escapeHtml(document.createdBy || "작성자 미기재")}${document.score ? ` · 품질점수 ${document.score}점` : ""}</span>
            ${document.sourceFileName ? `<span>원본 파일: ${escapeHtml(document.sourceFileName)}</span>` : ""}
          </div>
          <div class="job-fit-result-actions">
            <button class="ghost-button compact-button" type="button" data-load-jd-document="${escapeHtml(document.id)}">불러오기</button>
            <button class="danger-button compact-button" type="button" data-delete-jd-document="${escapeHtml(document.id)}">삭제</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderJdEnhancement() {
  const container = $("#jd-enhance-content");

  if (!container) {
    return;
  }

  const jd = getJdEnhancementState();
  const canRun = Boolean(jd.guidelineText.trim() && jd.jdText.trim() && !jd.loading && !jd.fileLoading);
  const canDownload = Boolean(jd.finalText.trim());
  const canSave = Boolean((jd.finalText || jd.jdText || "").trim() && !jd.loading && !jd.fileLoading);
  const hasSuggestions = jd.reviewItems.some((item) => item.suggestedText && item.status !== "pass");

  container.innerHTML = `
    <div class="jd-enhance-workspace">
      <div class="jd-enhance-grid">
        <section class="form-panel job-fit-upload-card">
          <div class="job-fit-panel-header">
            <div>
              <strong>현업 작성 JD</strong>
              <span>Word/PDF 파일을 업로드하거나 본문을 직접 입력한 뒤 가이드라인 기준으로 점검합니다.</span>
            </div>
            <div class="job-fit-result-actions jd-enhance-source-actions">
              <button class="ghost-button compact-button" type="button" data-open-jd-guideline-modal>JD 작성 가이드라인</button>
              <button class="ghost-button compact-button" type="button" data-clear-jd-enhance-input ${jd.jdText || jd.jdFile ? "" : "disabled"}>초기화</button>
              <button class="primary-button compact-button" type="button" data-run-jd-enhance ${canRun ? "" : "disabled"}>${jd.loading ? "점검 중" : "JD 점검 시작"}</button>
            </div>
          </div>
          <div class="dropzone compact-upload">
            <input id="jd-enhance-file" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
            <span class="form-help">JD 파일을 선택하거나 끌어놓으세요. DOCX 또는 텍스트 PDF를 권장합니다.</span>
            ${jd.fileStatus ? `<strong class="job-fit-upload-status ${jd.fileLoading ? "is-loading" : ""}">${escapeHtml(jd.fileStatus)}</strong>` : ""}
          </div>
          ${jd.jdFile ? `
            <div class="job-fit-file-list">
              <div class="job-fit-file-row is-single">
                <span>${renderJdEnhanceFileLink(jd.jdFile)}</span>
              </div>
            </div>
          ` : ""}
          <textarea class="control-textarea" id="jd-enhance-jd-text" rows="13" placeholder="현업에서 작성한 JD 원문을 입력하세요.">${escapeHtml(jd.jdText)}</textarea>
        </section>

        <section class="form-panel job-fit-upload-card">
          <div class="job-fit-panel-header">
            <div>
              <strong>최종 완성본</strong>
              <span>추천 문구를 적용하면 이 영역에 반영됩니다.</span>
            </div>
            <div class="job-fit-result-actions">
              <button class="ghost-button compact-button" type="button" data-save-jd-document ${canSave ? "" : "disabled"}>결과 저장</button>
              <button class="ghost-button compact-button" type="button" data-download-jd-final ${canDownload ? "" : "disabled"}>Word 다운로드</button>
            </div>
          </div>
          <textarea class="control-textarea" id="jd-enhance-final-text" rows="18" placeholder="JD 점검 시작 버튼을 누르면 원문이 먼저 표시되고, 제안 적용 후 최종본으로 정리됩니다.">${escapeHtml(jd.finalText)}</textarea>
        </section>
      </div>

      <section class="form-panel jd-review-panel">
        <div class="job-fit-panel-header">
          <div>
            <strong>가이드라인 점검 결과</strong>
            <span>${jd.reviewItems.length ? `점검 항목 ${jd.reviewItems.length}개 · 품질점수 ${jd.score || 0}점` : "JD 작성 품질과 수정 제안을 확인합니다."}</span>
          </div>
          <div class="job-fit-result-actions">
            <button class="ghost-button compact-button" type="button" data-apply-all-jd-suggestions ${hasSuggestions ? "" : "disabled"}>제안 전체 적용</button>
          </div>
        </div>
        ${jd.status ? `<div class="job-fit-inline-status">${escapeHtml(jd.status)}</div>` : ""}
        ${jd.summary ? `<p class="jd-review-summary">${escapeHtml(jd.summary)}</p>` : ""}
        ${renderJdReviewItems()}
      </section>

      <section class="form-panel job-fit-saved-panel">
        <div class="job-fit-panel-header">
          <div>
            <strong>저장된 채용공고 작성 결과</strong>
            <span>저장한 결과물을 나중에 다시 불러와 수정하거나 다운로드할 수 있습니다.</span>
          </div>
        </div>
        ${renderSavedJdDocuments()}
      </section>
      ${renderJdGuidelineModal()}
    </div>
  `;
}

function renderJdGuidelineModal() {
  const jd = getJdEnhancementState();

  if (!jd.guidelineModalOpen) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-jd-guideline-modal-backdrop>
      <section class="trending-modal jd-guideline-modal" role="dialog" aria-modal="true" aria-labelledby="jd-guideline-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="jd-guideline-modal-title">JD 작성 가이드라인</strong>
            <span>저장한 원문은 다음 JD 점검부터 즉시 기준으로 사용됩니다.</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-jd-guideline-modal>닫기</button>
        </div>
        <div class="trending-modal-body jd-guideline-modal-body">
          <textarea class="control-textarea" id="jd-enhance-guideline" rows="18">${escapeHtml(jd.guidelineDraft || jd.guidelineText)}</textarea>
          <div class="modal-actions">
            <button class="ghost-button" type="button" data-close-jd-guideline-modal>취소</button>
            <button class="primary-button" type="button" data-save-jd-guideline>저장</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function rerenderJdEnhancement() {
  persistState();
  renderJdEnhancement();
}

function updateJdGuideline(value) {
  const jd = getJdEnhancementState();
  jd.guidelineDraft = String(value || "").replace(/\r\n?/g, "\n");
  persistState();
}

function openJdGuidelineModal() {
  const jd = getJdEnhancementState();
  jd.guidelineDraft = jd.guidelineText || DEFAULT_JD_GUIDELINE;
  jd.guidelineModalOpen = true;
  rerenderJdEnhancement();
}

function closeJdGuidelineModal() {
  const jd = getJdEnhancementState();
  jd.guidelineModalOpen = false;
  jd.guidelineDraft = jd.guidelineText || DEFAULT_JD_GUIDELINE;
  rerenderJdEnhancement();
}

function syncJdEnhancementActionState() {
  const jd = getJdEnhancementState();
  const canRun = Boolean(jd.guidelineText.trim() && jd.jdText.trim() && !jd.loading && !jd.fileLoading);
  const runButton = document.querySelector("[data-run-jd-enhance]");
  const clearButton = document.querySelector("[data-clear-jd-enhance-input]");
  const downloadButton = document.querySelector("[data-download-jd-final]");
  const saveButton = document.querySelector("[data-save-jd-document]");

  if (runButton) {
    runButton.disabled = !canRun;
  }

  if (clearButton) {
    clearButton.disabled = !(jd.jdText || jd.jdFile);
  }

  if (downloadButton) {
    downloadButton.disabled = !jd.finalText.trim();
  }

  if (saveButton) {
    saveButton.disabled = !((jd.finalText || jd.jdText || "").trim()) || jd.loading || jd.fileLoading;
  }
}

function updateJdInputText(value) {
  const jd = getJdEnhancementState();
  jd.jdText = value;
  jd.finalText = "";
  jd.reviewItems = [];
  jd.score = 0;
  jd.summary = "";
  jd.revisedDocument = "";
  jd.appliedSuggestionIds = [];
  jd.status = value.trim() ? "JD 원문이 수정되었습니다. JD 점검 시작 버튼을 눌러 다시 점검해 주세요." : "";
  persistState();
  syncJdEnhancementActionState();
}

function updateJdFinalText(value) {
  const jd = getJdEnhancementState();
  jd.finalText = value;
  persistState();
  syncJdEnhancementActionState();
}

async function handleJdEnhanceFileUpload(file) {
  if (!file) {
    return;
  }

  const jd = getJdEnhancementState();
  jd.fileLoading = true;
  jd.fileStatus = `${file.name} 파일을 읽는 중입니다.`;
  jd.status = "";
  renderJdEnhancement();

  try {
    const [result, dataUrl] = await Promise.all([
      readResumeText(file),
      readFileAsDataUrl(file)
    ]);
    jd.jdText = result.text;
    jd.finalText = "";
    jd.jdFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      dataUrl,
      uploadedAt: getTimestampText()
    };
    jd.reviewItems = [];
    jd.score = 0;
    jd.summary = "";
    jd.appliedSuggestionIds = [];
    jd.fileStatus = `${file.name} 내용을 JD 원문에 반영했습니다.`;
    jd.status = "최신 가이드라인 기준으로 점검하려면 JD 점검 시작 버튼을 눌러 주세요.";
  } catch (error) {
    console.warn("JD enhancement file could not be read.", error);
    jd.fileStatus = error.isResumeParseError ? error.message.replace(/이력서/g, "JD") : "JD 파일을 읽지 못했습니다.";
  } finally {
    jd.fileLoading = false;
    rerenderJdEnhancement();
  }
}

async function analyzeJdEnhancementWithServer(jdText, guidelineText) {
  const response = await fetch("/api/jd-enhance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jdText,
      guidelineText,
      fileName: getJdEnhancementState().jdFile?.name || ""
    })
  });
  const payload = await readApiJson(response, "JD 고도화");

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `JD enhancement failed: ${response.status}`);
  }

  return payload.result;
}

async function runJdEnhancementReview() {
  const jd = getJdEnhancementState();
  const jdText = normalizeResumeText(jd.jdText);
  const guidelineText = normalizeResumeText(jd.guidelineText);

  if (jd.fileLoading) {
    jd.status = "파일을 읽는 중입니다. 업로드가 끝난 뒤 점검을 시작해 주세요.";
    rerenderJdEnhancement();
    return;
  }

  if (!guidelineText) {
    jd.status = "JD 작성 가이드라인을 먼저 입력해 주세요.";
    rerenderJdEnhancement();
    return;
  }

  if (!jdText) {
    jd.status = "점검할 JD 원문을 먼저 업로드하거나 입력해 주세요.";
    rerenderJdEnhancement();
    return;
  }

  jd.loading = true;
  jd.finalText = jdText;
  jd.status = "JD 작성 가이드라인 기준으로 점검 중입니다.";
  renderJdEnhancement();

  try {
    const result = await analyzeJdEnhancementWithServer(jdText, guidelineText);
    jd.reviewItems = Array.isArray(result.items)
      ? result.items.map(normalizeJdReviewItem).filter((item) => item.title)
      : [];
    jd.score = Math.max(0, Math.min(100, Math.round(Number(result.score || 0))));
    jd.summary = String(result.summary || "").trim();
    jd.revisedDocument = normalizeResumeText(result.revisedDocument || "");
    jd.appliedSuggestionIds = [];
    jd.status = jd.reviewItems.length
      ? `JD 점검을 완료했습니다. 수정 제안 ${jd.reviewItems.filter((item) => item.status !== "pass").length}개를 확인해 주세요.`
      : "JD 점검 결과 수정 제안이 없습니다.";
    addAuditLog("JD 고도화 점검", jd.jdFile?.name || "JD 원문", `점검 항목 ${jd.reviewItems.length}개`);
  } catch (error) {
    console.warn("JD enhancement failed.", error);
    jd.reviewItems = [];
    jd.score = 0;
    jd.summary = "";
    jd.status = /quota|insufficient_quota|OpenAI/i.test(error.message || "")
      ? "OpenAI API 사용량 한도 또는 결제 설정 문제로 AI 점검을 완료하지 못했습니다. API 설정 확인 후 다시 실행해 주세요."
      : "JD 점검 중 오류가 발생했습니다. JD 원문과 가이드라인을 확인한 뒤 다시 실행해 주세요.";
  } finally {
    jd.loading = false;
    rerenderJdEnhancement();
  }
}

function applyJdSuggestedText(currentText, item) {
  const text = normalizeResumeText(currentText);
  const suggestion = normalizeResumeText(item.suggestedText);

  if (!suggestion) {
    return text;
  }

  if (item.originalText && text.includes(item.originalText)) {
    return text.replace(item.originalText, suggestion);
  }

  return `${text}\n\n[${item.section || "JD 개선"} - ${item.title}]\n${suggestion}`.trim();
}

function applyJdSuggestion(itemId) {
  const jd = getJdEnhancementState();
  const item = jd.reviewItems.find((reviewItem) => reviewItem.id === itemId);

  if (!item || !item.suggestedText || jd.appliedSuggestionIds.includes(item.id)) {
    return;
  }

  jd.finalText = applyJdSuggestedText(jd.finalText || jd.jdText, item);
  jd.appliedSuggestionIds.push(item.id);
  jd.status = `${item.title} 추천 문구를 최종 완성본에 반영했습니다.`;
  rerenderJdEnhancement();
}

function applyAllJdSuggestions() {
  const jd = getJdEnhancementState();
  const applicableItems = jd.reviewItems.filter((item) => item.suggestedText && item.status !== "pass");

  if (!applicableItems.length) {
    showToast("적용할 JD 수정 제안이 없습니다.");
    return;
  }

  if (jd.revisedDocument) {
    jd.finalText = jd.revisedDocument;
    jd.appliedSuggestionIds = applicableItems.map((item) => item.id);
  } else {
    applicableItems.forEach((item) => {
      if (!jd.appliedSuggestionIds.includes(item.id)) {
        jd.finalText = applyJdSuggestedText(jd.finalText || jd.jdText, item);
        jd.appliedSuggestionIds.push(item.id);
      }
    });
  }

  jd.status = `${applicableItems.length}개 추천 문구를 최종 완성본에 반영했습니다.`;
  rerenderJdEnhancement();
}

function clearJdEnhancementInput() {
  const jd = getJdEnhancementState();
  jd.jdText = "";
  jd.jdFile = null;
  jd.finalText = "";
  jd.reviewItems = [];
  jd.score = 0;
  jd.summary = "";
  jd.revisedDocument = "";
  jd.appliedSuggestionIds = [];
  jd.fileStatus = "JD 입력을 초기화했습니다.";
  jd.status = "";
  rerenderJdEnhancement();
}

function saveJdGuideline() {
  const jd = getJdEnhancementState();
  const rawGuideline = String($("#jd-enhance-guideline")?.value ?? jd.guidelineDraft ?? jd.guidelineText ?? DEFAULT_JD_GUIDELINE)
    .replace(/\r\n?/g, "\n");
  jd.guidelineText = rawGuideline;
  jd.guidelineDraft = rawGuideline;
  jd.guidelineModalOpen = false;
  jd.status = "JD 작성 가이드라인 원문을 저장했습니다. 다음 점검부터 최신 가이드라인이 반영됩니다.";
  addAuditLog("JD 가이드라인 저장", "JD 고도화", getCurrentActorName());
  rerenderJdEnhancement();
}

async function saveJdDocumentResult() {
  const jd = getJdEnhancementState();
  const finalText = normalizeResumeText(jd.finalText || jd.jdText);

  if (!finalText) {
    showToast("저장할 채용공고 작성 결과물이 없습니다.");
    return;
  }

  const saved = normalizeSavedJdEnhancementDocument({
    id: createId("jd-saved"),
    title: inferJdDocumentTitle(finalText, jd.jdFile?.name || ""),
    sourceFileName: jd.jdFile?.name || "",
    createdAt: getTimestampText(),
    updatedAt: getTimestampText(),
    createdBy: getCurrentActorName(),
    guidelineText: jd.guidelineText,
    jdText: jd.jdText,
    finalText,
    reviewItems: jd.reviewItems,
    score: jd.score,
    summary: jd.summary
  });

  if (!saved) {
    showToast("저장할 채용공고 작성 결과물이 없습니다.");
    return;
  }

  jd.savedDocuments = mergeSavedJdDocuments([saved, ...(jd.savedDocuments || [])], []);
  jd.status = "채용공고 작성 결과물을 저장했습니다.";
  addAuditLog("채용공고 작성 결과 저장", saved.title, getCurrentActorName());

  try {
    await syncJdEnhancementToSupabase();
    jd.status = REMOTE_SYNC_ENABLED
      ? "채용공고 작성 결과물을 계정 기반 저장소에 저장했습니다."
      : "채용공고 작성 결과물을 저장했습니다.";
  } catch (error) {
    console.warn("Saved JD document could not be synced.", error);
    jd.status = "채용공고 작성 결과물을 로컬에 저장했습니다. 원격 저장소 동기화는 실패했습니다.";
  }

  rerenderJdEnhancement();
  showToast("채용공고 작성 결과물이 저장되었습니다.");
}

function loadSavedJdDocument(documentId) {
  const jd = getJdEnhancementState();
  const saved = (jd.savedDocuments || []).find((document) => document.id === documentId);

  if (!saved) {
    showToast("저장된 채용공고 작성 결과물을 찾지 못했습니다.");
    return;
  }

  const savedDocuments = jd.savedDocuments;
  state.jdEnhancement = normalizeJdEnhancementState({
    ...jd,
    guidelineText: saved.guidelineText || jd.guidelineText,
    jdText: saved.jdText,
    jdFile: null,
    finalText: saved.finalText,
    reviewItems: saved.reviewItems,
    score: saved.score,
    summary: saved.summary,
    revisedDocument: "",
    loading: false,
    fileLoading: false,
    status: "저장된 채용공고 작성 결과물을 불러왔습니다.",
    fileStatus: saved.sourceFileName ? `저장 당시 원본 파일: ${saved.sourceFileName}` : "",
    appliedSuggestionIds: [],
    savedDocuments
  });
  rerenderJdEnhancement();
  showToast("채용공고 작성 결과물을 불러왔습니다.");
}

async function deleteSavedJdDocument(documentId) {
  const jd = getJdEnhancementState();
  const beforeCount = jd.savedDocuments.length;
  jd.savedDocuments = jd.savedDocuments.filter((document) => document.id !== documentId);

  if (jd.savedDocuments.length === beforeCount) {
    showToast("삭제할 저장 결과물을 찾지 못했습니다.");
    return;
  }

  jd.status = "저장된 채용공고 작성 결과물을 삭제했습니다.";

  try {
    await syncJdEnhancementToSupabase();
  } catch (error) {
    console.warn("Saved JD document deletion could not be synced.", error);
    jd.status = "저장 결과물을 로컬에서 삭제했습니다. 원격 저장소 동기화는 실패했습니다.";
  }

  rerenderJdEnhancement();
  showToast("저장된 채용공고 작성 결과물을 삭제했습니다.");
}

function isJdDocumentHeading(line) {
  const text = String(line || "").trim();

  if (!text) {
    return false;
  }

  return /^(?:\[.+\]|[0-9]+[.)]\s*)?(?:포지션|직무|채용|소속|근무지|수행업무|담당업무|주요업무|필수|자격|우대|필요역량|핵심역량|조직|협업|전형|기타|JD 개선 제안|개선 제안)/i.test(text)
    || (/[:：]$/.test(text) && text.length <= 40);
}

function renderJdWordParagraphs(lines) {
  const html = [];
  let bulletItems = [];
  let numberedItems = [];

  const flushBullets = () => {
    if (bulletItems.length) {
      html.push(`<ul>${bulletItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
      bulletItems = [];
    }

    if (numberedItems.length) {
      html.push(`<ol>${numberedItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`);
      numberedItems = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = String(line || "").trim();

    if (!trimmed) {
      flushBullets();
      return;
    }

    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)$/);
    const numberedMatch = trimmed.match(/^[0-9]+[.)]\s+(.+)$/);

    if (bulletMatch) {
      if (numberedItems.length) {
        flushBullets();
      }
      bulletItems.push(bulletMatch[1]);
      return;
    }

    if (numberedMatch) {
      if (bulletItems.length) {
        flushBullets();
      }
      numberedItems.push(numberedMatch[1]);
      return;
    }

    flushBullets();
    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  });

  flushBullets();
  return html.join("");
}

function renderJdWordBody(finalText) {
  const blocks = String(finalText || "")
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) {
    return "";
  }

  return blocks.map((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

    if (!lines.length) {
      return "";
    }

    if (lines.length === 1 && isJdDocumentHeading(lines[0])) {
      return `<h2>${escapeHtml(lines[0].replace(/[:：]$/, ""))}</h2>`;
    }

    if (lines.length > 1 && isJdDocumentHeading(lines[0])) {
      return `<h2>${escapeHtml(lines[0].replace(/[:：]$/, ""))}</h2>${renderJdWordParagraphs(lines.slice(1))}`;
    }

    return renderJdWordParagraphs(lines);
  }).join("");
}

function buildJdWordHtml(title, finalText) {
  const generatedAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  return [
    "<!doctype html>",
    "<html>",
    "<head>",
    "<meta charset=\"utf-8\">",
    "<style>",
    "@page WordSection1 { size: 21cm 29.7cm; margin: 2.2cm 2.1cm 2.2cm 2.1cm; }",
    "body { font-family: 'Malgun Gothic', Arial, sans-serif; color: #111827; line-height: 1.65; font-size: 10.5pt; }",
    "div.WordSection1 { page: WordSection1; }",
    ".doc-header { border-bottom: 2px solid #111827; padding-bottom: 14px; margin-bottom: 22px; }",
    ".doc-eyebrow { color: #6b7280; font-size: 9pt; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 4px; }",
    "h1 { font-size: 20pt; line-height: 1.3; margin: 0; color: #111827; }",
    ".meta { color: #6b7280; font-size: 9pt; margin-top: 8px; }",
    "h2 { font-size: 13pt; margin: 20px 0 8px; padding-bottom: 5px; border-bottom: 1px solid #d1d5db; color: #111827; }",
    "p { margin: 0 0 8px; }",
    "ul, ol { margin: 0 0 10px 20px; padding: 0; }",
    "li { margin: 0 0 5px; }",
    ".doc-footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 8.5pt; }",
    "</style>",
    "</head>",
    "<body>",
    "<div class=\"WordSection1\">",
    "<div class=\"doc-header\">",
    "<p class=\"doc-eyebrow\">Job Description</p>",
    `<h1>${escapeHtml(title)} 최종본</h1>`,
    `<div class=\"meta\">생성 시각: ${escapeHtml(generatedAt)} KST</div>`,
    "</div>",
    renderJdWordBody(finalText),
    "<div class=\"doc-footer\">본 문서는 JD 고도화 메뉴에서 작성 가이드라인 점검 후 생성된 Word 호환 문서입니다.</div>",
    "</div>",
    "</body>",
    "</html>"
  ].join("");
}

function downloadJdFinalDocument() {
  const jd = getJdEnhancementState();
  const finalText = String(jd.finalText || jd.jdText || "").replace(/\r\n?/g, "\n").trim();

  if (!finalText) {
    showToast("다운로드할 최종 완성본이 없습니다.");
    return;
  }

  const title = (jd.jdFile?.name || "JD_최종완성본").replace(/\.[^.]+$/, "");
  const html = buildJdWordHtml(title, finalText);
  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${title}_최종완성본.doc`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  addAuditLog("JD 최종본 다운로드", title, "Word 호환 문서 다운로드");
}

function rerenderJobFitWorkspace(options = {}) {
  if (options.refreshResults) {
    refreshJobFitResults();
  }

  persistState();
  renderJobFitAnalysis();
}

function updateJobFitJdText(value) {
  const jobFit = getJobFitState();
  jobFit.jdText = value;
  jobFit.analysisLoading = false;
  jobFit.results = [];
  jobFit.hasAnalyzed = false;
  jobFit.analysisStatus = value.trim()
    ? "직무기술서가 수정되었습니다. 평가 분석 시작 버튼을 눌러 결과를 다시 생성해 주세요."
    : "";
  persistState();

  const resultSection = $("#job-fit-results-section");
  if (resultSection) {
    resultSection.outerHTML = renderJobFitResultsPanel();
  }
}

function openJobFitPoolPicker() {
  const jobFit = getJobFitState();
  jobFit.poolPickerOpen = true;
  jobFit.poolPickerSelectedIds = [];
  persistState();
  renderJobFitAnalysis();
}

function closeJobFitPoolPicker() {
  const jobFit = getJobFitState();
  jobFit.poolPickerOpen = false;
  jobFit.poolPickerSelectedIds = [];
  persistState();
  renderJobFitAnalysis();
}

function updateJobFitPoolPickerQuery(value) {
  const jobFit = getJobFitState();
  jobFit.poolPickerQuery = String(value || "").trim();
  persistState();
  renderJobFitAnalysis();
  const queryInput = $("#job-fit-pool-picker-query");
  if (queryInput) {
    queryInput.focus();
    queryInput.setSelectionRange(queryInput.value.length, queryInput.value.length);
  }
}

function toggleJobFitPoolCandidate(candidateId, checked) {
  const jobFit = getJobFitState();
  const id = String(candidateId || "").trim();

  if (!id) {
    return;
  }

  const selected = new Set(jobFit.poolPickerSelectedIds || []);

  if (checked) {
    selected.add(id);
  } else {
    selected.delete(id);
  }

  jobFit.poolPickerSelectedIds = [...selected];
  persistState();
  renderJobFitAnalysis();
}

function addSelectedPoolProfilesToJobFit() {
  const jobFit = getJobFitState();
  const selectedIds = new Set(jobFit.poolPickerSelectedIds || []);

  if (!selectedIds.size) {
    showToast("추가할 Talent Pool 프로필을 선택해 주세요.");
    return;
  }

  const alreadyAdded = new Set(jobFit.resumes.map((resume) => resume.candidateId).filter(Boolean));
  const candidates = getVisibleCandidates()
    .filter((candidate) => selectedIds.has(candidate.id) && !alreadyAdded.has(candidate.id));
  const poolResumes = candidates
    .map(candidateToJobFitResume)
    .filter((resume) => resume.text);

  if (!poolResumes.length) {
    showToast("추가할 수 있는 새 프로필이 없습니다.");
    return;
  }

  jobFit.resumes = [...jobFit.resumes, ...poolResumes];
  jobFit.results = [];
  jobFit.hasAnalyzed = false;
  jobFit.analysisLoading = false;
  jobFit.resumeProgress = 100;
  jobFit.resumeStatus = "";
  jobFit.analysisStatus = `${poolResumes.length}개 Talent Pool 프로필을 분석 풀에 추가했습니다. 평가 분석 시작 버튼을 눌러 결과를 생성해 주세요.`;
  jobFit.poolPickerOpen = false;
  jobFit.poolPickerSelectedIds = [];
  addAuditLog("직무적합도 Pool 프로필 추가", `${poolResumes.length}개 프로필`, "Talent Pool 프로필 기반 분석 풀 추가");
  rerenderJobFitWorkspace();
}

async function handleJobFitJdFileUpload(file) {
  if (!file) {
    return;
  }

  const jobFit = getJobFitState();
  jobFit.analysisLoading = false;
  jobFit.jdLoading = true;
  jobFit.jdProgress = 16;
  jobFit.jdStatus = `${file.name} 파일을 읽는 중입니다.`;
  jobFit.analysisStatus = "";
  renderJobFitAnalysis();

  try {
    const [result, dataUrl] = await Promise.all([
      readResumeText(file),
      readFileAsDataUrl(file)
    ]);
    jobFit.jdProgress = 72;
    jobFit.jdStatus = "직무기술서 텍스트를 정리하는 중입니다.";
    rerenderJobFitWorkspace();
    jobFit.jdText = result.text;
    jobFit.jdFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      dataUrl,
      uploadedAt: getTimestampText()
    };
    jobFit.results = [];
    jobFit.hasAnalyzed = false;
    jobFit.jdProgress = 100;
    jobFit.jdStatus = "직무기술서 파일 내용을 입력란에 반영했습니다.";
    jobFit.analysisStatus = "직무기술서가 준비되었습니다. 이력서를 업로드한 뒤 평가 분석을 시작해 주세요.";
  } catch (error) {
    console.warn("JD file could not be read.", error);
    jobFit.jdProgress = 0;
    jobFit.jdStatus = error.isResumeParseError ? error.message : "직무기술서 파일을 읽지 못했습니다.";
  } finally {
    jobFit.jdLoading = false;
    rerenderJobFitWorkspace();
  }
}

async function handleJobFitResumeUpload(files) {
  const uploadFiles = [...(files || [])];

  if (!uploadFiles.length) {
    return;
  }

  const jobFit = getJobFitState();
  jobFit.analysisLoading = false;
  jobFit.resumeLoading = true;
  jobFit.resumeProgress = 8;
  jobFit.resumeStatus = `${uploadFiles.length}개 이력서를 읽는 중입니다.`;
  jobFit.analysisStatus = "";
  renderJobFitAnalysis();

  const loadedResumes = [];
  const failedNames = [];

  for (let index = 0; index < uploadFiles.length; index += 1) {
    const file = uploadFiles[index];
    jobFit.resumeProgress = Math.max(12, Math.round(((index + 1) / uploadFiles.length) * 82));
    jobFit.resumeStatus = `${index + 1}/${uploadFiles.length} ${file.name} 파일을 읽는 중입니다.`;
    rerenderJobFitWorkspace();

    try {
      const [result, dataUrl] = await Promise.all([
        readResumeText(file),
        readFileAsDataUrl(file)
      ]);
      loadedResumes.push(normalizeJobFitResume({
        fileName: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
        text: result.text,
        uploadedAt: getTimestampText()
      }));
    } catch (error) {
      console.warn("Resume file could not be read.", file.name, error);
      failedNames.push(file.name);
    }
  }

  jobFit.resumes = [...jobFit.resumes, ...loadedResumes];
  jobFit.results = [];
  jobFit.hasAnalyzed = false;
  jobFit.resumeLoading = false;
  jobFit.resumeProgress = loadedResumes.length ? 100 : 0;
  jobFit.resumeStatus = failedNames.length ? `읽지 못한 파일: ${failedNames.join(", ")}` : "";
  jobFit.analysisStatus = loadedResumes.length
    ? "분석 대상 풀이 변경되었습니다. 평가 분석 시작 버튼을 눌러 결과를 생성해 주세요."
    : "분석 가능한 대상이 추가되지 않았습니다.";

  rerenderJobFitWorkspace();
}

function removeJobFitResume(resumeId) {
  const jobFit = getJobFitState();
  jobFit.analysisLoading = false;
  jobFit.resumes = jobFit.resumes.filter((resume) => resume.id !== resumeId);
  jobFit.results = [];
  jobFit.hasAnalyzed = false;
  jobFit.resumeProgress = 0;
  jobFit.resumeStatus = "이력서를 삭제했습니다.";
  jobFit.analysisStatus = "분석 대상 풀이 변경되었습니다. 평가 분석 시작 버튼을 눌러 결과를 다시 생성해 주세요.";
  rerenderJobFitWorkspace();
}

function clearJobFitJd() {
  const jobFit = getJobFitState();
  jobFit.analysisLoading = false;
  jobFit.jdText = "";
  jobFit.jdFile = null;
  jobFit.results = [];
  jobFit.hasAnalyzed = false;
  jobFit.jdProgress = 0;
  jobFit.jdStatus = "직무기술서 입력을 초기화했습니다.";
  jobFit.analysisStatus = "";
  rerenderJobFitWorkspace();
}

function clearJobFitResumes() {
  const jobFit = getJobFitState();
  jobFit.analysisLoading = false;
  jobFit.resumes = [];
  jobFit.results = [];
  jobFit.hasAnalyzed = false;
  jobFit.resumeLoading = false;
  jobFit.resumeProgress = 0;
  jobFit.resumeStatus = "";
  jobFit.analysisStatus = "";
  rerenderJobFitWorkspace();
}

function clearJobFitResults() {
  const jobFit = getJobFitState();
  jobFit.analysisLoading = false;
  jobFit.results = [];
  jobFit.hasAnalyzed = false;
  jobFit.analysisProgress = 0;
  jobFit.analysisStatus = "";
  rerenderJobFitWorkspace();
}

function clearJobFitAll() {
  const jobFit = getJobFitState();
  jobFit.jdText = "";
  jobFit.jdFile = null;
  jobFit.resumes = [];
  jobFit.results = [];
  jobFit.hasAnalyzed = false;
  jobFit.jdLoading = false;
  jobFit.resumeLoading = false;
  jobFit.analysisLoading = false;
  jobFit.jdProgress = 0;
  jobFit.resumeProgress = 0;
  jobFit.analysisProgress = 0;
  jobFit.jdStatus = "";
  jobFit.resumeStatus = "";
  jobFit.analysisStatus = "";
  rerenderJobFitWorkspace();
}

async function runJobFitAnalysis() {
  const jobFit = getJobFitState();
  const jdText = normalizeResumeText(jobFit.jdText);

  if (jobFit.jdLoading || jobFit.resumeLoading) {
    jobFit.analysisStatus = "파일을 읽는 중입니다. 업로드가 끝난 뒤 평가 분석을 시작해 주세요.";
    rerenderJobFitWorkspace();
    showToast("파일 업로드가 끝난 뒤 분석을 시작해 주세요.");
    return;
  }

  if (!jdText) {
    jobFit.analysisStatus = "직무기술서를 먼저 입력하거나 업로드해 주세요.";
    rerenderJobFitWorkspace();
    showToast("직무기술서를 먼저 입력해 주세요.");
    return;
  }

  if (!jobFit.resumes.length) {
    jobFit.analysisStatus = "분석할 이력서 또는 Talent Pool 프로필을 먼저 추가해 주세요.";
    rerenderJobFitWorkspace();
    showToast("분석 대상을 먼저 추가해 주세요.");
    return;
  }

  jobFit.analysisLoading = true;
  jobFit.analysisProgress = 18;
  jobFit.analysisStatus = "평가 분석을 진행 중입니다.";
  renderJobFitAnalysis();

  try {
    try {
      jobFit.analysisProgress = 54;
      jobFit.analysisStatus = "AI가 JD와 이력서 맥락을 비교하는 중입니다.";
      rerenderJobFitWorkspace();
      jobFit.results = await analyzeJobFitWithServer(jdText, jobFit.resumes);
      jobFit.analysisProgress = 100;
      jobFit.analysisStatus = jobFit.results.length
        ? `${jobFit.results.length}개 분석 대상의 직무적합도 AI 분석을 완료했습니다.`
        : "AI 분석 결과를 생성하지 못했습니다. JD와 이력서 텍스트를 확인해 주세요.";
    } catch (serverError) {
      console.warn("Server job fit analysis failed. Using local report analysis.", serverError);
      jobFit.analysisProgress = 72;
      jobFit.analysisStatus = "브라우저 기준 보고서형 분석으로 전환하는 중입니다.";
      rerenderJobFitWorkspace();
      await new Promise((resolve) => window.setTimeout(resolve, 20));
      refreshJobFitResults();
      jobFit.analysisProgress = 100;
      jobFit.analysisStatus = jobFit.results.length
        ? `${jobFit.results.length}개 분석 대상의 직무적합도 분석을 완료했습니다. AI 서버 연결 문제로 브라우저 기준 보고서형 분석을 사용했습니다.`
        : "분석 결과를 생성하지 못했습니다. 업로드한 파일의 텍스트를 확인해 주세요.";
    }

    jobFit.hasAnalyzed = true;
    addAuditLog("직무적합도 분석 실행", `${jobFit.resumes.length}개 분석 대상`, `결과 ${jobFit.results.length}개`);
  } catch (error) {
    console.warn("Job fit analysis failed.", error);
    jobFit.results = [];
    jobFit.hasAnalyzed = true;
    jobFit.analysisProgress = 0;
    jobFit.analysisStatus = "직무적합도 분석 중 오류가 발생했습니다. JD와 이력서 파일의 텍스트를 확인한 뒤 다시 실행해 주세요.";
  } finally {
    jobFit.analysisLoading = false;
    rerenderJobFitWorkspace();
  }
}

function inferJobFitAnalysisTitle(jdText, results) {
  const firstLine = splitJobFitSentences(jdText)[0] || "직무적합도 분석";
  const topName = results[0]?.candidateName ? ` · 1순위 ${results[0].candidateName}` : "";
  return `${firstLine.slice(0, 42)}${firstLine.length > 42 ? "..." : ""}${topName}`;
}

async function saveJobFitAnalysis() {
  const jobFit = getJobFitState();

  if (!jobFit.results.length) {
    showToast("저장할 분석 결과가 없습니다.");
    return;
  }

  const saved = normalizeSavedJobFitAnalysis(withCurrentAccountOwner({
    id: createId("job-fit-saved"),
    title: inferJobFitAnalysisTitle(jobFit.jdText, jobFit.results),
    createdAt: getTimestampText(),
    createdBy: getCurrentActorName(),
    jdText: jobFit.jdText,
    jdFile: jobFit.jdFile,
    resumes: jobFit.resumes,
    results: jobFit.results
  }));

  jobFit.savedAnalyses = [saved, ...jobFit.savedAnalyses.filter((item) => item.id !== saved.id)].slice(0, 20);
  jobFit.analysisStatus = "분석 결과를 저장했습니다.";
  addAuditLog("직무적합도 분석 저장", saved.title, `${saved.results.length}개 이력서 평가`);

  try {
    await upsertJobFitAnalysisToSupabase(saved);
    jobFit.analysisStatus = REMOTE_SYNC_ENABLED
      ? "분석 결과를 계정 기반 저장소에 저장했습니다."
      : "분석 결과를 저장했습니다.";
  } catch (error) {
    console.warn("Saved job fit analysis could not be synced.", error);
    jobFit.analysisStatus = "분석 결과를 로컬에 저장했습니다. Supabase 저장소 동기화는 실패했습니다.";
  }

  rerenderJobFitWorkspace();
  showToast("분석 결과가 저장되었습니다.");
}

function loadSavedJobFitAnalysis(analysisId) {
  const jobFit = getJobFitState();
  const saved = getCurrentUserSavedJobFitAnalyses().find((analysis) => analysis.id === analysisId);

  if (!saved) {
    showToast("저장된 분석 결과를 찾지 못했습니다.");
    return;
  }

  state.jobFitAnalysis = normalizeJobFitState({
    ...jobFit,
    jdText: saved.jdText,
    jdFile: saved.jdFile,
    resumes: saved.resumes,
    results: saved.results,
    hasAnalyzed: true,
    analysisStatus: "저장된 분석 결과를 불러왔습니다."
  });
  rerenderJobFitWorkspace();
}

async function deleteSavedJobFitAnalysis(analysisId) {
  const jobFit = getJobFitState();
  jobFit.savedAnalyses = jobFit.savedAnalyses.filter((analysis) => analysis.id !== analysisId);
  jobFit.analysisStatus = "저장된 분석 결과를 삭제했습니다.";

  try {
    await deleteJobFitAnalysisFromSupabase(analysisId);
  } catch (error) {
    console.warn("Saved job fit analysis could not be deleted from Supabase.", error);
    jobFit.analysisStatus = "저장된 분석 결과를 로컬에서 삭제했습니다. Supabase 삭제 동기화는 실패했습니다.";
  }

  rerenderJobFitWorkspace();
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
  const messages = getCurrentUserPolicyChatMessages();

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

function renderPolicyCitationChip(citationId) {
  const citation = findPolicyCitation(citationId);

  if (!citation) {
    return "";
  }

  return `<button class="policy-citation-chip" type="button" data-policy-citation="${escapeHtml(citation.id)}" aria-label="${escapeHtml(`${citation.sourceTitle} 근거 ${citation.number}`)}">${citation.number}</button>`;
}

function getPolicyActiveCitation() {
  return findPolicyCitation(state.policyChatSelectedCitationId);
}

function getPolicyActiveSource() {
  const citation = getPolicyActiveCitation();
  const citationSource = citation ? findPolicySource(citation.sourceId) : null;

  return citationSource || state.policySources[0] || null;
}

function renderPolicySourceDocument(source, citation) {
  if (!source) {
    return "";
  }

  const content = normalizePolicyText(source.content);

  if (!content) {
    return "";
  }

  const targets = citation?.sourceId === source.id
    ? (Array.isArray(citation.keySentences) && citation.keySentences.length ? citation.keySentences : [citation.quote])
        .map((sentence) => String(sentence || "").trim())
        .filter(Boolean)
    : [];
  let segments = [{ text: content, highlighted: false }];

  targets.forEach((target) => {
    segments = segments.flatMap((segment) => {
      if (segment.highlighted || !segment.text) {
        return [segment];
      }

      const index = segment.text.indexOf(target);

      if (index < 0) {
        return [segment];
      }

      return [
        { text: segment.text.slice(0, index), highlighted: false },
        { text: segment.text.slice(index, index + target.length), highlighted: true },
        { text: segment.text.slice(index + target.length), highlighted: false }
      ].filter((item) => item.text);
    });
  });

  return segments
    .map((segment) => segment.highlighted
      ? `<mark class="policy-citation-highlight">${escapeHtml(segment.text)}</mark>`
      : escapeHtml(segment.text))
    .join("");
}

function renderPolicySourceReader() {
  const citation = getPolicyActiveCitation();
  const source = getPolicyActiveSource();
  const sourceMeta = source
    ? [source.fileName || source.sourceType, source.updatedAt].filter(Boolean).join(" · ")
    : "";

  return `
    <section class="policy-source-reader" aria-label="채용 기준 출처">
      <div class="policy-notebook-panel-header">
        <strong>출처</strong>
        <button class="ghost-button compact-button" type="button" data-open-policy-sources>소스 데이터 ${state.policySources.length}개</button>
      </div>
      <div class="policy-source-reader-body">
        <div class="policy-source-title-block">
          <h4>${escapeHtml(source?.title || "채용 기준 문서")}</h4>
          ${sourceMeta ? `<span>${escapeHtml(sourceMeta)}</span>` : ""}
        </div>
        ${citation?.sourceId === source?.id ? `
          <article class="policy-source-focus">
            <span>선택된 근거 문구</span>
            <p>${renderHighlightedPolicyQuote(citation)}</p>
          </article>
        ` : ""}
        ${source?.content
          ? `<pre class="policy-source-document">${renderPolicySourceDocument(source, citation)}</pre>`
          : `<div class="empty-state">등록된 채용 기준 소스가 없습니다.</div>`}
      </div>
    </section>
  `;
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
          <p>${escapeHtml(item.text)} ${item.citationId ? renderPolicyCitationChip(item.citationId) : ""}</p>
        </div>
      `).join("")}
    </article>
  `;
}

function getCurrentUserPolicyChatMessages() {
  return (state.policyChatMessages || []).filter(belongsToCurrentAccount);
}

function renderPolicyCitationPanel() {
  const citationContext = findPolicyCitationContext(state.policyChatSelectedCitationId);
  const citation = citationContext?.citation || null;

  if (!citation) {
    return "";
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
      <button class="soft-button compact-button policy-citation-source-button" type="button" data-open-policy-sources>소스 보기</button>
    </aside>
  `;
}

function renderPolicyChat() {
  const content = $("#policy-chat-content");

  if (!content) {
    return;
  }

  const accountMessages = getCurrentUserPolicyChatMessages();
  const messages = accountMessages.length
    ? accountMessages.map(renderPolicyMessage).join("")
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
    <div class="policy-chat-layout policy-notebook-layout">
      ${renderPolicySourceReader()}

      <section class="policy-chat-panel policy-notebook-chat-panel">
        <div class="policy-notebook-panel-header">
          <strong>채팅</strong>
          <div class="policy-chat-actions">
            <button class="ghost-button compact-button" type="button" data-clear-policy-chat>대화 초기화</button>
          </div>
        </div>
        <div class="policy-chat-workspace">
          <div class="policy-message-list">${messages}${loadingMessage}</div>
          <form id="policy-chat-form" class="policy-chat-form">
            <textarea class="control-textarea" id="policy-chat-question" name="question" placeholder="질문하거나 창작하세요">${escapeHtml(state.policyChatQuestion)}</textarea>
            <div class="policy-chat-form-footer">
              <span>소스 ${state.policySources.length}개</span>
              <button class="primary-button policy-chat-submit" type="submit" ${state.policyChatLoading ? "disabled" : ""} aria-label="질문하기">${state.policyChatLoading ? "정리 중" : "➜"}</button>
            </div>
          </form>
          <p class="policy-chat-disclaimer">등록된 소스에 없는 내용은 답변하지 않습니다. 번호 근거를 누르면 원문 문구를 확인할 수 있습니다.</p>
        </div>
      </section>
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
    ...currentAccountOwnerFields(),
    role: "user",
    text: question,
    createdAt: getTimestampText()
  });
  persistState();
  renderPolicyChat();

  try {
    const answer = await buildPolicyAssistantMessage(question);
    state.policyChatMessages.push(withCurrentAccountOwner(answer));
    state.policyChatMessages = state.policyChatMessages.slice(-POLICY_CHAT_MAX_MESSAGES);
    state.policyChatSelectedCitationId = "";
    addAuditLog("채용 AI 챗봇 질문", "채용 기준 Q&A", question);
  } catch (error) {
    console.warn("Policy answer failed.", error);
    state.policyChatMessages.push({
      id: createId("policy-message"),
      ...currentAccountOwnerFields(),
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
  state.policyChatMessages = (state.policyChatMessages || []).filter((message) => !belongsToCurrentAccount(message));
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

function aiSearchGradeFromScore(score) {
  return gradeFromJobFitScore(score);
}

function buildAiSearchResult(candidate, score, reasons) {
  const matchScore = Math.max(0, Math.min(98, Math.round(score)));

  return {
    ...candidate,
    matchScore,
    matchGrade: aiSearchGradeFromScore(matchScore),
    matchReasons: reasons.filter(Boolean).slice(0, 4)
  };
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
      const roleText = normalizeSearchText([candidate.role, candidate.company, candidate.jobFamily].filter(Boolean).join(" "));
      const careerText = normalizeSearchText((candidate.career || [])
        .flatMap((item) => [item.company, item.rank, item.position, item.achievements])
        .filter(Boolean)
        .join(" "));
      const educationText = normalizeSearchText((candidate.education || [])
        .flatMap((item) => [item.degree, item.school, item.major])
        .filter(Boolean)
        .join(" "));
      const roleHits = queryTokens.filter((token) => roleText.includes(token));
      const careerHits = queryTokens.filter((token) => careerText.includes(token));
      const educationHits = queryTokens.filter((token) => educationText.includes(token));
      const tokenCoverage = queryTokens.length ? tokenHits.length / queryTokens.length : 0;
      const reasons = [];
      let score = 12;

      score += Math.min(24, Math.round(tokenCoverage * 24));
      score += requestedConcepts.length
        ? Math.min(28, Math.round((conceptHits.length / requestedConcepts.length) * 28))
        : Math.min(10, tokenHits.length * 2);
      score += Math.min(18, skillHits.length * 6);
      score += Math.min(10, roleHits.length * 4);
      score += Math.min(12, careerHits.length * 3);
      score += Math.min(6, educationHits.length * 2);

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

      if (requestedConcepts.length && !conceptHits.length) {
        score -= 18;
      }

      if (queryTokens.length >= 3 && tokenCoverage < 0.25) {
        score -= 12;
      }

      if (tokenCoverage >= 0.7 && (conceptHits.length || skillHits.length || careerHits.length)) {
        score += 8;
      }

      return buildAiSearchResult(candidate, score, reasons);
    })
    .filter((candidate) => candidate.matchScore >= 25)
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
      const localScore = Number(local?.matchScore || 0);
      const serverScore = Number(result.score || 0);
      const blendedScore = serverScore && localScore
        ? Math.round((serverScore * 0.65) + (localScore * 0.35))
        : serverScore || localScore;

      return buildAiSearchResult(
        candidate,
        blendedScore,
        result.reasons?.length ? result.reasons : local?.matchReasons || []
      );
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

function parseSerializedNewsLink(value) {
  const text = String(value || "").trim();

  if (!text.startsWith("@{") || !text.endsWith("}")) {
    return null;
  }

  const pairs = {};
  text.slice(2, -1).split(";").forEach((part) => {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex <= 0) {
      return;
    }

    const key = part.slice(0, separatorIndex).trim();
    const pairValue = part.slice(separatorIndex + 1).trim();

    if (key) {
      pairs[key] = pairValue;
    }
  });

  return pairs.url ? pairs : null;
}

function normalizeNewsLink(link) {
  const source = typeof link === "string" ? parseSerializedNewsLink(link) : link;

  if (!source || typeof source !== "object") {
    return null;
  }

  return {
    url: String(source.url || "").trim(),
    title: String(source.title || "").trim(),
    source: String(source.source || "").trim(),
    snippet: String(source.snippet || source.description || "").trim()
  };
}

function normalizeNewsLinks(links) {
  return (links || []).map(normalizeNewsLink).filter((link) => link?.url);
}

function renderNewsLinks(reason) {
  const links = normalizeNewsLinks(reason.links).slice(0, 1);

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
    .map(normalizeNewsLink)
    .filter(Boolean)
    .filter((link, index, array) => link.url && array.findIndex((item) => item.url === link.url) === index)
    .slice(0, 1);

  (reasons || []).forEach((reason) => {
    const rawText = typeof reason === "object" ? reason.text : reason;
    const link = typeof reason === "object" ? normalizeNewsLinks(reason.links).find((item) => item.url) : null;
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
    .map(normalizeNewsLink)
    .filter(Boolean)
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

function renderTrendingSearchPanel(options = {}) {
  if (!isAdmin()) {
    return "";
  }

  const settings = state.trendingSearchSettings || DEFAULT_TRENDING_SEARCH_SETTINGS;
  const hideTitle = Boolean(options.hideTitle);

  return `
    <form class="trending-mail-panel" id="trending-search-form">
      <div class="trending-mail-header">
        <div>
          ${hideTitle ? "" : "<strong>관심 분야 설정</strong>"}
          <span>${settings.updatedAt ? `마지막 수정: ${escapeHtml(settings.updatedAt)}` : "리포트 생성과 인물 선정에 반영됩니다."}</span>
        </div>
      </div>
      <div class="trending-mail-grid">
        <div class="field full">
          <label for="trending-search-prompt">검색/선정 프롬프트</label>
          <textarea class="control-textarea" id="trending-search-prompt" name="prompt" rows="8" placeholder="예: AI 에이전트, 휴머노이드 로봇, 온디바이스 AI, 모바일 UX, TV 플랫폼, 생활가전 서비스 중심. DS/반도체 분야는 제외.">${escapeHtml(settings.prompt)}</textarea>
          <div class="field-caption">이 문장은 매일 06:00 KST 자동 리포트 생성 시 Google News 검색 쿼리와 Top 5 선정 기준에 함께 반영됩니다.</div>
        </div>
        <div class="field full">
          <label>자동 키워드 미리보기</label>
          <div class="recipient-chip-list">
            ${(settings.keywords || []).map((keyword) => `<span class="recipient-chip">${escapeHtml(keyword)}</span>`).join("")}
          </div>
        </div>
      </div>
      <div class="trending-mail-actions">
        <button class="primary-button compact-button" type="button" data-save-trending-search ${state.trendingSearchLoading ? "disabled" : ""}>설정 저장</button>
      </div>
    </form>
  `;
}

function trendingPersonIdentifier(person) {
  return String(person?.id || person?.name || person?.rank || "").trim();
}

function trendingEducationEditText(person) {
  return (person?.education || []).map((item) => [
    item.degree || "",
    item.school || "",
    item.major || "",
    item.year || item.graduationYear || item.end || ""
  ].map((value) => String(value || "").trim()).join(" | ")).join("\n");
}

function trendingCareerEditText(person) {
  return (person?.career || []).map((item) => [
    item.country || "",
    item.company || "",
    item.rank || "",
    item.title || item.position || item.department || item.organization || item.team || "",
    item.start || item.startYear || "",
    item.end || item.endYear || ""
  ].map((value) => String(value || "").trim()).join(" | ")).join("\n");
}

function trendingAchievementsEditText(person) {
  return (person?.achievements || []).map((item) => String(item || "").trim()).filter(Boolean).join("\n");
}

function trendingReasonsEditText(person) {
  return (person?.selectionReasons || [])
    .map((reason) => typeof reason === "string" ? reason : reason.text)
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .join("\n");
}

function getTrendingPrimarySourceLink(person) {
  return (person?.selectionReasons || [])
    .filter((reason) => typeof reason === "object")
    .flatMap((reason) => reason.links || [])
    .find((link) => link?.url) || {};
}

function splitNonEmptyLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseTrendingEducationLines(value) {
  return splitNonEmptyLines(value).map((line) => {
    const parts = line.split("|").map((part) => part.trim());
    return {
      degree: parts[0] || "",
      school: parts[1] || "",
      major: parts[2] || "",
      year: parts[3] || ""
    };
  }).filter((item) => item.degree || item.school || item.major || item.year);
}

function parseTrendingCareerLines(value) {
  return splitNonEmptyLines(value).map((line) => {
    const parts = line.split("|").map((part) => part.trim());
    return {
      country: parts[0] || "",
      company: parts[1] || "",
      rank: parts[2] || "",
      title: parts[3] || "",
      department: "",
      start: parts[4] || "",
      end: parts[5] || ""
    };
  }).filter((item) => item.country || item.company || item.rank || item.title || item.start || item.end);
}

function renderTrendingProfileEditPanel() {
  const person = findTrendingPerson(state.trendingEditingPersonId);

  if (!person) {
    return `<div class="empty-state compact-empty">수정할 인물 프로필을 찾을 수 없습니다.</div>`;
  }

  const sourceLink = getTrendingPrimarySourceLink(person);

  return `
    <form class="trending-profile-edit-form" id="trending-profile-edit-form" data-trending-profile-id="${escapeHtml(trendingPersonIdentifier(person))}">
      ${state.trendingProfileError ? `<div class="form-error">${escapeHtml(state.trendingProfileError)}</div>` : ""}
      <div class="field-grid">
        <div class="field">
          <label for="trending-edit-name">이름</label>
          <input class="control-input" id="trending-edit-name" name="name" value="${inputValue(person.name)}" />
        </div>
        <div class="field">
          <label for="trending-edit-birth-year">출생년도</label>
          <input class="control-input" id="trending-edit-birth-year" name="birthYear" inputmode="numeric" value="${inputValue(person.birthYear)}" />
        </div>
        <div class="field">
          <label for="trending-edit-current-org">현재소속</label>
          <input class="control-input" id="trending-edit-current-org" name="currentOrg" value="${inputValue(person.currentOrg)}" />
        </div>
        <div class="field">
          <label for="trending-edit-current-title">현재직책</label>
          <input class="control-input" id="trending-edit-current-title" name="currentTitle" value="${inputValue(person.currentTitle)}" />
        </div>
        <div class="field full">
          <label for="trending-edit-linkedin">LinkedIn URL</label>
          <input class="control-input" id="trending-edit-linkedin" name="linkedinUrl" type="url" value="${inputValue(person.linkedinUrl)}" placeholder="https://www.linkedin.com/in/..." />
        </div>
        <div class="field full">
          <label for="trending-edit-education">학력</label>
          <textarea class="control-textarea" id="trending-edit-education" name="education" rows="5" placeholder="박 | 서울대학교 | 전자공학 | 2021">${inputValue(trendingEducationEditText(person))}</textarea>
          <span class="field-caption">한 줄에 하나씩 입력합니다. 형식: 학위 | 학교 | 전공 | 취득년도</span>
        </div>
        <div class="field full">
          <label for="trending-edit-career">경력</label>
          <textarea class="control-textarea" id="trending-edit-career" name="career" rows="7" placeholder="한국 | 삼성전자 | 상무 | People팀장 | 2014 | 2020">${inputValue(trendingCareerEditText(person))}</textarea>
          <span class="field-caption">한 줄에 하나씩 입력합니다. 형식: 국가 | 회사 | 직급 | 직책/부서 | 시작 | 종료</span>
        </div>
        <div class="field full">
          <label for="trending-edit-achievements">주요 성과/실적</label>
          <textarea class="control-textarea" id="trending-edit-achievements" name="achievements" rows="4">${inputValue(trendingAchievementsEditText(person))}</textarea>
        </div>
        <div class="field full">
          <label for="trending-edit-reasons">선정 사유</label>
          <textarea class="control-textarea" id="trending-edit-reasons" name="selectionReasons" rows="4">${inputValue(trendingReasonsEditText(person))}</textarea>
          <span class="field-caption">두 문장을 줄바꿈으로 입력하면 웹 화면과 메일 본문 모두 같은 순서로 표시됩니다.</span>
        </div>
        <div class="field">
          <label for="trending-edit-source">근거기사 매체명</label>
          <input class="control-input" id="trending-edit-source" name="source" value="${inputValue(sourceLink.source)}" />
        </div>
        <div class="field">
          <label for="trending-edit-source-url">근거기사 URL</label>
          <input class="control-input" id="trending-edit-source-url" name="sourceUrl" type="url" value="${inputValue(sourceLink.url)}" />
        </div>
        <div class="field full">
          <label for="trending-edit-source-title">근거기사 제목</label>
          <input class="control-input" id="trending-edit-source-title" name="sourceTitle" value="${inputValue(sourceLink.title)}" />
        </div>
        <div class="field full">
          <label for="trending-edit-source-snippet">근거기사 요약</label>
          <textarea class="control-textarea compact-textarea" id="trending-edit-source-snippet" name="sourceSnippet" rows="3">${inputValue(sourceLink.snippet || sourceLink.description)}</textarea>
        </div>
      </div>
      <div class="trending-profile-edit-actions">
        <button class="ghost-button" type="button" data-close-trending-modal>취소</button>
        <button class="primary-button" type="button" data-save-trending-profile ${state.trendingProfileSaving ? "disabled" : ""}>수정 저장</button>
      </div>
    </form>
  `;
}

function renderTrendingModal() {
  if (!state.trendingModal) {
    return "";
  }

  const modalType = state.trendingModal;
  const isMailModal = modalType === "mail";
  const isSearchModal = modalType === "search";
  const isProfileModal = modalType === "profile";
  const title = isMailModal ? "메일링 설정" : "리포트 보관함";
  const description = isMailModal
    ? "발송 시간과 복수 수신처를 설정하고 테스트 메일을 발송합니다."
    : "저장된 날짜를 선택해 과거 Today's Talent 리포트를 조회합니다.";
  const content = isMailModal
    ? renderTrendingMailPanel({ hideTitle: true })
    : renderTrendingHistoryPanel({ hideTitle: true });
  const effectiveTitle = isMailModal ? "메일링 설정" : isSearchModal ? "관심 분야 설정" : isProfileModal ? "Today’s Talent 프로필 수정" : "리포트 보관함";
  const effectiveDescription = isMailModal
    ? "발송 시간과 복수 수신처를 설정하고 테스트 메일을 발송합니다."
    : isSearchModal
      ? "매일 Today's Talent에서 검색해야 하는 관심 분야를 자연어 프롬프트로 관리합니다."
      : isProfileModal
        ? "저장된 리포트의 인물 정보, 학력/경력, 성과, 선정 사유를 직접 수정합니다."
      : "저장된 날짜를 선택해 과거 Today's Talent 리포트를 조회합니다.";
  const effectiveContent = isSearchModal ? renderTrendingSearchPanel({ hideTitle: true }) : isProfileModal ? renderTrendingProfileEditPanel() : content;

  if (!effectiveContent) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-trending-modal-backdrop>
      <section class="trending-modal" role="dialog" aria-modal="true" aria-labelledby="trending-modal-title">
        <div class="trending-modal-header">
          <div>
            <strong id="trending-modal-title">${escapeHtml(effectiveTitle)}</strong>
            <span>${escapeHtml(effectiveDescription)}</span>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-trending-modal>닫기</button>
        </div>
        <div class="trending-modal-body">
          ${effectiveContent}
        </div>
      </section>
    </div>
  `;
}

function openTrendingModal(type) {
  if (["mail", "search"].includes(type) && !isAdmin()) {
    showToast("관리자만 메일링 설정을 변경할 수 있습니다.");
    return;
  }

  state.trendingModal = type === "mail" ? "mail" : type === "search" ? "search" : "history";
  renderTrendingPeople();

  if (type === "search") {
    fetchTrendingSearchSettings();
  }
}

function openTrendingProfileEditor(identifier) {
  if (!isAdmin()) {
    showToast("관리자만 Today's Talent 프로필을 수정할 수 있습니다.");
    return;
  }

  const person = findTrendingPerson(identifier);

  if (!person) {
    showToast("수정할 Today's Talent 프로필을 찾을 수 없습니다.");
    return;
  }

  state.trendingEditingPersonId = trendingPersonIdentifier(person);
  state.trendingProfileError = "";
  state.trendingModal = "profile";
  renderTrendingPeople();
}

function closeTrendingModal() {
  if (!state.trendingModal) {
    return;
  }

  state.trendingModal = "";
  state.trendingEditingPersonId = "";
  state.trendingProfileError = "";
  renderTrendingPeople();
}

function trendingPersonCard(person) {
  const education = (person.education || []).map(formatTrendingEducation).filter(Boolean);
  const career = (person.career || []).map(formatTrendingCareer).filter(Boolean);
  const achievements = Array.isArray(person.achievements) ? person.achievements : [];
  const reasons = Array.isArray(person.selectionReasons) ? person.selectionReasons : [];
  const rank = person.rank || "";
  const alreadyRegistered = getVisibleCandidates().some((candidate) =>
    candidate.name === person.name &&
    (!person.currentOrg || candidate.company === person.currentOrg)
  );

  return `
    <article class="trending-card">
      <div class="trending-rank-cell" aria-label="${escapeHtml(rank)}순위">
        <span class="trending-rank-marker">${escapeHtml(rank)}</span>
      </div>
      <div class="trending-profile">
        <div class="trending-card-header">
          <div class="trending-title-row">
            <div>
              <h4>${escapeHtml(person.name || "-")}</h4>
              <p>${escapeHtml([person.birthYear ? `${person.birthYear}년생` : "", person.currentOrg, person.currentTitle].filter(Boolean).join(" · "))}</p>
            </div>
          </div>
          <div class="trending-actions">
            ${person.linkedinUrl ? `<a class="soft-button compact-button trending-linkedin" href="${escapeHtml(person.linkedinUrl)}" target="_blank" rel="noreferrer">LinkedIn</a>` : ""}
            ${isAdmin() ? `<button class="ghost-button compact-button" type="button" data-edit-trending-person="${escapeHtml(trendingPersonIdentifier(person))}">프로필 수정</button>` : ""}
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
  const people = getDisplayTrendingPeople(report);
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
        ${isAdmin() ? `<button class="ghost-button" type="button" data-open-trending-modal="search">관심 분야 설정</button>` : ""}
        ${isAdmin() ? `<button class="ghost-button" type="button" data-open-trending-modal="mail">메일링 설정</button>` : ""}
        ${isAdmin() ? `<button class="primary-button" type="button" data-refresh-trending="force" ${state.trendingLoading ? "disabled" : ""}>현재 날짜 재생성</button>` : ""}
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
        </div>
      </div>
      <div class="match-score">
        <span>적합도 ${escapeHtml(candidate.matchGrade || aiSearchGradeFromScore(candidate.matchScore))}</span>
        <strong>${candidate.matchScore}%</strong>
      </div>
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
      <button class="${candidate.recommended ? "primary-button" : "ghost-button"}" type="button" data-toggle-recommend-candidate="${escapeHtml(candidate.id)}">${candidate.recommended ? "추천됨" : "추천"}</button>
      ${canManageProfile ? `
        <button class="ghost-button" type="button" data-start-edit>정보 수정</button>
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
  const titleLines = [
    formatDetailCareerLine(candidate),
    formatDetailEducationLine(candidate)
  ].filter(Boolean);
  const linkedin = normalizeExternalUrl(candidate.linkedinUrl);
  const birthAge = formatBirthAge(candidate);

  return `
    <section class="detail-hero-card">
      <div class="detail-hero-photo">
        ${candidateVisual(candidate, "large")}
      </div>
      <div class="detail-hero-body">
        <div class="detail-hero-topline">
          <div>
            <div class="detail-name-row">
              <h3>${escapeHtml(candidate.name)}</h3>
              ${candidate.organization ? `<span class="detail-business-unit-chip">${escapeHtml(candidate.organization)}</span>` : ""}
            </div>
            ${birthAge ? `<p class="detail-birth-line">${escapeHtml(birthAge)}</p>` : ""}
            <div class="detail-hero-lines">
              ${titleLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}
            </div>
          </div>
          <div class="detail-hero-side">
            <div class="detail-hero-actions">
              ${linkedin ? `<a class="icon-link-button" href="${escapeHtml(linkedin)}" target="_blank" rel="noreferrer" title="LinkedIn">in</a>` : ""}
              <button class="icon-link-button" type="button" data-download-profile-report="${escapeHtml(candidate.id)}" title="프로필 보고서 생성 및 다운로드" aria-label="프로필 보고서 생성 및 다운로드">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
                  <path d="M14 3v5h5"></path>
                  <path d="M8 13h8"></path>
                  <path d="M8 17h5"></path>
                </svg>
              </button>
              ${canManageCandidateProfile(candidate) ? `<button class="icon-link-button" type="button" data-start-edit title="정보 수정">✎</button>` : ""}
            </div>
            ${renderDetailStatusControl(candidate)}
          </div>
        </div>
        <div class="detail-hero-footer">
          <span>Pool 등록자 : ${escapeHtml(candidate.owner || "-")}</span>
          <span>최초 등록일 : ${escapeHtml(candidate.createdAt || "-")}</span>
          <span>최종 수정일 : ${escapeHtml(candidate.updatedAt || "-")}</span>
        </div>
      </div>
    </section>
  `;
}

function compactText(value, limit = 24) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  const chars = Array.from(text);
  return chars.length > limit ? `${chars.slice(0, limit).join("")}` : text;
}

function safeDownloadName(value, fallback = "document") {
  return String(value || fallback)
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80) || fallback;
}

function collectProfileReportAchievementSources(candidate) {
  const careerAchievements = (candidate.career || [])
    .flatMap((item) => splitNonEmptyLines(item.achievements).map((line) => ({
      title: compactText(line.replace(/^[-•\s]+/, ""), 20),
      detail: `${[item.company, item.rank, item.position].filter(Boolean).join(", ")}: ${line}`
    })));
  const summaryAchievements = splitNonEmptyLines(candidate.summary)
    .map((line) => ({
      title: compactText(line.replace(/^[-•\s]+/, ""), 20),
      detail: line
    }));
  const fallback = [
    candidate.role ? {
      title: compactText(`${candidate.role} 전문성`, 20),
      detail: `${candidate.company || "최근 경력"}에서 ${candidate.role} 관련 전문성을 보유한 프로필입니다.`
    } : null,
    (candidate.skills || []).length ? {
      title: compactText(`${candidate.skills.slice(0, 2).join(", ")} 역량`, 20),
      detail: `${candidate.skills.slice(0, 6).join(", ")} 중심의 핵심 키워드가 확인됩니다.`
    } : null
  ].filter(Boolean);

  return [...careerAchievements, ...summaryAchievements, ...fallback]
    .filter((item) => item.title || item.detail)
    .slice(0, 2);
}

function collectProfileReportReferenceNotes(candidate) {
  const notes = [];
  const primaryEducation = getPrimaryEducation(candidate);
  const primaryCareer = getPrimaryCareer(candidate);

  if (candidate.recommended) {
    notes.push("채용담당자 추천 프로필");
  }

  if (primaryEducation?.school) {
    notes.push(compactText(`${primaryEducation.school} 학력 보유`, 20));
  }

  if (primaryCareer?.company) {
    notes.push(compactText(`${primaryCareer.company} 최근 경력`, 20));
  }

  if (candidate.linkedinUrl) {
    notes.push("LinkedIn 검증 가능");
  }

  if ((candidate.tags || []).length) {
    notes.push(compactText(candidate.tags.slice(0, 2).join(", "), 20));
  }

  return [...new Set(notes)].slice(0, 2);
}

function buildProfileReportHtml(candidate) {
  const generatedAt = getTimestampText();
  const educationLines = (candidate.education || []).map(formatEducationMainLine).filter(Boolean).slice(0, 3);
  const careerLines = (candidate.career || []).map(formatCareerMainLine).filter(Boolean).slice(0, 4);
  const achievements = [
    ...collectProfileReportAchievementSources(candidate),
    { title: "주요 성과 보완 필요", detail: "프로필 내 핵심 성과 정보가 제한적이어서 추가 확인이 필요합니다." },
    { title: "전문성 검토 필요", detail: "학력, 경력, 키워드 정보를 기반으로 세부 전문성을 추가 검증해야 합니다." }
  ].slice(0, 2);
  const references = [
    ...collectProfileReportReferenceNotes(candidate),
    "추가 참고사항 확인 필요",
    "수상/언론 이력 확인 필요"
  ].slice(0, 2);
  const keywords = [
    candidate.role,
    ...(candidate.skills || []),
    ...(candidate.tags || [])
  ].filter(Boolean).slice(0, 8);
  const achievementItems = [
    ...achievements,
    { title: "주요 성과 보완 필요", detail: "프로필 내 핵심 성과 정보가 제한적이어서 추가 확인이 필요합니다." },
    { title: "전문성 검토 필요", detail: "학력, 경력, 키워드 정보를 기반으로 세부 전문성을 추가 검증해야 합니다." }
  ].slice(0, 2);
  const referenceItems = [
    ...references,
    "추가 참고사항 확인 필요",
    "수상/언론 이력 확인 필요"
  ].slice(0, 2);

  return [
    "<!doctype html>",
    "<html>",
    "<head>",
    "<meta charset=\"utf-8\" />",
    `<title>${escapeHtml(candidate.name)} 프로필 보고서</title>`,
    "<style>",
    "@page { size: A4; margin: 15mm 15mm 14mm; }",
    "body { font-family: 'Malgun Gothic', Arial, sans-serif; color: #111827; font-size: 10pt; line-height: 1.45; }",
    "h1 { margin: 0; font-size: 20pt; }",
    "h2 { margin: 14px 0 7px; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; font-size: 12pt; }",
    "p { margin: 0 0 6px; }",
    ".top { display: flex; justify-content: space-between; gap: 18px; border-bottom: 2px solid #111827; padding-bottom: 10px; }",
    ".meta { color: #6b7280; font-size: 8.5pt; }",
    ".summary { display: grid; grid-template-columns: 74px 1fr; gap: 4px 10px; margin-top: 12px; }",
    ".summary b { color: #374151; }",
    ".section { margin-top: 12px; }",
    ".achievement { margin: 0 0 9px; padding: 8px 10px; border-left: 4px solid #3182f6; background: #f8fafc; }",
    ".achievement strong { display: block; margin-bottom: 3px; font-size: 10.5pt; }",
    ".notes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }",
    ".note { padding: 8px 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 700; }",
    ".keywords { margin-top: 8px; color: #374151; font-size: 9pt; }",
    "ul { margin: 0; padding-left: 18px; }",
    "li { margin: 0 0 3px; }",
    "</style>",
    "</head>",
    "<body>",
    "<div class=\"top\">",
    `<div><p class=\"meta\">Executive Profile Report</p><h1>${escapeHtml(candidate.name)}</h1></div>`,
    `<div class=\"meta\">생성시각 ${escapeHtml(generatedAt)}<br/>Pool 등록자 ${escapeHtml(candidate.owner || "-")}</div>`,
    "</div>",
    "<div class=\"summary\">",
    `<b>이름</b><span>${escapeHtml([candidate.name, candidate.englishName].filter(Boolean).join(" / ") || "-")}</span>`,
    `<b>출생/나이</b><span>${escapeHtml(formatBirthAge(candidate))}</span>`,
    `<b>학력</b><span>${educationLines.length ? `<ul>${educationLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>` : "-"}</span>`,
    `<b>경력</b><span>${careerLines.length ? `<ul>${careerLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>` : "-"}</span>`,
    "</div>",
    `<p class=\"keywords\"><b>핵심 키워드</b> ${escapeHtml(keywords.join(", ") || "-")}</p>`,
    "<div class=\"section\">",
    "<h2>핵심 성과/실적</h2>",
    (achievements.length ? achievements : [{ title: "주요 성과 확인 필요", detail: "프로필 내 주요성과/실적 정보를 추가 확인해야 합니다." }])
      .slice(0, 2)
      .map((item) => `<div class=\"achievement\"><strong>${escapeHtml(item.title || "핵심 성과")}</strong><p>${escapeHtml(item.detail || "-")}</p></div>`)
      .join(""),
    "</div>",
    "<div class=\"section\">",
    "<h2>참고사항</h2>",
    `<div class=\"notes\">${(references.length ? references : ["추가 참고사항 확인 필요", "수상/언론 이력 확인 필요"]).slice(0, 2).map((note) => `<div class=\"note\">${escapeHtml(compactText(note, 24))}</div>`).join("")}</div>`,
    "</div>",
    "</body>",
    "</html>"
  ].join("");
}

function downloadProfileReport(candidateId = state.selectedCandidateId) {
  const candidate = findCandidate(candidateId);

  if (!candidate) {
    showToast("프로필 보고서를 생성할 후보자를 찾지 못했습니다.");
    return;
  }

  const html = buildProfileReportHtml(candidate);
  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeDownloadName(candidate.name, "profile")}_프로필_보고서.doc`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  addAuditLog("프로필 보고서 다운로드", candidate.name, "C-level 보고용 Word 문서");
}

function formatDetailCareerLine(candidate) {
  const career = getPrimaryCareer(candidate);

  if (!career) {
    return "";
  }

  return formatCareerMainLine(career);
}

function formatDetailEducationLine(candidate) {
  const education = getPrimaryEducation(candidate);

  if (!education) {
    return "";
  }

  return formatEducationMainLine(education);
}

function uniqueTextParts(parts) {
  const seen = new Set();

  return parts
    .map((part) => String(part || "").trim())
    .filter((part) => {
      if (!part || seen.has(part)) {
        return false;
      }

      seen.add(part);
      return true;
    });
}

function formatHeaderPeriod(start, end) {
  return formatDisplayPeriod(start, end);
}

function formatHeaderPeriodPart(value) {
  return formatDisplayPeriodPart(value).replace(/^'/, "");
}

function renderDetailStatusControl(candidate) {
  if (!canManageCandidateProfile(candidate)) {
    return `<div class="detail-status-readonly"><strong>${escapeHtml(STATUS_LABELS[candidate.status] || "-")}</strong></div>`;
  }

  return `
    <label class="detail-status-control">
      <select class="control-select compact-select detail-status-select status-${escapeHtml(candidate.status)}" data-detail-status-select>
        ${STATUS_ORDER.map((status) => `<option value="${status}" ${candidate.status === status ? "selected" : ""}>${escapeHtml(STATUS_LABELS[status])}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderDetailTabStrip() {
  const tabs = [
    ["profile", "주요 프로필"],
    ["interviews", "면담 기록"],
    ["applications", "채용진행"]
  ];

  return `
    <nav class="detail-tab-strip" aria-label="상세 프로필 섹션">
      ${tabs.map(([tab, label]) => `<button class="${state.detailTab === tab ? "is-active" : ""}" type="button" data-detail-tab="${tab}">${escapeHtml(label)}</button>`).join("")}
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
  const memos = [...(candidate.memos || [])].sort((a, b) =>
    dateSortValue(b.updatedAt || b.createdAt) - dateSortValue(a.updatedAt || a.createdAt) ||
    String(b.id).localeCompare(String(a.id))
  );
  const canManage = canManageCandidateProfile(candidate);
  const editingMemo = memos.find((memo) => memo.id === state.editingMemoId) || null;
  const showForm = canManage && (state.editingMemoId === "new" || editingMemo);

  return `
    <section class="detail-side-card">
      <div class="detail-side-card-header">
        <strong>메모</strong>
        ${canManage ? `<button class="icon-mini-button" type="button" data-new-memo title="메모 추가">＋</button>` : ""}
      </div>
      ${showForm ? renderMemoForm(editingMemo) : ""}
      ${memos.length ? `
        <div class="memo-list">
          ${memos.map((memo) => renderMemoCard(memo, canManage)).join("")}
        </div>
      ` : `<p class="side-note">등록된 메모가 없습니다.</p>`}
    </section>
  `;
}

function renderMemoForm(memo = null) {
  const isEdit = Boolean(memo?.id);

  return `
    <form class="memo-form" id="memo-form">
      <input type="hidden" name="memoId" value="${inputValue(memo?.id || "")}" />
      <textarea class="control-textarea compact-textarea" name="memoContent" placeholder="메모 내용을 입력">${inputValue(memo?.content || "")}</textarea>
      <div class="memo-form-actions">
        <button class="ghost-button compact-button" type="button" data-cancel-memo-edit>취소</button>
        <button class="primary-button compact-button" type="submit">${isEdit ? "수정 저장" : "추가"}</button>
      </div>
    </form>
  `;
}

function renderMemoCard(memo, canManage) {
  return `
    <article class="memo-card">
      <p>${escapeHtml(memo.content)}</p>
      <div class="memo-meta">
        <span>${escapeHtml(memo.actor || "-")}</span>
        <span>${escapeHtml(memo.updatedAt || memo.createdAt || "-")}</span>
      </div>
      ${canManage ? `
        <div class="memo-actions">
          <button class="ghost-button compact-button" type="button" data-edit-memo="${escapeHtml(memo.id)}">수정</button>
          <button class="ghost-button danger-button compact-button" type="button" data-delete-memo="${escapeHtml(memo.id)}">삭제</button>
        </div>
      ` : ""}
    </article>
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
    : `<span class="muted">등록된 키워드가 없습니다.</span>`;

  return `
    <div class="bar-list">
      <div class="tag-row competency-tags">${tags}</div>
    </div>
  `;
}

function renderCorePerformanceSection(candidate) {
  const core = String(candidate.role || "").trim();
  const achievements = String(candidate.summary || "").trim();

  return `
    <div class="detail-core-performance">
      <div class="detail-text-block">
        <span>핵심 역량</span>
        ${core
          ? `<p class="detail-summary">${escapeHtml(core)}</p>`
          : `<p class="muted">입력된 핵심 역량이 없습니다.</p>`}
      </div>
      <div class="detail-text-block">
        <span>주요성과/실적</span>
        ${achievements
          ? `<p class="detail-summary">${escapeHtml(achievements)}</p>`
          : `<p class="muted">입력된 주요성과/실적이 없습니다.</p>`}
      </div>
    </div>
  `;
}

function renderResumeAttachmentSection(candidate) {
  const canManage = canManageCandidateProfile(candidate);
  const attachments = [
    ...(Array.isArray(candidate.resumeAttachments) ? candidate.resumeAttachments.map((attachment, index) => ({ attachment, kind: "resumeArchive", index, label: "이력서" })) : []),
    ...(candidate.resumeAttachment?.dataUrl ? [{ attachment: candidate.resumeAttachment, kind: "resume", index: 0, label: "이력서" }] : []),
    ...(Array.isArray(candidate.attachments) ? candidate.attachments.map((attachment, index) => ({ attachment, kind: "other", index, label: "기타 첨부파일" })) : [])
  ].filter((item) => item.attachment?.dataUrl);

  if (!attachments.length) {
    return `<div class="empty-state compact-empty">등록된 첨부 파일이 없습니다.</div>`;
  }

  return `
    <div class="attachment-list">
      ${attachments.map(({ attachment, kind, index, label }) => `
        <div class="attachment-row">
          <div>
            <span class="muted">${escapeHtml(label)}</span>
            <strong>${escapeHtml(attachment.name || `${candidate.name}_resume`)}</strong>
            <small>${escapeHtml(formatFileSize(attachment.size))}${attachment.uploadedAt ? ` · ${escapeHtml(attachment.uploadedAt)}` : ""}</small>
          </div>
          <div class="member-actions">
            <a class="soft-button compact-button" href="${escapeHtml(attachment.dataUrl)}" download="${escapeHtml(attachment.name || `${candidate.name}_resume`)}">다운로드</a>
            ${canManage ? `<button class="ghost-button danger-button compact-button" type="button" data-remove-candidate-${kind === "other" ? `attachment="${index}"` : kind === "resumeArchive" ? `resume-archive="${index}"` : "resume"}>삭제</button>` : ""}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEditAttachmentRows(candidate) {
  const rows = [];

  if (candidate.resumeAttachment?.dataUrl) {
    rows.push(`
      <div class="attachment-row">
        <div>
          <span class="muted">이력서</span>
          <strong>${escapeHtml(candidate.resumeAttachment.name || "첨부 이력서")}</strong>
          <small>${escapeHtml(formatFileSize(candidate.resumeAttachment.size))}</small>
        </div>
        <div class="member-actions">
          <a class="soft-button compact-button" href="${escapeHtml(candidate.resumeAttachment.dataUrl)}" download="${escapeHtml(candidate.resumeAttachment.name || `${candidate.name}_resume`)}">다운로드</a>
          <button class="ghost-button danger-button compact-button" type="button" data-remove-candidate-resume>삭제</button>
        </div>
      </div>
    `);
  }

  (candidate.attachments || []).forEach((attachment, index) => {
    rows.push(`
      <div class="attachment-row">
        <div>
          <span class="muted">기타 첨부파일</span>
          <strong>${escapeHtml(attachment.name || `첨부파일 ${index + 1}`)}</strong>
          <small>${escapeHtml(formatFileSize(attachment.size))}</small>
        </div>
        <div class="member-actions">
          ${attachment.dataUrl ? `<a class="soft-button compact-button" href="${escapeHtml(attachment.dataUrl)}" download="${escapeHtml(attachment.name || `attachment-${index + 1}`)}">다운로드</a>` : ""}
          <button class="ghost-button danger-button compact-button" type="button" data-remove-candidate-attachment="${index}">삭제</button>
        </div>
      </div>
    `);
  });

  return rows.length
    ? `<div class="attachment-list edit-attachment-list">${rows.join("")}</div>`
    : `<span class="form-help">기존 첨부파일이 없습니다.</span>`;
}

async function removeCandidateStoredAttachment(kind, index = 0) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("첨부파일을 삭제할 권한이 없습니다.");
    return;
  }

  if (kind === "resume") {
    candidate.resumeAttachment = null;
  } else if (kind === "resumeArchive") {
    candidate.resumeAttachments = (candidate.resumeAttachments || []).filter((_, itemIndex) => itemIndex !== index);
  } else {
    candidate.attachments = (candidate.attachments || []).filter((_, itemIndex) => itemIndex !== index);
  }

  touchCandidate(candidate);
  addAuditLog("첨부파일 삭제", candidate.name, kind === "other" ? "기타 첨부파일" : "이력서");
  persistState();

  try {
    await upsertCandidateToSupabase(candidate);
  } catch (error) {
    console.warn("Candidate attachment remote delete failed.", error);
    showToast("화면에서는 삭제됐지만 원격 DB 저장 확인에 실패했습니다. 잠시 후 다시 저장해주세요.");
  }

  showToast("첨부파일을 삭제했습니다.");
  renderDetail();
}

function renderOverviewSection(candidate) {
  return detailInfoGrid([
    { label: "사업부", value: candidate.organization },
    { label: "공개 범위", value: getCandidateVisibilityLabel(candidate.visibility) },
    { label: "출생년도", value: candidate.birthYear },
    { label: "나이", value: candidate.age ? `${candidate.age}세` : "" },
    { label: "국적", value: candidate.nationality },
    { label: "이메일 주소", value: candidate.email },
    { label: "휴대폰 번호", value: candidate.phone },
    { label: "링크드인 주소", html: detailLink(candidate.linkedinUrl) },
    { label: "기타 참고 URL 1", html: detailLink(candidate.referenceUrl) },
    { label: "기타 참고 URL 2", html: detailLink(candidate.referenceUrl2) },
    { label: "기타 참고 URL 3", html: detailLink(candidate.referenceUrl3) }
  ]);
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

function renderInterviewSection(candidate) {
  const interviews = [...(candidate.interviews || [])].sort((a, b) =>
    dateSortValue(b.date) - dateSortValue(a.date) ||
    String(b.id).localeCompare(String(a.id))
  );
  const canManage = canManageCandidateProfile(candidate);
  const editingRecord = interviews.find((record) => record.id === state.editingInterviewId) || null;
  const showForm = canManage && (state.editingInterviewId === "new" || editingRecord);

  return `
    <div class="interview-section">
      <div class="interview-toolbar">
        <div>
          <strong>면담 내용</strong>
          <span>${interviews.length}건 등록</span>
        </div>
        ${canManage ? `<button class="soft-button" type="button" data-new-interview>면담 내용 신규등록</button>` : ""}
      </div>
      ${showForm ? renderInterviewForm(editingRecord) : ""}
      ${interviews.length ? `
        <div class="interview-list">
          ${interviews.map((record) => renderInterviewRecordCard(record, canManage)).join("")}
        </div>
      ` : `<div class="empty-state">등록된 면담 기록이 없습니다.</div>`}
    </div>
  `;
}

function renderInterviewForm(record = null) {
  const isEdit = Boolean(record?.id);

  return `
    <form class="interview-form" id="interview-form">
      <input type="hidden" name="interviewId" value="${inputValue(record?.id || "")}" />
      <div class="field-grid">
        <div class="field">
          <label for="interview-date">면담일</label>
          <input class="control-input" id="interview-date" name="interviewDate" type="date" value="${inputValue(record?.date || getTodayDate())}" />
        </div>
        <div class="field">
          <label for="interview-interviewer">면담자</label>
          <input class="control-input" id="interview-interviewer" name="interviewInterviewer" value="${inputValue(record?.interviewer || getCurrentActorName())}" />
        </div>
        <div class="field full">
          <label for="interview-method">면담 방식/주제</label>
          <input class="control-input" id="interview-method" name="interviewMethod" value="${inputValue(record?.method || "")}" placeholder="예: 전화 면담, 커피챗, 포지션 소개" />
        </div>
        <div class="field full">
          <label for="interview-content">면담 내용</label>
          <textarea class="control-textarea" id="interview-content" name="interviewContent" placeholder="면담 주요 내용, 후보자 관심사, 검토 포인트 등을 입력">${inputValue(record?.content || "")}</textarea>
        </div>
        <div class="field full">
          <label for="interview-next-action">후속 조치</label>
          <textarea class="control-textarea compact-textarea" id="interview-next-action" name="interviewNextAction" placeholder="예: JD 공유, 현업 리뷰 요청, 재접촉 예정">${inputValue(record?.nextAction || "")}</textarea>
        </div>
      </div>
      <div class="interview-form-actions">
        <button class="ghost-button" type="button" data-cancel-interview-edit>취소</button>
        <button class="primary-button" type="submit">${isEdit ? "수정 저장" : "신규 등록"}</button>
      </div>
    </form>
  `;
}

function renderInterviewRecordCard(record, canManage) {
  return `
    <article class="interview-card">
      <div class="interview-card-header">
        <div>
          <strong>${escapeHtml(record.method || "면담 기록")}</strong>
          <span>${escapeHtml([record.date, record.interviewer].filter(Boolean).join(" · "))}</span>
        </div>
        ${canManage ? `
          <div class="interview-card-actions">
            <button class="ghost-button compact-button" type="button" data-edit-interview="${escapeHtml(record.id)}">수정</button>
            <button class="ghost-button danger-button compact-button" type="button" data-delete-interview="${escapeHtml(record.id)}">삭제</button>
          </div>
        ` : ""}
      </div>
      <p>${escapeHtml(record.content)}</p>
      ${record.nextAction ? `<div class="interview-next-action"><span>후속 조치</span><p>${escapeHtml(record.nextAction)}</p></div>` : ""}
    </article>
  `;
}

function renderFullDetailContent(candidate) {
  if (!["profile", "interviews", "applications"].includes(state.detailTab)) {
    state.detailTab = "profile";
  }

  if (state.detailTab === "interviews") {
    return `
      <div class="detail-section-stack">
        ${detailSection("면담 기록", renderInterviewSection(candidate), "", "detail-interview-section")}
      </div>
    `;
  }

  if (state.detailTab === "applications") {
    return `
      <div class="detail-section-stack">
        ${detailSection("채용진행", renderApplicationsSection(candidate), "", "detail-application-section")}
      </div>
    `;
  }

  return `
    <div class="detail-section-stack">
      ${detailSection("경력사항", renderCareerTab(candidate), "", "detail-profile-section")}
      ${detailSection("학력사항", renderEducationTab(candidate))}
      ${detailSection("인적사항", renderOverviewSection(candidate))}
      ${detailSection("핵심 역량 / 주요성과·실적", renderCorePerformanceSection(candidate), "is-primary", "detail-core-performance-section")}
      ${detailSection("키워드", renderCompetencySection(candidate), "", "detail-competency-section")}
      ${detailSection("첨부파일", renderResumeAttachmentSection(candidate))}
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
            <strong>${escapeHtml(formatEducationMainLine(item))}</strong>
          </div>
          ${item.affiliation ? `<div class="record-subline"><span>${escapeHtml(item.affiliation)}</span></div>` : ""}
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
            <strong>${escapeHtml(formatCareerMainLine(item))}</strong>
          </div>
          ${item.country ? `<div class="record-subline"><span>${escapeHtml(item.country)}</span></div>` : ""}
          ${item.achievements ? `<div class="achievement-box">
            <span>주요성과/실적</span>
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
  const education = candidate.education?.length ? candidate.education : [{ degree: "", school: "", major: "", affiliation: "", start: "", end: "" }];
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
            <label for="edit-photo">프로필 사진</label>
            <div class="dropzone profile-upload compact-upload">
              <input type="hidden" id="edit-photo-remove" name="editPhotoRemove" value="0" />
              <input id="edit-photo" name="editPhoto" type="file" accept="image/*" />
              <div id="edit-photo-preview" class="photo-preview">
                ${candidate.photoUrl ? `<img src="${escapeHtml(candidate.photoUrl)}" alt="${escapeHtml(candidate.name)} 프로필 사진 미리보기" />` : "사진 미리보기"}
              </div>
              <span>새 사진을 선택하면 저장 후 상세 프로필에 반영됩니다.</span>
              ${candidate.photoUrl ? `<button class="ghost-button danger-button compact-button" type="button" data-clear-edit-photo>사진 삭제</button>` : ""}
            </div>
          </div>
          <div class="field">
            <label for="edit-resume-file">이력서</label>
            <div class="dropzone compact-upload">
              <input id="edit-resume-file" name="editResume" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx" />
              <span id="edit-resume-parse-status" class="form-help">이력서를 업로드하면 읽을 수 있는 정보만 아래 입력란에 자동 입력됩니다.</span>
              <button class="ghost-button compact-button" type="button" data-clear-edit-resume-upload>선택 취소</button>
            </div>
          </div>
          <div class="field">
            <label for="edit-name">이름</label>
            <input class="control-input" id="edit-name" name="editName" value="${inputValue(candidate.name)}" />
          </div>
          <div class="field">
            <label for="edit-english-name">이름(영문)</label>
            <input class="control-input" id="edit-english-name" name="editEnglishName" value="${inputValue(candidate.englishName)}" />
          </div>
          <div class="field">
            <label for="edit-role">핵심 역량</label>
            <textarea class="control-textarea compact-textarea" id="edit-role" name="editRole" rows="4">${inputValue(candidate.role)}</textarea>
          </div>
          <div class="field">
            <label for="edit-summary">주요성과/실적</label>
            <textarea class="control-textarea compact-textarea" id="edit-summary" name="editSummary" rows="4">${inputValue(candidate.summary)}</textarea>
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
          </div>
          <div class="field">
            <label for="edit-owner">담당자</label>
            <select class="control-select" id="edit-owner" name="editOwner">
              ${renderOwnerOptions(candidate.owner, { includePlaceholder: true })}
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
            <label for="edit-nationality">국적</label>
            <input class="control-input" id="edit-nationality" name="editNationality" value="${inputValue(candidate.nationality)}" />
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
            <label for="edit-reference-url">기타 참고 URL 1</label>
            <input class="control-input" id="edit-reference-url" name="editReferenceUrl" type="url" value="${inputValue(candidate.referenceUrl)}" />
          </div>
          <div class="field">
            <label for="edit-reference-url-2">기타 참고 URL 2</label>
            <input class="control-input" id="edit-reference-url-2" name="editReferenceUrl2" type="url" value="${inputValue(candidate.referenceUrl2)}" />
          </div>
          <div class="field">
            <label for="edit-reference-url-3">기타 참고 URL 3</label>
            <input class="control-input" id="edit-reference-url-3" name="editReferenceUrl3" type="url" value="${inputValue(candidate.referenceUrl3)}" />
          </div>
        </div>
      </section>

      <section class="edit-section">
        <div class="edit-section-header">
          <h5>학력 정보</h5>
          <button class="soft-button" type="button" data-add-education>학력 추가</button>
        </div>
        <div class="edit-record-list" id="edit-education-list">
          ${education.map((item, index) => renderEducationEditRecord(item, index)).join("")}
        </div>
      </section>

      <section class="edit-section">
        <div class="edit-section-header">
          <h5>경력 정보</h5>
          <button class="soft-button" type="button" data-add-career>경력 추가</button>
        </div>
        <div class="edit-record-list" id="edit-career-list">
          ${career.map((item, index) => renderCareerEditRecord(item, index)).join("")}
        </div>
      </section>

      <section class="edit-section">
        <div class="edit-section-header">
          <h5>키워드</h5>
        </div>
        <div class="field">
          <label for="edit-skills">키워드</label>
          <textarea class="control-textarea compact-textarea" id="edit-skills" name="editSkills" rows="3">${inputValue(candidate.skills.join("\n"))}</textarea>
          <span class="form-help">기술, 도메인, 툴, 핵심 키워드를 줄바꿈 또는 쉼표로 입력합니다.</span>
        </div>
      </section>

      <section class="edit-section">
        <div class="edit-section-header">
          <h5>기타 첨부파일</h5>
        </div>
        <div class="field">
          <label for="edit-other-attachments">개인정보동의서, 포트폴리오 등</label>
          <div class="dropzone compact-upload">
            <input id="edit-other-attachments" name="editOtherAttachments" type="file" multiple accept=".txt,.md,.csv,.pdf,.doc,.docx,.hwp,.hwpx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png" />
            <span class="form-help">새로 선택한 파일은 기존 첨부파일에 추가됩니다. 기존 첨부 ${candidate.attachments?.length || 0}개</span>
            <button class="ghost-button compact-button" type="button" data-clear-edit-other-attachments>선택 취소</button>
          </div>
          ${renderEditAttachmentRows(candidate)}
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
          <label for="education-affiliation-${index}">소속</label>
          <input class="control-input" id="education-affiliation-${index}" name="education-affiliation-${index}" value="${inputValue(item.affiliation)}" />
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
          <label for="career-rank-${index}">직급/직책</label>
          <input class="control-input" id="career-rank-${index}" name="career-rank-${index}" value="${inputValue(item.rank)}" />
        </div>
        <div class="field">
          <label for="career-position-${index}">소속부서</label>
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
          <label for="career-achievements-${index}">주요성과/실적</label>
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
      affiliation: (formData.get(`education-affiliation-${index}`) || "").toString().trim(),
      start: (formData.get(`education-start-${index}`) || "").toString(),
      end: (formData.get(`education-end-${index}`) || "").toString()
    }));

  return preserveBlank ? records : records.filter((item) => item.degree || item.school || item.major || item.affiliation || item.start || item.end);
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

  education.forEach((item, index) => {
    if ((item.start && !isMonthValue(item.start)) || (item.end && !isMonthValue(item.end))) {
      errors.push(`학력 ${index + 1}의 기간은 년/월 형식으로 입력해주세요.`);
    }
  });

  career.forEach((item, index) => {
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
  const resumeFile = formData.get("editResume");
  const shouldRemovePhoto = formData.get("editPhotoRemove") === "1";
  const otherAttachmentFiles = formData.getAll("editOtherAttachments").filter((file) => file && file.size);
  const skills = getFormText(form, "editSkills")
    .split(/[,;\n]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);
  const name = getFormText(form, "editName") || "이름 미입력";
  const education = collectEducationFromForm(form, options.preserveBlankRecords);
  const career = collectCareerFromForm(form, options.preserveBlankRecords);
  const company = career.find(hasAnyRecordValue)?.company || "";

  candidate.name = name;
  candidate.initials = `${name.slice(0, 1)}${name.slice(-1)}`;
  candidate.company = company;
  candidate.englishName = getFormText(form, "editEnglishName");
  candidate.role = getFormText(form, "editRole");
  candidate.summary = getFormText(form, "editSummary");
  candidate.organization = normalizeBusinessUnit(getFormText(form, "editOrganization")) || candidate.organization;
  candidate.visibility = normalizeCandidateVisibility(getFormText(form, "editVisibility"));
  candidate.owner = normalizeOwnerSelection(getFormText(form, "editOwner")) || candidate.owner;
  candidate.birthYear = getFormText(form, "editBirthYear");
  candidate.age = calculateAge(candidate.birthYear);
  candidate.nationality = getFormText(form, "editNationality");
  candidate.email = getFormText(form, "editEmail");
  candidate.phone = getFormText(form, "editPhone");
  candidate.linkedinUrl = getFormText(form, "editLinkedinUrl");
  candidate.referenceUrl = getFormText(form, "editReferenceUrl");
  candidate.referenceUrl2 = getFormText(form, "editReferenceUrl2");
  candidate.referenceUrl3 = getFormText(form, "editReferenceUrl3");
  candidate.skills = skills;
  candidate.education = education;
  candidate.career = career;
  candidate.years = estimateCareerYears(candidate.career);
  touchCandidate(candidate);

  if (shouldRemovePhoto) {
    candidate.photoUrl = "";
  }

  if (photoFile && photoFile.size) {
    try {
      candidate.photoUrl = await readProfilePhotoAsDataUrl(photoFile);
    } catch (error) {
      console.warn("Profile photo could not be read.", error);
      showToast("사진 파일을 읽지 못했습니다. 다른 파일을 선택해주세요.");
      return false;
    }
  } else if (!shouldRemovePhoto && state.editExtractedPhotoUrl) {
    candidate.photoUrl = state.editExtractedPhotoUrl;
  }

  if (resumeFile && resumeFile.size) {
    try {
      candidate.resumeAttachment = {
        name: resumeFile.name,
        type: resumeFile.type || "application/octet-stream",
        size: resumeFile.size,
        uploadedAt: new Date().toISOString().slice(0, 10),
        dataUrl: await readFileAsDataUrl(resumeFile)
      };
    } catch (error) {
      console.warn("Resume attachment could not be read.", error);
      showToast("이력서 첨부 파일을 저장하지 못했습니다. 다른 파일을 선택해주세요.");
      return false;
    }
  }

  if (otherAttachmentFiles.length) {
    try {
      const newAttachments = (await Promise.all(otherAttachmentFiles.map(attachmentFromFile))).filter(Boolean);
      candidate.attachments = [...(candidate.attachments || []), ...newAttachments];
    } catch (error) {
      console.warn("Additional attachments could not be read.", error);
      showToast("기타 첨부파일을 저장하지 못했습니다. 파일을 확인해주세요.");
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
    try {
      await upsertCandidateToSupabase(candidate);
    } catch (error) {
      console.warn("Candidate remote save failed.", error);
      showToast("화면에는 저장됐지만 원격 DB 저장 확인에 실패했습니다. 잠시 후 다시 동기화됩니다.");
    }
    showToast(`${candidate.name} 후보자 정보가 저장되었습니다.`);
  }

  if (!options.keepEditing) {
    state.isEditingCandidate = false;
    state.editSnapshot = null;
    state.editExtractedPhotoUrl = "";
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
  candidate.education.push({ degree: "", school: "", major: "", affiliation: "", start: "", end: "" });
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
    candidate.education.push({ degree: "", school: "", major: "", affiliation: "", start: "", end: "" });
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
    applicant: "chip-gray",
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
  const menus = getOrderedMenuConfig();

  return `
    <div class="table-wrap">
      <table class="permission-table">
        <thead>
          <tr>
            <th>회원등급</th>
            ${menus.map((menu) => `<th>${escapeHtml(menu.label)}</th>`).join("")}
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
              ${menus.map((menu) => {
                const checked = getAllowedViewsForRole(role).includes(menu.view);
                const locked = role === "admin";

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
    applicant: "지원자 전용 접수 및 진행 현황 확인 계정",
    general: "기본 조회 중심의 일반 사용자 계정",
    search_firm: "외부 서치펌 후보자 발굴과 등록 계정",
    hiring_manager: "현업 검토와 후보자 탐색 중심 계정",
    business_recruiter: "사업부 단위 후보자 등록과 운영 계정",
    division_recruiter: "부문 단위 채용 운영 계정",
    admin: "회원 승인과 권한 설정까지 가능한 관리자"
  }[role] || "";
}

function renderManagementTabsLegacy() {
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

function renderMembersLegacy() {
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

function getAvailableManagementTabs(member = getCurrentMember()) {
  const tabs = [];

  if (isAdmin(member)) {
    tabs.push({ id: "members", label: "회원 관리" });
    tabs.push({ id: "menu-order", label: "메뉴 순서" });
  }

  if (canCreateMemberAccounts(member)) {
    tabs.push({ id: "create", label: "계정 생성" });
  }

  if (isAdmin(member)) {
    tabs.push({ id: "logs", label: "Log 관리" });
  }

  return tabs;
}

function renderManagementTabs() {
  const tabs = getAvailableManagementTabs();

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

function renderMemberCreatePanel() {
  const currentMember = getCurrentMember();
  const roleOptions = getCreatableMemberRoles(currentMember);
  const selectedRole = roleOptions[0] || "";
  const showBusinessUnit = memberRoleNeedsBusinessUnit(selectedRole);
  const selectedBusinessUnit = isAdmin(currentMember) ? "" : currentMember?.businessUnit || "";

  return `
    <section class="content-panel span-12">
      <div class="panel-header">
        <h4>계정 생성</h4>
        <span class="small-pill">생성 즉시 활성화</span>
      </div>
      <form id="member-create-form" class="member-create-form">
        <div class="form-error" id="member-create-error" hidden></div>
        <div class="form-grid">
          <label>
            이름
            <input class="control-input" name="name" type="text" autocomplete="name" />
          </label>
          <label>
            이메일
            <input class="control-input" name="email" type="email" autocomplete="email" />
          </label>
          <label>
            비밀번호
            <input class="control-input" name="password" type="password" autocomplete="new-password" />
          </label>
          <label>
            비밀번호 확인
            <input class="control-input" name="passwordConfirm" type="password" autocomplete="new-password" />
          </label>
          <label>
            권한
            <select class="control-select" name="role" data-member-create-role>
              ${roleOptions.map((role) => `<option value="${role}">${escapeHtml(MEMBER_ROLES[role])}</option>`).join("")}
            </select>
          </label>
          <label data-member-create-business-unit-field class="${showBusinessUnit ? "" : "is-hidden"}">
            사업부
            <select class="control-select" name="businessUnit" data-member-create-business-unit ${showBusinessUnit ? "" : "disabled"}>
              ${renderBusinessUnitOptions(selectedBusinessUnit)}
            </select>
          </label>
          <label>
            부서
            <input class="control-input" name="department" type="text" />
          </label>
          <label>
            직급/직책
            <input class="control-input" name="position" type="text" />
          </label>
          <label>
            휴대폰 번호
            <input class="control-input" name="phone" type="tel" />
          </label>
          <label>
            기타 사항
            <input class="control-input" name="note" type="text" />
          </label>
        </div>
        <div class="member-create-actions">
          <button class="primary-button" type="submit">계정 생성</button>
        </div>
      </form>
    </section>
  `;
}

function renderMenuOrderPanel() {
  const orderedMenus = getOrderedMenuConfig();

  return `
    <section class="content-panel span-12">
      <div class="panel-header">
        <h4>좌측 메뉴 순서</h4>
        <span class="small-pill">관리자 전용</span>
      </div>
      <div class="menu-order-panel">
        <p class="section-note">저장된 순서와 메뉴명은 모든 회원의 좌측 메뉴에 적용됩니다. 권한이 없는 메뉴는 기존처럼 숨겨집니다.</p>
        <div class="menu-order-list">
          ${orderedMenus.map((menu, index) => `
            <div class="menu-order-row">
              <div class="menu-order-rank">${index + 1}</div>
              <div class="menu-order-info">
                <label class="menu-order-name-field">
                  <span>메뉴명</span>
                  <input class="control-input" type="text" value="${inputValue(menu.label)}" data-menu-label-input="${escapeHtml(menu.view)}" />
                </label>
                <span>기본명: ${escapeHtml(menu.defaultLabel)} · ${escapeHtml(menu.description)}</span>
              </div>
              <div class="menu-order-actions">
                <button class="ghost-button compact-button" type="button" data-move-menu-order="${escapeHtml(menu.view)}" data-menu-order-direction="up" ${index === 0 ? "disabled" : ""}>위로</button>
                <button class="ghost-button compact-button" type="button" data-move-menu-order="${escapeHtml(menu.view)}" data-menu-order-direction="down" ${index === orderedMenus.length - 1 ? "disabled" : ""}>아래로</button>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="menu-order-footer">
          <button class="primary-button" type="button" data-save-menu-settings>저장</button>
          <button class="ghost-button" type="button" data-reset-menu-labels>기본 메뉴명 복원</button>
          <button class="ghost-button" type="button" data-reset-menu-order>기본 순서 복원</button>
        </div>
      </div>
    </section>
  `;
}

function renderMembers() {
  const content = $("#members-content");

  if (!content) {
    return;
  }

  if (!canAccessView("members")) {
    content.innerHTML = `<div class="empty-state">Management 메뉴 접근 권한이 없습니다.</div>`;
    return;
  }

  const tabs = getAvailableManagementTabs();
  const availableTabIds = tabs.map((tab) => tab.id);

  if (!availableTabIds.includes(state.managementTab)) {
    state.managementTab = availableTabIds[0] || "create";
  }

  const renderedTabs = renderManagementTabs();

  if (state.managementTab === "create") {
    content.innerHTML = `
      ${renderedTabs}
      <div class="dashboard-grid member-dashboard">
        ${renderMemberCreatePanel()}
      </div>
    `;
    return;
  }

  if (state.managementTab === "menu-order" && isAdmin()) {
    content.innerHTML = `
      ${renderedTabs}
      <div class="dashboard-grid member-dashboard">
        ${renderMenuOrderPanel()}
      </div>
    `;
    return;
  }

  if (state.managementTab === "logs" && isAdmin()) {
    content.innerHTML = `
      ${renderedTabs}
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

  if (!isAdmin()) {
    state.managementTab = "create";
    content.innerHTML = `
      ${renderManagementTabs()}
      <div class="dashboard-grid member-dashboard">
        ${renderMemberCreatePanel()}
      </div>
    `;
    return;
  }

  const pending = state.members.filter((member) => member.status === "pending").length;
  const active = state.members.filter((member) => member.status === "active").length;
  const suspended = state.members.filter((member) => member.status === "suspended").length;
  const filteredMembers = getFilteredMembers();

  content.innerHTML = `
    ${renderedTabs}
    <div class="dashboard-grid member-dashboard">
      <div class="kpi-row">
        ${metricCard("전체 회원", state.members.length, "등록된 계정")}
        ${metricCard("승인 대기", pending, "관리자 확인 필요")}
        ${metricCard("활성 회원", active, "로그인 가능")}
        ${metricCard("정지 회원", suspended, "접속 차단")}
        ${metricCard("회원 권한", MEMBER_ROLE_ORDER.length, "권한표 운영")}
      </div>

      <section class="content-panel span-12">
        <div class="panel-header">
          <h4>회원 목록 및 승인 관리</h4>
          <span class="small-pill">승인 후 접속 가능</span>
        </div>
        <div class="filter-strip">
          <input class="control-input" id="member-query" type="search" value="${escapeHtml(state.memberFilters.query)}" placeholder="이름, 이메일, 부서, 사용 목적 검색" />
          <select class="control-select" id="member-role-filter">
            <option value="all">전체 권한</option>
            ${MEMBER_ROLE_ORDER.map((role) => `<option value="${role}" ${state.memberFilters.role === role ? "selected" : ""}>${escapeHtml(MEMBER_ROLES[role])}</option>`).join("")}
          </select>
          <select class="control-select" id="member-status-filter">
            <option value="all">전체 상태</option>
            ${MEMBER_STATUS_ORDER.map((status) => `<option value="${status}" ${state.memberFilters.status === status ? "selected" : ""}>${escapeHtml(MEMBER_STATUSES[status])}</option>`).join("")}
          </select>
        </div>
        <div id="member-table-content">
          ${memberTable(filteredMembers)}
        </div>
      </section>

      <section class="content-panel span-12">
        <div class="panel-header">
          <h4>권한별 메뉴 접근 권한</h4>
          <span class="small-pill">관리자 권한은 전체 메뉴 고정</span>
        </div>
        ${renderRolePermissionMatrix()}
      </section>
    </div>
  `;
}

function collectRegisterEducationFromForm(formElement, preserveBlank = false) {
  const formData = new FormData(formElement);
  const records = [...formElement.querySelectorAll("[data-register-education-index]")]
    .map((record) => Number(record.dataset.registerEducationIndex))
    .map((index) => ({
      degree: (formData.get(`register-education-degree-${index}`) || "").toString().trim(),
      school: (formData.get(`register-education-school-${index}`) || "").toString().trim(),
      major: (formData.get(`register-education-major-${index}`) || "").toString().trim(),
      affiliation: (formData.get(`register-education-affiliation-${index}`) || "").toString().trim(),
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

function collectScreeningEducationFromForm(formElement, preserveBlank = false) {
  if (!formElement) {
    return [];
  }

  const formData = new FormData(formElement);
  const records = [...formElement.querySelectorAll("[data-screening-education-index]")]
    .map((record) => Number(record.dataset.screeningEducationIndex))
    .map((index) => ({
      degree: (formData.get(`screening-education-degree-${index}`) || "").toString().trim(),
      school: (formData.get(`screening-education-school-${index}`) || "").toString().trim(),
      major: (formData.get(`screening-education-major-${index}`) || "").toString().trim(),
      affiliation: (formData.get(`screening-education-affiliation-${index}`) || "").toString().trim(),
      start: (formData.get(`screening-education-start-${index}`) || "").toString().trim(),
      end: (formData.get(`screening-education-end-${index}`) || "").toString().trim()
    }));

  return preserveBlank ? records : records.filter(hasAnyRecordValue);
}

function collectScreeningCareerFromForm(formElement, preserveBlank = false) {
  if (!formElement) {
    return [];
  }

  const formData = new FormData(formElement);
  const records = [...formElement.querySelectorAll("[data-screening-career-index]")]
    .map((record) => Number(record.dataset.screeningCareerIndex))
    .map((index) => ({
      country: (formData.get(`screening-career-country-${index}`) || "").toString().trim(),
      company: (formData.get(`screening-career-company-${index}`) || "").toString().trim(),
      rank: (formData.get(`screening-career-rank-${index}`) || "").toString().trim(),
      position: (formData.get(`screening-career-position-${index}`) || "").toString().trim(),
      start: (formData.get(`screening-career-start-${index}`) || "").toString().trim(),
      end: formData.get(`screening-career-current-${index}`) ? "현재" : (formData.get(`screening-career-end-${index}`) || "").toString().trim(),
      achievements: (formData.get(`screening-career-achievements-${index}`) || "").toString().trim()
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

function getScreeningEducationRecords() {
  const form = $("#screening-applicant-form");
  return form ? collectScreeningEducationFromForm(form, true) : [];
}

function getScreeningCareerRecords() {
  const form = $("#screening-applicant-form");
  return form ? collectScreeningCareerFromForm(form, true) : [];
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

function setScreeningEducationRecords(records) {
  const list = $("#screening-education-list");
  const items = records.length ? records : [{}];

  if (list) {
    list.innerHTML = items.map((item, index) => renderScreeningEducationRecord(item, index)).join("");
  }
}

function setScreeningCareerRecords(records) {
  const list = $("#screening-career-list");
  const items = records.length ? records : [{}];

  if (list) {
    list.innerHTML = items.map((item, index) => renderScreeningCareerRecord(item, index)).join("");
  }
}

function setEditEducationRecords(records) {
  const list = $("#edit-education-list");
  const items = records.length ? records : [{}];

  if (list) {
    list.innerHTML = items.map((item, index) => renderEducationEditRecord(item, index)).join("");
  }
}

function setEditCareerRecords(records) {
  const list = $("#edit-career-list");
  const items = records.length ? records : [{}];

  if (list) {
    list.innerHTML = items.map((item, index) => renderCareerEditRecord(item, index)).join("");
  }
}

function addRegisterEducationRecord() {
  setRegisterEducationRecords([...getRegisterEducationRecords(), {}]);
}

function addRegisterCareerRecord() {
  setRegisterCareerRecords([...getRegisterCareerRecords(), {}]);
}

function addScreeningEducationRecord() {
  setScreeningEducationRecords([...getScreeningEducationRecords(), {}]);
}

function addScreeningCareerRecord() {
  setScreeningCareerRecords([...getScreeningCareerRecords(), {}]);
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

function removeScreeningEducationRecord(index) {
  const records = getScreeningEducationRecords();
  records.splice(index, 1);
  setScreeningEducationRecords(records);
}

function removeScreeningCareerRecord(index) {
  const records = getScreeningCareerRecords();
  records.splice(index, 1);
  setScreeningCareerRecords(records);
}

function updateCareerCurrentControl(checkbox) {
  const record = checkbox.closest("[data-register-career-index], [data-screening-career-index], [data-career-index]");
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

function withTimeout(task, timeoutMs, message) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(message || "작업 시간이 초과되었습니다."));
    }, timeoutMs);
    const promise = typeof task === "function" ? Promise.resolve().then(task) : Promise.resolve(task);

    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

async function extractDocumentTextPayloadWithServer(payload, options = {}) {
  const dataUrl = String(payload?.dataUrl || "").trim();

  if (!dataUrl) {
    throw new Error("읽을 파일 데이터가 없습니다.");
  }

  const timeoutMs = Number(options.timeoutMs || 0);
  const controller = typeof AbortController !== "undefined" && timeoutMs > 0 ? new AbortController() : null;
  const timer = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;
  let response;

  try {
    response = await fetch("/api/extract-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller?.signal,
      body: JSON.stringify({
        fileName: payload.fileName || payload.name || "",
        mimeType: payload.mimeType || payload.type || "",
        dataUrl
      })
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("서버 파일 텍스트 추출 시간이 초과되었습니다.");
    }

    throw error;
  } finally {
    if (timer) {
      window.clearTimeout(timer);
    }
  }

  const responseText = await response.text();
  let responsePayload = {};

  try {
    responsePayload = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw new Error("파일 텍스트 추출 API 응답을 해석하지 못했습니다.");
  }

  if (!response.ok || !responsePayload.ok) {
    throw new Error(responsePayload.error || `파일 텍스트 추출 API 오류: ${response.status}`);
  }

  const text = normalizeResumeText(responsePayload.text || "");

  if (!text) {
    throw new Error("파일에서 읽을 수 있는 텍스트를 찾지 못했습니다.");
  }

  return {
    text,
    meta: {
      ...(responsePayload.meta || {}),
      source: "server"
    }
  };
}

async function extractDocumentTextWithServer(file, options = {}) {
  const dataUrl = await readFileAsDataUrl(file);
  return extractDocumentTextPayloadWithServer({
    fileName: file.name,
    mimeType: file.type || "",
    dataUrl
  }, options);
}

async function readInterviewReportUploadText(file) {
  const errors = [];
  const isServerUploadAllowed = Number(file?.size || 0) <= INTERVIEW_REPORT_SERVER_UPLOAD_LIMIT_BYTES;

  const readWithBrowser = async () => {
    const browserResult = await withTimeout(
      async () => {
        await waitForUiPaint();
        return readResumeText(file);
      },
      36000,
      "브라우저 파일 텍스트 추출 시간이 초과되었습니다."
    );
    const text = normalizeResumeText(browserResult.text || "");

    if (text) {
      return {
        text,
        meta: {
          ...(browserResult.meta || {}),
          source: "browser"
        }
      };
    }

    throw new Error("브라우저 추출 결과가 비어 있습니다.");
  };

  const readWithServer = async () => {
    if (!isServerUploadAllowed) {
      throw new Error(`서버 추출 제한(${formatFileSize(INTERVIEW_REPORT_SERVER_UPLOAD_LIMIT_BYTES)})보다 큰 파일입니다. 브라우저에서 직접 추출합니다.`);
    }

    const serverResult = await withTimeout(
      () => extractDocumentTextWithServer(file, { timeoutMs: 26000 }),
      30000,
      "서버 파일 텍스트 추출 시간이 초과되었습니다."
    );
    const text = normalizeResumeText(serverResult.text || "");

    if (text) {
      return {
        text,
        meta: {
          ...(serverResult.meta || {}),
          source: "server"
        }
      };
    }

    throw new Error("서버 추출 결과가 비어 있습니다.");
  };

  const attempts = isServerUploadAllowed
    ? [readWithServer, readWithBrowser]
    : [readWithBrowser];

  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (error) {
      errors.push(error);
      await waitForUiPaint();
    }
  }

  const warnings = errors.flatMap((item) => item?.warnings || []);
  const message = errors
    .map((item) => item?.message)
    .filter(Boolean)
    .join(" / ");
  const parseError = createResumeParseError(
    message || "파일에서 읽을 수 있는 텍스트를 추출하지 못했습니다.",
    warnings
  );
  parseError.cause = errors.at(-1);
  throw parseError;
}

async function readStoredInterviewReportUploadText(upload, label = "파일") {
  const normalizedUpload = normalizeInterviewReportUpload(upload);

  if (!normalizedUpload) {
    throw createResumeParseError(`${label} 원본 파일을 찾을 수 없습니다. 다시 업로드해주세요.`);
  }

  const storedFile = getInterviewReportStoredFile(normalizedUpload);

  if (storedFile) {
    return readInterviewReportUploadText(storedFile);
  }

  if (!normalizedUpload.dataUrl) {
    throw createResumeParseError(`${label} 파일은 현재 브라우저 세션에서 찾을 수 없습니다. 파일을 다시 업로드해주세요.`);
  }

  const result = await withTimeout(
    () => extractDocumentTextPayloadWithServer({
      fileName: normalizedUpload.name,
      mimeType: normalizedUpload.type || "",
      dataUrl: normalizedUpload.dataUrl
    }, { timeoutMs: 36000 }),
    42000,
    `${label} 텍스트 추출 시간이 초과되었습니다. 문서가 너무 크거나 암호화되어 있으면 DOCX/PDF/TXT 형식으로 다시 업로드해주세요.`
  );
  const text = normalizeResumeText(result.text || "");

  if (!text) {
    throw createResumeParseError(`${label}에서 읽을 수 있는 텍스트를 찾지 못했습니다.`);
  }

  return {
    text,
    meta: {
      ...(result.meta || {}),
      source: "server"
    }
  };
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

function cleanParsedMultilineValue(value) {
  return splitNonEmptyLines(value)
    .map((line) => cleanParsedValue(line))
    .filter(Boolean)
    .join("\n");
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

function splitResumeTextByRecordHints(value) {
  const text = normalizeResumeText(value);

  if (!text) {
    return [];
  }

  const schoolPattern = "KAIST|카이스트|POSTECH|포항공과대학교|서울대학교|연세대학교|고려대학교|한양대학교|성균관대학교|서강대학교|중앙대학교|경희대학교|이화여자대학교|부산대학교|경북대학교|전남대학교|전북대학교|충남대학교|충북대학교|인하대학교|아주대학교|건국대학교|동국대학교|홍익대학교|[가-힣A-Za-z]+대학교|[A-Z][A-Za-z\\s]+University|[A-Z][A-Za-z\\s]+College";
  const companyPattern = "미래로봇기술연구소|뉴로메카트로닉스|네이버클라우드|현대백화점|아모레퍼시픽|삼성전자|LG전자|NVIDIA|엔비디아|크래프톤|Bluehole|본엔젤스|[가-힣A-Za-z0-9.&+-]+(?:전자|백화점|퍼시픽|SDS|모비스|연구소|메카트로닉스|로보틱스|Robotics|Research|Technology|Technologies|Cloud|hynix|ASML|Samsung|Naver|Kakao|Hyundai|Amorepacific|LG|SK|Inc\\.?|Corp\\.?|Labs?|Studio|Group|Korea)";
  const marked = text
    .replace(new RegExp(`\\s+(?=(?:${schoolPattern}))`, "gi"), "\n")
    .replace(new RegExp(`\\s+(?=(?:${companyPattern}))`, "gi"), "\n")
    .replace(/\s+(?=(?:박사|석사|학사|Ph\.?D|Master|Bachelor)\b)/gi, "\n")
    .replace(/\s+(?=(?:상세\s*)?경력\s*(?:사항|정보)?|Professional Experience|Work Experience|Experience|Career)\b/gi, "\n")
    .replace(/\s+(?=(?:학력|Education)\b)/gi, "\n")
    .replace(/\s+(?=(?:19|20)\d{2}\s*[.\-/년]?\s*(?:\d{1,2})?\s*(?:월)?\s*(?:~|～|-|–|—|to)\s*(?:현재|재직중?|present|current|(?:19|20)\d{2}))/gi, "\n");

  return marked
    .split(/\n+/)
    .map((line) => cleanParsedValue(line))
    .filter(Boolean);
}

function expandResumeExtractionLines(lines) {
  const expanded = [];

  const pushLine = (line) => {
    const cleaned = cleanParsedValue(line);

    if (cleaned && !expanded.includes(cleaned)) {
      expanded.push(cleaned);
    }
  };

  lines.forEach((line) => {
    pushLine(line);
    splitResumeTextByRecordHints(line).forEach(pushLine);
  });

  return expanded;
}

function extractResumeSectionLines(lines, headerPattern, boundaryPattern) {
  const sectionLines = [];
  let inSection = false;

  lines.forEach((line) => {
    if (headerPattern.test(line)) {
      inSection = true;
      const withoutHeader = cleanParsedValue(line.replace(headerPattern, ""));

      if (withoutHeader) {
        sectionLines.push(withoutHeader);
      }
      return;
    }

    if (inSection && boundaryPattern.test(line)) {
      inSection = false;
      return;
    }

    if (inSection) {
      sectionLines.push(line);
    }
  });

  return expandResumeExtractionLines(sectionLines);
}

function buildEducationExtractionLines(lines) {
  const expanded = expandResumeExtractionLines(lines);
  const sectionLines = extractResumeSectionLines(
    expanded,
    /^(?:학력|Education|Academic Background|Education Background)\s*[:：\s-]*/i,
    /^(?:상세\s*)?경력|Professional Experience|Work Experience|Experience|Career|프로젝트|Project|기술|Skills|논문|특허|수상|Awards?/i
  );
  const candidates = [...sectionLines, ...expanded];

  return [...new Set(candidates.filter((line) =>
    /(학력|Education|대학교|대학원|University|College|KAIST|카이스트|POSTECH|학사|석사|박사|전공|Major|Ph\.?D|Master|Bachelor)/i.test(line) &&
    !/(경력|Experience|회사|근무|재직|직장|Company|Work\s+Experience)/i.test(line)
  ))];
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

function removePeriodText(value) {
  return cleanParsedValue(value)
    .replace(/(?:19|20)\d{2}\s*[.\-/년]\s*(?:\d{1,2})?\s*월?\s*(?:~|～|-|–|—|to)\s*(?:현재|재직중?|present|current|ongoing|(?:19|20)\d{2}\s*[.\-/년]?\s*(?:\d{1,2})?\s*월?)/gi, " ")
    .replace(/(?:19|20)\d{2}\s*[.\-/년]\s*(?:\d{1,2})?\s*월?/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractSchoolNameFromEducationText(value) {
  const text = cleanParsedValue(value);
  const school = firstMatch(text, [
    /(KAIST|카이스트|POSTECH|포항공과대학교|서울대학교|연세대학교|고려대학교|한양대학교|성균관대학교|서강대학교|중앙대학교|경희대학교|이화여자대학교|부산대학교|경북대학교|전남대학교|전북대학교|충남대학교|충북대학교|인하대학교|아주대학교|건국대학교|동국대학교|홍익대학교|[가-힣A-Za-z]+대학교|[A-Z][A-Za-z\s]+University|[A-Z][A-Za-z\s]+College|[A-Z][A-Za-z\s]+Institute)/i
  ]);

  if (/카이스트/i.test(school)) return "KAIST";
  return cleanParsedValue(school);
}

function removeSchoolAliasesFromText(value, school) {
  let text = cleanParsedValue(value);
  const aliases = [];

  if (/^KAIST$/i.test(school || "") || /카이스트|KAIST/i.test(text)) {
    aliases.push("KAIST", "카이스트");
  }

  if (school) {
    aliases.push(school);
  }

  aliases
    .filter(Boolean)
    .forEach((alias) => {
      text = text.replace(new RegExp(`\\(?${escapeRegExp(alias)}\\)?`, "gi"), " ");
    });

  return text.replace(/\s{2,}/g, " ").trim();
}

function extractMajorFromEducationText(value, school, degree) {
  const text = cleanParsedValue(value);
  const explicitMajor = cleanParsedValue(firstMatch(text, [
    /전공\s*[:：]\s*([가-힣A-Za-z0-9\s/·&+-]+?)(?:[),/]|지도|$)/i,
    /Major\s*[:：]\s*([A-Za-z0-9\s/·&+-]+?)(?:[),/]|$)/i
  ]));

  if (explicitMajor) {
    return explicitMajor;
  }

  let stripped = removeSchoolAliasesFromText(removePeriodText(text), school);

  stripped = stripped
    .replace(/박사|석사|학사|전문학사|Ph\.?D|Master|Bachelor/gi, " ")
    .replace(/지도교수\s*[:：]?\s*[가-힣A-Za-z\s]+/gi, " ")
    .replace(/[()]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  const major = firstMatch(stripped, [
    /([가-힣A-Za-z0-9\s]+?(?:공학부|공학과|학과|전공|공학|디자인|Science|Engineering|Design|Robotics|Computer Science))/i
  ]);

  const cleanedMajor = cleanParsedValue(major);

  return degree ? cleanedMajor.replace(new RegExp(escapeRegExp(degree), "gi"), "").trim() : cleanedMajor;
}

function parseEducationLine(line) {
  const body = cleanParsedValue(line).replace(/^(?:학력|Education)[:：\s-]*/i, "");
  const parts = splitResumeParts(body);
  const degree = normalizeJobFitDegree(firstMatch(body, [/(박사|석사|학사|전문학사|Ph\.?D|Master|Bachelor)/i]) ||
    parts.find((part) => /(박사|석사|학사|전문학사|Ph\.?D|Master|Bachelor)/i.test(part)) || "");
  const school = extractSchoolNameFromEducationText(body);
  const major = extractMajorFromEducationText(body, school, degree);
  const period = extractPeriodValues(body);

  return { degree, school, major, ...period };
}

function hasCareerCompanyKeyword(value) {
  return /(미래로봇기술연구소|뉴로메카트로닉스|네이버클라우드|현대백화점|아모레퍼시픽|삼성전자|LG전자|NVIDIA|엔비디아|크래프톤|Bluehole|본엔젤스|[가-힣A-Za-z0-9.&+-]+(?:연구소|메카트로닉스|로보틱스|Robotics|Research|Technology|Technologies|Labs?|Studio|Group|전자|백화점|퍼시픽|SDS|모비스|Cloud|Inc\.?|Corp\.?))/i.test(value);
}

function hasCareerRoleKeyword(value) {
  return /(대표|대표이사|연구원|책임연구원|선임연구원|수석연구원|디자이너|엔지니어|개발자|매니저|팀장|Lab장|센터장|부장|차장|과장|대리|사원|Associate|Designer|Engineer|Researcher|Manager|Director|Lead|Principal|Staff|팀|그룹|센터|Lab|Team|Department)/i.test(value);
}

function isCareerSectionHeader(line) {
  return /^(?:상세\s*)?경력\s*(?:사항|정보)?|Professional Experience|Work Experience|Experience|Career$/i.test(cleanParsedValue(line));
}

function isCareerSectionBoundary(line) {
  return /^(학력|Education|논문|특허|수상|기술|Skills|프로젝트|Project|자격|Certification|주요\s*성과|Awards?)/i.test(cleanParsedValue(line));
}

function buildCareerExtractionLines(lines) {
  const extracted = [];
  let inCareerSection = false;
  const sourceLines = expandResumeExtractionLines(lines);

  const pushLine = (line) => {
    const cleaned = cleanParsedValue(line);

    if (cleaned && !extracted.includes(cleaned)) {
      extracted.push(cleaned);
    }
  };

  sourceLines.forEach((line, index) => {
    if (isCareerSectionHeader(line)) {
      inCareerSection = true;
      return;
    }

    if (inCareerSection && isCareerSectionBoundary(line)) {
      inCareerSection = false;
    }

    const period = extractPeriodValues(line);
    const companyLike = hasCareerCompanyKeyword(line);
    const roleLike = hasCareerRoleKeyword(line);
    const shouldExtract = (
      /(경력|재직|근무|직장|Experience|Career|Work)/i.test(line) ||
      (period.start && (companyLike || roleLike)) ||
      (inCareerSection && (period.start || companyLike || roleLike))
    ) && !/(대학교|대학원|University|College|학사|석사|박사|전공)/i.test(line);

    if (!shouldExtract) {
      return;
    }

    pushLine(line);

    const previous = sourceLines[index - 1] || "";
    const next = sourceLines[index + 1] || "";
    const nextAfter = sourceLines[index + 2] || "";

    if (period.start && !companyLike && hasCareerCompanyKeyword(next)) {
      pushLine(`${line} ${next}`);
    }

    if (companyLike && !period.start && extractPeriodValues(previous).start) {
      pushLine(`${previous} ${line}`);
    }

    if (companyLike && !period.start && extractPeriodValues(next).start) {
      pushLine(`${line} ${next}`);
    }

    if (companyLike && !period.start && !extractPeriodValues(next).start && extractPeriodValues(nextAfter).start) {
      pushLine(`${line} ${next} ${nextAfter}`);
    }
  });

  return extracted;
}

function stripCareerCountryPrefix(value) {
  return cleanParsedValue(value)
    .replace(/^(?:한국|대한민국|미국|중국|일본|독일|영국|프랑스|USA|United States|Korea|Japan|China)\)?\s*/i, "")
    .trim();
}

function normalizeCareerPart(value) {
  return stripCareerCountryPrefix(removePeriodText(value)
    .replace(/^(?:경력|Career|Experience|Work Experience)[:：\s-]*/i, ""));
}

function looksLikeCareerRank(value) {
  return /(?:CL\d|사원|주임|대리|과장|차장|부장|이사|상무|전무|부사장|사장|대표|대표이사|회장|의장|고문|창업자|교수|원장|연구원|연구위원|선임|책임|수석|전임|Staff|Senior|Sr\.?|Principal|Lead|Manager|Director|VP|CEO|CTO|CFO|COO|Founder|Engineer|Developer|Designer|Researcher|Scientist|Architect|PM|PO|팀장|파트장|그룹장|실장|센터장|본부장|부문장|Lab장|랩장|리더|Head)/i.test(cleanParsedValue(value));
}

function looksLikeCareerDepartment(value) {
  const cleaned = cleanParsedValue(value);

  if (!cleaned || looksLikeCareerRank(cleaned)) {
    return false;
  }

  return /(?:팀|그룹|센터|실|본부|부문|사업부|연구소|연구실|랩|Lab|Laboratory|Department|Division|Office|Unit|TF|조직|파트|Chapter|Squad|Cell|Tribe)/i.test(cleaned);
}

function normalizeCareerRoleFields(rank, position) {
  const rankParts = [];
  const positionParts = [];

  [rank, position]
    .flatMap((value) => String(value || "").split(/\s*,\s*/))
    .map(cleanParsedValue)
    .filter(Boolean)
    .forEach((value) => {
      if (looksLikeCareerDepartment(value)) {
        positionParts.push(value);
      } else if (looksLikeCareerRank(value)) {
        rankParts.push(value);
      } else if (!rankParts.length) {
        rankParts.push(value);
      } else {
        positionParts.push(value);
      }
    });

  return {
    rank: uniqueTextParts(rankParts).join(", "),
    position: uniqueTextParts(positionParts).join(", ")
  };
}

function normalizeCareerPartsToFields(parts = []) {
  const rankParts = [];
  const positionParts = [];

  parts.map(cleanParsedValue).filter(Boolean).forEach((value) => {
    if (looksLikeCareerDepartment(value)) {
      positionParts.push(value);
    } else if (looksLikeCareerRank(value)) {
      rankParts.push(value);
    } else if (!rankParts.length && value.length <= 30) {
      rankParts.push(value);
    } else if (value.length <= 30) {
      positionParts.push(value);
    }
  });

  return {
    rank: uniqueTextParts(rankParts).join(", "),
    position: uniqueTextParts(positionParts).join(", ")
  };
}

function parseCareerLine(line) {
  const period = extractPeriodValues(line);
  const body = cleanParsedValue(line).replace(/^(?:경력|Career|Experience|Work Experience)[:：\s-]*/i, "");
  const parts = splitResumeParts(body);
  const cleanParts = parts.map(normalizeCareerPart).filter(Boolean);
  const commaCareerLine = cleanParts.length >= 3 && (period.start || period.end || /(팀|그룹|센터|Lab|Team|Department|Designer|Engineer|Researcher|Manager|선임|수석|책임|과장|차장|부장|대리|사원)/i.test(body));

  if (commaCareerLine) {
    const roleParts = cleanParts.slice(1, 4);
    const roleFields = normalizeCareerPartsToFields(roleParts);

    return {
      country: body.includes("미국") || /USA|United States/i.test(body) ? "미국" : body.includes("대한민국") || body.includes("한국") ? "한국" : "",
      company: cleanParts[0],
      rank: roleFields.rank,
      position: roleFields.position,
      start: period.start,
      end: period.end,
      achievements: cleanParsedValue(cleanParts.slice(1 + roleParts.length).join(", "))
    };
  }

  const structuredCareerLine = parts.length >= 4 &&
    (line.includes("경력") || /Career|Experience/i.test(line) || period.start || parts.some((part) => /(사원|주임|대리|과장|차장|부장|책임|선임|수석|Staff|Senior|Principal|Manager)/i.test(part)));

  if (structuredCareerLine) {
    const periodIndex = parts.findIndex((part) => extractPeriodValues(part).start || extractPeriodValues(part).end);
    const achievementStart = periodIndex >= 0 ? periodIndex + 1 : 4;
    const roleFields = normalizeCareerRoleFields(parts[2], parts[3]);

    return {
      country: cleanParsedValue(parts[0]),
      company: cleanParsedValue(parts[1]),
      rank: roleFields.rank,
      position: roleFields.position,
      start: period.start,
      end: period.end,
      achievements: cleanParsedValue(parts.slice(achievementStart).join(", "))
    };
  }

  const company = cleanParsedValue(labeledValueFromLine(body, ["회사", "직장", "근무처", "Company"]) || firstMatch(body, [
    /(?:회사|직장|근무처)[:\s]+([가-힣A-Za-z0-9\s.&+-]+)/,
    /(미래로봇기술연구소|뉴로메카트로닉스|네이버클라우드|현대백화점|아모레퍼시픽|삼성전자|LG전자|NVIDIA|엔비디아|크래프톤|Bluehole|본엔젤스|[가-힣A-Za-z0-9.&+-]+(?:전자|백화점|퍼시픽|SDS|모비스|연구소|메카트로닉스|로보틱스|Robotics|Research|Technology|Technologies|Cloud|hynix|ASML|Samsung|Naver|Kakao|Hyundai|Amorepacific|LG|SK|Inc\.?|Corp\.?|Labs?|Studio|Group|Korea))/i
  ]));
  const bodyWithoutCompany = company ? body.replace(new RegExp(escapeRegExp(company), "i"), " ") : body;
  const position = cleanParsedValue(labeledValueFromLine(bodyWithoutCompany, ["직책", "담당", "포지션", "Position"]) || firstMatch(bodyWithoutCompany, [
    /(?:소속부서|부서|조직|직책|담당|포지션)[:\s]+([가-힣A-Za-z0-9\s/·&+-]+)/,
    /([가-힣A-Za-z0-9\s]+(?:팀|그룹|센터|랩|연구소|Lab|Team|Department|Office))/i
  ]));
  const rank = cleanParsedValue(firstMatch(bodyWithoutCompany, [/(선임\s*디자이너|Associate|사원|주임|대리|과장|차장|부장|책임연구원|선임연구원|수석연구원|책임|선임|수석|Staff|Senior|Principal|Manager|Designer|Engineer|Researcher)/i]));
  const roleFields = normalizeCareerRoleFields(rank, position);

  return {
    country: body.includes("미국") || /USA|United States/i.test(body) ? "미국" : body.includes("대한민국") ? "대한민국" : "",
    company,
    rank: roleFields.rank,
    position: roleFields.position,
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

function extractNationality(text, lines = []) {
  return cleanParsedValue(findLabeledValue(lines, ["국적", "Nationality", "Citizen", "Citizenship"]) ||
    firstMatch(text, [/(?:국적|Nationality|Citizenship)\s*[:：]?\s*([가-힣A-Za-z\s]{2,30})/i]));
}

function extractLinkedinUrl(text) {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s<>)"']+/i);
  return cleanParsedValue(match?.[0] || "");
}

function extractReferenceUrl(text) {
  return extractReferenceUrls(text)[0] || "";
}

function extractReferenceUrls(text) {
  const urls = [...text.matchAll(/https?:\/\/[^\s<>)"']+|(?:www\.)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}\/[^\s<>)"']*/g)]
    .map((match) => cleanParsedValue(match[0]))
    .filter((url) =>
      url &&
      !url.includes("@") &&
      !/linkedin\.com/i.test(url) &&
      !/\.(?:com|co\.kr|net|org)$/i.test(url)
    );

  return [...new Set(urls)].slice(0, 3);
}

function compactResumeSummaryLine(value, maxLength = 20) {
  const text = cleanParsedValue(value)
    .replace(/^[-•·\s]+/, "")
    .replace(/[。.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return "";
  }

  return Array.from(text).slice(0, maxLength).join("");
}

function buildResumeCoreCompetency(parsed = {}, career = [], education = [], skillKeywords = []) {
  const direct = compactResumeSummaryLine(parsed.coreCompetency || parsed.core_competency, 20);

  if (direct) {
    return direct;
  }

  const role = cleanParsedValue(parsed.role || career[0]?.rank || career[0]?.position);
  const skill = skillKeywords.find((item) => !/검수|필요/i.test(item)) || "";
  const major = education[0]?.major || "";
  let phrase = [skill, role].filter(Boolean).join(" ");

  if (!phrase && major) {
    phrase = `${major} 전문가`;
  } else if (phrase && !/(전문가|엔지니어|연구원|디자이너|기획자|담당자|PM|CEO|CTO|CPO|Engineer|Researcher|Designer|Director)/i.test(phrase)) {
    phrase = `${phrase} 전문가`;
  }

  return compactResumeSummaryLine(phrase, 20);
}

function buildResumeAchievementSummary(parsed = {}, career = [], skillKeywords = []) {
  const directLines = Array.isArray(parsed.achievementSummary)
    ? parsed.achievementSummary
    : Array.isArray(parsed.achievement_summary)
      ? parsed.achievement_summary
      : [];
  const careerLines = career.flatMap((item) =>
    String(item.achievements || "")
      .split(/\r?\n|[.!?。]\s+/)
      .map((line) => line.trim())
      .filter(Boolean)
  );
  const careerFallback = career
    .map((item) => [item.company, item.position || item.rank].filter(Boolean).join(" "))
    .filter(Boolean);
  const skillFallback = skillKeywords.length ? [`${skillKeywords.slice(0, 3).join(", ")} 역량 보유`] : [];
  const lines = [...directLines, ...careerLines, ...careerFallback, ...skillFallback]
    .map((line) => compactResumeSummaryLine(line, 20))
    .filter(Boolean);

  return [...new Set(lines)].slice(0, 3);
}

function parseResumeText(text, filename = "") {
  const normalized = normalizeResumeText(text);
  const baseLines = normalized
    .split("\n")
    .map((line) => cleanParsedValue(line))
    .filter((line) => line && !/^(이력서|자기소개서|경력기술서)$/i.test(line));
  const lines = expandResumeExtractionLines(baseLines)
    .filter((line) => line && !/^(이력서|자기소개서|경력기술서)$/i.test(line));
  const compact = lines.join("\n");
  const educationLines = buildEducationExtractionLines(lines);
  const careerLines = buildCareerExtractionLines(lines)
    .filter((line) => !/(현재\s*회사|최근\s*회사|현재\/최근|지원\s*직무|희망직무|지원분야|직무[:\s]|포지션[:\s])/i.test(line));
  const education = educationLines.map(parseEducationLine).filter(hasAnyRecordValue).slice(0, 5);
  const career = careerLines.map(parseCareerLine).filter(hasAnyRecordValue).slice(0, 6);
  const skills = inferSkills(compact);
  const referenceUrls = extractReferenceUrls(compact);
  const name = extractLikelyPersonNameFromResumeText(compact) ||
    normalizeInferredCandidateName(lines.find((line) => (/^[가-힣]{2,5}$|^[A-Z][a-z]+ [A-Z][a-z]+$/.test(line)) && !/(이력서|자기소개|경력)/.test(line)) || "");
  const role = cleanParsedValue(findLabeledValue(lines, ["희망직무", "지원분야", "지원 직무", "직무", "포지션", "Position"]) || firstMatch(compact, [
    /([가-힣A-Za-z0-9 /·&+-]+(?:엔지니어|개발자|리서처|아키텍트|분석가|Engineer|Developer|Researcher|Architect))/
  ]));
  const company = cleanParsedValue(findLabeledValue(lines, ["현재 회사", "최근 회사", "현재/최근 회사", "회사", "근무처", "Company"]) || career[0]?.company);
  return {
    name,
    company,
    role: role || career[0]?.rank || career[0]?.position || "",
    birthYear: extractBirthYear(compact, lines),
    nationality: extractNationality(compact, lines),
    email: extractEmail(compact),
    phone: extractPhone(compact),
    linkedinUrl: extractLinkedinUrl(compact),
    referenceUrl: referenceUrls[0] || "",
    referenceUrl2: referenceUrls[1] || "",
    referenceUrl3: referenceUrls[2] || "",
    coreCompetency: buildResumeCoreCompetency({ role }, career, education, skills),
    achievementSummary: buildResumeAchievementSummary({}, career, skills),
    skills,
    summary: "",
    education: education.length ? education : [{}],
    career: career.length ? career : [{}]
  };
}

function normalizeParsedDate(value) {
  const koreanDateText = String(value || "").trim();

  if (/^(현재|재직\s*중|present|current|ongoing)$/i.test(koreanDateText)) {
    return "현재";
  }

  const koreanMonthMatch = koreanDateText.match(/(\d{4})\s*(?:년|[.\-/])\s*(\d{1,2})\s*(?:월)?/);

  if (koreanMonthMatch) {
    return `${koreanMonthMatch[1]}-${koreanMonthMatch[2].padStart(2, "0")}`;
  }

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
      .map((item) => {
        const roleFields = normalizeCareerRoleFields(item.rank, item.position || item.department || item.title);

        return {
          country: cleanParsedValue(item.country),
          company: cleanParsedValue(item.company),
          rank: roleFields.rank,
          position: roleFields.position,
          start: normalizeParsedDate(item.start),
          end: normalizeParsedDate(item.end),
          achievements: String(item.achievements || "")
            .split(/\n+/)
            .map((line) => cleanParsedValue(line))
            .filter(Boolean)
            .join("\n")
        };
      })
      .filter(hasAnyRecordValue)
      .sort((a, b) => recentRecordSortValue(b).localeCompare(recentRecordSortValue(a)))
    : [];
  const education = Array.isArray(parsed.education)
    ? parsed.education
      .map((item) => ({
        degree: ["박사", "석사", "학사"].includes(cleanParsedValue(item.degree)) ? cleanParsedValue(item.degree) : "",
        school: cleanParsedValue(item.school),
        major: cleanParsedValue(item.major),
        affiliation: cleanParsedValue(item.affiliation || item.department || item.organization),
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
  const referenceUrls = [...new Set((Array.isArray(parsed.referenceUrls)
    ? [parsed.referenceUrl, ...parsed.referenceUrls]
    : [
      parsed.referenceUrl,
      parsed.referenceUrl2,
      parsed.referenceUrl3
    ]).map(cleanParsedValue).filter(Boolean))].slice(0, 3);
  const coreCompetency = buildResumeCoreCompetency(parsed, career, education, skills);
  const achievementSummary = buildResumeAchievementSummary(parsed, career, skills);
  const keywordSkills = [...new Set(skills)].slice(0, 12);
  const achievementText = achievementSummary.join("\n");
  const parsedSummary = cleanParsedMultilineValue(parsed.summary);

  return {
    name: cleanParsedValue(parsed.name),
    englishName: cleanParsedValue(parsed.englishName || parsed.english_name || parsed.nameEnglish),
    company: cleanParsedValue(parsed.company || career[0]?.company),
    role: coreCompetency || cleanParsedValue(parsed.role || career[0]?.rank || career[0]?.position),
    birthYear: cleanParsedValue(parsed.birthYear).match(/\b(19\d{2}|20\d{2})\b/)?.[1] || "",
    nationality: cleanParsedValue(parsed.nationality),
    email: extractEmail(String(parsed.email || "")),
    phone: cleanParsedValue(parsed.phone),
    linkedinUrl: cleanParsedValue(parsed.linkedinUrl),
    referenceUrl: referenceUrls[0] || "",
    referenceUrl2: referenceUrls[1] || "",
    referenceUrl3: referenceUrls[2] || "",
    skills: keywordSkills,
    summary: parsedSummary || achievementText,
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
    parsed?.englishName ||
    parsed?.company ||
    parsed?.role ||
    parsed?.birthYear ||
    parsed?.nationality ||
    parsed?.email ||
    parsed?.phone ||
    parsed?.linkedinUrl ||
    parsed?.referenceUrl ||
    parsed?.referenceUrl2 ||
    parsed?.referenceUrl3 ||
    parsed?.summary ||
    parsed?.skills?.length ||
    parsed?.education?.some(hasAnyRecordValue) ||
    parsed?.career?.some(hasAnyRecordValue)
  );
}

function mergeParsedResumeResults(primary = {}, fallback = {}) {
  const primaryEducation = (primary.education || []).filter(hasAnyRecordValue);
  const fallbackEducation = (fallback.education || []).filter(hasAnyRecordValue);
  const primaryCareer = (primary.career || []).filter(hasAnyRecordValue);
  const fallbackCareer = (fallback.career || []).filter(hasAnyRecordValue);
  const skills = [...new Set([...(primary.skills || []), ...(fallback.skills || [])].map(cleanParsedValue).filter(Boolean))];
  const summary = cleanParsedMultilineValue(primary.summary) || cleanParsedMultilineValue(fallback.summary);
  const referenceUrls = [
    primary.referenceUrl,
    primary.referenceUrl2,
    primary.referenceUrl3,
    fallback.referenceUrl,
    fallback.referenceUrl2,
    fallback.referenceUrl3
  ].map(cleanParsedValue).filter(Boolean);
  const uniqueReferenceUrls = [...new Set(referenceUrls)].slice(0, 3);

  return normalizeParsedResumeForForm({
    ...fallback,
    ...primary,
    name: normalizeInferredCandidateName(primary.name) || normalizeInferredCandidateName(fallback.name),
    englishName: primary.englishName || fallback.englishName,
    company: primary.company || fallback.company,
    role: primary.role || fallback.role,
    birthYear: primary.birthYear || fallback.birthYear,
    nationality: primary.nationality || fallback.nationality,
    email: primary.email || fallback.email,
    phone: primary.phone || fallback.phone,
    linkedinUrl: primary.linkedinUrl || fallback.linkedinUrl,
    referenceUrl: uniqueReferenceUrls[0] || "",
    referenceUrl2: uniqueReferenceUrls[1] || "",
    referenceUrl3: uniqueReferenceUrls[2] || "",
    coreCompetency: primary.coreCompetency || fallback.coreCompetency || primary.role || fallback.role,
    summary,
    achievementSummary: splitNonEmptyLines(summary),
    skills,
    education: primaryEducation.length ? primaryEducation : fallbackEducation,
    career: primaryCareer.length ? primaryCareer : fallbackCareer
  });
}

function registerFormHasEnteredValues() {
  const fields = [
    "#candidate-name",
    "#candidate-english-name",
    "#candidate-role",
    "#candidate-birth-year",
    "#candidate-nationality",
    "#candidate-email",
    "#candidate-phone",
    "#candidate-linkedin",
    "#candidate-reference-url",
    "#candidate-reference-url-2",
    "#candidate-reference-url-3",
    "#candidate-summary",
    "#candidate-skills"
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
  setFieldValue("#candidate-english-name", parsed.englishName, overwrite);
  setFieldValue("#candidate-role", parsed.role, overwrite);
  setFieldValue("#candidate-birth-year", parsed.birthYear, overwrite);
  setFieldValue("#candidate-nationality", parsed.nationality, overwrite);
  setFieldValue("#candidate-email", parsed.email, overwrite);
  setFieldValue("#candidate-phone", parsed.phone, overwrite);
  setFieldValue("#candidate-linkedin", parsed.linkedinUrl, overwrite);
  setFieldValue("#candidate-reference-url", parsed.referenceUrl, overwrite);
  setFieldValue("#candidate-reference-url-2", parsed.referenceUrl2, overwrite);
  setFieldValue("#candidate-reference-url-3", parsed.referenceUrl3, overwrite);
  setFieldValue("#candidate-summary", parsed.summary, overwrite);
  setFieldValue("#candidate-skills", parsed.skills.join("\n"), overwrite);
  updateAgeOutput("#candidate-birth-year", "#candidate-age");

  if (education.length && (overwrite || currentEducationIsBlank)) {
    setRegisterEducationRecords(education);
  }

  if (career.length && (overwrite || currentCareerIsBlank)) {
    setRegisterCareerRecords(career);
  }
}

function screeningApplicantFormHasEnteredValues() {
  const form = $("#screening-applicant-form");

  if (!form) {
    return false;
  }

  const fields = [
    "#screening-applicant-name",
    "#screening-applicant-birth-year",
    "#screening-applicant-nationality",
    "#screening-applicant-email",
    "#screening-applicant-phone"
  ];
  const hasBasicValue = fields.some((selector) => $(selector)?.value?.trim());
  const hasEducationValue = collectScreeningEducationFromForm(form, true).some(hasAnyRecordValue);
  const hasCareerValue = collectScreeningCareerFromForm(form, true).some(hasAnyRecordValue);

  return hasBasicValue || hasEducationValue || hasCareerValue;
}

function applyParsedResumeToScreeningApplicantForm(parsed, options = {}) {
  const overwrite = options.overwrite !== false;
  const education = (parsed.education || []).filter(hasAnyRecordValue);
  const career = (parsed.career || []).filter(hasAnyRecordValue);
  const form = $("#screening-applicant-form");
  const currentEducationIsBlank = form ? !collectScreeningEducationFromForm(form, true).some(hasAnyRecordValue) : true;
  const currentCareerIsBlank = form ? !collectScreeningCareerFromForm(form, true).some(hasAnyRecordValue) : true;

  setFieldValue("#screening-applicant-name", parsed.name, overwrite);
  setFieldValue("#screening-applicant-birth-year", parsed.birthYear, overwrite);
  setFieldValue("#screening-applicant-nationality", parsed.nationality, overwrite);
  setFieldValue("#screening-applicant-email", parsed.email, overwrite);
  setFieldValue("#screening-applicant-phone", parsed.phone, overwrite);
  updateAgeOutput("#screening-applicant-birth-year", "#screening-applicant-age");

  if (education.length && (overwrite || currentEducationIsBlank)) {
    setScreeningEducationRecords(education);
  }

  if (career.length && (overwrite || currentCareerIsBlank)) {
    setScreeningCareerRecords(career);
  }
}

function editFormHasEnteredValues() {
  const form = $("#candidate-edit-form");

  if (!form) {
    return false;
  }

  const fields = [
    "#edit-name",
    "#edit-english-name",
    "#edit-role",
    "#edit-organization",
    "#edit-owner",
    "#edit-birth-year",
    "#edit-nationality",
    "#edit-email",
    "#edit-phone",
    "#edit-linkedin",
    "#edit-reference-url",
    "#edit-reference-url-2",
    "#edit-reference-url-3",
    "#edit-summary",
    "#edit-skills"
  ];
  const hasBasicValue = fields.some((selector) => $(selector)?.value?.trim());
  const hasEducationValue = collectEducationFromForm(form, true).some(hasAnyRecordValue);
  const hasCareerValue = collectCareerFromForm(form, true).some(hasAnyRecordValue);

  return hasBasicValue || hasEducationValue || hasCareerValue;
}

function applyParsedResumeToEditForm(parsed, options = {}) {
  const form = $("#candidate-edit-form");
  const overwrite = options.overwrite !== false;
  const education = (parsed.education || []).filter(hasAnyRecordValue);
  const career = (parsed.career || []).filter(hasAnyRecordValue);
  const currentEducationIsBlank = form ? !collectEducationFromForm(form, true).some(hasAnyRecordValue) : true;
  const currentCareerIsBlank = form ? !collectCareerFromForm(form, true).some(hasAnyRecordValue) : true;

  setFieldValue("#edit-name", parsed.name, overwrite);
  setFieldValue("#edit-english-name", parsed.englishName, overwrite);
  setFieldValue("#edit-role", parsed.role, overwrite);
  setFieldValue("#edit-birth-year", parsed.birthYear, overwrite);
  setFieldValue("#edit-nationality", parsed.nationality, overwrite);
  setFieldValue("#edit-email", parsed.email, overwrite);
  setFieldValue("#edit-phone", parsed.phone, overwrite);
  setFieldValue("#edit-linkedin", parsed.linkedinUrl, overwrite);
  setFieldValue("#edit-reference-url", parsed.referenceUrl, overwrite);
  setFieldValue("#edit-reference-url-2", parsed.referenceUrl2, overwrite);
  setFieldValue("#edit-reference-url-3", parsed.referenceUrl3, overwrite);
  setFieldValue("#edit-summary", parsed.summary, overwrite);
  setFieldValue("#edit-skills", parsed.skills.join("\n"), overwrite);
  updateAgeOutput("#edit-birth-year", "#edit-age");

  if (education.length && (overwrite || currentEducationIsBlank)) {
    setEditEducationRecords(education);
  }

  if (career.length && (overwrite || currentCareerIsBlank)) {
    setEditCareerRecords(career);
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

async function applyResumeProfilePhotoToEditForm(file, status) {
  const manualPhotoSelected = Boolean($("#edit-photo")?.files?.length);

  if (manualPhotoSelected) {
    return false;
  }

  try {
    if (status) {
      status.textContent = `${status.textContent} 프로필 사진 후보를 확인하는 중입니다.`;
    }

    const extracted = await extractProfilePhotoFromResume(file);

    if (!extracted?.dataUrl || $("#edit-photo")?.files?.length) {
      return false;
    }

    state.editExtractedPhotoUrl = extracted.dataUrl;
    const preview = $("#edit-photo-preview");

    if (preview) {
      preview.innerHTML = `<img src="${escapeHtml(extracted.dataUrl)}" alt="이력서에서 추출한 프로필 사진 미리보기" />`;
    }

    if (status) {
      status.textContent = `${status.textContent} 이력서 내 사진을 프로필 사진으로 반영했습니다.`;
    }

    return true;
  } catch (error) {
    console.warn("Resume profile photo extraction failed.", error);
    return false;
  }
}

async function parseResumeIntoRegisterForm(file) {
  const status = $("#resume-parse-status");

  setProgressStatus(status, "이력서 파일을 읽는 중입니다.", 12);

  try {
    const result = await readResumeText(file);

    if (!result.text || result.text.length < 20) {
      const profilePhotoApplied = await applyResumeProfilePhotoToRegisterForm(file, status);
      if (status) {
        status.textContent = `읽을 수 있는 텍스트가 부족합니다. 스캔 PDF는 수동 입력해주세요.${profilePhotoApplied ? " 프로필 사진은 자동 반영했습니다." : ""}`;
      }
      showToast("이력서 텍스트를 충분히 읽지 못했습니다.");
      return;
    }

    const deterministicParsed = normalizeParsedResumeForForm(parseResumeText(result.text, file.name));
    let parsed = deterministicParsed;
    let parserSource = "브라우저 기본 파서";

    try {
      setProgressStatus(status, "AI가 이력서 내용을 구조화하는 중입니다.", 58);

      const serverResult = await parseResumeWithServer(result.text, file.name, deterministicParsed);
      parsed = mergeParsedResumeResults(serverResult.parsed, deterministicParsed);
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
    setProgressStatus(status, "입력값과 프로필 사진을 반영하는 중입니다.", 86);
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

async function parseResumeForScreeningApplicantRecord(file) {
  let result = { text: "", meta: {} };
  let parsed = normalizeParsedResumeForForm(parseResumeText("", file?.name || ""));
  let parserSource = "file-name";
  let parseWarning = "";

  try {
    result = await readResumeText(file);
    const text = result.text || "";
    const deterministicParsed = normalizeParsedResumeForForm(parseResumeText(text, file.name));
    parsed = deterministicParsed;
    parserSource = "browser";

    if (text.length >= 20) {
      try {
        const serverResult = await parseResumeWithServer(text, file.name, deterministicParsed);
        parsed = mergeParsedResumeResults(serverResult.parsed, deterministicParsed);
        parserSource = serverResult.source || "server";
      } catch (serverError) {
        console.warn("Bulk screening resume parser failed. Falling back to browser parser.", serverError);
        parseWarning = serverError.message || "";
      }
    }
  } catch (error) {
    console.warn("Bulk screening resume text extraction failed.", error);
    parseWarning = error.message || "";
  }

  const text = result.text || "";
  const fallbackName = inferCandidateNameFromResume(text, file?.name || "");
  parsed = normalizeParsedResumeForForm({
    ...parsed,
    name: normalizeInferredCandidateName(parsed.name) || fallbackName
  });

  return {
    parsed,
    text,
    meta: result.meta || {},
    parserSource,
    parseWarning
  };
}

async function parseResumeIntoScreeningApplicantForm(file) {
  const status = $("#screening-resume-parse-status");

  setProgressStatus(status, "이력서 파일을 읽는 중입니다.", 12);

  try {
    const result = await readResumeText(file);

    if (!result.text || result.text.length < 20) {
      if (status) {
        status.textContent = "읽을 수 있는 텍스트가 부족합니다. 이력서를 확인한 뒤 필요한 값을 직접 입력해주세요.";
      }
      showToast("이력서 텍스트를 충분히 읽지 못했습니다.");
      return;
    }

    const deterministicParsed = normalizeParsedResumeForForm(parseResumeText(result.text, file.name));
    let parsed = deterministicParsed;
    let parserSource = "브라우저 기본 파서";

    try {
      setProgressStatus(status, "AI가 학력/경력 정보를 구조화하는 중입니다.", 58);

      const serverResult = await parseResumeWithServer(result.text, file.name, deterministicParsed);
      parsed = mergeParsedResumeResults(serverResult.parsed, deterministicParsed);
      parserSource = serverResult.source === "openai-web" ? "AI 구조화 파서" : "AI 구조화 파서";
    } catch (serverError) {
      console.warn("Screening resume parser failed. Falling back to browser parser.", serverError);
      parserSource = "브라우저 기본 파서";
    }

    if (!hasParsedResumeValues(parsed)) {
      if (status) {
        status.textContent = "이력서는 읽었지만 등록 필드에 매핑할 정보가 부족합니다. 내용을 확인해 직접 입력해주세요.";
      }
      showToast("매핑 가능한 이력서 정보를 찾지 못했습니다.");
      return;
    }

    const overwrite = screeningApplicantFormHasEnteredValues()
      ? window.confirm("현재 입력값을 이력서에서 읽은 정보로 덮어쓸까요?")
      : true;

    applyParsedResumeToScreeningApplicantForm(parsed, { overwrite });
    setProgressStatus(status, "지원자 입력값을 반영하는 중입니다.", 88);

    if (status) {
      const quality = result.meta?.textQuality ? ` 텍스트 신뢰도 ${Math.round(result.meta.textQuality)}점.` : "";
      status.textContent = `${parserSource} 결과를 입력란에 반영했습니다.${quality} 실제 이력서와 비교 후 저장해주세요.`;
    }

    showToast("이력서 정보를 지원자 등록 입력란에 반영했습니다.");
  } catch (error) {
    console.warn("Screening resume parsing failed.", error);

    if (status) {
      status.textContent = error.isResumeParseError
        ? error.message
        : "이력서 파일을 읽지 못했습니다. 파일 형식을 확인해주세요.";
    }

    showToast(error.isResumeParseError ? "이력서 텍스트 추출을 중단했습니다." : "이력서 파일을 읽지 못했습니다.");
  }
}

async function parseResumeIntoEditForm(file) {
  const status = $("#edit-resume-parse-status");

  setProgressStatus(status, "이력서 파일을 읽는 중입니다.", 12);

  try {
    const result = await readResumeText(file);

    if (!result.text || result.text.length < 20) {
      const profilePhotoApplied = await applyResumeProfilePhotoToEditForm(file, status);
      if (status) {
        status.textContent = `읽을 수 있는 텍스트가 부족합니다. 스캔 PDF는 수동 입력해주세요.${profilePhotoApplied ? " 프로필 사진은 자동 반영했습니다." : ""}`;
      }
      showToast("이력서 텍스트를 충분히 읽지 못했습니다.");
      return;
    }

    const deterministicParsed = normalizeParsedResumeForForm(parseResumeText(result.text, file.name));
    let parsed = deterministicParsed;
    let parserSource = "브라우저 기본 파서";

    try {
      setProgressStatus(status, "AI가 이력서 내용을 구조화하는 중입니다.", 58);

      const serverResult = await parseResumeWithServer(result.text, file.name, deterministicParsed);
      parsed = mergeParsedResumeResults(serverResult.parsed, deterministicParsed);
      parserSource = serverResult.source === "openai-web" ? "AI 구조화 및 회사 소재국가 보강" : "AI 구조화";
    } catch (serverError) {
      console.warn("Structured resume parser failed. Falling back to browser parser.", serverError);
      parserSource = "브라우저 기본 파서";
    }

    if (!hasParsedResumeValues(parsed)) {
      if (status) {
        status.textContent = "이력서는 읽었지만 수정 필드에 매핑할 수 있는 값이 부족합니다. 내용을 확인해 수동 입력해주세요.";
      }
      showToast("매핑 가능한 이력서 정보를 찾지 못했습니다.");
      return;
    }

    const overwrite = editFormHasEnteredValues()
      ? window.confirm("현재 수정 입력값을 이력서에서 읽은 정보로 덮어쓸까요?")
      : true;

    applyParsedResumeToEditForm(parsed, { overwrite });
    setProgressStatus(status, "수정 입력값과 프로필 사진을 반영하는 중입니다.", 86);
    const profilePhotoApplied = await applyResumeProfilePhotoToEditForm(file, status);

    if (status) {
      const quality = result.meta?.textQuality ? ` 텍스트 품질 ${Math.round(result.meta.textQuality)}점.` : "";
      const photoMessage = profilePhotoApplied ? " 프로필 사진도 자동 반영했습니다." : "";
      status.textContent = `${parserSource} 결과를 수정 입력란에 반영했습니다.${quality}${photoMessage} 실제 이력서와 비교 후 저장해주세요.`;
    }

    showToast("이력서 정보를 수정 입력란에 자동 반영했습니다.");
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
    showToast(payload.refreshFailed
      ? "Today's Talent 최신 갱신에 실패해 기존 리포트를 유지했습니다."
      : "Today's Talent 리포트를 불러왔습니다.");
  } catch (error) {
    console.warn("Trending people report failed.", error);
    state.trendingLoading = false;
    const hasDisplayableReport = getDisplayTrendingPeople(state.trendingReport).length > 0;

    if (hasDisplayableReport && !options.force) {
      state.trendingError = "";
      showToast("Today's Talent 최신 갱신에 실패해 기존 리포트를 유지했습니다.");
    } else {
      state.trendingReport = hasDisplayableReport ? state.trendingReport : null;
      state.trendingError = /quota|insufficient_quota|OPENAI|OpenAI/i.test(error.message || "")
        ? "OpenAI API 사용량 한도 또는 결제 설정 문제로 Today's Talent 리포트를 생성하지 못했습니다. API 크레딧/결제 설정을 확인한 뒤 다시 생성해주세요."
        : "Today's Talent 리포트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
    }
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

async function fetchTrendingSearchSettings() {
  if (!isAdmin() || state.trendingSearchLoading) {
    return;
  }

  state.trendingSearchLoading = true;

  try {
    const response = await fetch("/api/trending-people?settings=1");
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Trending search settings failed: ${response.status}`);
    }

    state.trendingSearchSettings = normalizeTrendingSearchSettings(payload.settings);
    persistState({ skipRemoteSync: true });
  } catch (error) {
    console.warn("Trending search settings failed.", error);
    showToast("관심 분야 설정을 불러오지 못했습니다.");
  } finally {
    state.trendingSearchLoading = false;
    renderTrendingPeople();
  }
}

async function fetchTrendingMailSettings() {
  if (!isAdmin() || state.trendingMailLoading) {
    return;
  }

  state.trendingMailLoading = true;

  try {
    const response = await fetch("/api/trending-mail", { cache: "no-store" });
    const payload = await readApiJson(response, "메일링 설정");

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

async function readApiJson(response, label) {
  const text = await response.text();
  const trimmed = text.trim();
  const contentType = response.headers.get("content-type") || "";

  if (!trimmed) {
    return {};
  }

  if (!contentType.includes("application/json") && trimmed.startsWith("<")) {
    throw new Error(`${label} 응답이 JSON이 아니라 HTML 오류 페이지입니다. 브라우저 새로고침 후 다시 시도하거나, 접속 주소가 https://talentpool-dx.com 인지 확인해주세요. (${response.status})`);
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    throw new Error(`${label} 응답을 해석하지 못했습니다. 상태 ${response.status}, 응답 시작: ${trimmed.slice(0, 80)}`);
  }
}

function getActiveAdminEmails() {
  return normalizeEmailList(
    state.members
      .filter((member) => member.role === "admin" && member.status === "active" && isValidEmail(member.email))
      .map((member) => member.email)
  );
}

async function notifyAdminsOfSignup(member) {
  const adminEmails = getActiveAdminEmails();

  if (!member || !adminEmails.length) {
    return false;
  }

  try {
    const response = await fetch("/api/signup-alert", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admins: adminEmails,
        member: {
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role,
          roleLabel: getRoleLabel(member.role),
          businessUnit: member.businessUnit,
          department: member.department,
          position: member.position,
          phone: member.phone,
          note: member.note,
          requestedAt: member.requestedAt
        }
      })
    });
    const payload = await readApiJson(response, "회원가입 관리자 알림 메일");

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Signup alert mail failed: ${response.status}`);
    }

    addAuditLog("회원가입 관리자 알림", member.name, `${payload.recipientCount || adminEmails.length}명 발송`, "시스템");
    persistState();
    return true;
  } catch (error) {
    console.warn("Signup alert mail failed.", error);
    addAuditLog("회원가입 관리자 알림 실패", member.name || "-", error.message || "메일 발송 실패", "시스템");
    persistState();
    return false;
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
    const settings = collectTrendingMailSettingsFromForm(form);
    state.trendingMailLoading = true;
    state.trendingMailError = "";
    renderTrendingPeople();
    const response = await fetch("/api/trending-mail", {
      method: "PUT",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    const payload = await readApiJson(response, "메일링 설정 저장");

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

function collectTrendingSearchSettingsFromForm(form) {
  const prompt = String(form.prompt.value || "").trim();

  if (!prompt) {
    throw new Error("관심 분야 프롬프트를 입력해주세요.");
  }

  return normalizeTrendingSearchSettings({
    prompt,
    updatedBy: getCurrentActorName()
  });
}

async function saveTrendingSearchSettings() {
  const form = $("#trending-search-form");

  if (!form || !isAdmin()) {
    return;
  }

  try {
    state.trendingSearchLoading = true;
    renderTrendingPeople();
    const settings = collectTrendingSearchSettingsFromForm(form);
    const response = await fetch("/api/trending-people?settings=1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Trending search settings save failed: ${response.status}`);
    }

    state.trendingSearchSettings = normalizeTrendingSearchSettings(payload.settings);
    addAuditLog("Today's Talent 관심 분야 설정", "Today's Talent", state.trendingSearchSettings.prompt);
    persistState();
    showToast("관심 분야 설정을 저장했습니다.");
  } catch (error) {
    console.warn("Trending search settings save failed.", error);
    showToast(error.message || "관심 분야 설정 저장에 실패했습니다.");
  } finally {
    state.trendingSearchLoading = false;
    renderTrendingPeople();
  }
}

async function sendTrendingMailTest() {
  const form = $("#trending-mail-form");

  if (!form || !isAdmin()) {
    return;
  }

  try {
    const settings = collectTrendingMailSettingsFromForm(form);
    state.trendingMailLoading = true;
    state.trendingMailError = "";
    renderTrendingPeople();
    const response = await fetch("/api/trending-mail", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "test",
        settings,
        report: {
          reportDate: state.trendingReport?.targetDate ||
            state.trendingReport?.reportDate ||
            state.trendingSelectedDate ||
            ""
        },
        requestedBy: getCurrentActorName()
      })
    });
    const payload = await readApiJson(response, "테스트 메일 발송");

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Trending mail send failed: ${response.status}`);
    }

    state.trendingMailSettings = normalizeTrendingMailSettings(payload.settings || settings);
    const recipientCount = Number(payload.recipientCount || settings.recipients.length || 0);
    state.trendingMailStatus = `${payload.message || "테스트 메일 발송을 요청했습니다."}${recipientCount ? ` · 수신처 ${recipientCount}명` : ""}`;
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

function collectTrendingProfileFromForm(form, existingPerson) {
  const sourceLink = {
    source: String(form.source.value || "").trim(),
    title: String(form.sourceTitle.value || "").trim(),
    snippet: String(form.sourceSnippet.value || "").trim(),
    url: String(form.sourceUrl.value || "").trim()
  };
  const hasSourceLink = sourceLink.url || sourceLink.title || sourceLink.source || sourceLink.snippet;
  const reasons = splitNonEmptyLines(form.selectionReasons.value).slice(0, 2).map((text, index, array) => ({
    text,
    links: hasSourceLink && index === array.length - 1 ? [sourceLink] : []
  }));

  if (!reasons.length && hasSourceLink) {
    reasons.push({
      text: sourceLink.snippet || sourceLink.title || "근거 기사 확인 필요",
      links: [sourceLink]
    });
  }

  return {
    ...existingPerson,
    name: String(form.name.value || "").trim(),
    birthYear: String(form.birthYear.value || "").trim(),
    currentOrg: String(form.currentOrg.value || "").trim(),
    currentTitle: String(form.currentTitle.value || "").trim(),
    profileImageUrl: "",
    linkedinUrl: String(form.linkedinUrl.value || "").trim(),
    education: parseTrendingEducationLines(form.education.value),
    career: parseTrendingCareerLines(form.career.value),
    achievements: splitNonEmptyLines(form.achievements.value).slice(0, 6),
    selectionReasons: reasons,
    editedAt: new Date().toISOString(),
    editedBy: getCurrentActorName()
  };
}

async function saveTrendingProfileEdit() {
  const form = $("#trending-profile-edit-form");

  if (!form || !isAdmin()) {
    return;
  }

  const person = findTrendingPerson(form.dataset.trendingProfileId);

  if (!person) {
    state.trendingProfileError = "수정할 인물 프로필을 찾을 수 없습니다.";
    renderTrendingPeople();
    return;
  }

  try {
    const updatedPerson = collectTrendingProfileFromForm(form, person);

    if (!updatedPerson.name) {
      throw new Error("이름을 입력해주세요.");
    }

    state.trendingProfileSaving = true;
    state.trendingProfileError = "";
    renderTrendingPeople();

    const response = await fetch("/api/trending-people", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updatePerson",
        targetDate: state.trendingReport?.targetDate || state.trendingReport?.reportDate,
        personId: trendingPersonIdentifier(person),
        person: updatedPerson,
        updatedBy: getCurrentActorName()
      })
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Today's Talent profile save failed: ${response.status}`);
    }

    state.trendingReport = payload.report;
    state.trendingSelectedDate = payload.report?.targetDate || payload.report?.reportDate || state.trendingSelectedDate;
    state.trendingModal = "";
    state.trendingEditingPersonId = "";
    addAuditLog("Today's Talent 프로필 수정", "Today's Talent", updatedPerson.name);
    persistState();
    fetchTrendingHistory({ silent: true });
    showToast("Today's Talent 프로필을 저장했습니다.");
  } catch (error) {
    console.warn("Trending profile save failed.", error);
    state.trendingProfileError = error.message || "Today's Talent 프로필 저장에 실패했습니다.";
    showToast(state.trendingProfileError);
  } finally {
    state.trendingProfileSaving = false;
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
    photoUrl: "",
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
  const englishName = form.get("englishName").toString().trim();
  const role = form.get("role").toString().trim();
  const summary = form.get("summary").toString().trim();
  const visibility = normalizeCandidateVisibility(form.get("visibility"));
  let organization = normalizeBusinessUnit(form.get("organization"));
  if (visibility === "business_unit" && !organization) {
    organization = getMemberBusinessUnit();
  }
  const birthYear = form.get("birthYear").toString().trim();
  const owner = normalizeOwnerSelection(form.get("owner"));
  const today = getTodayDate();

  const education = collectRegisterEducationFromForm(formElement);
  const career = collectRegisterCareerFromForm(formElement);
  const candidateName = name || "이름 미입력";
  const candidateCompany = career[0]?.company || "";
  const candidateRole = role;
  const skills = form
    .get("skills")
    .toString()
    .split(/[,;\n]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);
  const photoFile = form.get("photo");
  const resumeFile = form.get("resume");
  const otherAttachmentFiles = form.getAll("otherAttachments").filter((file) => file && file.size);
  let photoUrl = state.registerExtractedPhotoUrl || "";
  let resumeAttachment = null;
  let attachments = [];

  if (photoFile && photoFile.size) {
    try {
      photoUrl = await readProfilePhotoAsDataUrl(photoFile);
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

  if (otherAttachmentFiles.length) {
    try {
      attachments = (await Promise.all(otherAttachmentFiles.map(attachmentFromFile))).filter(Boolean);
    } catch (error) {
      console.warn("Additional attachments could not be read.", error);
      showToast("기타 첨부파일을 저장하지 못했습니다. 파일을 확인해주세요.");
      return;
    }
  }

  const candidate = {
    id: `cand-${Date.now()}`,
    name: candidateName,
    initials: name ? `${name.slice(0, 1)}${name.slice(-1)}` : "미",
    role: candidateRole,
    company: candidateCompany,
    englishName,
    years: estimateCareerYears(career),
    jobFamily: "Equipment Software",
    organization,
    visibility,
    status: "interested",
    owner,
    createdAt: today,
    updatedAt: today,
    syncUpdatedAt: new Date().toISOString(),
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
    nationality: form.get("nationality").toString().trim(),
    linkedinUrl: form.get("linkedinUrl").toString().trim(),
    referenceUrl: form.get("referenceUrl").toString().trim(),
    referenceUrl2: form.get("referenceUrl2").toString().trim(),
    referenceUrl3: form.get("referenceUrl3").toString().trim(),
    attachments,
    education,
    career,
    skills,
    tags: ["신규 등록", "검수 필요"],
    summary,
    evidence: [
      "업로드 이력서에서 후보자 정보를 자동 입력",
      "키워드 자동 생성",
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
  try {
    await upsertCandidateToSupabase(candidate);
  } catch (error) {
    console.warn("Candidate remote save failed.", error);
    showToast("화면에는 등록됐지만 원격 DB 저장 확인에 실패했습니다. 잠시 후 다시 동기화됩니다.");
  }
  showToast(`${candidate.name} 후보자가 등록되었습니다.`);
  setView("detail");
}

function updatePoolFilters() {
  state.poolFilters.query = $("#pool-query")?.value || "";
  state.poolFilters.status = $("#pool-status")?.value || "all";
  state.poolFilters.businessUnit = $("#pool-business-unit")?.value || "all";
  state.poolFilters.owner = $("#pool-owner")?.value || "all";
  state.poolFilters.sortBy = normalizePoolSortBy($("#pool-sort")?.value || state.poolFilters.sortBy);
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

function updateScreeningDynamicRemoveButtons(form, rowSelector, removeSelector) {
  const rows = [...(form?.querySelectorAll(rowSelector) || [])];

  rows.forEach((row) => {
    const button = row.querySelector(removeSelector);

    if (button) {
      button.disabled = rows.length <= 1;
    }
  });
}

function addScreeningInterviewerRow(form) {
  const list = form?.querySelector("[data-screening-interviewer-list]");

  if (!list) {
    return;
  }

  const row = document.createElement("div");
  row.className = "screening-interviewer-row";
  row.dataset.screeningInterviewerRow = "";
  row.innerHTML = `
    <input class="control-input" name="interviewerName" placeholder="면접위원 이름" />
    <input class="control-input" name="interviewerEmail" type="email" placeholder="면접위원 메일" />
    <button class="ghost-button compact-button" type="button" data-remove-screening-interviewer>삭제</button>
  `;
  list.append(row);
  updateScreeningDynamicRemoveButtons(form, "[data-screening-interviewer-row]", "[data-remove-screening-interviewer]");
}

function addScreeningSlotRow(form) {
  const list = form?.querySelector("[data-screening-slot-list]");

  if (!list) {
    return;
  }

  const row = document.createElement("div");
  row.className = "screening-slot-row";
  row.dataset.screeningSlotRow = "";
  row.innerHTML = `
    <input class="control-input" name="availabilitySlot" type="datetime-local" data-screening-slot-input />
    <button class="ghost-button compact-button" type="button" data-remove-screening-slot>삭제</button>
  `;
  list.append(row);
  updateScreeningDynamicRemoveButtons(form, "[data-screening-slot-row]", "[data-remove-screening-slot]");
  syncScreeningAvailabilityPreview(form);
}

function removeScreeningDynamicRow(button, rowSelector) {
  const form = button.closest("#screening-final-pass-form");
  const row = button.closest(rowSelector);

  if (!form || !row) {
    return;
  }

  row.remove();
  updateScreeningDynamicRemoveButtons(form, "[data-screening-interviewer-row]", "[data-remove-screening-interviewer]");
  updateScreeningDynamicRemoveButtons(form, "[data-screening-slot-row]", "[data-remove-screening-slot]");
}

function getScreeningAvailabilitySlotsFromForm(form) {
  return [...(form?.querySelectorAll("input[name='availabilitySlot']") || [])]
    .map((input) => String(input.value || "").trim())
    .filter(Boolean);
}

function syncScreeningAvailabilityPreview(form) {
  const output = form?.querySelector("textarea[name='availability']");

  if (!output) {
    return;
  }

  const dateInput = form.querySelector("[data-screening-timeline-date]");
  const startInput = form.querySelector("[data-screening-timeline-start]");
  const endInput = form.querySelector("[data-screening-timeline-end]");

  if (dateInput && startInput && endInput) {
    const startHour = normalizeScreeningTimelineHour(startInput.value, 10);
    const endHour = Math.max(startHour + 1, normalizeScreeningTimelineHour(endInput.value, startHour + 1));
    startInput.value = String(Math.min(startHour, 19));
    endInput.value = String(Math.min(endHour, 20));
    output.value = formatScreeningTimelineRange(dateInput.value, startInput.value, endInput.value);
    form.querySelectorAll("[data-screening-time-cell]").forEach((cell) => {
      const hour = Number(cell.dataset.screeningTimeCell);
      cell.classList.toggle("is-selected", hour >= Number(startInput.value) && hour < Number(endInput.value));
    });
    return;
  }

  output.value = buildScreeningAvailabilityText(getScreeningAvailabilitySlotsFromForm(form), output.value);
}

function updateScreeningTimelineSelection(cell, options = {}) {
  const form = cell?.closest("#screening-final-pass-form");
  const startInput = form?.querySelector("[data-screening-timeline-start]");
  const endInput = form?.querySelector("[data-screening-timeline-end]");

  if (!form || !startInput || !endInput) {
    return;
  }

  const hour = normalizeScreeningTimelineHour(cell.dataset.screeningTimeCell, 10);
  const dragStart = Number.isFinite(Number(state.screeningTimelineDrag?.startHour))
    ? Number(state.screeningTimelineDrag.startHour)
    : hour;
  const rangeStart = Math.min(dragStart, hour);
  const rangeEnd = Math.max(dragStart, hour) + 1;

  startInput.value = String(Math.min(rangeStart, 19));
  endInput.value = String(Math.min(rangeEnd, 20));

  if (options.startDrag) {
    state.screeningTimelineDrag = { startHour: hour };
  }

  syncScreeningAvailabilityPreview(form);
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

async function attachmentFromFileWithText(file, text = "") {
  if (!file || !file.size) {
    return null;
  }

  return {
    name: file.name,
    size: file.size,
    type: file.type || "",
    dataUrl: await readFileAsDataUrl(file),
    text: normalizeResumeText(text || "")
  };
}

async function attachmentsFromFiles(fileList) {
  return (await Promise.all([...(fileList || [])].map(attachmentFromFile))).filter(Boolean);
}

async function readScreeningJdFileText(file) {
  try {
    const result = await readResumeText(file);
    return normalizeResumeText(result.text || "");
  } catch (browserError) {
    console.warn("Screening JD browser extraction failed. Trying server extraction.", browserError);

    try {
      const serverResult = await extractDocumentTextWithServer(file, { timeoutMs: 32000 });
      return normalizeResumeText(serverResult.text || "");
    } catch (serverError) {
      console.warn("Screening JD server extraction failed.", serverError);
      throw browserError;
    }
  }
}

async function extractScreeningJdFileToTextarea(file, textareaSelector, statusSelector) {
  if (!file) {
    return;
  }

  const textarea = $(textareaSelector);
  const status = $(statusSelector);

  setProgressStatus(status, "JD 파일을 읽는 중입니다.", 12);

  try {
    const text = await readScreeningJdFileText(file);

    if (!text || text.length < 20) {
      setProgressStatus(status, "JD 파일에서 충분한 텍스트를 추출하지 못했습니다. 직접 입력란에 내용을 입력해 주세요.", 0);
      showToast("JD 파일에서 읽을 수 있는 텍스트가 부족합니다.");
      return;
    }

    const overwrite = textarea?.value.trim()
      ? window.confirm("현재 JD 직접 입력란의 내용을 첨부 JD에서 추출한 텍스트로 교체할까요?")
      : true;

    if (textarea && overwrite) {
      textarea.value = text;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      setProgressStatus(status, "JD 파일 내용을 직접 입력란에 반영했습니다. 이 값으로 직무적합도를 분석합니다.", 100);
      showToast("JD 첨부 파일 내용을 직접 입력란에 반영했습니다.");
      return;
    }

    setProgressStatus(status, "JD 파일은 읽었지만 직접 입력란에는 반영하지 않았습니다.", 100);
  } catch (error) {
    console.warn("Screening JD file extraction failed.", error);
    setProgressStatus(status, error.isResumeParseError ? error.message : "JD 파일을 읽지 못했습니다. 내용을 직접 입력해 주세요.", 0);
    showToast("JD 파일 텍스트 추출에 실패했습니다.");
  }
}

function applyScreeningApplicantDerivedProfile(applicant) {
  const currentProfile = getScreeningCurrentProfileFromCareer(applicant.career || []);
  applicant.company = currentProfile.company;
  applicant.currentRole = currentProfile.currentRole;
  applicant.age = calculateAge(applicant.birthYear);
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
  const jdAttachment = jdFile ? await attachmentFromFile(jdFile) : null;
  const accessMemberIds = [...new Set([currentMember.id, ...getFormValues(form, "accessMemberIds")])];
  const receptionMemberIds = getFormValues(form, "receptionMemberIds");
  const secondScreeningMemberIds = getFormValues(form, "secondScreeningMemberIds");
  const title = getFormText(form, "title") || getFormText(form, "positionName") || "신규 포지션";
  const positionName = normalizeScreeningJobCategory(getFormText(form, "positionName"));
  const jdText = normalizeResumeText(getFormText(form, "jdText") || jdAttachment?.text || "");
  const folder = normalizeScreeningFolder({
    id: createId("screening-folder"),
    title,
    businessUnit: getScreeningFormBusinessUnit(getFormText(form, "businessUnit"), currentMember),
    department: getFormText(form, "department"),
    positionName,
    jdText,
    jdAttachment,
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
  touchScreeningFolder(folder);

  state.screeningFolders.unshift(folder);
  state.selectedScreeningFolderId = folder.id;
  state.screeningPositionModalOpen = false;
  addAuditLog("Screening 포지션 생성", folder.title, "포지션 스크리닝 생성");
  persistState();
  upsertScreeningFolderToSupabase(folder).catch((error) => {
    console.warn("Screening folder remote save failed.", error);
  });
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
  const otherAttachmentFiles = form.elements.otherAttachments?.files || [];
  const birthYear = getFormText(form, "birthYear");
  const education = collectScreeningEducationFromForm(form);
  const career = collectScreeningCareerFromForm(form);
  const applicant = normalizeScreeningApplicant({
    id: createId("screening-applicant"),
    name,
    sourceType,
    searchFirmMemberId,
    registeredById: currentMember.id,
    registeredByName: currentMember.name,
    birthYear,
    nationality: getFormText(form, "nationality"),
    email: getFormText(form, "email"),
    phone: getFormText(form, "phone"),
    education,
    career,
    resumeAttachment: await attachmentFromFile(resumeFile),
    attachments: await attachmentsFromFiles(otherAttachmentFiles),
    stage: "registered",
    createdAt: getTodayDate(),
    updatedAt: getTodayDate()
  });
  applyScreeningApplicantDerivedProfile(applicant);
  const fit = evaluateApplicantFit(folder, applicant);
  applicant.fitGrade = fit.grade;
  applicant.fitComment = fit.comment;

  folder.applicants.unshift(applicant);
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  state.screeningApplicantModalOpen = false;
  state.screeningEditingApplicantId = "";
  state.screeningDetailStep = "first";
  addAuditLog("Screening 지원자 등록", applicant.name, folder.title);
  persistState();
  showToast(isSearchFirmRole(currentMember)
    ? `${applicant.name} 지원자를 1차 스크리닝에 등록했습니다.`
    : `${applicant.name} 지원자를 1차 스크리닝에 등록했습니다.`);
  renderScreening();

  refreshScreeningApplicantFit(folder, applicant)
    .then(() => {
      applicant.updatedAt = getTodayDate();
      folder.updatedAt = getTodayDate();
      replaceScreeningFolder(folder);
      persistState();
      renderScreening();
    })
    .catch((error) => {
      console.warn("Screening fit refresh after applicant registration failed.", error);
    });
}

async function registerScreeningApplicantsBulk(form) {
  const folder = getScreeningFolder(getFormText(form, "folderId"));

  if (!folder || !canRegisterScreeningApplicant(folder)) {
    showToast("지원자를 등록할 수 없는 포지션입니다.");
    return;
  }

  const files = [...(form.elements.resumeFiles?.files || [])];

  if (!files.length) {
    showToast("대량 등록할 이력서 파일을 선택해주세요.");
    return;
  }

  const currentMember = getCurrentMember();
  const sourceType = isSearchFirmRole(currentMember) || getFormText(form, "sourceType") === "search_firm" ? "search_firm" : "direct";
  const searchFirmMemberId = sourceType === "search_firm"
    ? getFormText(form, "searchFirmMemberId") || (isSearchFirmRole(currentMember) ? currentMember.id : "")
    : "";

  if (sourceType === "search_firm" && !searchFirmMemberId) {
    showToast("서치펌 등록 지원자는 서치펌 담당자를 선택해주세요.");
    return;
  }

  const status = $("#screening-bulk-status");
  const createdApplicants = [];
  const warnings = [];
  const submitButton = form.querySelector("button[type='submit']");

  if (submitButton) {
    submitButton.disabled = true;
  }

  try {
    for (const [index, file] of files.entries()) {
      const startPercent = Math.round((index / files.length) * 92);
      setProgressStatus(status, `${index + 1}/${files.length} ${file.name} 파싱 중입니다.`, Math.max(8, startPercent));
      await waitForUiPaint();

      const parsedResult = await parseResumeForScreeningApplicantRecord(file);
      const parsed = parsedResult.parsed || {};
      const name = normalizeInferredCandidateName(parsed.name) || inferCandidateNameFromResume(parsedResult.text, file.name);
      const birthYear = String(parsed.birthYear || "").trim();
      const applicant = normalizeScreeningApplicant({
        id: createId("screening-applicant"),
        name,
        sourceType,
        searchFirmMemberId,
        registeredById: currentMember.id,
        registeredByName: currentMember.name,
        birthYear,
        nationality: parsed.nationality || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        summary: parsed.summary || "",
        education: normalizeScreeningEducationRecords(parsed.education || []),
        career: normalizeScreeningCareerRecords(parsed.career || []),
        resumeAttachment: await attachmentFromFileWithText(file, parsedResult.text),
        attachments: [],
        stage: "registered",
        createdAt: getTodayDate(),
        updatedAt: getTodayDate()
      });

      applyScreeningApplicantDerivedProfile(applicant);
      const fit = evaluateApplicantFit(folder, applicant);
      applicant.fitGrade = fit.grade;
      applicant.fitComment = fit.comment;
      createdApplicants.push(applicant);

      if (parsedResult.parseWarning || !hasParsedResumeValues(parsed)) {
        warnings.push(file.name);
      }
    }

    if (!createdApplicants.length) {
      showToast("등록 가능한 이력서를 찾지 못했습니다.");
      return;
    }

    folder.applicants = [...createdApplicants, ...folder.applicants];
    folder.updatedAt = getTodayDate();
    replaceScreeningFolder(folder);
    state.screeningBulkApplicantModalOpen = false;
    state.screeningDetailStep = "first";
    addAuditLog("Screening 지원자 대량 등록", folder.title, `${createdApplicants.length}명 자동 등록`);
    persistState();
    setProgressStatus(status, `${createdApplicants.length}명 등록을 완료했습니다.`, 100);
    showToast(warnings.length
      ? `${createdApplicants.length}명 등록 완료. ${warnings.length}개 파일은 일부 정보만 추출되었습니다.`
      : `${createdApplicants.length}명 지원자를 1차 스크리닝에 등록했습니다.`);
    renderScreening();

    Promise.allSettled(createdApplicants.map((applicant) => refreshScreeningApplicantFit(folder, applicant)))
      .then(() => {
        folder.updatedAt = getTodayDate();
        replaceScreeningFolder(folder);
        persistState();
        renderScreening();
      })
      .catch((error) => {
        console.warn("Screening fit refresh after bulk registration failed.", error);
      });
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

async function saveScreeningApplicantForm(form) {
  return getFormText(form, "applicantId")
    ? updateScreeningApplicant(form)
    : registerScreeningApplicant(form);
}

async function updateScreeningApplicant(form) {
  const folder = getScreeningFolder(getFormText(form, "folderId"));
  const applicant = getScreeningApplicant(folder, getFormText(form, "applicantId"));

  if (!folder || !applicant || !canEditScreeningApplicant(folder, applicant)) {
    showToast("지원자 정보를 수정할 권한이 없습니다.");
    return;
  }

  const canEditCore = canEditScreeningApplicantCore(folder, applicant);
  const canEditContact = canEditScreeningApplicantContact(folder, applicant);
  const resumeFile = form.elements.resumeFile?.files?.[0];
  const otherAttachmentFiles = form.elements.otherAttachments?.files || [];

  if (canEditCore) {
    const name = getFormText(form, "name");

    if (!name) {
      showToast("지원자 이름을 입력해주세요.");
      return;
    }

    const currentMember = getCurrentMember();
    const sourceType = isSearchFirmRole(currentMember) || getFormText(form, "sourceType") === "search_firm" ? "search_firm" : "direct";
    const searchFirmMemberId = sourceType === "search_firm" ? getFormText(form, "searchFirmMemberId") || applicant.searchFirmMemberId || (isSearchFirmRole() ? currentMember.id : "") : "";

    if (sourceType === "search_firm" && !searchFirmMemberId) {
      showToast("서치펌 등록 지원자는 서치펌 담당자를 선택해주세요.");
      return;
    }

    applicant.name = name;
    applicant.sourceType = sourceType;
    applicant.searchFirmMemberId = searchFirmMemberId;
    applicant.birthYear = getFormText(form, "birthYear");
    applicant.age = calculateAge(applicant.birthYear);
    applicant.nationality = getFormText(form, "nationality");
    applicant.education = normalizeScreeningEducationRecords(collectScreeningEducationFromForm(form));
    applicant.career = normalizeScreeningCareerRecords(collectScreeningCareerFromForm(form));

    if (resumeFile) {
      applicant.resumeAttachment = await attachmentFromFile(resumeFile);
    }

    if (otherAttachmentFiles.length) {
      applicant.attachments = [
        ...(Array.isArray(applicant.attachments) ? applicant.attachments : []),
        ...await attachmentsFromFiles(otherAttachmentFiles)
      ];
    }

    applyScreeningApplicantDerivedProfile(applicant);
    evaluateApplicantFit(folder, applicant);
  }

  if (canEditContact) {
    applicant.email = getFormText(form, "email").toLowerCase();
    applicant.phone = getFormText(form, "phone");

    if (applicant.email && applicant.phone && applicant.stage === "contact_requested") {
      applicant.stage = "contact_ready";
    }
  }

  applicant.updatedAt = getTodayDate();
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  state.screeningApplicantModalOpen = false;
  state.screeningEditingApplicantId = "";
  addAuditLog("Screening 지원자 정보 수정", applicant.name, folder.title);
  persistState();
  showToast(canEditCore ? "지원자 정보를 수정했습니다." : "지원자 연락처를 수정했습니다.");
  renderScreening();
}

async function deleteScreeningApplicant(applicantId) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, applicantId);

  if (!folder || !applicant || !canDeleteScreeningApplicant(folder, applicant)) {
    showToast("지원자를 삭제할 권한이 없거나 이미 스크리닝 단계로 이동했습니다.");
    return;
  }

  if (!window.confirm(`${applicant.name || "지원자"} 접수 정보를 삭제할까요? 삭제 후 복구할 수 없습니다.`)) {
    return;
  }

  folder.applicants = folder.applicants.filter((item) => item.id !== applicant.id);
  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);

  if (state.screeningApplicantDetailId === applicant.id) {
    state.screeningApplicantDetailId = "";
  }
  if (state.screeningEditingApplicantId === applicant.id) {
    state.screeningEditingApplicantId = "";
    state.screeningApplicantModalOpen = false;
  }

  addAuditLog("Screening 지원자 삭제", applicant.name, folder.title);
  persistState();
  showToast("지원자 정보를 삭제했습니다.");
  renderScreening();
}

async function saveScreeningPositionJd(form) {
  const folder = getScreeningFolder(getFormText(form, "folderId"));

  if (!folder || !canManageScreeningFolder(folder)) {
    showToast("JD 정보를 수정할 수 없습니다.");
    return;
  }

  const jdFile = form.elements.jdFile?.files?.[0];
  const jdAttachment = jdFile ? await attachmentFromFile(jdFile) : null;
  const positionName = normalizeScreeningJobCategory(getFormText(form, "positionName"));
  folder.title = getFormText(form, "title") || getFormText(form, "positionName") || folder.title || "신규 포지션";
  folder.businessUnit = getScreeningFormBusinessUnit(getFormText(form, "businessUnit"));
  folder.department = getFormText(form, "department");
  folder.positionName = positionName || folder.positionName;
  folder.jdText = normalizeResumeText(getFormText(form, "jdText") || jdAttachment?.text || "");

  if (jdAttachment) {
    folder.jdAttachment = jdAttachment;
  }

  for (const applicant of folder.applicants) {
    await refreshScreeningApplicantFit(folder, applicant);
  }
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

  if (stage === "first_draft" || stage === "first_pass" || stage === "first_reject") {
    applicant.firstScreening = {
      decision: stage === "first_reject" ? "reject" : stage === "first_pass" ? "pass" : "draft_pass",
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

  addAuditLog("Screening 단계 변경", applicant.name, `${folder.title} · ${SCREENING_STAGE_LABELS[stage]}`);
  persistState();
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
    first_draft: "registered",
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
  } else if (targetStage === "registered") {
    applicant.firstScreening = {
      ...(applicant.firstScreening || {}),
      decision: "reopened",
      by: actor,
      at: getTimestampText(),
      note: "1차 판정 번복"
    };
  } else if (targetStage === "first_pass") {
    applicant.secondScreening = {
      ...(applicant.secondScreening || {}),
      decision: "reopened",
      by: actor,
      at: getTimestampText(),
      note: "2차 판정 번복"
    };
  } else if (targetStage === "second_draft") {
    applicant.secondScreening = {
      ...(applicant.secondScreening || {}),
      decision: "draft_pass",
      by: actor,
      at: getTimestampText(),
      note: "전화면접 단계에서 2차 통과 예정으로 되돌림"
    };
  }

  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  addAuditLog("Screening 단계 되돌리기", applicant.name, `${SCREENING_STAGE_LABELS[previousStage]} → ${SCREENING_STAGE_LABELS[targetStage]}`);
  persistState();
  showToast(`${applicant.name} 지원자를 ${SCREENING_STAGE_LABELS[targetStage]} 단계로 이동했습니다.`);
  renderScreening();
}

function finalizeFirstScreeningResults() {
  const folder = getSelectedScreeningFolder();

  if (!folder || !canRunFirstScreening(folder)) {
    showToast("1차 스크리닝 결과 발송 권한이 없습니다.");
    return;
  }

  const draftApplicants = folder.applicants.filter((applicant) => applicant.stage === "first_draft");

  if (!draftApplicants.length) {
    showToast("1차 합격 예정으로 선택된 지원자가 없습니다.");
    return;
  }

  const actor = getCurrentActorName();
  draftApplicants.forEach((applicant) => {
    applicant.stage = "first_pass";
    applicant.updatedAt = getTodayDate();
    applicant.firstScreening = {
      ...(applicant.firstScreening || {}),
      decision: "pass",
      by: actor,
      at: getTimestampText()
    };
  });

  folder.updatedAt = getTodayDate();
  replaceScreeningFolder(folder);
  state.screeningResultPanelOpen = false;
  addAuditLog("Screening 1차 결과 발송", folder.title, `${draftApplicants.length}명 2차 스크리닝 이동`);
  persistState();
  showToast(`${draftApplicants.length}명을 2차 스크리닝으로 이동했습니다.`);
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
    const alreadyPassed = folder.applicants.some((applicant) => ["second_pass", "contact_requested", "contact_ready", "interview_mail_sent"].includes(applicant.stage));

    if (!alreadyPassed) {
      showToast("2차 합격으로 선택된 지원자가 없습니다.");
      return;
    }
  }

  const names = getFormValues(form, "interviewerName");
  const emails = getFormValues(form, "interviewerEmail");
  const maxMembers = Math.max(names.length, emails.length);
  const members = Array.from({ length: maxMembers }, (_, index) => ({
    name: names[index] || "",
    email: emails[index] || ""
  })).filter((member) => member.name || member.email);
  const slots = getScreeningAvailabilitySlotsFromForm(form);
  const availability = buildScreeningAvailabilityText(slots, getFormText(form, "availability"));
  const timelineDate = normalizeScreeningTimelineDate(getFormText(form, "timelineDate"));
  const timelineStartHour = normalizeScreeningTimelineHour(getFormText(form, "timelineStartHour"), 10);
  const timelineEndHour = Math.max(timelineStartHour + 1, normalizeScreeningTimelineHour(getFormText(form, "timelineEndHour"), 14));

  folder.interviewPanel = {
    names: members.map((member) => member.name).filter(Boolean).join(", "),
    emails: members.map((member) => member.email).filter(Boolean).join(", "),
    availability,
    members,
    slots,
    timelineDate,
    timelineStartHour,
    timelineEndHour
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
  state.screeningResultPanelOpen = false;
  syncInterviewCasesFromScreening();
  addAuditLog("Screening 결과 발송 정보 저장", folder.title, draftApplicants.length ? `${draftApplicants.length}명 2차 합격 확정` : "결과 발송 정보 저장");
  persistState();
  showToast(draftApplicants.length ? `${draftApplicants.length}명을 2차 합격 확정 처리했습니다.` : "결과 발송 정보를 저장했습니다.");
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

function updateScreeningOpinion(input, options = {}) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, input?.dataset.screeningOpinionApplicant);
  const stage = input?.dataset.screeningOpinionStage || "reception";

  if (!folder || !applicant || !canEditScreeningOpinion(folder, stage, applicant)) {
    return;
  }

  const value = String(input.value || "").trim();

  if (stage === "first") {
    applicant.firstOpinion = value;
  } else if (stage === "second") {
    applicant.secondOpinion = value;
  } else {
    applicant.receptionOpinion = value;
  }

  applicant.updatedAt = getTodayDate();
  folder.updatedAt = getTodayDate();

  if (options.persist) {
    replaceScreeningFolder(folder);
    persistState();
  }
}

function getSearchFirmMember(applicant) {
  return state.members.find((member) => member.id === applicant.searchFirmMemberId || member.id === applicant.registeredById) || null;
}

function compactScreeningMailApplicant(applicant = {}) {
  return {
    id: String(applicant.id || "").trim(),
    name: String(applicant.name || "").trim(),
    email: String(applicant.email || "").trim(),
    phone: String(applicant.phone || "").trim(),
    sourceType: String(applicant.sourceType || "").trim(),
    registeredById: String(applicant.registeredById || "").trim(),
    registeredByName: String(applicant.registeredByName || "").trim(),
    searchFirmMemberId: String(applicant.searchFirmMemberId || "").trim()
  };
}

function compactScreeningMailPanel(panel = {}) {
  return {
    availability: String(panel.availability || "").trim(),
    names: Array.isArray(panel.names) ? panel.names.map((item) => String(item || "").trim()).filter(Boolean) : [],
    emails: normalizeEmailList(panel.emails || []),
    members: Array.isArray(panel.members)
      ? panel.members.map((member) => ({
        name: String(member?.name || "").trim(),
        email: String(member?.email || "").trim(),
        role: String(member?.role || "").trim(),
        level: String(member?.level || "").trim()
      })).filter((member) => member.name || member.email)
      : []
  };
}

function compactScreeningMailFolder(folder = {}) {
  return {
    id: String(folder.id || "").trim(),
    title: String(folder.title || "").trim(),
    positionName: String(folder.positionName || folder.title || "").trim(),
    department: String(folder.department || "").trim(),
    jobRole: String(folder.jobRole || "").trim(),
    interviewPanel: compactScreeningMailPanel(folder.interviewPanel || {})
  };
}

function compactInterviewMailCase(interviewCase = {}) {
  return {
    id: String(interviewCase.id || "").trim(),
    candidateName: String(interviewCase.candidateName || "").trim(),
    positionName: String(interviewCase.positionName || "").trim(),
    department: String(interviewCase.department || "").trim()
  };
}

function compactInterviewMailStage(stage = {}) {
  return {
    id: String(stage.id || "").trim(),
    label: String(stage.label || "").trim(),
    requirement: String(stage.requirement || "").trim(),
    documents: Array.isArray(stage.documents)
      ? stage.documents.map((item) => ({
        owner: String(item?.owner || "").trim(),
        label: String(item?.label || "").trim()
      })).filter((item) => item.owner || item.label)
      : []
  };
}

function compactInterviewMailStageData(stageData = {}) {
  return {
    confirmedAt: String(stageData.confirmedAt || "").trim(),
    panel: Array.isArray(stageData.panel)
      ? stageData.panel.map((member) => ({
        name: String(member?.name || "").trim(),
        email: String(member?.email || "").trim(),
        role: String(member?.role || "").trim(),
        level: String(member?.level || "").trim()
      })).filter((member) => member.name || member.email)
      : []
  };
}

function compactScreeningMailPayload(payload = {}) {
  return {
    ...payload,
    folder: payload.folder ? compactScreeningMailFolder(payload.folder) : undefined,
    applicant: payload.applicant ? compactScreeningMailApplicant(payload.applicant) : undefined,
    interviewPanel: payload.interviewPanel ? compactScreeningMailPanel(payload.interviewPanel) : undefined,
    interviewCase: payload.interviewCase ? compactInterviewMailCase(payload.interviewCase) : undefined,
    stage: payload.stage ? compactInterviewMailStage(payload.stage) : undefined,
    stageData: payload.stageData ? compactInterviewMailStageData(payload.stageData) : undefined
  };
}

async function sendScreeningMail(payload) {
  const compactPayload = compactScreeningMailPayload(payload);
  const response = await fetch("/api/screening-mail", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(compactPayload)
  });
  const result = await readApiJson(response, "Screening 메일 발송");

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "메일 발송에 실패했습니다.");
  }

  return result;
}

function buildScreeningContactRequestPreview(applicantId) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, applicantId);
  const searchFirm = applicant ? getSearchFirmMember(applicant) : null;

  if (!folder || !applicant || applicant.sourceType !== "search_firm") {
    showToast("서치펌 등록 지원자에게만 연락처 요청 메일을 보낼 수 있습니다.");
    return null;
  }

  if (!searchFirm?.email) {
    showToast("서치펌 담당자 이메일이 없습니다.");
    return null;
  }

  return {
    type: "contact_request",
    applicantId: applicant.id,
    title: "서치펌 연락처 요청 메일",
    recipientsText: searchFirm.email,
    subject: `[TalentHub Screening] ${applicant.name || "지원자"} 연락처 정보 요청`,
    body: [
      `${searchFirm.name || "서치펌 담당자"}님`,
      "",
      "아래 지원자가 2차 스크리닝을 통과하여 전화면접 안내를 위한 연락처 확인이 필요합니다.",
      "",
      `지원자명: ${applicant.name || "-"}`,
      `채용 부서명: ${folder.department || "-"}`,
      `포지션명: ${folder.positionName || folder.title || "-"}`,
      "",
      "TalentHub Screening 메뉴에서 지원자의 이메일 주소와 휴대폰 번호를 입력해주세요."
    ].join("\n")
  };
}

function buildPhoneInterviewPreview(applicantId) {
  const folder = getSelectedScreeningFolder();
  const applicant = getScreeningApplicant(folder, applicantId);

  if (!folder || !applicant) {
    showToast("지원자 정보를 찾지 못했습니다.");
    return null;
  }

  if (!applicant.email || !applicant.phone) {
    showToast("지원자 이메일과 휴대폰 번호를 먼저 입력해주세요.");
    return null;
  }

  if (!folder.interviewPanel.availability) {
    showToast("면접 가능 시간대를 먼저 입력해주세요.");
    return null;
  }

  const interviewerEmails = normalizeEmailList(folder.interviewPanel.emails);
  const recipients = normalizeEmailList([applicant.email, ...interviewerEmails]);

  return {
    type: "phone_interview",
    applicantId: applicant.id,
    title: "전화면접 안내 메일",
    recipientsText: recipients.join("\n"),
    subject: `[TalentHub Screening] ${applicant.name || "후보자"} 전화면접 안내`,
    body: [
      `${applicant.name || "후보자"}님`,
      "",
      "전화면접 가능 시간대를 안내드립니다.",
      "",
      `후보자 이름: ${applicant.name || "-"}`,
      `면접 가능 시간대: ${folder.interviewPanel.availability || "-"}`,
      `채용 부서명: ${folder.department || "-"}`,
      `포지션명: ${folder.positionName || folder.title || "-"}`,
      "",
      "위 시간대 중 가능한 일정을 회신해주세요."
    ].join("\n")
  };
}

function openScreeningMailPreview(type, applicantId) {
  const preview = type === "contact_request"
    ? buildScreeningContactRequestPreview(applicantId)
    : buildPhoneInterviewPreview(applicantId);

  if (!preview) {
    return;
  }

  const template = state.screeningMailTemplates?.[preview.type];
  if (template) {
    preview.subject = template.subject || preview.subject;
    preview.body = template.body || preview.body;
  }

  state.screeningMailPreview = preview;
  renderScreening();
}

function saveScreeningMailTemplateFromPreview(form) {
  const preview = state.screeningMailPreview;

  if (!preview) {
    return;
  }

  const formData = new FormData(form);
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!subject || !body) {
    showToast("저장할 제목과 본문을 입력해주세요.");
    return;
  }

  state.screeningMailTemplates = {
    ...(state.screeningMailTemplates || {}),
    [preview.type]: { subject, body, savedAt: getTimestampText(), savedBy: getCurrentActorName() }
  };
  persistState();
  showToast("메일 양식을 저장했습니다.");
}

async function sendScreeningMailPreview(form) {
  const preview = state.screeningMailPreview;

  if (!preview) {
    return;
  }

  const formData = new FormData(form);
  const recipients = normalizeEmailList(formData.get("recipients"));
  const subject = String(formData.get("subject") || "").trim();
  const text = String(formData.get("body") || "").trim();

  if (!recipients.length || !subject || !text) {
    showToast("수신자, 제목, 본문을 모두 입력해주세요.");
    return;
  }

  const mailOverride = { recipients, subject, text };

  if (preview.type === "contact_request") {
    await requestScreeningContact(preview.applicantId, mailOverride);
  } else {
    await sendPhoneInterviewMail(preview.applicantId, mailOverride);
  }

  state.screeningMailPreview = null;
  renderScreening();
}

async function requestScreeningContact(applicantId, mailOverride = null) {
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
    applicant,
    mailOverride
  });

  const sentRecipientText = normalizeEmailList(mailOverride?.recipients || searchFirm.email).join(", ") || searchFirm.email;

  applicant.stage = "contact_requested";
  applicant.contactRequest = {
    sentAt: getTimestampText(),
    recipient: sentRecipientText,
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

async function sendPhoneInterviewMail(applicantId, mailOverride = null) {
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
    interviewPanel: folder.interviewPanel,
    mailOverride
  });

  const sentRecipientText = normalizeEmailList(mailOverride?.recipients || [applicant.email, ...interviewerEmails]).join(", ");

  applicant.stage = "interview_mail_sent";
  applicant.phoneInterviewMail = {
    sentAt: getTimestampText(),
    recipients: sentRecipientText,
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

function selectInterviewCase(interviewCaseId) {
  const interviewCase = getVisibleInterviewCases().find((item) => item.id === interviewCaseId);

  if (!interviewCase) {
    showToast("인터뷰 대상자 조회 권한이 없거나 정보를 찾을 수 없습니다.");
    return;
  }

  state.selectedInterviewCaseId = interviewCase.id;
  state.selectedInterviewStage = interviewCase.currentStage || "phone";
  persistState();
  renderInterviewView();
}

function selectInterviewStage(stageId) {
  if (!INTERVIEW_STAGE_IDS.includes(stageId)) {
    return;
  }

  state.selectedInterviewStage = stageId;
  persistState();
  renderInterviewView();
}

function markInterviewStageActive(interviewCase, stageId, status = "scheduling") {
  const stage = getInterviewStage(interviewCase, stageId);

  if (!["passed", "failed"].includes(stage.status)) {
    stage.status = status;
  }
}

function addInterviewSlot(interviewCaseId, stageId, slotType) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, stageId);
    stage[slotType] = Array.isArray(stage[slotType]) ? stage[slotType] : [];
    stage[slotType].push("");
    markInterviewStageActive(interviewCase, stageId);
  });
  renderInterviewView();
}

function removeInterviewSlot(interviewCaseId, stageId, slotType, index) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, stageId);
    stage[slotType] = (stage[slotType] || []).filter((_, itemIndex) => itemIndex !== index);
    markInterviewStageActive(interviewCase, stageId);
  });
  renderInterviewView();
}

function updateInterviewSlot(input, options = {}) {
  const index = Number(input.dataset.interviewSlotIndex);
  const slotType = input.dataset.interviewSlotType;

  if (!slotType || !Number.isInteger(index)) {
    return;
  }

  mutateInterviewCase(input.dataset.interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, input.dataset.interviewStage);
    const slots = Array.isArray(stage[slotType]) ? [...stage[slotType]] : [];
    slots[index] = String(input.value || "").trim();
    stage[slotType] = slots.filter(Boolean);
    markInterviewStageActive(interviewCase, input.dataset.interviewStage);
  }, { persist: options.persist !== false });

  if (options.rerender) {
    renderInterviewView();
  }
}

function updateInterviewConfirmed(input) {
  mutateInterviewCase(input.dataset.interviewCaseId, (interviewCase) => {
    const stageId = input.dataset.interviewStage;
    const stage = getInterviewStage(interviewCase, stageId);
    stage.confirmedAt = String(input.value || "").trim();
    stage.status = stage.confirmedAt ? "scheduled" : "scheduling";
    interviewCase.currentStage = stageId;
  });
  renderInterviewView();
}

function updateInterviewAutoMail(input) {
  mutateInterviewCase(input.dataset.interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, input.dataset.interviewStage);
    stage.phoneOperation = {
      ...(stage.phoneOperation || normalizePhoneInterviewOperation()),
      autoMail: Boolean(input.checked),
      lastChangedBy: getCurrentActorName(),
      lastChangedAt: getTimestampText()
    };
    markInterviewStageActive(interviewCase, input.dataset.interviewStage);
  });
  showToast(input.checked ? "자동 연락 준비를 켰습니다." : "자동 연락 준비를 껐습니다.");
  renderInterviewView();
}

function getNextPhoneOperationMailType(target, status, stage) {
  if (target === "candidate" && status === "unavailable") {
    return "panel_request";
  }

  if (target === "candidate" && status === "available" && stage.confirmedAt) {
    return "combined_schedule";
  }

  if (target === "interviewer" && status === "available" && stage.confirmedAt) {
    return "combined_schedule";
  }

  if (target === "interviewer" && status === "unavailable") {
    return "candidate_request";
  }

  if (target === "candidate" && status === "change_requested") {
    return "panel_request";
  }

  if (target === "interviewer" && status === "change_requested") {
    return "candidate_request";
  }

  return "";
}

function updatePhoneOperationStatus(interviewCaseId, stageId, descriptor) {
  const [target, status] = String(descriptor || "").split(":");

  if (!["candidate", "interviewer"].includes(target) || !["available", "unavailable", "change_requested"].includes(status)) {
    return;
  }

  let shouldOpenMailType = "";

  const savedCase = mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, stageId);
    const operation = {
      ...(stage.phoneOperation || normalizePhoneInterviewOperation()),
      lastChangedBy: getCurrentActorName(),
      lastChangedAt: getTimestampText()
    };

    if (target === "candidate") {
      operation.candidateStatus = status;
      if (status === "change_requested") {
        operation.changeReason = "후보자 일정 변경 요청";
        operation.interviewerStatus = "pending";
        stage.confirmedAt = "";
      }
    } else {
      operation.interviewerStatus = status;
      if (status === "change_requested") {
        operation.changeReason = "면접위원 일정 변경 요청";
        stage.confirmedAt = "";
      }
    }

    if (status === "unavailable" || status === "change_requested") {
      stage.status = "scheduling";
    } else if (status === "available") {
      markInterviewStageActive(interviewCase, stageId);
    }

    stage.phoneOperation = normalizePhoneInterviewOperation(operation);
    shouldOpenMailType = operation.autoMail ? getNextPhoneOperationMailType(target, status, stage) : "";
  });

  if (!savedCase) {
    return;
  }

  const statusLabel = {
    available: "참석 가능",
    unavailable: "참석 불가",
    change_requested: "일정 변경 요청"
  }[status];

  addAuditLog("전화면접 일정 상태 변경", savedCase.candidateName, `${target === "candidate" ? "후보자" : "면접위원"} · ${statusLabel}`);

  if (shouldOpenMailType) {
    openInterviewMailPreview(shouldOpenMailType, interviewCaseId, stageId);
    return;
  }

  showToast(`${target === "candidate" ? "후보자" : "면접위원"} 상태를 ${statusLabel}로 기록했습니다.`);
  renderInterviewView();
}

function addInterviewPanelMember(interviewCaseId, stageId) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, stageId);
    stage.panel.push({ role: "", level: "", name: "", email: "" });
    markInterviewStageActive(interviewCase, stageId);
  });
  renderInterviewView();
}

function removeInterviewPanelMember(interviewCaseId, stageId, index) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, stageId);
    stage.panel = stage.panel.filter((_, itemIndex) => itemIndex !== index);
    if (!stage.panel.length) {
      stage.panel = defaultInterviewPanel(stageId);
    }
    markInterviewStageActive(interviewCase, stageId);
  });
  renderInterviewView();
}

function updateInterviewPanelField(input, options = {}) {
  const index = Number(input.dataset.interviewPanelIndex);
  const field = input.dataset.interviewPanelField;

  if (!["role", "level", "name", "email"].includes(field) || !Number.isInteger(index)) {
    return;
  }

  mutateInterviewCase(input.dataset.interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, input.dataset.interviewStage);
    stage.panel[index] = {
      ...(stage.panel[index] || { role: "", level: "", name: "", email: "" }),
      [field]: field === "email" ? String(input.value || "").trim().toLowerCase() : String(input.value || "").trim()
    };
    markInterviewStageActive(interviewCase, input.dataset.interviewStage);
  }, { persist: options.persist !== false });
}

function updateInterviewNote(textarea, options = {}) {
  mutateInterviewCase(textarea.dataset.interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, textarea.dataset.interviewStage);
    stage.note = String(textarea.value || "").trim();
    markInterviewStageActive(interviewCase, textarea.dataset.interviewStage);
  }, { persist: options.persist !== false });
}

async function uploadInterviewDocument(input) {
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  const documentId = input.dataset.interviewDocumentUpload;
  const attachment = await attachmentFromFile(file);

  if (!attachment) {
    showToast("첨부 파일을 읽지 못했습니다.");
    return;
  }

  mutateInterviewCase(input.dataset.interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, input.dataset.interviewStage);
    stage.documents[documentId] = {
      ...attachment,
      uploadedAt: getTimestampText(),
      uploadedBy: getCurrentActorName()
    };
    markInterviewStageActive(interviewCase, input.dataset.interviewStage);
  });
  input.value = "";
  showToast("인터뷰 제출자료를 등록했습니다.");
  renderInterviewView();
}

function getInterviewStageRevertStatus(stage) {
  if (stage.confirmedAt) {
    return "scheduled";
  }

  if (
    stage.candidateSlots?.length ||
    stage.interviewerSlots?.length ||
    stage.note ||
    stage.mailHistory?.length
  ) {
    return "scheduling";
  }

  return "waiting";
}

function clearInterviewOfferProgress(interviewCase) {
  interviewCase.finalDecision = "";
  interviewCase.status = "in_progress";
  interviewCase.offerSignedAt = "";
  interviewCase.offerSignedBy = "";
  interviewCase.offerSyncedToMetricsAt = "";
  interviewCase.joinedAt = "";
  interviewCase.joinedBy = "";
}

function revertInterviewStagePass(interviewCaseId, stageId) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const stageIndex = INTERVIEW_STAGE_IDS.indexOf(stageId);

    if (stageIndex < 0) {
      return;
    }

    const stage = getInterviewStage(interviewCase, stageId);
    stage.status = getInterviewStageRevertStatus(stage);

    INTERVIEW_STAGE_IDS.slice(stageIndex + 1).forEach((nextStageId) => {
      const nextStage = getInterviewStage(interviewCase, nextStageId);
      nextStage.status = "waiting";
    });

    interviewCase.currentStage = stageId;
    clearInterviewOfferProgress(interviewCase);
    state.selectedInterviewStage = stageId;
  });
  addAuditLog("Interview 합격 취소", findInterviewCase(interviewCaseId)?.candidateName || "-", getInterviewStageConfig(stageId).label);
  showToast(`${getInterviewStageConfig(stageId).label} 합격 처리를 취소했습니다.`);
  renderInterviewView();
}

function revertFinalInterviewCase(interviewCaseId) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const hrStage = getInterviewStage(interviewCase, "hr");
    hrStage.status = getInterviewStageRevertStatus(hrStage);
    interviewCase.currentStage = "hr";
    clearInterviewOfferProgress(interviewCase);
    state.selectedInterviewStage = "hr";
  });
  addAuditLog("Interview 최종 합격 취소", findInterviewCase(interviewCaseId)?.candidateName || "-", "최종 결과");
  showToast("최종 면접 합격 처리를 취소했습니다.");
  renderInterviewView();
}

function deleteInterviewCase(interviewCaseId) {
  const interviewCase = findInterviewCase(interviewCaseId);

  if (!interviewCase || !canViewInterviewCase(interviewCase)) {
    showToast("삭제할 인터뷰 대상자를 찾을 수 없습니다.");
    return;
  }

  const confirmed = window.confirm(`${interviewCase.candidateName || "선택한 대상자"} 인터뷰 케이스를 삭제할까요?`);

  if (!confirmed) {
    return;
  }

  rememberDeletedInterviewCaseId(interviewCase.id);

  if (state.selectedInterviewCaseId === interviewCase.id) {
    const nextCase = getVisibleInterviewCases()[0];
    state.selectedInterviewCaseId = nextCase?.id || "";
    state.selectedInterviewStage = nextCase?.currentStage || "phone";
  }

  addAuditLog("Interview 대상자 삭제", interviewCase.candidateName || "-", interviewCase.positionName || "");
  persistState();
  syncInterviewCasesToSupabase().catch((error) => {
    console.warn("Interview cases remote save failed.", error);
  });
  showToast("인터뷰 대상자 리스트에서 삭제했습니다.");
  renderInterviewView();
}

function passInterviewStage(interviewCaseId, stageId) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, stageId);
    const stageIndex = INTERVIEW_STAGE_IDS.indexOf(stageId);
    const nextStageId = INTERVIEW_STAGE_IDS[stageIndex + 1];

    stage.status = "passed";

    if (nextStageId) {
      interviewCase.currentStage = nextStageId;
      const nextStage = getInterviewStage(interviewCase, nextStageId);
      if (nextStage.status === "waiting") {
        nextStage.status = "scheduling";
      }
      state.selectedInterviewStage = nextStageId;
    } else {
      interviewCase.status = "passed";
      interviewCase.finalDecision = "passed";
      state.selectedInterviewStage = stageId;
    }
  });
  addAuditLog("Interview 단계 합격", findInterviewCase(interviewCaseId)?.candidateName || "-", getInterviewStageConfig(stageId).label);
  showToast(`${getInterviewStageConfig(stageId).label} 합격 처리했습니다.`);
  renderInterviewView();
}

function failInterviewStage(interviewCaseId, stageId) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    const stage = getInterviewStage(interviewCase, stageId);
    stage.status = "failed";
    interviewCase.currentStage = stageId;
    interviewCase.status = "failed";
    interviewCase.finalDecision = "failed";
    state.selectedInterviewStage = stageId;
  });
  addAuditLog("Interview 단계 불합격", findInterviewCase(interviewCaseId)?.candidateName || "-", getInterviewStageConfig(stageId).label);
  showToast(`${getInterviewStageConfig(stageId).label} 불합격 처리했습니다.`);
  renderInterviewView();
}

function finalizeInterviewCase(interviewCaseId, decision) {
  mutateInterviewCase(interviewCaseId, (interviewCase) => {
    interviewCase.status = decision === "passed" ? "passed" : "failed";
    interviewCase.finalDecision = decision === "passed" ? "passed" : "failed";
    if (decision === "passed") {
      INTERVIEW_STAGE_IDS.forEach((stageId) => {
        const stage = getInterviewStage(interviewCase, stageId);
        if (stage.status !== "failed") {
          stage.status = "passed";
        }
      });
      interviewCase.currentStage = "hr";
      state.selectedInterviewStage = "hr";
    }
  });
  addAuditLog("Interview 최종 결과", findInterviewCase(interviewCaseId)?.candidateName || "-", decision === "passed" ? "합격" : "불합격");
  showToast(decision === "passed" ? "면접 합격자로 확정했습니다." : "면접 불합격으로 확정했습니다.");
  renderInterviewView();
}

function getInterviewMailRecipients(interviewCase, stageId, mailType) {
  const stage = getInterviewStage(interviewCase, stageId);
  const panelEmails = (stage.panel || []).map((member) => member.email).filter(Boolean);
  const candidateEmail = interviewCase.email ? [interviewCase.email] : [];

  if (mailType === "reject") {
    return normalizeEmailList(candidateEmail);
  }

  return normalizeEmailList([...candidateEmail, ...panelEmails]);
}

function buildInterviewScheduleText(stage) {
  const confirmed = formatScreeningAvailabilitySlot(stage.confirmedAt);
  const candidateSlots = (stage.candidateSlots || []).map(formatScreeningAvailabilitySlot).filter(Boolean);
  const interviewerSlots = (stage.interviewerSlots || []).map(formatScreeningAvailabilitySlot).filter(Boolean);
  const lines = [];

  if (confirmed) {
    lines.push(`확정 일정: ${confirmed}`);
  }

  if (candidateSlots.length) {
    lines.push("지원자 가능 시간", ...candidateSlots.map((slot) => `- ${slot}`));
  }

  if (interviewerSlots.length) {
    lines.push("면접위원 가능 시간", ...interviewerSlots.map((slot) => `- ${slot}`));
  }

  return lines.join("\n");
}

function getInterviewPanelEmails(stage) {
  return normalizeEmailList((stage.panel || []).map((member) => member.email).filter(Boolean));
}

function buildPhoneInterviewContextText(interviewCase, stage) {
  const candidateSlots = (stage.candidateSlots || []).map(formatScreeningAvailabilitySlot).filter(Boolean);
  const interviewerSlots = (stage.interviewerSlots || []).map(formatScreeningAvailabilitySlot).filter(Boolean);
  const confirmed = formatScreeningAvailabilitySlot(stage.confirmedAt);
  const lines = [
    `지원자명: ${interviewCase.candidateName || "-"}`,
    `채용 부서명: ${interviewCase.department || "-"}`,
    `포지션명: ${interviewCase.positionName || "-"}`
  ];

  if (candidateSlots.length) {
    lines.push("", "지원자 가능 시간대", ...candidateSlots.map((slot) => `- ${slot}`));
  }

  if (interviewerSlots.length) {
    lines.push("", "면접위원 가능 시간대", ...interviewerSlots.map((slot) => `- ${slot}`));
  }

  if (confirmed) {
    lines.push("", `확정 일정: ${confirmed}`);
  }

  return lines.join("\n");
}

function getInterviewMailDraft(interviewCaseId, stageId, mailType) {
  const interviewCase = findInterviewCase(interviewCaseId);

  if (!interviewCase || !canViewInterviewCase(interviewCase)) {
    showToast("인터뷰 정보를 찾을 수 없습니다.");
    return null;
  }

  const stage = getInterviewStage(interviewCase, stageId);
  const config = getInterviewStageConfig(stageId);
  const panelEmails = getInterviewPanelEmails(stage);
  const candidateEmail = interviewCase.email ? [interviewCase.email] : [];
  const context = buildPhoneInterviewContextText(interviewCase, stage);
  const scheduleText = buildInterviewScheduleText(stage);
  const candidateName = interviewCase.candidateName || "지원자";
  const stageLabel = config.label || "인터뷰";
  const drafts = {
    candidate_request: {
      title: "후보자 전화면접 일정 확인 요청",
      action: "interview_step_request",
      recipients: candidateEmail,
      subject: `[TalentHub Interview] ${candidateName} ${stageLabel} 일정 가능 여부 확인 요청`,
      body: [
        `${candidateName}님,`,
        "",
        "전화면접 진행을 위해 일정 가능 여부 확인과 개인정보 수집이용 동의서 서명을 요청드립니다.",
        "아래 정보를 확인하신 뒤 참석 가능한 시간대를 회신해주세요.",
        "",
        context,
        "",
        "회신 요청사항",
        "- 참석 가능한 일정 범위",
        "- 개인정보 수집이용 동의서 서명본",
        "- 일정 참석이 어려운 경우 가능한 대체 시간대"
      ].join("\n")
    },
    panel_request: {
      title: "면접위원 전화면접 참석 가능 여부 문의",
      action: "interview_step_request",
      recipients: panelEmails,
      subject: `[TalentHub Interview] ${candidateName} ${stageLabel} 면접위원 참석 가능 여부 확인`,
      body: [
        "안녕하세요.",
        "",
        "아래 후보자의 전화면접 일정 조율을 위해 참석 가능 여부 확인을 요청드립니다.",
        "후보자가 회신한 가능 시간대 기준으로 참석 가능한 시간을 회신해주세요.",
        "",
        context,
        "",
        "회신 요청사항",
        "- 참석 가능한 시간대",
        "- 참석이 어려운 경우 대체 가능 시간대"
      ].join("\n")
    },
    candidate_schedule: {
      title: "후보자 전화면접 확정 안내",
      action: "interview_schedule_confirmed",
      recipients: candidateEmail,
      subject: `[TalentHub Interview] ${candidateName} ${stageLabel} 일정 확정 안내`,
      body: [
        `${candidateName}님,`,
        "",
        "전화면접 일정이 아래와 같이 확정되었습니다.",
        "",
        context,
        "",
        "일정 변경이 필요한 경우 가능한 한 빠르게 회신 부탁드립니다."
      ].join("\n")
    },
    panel_schedule: {
      title: "면접위원 전화면접 확정 안내",
      action: "interview_schedule_confirmed",
      recipients: panelEmails,
      subject: `[TalentHub Interview] ${candidateName} ${stageLabel} 면접위원 일정 확정 안내`,
      body: [
        "안녕하세요.",
        "",
        "전화면접 일정이 아래와 같이 확정되었습니다.",
        "",
        context,
        "",
        "후보자 연락처",
        `- 이메일: ${interviewCase.email || "-"}`,
        `- 휴대폰: ${interviewCase.phone || "-"}`,
        "",
        "일정 변경이 필요한 경우 TalentHub Interview 메뉴에 변경 요청을 기록해주세요."
      ].join("\n")
    },
    combined_schedule: {
      title: "전화면접 확정 안내",
      action: "interview_schedule_confirmed",
      recipients: normalizeEmailList([...candidateEmail, ...panelEmails]),
      subject: `[TalentHub Interview] ${candidateName} ${stageLabel} 일정 확정 안내`,
      body: [
        "안녕하세요.",
        "",
        "전화면접 일정이 아래와 같이 확정되었습니다.",
        "",
        context,
        "",
        "후보자 연락처",
        `- 이메일: ${interviewCase.email || "-"}`,
        `- 휴대폰: ${interviewCase.phone || "-"}`,
        "",
        "일정 변경이 필요한 경우 채용담당자에게 회신해주세요."
      ].join("\n")
    },
    generic_request: {
      title: "인터뷰 입력 요청 메일",
      action: "interview_step_request",
      recipients: normalizeEmailList([...candidateEmail, ...panelEmails]),
      subject: `[TalentHub Interview] ${candidateName} ${stageLabel} 입력 요청`,
      body: [
        `${candidateName} ${stageLabel} 진행을 위해 아래 정보 확인이 필요합니다.`,
        "",
        context,
        scheduleText ? `\n일정 참고\n${scheduleText}` : "",
        "",
        "가능 시간대 또는 요청 자료를 회신해주세요."
      ].filter(Boolean).join("\n")
    },
    reject: {
      title: "전형 결과 안내 메일",
      action: "interview_reject_notice",
      recipients: candidateEmail,
      subject: `[TalentHub Interview] ${candidateName} 전형 결과 안내`,
      body: [
        `${candidateName}님,`,
        "",
        `${interviewCase.positionName || "지원 포지션"} 전형 결과를 안내드립니다.`,
        `${stageLabel} 단계 검토 결과, 이번 전형은 더 진행하지 않는 것으로 결정되었습니다.`,
        "",
        "지원해주셔서 감사합니다."
      ].join("\n")
    }
  };
  const draft = drafts[mailType] || drafts.generic_request;

  if (!draft.recipients.length) {
    showToast("발송 가능한 수신처가 없습니다. 지원자 또는 면접위원 메일을 입력해주세요.");
    return null;
  }

  return {
    ...draft,
    interviewCaseId,
    stageId,
    mailType,
    stageLabel,
    scheduleText
  };
}

function openInterviewMailPreview(mailType, interviewCaseId, stageId) {
  const normalizedType = {
    request: stageId === "phone" ? "candidate_request" : "generic_request",
    schedule: stageId === "phone" ? "combined_schedule" : "combined_schedule",
    reject: "reject"
  }[mailType] || mailType;
  const draft = getInterviewMailDraft(interviewCaseId, stageId, normalizedType);

  if (!draft) {
    return;
  }

  state.interviewMailPreview = {
    ...draft,
    recipientsText: draft.recipients.join("\n")
  };
  renderInterviewView();
}

function closeInterviewMailPreview() {
  state.interviewMailPreview = null;
  renderInterviewView();
}

function renderInterviewMailPreviewModal() {
  const preview = state.interviewMailPreview;

  if (!preview) {
    return "";
  }

  return `
    <div class="trending-modal-backdrop" data-interview-mail-preview-backdrop>
      <section class="trending-modal screening-mail-preview-modal" role="dialog" aria-modal="true" aria-labelledby="interview-mail-preview-title">
        <div class="modal-header">
          <div>
            <p class="section-kicker">MAIL PREVIEW</p>
            <h4 id="interview-mail-preview-title">${escapeHtml(preview.title)}</h4>
          </div>
          <button class="ghost-button compact-button" type="button" data-close-interview-mail-preview>닫기</button>
        </div>
        <form id="interview-mail-preview-form" class="screening-mail-preview-form">
          <label class="field">
            <span>수신처</span>
            <textarea class="control-textarea compact-textarea" name="recipients" rows="3">${escapeHtml(preview.recipientsText || "")}</textarea>
          </label>
          <label class="field">
            <span>제목</span>
            <input class="control-input" name="subject" value="${inputValue(preview.subject)}" />
          </label>
          <label class="field">
            <span>본문</span>
            <textarea class="control-textarea mail-body-editor" name="body">${escapeHtml(preview.body)}</textarea>
          </label>
          <div class="form-actions">
            <button class="ghost-button" type="button" data-close-interview-mail-preview>취소</button>
            <button class="primary-button" type="submit">최종 발송</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

async function sendInterviewOperationMail(interviewCaseId, stageId, mailType) {
  openInterviewMailPreview(mailType, interviewCaseId, stageId);
}

async function sendInterviewMailPreview(form) {
  const preview = state.interviewMailPreview;

  if (!preview) {
    return;
  }

  const interviewCaseId = preview.interviewCaseId;
  const stageId = preview.stageId;
  const mailType = preview.mailType;
  const formData = new FormData(form);
  const recipients = normalizeEmailList(formData.get("recipients"));
  const subject = String(formData.get("subject") || "").trim();
  const text = String(formData.get("body") || "").trim();

  if (!recipients.length || !subject || !text) {
    showToast("수신처, 제목, 본문을 모두 입력해주세요.");
    return;
  }

  const interviewCase = findInterviewCase(interviewCaseId);

  if (!interviewCase || !canViewInterviewCase(interviewCase)) {
    showToast("인터뷰 정보를 찾을 수 없습니다.");
    return;
  }

  const stage = getInterviewStage(interviewCase, stageId);
  const action = preview.action;
  const label = {
    candidate_request: "후보자 일정 확인 요청",
    panel_request: "면접위원 가능 여부 문의",
    candidate_schedule: "후보자 확정 안내",
    panel_schedule: "면접위원 확정 안내",
    combined_schedule: "확정 일정 안내",
    generic_request: "입력 요청",
    reject: "탈락 안내"
  }[mailType] || preview.title || "인터뷰 메일";

  await sendScreeningMail({
    action,
    recipients,
    interviewCase,
    stage: getInterviewStageConfig(stageId),
    stageData: stage,
    scheduleText: buildInterviewScheduleText(stage),
    mailOverride: { recipients, subject, text }
  });

  mutateInterviewCase(interviewCaseId, (nextCase) => {
    const nextStage = getInterviewStage(nextCase, stageId);
    const operation = nextStage.phoneOperation || normalizePhoneInterviewOperation();

    if (mailType === "candidate_request") {
      operation.candidateRequestSentAt = getTimestampText();
      if (operation.candidateStatus === "pending") {
        operation.candidateStatus = "sent";
      }
    } else if (mailType === "panel_request") {
      operation.panelRequestSentAt = getTimestampText();
      if (operation.interviewerStatus === "pending") {
        operation.interviewerStatus = "sent";
      }
    } else if (mailType === "candidate_schedule") {
      operation.candidateConfirmedSentAt = getTimestampText();
    } else if (mailType === "panel_schedule") {
      operation.panelConfirmedSentAt = getTimestampText();
    } else if (mailType === "combined_schedule") {
      operation.candidateConfirmedSentAt = getTimestampText();
      operation.panelConfirmedSentAt = getTimestampText();
      operation.candidateStatus = operation.candidateStatus === "unavailable" ? "unavailable" : "confirmed";
      operation.interviewerStatus = operation.interviewerStatus === "unavailable" ? "unavailable" : "confirmed";
    }

    operation.lastChangedBy = getCurrentActorName();
    operation.lastChangedAt = getTimestampText();
    nextStage.phoneOperation = operation;
    nextStage.mailHistory = [
      {
        type: mailType,
        label,
        sentAt: getTimestampText(),
        recipients,
        by: getCurrentActorName()
      },
      ...(nextStage.mailHistory || [])
    ];
    markInterviewStageActive(nextCase, stageId, ["combined_schedule", "candidate_schedule", "panel_schedule"].includes(mailType) ? "scheduled" : "scheduling");
  });
  state.interviewMailPreview = null;
  addAuditLog("Interview 메일 발송", interviewCase.candidateName, `${getInterviewStageConfig(stageId).label} · ${label}`);
  showToast(`${label} 메일을 발송했습니다.`);
  renderInterviewView();
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

function toggleCandidateRecommendation(candidateId) {
  const candidate = findCandidate(candidateId);

  if (!candidate || !canViewCandidate(candidate)) {
    return;
  }

  candidate.recommended = !candidate.recommended;
  candidate.recommendedAt = candidate.recommended ? getTodayDate() : "";
  candidate.recommendedBy = candidate.recommended ? getCurrentActorName() : "";
  touchCandidate(candidate);
  addAuditLog(candidate.recommended ? "후보자 추천 등록" : "후보자 추천 해제", candidate.name, "Dashboard 추천 프로필");
  persistState();
  upsertCandidateToSupabase(candidate).catch((error) => {
    console.warn("Candidate remote save failed.", error);
  });
  renderDashboard();
  renderDetail();
  renderPoolTable();
  showToast(candidate.recommended ? `${candidate.name} 후보자를 추천 프로필에 추가했습니다.` : `${candidate.name} 후보자 추천을 해제했습니다.`);
}

function changeCandidateStatus(status) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 상태를 변경할 수 없는 프로필입니다.");
    return;
  }

  if (!STATUS_ORDER.includes(status)) {
    showToast("변경할 수 없는 관리 상태입니다.");
    renderDetail();
    return;
  }

  const previous = candidate.status;
  const today = getTodayDate();

  if (previous === status) {
    return;
  }

  candidate.status = status;
  touchCandidate(candidate);
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
  upsertCandidateToSupabase(candidate).catch((error) => {
    console.warn("Candidate remote save failed.", error);
  });
  showToast(`${candidate.name} 상태가 변경되었습니다.`);
  render();
}

function setDetailTab(tab) {
  if (!["profile", "interviews", "applications"].includes(tab)) {
    return;
  }

  state.detailTab = tab;
  state.editingInterviewId = "";
  renderDetail();
}

function startNewInterviewRecord() {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 면담 기록을 등록할 수 없습니다.");
    return;
  }

  state.detailTab = "interviews";
  state.editingInterviewId = "new";
  renderDetail();
}

function editInterviewRecord(interviewId) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate) || !candidate.interviews?.some((record) => record.id === interviewId)) {
    showToast("수정할 면담 기록을 찾지 못했습니다.");
    return;
  }

  state.detailTab = "interviews";
  state.editingInterviewId = interviewId;
  renderDetail();
}

function cancelInterviewEdit() {
  state.editingInterviewId = "";
  renderDetail();
}

function saveInterviewRecord(form) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 면담 기록을 저장할 수 없습니다.");
    return;
  }

  const interviewId = getFormText(form, "interviewId");
  const record = normalizeInterviewRecord({
    id: interviewId || createId("interview"),
    date: getFormText(form, "interviewDate") || getTodayDate(),
    interviewer: getFormText(form, "interviewInterviewer") || getCurrentActorName(),
    method: getFormText(form, "interviewMethod"),
    content: getFormText(form, "interviewContent"),
    nextAction: getFormText(form, "interviewNextAction"),
    updatedAt: getTodayDate()
  });

  if (!record?.content) {
    showToast("면담 내용을 입력해주세요.");
    return;
  }

  const existingIndex = (candidate.interviews || []).findIndex((item) => item.id === interviewId);

  if (existingIndex >= 0) {
    candidate.interviews[existingIndex] = record;
  } else {
    candidate.interviews = candidate.interviews || [];
    candidate.interviews.unshift(record);
  }

  candidate.updatedAt = getTodayDate();
  state.editingInterviewId = "";
  addAuditLog(interviewId ? "면담 기록 수정" : "면담 기록 등록", candidate.name, record.method || record.date);
  persistState();
  showToast("면담 기록이 저장되었습니다.");
  renderDetail();
}

function deleteInterviewRecord(interviewId) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 면담 기록을 삭제할 수 없습니다.");
    return;
  }

  const record = (candidate.interviews || []).find((item) => item.id === interviewId);

  if (!record) {
    showToast("삭제할 면담 기록을 찾지 못했습니다.");
    return;
  }

  if (!window.confirm("선택한 면담 기록을 삭제할까요?")) {
    return;
  }

  candidate.interviews = candidate.interviews.filter((item) => item.id !== interviewId);
  candidate.updatedAt = getTodayDate();
  state.editingInterviewId = "";
  addAuditLog("면담 기록 삭제", candidate.name, record.method || record.date);
  persistState();
  showToast("면담 기록을 삭제했습니다.");
  renderDetail();
}

function startNewMemoRecord() {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 메모를 등록할 수 없습니다.");
    return;
  }

  state.editingMemoId = "new";
  renderDetail();
}

function editMemoRecord(memoId) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate) || !candidate.memos?.some((memo) => memo.id === memoId)) {
    showToast("수정할 메모를 찾지 못했습니다.");
    return;
  }

  state.editingMemoId = memoId;
  renderDetail();
}

function cancelMemoEdit() {
  state.editingMemoId = "";
  renderDetail();
}

function saveMemoRecord(form) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 메모를 저장할 수 없습니다.");
    return;
  }

  const memoId = getFormText(form, "memoId");
  const content = getFormText(form, "memoContent");

  if (!content) {
    showToast("메모 내용을 입력해주세요.");
    return;
  }

  const existingIndex = (candidate.memos || []).findIndex((memo) => memo.id === memoId);
  const previous = existingIndex >= 0 ? candidate.memos[existingIndex] : null;
  const today = getTodayDate();
  const memo = normalizeMemoRecord({
    id: memoId || createId("memo"),
    content,
    actor: previous?.actor || getCurrentActorName(),
    createdAt: previous?.createdAt || today,
    updatedAt: today
  });

  if (existingIndex >= 0) {
    candidate.memos[existingIndex] = memo;
  } else {
    candidate.memos = candidate.memos || [];
    candidate.memos.unshift(memo);
  }

  candidate.updatedAt = today;
  state.editingMemoId = "";
  addAuditLog(memoId ? "메모 수정" : "메모 등록", candidate.name, content.slice(0, 40));
  persistState();
  showToast("메모가 저장되었습니다.");
  renderDetail();
}

function deleteMemoRecord(memoId) {
  const candidate = getCandidate();

  if (!candidate || !canManageCandidateProfile(candidate)) {
    showToast("현재 회원등급으로 메모를 삭제할 수 없습니다.");
    return;
  }

  const memo = (candidate.memos || []).find((item) => item.id === memoId);

  if (!memo) {
    showToast("삭제할 메모를 찾지 못했습니다.");
    return;
  }

  if (!window.confirm("선택한 메모를 삭제할까요?")) {
    return;
  }

  candidate.memos = candidate.memos.filter((item) => item.id !== memoId);
  candidate.updatedAt = getTodayDate();
  state.editingMemoId = "";
  addAuditLog("메모 삭제", candidate.name, memo.content.slice(0, 40));
  persistState();
  showToast("메모를 삭제했습니다.");
  renderDetail();
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
  state.aiSearchProgress = options.fileName ? 62 : 42;
  state.aiSearchStatus = options.fileName
    ? "파일 내용을 기반으로 후보자 적합도를 계산하는 중입니다."
    : "자연어 조건을 분석하고 후보자 적합도를 계산하는 중입니다.";
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
    state.aiSearchProgress = 100;
    state.aiSearchStatus = options.fileName
      ? `${options.fileName} 기반 AI 검색을 완료했습니다.`
      : "AI 검색을 완료했습니다.";
    showToast(options.fileName ? "직무기술서 기반 AI 검색 결과가 갱신되었습니다." : "AI 검색 결과가 갱신되었습니다.");
  } catch (error) {
    console.warn("AI search execution failed.", error);
    state.aiSearchProgress = 100;
    state.aiSearchStatus = "AI 서버 연결 문제로 로컬 검색 결과를 표시합니다.";
    showToast("AI 검색 중 오류가 발생해 로컬 검색 결과를 표시합니다.");
  } finally {
    state.aiSearchLoading = false;
    renderAiSearch();
  }
}

async function executeAiSearch() {
  state.aiSearchFileName = "";
  state.aiSearchStatus = "";
  state.aiSearchProgress = 0;
  await executeAiSearchWithQuery($("#ai-query")?.value.trim() || "");
}

async function handleAiSearchFileUpload(file) {
  const status = $("#ai-file-status");

  if (!file) {
    return;
  }

  state.aiSearchFileName = file.name;
  state.aiSearchLoading = true;
  state.aiSearchProgress = 16;
  state.aiSearchStatus = "직무기술서 파일을 읽는 중입니다.";
  state.aiResults = [];

  if (status) {
    setProgressStatus(status, state.aiSearchStatus, state.aiSearchProgress);
  }

  renderAiSearch();

  try {
    const result = await readResumeText(file);

    if (!result.text || result.text.length < 20) {
      state.aiSearchLoading = false;
      state.aiSearchProgress = 0;
      state.aiSearchStatus = "파일에서 읽을 수 있는 직무기술서 텍스트가 부족합니다.";
      renderAiSearch();
      showToast("파일에서 읽을 수 있는 직무기술서 텍스트가 부족합니다.");
      return;
    }

    state.aiSearchProgress = 48;
    state.aiSearchStatus = "직무기술서 파일을 검색 조건으로 구성하는 중입니다.";
    renderAiSearch();
    await executeAiSearchWithQuery(buildAiQueryFromUploadedFile(result.text, file.name), { fileName: file.name });
  } catch (error) {
    console.warn("AI search file could not be read.", error);
    state.aiSearchLoading = false;
    state.aiSearchProgress = 0;
    state.aiSearchStatus = error.isResumeParseError ? error.message : "직무기술서 파일을 읽지 못했습니다.";
    renderAiSearch();
    showToast(error.isResumeParseError ? error.message : "직무기술서 파일을 읽지 못했습니다.");
  }
}

function findFileInputForDrop(target) {
  const element = target instanceof Element ? target : null;

  if (!element) {
    return null;
  }

  if (element.matches("input[type='file']")) {
    return element;
  }

  const container = element.closest(".dropzone, .field");

  if (!container) {
    return null;
  }

  return container.querySelector("input[type='file']");
}

function getFileDropVisualTarget(target) {
  const element = target instanceof Element ? target : null;

  if (!element) {
    return null;
  }

  if (element.matches("input[type='file']")) {
    return element.closest(".dropzone, .field") || element;
  }

  return element.closest(".dropzone, .field");
}

function applyDroppedFilesToInput(input, fileList) {
  const files = [...(fileList || [])];

  if (!input || !files.length) {
    return false;
  }

  const dataTransfer = new DataTransfer();
  const acceptedFiles = input.multiple ? files : files.slice(0, 1);

  acceptedFiles.forEach((file) => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
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
  queueMemberRemoteSave(member);
  render();
  showToast("내 정보를 저장했습니다.");
}

async function handleLoginSubmit(form) {
  const formData = new FormData(form);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const shouldRememberEmail = Boolean(formData.get("rememberEmail"));
  const member = state.members.find((item) => item.email === email);

  if (!member || !await verifyMemberPassword(member, password)) {
    setAuthMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
    return;
  }

  if (member.status !== "active") {
    setAuthMessage(`${getMemberStatusLabel(member.status)} 상태입니다. 관리자 승인 또는 상태 변경 후 접속할 수 있습니다.`);
    return;
  }

  state.currentUserId = member.id;
  member.lastLoginAt = getTimestampText();
  recordPageVisit(member);
  setRememberedLoginEmail(shouldRememberEmail ? email : "");
  state.authMessage = "";
  state.memberProfileModalOpen = false;
  state.view = canAccessView(state.view, member) ? state.view : getDefaultView(member);
  resetAccountScopedWorkspaceForCurrentUser();
  await mergeCurrentUserJobFitAnalysesFromSupabase();
  addAuditLog("로그인", member.name, "시스템 접속", member.name);
  persistState();
  queueMemberRemoteSave(member);
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
  queueMemberRemoteSave(member);
  notifyAdminsOfSignup(member);
  state.authView = "login";
  state.authMessage = "가입 신청이 접수되었습니다. 관리자가 승인하면 로그인할 수 있습니다.";
  addAuditLog("회원가입 신청", member.name, `${getRoleLabel(member.role)} 권한 요청`, "가입 신청자");
  persistState();
  render();
}

function showMemberCreateError(message) {
  const errorBox = $("#member-create-error");

  if (!errorBox) {
    return;
  }

  if (!message) {
    errorBox.hidden = true;
    errorBox.innerHTML = "";
    return;
  }

  errorBox.hidden = false;
  errorBox.innerHTML = `<strong>계정 생성 확인</strong><span>${escapeHtml(message)}</span>`;
}

function syncMemberCreateBusinessUnitVisibility(form = $("#member-create-form")) {
  if (!form) {
    return;
  }

  const rawRole = String(form.elements.role?.value || "").trim();
  const role = LEGACY_MEMBER_ROLE_MAP[rawRole] || rawRole;
  const shouldShow = memberRoleNeedsBusinessUnit(role);
  const field = form.querySelector("[data-member-create-business-unit-field]");
  const select = form.querySelector("[data-member-create-business-unit]");

  if (field) {
    field.classList.toggle("is-hidden", !shouldShow);
  }

  if (select) {
    select.disabled = !shouldShow;

    if (!shouldShow) {
      select.value = "";
    }
  }
}

async function createMemberAccountFromForm(form) {
  const currentMember = getCurrentMember();

  if (!canCreateMemberAccounts(currentMember)) {
    showMemberCreateError("계정을 생성할 수 있는 권한이 없습니다.");
    return;
  }

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");
  const rawRole = String(formData.get("role") || "").trim();
  const role = LEGACY_MEMBER_ROLE_MAP[rawRole] || rawRole;
  const creatableRoles = getCreatableMemberRoles(currentMember);
  const businessUnit = memberRoleNeedsBusinessUnit(role) ? formData.get("businessUnit") : "";

  if (!name || !email || !password) {
    showMemberCreateError("이름, 이메일, 비밀번호를 입력해주세요.");
    return;
  }

  if (!creatableRoles.includes(role)) {
    showMemberCreateError("현재 권한으로 생성할 수 없는 회원 권한입니다.");
    return;
  }

  if (state.members.some((member) => member.email === email)) {
    showMemberCreateError("이미 등록되어 있거나 승인 대기 중인 이메일입니다.");
    return;
  }

  if (password.length < 8) {
    showMemberCreateError("비밀번호는 8자 이상으로 입력해주세요.");
    return;
  }

  if (password !== passwordConfirm) {
    showMemberCreateError("비밀번호 확인 값이 일치하지 않습니다.");
    return;
  }

  const member = normalizeMember({
    id: createId("member"),
    name,
    email,
    password: "",
    passwordHash: await hashPassword(email, password),
    role,
    status: "active",
    businessUnit,
    department: formData.get("department"),
    position: formData.get("position"),
    phone: formData.get("phone"),
    requestedAt: getTodayDate(),
    approvedAt: getTodayDate(),
    approvedBy: getCurrentActorName(),
    lastLoginAt: "",
    note: formData.get("note")
  });

  state.members.unshift(member);
  state.memberFilters.role = "all";
  state.memberFilters.status = "all";
  state.memberFilters.query = "";
  queueMemberRemoteSave(member);
  addAuditLog("회원 계정 생성", member.name, `${getRoleLabel(member.role)} 계정 생성`, getCurrentActorName());
  persistState();
  showToast(`${member.name} 계정을 생성했습니다.`);
  renderMembers();
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
  if (!canAccessView("members")) {
    return;
  }

  const availableTabs = getAvailableManagementTabs().map((item) => item.id);

  if (!availableTabs.includes(tab)) {
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
  queueMemberRemoteSave(member);
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
  queueMemberRemoteSave(member);
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
  queueMemberRemoteSave(member);
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
  queueMemberRemoteSave(member);
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
  queueMemberRemoteSave(member);
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
  queueMemberRemoteSave(member);
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
  queueMemberRemoteSave(member);
  addAuditLog("회원 사업부 변경", member.name, member.businessUnit || "미지정");
  persistState();
  showToast(`${member.name} 회원의 사업부를 ${member.businessUnit || "미지정"}으로 변경했습니다.`);
  renderMembers();
}

function updateRolePermission(role, view, enabled) {
  if (!isAdmin() || !MEMBER_ROLES[role] || role === "admin") {
    renderMembers();
    return;
  }

  const permissions = new Set(getAllowedViewsForRole(role));

  if (enabled) {
    permissions.add(view);
  } else {
    permissions.delete(view);
  }

  state.rolePermissions[role] = MENU_CONFIG
    .map((item) => item.view)
    .filter((menuView) => permissions.has(menuView));
  syncRolePermissionsToSupabase().catch((error) => {
    console.warn("Role permissions remote save failed.", error);
  });

  addAuditLog("등급 메뉴 권한 변경", getRoleLabel(role), `${getMenuLabel(view)} ${enabled ? "허용" : "차단"}`);
  persistState();
  render();
}

function moveMenuOrder(view, direction) {
  const order = normalizeMenuOrder(state.menuOrder);
  const index = order.indexOf(view);
  const delta = direction === "up" ? -1 : direction === "down" ? 1 : 0;
  const nextIndex = index + delta;

  if (index < 0 || delta === 0 || nextIndex < 0 || nextIndex >= order.length) {
    return;
  }

  [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
  state.menuOrder = normalizeMenuOrder(order);
  markMenuSettingsChanged();
  addAuditLog("좌측 메뉴 순서 변경", "Management", `${getMenuLabel(view)} ${direction === "up" ? "위로" : "아래로"}`);
  persistState();
  render();
}

function updateMenuLabel(view, label) {
  if (!DEFAULT_MENU_ORDER.includes(view)) {
    return;
  }

  const normalizedLabel = String(label || "").trim().slice(0, 40);
  const labels = normalizeMenuLabels(state.menuLabels);

  if (normalizedLabel && normalizedLabel !== DEFAULT_MENU_LABELS[view]) {
    labels[view] = normalizedLabel;
  } else {
    delete labels[view];
  }

  state.menuLabels = labels;
  markMenuSettingsChanged();
  persistState();
  applyMenuOrderToSidebar();
  syncActiveViewState();
}

function resetMenuLabels() {
  state.menuLabels = {};
  markMenuSettingsChanged();
  addAuditLog("좌측 메뉴명 초기화", "Management", "기본 메뉴명 복원");
  persistState();
  render();
}

function resetMenuOrder() {
  state.menuOrder = [...DEFAULT_MENU_ORDER];
  markMenuSettingsChanged();
  addAuditLog("좌측 메뉴 순서 초기화", "Management", "기본 순서 복원");
  persistState();
  render();
}

async function saveMenuSettings() {
  if (!isAdmin()) {
    showToast("관리자만 메뉴 설정을 저장할 수 있습니다.");
    return;
  }

  state.menuOrder = normalizeMenuOrder(state.menuOrder);
  state.menuLabels = normalizeMenuLabels(state.menuLabels);
  state.menuSettingsUpdatedAt = state.menuSettingsUpdatedAt || new Date().toISOString();
  persistState({ skipRemoteSync: true });

  if (REMOTE_SYNC_ENABLED) {
    try {
      await syncMenuSettingsToSupabase();
      state.remoteSyncStatus = "Supabase 연결됨";
    } catch (error) {
      state.remoteSyncStatus = "Supabase 동기화 실패";
      console.warn(error);
      showToast("메뉴 설정은 로컬에 저장됐지만 원격 DB 저장에 실패했습니다.");
      return;
    }
  }

  addAuditLog("좌측 메뉴 설정 저장", "Management", "메뉴 순서 및 메뉴명 저장");
  persistState({ skipRemoteSync: true });
  showToast("메뉴 설정을 저장했습니다.");
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

    const moveMenuOrderButton = event.target.closest("[data-move-menu-order]");
    if (moveMenuOrderButton) {
      moveMenuOrder(moveMenuOrderButton.dataset.moveMenuOrder, moveMenuOrderButton.dataset.menuOrderDirection);
      return;
    }

    if (event.target.closest("[data-reset-menu-order]")) {
      resetMenuOrder();
      return;
    }

    if (event.target.closest("[data-reset-menu-labels]")) {
      resetMenuLabels();
      return;
    }

    if (event.target.closest("[data-save-menu-settings]")) {
      saveMenuSettings().catch((error) => {
        console.warn(error);
        showToast("메뉴 설정 저장 중 오류가 발생했습니다.");
      });
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
      state.screeningBulkApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
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
      state.screeningBulkApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
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
      state.screeningBulkApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
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
      const targetDate = state.trendingReport?.targetDate || state.trendingSelectedDate || getTrendingTargetDate();

      if (mode === "force") {
        const confirmed = window.confirm(`${targetDate} 00:00~24:00 기사 기준 Today's Talent 리포트를 다시 조사합니다.\n\n기존 리포트 보관함의 같은 날짜 데이터가 새 결과로 덮어써집니다. 계속 진행할까요?`);

        if (!confirmed) {
          return;
        }
      }

      fetchTrendingPeople({
        force: mode === "force",
        date: mode === "force" ? targetDate : undefined,
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

    const editTrendingButton = event.target.closest("[data-edit-trending-person]");
    if (editTrendingButton) {
      openTrendingProfileEditor(editTrendingButton.dataset.editTrendingPerson);
      return;
    }

    if (event.target.closest("[data-save-trending-mail]")) {
      saveTrendingMailSettings();
      return;
    }

    if (event.target.closest("[data-save-trending-search]")) {
      saveTrendingSearchSettings();
      return;
    }

    if (event.target.closest("[data-send-trending-mail-test]")) {
      sendTrendingMailTest();
      return;
    }

    if (event.target.closest("[data-save-trending-profile]")) {
      saveTrendingProfileEdit();
      return;
    }

    const deleteScreeningFolderButton = event.target.closest("[data-delete-screening-folder]");
    if (deleteScreeningFolderButton) {
      deleteScreeningFolder(deleteScreeningFolderButton.dataset.deleteScreeningFolder).catch((error) => {
        console.warn(error);
        showToast("포지션 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    const selectScreeningFolderButton = event.target.closest("[data-select-screening-folder]");
    if (selectScreeningFolderButton) {
      state.selectedScreeningFolderId = selectScreeningFolderButton.dataset.selectScreeningFolder;
      state.screeningPage = "detail";
      state.screeningDetailStep = "first";
      state.screeningPositionModalOpen = false;
      state.screeningApplicantModalOpen = false;
      state.screeningBulkApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      state.screeningResultPanelOpen = false;
      persistState();
      renderScreening();
      return;
    }

    if (event.target.closest("[data-back-screening-list]")) {
      state.screeningPage = "list";
      state.screeningApplicantModalOpen = false;
      state.screeningBulkApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      state.screeningResultPanelOpen = false;
      renderScreening();
      return;
    }

    if (event.target.closest("[data-open-screening-applicant-modal]")) {
      state.screeningApplicantModalOpen = true;
      state.screeningBulkApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    if (event.target.closest("[data-open-screening-bulk-applicant]")) {
      state.screeningBulkApplicantModalOpen = true;
      state.screeningApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    if (event.target.closest("[data-close-screening-bulk-applicant]") || event.target.matches("[data-screening-bulk-applicant-backdrop]")) {
      state.screeningBulkApplicantModalOpen = false;
      renderScreening();
      return;
    }

    if (event.target.closest("[data-close-screening-applicant-modal]") || event.target.matches("[data-screening-applicant-modal-backdrop]")) {
      state.screeningApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
      renderScreening();
      return;
    }

    const editScreeningApplicantButton = event.target.closest("[data-edit-screening-applicant]");
    if (editScreeningApplicantButton) {
      const folder = getSelectedScreeningFolder();
      const applicant = getScreeningApplicant(folder, editScreeningApplicantButton.dataset.editScreeningApplicant);

      if (!folder || !applicant || !canEditScreeningApplicant(folder, applicant)) {
        showToast("지원자 정보를 수정할 권한이 없습니다.");
        return;
      }

      state.screeningApplicantModalOpen = true;
      state.screeningBulkApplicantModalOpen = false;
      state.screeningEditingApplicantId = applicant.id;
      state.screeningJdModalOpen = false;
      state.screeningAccessModalOpen = false;
      state.screeningApplicantDetailId = "";
      renderScreening();
      return;
    }

    const deleteScreeningApplicantButton = event.target.closest("[data-delete-screening-applicant]");
    if (deleteScreeningApplicantButton) {
      deleteScreeningApplicant(deleteScreeningApplicantButton.dataset.deleteScreeningApplicant).catch((error) => {
        console.warn(error);
        showToast("지원자 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    const openApplicantDetailButton = event.target.closest("[data-open-screening-applicant-detail]");
    if (openApplicantDetailButton) {
      state.screeningApplicantDetailId = openApplicantDetailButton.dataset.openScreeningApplicantDetail;
      state.screeningApplicantModalOpen = false;
      state.screeningBulkApplicantModalOpen = false;
      state.screeningEditingApplicantId = "";
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

    if (event.target.closest("[data-close-screening-mail-preview]") || event.target.matches("[data-screening-mail-preview-backdrop]")) {
      state.screeningMailPreview = null;
      renderScreening();
      return;
    }

    if (event.target.closest("[data-save-screening-mail-template]")) {
      const form = event.target.closest("#screening-mail-preview-form");
      if (form) {
        saveScreeningMailTemplateFromPreview(form);
      }
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
      if (requestedStep !== "second") {
        state.screeningResultPanelOpen = false;
      }
      renderScreening();
      return;
    }

    const firstPassButton = event.target.closest("[data-screening-first-pass]");
    if (firstPassButton) {
      updateScreeningApplicantStage(firstPassButton.dataset.screeningFirstPass, "first_draft");
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

    if (event.target.closest("[data-finalize-first-screening]")) {
      finalizeFirstScreeningResults();
      return;
    }

    if (event.target.closest("[data-close-screening-result-panel]") || event.target.matches("[data-screening-result-panel-backdrop]")) {
      state.screeningResultPanelOpen = false;
      renderScreening();
      return;
    }

    if (event.target.closest("[data-open-screening-result-panel]")) {
      state.screeningResultPanelOpen = true;
      renderScreening();
      return;
    }

    if (event.target.closest("[data-add-screening-interviewer]")) {
      addScreeningInterviewerRow(event.target.closest("#screening-final-pass-form"));
      return;
    }

    const removeInterviewerButton = event.target.closest("[data-remove-screening-interviewer]");
    if (removeInterviewerButton) {
      removeScreeningDynamicRow(removeInterviewerButton, "[data-screening-interviewer-row]");
      return;
    }

    if (event.target.closest("[data-add-screening-slot]")) {
      addScreeningSlotRow(event.target.closest("#screening-final-pass-form"));
      return;
    }

    const removeSlotButton = event.target.closest("[data-remove-screening-slot]");
    if (removeSlotButton) {
      removeScreeningDynamicRow(removeSlotButton, "[data-screening-slot-row]");
      syncScreeningAvailabilityPreview(removeSlotButton.closest("#screening-final-pass-form"));
      return;
    }

    const revertScreeningButton = event.target.closest("[data-screening-revert]");
    if (revertScreeningButton) {
      revertScreeningApplicantStage(revertScreeningButton.dataset.screeningRevert);
      return;
    }

    const requestContactPreviewButton = event.target.closest("[data-screening-request-contact]");
    if (requestContactPreviewButton) {
      openScreeningMailPreview("contact_request", requestContactPreviewButton.dataset.screeningRequestContact);
      return;
    }

    const sendInterviewPreviewButton = event.target.closest("[data-screening-send-interview]");
    if (sendInterviewPreviewButton) {
      openScreeningMailPreview("phone_interview", sendInterviewPreviewButton.dataset.screeningSendInterview);
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

    const deleteInterviewCaseButton = event.target.closest("[data-delete-interview-case]");
    if (deleteInterviewCaseButton) {
      deleteInterviewCase(deleteInterviewCaseButton.dataset.deleteInterviewCase);
      return;
    }

    const selectInterviewCaseButton = event.target.closest("[data-select-interview-case]");
    if (selectInterviewCaseButton) {
      selectInterviewCase(selectInterviewCaseButton.dataset.selectInterviewCase);
      return;
    }

    const selectInterviewStageButton = event.target.closest("[data-select-interview-stage]");
    if (selectInterviewStageButton) {
      selectInterviewStage(selectInterviewStageButton.dataset.selectInterviewStage);
      return;
    }

    const addInterviewSlotButton = event.target.closest("[data-add-interview-slot]");
    if (addInterviewSlotButton) {
      addInterviewSlot(
        addInterviewSlotButton.dataset.interviewCaseId,
        addInterviewSlotButton.dataset.interviewStage,
        addInterviewSlotButton.dataset.addInterviewSlot
      );
      return;
    }

    const removeInterviewSlotButton = event.target.closest("[data-remove-interview-slot]");
    if (removeInterviewSlotButton) {
      removeInterviewSlot(
        removeInterviewSlotButton.dataset.interviewCaseId,
        removeInterviewSlotButton.dataset.interviewStage,
        removeInterviewSlotButton.dataset.interviewSlotType,
        Number(removeInterviewSlotButton.dataset.removeInterviewSlot)
      );
      return;
    }

    const addInterviewPanelButton = event.target.closest("[data-add-interview-panel-member]");
    if (addInterviewPanelButton) {
      addInterviewPanelMember(addInterviewPanelButton.dataset.interviewCaseId, addInterviewPanelButton.dataset.interviewStage);
      return;
    }

    const removeInterviewPanelButton = event.target.closest("[data-remove-interview-panel-member]");
    if (removeInterviewPanelButton) {
      removeInterviewPanelMember(
        removeInterviewPanelButton.dataset.interviewCaseId,
        removeInterviewPanelButton.dataset.interviewStage,
        Number(removeInterviewPanelButton.dataset.removeInterviewPanelMember)
      );
      return;
    }

    const passInterviewStageButton = event.target.closest("[data-interview-pass-stage]");
    if (passInterviewStageButton) {
      passInterviewStage(passInterviewStageButton.dataset.interviewCaseId, passInterviewStageButton.dataset.interviewStage);
      return;
    }

    const revertInterviewStageButton = event.target.closest("[data-interview-revert-stage]");
    if (revertInterviewStageButton) {
      revertInterviewStagePass(revertInterviewStageButton.dataset.interviewCaseId, revertInterviewStageButton.dataset.interviewStage);
      return;
    }

    const failInterviewStageButton = event.target.closest("[data-interview-fail-stage]");
    if (failInterviewStageButton) {
      failInterviewStage(failInterviewStageButton.dataset.interviewCaseId, failInterviewStageButton.dataset.interviewStage);
      return;
    }

    const finalizeInterviewButton = event.target.closest("[data-finalize-interview-case]");
    if (finalizeInterviewButton) {
      finalizeInterviewCase(finalizeInterviewButton.dataset.interviewCaseId, finalizeInterviewButton.dataset.finalizeInterviewCase);
      return;
    }

    const revertFinalInterviewButton = event.target.closest("[data-revert-final-interview-case]");
    if (revertFinalInterviewButton) {
      revertFinalInterviewCase(revertFinalInterviewButton.dataset.revertFinalInterviewCase);
      return;
    }

    const markOfferSignedButton = event.target.closest("[data-mark-offer-signed]");
    if (markOfferSignedButton) {
      markInterviewOfferSigned(markOfferSignedButton.dataset.markOfferSigned);
      return;
    }

    const markJoinedButton = event.target.closest("[data-mark-joined]");
    if (markJoinedButton) {
      markInterviewJoined(markJoinedButton.dataset.markJoined);
      return;
    }

    if (event.target.closest("[data-close-interview-mail-preview]") || event.target.matches("[data-interview-mail-preview-backdrop]")) {
      closeInterviewMailPreview();
      return;
    }

    const openInterviewMailPreviewButton = event.target.closest("[data-open-interview-mail-preview]");
    if (openInterviewMailPreviewButton) {
      openInterviewMailPreview(
        openInterviewMailPreviewButton.dataset.openInterviewMailPreview,
        openInterviewMailPreviewButton.dataset.interviewCaseId,
        openInterviewMailPreviewButton.dataset.interviewStage
      );
      return;
    }

    const phoneOperationStatusButton = event.target.closest("[data-phone-operation-status]");
    if (phoneOperationStatusButton) {
      updatePhoneOperationStatus(
        phoneOperationStatusButton.dataset.interviewCaseId,
        phoneOperationStatusButton.dataset.interviewStage,
        phoneOperationStatusButton.dataset.phoneOperationStatus
      );
      return;
    }

    const sendInterviewOperationMailButton = event.target.closest("[data-send-interview-mail]");
    if (sendInterviewOperationMailButton) {
      sendInterviewOperationMail(
        sendInterviewOperationMailButton.dataset.interviewCaseId,
        sendInterviewOperationMailButton.dataset.interviewStage,
        sendInterviewOperationMailButton.dataset.sendInterviewMail
      ).catch((error) => {
        console.warn(error);
        showToast(error.message || "인터뷰 메일 발송 중 오류가 발생했습니다.");
      });
      return;
    }

    const policyCitationButton = event.target.closest("[data-policy-citation]");
    if (policyCitationButton) {
      openPolicyCitation(policyCitationButton.dataset.policyCitation);
      return;
    }

    const removeJobFitResumeButton = event.target.closest("[data-remove-job-fit-resume]");
    if (removeJobFitResumeButton) {
      removeJobFitResume(removeJobFitResumeButton.dataset.removeJobFitResume);
      return;
    }

    if (event.target.closest("[data-open-job-fit-pool-picker]")) {
      openJobFitPoolPicker();
      return;
    }

    if (event.target.closest("[data-close-job-fit-pool-picker]") || event.target.matches("[data-job-fit-pool-picker-backdrop]")) {
      closeJobFitPoolPicker();
      return;
    }

    if (event.target.closest("[data-add-job-fit-pool-profiles]")) {
      addSelectedPoolProfilesToJobFit();
      return;
    }

    if (event.target.closest("[data-clear-job-fit-jd]")) {
      clearJobFitJd();
      return;
    }

    if (event.target.closest("[data-clear-job-fit-resumes]")) {
      clearJobFitResumes();
      return;
    }

    if (event.target.closest("[data-clear-job-fit-results]")) {
      clearJobFitResults();
      return;
    }

    if (event.target.closest("[data-clear-job-fit-all]")) {
      clearJobFitAll();
      return;
    }

    if (event.target.closest("[data-run-job-fit-analysis]")) {
      runJobFitAnalysis().catch((error) => {
        console.warn("Job fit analysis failed.", error);
        const jobFit = getJobFitState();
        jobFit.analysisLoading = false;
        jobFit.analysisStatus = "직무적합도 분석 중 오류가 발생했습니다.";
        rerenderJobFitWorkspace();
      });
      return;
    }

    if (event.target.closest("[data-save-job-fit-analysis]")) {
      saveJobFitAnalysis().catch((error) => {
        console.warn("Job fit analysis save failed.", error);
        showToast("분석 결과 저장 중 오류가 발생했습니다.");
      });
      return;
    }

    const loadJobFitButton = event.target.closest("[data-load-job-fit-analysis]");
    if (loadJobFitButton) {
      loadSavedJobFitAnalysis(loadJobFitButton.dataset.loadJobFitAnalysis);
      return;
    }

    const deleteJobFitButton = event.target.closest("[data-delete-job-fit-analysis]");
    if (deleteJobFitButton) {
      deleteSavedJobFitAnalysis(deleteJobFitButton.dataset.deleteJobFitAnalysis).catch((error) => {
        console.warn("Job fit analysis delete failed.", error);
        showToast("저장된 분석 결과 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.closest("[data-run-jd-enhance]")) {
      runJdEnhancementReview().catch((error) => {
        console.warn("JD enhancement review failed.", error);
        const jd = getJdEnhancementState();
        jd.loading = false;
        jd.status = "JD 점검 중 오류가 발생했습니다.";
        rerenderJdEnhancement();
      });
      return;
    }

    if (event.target.closest("[data-open-jd-guideline-modal]")) {
      openJdGuidelineModal();
      return;
    }

    if (event.target.closest("[data-close-jd-guideline-modal]") || event.target.matches("[data-jd-guideline-modal-backdrop]")) {
      closeJdGuidelineModal();
      return;
    }

    if (event.target.closest("[data-save-jd-guideline]")) {
      saveJdGuideline();
      return;
    }

    if (event.target.closest("[data-clear-jd-enhance-input]")) {
      clearJdEnhancementInput();
      return;
    }

    if (event.target.closest("[data-apply-all-jd-suggestions]")) {
      applyAllJdSuggestions();
      return;
    }

    const applyJdSuggestionButton = event.target.closest("[data-apply-jd-suggestion]");
    if (applyJdSuggestionButton) {
      applyJdSuggestion(applyJdSuggestionButton.dataset.applyJdSuggestion);
      return;
    }

    if (event.target.closest("[data-download-jd-final]")) {
      downloadJdFinalDocument();
      return;
    }

    if (event.target.closest("[data-save-jd-document]")) {
      saveJdDocumentResult().catch((error) => {
        console.warn("JD document save failed.", error);
        showToast("채용공고 작성 결과 저장 중 오류가 발생했습니다.");
      });
      return;
    }

    const loadJdDocumentButton = event.target.closest("[data-load-jd-document]");
    if (loadJdDocumentButton) {
      loadSavedJdDocument(loadJdDocumentButton.dataset.loadJdDocument);
      return;
    }

    const deleteJdDocumentButton = event.target.closest("[data-delete-jd-document]");
    if (deleteJdDocumentButton) {
      deleteSavedJdDocument(deleteJdDocumentButton.dataset.deleteJdDocument).catch((error) => {
        console.warn("Saved JD document delete failed.", error);
        showToast("저장된 채용공고 작성 결과 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.closest("[data-generate-interview-report]")) {
      generateInterviewReport().catch((error) => {
        console.warn("Interview report generation failed.", error);
        const report = getInterviewReportState();
        report.scriptLoading = false;
        report.templateLoading = false;
        report.status = error.message || "면담록 보고서 생성 중 오류가 발생했습니다.";
        renderInterviewReport();
      });
      return;
    }

    if (event.target.closest("[data-open-interview-report-prompt]")) {
      openInterviewReportPromptModal();
      return;
    }

    if (event.target.closest("[data-close-interview-report-prompt]") || event.target.matches("[data-interview-report-prompt-backdrop]")) {
      closeInterviewReportPromptModal();
      return;
    }

    const removeInterviewTemplateSampleButton = event.target.closest("[data-remove-interview-template-sample]");
    if (removeInterviewTemplateSampleButton) {
      removeInterviewTemplateSample(removeInterviewTemplateSampleButton.dataset.removeInterviewTemplateSample);
      return;
    }

    if (event.target.closest("[data-download-interview-report]")) {
      downloadInterviewReportDocument();
      return;
    }

    if (event.target.closest("[data-reset-interview-report]")) {
      resetInterviewReport();
      return;
    }

    if (event.target.closest("[data-download-recruiting-metrics]")) {
      downloadRecruitingMetricsExcel();
      return;
    }

    if (event.target.closest("[data-save-recruiting-metrics]")) {
      saveRecruitingMetrics();
      return;
    }

    if (event.target.closest("[data-open-recruiting-mail]")) {
      openRecruitingMetricsMailModal();
      return;
    }

    if (event.target.closest("[data-open-recruiting-request-mail]")) {
      openRecruitingMetricsRequestMailModal();
      return;
    }

    if (event.target.closest("[data-close-recruiting-mail]") || event.target.matches("[data-recruiting-mail-backdrop]")) {
      closeRecruitingMetricsMailModal();
      return;
    }

    if (event.target.closest("[data-close-recruiting-request-mail]") || event.target.matches("[data-recruiting-request-mail-backdrop]")) {
      closeRecruitingMetricsRequestMailModal();
      return;
    }

    if (event.target.closest("[data-save-recruiting-mail-template]")) {
      saveRecruitingMailTemplate();
      return;
    }

    if (event.target.closest("[data-save-recruiting-request-mail-template]")) {
      saveRecruitingRequestMailTemplate();
      return;
    }

    if (event.target.closest("[data-send-recruiting-mail-final]")) {
      sendRecruitingMetricsMail();
      return;
    }

    if (event.target.closest("[data-send-recruiting-request-mail-final]")) {
      sendRecruitingMetricsRequestMail();
      return;
    }

    const recruitingMetricsTabButton = event.target.closest("[data-recruiting-metrics-tab]");
    if (recruitingMetricsTabButton) {
      setRecruitingMetricsTab(recruitingMetricsTabButton.dataset.recruitingMetricsTab);
      return;
    }

    const addRecruitingRowButton = event.target.closest("[data-add-recruiting-row]");
    if (addRecruitingRowButton) {
      addRecruitingSheetRow(addRecruitingRowButton.dataset.addRecruitingRow);
      return;
    }

    const addRecruitingColumnButton = event.target.closest("[data-add-recruiting-column]");
    if (addRecruitingColumnButton) {
      addRecruitingSheetColumn(addRecruitingColumnButton.dataset.addRecruitingColumn);
      return;
    }

    const deleteRecruitingRowButton = event.target.closest("[data-delete-recruiting-row]");
    if (deleteRecruitingRowButton) {
      deleteRecruitingSheetRow(deleteRecruitingRowButton.dataset.deleteRecruitingRow, deleteRecruitingRowButton.dataset.row);
      return;
    }

    const deleteRecruitingColumnButton = event.target.closest("[data-delete-recruiting-column]");
    if (deleteRecruitingColumnButton) {
      deleteRecruitingSheetColumn(deleteRecruitingColumnButton.dataset.deleteRecruitingColumn, deleteRecruitingColumnButton.dataset.col);
      return;
    }

    if (event.target.closest("[data-send-recruiting-metrics]")) {
      sendRecruitingMetricsMail();
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

    const recommendCandidateButton = event.target.closest("[data-toggle-recommend-candidate]");
    if (recommendCandidateButton) {
      toggleCandidateRecommendation(recommendCandidateButton.dataset.toggleRecommendCandidate);
      return;
    }

    const profileReportButton = event.target.closest("[data-download-profile-report]");
    if (profileReportButton) {
      downloadProfileReport(profileReportButton.dataset.downloadProfileReport);
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

    const detailTabButton = event.target.closest("[data-detail-tab]");
    if (detailTabButton) {
      setDetailTab(detailTabButton.dataset.detailTab);
      return;
    }

    if (event.target.closest("[data-new-interview]")) {
      startNewInterviewRecord();
      return;
    }

    const editInterviewButton = event.target.closest("[data-edit-interview]");
    if (editInterviewButton) {
      editInterviewRecord(editInterviewButton.dataset.editInterview);
      return;
    }

    const deleteInterviewButton = event.target.closest("[data-delete-interview]");
    if (deleteInterviewButton) {
      deleteInterviewRecord(deleteInterviewButton.dataset.deleteInterview);
      return;
    }

    if (event.target.closest("[data-cancel-interview-edit]")) {
      cancelInterviewEdit();
      return;
    }

    if (event.target.closest("[data-new-memo]")) {
      startNewMemoRecord();
      return;
    }

    const editMemoButton = event.target.closest("[data-edit-memo]");
    if (editMemoButton) {
      editMemoRecord(editMemoButton.dataset.editMemo);
      return;
    }

    const deleteMemoButton = event.target.closest("[data-delete-memo]");
    if (deleteMemoButton) {
      deleteMemoRecord(deleteMemoButton.dataset.deleteMemo);
      return;
    }

    if (event.target.closest("[data-cancel-memo-edit]")) {
      cancelMemoEdit();
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

    const addScreeningEducationButton = event.target.closest("[data-add-screening-education]");
    if (addScreeningEducationButton) {
      addScreeningEducationRecord();
      return;
    }

    const addScreeningCareerButton = event.target.closest("[data-add-screening-career]");
    if (addScreeningCareerButton) {
      addScreeningCareerRecord();
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

    const removeScreeningEducationButton = event.target.closest("[data-remove-screening-education]");
    if (removeScreeningEducationButton) {
      removeScreeningEducationRecord(Number(removeScreeningEducationButton.dataset.removeScreeningEducation));
      return;
    }

    const removeScreeningCareerButton = event.target.closest("[data-remove-screening-career]");
    if (removeScreeningCareerButton) {
      removeScreeningCareerRecord(Number(removeScreeningCareerButton.dataset.removeScreeningCareer));
      return;
    }

    if (event.target.closest("[data-clear-register-photo]")) {
      const input = $("#profile-photo");
      const preview = $("#photo-preview");
      if (input) input.value = "";
      if (preview) preview.textContent = "사진 미리보기";
      state.registerExtractedPhotoUrl = "";
      showToast("선택한 프로필 사진을 지웠습니다.");
      return;
    }

    if (event.target.closest("[data-clear-register-resume]")) {
      const input = $("#resume-file");
      const status = $("#resume-parse-status");
      if (input) input.value = "";
      if (status) status.textContent = "이력서를 업로드하면 읽을 수 있는 정보만 아래 입력란에 자동 입력됩니다.";
      showToast("선택한 이력서를 지웠습니다.");
      return;
    }

    if (event.target.closest("[data-clear-register-attachments]")) {
      const input = $("#candidate-other-attachments");
      if (input) input.value = "";
      showToast("선택한 기타 첨부파일을 지웠습니다.");
      return;
    }

    if (event.target.closest("[data-clear-edit-photo]")) {
      const input = $("#edit-photo");
      const removeInput = $("#edit-photo-remove");
      const preview = $("#edit-photo-preview");
      if (input) input.value = "";
      if (removeInput) removeInput.value = "1";
      if (preview) preview.textContent = "저장 시 사진이 삭제됩니다.";
      state.editExtractedPhotoUrl = "";
      showToast("저장하면 프로필 사진이 삭제됩니다.");
      return;
    }

    if (event.target.closest("[data-clear-edit-resume-upload]")) {
      const input = $("#edit-resume-file");
      const status = $("#edit-resume-parse-status");
      if (input) input.value = "";
      if (status) status.textContent = "이력서를 업로드하면 읽을 수 있는 정보만 아래 입력란에 자동 입력됩니다.";
      showToast("선택한 이력서를 지웠습니다.");
      return;
    }

    if (event.target.closest("[data-clear-edit-other-attachments]")) {
      const input = $("#edit-other-attachments");
      if (input) input.value = "";
      showToast("선택한 기타 첨부파일을 지웠습니다.");
      return;
    }

    const removeCandidateResumeArchiveButton = event.target.closest("[data-remove-candidate-resume-archive]");
    if (removeCandidateResumeArchiveButton) {
      removeCandidateStoredAttachment("resumeArchive", Number(removeCandidateResumeArchiveButton.dataset.removeCandidateResumeArchive)).catch((error) => {
        console.warn(error);
        showToast("첨부파일 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.closest("[data-remove-candidate-resume]")) {
      removeCandidateStoredAttachment("resume").catch((error) => {
        console.warn(error);
        showToast("이력서 삭제 중 오류가 발생했습니다.");
      });
      return;
    }

    const removeCandidateAttachmentButton = event.target.closest("[data-remove-candidate-attachment]");
    if (removeCandidateAttachmentButton) {
      removeCandidateStoredAttachment("other", Number(removeCandidateAttachmentButton.dataset.removeCandidateAttachment)).catch((error) => {
        console.warn(error);
        showToast("첨부파일 삭제 중 오류가 발생했습니다.");
      });
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
      state.screeningEditingApplicantId = "";
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

    if (event.key === "Escape" && state.screeningMailPreview) {
      state.screeningMailPreview = null;
      renderScreening();
    }

    if (event.key === "Escape" && state.interviewMailPreview) {
      closeInterviewMailPreview();
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

    if (event.target.matches("#member-create-form")) {
      event.preventDefault();
      createMemberAccountFromForm(event.target).catch((error) => {
        console.warn(error);
        showMemberCreateError("계정 생성 중 오류가 발생했습니다.");
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
      saveScreeningApplicantForm(event.target).catch((error) => {
        console.warn(error);
        showToast("지원자 정보 저장 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.matches("#screening-bulk-applicant-form")) {
      event.preventDefault();
      registerScreeningApplicantsBulk(event.target).catch((error) => {
        console.warn(error);
        showToast("지원자 대량 등록 중 오류가 발생했습니다.");
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

    if (event.target.matches("#screening-mail-preview-form")) {
      event.preventDefault();
      sendScreeningMailPreview(event.target).catch((error) => {
        console.warn(error);
        showToast(error.message || "메일 발송 중 오류가 발생했습니다.");
      });
      return;
    }

    if (event.target.matches("#interview-mail-preview-form")) {
      event.preventDefault();
      sendInterviewMailPreview(event.target).catch((error) => {
        console.warn(error);
        showToast(error.message || "인터뷰 메일 발송 중 오류가 발생했습니다.");
      });
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

    if (event.target.matches("#interview-form")) {
      event.preventDefault();
      saveInterviewRecord(event.target);
    }

    if (event.target.matches("#memo-form")) {
      event.preventDefault();
      saveMemoRecord(event.target);
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
        const organization = $("#candidate-organization");

        if (status) {
          status.textContent = "이력서를 업로드하면 읽을 수 있는 정보만 아래 입력란에 자동 입력됩니다.";
        }

        if (preview) {
          preview.textContent = "사진 미리보기";
        }

        if (owner) {
          owner.value = getDefaultOwnerName();
        }

        if (organization) {
          organization.value = getMemberBusinessUnit();
        }
      });
    }
  });

  document.addEventListener("input", (event) => {
    if (["pool-query", "pool-status", "pool-business-unit", "pool-owner", "pool-sort"].includes(event.target.id)) {
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

    if (event.target.id === "screening-applicant-birth-year") {
      updateAgeOutput("#screening-applicant-birth-year", "#screening-applicant-age");
    }

    if (event.target.matches("[data-screening-access-search]")) {
      updateScreeningAccessResults(event.target);
    }

    if (event.target.matches("[data-screening-opinion-applicant]")) {
      updateScreeningOpinion(event.target);
    }

    if (event.target.matches("[data-interview-panel-field]")) {
      updateInterviewPanelField(event.target, { persist: false });
    }

    if (event.target.matches("[data-interview-note]")) {
      updateInterviewNote(event.target, { persist: false });
    }

    if (event.target.id === "policy-chat-question") {
      state.policyChatQuestion = event.target.value;
    }

    if (event.target.id === "job-fit-jd-text") {
      updateJobFitJdText(event.target.value);
    }

    if (event.target.id === "job-fit-pool-picker-query") {
      updateJobFitPoolPickerQuery(event.target.value);
    }

    if (event.target.matches("[data-menu-label-input]")) {
      updateMenuLabel(event.target.dataset.menuLabelInput, event.target.value);
    }

    if (event.target.id === "jd-enhance-guideline") {
      updateJdGuideline(event.target.value);
    }

    if (event.target.id === "jd-enhance-jd-text") {
      updateJdInputText(event.target.value);
    }

    if (event.target.id === "jd-enhance-final-text") {
      updateJdFinalText(event.target.value);
    }

    if (event.target.id === "interview-report-script") {
      updateInterviewReportField("scriptText", event.target.value);
    }

    if (event.target.id === "interview-report-template") {
      updateInterviewReportField("templateText", event.target.value);
    }

    if (event.target.id === "interview-report-prompt") {
      updateInterviewReportField("prompt", event.target.value);
    }

    if (event.target.id === "interview-report-output") {
      updateInterviewReportField("reportText", event.target.value);
    }

    if (event.target.id === "recruiting-metrics-subject") {
      updateRecruitingMetricsField("subject", event.target.value);
    }

    if (event.target.id === "recruiting-metrics-recipients") {
      updateRecruitingMetricsField("recipients", event.target.value);
    }

    if (event.target.matches("[data-recruiting-target-field]")) {
      updateRecruitingTargetField(event.target);
    }

    if (event.target.matches("[data-recruiting-cell]")) {
      updateRecruitingSheetCell(event.target);
    }

    if (event.target.matches("[data-recruiting-column]")) {
      updateRecruitingSheetColumn(event.target);
    }

    if (event.target.matches("[data-recruiting-mail-draft]")) {
      updateRecruitingMailDraft(event.target.dataset.recruitingMailDraft, event.target.value);
    }

    if (event.target.matches("[data-recruiting-request-mail-draft]")) {
      updateRecruitingRequestMailDraft(event.target.dataset.recruitingRequestMailDraft, event.target.value);
    }
  });

  document.addEventListener("paste", (event) => {
    handleRecruitingSheetPaste(event);
  });

  document.addEventListener("pointerdown", (event) => {
    const cell = event.target.closest("[data-screening-time-cell]");

    if (!cell) {
      return;
    }

    event.preventDefault();
    state.screeningTimelineDrag = { startHour: Number(cell.dataset.screeningTimeCell) };
    updateScreeningTimelineSelection(cell, { startDrag: true });
  });

  document.addEventListener("pointermove", (event) => {
    if (!state.screeningTimelineDrag) {
      return;
    }

    const cell = event.target.closest("[data-screening-time-cell]");

    if (!cell) {
      return;
    }

    event.preventDefault();
    updateScreeningTimelineSelection(cell);
  });

  document.addEventListener("pointerup", () => {
    state.screeningTimelineDrag = null;
  });

  document.addEventListener("dragover", (event) => {
    const input = findFileInputForDrop(event.target);

    if (!input) {
      return;
    }

    event.preventDefault();
    getFileDropVisualTarget(event.target)?.classList.add("is-dragover");
  });

  document.addEventListener("dragleave", (event) => {
    const visualTarget = getFileDropVisualTarget(event.target);

    if (visualTarget && !visualTarget.contains(event.relatedTarget)) {
      visualTarget.classList.remove("is-dragover");
    }
  });

  document.addEventListener("drop", (event) => {
    const input = findFileInputForDrop(event.target);
    const visualTarget = getFileDropVisualTarget(event.target);

    if (!input) {
      return;
    }

    event.preventDefault();
    visualTarget?.classList.remove("is-dragover");

    if (applyDroppedFilesToInput(input, event.dataTransfer?.files)) {
      showToast("파일을 업로드 영역에 추가했습니다.");
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "dashboard-organization-filter") {
      updateDashboardFilters();
    }

    if (event.target.matches("[data-job-fit-pool-candidate]")) {
      toggleJobFitPoolCandidate(event.target.dataset.jobFitPoolCandidate, event.target.checked);
      return;
    }

    if (event.target.id === "interview-report-script-file") {
      const file = event.target.files?.[0];

      if (file) {
        loadInterviewReportFile(file, "script");
        event.target.value = "";
      }
      return;
    }

    if (event.target.id === "interview-report-template-file") {
      const files = [...(event.target.files || [])];

      if (files.length) {
        loadInterviewReportTemplateFiles(files);
        event.target.value = "";
      }
      return;
    }

    if (event.target.id === "recruiting-metrics-week") {
      updateRecruitingMetricsField("weekOf", event.target.value);
      renderRecruitingMetrics();
      return;
    }

    if (event.target.id === "recruiting-metrics-auto-send") {
      const metrics = getRecruitingMetricsState();
      metrics.autoSendOnComplete = event.target.checked;
      persistState();
      renderRecruitingMetrics();
      return;
    }

    if (event.target.matches("[data-recruiting-unit-filter]")) {
      setRecruitingMetricsUnitFilter(event.target.dataset.recruitingUnitFilter, event.target.value);
      return;
    }

    if (event.target.matches("[data-recruiting-mail-draft]")) {
      updateRecruitingMailDraft(event.target.dataset.recruitingMailDraft, event.target.value);
      return;
    }

    if (event.target.matches("[data-recruiting-request-mail-draft]")) {
      updateRecruitingRequestMailDraft(event.target.dataset.recruitingRequestMailDraft, event.target.value);
      return;
    }

    if (event.target.matches("select[data-recruiting-cell]")) {
      updateRecruitingSheetCell(event.target);
      renderRecruitingMetrics();
      return;
    }

    if (event.target.matches("[data-recruiting-complete]")) {
      toggleRecruitingMetricsComplete(event.target);
      return;
    }

    if (event.target.id === "screening-business-unit-filter") {
      updateScreeningBusinessUnitFilter(event.target.value);
      return;
    }

    if (event.target.id === "screening-folder-jd-file") {
      const file = event.target.files?.[0];
      if (file) {
        extractScreeningJdFileToTextarea(file, "#screening-folder-jd", "#screening-folder-jd-file-status");
      }
      return;
    }

    if (event.target.id === "screening-jd-file") {
      const file = event.target.files?.[0];
      if (file) {
        extractScreeningJdFileToTextarea(file, "#screening-jd-text", "#screening-jd-file-status");
      }
      return;
    }

    if (event.target.matches("[data-screening-opinion-applicant]")) {
      updateScreeningOpinion(event.target, { persist: true });
      return;
    }

    if (event.target.matches("[data-screening-slot-input]")) {
      syncScreeningAvailabilityPreview(event.target.closest("#screening-final-pass-form"));
      return;
    }

    if (event.target.matches("[data-screening-timeline-date]")) {
      syncScreeningAvailabilityPreview(event.target.closest("#screening-final-pass-form"));
      return;
    }

    if (event.target.matches("[data-interview-slot-input]")) {
      updateInterviewSlot(event.target, { rerender: true });
      return;
    }

    if (event.target.matches("[data-interview-confirmed]")) {
      updateInterviewConfirmed(event.target);
      return;
    }

    if (event.target.matches("[data-interview-auto-mail]")) {
      updateInterviewAutoMail(event.target);
      return;
    }

    if (event.target.matches("[data-interview-panel-field]")) {
      updateInterviewPanelField(event.target);
      return;
    }

    if (event.target.matches("[data-interview-note]")) {
      updateInterviewNote(event.target);
      return;
    }

    if (event.target.matches("[data-interview-document-upload]")) {
      uploadInterviewDocument(event.target).catch((error) => {
        console.warn(error);
        showToast("인터뷰 제출자료 업로드 중 오류가 발생했습니다.");
      });
      return;
    }

    if (["pool-status", "pool-business-unit", "pool-owner", "pool-sort"].includes(event.target.id)) {
      updatePoolFilters();
    }

    if (["member-role-filter", "member-status-filter"].includes(event.target.id)) {
      updateMemberFilters();
    }

    if (event.target.matches("[data-member-create-role]")) {
      syncMemberCreateBusinessUnitVisibility(event.target.closest("#member-create-form"));
      return;
    }

    if (event.target.matches("[data-detail-status-select]")) {
      changeCandidateStatus(event.target.value);
      return;
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

    if (event.target.id === "screening-applicant-resume") {
      const file = event.target.files?.[0];

      if (file) {
        parseResumeIntoScreeningApplicantForm(file);
      }
    }

    if (event.target.id === "screening-bulk-resumes") {
      const files = [...(event.target.files || [])];
      const status = $("#screening-bulk-status");

      if (status) {
        status.textContent = files.length
          ? `${files.length}개 이력서가 선택되었습니다. 등록 실행을 누르면 자동 등록됩니다.`
          : "파일을 여러 개 선택하거나 드래그앤드랍한 뒤 등록 실행을 눌러주세요.";
      }
    }

    if (event.target.id === "ai-search-file") {
      const file = event.target.files?.[0];

      if (file) {
        handleAiSearchFileUpload(file);
      }
    }

    if (event.target.id === "job-fit-jd-file") {
      const file = event.target.files?.[0];

      if (file) {
        handleJobFitJdFileUpload(file);
        event.target.value = "";
      }
    }

    if (event.target.id === "job-fit-resume-files") {
      const files = event.target.files;

      if (files?.length) {
        handleJobFitResumeUpload(files);
        event.target.value = "";
      }
    }

    if (event.target.id === "jd-enhance-file") {
      const file = event.target.files?.[0];

      if (file) {
        handleJdEnhanceFileUpload(file);
        event.target.value = "";
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
      const removeInput = $("#edit-photo-remove");
      const file = event.target.files?.[0];

      if (preview && file) {
        if (removeInput) removeInput.value = "0";
        state.editExtractedPhotoUrl = "";
        preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="업로드한 얼굴 프로필 사진 미리보기" />`;
      }
    }

    if (event.target.id === "edit-resume-file") {
      const file = event.target.files?.[0];

      if (file) {
        parseResumeIntoEditForm(file);
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
  if (isAuthenticated()) {
    recordPageVisit(getCurrentMember());
  }
  bindEvents();

  try {
    if (await ensureMemberPasswordHashes()) {
      persistState({ skipRemoteSync: true });
    }
  } catch (error) {
    console.warn("Member password hashes could not be migrated.", error);
  }

  if (REMOTE_SYNC_ENABLED) {
    state.candidates = [];
    state.selectedCandidateId = "";
    state.aiResults = [];
  }

  render();
  loadStateFromSupabase();
}

initializeApp();
