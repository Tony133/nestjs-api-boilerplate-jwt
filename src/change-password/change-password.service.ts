import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../entity/User';
import { ChangePasswordRequest } from './change-password-request';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class ChangePasswordService {
  constructor(private readonly userService: UserService, private readonly mailerService: MailerService) {}

  public async changePassword(user: ChangePasswordRequest): Promise<any> {

  	this.sendMailChangePassword(user);

    return this.userService.updateByPassword(user.email, user.password);
  }

  private sendMailChangePassword(user): void {
  	  this
	    .mailerService
	    .sendMail({
	      to: user.email,
	      from: 'from@example.com',
	      subject: 'Change Password successful ✔',
	      text: 'Change Password successful!',
	      html: 'Change Password Successfully! ✔, This is your new password: <b>' + user.password +'</b>',
	    })
	    .then(() => {})
	    .catch(() => {});
  }
}
