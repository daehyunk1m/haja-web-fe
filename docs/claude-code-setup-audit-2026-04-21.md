# Claude Code 세팅 감사 리포트

- **대상**: `haja-web-fe` (React 19 + TS + Supabase)
- **기준 문서**: `Claude Code 프로젝트 세팅 체크리스트.md` §1~§4
- **기준 버전**: Claude Code `2.1.114`
- **감사일**: 2026-04-21
- **감사자**: Claude Code (Opus 4.7)

---

## 1. 섹션별 집계

| 섹션 | 통과 | 미통과 | 해당없음 | 총 |
|---|---|---|---|---|
| §1 기반 세팅 | 4 | 3 | 0 | 7 |
| §2 컨텍스트 운영 | 1 | 3 | 3 | 7 |
| §3 자동화 & 확장 | 0 | 5 | 2 | 7 |
| §4 위생 & 협업 | 1 | 3 | 0 | 4 |
| **합계** | **6** | **14** | **5** | **25** |

---

## 2. 항목별 판정

### §1. 기반 세팅

| # | 항목 | 판정 | 근거 |
|---|---|---|---|
| 1 | `CLAUDE.md` 존재 | 통과 | `CLAUDE.md` 2966B, 비어 있지 않음 |
| 2 | 300줄 이하 | 통과 | `wc -l CLAUDE.md` = 86줄 |
| 3 | 절대 규칙이 맨 위 | 미통과 | `CLAUDE.md`는 `@AGENTS.md` 참조 뒤 "명령어" 섹션부터 시작. "금지 사항"이 L75, "보수적 접근 대상"이 L55에 배치됨. 최상단에 MUST/금지 선언 없음 |
| 4 | 5대 구성 포함 | 통과 | 금지사항(CLAUDE.md L75), 아키텍처(ARCHITECTURE.md 참조), 명령어(L5), 도메인(AGENTS.md L5), 코딩컨벤션(.claude/rules/coding-standards.md) 모두 존재/참조됨 |
| 5 | 글로벌/프로젝트 분리 | 통과 | 일반 지시("항상 한국어" 등) 없음 |
| 6 | 트리거 키워드 정의 | 미통과 | `grep -iE "트리거\|trigger\|단축"` CLAUDE.md/AGENTS.md → 매치 없음 |
| 7 | `.claude/commands/*.md` | 미통과 | `.claude/commands/` 디렉토리 자체가 존재하지 않음 |

### §2. 컨텍스트 운영

| # | 항목 | 판정 | 근거 |
|---|---|---|---|
| 1 | Lazy Loading `@docs/...` | 미통과 | `grep '@[A-Za-z0-9_./-]+\.md' CLAUDE.md` → `@AGENTS.md` 1건만. AGENTS.md는 `[ARCHITECTURE.md](ARCHITECTURE.md)` 마크다운 링크 방식(자동 로드 아님) |
| 2 | 하위 도메인 `CLAUDE.md` | 해당없음 | `find . -name CLAUDE.md` → 루트 1개. 단일 레포·중소 규모 |
| 3 | Mermaid 다이어그램 | 미통과 | `grep -rl 'mermaid' docs/ ARCHITECTURE.md` → 매치 없음 |
| 4 | 팀 지식 / 개인 메모리 분리 | 통과 | 개인 취향 지시 섞여 있지 않음 |
| 5 | 루트 `TODO.md` 최신 | 미통과 | `TODO.md` 존재하지 않음. `claude-progress.txt`는 존재하지만 체크박스 형식 아님 |
| 6 | `scripts/` 원자적 스크립트 | 해당없음 | build/test/lint은 `package.json` yarn 스크립트로 대체. `scripts/`엔 `doc-freshness.ts`, `structural-test.ts` 단일책임 TS 2개만 — 괴물 스크립트 없음 |
| 7 | 불필요한 MCP 비활성화 | 해당없음 | `enabledMcpjsonServers`: playwright, context7, sequential-thinking, storybook — 실사용 여부 판단 근거 부족 |

### §3. 자동화 & 확장

| # | 항목 | 판정 | 근거 |
|---|---|---|---|
| 1 | `.claude/skills/<name>/SKILL.md` | 미통과 | 디렉토리 없음 |
| 2 | SKILL description 트리거 3개 | 해당없음 | 스킬 없음 |
| 3 | `.claude/agents/<name>.md` | 미통과 | `.claude/agents/` 존재하지만 빈 디렉토리. 프로젝트 TDD 에이전트 7개는 `agents/` 루트에 있음 — Claude Code 네이티브 sub-agent 슬롯(`.claude/agents/`)이 아니라 `Agent tool`로 수동 호출되는 프롬프트 문서 |
| 4 | Hooks `.claude/settings.json` | 미통과 | `.claude/settings.json` 존재하지 않음 (팀 공유 파일 없음). `settings.local.json`에도 `hooks` 키 없음 |
| 5 | Hook timeout/백그라운드 | 해당없음 | Hook 없음 |
| 6 | Git worktree 가이드 | 미통과 | CLAUDE.md/AGENTS.md/docs에 worktree 관련 기재 없음 |
| 7 | 커스텀 MCP 필요성 검토 기록 | 미통과 | `docs/decisions/` 없음. CLAUDE.md에도 MCP 선택 이유 1줄 없음 |

### §4. 위생 & 협업

| # | 항목 | 판정 | 근거 |
|---|---|---|---|
| 1 | `settings.json` / `settings.local.json` 분리 | 미통과 | 팀 공유용 `settings.json` 자체가 없음. `settings.local.json`은 존재하지만 `.gitignore`에 미등재 (현재 untracked라 유출은 안 됐음) |
| 2 | `.gitignore`가 Claude 개인 파일 제외 | 미통과 | `grep "claude" .gitignore` → 매치 없음. `.claude/settings.local.json` 미등재 |
| 3 | 팀 공유 자산 커밋 | 통과 | `git ls-files` 결과: `CLAUDE.md`, `AGENTS.md`, `.claude/rules/*.md`, `agents/*.md`, `docs/**` 모두 tracked |
| 4 | Plan Mode 우선 원칙 | 미통과 | CLAUDE.md 본문에 "큰 변경은 Plan Mode부터" 원칙 없음. `.claude/rules/session-routine.md`·`coding-standards.md`엔 Plan 모드 통합 절차가 있으나 "큰 변경 시 Plan 먼저" 룰로 명시되진 않음 |

---

## 3. 개선 제안 (우선순위 정렬)

### Critical

**C1. `.gitignore`에 `.claude/settings.local.json` 추가** (§4-1, §4-2)
- 현재 untracked라 유출은 안 됐지만, `git add -A` 한 번에 개인 권한 설정이 커밋될 위험. 파일에 30+개 bash 권한이 들어있음.
- 제안 diff:
  ```
  # Claude Code 개인 설정
  .claude/settings.local.json
  ```
- **효과**: 개인 권한/MCP 설정의 우발적 커밋 차단.

### High

**H1. `.claude/settings.json`(팀 공유) 생성 + Hooks 도입** (§3-4, §4-1)
- 팀 공유 설정 파일이 없음. `PostToolUse` hook으로 `yarn lint --silent`를 걸면 TDD 루틴의 수동 실행 부담이 감소.
- 제안 초안:
  ```json
  {
    "hooks": {
      "PostToolUse": [
        { "matcher": "Write|Edit",
          "hooks": [{ "type": "command", "command": "yarn lint --silent &", "timeout": 30 }] }
      ]
    },
    "enabledMcpjsonServers": ["context7"]
  }
  ```
- **효과**: 저장 시 자동 린트, 팀원이 clone 즉시 동일 환경.

**H2. `.claude/commands/` + 워크플로 슬래시 명령어 추가** (§1-6, §1-7)
- TDD 루틴이 이미 명확하지만 매번 수동으로 읽음. `/tdd-start`, `/session-end`, `/feature-next`로 표준화.
- 제안 파일:
  - `.claude/commands/tdd-start.md` — session-routine Step 1~3 자동 실행
  - `.claude/commands/session-end.md` — `yarn build && yarn test && yarn lint` + feature_list.json 업데이트
  - `.claude/commands/feature-next.md` — `passes: false` 중 최고 우선순위 선택
- **효과**: 반복 프롬프트 제거, 루틴 일관성 향상.

**H3. `CLAUDE.md` 최상단에 "절대 규칙" 섹션 배치** (§1-3)
- 금지사항이 L75에 묻혀 있음. 상단 5줄짜리 MUST 블록 필요.
- 제안 구조:
  ```markdown
  # CLAUDE.md

  ## 절대 규칙 (MUST)
  - Supabase/인증/환경변수/supabase.ts 변경은 사용자 승인 필수
  - 한 세션에 한 기능만 TDD 사이클로 완료
  - 테스트 없이 기능 완료 처리 금지
  - feature_list.json 설명 수정/삭제 금지

  @AGENTS.md
  ```
- **효과**: 핵심 금지선이 최상단 로드로 올라와 위반 확률 감소.

### Medium

**M1. TDD 에이전트를 `.claude/agents/`로 이전** (§3-3)
- `agents/` 루트의 7개 프롬프트는 Claude Code 네이티브 sub-agent 메커니즘과 분리. `.claude/agents/{name}.md`로 이전 + frontmatter(`name`, `description`, `tools`) 추가 시 `Agent tool subagent_type` 자동완성·격리 컨텍스트 사용 가능.
- CLAUDE.md L23 테이블 경로도 함께 수정 필요.
- **효과**: 네이티브 컨텍스트 격리, sub-agent 자동 디스패치.

**M2. `docs/architecture.md` Mermaid 다이어그램 추가 + `CLAUDE.md`에서 `@` 참조** (§2-1, §2-3)
- `ARCHITECTURE.md`는 텍스트만. 레이어 의존성을 Mermaid flowchart로 시각화 + `@ARCHITECTURE.md` 참조를 `CLAUDE.md`에 추가.
- **효과**: 레이어 위반 판단 속도 향상, Lazy Load로 토큰 절약.

**M3. `CLAUDE.md`에 "큰 변경은 Plan Mode 우선" 룰 1줄 추가** (§4-4)
- 제안: "5파일/100줄 이상 변경은 `/plan` 또는 Shift+Tab Plan Mode 선행" 한 줄 추가.
- **효과**: 대규모 수정 시 방향 오류 조기 차단.

**M4. `TODO.md` 도입 또는 `claude-progress.txt` 체크박스화** (§2-5)
- 세션 간 작업 연속성 확보. 두 옵션:
  - (a) `TODO.md` 신규 생성, `claude-progress.txt`는 세션 로그로 유지
  - (b) `claude-progress.txt` 상단에 `- [ ]` 블록 추가
- **효과**: 새 세션 시작 시 "어디까지 했나" 즉시 파악.

### Low

**L1. MCP 선택 근거를 `CLAUDE.md`에 1줄 기록** (§3-7)
- 활성화된 playwright/context7/sequential-thinking/storybook 각각의 사용 이유 한 줄씩. 특히 storybook MCP는 실사용 여부 검토.
- **효과**: 향후 토큰 낭비 MCP 정리 근거 확보.

**L2. Worktree 사용 가이드 1개 섹션** (§3-6)
- 단독 개발자면 해당없음 처리 가능. 향후 병렬 feature 브랜치 작업 시에만 필요.
- **효과**: 병렬 작업 전환 시 혼란 방지.

**L3. `.claude/agents/` 빈 디렉토리 정리**
- M1 실행 시 자연 해소. 단독 처리 시엔 `.gitkeep`으로 의도 명시.

---

## 4. 적용 이력

| 날짜 | 항목 | 상태 | 비고 |
|---|---|---|---|
| 2026-04-21 | C1 | 적용 | `.gitignore`에 `.claude/settings.local.json` 추가 |
