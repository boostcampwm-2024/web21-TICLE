import { SOCKET_EVENTS } from '@repo/mediasoup';

import CameraOffIc from '@/assets/icons/camera-off.svg?react';
import CameraOnIc from '@/assets/icons/camera-on.svg?react';
import ExitIc from '@/assets/icons/exit.svg?react';
import MicOffIc from '@/assets/icons/mic-off.svg?react';
import MicOnIc from '@/assets/icons/mic-on.svg?react';
import ScreenOffIc from '@/assets/icons/screen-off.svg?react';
import ScreenOnIc from '@/assets/icons/screen-on.svg?react';
import ToggleButton from '@/components/live/ControlBar/ToggleButton';
import ExitDialog from '@/components/live/ExitDialog';
import { useLocalStreamAction, useLocalStreamState } from '@/contexts/localStream/context';
import { useMediasoupAction, useMediasoupState } from '@/contexts/mediasoup/context';
import useModal from '@/hooks/useModal';

const ControlBar = () => {
  const { isOpen, onClose, onOpen } = useModal();

  const { socketRef } = useMediasoupState();
  const { video, screen, audio } = useLocalStreamState();

  const { disconnect } = useMediasoupAction();
  const { closeStream, pauseStream, resumeStream, startScreenStream } = useLocalStreamAction();

  const toggleScreenShare = async () => {
    const { paused, stream } = screen;

    try {
      if (stream && paused) {
        closeStream('screen');
      } else {
        startScreenStream();
      }
    } catch (_) {
      closeStream('screen');
    }
  };

  const toggleVideo = () => {
    const { paused, stream } = video;

    if (!stream) return;

    if (paused) {
      resumeStream('video');
    } else {
      pauseStream('video');
    }
  };

  const toggleAudio = () => {
    const { paused, stream } = audio;

    if (!stream) return;

    if (paused) {
      resumeStream('audio');
    } else {
      pauseStream('audio');
    }
  };

  const handleExit = (isOwner: boolean) => {
    if (isOwner) {
      socketRef.current?.emit(SOCKET_EVENTS.closeRoom);
    }

    disconnect();
  };

  return (
    <>
      <div className="flex items-center justify-start gap-x-[14px]">
        <ToggleButton
          ActiveIcon={MicOnIc}
          InactiveIcon={MicOffIc}
          onToggle={toggleAudio}
          isActivated={!audio.paused}
        />
        <ToggleButton
          ActiveIcon={CameraOnIc}
          InactiveIcon={CameraOffIc}
          onToggle={toggleVideo}
          isActivated={!video.paused}
        />
        <ToggleButton
          ActiveIcon={ScreenOnIc}
          InactiveIcon={ScreenOffIc}
          onToggle={toggleScreenShare}
          isActivated={!screen.paused}
        />
        <ToggleButton type="exit" ActiveIcon={ExitIc} InactiveIcon={ExitIc} onToggle={onOpen} />
      </div>
      {isOpen && (
        <ExitDialog isOpen={isOpen} isOwner={false} handleExit={handleExit} onClose={onClose} />
      )}
    </>
  );
};

export default ControlBar;
