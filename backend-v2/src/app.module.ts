import { MidiFileModule } from './midiFile/midifile.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SendgridModule } from './mailer/sendgrid.module';
import TypeOrmModule from './database';

@Module({
  imports: [
    TypeOrmModule,
    MidiFileModule,
    InstrumentsModule, SendgridModule, AuthModule, UsersModule, MidiFileModule],
})
export class AppModule { }
