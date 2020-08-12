import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDTO } from './dto/register-user.dto';

@Controller('api/auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  public async register(
    @Res() res,
    @Body() registerUserDto: RegisterUserDTO,
  ): Promise<any> {
    try {
      await this.registerService.register(registerUserDto);

      return res.status(HttpStatus.OK).json({
        message: 'User registration successfully!',
        status: 200,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not registration!',
        status: 400,
      });
    }
  }
}
