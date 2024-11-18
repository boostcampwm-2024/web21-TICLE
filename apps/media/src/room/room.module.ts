import { Module } from '@nestjs/common';
import { RoomService } from './room.service';

@Module({
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
