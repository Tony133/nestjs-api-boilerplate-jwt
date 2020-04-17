import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class RegisterService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  public async register(user: User): Promise<any> {
    user.password = bcrypt.hashSync(user.password, 8);

    this.sendMailRegisterUser(user);

    return this.userService.create(user);
  }

  private sendMailRegisterUser(user): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        text: 'Registration successful!',
        template: 'index',
        context: {
          title: 'Registration successfully',
          description:
            "You did it! You registered!, You're successfully registered.✔",
          nameUser: user.name,
        },
      })
      .then(response => {
        console.log('User Registration: Send Mail successfully!');
      })
      .catch(err => {
        console.log('User Registration: Send Mail Failed!');
      });
  }
}
