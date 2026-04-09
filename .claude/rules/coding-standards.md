# 코드 규칙

## 아키텍처

- 유형: layer-based
- 의존성 방향: types → utils → lib → shared → hooks → contexts → components → pages → app
- 이 방향을 역행하는 import는 금지

상세: ARCHITECTURE.md 참조

## 네이밍 규칙

- 컴포넌트: PascalCase (예: TaskItem.tsx)
- 훅: camelCase + use 접두사 (예: useAuth.ts)
- 스토어: camelCase + Store 접미사 (예: bulletStore.ts)
- 타입: PascalCase + Type/Props 접미사
- 테스트: 원본명.test.ts(x)

## 코드 작성 원칙

- 한 파일 300줄 이내
- `any` 타입 사용 금지 — 구체적 타입 또는 `unknown` + 타입 가드
- 한 함수는 한 가지 책임만
- path alias `@/`를 사용하여 import (상대 경로는 같은 폴더 내에서만)
- 기존 코드의 패턴과 스타일을 따른다

## 금지 사항

- feature_list.json의 기능 설명을 수정/삭제하지 않는다
- 한 번에 여러 기능을 구현하지 않는다
- 기존에 동작하는 코드를 이유 없이 리팩터링하지 않는다
- 테스트 없이 기능을 완료 처리하지 않는다
