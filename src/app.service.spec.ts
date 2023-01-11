import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('App service', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('getHello() method', () => {
      it('should return message "This is a simple example of item returned by your APIs"', () => {
        expect(service.getHello()).toEqual({
          message: 'This is a simple example of item returned by your APIs.',
        });
      });
    });

    describe('getSecureResource() method', () => {
      it('should return message "Access to protected resources granted! This protected resource is displayed when the token is successfully provided"', () => {
        expect(service.getSecureResource()).toEqual({
          message:
            'Access to protected resources granted! This protected resource is displayed when the token is successfully provided.',
        });
      });
    });
  });
});
