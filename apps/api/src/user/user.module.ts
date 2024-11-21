import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entity/user.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
