import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BulletStore } from "./types/bulletStore";
import { TaskCore, TaskRecordDTO } from "./TaskCore";

/** 로컬 저장 키 */
const LS_KEY = "localBullets";

export const useBulletStore = create<BulletStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => {
          // 내부 헬퍼
          // const saveToBackend = async (task: TaskCore) => {
          //   task.toJSON();
          // };

          return {
            // 상태
            tasks: new Map<string, TaskCore>(),
            // 액션
            // createNewBullet: (task: string) => {
            //   set((state) => {
            //     state.tasks.push({
            //       id: crypto.randomUUID(),
            //       task,
            //       icon: "Start",
            //       event: [{ date: recordDate(), state: Bullet.START }],
            //     });
            //   });
            // },
            // updateBullet: (id, update) => {
            //   set((state) => {
            //     const target = state.tasks.find((task) => task.id === id);
            //     if (!target) return;

            //     const filteredUpdate = Object.fromEntries(Object.entries(update).filter(([, v]) => v !== undefined));

            //     Object.assign(target, filteredUpdate);
            //   });
            // },
            // deleteBullet: (id: string) => {
            //   set((state) => ({
            //     tasks: state.tasks.filter((task) => task.id !== id),
            //   }));
            // },
            getTaskByDate: () => {},
          };
        }),
        {
          name: LS_KEY,
          partialize: (state) => ({ tasks: Array.from(state.tasks.values()).map((task) => task.toJSON()) }),
          merge: (persisted, current) => {
            // if (!persisted[0] instanceof TaskCore) throw new Error("invalidated Task Data");
            return { ...current, tasks: new Map((persisted as TaskRecordDTO[]).map((dto) => [dto.id, TaskCore.from(dto)])) };
          },
        }
      )
    )
  )
);
