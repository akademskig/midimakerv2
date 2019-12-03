import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'tradmin321',
    password: 'trpass321',
    database: 'tr_user_admin',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
}
export default TypeOrmModule.forRoot(dbConfig)