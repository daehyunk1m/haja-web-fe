import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";
import { PropsWithChildren, useEffect } from "react";

const SectionContainer = ({
  children,
  position,
}: PropsWithChildren<{
  position: "left" | "right";
}>) => {
  const { isFold, setTabPosition } = useBulletSectionContext();

  useEffect(() => {
    setTabPosition(position);
  }, [position, setTabPosition]);

  return (
    <div
      className={`w-full flex flex-col
        ${isFold ? "flex-1 min-h-0" : "flex-none"}
      ${position === "left" ? "items-start" : "items-end"}`}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
