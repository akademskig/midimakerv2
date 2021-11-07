import { Injectable, Logger } from '@nestjs/common';
import { EventNew } from './types/EventNew.type';
import Event from '../database/entity/event.entity';
import { QueryRunner, getConnection } from 'typeorm';
import Location from '../database/entity/location.entity';
import { validate } from 'class-validator';
import ValidationErrors from 'src/errors/ValidationErrors';
import { QueryBuilderService } from '../utils/queryBuilder.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class EventsService {

    constructor(
        private readonly qbs: QueryBuilderService,
        private usersService: UsersService,
    ) { }

    async getAll(params): Promise<{ data: Event[], count: number }> {
        const query = this.qbs.buildQuery(params, 'Event');
        const res = await getConnection()
        .getRepository(Event)
        .findAndCount(query);
        const data = res[0];
        const count = res[1];
        return { data, count };
    }

    async createNew(event: EventNew, userId: string): Promise<Event> {
        const qR = getConnection().createQueryRunner();
        const locationO = new Location(event.location);
        const eventO = new Event(event);
        const user = await this.usersService.findOne({id: userId});
        eventO.owner = user;

        let errors = await validate(locationO);
        if (errors.length) {
            throw new ValidationErrors(errors);
        }
        errors = await validate(eventO);
        if (errors.length) {
            throw new ValidationErrors(errors);
        }
        try {
            await qR.startTransaction();
            const location = await qR.manager.save(locationO);
            eventO.location = location;
            const res = qR.manager.save(eventO);
            await qR.commitTransaction();
            return res;
        } catch (error) {
            await qR.rollbackTransaction();
            Logger.error('Error', JSON.stringify(error), 'EventsService');
            throw error;
        } finally {
            await qR.release();
        }
    }
}
