import { Module } from '@nestjs/common';

import { StreamController } from './stream.controller';

@Module({
  controllers: [StreamController],
})
export class StreamModule {}
