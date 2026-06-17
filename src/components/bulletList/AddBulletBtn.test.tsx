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

  it("확장(열림) 시 컨테이너보다 늦게 출발하도록 stagger(delay)와 전환이 적용된다", () => {
    setExpanded("someday");
    renderSomeday();
    const region = screen.getByTestId("add-bullet-someday-region");
    expect(region.className).toContain("transition-[grid-template-rows]");
    expect(region.className).toContain("duration-200");
    expect(region.className).toContain("delay-100"); // 컨테이너(0.3s)가 먼저 오른 뒤 시작 → 0.1+0.2=0.3s에 함께 끝
    expect(region.className).toContain("motion-reduce:transition-none");
  });

  it("접힘(닫힘) 시에는 delay 없이 빠르게 접힌다 (컨테이너 밖 오버플로 방지)", () => {
    setExpanded("task"); // 섬데이 접힘
    renderSomeday();
    const region = screen.getByTestId("add-bullet-someday-region");
    expect(region.className).not.toContain("delay-100");
    expect(region.className).toContain("duration-200");
  });
});
