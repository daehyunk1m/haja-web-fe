# Phase 1: Supabase 스키마 + RLS

## 목표

Supabase에 `tasks`와 `task_order` 테이블을 생성하고 RLS 정책을 적용한다.

## 선행 조건

- Phase 0 완료 (Auth 통합, docs/private/ 인프라)

## 작업 목록

### 1-1. tasks 테이블

```sql
CREATE TABLE tasks (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('task', 'someday')),
  title        TEXT NOT NULL,
  note         TEXT,
  created_at   TEXT NOT NULL,          -- "YYYY-MM-DD" (TaskCore.createdAt 형식 유지)
  completed_at TEXT,                   -- "YYYY-MM-DD" or null
  events       JSONB NOT NULL,         -- TaskEvent[] 배열
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_events CHECK (jsonb_typeof(events) = 'array')
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_updated_at ON tasks(user_id, updated_at);
```

**설계 근거:**
- events를 JSONB 컬럼으로 저장 — 태스크와 항상 함께 읽히고, 독립 쿼리 불필요
- created_at/completed_at을 TEXT로 — TaskRecordDTO와 1:1 매칭, 변환 불필요
- updated_at을 TIMESTAMPTZ — 충돌 해결(Last-Write-Wins)에 사용

### 1-2. task_order 테이블

```sql
CREATE TABLE task_order (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_key   TEXT NOT NULL,           -- "YYYY-MM-DD|task" or "YYYY-MM-DD|someday"
  ordered_ids UUID[] NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, order_key)
);
```

### 1-3. RLS 정책

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_order ENABLE ROW LEVEL SECURITY;

-- tasks
CREATE POLICY "select_own" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- task_order
CREATE POLICY "select_own" ON task_order FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON task_order FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON task_order FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own" ON task_order FOR DELETE USING (auth.uid() = user_id);
```

### 1-4. DTO ↔ Row 매핑

| TaskRecordDTO | tasks row | 비고 |
|--------------|-----------|------|
| id | id | UUID 그대로 |
| type | type | "task" / "someday" |
| title | title | |
| note | note | undefined → null |
| createdAt | created_at | camelCase → snake_case |
| completedAt | completed_at | undefined → null |
| events | events | JSON 자동 변환 |

## 주의사항

- **사용자 승인 필요** (CLAUDE.md 보수적 접근 대상)
- 모든 SQL은 `docs/private/supabase-schema.sql`에 기록
- Supabase Dashboard의 SQL Editor에서 실행

## 검증

1. Supabase Dashboard → Table Editor에서 두 테이블 확인
2. RLS 활성 상태 확인
3. 테스트: 로그인한 사용자로 INSERT → SELECT → 다른 사용자로 SELECT 시 빈 결과
