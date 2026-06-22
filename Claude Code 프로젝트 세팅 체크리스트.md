---
title: Claude Code 프로젝트 세팅 체크리스트
tags: [claude-code, checklist, ai-workflow]
base_version: "2.1.114"
surveyed_at: "2026-04-21"
source: "https://www.notion.so/acho/Claude-Code-f11b19b9c4af82e3b654018d796fca26"
reference: "./Claude Code 레퍼런스 (단축키·명령어).md"
---

# Claude Code 프로젝트 세팅 체크리스트

> **기준 버전**: Claude Code `2.1.114` · **조사일**: 2026-04-21
> **보조 레퍼런스**: [Claude Code 레퍼런스 (단축키·명령어)](./Claude%20Code%20레퍼런스%20%28단축키·명령어%29.md)
>
> 이 체크리스트는 **임의의 프로젝트가 Claude Code를 잘 활용할 수 있게 세팅되어 있는지**를 기계적으로 점검하기 위한 것입니다. 각 항목은 "왜 필요한가(Why)"와 "어떻게 확인하는가(Check)"로 구성되어, Claude Code가 직접 읽고 자동 점검 + 개선 제안을 만들 수 있습니다.

---

## 0. 사용법

### 점검 대상 프로젝트에서 실행
점검하려는 프로젝트 루트에서 Claude Code를 연 뒤, 아래 [5. 점검 프롬프트 템플릿](#5-점검-프롬프트-템플릿)의 프롬프트를 그대로 붙여넣으면 됩니다.

### 항목 포맷
```
- [ ] **{항목}**
  - Why: {이 항목이 필요한 이유}
  - Check: {파일 존재·내용 패턴·명령 실행 등 기계적 검증 기준}
```

### 판정 규칙
- **통과**: Check 기준이 모두 만족
- **미통과**: 하나라도 불만족
- **해당없음**: 프로젝트 성격상 의미 없음 (예: 1인 개인 프로젝트에서 "팀 공유" 항목)

---

## 1. 기반 세팅

- [ ] **프로젝트 루트에 `CLAUDE.md` 존재**
  - Why: Claude Code가 세션마다 자동으로 읽는 프로젝트 설명서. 없으면 매번 구조를 추측하느라 토큰을 낭비하고, 답변 품질이 떨어진다.
  - Check: 루트에 `CLAUDE.md` 파일이 있고 비어 있지 않다 (`test -s CLAUDE.md`).

- [ ] **`CLAUDE.md`가 300줄 이하**
  - Why: 매 대화마다 전체 내용이 로드된다. 길수록 토큰 낭비 + 응답 품질 저하.
  - Check: `wc -l CLAUDE.md` 결과가 300 이하.

- [ ] **절대 규칙이 `CLAUDE.md` 맨 위에 배치**
  - Why: 규칙은 위→아래 순으로 적용된다. 핵심 금지사항이 아래에 묻히면 위반할 확률이 높아진다.
  - Check: 파일 첫 섹션이 "절대 규칙", "반드시 지킬 것", "MUST", "금지" 등으로 시작하거나 명시적으로 우선 적용 규칙임을 선언한다.

- [ ] **`CLAUDE.md`가 5대 구성 요소를 모두 포함**
  - Why: 하나라도 빠지면 Claude가 해당 영역에서 표류한다.
  - Check: 아래 5개가 모두 섹션으로 존재.
    1. 절대 규칙
    2. 아키텍처 (폴더 구조, 기술 스택)
    3. 빌드 / 테스트 / 배포 명령
    4. 도메인 컨텍스트 (비즈니스 용어, 데이터 흐름)
    5. 코딩 컨벤션 (네이밍, 커밋, 패턴)

- [ ] **글로벌(`~/.claude/CLAUDE.md`)과 프로젝트 `CLAUDE.md`의 역할이 분리됨**
  - Why: 글로벌엔 공통 룰(언어, 톤), 프로젝트엔 이 프로젝트 고유 내용. 섞이면 다른 프로젝트에서도 엉뚱한 규칙이 적용된다.
  - Check: 프로젝트 `CLAUDE.md`에 다른 프로젝트에도 적용될 법한 일반 지시(예: "항상 한국어로 답변해줘")가 없다.

- [ ] **트리거 키워드 정의**
  - Why: 자주 쓰는 플로우를 짧은 명령("build the app", "deploy staging")으로 표준화하면 매번 세부 설명이 불필요.
  - Check: `CLAUDE.md`에 "트리거" / "단축 명령" 섹션이 있고 최소 1개 이상 키워드 등록. (없다면 커스텀 슬래시 명령어로 대체되었는지 확인)

- [ ] **`.claude/commands/*.md` 커스텀 슬래시 명령어 존재**
  - Why: 반복 워크플로우를 `/명령`으로 표준화. 탭 자동완성 + 구조적 인식이 트리거 키워드보다 안정적.
  - Check: `.claude/commands/` 디렉토리가 있고 md 파일이 1개 이상.

---

## 2. 컨텍스트 운영

- [ ] **Lazy Loading 구조: `CLAUDE.md`가 상세 문서를 `@docs/...`로 참조**
  - Why: 상세 내용을 인라인으로 넣으면 매 세션 토큰이 낭비된다. 참조만 두면 필요 시에만 로드된다.
  - Check: `CLAUDE.md`에 `@docs/`, `@*.md` 같은 참조 패턴이 있고, 엔드포인트·스키마 같은 대량 나열이 인라인으로 박혀 있지 않다.

- [ ] **하위 도메인별 `CLAUDE.md` 분리 (규모에 따라)**
  - Why: 폴더 단위로 쪼개면 해당 영역 작업 시에만 로드되어 컨텍스트 bloat 방지.
  - Check: `src/*/CLAUDE.md`처럼 폴더별 파일이 존재. (소규모 프로젝트는 해당없음)

- [ ] **아키텍처 다이어그램(Mermaid) 존재**
  - Why: Claude가 전체 구조를 한눈에 파악. 텍스트 설명보다 효율적.
  - Check: `docs/architecture.md` 등에 ` ```mermaid ` 블록이 있고 `CLAUDE.md`에서 `@docs/architecture.md`로 참조한다.

- [ ] **팀 지식(`CLAUDE.md`)과 개인 메모리(`/memory`)가 분리**
  - Why: 개인 취향을 팀 전체에 강제하면 안 된다.
  - Check: 개인 취향 지시(선호 톤, 개인 단축 표현, 개인 에디터 설정)가 `CLAUDE.md`에 섞여 있지 않다.

- [ ] **루트에 `TODO.md` 존재 및 최신 상태**
  - Why: 세션 간 작업 연속성 — 새 세션이 "어디까지 했는지"를 즉시 파악.
  - Check: `TODO.md`가 체크박스 형식으로 존재하고, 최근 커밋 시점이 최근 1~2주 이내. (미사용 상태 방지)

- [ ] **`scripts/` 디렉토리에 원자적 스크립트가 구성됨**
  - Why: 무거운 데이터 처리를 대화 안에서 시키면 컨텍스트가 오염된다. 스크립트로 오프로드해야 한다.
  - Check: `scripts/` 아래에 `build.sh`, `test.sh`, `migrate.sh`, `deploy.sh` 같이 **단일 책임** 단위로 분리되어 있다. 한 파일에 모든 걸 다 하는 200줄짜리 괴물 스크립트가 없다.

- [ ] **불필요한 MCP가 비활성화되어 있다**
  - Why: MCP는 도구 설명만으로도 토큰을 많이 먹는다. Notion/Linear 같은 대형 MCP는 특히.
  - Check: `/mcp` 목록에 실제로 쓰는 것만 켜져 있다. 쓰지 않는 MCP가 활성화되어 있지 않다.

---

## 3. 자동화 & 확장

- [ ] **`.claude/skills/<name>/SKILL.md`가 반복 업무별로 존재**
  - Why: 매번 같은 프롬프트를 치지 않고 `/skill`로 품질 일관성 확보. 팀 공유 가능.
  - Check: `.claude/skills/` 하위에 최소 1개의 `SKILL.md` 존재.

- [ ] **각 SKILL.md의 `description`에 트리거 표현 3개 이상**
  - Why: Claude Code가 사용자 말투에서 스킬을 자동 호출하려면 다양한 자연어 표현이 매핑돼야 한다.
  - Check: 각 SKILL.md frontmatter의 `description`에 따옴표로 구분된 트리거 표현이 3개 이상 포함.

- [ ] **`.claude/agents/<name>.md` 역할별 Sub-Agent 존재**
  - Why: 코드 리뷰/탐색/빌드처럼 컨텍스트를 격리해야 하는 반복 작업은 Sub-Agent로.
  - Check: `.claude/agents/` 디렉토리가 있고 내장 5종 외의 프로젝트 맞춤 에이전트 파일이 최소 1개. (내장 5종 목록은 레퍼런스 문서 §4 참조)

- [ ] **Hooks 설정이 `.claude/settings.json`에 있다**
  - Why: 저장/도구 실행 시 린트·포맷·알림을 자동 실행해 품질 게이트를 강제한다.
  - Check: `.claude/settings.json`의 `hooks` 키가 존재하고 비어 있지 않다. 최소 `PostToolUse`(린트·포맷) 또는 `Notification`(알림) 중 하나 이상 설정.

- [ ] **Hook 명령에 timeout 또는 백그라운드 처리가 고려됨**
  - Why: Hook 실행 중 Claude가 멈춰서 기다리므로, 무거운 건 `&`로 돌리거나 timeout을 걸어야 한다.
  - Check: 무거운 Hook 명령(테스트 실행, 빌드 등)에 `&` 또는 `timeout` 옵션이 붙어 있다.

- [ ] **Git worktree 운영 가이드가 문서화**
  - Why: 병렬 작업(`claude -w feature-auth`)이 표준화되면 리뷰·롤백·충돌 관리가 쉬워진다.
  - Check: `CLAUDE.md` 또는 `docs/`에 worktree 사용 방법이 기재. (단일 개발자/단순 프로젝트는 해당없음)

- [ ] **커스텀 MCP 서버 필요성 검토 완료**
  - Why: 프로젝트 고유 도메인 API를 자주 호출해야 하면 MCP가 필요하지만, 단순 호출은 bash 스크립트로 충분하고 토큰도 절약된다.
  - Check: `docs/decisions/` 또는 README 등에 "왜 MCP를 썼다 / 안 썼다"의 결정이 기록. (결정 기록이 없으면 최소한 현재 선택의 이유를 `CLAUDE.md`에 한 줄)

---

## 4. 위생 & 협업

- [ ] **`.claude/settings.json`과 `.claude/settings.local.json`이 분리**
  - Why: 공유 설정(팀)과 개인 오버라이드(로컬)를 섞으면 팀원 설정이 덮어써진다.
  - Check: `settings.local.json`이 존재한다면 `.gitignore`에 등재되어 Git에 커밋되지 않는다.

- [ ] **`.gitignore`가 Claude Code 개인 파일을 제외**
  - Why: 개인 설정·세션 히스토리가 커밋되면 머지 충돌 + 정보 유출 위험.
  - Check: `.gitignore`에 최소 `.claude/settings.local.json`이 포함. 세션 히스토리 폴더를 로컬에 저장하는 경우 그것도 포함.

- [ ] **팀 공유 자산이 Git에 커밋**
  - Why: `.claude/commands`, `.claude/skills`, `.claude/agents`, `.claude/settings.json`, `CLAUDE.md`, `TODO.md`, `docs/`를 커밋해야 팀원이 pull 받는 즉시 동일 환경.
  - Check: `git ls-files .claude/ CLAUDE.md TODO.md docs/` 결과에 이 자산들이 포함된다.

- [ ] **Plan Mode 우선 원칙이 팀 룰로 공유**
  - Why: 큰 변경을 무턱대고 실행하면 엉뚱한 수정이 대량 발생. 계획 검토 단계가 필수.
  - Check: `CLAUDE.md`에 "큰 변경은 Plan Mode부터", "`Shift+Tab`으로 Plan Mode 먼저" 같은 룰이 명시.

---

## 5. 점검 프롬프트 템플릿

아래 프롬프트를 점검 대상 프로젝트 루트에서 Claude Code에 그대로 붙여넣으세요.

```
[역할]
당신은 이 프로젝트가 Claude Code를 잘 활용할 수 있게 세팅되어 있는지 점검하는 감사관입니다.

[작업]
1. 이 체크리스트의 §1 ~ §4 모든 항목에 대해, 현재 프로젝트 루트의 실제 파일/디렉토리/설정을 근거로
   "통과 / 미통과 / 해당없음"을 판정해주세요.
   - 판정 근거는 실제 파일 경로, 내용 스니펫, 또는 실행한 명령 결과로 구체적으로 보여주세요.
   - 추측이 아니라 확인된 사실만 판정 근거로 삼으세요.
2. 미통과 항목마다 "무엇을 어떻게 고치면 되는지"를 구체적인 수정 제안(새 파일 내용, diff, 명령)으로 제시하세요.
3. 필요하면 보조 레퍼런스 문서(`./Claude Code 레퍼런스 (단축키·명령어).md`)를 읽어 보세요.
4. 최종 리포트는 다음 순서로 작성하세요:
   a. 섹션별 집계 (예: §1 기반 세팅 5/7 통과)
   b. 우선순위 정렬된 개선 제안 목록 (Critical > High > Medium > Low)
   c. 각 개선 제안에 "적용 시 예상 효과"를 1줄 추가
5. 중요 사항: 점검 과정에서 어떤 파일도 수정하지 마세요. 제안만 하세요.
   제가 검토 후 승인하면 실행 단계로 넘어가겠습니다.

[체크리스트 본문]
(이 체크리스트 파일의 §1 ~ §4 본문을 여기에 붙여넣거나, "이 파일 전체를 기준으로 점검해" 라고 하고 파일 경로를 알려주세요)
```

### 후속 단계 (선택)
감사 리포트를 받은 뒤, 개선 제안을 선택적으로 적용하려면:

```
위 리포트의 개선 제안 중 아래 항목을 Plan Mode로 계획해서 보여줘:
- [항목 번호 또는 항목명]

계획 승인 후 실행합니다.
```

---

## 부록: 점검 시 자주 쓰는 확인 명령 (참고)

| 확인 대상 | 명령 |
|---|---|
| `CLAUDE.md` 줄 수 | `wc -l CLAUDE.md` |
| `CLAUDE.md`의 `@` 참조 | `grep -E '@[A-Za-z0-9_./-]+\.md' CLAUDE.md` |
| 폴더별 `CLAUDE.md` | `find . -name CLAUDE.md -not -path '*/node_modules/*'` |
| 스킬 목록 | `ls .claude/skills/` |
| 에이전트 목록 | `ls .claude/agents/` |
| 커스텀 명령어 목록 | `ls .claude/commands/` |
| Hook 설정 존재 여부 | `jq '.hooks' .claude/settings.json` |
| `.gitignore`에 로컬 설정 포함 | `grep -F '.claude/settings.local.json' .gitignore` |
| 팀 공유 자산 커밋 여부 | `git ls-files .claude/ CLAUDE.md TODO.md docs/` |
| Mermaid 다이어그램 | `grep -rl '```mermaid' docs/ .` |

> 이 표는 참고용입니다. 실제 프로젝트의 언어·구조에 맞게 보완해서 쓰세요.
