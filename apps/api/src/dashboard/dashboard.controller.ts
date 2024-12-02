import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetDashboardListQuerySchema } from '@repo/types';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { GetUserId } from '@/common/decorator/get-userId.decorator';
import { ZodValidationPipe } from '@/common/pipe/zodValidationPipe';

import { DashboardService } from './dashboard.service';
import { GetDashboardListQueryDto } from './dto/getDashboardListQueryDto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTicleList(
    @GetUserId() userId: number,
    @Query(new ZodValidationPipe(GetDashboardListQuerySchema)) query: GetDashboardListQueryDto
  ) {
    const { page, pageSize, status } = query;
    if (query.isSpeaker) {
      return this.dashboardService.getCreatedTicleList(userId, page, pageSize, status);
    } else {
      return this.dashboardService.getAppliedTicleList(userId, page, pageSize, status);
    }
  }

  @Get(':ticleId/applicants')
  async getApplicants(@Param('ticleId') ticleId: number) {
    return await this.dashboardService.getApplicants(ticleId);
  }

  @Post(':ticleId/start')
  @UseGuards(JwtAuthGuard)
  async startTicle(@GetUserId() userId: number, @Param('ticleId') ticleId: number) {
    await this.dashboardService.startTicle(userId, ticleId);
    return 'success ticle start';
  }

  @Post(':ticleId/end')
  @UseGuards(JwtAuthGuard)
  async endTicle(@GetUserId() userId: number, @Param('ticleId') ticleId: number) {
    await this.dashboardService.endTicle(userId, ticleId);
    return 'success ticle end';
  }

  @Post('join')
  joinTicle(@Param('ticleId') ticleId: number) {}
}
