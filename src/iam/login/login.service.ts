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
import { JWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) {}

  public async findUserByEmail(loginDto: LoginDto): Promise<IUsers> {
    return await this.usersService.findByEmail(loginDto.email);
  }

  public async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.findUserByEmail(loginDto);
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      const passwordIsValid = await this.hashingService.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordIsValid) {
        throw new UnauthorizedException(
          'Authentication failed. Wrong password',
        );
      }

      return await this.signToken({
        name: user.name,
        email: user.email,
        id: user.id,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  private async signToken(payload: JWTPayload): Promise<any> {
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      sub: payload.id,
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_TTL'),
      audience: this.configService.get<string>('JWT_TOKEN_AUDIENCE'),
      issuer: this.configService.get<string>('JWT_TOKEN_ISSUER'),
      accessToken: accessToken,
      user: payload,
    };
  }
}
