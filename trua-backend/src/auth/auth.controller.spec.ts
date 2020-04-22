import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SendgridModule } from '../mailer/sendgrid.module';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import JwtModule from '../auth/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { CustomStrategy } from './custom.strategy';
import MailService from '../../dist/mailer/mail.service';
import { AuthUtils } from './auth.utils';
import { QueryBuilderService } from '../utils/queryBuilder.service';
import User from '../database/entity/user.entity';
import { getRepositoryToken  } from '@nestjs/typeorm';
import VerificationToken from '../database/entity/verificationToken.entity';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SendgridModule, PassportModule, JwtModule],
      providers: [UsersService, QueryBuilderService, AuthUtils, MailService, AuthService, CustomStrategy, JwtStrategy, {
        provide: getRepositoryToken(User),
        useValue: 'UserRepository',
      },
       {
        provide: getRepositoryToken(VerificationToken),
        useValue: 'VerificationTokenRepository',
      },
     ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
