// import { useBulletStore } from "../shared/bulletStore";
import { useEffect, useRef } from "react";
import { usePopupStore } from "../shared/popupStores";
import { Bullet } from "../shared/types/taskType";
import BulletIcon from "./BulletIcon";

const states = [Bullet.TODO, Bullet.ONGOING, Bullet.DELAY, Bullet.DONE, Bullet.CANCEL];

export default function PopupContainer() {
  const targetId = usePopupStore((state) => state.targetId);
  const position = usePopupStore((state) => state.position);
  const isModalOpen = usePopupStore((state) => state.isModalOpen);

  const { closePopup } = usePopupStore((state) => state.actions);
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isModalOpen, closePopup]);

  if (!isModalOpen) return null;

  // 화면 경계를 고려한 위치 계산
  const getPositionStyles = () => {
    if (position.x === 0 && position.y === 0) {
      // 기본 위치 (화면 중앙)
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    // 화면 크기 고려
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const modalWidth = 200; // 예상 모달 너비
    const modalHeight = 250; // 예상 모달 높이

    let left = position.x;
    let top = position.y;

    // 오른쪽 경계 체크
    if (left + modalWidth > viewportWidth) {
      left = viewportWidth - modalWidth - 20;
    }

    // 아래쪽 경계 체크
    if (top + modalHeight > viewportHeight) {
      top = position.y - modalHeight - 40; // 위쪽에 표시
    }

    // 왼쪽 경계 체크
    if (left < 20) {
      left = 20;
    }

    // 위쪽 경계 체크
    if (top < 20) {
      top = 20;
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      transform: "none",
    };
  };

  return (
    <div
      ref={modalRef}
      className='absolute z-50 w-fit min-w-[160px] border border-black bg-white py-5 shadow-sm animate-in zoom-in-95 duration-200'
      style={getPositionStyles()}
    >
      <div className='flex flex-col'>
        {states.map((state, i) => {
          const label =
            state === Bullet.TODO ? "to do" : state === Bullet.ONGOING ? "on going" : state;
          const capital = [...label].map((el, i) => (i === 0 ? el.toUpperCase() : el)).join("");
          return (
            <div
              key={i}
              className='flex cursor-pointer items-center gap-2 px-5 py-2 hover:bg-gray-100 transition-colors duration- 150'
              onClick={() => {
                /** @todo bullet 상태 변경 로직 구현 */
                console.log(`Changing bullet ${targetId} to ${state}`);
                closePopup();
              }}
            >
              <BulletIcon id={targetId} bulletState={state} />
              <span className='text-sm font-medium text-black'>{capital}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
