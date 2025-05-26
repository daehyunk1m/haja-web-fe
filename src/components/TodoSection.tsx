import { useMemo } from "react";
import Tab from "./Tab";
import TodoContainer from "./TodoContainer";
import TaskItem from "./TaskItem";
import { AddTaskIcon } from "./AddTask";
import { useBulletStore } from "../shared/bulletStore";
import { TaskCore } from "../shared/TaskCore";

const TodoSection = ({ isAddTaskIcon = false, tabPosition }: { isAddTaskIcon: boolean; tabPosition: "right" | "left" }) => {
  const date = TaskCore.today();
  const tasksMap = useBulletStore((state) => state.tasks);

  // 날짜별 필터 위치 확인해봐야함.
  /** 날짜별 필터 */
  const tasks = useMemo(() => {
    return [...tasksMap.values()].filter((task) => task.createdAt === date || task.shouldCarryForward(date));
  }, [date, tasksMap]);

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
          <Tab>{date}</Tab>
        </div>
      )}

      <TodoContainer isAddIcon>
        {tasks.length > 0 && tasks.map((bulletTask) => <TaskItem key={bulletTask.id} bulletTask={bulletTask} />)}
      </TodoContainer>
      {isAddTaskIcon && <AddTaskIcon />}
    </div>
  );
};

export default TodoSection;
