import { useBulletStore } from "@/shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import { useProgressStore } from "@/shared/progressStore";
import { useEffect, useMemo } from "react";
import TodoContainer from "../TodoContainer";
import TaskItem from "../TaskItem";
import AddBulletBtn from "./AddBulletBtn";
import PopupContainer from "../PopupContainer";
import { usePopupStore } from "@/shared/popupStores";
import { TaskCore } from "@/shared/TaskCore";

const SectionList = ({ type }: { type: "task" | "someday" }) => {
  const isPopupOpen = usePopupStore((state) => state.isModalOpen);
  const dateString = useDateStore((state) => state.toBulletString());

  const postpone = useBulletStore((state) => state.postpone);

  useEffect(() => {
    postpone(dateString);
  }, [dateString, postpone]);

  const tasksMap = useBulletStore((state) => state.tasks);
  // 날짜별 필터 위치 확인해봐야함.
  /** 날짜별 필터 */
  const tasks = useMemo(() => {
    return [...tasksMap.values()].filter(
      (task) =>
        (!task.completedAt ? task.createdAt === dateString : task.completedAt === dateString) ||
        task.shouldCarryForward(dateString)
    );
  }, [dateString, tasksMap]);

  const visibleTasks = useMemo(() => {
    return tasks.filter(filters[type]);
  }, [tasks, type]);

  const { setSelectedTasks } = useProgressStore(({ actions }) => actions);

  useEffect(() => {
    setSelectedTasks(tasks);
  }, [setSelectedTasks, tasks]);

  return (
    <>
      <TodoContainer>
        {visibleTasks.map((bulletTask) => (
          <TaskItem key={bulletTask.id} bulletTask={bulletTask} />
        ))}
      </TodoContainer>
      <AddBulletBtn type={type} />
      {isPopupOpen && <PopupContainer />}
    </>
  );
};

export default SectionList;

// util
const filters: Record<TaskCore["type"], (t: TaskCore) => boolean> = {
  task: (t) => t.type === "task" || (t.type === "someday" && Boolean(t.completedAt)),
  someday: (t) => t.type === "someday" && Boolean(!t.completedAt),
} as const satisfies Record<TaskCore["type"], (t: TaskCore) => boolean>;

// const assertNever = (x: never): never => {
//   throw new Error(`Unhandled view type: ${x}`);
// };
