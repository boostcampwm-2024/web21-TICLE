import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateSummaryDto } from './dto/createSummaryDto';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post('audio')
  async getAudioFileUrl(@Body() createSummaryDto: CreateSummaryDto) {
    const summary = await this.streamService.createSummary(createSummaryDto);

    const fulltext = await this.streamService.transcribeAudio(createSummaryDto.audioUrl);
    const summaryResult = await this.streamService.summaryAudio(fulltext);

    await this.streamService.updateSummaryText(summary, summaryResult);
  }

  @Get('summary/:ticleId')
  async getSummaryByTicleId(@Param('ticleId') ticleId: number) {
    const summary = await this.streamService.getSummary(ticleId);
    return summary;
  }
}
