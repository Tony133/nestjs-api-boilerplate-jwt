import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('App (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
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
    await app.getHttpAdapter().getInstance().ready();
  });

  describe('LoginController (e2e) -  [POST /api/auth/login]', () => {
    let accessTokenJwt: string;
    let refreshTokenJwt: string;

    it('should authenticates user with valid credentials and provides a jwt token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'pass123',
        })
        .then(({ body }) => {
          accessTokenJwt = body.accessToken;
          refreshTokenJwt = body.refreshToken;
          expect(accessTokenJwt).toMatch(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
          );

          expect(refreshTokenJwt).toMatch(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
          );

          expect(body).toEqual({
            refreshToken: refreshTokenJwt,
            accessToken: accessTokenJwt,
            user: { name: 'name #1', email: 'test@example.com', id: 1 },
          });

          expect(HttpStatus.OK);
        });
    });

    it('should refresh token by jwt token used', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh-tokens')
        .send({
          refreshToken: `${accessTokenJwt}`,
        })
        .then(({ body }) => {
          accessTokenJwt = body.accessToken;
          refreshTokenJwt = body.refreshToken;
          expect(accessTokenJwt).toMatch(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
          );

          expect(refreshTokenJwt).toMatch(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
          );

          expect(body).toEqual({
            refreshToken: refreshTokenJwt,
            accessToken: accessTokenJwt,
            user: { name: 'name #1', email: 'test@example.com', id: 1 },
          });

          expect(HttpStatus.OK);
        });
    });

    it('should fail if the token passed for refresh is incorrect', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh-tokens')
        .send({
          refreshTokes: 'token wrong',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.accessToken).not.toBeDefined();
    });

    it('should fails to authenticate user with an incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' })
        .expect(HttpStatus.UNAUTHORIZED);

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
