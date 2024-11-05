import { Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('ticle')
export class TicleController {
  @Post()
  createTicle() {}

  @Get(':ticleId')
  getTicle(@Param('ticleId') params: any) {}

  @Get('list')
  getTicleList(@Query('filter') filter?: string, @Query('sort') sort?: string) {}

  @Get('search')
  getTicleSearchList() {}

  @Post(':ticleId/apply')
  applyToTicle(@Param('ticleId') params: any) {}
}
