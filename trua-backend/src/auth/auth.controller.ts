import { Controller, Request, Post, Get, UseGuards, Param, Query, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRegister } from './auth.utils';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req) {
        return this.authService.login(req);
    }

    @Post('/register')
    async register(@Body() user: UserRegister) {
        return this.authService.register(user);
    }
}
