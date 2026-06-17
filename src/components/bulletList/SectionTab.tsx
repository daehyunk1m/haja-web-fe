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
  const { toggleCalendar } = useDateStore((state) => state.actions);
  const isExpanded = useSectionExpandStore((s) => s.expanded === "task");
  const { toggle } = useSectionExpandStore((s) => s.actions);

  return (
    <>
      <Tab onClick={() => toggleCalendar()}>{dateString}</Tab>
      <Tab selected className='-ml-px' onClick={() => toggle()}>
        TODAY <Ico.Arrow direction={isExpanded ? "down" : "up"} />
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
