import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerService } from '../../common/mailer/mailer.service';
import { changePasswordEmail } from '../../common/mailer/mailer.constants';
import { Users } from '@/users/models/users.model';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  public async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<Users> {
    this.sendMailChangePassword(changePasswordDto).catch((err: unknown) =>
      Logger.error('Change Password: Send Mail Failed!', err),
    );

    return await this.usersService.updateByPassword(
      changePasswordDto.email,
      changePasswordDto.password,
    );
  }

  private async sendMailChangePassword(user: ChangePasswordDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Change Password successful ✔',
        text: 'Change Password successful!',
        html: changePasswordEmail(user),
      });
      Logger.log('Change Password: Send Mail successfully!', 'MailService');
    } catch (err: unknown) {
      Logger.error('Change Password: Send Mail Failed!', err);
    }
  }
}
