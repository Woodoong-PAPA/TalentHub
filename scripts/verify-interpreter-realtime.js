const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

function readEnvFile() {
  if (!fs.existsSync(".env")) {
    return {};
  }

  return fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .reduce((result, line) => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

      if (match) {
        result[match[1]] = match[2];
      }

      return result;
    }, {});
}

function waitForSubscribed(channel) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("subscribe timeout")), 12_000);

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);
        resolve();
        return;
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        clearTimeout(timeout);
        reject(new Error(status));
      }
    });
  });
}

function getPresenceIds(channel) {
  return Object.values(channel.presenceState())
    .flat()
    .map((item) => item.id);
}

function hasParticipants(channel, expectedIds) {
  const ids = getPresenceIds(channel);
  return expectedIds.every((id) => ids.includes(id));
}

function hasTranslation(payload, language, text) {
  return Array.isArray(payload.translations)
    && payload.translations.some((translation) => translation.language === language && translation.text === text);
}

async function main() {
  const fileEnv = readEnvFile();
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    fileEnv.SUPABASE_URL ||
    fileEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    fileEnv.SUPABASE_ANON_KEY ||
    fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase URL or anon key.");
  }

  if (!global.WebSocket) {
    global.WebSocket = require("ws");
  }

  const clientOptions = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  };
  const clientA = createClient(supabaseUrl, supabaseAnonKey, clientOptions);
  const clientB = createClient(supabaseUrl, supabaseAnonKey, clientOptions);
  const clientC = createClient(supabaseUrl, supabaseAnonKey, clientOptions);
  const roomId = `E2E${Date.now().toString(36).slice(-4)}`.toUpperCase();
  const topic = `interpreter:${roomId}`;
  const channelA = clientA.channel(topic, {
    config: { broadcast: { self: true, ack: true }, presence: { key: "node-a" } }
  });
  const channelB = clientB.channel(topic, {
    config: { broadcast: { self: true, ack: true }, presence: { key: "node-b" } }
  });
  const channelC = clientC.channel(topic, {
    config: { broadcast: { self: true, ack: true }, presence: { key: "node-c" } }
  });

  const expectedPresenceIds = ["node-a", "node-b", "node-c"];
  let resolvePresence;
  const presenceReady = new Promise((resolve, reject) => {
    resolvePresence = resolve;
    setTimeout(() => reject(new Error("presence timeout")), 15_000);
  });
  const checkPresence = () => {
    const allChannelsReady = [channelA, channelB, channelC].every((channel) =>
      hasParticipants(channel, expectedPresenceIds)
    );

    if (allChannelsReady) {
      resolvePresence();
    }
  };

  const receivedByB = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("B caption timeout")), 12_000);
    channelB.on("broadcast", { event: "caption" }, ({ payload }) => {
      if (
        payload.originalText === "안녕하세요" &&
        payload.translatedText === "Hello from A" &&
        hasTranslation(payload, "en", "Hello from A") &&
        hasTranslation(payload, "zh", "你好 from A")
      ) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });
  const receivedByC = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("C caption timeout")), 12_000);
    channelC.on("broadcast", { event: "caption" }, ({ payload }) => {
      if (
        payload.originalText === "안녕하세요" &&
        payload.translatedText === "Hello from A" &&
        hasTranslation(payload, "en", "Hello from A") &&
        hasTranslation(payload, "zh", "你好 from A")
      ) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });
  const receivedByA = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("A caption timeout")), 12_000);
    channelA.on("broadcast", { event: "caption" }, ({ payload }) => {
      if (
        payload.originalText === "Nice to meet you" &&
        payload.translatedText === "만나서 반갑습니다" &&
        hasTranslation(payload, "ko", "만나서 반갑습니다")
      ) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });

  channelA.on("presence", { event: "sync" }, checkPresence);
  channelB.on("presence", { event: "sync" }, checkPresence);
  channelC.on("presence", { event: "sync" }, checkPresence);

  await Promise.all([waitForSubscribed(channelA), waitForSubscribed(channelB), waitForSubscribed(channelC)]);
  await channelA.track({ id: "node-a", role: "a", language: "ko", connected: true, micReady: false });
  await channelB.track({ id: "node-b", role: "b", language: "en", connected: true, micReady: false });
  await channelC.track({ id: "node-c", role: "c", language: "zh", connected: true, micReady: false });
  await presenceReady;

  await channelA.send({
    type: "broadcast",
    event: "caption",
    payload: {
      id: "cap-a",
      roomId,
      speakerId: "node-a",
      speakerRole: "a",
      speakerName: "Participant A",
      sourceLanguage: "ko",
      targetLanguage: "en",
      originalText: "안녕하세요",
      translatedText: "Hello from A",
      translations: [
        { language: "en", text: "Hello from A" },
        { language: "zh", text: "你好 from A" }
      ],
      partial: false,
      createdAt: Date.now()
    }
  });
  await Promise.all([receivedByB, receivedByC]);

  await channelB.send({
    type: "broadcast",
    event: "caption",
    payload: {
      id: "cap-b",
      roomId,
      speakerId: "node-b",
      speakerRole: "b",
      speakerName: "Participant B",
      sourceLanguage: "en",
      targetLanguage: "ko",
      originalText: "Nice to meet you",
      translatedText: "만나서 반갑습니다",
      translations: [{ language: "ko", text: "만나서 반갑습니다" }],
      partial: false,
      createdAt: Date.now()
    }
  });
  await receivedByA;

  await Promise.all([clientA.removeAllChannels(), clientB.removeAllChannels(), clientC.removeAllChannels()]);
  console.log(
    JSON.stringify({
      ok: true,
      roomId,
      presence: true,
      captionsBothDirections: true,
      multiTargetCaptions: true
    })
  );
}

main().catch(async (error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }));
  process.exitCode = 1;
});
