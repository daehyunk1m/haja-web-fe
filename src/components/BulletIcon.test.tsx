import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import BulletIcon from "./BulletIcon";
import { usePopupStore } from "@/shared/popupStores";
import { useBulletStore } from "@/shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import { Bullet } from "@/shared/types/taskType";

const LONG_PRESS_MS = 500;

let toggleDone: ReturnType<typeof vi.fn>;
let changeBulletState: ReturnType<typeof vi.fn>;

// jsdom에는 PointerEvent가 없으므로 동일 타입명의 MouseEvent로 대체 디스패치한다.
function press(el: Element) {
  fireEvent(el, new MouseEvent("pointerdown", { bubbles: true }));
}
function release(el: Element) {
  fireEvent(el, new MouseEvent("pointerup", { bubbles: true }));
}

beforeEach(() => {
  vi.useFakeTimers();
  toggleDone = vi.fn();
  changeBulletState = vi.fn();
  useBulletStore.setState({ toggleDone, changeBulletState });
  usePopupStore.setState({ isModalOpen: false, targetId: "", position: { x: 0, y: 0 } });
  vi.spyOn(useDateStore.getState(), "toBulletString").mockReturnValue("2026-06-14");
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("BulletIcon 롱프레스", () => {
  it("손을 떼지 않아도 지정 시간이 지나면 팝업이 열린다", () => {
    render(<BulletIcon id='t1' bulletState={Bullet.TODO} />);
    const button = screen.getByRole("button");

    press(button);
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });

    expect(usePopupStore.getState().isModalOpen).toBe(true);
  });

  it("지정 시간 전에 떼면 짧은 클릭으로 처리된다 (toggleDone)", () => {
    render(<BulletIcon id='t1' bulletState={Bullet.TODO} />);
    const button = screen.getByRole("button");

    press(button);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    release(button);

    expect(toggleDone).toHaveBeenCalledWith("t1", "2026-06-14");
    expect(usePopupStore.getState().isModalOpen).toBe(false);
  });

  it("롱프레스로 팝업이 열린 뒤 손을 떼도 클릭 동작이 일어나지 않는다", () => {
    render(<BulletIcon id='t1' bulletState={Bullet.TODO} />);
    const button = screen.getByRole("button");

    press(button);
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });
    release(button);

    expect(toggleDone).not.toHaveBeenCalled();
    expect(changeBulletState).not.toHaveBeenCalled();
    // 롱프레스로 연 팝업이 닫히지 않고 유지된다
    expect(usePopupStore.getState().isModalOpen).toBe(true);
  });
});
