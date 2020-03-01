
import { Injectable, Param, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRegister, comparePasswords } from 'src/auth/auth.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({email});
    if (user && comparePasswords(password, user.password)) {
      const { password: pwd, ...result } = user;
      return result;
    } else if (user && !comparePasswords(password, user.password)) {
      throw new UnauthorizedException('Invalid password');
    } else if (!user) {
      throw new UnauthorizedException('User doesn\'t exist!');
    }
  }
  async signIn(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      username: user.username,
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
