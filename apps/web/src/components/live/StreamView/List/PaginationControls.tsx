import { ReactNode } from 'react';

import ChevronLeftIc from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIc from '@/assets/icons/chevron-right.svg?react';

interface PaginationControlsProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  children: ReactNode;
}

function PaginationControls({
  isFirstPage,
  isLastPage,
  onNextPage,
  onPrevPage,
  children,
}: PaginationControlsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPrevPage}
        style={{ visibility: isFirstPage ? 'hidden' : 'visible' }}
        className="m-4 flex items-center justify-center"
      >
        <ChevronLeftIc />
      </button>
      {children}
      <button
        type="button"
        style={{ visibility: isLastPage ? 'hidden' : 'visible' }}
        className="m-4 flex items-center justify-center"
        onClick={onNextPage}
      >
        <ChevronRightIc />
      </button>
    </>
  );
}

export default PaginationControls;
