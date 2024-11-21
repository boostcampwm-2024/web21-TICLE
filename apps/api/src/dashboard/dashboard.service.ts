import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Ticle, TicleStatus } from '@/entity/ticle.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Ticle)
    private readonly ticleRepository: Repository<Ticle>,
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>
  ) {}

  async getCreatedTicleList(
    speakerId: number,
    page: number,
    pageSize: number,
    status?: TicleStatus
  ) {
    const skip = (page - 1) * pageSize;

    try {
      const queryBuilder = this.ticleRepository
        .createQueryBuilder('ticle')
        .select([
          'ticle.id',
          'ticle.title',
          'ticle.startTime',
          'ticle.endTime',
          'ticle.ticleStatus',
        ])
        .where('ticle.speaker = :speakerId', { speakerId })
        .skip(skip)
        .take(pageSize);

      if (status) {
        queryBuilder.andWhere('ticle.ticleStatus = :status', { status });
      }

      const [ticles, totalItems] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        ticles,
        meta: {
          page,
          take: pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
        },
      };
    } catch (error) {
      throw new BadRequestException('개설한 티클 조회에 실패했습니다.');
    }
  }

  async getAppliedTicleList(userId: number, page: number, pageSize: number, status?: TicleStatus) {
    const skip = (page - 1) * pageSize;

    try {
      const queryBuilder = this.applicantRepository
        .createQueryBuilder('applicant')
        .leftJoinAndSelect('applicant.ticle', 'ticle')
        .select([
          'applicant.id',
          'ticle.id',
          'ticle.title',
          'ticle.startTime',
          'ticle.endTime',
          'ticle.ticleStatus',
        ])
        .where('applicant.user = :userId', { userId })
        .skip(skip)
        .take(pageSize);

      if (status) {
        queryBuilder.andWhere('ticle.ticleStatus = :status', { status });
      }

      const [applicants, totalItems] = await queryBuilder.getManyAndCount();

      const ticles = applicants.map((applicant) => applicant.ticle);
      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        ticles,
        meta: {
          page,
          take: pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
        },
      };
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
