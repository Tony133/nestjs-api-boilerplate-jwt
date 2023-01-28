import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        audience: configService.get<string>('JWT_TOKEN_AUDIENCE'),
        issuer: configService.get<string>('JWT_TOKEN_ISSUER'),
        accessTokenTtl: parseInt(
          configService.get<string>('JWT_ACCESS_TOKEN_TTL') ?? '3600',
          10,
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    LoginService,
    UsersService,
  ],
  controllers: [LoginController],
})
export class LoginModule {}
