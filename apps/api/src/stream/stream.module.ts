import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Summary } from '@/entity/summary.entity';
import { Ticle } from '@/entity/ticle.entity';

import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticle, Summary])],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
