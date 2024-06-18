import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

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
