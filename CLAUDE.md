# CLAUDE.md

@AGENTS.md

## TDD Subagent 파이프라인

기능 구현은 TDD 사이클(Red → Green → Refactor)을 따른다.
각 단계의 전문 에이전트를 Agent tool로 호출한다.
상세 오케스트레이션: `.claude/rules/session-routine.md`

| TDD 단계 | Agent | 파일 |
|----------|-------|------|
| Pre-Red | Architect | `agents/architect.md` |
| Red | Test Engineer | `agents/test-engineer.md` |
| Green | Implementer | `agents/implementer.md` |
| Post-Green | Reviewer | `agents/reviewer.md` |
| Refactor | Simplifier | `agents/simplifier.md` |
| On-demand | Debugger | `agents/debugger.md` |
| Post-Green | Security Reviewer | `agents/security-reviewer.md` |

### 호출 방법

1. `agents/{name}.md`를 읽어 에이전트 정의를 확인한다
2. Input 섹션에 명시된 데이터를 수집한다
3. Agent tool로 subagent를 호출한다

## 세션 루틴 (요약)

### 시작

1. `claude-progress.txt` 읽기 (TDD STATE 블록 확인)
2. `git status` → 미커밋 변경 확인
3. `git log --oneline -10`
4. `feature_list.json` → `passes: false` 중 최고 우선순위 선택
5. `yarn validate` (회귀 체크)
6. TDD 사이클 시작 (상세: `.claude/rules/session-routine.md`)

### 종료

1. `yarn validate`
2. `feature_list.json` 업데이트
3. `claude-progress.txt` 세션 요약 + TDD STATE 갱신
4. `git-workflow.md` 규칙에 따라 커밋 제안

## 보수적 접근 대상

다음 항목은 변경 이유 + 이득을 설명하고 사용자 승인 후 진행한다:

### 서버/인프라
- Supabase 테이블 스키마 변경
- Supabase RLS 정책 수정
- 환경 변수(.env) 수정/생성
- 인증 플로우(OAuth) 핵심 로직 변경
- `src/lib/supabase.ts` 클라이언트 초기화 코드 변경

### 코드
- `TaskCore` 클래스의 불변성 패턴 변경
- Zustand 미들웨어 스택 순서 변경
- `localStorage` 키(`localBullets`) 변경 — 마이그레이션 계획 필수

### 의존성
- 새 패키지 추가 시 사용자 확인
- 기존 패키지 메이저 버전 업그레이드 시 사용자 확인

## 운영 사이클

| 주기 | 작업 |
|------|------|
| 일간 | `yarn validate` (CI 자동화 권장) |
| 주간 | `yarn doc:check` + docs/QUALITY_SCORE.md 갱신 |
| 격주 | docs/TECH_DEBT.md 검토 (자동 검사 승격 대기 큐 포함) + 리팩터링 세션 |
| 월간 | AGENTS.md/ARCHITECTURE.md 전면 검토 + feature_list passes 재검증 + `yarn harness:check` |

주간/격주/월간 작업은 harness-cleanup 컴패니언 스킬로 실행할 수 있다 (--add-dir 등록 후 "하네스 정리" 요청).

## 금지 사항

- `feature_list.json`의 기능 설명을 수정/삭제하지 않는다
- 한 번에 여러 기능을 구현하지 않는다
- 테스트 없이 기능을 완료 처리하지 않는다
- 기존에 `passes: true`였던 기능의 회귀를 무시하고 새 기능을 진행하지 않는다 (회귀 복구 우선)
- `node_modules/`, `dist/`, `.env*` 파일을 git에 추가하지 않는다

## 하네스 이슈 보고

- 하네스 관련 문제 발생 시 `docs/HARNESS_FRICTION.md`에 기록한다
- 반복되는 문제는 "하네스 피드백 분석해줘"로 자동 Issue 생성 가능
- 수동 보고: https://github.com/daehyunk1m/harness-setup-initializer/issues
