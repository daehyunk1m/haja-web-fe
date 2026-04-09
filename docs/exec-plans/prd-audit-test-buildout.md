# PRD 감사 결과 — 테스트 구축 실행 계획

> 상세 플랜: `.claude/plans/snug-dancing-kay.md`

## 배경

PRD 대비 구현 상태를 감사한 결과:
- F001~F007은 하네스 셋업 전 구현되어 테스트가 거의 없음 (모두 passes: false)
- PRD에 있지만 feature_list.json에 없는 기능 2개 (자동 이관, 드래그 순서 변경)
- 버그 2건 (PopupContainer changeBulletState 미호출, progressStore NaN)
- PRD "시작(START)" 상태 제거 결정 (5상태 유지)

## 작업 목록 (순서대로 실행)

각 Step은 독립 커밋 단위. 완료 시 `yarn build && yarn test && yarn lint` 검증 후 커밋.

### Step 0: PRD 수정 + feature 등록
- `docs/product-specs/PRD.md` L28: "시작" 제거 → `todo / 진행중 / 연기 / 취소 / 완료`
- `feature_list.json`에 F008(자동 이관), F010(드래그 순서 변경) 추가
- 커밋: `docs(types): PRD에서 START 상태 제거 + F008/F010 feature 등록`

### Step 1: F001 TaskCore 테스트
- 생성: `src/shared/TaskCore.test.ts`
- 범위: changeState, with, toJSON/from, isClosed, events 방어적 복사
- 모킹: `vi.spyOn(TaskCore, 'today')`
- 예상: 모두 즉시 Green
- 커밋: `test(shared): F001 TaskCore 도메인 모델 검증 테스트`

### Step 2: F008 자동 이관 테스트
- 파일: `src/shared/TaskCore.test.ts` 내 별도 describe
- 범위: shouldCarryForward, carryForward
- 예상: 모두 즉시 Green
- 커밋: `test(shared): F008 자동 이관 검증 테스트`

### Step 3: F002 bulletStore 테스트
- 생성: `src/shared/bulletStore.test.ts`
- 범위: addBullet, changeBulletState, editBullet, deleteBullet, toggleDone, postpone, persist
- 방식: `useBulletStore.getState()` 직접 호출
- 예상: 모두 즉시 Green
- 커밋: `test(shared): F002 bulletStore 검증 테스트`

### Step 4: F007 progressStore 테스트 + NaN 버그
- 생성: `src/shared/progressStore.test.ts`
- 버그: `progressStore.ts:37` — `tasks.length === 0`일 때 NaN
- 수정: `tasks.length === 0 ? 0 : (countDone / tasks.length) * 100`
- 커밋: `test(shared): F007 progressStore 테스트 + NaN 버그 수정`

### Step 5: F004 AddTaskInput 테스트
- 생성: `src/components/modal/AddTaskInput.test.tsx`
- 범위: 입력 필드, 전송, 모달 닫힘
- 커밋: `test(components): F004 AddTaskInput 검증 테스트`

### Step 6: F003 PopupContainer 테스트 + 버그
- 생성: `src/components/PopupContainer.test.tsx`
- 버그: `PopupContainer.tsx:106-109` — changeBulletState 미호출 (@todo 주석)
- 수정: useBulletStore/useDateStore import + onClick에서 호출
- 커밋: `test(components): F003 PopupContainer 테스트 + changeBulletState 버그 수정`

### Step 7: F005 캘린더 테스트
- 생성: `src/components/CalendarContainer.test.tsx`
- 범위: 렌더링, 날짜 선택
- 커밋: `test(components): F005 캘린더 검증 테스트`

### Step 8: F006 AuthContext 테스트
- 생성: `src/contexts/AuthContext.test.tsx`
- 모킹: `vi.mock('@/lib/supabase')`, `vi.mock('react-router')`
- 커밋: `test(contexts): F006 AuthContext 검증 테스트`

## 완료 조건

- 모든 테스트 통과: `yarn test`
- 빌드 성공: `yarn build`
- 린트 통과: `yarn lint`
- feature_list.json에서 해당 feature `passes: true` 업데이트
- claude-progress.txt TDD STATE 블록 제거 (전체 완료 시)

## 핵심 파일 참조

| 파일 | 역할 |
|------|------|
| `src/shared/TaskCore.ts` | 도메인 모델 (F001, F008) |
| `src/shared/bulletStore.ts` | Zustand 스토어 (F002) |
| `src/shared/progressStore.ts` | 진행률 + NaN 버그 (F007) |
| `src/components/PopupContainer.tsx` | 상태 변경 메뉴 + 버그 (F003) |
| `src/shared/types/taskType.ts` | Bullet enum |
| `src/shared/types/bulletStore.d.ts` | BulletStore 인터페이스 |
