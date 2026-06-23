# Talent Pool Realtime Interpreter

Talent Pool 본 앱은 `/`에서 그대로 동작하고, 통역 MVP는 독립 경로인 `/tools/interpreter`에서 실행됩니다.

## Local Development

```bash
npm install
npm run check
npm run build
npm run dev
```

로컬 확인 URL:

- Talent Pool: `http://127.0.0.1:5177/`
- Realtime Interpreter: `http://127.0.0.1:5177/tools/interpreter`

## Vercel Deployment

`talentpool-dx.com`이 연결된 Vercel 프로젝트에 아래 환경변수를 설정한 뒤 재배포합니다.

Required:

```env
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
APP_DATA_SOURCE=supabase
```

Alternative public aliases accepted by the build script:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Server-only optional values:

```env
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_INTERPRETER_TRANSLATION_MODEL=gpt-4.1-mini
OPENAI_REALTIME_TRANSLATION_MODEL=gpt-realtime-translate
OPENAI_REALTIME_TRANSCRIPTION_MODEL=gpt-realtime-whisper
```

Notes:

- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must never be exposed in browser code.
- `SUPABASE_ANON_KEY` is the public browser key used by Supabase Realtime.
- The interpreter UI connects to OpenAI Realtime through browser WebRTC after receiving an ephemeral token from `/api/realtime-token`.
- Manual `Send caption` auto-translation uses `/api/translate-caption` with `OPENAI_INTERPRETER_TRANSLATION_MODEL`, then `OPENAI_MODEL`, then `gpt-4.1-mini`.
- OpenAI Realtime translation uses `OPENAI_REALTIME_TRANSLATION_MODEL`, defaulting to `gpt-realtime-translate`; source transcript deltas use `OPENAI_REALTIME_TRANSCRIPTION_MODEL`, defaulting to `gpt-realtime-whisper`.
- Interpreter roles are spoken-language roles: A = Korean, B = English, C = Chinese. The separate interface-language dropdown only changes labels and menu text.
- In three-person rooms, each caption can carry multiple translations. For example, A's Korean utterance can include English for B and Chinese for C in the same broadcast payload.
- If OpenAI Realtime fails, the Supabase room, Presence, manual captions, and caption log remain usable.
- Vercel routes `/tools/interpreter` and `/interpreter` to `interpreter.html`.
- Vercel serves `/runtime-config.js` through `api/client-config.js` at request time, so Supabase browser config comes from Production runtime env vars instead of static build-time env vars.
- The first-screen room list uses `/api/interpreter-rooms` and the server-only `SUPABASE_SERVICE_ROLE_KEY` when `public.interpreter_rooms` exists. If the API or table is unavailable, the UI falls back to this browser's `localStorage` list.

## Supabase Room List Table

Create this table in the Supabase SQL editor to enable the shared first-screen room list:

```sql
create table if not exists public.interpreter_rooms (
  room_id text primary key,
  role text not null default 'a' check (role in ('a', 'b', 'c')),
  language text not null default 'ko' check (language in ('ko', 'en', 'zh')),
  status text not null default 'active' check (status in ('active', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ended_at timestamptz,
  deleted_at timestamptz
);

create index if not exists interpreter_rooms_updated_at_idx
  on public.interpreter_rooms (updated_at desc)
  where deleted_at is null;

alter table public.interpreter_rooms enable row level security;
```

The browser never receives `SUPABASE_SERVICE_ROLE_KEY`; reads, writes, and soft deletes go through `/api/interpreter-rooms`.

## Supabase Realtime E2E Checklist

Use two browser tabs or two phones.

1. Open `/tools/interpreter` in tab A.
2. Confirm no yellow Supabase environment warning is visible.
3. Click `Create room`.
4. Confirm status changes to `Supabase connected`.
5. Confirm participant A appears in Presence.
6. Copy the invite link or scan the QR code.
7. Open the invite link in tab B or another phone.
8. Confirm tab B enters as role B and shows `Supabase connected`.
9. Confirm both participants appear in both screens.
10. In tab A, enter original text and translated text, then click `Send caption`.
11. Confirm tab B shows the remote translated caption and log row.
12. In tab B, send a caption back and confirm tab A receives it.
13. Click `Start live translation` in tab A.
14. Confirm the browser microphone permission prompt appears.
15. Confirm `OpenAI connected` or a clear OpenAI warning appears.
16. If OpenAI fails, confirm manual `Send caption` still works.
17. Click `Check microphone permission` on a mobile browser.
18. Confirm the UI changes to `Mic mic ready` or `Mic mic blocked`.
19. Click `End room` and confirm the other screen shows the ended state.

## Verification Commands

```bash
npm run check
npm run build
npm run verify:interpreter
```

For local browser verification:

- Desktop: open two tabs at `http://127.0.0.1:5177/tools/interpreter`.
- Mobile on the same network: run the server on `0.0.0.0`, then open `http://<computer-lan-ip>:5177/tools/interpreter`.
