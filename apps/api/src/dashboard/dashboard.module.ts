import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticle } from '@/entity/ticle.entity';
import { Applicant } from '@/entity/applicant.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticle, Applicant])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
