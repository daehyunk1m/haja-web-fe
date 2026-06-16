import { useDateStore } from "@/shared/dateStore";
import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";
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
  const { isFold, setIsFold } = useBulletSectionContext();

  return (
    <>
      <Tab onClick={() => toggleCalendar()}>{dateString}</Tab>
      <Tab selected className='-ml-px' onClick={() => setIsFold((fold) => !fold)}>
        TODAY <Ico.Arrow direction={isFold ? "down" : "up"} />
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
  const { isFold, setIsFold } = useBulletSectionContext();
  return (
    <Tab selected onClick={() => setIsFold((fold) => !fold)}>
      SOMEDAY <Ico.Arrow direction={isFold ? "down" : "up"} />
    </Tab>
  );
};

export default SectionTab;
