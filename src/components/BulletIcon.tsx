import { useState } from "react";
import { useModalStore } from "../shared/modalStores";
import { Bullet } from "../shared/types/taskType";
import { useBulletStore } from "../shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";

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
      <span style={{ display: "contents" }}>{bulletState}</span>
    </button>
  );
};

export default BulletIcon;
