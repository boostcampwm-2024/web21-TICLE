import { Module } from '@nestjs/common';

import { TicleController } from './ticle.controller';

@Module({
  controllers: [TicleController],
})
export class TicleModule {}
