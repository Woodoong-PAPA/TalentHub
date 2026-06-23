# Gmail 기반 면접 스케줄링 운영 가이드

이 문서는 Talent Pool의 `면접 스케줄링` 메뉴에서 채용담당자 Gmail을 연결하고, 후보자 및 면접위원 회신을 Pub/Sub으로 근실시간 감지하는 운영 절차를 정리한다.

Google Calendar API, 캘린더 이벤트 생성, 캘린더 조회, ICS 파일 첨부는 사용하지 않는다.

## 필요한 Google API

- Gmail API
- Cloud Pub/Sub API

## OAuth Scope

OAuth 동의 화면에는 아래 Gmail scope만 추가한다.

```text
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/gmail.send
```

`https://mail.google.com/`, Calendar scope, Drive scope는 사용하지 않는다.

## 환경변수

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://talentpool-dx.com/api/interview-scheduling?action=oauth-callback
GMAIL_PUBSUB_TOPIC=projects/<PROJECT_ID>/topics/<TOPIC_NAME>
GMAIL_PUBSUB_SUBSCRIPTION=projects/<PROJECT_ID>/subscriptions/<SUBSCRIPTION_NAME>
GMAIL_PUBSUB_AUDIENCE=https://talentpool-dx.com/api/interview-scheduling-pubsub
TOKEN_ENCRYPTION_KEY=
SCHEDULING_MAIL_MODE=send
SCHEDULING_AUTO_SEND_ENABLED=true
SCHEDULING_AI_CONFIDENCE_THRESHOLD=0.90
SCHEDULING_LLM_PROVIDER=openai
SCHEDULING_LLM_MODEL=gpt-4.1-mini
SCHEDULING_EMAIL_RETENTION_DAYS=90
```

`TOKEN_ENCRYPTION_KEY`는 refresh token 암호화에 사용한다. 실제 secret은 저장소에 커밋하지 않는다.

## Google Cloud 설정

### 1. Gmail API 활성화

Google Cloud Console에서 현재 프로젝트를 선택하고 `API 및 서비스 > 라이브러리`에서 Gmail API를 활성화한다.

### 2. Cloud Pub/Sub API 활성화

같은 프로젝트에서 Cloud Pub/Sub API를 활성화한다.

### 3. Pub/Sub Topic 생성

예시:

```bash
gcloud pubsub topics create talentpool-gmail-watch
```

환경변수에는 전체 topic name을 넣는다.

```text
GMAIL_PUBSUB_TOPIC=projects/<PROJECT_ID>/topics/talentpool-gmail-watch
```

### 4. Gmail Push Service Account에 Publish 권한 부여

Gmail push notification은 아래 서비스 계정이 Pub/Sub topic에 publish할 수 있어야 한다.

```text
gmail-api-push@system.gserviceaccount.com
```

예시:

```bash
gcloud pubsub topics add-iam-policy-binding talentpool-gmail-watch \
  --member=serviceAccount:gmail-api-push@system.gserviceaccount.com \
  --role=roles/pubsub.publisher
```

### 5. Push Subscription 생성

Push endpoint:

```text
https://talentpool-dx.com/api/interview-scheduling-pubsub
```

OIDC 인증을 사용하는 것을 권장한다. Audience는 아래 값과 동일하게 맞춘다.

```text
GMAIL_PUBSUB_AUDIENCE=https://talentpool-dx.com/api/interview-scheduling-pubsub
```

예시:

```bash
gcloud pubsub subscriptions create talentpool-gmail-watch-push \
  --topic=talentpool-gmail-watch \
  --push-endpoint=https://talentpool-dx.com/api/interview-scheduling-pubsub \
  --push-auth-service-account=<PUSH_SERVICE_ACCOUNT>@<PROJECT_ID>.iam.gserviceaccount.com \
  --push-auth-token-audience=https://talentpool-dx.com/api/interview-scheduling-pubsub
```

환경변수:

```text
GMAIL_PUBSUB_SUBSCRIPTION=projects/<PROJECT_ID>/subscriptions/talentpool-gmail-watch-push
```

### 6. Gmail 연결

Talent Pool 웹앱에서 `면접 스케줄링 > Gmail 연결`을 눌러 채용담당자 Gmail 계정을 OAuth로 연결한다.

연결이 완료되면 `gmail_connections`에 refresh token이 암호화 저장된다.

### 7. Gmail Watch 등록

웹앱에서 `면접 스케줄링 > 지금 동기화`는 history 증분 동기화를 수행한다.

watch 등록/갱신은 아래 endpoint로 수행한다.

```text
POST /api/interview-scheduling?action=watch-renew
```

전체 연결 계정을 갱신하려면:

```json
{ "action": "watch-renew", "all": true }
```

Vercel Cron은 매일 아래 endpoint를 호출한다.

```text
/api/interview-scheduling-watch-cron
```

## 수신 처리 흐름

1. Gmail mailbox 변경 발생
2. Gmail이 Pub/Sub topic에 알림 publish
3. Pub/Sub push subscription이 `/api/interview-scheduling-pubsub` 호출
4. 서버가 Pub/Sub OIDC token을 검증
5. payload의 `emailAddress`, `historyId` 확인
6. `gmail_connections.history_id`부터 Gmail `history.list` 증분 조회
7. 신규 `messageId` 조회
8. Gmail message 본문 정규화
9. 조율번호, Gmail thread, 참여자 이메일 기준으로 조율 건 매칭
10. AI가 회신 의도와 가능 시간을 JSON으로 구조화
11. 서버 검증 통과 시 `app_settings.interview_scheduling_cases` payload 갱신
12. 수신 이력은 `scheduling_inbound_messages`에 저장

## 수동 동기화

Push 누락이나 테스트 상황에서는 화면의 `지금 동기화` 버튼을 누른다.

API:

```text
POST /api/interview-scheduling
```

```json
{
  "action": "sync",
  "userId": "member-admin",
  "gmailAddress": "admin@samsung.com"
}
```

회원 이메일과 연결 Gmail이 달라도 `userId` 기준으로 먼저 연결 정보를 찾고, 없으면 `gmailAddress` 기준으로 다시 찾는다.

## 테스트

```powershell
npm run check
npm run test:interview-scheduling
npm run build
```

## 운영 한계

- Calendar API를 사용하지 않으므로 Gmail 회신에 포함되지 않은 개인 일정을 알 수 없다.
- 확정 이후 일정 변경 또는 취소 요청은 자동 재조율하지 않고 수동 검토로 전환한다.
- Pub/Sub push endpoint의 OIDC 검증은 `GMAIL_PUBSUB_AUDIENCE`가 설정된 경우에 활성화된다.

## 근실시간 반영 보정 구조

운영 반영 경로는 3단계로 구성한다.

1. Pub/Sub push: Gmail 회신이 들어오면 `/api/interview-scheduling-pubsub`가 즉시 호출되어 신규 메일을 처리한다.
2. 화면 자동 동기화: 사용자가 `면접 스케줄링` 화면을 열고 있으면 60초마다 조용히 Gmail 증분 동기화를 수행한다.
3. 서버 보정 동기화: `.github/workflows/trending-daily.yml`의 5분 주기 workflow가 `/api/interview-scheduling-sync-cron`을 호출해 Push 누락분을 회수한다.

Pub/Sub 로그가 보이지 않는 경우에도 2번과 3번 경로로 회신이 반영된다. 단, GitHub Actions 보정 동기화는 workflow 변경사항이 GitHub 기본 브랜치에 push된 뒤부터 실행된다.
