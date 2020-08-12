import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";
import { RegisterUserDTO } from "./dto/register-user.dto";

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService
  ) {}

  public async register(user: RegisterUserDTO): Promise<any> {
    user.password = bcrypt.hashSync(user.password, 8);

    this.sendMailRegisterUser(user);

    return this.usersService.create(user);
  }

  private sendMailRegisterUser(user): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: "from@example.com",
        subject: "Registration successful ✔",
        text: "Registration successful!",
        template: "index",
        context: {
          title: "Registration successfully",
          description:
            "You did it! You registered!, You're successfully registered.✔",
          nameUser: user.name,
        },
      })
      .then((response) => {
        console.log(response);
        console.log("User Registration: Send Mail successfully!");
      })
      .catch((err) => {
        console.log(err);
        console.log("User Registration: Send Mail Failed!");
      });
  }
}
