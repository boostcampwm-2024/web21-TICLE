import { Controller, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

import { DashboardService } from './dashboard.service';
import { GetUserId } from '@/common/decorator/get-userId.decorator';
import { ZodValidationPipe } from '@/zodValidationPipe';
import {
  GetDashboardListQueryDto,
  GetDashboardListQuerySchema,
} from './dto/getDashboardListQueryDto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(GetDashboardListQuerySchema))
  async getTicleList(@GetUserId() userId: number, @Query() query: GetDashboardListQueryDto) {
    if (query.isSpeaker) {
      return this.dashboardService.getCreatedTicleList(
        userId,
        query.page,
        query.pageSize,
        query.status
      );
    } else {
      return this.dashboardService.getAppliedTicleList(
        userId,
        query.page,
        query.pageSize,
        query.status
      );
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
