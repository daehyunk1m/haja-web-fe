# Phase 0: 인프라 정비

## 목표

기존 인증 인프라를 앱에 통합하고, React Query를 셋업하고, 문서/보안 인프라를 구성한다.

## 선행 조건

없음 (첫 번째 Phase)

## 작업 목록

### 0-1. Auth 통합

**문제:** AuthProvider, ProtectedRoute, AuthCallback이 존재하지만 앱에 연결되지 않음.
- `App.tsx`에서 `useAuth()` 직접 호출 중 (AuthProvider 밖에서)
- `redirectTo`가 Supabase 콜백 URL을 가리킴 (앱 콜백 아님)

**변경:**

| 파일 | 변경 내용 |
|------|----------|
| `src/root.tsx` | `<Outlet />`을 `<AuthProvider>`로 래핑 |
| `src/App.tsx` | `useAuth()` → `useAuthContext()` 교체, 디버그 UI(`user.email`, `avatar`) 정리 |
| `src/hooks/useAuth.ts` | `redirectTo` → `${window.location.origin}/auth/callback`으로 수정 |

**현재 코드 참조:**

`src/root.tsx:24-26`:
```tsx
export default function Root() {
  return <Outlet />;
}
```

`src/App.tsx:32-36`:
```tsx
const { user } = useAuth();  // ← AuthProvider 밖에서 직접 호출
return (
  <Container>
    <div>안녕하세요{user?.email}님</div>
    <img src={user?.user_metadata?.avatar_url} alt='' />
```

`src/hooks/useAuth.ts:71`:
```tsx
redirectTo: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`,
// ↑ Supabase 서버 콜백. 앱 콜백으로 변경 필요
```

### 0-2. 문서/보안 인프라

| 작업 | 내용 |
|------|------|
| `docs/private/` 생성 | SQL, 스키마, RLS 정책 저장용 |
| `.gitignore` 추가 | `docs/private/` 항목 |
| `docs/private/supabase-schema.sql` | 빈 파일 또는 Phase 1 스키마 초안 |

### 0-3. React Query 셋업

**생성 파일:** `src/lib/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5분
      gcTime: 1000 * 60 * 30,       // 30분
      retry: 2,
      refetchOnWindowFocus: true,    // 멀티 디바이스 동기화
    },
  },
});
```

**변경 파일:** `src/root.tsx` — `<QueryClientProvider client={queryClient}>` 추가

## 검증

1. `yarn build && yarn test && yarn lint` 통과
2. Google 로그인 → `useAuthContext()`로 user 데이터 접근 가능 확인
3. React Query DevTools 표시 확인 (개발 환경)
4. `docs/private/`가 `git status`에 나타나지 않음 확인

## 커밋 단위

- `feat(auth): wire AuthProvider into app root and fix OAuth redirect`
- `chore(config): add docs/private to gitignore for sensitive infra docs`
- `feat(lib): add React Query provider and client configuration`
