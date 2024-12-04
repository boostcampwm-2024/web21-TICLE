import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

import ExclamationIc from '@/assets/icons/exclamation.svg?react';

const alertVariants = cva('flex items-center justify-center gap-2 text-body3', {
  variants: {
    type: {
      info: 'text-black',
      error: 'text-red-500',
    },
  },
  defaultVariants: {
    type: 'info',
  },
});
interface AlertProps {
  children?: ReactNode;
  type?: 'info' | 'error';
}

function Alert({ children, type = 'info' }: AlertProps) {
  return (
    <div className={alertVariants({ type })}>
      {type === 'error' && <ExclamationIc className="fill-error" width={12} height={12} />}
      {children}
    </div>
  );
}

export default Alert;
