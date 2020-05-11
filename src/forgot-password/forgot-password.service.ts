import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { User } from '../entity/User';
import { ForgotPasswordDto } from './forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  public async forgotPassword(user: ForgotPasswordDto): Promise<any> {
    const userUpdate = await this.userRepository.findOne({ email: user.email });
    const passwordRand = Math.random()
      .toString(36)
      .slice(-8);
    userUpdate.password = bcrypt.hashSync(passwordRand, 8);

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
      .then(response => {
        console.log('Forgot Password: Send Mail successfully!');
      })
      .catch(err => {
        console.log('Forgot Password: Send Mail Failed!');
      });
  }
}
