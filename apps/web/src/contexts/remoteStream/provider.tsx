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
  const { streams, consume, filterRemoteStream, pauseRemoteStream, resumeRemoteStream } =
    useRemoteStream();

  const state = { streams };

  const actions = {
    consume,
    filterRemoteStream,
    pauseRemoteStream,
    resumeRemoteStream,
  } as const;

  return (
    <RemoteStreamStateContext.Provider value={state}>
      <RemoteStreamActionContext.Provider value={actions}>
        {children}
      </RemoteStreamActionContext.Provider>
    </RemoteStreamStateContext.Provider>
  );
};
