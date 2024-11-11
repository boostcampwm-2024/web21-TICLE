import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('created')
  async getCreatedTicleList(@Body() body: { speakerId: number }) {
    return await this.dashboardService.getCreatedTicleList(body.speakerId);
  }

  @Get('applied')
  getAppliedTicleList() {}

  @Get('created/:ticleId/applicants')
  getParticipants(@Param('ticleId') ticleId: number) {}

  @Post('created/:ticleId/start')
  startTicle(@Param('ticleId') ticleId: number) {}

  @Post('applied/:ticleId/join')
  joinTicle(@Param('ticleId') ticleId: number) {}
}
