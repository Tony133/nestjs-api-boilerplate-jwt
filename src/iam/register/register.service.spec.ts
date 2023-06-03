import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { RegisterService } from './register.service';
import { Users } from '../../users/models/users.model';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

const registerUserDto: RegisterUserDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'password123',
};

describe('RegisterService', () => {
  let service: RegisterService;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(registerUserDto),
          },
        },
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
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('Create user', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should create a user during registration', async () => {
      expect(
        await service.register({
          name: 'name #1',
          username: 'username #1',
          email: 'test@example.com',
          password: 'password123',
        }),
      ).toEqual(registerUserDto);
    });
  });
});
