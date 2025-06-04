import { useCallback, useEffect, useRef, useState } from "react";
import BulletIcon from "./BulletIcon";
import { useBulletStore } from "../shared/bulletStore";
import { TaskCore } from "../shared/TaskCore";

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
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* <button
          style={{ padding: "2px", cursor: "pointer" }}
          type='button'
          onClick={() => {}}
          onMouseDown={() => {}}
        >
        </button> */}
        <div
          className='icon-area'
          style={{ width: "36px", height: "36px", margin: "2px", border: "1px solid black" }}
        >
          <BulletIcon id={id} bulletState={state} />
        </div>
      </div>
      <div>
        {isEdit ? (
          <EditTask id={id} title={title} closeEdit={closeEdit} />
        ) : (
          <div
            onClick={() => console.log(bulletTask.toJSON())}
            onDoubleClick={() => setIsEdit(!isEdit)}
          >
            {title}
          </div>
        )}
      </div>
      <button onClick={() => deleteBullet(id)}>X</button>
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
    setContent({ title });
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
        value={content.title}
        onChange={(e) => setContent({ title: e.target.value })}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            editBullet(id, content);
            closeEdit();
          }
        }}
      />
    </div>
  );
};
