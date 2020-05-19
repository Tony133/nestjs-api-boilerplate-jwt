import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../entity/User';
import { IUser } from '../user/user.interface';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './passport/jwt.payload';
import { LoginDTO } from './login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async validate(user: LoginDTO): Promise<IUser> {
    return await this.userService.findByEmail(user.email);
  }

  public async login(
    user: User,
  ): Promise<any | { status: number; message: string }> {
    return this.validate(user).then(userData => {
      if (!userData) {
        throw new UnauthorizedException();
      }

      const passwordIsValid = bcrypt.compareSync(
        user.password,
        userData.password,
      );

      if (!passwordIsValid == true) {
        return {
          message: 'Authentication failed. Wrong password',
          status: 400,
        };
      }

      const payload = {
        name: userData.name,
        email: userData.email,
        id: userData.id,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        expiresIn: 3600,
        accessToken: accessToken,
        user: payload,
        status: 200,
      };
    });
  }

  public async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createJwtPayload(user);
  }

  createJwtPayload(user) {
    const data: JwtPayload = {
      email: user.email,
    };

    const jwt = this.jwtService.sign(data);

    return {
      expiresIn: 3600,
      token: jwt,
    };
  }
}
