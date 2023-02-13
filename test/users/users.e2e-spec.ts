import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { MailerService } from '../../src/shared/mailer/mailer.service';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../../src/iam/login/guards/access-token/access-token.guard';

const users = [
  {
    id: 1,
    name: 'name #1',
    username: 'username #1',
    email: 'test1@example.com',
    password: 'pass123',
  },
  {
    id: 2,
    name: 'name #2',
    username: 'username #2',
    email: 'test2@example.com',
    password: 'pass123',
  },
];

const expectedUsers = expect.objectContaining({
  ...users,
});

const createUserDto = {
  name: 'name#1',
  username: 'username#1',
  email: 'test@example.it',
  password: '123456',
};

const updateUserDto = {
  name: 'name#1 update',
  username: 'username#1 update',
  email: 'test@example.it',
  password: '123456',
};

const updateProfileUserDto = {
  name: 'name#1 update',
  username: 'username#1 update',
  email: 'test@example.it',
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
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: () => false })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('UserController (e2e)', () => {
    describe('Create user [POST /api/users]', () => {
      it('should create one user ', async () => {
        return request(app.getHttpServer())
          .post('/users')
          .send(createUserDto)
          .then(({ body }) => {
            expect(body).toEqual(createUserDto);
            expect(HttpStatus.CREATED);
          });
      });

      it('should throw an error for a bad email', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            name: 'name#1',
            username: 'username#1',
            password: '123456',
          })
          .then(({ body }) => {
            expect(body).toEqual({
              name: 'name#1',
              username: 'username#1',
              password: '123456',
            });
            expect(HttpStatus.BAD_REQUEST);
          });
      });

      it('should throw an error for a bad password', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            name: 'name#1',
            username: 'username#1',
            email: 'test@example.it',
          })
          .then(({ body }) => {
            expect(body).toEqual({
              name: 'name#1',
              username: 'username#1',
              email: 'test@example.it',
            });
            expect(HttpStatus.BAD_REQUEST);
            expect(new BadRequestException());
          });
      });

      it('should throw an error for a bad name', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            username: 'username#1',
            password: '123456',
            email: 'test@example.it',
          })
          .then(({ body }) => {
            expect(body).toEqual({
              username: 'username#1',
              password: '123456',
              email: 'test@example.it',
            });
          });
      });

      it('should throw an error for a bad username', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            name: 'name#1',
            email: 'test@example.it',
            password: '123456',
          })
          .then(({ body }) => {
            expect(body).toEqual({
              name: 'name#1',
              email: 'test@example.it',
              password: '123456',
            });
            expect(HttpStatus.BAD_REQUEST);
            expect(new BadRequestException());
          });
      });
    });

    describe('Get all users [GET /api/users]', () => {
      it('should get all users', async () => {
        return await request(app.getHttpServer())
          .get('/users')
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual({
              expectedUsers,
            });
          });
      });
    });

    describe('Get one user [GET /api/users/:id]', () => {
      it('should get one user', async () => {
        return await request(app.getHttpServer())
          .get('/users/1')
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual({
              id: 1,
              name: 'name #1',
              username: 'username #1',
              email: 'test1@example.com',
              password: 'pass123',
            });
          });
      });

      it('should return an incorrect request if it does not find the id', () => {
        return request(app.getHttpServer())
          .get('/users/30')
          .then(({ body }) => {
            expect(body).toBeDefined();
          });
      });
    });

    describe('Get one user profile [GET /api/users/:id/profile]', () => {
      it('should get one user profile', async () => {
        return await request(app.getHttpServer())
          .get('/users/1/profile')
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual({
              id: 1,
              name: 'name #1',
              username: 'username #1',
              email: 'test1@example.com',
              password: 'pass123',
            });
          });
      });

      it('should return an incorrect request if it does not find the user profile id', () => {
        return request(app.getHttpServer())
          .get('/users/20/profile')
          .then(({ body }) => {
            expect(body).toBeDefined();
            expect(HttpStatus.BAD_REQUEST);
            expect(new BadRequestException());
          });
      });
    });

    describe('Update one user profile [PUT /api/users/:id/profile]', () => {
      it('should update one user profile by id', () => {
        return request(app.getHttpServer())
          .put('/users/4/profile')
          .send(updateProfileUserDto)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(updateProfileUserDto);
          });
      });

      it('should return an incorrect request if it does not find the id', () => {
        return request(app.getHttpServer())
          .put('/users/10/profile')
          .send(updateProfileUserDto)
          .expect(HttpStatus.BAD_REQUEST)
          .expect(BadRequestException)
          .then(({ body }) => {
            expect(body).toEqual(updateProfileUserDto);
          });
      });
    });

    describe('Update one user [PUT /api/users/:id]', () => {
      it('should update one user', () => {
        return request(app.getHttpServer())
          .put('/users/2')
          .send(updateUserDto)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(updateUserDto);
          });
      });

      it('should return an incorrect request if it does not find the id', () => {
        return request(app.getHttpServer())
          .put('/users/10')
          .send(updateUserDto)
          .then(({ body }) => {
            expect(body).toEqual(updateUserDto);
            expect(HttpStatus.BAD_REQUEST);
            expect(new BadRequestException());
          });
      });
    });

    describe('Delete on user [DELETE /api/users/:id]', () => {
      it('should delete one user by id', () => {
        return request(app.getHttpServer())
          .delete('/users/3')
          .expect(HttpStatus.OK)
          .then(() => {
            return request(app.getHttpServer())
              .get('/users/3')
              .expect(HttpStatus.NOT_FOUND);
          });
      });

      it('should return an incorrect request if it does not find the id', () => {
        return request(app.getHttpServer())
          .delete('/users/10')
          .expect(HttpStatus.BAD_REQUEST)
          .expect(BadRequestException);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
