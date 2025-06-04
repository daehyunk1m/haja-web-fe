import { useProgressStore } from "@/shared/progressStore";
import PieChart from "./PieChart";
// import { useEffect, useState } from "react";
// import { useBulletStore } from "../shared/bulletStore";
// import { useDateStore } from "@/shared/dateStore";

const Progress = () => {
  const progressRange = useProgressStore((state) => state.progressRange);

  // const tasks = useBulletStore((state) => state.tasks);
  // const dateString = useDateStore(({ toBulletString }) => toBulletString());

  // const [progressRange, setProgressRange] = useState(0);

  // useEffect(() => {
  //   console.log(tasks, dateString);
  //   const countDone = tasks
  //     .values()
  //     .filter(({ isClosed }) => isClosed)
  //     .toArray().length;

  //   setProgressRange((countDone / tasks.size) * 100);
  // }, [dateString, tasks]);

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
