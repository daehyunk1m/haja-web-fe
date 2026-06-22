import { PropsWithChildren } from "react";

// 태스크 목록 박스. 항상 flex-grow로 부모(SectionContainer)를 채우고,
// 접힘 높이(peek)는 basis-[138px](= 3행, sectionFold.PEEK_TASK_COUNT와 동기)로 고정한다.
// 높이 전환은 부모의 flex-grow 애니메이션을 따라가므로 여기엔 별도 transition이 필요 없다.
const TodoContainer = ({ children }: PropsWithChildren) => {
  return (
    <div
      className='w-full border border-black bg-white
        flex flex-col grow shrink-0 basis-[138px] min-h-0
        gap-1 py-2 px-0 overflow-y-auto scrollbar-hide'
    >
      {children}
    </div>
  );
};

export default TodoContainer;
