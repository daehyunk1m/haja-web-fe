import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAddModalStore } from "../shared/addModalStore";

import { useBulletStore } from "../shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import Ico from "./Ico";

export function AddTaskIcon({ size = 48 }: { size?: 18 | 24 | 48 }) {
  // 18 24 48
  // const size = '48'

  const { toggleAddModal } = useAddModalStore((state) => state.actions);

  return (
    <div className='relative h-5 w-10'>
      <button
        className='absolute left-5 -top-5 bg-white w-10 h-10 flex items-center justify-center cursor-pointer'
        onClick={() => toggleAddModal()}
      >
        <Ico.Add />
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
