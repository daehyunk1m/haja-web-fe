import { describe, it, expect } from "vitest";
import { PEEK_TASK_COUNT, shouldAutoExpand } from "./sectionFold";

describe("shouldAutoExpand", () => {
  it("peek 용량 이하면 접힘 유지 (false)", () => {
    expect(shouldAutoExpand(0)).toBe(false);
    expect(shouldAutoExpand(1)).toBe(false);
    // 정확히 peek 용량(3개)은 접힘 상태에서 모두 보이므로 확장하지 않는다
    expect(shouldAutoExpand(PEEK_TASK_COUNT)).toBe(false);
  });

  it("peek 용량을 초과하면 자동 확장 (true)", () => {
    // peek로 가려지는 태스크가 생기므로 확장한다
    expect(shouldAutoExpand(PEEK_TASK_COUNT + 1)).toBe(true);
    expect(shouldAutoExpand(10)).toBe(true);
  });

  it("PEEK_TASK_COUNT는 3 (TodoContainer 접힘 높이 3행과 동기)", () => {
    expect(PEEK_TASK_COUNT).toBe(3);
  });
});
