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

  describe('RegisterController (e2e) - [POST /api/auth/register]', () => {
    it('should register user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'name#1 register',
          username: 'username#1 register',
          email: 'test1@example.it',
          password: '123456789',
        })
        .expect(HttpStatus.OK);
    });

    it('should throw an error for a bad email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'name#1 register',
          username: 'username#1 register',
          password: '123456789',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should throw an error for a bad name', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'username#1 register',
          email: 'test1@example.it',
          password: '123456789',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should throw an error for a bad username', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'name#1 register',
          email: 'test1@example.it',
          password: '123456789',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should throw an error for a bad password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'name#1 register',
          username: 'username#1 register',
          email: 'test1@example.it',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
