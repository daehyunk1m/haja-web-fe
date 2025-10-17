import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { recordDate } from "@/utils/dateUtils";

const initialState = {
  date: new Date(),
  isCalendarOpen: false,
};

export const useDateStore = create(
  devtools(
    subscribeWithSelector(
      immer(
        combine(initialState, (set, get) => {
          // helper
          const toBulletString = () => recordDate(get().date);

          // actions
          const setDate = (newDate?: Date) => {
            set((state) => {
              // return { date: newDate, dateToString: recordDate(newDate) };
              state.date = newDate ?? new Date();
            });
          };

          const toggleCalendar = (isOpen?: boolean) => {
            if (isOpen === undefined) {
              set((state) => {
                state.isCalendarOpen = !state.isCalendarOpen;
              });
            } else {
              set((state) => {
                state.isCalendarOpen = isOpen;
              });
            }
          };

          return {
            toBulletString,
            actions: { setDate, toggleCalendar },
          };
        })
      )
    )
  )
);
