import { Controller, Post, Body, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ChangePasswordService } from '../change-password/change-password.service';
import { User } from '../entity/User';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordRequest } from './change-password-request';

@UseGuards(AuthGuard('jwt'))
@Controller('api/auth/change-password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Post()
  async login(@Res() res, @Body() user: ChangePasswordRequest): Promise<any> {

  	try {

    	this.changePasswordService.changePassword(user);
  		
  		return res.status(HttpStatus.OK).json({
  			message: 'Request Change Password Successfully!',
  			status: 200
  		});

  	} catch (err) {
  		
      return res.status(HttpStatus.BAD_REQUEST).json({
        	message: 'Error: Change password failed!',
        	status: 400
      });
  	}
  }
}
