import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PlainTransportOptions,
  RouterOptions,
  RtpCodecCapability,
  WebRtcTransportOptions,
  WorkerSettings,
} from 'mediasoup/node/lib/types';

@Injectable()
export class MediasoupConfig {
  constructor(private configService: ConfigService) {}
  worker: WorkerSettings = {
    logLevel: 'warn',
    rtcMinPort: this.configService.get<number>('RTC_MIN_PORT'),
    rtcMaxPort: this.configService.get<number>('RTC_MAX_PORT'),
  };

  router: RouterOptions = {
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
        parameters: {
          minptime: 10,
          useinbandfec: 1,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/H264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '42e01f',
        },
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 10000,
        },
      },
    ] as RtpCodecCapability[],
  };

  webRtcTransport: WebRtcTransportOptions = {
    listenInfos: [
      {
        protocol: 'udp',
        ip: '0.0.0.0',
        announcedAddress: this.configService.get('SERVER_ADDRESS'),
        portRange: {
          min: this.configService.get<number>('TRANSPORT_MIN_PORT'),
          max: this.configService.get<number>('TRANSPORT_MAX_PORT'),
        },
      },
      {
        protocol: 'tcp',
        ip: '0.0.0.0',
        announcedAddress: this.configService.get('SERVER_ADDRESS'),
        portRange: {
          min: this.configService.get<number>('TRANSPORT_MIN_PORT'),
          max: this.configService.get<number>('TRANSPORT_MAX_PORT'),
        },
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  };

  plainTransport: PlainTransportOptions = {
    listenIp: {
      ip: '127.0.0.1',
      announcedIp: '127.0.0.1',
    },
    rtcpMux: true,
    comedia: false,
  };
}
