import { useEffect } from 'react';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

import { useLocalStreamAction } from '@/contexts/localStream/context';
import { useMediasoupAction, useMediasoupState } from '@/contexts/mediasoup/context';
import { useRemoteStreamAction } from '@/contexts/remoteStream/context';

import useRoom from './useRoom';

const useMediasoup = () => {
  const { socketRef, isConnected, isError } = useMediasoupState();

  const { createRoom } = useRoom();
  const {
    createRecvTransport,
    createSendTransport,
    createDevice,
    connectExistProducer,
    disconnect,
  } = useMediasoupAction();
  const { startCameraStream, startMicStream } = useLocalStreamAction();
  const { consume, filterRemoteStream, pauseRemoteStream, resumeRemoteStream } =
    useRemoteStreamAction();

  const initSocketEvent = () => {
    const socket = socketRef.current;

    if (!socket) return;

    // TODO: new peer 이벤트시 목록에 추가하고 stream은 없다고 표시

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

      // TODO: nickname 추가
      consume({ producerId, kind, peerId, paused, nickname: '변경' });
    });
  };

  const setLocalStream = async (device: client.Device) => {
    try {
      await createSendTransport(device);

      await Promise.all([startCameraStream(), startMicStream()]);
    } catch (_) {
      // TODO: Error
    }
  };

  const setRemoteStream = async (device: client.Device) => {
    await createRecvTransport(device);

    const remoteProducers = await connectExistProducer();

    if (!remoteProducers || remoteProducers.length === 0) return;

    remoteProducers.forEach(consume);
  };

  const initMediasoup = async () => {
    const socket = socketRef.current;

    if (!socket) return;
    const rtpCapabilities = await createRoom();

    if (!rtpCapabilities) return;

    const device = await createDevice(rtpCapabilities);

    await setLocalStream(device);
    await setRemoteStream(device);
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
