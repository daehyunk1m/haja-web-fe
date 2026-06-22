# HAJA

> **불렛저널을, 쉽고 빠르게.**
> 이벤트 히스토리 모델과 불렛저널(Bullet Journal) 시스템을 결합한 하루 단위 태스크 관리 웹 앱.

HAJA는 종이 불렛저널의 습관 — 한 줄로 빠르게 적고, 간단한 기호로 상태를 표시하고, 끝내지 못한 일은 다음 날로 넘기는 — 을 디지털로 옮긴 할 일 관리 앱입니다. 여기에 **이벤트 소싱**을 더해 "언제 시작했고, 미뤘고, 끝냈는지" 모든 변화를 기록으로 남깁니다.

가장 중요한 단위는 **"하루"** 입니다. 복잡한 프로젝트·폴더 구조 대신 "오늘 무엇을 할 것인가"와 "오늘 무엇을 했는가"에 집중합니다.

```
┌─────────────────────────────┐
│  HAJA                  ◔     │  상단: 앱 이름 · 오늘의 진행률 · 로그인 상태
│  TO DO LIST                  │
├──────────────┬──────────────┤
│   TODAY ▼    │   SOMEDAY ▲   │  TODAY(오늘 할 일) / SOMEDAY(언젠가 할 일)
├──────────────┴──────────────┤
│  □ 오늘 할 일 1               │
│  ◧ 오늘 할 일 2 (진행중)       │  펼쳐진 영역: 할 일 목록
│  ■ 오늘 할 일 3 (완료)        │
│                         (+)  │  할 일 추가 버튼
└─────────────────────────────┘
```

## 주요 기능

- **5단계 상태 전이** — 할일·진행중·연기(할 일) / 완료·취소(한 일). 아이콘 클릭으로 빠른 완료 토글, 롱프레스(0.5초)로 상태 선택 팝업.
- **자동 이관(carry forward)** — 완료·취소하지 않은 오늘 할 일을 날짜가 바뀌면 다음 날로 자동 이관. 며칠 미접속 시 중간 날짜를 건너뛰고 오늘로 직행 이관.
- **이벤트 소싱 히스토리** — 상태 변화를 날짜와 함께 append-only로 기록. 현재 상태는 이벤트 배열의 마지막 항목에서 파생.
- **TODAY / SOMEDAY 분리** — 날짜별 '오늘 할 일'과 날짜 무관 '언젠가 할 일'을 분리. 두 영역은 항상 하나만 펼쳐지는 아코디언(태스크가 많은 쪽 자동 확장).
- **캘린더 날짜 이동** — 지난 날·앞으로의 날을 둘러보고, TODAY 탭으로 오늘에 즉시 복귀.
- **실시간 진행률** — (완료 + 취소) ÷ 오늘 전체 비율을 원형 차트로 표시. someday는 집계에서 제외.
- **드래그 순서 변경 · 스와이프 삭제** — `@dnd-kit` 기반 순서 재배치, 좌측 스와이프로 삭제 버튼 노출(확인 단계 포함). 두 제스처는 축으로 분리되어 공존.
- **인라인 제목 편집** — 제목 클릭 → 즉시 편집(Enter 저장 / Esc 취소). 빈 제목 생성 차단.
- **Google OAuth 로그인** — Supabase Auth 기반 인증, ProtectedRoute로 보호.
- **로컬 우선 저장** — `localStorage` 영속화로 오프라인에서도 동작(클라우드 동기화는 로드맵).
- **Figma 디자인 토큰** — `yarn figma:extract`로 Figma에서 색·타이포 토큰을 재생성(진실 소스 = Figma).

## 기술 스택

| 영역 | 기술 |
|------|------|
| 언어 | TypeScript 5.7 |
| UI | React 19 |
| 라우팅 | React Router v7 (프레임워크 모드, SSR 비활성) |
| 클라이언트 상태 | Zustand 5 (`devtools → subscribeWithSelector → persist → immer`) |
| 서버 상태 | TanStack React Query 5 |
| 빌드 | Vite 6 |
| 스타일 | Tailwind CSS v4 + shadcn/ui (Radix) |
| 인증/백엔드 | Supabase (Google OAuth) |
| 폼/검증 | React Hook Form + Zod |
| 드래그 앤 드롭 | @dnd-kit |
| 테스트 | Vitest + React Testing Library (유닛/통합), Playwright (E2E) |
| 패키지 매니저 | yarn |

## 시작하기

### 요구사항

- Node.js 18 이상 (20 LTS 권장)
- yarn

### 설치

```bash
yarn install
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 Supabase 값을 채웁니다.

```env
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

> Google 로그인은 Supabase 대시보드의 **Authentication → Providers**에서 Google을 활성화하고,
> 리다이렉트 경로를 `/auth/callback`으로 설정하면 동작합니다.

디자인 토큰 추출(`yarn figma:extract`)을 쓰는 경우에만 추가로 필요합니다.

```env
FIGMA_TOKEN=<your-figma-personal-access-token>
```

### 개발 서버

```bash
yarn dev        # http://localhost:5173
```

## 스크립트

| 명령 | 설명 |
|------|------|
| `yarn dev` | 개발 서버 (Vite, 포트 5173) |
| `yarn build` | 타입체크(`tsc -b`) + 프로덕션 빌드(`react-router build`) |
| `yarn preview` | 빌드 결과 로컬 미리보기 |
| `yarn test` | 유닛 테스트 watch 모드 (Vitest) |
| `yarn test:run` | 유닛 테스트 1회 실행 |
| `yarn test:e2e` | E2E 테스트 (Playwright) |
| `yarn lint` | ESLint |
| `yarn lint:arch` | 레이어 의존성 검사 (structural-test) |
| `yarn validate` | `build + lint + lint:arch + test:run` 전체 게이트 |
| `yarn figma:extract` | Figma에서 디자인 토큰(`tokens.json`, `design.md`) 재생성 |
| `yarn doc:check` | 문서 최신성 검사 |

## 프로젝트 구조

```
src/
├── utils/        # 순수 유틸 (날짜, 정렬 키, 섹션 폴드)
├── lib/          # Supabase 클라이언트, React Query, cn 등 설정
├── shared/       # 도메인 모델(TaskCore) · Zustand 스토어
├── hooks/        # 커스텀 훅
├── contexts/     # AuthContext
├── components/   # UI 컴포넌트 (bulletList/ · modal/ · ui/)
├── pages/        # 라우트 페이지 (Login, AuthCallback 등)
├── assets/       # 상태 아이콘 등 정적 자산
├── routes.ts     # 라우팅 정의
├── root.tsx      # 앱 셸 (Provider 배선)
└── App.tsx       # 메인 화면
```

## 아키텍처

레이어 기반 구조로, 의존성은 **상위 → 하위 한 방향**만 허용합니다.

```
types → utils → lib → shared → hooks → contexts → components → pages → app
```

이 규칙은 `yarn lint:arch`로 강제됩니다. 도메인은 멀티 패러다임으로 작성합니다 — `TaskCore`는 객체지향(상태·전이·이벤트 히스토리 캡슐화, 불변 복제 패턴), 그 외 이관·필터·정렬 등은 순수 함수입니다.

상세: [ARCHITECTURE.md](ARCHITECTURE.md)

## 테스트

- **유닛/통합**: Vitest + React Testing Library (jsdom) — `yarn test:run`
- **E2E**: Playwright — `yarn test:e2e` (`@critical` 흐름은 pre-push 게이트 대상)
- **전체 검증**: `yarn validate`

기능은 TDD 사이클(Red → Green → Refactor) 기반의 에이전트 파이프라인으로 구현합니다. 자세한 워크플로는 [CLAUDE.md](CLAUDE.md)와 `.claude/rules/`를 참고하세요.

## 배포

Vercel에 배포합니다. 빌드는 React Router 프레임워크 빌드(`react-router build`)를 사용하며, `dev` 브랜치는 프리뷰로 자동 배포됩니다.

## 로드맵

현재 준비 중인 기능(상세: [사용자 안내서 §6](docs/USER_GUIDE.md#6-곧-추가될-기능-로드맵)):

- **할 일 상세 화면** — 메모/노트 작성
- **연기 날짜 지정(스누즈)** — 특정 미래 날짜로 다시 보기
- **클라우드 동기화** — 여러 기기 간 데이터 동기화 및 기존 로컬 기록 자동 이전
- **네이버 로그인** — Google 외 로그인 수단

## 문서

| 문서 | 내용 |
|------|------|
| [docs/product-specs/HAJA_PRD_v0.1.md](docs/product-specs/HAJA_PRD_v0.1.md) | 제품 요구사항(PRD) — 데이터 모델·상태 전이·마이그레이션 |
| [docs/USER_GUIDE.md](docs/USER_GUIDE.md) | 사용자 안내서 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 아키텍처 규칙·레이어 의존성·도메인 규칙 |
| [AGENTS.md](AGENTS.md) · [CLAUDE.md](CLAUDE.md) | 에이전트 작업 지침 (TDD 하네스) |
| [docs/design-docs/](docs/design-docs/) | 설계 결정 기록·디자인 토큰 |
| [docs/exec-plans/](docs/exec-plans/) | 작업별 실행 계획 (Supabase 연동 등) |

## 라이선스

<!-- 라이선스 추후 결정 -->
