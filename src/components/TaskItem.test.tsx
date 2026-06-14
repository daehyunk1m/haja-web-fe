import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TaskItem from "./TaskItem";
import { useBulletStore } from "@/shared/bulletStore";
import { useSwipeRevealStore } from "@/shared/swipeRevealStore";
import { TaskCore } from "@/shared/TaskCore";

// BulletIcon은 popupStore/dateStore 의존이 있어 모킹한다.
vi.mock("./BulletIcon", () => ({
  default: ({ bulletState }: { bulletState: string }) => (
    <div data-testid={`bullet-icon-${bulletState}`} />
  ),
}));

let task: TaskCore;

beforeEach(() => {
  task = new TaskCore("스와이프 태스크");
  useBulletStore.setState({ tasks: new Map([[task.id, task]]), taskOrder: {} });
  useSwipeRevealStore.setState({ openId: null });
});

// jsdom에는 PointerEvent가 없으므로 MouseEvent(pointer* 타입명)로 대체한다.
function swipeLeft(content: Element, fromX = 200, toX = 110, y = 100) {
  fireEvent(content, new MouseEvent("pointerdown", { clientX: fromX, clientY: y, bubbles: true }));
  fireEvent(window, new MouseEvent("pointermove", { clientX: toX, clientY: y }));
  fireEvent(window, new MouseEvent("pointerup", {}));
}

describe("TaskItem 스와이프 삭제", () => {
  it("제목을 렌더링한다", () => {
    render(<TaskItem bulletTask={task} />);
    expect(screen.getByText("스와이프 태스크")).toBeInTheDocument();
  });

  it("초기에는 삭제 영역이 숨겨져 있다", () => {
    render(<TaskItem bulletTask={task} />);
    // aria-hidden 요소는 접근명이 비므로 testid로 조회한다
    expect(screen.getByTestId("delete-action")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("swipe-content")).toHaveAttribute("data-swipe-open", "false");
  });

  it("왼쪽으로 슬라이드하면 삭제 영역이 드러난다", () => {
    render(<TaskItem bulletTask={task} />);
    swipeLeft(screen.getByTestId("swipe-content"));

    expect(screen.getByTestId("swipe-content")).toHaveAttribute("data-swipe-open", "true");
    expect(screen.getByTestId("delete-action")).toHaveAttribute("aria-hidden", "false");
  });

  it("드러난 삭제 버튼 클릭 시 태스크가 삭제된다", () => {
    render(<TaskItem bulletTask={task} />);
    swipeLeft(screen.getByTestId("swipe-content"));
    fireEvent.click(screen.getByTestId("delete-action"));

    expect(useBulletStore.getState().tasks.has(task.id)).toBe(false);
  });

  it("세로로 움직이면 삭제 영역이 열리지 않는다", () => {
    render(<TaskItem bulletTask={task} />);
    const content = screen.getByTestId("swipe-content");
    fireEvent(content, new MouseEvent("pointerdown", { clientX: 200, clientY: 100, bubbles: true }));
    fireEvent(window, new MouseEvent("pointermove", { clientX: 205, clientY: 185 }));
    fireEvent(window, new MouseEvent("pointerup", {}));

    expect(content).toHaveAttribute("data-swipe-open", "false");
  });
});

// -------------------------------------------------------------------------
describe("TaskItem 스와이프 단일 열림 조율", () => {
  let taskA: TaskCore;
  let taskB: TaskCore;

  beforeEach(() => {
    taskA = new TaskCore("태스크 A");
    taskB = new TaskCore("태스크 B");
    useBulletStore.setState({
      tasks: new Map([
        [taskA.id, taskA],
        [taskB.id, taskB],
      ]),
      taskOrder: {},
    });
    useSwipeRevealStore.setState({ openId: null });
  });

  it("다른 태스크를 스와이프하면 열려 있던 태스크가 닫힌다", () => {
    render(
      <>
        <TaskItem bulletTask={taskA} />
        <TaskItem bulletTask={taskB} />
      </>
    );
    const [contentA, contentB] = screen.getAllByTestId("swipe-content");

    swipeLeft(contentA);
    expect(contentA).toHaveAttribute("data-swipe-open", "true");

    swipeLeft(contentB);
    expect(contentB).toHaveAttribute("data-swipe-open", "true");
    expect(contentA).toHaveAttribute("data-swipe-open", "false");
  });

  it("드래그 시작(openId=null)이 열려 있던 태스크를 닫는다", () => {
    render(<TaskItem bulletTask={taskA} />);
    const contentA = screen.getByTestId("swipe-content");

    swipeLeft(contentA);
    expect(contentA).toHaveAttribute("data-swipe-open", "true");

    // SectionList의 onDragStart가 호출하는 것과 동일하게 활성 해제
    act(() => {
      useSwipeRevealStore.getState().actions.setOpenId(null);
    });
    expect(contentA).toHaveAttribute("data-swipe-open", "false");
  });
});
