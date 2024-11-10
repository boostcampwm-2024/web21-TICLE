/* eslint-disable react-refresh/only-export-components */
import { ReactNode } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import { useRef } from 'react';

import CloseIc from '@/assets/icons/close.svg?react';
import useOutsideClick from '@/hooks/useOutsideClick';
import cn from '@/utils/cn';

import Portal from '../Portal';

interface DialogProps {
  className?: string;
  children?: ReactNode;
}
interface DialogRootProps extends DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function DialogRoot({ isOpen, onClose, children, className }: DialogRootProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dialogRef, onClose);

  if (!isOpen) return null;

  return (
    <Portal portalId="dialog">
      <div className="fixed top-0 flex h-full w-full items-center justify-center bg-overlay">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          className={cn('relative rounded-lg bg-white px-6 py-7 shadow-normal', className)}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

interface DialogCloseProps {
  onClose?: () => void;
}

function DialogClose({ onClose }: DialogCloseProps) {
  return (
    <button onClick={onClose} className="absolute right-6 top-8 fill-main">
      <CloseIc />
    </button>
  );
}

const ALIGN = {
  start: 'start',
  center: 'center',
  end: 'end',
} as const;

const dialogTitleVariants = cva('text-head3 text-main', {
  variants: {
    align: {
      [ALIGN.start]: 'text-start',
      [ALIGN.center]: 'text-center',
      [ALIGN.end]: 'text-end',
    },
  },
  defaultVariants: {
    align: ALIGN.start,
  },
});

interface DialogTitleProps {
  align?: 'start' | 'center' | 'end';
  children?: ReactNode;
}

function DialogTitle({ align = 'start', children }: DialogTitleProps) {
  return <h2 className={dialogTitleVariants({ align: align })}>{children}</h2>;
}

function DialogDescription({ children, className }: DialogProps) {
  return <p className={cn('mt-4 text-body1 text-main', className)}>{children}</p>;
}

export const Dialog = {
  Root: DialogRoot,
  Close: DialogClose,
  Title: DialogTitle,
  Description: DialogDescription,
};
