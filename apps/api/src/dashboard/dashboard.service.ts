import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Ticle } from '@/entity/ticle.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Ticle)
    private readonly ticleRepository: Repository<Ticle>,
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>
  ) {}

  async getCreatedTicleList(speakerId: number) {
    try {
      return await this.ticleRepository.find({
        where: { speaker: { id: speakerId } },
      });
    } catch (error) {
      throw new BadRequestException('개설한 티클 조회에 실패했습니다.');
    }
  }

  async getAppliedTicleList(userId: number) {
    try {
      const applicants = await this.applicantRepository.find({
        where: { user: { id: userId } },
        relations: ['ticle'],
      });

      return applicants.map((applicant) => applicant.ticle);
    } catch (error) {
      throw new BadRequestException('신청한 티클 조회에 실패했습니다.');
    }
  }
}
