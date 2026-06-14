import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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

  it("삭제 버튼 클릭 시 바로 삭제되지 않고 확인 모달이 뜬다", () => {
    render(<TaskItem bulletTask={task} />);
    swipeLeft(screen.getByTestId("swipe-content"));
    fireEvent.click(screen.getByTestId("delete-action"));

    expect(screen.getByText("정말 삭제하시겠습니까?")).toBeInTheDocument();
    expect(useBulletStore.getState().tasks.has(task.id)).toBe(true);
  });

  it("확인 모달에서 삭제를 누르면 태스크가 삭제된다", () => {
    render(<TaskItem bulletTask={task} />);
    swipeLeft(screen.getByTestId("swipe-content"));
    fireEvent.click(screen.getByTestId("delete-action"));
    fireEvent.click(screen.getByTestId("confirm-dialog-confirm"));

    expect(useBulletStore.getState().tasks.has(task.id)).toBe(false);
  });

  it("확인 모달에서 취소를 누르면 태스크가 유지되고 모달이 닫힌다", () => {
    render(<TaskItem bulletTask={task} />);
    swipeLeft(screen.getByTestId("swipe-content"));
    fireEvent.click(screen.getByTestId("delete-action"));
    fireEvent.click(screen.getByTestId("confirm-dialog-cancel"));

    expect(useBulletStore.getState().tasks.has(task.id)).toBe(true);
    expect(screen.queryByText("정말 삭제하시겠습니까?")).not.toBeInTheDocument();
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

  it("스와이프된 상태에서 바깥 영역을 클릭하면 스와이프가 풀린다", () => {
    render(<TaskItem bulletTask={taskA} />);
    const content = screen.getByTestId("swipe-content");

    swipeLeft(content);
    expect(content).toHaveAttribute("data-swipe-open", "true");

    fireEvent(document.body, new MouseEvent("pointerdown", { bubbles: true }));
    expect(content).toHaveAttribute("data-swipe-open", "false");
  });

  it("스와이프된 태스크 내부를 클릭하면 스와이프가 유지된다", () => {
    render(<TaskItem bulletTask={taskA} />);
    const content = screen.getByTestId("swipe-content");

    swipeLeft(content);
    expect(content).toHaveAttribute("data-swipe-open", "true");

    // 드러난 삭제 버튼 등 내부 요소 클릭은 스와이프를 풀지 않는다
    fireEvent(
      screen.getByTestId("delete-action"),
      new MouseEvent("pointerdown", { bubbles: true })
    );
    expect(content).toHaveAttribute("data-swipe-open", "true");
  });
});

// -------------------------------------------------------------------------
describe("TaskItem 타이틀 편집", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // 타이틀 단일 클릭 후 250ms 지나면 편집 모드(input) 진입
  function openEditor() {
    render(<TaskItem bulletTask={task} />);
    fireEvent.click(screen.getByText("스와이프 태스크"));
    act(() => {
      vi.advanceTimersByTime(250);
    });
    return screen.getByRole("textbox");
  }

  it("Enter를 누르면 수정이 저장된다", () => {
    const input = openEditor();
    fireEvent.change(input, { target: { value: "엔터 제목" } });
    fireEvent.keyUp(input, { key: "Enter" });

    expect(useBulletStore.getState().tasks.get(task.id)?.title).toBe("엔터 제목");
  });

  it("타이틀 영역 바깥을 클릭(blur)하면 수정이 저장된다", () => {
    const input = openEditor();
    fireEvent.change(input, { target: { value: "블러 제목" } });
    fireEvent.blur(input);

    expect(useBulletStore.getState().tasks.get(task.id)?.title).toBe("블러 제목");
  });

  it("Escape로 취소하면 수정이 저장되지 않는다", () => {
    const input = openEditor();
    fireEvent.change(input, { target: { value: "버려질 제목" } });
    fireEvent.keyUp(input, { key: "Escape" });

    expect(useBulletStore.getState().tasks.get(task.id)?.title).toBe("스와이프 태스크");
  });
});
