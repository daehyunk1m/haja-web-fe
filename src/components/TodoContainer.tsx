import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";
import { PropsWithChildren } from "react";

const TodoContainer = ({ children }: PropsWithChildren) => {
  const { isFold } = useBulletSectionContext();
  return (
    <div
      className={`w-full border border-black bg-white
        flex flex-col
        ${isFold ? "flex-1 min-h-0" : "h-[138px]"} gap-1 py-2 px-0 overflow-y-auto scrollbar-hide`}
    >
      {children}
    </div>
  );
};

export default TodoContainer;
