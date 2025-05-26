import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BulletStore } from "./types/bulletStore";
import { TaskCore, TaskRecordDTO } from "./TaskCore";
import { Bullet } from "./types/taskType";

/** 로컬 저장 키 */
const LS_KEY = "localBullets";

export const useBulletStore = create<BulletStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set) => {
          // 내부 헬퍼
          // const saveToBackend = async (task: TaskCore) => {
          //   task.toJSON();
          // };

          return {
            // 상태
            tasks: new Map<string, TaskCore>(),
            // 액션
            addBullet: (title, note) => {
              const task = new TaskCore(title, { note });
              set((state) => void state.tasks.set(task.id, task));
              // saveToBackend
            },
            changeBulletState: (id, next) => {
              set((state) => {
                const task = state.tasks.get(id);
                if (!task) return;

                state.tasks.set(id, task.changeState(next));
              });
              // saveToBackend
            },
            editBullet: (id, payload) => {
              set((state) => {
                const task = state.tasks.get(id);
                if (!task) return;

                state.tasks.set(id, task.with(payload));
              });
              // saveToBackend
            },
            deleteBullet: (id) => {
              set((state) => void state.tasks.delete(id));
              // setToBackend
              // const { session } = useAuthStore.getState();
              // if (session) supabase.from("tasks").delete().eq("id", id);
            },
            toggleDone: (id: string) => {
              set((state) => {
                const task = state.tasks.get(id);
                if (!task) return;

                const lastState =
                  task.state === Bullet.TODO ? Bullet.DONE : task.events.at(-2)!.state;
                const lastDate = task.events.at(-1)!.date;

                state.tasks.set(id, task.changeState(lastState, lastDate));
              });
            },
            /** 날짜별 필터 */
            // bulletFor: (date) => Array.from(get().tasks.values()).filter((task) => task.createdAt === date || task.shouldCarryForward(date)),
            /** 자정 이후 연기 */
            postpone: (today) => {
              set((state) =>
                state.tasks.forEach((task) => {
                  if (task.shouldCarryForward(today)) task.changeState(task.state, today);
                })
              );
              // 연기 후 backend 반영
              // if (session) {
              //   const records = Array.from(get().tasks.values()).map((t) => t.toJSON());
              //   supabase.from("tasks").upsert(records, { onConflict: "id" });
              // }
            },
          };
        }),
        {
          name: LS_KEY,
          partialize: (state) => ({
            tasks: Array.from(state.tasks.values()).map((task) => task.toJSON()),
          }),
          merge: (persisted, current) => {
            const dtoArr = (persisted as { tasks?: TaskRecordDTO[] })?.tasks ?? [];
            return {
              ...current,
              tasks: new Map(dtoArr.map((dto) => [dto.id, TaskCore.from(dto)])),
            };
          },
        }
      )
    )
  )
);
