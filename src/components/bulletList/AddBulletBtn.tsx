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
    // 언마운트 대신 항상 DOM에 남기고, 높이(grid-rows 0fr↔1fr)와 opacity를 전환한다.
    // grid 0fr→1fr 트릭: 고정 px 없이 콘텐츠 높이(48px)까지 부드럽게 늘어난다.
    // 열림 stagger: 컨테이너(SectionContainer, 0.3s)가 먼저 오르고, delay-150 뒤
    // 버튼이 0.15s로 올라 같은 시점(0.15+0.15=0.3s)에 끝난다. timing은 "도착 상태"
    // 클래스에서 읽히므로 delay를 확장 상태에만 두면 닫힘엔 delay가 없어
    // 빠르게 접혀(0.2s) 컨테이너 밖으로 삐져나오지 않는다.
    return (
      <div
        data-testid='add-bullet-someday-region'
        aria-hidden={!isExpanded}
        className={`w-full grid overflow-hidden
          transition-[grid-template-rows] ease-in-out motion-reduce:transition-none
          ${isExpanded ? "grid-rows-[1fr] duration-150 delay-150" : "grid-rows-[0fr] duration-200"}`}
      >
        <div className='min-h-0 overflow-hidden'>
          <button
            data-testid='add-bullet-someday'
            tabIndex={isExpanded ? 0 : -1}
            className={`bg-black cursor-pointer relative w-full h-12 flex items-center px-5 py-1.5
              transition-opacity ease-in-out motion-reduce:transition-none
              ${isExpanded ? "opacity-100 duration-150 delay-150" : "opacity-0 pointer-events-none duration-200"}`}
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
