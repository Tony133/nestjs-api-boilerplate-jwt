import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';
import { AuthType } from '../login/enums/auth-type.enum';

@ApiTags('auth')
@AuthGuard(AuthType.Bearer)
@Controller('auth/change-password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Post()
  public async changePassword(
    @Res() res,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    try {
      await this.changePasswordService.changePassword(changePasswordDto);

      return res.status(HttpStatus.OK).json({
        message: 'Request Change Password Successfully!',
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Change password failed!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
