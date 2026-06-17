import { useAddModalStore } from "@/shared/addModalStore";
import Ico from "../Ico";
import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";
import { useSectionExpandStore } from "@/shared/sectionExpandStore";

const AddBulletBtn = ({ type }: { type: "task" | "someday" }) => {
  const { tabPosition } = useBulletSectionContext();
  const isExpanded = useSectionExpandStore((s) => s.expanded === type);
  const { toggleAddModal, setType } = useAddModalStore((state) => state.actions);

  if (tabPosition === "right") {
    // 투데이 컨테이너 우하단 추가 버튼 — 48px (이전 40px) 터치 타깃.
    return (
      <div className='relative h-6 w-12'>
        <button
          data-testid='add-bullet-task'
          className='absolute left-6 -top-6 bg-white w-12 h-12 flex items-center justify-center cursor-pointer'
          onClick={() => {
            setType(type);
            toggleAddModal();
          }}
        >
          <Ico.Add size={48} />
        </button>
      </div>
    );
  }

  if (isExpanded && tabPosition === "left") {
    return (
      <button
        className='bg-black cursor-pointer relative w-full h-12 flex items-center px-5 py-1.5'
        onClick={() => {
          setType(type);
          toggleAddModal();
        }}
      >
        <span className='font-pretendard font-medium text-[16px] text-white text-left whitespace-nowrap flex-1'>
          언젠가 할 일 추가하기
        </span>
        <span className='relative shrink-0 w-10 h-10 flex items-center justify-center ml-2'>
          <Ico.Add fill='white' />
        </span>
      </button>
    );
  }

  return null;
};

export default AddBulletBtn;
