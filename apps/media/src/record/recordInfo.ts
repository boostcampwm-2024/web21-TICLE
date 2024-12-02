import { Readable } from 'stream';

import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import { types } from 'mediasoup';

import { NcpService } from '@/ncp/ncp.service';

export class RecordInfo {
  socketId: string;
  plainTransport: types.PlainTransport;
  recordConsumer: types.Consumer;

  port: number;

  ffmpegProcess: FfmpegCommand;

  constructor(port: number, socketId: string) {
    this.port = port;
    this.socketId = socketId;
  }

  setPlainTransport(plainTransport: types.PlainTransport) {
    this.plainTransport = plainTransport;
  }

  setRecordConsumer(recordConsumer: types.Consumer) {
    this.recordConsumer = recordConsumer;
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
    if (this.ffmpegProcess) {
      // this.ffmpegProcess.kill('SIGINT');
      this.ffmpegProcess.kill('SIGTERM');
      console.log('녹음 프로세스 종료');
      this.ffmpegProcess = null;
    }
  }

  createFfmpegProcess(roomId: string, ncpService: NcpService) {
    const rtpParameter = this.recordConsumer.rtpParameters;
    const sdpString = this.createSdpText(this.port, rtpParameter);
    const sdpStream = this.convertStringToStream(sdpString);

    const filePath = `./record/${roomId}_${Date.now()}.mp3`;

    const remoteFileName = `uploads/${roomId}_${Date.now()}.mp3`;
    const ffmpegCommand = ffmpeg()
      .input(sdpStream)
      .inputFormat('sdp')
      .inputOptions(['-protocol_whitelist', 'pipe,udp,rtp,file'])
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .audioFrequency(48000)
      .audioChannels(2)
      .on('stderr', (data) => {
        console.log(data);
      })
      .on('error', (err) => {
        console.log('FFmpeg error:1', err);
        sdpStream.destroy();
        this.stopRecordProcess();
      })
      .on('end', () => {
        sdpStream.destroy();
        this.stopRecordProcess();
        // ncpService.uploadFile(filePath, remoteFileName, roomId);
        console.log('녹음 종료');
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
a=receiveonly
`;
  };

  private convertStringToStream = (stringToConvert: string) => {
    const stream = new Readable({
      read() {
        this.push(stringToConvert);
        this.push(null);
      },
    });

    return stream;
  };
}
