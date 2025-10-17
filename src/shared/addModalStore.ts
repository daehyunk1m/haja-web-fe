import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type AddModalState = {
  isAddModalOpen: boolean;
  type: "task" | "someday";
};

const initialState: AddModalState = {
  isAddModalOpen: false,
  type: "task",
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
          const setType = (type: "task" | "someday") => set(() => ({ type }));
          return {
            actions: { toggleAddModal, closeModal, setType },
          };
        })
      )
    )
  )
);
