import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

class MockResponse {
  res: any;
  constructor() {
    this.res = {};
  }
  status = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((code) => {
      this.res.code = code;
      return this;
    });
  send = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((message) => {
      this.res.message = message;
      return this;
    });
  json = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((json) => {
      this.res.json = json;
      return this;
    });
}

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  const response = new MockResponse();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn(() => {}),
            getSecureResource: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should call method getHello() in AppService', () => {
      const createSpy = jest.spyOn(appService, 'getHello');

      appController.getHello();
      expect(createSpy).toHaveBeenCalled();
    });

    it('should call method getProtectedResource() in AppService', () => {
      const createSpy = jest.spyOn(appService, 'getSecureResource');

      appController.getProtectedResource();
      expect(createSpy).toHaveBeenCalled();
    });
  });
});
