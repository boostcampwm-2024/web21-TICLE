import { client } from '@repo/mediasoup';

import PaginationControls from '@/components/live/StreamView/List/PaginationControls';
import SubVideoGrid from '@/components/live/StreamView/List/SubVideoGrid';
import VideoPlayer from '@/components/live/StreamView/List/VideoPlayer';
import useNetworkMonitor from '@/hooks/mediasoup/useNetworkMonitor';
import usePagination from '@/hooks/usePagination';

const ITEMS_PER_SUB_GRID = 4;

interface PinnedListProps {
  pinnedVideoStreamData: client.RemoteStream;

  addPinnedVideo: (stream: client.RemoteStream) => void;
  removePinnedVideo: () => void;
  getAudioMutedState: (stream: client.RemoteStream) => boolean;
}

function PinnedGrid({
  pinnedVideoStreamData,
  removePinnedVideo,
  addPinnedVideo,
  getAudioMutedState,
}: PinnedListProps) {
  const { paginatedItems, ...paginationControlsProps } = usePagination({
    itemsPerPage: ITEMS_PER_SUB_GRID,
    pinnedStream: pinnedVideoStreamData,
  });

  useNetworkMonitor({ streams: [...paginatedItems, pinnedVideoStreamData] });

  return (
    <div className="relative flex h-full w-full flex-col gap-5">
      <div className="flex h-3/4 w-full justify-center self-center px-8">
        <div
          className="aspect-video h-full max-w-full overflow-hidden rounded-lg"
          onClick={removePinnedVideo}
        >
          <VideoPlayer
            stream={pinnedVideoStreamData.stream}
            paused={pinnedVideoStreamData.paused}
            mediaType={pinnedVideoStreamData.consumer?.appData?.mediaTypes}
            isMicOn={getAudioMutedState(pinnedVideoStreamData)}
            nickname={pinnedVideoStreamData.nickname}
          />
        </div>
      </div>
      <div className="relative flex h-1/4 items-center justify-between">
        <PaginationControls {...paginationControlsProps}>
          <SubVideoGrid
            pinnedVideoStreamData={pinnedVideoStreamData}
            videoStreamData={paginatedItems}
            onVideoClick={addPinnedVideo}
            getAudioMutedState={getAudioMutedState}
          />
        </PaginationControls>
      </div>
    </div>
  );
}

export default PinnedGrid;
