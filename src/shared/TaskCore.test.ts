import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TaskCore, TaskRecordDTO } from "./TaskCore";
import { Bullet } from "./types/taskType";

const FIXED_DATE = "2024-01-15";

describe("TaskCore", () => {
  beforeEach(() => {
    vi.spyOn(TaskCore, "today").mockReturnValue(FIXED_DATE);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  describe("생성", () => {
    it("제목으로 인스턴스를 생성할 수 있다", () => {
      const task = new TaskCore("테스트 태스크");
      expect(task.title).toBe("테스트 태스크");
    });

    it("id가 자동으로 생성된다", () => {
      const task = new TaskCore("태스크");
      expect(task.id).toBeTruthy();
      expect(typeof task.id).toBe("string");
    });

    it("두 인스턴스의 id는 서로 다르다", () => {
      const t1 = new TaskCore("태스크 1");
      const t2 = new TaskCore("태스크 2");
      expect(t1.id).not.toBe(t2.id);
    });

    it("커스텀 id를 지정할 수 있다", () => {
      const task = new TaskCore("태스크", { id: "custom-id-123" });
      expect(task.id).toBe("custom-id-123");
    });

    it("note 옵션을 지정할 수 있다", () => {
      const task = new TaskCore("태스크", { note: "상세 설명" });
      expect(task.note).toBe("상세 설명");
    });

    it("type 옵션을 지정할 수 있다 (someday)", () => {
      const task = new TaskCore("태스크", { type: "someday" });
      expect(task.type).toBe("someday");
    });

    it("type 기본값은 'task'이다", () => {
      const task = new TaskCore("태스크");
      expect(task.type).toBe("task");
    });

    it("createdAt 기본값은 TaskCore.today() 반환값이다", () => {
      const task = new TaskCore("태스크");
      expect(task.createdAt).toBe(FIXED_DATE);
    });

    it("커스텀 createdAt을 지정할 수 있다", () => {
      const task = new TaskCore("태스크", { createdAt: "2023-12-01" });
      expect(task.createdAt).toBe("2023-12-01");
    });

    it("초기 상태는 TODO이다", () => {
      const task = new TaskCore("태스크");
      expect(task.state).toBe(Bullet.TODO);
    });

    it("생성 직후 events에 초기 TODO 이벤트가 1개 존재한다", () => {
      const task = new TaskCore("태스크");
      expect(task.events).toHaveLength(1);
      expect(task.events[0]).toEqual({ date: FIXED_DATE, state: Bullet.TODO });
    });

    it("초기 completedAt은 undefined이다", () => {
      const task = new TaskCore("태스크");
      expect(task.completedAt).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe("changeState", () => {
    it("TODO → ONGOING 전이가 가능하다", () => {
      const task = new TaskCore("태스크");
      const next = task.changeState(Bullet.ONGOING);
      expect(next.state).toBe(Bullet.ONGOING);
    });

    it("TODO → DELAY 전이가 가능하다", () => {
      const task = new TaskCore("태스크");
      const next = task.changeState(Bullet.DELAY);
      expect(next.state).toBe(Bullet.DELAY);
    });

    it("TODO → DONE 전이가 가능하다", () => {
      const task = new TaskCore("태스크");
      const next = task.changeState(Bullet.DONE);
      expect(next.state).toBe(Bullet.DONE);
    });

    it("TODO → CANCEL 전이가 가능하다", () => {
      const task = new TaskCore("태스크");
      const next = task.changeState(Bullet.CANCEL);
      expect(next.state).toBe(Bullet.CANCEL);
    });

    it("DONE → TODO 전이가 가능하다 (완료 취소)", () => {
      const task = new TaskCore("태스크").changeState(Bullet.DONE);
      const reverted = task.changeState(Bullet.TODO);
      expect(reverted.state).toBe(Bullet.TODO);
    });

    it("CANCEL → TODO 전이가 가능하다 (취소 철회)", () => {
      const task = new TaskCore("태스크").changeState(Bullet.CANCEL);
      const reverted = task.changeState(Bullet.TODO);
      expect(reverted.state).toBe(Bullet.TODO);
    });

    it("같은 상태로 전이하면 동일 인스턴스를 반환한다", () => {
      const task = new TaskCore("태스크");
      const result = task.changeState(Bullet.TODO);
      expect(result).toBe(task);
    });

    it("유효하지 않은 전이(DONE → ONGOING)는 원본을 반환한다", () => {
      const task = new TaskCore("태스크").changeState(Bullet.DONE);
      const result = task.changeState(Bullet.ONGOING);
      expect(result).toBe(task);
      expect(result.state).toBe(Bullet.DONE);
    });

    it("유효하지 않은 전이(CANCEL → DONE)는 원본을 반환한다", () => {
      const task = new TaskCore("태스크").changeState(Bullet.CANCEL);
      const result = task.changeState(Bullet.DONE);
      expect(result).toBe(task);
    });

    it("DONE 전이 시 completedAt이 설정된다", () => {
      const task = new TaskCore("태스크");
      const done = task.changeState(Bullet.DONE, "2024-01-20");
      expect(done.completedAt).toBe("2024-01-20");
    });

    it("CANCEL 전이 시 completedAt이 설정된다", () => {
      const task = new TaskCore("태스크");
      const cancelled = task.changeState(Bullet.CANCEL, "2024-01-20");
      expect(cancelled.completedAt).toBe("2024-01-20");
    });

    it("DONE → TODO 전이 시 completedAt이 초기화된다", () => {
      const done = new TaskCore("태스크").changeState(Bullet.DONE, "2024-01-20");
      const reverted = done.changeState(Bullet.TODO);
      expect(reverted.completedAt).toBeUndefined();
    });

    it("changeState는 원본 인스턴스를 변경하지 않는다 (불변성)", () => {
      const original = new TaskCore("태스크");
      const originalState = original.state;
      const originalEventsLength = original.events.length;
      original.changeState(Bullet.ONGOING);
      expect(original.state).toBe(originalState);
      expect(original.events).toHaveLength(originalEventsLength);
    });

    it("changeState 후 events에 새 이벤트가 추가된다", () => {
      const task = new TaskCore("태스크");
      const next = task.changeState(Bullet.ONGOING, "2024-01-16");
      expect(next.events).toHaveLength(2);
      expect(next.events[1]).toEqual({ date: "2024-01-16", state: Bullet.ONGOING });
    });

    it("date 파라미터를 생략하면 TaskCore.today()를 사용한다", () => {
      const task = new TaskCore("태스크");
      const next = task.changeState(Bullet.ONGOING);
      expect(next.events.at(-1)!.date).toBe(FIXED_DATE);
    });
  });

  // -------------------------------------------------------------------------
  describe("with", () => {
    it("빈 업데이트로 호출하면 동일한 값을 가진 새 인스턴스를 반환한다", () => {
      const task = new TaskCore("태스크", { note: "노트", type: "someday" });
      const clone = task.with({});
      expect(clone).not.toBe(task);
      expect(clone.title).toBe(task.title);
      expect(clone.note).toBe(task.note);
      expect(clone.type).toBe(task.type);
    });

    it("id는 with 이후에도 동일하게 유지된다", () => {
      const task = new TaskCore("태스크", { id: "fixed-id" });
      const clone = task.with({ title: "변경된 제목" });
      expect(clone.id).toBe("fixed-id");
    });

    it("title을 업데이트할 수 있다", () => {
      const task = new TaskCore("원래 제목");
      const updated = task.with({ title: "새 제목" });
      expect(updated.title).toBe("새 제목");
    });

    it("note를 업데이트할 수 있다", () => {
      const task = new TaskCore("태스크", { note: "원래 노트" });
      const updated = task.with({ note: "새 노트" });
      expect(updated.note).toBe("새 노트");
    });

    it("type을 업데이트할 수 있다", () => {
      const task = new TaskCore("태스크", { type: "task" });
      const updated = task.with({ type: "someday" });
      expect(updated.type).toBe("someday");
    });

    it("with는 원본 인스턴스를 변경하지 않는다", () => {
      const task = new TaskCore("원래 제목");
      task.with({ title: "새 제목" });
      expect(task.title).toBe("원래 제목");
    });

    it("with로 복제된 인스턴스의 events는 원본과 독립적이다", () => {
      const task = new TaskCore("태스크");
      const clone = task.with({});
      // clone의 events 배열을 외부에서 변경해도 원본에 영향 없어야 함
      const cloneEvents = clone.events;
      cloneEvents.push({ date: "2024-01-99", state: Bullet.DONE });
      expect(task.events).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  describe("isClosed", () => {
    it("TODO 상태에서 isClosed는 false이다", () => {
      const task = new TaskCore("태스크");
      expect(task.isClosed).toBe(false);
    });

    it("ONGOING 상태에서 isClosed는 false이다", () => {
      const task = new TaskCore("태스크").changeState(Bullet.ONGOING);
      expect(task.isClosed).toBe(false);
    });

    it("DELAY 상태에서 isClosed는 false이다", () => {
      const task = new TaskCore("태스크").changeState(Bullet.DELAY);
      expect(task.isClosed).toBe(false);
    });

    it("DONE 상태에서 isClosed는 true이다", () => {
      const task = new TaskCore("태스크").changeState(Bullet.DONE);
      expect(task.isClosed).toBe(true);
    });

    it("CANCEL 상태에서 isClosed는 true이다", () => {
      const task = new TaskCore("태스크").changeState(Bullet.CANCEL);
      expect(task.isClosed).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  describe("events 방어적 복사", () => {
    it("events getter가 반환한 배열을 변경해도 내부 이벤트 스택에 영향을 주지 않는다", () => {
      const task = new TaskCore("태스크");
      const events = task.events;
      events.push({ date: "2099-01-01", state: Bullet.DONE });
      expect(task.events).toHaveLength(1);
    });

    it("events getter를 두 번 호출하면 서로 다른 배열 참조를 반환한다", () => {
      const task = new TaskCore("태스크");
      const e1 = task.events;
      const e2 = task.events;
      expect(e1).not.toBe(e2);
    });

    it("changeState 이후 원본의 events는 변경되지 않는다", () => {
      const task = new TaskCore("태스크");
      task.changeState(Bullet.ONGOING);
      expect(task.events).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  describe("toJSON / from", () => {
    it("toJSON이 올바른 DTO 구조를 반환한다", () => {
      const task = new TaskCore("직렬화 태스크", {
        id: "dto-id",
        note: "노트",
        type: "someday",
        createdAt: "2024-01-10",
      });
      const dto = task.toJSON();
      expect(dto.id).toBe("dto-id");
      expect(dto.title).toBe("직렬화 태스크");
      expect(dto.note).toBe("노트");
      expect(dto.type).toBe("someday");
      expect(dto.createdAt).toBe("2024-01-10");
      expect(dto.completedAt).toBeUndefined();
      expect(dto.events).toHaveLength(1);
    });

    it("DONE 상태 태스크의 toJSON에 completedAt이 포함된다", () => {
      const task = new TaskCore("태스크").changeState(Bullet.DONE, "2024-01-20");
      const dto = task.toJSON();
      expect(dto.completedAt).toBe("2024-01-20");
    });

    it("TaskCore.from(dto)로 역직렬화할 수 있다", () => {
      const dto: TaskRecordDTO = {
        id: "from-id",
        title: "역직렬화 태스크",
        note: "노트",
        type: "task",
        createdAt: "2024-01-10",
        completedAt: undefined,
        events: [{ date: "2024-01-10", state: Bullet.TODO }],
      };
      const task = TaskCore.from(dto);
      expect(task.id).toBe("from-id");
      expect(task.title).toBe("역직렬화 태스크");
      expect(task.note).toBe("노트");
      expect(task.type).toBe("task");
      expect(task.createdAt).toBe("2024-01-10");
      expect(task.state).toBe(Bullet.TODO);
    });

    it("toJSON → from 라운드트립 후 동등성이 유지된다", () => {
      const original = new TaskCore("라운드트립 태스크", {
        id: "rt-id",
        note: "노트",
        type: "someday",
        createdAt: "2024-01-05",
      });
      const changed = original.changeState(Bullet.ONGOING, "2024-01-06");
      const dto = changed.toJSON();
      const restored = TaskCore.from(dto);

      expect(restored.id).toBe(changed.id);
      expect(restored.title).toBe(changed.title);
      expect(restored.note).toBe(changed.note);
      expect(restored.type).toBe(changed.type);
      expect(restored.createdAt).toBe(changed.createdAt);
      expect(restored.state).toBe(changed.state);
      expect(restored.events).toEqual(changed.events);
    });

    it("completedAt이 있는 태스크의 라운드트립이 올바르게 동작한다", () => {
      const task = new TaskCore("완료 태스크").changeState(Bullet.DONE, "2024-01-18");
      const dto = task.toJSON();
      const restored = TaskCore.from(dto);
      expect(restored.completedAt).toBe("2024-01-18");
      expect(restored.state).toBe(Bullet.DONE);
      expect(restored.isClosed).toBe(true);
    });

    it("from으로 복원한 인스턴스의 events는 DTO와 독립적이다", () => {
      const dto: TaskRecordDTO = {
        id: "ind-id",
        title: "독립성 태스크",
        type: "task",
        createdAt: "2024-01-10",
        events: [{ date: "2024-01-10", state: Bullet.TODO }],
      };
      const task = TaskCore.from(dto);
      dto.events.push({ date: "2099-01-01", state: Bullet.DONE });
      expect(task.events).toHaveLength(1);
    });
  });
});
