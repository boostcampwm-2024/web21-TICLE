import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CreateTicleDto } from './dto/createTicleDto';
import { TickleDetailResponseDto } from './dto/ticleDetailDto';
import { TicleService } from './ticle.service';

@Controller('ticle')
export class TicleController {
  constructor(private readonly ticleService: TicleService) {}

  @Post()
  async createTicle(@Body() createTicleDto: CreateTicleDto) {
    const newTicle = await this.ticleService.createTicle(createTicleDto);
    return newTicle.id;
  }

  @Get(':ticleId')
  getTicle(@Param('ticleId') ticleId: number): Promise<TickleDetailResponseDto> {
    return this.ticleService.getTicleByTicleId(ticleId);
  }

  @Get('list')
  getTicleList(@Query('filter') filter?: string, @Query('sort') sort?: string) {}

  @Get('search')
  getTicleSearchList() {}

  @Post(':ticleId/apply')
  applyToTicle(@Param('ticleId') ticleId: number, @Body() body: { userId: number }) {
    return this.ticleService.applyTicle(ticleId, body.userId);
  }
}
