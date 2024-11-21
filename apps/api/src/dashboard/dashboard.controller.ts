import { Controller, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

import { DashboardService } from './dashboard.service';
import { GetUserId } from '@/common/decorator/get-userId.decorator';
import { ZodValidationPipe } from '@/zodValidationPipe';
import { GetDashboardListQueryDto } from './dto/getDashboardListQueryDto';

import { GetDashboardListQuerySchema } from '@repo/types';

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

  @Post('start')
  startTicle(@Param('ticleId') ticleId: number) {}

  @Post('join')
  joinTicle(@Param('ticleId') ticleId: number) {}
}
