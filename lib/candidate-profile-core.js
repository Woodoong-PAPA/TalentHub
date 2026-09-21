(function attachCandidateProfileCore(root, factory) {
  const api = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.CandidateProfileCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createCandidateProfileCore() {
  "use strict";

  const REPORT_TYPES = {
    basic: "기본 프로필",
    interview: "인터뷰 프로필",
    multi: "복수 후보자 요약"
  };
  const FACT_TYPES = new Set(["FACT", "AI_INTERPRETATION", "INTERNAL_NOTE"]);
  const VERIFICATION_STATUSES = new Set(["VERIFIED", "LIKELY", "AMBIGUOUS", "UNVERIFIED", "INCORRECT"]);
  const CONFIDENCE_LEVELS = new Set(["HIGH", "MEDIUM", "UNVERIFIED"]);

  function createId(prefix = "item") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function toText(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeLinkedInUrl(value) {
    const raw = toText(value);

    if (!raw) {
      return "";
    }

    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    try {
      const url = new URL(candidate);
      const host = url.hostname.toLowerCase().replace(/^www\./, "");

      if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) {
        return "";
      }

      if (!/^\/in\/[a-z0-9%_.-]+\/?$/i.test(url.pathname)) {
        return "";
      }

      url.protocol = "https:";
      url.hostname = "www.linkedin.com";
      url.search = "";
      url.hash = "";
      url.pathname = url.pathname.replace(/\/+$/, "");
      return url.toString().replace(/\/$/, "");
    } catch (error) {
      return "";
    }
  }

  function normalizeFact(value = {}) {
    const type = FACT_TYPES.has(value.type) ? value.type : "FACT";
    const verificationStatus = VERIFICATION_STATUSES.has(value.verificationStatus)
      ? value.verificationStatus
      : type === "AI_INTERPRETATION"
        ? "UNVERIFIED"
        : "LIKELY";
    const confidence = CONFIDENCE_LEVELS.has(value.confidence)
      ? value.confidence
      : verificationStatus === "VERIFIED"
        ? "HIGH"
        : "MEDIUM";

    return {
      id: toText(value.id) || createId("fact"),
      candidateId: toText(value.candidateId),
      category: toText(value.category) || "EXPERTISE",
      claim: toText(value.claim),
      value: toText(value.value),
      type,
      sourceId: toText(value.sourceId),
      sourceUrl: toText(value.sourceUrl),
      sourceTitle: toText(value.sourceTitle),
      sourceType: toText(value.sourceType) || "OTHER",
      sourceDate: toText(value.sourceDate),
      accessedDate: toText(value.accessedDate),
      confidence,
      verificationStatus,
      createdAt: toText(value.createdAt) || new Date().toISOString(),
      updatedAt: toText(value.updatedAt) || new Date().toISOString()
    };
  }

  function normalizeCandidate(value = {}) {
    const id = toText(value.id) || createId("candidate-master");
    const candidate = {
      id,
      name: toText(value.name) || "이름 미확인",
      headline: toText(value.headline),
      location: toText(value.location),
      photoUrl: toText(value.photoUrl || value.photo_url),
      linkedinUrl: normalizeLinkedInUrl(value.linkedinUrl || value.linkedin_url),
      currentCompany: toText(value.currentCompany || value.current_company),
      currentPosition: toText(value.currentPosition || value.current_position),
      candidateType: toText(value.candidateType || value.candidate_type) || "OTHER",
      identityStatus: VERIFICATION_STATUSES.has(value.identityStatus) ? value.identityStatus : "LIKELY",
      researchStatus: toText(value.researchStatus) || "READY",
      researchPurpose: toText(value.researchPurpose),
      targetPosition: toText(value.targetPosition),
      summary: toText(value.summary),
      expertise: Array.isArray(value.expertise) ? value.expertise.map(toText).filter(Boolean) : [],
      education: Array.isArray(value.education) ? value.education.map((item) => ({
        id: toText(item.id) || createId("edu"),
        school: toText(item.school),
        degree: toText(item.degree),
        major: toText(item.major),
        startYear: toText(item.startYear || item.start_year),
        endYear: toText(item.endYear || item.end_year)
      })) : [],
      experience: Array.isArray(value.experience) ? value.experience.map((item) => ({
        id: toText(item.id) || createId("career"),
        company: toText(item.company),
        position: toText(item.position),
        startDate: toText(item.startDate || item.start_date),
        endDate: toText(item.endDate || item.end_date),
        description: toText(item.description)
      })) : [],
      facts: Array.isArray(value.facts) ? value.facts.map((fact) => normalizeFact({ ...fact, candidateId: id })) : [],
      sources: Array.isArray(value.sources) ? value.sources.map((source) => ({
        id: toText(source.id) || createId("source"),
        title: toText(source.title),
        publisher: toText(source.publisher),
        url: toText(source.url),
        type: toText(source.type) || "OTHER",
        publishedAt: toText(source.publishedAt || source.published_at),
        accessedAt: toText(source.accessedAt || source.accessed_at),
        tier: Math.max(1, Math.min(3, Number(source.tier || 3)))
      })) : [],
      internalNotes: Array.isArray(value.internalNotes) ? value.internalNotes.map((note) => ({
        id: toText(note.id) || createId("note"),
        text: toText(note.text),
        author: toText(note.author),
        createdAt: toText(note.createdAt) || new Date().toISOString()
      })).filter((note) => note.text) : [],
      createdAt: toText(value.createdAt) || new Date().toISOString(),
      updatedAt: toText(value.updatedAt) || new Date().toISOString(),
      lastResearchedAt: toText(value.lastResearchedAt) || new Date().toISOString()
    };

    return candidate;
  }

  function classifyCandidateType(input = {}) {
    const text = [
      input.headline,
      input.currentPosition,
      input.currentCompany,
      ...(input.expertise || []),
      ...(input.experience || []).flatMap((item) => [item.position, item.description])
    ].map(toText).join(" ").toLowerCase();

    if (/invest|venture|capital|portfolio|m&a|투자|펀드/.test(text)) return "INVESTOR";
    if (/founder|co-founder|entrepreneur|창업|대표/.test(text)) return "ENTREPRENEUR";
    if (/professor|research|scientist|박사|연구|교수/.test(text)) return "RESEARCHER";
    if (/ceo|cto|cfo|chief|vice president|vp|director|head|임원|부사장|전무|상무|총괄/.test(text)) return "EXECUTIVE";
    if (/engineer|developer|architect|software|robot|개발|엔지니어|아키텍트/.test(text)) return "ENGINEER";
    return "OTHER";
  }

  function getResearchSteps(mode = "deep") {
    const base = [
      { id: "intake", label: "입력 정보 확인", description: "URL과 검토 목적을 확인합니다." },
      { id: "profile", label: "프로필 정규화", description: "LinkedIn 데이터를 후보자 마스터 구조로 정리합니다." },
      { id: "identity", label: "동일인 검증", description: "회사, 학력, 경력 시점을 교차 확인합니다." }
    ];

    if (mode === "deep") {
      base.push(
        { id: "research", label: "공개 소스 조사", description: "공식 프로필과 신뢰 가능한 공개 자료를 확인합니다." },
        { id: "facts", label: "사실 및 출처 정리", description: "주장과 근거를 Fact 단위로 연결합니다." }
      );
    } else {
      base.push({ id: "facts", label: "제공 자료 정리", description: "업로드 자료에서 확인 가능한 사실만 정리합니다." });
    }

    base.push({ id: "review", label: "검토 준비", description: "담당자 검토용 후보자 마스터를 생성합니다." });
    return base;
  }

  function createMockCandidate(input = {}) {
    const linkedinUrl = normalizeLinkedInUrl(input.linkedinUrl);
    const slug = linkedinUrl.split("/").filter(Boolean).pop() || "candidate";
    const suppliedName = toText(input.candidateName);
    const displayName = suppliedName || (slug.includes("park") ? "박서준" : slug.includes("lee") ? "이수현" : "김하린");
    const company = toText(input.currentCompany) || "Nexa Robotics";
    const position = toText(input.currentPosition) || "AI Robotics Director";
    const candidateId = createId("candidate-master");
    const today = new Date().toISOString();
    const sources = [
      {
        id: createId("source"),
        title: `${company} Leadership Profile`,
        publisher: company,
        url: `https://example.com/company/${encodeURIComponent(slug)}`,
        type: "OFFICIAL_COMPANY",
        publishedAt: "2026-04-18",
        accessedAt: today,
        tier: 1
      },
      {
        id: createId("source"),
        title: "Autonomous Manipulation Systems Conference Profile",
        publisher: "Korea Robotics Conference",
        url: `https://example.org/conference/${encodeURIComponent(slug)}`,
        type: "CONFERENCE",
        publishedAt: "2025-11-07",
        accessedAt: today,
        tier: 1
      },
      {
        id: createId("source"),
        title: `${displayName} 기술 리더 인터뷰`,
        publisher: "Tech Review Korea",
        url: `https://example.net/interview/${encodeURIComponent(slug)}`,
        type: "NEWS_INTERVIEW",
        publishedAt: "2025-08-22",
        accessedAt: today,
        tier: 2
      }
    ];
    const facts = [
      {
        id: createId("fact"),
        candidateId,
        category: "CAREER",
        claim: "현재 직책",
        value: `${company} ${position}`,
        type: "FACT",
        sourceId: sources[0].id,
        sourceUrl: sources[0].url,
        sourceTitle: sources[0].title,
        sourceType: sources[0].type,
        confidence: "HIGH",
        verificationStatus: "VERIFIED"
      },
      {
        id: createId("fact"),
        candidateId,
        category: "PROJECT",
        claim: "로봇 조작 시스템 상용화",
        value: "비정형 물체 조작 모델을 제품 제어 시스템에 적용한 프로젝트를 주도",
        type: "FACT",
        sourceId: sources[1].id,
        sourceUrl: sources[1].url,
        sourceTitle: sources[1].title,
        sourceType: sources[1].type,
        confidence: "HIGH",
        verificationStatus: "VERIFIED"
      },
      {
        id: createId("fact"),
        candidateId,
        category: "LEADERSHIP",
        claim: "기술 조직 리더십",
        value: "연구와 제품 개발 사이의 실행 체계를 구축한 것으로 평가됨",
        type: "AI_INTERPRETATION",
        sourceId: sources[2].id,
        sourceUrl: sources[2].url,
        sourceTitle: sources[2].title,
        sourceType: sources[2].type,
        confidence: "MEDIUM",
        verificationStatus: "UNVERIFIED"
      }
    ].map(normalizeFact);
    const candidate = normalizeCandidate({
      id: candidateId,
      name: displayName,
      headline: `${position} | Robot AI & Autonomous Systems`,
      location: "Seoul, Korea",
      linkedinUrl,
      currentCompany: company,
      currentPosition: position,
      candidateType: "ENGINEER",
      identityStatus: "LIKELY",
      researchStatus: "REVIEW_REQUIRED",
      researchPurpose: input.reviewPurpose,
      targetPosition: input.targetPosition,
      summary: "로봇 AI 학습, 제어 및 제품화 경험을 함께 보유한 기술 리더 후보입니다. 공개 자료의 주요 경력은 교차 확인되었으며, 조직 규모와 정량 성과는 담당자 확인이 필요합니다.",
      expertise: ["Robot AI", "Motion Planning", "Technical Leadership"],
      education: [
        { school: "한국과학기술원", degree: "박사", major: "전산학", startYear: "2011", endYear: "2016" },
        { school: "서울대학교", degree: "학사", major: "전기정보공학", startYear: "2007", endYear: "2011" }
      ],
      experience: [
        { company, position, startDate: "2022-03", endDate: "현재", description: "로봇 AI 제품 및 연구개발 조직을 총괄" },
        { company: "Atlas Intelligence", position: "Principal Research Engineer", startDate: "2018-01", endDate: "2022-02", description: "강화학습 기반 로봇 제어 및 조작 모델 개발" },
        { company: "KAIST Robotics Lab", position: "Researcher", startDate: "2011-03", endDate: "2017-12", description: "자율 로봇 학습과 제어 연구" }
      ],
      facts,
      sources,
      internalNotes: input.additionalNotes ? [{ text: input.additionalNotes, author: "채용담당자", createdAt: today }] : [],
      createdAt: today,
      updatedAt: today,
      lastResearchedAt: today
    });
    candidate.candidateType = classifyCandidateType(candidate);
    return candidate;
  }

  function formatPeriod(start, end) {
    const startText = toText(start);
    const endText = toText(end) || "현재";
    return [startText, endText].filter(Boolean).join("~");
  }

  function buildReportSections(type, candidates, context = {}) {
    const normalizedCandidates = (Array.isArray(candidates) ? candidates : [candidates]).filter(Boolean).map(normalizeCandidate);
    const primary = normalizedCandidates[0];

    if (!primary) {
      return [];
    }

    if (type === "multi") {
      return [
        {
          id: "summary",
          title: `${toText(context.targetPosition) || "핵심인재"} 후보 : ${normalizedCandidates.length}명`,
          body: normalizedCandidates.map((candidate) => {
            const career = candidate.experience.slice(0, 2).map((item) => `${item.company} ${item.position}`).join(" / ");
            const education = candidate.education.slice(0, 1).map((item) => `${item.school} ${item.degree}`).join(" / ");
            return `[${candidate.expertise[0] || candidate.candidateType}] ${candidate.name}\n${career}${education ? ` / ${education}` : ""}\n${candidate.expertise.slice(0, 3).join(" · ")}`;
          }).join("\n\n")
        },
        {
          id: "context",
          title: "검토 맥락",
          body: toText(context.reviewPurpose) || "후보자별 검증 사실과 전문성을 기준으로 비교 검토"
        }
      ];
    }

    const education = primary.education.map((item) => `${item.degree}) ${item.school}, ${item.major} (${formatPeriod(item.startYear, item.endYear)})`).join("\n");
    const career = primary.experience.map((item) => `${item.company}, ${item.position} (${formatPeriod(item.startDate, item.endDate)})`).join("\n");
    const verifiedFacts = primary.facts.filter((fact) => fact.type === "FACT" && fact.verificationStatus === "VERIFIED");

    if (type === "interview") {
      const evidence = verifiedFacts.slice(0, 3).map((fact) => `- ${fact.value}`).join("\n");
      return [
        { id: "personal", title: "인적사항", body: `${primary.name}\n${education}\n${career}` },
        { id: "expertise", title: `핵심 전문성 : ${primary.expertise[0] || "추가 확인 필요"}`, body: primary.summary },
        { id: "message", title: "Executive Message", body: `연구와 제품화를 연결하는 ${primary.expertise[0] || "기술"} 전문가\n${evidence}` },
        { id: "talking", title: "Talking Point", body: [
          `${toText(context.targetPosition || primary.targetPosition) || "검토 포지션"}에서 가장 먼저 개선하고 싶은 기술 과제`,
          "연구 성과를 제품 또는 사업 성과로 연결한 의사결정 경험",
          "핵심 기술 인재를 채용하고 성장시킨 조직 운영 방식"
        ].map((item, index) => `${index + 1}. ${item}`).join("\n") }
      ];
    }

    return [
      { id: "personal", title: "인적사항", body: `${primary.name}\n${education}` },
      { id: "career", title: "주요 경력", body: career },
      { id: "reference", title: "Reference Information", body: verifiedFacts.map((fact) => `- ${fact.value}`).join("\n") || "검증 완료된 사실이 없습니다." },
      { id: "internal", title: "내부 검토 정보", body: primary.internalNotes.map((note) => `- ${note.text}`).join("\n") || "등록된 내부 정보가 없습니다." }
    ];
  }

  function createReport(type, candidates, context = {}) {
    const safeType = REPORT_TYPES[type] ? type : "basic";
    const normalizedCandidates = (Array.isArray(candidates) ? candidates : [candidates]).filter(Boolean).map(normalizeCandidate);
    const primary = normalizedCandidates[0];

    return {
      id: createId("candidate-report"),
      type: safeType,
      title: safeType === "multi"
        ? `${toText(context.targetPosition) || "핵심인재"} 후보 요약`
        : `${primary?.name || "후보자"} ${REPORT_TYPES[safeType]}`,
      candidateIds: normalizedCandidates.map((candidate) => candidate.id),
      status: "DRAFT",
      sections: buildReportSections(safeType, normalizedCandidates, context),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function getVerificationCounts(candidate) {
    const facts = normalizeCandidate(candidate).facts.filter((fact) => fact.type === "FACT");
    return facts.reduce((result, fact) => {
      const key = fact.verificationStatus;
      result[key] = (result[key] || 0) + 1;
      return result;
    }, { VERIFIED: 0, LIKELY: 0, AMBIGUOUS: 0, UNVERIFIED: 0, INCORRECT: 0 });
  }

  return {
    REPORT_TYPES,
    createId,
    normalizeLinkedInUrl,
    normalizeFact,
    normalizeCandidate,
    classifyCandidateType,
    getResearchSteps,
    createMockCandidate,
    buildReportSections,
    createReport,
    getVerificationCounts
  };
});
