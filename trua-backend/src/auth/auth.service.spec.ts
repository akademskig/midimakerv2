import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import JwtModule from './jwt.config';
import { UsersService } from '../users/users.service';
import MailService from '../mailer/mail.service';
import { AuthUtils } from './auth.utils';
import { SendgridModule } from '../mailer/sendgrid.module';
import { PassportModule } from '@nestjs/passport';
import { CustomStrategy } from './custom.strategy';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import User from '../database/entity/user.entity';
import { QueryBuilderService } from '../utils/queryBuilder.service';
import { Repository, Connection, getConnection } from 'typeorm';
import VerificationToken from '../database/entity/verificationToken.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { createConnection } from 'typeorm';
import { async } from 'rxjs/internal/scheduler/async';
import { AppModule } from '../app.module';

describe('AuthService', () => {
  let service: AuthService;
  let userId;
  const UserRepository: Repository<User> = null;
  const TokenRepository: Repository<VerificationToken> = null;
  let connection: Connection;
  const dbConfig: TypeOrmModuleOptions = {
    name: 'testconnection',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dbadmin',
    password: 'dbpass#123',
    database: 'dbex',
    entities: [User, VerificationToken],
    synchronize: true,
};

  it('should be defined', async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, SendgridModule, PassportModule, JwtModule, TypeOrmModule.forFeature([VerificationToken])],
      providers: [Connection, UsersService, QueryBuilderService, AuthUtils, MailService, AuthService, CustomStrategy, JwtStrategy, {
        provide: getRepositoryToken(User),
        useValue: 'UserRepository',
      },
      {
        provide: getRepositoryToken(VerificationToken),
        useValue: 'VerificationTokenRepository',
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
     const res = await service.register({username: 'marta', email: 'akademski.gradjanin@gmail.com', password: 'testpassowrd123'});
     userId = res.id;
     expect(typeof res.id === 'string').toBe(true);
  });
  it('should generate verification token', async () => {
    const data = await getConnection()
    .getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.verificationToken', 'verificationToken')
    .where({id: userId})
    .getOne();

    const expected = {
      token: expect.any(String),
      id: expect.any(String),
      duration: expect.any(Number),
      createdAt: expect.any(Date),
  };
    expect(data.verificationToken).toEqual(
      expect.objectContaining(expected),
    );
});
});
