import { InstrumentsModule } from './instruments/instruments.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import TypeOrmModule from './database';
import { SendgridModule } from './mailer/sendgrid.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    InstrumentsModule, TypeOrmModule, SendgridModule, AuthModule, UsersModule, EventsModule],
})
export class AppModule { }
