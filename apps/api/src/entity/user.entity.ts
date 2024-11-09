import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { Applicant } from './applicant.entity';
import { Ticle } from './ticle.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  nickname: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  introduce: string;

  @Column({ type: 'varchar', name: 'profile_image_url' })
  profileImageUrl: string;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'varchar', name: 'social_id' })
  socialId: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => Ticle, (ticle) => ticle.author)
  ticles: Ticle[];

  @OneToMany(() => Applicant, (applicant) => applicant.user)
  applicants: Applicant[];
}
