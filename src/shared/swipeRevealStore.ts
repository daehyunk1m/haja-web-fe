import { create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState = {
  // 삭제 영역이 열렸거나 스와이프 중인 태스크 id. 한 번에 하나만 활성이다.
  openId: null as string | null,
};

export const useSwipeRevealStore = create(
  devtools(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => {
          /** 지정 태스크를 활성(열림/스와이프 중)으로 표시한다. null이면 모두 닫힘. */
          const setOpenId = (id: string | null) => {
            set((state) => {
              state.openId = id;
            });
          };

          return {
            actions: { setOpenId },
          };
        })
      )
    )
  )
);
