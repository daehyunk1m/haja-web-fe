import { useCallback, useEffect, useRef, useState } from "react";
import BulletIcon, { BulletTask } from "./BulletIcon";
import { useBulletStore } from "../shared/bulletStore";

export default function Task({ bulletTask }: { bulletTask: BulletTask }) {
  // 태스크 네임, 아이콘, 받아야하고 수정할 수 있어야함
  const { id, icon, task, state } = bulletTask;

  const [isEdit, setIsEdit] = useState(false);
  const closeEdit = useCallback(() => setIsEdit(false), []);

  const deleteBullet = useBulletStore((state) => state.deleteBullet);

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
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <button style={{ padding: "2px", cursor: "pointer" }} type='button' onClick={() => {}} onMouseDown={() => {}}>
          <div className='icon-area' style={{ width: "24px", height: "24px", border: "1px solid black" }}>
            <BulletIcon icon={{}} />
          </div>
          {/* <span>{task}</span> */}
        </button>
      </div>
      <div>{isEdit ? <EditTask id={id} task={task} closeEdit={closeEdit} /> : <div onDoubleClick={() => setIsEdit(!isEdit)}>{task}</div>}</div>
      <button onClick={() => deleteBullet(id)}>X</button>
    </div>
  );
}

const EditTask = ({ id, task, closeEdit }: { id: string; task: string; closeEdit: () => void }) => {
  const updateBullet = useBulletStore((state) => state.updateBullet);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(task);
    if (inputRef.current) {
      // inputRef.current.focus();
      // inputRef.current.addEventListener("keypress", (e) => {
      //   e.key;
      // });
    }
  }, []);

  return (
    <div
      style={{ border: "1px solid black" }}
      onKeyUp={(e) => {
        if (e.key === "Escape") closeEdit();
      }}
    >
      <input
        ref={inputRef}
        type='text'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            updateBullet(id, { task: content });
            closeEdit();
          }
        }}
      />
    </div>
  );
};
