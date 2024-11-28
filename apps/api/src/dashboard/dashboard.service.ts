import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessage, TicleStatus } from '@repo/types';

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

  async getCreatedTicleList(
    speakerId: number,
    page: number,
    pageSize: number,
    status?: TicleStatus
  ) {
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.ticleRepository
      .createQueryBuilder('ticle')
      .select(['ticle.id', 'ticle.title', 'ticle.startTime', 'ticle.endTime', 'ticle.ticleStatus'])
      .where('ticle.speaker = :speakerId', { speakerId })
      .skip(skip)
      .take(pageSize);

    if (status) {
      if (status === TicleStatus.OPEN) {
        queryBuilder.andWhere('ticle.ticleStatus IN (:...statuses)', {
          statuses: [TicleStatus.OPEN, TicleStatus.IN_PROGRESS],
        });
      } else {
        queryBuilder.andWhere('ticle.ticleStatus = :status', { status });
      }
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
  }

  async getAppliedTicleList(userId: number, page: number, pageSize: number, status?: TicleStatus) {
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.ticle', 'ticle')
      .select([
        'applicant.id',
        'ticle.id',
        'ticle.speakerName',
        'ticle.title',
        'ticle.startTime',
        'ticle.endTime',
        'ticle.ticleStatus',
      ])
      .where('applicant.user = :userId', { userId })
      .skip(skip)
      .take(pageSize);

    if (status) {
      if (status === TicleStatus.OPEN) {
        queryBuilder.andWhere('ticle.ticleStatus IN (:...statuses)', {
          statuses: [TicleStatus.OPEN, TicleStatus.IN_PROGRESS],
        });
      } else {
        queryBuilder.andWhere('ticle.ticleStatus = :status', { status });
      }
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
  }

  async getApplicants(ticleId: number) {
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
  }

  async startTicle(userId: number, ticleId: number) {
    const ticle = await this.ticleRepository.findOne({
      where: { id: ticleId },
      relations: ['speaker'],
    });

    if (!ticle) {
      throw new NotFoundException(ErrorMessage.TICLE_NOT_FOUND);
    }
    if (ticle.speaker.id !== userId) {
      throw new BadRequestException(ErrorMessage.CANNOT_START_TICLE);
    }
    if (ticle.ticleStatus !== TicleStatus.OPEN) {
      throw new BadRequestException(ErrorMessage.CANNOT_START_TICLE);
    }

    ticle.ticleStatus = TicleStatus.IN_PROGRESS;
    await this.ticleRepository.save(ticle);
    return;
  }

  async endTicle(userId: number, ticleId: number) {
    const ticle = await this.ticleRepository.findOne({
      where: { id: ticleId },
      relations: ['speaker'],
    });

    if (!ticle) {
      throw new NotFoundException(ErrorMessage.TICLE_NOT_FOUND);
    }
    if (ticle.speaker.id !== userId) {
      throw new BadRequestException(ErrorMessage.CANNOT_END_TICLE);
    }
    if (ticle.ticleStatus !== TicleStatus.IN_PROGRESS) {
      throw new BadRequestException(ErrorMessage.CANNOT_END_TICLE);
    }

    ticle.ticleStatus = TicleStatus.CLOSED;
    await this.ticleRepository.save(ticle);
    return;
  }
}
