import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('created')
  getCreatedTicleList(@Body() body: { speakerId: number }) {
    return this.dashboardService.getCreatedTicleList(body.speakerId);
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

//select * from application where ticle_id = 1; // 참가자들 목록
//select * from ticle where author_id = 1; // 내가 만든 티클 목록
// ticleservice
//dashboardservice -> (ticleRepository , ApplicantRepository)

//dashboardController(/applied) -> dashboardService에 구현된 getAppliedTicles()  -> ApplicantRepository -> findAllByUserId()
//dashboardController(/created)->  dashboardService에 구현된 getCreatedTicles()  -> TicleRepository -> findAllByAuthorId()

// domain 이라는 패키지 안에  repository, entity
// auth -> presentation , domain

// 객체 객체에서 의존관게를 갖는 객체들 -> class 내에 있는field 변수들

//controller -> service -> repository , service
