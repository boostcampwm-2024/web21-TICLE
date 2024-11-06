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
@Index('idx_unique_application', ['ticle_id', 'user_id'], { unique: true })
export class Applicant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Ticle, (ticle) => ticle.id)
  @JoinColumn({ name: 'ticle_id' })
  ticle: Ticle;

  @ManyToOne(() => User, (user) => user.ticles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;
}
