import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';

describe('App (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  describe('LoginController (e2e) -  [POST /api/auth/login]', () => {
    let accessTokenJwt: string;

    it('should authenticates user with valid credentials and provides a jwt token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'pass123',
        })
        .then(({ body }) => {
          accessTokenJwt = body.accessToken;
          expect(accessTokenJwt).toMatch(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
          );

          expect(body).toEqual({
            sub: 1,
            expiresIn: '3600',
            audience: '127.0.0.1:3001',
            issuer: '127.0.0.1:3001',
            accessToken: accessTokenJwt,
            user: { name: 'name #1', email: 'test@example.com', id: 1 },
          });

          expect(HttpStatus.OK);
        });
    });

    it('should fails to authenticate user with an incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.accessToken).not.toBeDefined();
    });

    it('should throw an error for a bad email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          password: 'pass123',
        })
        .then(({ body }) => {
          expect(body).toEqual({
            error: 'Bad Request',
            message: [
              'email should not be empty',
              'email must be a string',
              'email must be an email',
            ],
            statusCode: 400,
          });
          expect(HttpStatus.BAD_REQUEST);
          expect(new BadRequestException());
        });
    });

    it('should throw an error for a bad password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.it',
        })
        .then(({ body }) => {
          expect(body).toEqual({
            error: 'Bad Request',
            message: [
              'password must be shorter than or equal to 60 characters',
              'password must be a string',
              'password should not be empty',
            ],
            statusCode: 400,
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
