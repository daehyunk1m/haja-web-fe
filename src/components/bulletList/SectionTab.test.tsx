import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SectionTab from "./SectionTab";
import { BulletSectionContext } from "@/hooks/useBulletSectionContext";
import type { TBulletSection } from "@/hooks/useBulletSection";
import { useDateStore } from "@/shared/dateStore";
import { useSectionExpandStore } from "@/shared/sectionExpandStore";
import { recordDate } from "@/utils/dateUtils";

// tabPosition="right" → DateTab(투데이 탭)이 렌더된다.
const rightCtx: TBulletSection = {
  isAddTaskIcon: false,
  setIsAddTaskIcon: () => {},
  tabPosition: "right",
  setTabPosition: () => {},
};

const renderDateTab = () =>
  render(
    <BulletSectionContext.Provider value={rightCtx}>
      <SectionTab />
    </BulletSectionContext.Provider>
  );

describe("SectionTab DateTab — TODAY 버튼", () => {
  beforeEach(() => {
    useSectionExpandStore.getState().actions.reset();
    useDateStore.getState().actions.setDate(new Date());
  });

  it("TODAY 버튼을 누르면 선택 날짜가 오늘로 바뀐다", () => {
    useDateStore.getState().actions.setDate(new Date("2020-01-01")); // 과거 날짜
    renderDateTab();

    fireEvent.click(screen.getByRole("button", { name: /TODAY/ }));

    expect(useDateStore.getState().toBulletString()).toBe(recordDate(new Date()));
  });

  it("TODAY 버튼은 섹션 확장을 토글하지 않는다 (확장 판단은 날짜 변경에 위임)", () => {
    useSectionExpandStore.setState({ expanded: "someday", initialized: true });
    renderDateTab();

    fireEvent.click(screen.getByRole("button", { name: /TODAY/ }));

    expect(useSectionExpandStore.getState().expanded).toBe("someday");
  });
});
