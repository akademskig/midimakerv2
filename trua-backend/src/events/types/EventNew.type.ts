import User from '../../database/entity/user.entity';
import { IsNotEmpty, MaxLength, IsDate, IsDateString, IsNumber } from 'class-validator';
import Location from '../../database/entity/location.entity';
import { OwnerGuard } from '../../guards/owner.guard';

export class EventNew {

    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsNotEmpty()
    location: Location;

    @IsNotEmpty()
    @IsDate()
    startTime: Date;

    @IsDate()
    endTime: Date;

    @IsNotEmpty()
    @IsNumber()
    duration: number;

    owner: User;

    participants: User[];

    constructor(eventBody) {
        if (!eventBody) {
            return this;
        }
        const { name, location, startTime, endTime, duration, owner, participants } = eventBody;
        this.name = name;
        this.location = location;
        this.startTime =  new Date(startTime);
        this.endTime = new Date(endTime);
        this.duration = duration || this.endTime.valueOf() - this.startTime.valueOf();
        this.owner = owner;
        this.participants = participants;
    }

}
