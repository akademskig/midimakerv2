import { Controller, Request, UseGuards, Get, Query, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }
    // @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async getAll(@Query() query, @Res() res) {
      const users = await this.usersService.getAll(query);
      res.set('X-Total-Count', users.count);
      res.set('Access-Control-Expose-Headers', ['X-Total-Count']);
      res.send(users.data);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
      return req.username;
    }
}
