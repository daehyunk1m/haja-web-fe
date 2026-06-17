/** 섹션 종류 — 투데이(task) / 언젠가(someday). */
export type SectionKind = "task" | "someday";

/**
 * 접힌(collapsed) 컨테이너가 보여주는 태스크 행 수.
 * TodoContainer의 접힘 높이(`basis-[138px]` = 3행 + py-2)와 반드시 동기화한다.
 */
export const PEEK_TASK_COUNT = 3;

/**
 * 화면 진입 시 어느 섹션을 확장할지 결정한다.
 * 태스크가 더 많은 쪽을 확장하고, 동률이면 task(투데이)를 확장한다.
 * 두 섹션 중 항상 정확히 하나만 확장된다 (아코디언).
 */
export const pickInitialExpanded = (taskCount: number, somedayCount: number): SectionKind =>
  somedayCount > taskCount ? "someday" : "task";
