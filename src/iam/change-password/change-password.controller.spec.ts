import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './dto/change-password.dto';

const changePasswordDto: ChangePasswordDto = {
  email: 'text@example.com',
  password: 'password123',
};

describe('ChangePassword Controller', () => {
  let changePasswordController: ChangePasswordController;
  let changePasswordService: ChangePasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangePasswordController],
      providers: [
        {
          provide: ChangePasswordService,
          useValue: {
            changePassword: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    changePasswordController = module.get<ChangePasswordController>(
      ChangePasswordController,
    );
    changePasswordService = module.get<ChangePasswordService>(
      ChangePasswordService,
    );
  });

  describe('Change Password', () => {
    it('should be defined', () => {
      expect(changePasswordController).toBeDefined();
    });

    it('should call method changePassword in changePasswordService', async () => {
      const createSpy = jest.spyOn(changePasswordService, 'changePassword');

      await changePasswordController.changePassword(changePasswordDto);
      expect(createSpy).toHaveBeenCalledWith(changePasswordDto);
    });

    it('should throw an exception if it not find an user email', async () => {
      changePasswordService.changePassword = jest
        .fn()
        .mockRejectedValueOnce(null);
      await expect(
        changePasswordController.changePassword({
          email: 'not a correct email',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
