import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { UsersService } from '../../users/users.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { BadRequestException } from '@nestjs/common';

const registerUserDto: RegisterUserDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'password123',
};

describe('Register Controller', () => {
  let registerController: RegisterController;
  let registerService: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        RegisterService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some string'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(() => {}),
          },
        },
        {
          provide: RegisterService,
          useValue: {
            register: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    registerController = module.get<RegisterController>(RegisterController);
    registerService = module.get<RegisterService>(RegisterService);
  });

  describe('Registration user', () => {
    it('should be defined', () => {
      expect(registerController).toBeDefined();
    });

    it('should call method register in registerService', async () => {
      const createSpy = jest.spyOn(registerService, 'register');

      await registerController.register(registerUserDto);
      expect(createSpy).toHaveBeenCalledWith(registerUserDto);
    });

    it('should throw an exception if it not register fails', async () => {
      registerService.register = jest.fn().mockRejectedValueOnce(null);
      await expect(
        registerController.register({
          name: 'not a correct name',
          email: 'not a correct email',
          username: 'not a correct username',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
