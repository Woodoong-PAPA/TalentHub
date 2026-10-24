# 면접 일정 관리 v2 — Phase 3 이메일 자동화

완료일: 2026-10-13. 브랜치: `feature/interview-management-v2`.

## 구현 결과

- 면접 생성 시 배정 면접관의 가능 시간 요청, 직접 입력 요청, 지원자 후보 시간 제안, 예약 확정 및 취소에서 이메일 초안을 자동 생성한다. 생성은 해당 업무 DB 트랜잭션에 포함되며 실제 발송은 하지 않는다.
- 예약 확정은 이전과 동일하게 즉시 이루어진다. 지원자·배정 면접관·HRBP의 확정 안내 이메일은 별도 승인 대기 상태가 된다.
- 주 담당 채용담당자와 지정된 대체 담당자만 해당 면접의 승인함을 조회·수정·승인한다. HRBP와 면접관, 지원자, 다른 채용담당자는 승인할 수 없다.
- 승인함에서 본문 미리보기, 추가 안내문 수정, 최대 50개 다중 선택 및 원자적 일괄 승인을 제공한다. 한 초안의 권한·버전 검증이 실패하면 전체 승인을 롤백한다.
- 일정 버전과 본문 버전을 구분한다. 추가 안내를 수정하면 본문 버전이 증가하고 다시 승인해야 한다. 일정의 기본 내용은 자동 생성하며 편집 대상은 추가 안내문이다.
- 일정 변경·가능 시간 변경·취소·지원자 응답 등으로 무효화된 초안은 승인/발송 검증에서 제외한다. 이미 실제 전송된 이메일은 취소할 수 없으며 이력으로 남긴다.
- 발신은 별도 시스템 주소(기본 `onboarding@resend.dev`), Reply-To는 주 담당 채용담당자 이메일이다. 수신자는 이메일당 1명이며 CC/BCC나 참가자 목록, ICS 첨부를 생성하지 않는다.
- 지원자 이메일의 기본 제목/본문에는 면접관 실명·이메일·내부 조직을 넣지 않는다. 추가 안내문은 배정 면접관의 이름/이메일 및 내부 부서 이름의 직접 포함을 DB에서 검사한다. 자유 문장의 모든 간접 식별 정보까지 탐지하는 DLP는 아니므로 승인자가 본문을 검토해야 한다.
- 발송은 별도 서버 작업으로만 수행한다. 기본적으로 비활성 상태이고, 전용 활성화 설정·키·테스트 수신 허용 목록이 필요하다. 기존 TalentHub 이메일 설정은 신규 기능을 활성화하지 않는다.

## 중복·실패·리마인드

- 승인된 본문 버전에 고유 발송 이벤트/중복 방지 키를 생성한다. 워커는 DB 행 잠금과 5분 임대로 이벤트를 점유하고, 외부 요청 직전에 초안 및 승인 유효성을 다시 검사한다.
- 실제 요청에 사용한 발신/수신/Reply-To/본문을 이벤트에 고정한다. 네트워크 오류·서버 ACK 실패 이후에도 같은 키와 같은 요청 본문으로 재시도한다. 실제 발송을 시도한 본문은 추가 수정할 수 없다.
- 실패는 5분 간격으로 최대 5회 처리한다. 최초 시도 후 23시간을 넘긴 불확실한 이벤트는 자동 재발송하지 않고 `UNCERTAIN` 상태로 운영자 확인을 요구한다. 이는 [Resend의 24시간 중복 방지 기간](https://resend.com/docs/dashboard/emails/idempotency-keys) 내에서만 자동 재시도하기 위한 보수적 범위이다.
- 일정 트랜잭션과 외부 이메일 API를 하나의 원자적 트랜잭션으로 묶지는 않는다. 외부 요청 직전 최종 검사 이후 이미 전송을 시작한 요청은 일정 변경으로 회수할 수 없다. 신규 변경 안내는 새 버전에서 별도로 생성한다.
- 실제 전송 시각은 [Resend 이메일 조회](https://resend.com/docs/api-reference/emails/retrieve-email)의 `created_at`을 사용한다. 수신함 배달 완료 시각이 아니라 발송 서비스의 전송 접수 시각이다. 조회에 실패하면 `sent_at`을 비워두고 메타데이터를 재조회한다. 확인 전에는 리마인드를 생성하지 않는다.
- 미응답은 실제 전송 접수 후 24시간부터 리마인드 초안을 생성한다. 리마인드도 반드시 별도 승인을 거치며, 2회차는 1회차의 실제 전송 시각을 기준으로 한다. 최대 2회이다.
- 지원자의 역제안도 응답으로 취급하여 미응답 리마인드를 중단한다. 역제안 검토가 반려되어도 해당 제안 버전은 미응답으로 되돌리지 않으며 새 후보 시간 제안에는 새 버전을 사용한다. HRBP 대리 입력 및 면접관 시간 입력도 가능 시간 요청의 응답으로 처리한다.
- 워커는 한 실행에 최대 5개 이벤트를 처리하고 실행 시간 예산을 둔다. 실패 상세는 상태 코드 수준으로 저장하며 외부 응답 본문·키·개인정보를 오류 로그에 넣지 않는다.

## 파일 및 DB

- `lib/interview-management-mail.js`: Resend 어댑터, 발송 활성화/허용 목록 검사, 임대 점유, 재시도 및 전송 시각 재조회.
- `api/interview-management/index.js`: `/mail/inbox`, `/mail/edit`, `/mail/approve`, `/mail/process`, `/mail/cron` 경로.
- `interview-management.js`, `interview-management.css`: 승인함·상태·초안 수정·일괄 승인 및 대시보드 이메일 처리 현황.
- `.env.example`: 신규 기능 전용 설정. 실제 `.env`의 발송 설정은 활성화하지 않았다.
- `.github/workflows/interview-management-mail.yml`: 5분 주기의 독립 워커 호출. URL/전용 cron secret이 없으면 호출하지 않는다. GitHub에 push하지 않았고 활성화하지 않았다.
- 신규 migration `20261013090000_interview_management_v2_mail.sql`: 초안/본문 버전, 승인/발송 이벤트, 발송 요청 스냅샷·임대·재시도 상태, 자동 생성 트리거, 소유자 제한 및 서비스 전용 워커 함수.
- 후속 migration `20261013100000_interview_management_mail_response.sql`, `20261013103000_interview_management_mail_response_history.sql`: 역제안을 응답으로 취급하는 발송/리마인드 유효성. 이미 적용한 migration을 다시 실행하지 않고 별도 파일로 변경을 기록했다.

현재 연결된 프로젝트가 테스트용이라는 기존 사용자 확인에 따라 위 신규 migration만 적용하고 이력을 등록했다. 기존 TalentHub 테이블/Interview 기능/기존 일정 자동화 API/기존 cron 설정은 수정하지 않았다. 테스트 DB에는 신규 계정이나 실제 개인정보를 추가하지 않았다.

## 검증 결과

- Phase 3 DB 검증 11개와 발송 처리/API 권한 검증 7개, 총 18개 통과.
- 자동 초안, 담당자/대체 담당자 및 다른 역할 차단, 일괄 승인 롤백, 수정 버전/승인 초기화, 발송 임대와 재시도 스냅샷, 실제 전송 시각 기준 2회 리마인드, 응답 시 중단, 지원자 본문 식별 정보 검사, 예약 즉시 확정 및 이메일 승인 대기, 불확실 이벤트 차단을 검증했다.
- Resend 요청은 모의 HTTP/어댑터를 사용했다. 실제 외부 메일 요청은 수행하지 않았다.
- 승인함 브라우저 검증: 네 역할 × 1440/390px의 8개 시나리오 통과. 미리보기·수정·일괄 승인, 무효 초안 제외, 발송 비활성 안내, 권한별 메뉴/API 접근 및 가로 overflow를 확인했다.
- 기존 Phase 1·2 브라우저 시나리오 통과. 이메일 트리거를 포함한 네이티브 PostgreSQL의 기존 동시 예약 회귀 12개 통과. 기존 API/핵심 및 Phase 1 DB 검증도 통과했다.
- 기존 테스트 33개 및 후보자 등록/사진/상세 수정/AI 검색/기존 메뉴, 트렌딩 세션, 프로필 보고서 데스크톱/모바일 회귀 통과.
- `npm run check`, 신규 파일 문법 검사, `npm run build`, whitespace 검사 통과. `.codex-artifacts/interview-management-phase3/`의 승인함 캡처를 시각 확인했다.
- 로컬 신규 메일 API의 미인증 401, 테스트 Supabase의 익명 워커 RPC 권한 차단, 실제 `.env`의 신규 발송 비활성 상태를 확인했다. 로컬 서버는 5186에서 최신 코드로 재시작했다.

재실행:

```powershell
node --test scripts/test-interview-management-mail.js scripts/test-interview-management-mail-db.js
node scripts/verify-interview-management-mail-ui.js
```

## 후속 준비

실제 계정 생성은 사용자 요청에 따라 여전히 후속 작업이다. 신규 Auth 계정과 `SUPABASE_SERVICE_ROLE_KEY`가 준비되지 않아 기존 계정으로 신규 메뉴에 로그인할 수 없다.

실제 발송 테스트는 별도의 명시적 승인 후 다음 설정이 필요하다. 키는 서버에만 저장한다.

```text
INTERVIEW_MGMT_MAIL_SEND_ENABLED=false
INTERVIEW_MGMT_RESEND_API_KEY=
INTERVIEW_MGMT_MAIL_FROM=onboarding@resend.dev
INTERVIEW_MGMT_MAIL_ALLOWED_RECIPIENTS=
INTERVIEW_MGMT_MAIL_CRON_SECRET=
```

발신 주소 및 테스트 수신 주소는 Resend 계정의 발송 제한에 맞춰 준비해야 한다. 명시적 발송 승인 전 `SEND_ENABLED`를 true로 변경하지 않는다. 자동 호출을 설치할 때는 GitHub Secrets의 `INTERVIEW_MGMT_BASE_URL`, `INTERVIEW_MGMT_MAIL_CRON_SECRET`을 사용한다. 현재는 설치/활성화하지 않았다.

Phase 4에는 실제 테스트 계정의 Auth/PostgREST 통합, 실제 테스트 이메일 전송(승인 필요), 서비스 워커의 다중 실행/중단 복구 검증, 배달 실패/반송 webhook 필요 여부, 불확실 이벤트의 운영자 확인 절차, 전체 배포 전 검증이 남아 있다. ICS 파일은 아직 생성하지 않으며 수신함 배달 완료/반송 상태를 구현했다고 주장하지 않는다.

GitHub push, 실제 외부 이메일 발송, 운영 배포는 수행하지 않았다.
