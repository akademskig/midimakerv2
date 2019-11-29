import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'test',
    password: 'test',
    database: 'trvx',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
}
export default TypeOrmModule.forRoot(dbConfig)