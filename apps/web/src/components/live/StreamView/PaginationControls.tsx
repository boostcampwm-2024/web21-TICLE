import { ReactNode } from 'react';

import ChevronLeftIc from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIc from '@/assets/icons/chevron-right.svg?react';
import cn from '@/utils/cn';

interface PaginationControlsProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;

  leftClassName?: string;
  rightClassName?: string;

  children: ReactNode;
}

function PaginationControls({
  isFirstPage,
  isLastPage,
  onNextPage,
  onPrevPage,
  leftClassName,
  rightClassName,
  children,
}: PaginationControlsProps) {
  return (
    <>
      {!isFirstPage && (
        <button
          type="button"
          onClick={onPrevPage}
          className={cn([
            'absolute left-0 top-1/2 flex -translate-y-1/2 transform items-center',
            leftClassName,
          ])}
        >
          <ChevronLeftIc />
        </button>
      )}
      {children}
      {!isLastPage && (
        <button
          type="button"
          className={cn([
            'absolute right-0 top-1/2 flex -translate-y-1/2 transform items-center',
            rightClassName,
          ])}
          onClick={onNextPage}
        >
          <ChevronRightIc />
        </button>
      )}
    </>
  );
}

export default PaginationControls;
