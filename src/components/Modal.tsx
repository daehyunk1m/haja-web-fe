import Icon from "./BulletIcon";

export default function Modal({ setBulletState }) {
  return (
    <div className='modal' style={{ width: "fit-content", border: "1px solid black" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Array.from({ length: 5 }, (_, i) => {
          const name = ["Done", "Loading", "Postpone", "Cancel", "Start"];
          return (
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <button
                style={{ display: "flex", flexDirection: "row", gap: 10 }}
                onClick={() => {
                  setBulletState(name[i]);
                  // setIsModalOpen(!isModalOpen);
                }}
              >
                <Icon icon={{}} />
                <div>{name[i]}</div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
