import { useParams } from '@tanstack/react-router';
import { types } from 'mediasoup-client';
import { MutableRefObject, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

const VIDEO_PRODUCER_OPTIONS = client.VIDEO_PRODUCER_OPTIONS;
const AUDIO_PRODUCER_OPTIONS = client.AUDIO_PRODUCER_OPTIONS;

const STREAM_TYPES = {
  video: 'video',
  audio: 'audio',
  screen: 'screen',
} as const;

interface UseProducerStreamParams {
  socketRef: MutableRefObject<Socket | null>;
  sendTransportRef: MutableRefObject<types.Transport | null>;
}

type ProducerRef = MutableRefObject<types.Producer | null>;

const useProducerStream = ({ socketRef, sendTransportRef }: UseProducerStreamParams) => {
  const { ticleId } = useParams({ from: '/live/$ticleId' });

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const audioProducerRef = useRef<types.Producer | null>(null);
  const videoProducerRef = useRef<types.Producer | null>(null);
  const screenProducerRef = useRef<types.Producer | null>(null);

  const closeStream = (stream: MediaStream, producerRef: ProducerRef) => {
    const socket = socketRef.current;
    const producer = producerRef.current;

    if (!socket || !producer) return;

    stream.getTracks().forEach((track) => {
      track.stop();
      producer.close();
      producerRef.current = null;

      socket.emit(SOCKET_EVENTS.closeProducer, { producerId: producer.id, roomId: ticleId });
    });
  };

  const pauseStream = (stream: MediaStream, producerRef: ProducerRef) => {
    const socket = socketRef.current;
    const producer = producerRef.current;
    if (!socket || !producer) return;

    stream.getTracks().forEach((track) => {
      track.enabled = false;
      producer.pause();
    });
  };

  const resumeStream = (stream: MediaStream, producerRef: ProducerRef) => {
    const socket = socketRef.current;
    const producer = producerRef.current;

    if (!socket || !producer) return;

    stream.getTracks().forEach((track) => {
      track.enabled = true;
      producer.resume();
    });
  };

  const createProducer = async (
    source: (typeof STREAM_TYPES)[keyof typeof STREAM_TYPES],
    track?: MediaStreamTrack
  ) => {
    const transport = sendTransportRef.current;
    if (!transport || !track) {
      return null;
    }

    const kind = track.kind as types.MediaKind;

    const producerOptions =
      kind === STREAM_TYPES.video ? VIDEO_PRODUCER_OPTIONS : AUDIO_PRODUCER_OPTIONS;

    const producer = await transport.produce({
      track,
      appData: { source },
      ...producerOptions,
    });

    initProducerEvent(producer);

    return producer;
  };

  const startVideoStream = async () => {
    if (videoStream) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const track = stream.getVideoTracks()[0];

    setVideoStream(stream);
    videoProducerRef.current = await createProducer(STREAM_TYPES.video, track);
  };

  const startAudioStream = async () => {
    if (audioStream) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 48000,
        sampleSize: 16,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const track = stream.getAudioTracks()[0];

    setAudioStream(stream);
    audioProducerRef.current = await createProducer(STREAM_TYPES.audio, track);
  };

  const startScreenStream = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { max: 1920 },
        height: { max: 1080 },
        frameRate: { max: 30 },
      },
    });
    const track = stream.getVideoTracks()[0];

    setScreenStream(stream);
    screenProducerRef.current = await createProducer(STREAM_TYPES.screen, track);
  };

  const connectExistProducer = async () => {
    const socket = socketRef.current;

    const videoProducer = videoProducerRef.current;
    const audioProducer = audioProducerRef.current;
    const screenProducer = screenProducerRef.current;

    if (!socket || !videoProducer || !audioProducer) return;

    const params = { roomId: ticleId };

    return new Promise<client.CreateProducerRes[]>((resolve) => {
      socket.emit(SOCKET_EVENTS.getProducer, params, (result: client.CreateProducerRes[]) => {
        const filtered = result.filter(
          (p) =>
            p.producerId !== videoProducer.id &&
            p.producerId !== audioProducer.id &&
            (screenProducer ? p.producerId !== screenProducer.id : true)
        );
        resolve(filtered);
      });
    });
  };

  const initProducerEvent = (producer: types.Producer) => {
    const socket = socketRef.current;

    if (!socket) return;

    producer.observer.on('pause', () => {
      socket.emit(SOCKET_EVENTS.producerStatusChange, {
        producerId: producer.id,
        status: 'pause',
        roomId: ticleId,
      });
    });

    producer.observer.on('resume', () => {
      socket.emit(SOCKET_EVENTS.producerStatusChange, {
        producerId: producer.id,
        status: 'resume',
        roomId: ticleId,
      });
    });
  };

  return {
    videoStream,
    audioStream,
    screenStream,

    videoProducerRef,
    audioProducerRef,
    screenProducerRef,

    closeStream,
    pauseStream,
    resumeStream,
    startVideoStream,
    startAudioStream,
    startScreenStream,
    connectExistProducer,
  };
};

export default useProducerStream;
