import { StreamData } from '@/components/live/StreamView';
import PaginationControls from '@/components/live/StreamView/List/PaginationControls';
import SubVideoGrid from '@/components/live/StreamView/List/SubVideoGrid';
import VideoPlayer from '@/components/live/StreamView/List/VideoPlayer';
import usePagination from '@/hooks/usePagination';

const ITEMS_PER_SUB_GRID = 4;

interface PinnedListProps {
  pinnedVideoStreamData: StreamData;

  addPinnedVideo: (stream: StreamData) => void;
  removePinnedVideo: () => void;
  getAudioMutedState: (stream: StreamData) => boolean;
}

function PinnedGrid({
  pinnedVideoStreamData,
  removePinnedVideo,
  addPinnedVideo,
  getAudioMutedState,
}: PinnedListProps) {
  const { paginatedItems: subPaginatedStreams, ...subPaginationControlsProps } = usePagination({
    itemsPerPage: ITEMS_PER_SUB_GRID,
    pinnedStream: pinnedVideoStreamData,
  });

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
        <PaginationControls {...subPaginationControlsProps}>
          <SubVideoGrid
            pinnedVideoStreamData={pinnedVideoStreamData}
            videoStreamData={subPaginatedStreams}
            onVideoClick={addPinnedVideo}
            getAudioMutedState={getAudioMutedState}
          />
        </PaginationControls>
      </div>
    </div>
  );
}

export default PinnedGrid;
