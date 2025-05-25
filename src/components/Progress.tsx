import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";

const Progress = () => {
  const [progressRange, setProgressRange] = useState(100);

  useEffect(() => {
    console.log(progressRange);
    setTimeout(() => {
      setProgressRange((range) => --range);
    }, 500);
  }, []);
  return (
    <div>
      <div
        style={{
          width: "70px",
          height: "70px",
          // border: "1px solid black",
          justifyContent: "center",
        }}
      >
        <PieChart progress={progressRange} size={70} fillColor='black' />
      </div>
    </div>
  );
};

export default Progress;
