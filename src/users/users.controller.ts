import {
  Controller,
  Put,
  Get,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { AccountsUsers } from './interfaces/accounts-users.interface';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../iam/login/decorators/auth-guard.decorator';
import { AuthType } from '../iam/login/enums/auth-type.enum';

@ApiTags('users')
@AuthGuard(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
  })
  public async findAllUser(): Promise<AccountsUsers[]> {
    return this.usersService.findAll();
  }

  @Get('/:userId')
  @ApiResponse({
    status: 200,
    description: 'Get a user by id',
  })
  @ApiNotFoundResponse({ status: 400, description: 'User not found' })
  public async findOneUser(
    @Param('userId') userId: string,
  ): Promise<AccountsUsers> {
    return this.usersService.findById(userId);
  }

  @Get('/:userId/profile')
  @ApiResponse({
    status: 200,
    description: 'Get a user profile by id',
  })
  @ApiNotFoundResponse({ status: 400, description: 'User not found' })
  public async getUser(@Param('userId') userId: string): Promise<any> {
    const user = await this.findOneUser(userId);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return {
      user: user,
      status: HttpStatus.OK,
    };
  }

  @Put('/:userId/profile')
  @ApiResponse({
    status: 200,
    description: 'Update a user profile by id',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'User profile not updated',
  })
  public async updateUserProfile(
    @Param('userId') userId: string,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<any> {
    try {
      await this.usersService.updateUserProfile(userId, userProfileDto);

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Put('/:userId')
  @ApiResponse({
    status: 200,
    description: 'Update a user by id',
  })
  @ApiBadRequestResponse({ status: 400, description: 'User not updated' })
  public async updateUser(
    @Param('userId') userId: string,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<any> {
    try {
      await this.usersService.updateUser(userId, userUpdateDto);

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Delete('/:userId')
  @ApiResponse({
    status: 200,
    description: 'Delete a user by id',
  })
  @ApiNoContentResponse({ status: 404, description: 'User not deleted' })
  public async deleteUser(@Param('userId') userId: string): Promise<void> {
    await this.usersService.deleteUser(userId);
  }
}
