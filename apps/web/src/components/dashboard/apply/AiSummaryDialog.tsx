import { Dialog } from '@/components/common/Dialog';

interface AiSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function AiSummaryDialog({ isOpen, onClose }: AiSummaryDialogProps) {
  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} className="h-[30rem] w-[35rem]">
      <Dialog.Title align="center">신청자 목록</Dialog.Title>
      <Dialog.Close onClose={onClose} />
      <Dialog.Content className="custom-scrollbar overflow-y-scroll">hi</Dialog.Content>
    </Dialog.Root>
  );
}

export default AiSummaryDialog;
