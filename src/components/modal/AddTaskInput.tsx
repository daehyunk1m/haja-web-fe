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

  const handleSubmit = () => {
    const title = input.trim();
    // 제목이 비어 있으면(공백만 포함) 생성하지 않고 모달도 유지한다
    if (!title) return;
    addBullet(title, { createdAt: dateString, type });
    closeModal();
  };

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
          onKeyDown={(e) => {
            // 한글 등 IME 조합 확정용 Enter는 제출로 처리하지 않는다
            if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSubmit();
          }}
        />
      </div>
      <button
        className='flex items-center justify-center size-12 p-0'
        onClick={handleSubmit}
      >
        <Ico.Send />
      </button>
    </div>
  );
}
