import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../../users/models/users.model';
import { ForgotPasswordService } from './forgot-password.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/users.service';

const oneUser = {
  email: 'test@example.com',
};

const user = {
  email: 'test@example.com',
  password: 'pass123',
};

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;
  let repository: Repository<Users>;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordService,
        {
          provide: UsersService,
          useValue: {
            forgotPassword: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOneBy: jest.fn(() => oneUser),
            save: jest.fn(() => user),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(() => 'pass123'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some string'),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        UtilsService,
      ],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
    mailerService = module.get<MailerService>(MailerService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('forgot password user', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should generate a new password for user by email', async () => {
      expect(
        await service.forgotPassword({
          email: 'test@example.com',
        }),
      ).toEqual(oneUser);
    });
  });
});
