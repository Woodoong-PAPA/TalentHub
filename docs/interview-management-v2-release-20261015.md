# 면접 일정 관리 v2 — 2026-10-15 운영 반영

## 반영 결과

- 운영 화면: https://talentpool-dx.com/interview-management
- 최종 배포: `dpl_4aLhDVPfXPnYJZSNBtxUddLGkDNz`.
- 최초 비교 기준 운영 배포: `dpl_AvcZ1TwhrXZU7c4cdnVaCgKEnSbg`.
- 사용자가 외부 발송·운영 배포를 명시적으로 승인한 뒤 실행했다.
- 신규 인증/DB는 사용자가 테스트용으로 확인한 기존 연결 프로젝트 `pefsetlczrrlvlehealp`를 사용한다. 이 배포를 별도 운영 DB로 이전했다고 간주하지 않는다.

## 사용자 요청 변경

### 초기 비밀번호 직접 설정

사용자 관리의 계정 생성 및 비밀번호 초기화에 초기 비밀번호/확인 입력을 추가했다. 서버는 영문과 숫자를 포함한 12~128자를 검증하고 Supabase Auth 관리 API에 전달한다. 신규 사용자 테이블·감사 로그·API 응답에는 비밀번호를 기록하지 않는다. 계정 생성 실패 시 새 Auth 계정만 정리하는 보상 동작을 유지한다.

### 조율 시작 방식

- 즉시 시작: 날짜 입력을 숨기고 DB 서버 시각으로 시작한다.
- 예약: 예약 날짜·시간만 입력받으며 미래 시각을 서버와 DB에서 검증한다.
- 조율 종료 입력은 생성·수정·재조율에서 제거했다. 기존 종료 열은 이력 호환을 위해 보존하되 신규 방식에서는 NULL로 저장한다.
- 모든 면접관의 유한한 가능 시간 범위에서 교집합을 계산한다. 임의의 종료 날짜를 새로 부여하지 않는다.
- 예약 시작 전에는 DB가 가능 시간 입력·제안 등 조율 변경을 차단한다. 승인된 요청 메일도 시작 시각 이후에만 발송한다.
- 공통 시간 결과는 기존과 같이 최대 200개이며, 수백 년의 가능 시간을 입력해도 전체 15분 단위 후보를 먼저 생성하지 않도록 범위별 생성량을 제한했다.

## 적용 SQL

- `20261015090000_interview_management_start_modes.sql`: 종료 선택화, 시작 방식, 조율/RLS 경계, 이메일 dispatch 시각.
- `20261015110000_interview_management_mail_acceptance.sql`: 첫 발송 시도 식별. 재시도의 HTTP 응답 시각을 최초 발송 시각으로 오인하지 않는다.
- `20261015120000_interview_management_slot_limit.sql`: 종료 없는 조율의 후보 생성량 제한.

기존 TalentHub 테이블은 변경하지 않았다. 위 마이그레이션은 테스트 프로젝트에 적용하고 이력을 등록했다.

## 외부 이메일

- 기존 Today’s Talent의 운영 `RESEND_API_KEY`와 `RESEND_FROM`을 재사용한다. 해당 키를 내려받거나 채팅에 노출하지 않았다.
- v2 전용 키/발신 주소가 설정되어 있으면 해당 값이 우선한다. 기존 키만으로 v2 발송이 활성화되지는 않으며, 전용 활성 플래그와 수신 허용 목록이 필요하다.
- 현재 외부 수신 허용 목록은 사용자가 지정한 **지정한 테스트 수신 주소 한 주소**다. 다른 수신자는 발송하지 않는다. 실제 사용자에게 확대할 때 이 목록을 별도로 변경해야 한다.
- 합성 면접 예약 후 검증용 채용담당자 확인 초안을 추가로 생성했다. 담당 대체 채용담당자의 실제 JWT로 테스트 안내 문구를 수정·승인하고 외부 발송했다. 자동 생성되는 일반 확인 초안의 기본 수신자는 지원자·면접관·HRBP이며, 이번 채용담당자용 초안은 발송 검증을 위한 추가 초안이다.
- Resend 접수 1건, 이벤트 `SENT`, 시도 1회, Reply-To `지정한 테스트 수신 주소`을 확인했다. 처음에는 조회 시각이 비어 있었으나 후속 처리에서 공급자 `created_at`을 조회해 저장했다. 반복 워커 실행에서도 추가 발송이 없었다.
- 수신함 도착·스팸함 분류·배달 완료는 확인하지 않았다.
- 공급자 조회가 잠시 실패해도 최초 성공 응답의 공급자 시각을 사용할 수 있게 보완했다. 재전송 응답의 현재 시각은 리마인드 기준으로 사용하지 않는다. 시각이 확인되지 않은 이벤트의 리마인드는 보류한다.

## 자동 처리

Vercel Hobby의 주기 제한에 맞춰 Supabase Cron/pg_net을 이용한다. [Supabase 공식 예약 호출 방식](https://supabase.com/docs/guides/functions/schedule-functions)을 따른다.

- 운영 SQL: `supabase/operations/interview-management-mail-cron.sql`.
- 작업명: `interview_mgmt_approved_mail_every_5m`, 주기 `*/5 * * * *`.
- 대상: `/api/interview-management/mail/cron`에 인증된 POST.
- 비밀 값은 Supabase Vault와 Vercel의 전용 환경 변수에 저장했다. cron 명령 자체에는 키를 넣지 않았다. 로컬 `.env`에도 동일한 전용 비밀 값을 저장했으며 Git 제외 상태다.
- 작업 활성 상태, 실제 정기 실행 성공 이력, HTTP 200과 `enabled:true` 응답을 확인했다.
- 일반 `anon`/`authenticated` 사용자는 DB 실행 함수를 호출할 수 없다.
- 초안 승인을 우회하지 않는다. 24시간/최대 2회 리마인드도 초안 생성 후 개별 승인이 필요하다.
- GitHub의 선택적 메일 워크플로는 활성화하지 않았다. 중복 스케줄러가 필요하지 않다.

작업 중지:

```sql
select cron.unschedule('interview_mgmt_approved_mail_every_5m');
```

## 배포 범위와 재현

작업 폴더에 다른 기능의 미완료 변경이 있어 그대로 전체 배포하지 않았다. Vercel에서 기존 운영 소스를 읽어 SHA-1을 확인한 뒤, 격리된 Git 제외 배포 폴더에 신규 기능과 공통 파일의 필요한 변경만 반영했다. 기존 `talent-pool.js`, `styles.css`, `profile-report.html`은 운영 배포 전후 원본 해시가 일치한다. 기존 Interview 구현은 신규 기능에서 호출하지 않는다.

전용 `INTERVIEW_MGMT_SUPABASE_URL`, `INTERVIEW_MGMT_SUPABASE_ANON_KEY`, `INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY`를 운영에 설정하여 기존 기능의 공통 인증 설정을 덮어쓰지 않았다. 공개 runtime config에는 URL/anon key만 추가한다.

`cleanUrls`를 사용하는 현재 배포에서는 별도의 `.html` rewrite 없이 정적 filesystem 경로를 사용해야 한다. 중복 rewrite로 발생한 신규 화면 404를 제거한 뒤 운영 브라우저 검증을 완료했다.

관련 도구:

- `scripts/prepare-interview-management-release.js`: 지정한 배포의 원본과 신규 기능만 합친 릴리스 폴더 생성.
- `scripts/configure-interview-management-deployment.js`: 신규 기능 전용 운영 변수 설정.
- `scripts/configure-interview-management-cron.js`: Vault/운영 변수의 동일한 작업 비밀 값 준비. 임시 SQL 파일은 처리 직후 삭제한다.
- `scripts/verify-interview-management-live-login.js`: 실제 인증/화면 검증.
- `scripts/verify-interview-management-live-workflows.js`: 최초 실제 합성 계정/역할/예약 검증. 계정은 1회 발급용이며 동일 실제 이메일로 반복 생성하지 않는다. 메일 검증은 수신자용 초안이 필요하다.
- `scripts/verify-interview-management-live-mail.js`: 이미 준비한 초안의 승인/실제 발송/중복 방지 확인.

이 배포는 Vercel CLI로 수행했다. GitHub main을 직접 수정하거나 다른 기능의 작업을 커밋하지 않았다. **후속 GitHub 기반 배포 전에는 v2 소스와 필요한 공통 변경을 저장소에 반영해야 한다.** 로컬 파일을 검토 없이 전체 업로드하는 방식으로 대체하지 않는다.

## 검증

- 실제 Supabase Auth: 지정한 초기 비밀번호로 계정 생성·로그인, 초기화 후 새 비밀번호 로그인.
- 실제 네 역할 API: 역할별 계정/승인함 접근 차단, HRBP 대리 입력, 면접관 직접 입력, 공통 시간 제안, 지원자 즉시 예약, 후보자 내부 정보 제거, 캘린더.
- 실제 예약 시작 전 입력 차단 및 종료 없는 생성 확인.
- 운영 브라우저: 채용담당자 1440px/390px 로그인, 사용자 관리 비밀번호 필드, 즉시/예약 입력 전환, 종료 입력 제거, 새로고침, 로그아웃, JS 오류·가로 넘침 없음.
- 기존 브라우저 회귀: PC/모바일 기존 로그인·메뉴·Interview·후보자 등록/사진/상세 수정/AI 검색 통과.
- 기존 테스트: 트렌딩 18개, 프로필 3개, 기존 면접 21개 통과.
- 신규 핵심/API 15개, 메일 처리 10개, 신규 시작 방식/네이티브 DB 7개 통과. 조율·메일 DB 회귀도 새 마이그레이션과 함께 검증했다.
- 코드 문법 검사, 기존 전체 문법 검사, 정적 빌드, whitespace 검사 통과.

합성 테스트 계정/면접은 신규 영역에만 생성했다. 실제 지원자 자료는 추가하지 않았다. 테스트 메일은 실제 채용 안내가 아님을 본문에 표시했다.
