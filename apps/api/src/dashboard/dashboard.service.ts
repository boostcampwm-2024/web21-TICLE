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

  async getCreatedTicleList(speakerId: number, page: number, pageSize: number, status?: string) {
    try {
      return await this.ticleRepository.find({
        where: { speaker: { id: speakerId } },
        select: ['title', 'startTime', 'endTime', 'ticleStatus'],
      });
    } catch (error) {
      throw new BadRequestException('개설한 티클 조회에 실패했습니다.');
    }
  }

  async getAppliedTicleList(userId: number, page: number, pageSize: number, status?: string) {
    try {
      return await this.applicantRepository.find({
        where: { user: { id: userId } },
        relations: ['ticle'],
        select: {
          ticle: {
            title: true,
            startTime: true,
            endTime: true,
            ticleStatus: true,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('신청한 티클 조회에 실패했습니다.');
    }
  }

  async getApplicants(ticleId: number) {
    try {
      return await this.applicantRepository.find({
        where: { ticle: { id: ticleId } },
        relations: ['user'],
        select: {
          user: {
            nickname: true,
            profileImageUrl: true,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('참여자 목록 조회에 실패했습니다.');
    }
  }
}
