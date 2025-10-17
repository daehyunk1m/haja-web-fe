import { useDateStore } from "@/shared/dateStore";
import { CalendarModal } from "./CalendarModal";

const CalendarContainer = () => {
  const date = useDateStore((state) => state.date);
  const onSelect = useDateStore((state) => state.actions.setDate);
  const { toggleCalendar } = useDateStore((state) => state.actions);
  return (
    <CalendarModal open={true} onClose={() => toggleCalendar()} value={date} onSelect={onSelect} />
  );
};

export default CalendarContainer;
