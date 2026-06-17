import { beforeEach, describe, it, expect } from "vitest";
import { useSectionExpandStore } from "./sectionExpandStore";

const store = () => useSectionExpandStore.getState();

describe("sectionExpandStore", () => {
  beforeEach(() => store().actions.reset());

  it("기본 확장 섹션은 task(투데이)다", () => {
    expect(store().expanded).toBe("task");
    expect(store().initialized).toBe(false);
  });

  it("두 섹션 카운트가 모두 보고되면 더 많은 쪽을 확장하고 확정한다", () => {
    const { reportCount } = store().actions;
    reportCount("task", 3);
    expect(store().initialized).toBe(false); // 한쪽만 보고 → 아직 확정 안 함

    reportCount("someday", 5);
    expect(store().expanded).toBe("someday");
    expect(store().initialized).toBe(true);
  });

  it("동률이면 task를 확장한다", () => {
    const { reportCount } = store().actions;
    reportCount("task", 4);
    reportCount("someday", 4);
    expect(store().expanded).toBe("task");
  });

  it("확정 이후의 카운트 보고는 확장을 바꾸지 않는다", () => {
    const { reportCount } = store().actions;
    reportCount("task", 5);
    reportCount("someday", 3); // → task 확정
    reportCount("someday", 99); // 무시되어야 함
    expect(store().expanded).toBe("task");
  });

  it("toggle은 확장 섹션을 전환하고 확정 상태로 만든다 (둘 중 하나만 확장)", () => {
    const { toggle } = store().actions;
    expect(store().expanded).toBe("task");

    toggle();
    expect(store().expanded).toBe("someday");
    expect(store().initialized).toBe(true);

    toggle();
    expect(store().expanded).toBe("task");
  });

  it("사용자가 toggle한 뒤에는 자동 확장(카운트 보고)이 개입하지 않는다", () => {
    const { toggle, reportCount } = store().actions;
    toggle(); // someday로 전환 + 확정
    reportCount("task", 99);
    reportCount("someday", 1);
    expect(store().expanded).toBe("someday");
  });
});
