/* eslint-disable react-refresh/only-export-components */
import { ReactNode } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { MouseEvent, useRef } from 'react';

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

  const handleInnerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Portal portalId="dialog">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex h-full w-full items-center justify-center bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              className={cn('relative w-80 rounded-lg bg-white px-6 py-7 shadow-normal', className)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleInnerClick}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

interface DialogCloseProps {
  onClose?: () => void;
}

function DialogClose({ onClose }: DialogCloseProps) {
  return (
    <button onClick={onClose} className="absolute right-6 top-8 fill-main">
      <CloseIc aria-hidden />
    </button>
  );
}

const TITLE_ALIGN = {
  start: 'start',
  center: 'center',
  end: 'end',
} as const;

const titleVariants = cva('text-head3 text-main', {
  variants: {
    align: {
      [TITLE_ALIGN.start]: 'text-start',
      [TITLE_ALIGN.center]: 'text-center',
      [TITLE_ALIGN.end]: 'text-end',
    },
  },
  defaultVariants: {
    align: TITLE_ALIGN.start,
  },
});

interface DialogTitleProps {
  align?: 'start' | 'center' | 'end';
  children?: ReactNode;
}

function DialogTitle({ align = 'start', children }: DialogTitleProps) {
  return <h2 className={titleVariants({ align: align })}>{children}</h2>;
}

function DialogDescription({ children, className }: DialogProps) {
  return <p className={cn('mt-4 text-body1 text-main', className)}>{children}</p>;
}

function DialogContent({ children, className }: DialogProps) {
  return <main className={cn('mt-5', className)}>{children}</main>;
}

const FOOTER_VARIANT = {
  single: 'single',
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

const footerVariants = cva('mt-6', {
  variants: {
    variant: {
      [FOOTER_VARIANT.single]: 'block',
      [FOOTER_VARIANT.horizontal]: 'flex gap-2.5',
      [FOOTER_VARIANT.vertical]: 'flex flex-col gap-2.5',
    },
  },
  defaultVariants: {
    variant: FOOTER_VARIANT.single,
  },
});

interface DialogFooterProps extends DialogProps {
  variant?: keyof typeof FOOTER_VARIANT;
}

function DialogFooter({ children, className, variant = 'single' }: DialogFooterProps) {
  return (
    <footer className={cn(footerVariants({ variant: variant }), className)}>{children}</footer>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Close: DialogClose,
  Title: DialogTitle,
  Description: DialogDescription,
  Content: DialogContent,
  Footer: DialogFooter,
};
