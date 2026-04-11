import { TaskCore } from "../TaskCore";
import { Bullet } from "./taskType";

export interface BulletStore {
  /** `id` -> `TaskCore` 매핑 */
  tasks: Map<string, TaskCore>;
  /** 날짜+타입별 태스크 순서 (키: "YYYY-MM-DD|task") */
  taskOrder: Record<string, string[]>;

  // CRUD
  addBullet: (
    title: string,
    payload: Partial<Pick<TaskCore, "createdAt" | "note" | "type">>
  ) => void;
  changeBulletState: (id: string, next: Bullet, date?: string, force?: boolean) => void;
  editBullet: (id: string, payload: Partial<Pick<TaskCore, "title" | "note" | "type">>) => void;
  deleteBullet: (id: string) => void;
  toggleDone: (id: string, date?: string) => void;
  /** 태스크 순서 변경 */
  reorderTasks: (orderKey: string, orderedIds: string[]) => void;

  // 날짜별 조회 & 이월
  // bulletFor: (date: string) => TaskCore[];
  postpone: (today: string) => void;
}
