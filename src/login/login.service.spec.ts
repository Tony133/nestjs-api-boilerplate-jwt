import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { LoginService } from './login.service';
import { UsersService } from '../users/users.service';
import { Users } from '../users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('LoginService', () => {
  let loginService: LoginService;
  let usersService: UsersService;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        JwtService,
        ConfigService,
        {
          provide: HashingService,
          useClass: BcryptService,
        },
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findByEmail: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    usersService = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(loginService).toBeDefined();
  });
});
