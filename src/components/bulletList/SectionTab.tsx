import { useDateStore } from "@/shared/dateStore";
import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";
import { useSectionExpandStore } from "@/shared/sectionExpandStore";
import CalendarContainer from "../CalendarContainer";
import Tab from "../Tab";
import Ico from "../Ico";
import ModalContainer from "../modal/ModalContainer";

const SectionTab = () => {
  const { tabPosition } = useBulletSectionContext();
  return (
    <div className='flex flex-row items-center'>
      {tabPosition === "left" ? <SomedayTab /> : <DateTab />}
    </div>
  );
};

const DateTab = () => {
  const isCalendarOpen = useDateStore((state) => state.isCalendarOpen);
  const dateString = useDateStore((state) => state.toBulletString());
  const { toggleCalendar, setDate } = useDateStore((state) => state.actions);

  // TODAY 탭은 컨테이너 토글이 아니라 선택 날짜를 오늘로 되돌린다.
  // 날짜가 바뀌면 useSyncExpandWithDate가 확장을 다시 판단한다(섹션 토글은 SOMEDAY 탭 담당).
  return (
    <>
      <Tab onClick={() => toggleCalendar()}>{dateString}</Tab>
      <Tab selected className='-ml-px' onClick={() => setDate()}>
        TODAY
      </Tab>
      {isCalendarOpen && (
        <ModalContainer close={() => toggleCalendar(false)}>
          <CalendarContainer />
        </ModalContainer>
      )}
    </>
  );
};

const SomedayTab = () => {
  const isExpanded = useSectionExpandStore((s) => s.expanded === "someday");
  const { toggle } = useSectionExpandStore((s) => s.actions);
  return (
    <Tab selected onClick={() => toggle()}>
      SOMEDAY <Ico.Arrow direction={isExpanded ? "down" : "up"} />
    </Tab>
  );
};

export default SectionTab;
