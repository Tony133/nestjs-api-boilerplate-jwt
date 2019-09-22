import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../entity/User';
import { ChangePasswordRequest } from './change-password-request';

@Injectable()
export class ChangePasswordService {
  constructor(private readonly userService: UserService) {}

  public async changePassword(user: ChangePasswordRequest): Promise<any> {
    return this.userService.updateByPassword(user.email, user.password);
  }
}
