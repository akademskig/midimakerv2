import User from '../../database/entity/user.entity';
import { IsNotEmpty, MaxLength, IsDate, IsDateString, IsNumber } from 'class-validator';
import Location from '../../database/entity/location.entity';

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
    duration: Date;

    @IsNotEmpty()
    owner: User;

    participants: User[];

}
