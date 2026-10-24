# 면접 일정 관리 v2 — 테스트 계정 준비

## 현재 결과

### 2026-10-15 실제 계정 검증

- 로컬 `.env` 서버 키 설정 후 최초 테스트 채용담당자 `interview-v2-recruiter@example.test` 발급 완료.
- 실제 Supabase Auth `signInWithPassword`, 사용자 JWT 기반 본인 프로필 RLS 조회, 면접 목록 RPC 통과.
- 로컬 `/interview-management` 브라우저 1440px/390px에서 실제 로그인, bootstrap API, 이메일 승인함 API, 사용자 관리 화면, 새로고침 후 로그인 유지, 로그아웃 후 새로고침 검증 통과. API/Auth 응답을 모의 처리하지 않았다.
- 익명 API 접근 401 차단, 가로 넘침 없음, 페이지 JS 오류 없음, 외부 발송 비활성 확인.
- 재현 도구: `scripts/verify-interview-management-live-login.js`. 합성 계정 이메일/초기 비밀번호 JSON을 stdin으로만 입력받고 비밀번호·토큰·브라우저 저장 상태 파일을 생성하지 않는다. 테스트는 계정 정보를 변경하지 않는다.
- 계정/핵심 API 회귀 20개 통과. 신규 브라우저 검사 스크립트 문법 검사 통과.
- 초기 비밀번호는 소스 및 문서에 기록하지 않는다. 로컬 서버는 `.env`를 로드하여 127.0.0.1:5186에서 실행했다.
- 이번 검증은 최초 RECRUITER 계정에 한한다. 실제 HRBP/면접관/지원자 계정 발급과 역할별 통합 검증, 실제 비밀번호 변경은 후속 항목이다. 외부 이메일 발송·운영 배포는 수행하지 않았다.

아래는 도구 준비 당시의 기록 및 재현 절차다. 서버 키 누락 및 계정 0개 상태는 위 검증 결과로 대체한다.

- 브랜치: `feature/interview-management-v2`.
- 테스트 프로젝트: `pefsetlczrrlvlehealp`.
- 최초 채용담당자 발급 도구와 서버 전용 bootstrap RPC를 추가했다.
- `20261013120000_interview_management_bootstrap.sql`을 연결된 테스트 DB에 적용하고 마이그레이션 이력을 등록했다.
- 실제 DB에서 `anon`/`authenticated` 실행 불가, `service_role`만 실행 가능함을 확인했다.
- 신규 계정 0개, 이메일 발송 이벤트 0개. 실제 Auth 로그인은 아직 미검증이다.
- 로컬 설정 점검은 `SUPABASE_SERVICE_ROLE_KEY` 누락으로 종료했다. 키나 비밀번호를 소스/검사 출력에 포함하지 않았다.

## 최초 계정 발급 절차

1. 테스트 프로젝트의 서버 전용 `service_role` 키를 Git에서 제외된 로컬 `.env`의 `SUPABASE_SERVICE_ROLE_KEY`에 설정한다. 키는 채팅이나 프론트엔드 runtime config에 넣지 않는다. 기존 URL/anon key는 유지한다.
2. 외부 발송은 `INTERVIEW_MGMT_MAIL_SEND_ENABLED=false`로 유지한다.
3. 설정을 점검한다.

```powershell
node --env-file=.env scripts/setup-interview-management-account.js --check --project-ref pefsetlczrrlvlehealp
```

4. 최초 계정을 발급한다. 실제 개인정보 대신 합성 이메일만 허용한다.

```powershell
node --env-file=.env scripts/setup-interview-management-account.js --create --project-ref pefsetlczrrlvlehealp --email interview-v2-recruiter@example.test
```

발급 도구는 비밀번호를 무작위 생성하고 Auth에 등록한다. 초기 비밀번호는 실행 터미널에 한 번 출력하며 파일에는 저장하지 않는다. stdout을 파일이나 CI 로그로 리다이렉트하지 않는다. Auth 초대/비밀번호 초기화 이메일은 보내지 않는다.

발급 직후 anon 클라이언트로 실제 `signInWithPassword`, 본인 사용자 프로필 RLS 조회, 면접 목록 RPC를 호출해 검증한다. 서비스 키로 사용자 로그인 검증을 대체하지 않는다. 로그인 토큰은 파일에 저장하지 않고 로컬 세션을 종료한다. 검증 실패 시 이미 발급한 계정의 비밀번호를 함께 표시하며 종료 코드 2를 반환한다. 같은 도구를 재실행해 계정을 덮어쓰지 않는다.

5. 로컬 서버를 재시작한 뒤 `/interview-management`에 발급한 아이디/초기 비밀번호로 로그인한다. 기존 TalentHub 기본 admin 계정은 신규 영역 계정이 아니다.
6. 이후 대체 채용담당자, HRBP, 면접관, 지원자는 신규 영역의 사용자 관리에서 합성 계정으로 발급한다. 부서 생성 및 HRBP 부서 접근 부여 후 실제 역할별 검증을 이어간다.

## 보호 장치

- 명시한 프로젝트 ref와 `.env` URL이 일치해야 실행한다.
- 외부 발송 활성 상태와 `.test` 외의 이메일은 거부한다.
- 기존 신규 사용자 프로필이 있으면 bootstrap을 중단한다. 일반 계정 관리는 채용담당자 API를 사용한다.
- DB 트랜잭션의 advisory lock으로 최초 발급을 직렬화한다. 확인된 Auth 계정의 ID/이메일이 일치해야 프로필을 생성한다.
- 프로필 저장 및 감사 로그는 같은 트랜잭션으로 처리한다.
- 프로필 저장 실패 시 이번 실행이 생성한 Auth 계정만 정리한다. 기존 Auth 계정을 연결하거나 비밀번호를 덮어쓰지 않는다.
- bootstrap RPC는 테스트 초기화용이며 브라우저나 일반 사용자 API에 노출하지 않는다.

## 검사 결과

- 신규 발급 보호 장치/실패 보상/자격 증명 처리/DB 권한 테스트 5개 통과.
- 기존 신규 영역 핵심/API 테스트 15개 통과.
- 네이티브 PostgreSQL 이메일 동시 처리 및 복구 테스트 5개 통과.
- `npm run check`, 발급 도구 문법 검사, `git diff --check` 통과.
- 실제 Supabase의 최초 계정/로그인 검증은 서버 전용 키 설정 후 수행한다. 외부 이메일 발송과 운영 배포는 수행하지 않았다.
