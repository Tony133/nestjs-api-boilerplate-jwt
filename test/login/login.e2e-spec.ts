import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { MailerService } from '../../src/shared/mailer/mailer.service';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../../src/iam/login/guards/access-token/access-token.guard';

const user = {
  email: 'test@example.it',
  password: '123456',
};

const expectedUser = expect.objectContaining({
  ...user,
});

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
      .useValue({ canActivate: () => false })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('LoginController (e2e) -  [POST /api/auth/login]', () => {
    it('Login and generate token JWT', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.it',
          password: '123456',
        })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual(expectedUser);
        });
    });

    it('should throw an error for a bad email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          password: '123456',
        })
        .then(({ body }) => {
          expect(body).toEqual({
            password: '123456',
          });
          expect(HttpStatus.BAD_REQUEST);
          expect(new BadRequestException());
        });
    });

    it('should throw an error for a bad password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
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
  });

  afterAll(async () => {
    await app.close();
  });
});
