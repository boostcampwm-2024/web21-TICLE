import { useParams } from '@tanstack/react-router';
import { types } from 'mediasoup-client';
import { MutableRefObject, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { client, MediaTypes, SOCKET_EVENTS } from '@repo/mediasoup';

const VIDEO_PRODUCER_OPTIONS = client.VIDEO_PRODUCER_OPTIONS;
const AUDIO_PRODUCER_OPTIONS = client.AUDIO_PRODUCER_OPTIONS;

interface Transports {
  sendTransport: types.Transport | null;
  recvTransport: types.Transport | null;
}

interface UseProducerProps {
  socketRef: MutableRefObject<Socket | null>;
  transportsRef: MutableRefObject<Transports>;
}

const useProducer = ({ socketRef, transportsRef }: UseProducerProps) => {
  const { ticleId: roomId } = useParams({ from: '/live/$ticleId' });

  const producersRef = useRef<{ [key in MediaTypes]: types.Producer | null }>({
    video: null,
    audio: null,
    screen: null,
  });

  const closeProducer = (type: MediaTypes) => {
    const socket = socketRef.current;
    const producer = producersRef.current[type];

    if (!socket || !producer) return;

    socket.emit(SOCKET_EVENTS.closeProducer, { producerId: producer.id, roomId });
    producer.close();
    producersRef.current[type] = null;
  };

  const pauseProducer = (type: MediaTypes) => {
    const socket = socketRef.current;
    const producer = producersRef.current[type];

    if (!socket || !producer) return;

    producer.pause();

    socket.emit(SOCKET_EVENTS.producerStatusChange, {
      producerId: producer.id,
      status: 'pause',
      roomId,
    });
  };

  const resumeProducer = (type: MediaTypes) => {
    const socket = socketRef.current;
    const producer = producersRef.current[type];

    if (!socket || !producer) return;

    producer.resume();

    socket.emit(SOCKET_EVENTS.producerStatusChange, {
      producerId: producer.id,
      status: 'resume',
      roomId,
    });
  };

  const createProducer = async (type: MediaTypes, track: MediaStreamTrack) => {
    const transport = transportsRef.current.sendTransport;
    if (!transport || !track) {
      return null;
    }

    const kind = track.kind as types.MediaKind;

    const producerOptions = kind === 'video' ? VIDEO_PRODUCER_OPTIONS : AUDIO_PRODUCER_OPTIONS;

    const producer = await transport.produce({
      track,
      appData: { mediaTypes: type },
      ...producerOptions,
    });

    producersRef.current[type] = producer;

    if (type !== 'screen') {
      pauseProducer(type);
    }

    return producer;
  };

  const connectExistProducer = async () => {
    const socket = socketRef.current;

    if (!socket) return [];

    const params = { roomId };

    return new Promise<client.CreateProducerRes[]>((resolve) => {
      socket.emit(SOCKET_EVENTS.getProducers, params, (result: client.CreateProducerRes[]) => {
        const producers = producersRef.current;

        const producerIds = Object.values(producers)
          .map((producer) => producer?.id)
          .filter(Boolean);

        const filteredResult = result.filter(({ producerId }) => !producerIds.includes(producerId));

        resolve(filteredResult);
      });
    });
  };

  return {
    producersRef,
    createProducer,
    closeProducer,
    pauseProducer,
    resumeProducer,
    connectExistProducer,
  };
};

export default useProducer;
