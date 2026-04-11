import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PopupContainer from "./PopupContainer";
import { useBulletStore } from "@/shared/bulletStore";
import { usePopupStore } from "@/shared/popupStores";
import { useDateStore } from "@/shared/dateStore";
import { TaskCore } from "@/shared/TaskCore";
import { Bullet } from "@/shared/types/taskType";

// BulletIcon은 popupStore 등 복잡한 의존성이 있으므로 모킹
vi.mock("./BulletIcon", () => ({
  default: ({ bulletState }: { bulletState: string }) => (
    <div data-testid={`bullet-icon-${bulletState}`} />
  ),
}));

let task: TaskCore;

beforeEach(() => {
  task = new TaskCore("테스트 태스크");
  useBulletStore.setState({ tasks: new Map([[task.id, task]]) });
  usePopupStore.setState({
    isModalOpen: true,
    targetId: task.id,
    position: { x: 0, y: 0 },
  });
  vi.spyOn(useDateStore.getState(), "toBulletString").mockReturnValue("2024-01-15");
});

// -------------------------------------------------------------------------
describe("렌더링", () => {
  it("isModalOpen이 false면 아무것도 렌더링되지 않는다", () => {
    usePopupStore.setState({ isModalOpen: false });
    const { container } = render(<PopupContainer />);
    expect(container.firstChild).toBeNull();
  });

  it("isModalOpen이 true면 5개 상태 항목이 렌더링된다", () => {
    render(<PopupContainer />);
    expect(screen.getByText("To do")).toBeInTheDocument();
    expect(screen.getByText("On going")).toBeInTheDocument();
    expect(screen.getByText("Delay")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});

// -------------------------------------------------------------------------
describe("상태 변경", () => {
  it("Done 클릭 시 bulletStore의 태스크 state가 done으로 변경된다", () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByText("Done"));

    const updated = useBulletStore.getState().tasks.get(task.id);
    expect(updated?.state).toBe(Bullet.DONE);
  });

  it("Cancel 클릭 시 bulletStore의 태스크 state가 cancel로 변경된다", () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByText("Cancel"));

    const updated = useBulletStore.getState().tasks.get(task.id);
    expect(updated?.state).toBe(Bullet.CANCEL);
  });

  it("Ongoing 클릭 시 bulletStore의 태스크 state가 ongoing으로 변경된다", () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByText("On going"));

    const updated = useBulletStore.getState().tasks.get(task.id);
    expect(updated?.state).toBe(Bullet.ONGOING);
  });
});

// -------------------------------------------------------------------------
describe("팝업 닫힘", () => {
  it("상태 항목 클릭 시 팝업이 닫힌다", () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByText("Done"));

    expect(usePopupStore.getState().isModalOpen).toBe(false);
  });
});

// -------------------------------------------------------------------------
describe("타입 변경", () => {
  it("task 타입 태스크에 대해 'Someday로 이동' 버튼이 렌더링된다", () => {
    render(<PopupContainer />);
    expect(screen.getByText("Someday로 이동")).toBeInTheDocument();
  });

  it("someday 타입 태스크에 대해 'Task로 이동' 버튼이 렌더링된다", () => {
    const somedayTask = new TaskCore("someday 태스크", { type: "someday" });
    useBulletStore.setState({ tasks: new Map([[somedayTask.id, somedayTask]]) });
    usePopupStore.setState({ targetId: somedayTask.id });

    render(<PopupContainer />);
    expect(screen.getByText("Task로 이동")).toBeInTheDocument();
  });

  it("'Someday로 이동' 클릭 시 태스크 type이 someday로 변경된다", () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByText("Someday로 이동"));

    const updated = useBulletStore.getState().tasks.get(task.id);
    expect(updated?.type).toBe("someday");
  });

  it("타입 변경 후 팝업이 닫힌다", () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByText("Someday로 이동"));

    expect(usePopupStore.getState().isModalOpen).toBe(false);
  });
});
