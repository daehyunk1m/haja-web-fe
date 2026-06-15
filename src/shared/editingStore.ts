import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState = {
  // 타이틀 편집 중인 태스크 id. 한 번에 하나만 편집된다.
  editingId: null as string | null,
};

export const useEditingStore = create(
  devtools(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => {
          /** 지정 태스크를 편집 중으로 표시한다. null이면 편집 없음. */
          const setEditingId = (id: string | null) => {
            set((state) => {
              state.editingId = id;
            });
          };

          return {
            actions: { setEditingId },
          };
        })
      )
    )
  )
);
