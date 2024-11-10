import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from '@/entity/tag.entity';
import { Ticle, TicleStatus } from '@/entity/ticle.entity';

import { CreateTicleDto } from './dto/createTicleDto';

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
      const tags = await this.checkAndCreateTags(createTicleDto.tags);
      const newTicle = this.ticleRepository.create({
        ...createTicleDto,
        ticleStatus: TicleStatus.OPEN,
        applicants: [],
        summary: null,
        tags: tags,
      });

      return await this.ticleRepository.save(newTicle);
    } catch (error) {
      throw new Error(`Failed to create ticle `);
    }
  }

  async checkAndCreateTags(tags: string[]): Promise<Tag[]> {
    try {
      const foundTags = [];
      const toCreate = [];

      for (const tagName of tags) {
        const tag = await this.tagRepository.findOne({ where: { name: tagName } });
        if (tag) {
          foundTags.push(tag);
          continue;
        }
        toCreate.push(tagName);
      }

      for (const tagName of toCreate) {
        const tag = this.tagRepository.create({
          name: tagName,
        });
        await this.tagRepository.save(tag);
        foundTags.push(tag);
      }
      return foundTags;
    } catch (error) {
      throw new Error(`cannot process tag `);
    }
  }
}
