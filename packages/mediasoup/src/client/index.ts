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
  producerId: string;
  paused: boolean;
  appData?: { mediaTypes: MediaTypes };
}

export interface CreateTransportRes {
  transportId: string;
  iceParameters: types.IceParameters;
  iceCandidates: types.IceCandidate[];
  dtlsParameters: types.DtlsParameters;
}

export interface CreateConsumerRes {
  consumerId: string;
  producerId: string;
  kind: types.MediaKind;
  rtpParameters: types.RtpParameters;
}

export interface RemoteStream {
  socketId: string;
  stream: MediaStream;
  consumer: types.Consumer;
  kind: types.MediaKind;
  paused: boolean;
}

export interface GetProducersRes {
  producerId: string;
  kind: types.MediaKind;
  peerId: string;
}

export const PRODUCER_OPTIONS: ProducerOptions = {
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

export const VIDEO_PRODUCER_OPTIONS: ProducerOptions = {
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
    opusDtx: true,
    opusStereo: true,
  },
};

export const AUDIO_PRODUCER_OPTIONS: ProducerOptions = {
  encodings: [
    {
      maxBitrate: 64000,
    },
  ],
  codecOptions: {},
};
