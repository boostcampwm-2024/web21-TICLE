import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import { ENV } from '@/constants/env';
import useConsumerStream from '@/hooks/mediasoup/useConsumerStream';
import useProducerStream from '@/hooks/mediasoup/useProducerStream';

import useDevice from './useDevice';
import useRoom from './useRoom';
import useSocket from './useSocket';
import useTransport from './useTransport';

const useMediasoup = () => {
  const { ticleId } = useParams({ from: '/live/$ticleId' });
  const socketRef = useSocket(ENV.WS_URL);
  const { createRoom } = useRoom(socketRef, ticleId);
  const { deviceRef, createDevice } = useDevice();

  const { sendTransportRef, recvTransportRef, createSendTransport, createRecvTransport } =
    useTransport(socketRef, ticleId);

  const {
    videoStream,
    audioStream,
    screenStream,
    connectExistProducer,
    startVideoStream,
    startAudioStream,
    startScreenStream,
    closeStream,
    pauseStream,
    resumeStream,
  } = useProducerStream({ socketRef, sendTransportRef });

  const { remoteStreams, consume, closeConsumer } = useConsumerStream({
    socketRef,
    deviceRef,
    recvTransportRef,
  });

  const initSocketEvent = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.on(SOCKET_EVENTS.newProducer, ({ peerId, producerId, kind }) => {
      if (socket.id === peerId) return;

      consume({ producerId, kind, peerId });
    });

    socket.on(SOCKET_EVENTS.consumerClosed, ({ consumerId }) => {
      closeConsumer(consumerId);
    });
  };

  const initMediasoup = async () => {
    const rtpCapabilities = await createRoom();

    if (!rtpCapabilities) return;

    const device = await createDevice(rtpCapabilities);

    createSendTransport(device);
    createRecvTransport(device);

    await Promise.all([startVideoStream(), startAudioStream()]);

    const remoteProducers = await connectExistProducer();

    if (!remoteProducers || remoteProducers.length === 0) return;

    remoteProducers.forEach(consume);
  };

  useEffect(() => {
    initSocketEvent();
    initMediasoup();
  }, []);

  return {
    remoteStreams,
    videoStream,
    audioStream,
    screenStream,
    startScreenStream,
    closeStream,
    pauseStream,
    resumeStream,
  };
};

export default useMediasoup;
