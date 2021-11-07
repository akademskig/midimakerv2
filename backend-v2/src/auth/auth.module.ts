import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { CustomStrategy } from './custom.strategy';
import { AuthController } from './auth.controller';
import JwtModule from './jwt.config';
import { JwtStrategy } from './jwt.strategy';
import MailService from '../mailer/mail.service';
import { SendgridModule } from '../mailer/sendgrid.module';
import { AuthUtils } from './auth.utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import VerificationToken from '../database/entity/verificationToken.entity';

@Module({
  imports: [SendgridModule, UsersModule, PassportModule, JwtModule, TypeOrmModule.forFeature([VerificationToken])],
  providers: [AuthUtils, MailService, AuthService, CustomStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
