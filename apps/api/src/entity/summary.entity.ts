import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

import { Ticle } from './ticle.entity';

@Entity('summary')
export class Summary {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  source: string;

  @Column('varchar')
  summary: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Ticle, (ticle) => ticle.summary, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticle_id' })
  ticle: Ticle;
}
