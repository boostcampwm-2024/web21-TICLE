import { Injectable } from '@nestjs/common';

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

  addRecordInfo(roomId: string) {
    const room = this.roomService.getRoom(roomId);
    if (!room) {
      return;
    }
    if (this.recordInfos.has(roomId)) {
      return;
    }
    this.recordInfos.set(roomId, new RecordInfo());
  }

  async addPlainTransport(roomId: string) {
    const room = this.roomService.getRoom(roomId);
    if (!room) {
      return;
    }
    const recordInfo = this.recordInfos.get(roomId);
    if (!recordInfo) {
      return;
    }
    const router = room.router;
    const plainTransport = await this.mediasoupService.createPlainTransport(router);
    recordInfo.setPlainTransport(plainTransport);
  }

  async addConsumer(roomId: string, producerId: string) {
    const room = this.roomService.getRoom(roomId);
    if (!room) {
      return;
    }
    const recordInfo = this.recordInfos.get(roomId);
    if (!recordInfo) {
      return;
    }
    const plainTransport = recordInfo.getPlainTransport();
    if (!plainTransport) {
      return;
    }
    const consumer = await this.mediasoupService.createRecordConsumer(
      plainTransport,
      producerId,
      room.router.rtpCapabilities
    );

    recordInfo.setRecordConsumer(consumer);
  }
}
