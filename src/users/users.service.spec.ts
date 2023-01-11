import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { UserDto } from './dto/user.dto';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

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

const updateProfileUser = {
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
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HashingService,
          useClass: BcryptService,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOne: jest.fn().mockResolvedValue(oneUser),
            findOneBy: jest.fn().mockReturnValue(oneUser),
            save: jest.fn().mockReturnValue(createUser),
            updateByEmail: jest.fn().mockResolvedValue(updateUserByEmail),
            updateByPassword: jest.fn().mockResolvedValue(updateUserByPassword),
            updateProfileUser: jest.fn().mockResolvedValue(updateProfileUser),
            update: jest.fn().mockReturnValue(updateUser),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
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
      jest
        .spyOn(service, 'findByEmail')
        .mockRejectedValueOnce(
          new NotFoundException('User test@example.com not found'),
        );
      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        new NotFoundException('User test@example.com not found'),
      );
    });
  });

  describe('findById() method', () => {
    it('should find a user by id', async () => {
      expect(await service.findById('anyid')).toEqual(oneUser);
    });

    it('should throw an exception if it not found a user by id', async () => {
      jest
        .spyOn(service, 'findById')
        .mockRejectedValueOnce(new NotFoundException('User anyid not found'));
      await expect(service.findById('anyid')).rejects.toThrow(
        new NotFoundException('User anyid not found'),
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

    it('should throw an exception if it not create a user', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new HttpException('err', HttpStatus.BAD_REQUEST),
        );
      await expect(service.create(createUser)).rejects.toThrow(
        new HttpException('err', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('updateByEmail() method', () => {
    it('should update a user by email', async () => {
      expect(await service.updateByEmail('test@example.com')).toEqual(
        updateUserByEmail,
      );
    });

    it('should throw an exception if it not update a user by email', async () => {
      jest
        .spyOn(service, 'updateByEmail')
        .mockRejectedValueOnce(
          new HttpException('err', HttpStatus.BAD_REQUEST),
        );
      await expect(service.updateByEmail('test@example.com')).rejects.toThrow(
        new HttpException('err', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('updateByPassword() method', () => {
    it('should update a user by password', async () => {
      expect(
        await service.updateByPassword('test@example.com', 'pass123'),
      ).toEqual(updateUserByPassword);
    });

    it('should throw an exception if it not update a user by password', async () => {
      jest
        .spyOn(service, 'updateByPassword')
        .mockRejectedValueOnce(
          new HttpException('err', HttpStatus.BAD_REQUEST),
        );
      await expect(
        service.updateByPassword('test@example.com', 'pass123'),
      ).rejects.toThrow(new HttpException('err', HttpStatus.BAD_REQUEST));
    });
  });

  describe('updateProfileUser() method', () => {
    it('should update profile of a user by id', async () => {
      expect(
        await service.updateProfileUser('anyid', updateProfileUser),
      ).toEqual(updateProfileUser);
    });

    it('should throw an exception if it not update a profile user', async () => {
      jest
        .spyOn(service, 'updateProfileUser')
        .mockRejectedValueOnce(
          new HttpException('err', HttpStatus.BAD_REQUEST),
        );
      await expect(
        service.updateProfileUser('anyid', updateProfileUser),
      ).rejects.toThrow(new HttpException('err', HttpStatus.BAD_REQUEST));
    });
  });

  describe('updateUser() method', () => {
    it('should update a user by id', async () => {
      expect(await service.updateUser('anyid', updateUser)).toEqual(updateUser);
    });

    it('should throw an exception if it not update a user', async () => {
      jest
        .spyOn(service, 'updateUser')
        .mockRejectedValueOnce(
          new HttpException('err', HttpStatus.BAD_REQUEST),
        );
      await expect(service.updateUser('anyid', updateUser)).rejects.toThrow(
        new HttpException('err', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('deleteUser() method', () => {
    it('should remove a user by id', async () => {
      const removeSpy = jest.spyOn(repository, 'remove');
      const user = await service.deleteUser('any id');
      expect(removeSpy).toBeCalledWith(oneUser);
      expect(user).toBeUndefined();
    });

    it('should throw an exception if it not remove a user', async () => {
      jest
        .spyOn(service, 'deleteUser')
        .mockRejectedValueOnce(
          new HttpException('err', HttpStatus.BAD_REQUEST),
        );
      await expect(service.deleteUser('anyid')).rejects.toThrow(
        new HttpException('err', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
