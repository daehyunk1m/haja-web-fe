# HAJA — 설계 결정

## 기술 스택

- **Frontend**: React
- **Routing**: React Router v7 (Remix 방식)
- **State Management**: Zustand (+ persist)
- **Database / Backend**: Supabase
- **Local Persistence**: localStorage
- **Architecture**: FSD (Feature-Sliced Design)

## 설계 방향

- Task는 클래스 기반으로 관리
- 기타 로직은 함수형 패러다임 중심
- 상태 변경 메서드는 불변 복제 방식(새 인스턴스 반환) 선호
- 이벤트 히스토리 기반으로 Task와 TaskEvent 구조를 지향
