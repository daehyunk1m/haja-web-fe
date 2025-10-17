import { useState } from "react";

export type TBulletSection = ReturnType<typeof useBulletSection>;

export const useBulletSection = () => {
  const [isAddTaskIcon, setIsAddTaskIcon] = useState(false);
  const [isFold, setIsFold] = useState(false);
  const [tabPosition, setTabPosition] = useState<"left" | "right">("left");
  // const [isCalenderOpen, setIsCalenderOpen] = useState(false);

  return {
    isAddTaskIcon,
    setIsAddTaskIcon,
    isFold,
    setIsFold,
    tabPosition,
    setTabPosition,
  };
};
