import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Summary } from '@/entity/summary.entity';
import { Ticle } from '@/entity/ticle.entity';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticle, Applicant, Summary])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
