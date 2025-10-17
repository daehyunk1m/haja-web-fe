import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";
import { PropsWithChildren, useEffect } from "react";

const SectionContainer = ({
  children,
  position,
}: PropsWithChildren<{
  position: "left" | "right";
}>) => {
  const { isFold, tabPosition, setTabPosition } = useBulletSectionContext();

  useEffect(() => {
    setTabPosition(position);
  }, [position, setTabPosition]);

  return (
    <div
      className={`w-full flex flex-col 
        ${tabPosition === "right" ? "flex-1" : isFold ? "min-h-[500px]" : "max-h-[176px]"}
      ${position === "left" ? "items-start" : "items-end"}`}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
