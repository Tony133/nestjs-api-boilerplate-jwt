import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserDto } from './dto/user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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

const userDto: UserDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'password123',
};

const userUpdateDto: UserDto = {
  name: 'name #1 update',
  username: 'username #1 update',
  email: 'test@example.com',
  password: 'password123',
};

const userProfileDto: UserProfileDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
};

describe('Users Controller', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const response = new MockResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(() => {}),
            findById: jest.fn(() => userDto),
            updateProfileUser: jest.fn(() => {}),
            updateUser: jest.fn(() => {}),
            deleteUser: jest.fn(() => userDto),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('Users Controller', () => {
    it('should be defined', () => {
      expect(usersController).toBeDefined();
    });

    describe('findAllUser() method', () => {
      it('should call method findAllUser in userService', async () => {
        const createSpy = jest.spyOn(usersService, 'findAll');

        await usersController.findAllUser();
        expect(createSpy).toHaveBeenCalled();
      });
    });

    describe('findOneUser() method', () => {
      it('should call method findOneUser in userService', async () => {
        const createSpy = jest.spyOn(usersService, 'findById');

        await usersController.findOneUser('anyid');
        expect(createSpy).toHaveBeenCalledWith('anyid');
      });
    });

    describe('findById() method', () => {
      it('should call method getUser in userService', async () => {
        const createSpy = jest.spyOn(usersService, 'findById');

        await usersController.getUser(response, '1');
        expect(createSpy).toHaveBeenCalledWith('1');
      });

      it('should throw an exception if it not find a user', () => {
        jest
          .spyOn(usersService, 'findById')
          .mockRejectedValueOnce(new NotFoundException());
        expect(usersController.getUser(response, 'anyid')).rejects.toThrow(
          new NotFoundException(),
        );
      });
    });

    describe('updateProfileUser() method', () => {
      it('should call method updateProfileUser in userService', async () => {
        const createSpy = jest.spyOn(usersService, 'updateProfileUser');

        await usersController.updateProfileUser(response, '1', userProfileDto);
        expect(createSpy).toHaveBeenCalledWith('1', userProfileDto);
      });
    });

    describe('updateUser() method', () => {
      it('should call method updateUser in userService', async () => {
        const createSpy = jest.spyOn(usersService, 'updateUser');

        await usersController.updateUser(response, '1', userUpdateDto);
        expect(createSpy).toHaveBeenCalledWith('1', userUpdateDto);
      });
    });

    describe('deleteUser() method', () => {
      it('should call method deleteUser in userService', () => {
        const createSpy = jest.spyOn(usersService, 'deleteUser');

        usersController.deleteUser('anyid');
        expect(createSpy).toHaveBeenCalledWith('anyid');
      });

      it('should throw an exception if it not find a user', () => {
        jest
          .spyOn(usersService, 'deleteUser')
          .mockRejectedValueOnce(new NotFoundException());
        expect(usersController.deleteUser('anyid')).rejects.toThrow(
          new NotFoundException(),
        );
      });
    });
  });
});
