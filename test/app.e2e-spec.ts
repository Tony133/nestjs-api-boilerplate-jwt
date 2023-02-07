import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../src/iam/login/guards/access-token/access-token.guard';

describe('App (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('AppController (e2e)', () => {
    it('Endpoint [GET /api]', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(HttpStatus.OK)
        .expect({
          message: 'This is a simple example of item returned by your APIs.',
        });
    });

    it('Endpoint secure [GET /api/secure]', () => {
      return request(app.getHttpServer())
        .get('/secure')
        .expect(HttpStatus.OK)
        .expect({
          message:
            'Access to protected resources granted! This protected resource is displayed when the token is successfully provided.',
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
