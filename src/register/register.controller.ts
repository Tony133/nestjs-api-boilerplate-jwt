import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { User } from '../entity/User';
import { RegisterUserRequest } from './register-user-request';

@Controller('api/auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(@Res() res, @Body() user: RegisterUserRequest): Promise<any> {

  	try {
    	
    	this.registerService.register(user);
  		
  		return res.status(HttpStatus.OK).json({
  			message: 'User registration successfully!',
  			status: 200
  		});

  	} catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not registration!',
        status: 400
      });
  	}	
  }
}
