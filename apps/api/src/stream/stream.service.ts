import { Injectable, NotFoundException } from '@nestjs/common';
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
      name: ticle.title,
      source: audioUrl,
      ticle: ticle,
    });
    return await this.summaryRepository.save(summary);
  }
}
