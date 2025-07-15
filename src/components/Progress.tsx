import { useProgressStore } from "@/shared/progressStore";
import PieChart from "./PieChart";
// import { useEffect, useState } from "react";
// import { useBulletStore } from "../shared/bulletStore";
// import { useDateStore } from "@/shared/dateStore";

const Progress = () => {
  const progressRange = useProgressStore((state) => state.progressRange);

  return (
    <div className='flex items-center justify-center rounded-[30px] w-[60px] h-[60px] p-[2px]'>
      <PieChart progress={progressRange} size={70} fillColor='black' bgColor='white' />
      {/* <div className='bg-gray-200 w-full h-full rounded-full' /> */}
    </div>
  );
};

export default Progress;
