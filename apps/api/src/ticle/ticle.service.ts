import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Tag } from '@/entity/tag.entity';
import { Ticle, TicleStatus } from '@/entity/ticle.entity';
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
      throw new HttpException(`Failed to create ticle `, HttpStatus.BAD_REQUEST);
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

  async applyTicle(ticleId: number, applicantId: number) {
    const ticle = await this.ticleRepository.findOne({ where: { id: ticleId } });
    if (!ticle) {
      throw new HttpException(`Cannot found ticle`, HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: { id: applicantId },
    });

    if (!user) {
      throw new HttpException(`Cannot found user`, HttpStatus.NOT_FOUND);
    }

    const existingApplication = await this.applicantRepository.exists({
      where: {
        ticle: { id: ticleId },
        user: { id: applicantId },
      },
    });

    if (existingApplication) {
      throw new HttpException('Already applied to this ticle', HttpStatus.BAD_REQUEST);
    }

    const newApplicant = this.applicantRepository.create({
      ticle,
      user,
    });

    await this.applicantRepository.save(newApplicant);

    return {
      status: 'success',
      message: 'Successfully applied to ticle',
    };
  }
}
