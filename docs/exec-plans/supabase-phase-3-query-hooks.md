# Phase 3: React Query 훅 (bulletStore 대체)

## 목표

`bulletStore`의 태스크 CRUD 로직을 React Query 커스텀 훅으로 대체한다. Optimistic update로 즉각적인 UI 반응을 유지한다.

## 선행 조건

- Phase 2 완료 (taskRepository 존재)

## 생성 파일

### 3-1. `src/hooks/useTasks.ts` — 태스크 쿼리

```typescript
export function useTasks(dateString: string) {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskRepository.fetchTasks(),
    select: (dtos) => {
      // TaskRecordDTO[] → TaskCore[] 변환
      // 날짜별 필터 (기존 SectionList의 필터 로직)
      // type별 분류
    },
  });
}
```

**기존 SectionList 필터 로직 이전:**
```typescript
// 현재 SectionList.tsx:36-43
(task) =>
  task.type === "someday" ||
  (!task.completedAt ? task.createdAt === dateString : task.completedAt === dateString) ||
  task.shouldCarryForward(dateString)
```

### 3-2. `src/hooks/useTaskMutations.ts` — 뮤테이션 훅 모음

| 훅 | bulletStore 대응 | 핵심 로직 |
|----|-----------------|----------|
| `useAddTask()` | `addBullet` | `new TaskCore(title, option)` → repo.upsertTask |
| `useEditTask()` | `editBullet` | `task.with(payload)` → repo.upsertTask |
| `useDeleteTask()` | `deleteBullet` | repo.deleteTask + taskOrder 정리 |
| `useToggleDone()` | `toggleDone` | 이전 상태 추론 로직 포함 |
| `useChangeTaskState()` | `changeBulletState` | `task.changeState(next, date, force)` |
| `usePostpone()` | `postpone` | 일괄 `shouldCarryForward` → `carryForward` |

**Optimistic Update 패턴 (공통):**
```typescript
useMutation({
  mutationFn: async (params) => {
    const dto = /* TaskCore 로직으로 새 DTO 생성 */;
    await taskRepository.upsertTask(dto);
    return dto;
  },
  onMutate: async (params) => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    const previous = queryClient.getQueryData(['tasks']);
    queryClient.setQueryData(['tasks'], (old) => /* 낙관적 업데이트 */);
    return { previous };
  },
  onError: (err, params, context) => {
    queryClient.setQueryData(['tasks'], context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
})
```

### 3-3. `src/hooks/useTaskOrder.ts` — 순서 쿼리 + 리오더

```typescript
export function useTaskOrder(dateString: string, type: "task" | "someday") {
  const orderKey = buildOrderKey(dateString, type);
  return useQuery({
    queryKey: ['taskOrder'],
    queryFn: () => taskRepository.fetchTaskOrders(),
    select: (orders) => orders[orderKey] ?? [],
  });
}

export function useReorderTasks() {
  return useMutation({
    mutationFn: ({ orderKey, orderedIds }) =>
      taskRepository.upsertTaskOrder(orderKey, orderedIds),
    // optimistic update...
  });
}
```

## bulletStore에서 이전해야 할 비즈니스 로직

### toggleDone 상태 추론 (`bulletStore.ts:61-74`)
```typescript
const lastState =
  task.state === Bullet.TODO
    ? Bullet.DONE
    : task.isClosed
      ? Bullet.TODO
      : (task.events.at(-2) ?? task.events[0]).state;
```

### postpone 일괄 이관 (`bulletStore.ts:85-98`)
```typescript
tasks.forEach((task, id) => {
  if (task.shouldCarryForward(today)) {
    task.carryForward(today);
  }
});
```

### deleteBullet의 taskOrder 정리 (`bulletStore.ts:49-55`)
```typescript
for (const key in state.taskOrder) {
  const arr = state.taskOrder[key];
  const idx = arr.indexOf(id);
  if (idx !== -1) arr.splice(idx, 1);
}
```

## 테스트

- 각 mutation 훅별 단위 테스트
- optimistic update + rollback 시나리오
- toggleDone 상태 추론 정확성

## 검증

1. `yarn test` — 신규 테스트 전부 통과
2. `yarn build` — 타입 에러 없음
