import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useBulletStore } from "./bulletStore";
import { TaskCore } from "./TaskCore";
import { Bullet } from "./types/taskType";

const FIXED_DATE = "2024-01-15";
const LS_KEY = "localBullets";

// TaskCore.today()를 고정
beforeEach(() => {
  vi.spyOn(TaskCore, "today").mockReturnValue(FIXED_DATE);
  // 각 테스트 전 tasks만 초기화 (액션은 보존)
  useBulletStore.setState({ tasks: new Map() });
  // localStorage 초기화
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// 헬퍼: 스토어 상태에서 tasks 배열로 변환
const getTasks = () => Array.from(useBulletStore.getState().tasks.values());
const getTask = (id: string) => useBulletStore.getState().tasks.get(id);

// -------------------------------------------------------------------------
describe("addBullet", () => {
  it("제목으로 태스크를 추가할 수 있다", () => {
    useBulletStore.getState().addBullet("새 태스크", {});
    expect(getTasks()).toHaveLength(1);
    expect(getTasks()[0].title).toBe("새 태스크");
  });

  it("추가된 태스크의 초기 상태는 TODO이다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    expect(getTasks()[0].state).toBe(Bullet.TODO);
  });

  it("createdAt 옵션을 지정할 수 있다", () => {
    useBulletStore.getState().addBullet("태스크", { createdAt: "2024-01-10" });
    expect(getTasks()[0].createdAt).toBe("2024-01-10");
  });

  it("여러 태스크를 추가하면 각각 고유한 id를 갖는다", () => {
    useBulletStore.getState().addBullet("태스크 1", {});
    useBulletStore.getState().addBullet("태스크 2", {});
    const tasks = getTasks();
    expect(tasks).toHaveLength(2);
    expect(tasks[0].id).not.toBe(tasks[1].id);
  });
});

// -------------------------------------------------------------------------
describe("changeBulletState", () => {
  it("존재하는 태스크의 상태를 변경할 수 있다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const id = getTasks()[0].id;

    useBulletStore.getState().changeBulletState(id, Bullet.DONE);
    expect(getTask(id)!.state).toBe(Bullet.DONE);
  });

  it("존재하지 않는 id는 스토어를 변경하지 않는다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const before = getTasks().length;
    useBulletStore.getState().changeBulletState("nonexistent", Bullet.DONE);
    expect(getTasks()).toHaveLength(before);
  });

  it("date 파라미터를 전달하면 해당 날짜로 이벤트가 기록된다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const id = getTasks()[0].id;

    useBulletStore.getState().changeBulletState(id, Bullet.DONE, "2024-01-20");
    expect(getTask(id)!.events.at(-1)!.date).toBe("2024-01-20");
  });

  it("DONE 전이 후 completedAt이 설정된다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const id = getTasks()[0].id;

    useBulletStore.getState().changeBulletState(id, Bullet.DONE);
    expect(getTask(id)!.completedAt).toBeDefined();
  });
});

// -------------------------------------------------------------------------
describe("editBullet", () => {
  it("태스크의 title을 수정할 수 있다", () => {
    useBulletStore.getState().addBullet("원래 제목", {});
    const id = getTasks()[0].id;

    useBulletStore.getState().editBullet(id, { title: "수정된 제목" });
    expect(getTask(id)!.title).toBe("수정된 제목");
  });

  it("태스크의 note를 수정할 수 있다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const id = getTasks()[0].id;

    useBulletStore.getState().editBullet(id, { note: "메모 추가" });
    expect(getTask(id)!.note).toBe("메모 추가");
  });

  it("존재하지 않는 id는 스토어를 변경하지 않는다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const titleBefore = getTasks()[0].title;

    useBulletStore.getState().editBullet("nonexistent", { title: "수정 시도" });
    expect(getTasks()[0].title).toBe(titleBefore);
  });
});

// -------------------------------------------------------------------------
describe("deleteBullet", () => {
  it("태스크를 삭제할 수 있다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const id = getTasks()[0].id;

    useBulletStore.getState().deleteBullet(id);
    expect(getTasks()).toHaveLength(0);
  });

  it("존재하지 않는 id 삭제 시 다른 태스크에 영향을 주지 않는다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    useBulletStore.getState().deleteBullet("nonexistent");
    expect(getTasks()).toHaveLength(1);
  });
});

// -------------------------------------------------------------------------
describe("toggleDone", () => {
  it("TODO 상태에서 toggleDone하면 DONE이 된다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const id = getTasks()[0].id;

    useBulletStore.getState().toggleDone(id);
    expect(getTask(id)!.state).toBe(Bullet.DONE);
  });

  it("DONE 상태에서 toggleDone하면 이전 상태로 돌아간다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const id = getTasks()[0].id;

    // TODO → DONE → 이전(TODO)
    useBulletStore.getState().toggleDone(id);
    useBulletStore.getState().toggleDone(id);
    expect(getTask(id)!.state).toBe(Bullet.TODO);
  });

  it("존재하지 않는 id는 스토어를 변경하지 않는다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const before = getTasks().length;
    useBulletStore.getState().toggleDone("nonexistent");
    expect(getTasks()).toHaveLength(before);
  });
});

// -------------------------------------------------------------------------
describe("postpone", () => {
  it("기준일 이전에 생성된 미완료 태스크가 이관된다", () => {
    useBulletStore.getState().addBullet("오래된 태스크", { createdAt: "2024-01-14" });
    const id = getTasks()[0].id;

    useBulletStore.getState().postpone("2024-01-15");
    expect(getTask(id)!.events.at(-1)!.date).toBe("2024-01-15");
  });

  it("완료 태스크는 이관되지 않는다 (이벤트 개수 불변)", () => {
    useBulletStore.getState().addBullet("완료 태스크", { createdAt: "2024-01-14" });
    const id = getTasks()[0].id;
    useBulletStore.getState().changeBulletState(id, Bullet.DONE);
    const eventCountAfterDone = getTask(id)!.events.length;

    useBulletStore.getState().postpone("2024-01-15");
    expect(getTask(id)!.events).toHaveLength(eventCountAfterDone);
  });

  it("기준일과 같은 날 생성된 태스크는 이관되지 않는다", () => {
    useBulletStore.getState().addBullet("오늘 태스크", { createdAt: "2024-01-15" });
    const id = getTasks()[0].id;
    const eventCountBefore = getTask(id)!.events.length;

    useBulletStore.getState().postpone("2024-01-15");
    expect(getTask(id)!.events).toHaveLength(eventCountBefore);
  });

  it("여러 미완료 태스크가 모두 이관된다", () => {
    useBulletStore.getState().addBullet("태스크 A", { createdAt: "2024-01-13" });
    useBulletStore.getState().addBullet("태스크 B", { createdAt: "2024-01-14" });
    const ids = getTasks().map((t) => t.id);

    useBulletStore.getState().postpone("2024-01-15");
    ids.forEach((id) => {
      expect(getTask(id)!.events.at(-1)!.date).toBe("2024-01-15");
    });
  });
});

// -------------------------------------------------------------------------
describe("persist (localStorage 직렬화)", () => {
  it("태스크 추가 후 localStorage에 직렬화된 데이터가 저장된다", () => {
    useBulletStore.getState().addBullet("저장 태스크", {});
    const raw = localStorage.getItem(LS_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.tasks).toHaveLength(1);
    expect(parsed.state.tasks[0].title).toBe("저장 태스크");
  });

  it("직렬화된 데이터에는 events 배열이 포함된다", () => {
    useBulletStore.getState().addBullet("태스크", {});
    const raw = localStorage.getItem(LS_KEY);
    const parsed = JSON.parse(raw!);
    expect(Array.isArray(parsed.state.tasks[0].events)).toBe(true);
  });
});
