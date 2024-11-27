import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateSummaryDto } from './dto/createSummaryDto';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}
  //업로드 완료된 오디오 파일의 s3주소를 미디어 서버에서 받아오기
  @Post('audio')
  async getAudioFileUrl(@Body() createSummaryDto: CreateSummaryDto) {
    const summary = await this.streamService.createSummary(createSummaryDto);

    const fulltext = await this.streamService.transcribeAudio(createSummaryDto.audioUrl);
    const summaryResult = await this.streamService.summaryAudio(fulltext);

    await this.streamService.updateSummaryText(summary, summaryResult);
  }

  @Get('summary/:ticleId')
  async getSummaryByTicleId(@Param('ticleId') ticleId: number) {
    const text = await this.streamService.getSummaryText(ticleId);
    return { summary: text };
  }
}
