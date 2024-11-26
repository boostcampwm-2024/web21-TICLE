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
    pauseStream,
    resumeStream,
    closeStream,
  } = useLocalStream();

  const state = { video, audio, screen };

  const actions = {
    startCameraStream,
    startMicStream,
    startScreenStream,
    pauseStream,
    resumeStream,
    closeStream,
  } as const;

  return (
    <LocalStreamStateContext.Provider value={state}>
      <LocalStreamActionContext.Provider value={actions}>
        {children}
      </LocalStreamActionContext.Provider>
    </LocalStreamStateContext.Provider>
  );
};
