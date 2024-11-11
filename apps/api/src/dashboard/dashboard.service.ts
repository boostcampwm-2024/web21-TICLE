import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Ticle } from '@/entity/ticle.entity';

@Injectable()
export class DashboardService {
  @InjectRepository(Ticle)
  private ticleRepository: Repository<Ticle>;
  @InjectRepository(Applicant)
  private applicantRepository: Repository<Applicant>;

  async getCreatedTicleList(speakerId: number) {
    try {
      return await this.ticleRepository.find({
        where: { speaker: { id: speakerId } },
      });
    } catch (error) {
      throw new HttpException(`Failed to get created ticle list`, HttpStatus.BAD_REQUEST);
    }
  }
}
