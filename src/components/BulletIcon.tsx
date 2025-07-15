import { useState } from "react";
import { useModalStore } from "../shared/modalStores";
import { Bullet } from "../shared/types/taskType";
import { useBulletStore } from "../shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import Ico from "./Ico";

const BulletIcon = ({ id, bulletState }: { id: string; bulletState: Bullet }) => {
  const isModalOpen = useModalStore((state) => state.isModalOpen);
  const { toggleModal } = useModalStore((state) => state.actions);

  const changeBulletState = useBulletStore((state) => state.changeBulletState);
  const toggleDone = useBulletStore((state) => state.toggleDone);
  const dateString = useDateStore((state) => state.toBulletString());

  // state for click
  const [clickTime, setClickTime] = useState(0);
  const clickDuration = 1000;

  return (
    <button
      className='w-6 h-6'
      onMouseDown={() => setClickTime(Date.now())}
      onMouseUp={() => {
        const clickEnd = Date.now();

        if (clickTime + clickDuration < clickEnd) {
          // when hold - modal open
          toggleModal(id);
        } else {
          if (isModalOpen) {
            changeBulletState(id, bulletState, dateString);
            toggleModal(id);
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
