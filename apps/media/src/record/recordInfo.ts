import { spawn } from 'child_process';
import { Readable } from 'stream';

import { types } from 'mediasoup';

export class RecordInfo {
  private plainTransport: types.PlainTransport;
  private recordConsumer: types.Consumer;

  private port: number;
  private ffmpegProcess: any;

  constructor(port: number) {
    this.port = port;
  }
  setPlainTransport(plainTransport: types.PlainTransport) {
    this.plainTransport = plainTransport;
  }

  getPlainTransport() {
    return this.plainTransport;
  }

  setRecordConsumer(recordConsumer: types.Consumer) {
    recordConsumer.on('producerclose', () => {
      recordConsumer.close();
      this.plainTransport.close();
      this.ffmpegProcess.kill('SIGINT');
    });
    recordConsumer.on('transportclose', () => {
      recordConsumer.close();
      this.ffmpegProcess.kill('SIGINT');
    });

    this.recordConsumer = recordConsumer;
  }
  getPort() {
    return this.port;
  }

  createFfmpegProcess(roomId: string) {
    const rtpParameter = this.recordConsumer.rtpParameters;
    const sdpString = this.createSdpText(this.port, rtpParameter);
    const sdpStream = this.convertStringToStream(sdpString);

    const filePath = `./record/${roomId}${new Date()}.mp3`;
    const ffmpegOption = this.createFfmpegOption(filePath);
    const ffmpegProcess = spawn('ffmpeg', ffmpegOption);

    ffmpegProcess.stderr.setEncoding('utf-8');
    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`FFmpeg stderr: ${data}`);
    });

    ffmpegProcess.stdout.setEncoding('utf-8');
    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`FFmpeg stdout: ${data}`);
    });

    ffmpegProcess.on('error', (error) => {
      console.error('FFmpeg process error:', error);
    });

    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg process closed with code ${code}`);
    });

    sdpStream.pipe(ffmpegProcess.stdin);
  }

  createSdpText = (port: number, rtpParameters: any) => {
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

  convertStringToStream = (stringToConvert: string) => {
    const stream = new Readable();
    stream._read = () => {};
    stream.push(stringToConvert);
    stream.push(null);
    return stream;
  };

  createFfmpegOption(filePath: string) {
    return [
      '-loglevel',
      'debug',
      '-protocol_whitelist',
      'pipe,udp,rtp,file',
      '-fflags',
      '+genpts',
      '-thread_queue_size',
      '1024',
      '-reorder_queue_size',
      '1024',
      '-analyzeduration',
      '2147483647',
      '-probesize',
      '2147483647',
      '-i',
      'pipe:0',
      // MP3 출력 설정
      '-c:a',
      'libmp3lame', // MP3 인코더 사용
      '-b:a',
      '192k', // 비트레이트 설정
      '-ar',
      '48000', // 샘플레이트
      '-ac',
      '2', // 스테레오
      '-f',
      'mp3', // MP3 포맷
      filePath,
    ];
  }
}
