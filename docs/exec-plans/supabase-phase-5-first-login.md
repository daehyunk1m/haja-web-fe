# Phase 5: 최초 로그인 localStorage → Supabase 마이그레이션

## 목표

미인증 상태에서 localStorage에 쌓인 태스크 데이터를 최초 로그인 시 Supabase에 push한다.

## 선행 조건

- Phase 4 완료 (React Query 기반 동작)

## 로직

```
앱 시작
  ↓
인증 상태 확인
  ↓
인증됨 + localStorage에 "localBullets_migrated" 없음?
  ├─ YES → localStorage에서 태스크 읽기 → Supabase에 upsert → 플래그 설정
  └─ NO  → 정상 동작
```

### 구현 위치

`src/hooks/useSyncInit.ts` (또는 기존 훅에 통합)

```typescript
const MIGRATION_KEY = 'localBullets_migrated';

useEffect(() => {
  if (!user) return;
  if (localStorage.getItem(MIGRATION_KEY)) return;

  const raw = localStorage.getItem('localBullets');
  if (!raw) { localStorage.setItem(MIGRATION_KEY, 'true'); return; }

  const { state } = JSON.parse(raw);
  const dtos: TaskRecordDTO[] = state?.tasks ?? [];

  if (dtos.length > 0) {
    taskApi.upsertTasks(user.id, dtos)
      .then(() => localStorage.setItem(MIGRATION_KEY, 'true'));
  } else {
    localStorage.setItem(MIGRATION_KEY, 'true');
  }
}, [user]);
```

## 주의사항

- `"localBullets"` 키는 변경하지 않음
- 마이그레이션 플래그는 별도 키 `"localBullets_migrated"`
- 서버에 이미 데이터가 있으면 upsert로 처리 (중복 안전)

## 검증

1. 로그아웃 상태에서 태스크 3개 추가
2. Google 로그인
3. Supabase Dashboard에서 3개 태스크 확인
4. 새 탭에서 로그인 → 3개 태스크 표시
5. `"localBullets_migrated"` 플래그 존재 확인
