import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOrderedTasks } from "./useOrderedTasks";
import { useBulletStore } from "@/shared/bulletStore";
import { TaskCore } from "@/shared/TaskCore";
import { Bullet } from "@/shared/types/taskType";

const FIXED_DATE = "2024-01-15";

beforeEach(() => {
  vi.spyOn(TaskCore, "today").mockReturnValue(FIXED_DATE);
  useBulletStore.setState({ tasks: new Map(), taskOrder: {} });
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** 테스트용 TaskCore 생성 헬퍼 */
const makeTask = (id: string, title: string) =>
  TaskCore.from({
    id,
    type: "task",
    title,
    createdAt: FIXED_DATE,
    events: [{ date: FIXED_DATE, state: Bullet.TODO }],
  });

describe("useOrderedTasks", () => {
  it("순서가 없을 때 원본 배열을 그대로 반환한다", () => {
    const tasks = [makeTask("a", "A"), makeTask("b", "B")];
    const { result } = renderHook(() =>
      useOrderedTasks(tasks, FIXED_DATE, "task")
    );

    expect(result.current.orderedTasks.map((t) => t.id)).toEqual(["a", "b"]);
  });

  it("taskOrder에 [C, A, B] 순서가 있으면 그에 맞게 정렬한다", () => {
    const tasks = [makeTask("a", "A"), makeTask("b", "B"), makeTask("c", "C")];

    useBulletStore.setState({
      taskOrder: { [`${FIXED_DATE}|task`]: ["c", "a", "b"] },
    });

    const { result } = renderHook(() =>
      useOrderedTasks(tasks, FIXED_DATE, "task")
    );

    expect(result.current.orderedTasks.map((t) => t.id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("순서에 없는 새 태스크는 끝에 추가된다", () => {
    const tasks = [makeTask("a", "A"), makeTask("b", "B"), makeTask("c", "C")];

    // 순서에 a, b만 있고 c는 없음
    useBulletStore.setState({
      taskOrder: { [`${FIXED_DATE}|task`]: ["b", "a"] },
    });

    const { result } = renderHook(() =>
      useOrderedTasks(tasks, FIXED_DATE, "task")
    );

    expect(result.current.orderedTasks.map((t) => t.id)).toEqual([
      "b",
      "a",
      "c",
    ]);
  });

  it("순서에 있지만 tasks에 없는 id는 무시된다", () => {
    const tasks = [makeTask("a", "A"), makeTask("b", "B")];

    // 순서에 삭제된 "x"가 포함
    useBulletStore.setState({
      taskOrder: { [`${FIXED_DATE}|task`]: ["x", "b", "a"] },
    });

    const { result } = renderHook(() =>
      useOrderedTasks(tasks, FIXED_DATE, "task")
    );

    expect(result.current.orderedTasks.map((t) => t.id)).toEqual(["b", "a"]);
  });

  it("handleReorder 호출 시 스토어의 reorderTasks가 올바른 키로 호출된다", () => {
    const tasks = [makeTask("a", "A"), makeTask("b", "B")];

    const { result } = renderHook(() =>
      useOrderedTasks(tasks, FIXED_DATE, "task")
    );

    act(() => {
      result.current.handleReorder(["b", "a"]);
    });

    const orderKey = `${FIXED_DATE}|task`;
    expect(useBulletStore.getState().taskOrder[orderKey]).toEqual(["b", "a"]);
  });
});
