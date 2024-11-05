import { Controller, Get, Patch } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor() {}

  @Get('profile')
  profile() {
    return 'profile';
  }

  @Patch('profile')
  patchProfile() {}
}
