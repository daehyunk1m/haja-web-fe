import { useBulletStore } from "../shared/bulletStore";
import { useModalStore } from "../shared/modalStores";
import { Bullet } from "../shared/types/taskType";
import BulletIcon from "./BulletIcon";

export default function Modal() {
  const states = [
    Bullet.TODO,
    Bullet.START,
    Bullet.ONGOING,
    Bullet.DELAY,
    Bullet.DONE,
    Bullet.CANCEL,
  ];

  const id = useModalStore((state) => state.targetId);
  const { toggleModal } = useModalStore((state) => state.actions);
  const changeBulletState = useBulletStore((state) => state.changeBulletState);

  return (
    <div className='modal' style={{ width: "fit-content", border: "1px solid black" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {states.map((state, i) => {
          const capital = [...state].map((el, i) => (i === 0 ? el.toUpperCase() : el)).join("");
          return (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "row", gap: 10 }}
              onClick={() => {
                // e.stopPropagation();
                // changeBulletState(id, state);
                // toggleModal(id);
              }}
            >
              <button style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <BulletIcon id={id} bulletState={state} />
                <div>{capital}</div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
