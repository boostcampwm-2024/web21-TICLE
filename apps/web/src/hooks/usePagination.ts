import { useEffect, useMemo, useRef, useState } from 'react';
import { client } from '@repo/mediasoup';

import { StreamData } from '@/components/live/StreamView';
import { useLocalStreamState } from '@/contexts/localStream/context';
import { useMediasoupState } from '@/contexts/mediasoup/context';
import { useRemoteStreamAction, useRemoteStreamState } from '@/contexts/remoteStream/context';
import useDebouncedCallback from '@/hooks/useDebounce';
import useAuthStore from '@/stores/useAuthStore';

interface PaginationParams {
  itemsPerPage: number;
  pinnedStream?: StreamData;
}

const usePagination = ({ itemsPerPage, pinnedStream }: PaginationParams) => {
  const { socketRef } = useMediasoupState();
  const { video, screen } = useLocalStreamState();
  const { videoStreams } = useRemoteStreamState();
  const nickname = useAuthStore.getState().authInfo?.nickname;

  const { resumeVideoConsumers, pauseVideoConsumers } = useRemoteStreamAction();

  const [currentPage, setCurrentPage] = useState(0);

  const prevGridItemsRef = useRef<StreamData[]>([]);

  const paginatedItems = useMemo(() => {
    const totalItems: StreamData[] = [];

    if (video.stream) {
      totalItems.push({
        socketId: 'local',
        kind: 'video',
        stream: video.stream,
        paused: video.paused,
        nickname: nickname ?? '',
      });
    }

    if (screen.stream) {
      totalItems.push({
        socketId: 'local',
        kind: 'video',
        stream: screen.stream,
        paused: false,
        nickname: nickname ?? '',
      });
    }

    totalItems.push(...videoStreams);

    const startIdx = currentPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    return totalItems.slice(startIdx, endIdx);
  }, [videoStreams, currentPage, itemsPerPage, video, screen, nickname]);

  const onNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const onPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const streamLength = videoStreams.length + (video.stream ? 1 : 0) + (screen.stream ? 1 : 0);
  const totalPages = Math.ceil(streamLength / itemsPerPage);

  const resumeGridStreams = useDebouncedCallback(() => {
    const gridItems = paginatedItems.filter(
      (item) => item.socketId !== 'local' && item.consumer
    ) as client.RemoteStream[];
    const isExistPinned = gridItems.some((item) => item.socketId === pinnedStream?.socketId);

    if (pinnedStream?.consumer && !isExistPinned) {
      gridItems.push(pinnedStream as client.RemoteStream);
    }

    resumeVideoConsumers(gridItems);
  }, 300);

  const pauseGridStreams = () => {
    const socket = socketRef.current;
    const prevGridItems = prevGridItemsRef.current;

    if (!socket || prevGridItems.length === 0) return;

    const target = prevGridItems
      .filter((item) => item.consumer && pinnedStream?.socketId !== item.socketId)
      .filter(
        (item) => !paginatedItems.some((paginatedItem) => paginatedItem.socketId === item.socketId)
      ) as client.RemoteStream[];

    pauseVideoConsumers(target);
  };

  useEffect(() => {
    if (paginatedItems.length !== 0) return;

    setCurrentPage((prev) => Math.max(0, prev - 1));
  }, [paginatedItems]);

  useEffect(() => {
    if (paginatedItems.length === 0) return;

    resumeGridStreams();
    pauseGridStreams();

    prevGridItemsRef.current = paginatedItems;
  }, [paginatedItems.length, currentPage]);

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
