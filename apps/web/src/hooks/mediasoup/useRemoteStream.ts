import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

import { useMediasoupState } from '@/contexts/mediasoup/context';

const useRemoteStream = () => {
  const { ticleId } = useParams({ from: '/live/$ticleId' });
  const { socketRef, transportsRef, deviceRef } = useMediasoupState();

  const [streams, setStreams] = useState<client.RemoteStream[]>([]);

  const consume = async ({ producerId, peerId, kind, paused }: client.CreateProducerRes) => {
    const socket = socketRef.current;
    const device = deviceRef.current;
    const { recvTransport } = transportsRef.current;

    if (!device || !recvTransport || !socket) return;

    const params = {
      roomId: ticleId,
      producerId,
      transportId: recvTransport.id,
      rtpCapabilities: device.rtpCapabilities,
    };

    socket.emit(SOCKET_EVENTS.consume, params, async (params: client.CreateConsumerRes) => {
      const { consumerId, ...rest } = params;

      const consumer = await recvTransport.consume({ id: consumerId, ...rest });

      const stream = new MediaStream([consumer.track]);

      const newRemoteStream: client.RemoteStream = {
        consumer,
        socketId: peerId,
        kind,
        stream,
        paused,
      };

      setRemoteStream(newRemoteStream);

      if (!paused) {
        return;
      }

      consumer.pause();
    });
  };

  const setRemoteStream = (remoteStream: client.RemoteStream) => {
    setStreams((prevStreams) => {
      const stream = prevStreams.find(
        (s) => s.consumer.producerId === remoteStream.consumer.producerId
      );
      const newStreams = [...prevStreams];

      if (stream) {
        return newStreams;
      }

      newStreams.push(remoteStream);

      return newStreams;
    });
  };

  const filterRemoteStream = (cb: (remoteStream: client.RemoteStream) => boolean) => {
    setStreams((prevStreams) => prevStreams.filter(cb));
  };

  const pauseRemoteStream = (producerId: string) => {
    setStreams((prevStreams) => {
      const idx = prevStreams.findIndex((stream) => stream.consumer.producerId === producerId);
      const newStreams = [...prevStreams];

      const stream = prevStreams[idx];

      if (!stream || !stream.consumer) {
        return newStreams;
      }

      stream.consumer.pause();
      stream.paused = true;

      return newStreams;
    });
  };

  const resumeRemoteStream = (producerId: string) => {
    setStreams((prevStreams) => {
      const idx = prevStreams.findIndex((stream) => stream.consumer.producerId === producerId);
      const newStreams = [...prevStreams];

      const stream = prevStreams[idx];

      if (!stream || !stream.consumer) {
        return newStreams;
      }

      stream.consumer.resume();
      stream.paused = false;

      return newStreams;
    });
  };

  return {
    streams,
    consume,
    filterRemoteStream,
    pauseRemoteStream,
    resumeRemoteStream,
  };
};

export default useRemoteStream;
