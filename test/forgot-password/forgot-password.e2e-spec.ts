import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { MailerService } from '../../src/shared/mailer/mailer.service';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ForgotPasswordDto } from 'src/iam/forgot-password/dto/forgot-password.dto';

const user = {
  email: 'test@example.com',
};

describe('App (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailerService)
      .useValue({
        sendMail: jest.fn(() => true),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  describe('ForgotPassowrdController (e2e) - [POST /api/auth/forgot-password]', () => {
    it('should generate a new password per user if they have forgotten their password.', () => {
      return request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send(user as ForgotPasswordDto)
        .then(({ body }) => {
          expect(body).toEqual({
            message: 'Request Reset Password Successfully!',
            status: 200,
          });
        });
    });
  });

  it('should throw an error for a bad email', () => {
    return request(app.getHttpServer())
      .post('/api/auth/forgot-password')
      .send({
        email: 'not correct',
      })
      .then(({ body }) => {
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['email must be an email'],
          statusCode: 400,
        });
        expect(HttpStatus.BAD_REQUEST);
        expect(new BadRequestException());
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
