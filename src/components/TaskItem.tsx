import { useCallback, useEffect, useRef, useState } from "react";
import BulletIcon from "./BulletIcon";
import { useBulletStore } from "../shared/bulletStore";
import { TaskCore } from "../shared/TaskCore";
import Ico from "./Ico";

export default function TaskItem({ bulletTask }: { bulletTask: TaskCore }) {
  // 태스크 네임, 아이콘, 받아야하고 수정할 수 있어야함
  const { id, title, state } = bulletTask;
  // console.log(state);
  const deleteBullet = useBulletStore((state) => state.deleteBullet);
  const [isEdit, setIsEdit] = useState(false);
  const closeEdit = useCallback(() => setIsEdit(false), []);

  // // 단일컴포넌트에서 구독 시 예제
  // useEffect(() => {
  //   // 마운트 될 때 구독 시작
  //   const unsubscribe = useTestStore.subscribe(
  //     (state) => state.count,
  //     (count) => {
  //       // ...
  //     }
  //   );
  //   return () => {
  //     // 언마운트 시 리턴하여 구독 해제
  //     unsubscribe();
  //   };

  return (
    <div className='hover:bg-[#f0f0f0] transition-colors flex flex-row items-center w-full'>
      <div className='h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
        <BulletIcon id={id} bulletState={state} />
        <span className='font-medium text-[16px] text-black whitespace-nowrap'>
          {isEdit ? (
            <EditTask id={id} title={title} closeEdit={closeEdit} />
          ) : (
            <span
              className='font-medium text-[16px] text-black whitespace-nowrap cursor-default'
              onClick={() => console.log(bulletTask.toJSON())}
              onDoubleClick={() => setIsEdit(!isEdit)}
            >
              {title}
            </span>
          )}
        </span>
        <button className='cursor-pointer' onClick={() => deleteBullet(id)}>
          <Ico.Delete />
        </button>
      </div>
    </div>
  );
}

const EditTask = ({
  id,
  title,
  closeEdit,
}: {
  id: string;
  title: string;
  closeEdit: () => void;
}) => {
  const editBullet = useBulletStore((state) => state.editBullet);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState<Partial<Pick<TaskCore, "title" | "note">>>({});

  useEffect(() => {
    setContent({ title: title ?? "" });
    if (inputRef.current) {
      // inputRef.current.focus();
      // inputRef.current.addEventListener("keypress", (e) => {
      //   e.key;
      // });
    }
  }, []);

  return (
    <input
      ref={inputRef}
      className='border-black border-b-[1px]'
      type='text'
      value={content.title ?? ""}
      onChange={(e) => setContent({ title: e.target.value })}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          editBullet(id, content);
          closeEdit();
        }
        if (e.key === "Escape") {
          closeEdit();
        }
      }}
    />
  );
};
