import { Injectable, Logger } from '@nestjs/common';
import { EventNew } from './types/EventNew.type';
import Event from '../database/entity/event.entity';
import { QueryRunner, getConnection } from 'typeorm';
import Location from '../database/entity/location.entity';
import { validate } from 'class-validator';
import ValidationErrors from 'src/errors/ValidationErrors';

@Injectable()
export class EventsService {

    async createNew(event: EventNew): Promise<Event> {
        const qR = getConnection().createQueryRunner();
        const locationO = new Location(event.location);
        const eventO = new Event(event);
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
        } finally {
            await qR.release();
        }
    }
}
