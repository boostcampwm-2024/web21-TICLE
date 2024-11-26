import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessage } from '@repo/types';

import { Summary } from '@/entity/summary.entity';
import { Ticle } from '@/entity/ticle.entity';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
    @InjectRepository(Ticle)
    private ticleRepository: Repository<Ticle>,
    private configService: ConfigService
  ) {}

  async createSummary(ticleId: number, audioUrl: string, summaryText: string[]) {
    const ticle = await this.ticleRepository.findOne({
      where: { id: ticleId },
    });

    if (!ticle) {
      throw new NotFoundException(ErrorMessage.TICLE_NOT_FOUND);
    }

    const summary = this.summaryRepository.create({
      audioUrl: audioUrl,
      summaryText: summaryText,
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to transcribe audio: ${response.status}`);
      }

      const data = await response.json();

      return data.text;
    } catch (error) {
      console.error('Failed to transcribe audio:', error);
      throw new Error('Failed to transcribe audio with Clova Speech Recognition');
    }
  }
}
