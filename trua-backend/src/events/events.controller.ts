import { Controller, Post, Body, Logger, Get, Query, Res, Req, ExecutionContext, UseGuards } from '@nestjs/common';
import { EventNew } from './types/EventNew.type';
import { validate } from 'class-validator';
import { EventsService } from './events.service';
import { getConnection } from 'typeorm';
import ValidationErrors from 'src/errors/ValidationErrors';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('events')
export class EventsController {

    constructor(
        private eventsService: EventsService,
    ) { }

    @Post()
    async createNew(@Body() event, @Req() req) {
        const eventO = new EventNew(event);
        const errors = await validate(eventO);
        if (errors.length) {
            throw new ValidationErrors(errors);
        }
        return this.eventsService.createNew(event, req.user.userId);
    }
    @Get()
    async getAll(@Query() query, @Res() res) {
        const users = await this.eventsService.getAll(query);
        res.set('X-Total-Count', users.count);
        res.set('Access-Control-Expose-Headers', ['X-Total-Count']);
        res.send(users.data);
    }
}
