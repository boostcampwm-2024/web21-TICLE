import { RtpCodecCapability } from 'mediasoup/node/lib/types';

export const config = {
  mediasoup: {
    worker: {
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
    },
    router: {
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
        },
      ] as RtpCodecCapability[],
    },
    webRtcTransport: {
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: '127.0.0.1', // 실제 서버 IP로 변경 필요
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    },
  },
};
