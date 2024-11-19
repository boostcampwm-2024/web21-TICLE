import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Tag } from '@/entity/tag.entity';
import { Ticle, TicleStatus } from '@/entity/ticle.entity';
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

  async createTicle(createTicleDto: CreateTicleDto): Promise<Ticle> {
    try {
      const { existingTags, tagsToCreate } = await this.findExistingTags(createTicleDto.tags);
      const newTags = await this.createNewTags(tagsToCreate);

      const tags = [...existingTags, ...newTags];
      const newTicle = this.ticleRepository.create({
        ...createTicleDto,
        applicants: [],
        summary: null,
        tags: tags,
      });

      return await this.ticleRepository.save(newTicle);
    } catch (error) {
      throw new BadRequestException(`Failed to create ticle `);
    }
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
      throw new BadRequestException('speaker cannot apply their ticle');
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
      throw new BadRequestException('already applied to this ticle');
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
      throw new NotFoundException(`cannot found ticle`);
    }
    return ticle;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`cannot found user`);
    }
    return user;
  }

  async getTicleByTicleId(ticleId: number): Promise<TickleDetailResponseDto> {
    const ticle = await this.ticleRepository
      .createQueryBuilder('ticle')
      .leftJoinAndSelect('ticle.tags', 'tags')
      .leftJoinAndSelect('ticle.speaker', 'speaker')
      .select(['ticle', 'tags', 'speaker.id', 'speaker.profileImageUrl'])
      .where('ticle.id = :id', { id: ticleId })
      .getOne();

    if (!ticle) {
      throw new NotFoundException('티클을 찾을 수 없습니다.');
    }
    const { tags, speaker, ...ticleData } = ticle;

    return {
      ...ticleData,
      tags: tags.map((tag) => tag.name),
      speakerImgUrl: speaker.profileImageUrl,
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
      ])
      .where('ticle.ticleStatus = :status', {
        status: isOpen ? TicleStatus.OPEN : TicleStatus.CLOSED,
      })
      .leftJoin('ticle.tags', 'tags')
      .addSelect('tags.name')
      .loadRelationCountAndMap('ticle.applicantsCount', 'ticle.applicants')
      .skip(skip)
      .take(pageSize);

    switch (sort) {
      case SortType.OLDEST:
        queryBuilder.orderBy('ticle.createdAt', 'ASC');
        break;
      case SortType.TRENDING:
        queryBuilder.orderBy('ticle.applicantsCount', 'DESC');
        break;
      case SortType.NEWEST:
      default:
        queryBuilder.orderBy('ticle.createdAt', 'DESC');
    }
    const [ticles, totalItems] = await queryBuilder.getManyAndCount();

    const formattedTicles = ticles.map((ticle) => ({
      id: ticle.id,
      title: ticle.title,
      tags: ticle.tags.map((tag) => tag.name),
      startTime: ticle.startTime,
      endTime: ticle.endTime,
      speakerName: ticle.speakerName,
      applicantsCount: (ticle as any).applicantsCount || 0,
      createdAt: ticle.createdAt,
    }));

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      ticles: formattedTicles,
      meta: {
        page,
        take: pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }
}
