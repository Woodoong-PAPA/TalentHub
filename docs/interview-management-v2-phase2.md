# 면접 일정 관리 v2 — Phase 2

완료일: 2026-10-13. 브랜치: `feature/interview-management-v2`.

## 구현 내용

- 면접관이 본인 가능 시간을 추가·수정·삭제할 수 있다. 개별 시간 및 연속 범위를 모두 지원한다.
- 허용 부서의 HRBP는 배정 면접관을 대신하여 입력·수정·삭제할 수 있다. 직접 입력과 대리 입력을 혼합하고 입력자를 기록한다. 대리 입력은 사전 협의가 완료된 가능 시간으로 처리한다.
- 채용담당자·HRBP는 면접관에게 직접 입력 요청을 등록할 수 있다. 면접 상세에 요청을 표시하고 가능 시간 입력 시 완료 처리한다. 외부 메시지나 이메일은 발송하지 않는다.
- DB에서 면접관별 가능 범위를 병합하고 배정 전원의 교집합을 계산한다. 기존의 다른 확정 예약을 제외한 공통 후보 시간을 표시한다. 신규 계산은 과거 일정 자동화 모듈을 호출하지 않는다.
- 채용담당자·허용 부서 HRBP가 복수 후보 시간을 제안할 수 있다. 후보 시간을 다른 지원자에게 중복 제안할 수 있다. 등록 가능한 제안은 현재 버전의 실제 공통 시간으로 제한한다.
- 지원자 선택 시 예약·지원자/면접관 리소스 잠금·상태·감사 이력을 한 트랜잭션으로 확정한다. 지원자와 모든 면접관의 겹치는 예약을 차단하며, 충돌/오래된 제안은 API 409로 안내한다. 같은 성공 요청 재시도는 기존 예약을 반환한다.
- 지원자는 역제안과 확정 일정 변경 요청, 면접관은 확정 일정 변경 요청을 등록할 수 있다. HRBP는 검토 의견을 남기고 채용담당자가 반영/반려를 결정한다. 반영은 예약 확정이 아니라 새로운 조율 시작이며 전원 가능 시간이 다시 필요하다.
- 기존 예약은 재조율·가능 시간 수정·제안 갱신 중에도 유지된다. 새 예약 및 리소스가 유효하게 확정되면 기존 예약을 해제한다. 실패 시 기존 예약과 리소스 잠금이 함께 복원된다.
- 기존 제안을 선택하여 예약이 확정되면 미검토 요청은 `RESOLVED`로 종료한다. 이를 담당자의 역제안 승인으로 기록하지 않는다.
- 역할별 확정 면접을 한국시간의 날짜별 일정 캘린더로 제공한다. 변경 조율 중에는 기존 예약이 표시된다.
- 지원자용 DB 함수·API는 공개 필드만 반환한다. 면접관 이름·이메일·참가자 ID·내부 조직·가능 시간·입력 요청·내부 검토 의견은 지원자 응답에서 제외한다.

## 예약 충돌 처리

면접별 행 잠금으로 같은 면접의 제안·가능 시간·선택을 직렬화한다. 예약 선택은 지원자 및 전원 면접관 사용자 행을 UUID 순서로 잠가 서로 다른 면접의 공통 리소스 경합도 직렬화한다. 리소스별 반개방 시간 범위 exclusion constraint가 DB의 마지막 충돌 방지 장치이다. 인접한 예약은 허용한다.

변경 예약은 처음 비활성 상태로 생성하고, 같은 트랜잭션 안에서 기존 리소스 잠금을 새 리소스로 전환한 뒤 활성 예약을 교체한다. 중간 상태는 다른 트랜잭션에 노출되지 않으며 어떤 단계에서 실패해도 기존 예약은 유지된다. 먼저 시도한 요청이 롤백되면 대기 중인 유효한 요청이 확정될 수 있다.

공식 근거: [PostgreSQL 명시적 잠금](https://www.postgresql.org/docs/17/explicit-locking.html), [동시성 제어](https://www.postgresql.org/docs/16/mvcc.html).

## 변경 파일

- `supabase/migrations/20261012110000_interview_management_v2_coordination.sql`: 신규 조율 함수, 요청 메타데이터, 직접 입력 요청 테이블, 캘린더, 기존 Phase 1 수정 함수의 안전한 래퍼.
- `lib/interview-management-core.js`: 역할별 조율 입력 검증 및 지원자용 중첩 응답 필드 제한.
- `api/interview-management/index.js`: `schedule`, `calendar`, `coordinate`, `proposals/select` 경로 및 409 오류 처리.
- `interview-management.js`, `interview-management.css`: 가능 시간·요청·제안 선택·재조율·날짜별 캘린더 화면.
- `scripts/test-interview-management.js`: 신규 API/권한/개인정보/충돌 응답 검증 추가.
- `scripts/test-interview-management-coordination.js`: 격리된 DB 기능·권한 및 네이티브 PostgreSQL 동시 연결 검증.
- `scripts/verify-interview-management-coordination-ui.js`: 네 역할의 실제 화면 조작 테스트.

기존 `talent-pool.js`, Interview, 기존 일정 API/모듈 및 기존 DB 테이블은 이번 단계에서 수정하지 않았다.

## 실제 테스트 Supabase 적용 상태

사용자가 현재 연결된 프로젝트를 테스트용으로 확인했다. `.env`의 URL과 CLI 연결 프로젝트 일치를 확인한 후 신규 migration 두 개만 `supabase db query --linked --file ...`로 적용했다. 전체 `db push`, `db reset`은 사용하지 않았다.

`20261012090000`, `20261012110000` 두 버전만 `supabase migration repair --linked --status applied`로 이력 등록했다. 실제 테스트 프로젝트에서 조율 테이블 설치 및 두 migration 이력 등록을 확인했다.

신규 기능 사용자 수는 **0명**이다. 현재 `.env`에는 URL/anon key만 있고 계정 발급용 `SUPABASE_SERVICE_ROLE_KEY`는 없다. 사용자 요청에 따라 계정 설정은 후속 작업으로 남겼다. 기존 계정은 자동 연결되지 않으므로 현재 화면에서 기존 계정으로 로그인할 수 없다. Auth 계정 생성·초대·비밀번호 변경은 실제 프로젝트에서 수행하지 않았다.

최초 계정 준비는 [Phase 1 설정 방법](interview-management-v2-phase1.md)을 따른다. 서버 키는 `.env` 또는 서버 환경에만 저장하며 공개 runtime config에 포함하지 않는다.

## 검증

- 신규 API/핵심 검증 테스트 15개 통과. Phase 1 DB 테스트 9개 통과.
- Phase 2 PGlite DB 테스트 10개 통과: 직접/대리 입력, 인접 범위 병합, 전원 교집합, 역할·부서·배정 권한, 입력 요청 완료, 버전 무효화, 공개 응답, 즉시 확정/재시도, 역제안 및 예약 교체, 충돌 실패의 기존 예약 보존, 별도 면접관 간 지원자 중복 예약 방지, 취소/잠금 해제.
- 실제 별도 PostgreSQL 프로세스에서도 동일 시나리오와 두 동시 연결 테스트를 포함한 12개 테스트 통과. 첫 커밋 우선, 첫 시도 롤백 후 대기 요청 성공을 각각 검증했다. 런타임은 [embedded-postgres](https://github.com/leinelissen/embedded-postgres)로 사용자 TEMP 하위에 실행하고 종료했다. 앱 의존성이나 시스템 PostgreSQL 서비스는 추가하지 않았다.
- Phase 2 브라우저 테스트: RECRUITER/HRBP/INTERVIEWER/CANDIDATE × 1440/390px의 8개 시나리오 통과. 가능 시간 추가·수정, 대리 입력, 직접 입력 요청, 제안, 검토, 재조율, 지원자 역제안 및 충돌 후 재선택, 캘린더, 개인정보 비노출, 가로 overflow 및 JS 오류를 확인했다.
- Phase 1 브라우저 테스트의 8개 역할/해상도 시나리오 및 미설정 차단 시나리오도 통과했다.
- 기존 테스트 33개 및 후보자 등록/사진/상세 수정/AI 검색/메뉴, 트렌딩 세션, 프로필 보고서 데스크톱·모바일 브라우저 회귀 통과.
- 코드 문법 검사 및 `npm run check`, `npm run build` 통과. 화면 캡처를 `.codex-artifacts/interview-management-phase2/`에 저장하고 확인했다.

브라우저의 Auth/API는 합성 데이터 응답을 사용했다. 실제 DB 함수는 격리 PostgreSQL에서 실행했으며, 실제 Supabase의 Auth/PostgREST 인증 사용자 연동 검증은 계정 준비 후 수행해야 한다. 테스트 Supabase에는 신규 DB 스키마만 적용하고 테스트 사용자/면접 데이터는 아직 추가하지 않았다.

재실행:

```powershell
node --test scripts/test-interview-management.js scripts/test-interview-management-db.js scripts/test-interview-management-coordination.js
node server.js 5186
# 별도 터미널
node scripts/verify-interview-management-ui.js
node scripts/verify-interview-management-coordination-ui.js
node scripts/verify-talenthub-regression.js

# 실제 PostgreSQL 동시 연결 테스트. ASCII TEMP 경로를 사용해 Windows 로캘 문제를 피한다.
$taskPgRuntime = Join-Path $env:TEMP 'talenthub-interview-native-runtime'
npm install --prefix $taskPgRuntime --no-save --package-lock=false embedded-postgres pg
$env:INTERVIEW_MGMT_NATIVE = '1'
node --test scripts/test-interview-management-coordination.js
Remove-Item Env:INTERVIEW_MGMT_NATIVE
```

## 다음 단계와 제한

- 공통 시간은 15분 간격, 최대 200개 표시이며 한 번에 1~20개 제안한다. 다른 날짜가 필요하면 채용담당자가 조율 기간을 좁혀 재계산한다.
- 확정 이후 지원자/면접관 배정과 면접 소요 시간 변경은 아직 지원하지 않는다. 확정 면접은 동일한 필수 참가자·시간 길이로 재조율한다.
- Phase 3: 버전 이메일 초안, 담당자/대체 담당자 승인함·일괄 승인, Reply-To, 승인 후 발송, 발송 실패/중복/재시도, 실제 발송 시점 기준 리마인드. 현재 이메일 초안/발송 기능은 아직 없으며 예약 확정 화면에서 이를 안내한다.
- 캘린더 화면만 제공하며 외부 캘린더 연동이나 ICS 파일은 생성하지 않는다. 이메일/ICS 개인정보 검증은 해당 출력 구현 단계에서 추가한다.
- 실제 이메일 발송, 운영 배포, GitHub push는 수행하지 않았다. 로컬 서버는 최신 코드로 5186 포트에서 재시작했다.
