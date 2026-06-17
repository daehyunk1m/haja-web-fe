import Section from "./bulletList/Section";
import PopupContainer from "./PopupContainer";
import { usePopupStore } from "@/shared/popupStores";
import { useSyncExpandWithDate } from "@/hooks/useSyncExpandWithDate";

export default function Body() {
  // 상태 팝업은 섹션마다가 아니라 여기서 한 번만 렌더한다 (중복 인스턴스 방지)
  const isPopupOpen = usePopupStore((state) => state.isModalOpen);
  // 선택 날짜(일)가 바뀌면 섹션 확장을 다시 판단한다.
  useSyncExpandWithDate();

  return (
    <div className='w-full flex flex-col flex-1 min-h-0 items-center pt-0.5 pr-3.5 pb-0.5 pl-0.5'>
      <Section>
        <Section.Container position='right'>
          <Section.Tab />
          <Section.List type='task' />
        </Section.Container>
      </Section>
      <Section>
        <Section.Container position='left'>
          <Section.Tab />
          <Section.List type='someday' />
        </Section.Container>
      </Section>
      {isPopupOpen && <PopupContainer />}
    </div>
  );
}
