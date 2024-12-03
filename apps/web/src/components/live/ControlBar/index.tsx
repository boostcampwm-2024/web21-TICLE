import { SOCKET_EVENTS } from '@repo/mediasoup';

import CameraOffIc from '@/assets/icons/camera-off.svg?react';
import CameraOnIc from '@/assets/icons/camera-on.svg?react';
import ExitIc from '@/assets/icons/exit.svg?react';
import MicOffIc from '@/assets/icons/mic-off.svg?react';
import MicOnIc from '@/assets/icons/mic-on.svg?react';
import ScreenOffIc from '@/assets/icons/screen-off.svg?react';
import ScreenOnIc from '@/assets/icons/screen-on.svg?react';
import SettingIc from '@/assets/icons/setting.svg?react';
import ToggleButton from '@/components/live/ControlBar/ToggleButton';
import ExitDialog from '@/components/live/ExitDialog';
import SettingDialog from '@/components/live/SettingDialog';
import { useLocalStreamAction, useLocalStreamState } from '@/contexts/localStream/context';
import { useMediasoupAction, useMediasoupState } from '@/contexts/mediasoup/context';
import useModal from '@/hooks/useModal';

interface ControlBarProps {
  isOwner: boolean;
  onTicleEnd: () => void;
}

const ControlBar = ({ isOwner, onTicleEnd }: ControlBarProps) => {
  const {
    isOpen: isOpenExitModal,
    onClose: onCloseExitModal,
    onOpen: onOpenExitModal,
  } = useModal();

  const {
    isOpen: isOpenSettingModal,
    onClose: onCloseSettingModal,
    onOpen: onOpenSettingModal,
  } = useModal();

  const { socketRef } = useMediasoupState();
  const { video, screen, audio } = useLocalStreamState();

  const { disconnect } = useMediasoupAction();
  const {
    closeStream,
    pauseStream,
    resumeStream,
    startScreenStream,
    startCameraStream,
    startMicStream,
    closeScreenStream,
  } = useLocalStreamAction();

  const toggleScreenShare = async () => {
    const { paused, stream } = screen;

    try {
      if (stream && !paused) {
        closeScreenStream();
      } else {
        startScreenStream();
      }
    } catch (_) {
      closeStream('screen');
    }
  };

  const toggleVideo = () => {
    const { paused, stream } = video;

    if (!stream) {
      startCameraStream();
      return;
    }

    if (paused) {
      resumeStream('video');
    } else {
      pauseStream('video');
    }
  };

  const toggleAudio = () => {
    const { paused, stream } = audio;

    if (!stream) {
      startMicStream();
      return;
    }

    if (paused) {
      resumeStream('audio');
    } else {
      pauseStream('audio');
    }
  };

  const handleExit = () => {
    if (isOwner) {
      socketRef.current?.emit(SOCKET_EVENTS.closeRoom);
      onTicleEnd();
    }

    disconnect();
  };

  return (
    <>
      <div className="flex items-center justify-start gap-x-[14px]">
        <ToggleButton
          isActivated
          ActiveIcon={SettingIc}
          InactiveIcon={SettingIc}
          onToggle={onOpenSettingModal}
        />
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
          isActivated={screen.paused}
        />
        <ToggleButton
          type="exit"
          ActiveIcon={ExitIc}
          InactiveIcon={ExitIc}
          onToggle={onOpenExitModal}
        />
      </div>
      {isOpenExitModal && (
        <ExitDialog
          isOpen={isOpenExitModal}
          isOwner={isOwner}
          handleExit={handleExit}
          onClose={onCloseExitModal}
        />
      )}
      {isOpenSettingModal && (
        <SettingDialog isOpen={isOpenSettingModal} onClose={onCloseSettingModal} />
      )}
    </>
  );
};

export default ControlBar;
