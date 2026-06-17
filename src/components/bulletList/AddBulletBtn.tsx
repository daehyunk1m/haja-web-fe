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

  if (tabPosition === "left") {
    // 섬데이 추가 버튼 — 확장과 함께 부드럽게 열린다(즉시 mount 깜빡임 방지).
    // 언마운트 대신 항상 DOM에 남기고, 컨테이너(SectionContainer)와 동일한
    // 0.3s ease-in-out으로 높이(grid-rows 0fr↔1fr)와 opacity를 전환한다.
    // grid 0fr→1fr 트릭: 고정 px 없이 콘텐츠 높이(48px)까지 부드럽게 늘어난다.
    return (
      <div
        data-testid='add-bullet-someday-region'
        aria-hidden={!isExpanded}
        className={`w-full grid overflow-hidden
          transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none
          ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className='min-h-0 overflow-hidden'>
          <button
            data-testid='add-bullet-someday'
            tabIndex={isExpanded ? 0 : -1}
            className={`bg-black cursor-pointer relative w-full h-12 flex items-center px-5 py-1.5
              transition-opacity duration-300 ease-in-out motion-reduce:transition-none
              ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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
        </div>
      </div>
    );
  }

  return null;
};

export default AddBulletBtn;
