import {
  Entity,
  Index,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Ticle } from './ticle.entity';
import { User } from './user.entity';

@Entity('applicant')
@Index('idx_unique_application', ['ticle', 'user'], { unique: true })
export class Applicant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Ticle, (ticle) => ticle.id)
  @JoinColumn({ name: 'ticle_id' })
  ticle: Ticle;

  @ManyToOne(() => User, (user) => user.ticles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
