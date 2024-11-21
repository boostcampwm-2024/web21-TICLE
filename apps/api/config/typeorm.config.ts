import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { Applicant } from '@/entity/applicant.entity';
import { Summary } from '@/entity/summary.entity';
import { Tag } from '@/entity/tag.entity';
import { Ticle } from '@/entity/ticle.entity';
import { User } from '@/entity/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      autoLoadEntities: true,
      synchronize: nodeEnv !== 'production',
      logging: nodeEnv !== 'production',
      supportBigNumbers: true,
      bigNumberStrings: false,
      entities: [Applicant, Summary, Tag, Ticle, User],
    };
  }
}
