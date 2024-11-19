import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { GetUserId } from '@/common/decorator/get-userId.decorator';

import { CreateTicleDto } from './dto/createTicleDto';
import { GetTicleListQueryDto } from './dto/getTicleListQueryDto';
import { TickleDetailResponseDto } from './dto/ticleDetailDto';
import { SortType } from './sortType.enum';
import { TicleService } from './ticle.service';

@Controller('ticle')
export class TicleController {
  constructor(private readonly ticleService: TicleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTicle(@GetUserId() userId: number, @Body() createTicleDto: CreateTicleDto) {
    const newTicle = await this.ticleService.createTicle(createTicleDto, userId);
    return { ticleId: newTicle.id };
  }

  @Get('list')
  async getTicleList(@Query() query: GetTicleListQueryDto) {
    const parsedQuery = {
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
      isOpen: query.isOpen === undefined ? true : query.isOpen,
      sort: query.sort || SortType.NEWEST,
    };
    return this.ticleService.getTicleList(parsedQuery);
  }

  @Get('search')
  getTicleSearchList() {}

  @Get(':ticleId')
  getTicle(@Param('ticleId') ticleId: number): Promise<TickleDetailResponseDto> {
    return this.ticleService.getTicleByTicleId(ticleId);
  }

  @Post(':ticleId/apply')
  applyToTicle(@Param('ticleId') ticleId: number, @Body() body: { userId: number }) {
    return this.ticleService.applyTicle(ticleId, body.userId);
  }
}
