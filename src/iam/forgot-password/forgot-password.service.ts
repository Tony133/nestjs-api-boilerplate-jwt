import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../users/models/users.model';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '../../common/mailer/mailer.service';
import { UtilsService } from '../../common/utils/utils.service';
import { HashingService } from '../../common/hashing/hashing.service';
import { forgotPasswordEmail } from '../../common/mailer/mailer.constants';

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
  ): Promise<Users> {
    const userUpdate = await this.userRepository.findOneBy({
      email: forgotPasswordDto.email,
    });
    const passwordRand = this.utilsService.generatePassword();
    userUpdate.password = await this.hashingService.hash(passwordRand);

    this.sendMailForgotPassword(userUpdate.email, passwordRand).catch(
      (err: unknown) =>
        Logger.error('Forgot Password: Send Mail Failed (non bloccante)', err),
    );

    return await this.userRepository.save(userUpdate);
  }

  private async sendMailForgotPassword(
    email: string,
    password: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'from@example.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        html: forgotPasswordEmail(password),
      });
      Logger.log('Forgot Password: Send Mail successfully!', 'MailService');
    } catch (err) {
      Logger.error('Forgot Password: Send Mail Failed!', err);
    }
  }
}
