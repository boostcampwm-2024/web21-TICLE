import { useParams } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

import { useMediasoupState } from '@/contexts/mediasoup/context';

const useRemoteStream = () => {
  const { ticleId } = useParams({ from: '/_authenticated/live/$ticleId' });
  const { socketRef, transportsRef, deviceRef } = useMediasoupState();

  const [videoStreams, setVideoStreams] = useState<client.RemoteStream[]>([]);
  const [audioStreams, setAudioStreams] = useState<client.RemoteStream[]>([]);

  const consume = async (data: client.CreateProducerRes) => {
    const { peerId, producerId, kind, paused, appData, nickname } = data;

    const socket = socketRef.current;
    const device = deviceRef.current;
    const { recvTransport } = transportsRef.current;

    if (!device || !recvTransport || !socket) return;

    const params = {
      roomId: ticleId,
      paused,
      kind,
      producerId,
      transportId: recvTransport.id,
      rtpCapabilities: device.rtpCapabilities,
    };

    return new Promise<void>((resolve) => {
      socket.emit(SOCKET_EVENTS.consume, params, async (params: client.CreateConsumerRes) => {
        const { consumerId, paused, ...rest } = params;

        const consumer = await recvTransport.consume({
          id: consumerId,
          appData,
          ...rest,
        });
        const stream = new MediaStream([consumer.track]);

        if (paused) {
          consumer.pause();
        }

        setRemoteStream({
          stream,
          consumer,
          socketId: peerId,
          kind: consumer.kind,
          paused: consumer.paused,
          nickname,
        });

        resolve();
      });
    });
  };

  const createConsumers = async () => {
    const socket = socketRef.current;
    const recvTransport = transportsRef.current.recvTransport;
    const device = deviceRef.current;

    if (!socket || !recvTransport || !device) {
      throw new Error('socket, recvTransport, device is not initialized');
    }

    const params = {
      roomId: ticleId,
      transportId: recvTransport.id,
      rtpCapabilities: device.rtpCapabilities,
    };

    return new Promise<client.RemoteStream[]>((resolve) => {
      socket.emit(
        SOCKET_EVENTS.createConsumers,
        params,
        async (result: client.CreateConsumerRes[]) => {
          if (!result || !result.length) return;

          const remoteStreams = await Promise.all(result.map(createRemoteStream));

          resolve(remoteStreams);
        }
      );
    });
  };

  const resumeAudioConsumers = (consumers: client.RemoteStream[]) => {
    const socket = socketRef.current;

    if (!socket) {
      throw new Error('socket is not initialized');
    }
    if (!consumers.length) return;

    const consumerIds = consumers
      .filter((consumer) => consumer.kind === 'audio')
      .map((consumer) => consumer.consumer.id);

    const params = { roomId: ticleId, consumerIds };

    socket.emit(SOCKET_EVENTS.resumeConsumers, params, (data: client.ResumeConsumersRes[]) => {
      data.forEach((item) => {
        if (item.paused) return;

        resumeRemoteStream(item.producerId);
      });
    });
  };

  const resumeVideoConsumers = (consumers: client.RemoteStream[]) => {
    const socket = socketRef.current;

    if (!socket) {
      throw new Error('socket is not initialized');
    }
    if (!consumers.length) return;

    const consumerIds = consumers
      .filter((consumer) => consumer.kind === 'video')
      .map((consumer) => consumer.consumer.id);

    const params = { roomId: ticleId, consumerIds };

    socket.emit(SOCKET_EVENTS.resumeConsumers, params, (data: client.ResumeConsumersRes[]) => {
      data.forEach(({ paused, consumerId }) => {
        if (paused) return;

        setVideoStreams(resumeStreamByConsumerId(consumerId));
      });
    });
  };

  const pauseVideoConsumers = (consumers: client.RemoteStream[]) => {
    const socket = socketRef.current;
    if (!socket) {
      throw new Error('socket is not initialized');
    }
    if (!consumers.length) return;

    const consumerIds = consumers
      .filter((consumer) => consumer.kind === 'video')
      .map((consumer) => consumer.consumer.id);

    const params = { roomId: ticleId, consumerIds };

    socket.emit(SOCKET_EVENTS.pauseConsumers, params, (data: client.ResumeConsumersRes[]) => {
      data.forEach(({ consumerId }) => setVideoStreams(pauseStreamByConsumerId(consumerId)));
    });
  };

  const pauseStreamByConsumerId = (consumerId: string) => {
    return (prevStreams: client.RemoteStream[]) => {
      const newStreams = prevStreams.map((stream) => {
        if (stream.consumer.id === consumerId) {
          stream.consumer.pause();
          stream.paused = true;
        }

        return stream;
      });

      return newStreams;
    };
  };

  const resumeStreamByConsumerId = (consumerId: string) => {
    return (prevStreams: client.RemoteStream[]) => {
      const newStreams = prevStreams.map((stream) => {
        if (stream.consumer.id === consumerId) {
          stream.consumer.resume();
          stream.paused = false;
        }

        return stream;
      });

      return newStreams;
    };
  };

  const createRemoteStream = async (data: client.CreateConsumerRes) => {
    const recvTransport = transportsRef.current.recvTransport;

    if (!recvTransport) {
      throw new Error('recvTransport is not initialized');
    }

    const { consumerId, peerId, nickname, ...rest } = data;

    const consumer = await recvTransport.consume({ id: consumerId, ...rest });

    const stream = new MediaStream([consumer.track]);

    if (data.paused) {
      consumer.pause();
    }

    const newStream = {
      stream,
      consumer,
      kind: consumer.kind,
      paused: consumer.paused,
      socketId: peerId,
      nickname,
    };

    setRemoteStream(newStream);

    return newStream;
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
      setVideoStreams(getNewStreams);
    }

    if (remoteStream.kind === 'audio') {
      setAudioStreams(getNewStreams);
    }
  };

  const filterRemoteStream = (cb: (remoteStream: client.RemoteStream) => boolean) => {
    const getNewStreams = (prevStreams: client.RemoteStream[]) => {
      const result = prevStreams.filter(cb);

      const deletedStreams = prevStreams.filter((stream) => !cb(stream));

      deletedStreams.forEach((stream) => stream.consumer.close());

      return result;
    };

    setVideoStreams(getNewStreams);
    setAudioStreams(getNewStreams);
  };

  const pauseRemoteStream = useCallback((producerId: string) => {
    const socket = socketRef.current;

    if (!socket) {
      throw new Error('socket is not initialized');
    }

    const getNewStreams = (prevStreams: client.RemoteStream[]) => {
      const newStreams = [...prevStreams];
      const stream = newStreams.find((stream) => stream.consumer.producerId === producerId);

      if (!stream) {
        return prevStreams;
      }

      socket.emit(SOCKET_EVENTS.pauseConsumers, {
        roomId: ticleId,
        consumerIds: [stream.consumer.id],
      });

      stream.consumer.pause();
      stream.paused = true;

      return newStreams;
    };

    setVideoStreams(getNewStreams);
    setAudioStreams(getNewStreams);
  }, []);

  const resumeRemoteStream = useCallback((producerId: string) => {
    const socket = socketRef.current;

    if (!socket) {
      throw new Error('socket is not initialized');
    }

    const getNewStreams = (prevStreams: client.RemoteStream[]) => {
      const newStreams = [...prevStreams];
      const stream = newStreams.find((stream) => stream.consumer.producerId === producerId);

      if (!stream) {
        return prevStreams;
      }

      socket.emit(SOCKET_EVENTS.resumeConsumers, {
        roomId: ticleId,
        consumerIds: [stream.consumer.id],
      });

      stream.consumer.resume();
      stream.paused = false;

      return newStreams;
    };

    setVideoStreams(getNewStreams);
    setAudioStreams(getNewStreams);
  }, []);

  return {
    videoStreams,
    audioStreams,
    consume,
    createConsumers,
    filterRemoteStream,
    pauseRemoteStream,
    resumeRemoteStream,
    resumeAudioConsumers,
    resumeVideoConsumers,
    pauseVideoConsumers,
  };
};

export default useRemoteStream;
