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
            taskOrder: {} as Record<string, string[]>,
            // 액션
            addBullet: (title, option) => {
              const task = new TaskCore(title, option);
              set((state) => void state.tasks.set(task.id, task));
              // saveToBackend
            },
            changeBulletState: (id, next, date, force) => {
              set((state) => {
                const task = state.tasks.get(id);
                if (!task) return;
                state.tasks.set(id, task.changeState(next, date, force));
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
              set((state) => {
                state.tasks.delete(id);
                for (const key in state.taskOrder) {
                  const arr = state.taskOrder[key];
                  const idx = arr.indexOf(id);
                  if (idx !== -1) arr.splice(idx, 1);
                }
              });
              // setToBackend
              // const { session } = useAuthStore.getState();
              // if (session) supabase.from("tasks").delete().eq("id", id);
            },
            toggleDone: (id, date) => {
              set((state) => {
                const task = state.tasks.get(id);
                if (!task) return;

                const lastState =
                  task.state === Bullet.TODO
                    ? Bullet.DONE
                    : task.isClosed
                      ? Bullet.TODO
                      : (task.events.at(-2) ?? task.events[0]).state;

                state.tasks.set(id, task.changeState(lastState, date));
              });
            },
            /** 날짜별 필터 */
            // bulletFor: (date) => Array.from(get().tasks.values()).filter((task) => task.createdAt === date || task.shouldCarryForward(date)),
            // 연기할 때 로직 다시 체크해야할 듯
            reorderTasks: (orderKey, orderedIds) => {
              set((state) => {
                state.taskOrder[orderKey] = orderedIds;
              });
            },
            /** 자정 이후 연기 */
            postpone: (today) => {
              set((state) => {
                state.tasks.forEach((task, id) => {
                  if (task.shouldCarryForward(today)) {
                    state.tasks.set(id, task.carryForward(today));
                  }
                });
              });
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
            taskOrder: state.taskOrder,
          }),
          merge: (persisted, current) => {
            const raw = persisted as { tasks?: TaskRecordDTO[]; taskOrder?: Record<string, string[]> };
            const dtoArr = raw?.tasks ?? [];
            return {
              ...current,
              tasks: new Map(dtoArr.map((dto) => [dto.id, TaskCore.from(dto)])),
              taskOrder: raw?.taskOrder ?? {},
            };
          },
        }
      )
    )
  )
);
