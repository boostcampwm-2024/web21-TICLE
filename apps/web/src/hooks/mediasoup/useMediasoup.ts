import { useEffect } from 'react';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import { useLocalStreamAction } from '@/contexts/localStream/context';
import { useMediasoupAction, useMediasoupState } from '@/contexts/mediasoup/context';
import { useRemoteStreamAction } from '@/contexts/remoteStream/context';

import useRoom from './useRoom';
import useSocket from './useSocket';

const useMediasoup = () => {
  const { socketRef } = useMediasoupState();

  const { isConnected, isError } = useSocket();
  const { createRoom } = useRoom();
  const {
    createRecvTransport,
    createSendTransport,
    createDevice,
    connectExistProducer,
    disconnect,
  } = useMediasoupAction();
  const { startCameraStream, startMicStream, closeStream } = useLocalStreamAction();
  const { consume, filterRemoteStream, pauseRemoteStream, resumeRemoteStream } =
    useRemoteStreamAction();

  const initSocketEvent = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.on(SOCKET_EVENTS.peerLeft, ({ peerId }) => {
      filterRemoteStream((rs) => rs.socketId !== peerId);
    });

    socket.on(SOCKET_EVENTS.consumerClosed, ({ consumerId }) => {
      filterRemoteStream((rs) => rs.consumer.id !== consumerId);
    });

    socket.on(SOCKET_EVENTS.producerClosed, ({ producerId }) => {
      filterRemoteStream((rs) => rs.consumer.producerId !== producerId);
    });

    socket.on(SOCKET_EVENTS.producerPaused, ({ producerId }) => {
      pauseRemoteStream(producerId);
    });

    socket.on(SOCKET_EVENTS.producerResumed, ({ producerId }) => {
      resumeRemoteStream(producerId);
    });

    socket.on(SOCKET_EVENTS.newProducer, ({ peerId, producerId, kind, paused }) => {
      if (socket.id === peerId) return;
      consume({ producerId, kind, peerId, paused });
    });
  };

  const initMediasoup = async () => {
    const socket = socketRef.current;

    if (!socket) return;
    const rtpCapabilities = await createRoom();

    if (!rtpCapabilities) return;

    const device = await createDevice(rtpCapabilities);

    await Promise.all([createSendTransport(device), createRecvTransport(device)]);

    await Promise.all([startCameraStream(), startMicStream()]);

    const remoteProducers = await connectExistProducer();

    if (!remoteProducers || remoteProducers.length === 0) return;

    remoteProducers.forEach(consume);
  };

  useEffect(() => {
    if (!isConnected || isError) return;

    initSocketEvent();
    initMediasoup();
  }, [isConnected, isError]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);
};

export default useMediasoup;
