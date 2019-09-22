import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
  constructor(private readonly userService: UserService) {}

  public async register(user: User): Promise<any> {
    
    user.password = bcrypt.hashSync(user.password, 8);

    return this.userService.create(user);
  }
}
