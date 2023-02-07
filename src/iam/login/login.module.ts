import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { ConfigModule } from '@nestjs/config';
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
    JwtModule.registerAsync(jwtConfig.asProvider()),
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
