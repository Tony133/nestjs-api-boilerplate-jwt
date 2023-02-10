import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { BadRequestException } from '@nestjs/common';

const forgotPasswordDto: ForgotPasswordDto = {
  email: 'test@example.com',
};

describe('ForgotPassword Controller', () => {
  let forgotPasswordController: ForgotPasswordController;
  let forgotPasswordService: ForgotPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController],
      providers: [
        {
          provide: ForgotPasswordService,
          useValue: {
            forgotPassword: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    forgotPasswordController = module.get<ForgotPasswordController>(
      ForgotPasswordController,
    );
    forgotPasswordService = module.get<ForgotPasswordService>(
      ForgotPasswordService,
    );
  });

  describe('Forgot Password', () => {
    it('should be defined', () => {
      expect(forgotPasswordController).toBeDefined();
    });

    it('should call method forgotPassword in forgotPasswordService', async () => {
      const createSpy = jest.spyOn(forgotPasswordService, 'forgotPassword');

      await forgotPasswordController.forgotPassword(forgotPasswordDto);
      expect(createSpy).toHaveBeenCalledWith(forgotPasswordDto);
    });

    it('should throw an exception if it not find an user email', async () => {
      forgotPasswordService.forgotPassword = jest
        .fn()
        .mockRejectedValueOnce(null);
      await expect(
        forgotPasswordController.forgotPassword({
          email: 'not a correct email',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
