import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserDto } from './dto/user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(() => {}),
            findById: jest.fn(() => userDto),
            updateUserProfile: jest.fn(() => {}),
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

        await usersController.getUser('1');
        expect(createSpy).toHaveBeenCalledWith('1');
      });

      it('should return an exception if update user fails', async () => {
        usersService.findById = jest.fn().mockResolvedValueOnce(null);
        await expect(usersController.getUser('not correct id')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateUserProfile() method', () => {
      it('should call method updateProfileUser in userService', async () => {
        const createSpy = jest.spyOn(usersService, 'updateUserProfile');

        await usersController.updateUserProfile('1', userProfileDto);
        expect(createSpy).toHaveBeenCalledWith('1', userProfileDto);
      });

      it('should return an exception if update profile user fails', async () => {
        usersService.updateUserProfile = jest.fn().mockRejectedValueOnce(null);
        await expect(
          usersController.updateUserProfile('not a correct id', {
            name: 'not a correct name',
            username: 'not a correct username',
            email: 'not a correct email',
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('updateUser() method', () => {
      it('should call method updateUser in userService', async () => {
        const createSpy = jest.spyOn(usersService, 'updateUser');

        await usersController.updateUser('1', userUpdateDto);
        expect(createSpy).toHaveBeenCalledWith('1', userUpdateDto);
      });

      it('should return an exception if update user fails', async () => {
        usersService.updateUser = jest.fn().mockRejectedValueOnce(null);
        await expect(
          usersController.updateUser('not a correct id', {
            name: 'not a correct name',
            username: 'not a correct username',
            email: 'not a correct email',
            password: 'not a correct password',
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('deleteUser() method', () => {
      it('should call method deleteUser in userService', async () => {
        const createSpy = jest.spyOn(usersService, 'deleteUser');

        await usersController.deleteUser('anyid');
        expect(createSpy).toHaveBeenCalledWith('anyid');
      });
    });
  });
});
