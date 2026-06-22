import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useProgressStore } from "./progressStore";
import { TaskCore } from "./TaskCore";
import { Bullet } from "./types/taskType";

const FIXED_DATE = "2024-01-15";

beforeEach(() => {
  vi.spyOn(TaskCore, "today").mockReturnValue(FIXED_DATE);
  useProgressStore.setState({ progressRange: 0, selectedTasks: [] });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const getState = () => useProgressStore.getState();

// 헬퍼: 지정된 상태의 TaskCore 생성
const makeTask = (state: Bullet) =>
  new TaskCore("테스트 태스크").changeState(state);

// -------------------------------------------------------------------------
describe("초기 상태", () => {
  it("progressRange 초기값은 0이다", () => {
    expect(getState().progressRange).toBe(0);
  });

  it("selectedTasks 초기값은 빈 배열이다", () => {
    expect(getState().selectedTasks).toHaveLength(0);
  });
});

// -------------------------------------------------------------------------
describe("setSelectedTasks", () => {
  it("빈 배열 설정 시 progressRange가 0이다 (NaN 버그 방지)", () => {
    getState().actions.setSelectedTasks([]);
    expect(getState().progressRange).toBe(0);
    expect(getState().progressRange).not.toBeNaN();
  });

  it("완료 태스크가 없으면 progressRange는 0이다", () => {
    const tasks = [
      new TaskCore("태스크 1"),
      new TaskCore("태스크 2"),
    ];
    getState().actions.setSelectedTasks(tasks);
    expect(getState().progressRange).toBe(0);
  });

  it("모든 태스크가 완료이면 progressRange는 100이다", () => {
    const tasks = [
      makeTask(Bullet.DONE),
      makeTask(Bullet.DONE),
    ];
    getState().actions.setSelectedTasks(tasks);
    expect(getState().progressRange).toBe(100);
  });

  it("절반 완료 시 progressRange는 50이다", () => {
    const tasks = [
      makeTask(Bullet.DONE),
      new TaskCore("미완료"),
    ];
    getState().actions.setSelectedTasks(tasks);
    expect(getState().progressRange).toBe(50);
  });

  it("25% 완료 시 progressRange는 25이다", () => {
    const tasks = [
      makeTask(Bullet.DONE),
      new TaskCore("미완료 1"),
      new TaskCore("미완료 2"),
      new TaskCore("미완료 3"),
    ];
    getState().actions.setSelectedTasks(tasks);
    expect(getState().progressRange).toBe(25);
  });

  it("CANCEL 태스크도 isClosed이므로 완료로 계산된다", () => {
    const tasks = [
      makeTask(Bullet.CANCEL),
      new TaskCore("미완료"),
    ];
    getState().actions.setSelectedTasks(tasks);
    expect(getState().progressRange).toBe(50);
  });

  it("selectedTasks가 스토어에 저장된다", () => {
    const task = new TaskCore("저장 태스크");
    getState().actions.setSelectedTasks([task]);
    expect(getState().selectedTasks).toHaveLength(1);
    expect(getState().selectedTasks[0].title).toBe("저장 태스크");
  });
});
