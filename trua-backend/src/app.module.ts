import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import TypeOrmModule from './database';
import {SendgridModule} from './mailer/sendgrid.module';

@Module({
  imports: [TypeOrmModule, SendgridModule, AuthModule, UsersModule],
})
export class AppModule { }
