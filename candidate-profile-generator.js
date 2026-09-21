(function initializeCandidateProfileGenerator() {
  "use strict";

  const core = window.CandidateProfileCore;
  const STORAGE_KEY = "candidate-profile-generator-state-v1";
  const REMOTE_SETTING_KEY = "candidate_profile_generator_v1";
  const APP_CONFIG = window.__APP_CONFIG__ || {};
  const REMOTE_ENABLED = APP_CONFIG.dataSource === "supabase" && APP_CONFIG.supabaseUrl && APP_CONFIG.supabaseAnonKey;
  const SECTIONS = [
    { id: "dashboard", label: "대시보드", shortLabel: "홈", icon: "⌂" },
    { id: "new-research", label: "새 리서치", shortLabel: "리서치", icon: "+" },
    { id: "candidates", label: "후보자", shortLabel: "후보자", icon: "인" },
    { id: "reports", label: "보고서", shortLabel: "보고서", icon: "문" },
    { id: "templates", label: "템플릿", shortLabel: "템플릿", icon: "틀" },
    { id: "settings", label: "설정", shortLabel: "설정", icon: "설" }
  ];
  const CANDIDATE_TABS = [
    ["overview", "개요"],
    ["career", "경력"],
    ["education", "학력"],
    ["expertise", "전문성"],
    ["achievements", "성과"],
    ["research", "리서치"],
    ["sources", "출처"],
    ["notes", "내부 메모"]
  ];
  let currentUser = null;
  let remoteLoaded = false;
  let remoteSaveTimer = null;
  let searchQuery = "";
  let typeFilter = "all";
  let reportType = "basic";
  let selectedReportCandidateIds = [];
  let uploadedFileNames = [];

  function createSeedState() {
    const first = core.createMockCandidate({
      linkedinUrl: "https://www.linkedin.com/in/harin-kim-example",
      candidateName: "김하린",
      currentCompany: "Nexa Robotics",
      currentPosition: "AI Robotics Director",
      reviewPurpose: "로봇 AI 리더 후보 검토",
      targetPosition: "Robot Intelligence Lab장"
    });
    const second = core.createMockCandidate({
      linkedinUrl: "https://www.linkedin.com/in/seojun-park-example",
      candidateName: "박서준",
      currentCompany: "Orbit Mobility",
      currentPosition: "VP of Autonomous Systems",
      reviewPurpose: "자율주행 기술 리더 검토",
      targetPosition: "Autonomous Platform 총괄"
    });
    second.candidateType = "EXECUTIVE";
    second.expertise = ["Autonomous Systems", "Platform Strategy", "Organization Leadership"];
    second.summary = "자율주행 플랫폼의 연구, 제품 전략 및 조직 운영을 경험한 기술 임원 후보입니다. 공개된 경력은 확인되었으며 사업 성과 수치는 추가 검증이 필요합니다.";

    return {
      version: 1,
      activeSection: "dashboard",
      selectedCandidateId: first.id,
      selectedCandidateTab: "overview",
      selectedReportId: "",
      candidates: [first, second],
      researchRuns: [],
      reports: [],
      templates: [
        { id: "basic", name: "기본 프로필", description: "일반 후보 검토용 1인 1페이지 보고서", enabled: true },
        { id: "interview", name: "인터뷰 프로필", description: "Executive Message와 Talking Point 중심", enabled: true },
        { id: "multi", name: "복수 후보자 요약", description: "3~5명 비교 검토용 1페이지 보고서", enabled: true }
      ],
      settings: {
        apifyConfigured: false,
        openAiConfigured: false,
        webSearchConfigured: false,
        defaultResearchMode: "deep"
      },
      updatedAt: new Date().toISOString()
    };
  }

  function normalizeState(value) {
    const fallback = createSeedState();
    const source = value && typeof value === "object" ? value : fallback;
    const candidates = Array.isArray(source.candidates) ? source.candidates.map(core.normalizeCandidate) : fallback.candidates;
    const candidateIds = new Set(candidates.map((candidate) => candidate.id));
    const activeSection = SECTIONS.some((item) => item.id === source.activeSection) ? source.activeSection : "dashboard";

    return {
      ...fallback,
      ...source,
      version: 1,
      activeSection,
      selectedCandidateId: candidateIds.has(source.selectedCandidateId) ? source.selectedCandidateId : candidates[0]?.id || "",
      selectedCandidateTab: CANDIDATE_TABS.some(([id]) => id === source.selectedCandidateTab) ? source.selectedCandidateTab : "overview",
      candidates,
      researchRuns: Array.isArray(source.researchRuns) ? source.researchRuns : [],
      reports: Array.isArray(source.reports) ? source.reports : [],
      templates: Array.isArray(source.templates) && source.templates.length ? source.templates : fallback.templates,
      settings: { ...fallback.settings, ...(source.settings || {}) }
    };
  }

  function loadLocalState() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      return normalizeState(saved);
    } catch (error) {
      console.warn("Candidate Profile Generator state could not be loaded.", error);
      return normalizeState(null);
    }
  }

  let workspace = loadLocalState();

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function inputValue(value) {
    return escapeHtml(value).replace(/\r?\n/g, "&#10;");
  }

  function showMessage(message) {
    if (typeof window.showToast === "function") {
      window.showToast(message);
      return;
    }

    const status = document.querySelector("#cpg-live-status");
    if (status) status.textContent = message;
  }

  function getContainer() {
    return document.querySelector("#profile-generator-content");
  }

  function getCurrentCandidate() {
    return workspace.candidates.find((candidate) => candidate.id === workspace.selectedCandidateId) || workspace.candidates[0] || null;
  }

  function persist(options = {}) {
    workspace.updatedAt = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));

    if (options.remote !== false) {
      window.clearTimeout(remoteSaveTimer);
      remoteSaveTimer = window.setTimeout(() => {
        saveRemoteState().catch((error) => console.warn("Candidate Profile Generator sync failed.", error));
      }, 350);
    }
  }

  async function supabaseRequest(path, options = {}) {
    const baseUrl = String(APP_CONFIG.supabaseUrl || "").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: APP_CONFIG.supabaseAnonKey,
        Authorization: `Bearer ${APP_CONFIG.supabaseAnonKey}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async function saveRemoteState() {
    if (!REMOTE_ENABLED) return;

    await supabaseRequest("app_settings?on_conflict=setting_key", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify([{
        setting_key: REMOTE_SETTING_KEY,
        payload: workspace,
        updated_at: workspace.updatedAt
      }])
    });
  }

  async function loadRemoteState() {
    if (!REMOTE_ENABLED || remoteLoaded) return;
    remoteLoaded = true;

    try {
      const rows = await supabaseRequest(`app_settings?select=payload,updated_at&setting_key=eq.${REMOTE_SETTING_KEY}&limit=1`);
      const remote = rows?.[0]?.payload;

      if (remote && new Date(rows[0].updated_at || remote.updatedAt || 0).getTime() >= new Date(workspace.updatedAt || 0).getTime()) {
        workspace = normalizeState(remote);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
        render();
      } else if (!remote) {
        await saveRemoteState();
      }
    } catch (error) {
      console.warn("Candidate Profile Generator remote state could not be loaded.", error);
      showMessage("후보자 리서치 데이터는 현재 기기에 저장되었습니다. 원격 동기화 연결을 확인해주세요.");
    }
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  }

  function candidateInitials(name) {
    const normalized = String(name || "").trim();
    return normalized ? normalized.slice(0, 2) : "인재";
  }

  function renderAvatar(candidate, size = "medium") {
    if (candidate.photoUrl) {
      return `<img class="cpg-avatar is-${size}" src="${escapeHtml(candidate.photoUrl)}" alt="${escapeHtml(candidate.name)} 프로필" />`;
    }
    return `<span class="cpg-avatar cpg-avatar-fallback is-${size}" aria-hidden="true">${escapeHtml(candidateInitials(candidate.name))}</span>`;
  }

  function verificationLabel(status) {
    return {
      VERIFIED: "검증됨",
      LIKELY: "일치 가능성 높음",
      AMBIGUOUS: "동일인 확인 필요",
      UNVERIFIED: "미검증",
      INCORRECT: "사실 아님"
    }[status] || status;
  }

  function researchStatusLabel(status) {
    return {
      RUNNING: "리서치 중",
      REVIEW_REQUIRED: "담당자 검토 필요",
      READY: "검토 완료",
      FAILED: "확인 필요"
    }[status] || status;
  }

  function renderSectionNavigation() {
    return `
      <nav class="cpg-section-nav" aria-label="Candidate Profile Generator 메뉴">
        ${SECTIONS.map((section) => `
          <button class="cpg-section-nav-item ${workspace.activeSection === section.id ? "is-active" : ""}" type="button" data-cpg-section="${section.id}">
            <span>${escapeHtml(section.label)}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  function renderMobileNavigation() {
    const mobileSections = SECTIONS.filter((section) => !["templates"].includes(section.id));
    return `
      <nav class="cpg-mobile-nav" aria-label="모바일 빠른 메뉴">
        ${mobileSections.map((section) => `
          <button class="cpg-mobile-nav-item ${workspace.activeSection === section.id ? "is-active" : ""}" type="button" data-cpg-section="${section.id}">
            <span class="cpg-mobile-nav-icon" aria-hidden="true">${escapeHtml(section.icon)}</span>
            <span>${escapeHtml(section.shortLabel)}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  function renderDashboard() {
    const activeRuns = workspace.researchRuns.filter((run) => run.status === "RUNNING");
    const reviewCount = workspace.candidates.filter((candidate) => candidate.researchStatus === "REVIEW_REQUIRED").length;
    const verifiedFacts = workspace.candidates.flatMap((candidate) => candidate.facts).filter((fact) => fact.verificationStatus === "VERIFIED").length;
    const latestCandidates = [...workspace.candidates].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4);

    return `
      <div class="cpg-page-head">
        <div>
          <p class="eyebrow">Research Workspace</p>
          <h4>후보자 리서치 대시보드</h4>
          <p>검증 가능한 사실을 모아 재사용 가능한 후보자 마스터를 관리합니다.</p>
        </div>
        <button class="primary-button" type="button" data-cpg-section="new-research">새 리서치</button>
      </div>
      <div class="cpg-metric-grid">
        <button class="cpg-metric" type="button" data-cpg-section="candidates"><span>후보자 마스터</span><strong>${workspace.candidates.length}</strong><small>명</small></button>
        <button class="cpg-metric" type="button" data-cpg-section="dashboard"><span>진행 중</span><strong>${activeRuns.length}</strong><small>건</small></button>
        <button class="cpg-metric" type="button" data-cpg-section="candidates"><span>검토 필요</span><strong>${reviewCount}</strong><small>명</small></button>
        <button class="cpg-metric" type="button" data-cpg-section="reports"><span>검증 Fact</span><strong>${verifiedFacts}</strong><small>건</small></button>
      </div>
      ${renderResearchRuns(activeRuns.length ? activeRuns : workspace.researchRuns.slice(0, 2))}
      <section class="cpg-panel">
        <div class="cpg-panel-head"><div><strong>최근 후보자</strong><span>리서치 결과와 검토 상태</span></div><button class="ghost-button compact-button" type="button" data-cpg-section="candidates">전체 보기</button></div>
        <div class="cpg-candidate-quick-list">
          ${latestCandidates.map((candidate) => renderCandidateQuickCard(candidate)).join("") || '<div class="empty-state">등록된 후보자가 없습니다.</div>'}
        </div>
      </section>
    `;
  }

  function renderResearchRuns(runs) {
    if (!runs.length) return "";

    return `
      <section class="cpg-panel">
        <div class="cpg-panel-head"><div><strong>리서치 진행 현황</strong><span>진행 중이거나 최근 완료된 작업</span></div></div>
        <div class="cpg-run-list">
          ${runs.map((run) => `
            <article class="cpg-run-row">
              <div class="cpg-run-main">
                <strong>${escapeHtml(run.candidateName || "후보자 이름 확인 중")}</strong>
                <span>${escapeHtml(run.currentStepLabel || researchStatusLabel(run.status))}</span>
              </div>
              <div class="cpg-progress" aria-label="${Number(run.progress || 0)}% 진행"><span style="width:${Math.max(0, Math.min(100, Number(run.progress || 0)))}%"></span></div>
              <b>${Number(run.progress || 0)}%</b>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderCandidateQuickCard(candidate) {
    const counts = core.getVerificationCounts(candidate);
    return `
      <button class="cpg-candidate-quick" type="button" data-cpg-open-candidate="${candidate.id}">
        ${renderAvatar(candidate, "small")}
        <span class="cpg-candidate-quick-copy">
          <strong>${escapeHtml(candidate.name)}</strong>
          <span>${escapeHtml(candidate.currentCompany)} · ${escapeHtml(candidate.currentPosition)}</span>
          <small>${escapeHtml(candidate.expertise.slice(0, 2).join(" · "))}</small>
        </span>
        <span class="cpg-verified-count">검증 ${counts.VERIFIED}</span>
      </button>
    `;
  }

  function renderNewResearch() {
    const running = workspace.researchRuns.find((run) => run.status === "RUNNING");
    return `
      <div class="cpg-page-head">
        <div>
          <p class="eyebrow">New Research</p>
          <h4>새 후보자 리서치</h4>
          <p>모바일에서는 LinkedIn URL과 검토 목적만 입력해도 바로 시작할 수 있습니다.</p>
        </div>
      </div>
      ${running ? renderResearchRuns([running]) : ""}
      <form id="cpg-research-form" class="cpg-form-panel">
        <section class="cpg-form-section">
          <div class="cpg-section-title"><strong>필수 정보</strong><span>후보자를 식별할 수 있는 공개 프로필 주소</span></div>
          <label class="field full">
            <span>LinkedIn URL</span>
            <div class="cpg-url-input-row">
              <input class="control-input" id="cpg-linkedin-url" name="linkedinUrl" type="url" inputmode="url" autocomplete="url" placeholder="https://www.linkedin.com/in/..." required />
              <button class="ghost-button" type="button" data-cpg-paste-url>붙여넣기</button>
            </div>
            <small class="form-help">개인 프로필의 /in/ URL만 사용합니다. LinkedIn 비밀번호는 수집하지 않습니다.</small>
          </label>
        </section>
        <section class="cpg-form-section">
          <div class="cpg-section-title"><strong>검토 맥락</strong><span>검색 범위와 보고서 관점을 정하는 정보</span></div>
          <div class="field-grid cpg-research-fields">
            <label class="field"><span>후보자명</span><input class="control-input" name="candidateName" autocomplete="name" placeholder="선택 입력" /></label>
            <label class="field"><span>현재 회사</span><input class="control-input" name="currentCompany" autocomplete="organization" placeholder="선택 입력" /></label>
            <label class="field"><span>현재 직책</span><input class="control-input" name="currentPosition" autocomplete="organization-title" placeholder="선택 입력" /></label>
            <label class="field"><span>검토 목적</span><select class="control-select" name="reviewPurpose"><option value="핵심인재 검토">핵심인재 검토</option><option value="면담 준비">면담 준비</option><option value="포지션 적합성 검토">포지션 적합성 검토</option><option value="후보군 비교">후보군 비교</option></select></label>
            <label class="field full"><span>검토 포지션</span><input class="control-input" name="targetPosition" placeholder="예: Robot Intelligence Lab장" /></label>
            <label class="field full"><span>추가 메모</span><textarea class="control-textarea" name="additionalNotes" placeholder="내부 검토 맥락만 입력하세요. 공개 출처 정보와 분리 보관됩니다."></textarea></label>
          </div>
        </section>
        <section class="cpg-form-section">
          <div class="cpg-section-title"><strong>자료 및 조사 범위</strong><span>필요하면 URL이나 파일을 함께 등록합니다.</span></div>
          <label class="field full"><span>추가 URL</span><textarea class="control-textarea is-compact" name="additionalUrls" placeholder="공식 회사 프로필, 개인 홈페이지, 논문 URL 등을 한 줄에 하나씩 입력"></textarea></label>
          <label class="cpg-file-drop">
            <input id="cpg-research-files" name="researchFiles" type="file" multiple accept=".pdf,.doc,.docx,.txt" />
            <strong>CV/PDF 및 참고자료 추가</strong>
            <span>${uploadedFileNames.length ? escapeHtml(uploadedFileNames.join(", ")) : "파일을 선택하거나 이 영역에 놓으세요."}</span>
          </label>
          <fieldset class="cpg-mode-control">
            <legend>Research Mode</legend>
            <label><input type="radio" name="researchMode" value="deep" ${workspace.settings.defaultResearchMode === "deep" ? "checked" : ""} /><span><strong>Deep Research</strong><small>공식·공개 소스를 함께 조사</small></span></label>
            <label><input type="radio" name="researchMode" value="materials" ${workspace.settings.defaultResearchMode === "materials" ? "checked" : ""} /><span><strong>Provided Materials Only</strong><small>제공 자료만 사용</small></span></label>
          </fieldset>
        </section>
        <div class="cpg-sticky-actions"><button class="primary-button" type="submit" ${running ? "disabled" : ""}>${running ? "리서치 진행 중" : "후보자 리서치 시작"}</button></div>
      </form>
    `;
  }

  function getFilteredCandidates() {
    const query = searchQuery.trim().toLowerCase();
    return workspace.candidates.filter((candidate) => {
      const text = [candidate.name, candidate.currentCompany, candidate.currentPosition, candidate.summary, ...candidate.expertise].join(" ").toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesType = typeFilter === "all" || candidate.candidateType === typeFilter || candidate.expertise.some((item) => item.toLowerCase().includes(typeFilter.toLowerCase()));
      return matchesQuery && matchesType;
    });
  }

  function renderCandidates() {
    const candidates = getFilteredCandidates();
    return `
      <div class="cpg-page-head">
        <div><p class="eyebrow">Candidate Library</p><h4>후보자 라이브러리</h4><p>기존 후보자는 전체 조사를 반복하지 않고 업데이트 리서치로 새 정보만 확인합니다.</p></div>
        <button class="primary-button" type="button" data-cpg-section="new-research">후보자 등록</button>
      </div>
      <div class="cpg-library-toolbar">
        <label class="cpg-search-field"><span class="sr-only">후보자 검색</span><input class="control-input" id="cpg-candidate-search" type="search" value="${inputValue(searchQuery)}" placeholder="이름, 회사, 직책, 전문성 검색" /></label>
        <label><span class="sr-only">후보자 유형</span><select class="control-select" id="cpg-type-filter"><option value="all">전체 유형</option>${["RESEARCHER", "ENGINEER", "EXECUTIVE", "INVESTOR", "ENTREPRENEUR"].map((value) => `<option value="${value}" ${typeFilter === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
      </div>
      <div class="cpg-library-table" role="table" aria-label="후보자 라이브러리">
        <div class="cpg-library-head" role="row"><span>후보자</span><span>현재 소속</span><span>전문성</span><span>검토 상태</span><span>최근 조사</span><span>관리</span></div>
        ${candidates.map((candidate) => renderCandidateRow(candidate)).join("") || '<div class="empty-state">조건에 맞는 후보자가 없습니다.</div>'}
      </div>
    `;
  }

  function renderCandidateRow(candidate) {
    return `
      <article class="cpg-library-row" role="row">
        <div class="cpg-library-person">${renderAvatar(candidate, "small")}<span><strong>${escapeHtml(candidate.name)}</strong><small>${escapeHtml(candidate.candidateType)}</small></span></div>
        <div data-label="현재 소속"><strong>${escapeHtml(candidate.currentCompany)}</strong><span>${escapeHtml(candidate.currentPosition)}</span></div>
        <div class="cpg-tag-list" data-label="전문성">${candidate.expertise.slice(0, 3).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        <div data-label="검토 상태"><span class="cpg-status is-${candidate.researchStatus.toLowerCase()}">${escapeHtml(researchStatusLabel(candidate.researchStatus))}</span></div>
        <div data-label="최근 조사"><span>${escapeHtml(formatDate(candidate.lastResearchedAt))}</span></div>
        <div class="cpg-row-actions"><button class="ghost-button compact-button" type="button" data-cpg-open-candidate="${candidate.id}">검토</button><button class="ghost-button compact-button" type="button" data-cpg-update-research="${candidate.id}">업데이트</button></div>
      </article>
    `;
  }

  function renderCandidateDetail(candidate) {
    if (!candidate) return '<div class="empty-state">후보자를 선택해주세요.</div>';
    const counts = core.getVerificationCounts(candidate);
    return `
      <div class="cpg-detail-back-row"><button class="ghost-button compact-button" type="button" data-cpg-section="candidates">목록으로</button><button class="primary-button compact-button" type="button" data-cpg-report-candidate="${candidate.id}">보고서 생성</button></div>
      <header class="cpg-candidate-hero">
        ${renderAvatar(candidate, "large")}
        <div class="cpg-candidate-hero-copy"><div class="cpg-name-line"><h4>${escapeHtml(candidate.name)}</h4><span class="cpg-identity is-${candidate.identityStatus.toLowerCase()}">${escapeHtml(verificationLabel(candidate.identityStatus))}</span></div><p>${escapeHtml(candidate.currentCompany)} · ${escapeHtml(candidate.currentPosition)}</p><span>${escapeHtml(candidate.location || "위치 정보 없음")} · 최근 조사 ${escapeHtml(formatDate(candidate.lastResearchedAt))}</span><div class="cpg-tag-list">${candidate.expertise.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></div>
        <div class="cpg-candidate-score"><span>검증 Fact</span><strong>${counts.VERIFIED}</strong><small>미검증 ${counts.UNVERIFIED + counts.AMBIGUOUS}</small></div>
      </header>
      <div class="cpg-candidate-tabs" role="tablist">${CANDIDATE_TABS.map(([id, label]) => `<button type="button" role="tab" aria-selected="${workspace.selectedCandidateTab === id}" class="${workspace.selectedCandidateTab === id ? "is-active" : ""}" data-cpg-candidate-tab="${id}">${escapeHtml(label)}</button>`).join("")}</div>
      <div class="cpg-review-layout">
        <main class="cpg-review-main">${renderCandidateTab(candidate)}</main>
        <aside class="cpg-source-rail">${renderSourceRail(candidate)}</aside>
      </div>
    `;
  }

  function renderCandidateTab(candidate) {
    const tab = workspace.selectedCandidateTab;
    if (tab === "career") return renderTimelineSection("주요 경력", candidate.experience.map((item) => ({ title: `${item.company} · ${item.position}`, period: `${item.startDate}~${item.endDate}`, description: item.description })));
    if (tab === "education") return renderTimelineSection("학력", candidate.education.map((item) => ({ title: `${item.school} · ${item.degree}`, period: `${item.startYear}~${item.endYear}`, description: item.major })));
    if (tab === "expertise") return renderFactSection(candidate, ["EXPERTISE", "LEADERSHIP"]);
    if (tab === "achievements") return renderFactSection(candidate, ["PROJECT", "PRODUCT", "COMMERCIALIZATION", "AWARD", "PATENT"]);
    if (tab === "research") return renderFactSection(candidate, ["RESEARCH", "PUBLICATION", "MEDIA_INTERVIEW"]);
    if (tab === "sources") return renderSources(candidate);
    if (tab === "notes") return renderNotes(candidate);
    return `
      <section class="cpg-review-section"><div class="cpg-panel-head"><div><strong>후보자 요약</strong><span>담당자 검토 전 AI 요약</span></div></div><p class="cpg-summary">${escapeHtml(candidate.summary)}</p><div class="cpg-separation-note"><strong>주의</strong><span>AI 요약은 검증 Fact가 아닙니다. 보고서에는 검증된 근거만 사용됩니다.</span></div></section>
      ${renderFactSection(candidate)}
    `;
  }

  function renderTimelineSection(title, items) {
    return `<section class="cpg-review-section"><div class="cpg-panel-head"><div><strong>${escapeHtml(title)}</strong><span>최신순 정렬</span></div></div><div class="cpg-timeline">${items.map((item) => `<article><span>${escapeHtml(item.period)}</span><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p></div></article>`).join("") || '<div class="empty-state">등록된 정보가 없습니다.</div>'}</div></section>`;
  }

  function renderFactSection(candidate, categories = null) {
    const facts = candidate.facts.filter((fact) => !categories || categories.includes(fact.category));
    return `<section class="cpg-review-section"><div class="cpg-panel-head"><div><strong>Fact 검토</strong><span>공개 사실, AI 해석, 내부 정보는 분리 표시됩니다.</span></div><button class="ghost-button compact-button" type="button" data-cpg-add-fact="${candidate.id}">Fact 추가</button></div><div class="cpg-fact-list">${facts.map((fact) => renderFactCard(candidate, fact)).join("") || '<div class="empty-state">이 영역에 해당하는 Fact가 없습니다.</div>'}</div></section>`;
  }

  function renderFactCard(candidate, fact) {
    const source = candidate.sources.find((item) => item.id === fact.sourceId);
    return `
      <article class="cpg-fact is-${fact.type.toLowerCase()}">
        <div class="cpg-fact-head"><span class="cpg-fact-type">${fact.type === "FACT" ? "FACT" : fact.type === "AI_INTERPRETATION" ? "AI 해석" : "내부 정보"}</span><span class="cpg-verification is-${fact.verificationStatus.toLowerCase()}">${escapeHtml(verificationLabel(fact.verificationStatus))}</span></div>
        <strong>${escapeHtml(fact.claim)}</strong><p>${escapeHtml(fact.value)}</p>
        <div class="cpg-fact-source"><span>${source ? escapeHtml(source.title) : "연결된 출처 없음"}</span>${source?.url ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">출처 보기</a>` : ""}</div>
        <div class="cpg-fact-actions"><button type="button" data-cpg-fact-status="VERIFIED" data-cpg-fact-id="${fact.id}">승인</button><button type="button" data-cpg-fact-status="AMBIGUOUS" data-cpg-fact-id="${fact.id}">확인 필요</button><button type="button" data-cpg-fact-status="INCORRECT" data-cpg-fact-id="${fact.id}">사실 아님</button></div>
      </article>
    `;
  }

  function renderSources(candidate) {
    return `<section class="cpg-review-section"><div class="cpg-panel-head"><div><strong>출처 목록</strong><span>중요 문장의 근거와 신뢰 등급</span></div></div><div class="cpg-source-list">${candidate.sources.map((source) => `<details class="cpg-source-card"><summary><span><strong>${escapeHtml(source.title)}</strong><small>${escapeHtml(source.publisher)} · Tier ${source.tier}</small></span><b>${escapeHtml(source.type)}</b></summary><div><span>발행 ${escapeHtml(source.publishedAt || "-")} · 확인 ${escapeHtml(formatDate(source.accessedAt))}</span><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">원문 열기</a></div></details>`).join("")}</div></section>`;
  }

  function renderNotes(candidate) {
    return `<section class="cpg-review-section"><div class="cpg-panel-head"><div><strong>내부 메모</strong><span>공개 조사 사실과 분리 저장됩니다.</span></div></div><form id="cpg-note-form" class="cpg-note-form" data-candidate-id="${candidate.id}"><textarea class="control-textarea" name="note" required placeholder="채용 진행 상황, 내부 관계, 활용 검토 맥락 등을 입력"></textarea><button class="primary-button" type="submit">메모 추가</button></form><div class="cpg-note-list">${candidate.internalNotes.map((note) => `<article><strong>${escapeHtml(note.author || "담당자")}</strong><span>${escapeHtml(formatDate(note.createdAt))}</span><p>${escapeHtml(note.text)}</p></article>`).join("") || '<div class="empty-state">등록된 내부 메모가 없습니다.</div>'}</div></section>`;
  }

  function renderSourceRail(candidate) {
    return `<section class="cpg-source-rail-panel"><div class="cpg-panel-head"><div><strong>검증 출처</strong><span>${candidate.sources.length}개 소스</span></div></div>${candidate.sources.slice(0, 5).map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer"><span>Tier ${source.tier} · ${escapeHtml(source.type)}</span><strong>${escapeHtml(source.title)}</strong><small>${escapeHtml(source.publisher)}</small></a>`).join("")}</section>`;
  }

  function renderReports() {
    const selectedReport = workspace.reports.find((report) => report.id === workspace.selectedReportId);
    if (selectedReport) return renderReportEditor(selectedReport);

    return `
      <div class="cpg-page-head"><div><p class="eyebrow">Report Generator</p><h4>보고서 생성</h4><p>검증된 Fact에서만 보고서 메시지를 구성합니다.</p></div></div>
      <div class="cpg-report-workspace">
        <form id="cpg-report-form" class="cpg-form-panel cpg-report-builder">
          <div class="cpg-section-title"><strong>1. 보고서 유형</strong><span>목적에 맞는 형식을 선택하세요.</span></div>
          <div class="cpg-template-selector">${workspace.templates.map((template) => `<label class="${reportType === template.id ? "is-selected" : ""}"><input type="radio" name="reportType" value="${template.id}" ${reportType === template.id ? "checked" : ""} /><strong>${escapeHtml(template.name)}</strong><span>${escapeHtml(template.description)}</span></label>`).join("")}</div>
          <div class="cpg-section-title"><strong>2. 후보자 선택</strong><span>${reportType === "multi" ? "3~5명 선택을 권장합니다." : "후보자 한 명을 선택하세요."}</span></div>
          <div class="cpg-report-candidate-list">${workspace.candidates.map((candidate) => `<label><input type="${reportType === "multi" ? "checkbox" : "radio"}" name="reportCandidate" value="${candidate.id}" ${selectedReportCandidateIds.includes(candidate.id) ? "checked" : ""} />${renderAvatar(candidate, "xsmall")}<span><strong>${escapeHtml(candidate.name)}</strong><small>${escapeHtml(candidate.currentCompany)} · ${escapeHtml(candidate.currentPosition)}</small></span></label>`).join("")}</div>
          <label class="field"><span>보고 목적</span><input class="control-input" name="reviewPurpose" placeholder="예: 경영진 후보 검토 회의" /></label>
          <label class="field"><span>검토 포지션</span><input class="control-input" name="targetPosition" placeholder="예: Robot Intelligence Lab장" /></label>
          <button class="primary-button" type="submit">보고서 초안 생성</button>
        </form>
        <section class="cpg-panel"><div class="cpg-panel-head"><div><strong>저장된 초안</strong><span>${workspace.reports.length}건</span></div></div><div class="cpg-saved-report-list">${workspace.reports.map((report) => `<button type="button" data-cpg-open-report="${report.id}"><span><strong>${escapeHtml(report.title)}</strong><small>${escapeHtml(core.REPORT_TYPES[report.type])} · ${escapeHtml(formatDate(report.updatedAt))}</small></span><b>${escapeHtml(report.status)}</b></button>`).join("") || '<div class="empty-state">생성된 보고서가 없습니다.</div>'}</div></section>
      </div>
    `;
  }

  function renderReportEditor(report) {
    return `
      <div class="cpg-page-head"><div><p class="eyebrow">Editable Preview</p><h4>${escapeHtml(report.title)}</h4><p>모바일은 읽기 쉬운 보고서, 데스크톱은 A4 미리보기로 표시됩니다.</p></div><div class="cpg-head-actions"><button class="ghost-button" type="button" data-cpg-close-report>보고서 목록</button><button class="primary-button" type="button" data-cpg-download-report="${report.id}">DOCX 다운로드</button></div></div>
      <div class="cpg-report-editor-layout">
        <section class="cpg-report-edit-panel"><div class="cpg-panel-head"><div><strong>내용 편집</strong><span>문장을 수정하면 미리보기에 즉시 반영됩니다.</span></div></div>${report.sections.map((section) => `<label class="field"><span>${escapeHtml(section.title)}</span><textarea class="control-textarea cpg-report-section-input" data-cpg-report-section="${section.id}">${escapeHtml(section.body)}</textarea></label>`).join("")}<div class="cpg-report-edit-actions"><button class="ghost-button" type="button" data-cpg-regenerate-report="${report.id}">섹션 다시 생성</button><button class="primary-button" type="button" data-cpg-save-report="${report.id}">초안 저장</button></div></section>
        <article class="cpg-a4-preview" aria-label="A4 보고서 미리보기"><header><span>CONFIDENTIAL · TALENT ACQUISITION</span><h5>${escapeHtml(report.title)}</h5></header>${report.sections.map((section) => `<section><h6>□ ${escapeHtml(section.title)}</h6><p>${escapeHtml(section.body)}</p></section>`).join("")}<footer>Candidate Profile Generator · ${escapeHtml(formatDate(report.updatedAt))}</footer></article>
      </div>
    `;
  }

  function renderTemplates() {
    return `<div class="cpg-page-head"><div><p class="eyebrow">Templates</p><h4>보고서 템플릿</h4><p>보고서 구조는 독립적으로 관리되며 후보자 데이터와 분리됩니다.</p></div></div><div class="cpg-template-grid">${workspace.templates.map((template) => `<article class="cpg-template-card"><span>TEMPLATE ${template.id === "basic" ? "A" : template.id === "interview" ? "B" : "C"}</span><h5>${escapeHtml(template.name)}</h5><p>${escapeHtml(template.description)}</p><dl><div><dt>출력</dt><dd>${template.id === "multi" ? "복수 후보자 / A4 1장" : "후보자 1명 / A4 1장"}</dd></div><div><dt>문체</dt><dd>${template.id === "interview" ? "Executive Message" : "Fact 중심"}</dd></div></dl><button class="ghost-button" type="button" data-cpg-use-template="${template.id}">이 템플릿 사용</button></article>`).join("")}</div>`;
  }

  function renderSettings() {
    const syncLabel = REMOTE_ENABLED ? "Supabase 동기화 사용" : "로컬 저장 모드";
    return `<div class="cpg-page-head"><div><p class="eyebrow">Settings</p><h4>연결 및 데이터 설정</h4><p>외부 서비스가 없어도 목업 리서치 흐름을 검증할 수 있습니다.</p></div></div><div class="cpg-settings-list"><section class="cpg-panel"><div class="cpg-setting-row"><div><strong>데이터 동기화</strong><span>데스크톱과 모바일의 후보자 마스터 공유</span></div><b class="cpg-setting-state ${REMOTE_ENABLED ? "is-ready" : ""}">${syncLabel}</b></div></section><section class="cpg-panel"><div class="cpg-setting-row"><div><strong>Apify Connector</strong><span>LinkedIn 프로필 가져오기용 서버 연결</span></div><b class="cpg-setting-state">${workspace.settings.apifyConfigured ? "연결됨" : "Mock"}</b></div><div class="cpg-setting-row"><div><strong>AI 분석</strong><span>사실 추출과 보고서 초안 보조</span></div><b class="cpg-setting-state">${workspace.settings.openAiConfigured ? "연결됨" : "Mock"}</b></div><div class="cpg-setting-row"><div><strong>Web Search</strong><span>공식 출처 우선 공개 웹 조사</span></div><b class="cpg-setting-state">${workspace.settings.webSearchConfigured ? "연결됨" : "Mock"}</b></div></section><section class="cpg-panel"><div class="cpg-panel-head"><div><strong>모바일 공유 준비</strong><span>향후 다른 앱의 공유 메뉴에서 LinkedIn URL을 받을 수 있는 구조</span></div></div><p class="cpg-settings-copy">현재도 <code>?shareUrl=LinkedIn_URL</code> 형식으로 접속하면 새 리서치 화면에 URL이 자동 입력됩니다. 운영 단계에서는 Web Share Target 또는 네이티브 래퍼를 이 진입점에 연결할 수 있습니다.</p></section></div>`;
  }

  function renderContent() {
    if (workspace.activeSection === "new-research") return renderNewResearch();
    if (workspace.activeSection === "candidates") {
      return workspace.selectedCandidateId && workspace.selectedCandidateId === workspace.detailCandidateId ? renderCandidateDetail(getCurrentCandidate()) : renderCandidates();
    }
    if (workspace.activeSection === "reports") return renderReports();
    if (workspace.activeSection === "templates") return renderTemplates();
    if (workspace.activeSection === "settings") return renderSettings();
    return renderDashboard();
  }

  function render() {
    const container = getContainer();
    if (!container) return;
    container.innerHTML = `
      <div class="cpg-shell">
        <aside class="cpg-sidebar"><div class="cpg-product-mark"><span>CP</span><div><strong>Candidate Profile</strong><small>Research & Reports</small></div></div>${renderSectionNavigation()}</aside>
        <div class="cpg-main"><div id="cpg-live-status" class="sr-only" role="status" aria-live="polite"></div>${renderContent()}</div>
        ${renderMobileNavigation()}
      </div>
    `;
    prefillSharedUrl();
  }

  function setSection(sectionId) {
    if (!SECTIONS.some((item) => item.id === sectionId)) return;
    workspace.activeSection = sectionId;
    workspace.detailCandidateId = "";
    if (sectionId !== "reports") workspace.selectedReportId = "";
    persist({ remote: false });
    render();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function openCandidate(candidateId) {
    const candidate = workspace.candidates.find((item) => item.id === candidateId);
    if (!candidate) return;
    workspace.activeSection = "candidates";
    workspace.selectedCandidateId = candidateId;
    workspace.detailCandidateId = candidateId;
    workspace.selectedCandidateTab = "overview";
    persist({ remote: false });
    render();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function prefillSharedUrl() {
    const input = document.querySelector("#cpg-linkedin-url");
    if (!input || input.value) return;
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get("shareUrl") || params.get("linkedin");
    if (sharedUrl && core.normalizeLinkedInUrl(sharedUrl)) input.value = sharedUrl;
  }

  function delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function runResearch(input) {
    const run = {
      id: core.createId("research-run"),
      candidateName: input.candidateName,
      linkedinUrl: input.linkedinUrl,
      mode: input.researchMode,
      status: "RUNNING",
      progress: 3,
      currentStepLabel: "입력 정보 확인",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    workspace.researchRuns.unshift(run);
    persist();
    render();
    const steps = core.getResearchSteps(input.researchMode);

    for (let index = 0; index < steps.length; index += 1) {
      const step = steps[index];
      run.currentStepLabel = step.label;
      run.progress = Math.round(((index + 0.45) / steps.length) * 100);
      run.updatedAt = new Date().toISOString();
      persist({ remote: false });
      render();
      await delay(420);
    }

    let candidate;
    try {
      const response = await fetch("/api/candidate-profile-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "research", input })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.candidate) throw new Error(payload?.error || "Research API failed");
      candidate = core.normalizeCandidate(payload.candidate);
      workspace.settings = { ...workspace.settings, ...(payload.providers || {}) };
    } catch (error) {
      console.warn("Candidate research API unavailable. Mock research result is used.", error);
      candidate = core.createMockCandidate(input);
    }

    const duplicateIndex = workspace.candidates.findIndex((item) => item.linkedinUrl && item.linkedinUrl === candidate.linkedinUrl);
    if (duplicateIndex >= 0) workspace.candidates.splice(duplicateIndex, 1, { ...candidate, id: workspace.candidates[duplicateIndex].id, createdAt: workspace.candidates[duplicateIndex].createdAt });
    else workspace.candidates.unshift(candidate);
    run.status = "COMPLETED";
    run.progress = 100;
    run.currentStepLabel = "담당자 검토 준비 완료";
    run.candidateId = candidate.id;
    run.updatedAt = new Date().toISOString();
    workspace.selectedCandidateId = candidate.id;
    workspace.detailCandidateId = candidate.id;
    workspace.activeSection = "candidates";
    workspace.selectedCandidateTab = "overview";
    uploadedFileNames = [];
    persist();
    render();
    showMessage(`${candidate.name} 후보자 마스터를 생성했습니다.`);
  }

  function handleResearchSubmit(form) {
    const data = new FormData(form);
    const linkedinUrl = core.normalizeLinkedInUrl(data.get("linkedinUrl"));
    if (!linkedinUrl) {
      showMessage("올바른 LinkedIn 개인 프로필 URL을 입력해주세요.");
      form.querySelector("[name='linkedinUrl']")?.focus();
      return;
    }
    runResearch({
      linkedinUrl,
      candidateName: String(data.get("candidateName") || "").trim(),
      currentCompany: String(data.get("currentCompany") || "").trim(),
      currentPosition: String(data.get("currentPosition") || "").trim(),
      reviewPurpose: String(data.get("reviewPurpose") || "").trim(),
      targetPosition: String(data.get("targetPosition") || "").trim(),
      additionalNotes: String(data.get("additionalNotes") || "").trim(),
      additionalUrls: String(data.get("additionalUrls") || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      researchMode: String(data.get("researchMode") || "deep"),
      fileNames: [...uploadedFileNames]
    }).catch((error) => {
      console.warn(error);
      showMessage("리서치 처리 중 오류가 발생했습니다.");
    });
  }

  function updateFactStatus(factId, status) {
    const candidate = getCurrentCandidate();
    const fact = candidate?.facts.find((item) => item.id === factId);
    if (!fact) return;
    fact.verificationStatus = status;
    fact.confidence = status === "VERIFIED" ? "HIGH" : status === "INCORRECT" ? "UNVERIFIED" : "MEDIUM";
    fact.updatedAt = new Date().toISOString();
    candidate.updatedAt = fact.updatedAt;
    persist();
    render();
  }

  function addFact(candidateId) {
    const candidate = workspace.candidates.find((item) => item.id === candidateId);
    if (!candidate) return;
    const claim = window.prompt("Fact 제목을 입력하세요.", "추가 확인 사항");
    if (!claim) return;
    const value = window.prompt("확인된 내용을 입력하세요.", "");
    if (!value) return;
    candidate.facts.unshift(core.normalizeFact({ candidateId, claim, value, category: "EXPERTISE", type: "FACT", confidence: "MEDIUM", verificationStatus: "LIKELY" }));
    candidate.updatedAt = new Date().toISOString();
    persist();
    render();
  }

  function saveNote(form) {
    const candidate = workspace.candidates.find((item) => item.id === form.dataset.candidateId);
    const text = String(new FormData(form).get("note") || "").trim();
    if (!candidate || !text) return;
    candidate.internalNotes.unshift({ id: core.createId("note"), text, author: currentUser?.name || "채용담당자", createdAt: new Date().toISOString() });
    candidate.updatedAt = new Date().toISOString();
    persist();
    render();
  }

  function handleReportSubmit(form) {
    const data = new FormData(form);
    const candidateIds = data.getAll("reportCandidate").map(String);
    if (!candidateIds.length) {
      showMessage("보고서에 포함할 후보자를 선택해주세요.");
      return;
    }
    if (reportType !== "multi" && candidateIds.length > 1) candidateIds.splice(1);
    const candidates = candidateIds.map((id) => workspace.candidates.find((candidate) => candidate.id === id)).filter(Boolean);
    const report = core.createReport(reportType, candidates, { reviewPurpose: data.get("reviewPurpose"), targetPosition: data.get("targetPosition") });
    workspace.reports.unshift(report);
    workspace.selectedReportId = report.id;
    persist();
    render();
  }

  function updateReportSection(input) {
    const report = workspace.reports.find((item) => item.id === workspace.selectedReportId);
    const section = report?.sections.find((item) => item.id === input.dataset.cpgReportSection);
    if (!section) return;
    section.body = input.value;
    report.updatedAt = new Date().toISOString();
    persist({ remote: false });
    const previewSections = document.querySelectorAll(".cpg-a4-preview section p");
    const sectionIndex = report.sections.findIndex((item) => item.id === section.id);
    if (previewSections[sectionIndex]) previewSections[sectionIndex].textContent = section.body;
  }

  async function downloadReport(reportId) {
    const report = workspace.reports.find((item) => item.id === reportId);
    if (!report) return;
    const candidates = report.candidateIds.map((id) => workspace.candidates.find((candidate) => candidate.id === id)).filter(Boolean);
    try {
      const response = await fetch("/api/candidate-profile-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report, candidates })
      });
      if (!response.ok) throw new Error("DOCX generation failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${report.title.replace(/[\\/:*?"<>|]/g, "_")}.docx`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.warn(error);
      showMessage("DOCX 생성 연결을 확인해주세요.");
    }
  }

  function bindEvents() {
    document.addEventListener("click", async (event) => {
      const sectionButton = event.target.closest("[data-cpg-section]");
      if (sectionButton) {
        setSection(sectionButton.dataset.cpgSection);
        return;
      }
      const candidateButton = event.target.closest("[data-cpg-open-candidate]");
      if (candidateButton) {
        openCandidate(candidateButton.dataset.cpgOpenCandidate);
        return;
      }
      const candidateTab = event.target.closest("[data-cpg-candidate-tab]");
      if (candidateTab) {
        workspace.selectedCandidateTab = candidateTab.dataset.cpgCandidateTab;
        persist({ remote: false });
        render();
        return;
      }
      const factStatusButton = event.target.closest("[data-cpg-fact-status]");
      if (factStatusButton) {
        updateFactStatus(factStatusButton.dataset.cpgFactId, factStatusButton.dataset.cpgFactStatus);
        return;
      }
      const addFactButton = event.target.closest("[data-cpg-add-fact]");
      if (addFactButton) {
        addFact(addFactButton.dataset.cpgAddFact);
        return;
      }
      const pasteButton = event.target.closest("[data-cpg-paste-url]");
      if (pasteButton) {
        try {
          const value = await navigator.clipboard.readText();
          const input = document.querySelector("#cpg-linkedin-url");
          if (input) input.value = value;
        } catch (error) {
          showMessage("브라우저의 클립보드 권한을 허용해주세요.");
        }
        return;
      }
      const useTemplate = event.target.closest("[data-cpg-use-template]");
      if (useTemplate) {
        reportType = useTemplate.dataset.cpgUseTemplate;
        selectedReportCandidateIds = [];
        setSection("reports");
        return;
      }
      const reportCandidateButton = event.target.closest("[data-cpg-report-candidate]");
      if (reportCandidateButton) {
        reportType = "basic";
        selectedReportCandidateIds = [reportCandidateButton.dataset.cpgReportCandidate];
        workspace.activeSection = "reports";
        workspace.detailCandidateId = "";
        workspace.selectedReportId = "";
        persist({ remote: false });
        render();
        return;
      }
      const openReportButton = event.target.closest("[data-cpg-open-report]");
      if (openReportButton) {
        workspace.selectedReportId = openReportButton.dataset.cpgOpenReport;
        persist({ remote: false });
        render();
        return;
      }
      if (event.target.closest("[data-cpg-close-report]")) {
        workspace.selectedReportId = "";
        persist({ remote: false });
        render();
        return;
      }
      const saveReportButton = event.target.closest("[data-cpg-save-report]");
      if (saveReportButton) {
        const report = workspace.reports.find((item) => item.id === saveReportButton.dataset.cpgSaveReport);
        if (report) report.updatedAt = new Date().toISOString();
        persist();
        showMessage("보고서 초안을 저장했습니다.");
        return;
      }
      const downloadButton = event.target.closest("[data-cpg-download-report]");
      if (downloadButton) {
        downloadReport(downloadButton.dataset.cpgDownloadReport);
        return;
      }
      const updateResearchButton = event.target.closest("[data-cpg-update-research]");
      if (updateResearchButton) {
        const candidate = workspace.candidates.find((item) => item.id === updateResearchButton.dataset.cpgUpdateResearch);
        workspace.activeSection = "new-research";
        workspace.detailCandidateId = "";
        persist({ remote: false });
        render();
        const input = document.querySelector("#cpg-linkedin-url");
        if (input && candidate) input.value = candidate.linkedinUrl;
      }
    });

    document.addEventListener("submit", (event) => {
      if (event.target.matches("#cpg-research-form")) {
        event.preventDefault();
        handleResearchSubmit(event.target);
      } else if (event.target.matches("#cpg-note-form")) {
        event.preventDefault();
        saveNote(event.target);
      } else if (event.target.matches("#cpg-report-form")) {
        event.preventDefault();
        handleReportSubmit(event.target);
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.matches("#cpg-candidate-search")) {
        searchQuery = event.target.value;
        render();
        document.querySelector("#cpg-candidate-search")?.focus();
      } else if (event.target.matches(".cpg-report-section-input")) {
        updateReportSection(event.target);
      }
    });

    document.addEventListener("change", (event) => {
      if (event.target.matches("#cpg-type-filter")) {
        typeFilter = event.target.value;
        render();
      } else if (event.target.matches("#cpg-research-files")) {
        uploadedFileNames = [...(event.target.files || [])].map((file) => file.name);
        render();
      } else if (event.target.matches("[name='reportType']")) {
        reportType = event.target.value;
        selectedReportCandidateIds = [];
        render();
      } else if (event.target.matches("[name='reportCandidate']")) {
        selectedReportCandidateIds = [...document.querySelectorAll("[name='reportCandidate']:checked")].map((input) => input.value);
      }
    });
  }

  function initializeSharedUrl() {
    const params = new URLSearchParams(window.location.search);
    if ((params.get("shareUrl") || params.get("linkedin")) && core.normalizeLinkedInUrl(params.get("shareUrl") || params.get("linkedin"))) {
      workspace.activeSection = "new-research";
      workspace.detailCandidateId = "";
    }
  }

  initializeSharedUrl();
  bindEvents();

  window.CandidateProfileGenerator = {
    render(context = {}) {
      currentUser = context.member || currentUser;
      render();
      loadRemoteState();
    },
    setSection,
    getState() {
      return structuredClone(workspace);
    }
  };
})();
