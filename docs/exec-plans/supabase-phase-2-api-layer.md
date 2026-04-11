# Phase 2: API 서비스 레이어 + Repository

## 목표

Supabase CRUD 함수를 순수 함수로 분리하고, 인증 상태에 따라 Supabase/localStorage로 분기하는 Repository 패턴을 구현한다.

## 선행 조건

- Phase 0 완료 (Auth, React Query 셋업)
- Phase 1 완료 (Supabase 테이블 존재)

## 생성 파일

### 2-1. `src/lib/authState.ts` — userId accessor

```typescript
let _userId: string | null = null;
export const setCurrentUserId = (id: string | null) => { _userId = id; };
export const getCurrentUserId = () => _userId;
```

- AuthProvider 또는 sync 초기화 훅에서 `setCurrentUserId` 호출
- Store/Repository에서 `getCurrentUserId`로 읽기
- `lib` 레이어 → `shared`에서 import 가능

### 2-2. `src/lib/taskApi.ts` — Supabase CRUD

```typescript
fetchTasks(userId: string): Promise<TaskRecordDTO[]>
upsertTask(userId: string, dto: TaskRecordDTO): Promise<void>
upsertTasks(userId: string, dtos: TaskRecordDTO[]): Promise<void>
deleteTask(userId: string, taskId: string): Promise<void>
fetchTaskOrders(userId: string): Promise<Record<string, string[]>>
upsertTaskOrder(userId: string, orderKey: string, orderedIds: string[]): Promise<void>
```

**Row ↔ DTO 변환 함수:**
```typescript
function toRow(userId: string, dto: TaskRecordDTO): TaskRow
function fromRow(row: TaskRow): TaskRecordDTO
```

### 2-3. `src/lib/localTaskStorage.ts` — localStorage 어댑터

기존 `bulletStore`의 persist 로직을 독립 모듈로 추출:

```typescript
fetchTasks(): Promise<TaskRecordDTO[]>        // localStorage에서 읽기
upsertTask(dto: TaskRecordDTO): Promise<void>  // localStorage에 쓰기
upsertTasks(dtos: TaskRecordDTO[]): Promise<void>
deleteTask(taskId: string): Promise<void>
fetchTaskOrders(): Promise<Record<string, string[]>>
upsertTaskOrder(orderKey: string, orderedIds: string[]): Promise<void>
```

- localStorage 키: `"localBullets"` (변경 없음)
- 기존 직렬화 형식과 호환

### 2-4. `src/lib/taskRepository.ts` — 분기 라우터

```typescript
import { getCurrentUserId } from './authState';
import * as remote from './taskApi';
import * as local from './localTaskStorage';

export const taskRepository = {
  fetchTasks: () => {
    const userId = getCurrentUserId();
    return userId ? remote.fetchTasks(userId) : local.fetchTasks();
  },
  // ... 동일 패턴
};
```

## 레이어 규칙 검증

```
lib/authState.ts       ← lib 레이어
lib/taskApi.ts         ← lib 레이어 (supabase.ts import)
lib/localTaskStorage.ts ← lib 레이어
lib/taskRepository.ts  ← lib 레이어 (authState, taskApi, localTaskStorage import)
```

모두 `lib` 레이어 내부 → 아키텍처 규칙 위반 없음.

## 테스트

- `src/lib/taskApi.test.ts` — Supabase client mock으로 단위 테스트
- `src/lib/localTaskStorage.test.ts` — localStorage mock으로 단위 테스트
- `src/lib/taskRepository.test.ts` — authState mock으로 분기 로직 테스트

## 검증

1. `yarn test` — 신규 테스트 전부 통과
2. `yarn build` — 타입 에러 없음
3. `yarn lint:arch` — 레이어 위반 없음
