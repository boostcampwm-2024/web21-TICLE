import { Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getTicleList(
    @Query('speakerId', ParseIntPipe) speakerId?: number,
    @Query('userId', ParseIntPipe) userId?: number
  ) {
    return await this.dashboardService.getTicleList(speakerId, userId);
  }

  @Get(':ticleId/applicants')
  async getApplicants(@Param('ticleId') ticleId: number) {
    return await this.dashboardService.getApplicants(ticleId);
  }

  @Post('start')
  startTicle(@Param('ticleId') ticleId: number) {}

  @Post('join')
  joinTicle(@Param('ticleId') ticleId: number) {}
}
