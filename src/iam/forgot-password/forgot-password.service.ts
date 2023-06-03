import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../users/models/users.model';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { HashingService } from '../../shared/hashing/hashing.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
    private readonly hashingService: HashingService,
  ) {}

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    const userUpdate = await this.userRepository.findOneBy({
      email: forgotPasswordDto.email,
    });
    const passwordRand = this.utilsService.generatePassword();
    userUpdate.password = await this.hashingService.hash(passwordRand);

    this.sendMailForgotPassword(userUpdate.email, passwordRand);

    return await this.userRepository.save(userUpdate);
  }

  private sendMailForgotPassword(email, password): void {
    try {
      this.mailerService.sendMail({
        to: email,
        from: 'from@example.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        template: 'index',
        context: {
          title: 'Forgot Password successful!',
          description:
            'Request Reset Password Successfully!  ✔, This is your new password: ' +
            password,
        },
      });
      Logger.log('[MailService] Forgot Password: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] Forgot Password: Send Mail Failed!', err);
    }
  }
}
