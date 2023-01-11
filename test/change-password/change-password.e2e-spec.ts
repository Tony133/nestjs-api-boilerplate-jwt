import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { MailerService } from '../../src/mailer/mailer.service';
import { HttpStatus } from '@nestjs/common';

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
      .overrideGuard(AuthGuard('jwt'))
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
        .expect(HttpStatus.OK);
    });
  });

  it('should throw an error for a bad email', () => {
    return request(app.getHttpServer())
      .post('/auth/change-password')
      .send({
        password: 'new123456',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should throw an error for a bad password', () => {
    return request(app.getHttpServer())
      .post('/auth/change-password')
      .send({
        email: 'test@example.it',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    await app.close();
  });
});
