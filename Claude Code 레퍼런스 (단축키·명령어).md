---
title: Claude Code 레퍼런스 (단축키·명령어)
tags: [claude-code, reference, ai-workflow]
base_version: "2.1.114"
surveyed_at: "2026-04-21"
source: "https://www.notion.so/acho/Claude-Code-f11b19b9c4af82e3b654018d796fca26"
---

# Claude Code 레퍼런스 (단축키·명령어)

> **기준 버전**: Claude Code `2.1.114`
> **조사일**: 2026-04-21
> **원본 출처**: [Claude Code 완전정복 시리즈 (Notion)](https://www.notion.so/acho/Claude-Code-f11b19b9c4af82e3b654018d796fca26)
>
> Claude Code는 빠르게 진화합니다. 이 문서의 내용과 실제 동작이 다르면 상단 메타(`base_version`, `surveyed_at`)를 `claude --version` 결과와 비교해 갱신하세요.

---

## 1. 키보드 단축키

| 키 | 동작 | 메모 |
|---|---|---|
| `Shift + Tab` | Plan Mode ↔ Accept Mode 전환 | 새 작업은 Plan Mode로 시작 권장 |
| `Escape` | 현재 동작 즉시 중단 | 잘못된 방향이라 판단하면 망설이지 말고 중단 |
| `Escape × 2` | 입력창 상태 토글 | 텍스트 있을 때 → 삭제 / 비어 있을 때 → 이전 입력 복원 |
| `!` 접두사 | bash 명령을 대화 중단 없이 실행 | 예: `!npm run build`, `!git status` |

### 참고: iTerm 패널 단축키 (Claude Code 자체 기능 아님)

| 키 | 동작 |
|---|---|
| `Cmd + D` | 패널 세로 분할 |
| `Cmd + Shift + D` | 패널 가로 분할 |
| `Cmd + [` / `Cmd + ]` | 패널 간 이동 |

---

## 2. 슬래시 명령어

### 컨텍스트 관리
| 명령 | 역할 |
|---|---|
| `/init` | 프로젝트를 분석해 `CLAUDE.md` 자동 생성 |
| `/clear` | 컨텍스트 완전 초기화 (새 작업 시작 시 필수) |
| `/compact` | 대화 맥락은 유지하면서 토큰 압축 |
| `/context` | 현재 토큰 사용량을 바 형태로 표시 |

### 세션 & 모델
| 명령 | 역할 |
|---|---|
| `/models` | 모델 전환 (Opus / Sonnet / Haiku) |
| `/resume` | 이전 세션 복구 (터미널을 닫은 뒤 재진입) |
| `/export` | 채팅 내역 내보내기 (다른 AI에 붙여넣기용) |
| `/output-style` | 응답 스타일 설정 (학습 모드, 간결 모드 등) |
| `/config` | 설정 변경 (To-Do 리스트 활성화 등) |
| `/help` | 내장 도움말 |

### 확장 & 자동화
| 명령 | 역할 |
|---|---|
| `/mcp` | MCP(외부 도구) 관리 — 안 쓰는 건 비활성화해 토큰 절약 |
| `/memory` | Claude가 자동 학습한 메모리를 확인/편집 |
| `/agents` | Sub-Agent 생성·관리 |
| `/voice` | 음성 입력 모드 (push-to-talk, 한국어 포함 20+ 언어) |
| `/plan` | Plan Mode 진입 (Shift+Tab과 동등) |

### 커스텀 슬래시 명령어
`.claude/commands/<name>.md`에 파일을 만들면 파일 이름이 곧 슬래시 명령이 됩니다.
```
.claude/commands/
  review_script.md    → /review_script
  deploy_staging.md   → /deploy_staging
```

---

## 3. Hooks — 이벤트 타입

| 이벤트 | 타이밍 | 용도 |
|---|---|---|
| `PreToolUse` | 도구 호출 직전 | 입력값 검증, 승인/차단/수정 |
| `PostToolUse` | 도구 실행 직후 | 결과 검증, 후처리 (린트·포맷 등) |
| `Notification` | 사용자 응답 대기 시 | 알림 전송, 로깅, 외부 서비스 연동 |
| `Stop` | 에이전트 턴 종료 시 | 최종 정리, 보고서 생성, 상태 저장 |

> Hook 실행 중에는 Claude가 멈춰서 기다립니다. 무거운 작업은 `&`로 백그라운드 실행하거나 `timeout`을 설정하세요.

### 최소 JSON 구조 예시
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "npm run lint --silent" }
        ]
      }
    ]
  }
}
```

---

## 4. 내장 Sub-Agent 5종

| 이름 | 모델 | 권한 | 용도 |
|---|---|---|---|
| Explore | Haiku (빠름) | 읽기전용 | 코드 탐색, 파일 검색, 구조 파악 |
| Plan | 상속 | 읽기전용 | Plan Mode에서 계획 수립 연구 |
| General-purpose | 상속 | 모든 도구 | 탐색+수정이 모두 필요한 복잡한 다단계 작업 |
| Bash | 상속 | Bash만 | 별도 컨텍스트에서 터미널 명령 실행 |
| Claude Code Guide | Haiku | 읽기전용 | Claude Code 기능/사용법 질문 답변 |

> Sub-Agent는 **다른 Sub-Agent를 생성할 수 없다**. 체이닝은 메인 세션이 조율한다.

---

## 5. 파일 / 디렉토리 규약

### 글로벌 vs 프로젝트
| 경로 | 범위 | 용도 |
|---|---|---|
| `~/.claude/CLAUDE.md` | 모든 프로젝트 공통 | 언어·톤 등 개인 공통 규칙 |
| `<project>/CLAUDE.md` | 이 프로젝트만 | 아키텍처·컨벤션·도메인 |
| `<project>/<folder>/CLAUDE.md` | 해당 폴더만 | Lazy Loading용 하위 도메인 규칙 |

### 스킬 (Skills)
| 경로 | 범위 |
|---|---|
| `~/.claude/skills/<name>/SKILL.md` | 내 모든 프로젝트 |
| `.claude/skills/<name>/SKILL.md` | 이 프로젝트만 (Git 공유 가능) |
| `<plugin>/skills/<name>/SKILL.md` | 플러그인 활성화된 곳 |

우선순위: **Enterprise > Personal > Project** (Plugin은 `plugin-name:skill-name` 네임스페이스로 분리)

### 에이전트 (Agents)
| 경로 | 범위 |
|---|---|
| `~/.claude/agents/<name>.md` | 내 모든 프로젝트 |
| `.claude/agents/<name>.md` | 이 프로젝트만 |
| `--agents` CLI 플래그 | 이번 세션 일회용 |

### 커스텀 슬래시 명령어
| 경로 | 범위 |
|---|---|
| `.claude/commands/<name>.md` | 이 프로젝트만 (파일명 = 명령어) |

### 설정
| 경로 | 공유 여부 |
|---|---|
| `~/.claude/settings.json` | 개인, 전 프로젝트 공통 |
| `.claude/settings.json` | 팀 공유 (Git 커밋) |
| `.claude/settings.local.json` | 개인 로컬 오버라이드 (`.gitignore`에 추가) |

### 프로젝트 루트 관례
| 경로 | 용도 |
|---|---|
| `CLAUDE.md` | 프로젝트 설명서 (300줄 이하 권장) |
| `TODO.md` | 세션 간 작업 연속성 체크리스트 |
| `docs/architecture.md` | Mermaid 아키텍처 다이어그램 (Lazy Load 대상) |
| `scripts/*.sh` | 원자적 스크립트 (build/test/migrate/deploy/notify 등 단일 책임) |

---

## 6. SKILL.md frontmatter 규격

```yaml
---
name: ppt-generator
description: "PPT 발표자료 자동 생성. 'PPT 만들어줘',
  '발표자료 작성', '슬라이드 제작' 요청 시 트리거."
---
```
- `description`은 **사용자가 쓸 법한 자연어 표현 3개 이상**을 포함해야 자동 트리거가 잘 된다.
- SKILL.md 본문에는 목적 / 절차 / 자체 검증 체크리스트 3개 섹션을 둔다.

---

## 7. 모델 선택 가이드 (버전에 따라 라인업 변경 가능)

| 모델 계열 | 용도 |
|---|---|
| Opus | 복잡한 아키텍처, 어려운 버그, 긴 추론 |
| Sonnet | 균형 잡힌 일반 코딩 작업 |
| Haiku | 빠른 탐색, 단순 질문, 대량 병렬 |

실제 가용 모델명과 버전은 `/models`로 확인한다.

---

## 8. 이 문서 갱신 방법

1. `claude --version`으로 현재 버전 확인
2. 상단 frontmatter의 `base_version`과 `surveyed_at` 갱신
3. 새 슬래시 명령어 / 이벤트 타입 / 내장 Sub-Agent가 추가되면 해당 섹션에 반영
4. 변경 사항이 크면 하단에 **변경 이력** 섹션 추가

### 변경 이력
- 2026-04-21 — 초기 작성 (Claude Code 2.1.114 기준, Notion 3부작 요약)
