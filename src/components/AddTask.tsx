import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAddModalStore } from "../shared/addModalStore";

import { useBulletStore } from "../shared/bulletStore";
import BulletIcon from "./BulletIcon";
import { Bullet } from "../shared/types/taskType";
import { useDateStore } from "@/shared/dateStore";

export function AddTaskIcon({ size = 48 }: { size?: 18 | 24 | 48 }) {
  // 18 24 48
  // const size = '48'

  const { toggleAddModal } = useAddModalStore((state) => state.actions);

  return (
    <div
      className='addTaskIcon'
      style={{
        width: size,
        height: size,
        // position: "relative",
        display: "flex",
        justifyContent: "center",
        // right: "20px",
        // bottom: "48px",
        border: "1px solid black",
        cursor: "pointer",
      }}
    >
      <button
        style={{
          flex: 1,
          border: "1px solid red",
          cursor: "pointer",
        }}
        onClick={() => toggleAddModal()}
      >
        +
      </button>
    </div>
  );
}

export function AddModal() {
  const { toggleAddModal, closeModal } = useAddModalStore((state) => state.actions);
  const addBullet = useBulletStore((state) => state.addBullet);
  const dateString = useDateStore((state) => state.toBulletString());

  const [input, setInput] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  return createPortal(
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        display: "flex",
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: 30,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
          width: "400px",
          height: "200px",
          border: "1px solid black",
          backgroundColor: "white",
          borderRadius: 20,
          position: "absolute",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ display: "flex", gap: 10, border: "1px solid black" }}>
          {/* <BulletIcon id={id} bulletState={Bullet.TODO}/> */}
          <input
            style={{ width: "100%" }}
            type='text'
            placeholder='할 일을 입력해주세요.'
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            style={{
              padding: "8px 30px",
              border: "1px solid black",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => closeModal()}
          >
            취소
          </button>
          <button
            style={{
              padding: "8px 30px",
              border: "1px solid black",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => {
              addBullet(input, { createdAt: dateString });
              closeModal();
            }}
          >
            추가
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
