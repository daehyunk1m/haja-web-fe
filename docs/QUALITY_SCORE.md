# 품질 점수표

> 현재 점수: 74 / 100
> 마지막 측정일: 2026-06-11
> 갱신 주기: 주간

## 카테고리별 점수

| 카테고리 | 배점 | 점수 | 기준 |
|----------|------|------|------|
| 타입 안전성 | 20 | 19 | any/unknown 사용 최소화, strict 모드 |
| 테스트 커버리지 | 20 | 9 | 핵심 경로 유닛/통합 테스트 존재 |
| 아키텍처 준수 | 20 | 20 | structural-test 위반 0건 |
| 접근성 | 15 | 5 | 시맨틱 HTML, ARIA, 키보드 네비게이션 |
| 성능 | 15 | 11 | 번들 크기, LCP, 불필요한 리렌더링 |
| 문서 최신성 | 10 | 10 | doc-freshness 경고 0건 |

## 측정 근거 (2026-06-11, 첫 측정)

- **타입 안전성 19/20**: `strict`·`noUnusedLocals`·`noUnusedParameters` 활성, `any` 사용 0건. −1: 수동 타입 선언이 `.d.ts` 형식(src/shared/types/bulletStore.d.ts) — 검사 누락 위험
- **테스트 커버리지 9/20**: 커버리지 도구 없음 → 파일 존재 비율로 측정. 도메인 코어는 탄탄(TaskCore 67·bulletStore 36·progressStore 9 테스트, 총 164 passed). 핵심 경로 파일 기준 6/14 ≈ 43% — hooks 1/5, 스토어 3/6, dateUtils 미커버
- **아키텍처 준수 20/20**: lint:arch 위반 0건
- **접근성 5/15**: 샘플링(TaskItem·ModalContainer·Header) — 시맨틱 태그 미사용(div 중심), 모달에 role="dialog"/aria-modal/포커스 트랩 없음(ESC 닫기는 지원), 클릭 가능 span 키보드 접근 불가, 아이콘 버튼 aria-label 없음
- **성능 11/15**: 빌드 성공, 최대 청크 gzip 78.5KB·라우트별 코드 스플리팅 동작. 감점: 렌더마다 실행되는 console.log(ui/calendar.tsx:21), 실험 라우트(/test·/mcp) 번들 포함
- **문서 최신성 10/10**: 하네스 정리(2026-06-11)에서 ARCHITECTURE.md 갱신 → 경고 0건

## 알려진 이슈

- ModalContainer keydown 리스너 누수 — body에 등록 후 window에서 제거 (TECH_DEBT 높음)
- 실험용 코드가 프로덕션 라우트(/test, /mcp)에 노출 (TECH_DEBT 높음)
- 활성 console.log 6곳 (TECH_DEBT 보통, no-console 승격 후보)
