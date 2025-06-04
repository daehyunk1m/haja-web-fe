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
  isAddTaskIcon: boolean;
  tabPosition: "right" | "left";
}) => {
  // const date = TaskCore.today();
  // const [date, setDate] = useState<Date | undefined>(new Date(TaskCore.today()));
  const dateString = useDateStore((state) => state.toBulletString());
  // const date = makeDateString("2025-05-29", "-", true);
  // console.log(date);
  const tasksMap = useBulletStore((state) => state.tasks);
  const postpone = useBulletStore((state) => state.postpone);

  // 날짜별 필터 위치 확인해봐야함.
  // @todo
  // 컴플리트 된 것 도 함께 필터링 해야함
  /** 날짜별 필터 */
  const tasks = useMemo(() => {
    return [...tasksMap.values()].filter(
      (task) =>
        // 여기 로직 수정, 컴플리트 먼저 필터링, 아닌 것들에 한해서 크리에이트 및 슈드캐리포워드 적용
        task.createdAt === dateString ||
        task.completedAt === dateString ||
        task.shouldCarryForward(dateString)
    );
  }, [dateString, tasksMap]);

  const { setSelectedTasks } = useProgressStore(({ actions }) => actions);

  useEffect(() => {
    setSelectedTasks(tasks);
  }, [setSelectedTasks, tasks]);

  useEffect(() => {
    postpone(dateString);
  }, []);

  // useDateStore 만들기
  const [isCalanederOpen, setIsCalanderOpen] = useState(false);

  return (
    <div
      className='taskAndTabs'
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "rgba(200,0,0, 0.1)",
      }}
    >
      {tabPosition === "left" ? (
        <div style={{ display: "flex", gap: 2, flexDirection: "row" }}>
          <Tab selected>SOMEDAY</Tab>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Tab selected>TODAY</Tab>
          <div onClick={() => setIsCalanderOpen((open) => !open)}>
            {/* <Tab>{date?.toDateString()}</Tab> */}
            <Tab>{dateString}</Tab>
          </div>
        </div>
      )}

      <TodoContainer isAddIcon>
        {tasks.length > 0 &&
          tasks.map((bulletTask) => <TaskItem key={bulletTask.id} bulletTask={bulletTask} />)}
      </TodoContainer>
      {isAddTaskIcon && <AddTaskIcon />}
      {isCalanederOpen && <CalendarContainer setIsOpen={setIsCalanderOpen} />}
    </div>
  );
};

export default TodoSection;
