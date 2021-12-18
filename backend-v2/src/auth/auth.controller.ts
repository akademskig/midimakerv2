import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Param,
  Query,
  Body,
  Logger,
  Put,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRegister } from '../users/types/UserRegister.type';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('custom'))
  @Post('/signin')
  async login(@Request() req, @Res() res) {
    const user = await this.authService.signIn(req.user);
    res.cookie('mm_auth_token', (user).accessToken)
    res.send(user)
  }

  @Post('/register')
  async register(@Body() user: UserRegister) {
    try {
      return this.authService.register(user);
    } catch (error) {
      Logger.error('Error', JSON.stringify(error), 'AuthController');
    }
  }
  @Get('/verify_email')
  async verifyEmail(@Query() { email, token }) {
    try {
      return this.authService.verifyUser({ email, token });
    } catch (error) {
      Logger.error('Error', JSON.stringify(error), 'AuthController');
    }
  }
}
