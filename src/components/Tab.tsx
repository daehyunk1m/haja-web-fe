import { PropsWithChildren } from "react";

const Tab = ({
  children,
  selected = false,
  className,
  onClick,
}: PropsWithChildren<{ selected?: boolean; className?: string; onClick?: () => void }>) => {
  return (
    <button
      className={`h-[35px] w-[125px] flex items-center justify-center rounded-tl-[10px] rounded-tr-[10px] border border-black border-b-0 ${className} cursor-pointer ${
        selected ? "bg-black text-white" : "bg-white text-black"
      }`}
      onClick={() => {
        onClick?.();
      }}
    >
      <span className='font-bold text-[16px] tracking-[-0.03em]'>{children}</span>
    </button>
  );
};

export default Tab;
