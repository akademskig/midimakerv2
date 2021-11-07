import { Controller, Request, Post, Get, UseGuards, Param, Query, Body, Logger, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRegister } from '../users/types/UserRegister.type';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('custom'))
    @Post('/signin')
    async login(@Request() req) {
        console.log('signin')
        return this.authService.signIn(req.user);
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
