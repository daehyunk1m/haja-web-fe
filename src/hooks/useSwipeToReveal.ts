import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

interface UseSwipeToRevealOptions {
  /** 완전히 열렸을 때 드러나는 너비(px). 기본 64 */
  revealWidth?: number;
  /** 열림이 확정되는 임계 이동량(px). 기본 revealWidth/2 */
  threshold?: number;
  /** 가로/세로 축을 확정하는 최소 이동량(px). 기본 8 */
  axisLockThreshold?: number;
}

interface UseSwipeToRevealResult {
  /** 현재 가로 이동량(px). -revealWidth ~ 0 */
  offset: number;
  /** 열림 여부 */
  isOpen: boolean;
  /** 가로 슬라이드가 진행 중인지 (transition 제어용) */
  isDragging: boolean;
  /** 슬라이드 대상 요소에 부여할 onPointerDown 핸들러 */
  onPointerDown: (e: ReactPointerEvent) => void;
  /** 즉시 닫기 */
  close: () => void;
}

type Axis = "h" | "v" | null;

/**
 * 가로 스와이프로 숨겨진 액션(예: 삭제 버튼)을 드러내는 제스처 훅.
 *
 * - 왼쪽으로 슬라이드하면 offset이 음수가 되며 액션이 드러난다.
 * - 첫 이동에서 가로/세로 축을 잠근다. 세로 축이면 무시하여 스크롤·드래그
 *   순서변경(@dnd-kit)에 양보한다.
 * - 떼는 순간 임계값을 기준으로 완전히 열거나(-revealWidth) 닫는다(0).
 *
 * jsdom 호환을 위해 setPointerCapture를 쓰지 않고 window 리스너로 추적한다.
 */
export function useSwipeToReveal(
  options: UseSwipeToRevealOptions = {}
): UseSwipeToRevealResult {
  const { revealWidth = 64, threshold = revealWidth / 2, axisLockThreshold = 8 } = options;

  const [offset, setOffset] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 제스처 진행 중의 가변 상태 (리렌더 불필요)
  const gesture = useRef<{ startX: number; startY: number; startOffset: number; axis: Axis }>({
    startX: 0,
    startY: 0,
    startOffset: 0,
    axis: null,
  });
  const offsetRef = useRef(0);
  const restOffset = useRef(0); // 정착 위치 (0 또는 -revealWidth)
  // 최신 옵션 값을 고정 정체성 핸들러에서 참조하기 위한 ref
  const config = useRef({ revealWidth, threshold, axisLockThreshold });
  config.current = { revealWidth, threshold, axisLockThreshold };

  const applyOffset = useCallback((value: number) => {
    offsetRef.current = value;
    setOffset(value);
  }, []);

  const onMove = useCallback(
    (e: PointerEvent) => {
      const g = gesture.current;
      const cfg = config.current;
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;

      if (g.axis === null) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < cfg.axisLockThreshold) return;
        g.axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        if (g.axis === "h") setIsDragging(true);
      }
      if (g.axis !== "h") return; // 세로 → 양보

      if (e.cancelable) e.preventDefault();
      const next = Math.max(-cfg.revealWidth, Math.min(0, g.startOffset + dx));
      applyOffset(next);
    },
    [applyOffset]
  );

  const onEnd = useCallback(() => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onEnd);
    window.removeEventListener("pointercancel", onEnd);

    const g = gesture.current;
    if (g.axis === "h") {
      const cfg = config.current;
      const opened = offsetRef.current <= -cfg.threshold;
      const next = opened ? -cfg.revealWidth : 0;
      restOffset.current = next;
      applyOffset(next);
      setIsOpen(opened);
    }
    g.axis = null;
    setIsDragging(false);
  }, [onMove, applyOffset]);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      gesture.current = {
        startX: e.clientX,
        startY: e.clientY,
        startOffset: restOffset.current,
        axis: null,
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
    },
    [onMove, onEnd]
  );

  const close = useCallback(() => {
    restOffset.current = 0;
    applyOffset(0);
    setIsOpen(false);
  }, [applyOffset]);

  // 언마운트 시 잔여 리스너 정리
  useEffect(
    () => () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    },
    [onMove, onEnd]
  );

  return { offset, isOpen, isDragging, onPointerDown, close };
}
