import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { MailerService } from '../../src/shared/mailer/mailer.service';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from '../../src/iam/login/guards/access-token/access-token.guard';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

const users = [
  {
    id: 1,
    name: 'name #1',
    username: 'username #1',
    email: 'test1@example.com',
    password: 'pass123',
  },
];

const updateProfileUserDto = {
  name: 'name#1 update',
  username: 'username#1 update',
  email: 'test@example.it',
};

describe('App (e2e)', () => {
  let app: NestFastifyApplication;
  let accessTokenJwt: string;
  let refreshTokenJwt: string;

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

  describe('UserController (e2e)', () => {
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
    });
    describe('Get all users [GET /api/users]', () => {
      it('should get all users', async () => {
        return await request(app.getHttpServer())
          .get('/api/users')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual([
              {
                id: 1,
                name: 'name #1',
                username: 'username #1',
                email: 'test@example.com',
                password: body[0].password,
              },
            ]);
          });
      });
    });

    describe('Get one user [GET /api/users/:id]', () => {
      it('should get one user', async () => {
        return await request(app.getHttpServer())
          .get('/api/users/1')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual({
              id: 1,
              name: 'name #1',
              username: 'username #1',
              email: 'test@example.com',
              password: body.password,
            });
          });
      });

      it('should return an incorrect request if it does not find the id', async () => {
        return await request(app.getHttpServer())
          .get('/api/users/30')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .then(({ body }) => {
            expect(body).toEqual({
              error: 'Not Found',
              message: 'User #30 not found',
              statusCode: HttpStatus.NOT_FOUND,
            });
          });
      });
    });

    describe('Get one user profile [GET /api/users/:id/profile]', () => {
      it('should get one user profile', async () => {
        return await request(app.getHttpServer())
          .get('/api/users/1/profile')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual({
              user: {
                id: 1,
                name: 'name #1',
                username: 'username #1',
                email: 'test@example.com',
                password: body.user.password,
              },
              status: HttpStatus.OK,
            });
          });
      });

      it('should return an incorrect request if it does not find the user profile id', async () => {
        return await request(app.getHttpServer())
          .get('/api/users/20/profile')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    describe('Update one user profile [PUT /api/users/:id/profile]', () => {
      it('should update one user profile by id', async () => {
        return await request(app.getHttpServer())
          .put('/api/users/1/profile')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .send({
            name: 'name #1',
            username: 'username #1',
            email: 'test@example.com',
          })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual({
              message: 'User Updated successfully!',
              status: HttpStatus.OK,
            });
          });
      });

      it('should return an incorrect request if it does not find the id', async () => {
        return await request(app.getHttpServer())
          .put('/api/users/10/profile')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .send(updateProfileUserDto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
    //
    describe('Update one user [PUT /api/users/:id]', () => {
      it('should update one user', async () => {
        return await request(app.getHttpServer())
          .put('/api/users/1')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .send({
            name: 'name #1',
            username: 'username #1',
            email: 'test@example.com',
            password:
              '$2b$10$hgJzgGh2tkqqIYpIYQI9pO0Q1S9Vd.OXnJcsm1oA1nYvd9yet8sxi',
          })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual({
              message: 'User Updated successfully!',
              status: HttpStatus.OK,
            });
          });
      });

      it('should return an incorrect request if it does not find the id', async () => {
        return await request(app.getHttpServer())
          .put('/api/users/10')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .send(null)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Delete on user [DELETE /api/users/:id]', () => {
      it('should delete one user by id', async () => {
        return await request(app.getHttpServer())
          .delete('/api/users/1')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .expect(HttpStatus.OK)
          .then(() => {
            return request(app.getHttpServer())
              .get('/users/1')
              .expect(HttpStatus.NOT_FOUND);
          });
      });

      it('should return an incorrect request if it does not find the id', () => {
        return request(app.getHttpServer())
          .delete('/api/users/10')
          .set('Authorization', `Bearer ${accessTokenJwt}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
