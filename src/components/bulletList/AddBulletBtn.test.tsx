import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AddBulletBtn from "./AddBulletBtn";
import { BulletSectionContext } from "@/hooks/useBulletSectionContext";
import type { TBulletSection } from "@/hooks/useBulletSection";
import { useSectionExpandStore } from "@/shared/sectionExpandStore";

// 좌측(섬데이) 섹션 컨텍스트 — tabPosition="left"
const leftCtx: TBulletSection = {
  isAddTaskIcon: false,
  setIsAddTaskIcon: () => {},
  tabPosition: "left",
  setTabPosition: () => {},
};

const renderSomeday = () =>
  render(
    <BulletSectionContext.Provider value={leftCtx}>
      <AddBulletBtn type='someday' />
    </BulletSectionContext.Provider>
  );

const setExpanded = (kind: "task" | "someday") =>
  useSectionExpandStore.setState({ expanded: kind, initialized: true });

// 섬데이 컨테이너 확장 시 추가 버튼이 즉시 mount(깜빡)되지 않고
// 컨테이너 전환과 함께 부드럽게 나타나야 한다(F013 애니메이션 폴리시).
describe("AddBulletBtn — 섬데이(좌측) 확장 애니메이션", () => {
  beforeEach(() => {
    useSectionExpandStore.getState().actions.reset();
  });

  it("섹션이 접혀 있어도 추가 버튼이 언마운트되지 않고 DOM에 남는다 (깜빡임 방지)", () => {
    setExpanded("task"); // 섬데이 접힘
    renderSomeday();
    // 접힘 상태에서도 DOM에 존재해야 CSS 전환으로 부드럽게 열고 닫을 수 있다
    expect(screen.getByTestId("add-bullet-someday")).toBeInTheDocument();
  });

  it("접힘 상태에서는 숨김(opacity-0 + aria-hidden) 처리된다", () => {
    setExpanded("task");
    renderSomeday();
    expect(screen.getByTestId("add-bullet-someday").className).toContain("opacity-0");
    expect(screen.getByTestId("add-bullet-someday-region")).toHaveAttribute("aria-hidden", "true");
  });

  it("확장 상태에서는 표시(opacity-100 + aria-hidden=false)된다", () => {
    setExpanded("someday");
    renderSomeday();
    expect(screen.getByTestId("add-bullet-someday").className).toContain("opacity-100");
    expect(screen.getByTestId("add-bullet-someday-region")).toHaveAttribute("aria-hidden", "false");
  });

  it("추가 버튼 영역에 부드러운 전환(transition)이 적용돼 있다 (motion-reduce 대응)", () => {
    setExpanded("someday");
    renderSomeday();
    const region = screen.getByTestId("add-bullet-someday-region");
    expect(region.className).toContain("duration-300");
    expect(region.className).toContain("motion-reduce:transition-none");
  });
});
