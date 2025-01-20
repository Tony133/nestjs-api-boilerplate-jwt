import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './iam/login/decorators/auth-guard.decorator';
import { AuthType } from './iam/login/enums/auth-type.enum';
import { ApiOkResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AuthGuard(AuthType.None)
  @Get()
  @ApiOkResponse({
    description: 'Example of a public resource',
  })
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @AuthGuard(AuthType.Bearer)
  @Get('secure')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Example of a protected resource',
  })
  getProtectedResource(): { message: string } {
    return this.appService.getSecureResource();
  }
}
