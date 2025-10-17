import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Position {
  x: number;
  y: number;
}

const initialState = {
  isModalOpen: false,
  targetId: "",
  position: { x: 0, y: 0 } as Position,
};

export const usePopupStore = create(
  devtools(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => {
          // actions
          const togglePopup = (id: string, position?: Position) => {
            set((state) => {
              return {
                isModalOpen: !state.isModalOpen,
                targetId: id,
                position: position || { x: 0, y: 0 },
              };
            });
          };

          const setPosition = (position: Position) => {
            set(() => {
              return { isModalOpen: true, targetId: "", position };
            });
          };

          const closePopup = () => {
            set(() => {
              return { isModalOpen: false, targetId: "", position: { x: 0, y: 0 } };
            });
          };

          return {
            actions: { togglePopup, setPosition, closePopup },
          };
        })
      )
    )
  )
);
