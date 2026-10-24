# 면접 일정 관리 v2 — Phase 0

분석일: 2026-10-12. 작업 브랜치: `feature/interview-management-v2`.

## 현재 아키텍처

- `index.html`의 sidebar/view 구조와 `talent-pool.js`의 `MENU_CONFIG`, `setView`, 메뉴별 권한으로 기존 화면을 전환한다.
- 기존 인증은 로컬 회원 데이터와 이메일을 포함한 SHA-256 해시를 브라우저에서 비교한다. Supabase 동기화는 선택 사항이며 `app_members`, `app_role_permissions`, `candidates` 등의 기존 테이블을 사용한다. 신규 서버 인증 수단으로 기존 로컬 로그인 상태를 신뢰할 수 없다.
- `server.js`는 정적 파일과 개별 API를 제공한다. Vercel은 `api/router.js` 하나로 API를 분기하고 `scripts/build-runtime-config.js`가 정적 배포 산출물을 만든다.
- Supabase SDK가 이미 설치되어 있고 브라우저용 SDK가 `vendor/`에 있다. 신규 패키지 추가 없이 사용할 수 있다.
- 기존 Interview 메뉴와 일정 자동화 파일은 신규 설계의 입력으로 사용하지 않는다. 기존 테스트는 회귀 확인 목적으로만 실행한다.

## 공통 인프라 및 변경 범위

재사용: `styles.css`의 디자인 토큰·sidebar·버튼, Supabase SDK, 공개 runtime config, 로컬 서버, Vercel 공통 라우터 및 정적 빌드.

신규 파일:

- `interview-management.html`, `interview-management.css`, `interview-management.js`: 별도 로그인 및 역할별 화면.
- `api/interview-management/index.js`: 인증된 신규 API.
- `lib/interview-management-core.js`: 신규 입력 검증과 권한별 응답.
- `supabase/migrations/20261012090000_interview_management_v2.sql`: 신규 테이블·RLS·트랜잭션 함수.
- `scripts/test-interview-management.js`, `scripts/verify-interview-management-ui.js`: 권한·검증·화면 테스트.
- Phase 0/1 문서 및 DB 권한 검증 SQL.

기존 수정: `index.html`에 별도 URL 메뉴 링크 추가, `server.js`에 페이지/API 경로 추가, `api/router.js`에 신규 경로 분기, `scripts/build-runtime-config.js`에 신규 정적 파일 복사, `vercel.json`에 신규 페이지 경로만 추가. 기존 `talent-pool.js`, Interview 메뉴, 기존 DB·API·cron은 변경하지 않는다.

## 인증·권한 방안

- 별도 Supabase Auth 세션 저장 키를 사용한다. 기존 로컬 관리자는 신규 채용담당자 권한을 자동으로 얻지 않는다.
- 이메일을 로그인 아이디로 사용하고 채용담당자가 Admin API로 계정/초기 비밀번호를 발급한다. `createUser`는 초대 메일을 발송하지 않는다. 비밀번호는 Auth 서비스만 처리하며 앱 테이블·로그에 저장하지 않는다.
- 초기 채용담당자 1명은 Auth 관리 화면과 신규 프로필 테이블에서 수동 설정한다. 공개 bootstrap API를 만들지 않는다.
- 서버는 Bearer token을 `auth.getUser`로 검증하고 활성 신규 프로필의 역할을 조회한다. 일반 데이터 요청은 사용자 JWT를 사용하여 RLS를 적용한다. 서비스 키는 계정 생성·초기화 작업만 수행한다.
- RECRUITER만 생성·수정·취소·계정·부서 관리, HRBP는 부서 접근 권한이 부여된 면접, INTERVIEWER는 배정 면접, CANDIDATE는 본인 면접만 조회한다.
- 지원자용 면접 응답은 DB에서도 별도 허용 필드만 반환한다. 내부 참가자·부서·담당자 ID·이메일·감사 이력 테이블의 직접 조회는 금지한다.

## DB 설계 방향

모든 신규 테이블·함수에 `interview_mgmt_` 접두사. Auth 사용자 FK가 있는 사용자 프로필, 부서, HRBP 부서 접근 권한, 유형별 기본 소요 시간, 면접, 필수 참석자, 가능 시간, 후보 시간, 예약과 예약별 참가자 잠금, 변경 요청, 버전 이메일 초안·승인·발송 이력, 감사 로그를 분리한다.

Phase 1 면접 생성·수정·취소는 DB 함수에서 역할·배정·면접관 수·기간을 재검증하고 참가자/감사 이력을 한 트랜잭션으로 저장한다. 사용자 역할 변경은 면접 배정이 있으면 차단한다. 후보 시간 중복 제안은 허용하며 Phase 2에서 예약 리소스별 기간 exclusion constraint와 원자적 선택 함수를 사용한다. 새 예약 확정 및 이전 예약 해제는 같은 트랜잭션에서 처리할 예정이며 Phase 1에서는 예약 API를 제공하지 않는다.

## 영향 및 위험

- 기존 미커밋 변경이 다수 존재한다. 이를 보존하고 이번 파일만 별도로 식별한다. 기존 테이블 및 운영 DB에 마이그레이션을 적용하지 않는다.
- 새 메뉴는 별도 로그인 페이지로 이동한다. 기존 메뉴 권한 설정 테이블을 확장하지 않으며 신규 권한은 독립적으로 검사한다.
- Supabase 미설정 시 실제 인증/저장을 우회하지 않고 설정 안내를 표시한다. 테스트는 합성 데이터 및 모의 Auth로 실행한다.
- DB migration/RLS는 별도 테스트 DB에서 검증해야 한다. 운영 적용, 최초 계정, 환경 변수 설정은 후속 환경 준비 작업이다.
- 서비스 키 유출, RLS 우회, HRBP 부서 범위 오류, 지원자 응답 노출, 동시 예약, 변경 시 예약 해제 순서, 이메일 재시도/무효 버전 발송이 핵심 위험이다. Phase 2/3 구현 및 실제 DB 검증 전 운영 배포는 차단한다.

## Phase 0 기준선 검증

`npm run check` 통과. 기존 trending 테스트 9개, profile-report 테스트 3개, 기존 면접 일정 테스트 21개 통과. 브라우저 회귀는 Phase 1 변경 후 추가 수행한다.

공식 근거: [Supabase Auth](https://supabase.com/docs/guides/auth), [Admin createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
