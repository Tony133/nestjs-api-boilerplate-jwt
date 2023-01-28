import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { MailerModule } from '../shared/mailer/mailer.module';
import { UtilsModule } from '../shared/utils/utils.module';
import { Users } from '../users/entities/users.entity';
import { UsersModule } from '../users/users.module';
import { ChangePasswordModule } from './change-password/change-password.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import jwtConfig from './login/config/jwt.config';
import { AccessTokenGuard } from './login/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './login/guards/authentication/authentication.guard';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    // JwtModule.registerAsync(jwtConfig.asProvider()),
    LoginModule,
    RegisterModule,
    UsersModule,
    ForgotPasswordModule,
    ChangePasswordModule,
    UtilsModule,
  ],
  providers: [
    // {
    //   provide: HashingService,
    //   useClass: BcryptService,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthenticationGuard,
    // },
    // AccessTokenGuard,
    JwtService,
  ],
})
export class IamModule {}
