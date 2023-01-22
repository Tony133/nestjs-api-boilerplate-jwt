import {
  Controller,
  Put,
  Get,
  Body,
  Res,
  Param,
  UseGuards,
  HttpStatus,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { IUsers } from './interfaces/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async findAllUser(): Promise<IUsers[]> {
    return this.usersService.findAll();
  }

  @Get('/:userId')
  public async findOneUser(@Param('userId') userId: string): Promise<IUsers> {
    return this.usersService.findById(userId);
  }

  @Get('/:userId/profile')
  public async getUser(
    @Res() res,
    @Param('userId') userId: string,
  ): Promise<IUsers> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      user: user,
      status: HttpStatus.OK,
    });
  }

  @Put('/:userId/profile')
  public async updateProfileUser(
    @Res() res,
    @Param('userId') userId: string,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<any> {
    try {
      await this.usersService.updateProfileUser(userId, userProfileDto);

      return res.status(HttpStatus.OK).json({
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not updated!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put('/:userId')
  public async updateUser(
    @Res() res,
    @Param('userId') userId: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    try {
      await this.usersService.updateUser(userId, userUpdateDto);

      return res.status(HttpStatus.OK).json({
        message: 'User Updated successfully!',
        status: 200,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not updated!',
        status: 400,
      });
    }
  }

  @Delete('/:userId')
  public async deleteUser(@Param('userId') userId: string): Promise<void> {
    const user = this.usersService.deleteUser(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return user;
  }
}
