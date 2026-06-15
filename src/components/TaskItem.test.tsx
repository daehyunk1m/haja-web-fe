import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { StrictMode } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TaskItem from "./TaskItem";
import { useBulletStore } from "@/shared/bulletStore";
import { useSwipeRevealStore } from "@/shared/swipeRevealStore";
import { useEditingStore } from "@/shared/editingStore";
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
  useEditingStore.setState({ editingId: null });
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

  // 회귀 방지: 편집 input에서 시작된 pointerdown이 상위 정렬 드래그(@dnd-kit)로
  // 전파되면 isDragging이 켜져 행 전체가 opacity:0.5로 흐려진다. 전파를 끊어야 한다.
  it("편집 input의 pointerdown은 상위(정렬 드래그)로 전파되지 않는다", () => {
    const onParentPointerDown = vi.fn();
    render(
      <div onPointerDown={onParentPointerDown}>
        <TaskItem bulletTask={task} />
      </div>
    );
    fireEvent.click(screen.getByText("스와이프 태스크"));
    act(() => {
      vi.advanceTimersByTime(250);
    });
    fireEvent(
      screen.getByRole("textbox"),
      new MouseEvent("pointerdown", { bubbles: true })
    );

    expect(onParentPointerDown).not.toHaveBeenCalled();
  });

  // 회귀 방지: StrictMode는 mount 시 effect를 setup→cleanup→setup으로 재실행한다.
  // 이 가짜 cleanup에서 편집이 즉시 닫히면 안 된다.
  it("StrictMode에서도 편집 모드에 진입하고 유지된다", () => {
    render(
      <StrictMode>
        <TaskItem bulletTask={task} />
      </StrictMode>
    );
    fireEvent.click(screen.getByText("스와이프 태스크"));
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

// -------------------------------------------------------------------------
describe("TaskItem 편집 단일 조율", () => {
  let taskA: TaskCore;
  let taskB: TaskCore;

  beforeEach(() => {
    vi.useFakeTimers();
    taskA = new TaskCore("태스크 A");
    taskB = new TaskCore("태스크 B");
    useBulletStore.setState({
      tasks: new Map([
        [taskA.id, taskA],
        [taskB.id, taskB],
      ]),
      taskOrder: {},
    });
    useEditingStore.setState({ editingId: null });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // 타이틀 클릭 후 250ms 지나면 편집 진입(단일 클릭 판정)
  function clickTitle(label: string) {
    fireEvent.click(screen.getByText(label));
    act(() => {
      vi.advanceTimersByTime(250);
    });
  }

  it("편집 중 다른 태스크의 타이틀을 클릭하면 기존 편집만 종료되고 클릭한 태스크는 편집되지 않는다", () => {
    render(
      <>
        <TaskItem bulletTask={taskA} />
        <TaskItem bulletTask={taskB} />
      </>
    );
    clickTitle("태스크 A");
    expect(screen.getAllByRole("textbox")).toHaveLength(1);

    // 편집 중 다른 타이틀 클릭 → 기존 편집만 종료, 클릭한 태스크는 편집되지 않음
    clickTitle("태스크 B");
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });

  it("편집 중 다른 태스크를 클릭하면 편집 중이던 내용이 저장된다", () => {
    render(
      <>
        <TaskItem bulletTask={taskA} />
        <TaskItem bulletTask={taskB} />
      </>
    );
    clickTitle("태스크 A");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "수정된 A" } });

    clickTitle("태스크 B");

    expect(useBulletStore.getState().tasks.get(taskA.id)?.title).toBe("수정된 A");
  });
});

// -------------------------------------------------------------------------
describe("TaskItem 긴 제목 줄바꿈", () => {
  it("긴 제목은 한 줄 고정(whitespace-nowrap) 없이 줄바꿈된다", () => {
    const longTitle =
      "엄청나게엄청나게엄청나게긴태스크이름 plus-a-very-long-unbreakable-word-aaaaaaaaaaaaaaaaaaaa";
    const longTask = new TaskCore(longTitle);
    useBulletStore.setState({
      tasks: new Map([[longTask.id, longTask]]),
      taskOrder: {},
    });

    render(<TaskItem bulletTask={longTask} />);
    const titleEl = screen.getByText(longTitle);

    // whitespace-nowrap이 있으면 컨테이너 밖으로 넘쳐 잘린다 → 없어야 한다
    expect(titleEl.className).not.toContain("whitespace-nowrap");
    // 공백 없는 긴 단어도 강제로 줄바꿈되도록 break-* 유틸이 있어야 한다
    expect(titleEl.className).toMatch(/break-/);
  });
});
