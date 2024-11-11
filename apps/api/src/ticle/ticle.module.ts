import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Summary } from '@/entity/summary.entity';
import { Tag } from '@/entity/tag.entity';
import { Ticle } from '@/entity/ticle.entity';

import { TicleController } from './ticle.controller';

@Module({
  controllers: [TicleController],
  imports: [TypeOrmModule.forFeature([Ticle, Applicant, Summary, Tag])],
})
export class TicleModule {}
