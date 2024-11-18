import { Controller, Get, Param, Post, Query, UseGuards, Request } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

import { DashboardService } from './dashboard.service';
import { GetUserId } from '@/common/decorator/get-userId.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTicleList(@GetUserId() userId: number, @Query('isSpeaker') isSpeaker: boolean) {
    if (isSpeaker) {
      return this.dashboardService.getCreatedTicleList(userId);
    } else {
      return this.dashboardService.getAppliedTicleList(userId);
    }
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
