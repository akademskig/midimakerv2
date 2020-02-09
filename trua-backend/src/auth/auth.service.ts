
import { Injectable, Param, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRegister, comparePasswords } from 'src/auth/auth.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && comparePasswords(password, user.password)) {
      const { password: pwd, ...result } = user;
      return result;
    } else if (user && !comparePasswords(password, user.password)) {
      throw new UnauthorizedException('Invalid password');
    } else if (!user) {
      return null;
    }
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: UserRegister) {
    const userCreated = await this.usersService.createNew(user);
    if (userCreated) {
      const { password, ...userData } = userCreated;
      return userData;
    }
  }
}
