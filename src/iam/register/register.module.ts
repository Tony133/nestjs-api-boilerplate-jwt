import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { Users } from '../../users/models/users.model';
import { UsersService } from '../../users/users.service';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { provideUsersRepository } from '../../users/repositories/users.repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailerModule],
  controllers: [RegisterController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    RegisterService,
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class RegisterModule {}
