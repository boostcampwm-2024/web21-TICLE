import { useParams } from '@tanstack/react-router';
import { types } from 'mediasoup-client';
import { MutableRefObject, useState } from 'react';
import { Socket } from 'socket.io-client';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

interface UseProducerStreamParams {
  socketRef: MutableRefObject<Socket | null>;
  deviceRef: MutableRefObject<types.Device | null>;
  recvTransportRef: MutableRefObject<types.Transport | null>;
}

const useConsumerStream = ({ socketRef, deviceRef, recvTransportRef }: UseProducerStreamParams) => {
  const { ticleId } = useParams({ from: '/live/$ticleId' });

  const [consumers, setConsumers] = useState<types.Consumer[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<client.RemoteStream[]>([]);

  const consume = async ({ producerId, peerId, kind }: client.CreateProducerRes) => {
    const socket = socketRef.current;
    const device = deviceRef.current;
    const transport = recvTransportRef.current;

    if (!device || !transport || !socket) return;

    const params = {
      roomId: ticleId,
      producerId,
      transportId: transport.id,
      rtpCapabilities: device.rtpCapabilities,
    };

    socket.emit(SOCKET_EVENTS.consume, params, async (params: client.CreateConsumerRes) => {
      const { consumerId, ...rest } = params;

      const consumer = await transport.consume({ id: consumerId, ...rest });

      const stream = new MediaStream([consumer.track]);

      const newRemoteStream: client.RemoteStream = {
        socketId: peerId,
        kind,
        stream,
        pause: false,
      };

      setConsumers((prev) => [...prev, consumer]);
      setRemoteStreams((prev) => [...prev, newRemoteStream]);

      consumer.resume();
    });
  };

  const closeConsumer = (consumerId: string) => {
    const consumer = consumers.find((c) => c.id === consumerId);

    if (!consumer) return;

    consumer.close();

    setConsumers((prev) => prev.filter((c) => c.id !== consumerId));
  };

  return { consumers, remoteStreams, consume, closeConsumer };
};

export default useConsumerStream;
