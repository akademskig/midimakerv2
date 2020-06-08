import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { QueryBuilderService } from '../utils/queryBuilder.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [EventsController],
  providers: [QueryBuilderService, EventsService],
})
export class EventsModule { }
