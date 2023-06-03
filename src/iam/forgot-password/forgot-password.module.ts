import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../users/models/users.model';
import { UsersService } from '../../users/users.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { UtilsModule } from '../../shared/utils/utils.module';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { provideUsersRepository } from '../../users/repositories/users.repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailerModule, UtilsModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ForgotPasswordService,
    UsersService,
    ...provideUsersRepository(),
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
