import CameraOffIc from '@/assets/icons/camera-off.svg?react';
import CameraOnIc from '@/assets/icons/camera-on.svg?react';
import ExitIc from '@/assets/icons/exit.svg?react';
import MicOffIc from '@/assets/icons/mic-off.svg?react';
import MicOnIc from '@/assets/icons/mic-on.svg?react';
import ScreenOffIc from '@/assets/icons/screen-off.svg?react';
import ScreenOnIc from '@/assets/icons/screen-on.svg?react';
import ToggleButton from '@/components/live/ControlBar/ToggleButton';
import ExitDialog from '@/components/live/ExitDialog';
import useModal from '@/hooks/useModal';

interface ControlBarProps {
  isVideoPaused: boolean;
  isAudioMuted: boolean;
  isScreenSharing: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleScreenShare: () => void;
  handleExit: (isOwner: boolean) => void;
}

const ControlBar = (props: ControlBarProps) => {
  const {
    isVideoPaused,
    isAudioMuted,
    isScreenSharing,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    handleExit,
  } = props;

  const { isOpen, onClose, onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-start gap-x-[14px]">
        <ToggleButton
          ActiveIcon={MicOnIc}
          InactiveIcon={MicOffIc}
          onToggle={toggleAudio}
          isActivated={!isAudioMuted}
        />
        <ToggleButton
          ActiveIcon={CameraOnIc}
          InactiveIcon={CameraOffIc}
          onToggle={toggleVideo}
          isActivated={!isVideoPaused}
        />
        <ToggleButton
          ActiveIcon={ScreenOnIc}
          InactiveIcon={ScreenOffIc}
          onToggle={toggleScreenShare}
          isActivated={!isScreenSharing}
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
