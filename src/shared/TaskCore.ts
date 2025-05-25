import { Bullet, TaskEvent } from "./types/taskType";
import { recordDate } from "../utils/dateUtils";

/** 데이터 레코드(DTO) */
export interface TaskRecordDTO {
  id: string;
  title: string;
  note?: string;
  createdAt: string;
  completedAt?: string;
  events: TaskEvent[];
}

export class TaskCore {
  // <-- property -->
  /** 고유 Id값  */
  readonly id: string;
  private _title: string;
  private _note?: string;
  /** 생성 시점  */
  readonly createdAt: string;
  private _completedAt?: string;
  private _events: TaskEvent[];

  constructor(
    title: string,
    option?: {
      id?: string;
      note?: string;
      createdAt?: string;
      completedAt?: string;
    }
  ) {
    this.id = option?.id ?? crypto.randomUUID();
    this._title = title;
    this._note = option?.note;
    this.createdAt = option?.createdAt ?? TaskCore.today();
    this._completedAt = option?.completedAt;
    this._events = [{ date: this.createdAt, state: Bullet.TODO }];
  }

  // <-- 현재 상태 -->
  get state() {
    return this._events.at(-1)!.state;
  }
  get isClosed() {
    return [Bullet.DONE, Bullet.CANCEL].includes(this.state);
  }

  // <-- Getter | Setter -->

  /** 태스크 명 */
  get title() {
    return this._title;
  }
  set title(newTitle: string) {
    this._title = newTitle;
  }
  /** 태스크 상세 내용 */
  get note() {
    return this._note;
  }
  set note(desc: string | undefined) {
    this._note = desc;
  }
  /** DONE | CANCEL 시점 */
  get completedAt() {
    return this._completedAt;
  }
  /** 이벤트 스택 */
  get events() {
    return this._events;
  }

  // <-- method -->
  /** 불렛 상태 변경 */
  changeState(state: Bullet, date: string = TaskCore.today()) {
    if (this.isClosed) return;
    if (state === Bullet.DONE || state === Bullet.CANCEL) this._completedAt = date;

    this._events.push({ state, date });
  }
  /** 완료로 바로 설정 */
  done(date?: string) {
    this.changeState(Bullet.DONE, date);
  }
  /** 삭제로 바로 설정 */
  cancel(date?: string) {
    this.changeState(Bullet.CANCEL, date);
  }

  /** 연기 대상인지 판별 */
  shouldCarryForward(referenceDate: string) {
    return !this.isClosed && TaskCore.compareDate(this.createdAt, referenceDate) < 0;
  }

  // <-- 직렬화 | 역직렬화 -->
  toJSON(): TaskRecordDTO {
    return {
      id: this.id,
      title: this._title,
      note: this._note,
      createdAt: this.createdAt,
      completedAt: this._completedAt,
      events: this._events,
    };
  }

  static from(dto: TaskRecordDTO) {
    const task = new TaskCore(dto.title, {
      id: dto.id,
      note: dto.note,
      createdAt: dto.createdAt,
    });
    task._events = [...dto.events];
    task._completedAt = dto.completedAt;
    return task;
  }

  // <-- 헬퍼 -->
  static today() {
    return recordDate();
  }
  static compareDate(a: string, b: string) {
    return new Date(a).getTime() - new Date(b).getTime();
  }
}
