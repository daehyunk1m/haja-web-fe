import { TaskCore } from "../TaskCore";
import { Bullet } from "./taskType";

export interface BulletStore {
  /** `id` -> `TaskCore` 매핑 */
  tasks: Map<string, TaskCore>;

  // CRUD
  addBullet: (title: string, payload: Partial<Pick<TaskCore, "createdAt" | "note">>) => void;
  changeBulletState: (id: string, next: Bullet, date?: string) => void;
  editBullet: (id: string, payload: Partial<Pick<TaskCore, "title" | "note">>) => void;
  deleteBullet: (id: string) => void;
  toggleDone: (id: string, date?: string) => void;

  // 날짜별 조회 & 이월
  // bulletFor: (date: string) => TaskCore[];
  postpone: (today: string) => void;
}
