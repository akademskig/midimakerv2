import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import User from './entity/user.entity';
import VerificationToken from './entity/verificationToken.entity';
import Event from './entity/event.entity';
import Location from './entity/location.entity';
import Instrument from './entity/instrument.entity';
export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dbadmin',
    password: 'dbadmin#123',
    database: 'dbex',
    entities: [User, VerificationToken, Event, Location, Instrument],
    synchronize: true,
};
export default TypeOrmModule.forRoot(dbConfig);
