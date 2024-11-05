import { Controller, Get, Patch } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor() {}

  @Get('profile')
  getUserProfile() {}

  @Patch('profile')
  patchUserProfile() {}
}
