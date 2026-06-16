/**
 * 접힌(collapsed) 컨테이너가 보여주는 태스크 행 수.
 * TodoContainer의 접힘 높이(`h-[138px]` = 3행 + py-2)와 반드시 동기화한다.
 */
export const PEEK_TASK_COUNT = 3;

/**
 * 마운트 시 컨테이너를 자동 확장할지 결정한다.
 * 태스크 수가 peek 용량(PEEK_TASK_COUNT)을 초과하면 확장한다 —
 * 접힘 상태에서는 가려지는 태스크가 생기기 때문. 이하이면 모두 보이므로 접힘을 유지한다.
 */
export const shouldAutoExpand = (taskCount: number): boolean => taskCount > PEEK_TASK_COUNT;
