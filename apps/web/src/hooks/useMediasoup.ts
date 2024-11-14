import { useParams } from '@tanstack/react-router';
import { Producer, ProducerOptions } from 'mediasoup-client/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

import { ENV } from '@/constants/env';
import useSocket from '@/hooks/useSocket';

const PRODUCER_OPTIONS: ProducerOptions = {
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

interface MediaSoupArgs {
  stream: MediaStream | null;
}
interface UseMediaSoupResult {
  socket: Socket | null;
}

const useMediaSoup = ({ stream }: MediaSoupArgs): UseMediaSoupResult => {
  const { ticleId } = useParams({ strict: false });

  const socket = useSocket(`${ENV.WS_URL}:8080`);

  const [peers, setPeers] = useState<string[]>([]);

  const videoOptionsRef = useRef<ProducerOptions>({ ...PRODUCER_OPTIONS });
  const audioOptionsRef = useRef<ProducerOptions>({});

  const videoProducerRef = useRef<Producer | null>(null);
  const audioProducerRef = useRef<Producer | null>(null);

  const startVideo = (stream: MediaStream) => {
    const videoTrack = stream.getVideoTracks()[0];

    videoOptionsRef.current.track = videoTrack;
  };

  const startAudio = (stream: MediaStream) => {
    const audioTrack = stream.getAudioTracks()[0];

    audioOptionsRef.current.track = audioTrack;
  };

  // socket 에 대한 미디어 이벤트
  const initSocket = () => {
    const currentSocket = socket.current;

    if (!currentSocket) {
      return;
    }

    currentSocket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('Connected to server:', currentSocket.id);
    });

    currentSocket.on('new-peer', ({ peerId }) => {
      setPeers((prevPeers) => [...prevPeers, peerId]);
    });

    currentSocket.on('peer-left', ({ peerId }) => {
      setPeers((prevPeers) => prevPeers.filter((id) => id !== peerId));
    });
  };

  const createRoom = (ticleId: string) => {
    socket.current?.emit('createRoom', { ticleId });
  };

  const joinRoom = () => {};

  const createTransport = () => {};

  useEffect(() => {
    initSocket();
  }, []);

  return { socket: socket.current } as const;
};

export default useMediaSoup;
