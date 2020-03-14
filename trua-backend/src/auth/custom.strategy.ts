import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req): Promise<any> {
    const {email, password} = req.body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
