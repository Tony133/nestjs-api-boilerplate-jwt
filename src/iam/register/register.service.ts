import { Injectable, Logger } from '@nestjs/common';
import { HashingService } from '../../common/hashing/hashing.service';
import { MailerService } from '../../common/mailer/mailer.service';
import { AccountsUsers } from '../../users/interfaces/accounts-users.interface';
import { UsersService } from '../../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { registrationEmail } from '../../common/mailer/mailer.constants';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly hashingService: HashingService,
  ) {}

  public async register(
    registerUserDto: RegisterUserDto,
  ): Promise<AccountsUsers> {
    registerUserDto.password = await this.hashingService.hash(
      registerUserDto.password,
    );

    this.sendMailRegisterUser(registerUserDto).catch((err: unknown) =>
      Logger.error('Send mail failed but continuing registration', err),
    );

    return this.usersService.create(registerUserDto);
  }

  private async sendMailRegisterUser(user: RegisterUserDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        html: registrationEmail(user),
      });
      Logger.log('User Registration: Send Mail successfully!', 'MailService');
    } catch (err: unknown) {
      Logger.error('User Registration: Send Mail failed!', err);
    }
  }
}
