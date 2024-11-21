import Button from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';

interface ExitDialogProps {
  isOwner: boolean;
  isOpen: boolean;
  onClose: () => void;
  handleExit: (isOwner: boolean) => void;
}

const ExitDialog = ({ isOpen, isOwner, onClose, handleExit }: ExitDialogProps) => {
  return (
    <Dialog.Root onClose={onClose} isOpen={isOpen}>
      {isOwner && (
        <>
          <Dialog.Title>티클을 종료하시겠어요?</Dialog.Title>
          <Dialog.Description>티클을 종료하면 다시 시작할 수 없어요.</Dialog.Description>
          <Dialog.Footer variant="vertical">
            <Button size="full" onClick={() => handleExit(true)}>
              모두에 대해 티클 종료
            </Button>
            <Button size="full" variant="secondary" onClick={onClose}>
              취소
            </Button>
          </Dialog.Footer>
        </>
      )}
      {!isOwner && (
        <>
          <Dialog.Title>티클을 나가시겠어요?</Dialog.Title>
          <Dialog.Description>티클을 나가도 재참여가 가능해요.</Dialog.Description>
          <Dialog.Footer variant="horizontal">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button className="flex-1" onClick={() => handleExit(false)}>
              나가기
            </Button>
          </Dialog.Footer>
        </>
      )}
    </Dialog.Root>
  );
};

export default ExitDialog;
