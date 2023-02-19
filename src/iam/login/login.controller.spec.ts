import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

const loginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password123',
};

const refreshTokenDto: RefreshTokenDto = {
  refreshToken: 'token',
};

describe('Login Controller', () => {
  let loginController: LoginController;
  let loginService: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: {
            login: jest.fn(() => {}),
            refreshTokens: jest.fn(() => {}),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    loginController = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
  });

  describe('Login user', () => {
    it('should be defined', () => {
      expect(loginController).toBeDefined();
    });

    it('should call method login in loginService', async () => {
      const createSpy = jest.spyOn(loginService, 'login');

      await loginController.login(loginDto);
      expect(createSpy).toHaveBeenCalledWith(loginDto);
    });

    it('should call method refresh tokens in loginService', async () => {
      const createSpy = jest.spyOn(loginService, 'refreshTokens');

      await loginController.refreshTokens(refreshTokenDto);
      expect(createSpy).toHaveBeenCalledWith(refreshTokenDto);
    });
  });
});
