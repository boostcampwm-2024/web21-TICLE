import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticle } from '@/entity/ticle.entity';

import { TicleController } from './ticle.controller';

@Module({
  controllers: [TicleController],
  imports: [TypeOrmModule.forFeature([Ticle])],
})
export class TicleModule {}
