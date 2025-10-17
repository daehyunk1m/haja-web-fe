import { Calendar } from "./ui/calendar";
import { ko } from "react-day-picker/locale";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Ico from "./Ico";

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  value?: Date;
  onSelect?: (date: Date | undefined) => void;
}

// 모달 스타일 변형 정의
const modalVariants = cva(
  // 기본 스타일
  "fixed inset-0 z-50 w-full flex items-end justify-center",
  {
    variants: {
      variant: {
        default: "bg-black/40",
        overlay: "bg-black/60",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// 모달 컨텐츠 스타일 변형
const modalContentVariants = cva(
  // 기본 스타일
  "relative w-full flex justify-center bg-black animate-slide-up",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        full: "w-full",
      },
    },
    defaultVariants: {
      size: "full",
    },
  }
);

// 캘린더 스타일 변형
const calendarVariants = cva(
  // 기본 스타일
  "p-0 w-full",
  {
    variants: {
      theme: {
        light: "bg-white",
        dark: "bg-gray-900",
      },
    },
    defaultVariants: {
      theme: "light",
    },
  }
);

// 캡션 스타일 변형
const captionVariants = cva(
  // 기본 스타일
  // "w-full flex justify-center items-center h-10 relative",
  "h-10 relative",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// 캡션 라벨 스타일 변형
const captionLabelVariants = cva(
  // 기본 스타일
  "font-pretendard tracking-tight select-none text-white",
  {
    variants: {
      size: {
        sm: "text-lg",
        md: "text-[21px]",
        lg: "text-2xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        bold: "font-bold",
        black: "font-black",
      },
    },
    defaultVariants: {
      size: "md",
      weight: "black",
    },
  }
);

// 네비게이션 버튼 스타일 변형
const navButtonVariants = cva(
  // 기본 스타일
  "absolute p-0 top-0 size-10 select-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-white bg-black",
      },
      orientation: {
        left: "left-0",
        right: "right-0",
        default: "left-0 right-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// 날짜 버튼 스타일 변형
const dayButtonVariants = cva(
  // 기본 스타일
  `flex items-center justify-center w-full h-full
  font-pretendard font-bold text-[19px] text-center
  transition-colors relative  aspect-square select-none`,
  {
    variants: {
      state: {
        default: "rounded-full hover:bg-black/70 hover:text-white",
        selected:
          "rounded-full bg-black text-white font-bold hover:bg-black hover:text-white focus:bg-black focus:text-white",
        today: "rounded-full border border-black bg-accent text-accent-foreground",
        outside: "text-black/45 font-medium aria-selected:text-muted-foreground",
        disabled: "text-black/45 font-medium opacity-50",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

// 화살표 아이콘 스타일 변형
const chevronVariants = cva(
  // 기본 스타일
  "font-pretendard font-black text-white",
  {
    variants: {
      orientation: {
        left: "text-white text-[21px]",
        right: "text-white text-[21px]",
        up: "text-white text-xl",
        down: "text-white text-xl",
        default: "text-white text-xl",
      },
    },
    defaultVariants: {
      orientation: "default",
    },
  }
);

// 스타일 객체 생성 함수
const createCalendarStyles = () => ({
  modalOverlay: modalVariants(),
  modalContent: modalContentVariants(),
  calendar: calendarVariants(),

  classNames: {
    root: "w-fit",
    months: "flex flex-col gap-0 ",
    // month: "flex flex-col gap-0",
    month: "relative",
    month_caption: "h-10 mx-[40px] flex justify-center items-center bg-black",
    month_grid: "m-auto bg-white",
    caption: captionVariants(),
    caption_label: captionLabelVariants(),
    // nav: cn("absolute left-0 right-0 flex justify-between items-center px-4 h-10 bg-black/10"),
    button_previous: navButtonVariants({ orientation: "left" }),
    button_next: navButtonVariants({ orientation: "right" }),
    table: "w-full border-collapse",
    weekdays: "flex gap-0.5 px-4 pt-3.5",
    weekday: cn(
      "w-10 h-[34px] mb-1.5 flex justify-center items-end font-pretendard font-light text-[14px] text-black/70 text-center select-none"
    ),
    weeks: "flex flex-col px-4 pb-3",
    week: "flex justify-center gap-0.5",
    day: dayButtonVariants(),
    today: dayButtonVariants({ state: "today" }),
    selected: dayButtonVariants({ state: "selected" }),
    outside: dayButtonVariants({ state: "outside" }),
    disabled: dayButtonVariants({ state: "disabled" }),
    hidden: "invisible",
    range_start: cn("bg-black text-white rounded-l-md"),
    range_middle: cn("bg-accent text-accent-foreground rounded-none"),
    range_end: cn("bg-black text-white rounded-r-md"),
  },
});

export function CalendarModal({ open = true, onClose, value, onSelect }: CalendarModalProps) {
  if (!open) return null;

  // 현재 코드에서는 스타일이 정적이므로 상수 객체로 변경하는 것이 가장 효율적입니다:
  const styles = createCalendarStyles();

  return (
    <Calendar
      mode='single'
      locale={ko}
      selected={value}
      onSelect={onSelect}
      className={styles.calendar}
      classNames={styles.classNames}
      formatters={{
        formatCaption: (month, _, dateLib) => dateLib?.format(month, "yyyy. MM") || "",
      }}
      components={{
        Chevron: ({ orientation }) => (
          <span className={chevronVariants({ orientation: orientation || "left" })}>
            <Ico.Arrow direction={orientation || "left"} />
          </span>
        ),
      }}
    />
  );
}
