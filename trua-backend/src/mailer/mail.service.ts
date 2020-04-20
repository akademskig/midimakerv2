import { Injectable, Logger } from '@nestjs/common';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export default class MailService {
    constructor(private readonly mailer: SendGridService) { }

    public sendMail(emailAddress: string): Promise<any> {
        return this
            .mailer
            .send({
                to: emailAddress, // list of receivers
                from: 'm.susek@live.com', // sender address
                subject: 'Testing Nest MailerModule ✔', // Subject line
                text: 'welcome', // plaintext body
                html: '<b>welcome</b>', // HTML body content
            })
            .then((res) => {
                Logger.log(`Mail sent to ${emailAddress}`, 'MailService', true);
                return res;
            })
            .catch((err) => err);
    }
}
