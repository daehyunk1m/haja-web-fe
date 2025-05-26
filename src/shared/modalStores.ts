import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState = {
  isModalOpen: false,
  targetId: "",
};

export const useModalStore = create(
  devtools(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => {
          // actions
          const toggleModal = (id: string) => {
            set((state) => {
              return { isModalOpen: !state.isModalOpen, targetId: id };
              // state.isModalOpen = !state.isModalOpen;
              // state.targetId = id;
            });
          };
          return {
            actions: { toggleModal },
          };
        })
      )
    )
  )
);
