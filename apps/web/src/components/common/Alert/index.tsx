import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

const alertVariants = cva('flex items-center justify-center', {
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
  return <div className={alertVariants({ type })}>{children}</div>;
}

export default Alert;
