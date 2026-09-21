# Candidate Profile Generator

## 개요

Candidate Profile Generator는 외부 핵심인재의 공개 프로필을 조사하고, 사실과 출처를 검토한 뒤 경영진 보고용 후보자 프로필을 만드는 Talent Pool 내부 도구다.

기존 Talent Pool 후보자 데이터와 화면을 변경하지 않고 `profile-generator` 메뉴 아래에서 독립적으로 동작한다.

## Prototype 0.1 범위

- 대시보드와 리서치 진행 현황
- LinkedIn 개인 프로필 URL 기반 새 리서치
- Deep Research / Provided Materials Only 모드
- 후보자 마스터 라이브러리와 검색·유형 필터
- 경력, 학력, 전문성, 성과, 출처, 내부 메모 검토
- `FACT`, `AI_INTERPRETATION`, `INTERNAL_NOTE` 분리
- 출처 Tier와 검증 상태 표시
- 기본 프로필, 인터뷰 프로필, 복수 후보자 요약 템플릿
- 편집 가능한 보고서 미리보기
- 서버 기반 DOCX 생성 및 다운로드
- Supabase `app_settings` 기반 데스크톱·모바일 상태 동기화
- 향후 정규화 저장을 위한 Supabase 엔터티 마이그레이션

## 반응형 설계

### 데스크톱

- 좌측 내부 메뉴를 유지한다.
- 후보자 검토 화면은 본문과 출처 패널을 나란히 표시한다.
- 보고서 편집 패널과 정확한 A4 비율의 미리보기를 함께 표시한다.

### 태블릿

- 내부 메뉴를 상단 축약 메뉴로 전환한다.
- 후보자 검토와 보고서 편집을 한 열로 바꾼다.
- 후보자 표는 화면 폭에 따라 카드형 목록으로 전환한다.

### 모바일

- 하단 빠른 메뉴를 사용한다.
- 새 리서치, 진행 확인, 후보자 요약, Fact·출처 검토, 내부 메모 입력을 한 열로 표시한다.
- A4 편집 화면 대신 읽기 쉬운 보고서 본문을 먼저 표시한다.
- DOCX 생성과 다운로드는 그대로 제공한다.
- 핵심 흐름에는 가로 스크롤이 생기지 않는다.

## 모바일 공유 진입점

향후 모바일 앱의 공유 기능을 연결할 수 있도록 URL 진입점을 제공한다.

```text
https://talentpool-dx.com/?shareUrl=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fexample
```

위 주소로 접속하면 Candidate Profile Generator의 새 리서치 화면에 LinkedIn URL이 자동 입력된다. 네이티브 앱 또는 PWA의 Share Target은 나중에 이 진입점으로 연결할 수 있다.

## 서버 연결 구조

```text
LinkedIn URL
  -> /api/candidate-profile-research
  -> Apify Connector 또는 Mock Provider
  -> 정규화
  -> Candidate Master
  -> Fact / Source 검토
  -> Report Generator
  -> /api/candidate-profile-report
  -> DOCX
```

Apify Actor는 API 구현 내부에만 존재하며 브라우저 코드와 Candidate Master 스키마는 특정 Actor에 의존하지 않는다.

## 환경변수

```text
APIFY_API_TOKEN=
APIFY_LINKEDIN_ACTOR_ID=
CANDIDATE_WEB_SEARCH_PROVIDER=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
APP_DATA_SOURCE=supabase
```

- `APIFY_API_TOKEN`: Apify 서버 API 토큰. 프런트엔드에 노출하지 않는다.
- `APIFY_LINKEDIN_ACTOR_ID`: 사용할 LinkedIn Profile Actor 식별자.
- `CANDIDATE_WEB_SEARCH_PROVIDER`: 향후 공개 웹 조사 provider 선택 값.
- `OPENAI_API_KEY`: 향후 구조화된 사실 추출과 보고서 초안 보조에 사용한다.
- Supabase 설정이 없으면 브라우저 로컬 저장으로 동작한다.

현재 검증한 Actor는 HarvestAPI의 `LinkedIn Profile Scraper + Email - No Cookies`이며 Actor ID는 `LpVuK3Zozwuipa5bp`다. 서버는 개인정보 수집 범위를 줄이고 비용을 낮추기 위해 `Profile details no email` 모드만 요청한다. 토큰은 `.env` 또는 배포 환경변수에만 저장하고 브라우저 번들에는 포함하지 않는다.

## 데이터 저장

Prototype 0.1의 즉시 동기화 데이터는 기존 `app_settings` 테이블에서 `candidate_profile_generator_v1` 키로 관리한다. 새로 추가된 마이그레이션은 다음 정규화 엔터티를 준비한다.

- `candidate_master_profiles`
- `candidate_profile_education`
- `candidate_profile_experience`
- `candidate_profile_sources`
- `candidate_profile_facts`
- `candidate_profile_expertise`
- `candidate_profile_achievements`
- `candidate_research_runs`
- `candidate_internal_notes`
- `candidate_report_templates`
- `candidate_reports`
- `candidate_report_candidates`

공개 조사 결과와 내부 메모는 서로 다른 엔터티로 분리한다. AI 해석은 검증 Fact로 승격하기 전까지 보고서 근거로 사용하지 않는다.

## 로컬 실행

```powershell
npm install
npm run dev
```

브라우저에서 `http://127.0.0.1:5177/`을 열고 기본 관리자 계정으로 로그인한 뒤 `Candidate Profile` 메뉴로 이동한다.

## 검증

```powershell
npm run check
npm run test:candidate-profile
npm run build
```

## 외부 자격 증명 없이 확인하는 방법

1. `Candidate Profile` 메뉴를 연다.
2. `새 리서치`를 선택한다.
3. `https://www.linkedin.com/in/example-person` 형식의 URL을 입력한다.
4. 검토 목적과 포지션을 선택한다.
5. `후보자 리서치 시작`을 누른다.
6. 목업 provider가 동일한 Candidate Master 구조로 결과를 생성한다.
7. Fact와 출처를 검토하고 보고서 초안을 만든다.
8. `DOCX 다운로드`로 실제 Word 문서를 내려받는다.

## 보안 및 개인정보 원칙

- 외부 API 토큰은 서버 환경변수에만 둔다.
- LinkedIn 계정 비밀번호나 세션 쿠키를 수집하지 않는다.
- 이메일, 전화번호 등 불필요한 민감정보를 자동 수집하지 않는다.
- 공개 사실, AI 해석, 내부 메모를 명시적으로 분리한다.
- 보고서 메시지는 검증된 `FACT`만 근거로 사용한다.
- URL과 파일명은 출력 전에 정규화하고 사용자 입력은 HTML로 escape한다.

## 알려진 범위

- 공개 웹 리서치 provider는 연결 경계와 목업 흐름까지만 제공한다.
- Apify Connector는 현재 HarvestAPI Actor의 `queries`, `urls`, 객체형 날짜, 위치 및 사진 필드로 실제 호출 검증을 마쳤다. 다른 Actor로 교체하면 connector mapping을 다시 검증해야 한다.
- A4 한 페이지 자동 재압축은 현재 템플릿의 기본 분량 제어만 적용한다. 페이지 렌더 후 중요도가 낮은 문장을 반복 요약하는 기능은 다음 단계다.
- 현재 RLS는 기존 프로토타입 정책을 따른다. 실제 운영 전 조직/tenant별 접근 제어 정책으로 교체해야 한다.
