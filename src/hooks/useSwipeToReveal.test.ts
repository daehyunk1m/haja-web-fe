import { describe, it, expect } from "vitest";
import { renderHook, act, fireEvent } from "@testing-library/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useSwipeToReveal } from "./useSwipeToReveal";

type HookResult = ReturnType<typeof renderHook<ReturnType<typeof useSwipeToReveal>, unknown>>["result"];

// jsdom에는 PointerEvent 생성자가 없으므로 동일 인터페이스(clientX/clientY)를 가진
// MouseEvent를 같은 타입명(pointermove/pointerup)으로 디스패치한다.
function pointerDown(result: HookResult, clientX: number, clientY: number) {
  act(() => {
    result.current.onPointerDown({ clientX, clientY } as unknown as ReactPointerEvent);
  });
}
function windowPointerMove(clientX: number, clientY: number) {
  fireEvent(window, new MouseEvent("pointermove", { clientX, clientY }));
}
function windowPointerUp() {
  fireEvent(window, new MouseEvent("pointerup", {}));
}

describe("useSwipeToReveal", () => {
  it("초기 상태는 offset 0, 닫힘", () => {
    const { result } = renderHook(() => useSwipeToReveal());
    expect(result.current.offset).toBe(0);
    expect(result.current.isOpen).toBe(false);
  });

  it("임계값을 넘는 왼쪽 슬라이드 후 떼면 열린다", () => {
    const { result } = renderHook(() => useSwipeToReveal({ revealWidth: 64, threshold: 32 }));
    pointerDown(result, 200, 100);
    windowPointerMove(120, 100); // dx -80 → revealWidth로 클램프
    expect(result.current.offset).toBe(-64);
    windowPointerUp();
    expect(result.current.isOpen).toBe(true);
    expect(result.current.offset).toBe(-64);
  });

  it("임계값 미만 슬라이드는 다시 닫힌다", () => {
    const { result } = renderHook(() => useSwipeToReveal({ revealWidth: 64, threshold: 32 }));
    pointerDown(result, 200, 100);
    windowPointerMove(180, 100); // dx -20 (< 32)
    expect(result.current.offset).toBe(-20);
    windowPointerUp();
    expect(result.current.isOpen).toBe(false);
    expect(result.current.offset).toBe(0);
  });

  it("세로로 움직이면 무시한다 (스크롤·순서변경에 양보)", () => {
    const { result } = renderHook(() => useSwipeToReveal());
    pointerDown(result, 200, 100);
    windowPointerMove(205, 170); // dy 70 우세 → 세로 축
    expect(result.current.offset).toBe(0);
    windowPointerUp();
    expect(result.current.isOpen).toBe(false);
  });

  it("오른쪽으로는 열리지 않는다 (0에서 클램프)", () => {
    const { result } = renderHook(() => useSwipeToReveal({ revealWidth: 64 }));
    pointerDown(result, 100, 100);
    windowPointerMove(220, 100); // dx +120
    expect(result.current.offset).toBe(0);
    windowPointerUp();
    expect(result.current.isOpen).toBe(false);
  });

  it("close()로 열린 상태를 닫는다", () => {
    const { result } = renderHook(() => useSwipeToReveal({ revealWidth: 64, threshold: 32 }));
    pointerDown(result, 200, 100);
    windowPointerMove(120, 100);
    windowPointerUp();
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.offset).toBe(0);
  });

  it("열린 상태에서 오른쪽으로 밀면 닫힌다", () => {
    const { result } = renderHook(() => useSwipeToReveal({ revealWidth: 64, threshold: 32 }));
    pointerDown(result, 200, 100);
    windowPointerMove(120, 100);
    windowPointerUp();
    expect(result.current.isOpen).toBe(true);

    // rest -64 에서 오른쪽 +60 → -4 (임계값 미달) → 닫힘
    pointerDown(result, 200, 100);
    windowPointerMove(260, 100);
    expect(result.current.offset).toBe(-4);
    windowPointerUp();
    expect(result.current.isOpen).toBe(false);
    expect(result.current.offset).toBe(0);
  });
});
