import { useState } from "react";
import { useModalStore } from "../shared/modalStores";

const BulletIcon = ({ bulletState }: any) => {
  // setStates
  const isModalOpen = useModalStore((state) => state.isModalOpen);
  const { toggleModal } = useModalStore((state) => state.actions);

  // state for click
  const [clickTime, setClickTime] = useState(0);
  const clickDuration = 1000;

  return (
    <button
      onMouseDown={() => setClickTime(Date.now())}
      onMouseUp={() => {
        const clickEnd = Date.now();

        if (clickTime + clickDuration < clickEnd) {
          // when hold
          toggleModal();
          // modal open
          // setIsModalOpen(!isModalOpen);
        } else {
          // setBulletState("Done");
        }
      }}
    >
      <span>0</span>
    </button>
  );
};

export default BulletIcon;
