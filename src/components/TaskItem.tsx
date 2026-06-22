import { useCallback, useEffect, useRef, useState } from "react";
import BulletIcon from "./BulletIcon";
import { useBulletStore } from "../shared/bulletStore";
import { useSwipeRevealStore } from "../shared/swipeRevealStore";
import { useEditingStore } from "../shared/editingStore";
import { TaskCore } from "../shared/TaskCore";
import Ico from "./Ico";
import { useSwipeToReveal } from "@/hooks/useSwipeToReveal";
import ConfirmDialog from "@/components/modal/ConfirmDialog";

const REVEAL_WIDTH = 64;

export default function TaskItem({ bulletTask }: { bulletTask: TaskCore }) {
  // 태스크 네임, 아이콘, 받아야하고 수정할 수 있어야함
  const { id, title, state } = bulletTask;
  // console.log(state);
  const deleteBullet = useBulletStore((state) => state.deleteBullet);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // 편집 단일 조율: 한 번에 한 태스크만 편집된다 (editingId === id)
  const editingId = useEditingStore((s) => s.editingId);
  const { setEditingId } = useEditingStore((s) => s.actions);
  const isEdit = editingId === id;
  const closeEdit = useCallback(() => setEditingId(null), [setEditingId]);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

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

  // 스와이프가 열린 상태에서 이 태스크 바깥을 누르면 스와이프를 닫는다.
  // 스와이프를 연 pointerdown은 isOpen이 true가 되기 전이라 자기 자신을 닫지 않는다.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDownOutside = (e: PointerEvent) => {
      const target = e.target;
      if (target instanceof Node && rootRef.current && !rootRef.current.contains(target)) {
        close();
        setOpenId(null);
      }
    };
    document.addEventListener("pointerdown", handlePointerDownOutside);
    return () => document.removeEventListener("pointerdown", handlePointerDownOutside);
  }, [isOpen, close, setOpenId]);

  const handleClick = useCallback(() => {
    // 삭제 영역이 열려 있으면 편집 대신 먼저 닫는다
    if (isOpen) {
      close();
      return;
    }
    // 다른 태스크가 편집 중이면, 그 input을 blur해 저장(onBlur)·종료시키고
    // 이번 클릭은 편집에 진입하지 않는다 (한 번에 하나만 편집)
    if (editingId !== null && editingId !== id) {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      setEditingId(null);
      return;
    }
    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      setEditingId(id);
    }, 250);
  }, [isOpen, close, editingId, id, setEditingId]);

  const handleDoubleClick = useCallback(() => {
    // 더블클릭은 단일클릭(편집 진입) 타이머를 취소만 한다
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
  }, []);

  // 삭제는 확인 모달을 한 번 거친다
  const requestDelete = useCallback(() => setConfirmOpen(true), []);
  const cancelDelete = useCallback(() => setConfirmOpen(false), []);
  const confirmDelete = useCallback(() => {
    deleteBullet(id);
    setConfirmOpen(false);
  }, [deleteBullet, id]);

  return (
    <div ref={rootRef} className='relative w-full overflow-hidden'>
      {/* 슬라이드로 드러나는 삭제 영역 (오른쪽 고정, 본문 뒤) */}
      <button
        type='button'
        data-testid='delete-action'
        aria-label='삭제'
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={requestDelete}
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
        <div className='min-h-[38px] flex flex-row items-start px-5 py-1 gap-2 w-full'>
          {/* 불렛은 한 줄 높이(30px) 박스에서 중앙 정렬 → 한 줄이면 행 중앙, 여러 줄이면 첫 줄에 맞음 */}
          <span className='flex min-h-[30px] items-center'>
            <BulletIcon id={id} bulletState={state} />
          </span>
          {/* 한 줄: 박스(30px) 안에서 중앙(pt 3px + 줄 24px + 여백 3px). 두 줄 이상:
              첫 줄이 pt-[3px]만큼 내려와 불렛 중심(15px)에 맞는다. */}
          <span className='font-medium text-[16px] text-black flex-1 min-w-0 min-h-[30px] pt-[3px]'>
            {isEdit ? (
              <EditTask id={id} title={title} closeEdit={closeEdit} />
            ) : (
              <span
                className='font-medium text-[16px] text-black break-words cursor-default select-none'
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
              >
                {title}
              </span>
            )}
          </span>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          message='정말 삭제하시겠습니까?'
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
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
  // Enter·blur·Escape(언마운트 시 blur)로 인한 중복 저장/취소를 한 번으로 가드한다
  const settledRef = useRef(false);

  useEffect(() => {
    setContent({ title: title ?? "" });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 저장 후 닫기 (Enter / 타이틀 영역 바깥 클릭 = blur)
  const save = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    editBullet(id, content);
    closeEdit();
  };

  // 저장 없이 닫기 (Escape). 이후 언마운트로 발생하는 blur는 settledRef로 무시된다
  const cancel = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    closeEdit();
  };

  return (
    <input
      ref={inputRef}
      className='border-black border-b-[1px] w-full'
      type='text'
      value={content.title ?? ""}
      onChange={(e) => setContent({ title: e.target.value })}
      onBlur={save}
      // 편집 중 텍스트 선택/포인터 조작이 상위 정렬 드래그(@dnd-kit)를 깨워
      // 행이 흐려지는(opacity:0.5) 것을 막는다
      onPointerDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") cancel();
      }}
    />
  );
};
