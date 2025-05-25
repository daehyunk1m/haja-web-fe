import React, { PropsWithChildren } from "react";
import { AddTaskIcon } from "./AddTask";

const TodoContainer = ({ children, isAddIcon = false }: PropsWithChildren<{ isAddIcon?: boolean }>) => {
  return (
    <>
      <div
        className='taskContainer'
        style={{
          display: "flex",
          flex: 1,
          border: "1px solid black",
          flexDirection: "column",
          padding: "10px 20px",
          backgroundColor: "rgba(120,0,0,0.2)",
        }}
      >
        <div style={{ backgroundColor: "white", height: "100%" }}>{children}</div>
      </div>
    </>
  );
};

export default TodoContainer;
