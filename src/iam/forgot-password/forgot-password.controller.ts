import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ForgotPasswordService } from '../forgot-password/forgot-password.service';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';
import { AuthType } from '../login/enums/auth-type.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

interface ForgotPasswordResponse {
  message: string;
  status: number;
}

@ApiTags('auth')
@ApiBearerAuth()
@AuthGuard(AuthType.None)
@Controller('auth/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Request Reset Password' })
  @ApiOkResponse({
    description:
      'Request Reset Password and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
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
