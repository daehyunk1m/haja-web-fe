import React from "react";

const Title = () => {
  return (
    <div style={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
      <h1 className='text-3xl font-bold'>HAJA</h1>
      <h3 className='text-xl font-bold'>{true ? "TO DO LIST" : "24.NOV"}</h3>
    </div>
  );
};

export default Title;
