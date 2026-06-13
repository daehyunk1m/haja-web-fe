import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "./TaskItem";
import { useBulletStore } from "@/shared/bulletStore";
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
