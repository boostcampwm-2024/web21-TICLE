import { useState } from 'react';

import useMediasoup from '@/hooks/mediasoup/useMediasoup';

import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

function MediaContainer() {
  const {
    remoteStreams,
    audioStream,
    videoStream,
    screenStream,
    screenProducerRef,
    startScreenStream,
    closeStream,
  } = useMediasoup();
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleScreenShare = () => {
    if (isScreenSharing && screenStream) {
      closeStream(screenStream, screenProducerRef);
    } else {
      startScreenStream();
    }
    setIsScreenSharing((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Local Streams */}
      <div className="col-span-2 mb-4">
        <div className="relative aspect-video">
          {videoStream && (
            <VideoPlayer
              stream={videoStream}
              muted
              className="h-full w-full rounded-lg object-cover"
            />
          )}
          {screenStream && isScreenSharing && (
            <div className="absolute right-0 top-0 aspect-video w-1/4">
              <VideoPlayer
                stream={screenStream}
                muted
                className="h-full w-full rounded-lg border-2 border-blue-500 object-cover"
              />
            </div>
          )}
          {audioStream && <AudioPlayer stream={audioStream} muted className="hidden" />}
          <div className="bg-black/50 absolute bottom-2 left-2 rounded px-2 py-1 text-sm text-white">
            나 (Local)
          </div>
          {/* Media Controls */}
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              onClick={toggleScreenShare}
              className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              {isScreenSharing ? '화면 공유 중지' : '화면 공유'}
            </button>
          </div>
        </div>
      </div>

      {/* Remote Streams */}
      {remoteStreams.map((remote, index) => (
        <div key={`${remote.socketId}-${index}`} className="relative aspect-video">
          {remote.kind === 'video' && (
            <VideoPlayer stream={remote.stream} className="h-full w-full rounded-lg object-cover" />
          )}
          {remote.kind === 'audio' && <AudioPlayer stream={remote.stream} className="hidden" />}
          <div className="bg-black/50 absolute bottom-2 left-2 rounded px-2 py-1 text-sm text-white">
            {remote.socketId}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MediaContainer;
