import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Applicant } from './applicant.entity';
import { Ticle } from './ticle.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  @Index('UQ_user_username', { unique: true })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  nickname: string;

  @Column({ type: 'varchar' })
  @Index('UQ_user_email', { unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  introduce: string;

  @Column({ type: 'varchar', name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  @Column({ type: 'varchar', default: 'local' })
  provider: string;

  @Column({ type: 'varchar', name: 'social_id', nullable: true })
  socialId: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => Ticle, (ticle) => ticle.speaker)
  ticles: Ticle[];

  @OneToMany(() => Applicant, (applicant) => applicant.user)
  applicants: Applicant[];
}
