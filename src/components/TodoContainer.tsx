import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";
import { PropsWithChildren } from "react";

const TodoContainer = ({ children }: PropsWithChildren) => {
  const { tabPosition } = useBulletSectionContext();
  return (
    <div
      className={`w-full h-full border border-black bg-white 
        flex flex-col flex-1
        ${tabPosition === "right" ? "flex-1" : ""} gap-1 py-2 px-0 overflow-hidden`}
    >
      {children}
    </div>
  );
};

export default TodoContainer;
