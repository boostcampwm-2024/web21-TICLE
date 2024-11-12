import { Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('created')
  async getCreatedTicleList(@Query('speakerId', ParseIntPipe) speakerId: number) {
    return await this.dashboardService.getCreatedTicleList(speakerId);
  }

  @Get('applied')
  async getAppliedTicleList(@Query('userId', ParseIntPipe) userId: number) {
    return await this.dashboardService.getAppliedTicleList(userId);
  }

  @Get('created/:ticleId/applicants')
  getParticipants(@Param('ticleId') ticleId: number) {}

  @Post('created/:ticleId/start')
  startTicle(@Param('ticleId') ticleId: number) {}

  @Post('applied/:ticleId/join')
  joinTicle(@Param('ticleId') ticleId: number) {}
}
