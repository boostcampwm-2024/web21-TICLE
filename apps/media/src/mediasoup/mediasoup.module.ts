import { Module } from '@nestjs/common';

import { MediasoupService } from './mediasoup.service';

@Module({
  imports: [],
  providers: [MediasoupService],
  exports: [MediasoupService],
})

export class MediasoupModule {}
