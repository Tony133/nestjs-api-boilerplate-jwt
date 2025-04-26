import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './models/users.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailerModule } from '../common/mailer/mailer.module';
import { Argon2Service } from '../common/hashing/argon2.service';
import { HashingService } from '../common/hashing/hashing.service';
import { provideUsersRepository } from './repositories/users.repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailerModule],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class UsersModule {}
