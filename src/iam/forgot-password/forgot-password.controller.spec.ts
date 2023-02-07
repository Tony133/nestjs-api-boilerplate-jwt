import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { NotFoundException } from '@nestjs/common';

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

    it('should throw an exception if it finds a user', () => {
      jest
        .spyOn(forgotPasswordService, 'forgotPassword')
        .mockRejectedValueOnce(new NotFoundException());
      expect(
        forgotPasswordService.forgotPassword({ email: 'test@example.com' }),
      ).rejects.toThrow(new NotFoundException());
    });
  });
});
