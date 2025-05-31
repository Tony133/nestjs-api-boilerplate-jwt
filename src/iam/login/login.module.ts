import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../users/models/users.model';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { HashingService } from '../../common/hashing/hashing.service';
import { Argon2Service } from '../../common/hashing/argon2.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { jwtConfig } from './config/jwt.config';
import { provideUsersRepository } from '../../users/repositories/users.repository.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      useFactory: () => {
        if (!jwtConfig.secret) {
          throw new Error('JWT_SECRET_KEY not defined');
        }
        return {
          secret: jwtConfig.secret,
          audience: jwtConfig.audience,
          issuer: jwtConfig.issuer,
          expiresIn: jwtConfig.accessTokenTtl,
        };
      },
    }),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    LoginService,
    UsersService,
    ...provideUsersRepository(),
  ],
  controllers: [LoginController],
})
export class LoginModule {}
