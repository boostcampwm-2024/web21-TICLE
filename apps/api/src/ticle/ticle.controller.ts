import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, Put } from '@nestjs/common';
import { CreateTicleSchema } from '@repo/types';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { GetUserId } from '@/common/decorator/get-userId.decorator';
import { ZodValidationPipe } from '@/zodValidationPipe';

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
  async createTicle(
    @GetUserId() userId: number,
    @Body(new ZodValidationPipe(CreateTicleSchema)) createTicleDto: CreateTicleDto
  ) {
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

  @Get(':ticleId')
  @UseGuards(JwtAuthGuard)
  getTicle(
    @GetUserId() userId: number,
    @Param('ticleId') ticleId: number
  ): Promise<TickleDetailResponseDto> {
    return this.ticleService.getTicleByTicleId(userId, ticleId);
  }

  @Post(':ticleId/apply')
  @UseGuards(JwtAuthGuard)
  applyToTicle(@GetUserId() userId: number, @Param('ticleId') ticleId: number) {
    return this.ticleService.applyTicle(ticleId, userId);
  }

  @Delete(':ticleId')
  @UseGuards(JwtAuthGuard)
  deleteTicle(@GetUserId() userId: number, @Param('ticleId') ticleId: number) {
    return this.ticleService.deleteTicle(ticleId, userId);
  }
}
