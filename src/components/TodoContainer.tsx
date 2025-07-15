import { PropsWithChildren } from "react";

const TodoContainer = ({
  children,
  isAddIcon = false,
}: PropsWithChildren<{ isAddIcon?: boolean }>) => {
  return (
    <div
      className={`w-full border border-black bg-white flex flex-col ${
        isAddIcon ? "flex-1" : ""
      } gap-1 py-2 px-0 overflow-hidden`}
    >
      {children}
    </div>
  );
};

export default TodoContainer;

<div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
  <div className='bg-white h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
    {/* <img src={img} alt="bullet" className="w-6 h-6" /> */}
    <div className='w-6 h-6 bg-gray-300 rounded-full' />
    <span className='font-medium text-[16px] text-black whitespace-nowrap'>헬스장 가기</span>
  </div>
</div>;
