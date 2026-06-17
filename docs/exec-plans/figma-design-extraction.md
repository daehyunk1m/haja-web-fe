# Figma → design.md 디자인 토큰 추출 파이프라인 — 실행 계획

> 상태: **미시작 (방향 합의 2026-06-17)**. design.md 본체가 아니라 "추출 방법"의 계획이다.

## 배경 / 동기

- **드리프트 사례**: 삭제 확인 모달(`ConfirmDialog`) 버튼에 그림자가 보임. 출처는 shadcn/ui `Button` variant 기본값 `shadow-xs` — HAJA의 플랫·테두리 기반·흑백 언어와 충돌. 현재 `shadow-*`는 `src/components/ui/`(shadcn 생성물) + `PopupContainer.tsx`(shadow-sm)에만 존재.
- **근본 원인**: 디자인 진실 소스가 Figma에만 있고, 코드는 1회성 수작업 복제(`FigmaTest.tsx`, `/mcp` 라우트 — TECH_DEBT 제거 대기)다. 비교 기준이 되는 디자인 명세가 레포에 없다(`docs/design-docs/`엔 architecture-decisions.md뿐).

## 결정 (소유권)

- **Figma = 디자인 언어의 진실 소스.**
- **`design.md` + `tokens.json` = Figma에서 추출된 산출물** (손으로 작성하지 않는다 — 또 다른 진실 소스가 생기면 드리프트).
- **하네스 = 명세 집행자**(규정 주체 아님). 추출된 명세 기준으로 저비용 드리프트 가드만 담당.

## 목표

- Figma 파일에서 디자인 토큰(색·타이포·스페이싱·radius·**effect/shadow**)을 추출해 `tokens.json` + 사람 가독 `design.md`를 **재생성**한다.
- "재생성 → git diff"로 디자인 드리프트를 감지 가능하게 만든다.

## 비목표

- design.md 수작업 작성. 픽셀퍼펙트 코드 생성(토큰·명세만 다룬다). `FigmaTest.tsx` 정리(TECH_DEBT에서 별도 처리).

## 접근 선택지

| 옵션 | 방식 | 적합성 |
|------|------|--------|
| **A. Figma REST API + PAT** ⭐ | 스크립트로 paint/text/effect 스타일 추출 → `tokens.json`+`design.md` 재생성 | **재현·CI 가능 → 무드리프트 목적에 최적.** Styles API는 전 플랜 가능(Variables API만 Enterprise 전용) |
| B. Figma Dev Mode MCP | 로컬 MCP, 프레임 선택→토큰/코드 | 인터랙티브엔 좋으나 무인 재생성엔 약함. Figma 데스크톱 + seat 필요 |
| C. 커뮤니티 MCP (Framelink) | 토큰 기반 MCP | 중간 |

**권장: A.**

## 단계 (Option A 기준)

1. **준비물**: Figma file key(파일 URL에서) + 읽기전용 **PAT**. 토큰은 `.env`(미추적)에 `FIGMA_TOKEN`으로 저장 — 커밋 금지.
2. **추출 스크립트** `scripts/extract-figma-tokens.ts` (Node):
   - `GET /v1/files/:key/styles` → 스타일 메타(paint/text/effect 목록)
   - `GET /v1/files/:key/nodes?ids=...` → 각 스타일 노드의 실제 값(색 hex, 폰트/사이즈/웨이트, effect=그림자 등)
   - (Enterprise 한정) `GET /v1/files/:key/variables/local` → Variables 컬렉션
3. **변환**: Figma 스타일 → `tokens.json` (colors, typography scale, radius, spacing, `effects[]`).
4. **생성**: `tokens.json` → `docs/design-docs/design.md`(사람 가독 명세) + (선택) Tailwind `@theme` 매핑.
5. **드리프트 가드(하네스 연계)**: design.md의 `effects`가 비어 있으면(= 무그림자 언어) `shadow-*` 사용을 ESLint/structural 검사로 금지(`ui/` 포함 override). TECH_DEBT의 "자동 검사 승격 대기 큐"에 등록 후 승격.
6. **운영**: 디자인 변경 시 스크립트 재실행 → `git diff`로 토큰 변화 리뷰 → 커밋.

## 산출물

- `scripts/extract-figma-tokens.ts`
- `tokens.json`
- `docs/design-docs/design.md`
- (선택) ESLint 규칙 / structural test (shadow 금지 가드)

## 리스크 / 주의

- **Variables API는 Enterprise 전용** → 일반 플랜은 Styles API(paint/text/effect)로 우회.
- **PAT 보안**: `.env` 미추적, 커밋 금지(기존 보안 원칙).
- Figma 파일이 **published 스타일/변수로 정리**돼 있어야 추출 품질이 좋다(임의 레이어면 한계).
- shadcn `ui/` 컴포넌트는 기본값(shadow/radius/ring)이 들어오므로, 가드는 `ui/`의 기본값 override까지 포함해야 일관성이 선다.

## 참고

- 관련 결정: 메모리 `project_design_source_of_truth`
- 하네스 개선을 원본 레포 이슈로 추적하는 패턴(브라우저 테스트 #12, 의도 원장 #15)과 동류 — 필요 시 `harness-setup-initializer`에 이슈화.
