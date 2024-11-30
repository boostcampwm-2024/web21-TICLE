import { Module } from '@nestjs/common';

import { RoomService } from '@/room/room.service';

import { RecordService } from './record.service';

@Module({
  imports: [RoomService],
  providers: [RecordService],
  exports: [],
})
export class RecordModule {}
