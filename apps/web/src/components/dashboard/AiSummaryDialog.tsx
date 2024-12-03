import { Dialog } from '@/components/common/Dialog';
import { useAiSummary } from '@/hooks/api/dashboard';

interface AiSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticleId: string;
}

function AiSummaryDialog({ isOpen, onClose, ticleId }: AiSummaryDialogProps) {
  const { data } = useAiSummary(ticleId);

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} className="h-[30rem] w-[35rem]">
      <Dialog.Title align="center">AI 음성 요약</Dialog.Title>
      <Dialog.Close onClose={onClose} />
      <Dialog.Content className="custom-scrollbar overflow-y-scroll">
        {data?.summary[0]}
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default AiSummaryDialog;
