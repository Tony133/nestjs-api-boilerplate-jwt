import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { MailerService } from '../../src/shared/mailer/mailer.service';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from '../../src/users/dto/user.dto';
import { HashingService } from '../../src/shared/hashing/hashing.service';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

const user = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

describe('App (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(() => 'pass123'),
          },
        },
      ],
    })
      .overrideProvider(MailerService)
      .useValue({
        sendMail: jest.fn(() => true),
      })
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

  describe('RegisterController (e2e) - [POST /api/auth/register]', () => {
    it('should register user', async () => {
      return await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(user as UserDto)
        .then(({ body }) => {
          expect(body).toEqual({
            message: 'User registration successfully!',
            status: 201,
          });
          expect(HttpStatus.CREATED);
        });
    });

    it('should throw an error for a bad email', async () => {
      return await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'name#1 register',
          username: 'username#1 register',
          password: '123456789',
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

    it('should throw an error for a bad name', async () => {
      return await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'username#1 register',
          email: 'test@example.it',
          password: '123456789',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body).toEqual({
            error: 'Bad Request',
            message: [
              'name must be shorter than or equal to 30 characters',
              'name must be a string',
            ],
            statusCode: 400,
          });
          expect(new BadRequestException());
        });
    });

    it('should throw an error for a bad username', async () => {
      return await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'name#1 register',
          email: 'test@example.it',
          password: '123456789',
        })
        .then(({ body }) => {
          expect(body).toEqual({
            error: 'Bad Request',
            message: [
              'username must be shorter than or equal to 40 characters',
              'username must be a string',
            ],
            statusCode: 400,
          });
          expect(HttpStatus.BAD_REQUEST);
          expect(new BadRequestException());
        });
    });

    it('should throw an error for a bad password', async () => {
      return await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'name#1 register',
          username: 'username#1 register',
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
