import React from "react";
import { Calendar } from "./ui/calendar";
import { useDateStore } from "@/shared/dateStore";

const CalendarContainer = ({
  setIsOpen,
}: {
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
}) => {
  const date = useDateStore((state) => state.date);
  const onSelect = useDateStore((state) => state.actions.setDate);

  return (
    <Calendar
      mode='single'
      selected={date}
      onSelect={onSelect}
      onDayClick={() => {
        setIsOpen((open) => !open);
      }}
    />
  );
};

export default CalendarContainer;
