import { Controller, Request, Post, Get, UseGuards, Param, Query, Body, Logger, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ValidationError } from 'class-validator';
import { UserRegister } from '../users/types/UserRegister.type';
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
    @Put('/changePassword/:id')
    async changePassword(@Param() id, @Body() passwords){
        try {
            return this.authService.updatePassword(id, passwords);
        } catch (error) {
            Logger.error('Error', JSON.stringify(error), 'AuthController');
        }
    }
}
