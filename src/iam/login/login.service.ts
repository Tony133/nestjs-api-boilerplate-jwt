import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { AccountsUsers } from '../../users/interfaces/accounts-users.interface';
import { LoginDto } from './dto/login.dto';
import { ConfigType } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Users } from '../../users/models/users.model';
import jwtConfig from './config/jwt.config';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
  ) {}

  public async findUserByEmail(loginDto: LoginDto): Promise<AccountsUsers> {
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

      return await this.generateTokens(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async generateTokens(user: Users) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { id } = await this.jwtService.verifyAsync<Pick<JWTPayload, 'id'>>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      const user = await this.usersService.findBySub(id);
      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
