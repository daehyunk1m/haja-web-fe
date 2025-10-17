import { useAddModalStore } from "@/shared/addModalStore";
import Ico from "../Ico";
import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";

const AddBulletBtn = ({ type }: { type: "task" | "someday" }) => {
  const { isFold, tabPosition } = useBulletSectionContext();
  const { toggleAddModal, setType } = useAddModalStore((state) => state.actions);

  if (tabPosition === "right") {
    return (
      <div className='relative h-5 w-10'>
        <button
          className='absolute left-5 -top-5 bg-white w-10 h-10 flex items-center justify-center cursor-pointer'
          onClick={() => {
            setType(type);
            toggleAddModal();
          }}
        >
          <Ico.Add />
        </button>
      </div>
    );
  }

  if (isFold && tabPosition === "left") {
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
