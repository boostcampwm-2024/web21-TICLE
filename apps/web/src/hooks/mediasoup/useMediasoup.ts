import { useParams } from '@tanstack/react-router';
import { types } from 'mediasoup-client';
import { useEffect, useState, useRef } from 'react';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

import { ENV } from '@/constants/env';

import useDevice from './useDevice';
import useRoom from './useRoom';
import useSocket from './useSocket';
import useTransport from './useTransport';

const useMediasoup = () => {
  const { ticleId } = useParams({ from: '/live/$ticleId' });
  const socketRef = useSocket(ENV.WS_URL);

  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const videoProducerRef = useRef<types.Producer | null>(null);
  const audioProducerRef = useRef<types.Producer | null>(null);
  const screenProducerRef = useRef<types.Producer | null>(null);

  const { createRoom } = useRoom(socketRef.current, ticleId);
  const { deviceRef, createDevice } = useDevice();

  const { sendTransportRef, recvTransportRef, createSendTransport, createRecvTransport } =
    useTransport(socketRef.current, ticleId);

  const [peers, setPeers] = useState<string[]>([]);
  const [consumers, setConsumers] = useState<any[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<client.RemoteStream[]>([]);

  const initSocketEvent = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.on(SOCKET_EVENTS.newPeer, ({ peerId }: { peerId: string }) => {
      if (peers.includes(peerId)) return;

      if (socket.id === peerId) return;

      setPeers((prevPeers) => [...prevPeers, peerId]);
    });

    socket.on(SOCKET_EVENTS.newProducer, ({ peerId, producerId, kind }) => {
      if (socket.id === peerId) return;

      consume({ producerId, kind, peerId });
    });

    socket.on(SOCKET_EVENTS.peerLeft, ({ peerId }) => {
      setPeers((prevPeers) => prevPeers.filter((id) => id !== peerId));

      // TODO: 해당 peer의 consume 제거
    });

    socket.on(SOCKET_EVENTS.consumerClosed, ({ consumerId }) => {
      const consumer = consumers.find((c) => c.id === consumerId);

      if (!consumer) return;

      consumer.close();
      setConsumers((prev) => prev.filter((c) => c.id !== consumerId));
    });

    socket.on(SOCKET_EVENTS.consumerPaused, ({ consumerId, kind }) => {
      const consumer = consumers.find((c) => c.id === consumerId);

      if (consumer?.kind !== kind) return;

      consumer.paused();
    });

    socket.on(SOCKET_EVENTS.producerPaused, ({ consumerId }) => {
      // TODO: 특정 컨슈머를 찾아서 pause: true로 변경
      // 해당 state가 업데이트됨에 따라 UI 상태 반영
    });
  };

  const createProducer = async (track?: MediaStreamTrack) => {
    const transport = sendTransportRef.current;

    if (!transport || !track) {
      return null;
    }

    const producer = await transport.produce({ ...client.PRODUCER_OPTIONS, track });

    return producer;
  };

  const createVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const track = stream.getVideoTracks()[0];

    videoStreamRef.current = stream;
    videoProducerRef.current = await createProducer(track);
  };

  const createAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const track = stream.getAudioTracks()[0];

    audioStreamRef.current = stream;
    audioProducerRef.current = await createProducer(track);
  };

  const createScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];

    screenStreamRef.current = stream;
    screenProducerRef.current = await createProducer(track);
  };

  const consume = async ({ producerId, peerId, kind }: client.CreateProducerRes) => {
    const socket = socketRef.current;
    const device = deviceRef.current;
    const transport = recvTransportRef.current;

    if (!device || !transport || !socket) return;

    const consumeEventParams = {
      roomId: ticleId,
      producerId,
      transportId: transport.id,
      rtpCapabilities: device.rtpCapabilities,
    };

    socket.emit(
      SOCKET_EVENTS.consume,
      consumeEventParams,
      async (params: client.CreateConsumerRes) => {
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
      }
    );
  };

  const connectExistProducer = () => {
    const socket = socketRef.current;

    const videoProducer = videoProducerRef.current;
    const audioProducer = audioProducerRef.current;
    const screenProducer = screenProducerRef.current;

    if (!socket || !videoProducer || !audioProducer || !screenProducer) return;

    // TODO: socket에 포함되지 않은 producer 목록 요청
    socket.emit(
      SOCKET_EVENTS.getProducer,
      { roomId: ticleId },
      (result: client.CreateProducerRes[]) => {
        result
          .filter(
            (p) =>
              p.producerId !== videoProducer.id ||
              p.producerId !== audioProducer.id ||
              p.producerId !== screenProducer.id
          )
          .forEach((p) => consume(p));
      }
    );
  };

  const initMediasoup = async () => {
    const rtpCapabilities = await createRoom();

    if (!rtpCapabilities) return;

    const device = await createDevice(rtpCapabilities);

    createSendTransport(device);
    createRecvTransport(device);

    await Promise.all([createVideo(), createAudio(), createScreen()]);

    connectExistProducer();
  };

  useEffect(() => {
    initSocketEvent();
    initMediasoup();
  }, []);

  return { remoteStreams };
};

export default useMediasoup;
