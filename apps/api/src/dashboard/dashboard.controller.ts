import { Controller, Get, Param, Post, Query, UseGuards, Request } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTicleList(@Request() req: any, @Query('isSpeaker') isSpeaker: boolean) {
    if (isSpeaker) {
      return await this.dashboardService.getCreatedTicleList(req.user.id);
    } else {
      return await this.dashboardService.getAppliedTicleList(req.user.id);
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
