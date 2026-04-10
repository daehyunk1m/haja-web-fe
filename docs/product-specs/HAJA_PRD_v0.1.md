# HAJA — 불렛저널 기반 투두리스트 앱 PRD

## 1. 개요

### 1.1 프로덕트 비전

HAJA는 **이벤트 히스토리 모델**과 **불렛저널(Bullet Journal) 시스템**을 결합한 하루 단위 태스크 관리 앱이다. 아날로그 불렛저널의 Rapid Logging, Daily Migration, 상태 전이 시스템을 계승하면서, 이벤트 소싱으로 상태 변화를 추적하는 디지털 환경에 최적화된 구조를 갖는다. 핵심은 **날짜별 기록, 상태 변화 추적, 미완료 태스크의 자동 이관**이다.

### 1.2 핵심 철학

- **의도성(Intentionality)**: 매일 미완료 태스크를 마주하며 "이걸 계속 할 것인가"를 자연스럽게 되묻는 구조
- **단순성**: 불렛저널 원본의 미니멀한 기록 방식을 유지
- **일 단위 관리**: "한 일"과 "할 일"을 가장 중요한 기준으로 삼음

### 1.3 불렛저널에서 차용한 요소

| 불렛저널 원본 | HAJA 적용 |
|---|---|
| Rapid Logging (•, ○, ─) | 태스크의 빠른 추가 (FAB → `AddTaskInput` 모달) |
| Daily Log | 일별 태스크 컨테이너 (캘린더 연동) |
| Migration (월말 이관) | 일별 자동 마이그레이션 (`carryForward`, Lazy 방식) |
| 상태 기호 (•, ×, >, <) | 5단계 Bullet enum + 기하학적 박스 아이콘 |
| State History | 이벤트 소싱 (`_events: TaskEvent[]`) |
| Threading (페이지 번호 연결) | 태스크 상세 화면 (추후 구현) |
| Future Log / Monthly Log | 추후 확장 고려 |

---

## 2. 기술 스택 및 개발 방법론

### 2.1 기술 스택

| 영역 | 기술 |
|------|------|
| 언어 | TypeScript 5.7 |
| UI 프레임워크 | React 19 |
| 라우팅 | React Router v7 (프레임워크 모드, SSR 비활성) |
| 상태관리 | Zustand 5 (미들웨어: devtools → subscribeWithSelector → persist → immer) |
| 빌드 | Vite 6 |
| 스타일링 | Tailwind CSS v4 + shadcn/ui |
| 테스트 | Vitest + React Testing Library |
| 백엔드/인증 | Supabase (Google OAuth) |
| 데이터 페칭 | TanStack React Query 5 |
| 폼/검증 | React Hook Form + Zod |
| 패키지 매니저 | yarn |

### 2.2 아키텍처

레이어 기반 아키텍처 — 기능 역할별 폴더 분리. 의존성은 상위 → 하위 방향만 허용.

```
types → utils → lib → shared → hooks → contexts → components → pages → app
```

상세: `ARCHITECTURE.md` 참조

### 2.3 개발 방법론: 멀티 패러다임

- **객체지향**: `TaskCore` 클래스로 태스크 객체 관리 (상태, 속성, 전이 로직, 이벤트 히스토리 캡슐화)
- **함수형**: 그 외 로직 (마이그레이션, 필터링, 정렬, 렌더링 등)은 순수 함수 패러다임으로 구현

---

## 3. 핵심 데이터 모델

### 3.1 Bullet enum (상태 타입)

```typescript
enum Bullet {
  TODO    = "todo",     // 할 일 — 생성 직후
  ONGOING = "ongoing",  // 할 일 — 진행 중
  DELAY   = "delay",    // 할 일 — 연기
  CANCEL  = "cancel",   // 한 일 — 취소
  DONE    = "done",     // 한 일 — 완료
}
```

### 3.2 TaskEvent (이벤트 소싱)

```typescript
interface TaskEvent {
  date: string;   // ISO 8601 — YYYY-MM-DD
  state: Bullet;
}
```

태스크의 상태 변화 이력을 이벤트 배열로 추적한다. 현재 상태는 `events` 배열의 마지막 항목에서 파생된다.

### 3.3 TaskCore 클래스

```typescript
class TaskCore {
  readonly id: string;              // 유니크 ID (crypto.randomUUID)
  private _title: string;           // 태스크 내용 (한 줄)
  private _note?: string;           // 태스크 상세 내용
  private _type: "task" | "someday"; // 태스크 타입
  readonly createdAt: string;       // 최초 생성일 (불변)
  private _completedAt?: string;    // DONE/CANCEL 시점
  private _events: TaskEvent[];     // 이벤트 히스토리

  // 파생 속성
  get state(): Bullet;              // events 마지막 항목의 state
  get isClosed(): boolean;          // DONE 또는 CANCEL 여부

  // 메서드 (불변 복제 패턴 — 새 인스턴스 반환)
  changeState(state: Bullet, date?: string): TaskCore;
  with(update: Partial<Pick<TaskCore, "title" | "note" | "type">>): TaskCore;
  carryForward(toDate: string): TaskCore;
  shouldCarryForward(referenceDate: string): boolean;
  toJSON(): TaskRecordDTO;
  static from(dto: TaskRecordDTO): TaskCore;
}
```

### 3.4 TaskRecordDTO (직렬화 형식)

```typescript
interface TaskRecordDTO {
  id: string;
  type: "task" | "someday";
  title: string;
  note?: string;
  createdAt: string;
  completedAt?: string;
  events: TaskEvent[];
}
```

### 3.5 속성 설명

| 속성 | 설명 | 비고 |
|---|---|---|
| `id` | 유니크 식별자 | `crypto.randomUUID()` |
| `_title` | 태스크 제목 | 유저 입력, 인라인 편집 가능 |
| `_note` | 상세 내용 | 태스크 상세 화면에서 관리 (추후) |
| `_type` | 태스크 타입 | `"task"` (오늘 할 일) 또는 `"someday"` (언젠가 할 일) |
| `createdAt` | 최초 생성일 | 불변 |
| `_completedAt` | 완료/취소 시점 | DONE 또는 CANCEL 상태일 때만 값 존재 |
| `_events` | 이벤트 히스토리 | 상태 변화를 시간순 배열로 추적 |

> ⚠️ 속성은 추가/삭제될 수 있음. `order`(정렬 순서), `migratedFrom`(이관 이력) 등은 추후 검토.

---

## 4. 상태 전이 시스템

### 4.1 상태 목록

| 상태 | 설명 | 아이콘 컴포넌트 |
|---|---|---|
| `todo` | 할 일 (초기 상태) | `Ico.Todo` |
| `ongoing` | 진행중 | `Ico.Ongoing` |
| `delay` | 연기 | `Ico.Delay` |
| `cancel` | 취소 | `Ico.Cancel` |
| `done` | 완료 | `Ico.Done` |

> 아이콘: `src/components/Ico.tsx` 컴파운드 컴포넌트 (기하학적 박스 변형 SVG)

### 4.2 전이 규칙

**클릭 (불릿 아이콘) — `toggleDone()`**

- `todo` → `done`
- `done` → `todo` (직전 이벤트 기반 복귀)

**롱프레스 (불릿 아이콘, 500ms) → 상태 선택 팝오버 (`PopupContainer`)**

- 모든 상태에서 원하는 상태를 직접 선택 가능

### 4.3 허용 전이 맵

```typescript
const VALID_TRANSITIONS = {
  TODO:    [ONGOING, DELAY, DONE, CANCEL],
  ONGOING: [TODO, DELAY, DONE, CANCEL],
  DELAY:   [TODO, ONGOING, DONE, CANCEL],
  DONE:    [TODO],      // 완료 취소 → 다시 할 일로
  CANCEL:  [TODO],      // 취소 철회 → 다시 할 일로
}
```

### 4.4 상태 전이 다이어그램

```
         ┌─── 클릭 토글 ───┐
         │                  │
         ▼                  ▲
       [todo] ──────────▶ [done]
         │  (롱프레스 팝오버)      ↓ (todo로만 복귀)
         ├──▶ [ongoing] ──────▶ [todo]
         ├──▶ [delay]   ──────▶ [todo]
         └──▶ [cancel]  ──────▶ [todo]

  done / cancel → todo로만 복귀 가능
  ongoing / delay → 모든 상태로 자유 전이 가능
```

### 4.5 이벤트 소싱 기반 히스토리

- 상태 변경 시 `_events` 배열에 새 `TaskEvent`를 추가 (append-only)
- 현재 상태 = `events.at(-1).state`
- 전체 변화 이력을 추적할 수 있음 (1단계 undo/redo가 아닌 전체 히스토리)

---

## 5. 마이그레이션 시스템

### 5.1 핵심 규칙

- **완료(`done`) 또는 취소(`cancel`) 상태가 아닌 모든 태스크는 다음 날로 이관된다.**
- `TaskCore.shouldCarryForward(referenceDate)`: `!isClosed && createdAt < referenceDate` 조건으로 판별

### 5.2 트리거 방식: Lazy Migration

- `useBulletStore.postpone(today)` 호출 시 실행
- 스토어의 전체 태스크를 순회하며 `shouldCarryForward()` 조건에 해당하는 태스크를 `carryForward()`로 이관

### 5.3 며칠 미접속 시 처리

- **직행 이관**: 중간 날짜에 이관 흔적을 남기지 않고, 마지막 접속일 → 오늘 날짜로 직행 이관
- 예: 5/20 마지막 접속 → 5/25 재접속 시, 5/20의 미완료 태스크가 5/25로 직접 이관

### 5.4 마이그레이션 시 변경되는 속성

- `_events` 배열에 새 `TaskEvent` 추가: `{ date: 이관 대상 날짜, state: 현재 상태 }`
- `date` 필드를 갱신하는 방식이 아닌 **이벤트 추가** 방식

### 5.5 예시 시나리오

```
[5월 20일]
  □ 할일-1  (todo, events: [{date: "2025-05-20", state: "todo"}])
  ■ 할일-2  (done)

── 5월 21일 접속 시 postpone("2025-05-21") 실행 ──

할일-1의 events: [
  {date: "2025-05-20", state: "todo"},
  {date: "2025-05-21", state: "todo"}   ← 이관 이벤트 추가
]
```

---

## 6. 화면 및 UX 요건

### 6.1 메인 화면 (일별 태스크 컨테이너)

- 서비스 접속 시 **오늘 날짜**의 태스크 컨테이너가 기본 표시
- 캘린더(`CalendarContainer`)로 날짜 선택 가능 (`useDateStore` 연동)
- 접속 시점에 Lazy Migration 실행

### 6.2 태스크 추가

- **FAB (Floating Action Button)**: `AddBulletBtn` 컴포넌트
- 탭 시 `AddTaskInput` 모달 활성화, 태스크 제목 입력 후 저장
- 생성된 태스크는 `<불릿 아이콘 | 태스크 제목>` 형태로 한 줄씩 스택
- 태스크 타입 선택 가능: `"task"` (오늘 할 일) / `"someday"` (언젠가 할 일)

### 6.3 인터랙션 영역 분리

| 영역 | 클릭 | 더블클릭 | 롱프레스 (500ms) | 드래그 |
|---|---|---|---|---|
| **불릿 아이콘** | `toggleDone()` | — | 상태 선택 팝오버 | — |
| **타이틀 영역** | 인라인 편집 | 태스크 상세 (추후) | 상태 선택 팝오버 | 순서 변경 (추후) |

### 6.4 태스크 정렬

- 기본: 생성순
- 드래그로 순서 변경: **미구현** (F010, 추후 개발)
- **순서는 우선도를 의미하지 않음** (단순 배치 순서)

### 6.5 진행률 표시

- `useProgressStore` 기반 태스크 완료율 계산 (`Progress`, `PieChart` 컴포넌트)
- 전체 태스크 대비 완료 태스크 비율 시각화

---

## 7. 미결정 사항 및 추후 검토

| 항목 | 내용 | 상태 |
|---|---|---|
| ~~중간 날짜 처리~~ | ~~체인 이관 vs 직행 이관~~ | **결정 완료**: 직행 이관 |
| ~~상태 변경 이벤트 로그~~ | ~~previousState 단일 값 vs 이벤트 소싱~~ | **구현 완료**: `_events: TaskEvent[]` |
| 과거 컨테이너 표시 정책 | 이관된 태스크의 흔적을 과거 날짜에 남길지 여부 | 미결정 |
| `migratedFrom` 속성 | 이관 이력 추적 필요 여부 | 미결정 |
| `order` 속성 | 드래그 순서 변경을 위한 정렬 순서 필드 | 미구현 (F010) |
| `delay` 상태 확장 | snooze date (특정 미래 날짜 지정) 기능 | 추후 |
| 태스크 상세 화면 | 클릭 시 진입하는 상세/편집 화면 | 추후 |
| Supabase 연동 | 현재 localStorage 중심, 백엔드 영속화 | 추후 |
| Monthly / Future Log | 불렛저널의 월간/미래 로그 대응 기능 | 추후 |
| Custom Collections | 습관 트래커, 프로젝트별 그룹핑 등 | 추후 |

---

## 8. 구현 현황

| ID | 기능 | 상태 |
|---|---|---|
| F001 | TaskCore 도메인 모델 (이벤트 소싱, 상태 전이) | ✅ 완료 |
| F002 | Zustand 기반 태스크 상태 관리 (localStorage 영속화) | ✅ 완료 |
| F003 | 불렛 리스트 UI (날짜별 목록, 아이콘, 컨텍스트 메뉴) | ✅ 완료 |
| F004 | 태스크 추가 모달 | ✅ 완료 |
| F005 | 캘린더 컴포넌트 (날짜 선택) | ✅ 완료 |
| F006 | Google OAuth 인증 (Supabase Auth) | ✅ 완료 |
| F007 | 진행률 추적 (완료율 계산) | ✅ 완료 |
| F008 | 자동 이관 (carry forward) | ✅ 완료 |
| F010 | 드래그 순서 변경 | ❌ 미구현 |

---

## 9. 버전 히스토리

| 버전 | 날짜 | 내용 |
|---|---|---|
| v0.1 | 2025-04-09 | 초안 작성 — 핵심 데이터 모델, 상태 전이, 마이그레이션, UX 요건 정의 |
| v0.2 | 2026-04-09 | 소스코드 기반 최신화 — 기술 스택, 데이터 모델, 상태 전이, 마이그레이션, UX 갱신 |
