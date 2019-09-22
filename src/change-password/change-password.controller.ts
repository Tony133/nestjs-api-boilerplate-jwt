import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChangePasswordService } from '../change-password/change-password.service';
import { User } from '../entity/User';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordRequest } from './change-password-request';

@UseGuards(AuthGuard('jwt'))
@Controller('api/auth/change-password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Post()
  async login(@Body() user: ChangePasswordRequest): Promise<any> {
    return this.changePasswordService.changePassword(user);
  }
}
