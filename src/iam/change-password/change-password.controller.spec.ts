import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordController } from './change-password.controller';

describe('ChangePassword Controller', () => {
  let controller: ChangePasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangePasswordController],
    }).compile();

    controller = module.get<ChangePasswordController>(ChangePasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
