import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import User from './entity/user.entity';
import VerificationToken from './entity/verificationToken.entity';
export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dbadmin',
    password: 'dbpass#123',
    database: 'dbex',
    entities: [User, VerificationToken],
    synchronize: true,
};
export default TypeOrmModule.forRoot(dbConfig);
