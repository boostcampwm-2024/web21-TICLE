import { ReactNode } from 'react';
import { TicleStatus } from '@repo/types';

import TrashIc from '@/assets/icons/trash.svg?react';
import Button from '@/components/common/Button';

type ButtonState = 'owner' | 'applied' | 'closed' | 'default';

interface ButtonConfig {
  onClick: (() => void) | undefined;
  disabled: boolean;
  content: ReactNode;
}

type ButtonConfigMap = Record<ButtonState, ButtonConfig>;

interface CtaButtonProps {
  isOwner: boolean;
  alreadyApplied: boolean;
  ticleStatus: TicleStatus;
  onDelete: () => void;
  onApply: () => void;
}

function CtaButton({ isOwner, alreadyApplied, ticleStatus, onDelete, onApply }: CtaButtonProps) {
  const getButtonState = (): ButtonState => {
    if (isOwner) {
      return 'owner';
    }
    if (alreadyApplied) {
      return 'applied';
    }
    if (ticleStatus === 'closed') {
      return 'closed';
    }
    return 'default';
  };

  const buttonConfig: ButtonConfigMap = {
    owner: {
      onClick: onDelete,
      disabled: false,
      content: (
        <span className="flex items-center gap-1">
          티클 삭제하기
          <TrashIc className="fill-white" />
        </span>
      ),
    },
    applied: {
      onClick: undefined,
      disabled: true,
      content: '신청 완료',
    },
    closed: {
      onClick: undefined,
      disabled: true,
      content: '종료된 티클',
    },
    default: {
      onClick: onApply,
      disabled: false,
      content: '티클 신청하기',
    },
  };

  const buttonState = getButtonState();
  const config = buttonConfig[buttonState];

  return (
    <Button onClick={config.onClick} disabled={config.disabled}>
      {config.content}
    </Button>
  );
}

export default CtaButton;
