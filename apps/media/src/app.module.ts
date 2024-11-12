import { Module } from '@nestjs/common';

import { MediasoupModule } from './mediasoup/mediasoup.module';
import { MediasoupService } from './mediasoup/mediasoup.service';
import { SignalingModule } from './signaling/signaling.module';

@Module({
  imports: [SignalingModule, MediasoupModule],
  controllers: [],
  providers: [MediasoupService],
})
export class AppModule {}
