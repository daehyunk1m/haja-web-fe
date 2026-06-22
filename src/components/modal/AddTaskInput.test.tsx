import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddTaskInput from "./AddTaskInput";
import { useBulletStore } from "@/shared/bulletStore";
import { useAddModalStore } from "@/shared/addModalStore";
import { useDateStore } from "@/shared/dateStore";

// BulletIcon은 popupStore 등 복잡한 의존성이 있으므로 모킹
vi.mock("../BulletIcon", () => ({
  default: () => <div data-testid='bullet-icon' />,
}));

// Ico.Send도 SVG라 모킹
vi.mock("../Ico", () => ({
  default: Object.assign(() => null, {
    Send: () => <span data-testid='send-icon'>전송</span>,
  }),
}));

beforeEach(() => {
  useBulletStore.setState({ tasks: new Map() });
  useAddModalStore.setState({ isAddModalOpen: true, type: "task" });
  // dateStore는 toBulletString이 "2024-01-15"를 반환하도록 고정
  vi.spyOn(useDateStore.getState(), "toBulletString").mockReturnValue("2024-01-15");
});

// -------------------------------------------------------------------------
describe("렌더링", () => {
  it("placeholder가 표시된다", () => {
    render(<AddTaskInput />);
    expect(screen.getByPlaceholderText("할 일을 입력해주세요.")).toBeInTheDocument();
  });

  it("전송 버튼이 렌더링된다", () => {
    render(<AddTaskInput />);
    expect(screen.getByTestId("send-icon")).toBeInTheDocument();
  });

  it("BulletIcon이 렌더링된다", () => {
    render(<AddTaskInput />);
    expect(screen.getByTestId("bullet-icon")).toBeInTheDocument();
  });
});

// -------------------------------------------------------------------------
describe("입력", () => {
  it("텍스트 입력 시 input value가 업데이트된다", () => {
    render(<AddTaskInput />);
    const input = screen.getByPlaceholderText("할 일을 입력해주세요.");

    fireEvent.change(input, { target: { value: "새 태스크" } });
    expect(input).toHaveValue("새 태스크");
  });
});

// -------------------------------------------------------------------------
describe("전송", () => {
  it("전송 버튼 클릭 시 입력한 텍스트로 태스크가 추가된다", () => {
    render(<AddTaskInput />);
    const input = screen.getByPlaceholderText("할 일을 입력해주세요.");

    fireEvent.change(input, { target: { value: "새 태스크" } });
    fireEvent.click(screen.getByRole("button"));

    const tasks = Array.from(useBulletStore.getState().tasks.values());
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("새 태스크");
  });

  it("전송 버튼 클릭 시 모달이 닫힌다", () => {
    render(<AddTaskInput />);

    fireEvent.change(screen.getByPlaceholderText("할 일을 입력해주세요."), {
      target: { value: "태스크" },
    });
    fireEvent.click(screen.getByRole("button"));

    expect(useAddModalStore.getState().isAddModalOpen).toBe(false);
  });

  it("전송 버튼 클릭 시 createdAt이 현재 날짜로 설정된다", () => {
    render(<AddTaskInput />);

    fireEvent.change(screen.getByPlaceholderText("할 일을 입력해주세요."), {
      target: { value: "날짜 태스크" },
    });
    fireEvent.click(screen.getByRole("button"));

    const tasks = Array.from(useBulletStore.getState().tasks.values());
    expect(tasks[0].createdAt).toBe("2024-01-15");
  });
});

// -------------------------------------------------------------------------
describe("빈 제목 검증", () => {
  it("빈 입력으로 전송하면 태스크가 추가되지 않는다", () => {
    render(<AddTaskInput />);
    fireEvent.click(screen.getByRole("button"));

    expect(useBulletStore.getState().tasks.size).toBe(0);
  });

  it("공백만 입력하면 태스크가 추가되지 않는다", () => {
    render(<AddTaskInput />);
    fireEvent.change(screen.getByPlaceholderText("할 일을 입력해주세요."), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button"));

    expect(useBulletStore.getState().tasks.size).toBe(0);
  });

  it("빈 입력으로 전송해도 모달이 닫히지 않는다", () => {
    render(<AddTaskInput />);
    fireEvent.click(screen.getByRole("button"));

    expect(useAddModalStore.getState().isAddModalOpen).toBe(true);
  });
});

// -------------------------------------------------------------------------
describe("Enter 키 전송", () => {
  it("Enter 키를 누르면 입력한 텍스트로 태스크가 추가된다", () => {
    render(<AddTaskInput />);
    const input = screen.getByPlaceholderText("할 일을 입력해주세요.");

    fireEvent.change(input, { target: { value: "엔터 태스크" } });
    fireEvent.keyDown(input, { key: "Enter" });

    const tasks = Array.from(useBulletStore.getState().tasks.values());
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("엔터 태스크");
  });

  it("Enter 키로 추가하면 모달이 닫힌다", () => {
    render(<AddTaskInput />);
    const input = screen.getByPlaceholderText("할 일을 입력해주세요.");

    fireEvent.change(input, { target: { value: "엔터 태스크" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(useAddModalStore.getState().isAddModalOpen).toBe(false);
  });

  it("IME 조합 중 Enter(isComposing)는 태스크를 추가하지 않는다", () => {
    render(<AddTaskInput />);
    const input = screen.getByPlaceholderText("할 일을 입력해주세요.");

    fireEvent.change(input, { target: { value: "한글" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });

    expect(useBulletStore.getState().tasks.size).toBe(0);
  });
});
