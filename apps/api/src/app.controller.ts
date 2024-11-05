import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'swaggerTest' })
  @ApiResponse({ status: 200, description: '기본 존재하는 api Test.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
