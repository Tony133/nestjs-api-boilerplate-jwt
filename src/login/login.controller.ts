import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDTO } from '../login/dto/login.dto';

@Controller('api/auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  public async login(@Body() user: LoginDTO): Promise<any> {
    return await this.loginService.login(user);
  }
}
