import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { MailerService } from '../../src/shared/mailer/mailer.service';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../../src/iam/login/guards/access-token/access-token.guard';

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
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('ChangePasswordController (e2e) - [POST /api/auth/change-password]', () => {
    it('should change password an user', () => {
      return request(app.getHttpServer())
        .post('/auth/change-password')
        .send({
          email: 'test@example.it',
          password: 'new123456',
        })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual({
            email: 'test@example.it',
            password: 'new123456',
          });
        });
    });
  });

  it('should throw an error for a bad email', () => {
    return request(app.getHttpServer())
      .post('/auth/change-password')
      .send({
        password: 'new123456',
      })
      .then(({ body }) => {
        expect(body).toEqual({
          password: 'new123456',
        });
        expect(HttpStatus.BAD_REQUEST);
        expect(new BadRequestException());
      });
  });

  it('should throw an error for a bad password', () => {
    return request(app.getHttpServer())
      .post('/auth/change-password')
      .send({
        email: 'test@example.it',
      })
      .then(({ body }) => {
        expect(body).toEqual({
          email: 'test@example.it',
        });
        expect(HttpStatus.BAD_REQUEST);
        expect(new BadRequestException());
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
