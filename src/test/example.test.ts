import { describe, it, expect } from "vitest";

describe("예제 테스트 스위트", () => {
  it("두 숫자를 올바르게 더해야 합니다", () => {
    const sum = 2 + 3;
    expect(sum).toBe(5);
  });

  it("참인 값에 대해 true를 반환해야 합니다", () => {
    const value = true;
    expect(value).toBeTruthy();
  });

  it("배열에 특정 요소가 포함되어 있는지 확인해야 합니다", () => {
    const array = [1, 2, 3, 4, 5];
    expect(array).toContain(3);
  });

  it("문자열의 동등성을 확인해야 합니다", () => {
    const greeting = "안녕하세요, 세상!";
    expect(greeting).toBe("안녕하세요, 세상!");
  });

  it("객체 속성을 확인해야 합니다", () => {
    const user = { name: "앨리스", age: 25 };
    expect(user).toHaveProperty("name", "앨리스");
    expect(user).toHaveProperty("age", 25);
  });
});
