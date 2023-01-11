import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { UsersService } from '../users/users.service';
import { MailerService } from '../shared/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.dto';

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

const registerUserDto: RegisterUserDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'password123',
};

describe('Register Controller', () => {
  let registerController: RegisterController;
  let registerService: RegisterService;
  const response = new MockResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        RegisterService,
        MailerService,
        ConfigService,
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

      await registerController.register(response, registerUserDto);
      expect(createSpy).toHaveBeenCalledWith(registerUserDto);
    });
  });
});
