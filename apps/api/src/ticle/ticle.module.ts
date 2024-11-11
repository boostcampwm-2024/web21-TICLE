import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Summary } from '@/entity/summary.entity';
import { Tag } from '@/entity/tag.entity';
import { Ticle } from '@/entity/ticle.entity';
import { User } from '@/entity/user.entity';

import { TicleController } from './ticle.controller';
import { TicleService } from './ticle.service';

@Module({
  controllers: [TicleController],
  imports: [TypeOrmModule.forFeature([Ticle, Tag, Summary, Applicant, User])],
  providers: [TicleService],
})
export class TicleModule {}
