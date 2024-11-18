import { Controller, Get, Param, Post, Query, UseGuards, Request } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

import { DashboardService } from './dashboard.service';
import { GetUserId } from '@/common/decorator/get-userId.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTicleList(
    @Request() req: any,
    @Query('isSpeaker') isSpeaker: boolean,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('status') status?: string
  ) {
    if (isSpeaker) {
      // 진행예정 (pending) 또는 종료 (completed)에 따른 필터링을 추가
      return this.dashboardService.getCreatedTicleList(req.user.id, page, pageSize, status);
    } else {
      // 신청한 티클의 상태에 맞는 필터링
      return this.dashboardService.getAppliedTicleList(req.user.id, page, pageSize, status);
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
