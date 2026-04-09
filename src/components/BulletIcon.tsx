import { useState, useRef } from "react";
import { usePopupStore } from "../shared/popupStores";
import { Bullet } from "../shared/types/taskType";
import { useBulletStore } from "../shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import Ico from "./Ico";

const BulletIcon = ({ id, bulletState }: { id: string; bulletState: Bullet }) => {
  const isModalOpen = usePopupStore((state) => state.isModalOpen);
  const { togglePopup } = usePopupStore((state) => state.actions);

  const changeBulletState = useBulletStore((state) => state.changeBulletState);
  const toggleDone = useBulletStore((state) => state.toggleDone);
  const dateString = useDateStore((state) => state.toBulletString());

  // state for click
  const [clickTime, setClickTime] = useState(0);
  const clickDuration = 500;
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 클릭한 요소의 위치를 계산하는 함수
  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      return {
        x: rect.left + scrollX + rect.width / 2, // 버튼 중앙
        y: rect.bottom + scrollY + 10, // 버튼 아래 10px
      };
    }
    return { x: 0, y: 0 };
  };

  return (
    <button
      className='w-6 h-6 cursor-pointer'
      ref={buttonRef}
      onMouseDown={() => setClickTime(Date.now())}
      onMouseUp={() => {
        const clickEnd = Date.now();
        if (clickTime + clickDuration < clickEnd) {
          // when hold - modal open with position
          const position = calculatePosition();
          togglePopup(id, position);
        } else {
          if (isModalOpen) {
            changeBulletState(id, bulletState, dateString);
            togglePopup(id);
          } else toggleDone(id, dateString);
        }
      }}
    >
      <BulletIco bulletState={bulletState} />
      <span style={{ display: "none" }}>{bulletState}</span>
    </button>
  );
};

export default BulletIcon;

function BulletIco({ bulletState }: { bulletState: Bullet }) {
  switch (bulletState) {
    case "todo":
      return <Ico.Todo />;
    case "done":
      return <Ico.Done />;
    case "cancel":
      return <Ico.Cancel />;
    case "ongoing":
      return <Ico.Ongoing />;
    case "delay":
      return <Ico.Delay />;
    default:
      return null;
  }
}

const person = {
  name: "John",
  age: 30,
  isMarried: true,
  sayHello: () => {
    console.log("Hello, my name is" + person.name);
  },
};
