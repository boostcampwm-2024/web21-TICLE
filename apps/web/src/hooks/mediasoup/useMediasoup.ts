import { useEffect } from 'react';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

import { useDummyStreamAction } from '@/contexts/dummyStream/context';
import { useLocalStreamAction } from '@/contexts/localStream/context';
import { useMediasoupAction, useMediasoupState } from '@/contexts/mediasoup/context';
import { useRemoteStreamAction } from '@/contexts/remoteStream/context';

import useRoom from './useRoom';

const useMediasoup = () => {
  const { socketRef, isConnected, isError } = useMediasoupState();

  const { createRoom } = useRoom();
  const { createRecvTransport, createSendTransport, createDevice, disconnect } =
    useMediasoupAction();
  const {
    consume,
    createConsumers,
    filterRemoteStream,
    pauseRemoteStream,
    resumeRemoteStream,
    resumeAudioConsumers,
    clearRemoteStream,
  } = useRemoteStreamAction();
  const { startCameraStream, startMicStream, closeLocalStream } = useLocalStreamAction();

  const { addDummyStream, removeDummyStream } = useDummyStreamAction();

  const initSocketEvent = () => {
    const socket = socketRef.current;

    if (!socket) return;

    // TODO: new peer 이벤트시 목록에 추가하고 stream은 없다고 표시
    socket.on(SOCKET_EVENTS.newPeer, ({ peerId, nickname }) => {
      addDummyStream(peerId, nickname);
    });

    socket.on(SOCKET_EVENTS.peerLeft, ({ peerId }) => {
      removeDummyStream(peerId);
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

    socket.on(SOCKET_EVENTS.newProducer, (data) => {
      if (socket.id === data.peerId) return;

      removeDummyStream(data.peerId);
      consume(data);
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

    const consumers = await createConsumers();

    resumeAudioConsumers(consumers);
  };

  const initMediasoup = async () => {
    const socket = socketRef.current;

    if (!socket) return;

    const rtpCapabilities = await createRoom();

    if (!rtpCapabilities) return;

    const device = await createDevice(rtpCapabilities);

    setLocalStream(device);
    setRemoteStream(device);
  };

  useEffect(() => {
    if (!isConnected || isError) return;

    initSocketEvent();
    initMediasoup();
  }, [isConnected, isError]);

  useEffect(() => {
    const clearAll = () => {
      disconnect();
      clearRemoteStream();
      closeLocalStream();
    };

    window.addEventListener('beforeunload', clearAll);

    return () => {
      window.removeEventListener('beforeunload', clearAll);
      clearAll();
    };
  }, []);
};

export default useMediasoup;
