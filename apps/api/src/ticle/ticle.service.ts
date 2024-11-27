import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ErrorMessage, TicleStatus } from '@repo/types';

import { Applicant } from '@/entity/applicant.entity';
import { Tag } from '@/entity/tag.entity';
import { Ticle } from '@/entity/ticle.entity';
import { User } from '@/entity/user.entity';

import { CreateTicleDto } from './dto/createTicleDto';
import { GetTicleListQueryDto } from './dto/getTicleListQueryDto';
import { TickleDetailResponseDto } from './dto/ticleDetailDto';
import { SortType } from './sortType.enum';

@Injectable()
export class TicleService {
  constructor(
    @InjectRepository(Ticle)
    private ticleRepository: Repository<Ticle>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Applicant)
    private applicantRepository: Repository<Applicant>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createTicle(createTicleDto: CreateTicleDto, userId: number): Promise<Ticle> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const { existingTags, tagsToCreate } = await this.findExistingTags(createTicleDto.tags);
    const newTags = await this.createNewTags(tagsToCreate);

    const tags = [...existingTags, ...newTags];
    const newTicle = this.ticleRepository.create({
      ...createTicleDto,
      speaker: user,
      applicants: [],
      summary: null,
      tags: tags,
    });

    return await this.ticleRepository.save(newTicle);
  }

  async findExistingTags(tags: string[]) {
    const existingTags = await this.tagRepository.find({
      where: {
        name: In(tags),
      },
    });

    const existingTagNames = new Set(existingTags.map((tag) => tag.name));
    const tagsToCreate = tags.filter((tagName) => !existingTagNames.has(tagName));

    return {
      existingTags,
      tagsToCreate,
    };
  }

  async createNewTags(tagsToCreate: string[]) {
    if (tagsToCreate.length === 0) {
      return [];
    }

    const newTags = this.tagRepository.create(tagsToCreate.map((name) => ({ name })));
    return this.tagRepository.save(newTags);
  }

  async applyTicle(ticleId: number, userId: number) {
    const ticle = await this.getTicleWithSpeakerIdByTicleId(ticleId);
    const user = await this.getUserById(userId);
    if (ticle.speaker.id === userId) {
      throw new BadRequestException(ErrorMessage.CANNOT_REQUEST_OWN_TICLE);
    }
    await this.throwIfExistApplicant(ticleId, userId);

    const newApplicant = this.applicantRepository.create({
      ticle,
      user,
    });
    await this.applicantRepository.save(newApplicant);
    return 'Successfully applied to ticle';
  }

  async throwIfExistApplicant(ticleId: number, userId: number) {
    const existingApplication = await this.applicantRepository.exists({
      where: {
        ticle: { id: ticleId },
        user: { id: userId },
      },
    });

    if (existingApplication) {
      throw new BadRequestException(ErrorMessage.TICLE_ALREADY_REQUESTED);
    }
    return;
  }

  async getTicleWithSpeakerIdByTicleId(ticleId: number) {
    const ticle = await this.ticleRepository.findOne({
      where: { id: ticleId },
      select: {
        speaker: {
          id: true,
        },
      },
      relations: {
        speaker: true,
      },
    });
    if (!ticle) {
      throw new NotFoundException(ErrorMessage.TICLE_NOT_FOUND);
    }
    return ticle;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
    return user;
  }

  async getTicleByTicleId(userId: number, ticleId: number): Promise<TickleDetailResponseDto> {
    const ticle = await this.ticleRepository
      .createQueryBuilder('ticle')
      .leftJoinAndSelect('ticle.tags', 'tags')
      .leftJoinAndSelect('ticle.speaker', 'speaker')
      .leftJoinAndSelect('ticle.applicants', 'applicants')
      .select(['ticle', 'tags', 'speaker.id', 'speaker.profileImageUrl', 'applicants'])
      .where('ticle.id = :id', { id: ticleId })
      .getOne();

    if (!ticle) {
      throw new NotFoundException(ErrorMessage.TICLE_NOT_FOUND);
    }
    const { tags, speaker, ...ticleData } = ticle;

    const alreadyApplied = ticle.applicants.some((applicnat) => applicnat.id === userId);

    return {
      ...ticleData,
      speakerId: ticle.speaker.id,
      tags: tags.map((tag) => tag.name),
      speakerImgUrl: speaker.profileImageUrl,
      isOwner: speaker.id === userId,
      alreadyApplied: alreadyApplied,
    };
  }

  async getTicleList(query: GetTicleListQueryDto) {
    const { page, pageSize, isOpen, sort } = query;
    const skip = (page - 1) * pageSize;
    const queryBuilder = this.ticleRepository
      .createQueryBuilder('ticle')
      .select([
        'ticle.id',
        'ticle.title',
        'ticle.startTime',
        'ticle.endTime',
        'ticle.speakerName',
        'ticle.createdAt',
        'ticle.profileImageUrl',
      ])
      .addSelect('GROUP_CONCAT(DISTINCT tags.name)', 'tagNames')
      .addSelect('COUNT(DISTINCT applicant.id)', 'applicantCount')
      .addSelect('speaker.profile_image_url')
      .leftJoin('ticle.tags', 'tags')
      .leftJoin('ticle.applicants', 'applicant')
      .leftJoin('ticle.speaker', 'speaker')
      .where('ticle.ticleStatus = :status', {
        status: isOpen ? TicleStatus.OPEN : TicleStatus.CLOSED,
      })
      .groupBy('ticle.id');

    switch (sort) {
      case SortType.OLDEST:
        queryBuilder.orderBy('ticle.createdAt', 'ASC');
        break;
      case SortType.TRENDING:
        queryBuilder.orderBy('applicantCount', 'DESC').addOrderBy('ticle.createdAt', 'DESC');
        break;
      case SortType.NEWEST:
      default:
        queryBuilder.orderBy('ticle.createdAt', 'DESC');
    }

    const ticles = await queryBuilder.offset(skip).limit(pageSize).getRawMany();
    const countQuery = this.ticleRepository
      .createQueryBuilder('ticle')
      .select('COUNT(*) as count')
      .where('ticle.ticleStatus = :status', {
        status: isOpen ? TicleStatus.OPEN : TicleStatus.CLOSED,
      });
    const totalTicleCount = await countQuery.getRawOne();

    const formattedTicles = ticles.map((ticle) => ({
      id: ticle.ticle_id,
      title: ticle.ticle_title,
      tags: ticle.tagNames ? ticle.tagNames.split(',') : [],
      startTime: ticle.ticle_start_time,
      endTime: ticle.ticle_end_time,
      speakerName: ticle.ticle_speaker_name,
      applicantsCount: ticle.applicantCount,
      createdAt: ticle.ticle_created_at,
      speakerProfileImageUrl: ticle.profile_image_url,
    }));

    const totalPages = Math.ceil(totalTicleCount.count / pageSize);

    return {
      ticles: formattedTicles,
      meta: {
        page,
        take: pageSize,
        totalItems: totalTicleCount.count,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async deleteTicle(userId: number, ticleId: number) {
    const ticle = await this.ticleRepository.findOne({
      where: { id: ticleId, speaker: { id: userId } },
    });

    if (ticle.speaker.id === userId) {
      throw new BadRequestException(ErrorMessage.CANNOT_DELETE_OTHERS_TICLE);
    }

    if (!ticle) {
      throw new NotFoundException(ErrorMessage.TICLE_NOT_FOUND);
    }

    await this.ticleRepository.remove(ticle);
    return;
  }
}
