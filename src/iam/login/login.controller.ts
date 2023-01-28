import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from '../login/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from './enums/auth-type.enum';
import { AuthGuard } from './decorators/auth-guard.decorator';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.loginService.login(loginDto);
  }
}
