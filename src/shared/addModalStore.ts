import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState = {
  isAddModalOpen: false,
};

export const useAddModalStore = create(
  devtools(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => {
          // actions
          const toggleAddModal = () => {
            set((state) => {
              console.log("toggle add modal", state.isAddModalOpen);
              return { isAddModalOpen: !state.isAddModalOpen };
            });
          };
          const closeModal = () => set(() => ({ isAddModalOpen: false }));
          return {
            actions: { toggleAddModal, closeModal },
          };
        })
      )
    )
  )
);
