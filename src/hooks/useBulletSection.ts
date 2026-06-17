import { useState } from "react";

export type TBulletSection = ReturnType<typeof useBulletSection>;

export const useBulletSection = () => {
  const [isAddTaskIcon, setIsAddTaskIcon] = useState(false);
  const [tabPosition, setTabPosition] = useState<"left" | "right">("left");
  // 확장(fold) 상태는 두 섹션이 공유해야 하므로 useSectionExpandStore로 분리했다.

  return {
    isAddTaskIcon,
    setIsAddTaskIcon,
    tabPosition,
    setTabPosition,
  };
};
