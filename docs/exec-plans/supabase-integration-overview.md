# Supabase 백엔드 연동 — 전체 개요

## 목표

서버 상태(React Query)와 클라이언트 상태(Zustand)를 분리하고, 태스크 데이터를 Supabase에 영속화한다.

## 핵심 설계 결정

1. **상태 분리**: `bulletStore` 제거 → React Query(서버) + Zustand(클라이언트 UI)
2. **Repository 패턴**: 인증 여부에 따라 Supabase/localStorage 자동 분기
3. **문서 보안**: SQL/스키마는 `docs/private/`에 저장 (git 미추적)

## Phase 목록

| Phase | 문서 | 목표 | 상태 |
|-------|------|------|------|
| 0 | [phase-0-infra.md](./supabase-phase-0-infra.md) | Auth 통합 + React Query 셋업 + 문서 인프라 | 미시작 |
| 1 | [phase-1-schema.md](./supabase-phase-1-schema.md) | Supabase 테이블 + RLS 정책 생성 | 미시작 |
| 2 | [phase-2-api-layer.md](./supabase-phase-2-api-layer.md) | API 서비스 레이어 + Repository 패턴 | 미시작 |
| 3 | [phase-3-query-hooks.md](./supabase-phase-3-query-hooks.md) | React Query 훅 (bulletStore 대체) | 미시작 |
| 4 | [phase-4-migration.md](./supabase-phase-4-migration.md) | 컴포넌트 마이그레이션 + bulletStore 제거 | 미시작 |
| 5 | [phase-5-first-login.md](./supabase-phase-5-first-login.md) | 최초 로그인 시 localStorage → Supabase 마이그레이션 | 미시작 |
| 6 | [phase-6-offline.md](./supabase-phase-6-offline.md) | 오프라인 지원 | 미시작 |

## 아키텍처 다이어그램

```
┌─────────────────────────────────────────────┐
│              UI Components                   │
│  useTasks(), useAddTask(), useToggleDone()   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           React Query (서버 상태)             │
│  쿼리 캐시 + optimistic update + refetch     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          TaskRepository (분기)               │
│  인증됨 → Supabase  /  미인증 → localStorage │
└──────┬──────────────────────┬───────────────┘
       │                      │
┌──────▼──────┐       ┌──────▼──────┐
│  Supabase   │       │ localStorage│
│  (tasks,    │       │ (localBullets)
│  task_order)│       │             │
└─────────────┘       └─────────────┘

┌─────────────────────────────────────────────┐
│        Zustand (클라이언트 UI 상태)           │
│  dateStore, popupStore, addModalStore,       │
│  progressStore                               │
└─────────────────────────────────────────────┘
```

## 하지 않는 것

- `"localBullets"` localStorage 키 변경하지 않음
- TaskCore 불변성 패턴 변경하지 않음
- Supabase Realtime 구독 사용하지 않음
- SQL/스키마를 git에 추적하지 않음
