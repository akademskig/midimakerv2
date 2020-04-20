import { Module } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { SENDGRID_KEY } from './sendgrid.key';
import { SendGridModule } from '@anchan828/nest-sendgrid';

sgMail.setApiKey(SENDGRID_KEY);
@Module({
    imports: [
      SendGridModule.forRoot({
        apikey: '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',
      }),
    ],
  })
  export class SendgridModule {}
