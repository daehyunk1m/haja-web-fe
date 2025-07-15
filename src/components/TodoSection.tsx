import { useEffect, useMemo, useState } from "react";
import Tab from "./Tab";
import TodoContainer from "./TodoContainer";
import TaskItem from "./TaskItem";
import { AddTaskIcon } from "./AddTask";
import { useBulletStore } from "@/shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import CalendarContainer from "./CalendarContainer";
import { useProgressStore } from "@/shared/progressStore";

const TodoSection = ({
  isAddTaskIcon = false,
  tabPosition,
}: {
  isAddTaskIcon?: boolean;
  tabPosition: "right" | "left";
}) => {
  const dateString = useDateStore((state) => state.toBulletString());
  const tasksMap = useBulletStore((state) => state.tasks);
  const postpone = useBulletStore((state) => state.postpone);

  // 날짜별 필터 위치 확인해봐야함.
  /** 날짜별 필터 */
  const tasks = useMemo(() => {
    return [...tasksMap.values()].filter(
      (task) =>
        (!task.completedAt ? task.createdAt === dateString : task.completedAt === dateString) ||
        task.shouldCarryForward(dateString)
    );
  }, [dateString, tasksMap]);

  const { setSelectedTasks } = useProgressStore(({ actions }) => actions);

  useEffect(() => {
    setSelectedTasks(tasks);
  }, [setSelectedTasks, tasks]);

  useEffect(() => {
    postpone(dateString);
  }, [dateString, postpone]);

  const [isCalenderOpen, setIsCalenderOpen] = useState(false);

  return (
    <div
      className={`w-full flex flex-col ${isAddTaskIcon ? "flex-1" : "max-h-[176px]"} ${
        tabPosition === "left" ? "items-start" : "items-end"
      }`}
    >
      <TabSection tabPosition={tabPosition} />
      <TodoContainer isAddIcon={isAddTaskIcon}>
        {tasks.length > 0 &&
          tasks.map((bulletTask) => <TaskItem key={bulletTask.id} bulletTask={bulletTask} />)}
      </TodoContainer>
      {isAddTaskIcon && <AddTaskIcon />}
      {isCalenderOpen && <CalendarContainer setIsOpen={setIsCalenderOpen} />}
    </div>
  );
};

export default TodoSection;

function TabSection({ tabPosition }: { tabPosition: "right" | "left" }) {
  const dateString = useDateStore((state) => state.toBulletString());
  return (
    <div className='flex flex-row items-center'>
      {tabPosition === "left" ? (
        <Tab selected>
          SOMEDAY <ArrowIcon direction='up' />
        </Tab>
      ) : (
        <>
          <Tab>{dateString}</Tab>
          <Tab selected className='-ml-px'>
            TODAY
          </Tab>
        </>
      )}
    </div>
  );
}

// function DateTab() {

// }

function ArrowIcon({ direction }: { direction: "up" | "down" }) {
  return <>{direction === "up" ? "" : ""}</>;
}
