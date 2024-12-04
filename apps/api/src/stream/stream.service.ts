import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessage } from '@repo/types';

import { Summary } from '@/entity/summary.entity';
import { Ticle } from '@/entity/ticle.entity';

import { CreateSummaryDto } from './dto/createSummaryDto';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
    @InjectRepository(Ticle)
    private ticleRepository: Repository<Ticle>,
    private configService: ConfigService
  ) {}

  async createSummary(createSummaryDto: CreateSummaryDto) {
    const { ticleId, audioUrl } = createSummaryDto;
    const ticle = await this.ticleRepository.findOne({
      where: { id: ticleId },
    });

    if (!ticle) {
      throw new NotFoundException(ErrorMessage.TICLE_NOT_FOUND);
    }

    const summary = this.summaryRepository.create({
      audioUrl: audioUrl,
      ticle: ticle,
    });
    return await this.summaryRepository.save(summary);
  }

  async transcribeAudio(remoteFileName: string) {
    const speechEndpoint = this.configService.get<string>('CLOVASPEECH_ENDPOINT');

    const body = {
      dataKey: remoteFileName,
      params: { enable: true },
      language: 'ko-KR',
      completion: 'sync',
      fulltext: true,
    };

    try {
      const response = await fetch(speechEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CLOVASPEECH-API-KEY': this.configService.get<string>('CLOVASPEECH_API_KEY'),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Failed to transcribe audio:', error);
      throw new InternalServerErrorException(ErrorMessage.FAILED_TO_TRANSCRIBE_AUDIO);
    }
  }

  async summaryAudio(text: string) {
    const studioEndpoint = this.configService.get<string>('CLOVASTUDIO_ENDPOINT');

    const body = {
      texts: [text],
      segMinSize: 300,
      includeAiFilters: true,
      autoSentenceSplitter: true,
      segCount: -1,
      segMaxSize: 1000,
    };

    try {
      const response = await fetch(studioEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-NCP-CLOVASTUDIO-API-KEY': this.configService.get<string>('CLOVASTUDIO_API_KEY'),
          'X-NCP-APIGW-API-KEY': this.configService.get<string>('CLOVASTUDIO_APIGW_API_KEY'),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      return data.result.text;
    } catch (error) {
      console.error('Failed to summarize audio:', error);
      throw new InternalServerErrorException(ErrorMessage.FAILED_TO_SUMMARY_AUDIO);
    }
  }

  async getSummary(ticleId: number) {
    const summary = await this.summaryRepository.findOne({
      where: { ticle: { id: ticleId } },
    });

    return summary;
  }

  async updateSummaryText(summary: Summary, summaryText: string[]) {
    summary.summaryText = summaryText;
    await this.summaryRepository.save(summary);
  }
}
