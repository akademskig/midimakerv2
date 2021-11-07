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
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import User from '../database/entity/user.entity';
import { QueryBuilderService } from '../utils/queryBuilder.service';
import { Connection, getConnection, createQueryBuilder } from 'typeorm';
import VerificationToken from '../database/entity/verificationToken.entity';
import { AppModule } from '../app.module';

describe('AuthService', () => {
  let service: AuthService;
  let userId;
  let vT;

  afterAll(async () => {
    await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .delete()
      .where({ email: vT.user.email })
      .execute();
  });
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
    const res = await service.register({ username: 'marta', email: 'akademski.gradjanin@gmail.com', password: 'testpassowrd123' });
    userId = res.id;
    expect(typeof res.id === 'string').toBe(true);
  });
  it('should generate verification token', async () => {
    vT = await
      createQueryBuilder('verification_token', 'vT')
        .leftJoinAndSelect('vT.user', 'user')
        .where('user.id = :id', { id: userId })
        .getOne();

    const expected = {
      token: expect.any(String),
      id: expect.any(String),
      duration: expect.any(Number),
      createdAt: expect.any(Date),
    };
    expect(vT).toEqual(
      expect.objectContaining(expected),
    );
  });
  it('should verifiy email', async () => {
    await service.verifyUser({ email: vT.user.email, token: vT.token });
    const user = await getConnection()
      .getRepository(User)
      .createQueryBuilder()
      .select()
      .where({ email: vT.user.email })
      .getOne();

    expect(user.isVerified).toEqual(true);
  });
});
