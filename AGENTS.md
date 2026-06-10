# AGENTS.md

## 프로젝트 개요

**HAJA** — 이벤트 히스토리 모델과 불렛저널 시스템을 결합한 하루 단위 태스크 관리 웹 앱.

- **스택**: React 19 + TypeScript 5.7 + React Router v7 + Zustand 5 + Supabase
- **스타일**: Tailwind CSS v4 + shadcn/ui
- **빌드**: Vite 6 / 테스트: Vitest + React Testing Library
- **패키지 매니저**: yarn

## 명령어

- 개발 서버: `yarn dev` (포트: 5173)
- 테스트: `yarn test`
- 빌드 (타입체크 포함): `yarn build`
- 린트: `yarn lint`
- 전체 검증: `yarn build && yarn test && yarn lint`
- 아키텍처 검증: `yarn lint:arch`
- 문서 최신성 검사: `yarn doc:check`
- 하네스 자가진단: `yarn harness:check`

## 아키텍처

레이어 기반 구조. 의존성 방향: `types → utils → lib → shared → hooks → contexts → components → pages → app`

상세: [ARCHITECTURE.md](ARCHITECTURE.md)

## 현재 상태

- **진행 기록**: [claude-progress.txt](claude-progress.txt)
- **기능 목록**: [feature_list.json](feature_list.json)
- **품질 점수**: [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md)
- **기술 부채**: [docs/TECH_DEBT.md](docs/TECH_DEBT.md)

## 주요 규칙

1. `TaskCore` 클래스의 불변성 패턴 준수 — `with()` 메서드로 새 인스턴스 반환
2. Zustand 미들웨어 스택 순서 유지: `devtools → subscribeWithSelector → persist → immer`
3. `components/ui/`는 shared 스토어를 직접 import하지 않음 (훅을 통해서만)
4. Supabase/인증/환경 변수 변경 시 반드시 사용자 확인
5. localStorage 키(`localBullets`) 변경 금지 — 데이터 유실 위험
6. `feature_list.json`의 기능 설명을 수정/삭제하지 않는다
7. `passes`는 실제 검증 통과 후에만 true로 바꾼다

## 문서 맵

| 문서 | 역할 |
|------|------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | 아키텍처 규칙, 레이어 의존성, 도메인 규칙 |
| [CLAUDE.md](CLAUDE.md) | Claude Code 작업 지침, TDD 파이프라인, 운영 사이클 |
| `.claude/rules/session-routine.md` | TDD 오케스트레이션 플로우 |
| `.claude/rules/coding-standards.md` | 코드 규칙, 네이밍 |
| `.claude/rules/git-workflow.md` | Git 커밋/브랜치 규칙 |
| `agents/*.md` | TDD subagent 정의 (7개) |
| `docs/product-specs/` | 제품 요구사항 문서 |
| `docs/design-docs/` | 설계 결정 기록 |
| `docs/exec-plans/` | 작업별 실행 계획 |
| `docs/references/` | 참고 자료 |
| `docs/HARNESS_FRICTION.md` | 하네스 마찰 로그 |
