import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { UsersTypeOrmRepository } from './repositories/implementations/users.typeorm.repository';
import { USERS_REPOSITORY_TOKEN } from './repositories/users.repository.interface';

const userArray = [
  {
    id: 1,
    name: 'name #1',
    username: 'username #1',
    email: 'test1@example.com',
    password: 'pass123',
  },
  {
    id: 2,
    name: 'name #2',
    username: 'username #2',
    email: 'test2@example.com',
    password: 'pass123',
  },
];

const oneUser = {
  id: 1,
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const createUser: UserDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const updateUserByEmail = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const updateUserByPassword = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const updateUserProfile = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const updateUser = {
  id: 1,
  name: 'name #1 update',
  username: 'username #1 update',
  email: 'test@example.com',
  password: 'pass123',
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersTypeOrmRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HashingService,
          useClass: BcryptService,
        },
        {
          provide: USERS_REPOSITORY_TOKEN,
          useValue: {
            findAll: jest.fn().mockResolvedValue(userArray),
            findByEmail: jest.fn().mockResolvedValue(oneUser),
            findBySub: jest.fn().mockResolvedValueOnce(oneUser),
            findById: jest.fn().mockResolvedValueOnce(oneUser),
            create: jest.fn().mockReturnValue(createUser),
            updateByEmail: jest.fn().mockReturnValue(updateUserByEmail),
            updateByPassword: jest.fn().mockResolvedValue(updateUserByPassword),
            updateUserProfile: jest.fn().mockResolvedValue(updateUserProfile),
            updateUser: jest.fn().mockResolvedValue(updateUser),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(USERS_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll() method', () => {
    it('should return an array of all users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(userArray);
    });
  });

  describe('findByEmail() method', () => {
    it('should find a user by email', async () => {
      expect(await service.findByEmail('test@example.com')).toEqual(oneUser);
    });

    it('should throw an exception if it not found a user by email', async () => {
      repository.findByEmail = jest.fn().mockResolvedValueOnce(null);
      await expect(service.findByEmail('not a correct email')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySub() method', () => {
    it('should find a user by sub or fail', async () => {
      expect(await service.findBySub(1)).toEqual(oneUser);
    });

    it('should throw an exception if it not found a user by sub', async () => {
      repository.findBySub = jest.fn().mockResolvedValueOnce(null);
      await expect(service.findBySub(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById() method', () => {
    it('should find a user by id', async () => {
      expect(await service.findById('anyid')).toEqual(oneUser);
    });

    it('should throw an exception if it not found a user by id', async () => {
      repository.findById = jest.fn().mockResolvedValueOnce(null);
      await expect(service.findById('not a correct id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create() method', () => {
    it('should create a new user', async () => {
      expect(
        await service.create({
          name: 'name #1',
          username: 'username #1',
          email: 'test@example.com',
          password: 'pass123',
        }),
      ).toEqual(createUser);
    });

    it('should return an exception if login fails', async () => {
      repository.create = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.create({
          name: 'not a correct name',
          username: 'not a correct username',
          email: 'not a correct email',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateByEmail() method', () => {
    it('should update a user by email', async () => {
      expect(await service.updateByEmail('test@example.com')).toEqual(
        updateUserByEmail,
      );
    });

    it('should return an exception if update by email fails', async () => {
      repository.updateByEmail = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.updateByEmail('not a correct email'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateByPassword() method', () => {
    it('should update a user by password', async () => {
      expect(
        await service.updateByPassword('test@example.com', 'pass123'),
      ).toEqual(updateUserByPassword);
    });

    it('should return an exception if update by password fails', async () => {
      repository.updateByPassword = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.updateByPassword('not a correct email', 'not correct password'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateUserProfile() method', () => {
    it('should update profile of a user by id', async () => {
      expect(
        await service.updateUserProfile('anyid', updateUserProfile),
      ).toEqual(updateUserProfile);
    });

    it('should return an exception if update profile user fails', async () => {
      repository.updateUserProfile = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.updateUserProfile('not a correct id', {
          name: 'not a correct name',
          username: 'not a correct username',
          email: 'not a correct email',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateUser() method', () => {
    it('should update a user by id', async () => {
      expect(await service.updateUser('anyid', updateUser)).toEqual(updateUser);
    });

    it('should return an exception if update profile user fails', async () => {
      repository.updateUser = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.updateUser('not a correct id', {
          name: 'not a correct name',
          username: 'not a correct username',
          email: 'not a correct email',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteUser() method', () => {
    it('should remove a user by id', async () => {
      const removeSpy = jest.spyOn(repository, 'deleteUser');
      const user = await service.deleteUser('any id');
      expect(removeSpy).toHaveBeenCalledWith(oneUser);
      expect(user).toBeUndefined();
    });

    it('should throw an error if no user is found with an id', async () => {
      repository.findById = jest.fn().mockResolvedValueOnce(undefined);
      await expect(service.deleteUser('bad id')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
