import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser(username); // user 태이블에 username이 있는지 확인, 있으면 user 객체 반환
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
}
