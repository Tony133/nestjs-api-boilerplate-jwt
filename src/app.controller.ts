import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './iam/login/decorators/auth-guard.decorator';
import { AuthType } from './iam/login/enums/auth-type.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AuthGuard(AuthType.None)
  @Get()
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @AuthGuard(AuthType.Bearer)
  @Get('secure')
  getProtectedResource(): { message: string } {
    return this.appService.getSecureResource();
  }
}
