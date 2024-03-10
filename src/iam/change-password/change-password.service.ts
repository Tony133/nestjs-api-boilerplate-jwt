import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerService } from '../../shared/mailer/mailer.service';
import { changePasswordEmail } from '../../shared/mailer/mailer.constants';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  public async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    this.sendMailChangePassword(changePasswordDto);

    return await this.usersService.updateByPassword(
      changePasswordDto.email,
      changePasswordDto.password,
    );
  }
  private sendMailChangePassword(user: ChangePasswordDto | any): void {
    try {
      this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Change Password successful ✔',
        text: 'Change Password successful!',
        html: changePasswordEmail(user),
      });
      Logger.log('[MailService] Change Password: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] Change Password: Send Mail Failed!', err);
    }
  }
}
