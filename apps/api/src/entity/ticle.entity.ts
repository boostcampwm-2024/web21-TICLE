import {
  Entity,
  Index,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TicleStatus } from '@repo/types';

import { Applicant } from './applicant.entity';
import { Summary } from './summary.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity('ticle')
@Index('idx_fulltext_search', ['title', 'content'], { fulltext: true })
export class Ticle {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.ticles)
  @JoinColumn({ name: 'speaker_id' })
  speaker: User;

  @Column({ type: 'varchar', name: 'speaker_name' })
  speakerName: string;

  @Column({ type: 'varchar', name: 'speaker_email' })
  speakerEmail: string;

  @Column({ type: 'varchar', name: 'speaker_introduce' })
  speakerIntroduce: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @Column({ type: 'timestamp', name: 'end_time' })
  endTime: Date;

  @Column({ type: 'enum', enum: TicleStatus, default: TicleStatus.OPEN, name: 'ticle_status' })
  ticleStatus: TicleStatus;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Applicant, (applicant) => applicant.ticle)
  applicants: Applicant[];

  @OneToOne(() => Summary, (summary) => summary.ticle)
  summary: Summary;

  @ManyToMany(() => Tag, (tag) => tag.ticles)
  @JoinTable({
    name: 'ticle_tag',
    joinColumn: {
      name: 'ticle_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @Column({ type: 'varchar', name: 'profile_image_url', nullable: true })
  profileImageUrl: string;
}
