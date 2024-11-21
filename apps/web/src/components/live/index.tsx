import { useState } from 'react';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import ControlBar from '@/components/live/ControlBar';
import useMediasoup from '@/hooks/mediasoup/useMediasoup';

import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

function MediaContainer() {
  const {
    socketRef,

    remoteStreams,
    audioStream,
    videoStream,
    screenStream,

    audioProducerRef,
    videoProducerRef,
    screenProducerRef,
    startScreenStream,
    closeStream,

    pauseStream,
    resumeStream,

    disconnect,
  } = useMediasoup();

  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing && screenStream) {
        closeStream(screenStream, screenProducerRef);
      } else {
        await startScreenStream();
      }

      setIsScreenSharing((prev) => !prev);
    } catch (_) {
      setIsScreenSharing(false);
    }
  };

  const toggleVideo = () => {
    if (!videoStream) return;

    if (isVideoPaused) {
      resumeStream(videoStream, videoProducerRef);
    } else {
      pauseStream(videoStream, videoProducerRef);
    }
    setIsVideoPaused((prev) => !prev);
  };

  const toggleAudio = () => {
    if (!audioStream) return;

    if (isAudioMuted) {
      resumeStream(audioStream, audioProducerRef);
    } else {
      pauseStream(audioStream, audioProducerRef);
    }
    setIsAudioMuted((prev) => !prev);
  };

  const handleExit = (isOwner: boolean) => {
    if (isOwner) {
      socketRef.current?.emit(SOCKET_EVENTS.closeRoom);
    }

    disconnect();
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Local Streams */}
      <div className="col-span-2 mb-4">
        <div className="relative aspect-video">
          {videoStream && (
            <VideoPlayer
              stream={videoStream}
              muted={false}
              className="aspect-video h-full w-full rounded-lg"
            />
          )}
          {screenStream && isScreenSharing && (
            <div className="absolute right-0 top-0 aspect-video w-1/4">
              <VideoPlayer
                stream={screenStream}
                muted
                className="-full w-full rounded-lg border-2 border-blue-500 object-cover"
              />
            </div>
          )}
          {audioStream && <AudioPlayer stream={audioStream} muted className="" />}
          <div className="bg-black/50 absolute bottom-2 left-2 rounded px-2 py-1 text-sm text-white">
            나 (Local)
          </div>
        </div>
        <ControlBar
          isVideoPaused={isVideoPaused}
          isAudioMuted={isAudioMuted}
          isScreenSharing={isScreenSharing}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          toggleScreenShare={toggleScreenShare}
          handleExit={handleExit}
        />
      </div>
      {/* Remote Streams */}
      {remoteStreams.map((remote, index) => (
        <div key={`${remote.socketId}-${index}`} className="relative aspect-video">
          {remote.kind === 'video' && (
            <VideoPlayer
              stream={remote.stream}
              className="aspect-video h-full w-full rounded-lg object-cover"
            />
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
