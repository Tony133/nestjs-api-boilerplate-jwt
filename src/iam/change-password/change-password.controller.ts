import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';
import { AuthType } from '../login/enums/auth-type.enum';

@ApiTags('auth')
@AuthGuard(AuthType.Bearer)
@Controller('auth/change-password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Post()
  @HttpCode(200)
  @ApiOkResponse({
    status: 200,
    description:
      'Request Change Password and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    try {
      await this.changePasswordService.changePassword(changePasswordDto);

      return {
        message: 'Request Change Password Successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Change password failed!');
    }
  }
}
