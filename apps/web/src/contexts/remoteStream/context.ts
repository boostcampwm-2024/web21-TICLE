import { createContext, useContext } from 'react';
import { client } from '@repo/mediasoup';

interface RemoteStreamState {
  streams: client.RemoteStream[];
}

interface MediasoupActionContextProps {
  consume: (data: client.CreateProducerRes) => void;
  filterRemoteStream: (cb: (remoteStream: client.RemoteStream) => boolean) => void;
  pauseRemoteStream: (producerId: string) => void;
  resumeRemoteStream: (producerId: string) => void;
}

export const RemoteStreamStateContext = createContext<RemoteStreamState | undefined>(undefined);
export const RemoteStreamActionContext = createContext<MediasoupActionContextProps | undefined>(
  undefined
);

export const useRemoteStreamState = (): RemoteStreamState => {
  const state = useContext(RemoteStreamStateContext);

  if (!state) {
    throw new Error('useRemoteStreamState must be used within a RemoteStreamProvider');
  }

  return state;
};

export const useRemoteStreamAction = (): MediasoupActionContextProps => {
  const actions = useContext(RemoteStreamActionContext);

  if (!actions) {
    throw new Error('useRemoteStreamAction must be used within a RemoteStreamProvider');
  }

  return actions;
};
