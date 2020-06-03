import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { QueryBuilderService } from '../utils/queryBuilder.service';

@Module({
  controllers: [EventsController],
  providers: [QueryBuilderService, EventsService],
})
export class EventsModule { }
