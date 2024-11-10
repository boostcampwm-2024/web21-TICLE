import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticle, TicleStatus } from '@/entity/ticle.entity';

import { CreateTicleDto } from './dto/createTicleDto';

@Injectable()
export class TicleService {
  constructor(
    @InjectRepository(Ticle)
    private ticleRepository: Repository<Ticle>
  ) {}

  async createTicle(createTicleDto: CreateTicleDto): Promise<Ticle> {
    try {
      const newTicle = this.ticleRepository.create({
        ...createTicleDto,
        ticleStatus: TicleStatus.OPEN,
        applicants: [],
        summary: null,
        tags: [],
      });

      return await this.ticleRepository.save(newTicle);
    } catch (error) {
      throw new Error(`Failed to create ticle `);
    }
  }
}
