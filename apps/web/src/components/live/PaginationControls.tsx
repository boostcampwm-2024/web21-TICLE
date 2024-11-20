import ChevronLeftIc from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIc from '@/assets/icons/chevron-right.svg?react';

interface PaginationControlsProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

function PaginationControls({
  isFirstPage,
  isLastPage,
  onNextPage,
  onPrevPage,
}: PaginationControlsProps) {
  return (
    <>
      {!isFirstPage && (
        <button
          type="button"
          onClick={onPrevPage}
          className="absolute left-[-45px] flex h-full items-center"
        >
          <ChevronLeftIc />
        </button>
      )}
      {!isLastPage && (
        <button
          type="button"
          className="absolute right-[-45px] flex h-full items-center"
          onClick={onNextPage}
        >
          <ChevronRightIc />
        </button>
      )}
    </>
  );
}

export default PaginationControls;
