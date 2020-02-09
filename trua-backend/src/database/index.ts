import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import User from './entity/user.entity';
const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dbadmin',
    password: 'dbpass#123',
    database: 'dbex',
    entities: [User],
    synchronize: true,
};
export default TypeOrmModule.forRoot(dbConfig);
