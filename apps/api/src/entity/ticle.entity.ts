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

import { Applicant } from './applicant.entity';
import { Summary } from './summary.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

enum TicleStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity('ticle')
@Index('idx_fulltext_search', ['title', 'content'], { fulltext: true })
export class Ticle {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.ticles)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'timestamp', nullable: false, name: 'start_time' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: false, name: 'end_time' })
  endTime: Date;

  @Column({ type: 'enum', enum: TicleStatus, default: TicleStatus.OPEN, name: 'ticle_status' })
  ticleStatus: TicleStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
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
}
