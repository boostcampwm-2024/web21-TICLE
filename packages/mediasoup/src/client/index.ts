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
  peerId: string;
  producerId: string;
  kind: types.MediaKind;
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
