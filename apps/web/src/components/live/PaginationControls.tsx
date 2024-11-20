import ChevronLeftIc from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIc from '@/assets/icons/chevron-right.svg?react';

interface PaginationControlsProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  className?: string;
}

function PaginationControls({
  isFirstPage,
  isLastPage,
  onNextPage,
  onPrevPage,
  className,
}: PaginationControlsProps) {
  return (
    <div className={className}>
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
    </div>
  );
}

export default PaginationControls;
