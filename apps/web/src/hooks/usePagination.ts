import { useEffect, useMemo, useState } from 'react';

import { StreamData } from '@/components/live/StreamView';
import { useLocalStreamState } from '@/contexts/localStream/context';
import { useRemoteStreamState } from '@/contexts/remoteStream/context';

interface PaginationParams {
  itemsPerPage: number;
}

const usePagination = ({ itemsPerPage }: PaginationParams) => {
  const { video, screen } = useLocalStreamState();
  const { videoStreams } = useRemoteStreamState();

  const [currentPage, setCurrentPage] = useState(0);

  const paginatedItems = useMemo(() => {
    const totalItems: StreamData[] = [...videoStreams];

    if (screen.stream) {
      totalItems.unshift({
        socketId: 'local',
        kind: 'video',
        stream: screen.stream,
        paused: false,
      });
    }

    if (video.stream) {
      totalItems.unshift({
        socketId: 'local',
        kind: 'video',
        stream: video.stream,
        paused: video.paused,
      });
    }

    const startIdx = currentPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    return totalItems.slice(startIdx, endIdx);
  }, [videoStreams, currentPage, itemsPerPage, video, screen]);

  const onNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const onPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const streamLength = videoStreams.length + (video.stream ? 1 : 0) + (screen.stream ? 1 : 0);
  const totalPages = Math.ceil(streamLength / itemsPerPage);

  useEffect(() => {
    if (paginatedItems.length !== 0 || currentPage <= 0) return;

    setCurrentPage(currentPage - 1);
  }, [paginatedItems]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    onNextPage,
    onPrevPage,
    isFirstPage: currentPage === 0,
    isLastPage: totalPages - 1 - currentPage <= 0,
  };
};

export default usePagination;
