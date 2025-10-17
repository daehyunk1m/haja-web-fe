import { useEffect, useRef, useState } from "react";
import { useAddModalStore } from "../../shared/addModalStore";

import { useBulletStore } from "../../shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import { Bullet } from "@/shared/types/taskType";
import BulletIcon from "../BulletIcon";
import Ico from "../Ico";

export default function AddTaskInput() {
  const { closeModal } = useAddModalStore((state) => state.actions);
  const addBullet = useBulletStore((state) => state.addBullet);
  const dateString = useDateStore((state) => state.toBulletString());
  const type = useAddModalStore((state) => state.type);
  const ref = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className='w-full flex flex-row gap-[18px] h-16 items-center justify-start pl-[18px] pr-1.5 '>
      <BulletIcon id={"null"} bulletState={Bullet.TODO} />
      <div className='flex flex-col grow h-full items-start justify-center'>
        <input
          ref={ref}
          className='w-full bg-transparent outline-none font-pretendard text-[16px] text-black/70 placeholder:text-black/40'
          type='text'
          placeholder='할 일을 입력해주세요.'
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </div>
      <button
        className='flex items-center justify-center size-12 p-0'
        onClick={() => {
          addBullet(input, { createdAt: dateString, type });
          closeModal();
        }}
      >
        <Ico.Send />
      </button>
    </div>
  );
}
