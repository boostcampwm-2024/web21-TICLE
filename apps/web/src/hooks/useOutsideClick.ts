import { ReactNode } from '@tanstack/react-router';
import { RefObject, useEffect } from 'react';

const useOutsideClick = (ref: RefObject<HTMLElement>, onClose: () => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as ReactNode)) {
        return;
      }
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, onClose]);
};

export default useOutsideClick;
