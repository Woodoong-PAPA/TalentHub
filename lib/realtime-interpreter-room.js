const { parse } = require("url");
const { WebSocketServer, WebSocket } = require("ws");

const rooms = new Map();
const LANGUAGES = new Set(["ko", "en", "zh"]);
const ROLES = new Set(["a", "b", "c"]);

function now() {
  return Date.now();
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function getRoom(roomId) {
  const cleanRoomId = String(roomId || "").trim().toUpperCase();

  if (!cleanRoomId) {
    return null;
  }

  if (rooms.has(cleanRoomId)) {
    return rooms.get(cleanRoomId);
  }

  const room = {
    roomId: cleanRoomId,
    participants: new Map(),
    clients: new Map(),
    messages: [],
    endedAt: null
  };

  rooms.set(cleanRoomId, room);
  return room;
}

function serializeRoom(room) {
  return {
    roomId: room.roomId,
    participants: [...room.participants.values()].sort((a, b) => String(a.role).localeCompare(String(b.role))),
    messages: room.messages,
    endedAt: room.endedAt || undefined
  };
}

function send(socket, message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

function broadcast(room, message) {
  for (const client of room.clients.values()) {
    send(client, message);
  }
}

function sanitizeText(value, maxLength = 5000) {
  return String(value || "").slice(0, maxLength);
}

function normalizeLanguage(value, fallback = "ko") {
  return LANGUAGES.has(value) ? value : fallback;
}

function sanitizeTranslations(value, sourceLanguage) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((translation) => ({
      language: normalizeLanguage(translation?.language, ""),
      text: sanitizeText(translation?.text)
    }))
    .filter((translation) => translation.language && translation.language !== sourceLanguage && translation.text);
}

function normalizeRole(value) {
  return ROLES.has(value) ? value : "a";
}

function defaultLanguageForRole(role) {
  return role === "c" ? "zh" : role === "b" ? "en" : "ko";
}

function parseMessage(raw) {
  try {
    return JSON.parse(raw.toString());
  } catch {
    return null;
  }
}

function handleJoin(socket, message) {
  const room = getRoom(message.roomId);

  if (!room || !message.participant?.id) {
    send(socket, { type: "error", payload: { message: "Invalid room join payload." } });
    return;
  }

  const timestamp = now();
  const existing = room.participants.get(message.participant.id);
  const participant = {
    id: sanitizeText(message.participant.id, 120),
    role: normalizeRole(message.participant.role),
    name: sanitizeText(message.participant.name || "Participant", 80),
    language: normalizeLanguage(message.participant.language, defaultLanguageForRole(normalizeRole(message.participant.role))),
    connected: true,
    micOn: Boolean(message.participant.micOn),
    joinedAt: existing?.joinedAt || timestamp,
    updatedAt: timestamp
  };

  socket.roomId = room.roomId;
  socket.participantId = participant.id;
  room.clients.set(socket.socketId, socket);
  room.participants.set(participant.id, participant);

  send(socket, { type: "room-state", payload: serializeRoom(room) });
  broadcast(room, { type: "participant-updated", payload: participant });
}

function updateParticipant(roomId, participantId, updater) {
  const room = rooms.get(String(roomId || "").toUpperCase());
  const participant = room?.participants.get(participantId);

  if (!room || !participant) {
    return;
  }

  const updated = {
    ...participant,
    ...updater(participant),
    updatedAt: now()
  };

  room.participants.set(updated.id, updated);
  broadcast(room, { type: "participant-updated", payload: updated });
}

function handleCaption(message) {
  const payload = message.payload || {};
  const room = rooms.get(String(payload.roomId || "").toUpperCase());

  if (!room || room.endedAt) {
    return;
  }

  const caption = {
    ...payload,
    id: payload.id || createId("msg"),
    roomId: room.roomId,
    speakerId: sanitizeText(payload.speakerId, 120),
    speakerRole: normalizeRole(payload.speakerRole),
    speakerName: sanitizeText(payload.speakerName || "Participant", 80),
    sourceLanguage: normalizeLanguage(payload.sourceLanguage),
    targetLanguage: normalizeLanguage(payload.targetLanguage, "en"),
    originalText: sanitizeText(payload.originalText),
    translatedText: sanitizeText(payload.translatedText),
    translations: sanitizeTranslations(payload.translations, normalizeLanguage(payload.sourceLanguage)),
    partial: Boolean(payload.partial),
    createdAt: payload.createdAt || now()
  };

  if (!caption.partial) {
    room.messages = [...room.messages, caption].slice(-200);
  }

  broadcast(room, { type: "caption", payload: caption });
}

function handleEndRoom(message) {
  const room = rooms.get(String(message.roomId || "").toUpperCase());

  if (!room || room.endedAt) {
    return;
  }

  room.endedAt = now();
  broadcast(room, {
    type: "room-ended",
    payload: { roomId: room.roomId, endedAt: room.endedAt }
  });
}

function handleSocketMessage(socket, raw) {
  const message = parseMessage(raw);

  if (!message) {
    send(socket, { type: "error", payload: { message: "Invalid socket message." } });
    return;
  }

  if (message.type === "join") {
    handleJoin(socket, message);
    return;
  }

  if (message.type === "language-update") {
    updateParticipant(message.roomId, message.participantId, () => ({
      language: normalizeLanguage(message.language)
    }));
    return;
  }

  if (message.type === "mic-state") {
    updateParticipant(message.roomId, message.participantId, () => ({
      micOn: Boolean(message.micOn)
    }));
    return;
  }

  if (message.type === "caption") {
    handleCaption(message);
    return;
  }

  if (message.type === "end-room") {
    handleEndRoom(message);
    return;
  }

  send(socket, { type: "error", payload: { message: "Unsupported socket message." } });
}

function handleSocketClose(socket) {
  if (!socket.roomId || !socket.participantId) {
    return;
  }

  const room = rooms.get(socket.roomId);
  const participant = room?.participants.get(socket.participantId);

  if (!room || !participant) {
    return;
  }

  room.clients.delete(socket.socketId);

  const hasSameParticipantOpen = [...room.clients.values()].some(
    (client) => client.participantId === socket.participantId
  );

  if (!hasSameParticipantOpen) {
    const updated = {
      ...participant,
      connected: false,
      micOn: false,
      updatedAt: now()
    };
    room.participants.set(updated.id, updated);
    broadcast(room, { type: "participant-updated", payload: updated });
  }

  if (!room.clients.size && room.endedAt) {
    rooms.delete(room.roomId);
  }
}

function setupRealtimeInterpreterServer(server) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (socket) => {
    socket.socketId = createId("ws");
    socket.on("message", (raw) => handleSocketMessage(socket, raw));
    socket.on("close", () => handleSocketClose(socket));
    socket.on("error", () => handleSocketClose(socket));
  });

  server.on("upgrade", (request, socket, head) => {
    const pathname = parse(request.url || "").pathname;

    if (pathname !== "/ws/interpreter") {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (webSocket) => {
      wss.emit("connection", webSocket, request);
    });
  });
}

module.exports = {
  setupRealtimeInterpreterServer
};
