import { ProducerOptions } from 'mediasoup-client/lib/types';

import { MediaTypes } from '../types';

import type { types } from 'mediasoup-client';

export type Device = types.Device;

export type BaseTransport = types.Transport;

export type RtpCapabilities = types.RtpCapabilities;

export interface ConsumerTransports {
  consumer: types.Consumer;
  producerId: string;
  consumerTransport: BaseTransport;
  consumerTransportId: BaseTransport;
}
export interface CreateProducerRes {
  kind: types.MediaKind;
  peerId: string;
  nickname: string;
  producerId: string;
  paused: boolean;
  appData?: { mediaTypes: MediaTypes; nickname: string };
}

export interface CreateTransportRes {
  transportId: string;
  iceParameters: types.IceParameters;
  iceCandidates: types.IceCandidate[];
  dtlsParameters: types.DtlsParameters;
}

export interface CreateConsumerRes {
  peerId: string;
  consumerId: string;
  producerId: string;
  paused: boolean;
  kind: types.MediaKind;
  nickname: string;
  rtpParameters: types.RtpParameters;
  appData?: { mediaTypes: MediaTypes; nickname: string };
}

export interface RemoteStream {
  socketId: string;
  stream?: MediaStream | null;
  consumer?: types.Consumer<{ mediaTypes: MediaTypes; nickname: string }>;
  kind?: types.MediaKind;
  paused?: boolean;
  nickname: string;
  mediaType?: string;
}

export interface GetProducersRes {
  producerId: string;
  kind: types.MediaKind;
  peerId: string;
}

export interface ResumeConsumersRes {
  consumerId: string;
  producerId: string;
  paused: boolean;
}

export const VIDEO_PRODUCER_OPTIONS: ProducerOptions = {
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 750000,
      maxFramerate: 30,
    },
    {
      rid: 'r1',
      maxBitrate: 2000000,
      maxFramerate: 30,
    },
    {
      rid: 'r2',
      maxBitrate: 3500000,
      maxFramerate: 30,
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 100000,
    opusDtx: true,
  },
};

export const AUDIO_PRODUCER_OPTIONS: ProducerOptions = {
  encodings: [{ maxBitrate: 64000 }],
  codecOptions: {},
};
