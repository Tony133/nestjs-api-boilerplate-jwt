import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { User } from '../entity/User';
import { LoginRequest } from './login-request';

@Controller('api/auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(@Body() user: User, loginRequest: LoginRequest): Promise<any> {
    return this.loginService.login(user);
  }
}
