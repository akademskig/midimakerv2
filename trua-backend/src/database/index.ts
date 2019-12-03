import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'trvx',
    password: 'trvx-123',
    database: 'trvx',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
}
export default TypeOrmModule.forRoot(dbConfig)