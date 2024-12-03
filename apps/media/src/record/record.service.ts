import fs from 'fs';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { types } from 'mediasoup';
import { ErrorMessage } from '@repo/types';

import { MediasoupService } from '@/mediasoup/mediasoup.service';
import { NcpService } from '@/ncp/ncp.service';
import { RoomService } from '@/room/room.service';

import { RecordInfo } from './recordInfo';

@Injectable()
export class RecordService {
  private recordInfos: Map<string, RecordInfo> = new Map();
  private recordPath = './record';
  private usedPorts: Set<number> = new Set();

  constructor(
    private mediasoupService: MediasoupService,
    private roomService: RoomService,
    private configService: ConfigService,
    private ncpService: NcpService
  ) {
    if (!fs.existsSync(this.recordPath)) {
      fs.mkdirSync(this.recordPath);
    }
  }

  async startRecord(roomId: string, socketId: string) {
    const room = this.roomService.getRoom(roomId);
    if (!room) {
      return;
    }
    const router = room.router;
    const peer = room.getPeer(socketId);
    const audioProducer = peer.getAudioProducer();
    if (!audioProducer) {
      return;
    }

    const port = this.getPort();
    const recordInfo = this.setRecordInfo(roomId, port, socketId);
    const plainTransport = await this.addPlainTransport(recordInfo, router);
    plainTransport.connect({
      ip: '127.0.0.1',
      port,
    });
    await this.addConsumer(
      recordInfo,
      router.rtpCapabilities,
      audioProducer.id,
      audioProducer.paused,
      roomId
    );
    if (!audioProducer.paused) {
      recordInfo.createFfmpegProcess(roomId);
    }
  }

  private setRecordInfo(roomId: string, port: number, socketId: string) {
    const recordInfo = new RecordInfo(port, socketId, this.ncpService);
    this.recordInfos.set(roomId, recordInfo);
    return recordInfo;
  }

  getRecordInfo(roomId: string) {
    return this.recordInfos.get(roomId);
  }

  private async addPlainTransport(recordInfo: RecordInfo, router: types.Router) {
    const plainTransport = await this.mediasoupService.createPlainTransport(router);
    recordInfo.setPlainTransport(plainTransport);
    return plainTransport;
  }

  private async addConsumer(
    recordInfo: RecordInfo,
    rtpCapabilities: types.RtpCapabilities,
    producerId: string,
    producerPaused: boolean,
    roomId: string
  ) {
    const plainTransport = recordInfo.plainTransport;
    const consumer = await this.mediasoupService.createRecordConsumer(
      plainTransport,
      producerId,
      rtpCapabilities,
      producerPaused
    );

    recordInfo.setRecordConsumer(consumer, roomId);
    return consumer;
  }

  pauseRecord(roomId: string) {
    const recordInfo = this.recordInfos.get(roomId);
    if (!recordInfo) {
      return;
    }
    recordInfo.pauseRecordProcess();
  }

  resumeRecord(roomId: string) {
    const recordInfo = this.recordInfos.get(roomId);
    if (!recordInfo) {
      return;
    }
    recordInfo.resumeRecordProcess();
  }

  stopRecord(roomId: string) {
    const recordInfo = this.recordInfos.get(roomId);
    if (!recordInfo) {
      return;
    }
    this.releasePort(recordInfo.port);
    recordInfo.stopRecordProcess();
    this.recordInfos.delete(roomId);
  }

  private getPort() {
    const minPort = Number(this.configService.get('RECORD_MIN_PORT'));
    const maxPort = Number(this.configService.get('RECORD_MAX_PORT'));
    const totalPorts = maxPort - minPort + 1;

    if (this.usedPorts.size >= totalPorts) {
      throw new WsException(ErrorMessage.NO_AVAILABLE_PORT);
    }

    let port: number;
    do {
      port = Math.floor(Math.random() * totalPorts) + minPort;
    } while (this.usedPorts.has(port));

    this.usedPorts.add(port);
    return port;
  }

  private releasePort(port: number): void {
    this.usedPorts.delete(port);
  }
}
