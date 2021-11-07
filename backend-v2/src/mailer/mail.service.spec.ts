import { Test, TestingModule } from '@nestjs/testing';
import MailService from './mail.service';
import {SendgridModule} from './sendgrid.module';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SendgridModule],
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run', async () => {
    const emailAddress = 'akademski.gradjanin@gmail.com';
    const res = await service.sendMail(emailAddress, "ssd");
    expect(res[0].statusCode).toBe(202);
  });
});
