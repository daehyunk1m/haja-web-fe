# Phase 4: 컴포넌트 마이그레이션 + bulletStore 제거

## 목표

모든 컴포넌트에서 `useBulletStore` 호출을 Phase 3에서 만든 React Query 훅으로 교체하고, `bulletStore.ts`를 제거한다.

## 선행 조건

- Phase 3 완료 (React Query 훅 존재)

## 변경 파일

### 4-1. `src/components/bulletList/SectionList.tsx`

**Before:**
```typescript
const tasksMap = useBulletStore((state) => state.tasks);
const postpone = useBulletStore((state) => state.postpone);
```

**After:**
```typescript
const { data: tasks } = useTasks(dateString);
const { mutate: postpone } = usePostpone();
```

- `useMemo` 필터 로직 → `useTasks`의 `select` 옵션으로 이동
- `useOrderedTasks` 훅도 React Query 기반 `useTaskOrder`로 교체

### 4-2. `src/components/TaskItem.tsx`

**Before:** `useBulletStore((state) => state.deleteBullet)`
**After:** `useDeleteTask().mutate`

### 4-3. `src/components/BulletIcon.tsx`

**Before:** `useBulletStore` → `toggleDone`, `changeBulletState`
**After:** `useToggleDone().mutate`, `useChangeTaskState().mutate`

### 4-4. `src/components/PopupContainer.tsx`

**Before:** `useBulletStore` → `changeBulletState`, `editBullet`, `tasks.get(targetId)`
**After:** React Query 훅 + 캐시에서 태스크 조회

### 4-5. `src/components/modal/AddTaskInput.tsx`

**Before:** `useBulletStore((state) => state.addBullet)`
**After:** `useAddTask().mutate`

### 4-6. `src/hooks/useOrderedTasks.ts`

**Before:** `useBulletStore((state) => state.taskOrder)`, `useBulletStore((state) => state.reorderTasks)`
**After:** `useTaskOrder()`, `useReorderTasks()`

### 4-7. `src/shared/bulletStore.ts` — 제거

모든 참조가 제거되면 파일 삭제. 관련 파일:
- `src/shared/types/bulletStore.d.ts` — 제거
- `src/hooks/useTaskStoreHydrated.ts` — 제거 (React Query가 로딩 상태 관리)

### 4-8. `src/shared/progressStore.ts` — 업데이트

기존에 `SectionList`에서 `setSelectedTasks(tasks)`를 호출하던 패턴 유지.
React Query의 `useTasks` 결과를 그대로 전달.

## 테스트

- 기존 bulletStore 테스트 → React Query 훅 테스트로 대체
- 컴포넌트 테스트: 기존 동작 그대로 유지되는지 확인
- E2E: 태스크 CRUD, 드래그, 팝오버, 캘린더 날짜 변경 전부 테스트

## 검증

1. `yarn build && yarn test && yarn lint` 통과
2. `yarn lint:arch` — 레이어 위반 없음
3. 브라우저에서 전체 기능 수동 테스트:
   - 태스크 추가/편집/삭제
   - 완료 토글 + 팝오버 상태 변경
   - 드래그 순서 변경
   - 캘린더 날짜 변경
   - Someday 컨테이너
4. `useBulletStore` import가 코드베이스에 0건인지 grep 확인
