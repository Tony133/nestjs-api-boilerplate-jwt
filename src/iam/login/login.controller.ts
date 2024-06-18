import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from '../login/dto/login.dto';
import {
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthType } from './enums/auth-type.enum';
import { AuthGuard } from './decorators/auth-guard.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    status: 200,
    description:
      'Authentication a user with email and password credentials and return token',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Forbidden' })
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.loginService.login(loginDto);
  }

  @Post('refresh-tokens')
  @HttpCode(200)
  @ApiOkResponse({
    status: 200,
    description: 'Refresh tokens and return new tokens',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Forbidden' })
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.loginService.refreshTokens(refreshTokenDto);
  }
}
