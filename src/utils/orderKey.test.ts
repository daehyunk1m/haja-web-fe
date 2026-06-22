import { describe, it, expect } from "vitest";
import { buildOrderKey } from "./orderKey";

describe("buildOrderKey", () => {
  it('task 타입의 orderKey를 생성한다: "YYYY-MM-DD|task"', () => {
    expect(buildOrderKey("2024-01-15", "task")).toBe("2024-01-15|task");
  });

  it('someday 타입의 orderKey를 생성한다: "YYYY-MM-DD|someday"', () => {
    expect(buildOrderKey("2024-01-15", "someday")).toBe("2024-01-15|someday");
  });
});
