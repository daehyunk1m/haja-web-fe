// 할 일은 할 것 과 한 것이 중요!
export enum Bullet {
  /** `할 일` - 생성 직후 */
  TODO = "todo",
  /** `할 일` - 시작 */
  START = "start",
  /** `할 일` - 진행 중 */
  ONGOING = "ongoing",
  /** `할 일` - 연기 */
  DELAY = "delay",
  /** `한 일` - 취소 */
  CANCEL = "cancel",
  /** `한 일` - 완료 */
  DONE = "done",
}

export interface TaskEvent {
  /** ISO 8601 - `YYYY-MM-DD` */
  date: string;
  state: Bullet;
}

export type TaskRecord = {
  /**
   * 고유 Id값
   */
  id: string;
  /**
   * 태스크의  내용
   */
  task: string;
  /**
   * 불렛 아이콘
   */
  icon: string;
  /**
   * 태스크 이벤트
   * date 순으로 정렬해둬야함.
   */
  event: TaskEvent[];
};

// export type Bullet = Record<BulletState, BulletTask>;
