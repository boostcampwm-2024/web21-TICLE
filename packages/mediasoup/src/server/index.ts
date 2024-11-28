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
  appData: { mediaTypes: MediaTypes };
}

export interface CreateConsumerDto {
  peerId: string;
  transportId: string;
  producerId: string;
  roomId: string;
  rtpCapabilities: types.RtpCapabilities;
  appData?: { mediaTypes: MediaTypes };
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
  appData?: { mediaTypes: MediaTypes };
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
