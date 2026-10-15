# 면접 일정 관리 v2 — Phase 4 통합 검증

검증일: 2026-10-13. 브랜치: `feature/interview-management-v2`.

판정: **로컬 통합 검증 통과 / 운영 배포 보류**. 실제 Supabase Auth 계정 및 PostgREST 연동, 승인된 실제 이메일 발송 검증이 완료되지 않았으므로 전체 Phase 4를 운영 검증 완료로 표시하지 않는다.

## 이번 단계의 변경

- `scripts/interview-management-native-fixture.js`: 별도 PostgreSQL 프로세스에 신규 migration 및 합성 사용자/부서 데이터를 구성하는 테스트 도구. 운영 앱에서 사용하지 않는다.
- `scripts/test-interview-management-mail-concurrency.js`: 실제 DB 연결의 이메일 작업 경합, 임대 만료 및 중단 복구, 늦은 ACK, 승인 계정 권한 회수 검증.
- `scripts/verify-interview-management-integration.js`: 실제 신규 API 핸들러 + 실제 PostgreSQL/RLS + 실제 브라우저를 연결한 전체 흐름 검증. 테스트용 DB 어댑터가 API의 사용자/서비스 자격을 PostgreSQL 역할로 연결한다.
- `lib/interview-management-mail.js`: 임대 권한이 없는 워커의 저장 거부를 성공으로 집계하던 문제 수정. `mail_finish=false` 응답은 성공 건수에 포함하지 않는다. 실제 전송을 시도했을 수 있는 상황이므로 새 메시지로 보내지 않고 기존 중복 방지 키를 유지한다.
- `scripts/test-interview-management-mail.js`: 위 ACK 집계 오류 재현 및 회귀 검사 추가.

기존 기능 코드, 기존 Interview/일정 자동화 구현, 기존 DB 테이블 및 배포 설정은 이번 단계에서 수정하지 않았다. 신규 DB migration도 추가하지 않았다.

## 통합 흐름 결과

1. 채용담당자의 실제 신규 API 호출로 테스트 면접 생성.
2. 지원자의 면접관 시간 입력 시도는 API 403으로 차단.
3. HRBP의 실제 DB/RLS 권한으로 대리 가능 시간 입력.
4. 전체 면접관 공통 시간을 계산하고 후보 시간 제안.
5. 다른 지원자의 상세 조회 및 HRBP/지원자의 승인함 조회는 API 403으로 차단.
6. 지원자 브라우저에서 제안 선택 → 실제 DB 트랜잭션 예약 확정 → 캘린더 반영.
7. 후보자 API 응답·브라우저 화면에서 내부 면접관 이름/이메일/조직 정보가 제외됨을 확인.
8. 채용담당자 브라우저에서 자동 확인 초안 일괄 승인.
9. 주 담당자/대체 담당자가 두 실제 HTTP 요청으로 워커를 동시에 실행. 승인된 확인 메일 3건은 각각 1회만 모의 전송 접수되며, 다시 실행해도 추가 전송 없음.
10. 모의 발송 서비스에 전달한 지원자 이메일 요청 본문에도 내부 면접관·조직 정보 없음.

Auth 토큰 검증과 발송 서비스는 테스트 대역이다. API 핸들러, DB 함수, 권한 정책, 제약, 브라우저 UI는 실제 구현을 실행했다. 이 검증을 실제 Supabase Auth 또는 실제 PostgREST 연결 검증으로 간주하지 않는다. 테스트 인증 토큰은 테스트 서버의 주입 어댑터에서만 처리하며 일반 앱에는 인증 우회 설정을 추가하지 않았다.

## 동시 실행·복구 결과

- 동일 이메일 이벤트를 두 DB 연결에서 점유하면 한 워커만 임대를 받는다. 다른 워커는 첫 트랜잭션 커밋 후 활성 임대를 확인하고 전송을 시작하지 않는다.
- 워커 중단을 임대 만료로 재현하면 새 워커가 같은 본문과 중복 방지 키로 이어서 처리한다.
- 이전 워커의 늦은 ACK는 `false`로 거부되며 현재 임대 결과를 덮어쓰지 않는다. 이 거부를 성공으로 집계하던 서버 오류를 수정했다.
- 유효한 ACK 이후에는 해당 이벤트를 재전송하지 않는다.
- 승인 계정의 권한이 회수되면 이미 점유된 취소 안내 이메일도 최종 발송 검사에서 차단한다.
- 예약 역시 실제 PostgreSQL의 두 연결에서 첫 정상 커밋 우선, 첫 시도 롤백 후 대기 예약 성공, 지원자/전원 면접관 중복 예약 방지와 기존 예약을 유지하는 일정 변경을 재검증했다.

## 검사 결과

| 항목 | 결과 |
|---|---|
| 기존 테스트 33개 | 통과 |
| 신규 핵심/API·Phase 1 DB·메일 DB/처리 테스트 43개 | 통과 |
| 네이티브 PostgreSQL 예약 회귀 12개 | 통과 |
| 네이티브 이메일 동시 실행·중단 복구 5개 | 통과 |
| API + DB/RLS + 브라우저 통합 흐름 | 통과 |
| Phase 1/2/3 네 역할 × 데스크톱/모바일 브라우저 시나리오 | 통과 |
| 기존 로그인/메뉴/후보자 등록·사진·상세 수정·AI 검색 | 통과 |
| 기존 트렌딩 세션 및 프로필 보고서 생성/다운로드 | 통과 |
| 코드 문법 검사, `npm run check`, `npm run build`, whitespace 검사 | 통과 |
| 실제 Supabase Auth + PostgREST 사용자 연동 | 미검증 |
| 실제 테스트 이메일 전송 및 수신 확인 | 미검증·승인 필요 |
| 운영 배포 | 수행하지 않음 |

ICS/외부 캘린더 파일은 생성하지 않으므로 해당 파일의 개인정보 검증은 구현 범위에 포함되지 않는다. 제공되는 캘린더 API·화면 및 생성되는 이메일 본문은 검증했다. 반송/배달 실패 webhook과 수신함 배달 완료 상태를 구현했다고 주장하지 않는다.

## 테스트 환경과 실행

별도 PostgreSQL을 사용자 TEMP 하위에서 실행하고 테스트 종료 시 서버를 중지했다. 합성 데이터는 `example.test` 이메일과 가상 이름만 사용했다. 앱 의존성은 추가하지 않았다.

```powershell
node --test scripts/test-interview-management-mail-concurrency.js
node scripts/verify-interview-management-integration.js

# 기존 전체 검사
npm run check
node --test scripts/test-interview-management.js scripts/test-interview-management-db.js scripts/test-interview-management-mail.js scripts/test-interview-management-mail-db.js
$env:INTERVIEW_MGMT_NATIVE='1'
node --test scripts/test-interview-management-coordination.js
Remove-Item Env:INTERVIEW_MGMT_NATIVE
```

네이티브 런타임이 없으면 [Phase 2](interview-management-v2-phase2.md)의 TEMP 경로 설치 절차를 따른다. PGlite 런타임은 [Phase 1](interview-management-v2-phase1.md)의 설치 절차를 따른다.

## 운영 배포 전 남은 게이트

2026-10-15 사용자 승인 후 실제 외부 발송과 운영 배포를 수행했다. 최신 상태와 남은 수신 확인·허용 목록·소스 반영 사항은 [운영 반영 기록](interview-management-v2-release-20261015.md)을 따른다. 아래는 최초 Phase 4 검증 당시의 이력이다.

후속 계정 준비 및 실제 연동 결과는 [테스트 계정 준비](interview-management-v2-account-setup.md)를 따른다. 2026-10-15 서버 키 설정 후 최초 테스트 RECRUITER 계정 발급과 실제 Supabase Auth/PostgREST 및 데스크톱·모바일 로그인 검증을 완료했다. 아래 게이트 목록은 최초 Phase 4 종료 시점의 기록이며, 다른 역할의 실제 계정 검증과 실제 이메일 전송은 아직 남아 있다.

1. **테스트 계정 준비:** `.env`에는 Supabase URL/anon key만 있다. 서버 전용 `SUPABASE_SERVICE_ROLE_KEY` 및 최초 신규 채용담당자 계정을 준비해야 한다. 이전 사용자 요청에 따라 계정 설정은 후속 작업에 남아 있으며, 이번 단계에서도 신규 실제 계정을 생성하지 않았다.
2. **실제 인증/DB 연동:** 테스트 계정으로 실제 Supabase Auth 로그인, 계정 생성/초기 비밀번호/본인 재설정/비활성화, 네 역할의 실제 PostgREST API와 직접 DB 접근 차단을 확인해야 한다. 기존 TalentHub 계정은 신규 영역에 자동 연동되지 않는다.
3. **실제 발송 검증:** 명시적 외부 발송 승인 후 전용 Resend 키·테스트 발신 주소·테스트 수신 허용 목록을 준비한다. 현재 발송은 비활성 상태를 유지한다. 실제 전송 접수 시각/수신, 실패 및 재시도, Reply-To, 본문 개인정보를 확인해야 한다.
4. **운영 대응:** `UNCERTAIN` 이벤트는 자동 재발송하지 않는다. 발송 서비스 이력에서 실제 접수 여부를 확인한 뒤 조치한다. 반송/배달 실패 알림 필요 여부 및 운영 담당자를 정해야 한다.
5. **배포 승인:** 위 게이트가 통과하고 명시적 승인된 뒤에만 운영 배포를 진행한다. 현재 GitHub push·워크플로 활성화·운영 배포는 수행하지 않았다.

실제 테스트 Supabase의 신규 계정/발송 이벤트 수와 외부 발송 비활성 상태를 확인했으며, 이번 단계에서는 실제 계정·면접·발송 이벤트를 만들지 않았다. 로컬 서버는 수정된 코드로 5186에서 재시작한다.
