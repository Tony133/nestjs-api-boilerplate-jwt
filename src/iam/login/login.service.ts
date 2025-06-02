import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { AccountsUsers } from '../../users/interfaces/accounts-users.interface';
import { LoginDto } from './dto/login.dto';
import { HashingService } from '../../common/hashing/hashing.service';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Users } from '../../users/models/users.model';
import { jwtConfig } from './config/jwt.config';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  public async findUserByEmail(loginDto: LoginDto): Promise<AccountsUsers> {
    return await this.usersService.findByEmail(loginDto.email);
  }

  public async login(loginDto: LoginDto): Promise<AuthResponse> {
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

  public async generateTokens(user: Users): Promise<AuthResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(
        user.id,
        jwtConfig.accessTokenTtl ?? 3600,
        { email: user.email },
      ),
      this.signToken(user.id, jwtConfig.refreshTokenTtl ?? 86400),
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

  public async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponse> {
    try {
      const { id } = await this.jwtService.verifyAsync<Pick<JWTPayload, 'id'>>(
        refreshTokenDto.refreshToken,
        {
          secret: jwtConfig.secret,
          audience: jwtConfig.audience,
          issuer: jwtConfig.issuer,
        },
      );
      const user = await this.usersService.findBySub(id);
      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  private async signToken<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: jwtConfig.audience,
        issuer: jwtConfig.issuer,
        secret: jwtConfig.secret,
        expiresIn,
      },
    );
  }
}
