import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import JwtModule from './jwt.config';
import { UsersService } from '../users/users.service';
import MailService from '../../dist/mailer/mail.service';
import { AuthUtils } from './auth.utils';
import { SendgridModule } from '../mailer/sendgrid.module';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { CustomStrategy } from './custom.strategy';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../database/entity/user.entity';
import { QueryBuilderService } from '../utils/queryBuilder.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SendgridModule, PassportModule, JwtModule],
      providers: [UsersService, QueryBuilderService, AuthUtils, MailService, AuthService, CustomStrategy, JwtStrategy, {
        provide: getRepositoryToken(User),
        useValue: 'UserRepository',
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
