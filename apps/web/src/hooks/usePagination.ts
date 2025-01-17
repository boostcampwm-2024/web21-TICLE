import { useEffect, useMemo, useRef, useState } from 'react';
import { client } from '@repo/mediasoup';

import { useLocalStreamState } from '@/contexts/localStream/context';
import { useMediasoupState } from '@/contexts/mediasoup/context';
import { useRemoteStreamAction, useRemoteStreamState } from '@/contexts/remoteStream/context';
import useDebouncedCallback from '@/hooks/useDebounce';
import useAuthStore from '@/stores/useAuthStore';

interface PaginationParams {
  itemsPerPage: number;
  pinnedStream?: client.RemoteStream;
}

const usePagination = ({ itemsPerPage, pinnedStream }: PaginationParams) => {
  const { socketRef } = useMediasoupState();
  const { video, screen } = useLocalStreamState();

  const { videoStreams } = useRemoteStreamState();

  const nickname = useAuthStore.getState().authInfo?.nickname;

  const { resumeVideoConsumers, pauseVideoConsumers } = useRemoteStreamAction();

  const [currentPage, setCurrentPage] = useState(0);

  const prevPinStreamRef = useRef<client.RemoteStream>();
  const prevGridItemsRef = useRef<client.RemoteStream[]>([]);

  const paginatedItems = useMemo(() => {
    const totalItems: client.RemoteStream[] = [];

    totalItems.push({
      socketId: 'local',
      kind: 'video',
      stream: video.stream,
      paused: video.paused,
      nickname: nickname ?? '',
      mediaType: 'video',
    });

    if (screen.stream) {
      totalItems.push({
        socketId: 'local',
        kind: 'video',
        stream: screen.stream,
        paused: false,
        nickname: nickname ?? '',
        mediaType: 'screen',
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

  const streamLength = videoStreams.length + 1 + (screen.stream ? 1 : 0);
  const totalPages = Math.ceil(streamLength / itemsPerPage);

  const resumeGridStreams = useDebouncedCallback(() => {
    const prevGridItems = prevGridItemsRef.current;

    const target = paginatedItems
      .filter(
        (item) =>
          item.socketId !== 'local' && item.consumer?.closed === false && item.paused === true
      )
      .filter((item) => prevGridItems.some((prevItem) => prevItem.socketId === item.socketId));

    const isExistPinned = target.some(
      (item) => item.socketId === pinnedStream?.socketId && item.paused === true
    );

    if (pinnedStream?.consumer && !isExistPinned) {
      target.push(pinnedStream as client.RemoteStream);
    }

    resumeVideoConsumers(target);
  }, 300);

  const pauseGridStreams = () => {
    const socket = socketRef.current;
    const prevGridItems = prevGridItemsRef.current;

    if (!socket || prevGridItems.length === 0) return;

    const target = prevGridItems
      .filter(
        (item) =>
          item.consumer?.closed === false &&
          pinnedStream?.socketId !== item.socketId &&
          item.paused === false
      )
      .filter((item) => {
        return !paginatedItems.some((paginatedItem) => paginatedItem.socketId === item.socketId);
      }) as client.RemoteStream[];

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

  useEffect(() => {
    const prevPinnedStream = prevPinStreamRef.current;

    prevPinStreamRef.current = pinnedStream;

    if (!prevPinnedStream?.consumer) return;

    const isExistPinned = paginatedItems.some(
      (item) => item.socketId === prevPinnedStream.socketId
    );

    if (isExistPinned) return;

    pauseVideoConsumers([prevPinnedStream as client.RemoteStream]);
  }, [pinnedStream?.consumer?.id]);

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
