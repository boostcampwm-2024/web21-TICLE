import { Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { GetUserId } from '@/common/decorator/get-userId.decorator';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@GetUserId() userId: number) {
    return await this.userService.findUserProfileByUserId(userId);
  }

  @Patch('edit/:userId')
  patchUserProfile() {}
}
