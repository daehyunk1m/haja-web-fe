import { describe, it, expect } from "vitest";
import { PEEK_TASK_COUNT, pickInitialExpanded } from "./sectionFold";

describe("pickInitialExpanded", () => {
  it("task가 더 많으면 task(투데이)를 확장한다", () => {
    expect(pickInitialExpanded(5, 3)).toBe("task");
    expect(pickInitialExpanded(1, 0)).toBe("task");
  });

  it("someday가 더 많으면 someday를 확장한다", () => {
    expect(pickInitialExpanded(3, 5)).toBe("someday");
    expect(pickInitialExpanded(0, 1)).toBe("someday");
  });

  it("동률이면 task(투데이)를 확장한다 (항상 정확히 한 섹션만 확장)", () => {
    expect(pickInitialExpanded(0, 0)).toBe("task");
    expect(pickInitialExpanded(3, 3)).toBe("task");
  });
});

describe("PEEK_TASK_COUNT", () => {
  it("3 (TodoContainer 접힘 높이 basis-[138px] = 3행과 동기)", () => {
    expect(PEEK_TASK_COUNT).toBe(3);
  });
});
