import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './models/users.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailerModule } from '../shared/mailer/mailer.module';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { provideUsersRepository } from './repositories/users.repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailerModule],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class UsersModule {}
