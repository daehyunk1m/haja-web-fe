import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSyncExpandWithDate } from "./useSyncExpandWithDate";
import { useDateStore } from "@/shared/dateStore";
import { useSectionExpandStore } from "@/shared/sectionExpandStore";

// 선택 날짜(일 단위)가 바뀌면 섹션 확장 자동판단을 다시 수행해야 한다.
describe("useSyncExpandWithDate", () => {
  beforeEach(() => {
    useSectionExpandStore.getState().actions.reset();
    useDateStore.getState().actions.setDate(new Date()); // 오늘로 리셋
  });

  it("날짜(일)가 바뀌면 확장 확정을 해제해 재판단하게 한다", () => {
    const { reportCount } = useSectionExpandStore.getState().actions;
    const { unmount } = renderHook(() => useSyncExpandWithDate());

    act(() => {
      reportCount("task", 5);
      reportCount("someday", 3); // → task 확정
    });
    expect(useSectionExpandStore.getState().initialized).toBe(true);

    act(() => {
      useDateStore.getState().actions.setDate(new Date("2020-01-01"));
    });
    expect(useSectionExpandStore.getState().initialized).toBe(false);
    unmount();
  });

  it("같은 날(일)이면 재판단하지 않는다", () => {
    const { reportCount } = useSectionExpandStore.getState().actions;
    const { unmount } = renderHook(() => useSyncExpandWithDate());

    act(() => {
      reportCount("task", 5);
      reportCount("someday", 3);
    });

    act(() => {
      const now = new Date();
      // 같은 날의 다른 시각 → 일 문자열 동일
      const sameDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
      useDateStore.getState().actions.setDate(sameDay);
    });
    expect(useSectionExpandStore.getState().initialized).toBe(true);
    unmount();
  });

  it("언마운트 후에는 날짜가 바뀌어도 재판단하지 않는다 (구독 해제)", () => {
    const { reportCount } = useSectionExpandStore.getState().actions;
    const { unmount } = renderHook(() => useSyncExpandWithDate());
    act(() => {
      reportCount("task", 5);
      reportCount("someday", 3);
    });
    unmount();

    act(() => {
      useDateStore.getState().actions.setDate(new Date("2019-05-05"));
    });
    expect(useSectionExpandStore.getState().initialized).toBe(true);
  });
});
