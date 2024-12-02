import { ReactNode } from 'react';

import {
  RemoteStreamActionContext,
  RemoteStreamStateContext,
} from '@/contexts/remoteStream/context';
import useRemoteStream from '@/hooks/mediasoup/useRemoteStream';

interface RemoteStreamProviderProps {
  children: ReactNode;
}

export const RemoteStreamProvider = ({ children }: RemoteStreamProviderProps) => {
  const {
    audioStreams,
    videoStreams,
    consume,
    createConsumers,
    filterRemoteStream,
    pauseRemoteStream,
    resumeRemoteStream,
    clearRemoteStream,
    resumeAudioConsumers,
    resumeVideoConsumers,
    pauseVideoConsumers,
  } = useRemoteStream();

  const state = { audioStreams, videoStreams };

  const actions = {
    consume,
    filterRemoteStream,
    pauseRemoteStream,
    resumeRemoteStream,
    clearRemoteStream,
    createConsumers,
    resumeAudioConsumers,
    resumeVideoConsumers,
    pauseVideoConsumers,
  } as const;

  return (
    <RemoteStreamStateContext.Provider value={state}>
      <RemoteStreamActionContext.Provider value={actions}>
        {children}
      </RemoteStreamActionContext.Provider>
    </RemoteStreamStateContext.Provider>
  );
};
