import { ReactNode } from '@tanstack/react-router';

import Portal from '../Portal';

interface DialogRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

function DialogRoot({ isOpen, onClose, children, className }: DialogRootProps) {
  if (!isOpen) return null;

  return (
    <Portal portalId="dialog">
      <div className="w-100 h-100 fixed flex items-center justify-center bg-overlay">
        <div className="relative w-full rounded-lg bg-white px-6 py-8 shadow-normal">
          {children}
        </div>
      </div>
    </Portal>
  );
}

export const Dialog = {
  Root: DialogRoot,
};
