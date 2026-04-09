# ARCHITECTURE.md

## 아키텍처 유형

**레이어 기반 아키텍처** — 기능 역할별 폴더 분리. 의존성은 상위 레이어에서 하위 레이어 방향으로만 허용된다.

---

## 의존성 방향

```
types → utils → lib → shared → hooks → contexts → components → pages → app
```

각 레이어는 자신보다 왼쪽(하위)에 위치한 레이어만 import할 수 있다. 같은 레이어 내 import는 허용된다.

---

## 폴더별 역할

| 폴더 | 역할 | 상태 |
|------|------|------|
| `src/shared/types/` | 공유 타입, enum, interface | ✅ 존재 |
| `src/utils/` | 순수 유틸리티 함수 (dateUtils 등) | ✅ 존재 |
| `src/lib/` | 외부 서비스 초기화 (Supabase 클라이언트, cn 유틸) | ✅ 존재 |
| `src/shared/` | 도메인 모델(TaskCore) + Zustand 스토어 | ✅ 존재 |
| `src/hooks/` | React 커스텀 훅 (useAuth, useBulletSection 등) | ✅ 존재 |
| `src/contexts/` | React Context (AuthContext) | ✅ 존재 |
| `src/components/` | UI 컴포넌트 | ✅ 존재 |
| `src/components/ui/` | shadcn/ui 기반 공통 컴포넌트 | ✅ 존재 |
| `src/components/bulletList/` | 불렛 리스트 관련 컴포넌트 | ✅ 존재 |
| `src/components/modal/` | 모달 컴포넌트 | ✅ 존재 |
| `src/pages/` | 라우트별 페이지 | ✅ 존재 |
| `src/app/` | 앱 진입점, 라우트 설정 | ✅ 존재 |
| `src/test/` | 테스트 파일 | ✅ 존재 |
| `src/assets/` | 정적 자산 | ✅ 존재 |

---

## 의존성 규칙 상세

| 레이어 | import 가능 대상 |
|--------|----------------|
| types | (없음) |
| utils | types |
| lib | types |
| shared | types, utils, lib |
| hooks | types, utils, lib, shared |
| contexts | types, lib, shared, hooks |
| components | types, utils, lib, shared, hooks |
| pages | types, utils, lib, shared, hooks, contexts, components |
| app | types, utils, lib, shared, hooks, contexts, components, pages |

---

## 추가 규칙

- `components/ui/`는 shared 스토어를 직접 import하지 않는다 (훅을 통해서만 접근)
- `pages/`는 비즈니스 로직을 직접 포함하지 않는다
- MVP 완료 후 FSD(Feature-Sliced Design) 아키텍처로 리팩토링 검토 예정
- Path alias `@/`를 사용하여 import한다 (상대 경로는 같은 폴더 내에서만)

---

## 상태 관리

- **도구**: Zustand 5
- **스토어 위치**: `src/shared/`
- **미들웨어 스택**: `devtools → subscribeWithSelector → persist → immer`
- **영속화 키**: `localBullets` (localStorage)
- **접근 규칙**: selector 함수 사용 권장

---

## 데이터 계층

- **Provider**: Supabase
- **클라이언트 위치**: `src/lib/supabase.ts`
- **인증**: Google OAuth
- **인증 위치**: `src/contexts/AuthContext.tsx` + `src/hooks/useAuth.ts`
- **현재 상태**: localStorage 중심, 백엔드 연동 준비 중

---

## 도메인 규칙

- **모델**: `TaskCore` 클래스 (`src/shared/TaskCore.ts`)
- **패턴**: 불변 복제 (immutable-copy) — `with()` 메서드로 새 인스턴스 반환
- **상태 전이**: `TODO → ONGOING → DELAY → CANCEL / DONE`
- **이벤트 소싱**: `_events: TaskEvent[]`로 상태 변화 이력 추적
- **직렬화**: `toJSON()` / `TaskCore.from(dto)`

---

## 라우팅

- **프레임워크**: React Router v7 (프레임워크 모드, SSR 비활성)
- **라우트 정의**: `src/routes.ts`
- **진입점**: `src/entry.client.tsx`
