import { Injectable } from '@nestjs/common';
import { createTransport, SendMailOptions } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor() {
    this.nodemailerTransport = createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587, // default 587
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD,
      },
      debug: process.env.EMAIL_DEBUG === 'true',
      logger: false,
    });
  }

  sendMail(options: SendMailOptions) {
    return this.nodemailerTransport.sendMail(options);
  }
}
