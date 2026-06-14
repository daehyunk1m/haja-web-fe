import { useCallback, useEffect, useRef, useState } from "react";
import BulletIcon from "./BulletIcon";
import { useBulletStore } from "../shared/bulletStore";
import { useSwipeRevealStore } from "../shared/swipeRevealStore";
import { TaskCore } from "../shared/TaskCore";
import Ico from "./Ico";
import { useSwipeToReveal } from "@/hooks/useSwipeToReveal";

const REVEAL_WIDTH = 64;

export default function TaskItem({ bulletTask }: { bulletTask: TaskCore }) {
  // 태스크 네임, 아이콘, 받아야하고 수정할 수 있어야함
  const { id, title, state } = bulletTask;
  // console.log(state);
  const deleteBullet = useBulletStore((state) => state.deleteBullet);
  const [isEdit, setIsEdit] = useState(false);
  const closeEdit = useCallback(() => setIsEdit(false), []);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { offset, isOpen, isDragging, onPointerDown, close } = useSwipeToReveal({
    revealWidth: REVEAL_WIDTH,
    threshold: REVEAL_WIDTH / 2,
  });

  // 단일 열림 조율: 한 번에 한 행만 열린다
  const openId = useSwipeRevealStore((s) => s.openId);
  const { setOpenId } = useSwipeRevealStore((s) => s.actions);

  // 이 행에서 스와이프/열림이 시작되면 소유권을 가져온다 (다른 행은 닫힘)
  useEffect(() => {
    if (isDragging || isOpen) setOpenId(id);
  }, [isDragging, isOpen, id, setOpenId]);

  // 다른 행이 활성화되면(또는 드래그로 해제되면) 이 행을 닫는다
  useEffect(() => {
    if (openId !== id && isOpen) close();
  }, [openId, id, isOpen, close]);

  const handleClick = useCallback(() => {
    // 삭제 영역이 열려 있으면 편집 대신 먼저 닫는다
    if (isOpen) {
      close();
      return;
    }
    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      setIsEdit(true);
    }, 250);
  }, [isOpen, close]);

  const handleDoubleClick = useCallback(() => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    console.log(bulletTask.toJSON());
  }, [bulletTask]);

  const handleDelete = useCallback(() => deleteBullet(id), [deleteBullet, id]);

  return (
    <div className='relative w-full overflow-hidden'>
      {/* 슬라이드로 드러나는 삭제 영역 (오른쪽 고정, 본문 뒤) */}
      <button
        type='button'
        data-testid='delete-action'
        aria-label='삭제'
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={handleDelete}
        className={`absolute inset-y-0 right-0 flex w-16 items-center justify-center bg-red-100 transition-colors hover:bg-red-200 ${
          isOpen ? "cursor-pointer" : "pointer-events-none"
        }`}
      >
        <Ico.Delete />
      </button>

      {/* 좌측으로 슬라이드되는 본문 */}
      <div
        data-testid='swipe-content'
        data-swipe-open={isOpen}
        onPointerDown={onPointerDown}
        style={{
          transform: `translateX(${offset}px)`,
          touchAction: "pan-y",
          transition: isDragging
            ? "none"
            : "transform 0.2s ease, background-color 0.15s ease",
        }}
        className='relative z-10 flex w-full flex-row items-center bg-white hover:bg-[#f0f0f0]'
      >
        <div className='h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
          <BulletIcon id={id} bulletState={state} />
          <span className='font-medium text-[16px] text-black whitespace-nowrap'>
            {isEdit ? (
              <EditTask id={id} title={title} closeEdit={closeEdit} />
            ) : (
              <span
                className='font-medium text-[16px] text-black whitespace-nowrap cursor-default'
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
              >
                {title}
              </span>
            )}
          </span>
        </div>
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
      inputRef.current.focus();
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
