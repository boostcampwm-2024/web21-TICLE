import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Tag } from '@/entity/tag.entity';
import { Ticle } from '@/entity/ticle.entity';
import { User } from '@/entity/user.entity';

import { CreateTicleDto } from './dto/createTicleDto';

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
    return await this.tagRepository.save(newTags);
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
}
