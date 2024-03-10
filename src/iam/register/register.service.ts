import { Injectable, Logger } from '@nestjs/common';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { AccountsUsers } from '../../users/interfaces/accounts-users.interface';
import { UsersService } from '../../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { registrationEmail } from '../../shared/mailer/mailer.constants';

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

    this.sendMailRegisterUser(registerUserDto);

    return this.usersService.create(registerUserDto);
  }

  private sendMailRegisterUser(user: RegisterUserDto): void {
    try {
      this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        html: registrationEmail(user),
      });
      Logger.log('[MailService] User Registration: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] User Registration: Send Mail failed!', err);
    }
  }
}
