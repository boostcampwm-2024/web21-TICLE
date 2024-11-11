import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Tag } from '@/entity/tag.entity';
import { Ticle } from '@/entity/ticle.entity';

import { CreateTicleDto } from './dto/createTicleDto';
import { TickleDetailResponseDto } from './dto/ticleDetailDto';

@Injectable()
export class TicleService {
  constructor(
    @InjectRepository(Ticle)
    private ticleRepository: Repository<Ticle>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
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

  async createNewTags(this: any, tagsToCreate: string[]) {
    if (tagsToCreate.length === 0) {
      return [];
    }

    const newTags = this.tagRepository.create(tagsToCreate.map((name) => ({ name })));
    return await this.tagRepository.save(newTags);
  }

  async getTicleByTicleId(ticleId: number): Promise<TickleDetailResponseDto> {
    const ticle = await this.ticleRepository.findOne({
      where: { id: ticleId },
      relations: {
        tags: true,
      },
    });

    if (!ticle) {
      throw new NotFoundException('티클을 찾을 수 없습니다.');
    }
    const { tags, ...ticleData } = ticle;

    return {
      ...ticleData,
      tags: tags.map((tag) => tag.name),
    };
  }
}
