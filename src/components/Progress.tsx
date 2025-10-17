import { useProgressStore } from "@/shared/progressStore";
import PieChart from "./PieChart";

const Progress = () => {
  const progressRange = useProgressStore((state) => state.progressRange);

  return (
    <div className='flex items-center justify-center rounded-[30px] w-[60px] h-[60px] p-[2px]'>
      <PieChart
        progress={progressRange}
        size={70}
        fillColor='black'
        bgColor={progressRange > 0 ? "white" : undefined}
      />
    </div>
  );
};

export default Progress;
