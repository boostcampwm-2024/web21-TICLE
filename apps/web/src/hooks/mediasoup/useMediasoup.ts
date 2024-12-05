import { useEffect } from 'react';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

import { useLocalStreamAction } from '@/contexts/localStream/context';
import { useMediasoupAction, useMediasoupState } from '@/contexts/mediasoup/context';
import { useRemoteStreamAction } from '@/contexts/remoteStream/context';

import useRoom from './useRoom';

const useMediasoup = () => {
  const { socketRef, isConnected, isError } = useMediasoupState();

  const { createRoom } = useRoom();
  const { createRecvTransport, createSendTransport, createDevice, clearMediasoup } =
    useMediasoupAction();
  const {
    consume,
    createConsumers,
    filterRemoteStream,
    pauseRemoteStream,
    resumeRemoteStream,
    resumeAudioConsumers,
    clearRemoteStream,
    addInitialRemoteStream,
  } = useRemoteStreamAction();
  const { startCameraStream, startMicStream, clearLocalStream } = useLocalStreamAction();
  const initSocketEvent = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.on(SOCKET_EVENTS.newPeer, ({ peerId, nickname }) => {
      addInitialRemoteStream({ socketId: peerId, nickname });
    });

    socket.on(SOCKET_EVENTS.peerLeft, ({ peerId }) => {
      filterRemoteStream((rs) => rs.socketId !== peerId);
    });

    socket.on(SOCKET_EVENTS.consumerClosed, ({ consumerId }) => {
      filterRemoteStream((rs) => rs.consumer?.id !== consumerId);
    });

    socket.on(SOCKET_EVENTS.producerClosed, ({ producerId }) => {
      filterRemoteStream((rs) => rs.consumer?.producerId !== producerId);
    });

    socket.on(SOCKET_EVENTS.producerPaused, ({ producerId }) => {
      pauseRemoteStream(producerId);
    });

    socket.on(SOCKET_EVENTS.producerResumed, ({ producerId }) => {
      resumeRemoteStream(producerId);
    });

    socket.on(SOCKET_EVENTS.newProducer, (data) => {
      if (socket.id === data.peerId) return;
      consume(data);
    });
  };

  const setLocalStream = async (device: client.Device) => {
    await createSendTransport(device);

    Promise.all([startCameraStream(), startMicStream()]);
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
      clearRemoteStream();
      clearLocalStream();
      clearMediasoup();
    };

    window.addEventListener('unload', clearAll);

    return () => {
      clearAll();
      window.removeEventListener('unload', clearAll);
    };
  }, []);
};

export default useMediasoup;
