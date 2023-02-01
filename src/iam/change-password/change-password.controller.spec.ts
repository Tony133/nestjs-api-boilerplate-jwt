import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './dto/change-password.dto';

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

const mockJson = jest.fn().mockImplementation(() => null),
  mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson })),
  mockResponse = {
    status: mockStatus,
  };

const changePasswordDto: ChangePasswordDto = {
  email: 'text@example.com',
  password: 'password123',
};

const changePasswordDtoEmpty = {
  email: '',
  password: '',
};

describe('ChangePassword Controller', () => {
  let changePasswordController: ChangePasswordController;
  let changePasswordService: ChangePasswordService;
  const response = new MockResponse();

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

      await changePasswordController.changePassword(
        response,
        changePasswordDto,
      );
      expect(createSpy).toHaveBeenCalledWith(changePasswordDto);
    });

    it('generates an error when password and email are empty', async () => {
      try {
        await changePasswordController.changePassword(
          response,
          changePasswordDtoEmpty,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Email is required.');
        expect(error.message).toBe('Password is required.');
      }
    });

    // it('should throw if  changePassword throws', async () => {
    //   jest
    //     .spyOn(changePasswordService, 'changePassword')
    //     .mockRejectedValueOnce(new NotFoundException());
    //   await expect(
    //     changePasswordController.changePassword(
    //       response,
    //       changePasswordDtoEmpty,
    //     ),
    //   ).rejects.toThrow(new NotFoundException());
    // });
  });
});
