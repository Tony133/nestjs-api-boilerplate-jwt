import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from '../login/enums/auth-type.enum';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  public async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<any> {
    try {
      await this.registerService.register(registerUserDto);

      return {
        message: 'User registration successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not registration!');
    }
  }
}
