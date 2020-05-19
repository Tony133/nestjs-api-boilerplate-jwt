import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { User } from '../entity/User';

@Controller('api/auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(@Body() user: User): Promise<any> {
    return this.loginService.login(user);
  }
}
