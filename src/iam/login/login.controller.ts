import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from '../login/dto/login.dto';
import {
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthType } from './enums/auth-type.enum';
import { AuthGuard } from './decorators/auth-guard.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    description:
      'Authentication a user with email and password credentials and return token',
  })
  @ApiUnauthorizedResponse({ description: 'Forbidden' })
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.loginService.login(loginDto);
  }

  @Post('refresh-tokens')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Refresh tokens and return new tokens',
  })
  @ApiUnauthorizedResponse({ description: 'Forbidden' })
  public async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponse> {
    return await this.loginService.refreshTokens(refreshTokenDto);
  }
}
