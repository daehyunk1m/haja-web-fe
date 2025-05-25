import React, { PropsWithChildren } from "react";

const Tab = ({ children, selected = false }: PropsWithChildren<{ selected?: boolean }>) => {
  return (
    <div
      style={{
        width: "125px",
        height: "35px",
        border: "1px solid black",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: "2 10",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: !selected ? "white" : "black",
        color: selected ? "white" : "black",
      }}
    >
      <span>{children}</span>
    </div>
  );
};

export default Tab;
