import { Dialog } from '@/components/common/Dialog';
import { useAiSummary } from '@/hooks/api/dashboard';

import Loading from '../common/Loading';

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
        {!data || data?.summary.length === 0 ? (
          <div className="flex h-[20rem] w-full flex-col items-center justify-center gap-10">
            <Loading color="primary" />
            <span className="whitespace-pre text-center text-title1 text-primary">
              AI 요약을 처리중이에요.
            </span>
          </div>
        ) : (
          <p className="whitespace-pre text-body1">{data?.summary[0]}</p>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default AiSummaryDialog;
