import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../entity/User';
import { ForgotPasswordRequest } from './forgot-password-request';

@Injectable()
export class ForgotPasswordService {
  constructor(private readonly userService: UserService) {}

  public async forgotPassword(user: ForgotPasswordRequest): Promise<any> {
    return this.userService.updateByEmail(user.email);
  }
}
