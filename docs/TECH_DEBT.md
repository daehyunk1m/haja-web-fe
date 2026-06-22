# 기술 부채 관리

> 마지막 업데이트: 2026-06-11 (하네스 정리 W+B)

## 긴급 (Critical)
<!-- 즉시 수정 필요 — 기능 장애, 보안 취약점, 데이터 손실 위험 -->

## 높음 (High)
<!-- 다음 스프린트 내 수정 권장 — 성능 저하, 아키텍처 위반, 테스트 누락 -->

- [ ] **ModalContainer keydown 리스너 누수** — `document.body.addEventListener`로 등록하고 전역 `removeEventListener`(window 대상)로 제거해 핸들러가 해제되지 않는다. 모달을 여닫을 때마다 리스너 누적 (`src/components/modal/ModalContainer.tsx:11-14`). 발견: 하네스 정리 2026-06-11
- [ ] **실험용 코드가 프로덕션 라우트에 노출** — `/test`(pages/Test.tsx + components/Test.tsx + shared/storesZustand.ts), `/mcp`(components/FigmaTest.tsx) 총 317줄이 routes.ts에 연결되어 번들에 포함. storesZustand.ts는 자체 주석으로 "공부를 위한 임시 스토어" 명시 + 모듈 로드 시 subscribe 리스너 실행. 라우트 제거 = 동작 변경이므로 TDD 사이클로 제거 권장. 발견: 하네스 정리 2026-06-11

## 보통 (Medium)
<!-- 여유 있을 때 수정 — 코드 중복, 네이밍 불일치, 타입 불완전 -->

- [ ] **활성 console.log 6곳** — addModalStore.ts:23, Title.tsx:14, TaskItem.tsx:29, BulletIcon.tsx:85, ui/calendar.tsx:21(렌더마다 실행), Login.tsx:26. ESLint `no-console` 승격으로 재발 방지 가능 (승격 대기 큐 참조). 발견: 하네스 정리 2026-06-11
- [ ] **미사용 의존성 후보 5건** — `lodash-es`·`react-hook-form`·`zod`(소스 import 0건), `@react-router/node`·`isbot`(RR7 프레임워크 모드 부속 — SPA 모드라 미사용 추정, 제거 전 dev/build 검증 필요). 의존성 제거는 사용자 확인 필수 (CLAUDE.md). 발견: 하네스 정리 2026-06-11
- [ ] **ESLint 경고 4건** — useEffect deps 누락(App.tsx:20 `setDate`, TaskItem.tsx:75 `title`), react-refresh/only-export-components(ui/button.tsx:59, contexts/AuthContext.tsx:16). 발견: 하네스 정리 2026-06-11

## 낮음 (Low)
<!-- 장기 개선 과제 — 리팩터링 기회, 의존성 업그레이드, DX 개선 -->

- [ ] **테스트 파일 300줄 초과 2건** — TaskCore.test.ts(501줄), bulletStore.test.ts(392줄). describe 단위 분할 검토. 발견: 하네스 정리 2026-06-11
- [ ] **수동 타입 선언이 .d.ts 형식** — src/shared/types/bulletStore.d.ts. 일반 `.ts`로 전환 검토 (skipLibCheck 환경에서 타입 검사 누락 위험). 발견: 하네스 정리 2026-06-11
- [ ] **stale TODO** — pages/Login.tsx:25 "네이버 로그인 구현". feature_list 백로그로 이관 검토. 발견: 하네스 정리 2026-06-11

## 리팩터링 대상

| 파일/모듈 | 문제 | 심각도 | 비고 |
|-----------|------|--------|------|
| src/shared/storesZustand.ts | 학습용 임시 스토어 + 주석 코드 블록 다수(10줄+) | 높음 | "실험용 코드 노출" 항목과 함께 제거 |

## 자동 검사 승격 대기 큐

<!-- 문서에만 있고 자동 검사기가 없는 규칙. 리뷰에서 2회 이상 반복 지적되면 자동 검사(ESLint 규칙, structural-test 확장, 테스트)로 승격한다 -->

| 지적 규칙 | 횟수 | 최근 지적일 | 관련 feature | 제안 검사 방법 | 상태 |
|-----------|------|------------|--------------|----------------|------|
| console.log 잔존 금지 | 1 | 2026-06-11 | — (하네스 정리) | ESLint `no-console` (warn, allow: ["warn", "error"]) | 대기 |
