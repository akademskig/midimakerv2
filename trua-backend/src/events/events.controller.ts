import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EventNew } from './types/EventNew.type';
import { validate } from 'class-validator';
import { EventsService } from './events.service';
import { getConnection } from 'typeorm';

@Controller('events')
export class EventsController {

    constructor(
        private eventsService: EventsService,
    ) { }

    @Post()
    async createNew(@Body() event: EventNew) {
        return this.eventsService.createNew(event);
    }
}
