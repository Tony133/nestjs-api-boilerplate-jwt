import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { UserModule } from './user/user.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ChangePasswordModule } from './change-password/change-password.module';

@Module({
  imports: [TypeOrmModule.forRoot(), LoginModule, RegisterModule, UserModule, ForgotPasswordModule, ChangePasswordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
