# 면접 일정 관리 v2 — Phase 1 구현 및 검증

후속 상태(2026-10-13): [Phase 2](interview-management-v2-phase2.md)에서 사용자 확인을 받은 테스트 Supabase에 신규 migration 두 개를 적용했다. 계정 발급용 서버 키와 최초 계정 설정은 사용자 요청으로 후속 작업에 남아 있다. 아래의 미적용 상태는 Phase 1 완료 시점의 기록이다.

작업일: 2026-10-12. 브랜치: `feature/interview-management-v2`.

## 구현 범위

- 기존 sidebar에 `/interview-management` 링크를 추가했다. 기존 Interview 및 기존 메뉴·권한·라우팅 코드는 보존했다.
- Supabase Auth의 별도 세션 저장 키로 로그인/로그아웃 및 본인 비밀번호 변경을 제공한다. 로그인 아이디는 이메일이다. 기존 `admin@samsung.com` 로컬 계정은 신규 권한을 자동으로 얻지 않는다.
- 채용담당자는 계정 생성, 무작위 초기 비밀번호 발급/초기화, 권한/활성 상태 관리, 부서 추가, HRBP 부서 접근 허용/해제, 유형별 기본 소요 시간 설정을 할 수 있다. 초기 비밀번호는 Auth에 전달하고 응답 화면에서 한 번 표시하며 앱 테이블/로그에 저장하지 않는다. 프로필 저장 실패 시 신규 Auth 계정을 삭제하여 보상한다.
- 채용담당자는 면접 생성·검색·상태 필터·상세·수정·취소를 할 수 있다. 생성에는 지원자/포지션/유형/시간/필수 면접관/부서/HRBP/주 담당자/대체 담당자/진행 방식/조율 기간이 포함된다. 날짜 입력/표시는 한국시간 기준이다.
- 면접관 수와 중복, 사용자 활성 상태/역할, HRBP 부서 권한, 조율 기간 및 담당자 중복을 서버와 DB에서 검증한다. 수정은 조율 중 면접에 한정하며 확정 일정 재조율은 Phase 2에서 추가한다.
- HRBP는 허용 부서의 면접만, 면접관은 배정 면접만, 지원자는 본인 면접의 공개 필드만 조회한다. 지원자는 내부 테이블의 직접 SELECT 및 개인정보가 포함된 RPC 응답에 접근할 수 없다.
- 배정된 사용자의 역할/상태 변경과 배정 HRBP 부서 권한 해제를 차단한다. 변경 시 DB 트랜잭션으로 참가자 및 감사 이력을 함께 갱신한다.
- Phase 2/3 엔터티도 별도 신규 스키마로 준비했다. 아직 사용하지 않는 테이블은 RLS 정책 없이 접근을 차단했다. 예약 참가자 리소스에 반개방 시간 범위의 exclusion constraint를 마련했다.

## 파일

신규 화면: `interview-management.html`, `interview-management.css`, `interview-management.js`.

신규 API: `api/interview-management/index.js`. 공통 검증: `lib/interview-management-core.js`.

DB: `supabase/migrations/20261012090000_interview_management_v2.sql`.

기존 수정: `index.html`, `server.js`, `api/router.js`, `scripts/build-runtime-config.js`, `vercel.json`. 기존 dirty 파일의 다른 변경은 보존했다. `talent-pool.js`, 기존 면접 구현, 기존 migration은 이번 작업에서 수정하지 않았다.

## 신규 환경 준비

운영 DB에는 적용하지 않았다. 먼저 별도 테스트 Supabase 환경에서 다음을 수행해야 실제 인증/저장을 사용할 수 있다.

1. 테스트 프로젝트에 신규 migration만 적용한다. 기존 schema 재생성이나 전체 DB reset은 사용하지 않는다.
2. 서버 환경에 `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`를 설정한다. 브라우저 runtime config에는 URL/anon key만 전달된다. 서비스 키는 서버 계정 관리 API에서만 사용한다.
3. Supabase Auth의 비밀번호 최소 길이를 12자 이상으로 설정하고 공개 가입을 비활성화한다. 생성되는 초기 비밀번호는 12자보다 길고 무작위로 발급된다.
4. Auth에서 테스트 채용담당자 계정을 생성한다. 이메일 초대나 외부 이메일 발송은 사용하지 않는다. 최초 1명에 한해 DB 관리자 권한으로 아래 프로필을 등록한다. `AUTH_USER_UUID`는 방금 생성한 테스트 사용자 UUID로 대체한다.

```sql
insert into public.interview_mgmt_users(id,email,name,role)
select id,email,'테스트 채용담당자','RECRUITER'
from auth.users where id='AUTH_USER_UUID'::uuid;
```

5. `node server.js 5177`로 실행하고 `/interview-management`에서 로그인한다. 신규 영역에서 테스트 지원자/면접관/HRBP 계정을 생성하고 부서 및 HRBP 접근 권한을 등록한 다음 면접을 생성한다. 운영 지원자 개인정보를 입력하지 않는다.

Supabase 설정이 없거나 신규 프로필이 없으면 인증/저장을 우회하지 않는다. 실제 운영/테스트 Supabase에는 계정 생성이나 SQL 실행을 수행하지 않았다.

## 검증 결과

- Phase 0 기준선 및 Phase 1 변경 후 `npm run check`: 통과.
- 기존 테스트: trending 9개, profile-report 3개, 기존 면접 일정 21개 통과.
- `node --test scripts/test-interview-management.js scripts/test-interview-management-db.js`: 20개 통과. 서버 인증·권한·입력·지원자 응답·계정 생성/실패 보상·요청 크기를 확인했다. DB migration, 실제 RLS, 직접 테이블 접근 차단, 역할별 면접 범위, 참가자 조건, 관리 권한, 수정/취소 및 예약 기간 제약을 확인했다.
- DB 테스트는 [PGlite](https://pglite.dev/extensions/)의 격리된 PostgreSQL 엔진에서 실행했다. Auth 스키마/`auth.uid()`는 테스트용으로 구성했으며 운영 Supabase에 연결하지 않았다.
- `node scripts/verify-interview-management-ui.js`: 네 역할 × 1440/390px의 8개 시나리오 및 설정 미완료 시 접근 차단 통과. 생성·수정·취소·검색·계정 발급·부서 추가·비밀번호 변경·지원자 내부 정보 비노출·가로 overflow를 검증했다. UI 테스트의 Auth/API는 합성 데이터 모의 응답이다.
- `node scripts/verify-talenthub-regression.js`: 기존 로그인 차단/기본 관리자 로그인, 기존 메뉴(Interview 포함), 후보자 등록/사진 미리보기/학력·경력 저장, 목록→상세→수정 및 AI 검색을 데스크톱/모바일에서 확인했다. 외부 API는 차단하고 기존 앱 로컬 저장/화면 흐름을 실행했다.
- `node scripts/verify-trending-session.js`: 기존 트렌딩 최신 리포트 및 로그인 세션 회귀 통과.
- `PROFILE_REPORT_TEST_URL=http://127.0.0.1:5186`으로 `node scripts/verify-profile-report-ui.js`: 기존 프로필 보고서 데스크톱/모바일 생성·다운로드 흐름 통과.
- `npm run build`: 통과. 신규 정적 파일 포함, 로컬 API 미인증 401, 신규 코드에서 기존 일정 모듈 참조 없음, 수정 파일 whitespace 검사 통과.
- 화면 캡처는 `.codex-artifacts/interview-management/`에 저장하고 데스크톱/모바일 레이아웃을 시각 확인했다.

DB 테스트 런타임 재설치 (앱 의존성 변경 없음):

```powershell
npm install --prefix .codex-artifacts/interview-mgmt-test --no-save --package-lock=false @electric-sql/pglite
node --test scripts/test-interview-management.js scripts/test-interview-management-db.js
node server.js 5186
# 다른 터미널에서
node scripts/verify-interview-management-ui.js
node scripts/verify-talenthub-regression.js
```

## 남은 단계 및 검증 한계

- Phase 2: 실제 가능 시간·교집합·후보 시간·원자적 예약 선택·역제안·예약 유지 재조율·캘린더.
- Phase 3: 버전 초안·담당자/대체 담당자 승인·일괄 승인·발송 실패/중복/재시도·실제 발송 시점 기반 리마인드. 이메일·캘린더의 지원자 개인정보 검증은 해당 출력 구현 후 수행한다.
- Phase 4: 실제 테스트 Supabase Auth/PostgREST 연결, 다중 DB 연결의 동시 예약 테스트, 이메일 출력 개인정보 검증, 배포 전 종합 검증. PGlite의 단일 연결 제약 테스트는 동시 예약 테스트를 대체하지 않는다.
- 기존 회원 승인/정지/초기화의 모든 조합과 외부 통역 연결은 이번 브라우저 회귀 범위에 포함하지 않았다. 해당 기존 코드는 수정하지 않았다.
- 실제 외부 이메일 발송, 운영 SQL 적용, GitHub push 및 운영 배포는 수행하지 않았다. 운영 배포 승인 요청도 하지 않았다.

인증 공식 근거: [Supabase Auth](https://supabase.com/docs/guides/auth), [계정 생성](https://supabase.com/docs/reference/javascript/auth-admin-createuser), [본인 비밀번호 변경](https://supabase.com/docs/reference/javascript/auth-updateuser), [DB RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
