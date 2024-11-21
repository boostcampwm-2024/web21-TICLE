import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import { ENV } from '@/constants/env';
import useConsumerStream from '@/hooks/mediasoup/useConsumerStream';
import useProducerStream from '@/hooks/mediasoup/useProducerStream';

import useDevice from './useDevice';
import useRoom from './useRoom';
import useSocket from './useSocket';
import useTransport from './useTransport';

type UseProducerStream = ReturnType<typeof useProducerStream>;
type UseConsumerStream = ReturnType<typeof useConsumerStream>;

interface UseMediasoupReturn {
  socketRef: ReturnType<typeof useSocket>;
  audioProducerRef: UseProducerStream['audioProducerRef'];
  videoProducerRef: UseProducerStream['videoProducerRef'];
  screenProducerRef: UseProducerStream['screenProducerRef'];
  videoStream: UseProducerStream['videoStream'];
  audioStream: UseProducerStream['audioStream'];
  screenStream: UseProducerStream['screenStream'];
  remoteStreams: UseConsumerStream['remoteStreams'];
  startScreenStream: UseProducerStream['startScreenStream'];
  closeStream: UseProducerStream['closeStream'];
  pauseStream: UseProducerStream['pauseStream'];
  resumeStream: UseProducerStream['resumeStream'];
  disconnect: () => void;
}

const useMediasoup = (): UseMediasoupReturn => {
  const navigate = useNavigate({ from: '/live/$ticleId' });
  const { ticleId } = useParams({ from: '/live/$ticleId' });
  const socketRef = useSocket(ENV.WS_URL);
  const { createRoom } = useRoom(socketRef, ticleId);
  const { deviceRef, createDevice } = useDevice();

  const { sendTransportRef, recvTransportRef, createSendTransport, createRecvTransport } =
    useTransport(socketRef, ticleId);

  const {
    audioProducerRef,
    videoProducerRef,
    screenProducerRef,
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

  const { remoteStreams, consume, closeConsumer, setRemoteStreams } = useConsumerStream({
    socketRef,
    deviceRef,
    recvTransportRef,
  });

  const initSocketEvent = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.on(SOCKET_EVENTS.roomClosed, disconnect);

    socket.on(SOCKET_EVENTS.newProducer, ({ peerId, producerId, kind }) => {
      if (socket.id === peerId) return;

      consume({ producerId, kind, peerId });
    });

    socket.on(SOCKET_EVENTS.peerLeft, ({ peerId }) => {
      closeConsumer((rs) => rs.socketId !== peerId);
    });

    socket.on(SOCKET_EVENTS.consumerClosed, ({ consumerId }) => {
      closeConsumer((rs) => rs.consumer.id !== consumerId);
    });

    socket.on(SOCKET_EVENTS.producerClosed, ({ producerId }) => {
      closeConsumer((rs) => {
        return rs.consumer.producerId !== producerId;
      });
    });

    socket.on(SOCKET_EVENTS.producerPaused, ({ producerId }) => {
      const idx = remoteStreams.findIndex((rs) => rs.consumer.producerId === producerId);
      const newRemoteStreams = [...remoteStreams];
      const remoteStream = { ...newRemoteStreams[idx] };
      if (idx === -1 || !remoteStream) return;
      remoteStream.pause = remoteStream.consumer?.paused;
      setRemoteStreams(newRemoteStreams);
    });
    socket.on(SOCKET_EVENTS.producerResumed, ({ producerId }) => {
      const idx = remoteStreams.findIndex((rs) => rs.consumer.producerId === producerId);
      const newRemoteStreams = [...remoteStreams];
      const remoteStream = { ...newRemoteStreams[idx] };
      if (idx === -1 || !remoteStream) return;
      remoteStream.pause = remoteStream.consumer?.paused;
      setRemoteStreams(newRemoteStreams);
    });
  };

  const disconnect = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.disconnect();
    navigate({ to: '/', replace: true });
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
    socketRef,
    audioProducerRef,
    videoProducerRef,
    screenProducerRef,
    videoStream,
    audioStream,
    screenStream,
    remoteStreams,
    startScreenStream,
    closeStream,
    pauseStream,
    resumeStream,
    disconnect,
  } as const;
};

export default useMediasoup;
