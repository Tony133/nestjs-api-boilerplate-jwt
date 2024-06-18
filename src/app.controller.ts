import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './iam/login/decorators/auth-guard.decorator';
import { AuthType } from './iam/login/enums/auth-type.enum';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AuthGuard(AuthType.None)
  @Get()
  @ApiOkResponse({
    status: 200,
    description: 'Example of a public resource',
  })
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @AuthGuard(AuthType.Bearer)
  @Get('secure')
  @ApiOkResponse({
    status: 200,
    description: 'Example of a protected resource',
  })
  getProtectedResource(): { message: string } {
    return this.appService.getSecureResource();
  }
}
