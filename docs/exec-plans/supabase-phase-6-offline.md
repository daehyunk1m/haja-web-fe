# Phase 6: 오프라인 지원

## 목표

네트워크 단절 시 localStorage로 fallback하고, 복구 시 서버와 재동기화한다.

## 선행 조건

- Phase 5 완료

## 생성 파일

### `src/hooks/useOnlineStatus.ts`

```typescript
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

## 동작

1. **오프라인 감지**: `navigator.onLine === false`
2. **Repository 자동 분기**: `getCurrentUserId()`를 null로 설정 → localStorage로 fallback
   - 또는 Repository에 `isOnline` 파라미터 추가
3. **온라인 복귀**: `queryClient.invalidateQueries()` 호출 → 서버와 재동기화
4. **UI 표시** (선택): 오프라인 배너 표시

## 동기화 전략

온라인 복귀 시:
1. 서버에서 최신 데이터 fetch
2. 로컬 변경사항과 merge (events 배열 길이 비교)
3. merge 결과를 서버에 push

## 검증

1. DevTools → Network → Offline 체크
2. 태스크 추가/수정 → localStorage에 저장 확인
3. Online으로 전환
4. Supabase Dashboard에서 오프라인 변경사항 반영 확인
