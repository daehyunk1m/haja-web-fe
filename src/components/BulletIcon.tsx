import { useCallback, useEffect, useRef } from "react";
import { usePopupStore } from "../shared/popupStores";
import { Bullet } from "../shared/types/taskType";
import { useBulletStore } from "../shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import Ico from "./Ico";

/** 롱프레스로 인정되는 누름 시간(ms) */
const LONG_PRESS_MS = 500;

const BulletIcon = ({ id, bulletState }: { id: string; bulletState: Bullet }) => {
  const isModalOpen = usePopupStore((state) => state.isModalOpen);
  const { togglePopup } = usePopupStore((state) => state.actions);

  const changeBulletState = useBulletStore((state) => state.changeBulletState);
  const toggleDone = useBulletStore((state) => state.toggleDone);
  const dateString = useDateStore((state) => state.toBulletString());

  const buttonRef = useRef<HTMLButtonElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  // 클릭한 요소의 위치를 계산하는 함수
  const calculatePosition = useCallback(() => {
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
  }, []);

  const clearPressTimer = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  // 누르는 순간 타이머 시작 — 손을 떼지 않아도 지정 시간이 지나면 팝업을 연다
  const handlePressStart = useCallback(() => {
    longPressFired.current = false;
    clearPressTimer();
    pressTimer.current = setTimeout(() => {
      pressTimer.current = null;
      longPressFired.current = true;
      togglePopup(id, calculatePosition());
    }, LONG_PRESS_MS);
  }, [clearPressTimer, togglePopup, id, calculatePosition]);

  // 떼는 순간: 롱프레스가 이미 발동했으면 무시, 아니면 짧은 클릭으로 처리
  const handlePressEnd = useCallback(() => {
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    clearPressTimer();
    if (isModalOpen) {
      changeBulletState(id, bulletState, dateString, true);
      togglePopup(id);
    } else {
      toggleDone(id, dateString);
    }
  }, [
    clearPressTimer,
    isModalOpen,
    changeBulletState,
    id,
    bulletState,
    dateString,
    togglePopup,
    toggleDone,
  ]);

  // 포인터가 버튼을 벗어나거나 취소되면 롱프레스를 취소한다 (별도 동작 없음)
  const handlePressCancel = useCallback(() => {
    clearPressTimer();
    longPressFired.current = false;
  }, [clearPressTimer]);

  // 언마운트 시 타이머 정리
  useEffect(() => clearPressTimer, [clearPressTimer]);

  return (
    <button
      className='w-6 h-6 cursor-pointer'
      ref={buttonRef}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressCancel}
      onPointerCancel={handlePressCancel}
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
