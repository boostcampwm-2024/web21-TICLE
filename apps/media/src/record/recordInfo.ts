import { unlinkSync, writeFileSync } from 'fs';

import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import { types } from 'mediasoup';

import { NcpService } from '@/ncp/ncp.service';

export class RecordInfo {
  socketId: string;
  plainTransport: types.PlainTransport;
  recordConsumer: types.Consumer;

  ncpService: NcpService;

  port: number;

  ffmpegProcess: FfmpegCommand;

  constructor(port: number, socketId: string, ncpService: NcpService) {
    this.port = port;
    this.socketId = socketId;
    this.ncpService = ncpService;
  }

  setPlainTransport(plainTransport: types.PlainTransport) {
    this.plainTransport = plainTransport;
  }

  setRecordConsumer(recordConsumer: types.Consumer, roomId: string) {
    this.recordConsumer = recordConsumer;
    this.recordConsumer.on('producerresume', () => {
      if (!this.ffmpegProcess) {
        this.createFfmpegProcess(roomId);
      }
    });
  }

  pauseRecordProcess() {
    this.recordConsumer.pause();
  }

  resumeRecordProcess() {
    this.recordConsumer.resume();
  }

  stopRecordProcess() {
    if (this.recordConsumer) {
      this.recordConsumer.close();
      this.recordConsumer = null;
    }
    if (this.plainTransport) {
      this.plainTransport.close();
      this.plainTransport = null;
    }
  }

  createFfmpegProcess(roomId: string) {
    if (this.ffmpegProcess) {
      return;
    }

    const rtpParameter = this.recordConsumer.rtpParameters;
    const sdpString = this.createSdpText(this.port, rtpParameter);
    const sdpFilePath = `./record/${roomId}_${Date.now()}.sdp`;
    writeFileSync(sdpFilePath, sdpString);

    const filePath = `./record/${roomId}_${Date.now()}.mp3`;

    const remoteFileName = `uploads/${roomId}_${Date.now()}.mp3`;

    const ffmpegCommand = ffmpeg()
      .input(sdpFilePath)
      .inputFormat('sdp')
      .inputOptions(['-protocol_whitelist', 'pipe,udp,rtp,file'])
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .audioFrequency(48000)
      .audioChannels(2)

      .on('error', (err) => {
        // todo 예외처리
        console.log('FFmpeg error:1', err);
      })
      .on('end', () => {
        this.ncpService.uploadFile(filePath, remoteFileName, roomId);
        unlinkSync(sdpFilePath);
        this.ffmpegProcess = null;
      })
      .save(filePath);

    this.ffmpegProcess = ffmpegCommand;
  }

  private createSdpText = (port: number, rtpParameters: types.RtpParameters) => {
    const { codecs } = rtpParameters;
    const payloadType = codecs[0].payloadType;
    return `v=0
o=- 0 0 IN IP4 127.0.0.1
s=FFmpeg
c=IN IP4 127.0.0.1
t=0 0
m=audio ${port} RTP/AVP ${payloadType}
a=rtpmap:${payloadType} opus/48000/2
a=fmtp:${payloadType} minptime=10;useinbandfec=1
a=sendrecv
`;
  };
}
