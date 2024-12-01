import fs from 'fs';

import { Injectable } from '@nestjs/common';
import { types } from 'mediasoup';

import { MediasoupService } from '@/mediasoup/mediasoup.service';
import { RoomService } from '@/room/room.service';

import { RecordInfo } from './recordInfo';

@Injectable()
export class RecordService {
  private recordInfos: Map<string, RecordInfo> = new Map();
  private recordPath = './record';
  constructor(
    private mediasoupService: MediasoupService,
    private roomService: RoomService
  ) {
    if (!fs.existsSync(this.recordPath)) {
      fs.mkdirSync(this.recordPath);
    }
  }

  async recordStart(roomId: string, socketId: string) {
    const room = this.roomService.getRoom(roomId);
    if (!room) {
      return;
    }
    const router = room.router;
    const audioProducer = room.getPeer(socketId).getAudioProducer();
    if (!audioProducer) {
      return;
    }

    const port = this.getPort();
    const recordInfo = this.addRecordInfo(roomId, port);
    const plainTransport = await this.addPlainTransport(recordInfo, router);
    plainTransport.connect({
      ip: '127.0.0.1',
      port,
    });
    await this.addConsumer(
      recordInfo,
      router.rtpCapabilities,
      audioProducer.id,
      audioProducer.paused
    );
    recordInfo.createFfmpegProcess(roomId);
  }

  addRecordInfo(roomId: string, port: number) {
    const recordInfo = new RecordInfo(port);
    this.recordInfos.set(roomId, recordInfo);
    return recordInfo;
  }

  async addPlainTransport(recordInfo: RecordInfo, router: types.Router) {
    const plainTransport = await this.mediasoupService.createPlainTransport(router);
    recordInfo.setPlainTransport(plainTransport);
    return plainTransport;
  }

  async addConsumer(
    recordInfo: RecordInfo,
    rtpCapabilities: types.RtpCapabilities,
    producerId: string,
    producerPaused: boolean
  ) {
    const plainTransport = recordInfo.getPlainTransport();
    const consumer = await this.mediasoupService.createRecordConsumer(
      plainTransport,
      producerId,
      rtpCapabilities,
      producerPaused
    );

    recordInfo.setRecordConsumer(consumer);
    return consumer;
  }

  recordStop(roomId: string) {
    const recordInfo = this.recordInfos.get(roomId);
    if (!recordInfo) {
      return;
    }
    recordInfo.cleanUp();
    this.recordInfos.delete(roomId);
  }

  getPort() {
    // todo : port 안겹치게 설정
    const maxPort = 29999;
    const minPort = 20000;
    const port = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
    return port;
  }
}
