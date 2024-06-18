import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordService } from '../forgot-password/forgot-password.service';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';
import { AuthType } from '../login/enums/auth-type.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  @HttpCode(200)
  @ApiOkResponse({
    status: 200,
    description:
      'Request Reset Password and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  public async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    try {
      await this.forgotPasswordService.forgotPassword(forgotPasswordDto);

      return {
        message: 'Request Reset Password Successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Forgot password failed!');
    }
  }
}
