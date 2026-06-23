(function () {
  const LANGUAGES = {
    ko: { ko: "한국어", en: "Korean", zh: "韩语" },
    en: { ko: "영어", en: "English", zh: "英语" },
    zh: { ko: "중국어", en: "Chinese", zh: "中文" }
  };
  const UI_TEXT = {
    ko: {
      headerSubtitle: "실시간 통역",
      headerBadge: "실시간 동기화 MVP",
      participant: "참가자",
      you: "나",
      me: "내 발화",
      remoteSpeaker: "상대 발화",
      online: "온라인",
      offline: "오프라인",
      micLive: "마이크 켜짐",
      interpreting: "통역 중",
      micReady: "마이크 준비됨",
      micNotChecked: "마이크 미확인",
      status: {
        idle: "대기",
        connecting: "연결 중",
        connected: "연결됨",
        closed: "닫힘",
        ended: "종료됨",
        error: "오류",
        requesting: "요청 중",
        granted: "마이크 준비됨",
        denied: "마이크 차단됨",
        unavailable: "마이크 사용 불가",
        muted: "음소거",
        "fetching-token": "토큰 발급 중",
        "requesting-microphone": "마이크 요청 중"
      },
      configMissing:
        "Supabase Realtime 설정이 없습니다. Vercel에 SUPABASE_URL과 SUPABASE_ANON_KEY 또는 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정한 뒤 다시 배포하세요.",
      sdkMissing: "Supabase 클라이언트 SDK를 불러오지 못했습니다. vendor/supabase.js와 vendor/supabase-global.js 배포 상태를 확인하세요.",
      presenceFailed: "참가자 상태 업데이트 실패: {message}",
      channelError: "Supabase 채널 {status}. 이 프로젝트에서 Realtime이 활성화되어 있는지 확인하세요.",
      roomNotConnected: "방이 아직 연결되지 않았습니다. Supabase 상태가 연결됨으로 바뀐 뒤 다시 시도하세요.",
      broadcastFailed: "자막 전송 실패: {message}",
      enterRoomCode: "방 코드를 먼저 입력하세요.",
      roleChanged: "역할 변경으로 OpenAI 세션을 중지했습니다. 다시 시작하세요.",
      languageChanged: "언어 변경으로 OpenAI 세션을 중지했습니다. 다시 시작하세요.",
      enterBothTexts: "원문을 입력하세요.",
      translatingCaption: "번역 중...",
      translationFailed: "자동 번역에 실패해 원문을 그대로 전송합니다.",
      inviteCopied: "초대 링크를 복사했습니다.",
      copyFailed: "복사에 실패했습니다. 화면의 초대 링크를 직접 사용하세요.",
      participantName: "참가자명",
      participantNamePlaceholder: "표시 이름",
      saveName: "이름 저장",
      editName: "참가자명 수정",
      nameSetupTitle: "입장 전 참가자명",
      nameSetupHint: "방에 입장하면 이 이름으로 참가자 목록과 대화 로그에 표시됩니다.",
      nameModalTitle: "참가자명 수정",
      nameModalDescription: "변경한 이름은 현재 방의 참가자 목록과 이후 대화 로그에 반영됩니다.",
      nameSaved: "참가자명을 저장했습니다.",
      homeEyebrow: "실시간 통역",
      homeTitle: "한국어 · 영어 · 중국어 자막 방",
      homeDescription: "Supabase Realtime 방을 만들고 상대를 초대한 뒤 OpenAI 마이크 통역을 시작합니다. 한국어, 영어, 중국어를 우선 지원하며 OpenAI 연결이 실패해도 수동 자막은 계속 사용할 수 있습니다.",
      createRoom: "새 통역방 만들기",
      joinEyebrow: "입장",
      joinTitle: "방 코드 입력",
      roomPlaceholder: "예: A1B2C3",
      join: "입장",
      roleLanguage: "내 발화 언어",
      roleLanguageHint: "A는 한국어, B는 영어, C는 중국어 발화자입니다.",
      displayLanguage: "서비스 표시 언어",
      recentRooms: "최근 방",
      recentRoomsTitle: "생성/입장한 통역방",
      recentRoomsHint: "Supabase 공유 목록이 가능하면 전체 방을 표시하고, 실패하면 이 기기 목록을 표시합니다.",
      roomListLoading: "방 목록을 불러오는 중...",
      roomListFallback: "공유 방 목록을 불러오지 못해 이 기기 목록을 표시합니다.",
      noRooms: "아직 저장된 방이 없습니다.",
      activeRoom: "진행 중",
      endedRoom: "종료됨",
      rejoinRoom: "입장",
      deleteRoom: "삭제",
      deleteRoomConfirm: "방 {roomId}을 목록에서 삭제할까요? 실제 진행 중인 방 자체는 종료되지 않습니다.",
      room: "방 {roomId}",
      supabase: "Supabase",
      mic: "마이크",
      openai: "OpenAI",
      languageSelect: "자막 언어",
      waitingPresence: "참가자 연결을 기다리는 중...",
      roomEnded: "이 방은 종료되었습니다.",
      backToStart: "첫 화면으로",
      conversationLog: "대화 로그",
      conversationHint: "원문과 번역문이 실시간으로 누적됩니다.",
      noCaptions: "아직 자막이 없습니다.",
      saveLog: "저장",
      loadLog: "불러오기",
      deleteLog: "삭제",
      logSaved: "대화 기록을 이 기기에 저장했습니다.",
      logLoaded: "저장된 대화 기록을 불러왔습니다.",
      logDeleted: "저장된 대화 기록을 삭제했습니다.",
      noSavedLog: "이 방에 저장된 대화 기록이 없습니다.",
      deleteLogConfirm: "이 기기에 저장된 이 방의 대화 기록을 삭제할까요?",
      originalText: "원문",
      translatedText: "번역문",
      originalPlaceholder: "{role} 참가자가 말한 내용을 입력하세요.",
      translatedPlaceholder: "비워두면 접속한 상대 발화 언어들로 자동 번역됩니다.",
      sendCaption: "자막 보내기",
      openaiEyebrow: "OpenAI Realtime",
      openaiTitle: "마이크 실시간 통역",
      openaiDescription: "음성은 서버가 발급한 ephemeral token으로 OpenAI에 전송되고, 번역 자막은 Supabase Broadcast로 상대방에게 전달됩니다.",
      startLive: "실시간 통역 시작",
      stopLive: "실시간 통역 중지",
      muteMic: "마이크 음소거",
      unmuteMic: "마이크 켜기",
      voiceOn: "음성 출력 켜짐",
      voiceOff: "음성 출력 꺼짐",
      checkMic: "마이크 권한 확인",
      endRoom: "대화 종료",
      invite: "초대",
      inviteRole: "{role} 역할 초대",
      copy: "복사",
      showQr: "QR 보기",
      inviteLink: "초대 링크",
      qrTitle: "초대 QR코드",
      qrDescription: "상대방 휴대폰 카메라로 스캔하면 같은 통역방에 입장합니다.",
      close: "닫기"
    },
    en: {
      headerSubtitle: "Realtime Interpreter",
      headerBadge: "Realtime Sync MVP",
      participant: "Participant",
      you: "you",
      me: "My speech",
      remoteSpeaker: "Remote speech",
      online: "online",
      offline: "offline",
      micLive: "mic live",
      interpreting: "interpreting",
      micReady: "mic ready",
      micNotChecked: "mic not checked",
      status: {
        idle: "idle",
        connecting: "connecting",
        connected: "connected",
        closed: "closed",
        ended: "ended",
        error: "error",
        requesting: "requesting",
        granted: "mic ready",
        denied: "mic blocked",
        unavailable: "mic unavailable",
        muted: "muted",
        "fetching-token": "fetching token",
        "requesting-microphone": "requesting mic"
      },
      configMissing:
        "Supabase Realtime is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel, or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy.",
      sdkMissing: "Supabase client SDK did not load. Check vendor/supabase.js and vendor/supabase-global.js are deployed.",
      presenceFailed: "Presence update failed: {message}",
      channelError: "Supabase channel {status}. Check Realtime is enabled for this project.",
      roomNotConnected: "Room is not connected. Wait for Supabase status to become connected.",
      broadcastFailed: "Broadcast failed: {message}",
      enterRoomCode: "Enter a room code first.",
      roleChanged: "OpenAI session stopped. Start again after changing role.",
      languageChanged: "OpenAI session stopped. Start again after changing language.",
      enterBothTexts: "Enter the original caption text.",
      translatingCaption: "Translating...",
      translationFailed: "Auto-translation failed, so the original text was sent as-is.",
      inviteCopied: "Invite link copied.",
      copyFailed: "Copy failed. Use the visible invite link.",
      participantName: "Participant name",
      participantNamePlaceholder: "Display name",
      saveName: "Save name",
      editName: "Edit name",
      nameSetupTitle: "Name before joining",
      nameSetupHint: "This name appears in the participant list and conversation log after you enter a room.",
      nameModalTitle: "Edit participant name",
      nameModalDescription: "The updated name appears in this room's participant list and future conversation log entries.",
      nameSaved: "Participant name saved.",
      homeEyebrow: "Realtime Interpreter",
      homeTitle: "Korean · English · Chinese caption room",
      homeDescription: "Create a Supabase Realtime room, invite the second participant, and start OpenAI microphone translation. Korean, English, and Chinese are supported first; manual captions remain available if OpenAI fails.",
      createRoom: "Create room",
      joinEyebrow: "Join",
      joinTitle: "Enter room code",
      roomPlaceholder: "e.g. A1B2C3",
      join: "Join",
      roleLanguage: "My spoken language",
      roleLanguageHint: "A speaks Korean, B speaks English, and C speaks Chinese.",
      displayLanguage: "Interface language",
      recentRooms: "Recent rooms",
      recentRoomsTitle: "Created and joined rooms",
      recentRoomsHint: "Shows the shared Supabase room list when available, otherwise this device's fallback list.",
      roomListLoading: "Loading room list...",
      roomListFallback: "Could not load the shared room list, so this device's fallback list is shown.",
      noRooms: "No saved rooms yet.",
      activeRoom: "active",
      endedRoom: "ended",
      rejoinRoom: "Join",
      deleteRoom: "Delete",
      deleteRoomConfirm: "Delete room {roomId} from the list? This does not end a room that is still active.",
      room: "Room {roomId}",
      supabase: "Supabase",
      mic: "Mic",
      openai: "OpenAI",
      languageSelect: "Caption language",
      waitingPresence: "Waiting for presence sync...",
      roomEnded: "This room has ended.",
      backToStart: "Back to start",
      conversationLog: "Conversation log",
      conversationHint: "Original and translated captions accumulate here in real time.",
      noCaptions: "No captions yet.",
      saveLog: "Save",
      loadLog: "Load",
      deleteLog: "Delete",
      logSaved: "Conversation log saved on this device.",
      logLoaded: "Saved conversation log loaded.",
      logDeleted: "Saved conversation log deleted.",
      noSavedLog: "No saved conversation log exists for this room.",
      deleteLogConfirm: "Delete the saved conversation log for this room from this device?",
      originalText: "Original text",
      translatedText: "Translated text",
      originalPlaceholder: "Type what participant {role} said",
      translatedPlaceholder: "Leave blank to auto-translate for connected participants' spoken languages",
      sendCaption: "Send caption",
      openaiEyebrow: "OpenAI Realtime",
      openaiTitle: "Live microphone translation",
      openaiDescription: "Audio is sent to OpenAI with a server-issued ephemeral token. Transcript pairs are broadcast to the other participant through Supabase.",
      startLive: "Start live translation",
      stopLive: "Stop live translation",
      muteMic: "Mute mic",
      unmuteMic: "Unmute mic",
      voiceOn: "Voice output on",
      voiceOff: "Voice output off",
      checkMic: "Check microphone permission",
      endRoom: "End room",
      invite: "Invite",
      inviteRole: "Role {role}",
      copy: "Copy",
      showQr: "Show QR",
      inviteLink: "Invite link",
      qrTitle: "Invite QR code",
      qrDescription: "Scan this with the other phone camera to enter the same interpreter room.",
      close: "Close"
    },
    zh: {
      headerSubtitle: "实时翻译",
      headerBadge: "实时同步 MVP",
      participant: "参与者",
      you: "你",
      me: "我的发言",
      remoteSpeaker: "对方发言",
      online: "在线",
      offline: "离线",
      micLive: "麦克风开启",
      interpreting: "翻译中",
      micReady: "麦克风就绪",
      micNotChecked: "麦克风未检查",
      status: {
        idle: "待机",
        connecting: "连接中",
        connected: "已连接",
        closed: "已关闭",
        ended: "已结束",
        error: "错误",
        requesting: "请求中",
        granted: "麦克风就绪",
        denied: "麦克风被阻止",
        unavailable: "麦克风不可用",
        muted: "已静音",
        "fetching-token": "正在获取令牌",
        "requesting-microphone": "正在请求麦克风"
      },
      configMissing:
        "Supabase Realtime 尚未配置。请在 Vercel 中设置 SUPABASE_URL 和 SUPABASE_ANON_KEY，或 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 后重新部署。",
      sdkMissing: "Supabase 客户端 SDK 未加载。请确认 vendor/supabase.js 和 vendor/supabase-global.js 已部署。",
      presenceFailed: "参与者状态更新失败：{message}",
      channelError: "Supabase 频道 {status}。请确认此项目已启用 Realtime。",
      roomNotConnected: "房间尚未连接。请等待 Supabase 状态变为已连接。",
      broadcastFailed: "字幕发送失败：{message}",
      enterRoomCode: "请先输入房间代码。",
      roleChanged: "角色已更改，OpenAI 会话已停止。请重新开始。",
      languageChanged: "语言已更改，OpenAI 会话已停止。请重新开始。",
      enterBothTexts: "请输入原文字幕。",
      translatingCaption: "正在翻译...",
      translationFailed: "自动翻译失败，已按原文发送。",
      inviteCopied: "邀请链接已复制。",
      copyFailed: "复制失败。请使用屏幕上的邀请链接。",
      participantName: "参与者名称",
      participantNamePlaceholder: "显示名称",
      saveName: "保存名称",
      editName: "修改参与者名称",
      nameSetupTitle: "入场前设置名称",
      nameSetupHint: "进入房间后，此名称会显示在参与者列表和对话记录中。",
      nameModalTitle: "修改参与者名称",
      nameModalDescription: "更新后的名称会显示在当前房间的参与者列表和之后的对话记录中。",
      nameSaved: "参与者名称已保存。",
      homeEyebrow: "实时翻译",
      homeTitle: "韩语 · 英语 · 中文字幕房间",
      homeDescription: "创建 Supabase Realtime 房间，邀请对方加入，然后开始 OpenAI 麦克风翻译。优先支持韩语、英语和中文；即使 OpenAI 连接失败，也可以继续使用手动字幕。",
      createRoom: "创建新翻译房间",
      joinEyebrow: "加入",
      joinTitle: "输入房间代码",
      roomPlaceholder: "例如 A1B2C3",
      join: "加入",
      roleLanguage: "我的发言语言",
      roleLanguageHint: "A 为韩语发言者，B 为英语发言者，C 为中文发言者。",
      displayLanguage: "服务显示语言",
      recentRooms: "最近房间",
      recentRoomsTitle: "已创建/已加入的翻译房间",
      recentRoomsHint: "如果可以使用 Supabase 共享列表，则显示全部房间；否则显示此设备上的房间列表。",
      roomListLoading: "正在加载房间列表...",
      roomListFallback: "无法加载共享房间列表，正在显示此设备上的列表。",
      noRooms: "还没有保存的房间。",
      activeRoom: "进行中",
      endedRoom: "已结束",
      rejoinRoom: "加入",
      deleteRoom: "删除",
      deleteRoomConfirm: "要从列表中删除房间 {roomId} 吗？这不会结束仍在进行中的房间。",
      room: "房间 {roomId}",
      supabase: "Supabase",
      mic: "麦克风",
      openai: "OpenAI",
      languageSelect: "字幕语言",
      waitingPresence: "正在等待参与者同步...",
      roomEnded: "此房间已结束。",
      backToStart: "返回首页",
      conversationLog: "对话记录",
      conversationHint: "原文和译文会实时累积在这里。",
      noCaptions: "还没有字幕。",
      saveLog: "保存",
      loadLog: "加载",
      deleteLog: "删除",
      logSaved: "对话记录已保存到此设备。",
      logLoaded: "已加载保存的对话记录。",
      logDeleted: "已删除保存的对话记录。",
      noSavedLog: "此房间没有保存的对话记录。",
      deleteLogConfirm: "要从此设备删除此房间保存的对话记录吗？",
      originalText: "原文",
      translatedText: "译文",
      originalPlaceholder: "输入参与者 {role} 说的内容",
      translatedPlaceholder: "留空则自动翻译为已连接参与者的发言语言",
      sendCaption: "发送字幕",
      openaiEyebrow: "OpenAI Realtime",
      openaiTitle: "麦克风实时翻译",
      openaiDescription: "音频会通过服务器签发的临时令牌发送到 OpenAI，字幕翻译会通过 Supabase Broadcast 发送给其他参与者。",
      startLive: "开始实时翻译",
      stopLive: "停止实时翻译",
      muteMic: "麦克风静音",
      unmuteMic: "打开麦克风",
      voiceOn: "语音输出开启",
      voiceOff: "语音输出关闭",
      checkMic: "检查麦克风权限",
      endRoom: "结束对话",
      invite: "邀请",
      inviteRole: "{role} 角色邀请",
      copy: "复制",
      showQr: "查看 QR",
      inviteLink: "邀请链接",
      qrTitle: "邀请 QR 码",
      qrDescription: "请用对方手机摄像头扫描，即可进入同一个翻译房间。",
      close: "关闭"
    }
  };
  const ROOM_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const APP_CONFIG = window.__APP_CONFIG__ || {};
  const SUPABASE_URL = String(APP_CONFIG.supabaseUrl || "").replace(/\/$/, "");
  const SUPABASE_ANON_KEY = String(APP_CONFIG.supabaseAnonKey || "");
  const OPENAI_TRANSLATION_CALLS_URL = "https://api.openai.com/v1/realtime/translations/calls";
  const PARTIAL_CAPTION_INTERVAL_MS = 180;
  const FINALIZE_CAPTION_DELAY_MS = 4500;
  const LOG_MERGE_WINDOW_MS = 12_000;
  const PARTICIPANT_NAME_KEY = "talent-pool:interpreter-participant-name";
  const DISPLAY_LANGUAGE_KEY = "talent-pool:interpreter-display-language";
  const LOG_STORAGE_PREFIX = "talent-pool:interpreter-log:";
  const ROOM_STORAGE_KEY = "talent-pool:interpreter-rooms";
  const ROOM_LIST_LIMIT = 30;
  const ROLES = {
    a: { language: "ko" },
    b: { language: "en" },
    c: { language: "zh" }
  };
  const ROLE_ORDER = Object.keys(ROLES);
  const UI_LANGUAGES = ["ko", "en", "zh"];

  const state = {
    roomId: "",
    role: "a",
    language: "ko",
    displayLanguage: getStoredDisplayLanguage(),
    participantName: getStoredParticipantName(),
    participantId: getTabParticipantId(),
    participants: [],
    messages: [],
    roomRecords: loadRoomRecords(),
    roomListStatus: "local",
    roomListError: "",
    channel: null,
    channelRoomId: "",
    supabaseClient: null,
    syncStatus: "idle",
    syncError: "",
    endedAt: null,
    micStatus: "idle",
    openaiStatus: "idle",
    openaiError: "",
    peerConnection: null,
    dataChannel: null,
    mediaStream: null,
    remoteAudio: null,
    voiceEnabled: false,
    micMuted: false,
    qrModalOpen: false,
    nameModalOpen: false,
    captionStatus: "idle",
    captionError: "",
    activeCaptions: {},
    realtimeDraft: { originalText: "", translatedText: "" },
    realtimeCaptionId: "",
    realtimeFinalizeTimer: null,
    realtimeLastPartialAt: 0,
    notice: "",
    draftOriginal: "",
    draftTranslated: ""
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function uiLanguage() {
    return UI_LANGUAGES.includes(state.displayLanguage) ? state.displayLanguage : "ko";
  }

  function uiLocale() {
    return uiLanguage() === "ko" ? "ko-KR" : uiLanguage() === "zh" ? "zh-CN" : "en-US";
  }

  function t(key, values = {}) {
    const text = UI_TEXT[uiLanguage()]?.[key] ?? UI_TEXT.en[key] ?? key;

    return String(text).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => values[name] ?? "");
  }

  function tStatus(status) {
    return UI_TEXT[uiLanguage()]?.status?.[status] ?? UI_TEXT.en.status[status] ?? status;
  }

  function updateStaticChrome() {
    document.documentElement.lang = uiLanguage();

    const headerBadge = document.querySelector(".header-badge");
    const headerSubtitle = document.querySelector(".brand-link small");

    if (headerBadge) {
      headerBadge.textContent = t("headerBadge");
    }

    if (headerSubtitle) {
      headerSubtitle.textContent = t("headerSubtitle");
    }
  }

  function getTabParticipantId() {
    const key = "talent-pool:interpreter-tab-participant-id";
    const existing = window.sessionStorage.getItem(key);

    if (existing) {
      return existing;
    }

    const created = `p_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    window.sessionStorage.setItem(key, created);
    return created;
  }

  function getStoredParticipantName() {
    return String(window.sessionStorage.getItem(PARTICIPANT_NAME_KEY) || "").trim();
  }

  function getStoredDisplayLanguage() {
    const stored = String(window.localStorage.getItem(DISPLAY_LANGUAGE_KEY) || "").trim();
    return UI_LANGUAGES.includes(stored) ? stored : "ko";
  }

  function defaultParticipantName(role = state.role) {
    const textSet = UI_TEXT[uiLanguage()] || UI_TEXT.ko;
    return `${textSet.participant} ${displayRole(role)}`;
  }

  function displayParticipantName(role = state.role) {
    return state.participantName || defaultParticipantName(role);
  }

  function saveParticipantName(name) {
    state.participantName = String(name || "").trim().slice(0, 40);

    if (state.participantName) {
      window.sessionStorage.setItem(PARTICIPANT_NAME_KEY, state.participantName);
    } else {
      window.sessionStorage.removeItem(PARTICIPANT_NAME_KEY);
    }

    state.participants = state.participants.map((participant) =>
      participant.id === state.participantId
        ? { ...participant, name: speakerName(), updatedAt: Date.now() }
        : participant
    );

    trackPresence();
  }

  function createRoomCode(size = 6) {
    const values = new Uint32Array(size);

    if (window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(values);
    } else {
      for (let index = 0; index < values.length; index += 1) {
        values[index] = Math.floor(Math.random() * 10_000);
      }
    }

    return Array.from(values)
      .map((value) => ROOM_CHARS[value % ROOM_CHARS.length])
      .join("");
  }

  function displayRole(role) {
    return role === "c" ? "C" : role === "b" ? "B" : "A";
  }

  function isLanguageCode(language) {
    return Object.prototype.hasOwnProperty.call(LANGUAGES, language);
  }

  function normalizeLanguage(language, fallback = "ko") {
    return isLanguageCode(language) ? language : fallback;
  }

  function oppositeRole(role) {
    const index = ROLE_ORDER.indexOf(normalizeRole(role));
    return ROLE_ORDER[(index + 1) % ROLE_ORDER.length] || "b";
  }

  function defaultLanguageForRole(role) {
    return ROLES[normalizeRole(role)]?.language || "ko";
  }

  function roleForLanguage(language) {
    const normalizedLanguage = normalizeLanguage(language, state.language);
    return ROLE_ORDER.find((role) => ROLES[role]?.language === normalizedLanguage) || state.role;
  }

  function targetLanguage() {
    const remoteLanguages = getRemoteParticipants()
      .map((participant) => participant.language)
      .filter(isLanguageCode);

    if (remoteLanguages.length === 1) {
      return remoteLanguages[0];
    }

    return defaultLanguageForRole(oppositeRole(state.role));
  }

  function languageLabel(language) {
    const config = LANGUAGES[language] || LANGUAGES.ko;
    return config[uiLanguage()] || config.en || language;
  }

  function renderLanguageOptions() {
    return Object.keys(LANGUAGES)
      .map((language) => `<option value="${language}" ${state.language === language ? "selected" : ""}>${escapeHtml(languageLabel(language))}</option>`)
      .join("");
  }

  function renderSpokenLanguageOptions() {
    return Object.keys(LANGUAGES)
      .map((language) => `<option value="${language}" ${state.language === language ? "selected" : ""}>${escapeHtml(languageLabel(language))}</option>`)
      .join("");
  }

  function renderDisplayLanguageOptions() {
    return UI_LANGUAGES
      .map((language) => `<option value="${language}" ${uiLanguage() === language ? "selected" : ""}>${escapeHtml(languageLabel(language))}</option>`)
      .join("");
  }

  function normalizeRole(role, fallback = "a") {
    return Object.prototype.hasOwnProperty.call(ROLES, role) ? role : fallback;
  }

  function normalizeRoomRecord(record) {
    const roomId = String(record?.roomId || "").trim().toUpperCase();

    if (!roomId) {
      return null;
    }

    const endedAt = Number(record.endedAt || 0) || null;
    const createdAt = Number(record.createdAt || 0) || Date.now();
    const updatedAt = Number(record.updatedAt || 0) || endedAt || createdAt;

    return {
      roomId,
      role: normalizeRole(record.role),
      language: normalizeLanguage(record.language, defaultLanguageForRole(record.role)),
      createdAt,
      updatedAt,
      endedAt,
      status: endedAt || record.status === "ended" ? "ended" : "active"
    };
  }

  function loadRoomRecords() {
    try {
      const raw = window.localStorage.getItem(ROOM_STORAGE_KEY);
      const records = JSON.parse(raw || "[]");

      if (!Array.isArray(records)) {
        return [];
      }

      return records
        .map(normalizeRoomRecord)
        .filter(Boolean)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, ROOM_LIST_LIMIT);
    } catch {
      return [];
    }
  }

  function saveRoomRecords(records = state.roomRecords) {
    window.localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(records.slice(0, ROOM_LIST_LIMIT)));
  }

  function setRoomRecords(records, source = state.roomListStatus) {
    state.roomRecords = records
      .map(normalizeRoomRecord)
      .filter(Boolean)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, ROOM_LIST_LIMIT);
    state.roomListStatus = source;
    saveRoomRecords();
  }

  async function refreshRoomRecords({ silent = false } = {}) {
    if (!silent) {
      state.roomListStatus = "loading";
      state.roomListError = "";
      render();
    }

    try {
      const response = await fetch(`/api/interpreter-rooms?limit=${ROOM_LIST_LIMIT}`, {
        method: "GET",
        headers: { Accept: "application/json" }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !Array.isArray(data.rooms)) {
        throw new Error(data.error || "Room list API unavailable.");
      }

      setRoomRecords(data.rooms, "supabase");
      state.roomListError = "";
      render();
    } catch (error) {
      state.roomListStatus = "local";
      state.roomListError = error.message || "Room list API unavailable.";
      render();
    }
  }

  async function syncRoomRecord(record) {
    try {
      const response = await fetch("/api/interpreter-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(record)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.room) {
        throw new Error(data.error || "Room list API unavailable.");
      }

      upsertRoomRecord(data.room, { sync: false, source: "supabase" });
      state.roomListStatus = "supabase";
      state.roomListError = "";
      render();
    } catch (error) {
      state.roomListStatus = "local";
      state.roomListError = error.message || "Room list API unavailable.";
      render();
    }
  }

  function upsertRoomRecord(record, { sync = true, source = state.roomListStatus } = {}) {
    const normalized = normalizeRoomRecord(record);

    if (!normalized) {
      return;
    }

    const existing = state.roomRecords.find((item) => item.roomId === normalized.roomId);
    const merged = normalizeRoomRecord({
      ...existing,
      ...normalized,
      createdAt: existing?.createdAt || normalized.createdAt,
      updatedAt: normalized.updatedAt || Date.now()
    });

    setRoomRecords([
      merged,
      ...state.roomRecords.filter((item) => item.roomId !== merged.roomId)
    ], source);

    if (sync) {
      syncRoomRecord(merged);
    }
  }

  function touchCurrentRoom(status = "active", endedAt = null) {
    if (!state.roomId) {
      return;
    }

    upsertRoomRecord({
      roomId: state.roomId,
      role: state.role,
      language: state.language,
      displayLanguage: state.displayLanguage,
      status,
      endedAt,
      updatedAt: endedAt || Date.now()
    });
  }

  async function deleteRoomRecord(roomId) {
    const cleanRoomId = String(roomId || "").trim().toUpperCase();

    if (!cleanRoomId) {
      return;
    }

    state.roomRecords = state.roomRecords.filter((record) => record.roomId !== cleanRoomId);
    saveRoomRecords();
    render();

    try {
      const response = await fetch(`/api/interpreter-rooms?roomId=${encodeURIComponent(cleanRoomId)}`, {
        method: "DELETE",
        headers: { Accept: "application/json" }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Room list API unavailable.");
      }

      state.roomListStatus = "supabase";
      state.roomListError = "";
    } catch (error) {
      state.roomListStatus = "local";
      state.roomListError = error.message || "Room list API unavailable.";
    }

    render();
  }

  function speakerName() {
    return displayParticipantName();
  }

  function statusLabel(status) {
    return tStatus(status);
  }

  function setNotice(message) {
    state.notice = message;
    render();
    window.clearTimeout(setNotice.timer);
    setNotice.timer = window.setTimeout(() => {
      state.notice = "";
      render();
    }, 3000);
  }

  function getSupabaseSdk() {
    const sdk = window.supabase || globalThis.supabase;

    if (sdk?.createClient) {
      return sdk;
    }

    try {
      const globalSdk = Function("return typeof supabase !== 'undefined' ? supabase : undefined")();

      if (globalSdk?.createClient) {
        window.supabase = globalSdk;
        return globalSdk;
      }
    } catch {
      // Runtime environments can block Function; a clear UI error is shown below.
    }

    return null;
  }

  function getConfigIssue() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return t("configMissing");
    }

    if (!getSupabaseSdk()) {
      return t("sdkMissing");
    }

    return "";
  }

  function getSupabaseClient() {
    const issue = getConfigIssue();

    if (issue) {
      state.syncError = issue;
      return null;
    }

    if (!state.supabaseClient) {
      state.supabaseClient = getSupabaseSdk().createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });
    }

    return state.supabaseClient;
  }

  function getInviteUrl() {
    if (!state.roomId) {
      return "";
    }

    const url = new URL(window.location.origin);
    url.pathname = "/tools/interpreter";
    url.searchParams.set("interpreterRoom", state.roomId);
    url.searchParams.set("interpreterRole", oppositeRole(state.role));
    return url.toString();
  }

  function updateUrlForCurrentRoom() {
    if (!state.roomId) {
      return;
    }

    const url = new URL(window.location.href);
    url.pathname = window.location.pathname.includes("/interpreter") ? window.location.pathname : "/tools/interpreter";
    url.searchParams.set("interpreterRoom", state.roomId);
    url.searchParams.set("interpreterRole", state.role);
    window.history.replaceState({}, "", url.toString());
  }

  function getParticipantPayload() {
    return {
      id: state.participantId,
      role: state.role,
      name: speakerName(),
      language: state.language,
      connected: true,
      micReady: state.micStatus === "granted",
      interpreting: ["connected", "muted"].includes(state.openaiStatus),
      micOn: state.openaiStatus === "connected" && !state.micMuted,
      updatedAt: Date.now()
    };
  }

  async function trackPresence() {
    if (!state.channel) {
      return;
    }

    try {
      await state.channel.track(getParticipantPayload());
    } catch (error) {
      state.syncError = t("presenceFailed", { message: error.message || "unknown error" });
      render();
    }
  }

  function applyPresenceState(presenceState) {
    const latestById = new Map();
    const latestByRole = new Map();

    Object.values(presenceState || {})
      .flat()
      .filter((participant) => participant?.id)
      .forEach((participant) => {
        const role = normalizeRole(participant.role);
        const normalized = {
          ...participant,
          role,
          language: normalizeLanguage(participant.language, defaultLanguageForRole(role)),
          updatedAt: Number(participant.updatedAt || 0)
        };
        const existingById = latestById.get(normalized.id);

        if (!existingById || normalized.updatedAt >= Number(existingById.updatedAt || 0)) {
          latestById.set(normalized.id, normalized);
        }
      });

    latestById.forEach((normalized) => {
        const role = normalized.role;
        const existing = latestByRole.get(role);

        if (
          !existing ||
          normalized.id === state.participantId ||
          (existing.id !== state.participantId && normalized.updatedAt >= Number(existing.updatedAt || 0))
        ) {
          latestByRole.set(role, normalized);
        }
      });

    state.participants = ROLE_ORDER.map((role) => latestByRole.get(role)).filter(Boolean);
  }

  function cleanupChannel() {
    if (!state.channel || !state.supabaseClient) {
      state.channel = null;
      state.channelRoomId = "";
      return;
    }

    const channel = state.channel;
    state.channel = null;
    state.channelRoomId = "";

    try {
      channel.untrack?.();
      state.supabaseClient.removeChannel(channel);
    } catch (error) {
      console.warn("Supabase channel cleanup failed.", error);
    }
  }

  function connectRoom() {
    const client = getSupabaseClient();

    if (!state.roomId) {
      return;
    }

    if (!client) {
      state.syncStatus = "error";
      render();
      return;
    }

    if (state.channel && state.channelRoomId === state.roomId) {
      trackPresence();
      return;
    }

    cleanupChannel();
    state.syncStatus = "connecting";
    state.syncError = "";
    render();

    const channel = client.channel(`interpreter:${state.roomId}`, {
      config: {
        broadcast: { self: true, ack: true },
        presence: { key: state.participantId }
      }
    });

    state.channel = channel;
    state.channelRoomId = state.roomId;

    channel
      .on("presence", { event: "sync" }, () => {
        applyPresenceState(channel.presenceState());
        render();
      })
      .on("broadcast", { event: "caption" }, ({ payload }) => {
        applyCaption(payload);
        render();
      })
      .on("broadcast", { event: "room-ended" }, ({ payload }) => {
        state.endedAt = payload?.endedAt || Date.now();
        state.syncStatus = "ended";
        touchCurrentRoom("ended", state.endedAt);
        render();
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          state.syncStatus = "connected";
          await trackPresence();
          render();
          return;
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          state.syncStatus = "error";
          state.syncError = t("channelError", { status: status.toLowerCase().replace("_", " ") });
          render();
          return;
        }

        if (status === "CLOSED") {
          state.syncStatus = state.endedAt ? "ended" : "closed";
          render();
        }
      });
  }

  function applyCaption(caption) {
    if (!caption?.id || caption.roomId !== state.roomId) {
      return;
    }

    const normalizedCaption = normalizeCaption(caption);

    if (normalizedCaption.partial) {
      state.activeCaptions[normalizedCaption.speakerId] = normalizedCaption;
    } else {
      delete state.activeCaptions[normalizedCaption.speakerId];
      touchCurrentRoom("active");
    }

    upsertCaptionMessage(normalizedCaption);
  }

  function mergeCaptionText(previousText, nextText) {
    const previous = String(previousText || "").trim();
    const next = String(nextText || "").trim();

    if (!next) {
      return previous;
    }

    if (!previous || next.startsWith(previous)) {
      return next;
    }

    if (previous.includes(next)) {
      return previous;
    }

    return `${previous} ${next}`.replace(/\s+/g, " ").trim();
  }

  function dedupeLanguages(languages) {
    return [...new Set(languages.map((language) => normalizeLanguage(language, "")).filter(Boolean))];
  }

  function captionTargetLanguages(sourceLanguage = state.language) {
    const remoteLanguages = getRemoteParticipants()
      .map((participant) => participant.language)
      .filter(isLanguageCode);
    const fallbackLanguages = remoteLanguages.length ? remoteLanguages : [targetLanguage()];

    return dedupeLanguages(fallbackLanguages).filter((language) => language !== sourceLanguage);
  }

  function normalizeTranslationList(caption, sourceLanguage, targetLanguageValue, translatedText) {
    const byLanguage = new Map();
    const addTranslation = (language, text) => {
      const normalizedLanguage = normalizeLanguage(language, "");
      const normalizedText = String(text || "").trim();

      if (!normalizedLanguage || !normalizedText || normalizedLanguage === sourceLanguage) {
        return;
      }

      byLanguage.set(normalizedLanguage, {
        language: normalizedLanguage,
        text: normalizedText
      });
    };

    (Array.isArray(caption.translations) ? caption.translations : []).forEach((translation) => {
      addTranslation(translation?.language, translation?.text);
    });
    addTranslation(caption.translation?.language || targetLanguageValue, caption.translation?.text);
    addTranslation(caption.targetLanguage || targetLanguageValue, caption.translatedText || translatedText);

    return [...byLanguage.values()];
  }

  function mergeTranslations(previousTranslations = [], nextTranslations = []) {
    const byLanguage = new Map();
    const addTranslation = (translation) => {
      const language = normalizeLanguage(translation?.language, "");
      const text = String(translation?.text || "").trim();

      if (!language || !text) {
        return;
      }

      const existing = byLanguage.get(language);
      byLanguage.set(language, {
        language,
        text: existing ? mergeCaptionText(existing.text, text) : text
      });
    };

    previousTranslations.forEach(addTranslation);
    nextTranslations.forEach(addTranslation);
    return [...byLanguage.values()];
  }

  function getTranslationForLanguage(message, language) {
    const normalizedLanguage = normalizeLanguage(language, "");
    const translations = Array.isArray(message?.translations) ? message.translations : [];

    return translations.find((translation) => translation.language === normalizedLanguage) || null;
  }

  function getDisplayTranslation(message) {
    if (!message) {
      return null;
    }

    const viewerTranslation = message.speakerId !== state.participantId
      ? getTranslationForLanguage(message, state.language)
      : null;

    return viewerTranslation || message.translation || message.translations?.[0] || null;
  }

  function shouldMergeWithPrevious(previous, caption) {
    if (!previous || previous.roomId !== caption.roomId || previous.speakerId !== caption.speakerId) {
      return false;
    }

    if (previous.source !== "openai-realtime" || caption.source !== "openai-realtime") {
      return false;
    }

    const previousTime = Number(previous.updatedAt || previous.createdAt || 0);
    const captionTime = Number(caption.createdAt || Date.now());

    return captionTime - previousTime <= LOG_MERGE_WINDOW_MS;
  }

  function mergeCaptionMessage(previous, caption) {
    const originalText = mergeCaptionText(previous.originalText, caption.originalText);
    const translations = mergeTranslations(previous.translations, caption.translations);
    const previousTranslation = getTranslationForLanguage({ translations }, previous.targetLanguage) || translations[0] || previous.translation;
    const captionTranslation = getTranslationForLanguage(caption, caption.targetLanguage) || caption.translation;
    const translatedText = mergeCaptionText(previousTranslation?.text || previous.translatedText, captionTranslation?.text || caption.translatedText);
    const targetLanguageValue = caption.targetLanguage || previous.targetLanguage;

    return normalizeCaption({
      ...previous,
      partial: Boolean(caption.partial),
      updatedAt: caption.createdAt || Date.now(),
      sourceLanguage: caption.sourceLanguage || previous.sourceLanguage,
      targetLanguage: targetLanguageValue,
      originalText,
      translatedText,
      translations,
      original: {
        language: caption.original?.language || previous.original?.language || caption.sourceLanguage,
        text: originalText
      },
      translation: {
        language: caption.translation?.language || previous.translation?.language || targetLanguageValue,
        text: translatedText
      }
    });
  }

  function upsertCaptionMessage(caption) {
    const sameIdIndex = state.messages.findIndex((message) => message.id === caption.id);

    if (sameIdIndex >= 0) {
      state.messages = state.messages.map((message, index) => (index === sameIdIndex ? mergeCaptionMessage(message, caption) : message));
      return;
    }

    const mergeIndex = state.messages.length - 1;
    const previous = state.messages[mergeIndex];

    if (shouldMergeWithPrevious(previous, caption)) {
      state.messages = state.messages.map((message, index) => (index === mergeIndex ? mergeCaptionMessage(message, caption) : message));
      return;
    }

    state.messages = [...state.messages, caption].slice(-200);
  }

  function normalizeCaption(caption) {
    const originalText = caption.original?.text || caption.originalText || "";
    const sourceLanguage = normalizeLanguage(caption.original?.language || caption.sourceLanguage, state.language);
    const targetLanguageValue = normalizeLanguage(caption.translation?.language || caption.targetLanguage, targetLanguage());
    const translations = normalizeTranslationList(caption, sourceLanguage, targetLanguageValue, caption.translatedText);
    const preferredTranslation = getTranslationForLanguage({ translations }, targetLanguageValue) || translations[0] || {
      language: targetLanguageValue,
      text: caption.translation?.text || caption.translatedText || ""
    };
    const translatedText = preferredTranslation?.text || "";

    return {
      ...caption,
      source: caption.source || "manual",
      originalText,
      translatedText,
      sourceLanguage,
      targetLanguage: preferredTranslation?.language || targetLanguageValue,
      translations,
      original: {
        language: sourceLanguage,
        text: originalText
      },
      translation: {
        language: preferredTranslation?.language || targetLanguageValue,
        text: translatedText
      },
      createdAt: caption.createdAt || Date.now(),
      updatedAt: caption.updatedAt || caption.createdAt || Date.now()
    };
  }

  function createCaptionPayload({
    originalText,
    translatedText,
    translations,
    partial,
    source,
    sourceLanguage = state.language,
    targetLanguageValue = targetLanguage()
  }) {
    return normalizeCaption({
      id: partial && state.realtimeCaptionId
        ? state.realtimeCaptionId
        : `caption_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`,
      roomId: state.roomId,
      speakerId: state.participantId,
      speakerRole: state.role,
      speakerName: speakerName(),
      sourceLanguage,
      targetLanguage: targetLanguageValue,
      originalText,
      translatedText,
      translations,
      original: {
        language: sourceLanguage,
        text: originalText
      },
      translation: {
        language: targetLanguageValue,
        text: translatedText
      },
      partial,
      source,
      createdAt: Date.now()
    });
  }

  async function sendRoomEvent(event, payload) {
    if (!state.channel || state.syncStatus !== "connected") {
      state.syncError = t("roomNotConnected");
      render();
      return false;
    }

    try {
      await state.channel.send({ type: "broadcast", event, payload });
      return true;
    } catch (error) {
      state.syncError = t("broadcastFailed", { message: error.message || "unknown error" });
      render();
      return false;
    }
  }

  function createRoom() {
    stopOpenAIRealtime({ finalize: false, silent: true });
    state.roomId = createRoomCode();
    state.messages = [];
    state.activeCaptions = {};
    state.participants = [];
    state.endedAt = null;
    state.openaiStatus = "idle";
    state.openaiError = "";
    state.qrModalOpen = false;
    state.nameModalOpen = !state.participantName;
    upsertRoomRecord({
      roomId: state.roomId,
      role: state.role,
      language: state.language,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    updateUrlForCurrentRoom();
    connectRoom();
  }

  function joinRoom(roomId) {
    const cleanRoomId = String(roomId || "").trim().toUpperCase();

    if (!cleanRoomId) {
      setNotice(t("enterRoomCode"));
      return;
    }

    stopOpenAIRealtime({ finalize: false, silent: true });
    state.roomId = cleanRoomId;
    state.messages = [];
    state.activeCaptions = {};
    state.participants = [];
    state.endedAt = null;
    state.openaiStatus = "idle";
    state.openaiError = "";
    state.qrModalOpen = false;
    state.nameModalOpen = !state.participantName;
    upsertRoomRecord({
      roomId: state.roomId,
      role: state.role,
      language: state.language,
      status: "active",
      updatedAt: Date.now()
    });
    updateUrlForCurrentRoom();
    connectRoom();
  }

  function updateSpokenLanguage(language) {
    if (isOpenAIActive()) {
      stopOpenAIRealtime({ finalize: true });
      setNotice(t("languageChanged"));
    }

    state.language = normalizeLanguage(language, state.language);
    state.role = roleForLanguage(state.language);
    touchCurrentRoom(state.endedAt ? "ended" : "active", state.endedAt);
    updateUrlForCurrentRoom();
    trackPresence();
    render();
  }

  function updateDisplayLanguage(language) {
    state.displayLanguage = UI_LANGUAGES.includes(language) ? language : "ko";
    window.localStorage.setItem(DISPLAY_LANGUAGE_KEY, state.displayLanguage);
    trackPresence();
    render();
  }

  function saveParticipantNameFromEntryInput() {
    const input = $("[data-int-entry-participant-name]");
    saveParticipantName(input?.value || "");
  }

  function openNameModal() {
    state.nameModalOpen = true;
    render();
    window.setTimeout(() => {
      $("[data-int-name-modal-input]")?.focus();
    }, 0);
  }

  function closeNameModal() {
    state.nameModalOpen = false;
    render();
  }

  function saveParticipantNameFromModal() {
    const input = $("[data-int-name-modal-input]");
    saveParticipantName(input?.value || "");
    state.nameModalOpen = false;
    setNotice(t("nameSaved"));
    render();
  }

  function getRemoteParticipant() {
    return getRemoteParticipants()[0] || null;
  }

  function getRemoteParticipants() {
    return state.participants.filter((participant) => participant.id !== state.participantId);
  }

  function getManualTargetLanguage() {
    const remoteParticipant = getRemoteParticipant();
    return isLanguageCode(remoteParticipant?.language)
      ? remoteParticipant.language
      : targetLanguage();
  }

  async function translateForLanguages(text, sourceLanguage, targetLanguages, manualOverride = "") {
    const translations = [];
    let failed = false;
    const primaryTargetLanguage = targetLanguages[0] || getManualTargetLanguage();

    for (const targetLanguageValue of targetLanguages) {
      if (targetLanguageValue === sourceLanguage) {
        continue;
      }

      if (manualOverride && targetLanguageValue === primaryTargetLanguage) {
        translations.push({ language: targetLanguageValue, text: manualOverride });
        continue;
      }

      try {
        translations.push({
          language: targetLanguageValue,
          text: await translateCaptionText(text, sourceLanguage, targetLanguageValue)
        });
      } catch (error) {
        failed = true;
        console.warn("Caption translation failed.", error);
        translations.push({ language: targetLanguageValue, text });
      }
    }

    return { translations, failed };
  }

  async function translateCaptionText(text, sourceLanguage, targetLanguageValue) {
    if (!text || sourceLanguage === targetLanguageValue) {
      return text;
    }

    const response = await fetch("/api/translate-caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage: targetLanguageValue
      })
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.translatedText) {
      throw new Error(data.error || "Caption translation failed.");
    }

    return String(data.translatedText || "").trim();
  }

  async function sendManualCaption() {
    const originalText = state.draftOriginal.trim();

    if (!originalText) {
      setNotice(t("enterBothTexts"));
      return;
    }

    state.captionError = "";
    const sourceLanguage = state.language;
    const targetLanguages = captionTargetLanguages(sourceLanguage);
    const targetLanguageValue = targetLanguages[0] || getManualTargetLanguage();
    let translatedText = "";
    let translations = [];

    state.captionStatus = "translating";
    state.captionError = "";
    render();

    try {
      const translated = await translateForLanguages(originalText, sourceLanguage, targetLanguages);
      translations = translated.translations;
      translatedText = getTranslationForLanguage({ translations }, targetLanguageValue)?.text || translations[0]?.text || originalText;

      if (translated.failed) {
        state.captionError = t("translationFailed");
        setNotice(t("translationFailed"));
      }
    } finally {
      state.captionStatus = "idle";
    }

    const payload = createCaptionPayload({
      originalText,
      translatedText: translatedText || originalText,
      translations,
      partial: false,
      source: "manual",
      sourceLanguage,
      targetLanguageValue
    });

    const sent = await sendRoomEvent("caption", payload);

    if (sent) {
      applyCaption(payload);
      state.draftOriginal = "";
      render();
    }
  }

  async function copyInvite() {
    const inviteUrl = getInviteUrl();

    if (!inviteUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setNotice(t("inviteCopied"));
    } catch {
      setNotice(t("copyFailed"));
    }
  }

  function openQrModal() {
    state.qrModalOpen = true;
    render();
  }

  function closeQrModal() {
    state.qrModalOpen = false;
    render();
  }

  function getConversationStorageKey() {
    return `${LOG_STORAGE_PREFIX}${state.roomId}`;
  }

  function saveConversationLog() {
    if (!state.roomId) {
      return;
    }

    const payload = {
      roomId: state.roomId,
      savedAt: Date.now(),
      messages: state.messages.map((message) => normalizeCaption(message))
    };

    window.localStorage.setItem(getConversationStorageKey(), JSON.stringify(payload));
    setNotice(t("logSaved"));
  }

  function loadConversationLog() {
    if (!state.roomId) {
      return;
    }

    const raw = window.localStorage.getItem(getConversationStorageKey());

    if (!raw) {
      setNotice(t("noSavedLog"));
      return;
    }

    try {
      const payload = JSON.parse(raw);
      const messages = Array.isArray(payload.messages) ? payload.messages : [];
      state.messages = messages
        .map((message) => normalizeCaption({ ...message, roomId: state.roomId }))
        .filter((message) => message.id)
        .slice(-200);
      setNotice(t("logLoaded"));
      render();
    } catch {
      setNotice(t("noSavedLog"));
    }
  }

  function deleteConversationLog() {
    if (!state.roomId) {
      return;
    }

    if (!window.confirm(t("deleteLogConfirm"))) {
      return;
    }

    window.localStorage.removeItem(getConversationStorageKey());
    setNotice(t("logDeleted"));
  }

  async function checkMicrophonePermission() {
    if (!navigator.mediaDevices?.getUserMedia) {
      state.micStatus = "unavailable";
      render();
      return;
    }

    try {
      state.micStatus = "requesting";
      render();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      state.micStatus = "granted";
      await trackPresence();
      render();
    } catch {
      state.micStatus = "denied";
      await trackPresence();
      render();
    }
  }

  function isOpenAIActive() {
    return ["requesting-microphone", "fetching-token", "connecting", "connected", "muted"].includes(state.openaiStatus);
  }

  function getEphemeralToken(tokenData) {
    return tokenData?.value || tokenData?.client_secret?.value || tokenData?.clientSecret?.value || "";
  }

  function getTokenErrorMessage(tokenData) {
    if (typeof tokenData?.error === "string") {
      return tokenData.error;
    }

    if (typeof tokenData?.details?.error === "string") {
      return tokenData.details.error;
    }

    if (typeof tokenData?.details?.error?.message === "string") {
      return tokenData.details.error.message;
    }

    return "OpenAI Realtime token request failed.";
  }

  async function requestRealtimeToken() {
    const response = await fetch("/api/realtime-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: state.roomId,
        participantId: state.participantId,
        sourceLanguage: state.language,
        targetLanguage: targetLanguage()
      })
    });
    const tokenData = await response.json().catch(() => ({}));
    const ephemeralToken = getEphemeralToken(tokenData);

    if (!response.ok || !ephemeralToken) {
      throw new Error(getTokenErrorMessage(tokenData));
    }

    return ephemeralToken;
  }

  function handleRealtimeEvent(event) {
    if (!event?.type) {
      return;
    }

    if (event.type === "error") {
      state.openaiStatus = "error";
      state.openaiError = event.error?.message || "OpenAI Realtime returned an error.";
      render();
      return;
    }

    if (event.type.includes("input_transcript")) {
      if (event.delta) {
        state.realtimeDraft.originalText += event.delta;
        emitRealtimeCaption(true);
        scheduleRealtimeFinalize();
      }

      if (event.transcript && event.type.includes("done")) {
        state.realtimeDraft.originalText = event.transcript;
        scheduleRealtimeFinalize();
      }
      return;
    }

    if (event.type.includes("output_transcript")) {
      if (event.delta) {
        state.realtimeDraft.translatedText += event.delta;
        emitRealtimeCaption(true);
        scheduleRealtimeFinalize();
      }

      if (event.transcript && event.type.includes("done")) {
        state.realtimeDraft.translatedText = event.transcript;
        scheduleRealtimeFinalize();
      }
      return;
    }

    if (event.type === "session.closed" || event.type.includes(".completed")) {
      emitRealtimeCaption(false);
    }
  }

  function scheduleRealtimeFinalize() {
    window.clearTimeout(state.realtimeFinalizeTimer);
    state.realtimeFinalizeTimer = window.setTimeout(() => emitRealtimeCaption(false), FINALIZE_CAPTION_DELAY_MS);
  }

  async function completeCaptionTranslations(payload) {
    if (payload.partial || !payload.originalText) {
      return payload;
    }

    const existingLanguages = new Set((payload.translations || []).map((translation) => translation.language));
    const missingLanguages = captionTargetLanguages(payload.sourceLanguage)
      .filter((language) => !existingLanguages.has(language));

    if (!missingLanguages.length) {
      return payload;
    }

    const translations = [...(payload.translations || [])];
    let failed = false;

    for (const language of missingLanguages) {
      try {
        translations.push({
          language,
          text: await translateCaptionText(payload.originalText, payload.sourceLanguage, language)
        });
      } catch (error) {
        failed = true;
        console.warn("Realtime caption translation supplement failed.", error);
        translations.push({ language, text: payload.originalText });
      }
    }

    if (failed) {
      state.captionError = t("translationFailed");
    }

    return normalizeCaption({
      ...payload,
      translations
    });
  }

  function publishCaptionPayload(payload) {
    sendRoomEvent("caption", payload).then((sent) => {
      if (sent) {
        applyCaption(payload);
        render();
      }
    });
  }

  function emitRealtimeCaption(partial) {
    const originalText = state.realtimeDraft.originalText.trim();
    const translatedText = state.realtimeDraft.translatedText.trim();

    if (!originalText && !translatedText) {
      return;
    }

    const now = Date.now();
    if (partial && now - state.realtimeLastPartialAt < PARTIAL_CAPTION_INTERVAL_MS) {
      return;
    }

    state.realtimeLastPartialAt = now;

    if (!state.realtimeCaptionId) {
      state.realtimeCaptionId = `caption_${now.toString(36)}_${Math.random().toString(36).slice(2)}`;
    }

    const targetLanguageValue = targetLanguage();
    const payload = normalizeCaption({
      id: state.realtimeCaptionId,
      roomId: state.roomId,
      speakerId: state.participantId,
      speakerRole: state.role,
      speakerName: speakerName(),
      sourceLanguage: state.language,
      targetLanguage: targetLanguageValue,
      originalText,
      translatedText,
      translations: translatedText ? [{ language: targetLanguageValue, text: translatedText }] : [],
      original: {
        language: state.language,
        text: originalText
      },
      translation: {
        language: targetLanguageValue,
        text: translatedText
      },
      partial,
      source: "openai-realtime",
      createdAt: now
    });

    if (partial) {
      publishCaptionPayload(payload);
    } else {
      completeCaptionTranslations(payload).then(publishCaptionPayload);
    }

    if (!partial) {
      state.realtimeDraft = { originalText: "", translatedText: "" };
      state.realtimeCaptionId = "";
    }
  }

  async function startOpenAIRealtime() {
    if (!state.roomId) {
      setNotice("Create or join a room first.");
      return;
    }

    if (state.syncStatus !== "connected") {
      state.openaiStatus = "error";
      state.openaiError = "Supabase room is not connected yet. Captions need Supabase Broadcast to reach the other screen.";
      render();
      return;
    }

    if (isOpenAIActive()) {
      return;
    }

    if (!window.RTCPeerConnection || !navigator.mediaDevices?.getUserMedia) {
      state.openaiStatus = "error";
      state.openaiError = "This browser does not support WebRTC microphone input.";
      render();
      return;
    }

    try {
      state.openaiStatus = "requesting-microphone";
      state.openaiError = "";
      state.realtimeDraft = { originalText: "", translatedText: "" };
      state.realtimeCaptionId = "";
      render();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      state.mediaStream = mediaStream;
      state.micStatus = "granted";
      state.micMuted = false;
      await trackPresence();

      state.openaiStatus = "fetching-token";
      render();
      const ephemeralToken = await requestRealtimeToken();

      state.openaiStatus = "connecting";
      render();

      const peerConnection = new RTCPeerConnection();
      state.peerConnection = peerConnection;

      mediaStream.getAudioTracks().forEach((track) => {
        peerConnection.addTrack(track, mediaStream);
      });

      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      remoteAudio.muted = !state.voiceEnabled;
      state.remoteAudio = remoteAudio;

      peerConnection.ontrack = ({ streams }) => {
        remoteAudio.srcObject = streams[0];
        remoteAudio.play?.().catch(() => {
          // Mobile browsers can require a user gesture before playback.
        });
      };

      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "connected") {
          state.openaiStatus = state.micMuted ? "muted" : "connected";
          trackPresence();
          render();
        }

        if (["failed", "disconnected"].includes(peerConnection.connectionState)) {
          state.openaiStatus = "error";
          state.openaiError = "OpenAI Realtime connection was interrupted. Manual Supabase captions are still available.";
          trackPresence();
          render();
        }
      };

      const dataChannel = peerConnection.createDataChannel("oai-events");
      state.dataChannel = dataChannel;

      dataChannel.onopen = () => {
        state.openaiStatus = state.micMuted ? "muted" : "connected";
        trackPresence();
        render();
      };

      dataChannel.onmessage = ({ data }) => {
        try {
          handleRealtimeEvent(JSON.parse(data));
        } catch (error) {
          console.warn("Ignored malformed OpenAI Realtime event.", error);
        }
      };

      dataChannel.onclose = () => {
        if (!state.peerConnection || state.openaiStatus === "error") {
          return;
        }

        state.openaiStatus = "closed";
        trackPresence();
        render();
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const sdpResponse = await fetch(OPENAI_TRANSLATION_CALLS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp"
        },
        body: offer.sdp
      });

      if (!sdpResponse.ok) {
        throw new Error(await sdpResponse.text());
      }

      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: await sdpResponse.text()
      });
    } catch (error) {
      stopOpenAIRealtime({ finalize: false, silent: true });
      state.openaiStatus = "error";
      state.openaiError = `${error.message || "OpenAI Realtime connection failed."} Manual Supabase captions are still available.`;
      await trackPresence();
      render();
    }
  }

  function stopOpenAIRealtime(options = {}) {
    const { finalize = true, silent = false } = options;
    window.clearTimeout(state.realtimeFinalizeTimer);

    if (finalize) {
      emitRealtimeCaption(false);
    }

    if (state.dataChannel?.readyState === "open") {
      try {
        state.dataChannel.send(JSON.stringify({ type: "session.close" }));
      } catch {
        // Ignore best-effort close event failures.
      }
    }

    state.dataChannel?.close();
    state.peerConnection?.getSenders().forEach((sender) => sender.track?.stop());
    state.peerConnection?.close();
    state.mediaStream?.getTracks().forEach((track) => track.stop());
    state.remoteAudio?.pause();

    state.dataChannel = null;
    state.peerConnection = null;
    state.mediaStream = null;
    state.remoteAudio = null;
    state.micMuted = false;

    if (!silent && state.openaiStatus !== "error") {
      state.openaiStatus = "closed";
      trackPresence();
      render();
    }
  }

  function toggleOpenAIMic() {
    if (!state.mediaStream) {
      return;
    }

    state.micMuted = !state.micMuted;
    state.mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = !state.micMuted;
    });

    if (state.micMuted) {
      emitRealtimeCaption(false);
    }

    state.openaiStatus = state.micMuted ? "muted" : "connected";
    trackPresence();
    render();
  }

  function toggleOpenAIVoice() {
    state.voiceEnabled = !state.voiceEnabled;

    if (state.remoteAudio) {
      state.remoteAudio.muted = !state.voiceEnabled;
    }

    render();
  }

  async function endRoom() {
    stopOpenAIRealtime({ finalize: true, silent: true });
    const endedAt = Date.now();
    state.endedAt = endedAt;
    touchCurrentRoom("ended", endedAt);
    await sendRoomEvent("room-ended", {
      roomId: state.roomId,
      endedAt,
      participantId: state.participantId
    });
    cleanupChannel();
    state.syncStatus = "ended";
    render();
  }

  function returnToStart() {
    stopOpenAIRealtime({ finalize: false, silent: true });
    cleanupChannel();
    state.roomId = "";
    state.role = "a";
    state.language = "ko";
    state.messages = [];
    state.activeCaptions = {};
    state.participants = [];
    state.channelRoomId = "";
    state.syncStatus = "idle";
    state.syncError = "";
    state.endedAt = null;
    state.micStatus = "idle";
    state.openaiStatus = "idle";
    state.openaiError = "";
    state.captionStatus = "idle";
    state.captionError = "";
    state.qrModalOpen = false;
    state.nameModalOpen = false;
    state.draftOriginal = "";
    state.draftTranslated = "";

    const url = new URL(window.location.href);
    url.pathname = "/tools/interpreter";
    url.searchParams.delete("interpreterRoom");
    url.searchParams.delete("interpreterRole");
    window.history.replaceState({}, "", url.toString());
    render();
  }

  function latestCaption(isRemote) {
    const active = Object.values(state.activeCaptions).find((message) =>
      isRemote ? message.speakerId !== state.participantId : message.speakerId === state.participantId
    );

    if (active) {
      return active;
    }

    return [...state.messages].reverse().find((message) =>
      isRemote ? message.speakerId !== state.participantId : message.speakerId === state.participantId
    );
  }

  function renderConfigAlert() {
    const issue = getConfigIssue();

    if (!issue) {
      return "";
    }

    return `<div class="interpreter-alert is-warning">${escapeHtml(issue)}</div>`;
  }

  function renderParticipant(participant) {
    const isMe = participant.id === state.participantId;
    const statusText = participant.interpreting ? t("interpreting") : participant.micReady ? t("micReady") : t("micNotChecked");

    return `
      <div class="interpreter-participant ${isMe ? "is-self" : ""}">
        <div class="interpreter-avatar">${displayRole(participant.role)}</div>
        <div>
          <strong>${escapeHtml(isMe ? displayParticipantName() : participant.name)}${isMe ? ` (${escapeHtml(t("you"))})` : ""}</strong>
          <span>${languageLabel(isMe ? state.language : participant.language)} · ${statusText}</span>
        </div>
        <span class="interpreter-dot ${participant.micOn ? "is-speaking" : participant.connected ? "is-live" : ""}" aria-label="${participant.micOn ? t("micLive") : participant.connected ? t("online") : t("offline")}"></span>
      </div>
    `;
  }

  function renderLog(message) {
    const original = message.original || { language: message.sourceLanguage, text: message.originalText };
    const translations = Array.isArray(message.translations) && message.translations.length
      ? message.translations
      : [message.translation || { language: message.targetLanguage, text: message.translatedText }].filter((translation) => translation?.text);
    const time = new Intl.DateTimeFormat(uiLocale(), {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(message.createdAt || Date.now());
    const isOwn = message.speakerId === state.participantId;
    const speakerLabel = isOwn ? t("me") : t("remoteSpeaker");

    return `
      <article class="interpreter-log-row ${isOwn ? "is-own" : "is-remote"}">
        <div class="interpreter-log-meta">
          <strong>${displayRole(message.speakerRole)} · ${escapeHtml(message.speakerName || speakerLabel)} · ${escapeHtml(speakerLabel)}</strong>
          <time>${time}</time>
        </div>
        <p class="${original.language === state.language ? "is-focus-language" : ""}"><span>${escapeHtml(languageLabel(original.language))}</span>${escapeHtml(original.text)}</p>
        <div class="interpreter-log-translations">
          ${translations.map((translation) => `<h4 class="${translation.language === state.language ? "is-focus-language" : ""}"><span>${escapeHtml(languageLabel(translation.language))}</span>${escapeHtml(translation.text)}</h4>`).join("")}
        </div>
      </article>
    `;
  }

  function renderCaptionPanels() {
    const remote = latestCaption(true);
    const own = latestCaption(false);
    const remoteTranslation = getDisplayTranslation(remote);
    const ownTranslation = getDisplayTranslation(own);

    return `
      <div class="interpreter-caption-grid">
        <section class="interpreter-caption-panel is-remote">
          <span class="eyebrow">Remote caption</span>
          <h3>${escapeHtml(remoteTranslation?.text || remote?.translatedText || "Waiting for the other participant")}</h3>
          <p>${escapeHtml(remote?.original?.text || remote?.originalText || "")}</p>
          <small>${remote ? `Speaker ${displayRole(remote.speakerRole)}` : "No caption received yet"}</small>
        </section>
        <section class="interpreter-caption-panel">
          <span class="eyebrow">My last caption</span>
          <h3>${escapeHtml(ownTranslation?.text || own?.translatedText || "Send a test caption below")}</h3>
          <p>${escapeHtml(own?.original?.text || own?.originalText || "")}</p>
          <small>Target: ${languageLabel(targetLanguage())}</small>
        </section>
      </div>
    `;
  }

  function renderConversationLog() {
    return `
      <section class="interpreter-card interpreter-log-card">
        <div class="interpreter-card-header">
          <div>
            <span class="eyebrow">${escapeHtml(t("conversationLog"))}</span>
          </div>
          <div class="interpreter-log-tools">
            <div class="interpreter-compact-actions">
              <button class="ghost-button" type="button" data-int-save-log>${escapeHtml(t("saveLog"))}</button>
              <button class="ghost-button" type="button" data-int-load-log>${escapeHtml(t("loadLog"))}</button>
              <button class="ghost-button" type="button" data-int-delete-log>${escapeHtml(t("deleteLog"))}</button>
            </div>
          </div>
        </div>
        <div class="interpreter-log-list">
          ${state.messages.length ? [...state.messages].reverse().map(renderLog).join("") : `<div class="interpreter-empty">${escapeHtml(t("noCaptions"))}</div>`}
        </div>
      </section>
    `;
  }

  function renderManualCaptionForm() {
    const disabled = state.syncStatus !== "connected" || state.endedAt || state.captionStatus === "translating";

    return `
      <form class="interpreter-manual-form" data-int-caption-form>
        <label>
          <span>${escapeHtml(t("originalText"))}</span>
          <textarea data-int-original rows="3" ${disabled ? "disabled" : ""} placeholder="${escapeHtml(t("originalPlaceholder", { role: displayRole(state.role) }))}">${escapeHtml(state.draftOriginal)}</textarea>
        </label>
        <button class="primary-button" type="submit" ${disabled ? "disabled" : ""}>${escapeHtml(state.captionStatus === "translating" ? t("translatingCaption") : t("sendCaption"))}</button>
      </form>
    `;
  }

  function renderOpenAIControls() {
    const canStart = state.syncStatus === "connected" && !state.endedAt && !isOpenAIActive();
    const active = isOpenAIActive();

    return `
        <div class="interpreter-top-controls" aria-label="${escapeHtml(t("openaiTitle"))}">
          ${
            active
              ? `<button class="primary-button" type="button" data-int-toggle-openai-mic>${state.micMuted ? escapeHtml(t("unmuteMic")) : escapeHtml(t("muteMic"))}</button>`
              : `<button class="primary-button" type="button" data-int-start-openai ${canStart ? "" : "disabled"}>${escapeHtml(t("startLive"))}</button>`
          }
          <button class="ghost-button" type="button" data-int-toggle-openai-voice>${state.voiceEnabled ? escapeHtml(t("voiceOn")) : escapeHtml(t("voiceOff"))}</button>
          ${active ? `<button class="ghost-button" type="button" data-int-stop-openai>${escapeHtml(t("stopLive"))}</button>` : ""}
        </div>
    `;
  }

  function renderInviteButton() {
    return `<button class="ghost-button" type="button" data-int-open-qr>${escapeHtml(t("invite"))}</button>`;
  }

  function renderRoomRecord(record) {
    const isEnded = record.status === "ended";
    const updatedAt = new Intl.DateTimeFormat(uiLocale(), {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(record.updatedAt || record.createdAt || Date.now());

    return `
      <article class="interpreter-room-record ${isEnded ? "is-ended" : "is-active"}">
        <div>
          <strong>${escapeHtml(record.roomId)}</strong>
          <span>${escapeHtml(displayRole(record.role))} · ${escapeHtml(languageLabel(record.language))} · ${escapeHtml(updatedAt)}</span>
        </div>
        <span class="interpreter-room-status">${escapeHtml(isEnded ? t("endedRoom") : t("activeRoom"))}</span>
        <div class="interpreter-room-record-actions">
          <button class="ghost-button" type="button" data-int-open-room="${escapeHtml(record.roomId)}" ${isEnded ? "disabled" : ""}>${escapeHtml(t("rejoinRoom"))}</button>
          <button class="danger-button" type="button" data-int-delete-room="${escapeHtml(record.roomId)}">${escapeHtml(t("deleteRoom"))}</button>
        </div>
      </article>
    `;
  }

  function renderRoomList() {
    return `
      <section class="interpreter-start-card interpreter-room-list-card">
        <div class="interpreter-card-header">
          <div>
            <span class="eyebrow">${escapeHtml(t("recentRooms"))}</span>
            <h2>${escapeHtml(t("recentRoomsTitle"))}</h2>
          </div>
          <small>${escapeHtml(t("recentRoomsHint"))}</small>
        </div>
        ${state.roomListStatus === "loading" ? `<div class="interpreter-alert is-info">${escapeHtml(t("roomListLoading"))}</div>` : ""}
        ${state.roomListError ? `<div class="interpreter-alert is-warning">${escapeHtml(t("roomListFallback"))}</div>` : ""}
        <div class="interpreter-room-list">
          ${state.roomRecords.length ? state.roomRecords.map(renderRoomRecord).join("") : `<div class="interpreter-empty">${escapeHtml(t("noRooms"))}</div>`}
        </div>
      </section>
    `;
  }

  function renderEntrySetupCard() {
    return `
      <section class="interpreter-start-card interpreter-entry-card">
        <span class="eyebrow">${escapeHtml(t("participantName"))}</span>
        <h2>${escapeHtml(t("nameSetupTitle"))}</h2>
        <p>${escapeHtml(t("nameSetupHint"))}</p>
        <div class="interpreter-entry-controls">
          <label>
            <span>${escapeHtml(t("participantName"))}</span>
            <input class="control-input" type="text" value="${escapeHtml(state.participantName)}" placeholder="${escapeHtml(t("participantNamePlaceholder"))}" data-int-entry-participant-name maxlength="40" />
          </label>
          <label>
            <span>${escapeHtml(t("roleLanguage"))}</span>
            <select class="interpreter-select" data-int-spoken-language aria-label="${escapeHtml(t("roleLanguage"))}">
              ${renderSpokenLanguageOptions()}
            </select>
          </label>
          <label>
            <span>${escapeHtml(t("displayLanguage"))}</span>
            <select class="interpreter-select" data-int-display-language aria-label="${escapeHtml(t("displayLanguage"))}">
              ${renderDisplayLanguageOptions()}
            </select>
          </label>
        </div>
      </section>
    `;
  }

  function renderHome() {
    const disabled = Boolean(getConfigIssue());

    return `
      <div class="interpreter-start">
        ${renderConfigAlert()}
        ${renderEntrySetupCard()}
        <section class="interpreter-start-card">
          <span class="eyebrow">${escapeHtml(t("homeEyebrow"))}</span>
          <h1>${escapeHtml(t("homeTitle"))}</h1>
          <p>${escapeHtml(t("homeDescription"))}</p>
          <button class="primary-button" type="button" data-int-create-room ${disabled ? "disabled" : ""}>${escapeHtml(t("createRoom"))}</button>
        </section>
        <section class="interpreter-start-card">
          <span class="eyebrow">${escapeHtml(t("joinEyebrow"))}</span>
          <h2>${escapeHtml(t("joinTitle"))}</h2>
          <div class="interpreter-join-row">
            <input class="control-input" id="interpreter-room-input" type="text" placeholder="${escapeHtml(t("roomPlaceholder"))}" maxlength="12" autocomplete="off" />
            <button class="ghost-button" type="button" data-int-join-room ${disabled ? "disabled" : ""}>${escapeHtml(t("join"))}</button>
          </div>
        </section>
        ${renderRoomList()}
      </div>
    `;
  }

  function renderInviteCard(inviteUrl) {
    return `
      <section class="interpreter-card">
        <div class="interpreter-card-header">
          <div>
            <span class="eyebrow">${escapeHtml(t("invite"))}</span>
            <h2>${escapeHtml(t("inviteRole", { role: displayRole(oppositeRole(state.role)) }))}</h2>
          </div>
        </div>
        <div class="interpreter-invite-actions">
          <button class="ghost-button" type="button" data-int-copy-invite>${escapeHtml(t("copy"))}</button>
          <button class="primary-button" type="button" data-int-open-qr>${escapeHtml(t("showQr"))}</button>
        </div>
        <span class="interpreter-link-label">${escapeHtml(t("inviteLink"))}</span>
        <p class="interpreter-link">${escapeHtml(inviteUrl)}</p>
      </section>
    `;
  }

  function renderQrModal(qrSrc, inviteUrl) {
    if (!state.qrModalOpen || !qrSrc) {
      return "";
    }

    return `
      <div class="interpreter-modal-backdrop" data-int-qr-backdrop>
        <section class="interpreter-modal" role="dialog" aria-modal="true" aria-labelledby="interpreter-qr-title">
          <div class="interpreter-card-header">
            <div>
              <span class="eyebrow">${escapeHtml(t("invite"))}</span>
              <h2 id="interpreter-qr-title">${escapeHtml(t("inviteLink"))}</h2>
            </div>
            <button class="ghost-button" type="button" data-int-close-qr>${escapeHtml(t("close"))}</button>
          </div>
          <p>${escapeHtml(t("qrDescription"))}</p>
          <div class="interpreter-invite-actions">
            <button class="ghost-button" type="button" data-int-copy-invite>${escapeHtml(t("copy"))}</button>
          </div>
          <div class="interpreter-qr">
            <img src="${qrSrc}" alt="${escapeHtml(t("qrTitle"))}" />
          </div>
          <span class="interpreter-link-label">${escapeHtml(t("inviteLink"))}</span>
          <p class="interpreter-link">${escapeHtml(inviteUrl)}</p>
        </section>
      </div>
    `;
  }

  function renderNameModal() {
    if (!state.nameModalOpen) {
      return "";
    }

    return `
      <div class="interpreter-modal-backdrop" data-int-name-backdrop>
        <section class="interpreter-modal" role="dialog" aria-modal="true" aria-labelledby="interpreter-name-title">
          <div class="interpreter-card-header">
            <div>
              <span class="eyebrow">${escapeHtml(t("participantName"))}</span>
              <h2 id="interpreter-name-title">${escapeHtml(t("nameModalTitle"))}</h2>
            </div>
            <button class="ghost-button" type="button" data-int-close-name-modal>${escapeHtml(t("close"))}</button>
          </div>
          <p>${escapeHtml(t("nameModalDescription"))}</p>
          <label class="interpreter-modal-field">
            <span>${escapeHtml(t("participantName"))}</span>
            <input class="control-input" type="text" value="${escapeHtml(displayParticipantName())}" placeholder="${escapeHtml(t("participantNamePlaceholder"))}" data-int-name-modal-input maxlength="40" />
          </label>
          <div class="interpreter-modal-actions">
            <button class="ghost-button" type="button" data-int-close-name-modal>${escapeHtml(t("close"))}</button>
            <button class="primary-button" type="button" data-int-save-name-modal>${escapeHtml(t("saveName"))}</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderRoom() {
    const inviteUrl = getInviteUrl();
    const qrSrc = inviteUrl ? `/api/interpreter-qr?text=${encodeURIComponent(inviteUrl)}` : "";
    const participants = state.participants.length
      ? state.participants.map(renderParticipant).join("")
      : `<div class="interpreter-empty">${escapeHtml(t("waitingPresence"))}</div>`;

    return `
      <div class="interpreter-grid">
        <section class="interpreter-main-panel">
          <div class="interpreter-room-topbar">
            <div>
              <span class="interpreter-room-code">${escapeHtml(state.roomId)}</span>
              <h1>${escapeHtml(t("room", { roomId: state.roomId }))}</h1>
            </div>
            <div class="interpreter-room-actions">
              ${renderInviteButton()}
            </div>
          </div>

          <div class="interpreter-language-panel">
            <label class="interpreter-display-language-control">
              <div class="interpreter-control-heading">
                <span>${escapeHtml(t("roleLanguage"))}</span>
                <small>${escapeHtml(t("roleLanguageHint"))}</small>
              </div>
              <select class="interpreter-select" data-int-spoken-language aria-label="${escapeHtml(t("roleLanguage"))}">
                ${renderSpokenLanguageOptions()}
              </select>
            </label>
            <label class="interpreter-display-language-control">
              <span>${escapeHtml(t("displayLanguage"))}</span>
              <select class="interpreter-select" data-int-display-language aria-label="${escapeHtml(t("displayLanguage"))}">
                ${renderDisplayLanguageOptions()}
              </select>
            </label>
          </div>

          ${renderConfigAlert()}
          ${state.syncError ? `<div class="interpreter-alert is-warning">${escapeHtml(state.syncError)}</div>` : ""}
          ${state.openaiError ? `<div class="interpreter-alert is-warning">${escapeHtml(state.openaiError)}</div>` : ""}
          ${state.captionError ? `<div class="interpreter-alert is-warning">${escapeHtml(state.captionError)}</div>` : ""}
          ${state.endedAt ? `<div class="interpreter-alert interpreter-ended-alert"><span>${escapeHtml(t("roomEnded"))}</span></div>` : ""}
          ${state.notice ? `<div class="interpreter-toast">${escapeHtml(state.notice)}</div>` : ""}

          <div class="interpreter-name-summary">
            <div>
              <span>${escapeHtml(t("participantName"))}</span>
              <strong>${escapeHtml(displayParticipantName())}</strong>
            </div>
            <button class="ghost-button" type="button" data-int-open-name-modal>${escapeHtml(t("editName"))}</button>
          </div>

          <div class="interpreter-participants">${participants}</div>
          ${renderOpenAIControls()}
          ${renderConversationLog()}
          ${renderManualCaptionForm()}

          <div class="interpreter-actions">
            <button class="ghost-button" type="button" data-int-check-mic>${escapeHtml(t("checkMic"))}</button>
            <button class="danger-button" type="button" data-int-end-room ${state.endedAt ? "disabled" : ""}>${escapeHtml(t("endRoom"))}</button>
            <button class="${state.endedAt ? "primary-button" : "ghost-button"}" type="button" data-int-return-start>${escapeHtml(t("backToStart"))}</button>
          </div>
        </section>
      </div>
      ${renderQrModal(qrSrc, inviteUrl)}
      ${renderNameModal()}
    `;
  }

  function render() {
    const container = $("#interpreter-content");

    if (!container) {
      return;
    }

    updateStaticChrome();
    container.innerHTML = state.roomId ? renderRoom() : renderHome();
  }

  function parseRoomFromUrl() {
    const url = new URL(window.location.href);
    const roomId = String(url.searchParams.get("interpreterRoom") || "").trim().toUpperCase();
    const role = normalizeRole(url.searchParams.get("interpreterRole"));

    if (!roomId) {
      return;
    }

    state.roomId = roomId;
    state.role = role;
    state.language = defaultLanguageForRole(role);
    state.nameModalOpen = !state.participantName;
    upsertRoomRecord({
      roomId: state.roomId,
      role: state.role,
      language: state.language,
      status: "active",
      updatedAt: Date.now()
    });
    connectRoom();
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const createButton = event.target.closest("[data-int-create-room]");
      if (createButton) {
        createRoom();
        return;
      }

      const joinButton = event.target.closest("[data-int-join-room]");
      if (joinButton) {
        joinRoom($("#interpreter-room-input")?.value);
        return;
      }

      const openRoomButton = event.target.closest("[data-int-open-room]");
      if (openRoomButton) {
        joinRoom(openRoomButton.dataset.intOpenRoom);
        return;
      }

      const deleteRoomButton = event.target.closest("[data-int-delete-room]");
      if (deleteRoomButton) {
        const roomId = deleteRoomButton.dataset.intDeleteRoom;
        if (window.confirm(t("deleteRoomConfirm", { roomId }))) {
          deleteRoomRecord(roomId);
        }
        return;
      }

      if (event.target.closest("[data-int-open-name-modal]")) {
        openNameModal();
        return;
      }

      if (event.target.matches("[data-int-name-backdrop]") || event.target.closest("[data-int-close-name-modal]")) {
        closeNameModal();
        return;
      }

      if (event.target.closest("[data-int-save-name-modal]")) {
        saveParticipantNameFromModal();
        return;
      }

      if (event.target.closest("[data-int-copy-invite]")) {
        copyInvite();
        return;
      }

      if (event.target.closest("[data-int-open-qr]")) {
        openQrModal();
        return;
      }

      if (event.target.matches("[data-int-qr-backdrop]") || event.target.closest("[data-int-close-qr]")) {
        closeQrModal();
        return;
      }

      if (event.target.closest("[data-int-check-mic]")) {
        checkMicrophonePermission();
        return;
      }

      if (event.target.closest("[data-int-start-openai]")) {
        startOpenAIRealtime();
        return;
      }

      if (event.target.closest("[data-int-toggle-openai-mic]")) {
        toggleOpenAIMic();
        return;
      }

      if (event.target.closest("[data-int-toggle-openai-voice]")) {
        toggleOpenAIVoice();
        return;
      }

      if (event.target.closest("[data-int-stop-openai]")) {
        stopOpenAIRealtime();
        return;
      }

      if (event.target.closest("[data-int-end-room]")) {
        endRoom();
        return;
      }

      if (event.target.closest("[data-int-return-start]")) {
        returnToStart();
        return;
      }

      if (event.target.closest("[data-int-save-log]")) {
        saveConversationLog();
        return;
      }

      if (event.target.closest("[data-int-load-log]")) {
        loadConversationLog();
        return;
      }

      if (event.target.closest("[data-int-delete-log]")) {
        deleteConversationLog();
      }
    });

    document.addEventListener("change", (event) => {
      if (event.target.matches("[data-int-spoken-language]")) {
        updateSpokenLanguage(event.target.value);
      }

      if (event.target.matches("[data-int-display-language]")) {
        updateDisplayLanguage(event.target.value);
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.matches("[data-int-original]")) {
        state.draftOriginal = event.target.value;
      }

      if (event.target.matches("[data-int-entry-participant-name]")) {
        saveParticipantNameFromEntryInput();
      }
    });

    document.addEventListener("submit", (event) => {
      if (event.target.matches("[data-int-caption-form]")) {
        event.preventDefault();
        sendManualCaption();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.qrModalOpen) {
        closeQrModal();
        return;
      }

      if (event.key === "Escape" && state.nameModalOpen) {
        closeNameModal();
      }
    });
  }

  window.realtimeInterpreter = {
    getState: () => ({
      roomId: state.roomId,
      role: state.role,
      language: state.language,
      displayLanguage: state.displayLanguage,
      participantName: displayParticipantName(),
      nameModalOpen: state.nameModalOpen,
      participants: state.participants,
      messages: state.messages,
      roomRecords: state.roomRecords,
      roomListStatus: state.roomListStatus,
      roomListError: state.roomListError,
      syncStatus: state.syncStatus,
      syncError: state.syncError,
      captionStatus: state.captionStatus,
      captionError: state.captionError,
      micStatus: state.micStatus,
      openaiStatus: state.openaiStatus,
      openaiError: state.openaiError
    })
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    parseRoomFromUrl();
    render();
    refreshRoomRecords({ silent: Boolean(state.roomId) });
  });
})();
