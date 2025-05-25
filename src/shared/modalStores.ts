import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState = {
  isModalOpen: false,
};

export const useModalStore = create(
  devtools(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => {
          // actions
          const toggleModal = () => {
            set((state) => {
              console.log("toggle modal");
              return { isModalOpen: !state.isModalOpen };
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
