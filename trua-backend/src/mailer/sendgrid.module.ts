import { Module } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { SG_API_KEY } from '../config/index';

sgMail.setApiKey(SG_API_KEY);
@Module({
    imports: [
      SendGridModule.forRoot({
        apikey: SG_API_KEY,
      }),
    ],
  })
  export class SendgridModule {}
