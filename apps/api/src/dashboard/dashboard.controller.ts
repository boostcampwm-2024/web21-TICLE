import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  constructor() {}

  @Get('created')
  getCreatedTicleList() {}

  @Get('applied')
  getAppliedTicleList() {}

  @Get('created/:ticleId/participants')
  getParticipants(@Param('ticleId') ticleId: number) {}

  @Post('created/:ticleId/start')
  startTicle(@Param('ticleId') ticleId: number) {}

  @Post('applied/:ticleId/join')
  joinTicle(@Param('ticleId') ticleId: number) {}
}
