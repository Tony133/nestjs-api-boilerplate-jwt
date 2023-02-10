import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from '../../shared/hashing/hashing.service';
import { LoginService } from './login.service';
import { UsersService } from '../../users/users.service';
import { Users } from '../../users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException, HttpException } from '@nestjs/common';

const oneUser = {
  id: 1,
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const loginDto: LoginDto = {
  email: 'test@example.com',
  password: 'pass123',
};

const userLogin = {
  sub: 1,
  accessToken: undefined,
  audience: 'some string',
  expiresIn: 'some string',
  issuer: 'some string',
  user: {
    id: 1,
    name: 'name #1',
    email: 'test@example.com',
  },
};

const payload = {
  id: 1,
  name: 'name #1',
  email: 'test@example.com',
};

describe('LoginService', () => {
  let loginService: LoginService;
  let usersService: UsersService;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            signToken: jest.fn(() => payload),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some string'),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(() => Promise.resolve('pass123')),
            compare: jest.fn(() => Promise.resolve(true)),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(oneUser),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findByEmail: jest.fn(),
            findOneBy: jest.fn().mockReturnValue(oneUser),
            findOne: jest.fn().mockReturnValue(oneUser),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    usersService = module.get<UsersService>(UsersService);
    hashingService = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(loginService).toBeDefined();
  });

  describe('findUserByEmail() method', () => {
    it('should find a user by email', async () => {
      expect(await loginService.findUserByEmail(loginDto)).toEqual(oneUser);
    });

    it('should generate token jwt', async () => {
      expect(await loginService.login(loginDto)).toEqual(userLogin);
    });

    it('should return an exception if wrong password', async () => {
      usersService.findByEmail = jest.fn().mockResolvedValueOnce(oneUser);
      hashingService.compare = jest.fn().mockResolvedValueOnce(false);
      await expect(
        loginService.login({
          email: 'someemail@test.com',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should return an exception if login fails', async () => {
      usersService.findByEmail = jest.fn().mockResolvedValueOnce(null);
      await expect(
        loginService.login({
          email: 'not a correct email',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(HttpException);
    });
  });
});
