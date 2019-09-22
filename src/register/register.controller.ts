import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { User } from '../entity/User';
import { RegisterUserRequest } from './register-user-request';

@Controller('api/auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(@Body() user: RegisterUserRequest): Promise<any> {
    return this.registerService.register(user);
  }
}
