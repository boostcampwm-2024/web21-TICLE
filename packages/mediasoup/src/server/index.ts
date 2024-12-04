import { types } from 'mediasoup';

import { MediaTypes, StreamStatus } from '../types';

export interface JoinRoomDto {
  roomId: string;
  nickname: string;
}

export interface ConnectTransportDto {
  transportId: string;
  dtlsParameters: types.DtlsParameters;
  roomId: string;
}

export interface CreateTransportDto {
  roomId: string;
}

export interface CreateProducerDto {
  transportId: string;
  kind: types.MediaKind;
  rtpParameters: types.RtpParameters;
  roomId: string;
  appData: { mediaTypes: MediaTypes; nickname: string };
}

export interface CreateConsumerDto {
  peerId: string;
  transportId: string;
  producerId: string;
  roomId: string;
  rtpCapabilities: types.RtpCapabilities;
  nickname: string;
  appData?: { mediaTypes: MediaTypes; nickname: string };
}

export interface CreateConsumersDto {
  socketId: string;
  roomId: string;
  transportId: string;
  rtpCapabilities: types.RtpCapabilities;
  producers: GetProducersRes[];
}

export interface GetProducersDto {
  roomId: string;
}

export interface GetProducersRes {
  kind: types.MediaKind;
  peerId: string;
  nickname: string;
  producerId: string;
  paused: boolean;
  appData?: { mediaTypes: MediaTypes; nickname: string };
}

export interface ChangeProducerStateDto {
  producerId: string;
  status: StreamStatus;
  roomId: string;
}

export interface ChangeConsumerStateDto {
  consumerId: string;
  status: StreamStatus;
  roomId: string;
}

export const PRODUCER_OPTIONS = {
  encodings: [
    { rid: 'r0', maxBitrate: 50000, scalabilityMode: 'S1T3', active: true, dtx: false },
    { rid: 'r1', maxBitrate: 150000, scalabilityMode: 'S1T3', active: true, dtx: false },
    { rid: 'r2', maxBitrate: 500000, scalabilityMode: 'S1T3', active: true, dtx: false },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};
