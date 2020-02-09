import { Controller, Request, Post, Get, UseGuards, Param, Query, Body, Logger } from '@nestjs/common';
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
        try {
            return this.authService.register(user);
        } catch (error) {
            Logger.error('Error', JSON.stringify(error), 'AuthController');
        }
    }
}
