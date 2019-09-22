import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './passport/jwt.payload';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async validate(user: User): Promise<User> {
    return await this.userService.findByEmail(user.email);
  }

  public async login(user: User): Promise<any | { status: number; message: string }> {
    return this.validate(user).then(userData => {
      if (!userData) {
        throw new UnauthorizedException();
      }

      let passwordIsValid = bcrypt.compareSync(
        user.password,
        userData.password,
      );

      if (!passwordIsValid == true) {
        return {
          message: 'Authentication failed. Wrong password',
          status: 400,
        };
      }

      let payload = { email: userData.email, id: userData.id };

      const accessToken = this.jwtService.sign(payload);

      return {
        expires_in: 3600,
        access_token: accessToken,
        user_id: payload,
        status: 200,
      };
    });
  }

  public async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    let user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createJwtPayload(user);
  }

  createJwtPayload(user) {
    let data: JwtPayload = {
      email: user.email,
    };

    let jwt = this.jwtService.sign(data);

    return {
      expiresIn: 3600,
      token: jwt,
    };
  }
}
