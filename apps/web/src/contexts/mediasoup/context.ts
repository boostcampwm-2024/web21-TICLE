import { types } from 'mediasoup-client';
import { createContext, MutableRefObject, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { client, MediaTypes } from '@repo/mediasoup';

export interface MediasoupState {
  isConnected: boolean;
  isError: Error | null;
  socketRef: MutableRefObject<Socket | null>;
  deviceRef: MutableRefObject<client.Device | null>;
  transportsRef: MutableRefObject<{
    sendTransport: types.Transport | null;
    recvTransport: types.Transport | null;
  }>;
  producersRef: MutableRefObject<{
    audio: types.Producer | null;
    video: types.Producer | null;
    screen: types.Producer | null;
  }>;
}

interface MediasoupActionContextProps {
  disconnect: () => void;
  createDevice: (rtpCapabilities: client.RtpCapabilities) => Promise<client.Device>;
  createSendTransport: (device: client.Device) => Promise<void>;
  createRecvTransport: (device: client.Device) => Promise<void>;
  createProducer: (type: MediaTypes, track: MediaStreamTrack) => void;
  closeProducer: (type: MediaTypes) => void;
  pauseProducer: (type: MediaTypes) => void;
  resumeProducer: (type: MediaTypes) => void;
  connectExistProducer: () => Promise<client.CreateProducerRes[]>;
}

export const MediasoupStateContext = createContext<MediasoupState | undefined>(undefined);
export const MediasoupActionContext = createContext<MediasoupActionContextProps | undefined>(
  undefined
);

export const useMediasoupState = (): MediasoupState => {
  const state = useContext(MediasoupStateContext);
  if (!state) {
    throw new Error('useMediasoupContext must be used within a MediasoupProvider');
  }

  return state;
};

export const useMediasoupAction = (): MediasoupActionContextProps => {
  const actions = useContext(MediasoupActionContext);

  if (!actions) {
    throw new Error('useMediasoupAction must be used within a MediasoupProvider');
  }

  return actions;
};
