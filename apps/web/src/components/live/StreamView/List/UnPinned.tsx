import { client } from '@repo/mediasoup';

import PaginationControls from '@/components/live/StreamView/List/PaginationControls';
import VideoGrid from '@/components/live/StreamView/List/VideoGrid';
import useNetworkMonitor from '@/hooks/mediasoup/useNetworkMonitor';
import usePagination from '@/hooks/usePagination';

const ITEMS_PER_GRID = 9;

interface UnPinnedListProps {
  addPinnedVideo: (stream: client.RemoteStream) => void;
  getAudioMutedState: (stream: client.RemoteStream) => boolean;
}

function UnPinnedGrid({ addPinnedVideo, getAudioMutedState }: UnPinnedListProps) {
  const { paginatedItems: paginatedStreams, ...paginationControlsProps } = usePagination({
    itemsPerPage: ITEMS_PER_GRID,
  });

  useNetworkMonitor({ streams: paginatedStreams });

  return (
    <PaginationControls {...paginationControlsProps}>
      <VideoGrid
        videoStreamData={paginatedStreams}
        onVideoClick={addPinnedVideo}
        getAudioMutedState={getAudioMutedState}
      />
    </PaginationControls>
  );
}

export default UnPinnedGrid;
