import { PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";

const ModalContainer = ({ children, close }: PropsWithChildren<Partial<{ close: () => void }>>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!close) return;
      if (e.key === "Escape") close();
    };

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  return createPortal(
    <div
      className='fixed inset-0 z-50 w-full flex items-end justify-center bg-black/40'
      onClick={close}
    >
      <div
        className='relative w-full max-w-app flex justify-center bg-white animate-slide-up'
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalContainer;
