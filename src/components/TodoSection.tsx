import Tab from "./Tab";
import TodoContainer from "./TodoContainer";
import Task from "./Task";
import { AddTaskIcon } from "./AddTask";
import { useBulletStore } from "../shared/bulletStore";
import { makeDateString } from "../utils/dateUtils";
import { TaskCore } from "../shared/TaskCore";
import { Bullet } from "../shared/types/taskType";
import { useEffect, useState } from "react";

const TodoSection = ({ isAddTaskIcon = false, tabPosition }: { isAddTaskIcon: boolean; tabPosition: "right" | "left" }) => {
  const tasks = useBulletStore((state) => state.tasks);
  const date = makeDateString();
  const a = new TaskCore("테스트", { note: "howhowhow" });
  const [task, setTask] = useState<TaskCore>(a);

  console.log(tasks);
  useEffect(() => {
    console.log(task.state);
    task.changeState(Bullet.DONE);
    setTimeout(() => {
      console.log(task.toJSON());
    }, 3000);
  }, [task]);

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
        {[...tasks].map((bulletTask) => (
          <Task key={bulletTask.id} bulletTask={bulletTask} />
        ))}
      </TodoContainer>
      {isAddTaskIcon && <AddTaskIcon />}
    </div>
  );
};

export default TodoSection;
