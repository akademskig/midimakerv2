import { Controller, Request, Post, Get, UseGuards, Param, Query, Body, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRegister } from './auth.utils';
import { ValidationError } from 'class-validator';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('custom'))
    @Post('/signin')
    async login(@Request() req) {
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
}
