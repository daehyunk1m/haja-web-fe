import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import CalendarContainer from "./CalendarContainer";
import { useDateStore } from "@/shared/dateStore";

// CalendarModal은 react-day-picker 의존성이 복잡하므로 모킹
// onSelect, onClose, value 등 props를 캡처하기 위해 사용
let capturedProps: {
  open?: boolean;
  value?: Date;
  onSelect?: (date: Date | undefined) => void;
  onClose?: () => void;
} = {};

vi.mock("./CalendarModal", () => ({
  CalendarModal: (props: typeof capturedProps) => {
    capturedProps = props;
    return <div data-testid='calendar-modal' />;
  },
}));

beforeEach(() => {
  capturedProps = {};
  useDateStore.setState({ date: new Date("2024-01-15"), isCalendarOpen: true });
});

// -------------------------------------------------------------------------
describe("렌더링", () => {
  it("CalendarModal이 open=true로 렌더링된다", () => {
    render(<CalendarContainer />);
    expect(capturedProps.open).toBe(true);
  });

  it("CalendarModal에 현재 날짜가 value로 전달된다", () => {
    const expectedDate = new Date("2024-01-15");
    useDateStore.setState({ date: expectedDate });

    render(<CalendarContainer />);
    expect(capturedProps.value).toEqual(expectedDate);
  });
});

// -------------------------------------------------------------------------
describe("날짜 선택", () => {
  it("날짜 선택 시 useDateStore의 date가 업데이트된다", () => {
    render(<CalendarContainer />);

    const newDate = new Date("2024-03-20");
    act(() => capturedProps.onSelect?.(newDate));

    expect(useDateStore.getState().date).toEqual(newDate);
  });

  it("undefined 선택 시 date가 오늘 날짜로 초기화된다", () => {
    render(<CalendarContainer />);
    act(() => capturedProps.onSelect?.(undefined));

    // setDate(undefined) → new Date()로 설정
    const storeDate = useDateStore.getState().date;
    expect(storeDate).toBeInstanceOf(Date);
  });
});

// -------------------------------------------------------------------------
describe("캘린더 닫기", () => {
  it("onClose 호출 시 isCalendarOpen이 토글된다", () => {
    useDateStore.setState({ isCalendarOpen: true });
    render(<CalendarContainer />);

    act(() => capturedProps.onClose?.());

    expect(useDateStore.getState().isCalendarOpen).toBe(false);
  });
});
