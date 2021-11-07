import { Module } from '@nestjs/common';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import MailService from './mail.service';
import { get } from 'env-var'

require('dotenv').config()

const SG_API_KEY = get('SG_API_KEY').required().asString()

@Module({
    imports: [
      SendGridModule.forRoot({
        apikey: SG_API_KEY,
      }),
    ],
    providers: [MailService]
  })
  export class SendgridModule {}
