import { ReactNode } from 'react';

import { LocalStreamActionContext, LocalStreamStateContext } from '@/contexts/localStream/context';
import useLocalStream from '@/hooks/mediasoup/useLocalStream';

interface StreamProviderProps {
  children: ReactNode;
}

export const LocalStreamProvider = ({ children }: StreamProviderProps) => {
  const {
    audio,
    screen,
    video,
    startCameraStream,
    startMicStream,
    startScreenStream,
    closeScreenStream,
    pauseStream,
    resumeStream,
    closeStream,
    closeLocalStream,

    videoDevices,
    audioDevices,
    audioOutputDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    selectedAudioOutputDeviceId,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
    setSelectedAudioOutputDeviceId,
  } = useLocalStream();

  const state = {
    video,
    audio,
    screen,
    videoDevices,
    audioDevices,
    audioOutputDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    selectedAudioOutputDeviceId,
  };

  const actions = {
    closeStream,
    pauseStream,
    resumeStream,
    startMicStream,
    startCameraStream,
    startScreenStream,
    closeScreenStream,
    closeLocalStream,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
    setSelectedAudioOutputDeviceId,
  } as const;

  return (
    <LocalStreamStateContext.Provider value={state}>
      <LocalStreamActionContext.Provider value={actions}>
        {children}
      </LocalStreamActionContext.Provider>
    </LocalStreamStateContext.Provider>
  );
};
