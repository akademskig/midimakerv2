import { Controller, Request, UseGuards, Get, Query, Res, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }
    @Get('/')
    async getAll(@Query() query, @Res() res) {
      const users = await this.usersService.getAll(query);
      res.set('X-Total-Count', users.count);
      res.set('Access-Control-Expose-Headers', ['X-Total-Count']);
      res.send(users.data);
    }
    @Get(':id')
    async getOne(@Param() id) {
      return this.usersService.findOne(id);
    }
    @Put(':id')
    async updateOne(@Param() id, @Body() user) {
      return this.usersService.updateOne(id, user);
    }
    @Delete(':id')
    async deleteById(@Param() id) {
      return this.usersService.deleteById(id);
    }
    @Post()
    async createNew(@Body() user) {
      return this.usersService.createNew(user);
    }
}
