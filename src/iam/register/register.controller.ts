import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthType } from '../login/enums/auth-type.enum';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @HttpCode(201)
  @ApiOkResponse({
    status: 201,
    description:
      'Register a new user and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
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
