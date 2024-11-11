import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CreateTicleDto } from './dto/createTicleDto';
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
  getTicle(@Param('ticleId') params: any) {}

  @Get('list')
  getTicleList(@Query('filter') filter?: string, @Query('sort') sort?: string) {}

  @Get('search')
  getTicleSearchList() {}

  @Post(':ticleId/apply')
  applyToTicle(@Param('ticleId') params: any) {}
}
