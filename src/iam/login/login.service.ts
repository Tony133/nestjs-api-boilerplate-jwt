import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { IUsers } from '../../users/interfaces/users.interface';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { ActiveUserData } from './interfaces/active-user-data.interface';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) {}

  private async findUserByEmail(loginDto: LoginDto): Promise<IUsers> {
    return await this.usersService.findByEmail(loginDto.email);
  }

  public async login(loginDto: LoginDto): Promise<any> {
    return this.findUserByEmail(loginDto)
      .then(async (userData) => {
        if (!userData) {
          throw new UnauthorizedException();
        }

        const passwordIsValid = await this.hashingService.compare(
          loginDto.password,
          userData.password,
        );

        if (!passwordIsValid == true) {
          return {
            message: 'Authentication failed. Wrong password',
            status: HttpStatus.BAD_REQUEST,
          };
        }

        return await this.signToken({
          name: userData.name,
          email: userData.email,
          id: userData.id,
        });
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
  }

  private async signToken(payload: ActiveUserData) {
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      sub: payload.id,
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_TTL'),
      audience: this.configService.get('JWT_TOKEN_AUDIENCE'),
      issuer: this.configService.get('JWT_TOKEN_ISSUER'),
      accessToken: accessToken,
      user: payload,
      status: HttpStatus.OK,
    };
  }
}
