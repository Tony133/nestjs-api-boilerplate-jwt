import { Controller, Post, Body } from '@nestjs/common';
import { ForgotPasswordService } from '../forgot-password/forgot-password.service';
import { User } from '../entity/User';
import { ForgotPasswordRequest } from './forgot-password-request';
@Controller('api/auth/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  async login(@Body() user: ForgotPasswordRequest): Promise<any> {
    return this.forgotPasswordService.forgotPassword(user);
  }
}
