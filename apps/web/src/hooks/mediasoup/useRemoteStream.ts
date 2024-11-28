import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

import { useMediasoupState } from '@/contexts/mediasoup/context';

const useRemoteStream = () => {
  const { ticleId } = useParams({ from: '/_authenticated/live/$ticleId' });
  const { socketRef, transportsRef, deviceRef } = useMediasoupState();

  const [videoStreams, setVideoStreams] = useState<client.RemoteStream[]>([]);
  const [audioStreams, setAudioStreams] = useState<client.RemoteStream[]>([]);

  const consume = async ({
    producerId,
    peerId,
    kind,
    paused,
    nickname,
  }: client.CreateProducerRes) => {
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
        nickname,
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
    const getNewStreams = (prevStreams: client.RemoteStream[]) => {
      const isExist = prevStreams.some(
        (stream) => stream.consumer.producerId === remoteStream.consumer.producerId
      );

      if (isExist) {
        return prevStreams;
      }

      return [...prevStreams, remoteStream];
    };

    if (remoteStream.kind === 'video') {
      setVideoStreams((prevStreams) => getNewStreams(prevStreams));
    }

    if (remoteStream.kind === 'audio') {
      setAudioStreams((prevStreams) => getNewStreams(prevStreams));
    }
  };

  const filterRemoteStream = (cb: (remoteStream: client.RemoteStream) => boolean) => {
    setVideoStreams((prevStreams) => prevStreams.filter(cb));
    setAudioStreams((prevStreams) => prevStreams.filter(cb));
  };

  const pauseRemoteStream = (producerId: string) => {
    const getNewStreams = (prevStreams: client.RemoteStream[]) => {
      const newStreams = [...prevStreams];
      const stream = newStreams.find((stream) => stream.consumer.producerId === producerId);

      if (!stream) {
        return prevStreams;
      }

      stream.consumer.pause();
      stream.paused = true;

      return newStreams;
    };

    setVideoStreams((prevStreams) => getNewStreams(prevStreams));
    setAudioStreams((prevStreams) => getNewStreams(prevStreams));
  };

  const resumeRemoteStream = (producerId: string) => {
    const getNewStreams = (prevStreams: client.RemoteStream[]) => {
      const newStreams = [...prevStreams];
      const stream = newStreams.find((stream) => stream.consumer.producerId === producerId);

      if (!stream) {
        return prevStreams;
      }

      stream.consumer.resume();
      stream.paused = false;

      return newStreams;
    };

    setVideoStreams((prevStreams) => getNewStreams(prevStreams));
    setAudioStreams((prevStreams) => getNewStreams(prevStreams));
  };

  return {
    videoStreams,
    audioStreams,
    consume,
    filterRemoteStream,
    pauseRemoteStream,
    resumeRemoteStream,
  };
};

export default useRemoteStream;
