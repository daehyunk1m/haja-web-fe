/**
 * @see - https://teamsparta.notion.site/API-24e2dc3ef51481aeb722dc3f18c6cddc
 */

import { TaskCore } from "@/shared/TaskCore";
import { Bullet } from "@/shared/types/taskType";
import { recordDate } from "@/utils/dateUtils";
import { assert, beforeEach, describe, expect, it, test, vi } from "vitest";

// 테스트할 함수를 받고 테스트를 수행하는 단위 (@it)
test("root 4는 2이다.", () => {
  expect(Math.sqrt(4)).toBe(2);
});

// 특정 테스트가 실행되는것을 스킵할 수 있음.
it.skip("테스트 스킵", () => {
  assert(false);
});

// 특정 테스트만 실행할 수 있음 일시적으로 필요할 때 종종 사용
// it.only("테스트 오직 이것만 실행", () => {
//   assert(true);
// });

const isDev = import.meta.env.DEV;
// 특정 환경에서만 테스트
it.runIf(isDev)("개발 환경 시 테스트", () => {
  assert(true);
});

describe("병렬로 테스트", () => {
  it("serial test", async () => {
    console.log("serial test");
  });

  it.concurrent("concurrent test 1", async () => {
    console.log("concurrent test 1");
  });
  it.concurrent("concurrent test 2", async () => {
    console.log("concurrent test 2");
  });
});

it.concurrent("테스트 병렬로 실행", () => {
  assert(true);
});

// HAJA 테스트 만들어보기
// Given, When, Then @see - https://brunch.co.kr/@springboot/292
// recordDate

describe("TaskCore", () => {
  // beforeEach(() => {
  //   vi.clearAllMocks();
  // });

  describe("생성자 및 초기화", () => {
    it("기본 생성자로 TaskCore 인스턴스를 생성한다", () => {
      // Given
      const title = "테스트 태스크";

      // When
      const task = new TaskCore(title);

      // Then
      expect(task.title).toBe(title);
      expect(task.type).toBe("task");
      expect(task.note).toBeUndefined();
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBe(recordDate()); // TLD; recordDate 리턴값이 어떤 형식인지 몰랐는데, 테스트 해보고 jsDoc에 추가
      expect(task.state).toBe(Bullet.TODO);
      expect(task.events).toHaveLength(1);
      expect(task.events[0]).toEqual({
        date: recordDate(),
        state: Bullet.TODO,
      });
    });

    it("모든 옵션을 포함하여 TaskCore 인스턴스를 생성한다", () => {
      // Given
      const options = {
        id: "test-id",
        note: "테스트 노트",
        type: "someday" as const,
        createdAt: recordDate(),
        completedAt: recordDate(),
      };

      // When
      const task = new TaskCore("테스트 태스크", options);

      // Then
      expect(task.id).toBe("test-id");
      expect(task.note).toBe("테스트 노트");
      expect(task.type).toBe("someday");
      expect(task.createdAt).toBe(recordDate());
      expect(task.completedAt).toBe(recordDate());
    });
  });
});
