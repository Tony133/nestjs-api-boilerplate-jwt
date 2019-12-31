import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ForgotPasswordService } from '../forgot-password/forgot-password.service';
import { User } from '../entity/User';
import { ForgotPasswordRequest } from './forgot-password-request';

@Controller('api/auth/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  async login(@Res() res, @Body() user: ForgotPasswordRequest): Promise<any> {

  	try {

  		this.forgotPasswordService.forgotPassword(user);
  		
  		return res.status(HttpStatus.OK).json({
  			message: 'Request Reset Password Successfully!',
  			status: 200
  		});

  	} catch (err) {
  		
      return res.status(HttpStatus.BAD_REQUEST).json({
        	message: 'Error: Forgot password failed!',
        	status: 400
      });
  	}
  }
}
