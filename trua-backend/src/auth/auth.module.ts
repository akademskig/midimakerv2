import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { CustomStrategy } from './custom.strategy';
import { AuthController } from './auth.controller';
import JwtModule from './jwt.config';
import { JwtStrategy } from './jwt.strategy';
import MailService from '../mailer/mail.service';
import {SendgridModule} from '../mailer/sendgrid.module';
import { AuthUtils } from './auth.utils';

@Module({
  imports: [ SendgridModule, UsersModule, PassportModule, JwtModule],
  providers: [AuthUtils, MailService, AuthService, CustomStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
