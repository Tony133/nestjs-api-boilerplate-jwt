import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from '../src/iam/login/guards/access-token/access-token.guard';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('App (e2e)', () => {
  let app: NestFastifyApplication;
  let accessTokenJwt: string;
  let refreshTokenJwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: () => true })
      .compile();

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

  describe('AppController (e2e)', () => {
    it('should return the follwing message: "This is a simple example of item returned by your APIs." [GET /api]', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect({
          message: 'This is a simple example of item returned by your APIs.',
        })
        .expect(HttpStatus.OK);
    });

    describe('should sign in and get a "live" JWT', () => {
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
              accessToken: accessTokenJwt,
              refreshToken: refreshTokenJwt,
              user: { name: 'name #1', email: 'test@example.com', id: 1 },
            });

            expect(HttpStatus.OK);
          });
      });

      it('should return the follwing message: "Access to protected resources granted! This protected resource is displayed when the token is successfully provided". - ( endpoint protected ) [GET /api/secure]', () => {
        return request(app.getHttpServer())
          .get('/api/secure')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .expect({
            message:
              'Access to protected resources granted! This protected resource is displayed when the token is successfully provided.',
          });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
