import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getAll(@Request() req) {
      return req.username;
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
      return req.username;
    }
}
