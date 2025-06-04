import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { TaskCore } from "./TaskCore";

const initialState: { progressRange: number; selectedTasks: TaskCore[] } = {
  progressRange: 0,
  selectedTasks: [],
};

export const useProgressStore = create(
  devtools(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => {
          // actions
          const setSelectedTasks = (tasks: TaskCore[]) => {
            set((state) => {
              state.selectedTasks = tasks;
            });
          };
          return {
            actions: { setSelectedTasks },
          };
        })
      )
    )
  )
);

//subscribe
useProgressStore.subscribe(
  (state) => state.selectedTasks, // selector
  (tasks) => {
    useProgressStore.setState((state) => {
      const countDone = tasks.filter(({ isClosed }) => isClosed).length;
      state.progressRange = (countDone / tasks.length) * 100;
    });
  }
);
