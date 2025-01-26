import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_AUTH_USER'),
        pass: this.configService.get<string>('EMAIL_AUTH_PASSWORD'),
      },
      debug: this.configService.get<boolean>('EMAIL_DEBUG'),
      logger: false,
    });
  }

  sendMail(options: any) {
    return this.nodemailerTransport.sendMail(options);
  }
}
