import ModalContainer from "./ModalContainer";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  /** 표시할 확인 문구 */
  message: string;
  /** 확인(진행) 버튼 라벨 */
  confirmLabel?: string;
  /** 취소 버튼 라벨 */
  cancelLabel?: string;
  /** 확인 시 콜백 */
  onConfirm: () => void;
  /** 취소/배경 클릭/Esc 시 콜백 */
  onCancel: () => void;
}

/**
 * 파괴적 동작(예: 삭제) 전에 한 번 묻는 확인 모달.
 * 기존 ModalContainer(포털 오버레이 + 배경 클릭/Esc 닫기)를 재사용한다.
 */
export default function ConfirmDialog({
  message,
  confirmLabel = "삭제",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <ModalContainer close={onCancel}>
      <div
        role='alertdialog'
        aria-label={message}
        data-testid='confirm-dialog'
        className='w-full max-w-md flex flex-col gap-5 px-6 py-7'
      >
        <p className='text-[16px] font-medium text-black text-center'>{message}</p>
        <div className='flex flex-row gap-2 justify-center'>
          <Button
            type='button'
            variant='outline'
            data-testid='confirm-dialog-cancel'
            onClick={onCancel}
            className='flex-1'
          >
            {cancelLabel}
          </Button>
          <Button
            type='button'
            variant='destructive'
            data-testid='confirm-dialog-confirm'
            onClick={onConfirm}
            className='flex-1'
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}
