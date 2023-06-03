import { Module } from '@nestjs/common';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../users/models/users.model';
import { UsersService } from '../../users/users.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '../login/guards/authentication/authentication.guard';
import { AccessTokenGuard } from '../login/guards/access-token/access-token.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../login/config/jwt.config';
import { provideUsersRepository } from '../../users/repositories/users.repository.provider';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([Users]),
    MailerModule,
  ],
  controllers: [ChangePasswordController],
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
    ChangePasswordService,
    UsersService,
    JwtService,
    ...provideUsersRepository(),
  ],
})
export class ChangePasswordModule {}
