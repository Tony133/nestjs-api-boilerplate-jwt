import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../users/entities/users.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
<<<<<<< HEAD:src/iam/forgot-password/forgot-password.service.ts
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { HashingService } from '../../shared/hashing/hashing.service';
||||||| 2c8d4aa:src/forgot-password/forgot-password.service.ts
import { MailerService } from '../mailer/mailer.service';
import { UtilsService } from '../shared/utils/utils.service';
import { HashingService } from 'src/shared/hashing/hashing.service';
=======
import { MailerService } from '../shared/mailer/mailer.service';
import { UtilsService } from '../shared/utils/utils.service';
import { HashingService } from '../shared/hashing/hashing.service';
>>>>>>> main:src/forgot-password/forgot-password.service.ts

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
    this.mailerService
      .sendMail({
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
      })
      .then((response) => {
        Logger.log('Forgot Password: Send Mail successfully!', response);
      })
      .catch((err) => {
        Logger.log('Forgot Password: Send Mail Failed!', err);
      });
  }
}
