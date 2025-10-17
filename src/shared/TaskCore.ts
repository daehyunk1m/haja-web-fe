import { Bullet, TaskEvent } from "./types/taskType";
import { recordDate } from "../utils/dateUtils";

export class TaskCore {
  // <-- property -->
  /** 고유 Id값  */
  readonly id: string;
  private _title: string;
  private _note?: string;
  /** 태스크 타입 */
  private _type: "task" | "someday";
  /** 생성 시점  */
  readonly createdAt: string;
  private _completedAt?: string;
  private _events: TaskEvent[];

  constructor(
    title: string,
    option?: {
      id?: string;
      note?: string;
      type?: "task" | "someday";
      createdAt?: string;
      completedAt?: string;
    }
  ) {
    this.id = option?.id ?? crypto.randomUUID();
    this._title = title;
    this._note = option?.note;
    this._type = option?.type ?? "task"; // toggleDone 할 때 기본값으로 설정되는 오류 수정해야함.
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
  /** 태스크 타입 */
  get type() {
    return this._type;
  }
  set type(type: "task" | "someday") {
    this._type = type;
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
    if (this.state === state) {
      return this;
    }

    const clone = this.with({});

    clone._completedAt = state === Bullet.DONE || state === Bullet.CANCEL ? date : undefined;
    clone._events.push({ date, state });

    return clone;
  }

  /** 새 인스턴스 반환 메서드 */
  with(update: Partial<Pick<TaskCore, "title" | "note">>) {
    const clone = new TaskCore(update.title ?? this._title, {
      id: this.id,
      type: this.type,
      note: update.note ?? this._note,
      createdAt: this.createdAt,
      completedAt: this._completedAt,
    });
    clone._events = [...this._events];

    return clone;
  }

  /** 연기 대상인지 판별 */
  shouldCarryForward(referenceDate: string) {
    return !this.isClosed && TaskCore.compareDate(this.createdAt, referenceDate) < 0;
  }

  // <-- 직렬화 | 역직렬화 -->
  toJSON(): TaskRecordDTO {
    return {
      id: this.id,
      type: this._type,
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
      type: dto.type,
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

/** 데이터 레코드(DTO) */
export interface TaskRecordDTO {
  id: string;
  type: "task" | "someday";
  title: string;
  note?: string;
  createdAt: string;
  completedAt?: string;
  events: TaskEvent[];
}
