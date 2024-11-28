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
    resumeVideoStream,
    resumeAudioStream,
    resumeAudioConsumers,
  } = useRemoteStream();

  const state = { audioStreams, videoStreams };

  const actions = {
    consume,
    createConsumers,
    filterRemoteStream,
    pauseRemoteStream,
    resumeVideoStream,
    resumeAudioStream,
    resumeAudioConsumers,
  } as const;

  return (
    <RemoteStreamStateContext.Provider value={state}>
      <RemoteStreamActionContext.Provider value={actions}>
        {children}
      </RemoteStreamActionContext.Provider>
    </RemoteStreamStateContext.Provider>
  );
};
