import { Injectable } from '@nestjs/common';
import { types } from 'mediasoup';

import { MediasoupService } from '@/mediasoup/mediasoup.service';
import { RoomService } from '@/room/room.service';

import { RecordInfo } from './recordInfo';

@Injectable()
export class RecordService {
  private recordInfos: Map<string, RecordInfo> = new Map();
  constructor(
    private mediasoupService: MediasoupService,
    private roomService: RoomService
  ) {}

  async recordStart(roomId: string, socketId: string) {
    const room = this.roomService.getRoom(roomId);
    if (!room) {
      return;
    }
    const router = room.router;
    const recordInfo = this.addRecordInfo(roomId);
    const audioProducer = room.getPeer(socketId).getAudioProducer();

    await this.addPlainTransport(recordInfo, router);
    await this.addConsumer(
      recordInfo,
      router.rtpCapabilities,
      audioProducer.id,
      audioProducer.paused
    );
  }

  addRecordInfo(roomId: string) {
    const recordInfo = new RecordInfo();
    this.recordInfos.set(roomId, recordInfo);
    return recordInfo;
  }

  async addPlainTransport(recordInfo: RecordInfo, router: types.Router) {
    const plainTransport = await this.mediasoupService.createPlainTransport(router);
    recordInfo.setPlainTransport(plainTransport);
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
  }
}
