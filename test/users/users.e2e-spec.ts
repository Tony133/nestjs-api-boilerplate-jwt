import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { MailerService } from '../../src/mailer/mailer.service';
import { HttpStatus } from '@nestjs/common';

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
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
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
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should throw an error for a bad password', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            name: 'name#1',
            username: 'username#1',
            email: 'test@example.it',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should throw an error for a bad name', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            username: 'username#1',
            password: '123456',
            email: 'test@example.it',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should throw an error for a bad username', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            name: 'name#1',
            email: 'test@example.it',
            password: '123456',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Get all users [GET /api/users]', () => {
      it('should get all users', async () => {
        return await request(app.getHttpServer())
          .get('/users')
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toBeDefined();
          });
      });
    });

    describe('Get one user [GET /api/users/:id]', () => {
      it('should get one user', async () => {
        return await request(app.getHttpServer())
          .get('/users/1')
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toBeDefined();
          });
      });

      it('should return an incorrect request if it does not find the id', () => {
        return request(app.getHttpServer())
          .get('/users/30')
          .expect(HttpStatus.BAD_REQUEST)
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
            expect(body).toBeDefined();
          });
      });

      it('should return an incorrect request if it does not find the user profile id', () => {
        return request(app.getHttpServer())
          .get('/users/20/profile')
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body).toBeDefined();
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
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body).toEqual(updateUserDto);
          });
      });
    });

    describe('Delete on user [DELETE /api/users/:id]', () => {
      it('should delete one user by id', () => {
        return request(app.getHttpServer())
          .delete('/users/3')
          .expect(HttpStatus.OK);
      });

      it('should return an incorrect request if it does not find the id', () => {
        return request(app.getHttpServer())
          .delete('/users/10')
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
