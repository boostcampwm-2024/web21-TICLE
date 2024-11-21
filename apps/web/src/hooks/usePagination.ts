import { useMemo, useState, useEffect } from 'react';

interface PaginationParams<T> {
  totalItems: T[];
  itemsPerPage: number;
}

const usePagination = <T>({ totalItems, itemsPerPage }: PaginationParams<T>) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(totalItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIdx = currentPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return totalItems.slice(startIdx, endIdx);
  }, [totalItems, currentPage, itemsPerPage]);

  const onNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const onPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    onNextPage,
    onPrevPage,
    isFirstPage,
    isLastPage,
  };
};

export default usePagination;
