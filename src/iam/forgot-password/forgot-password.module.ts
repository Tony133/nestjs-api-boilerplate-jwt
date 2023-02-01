import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD:src/iam/forgot-password/forgot-password.module.ts
import { Users } from '../../users/entities/users.entity';
import { UsersService } from '../../users/users.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { UtilsModule } from '../../shared/utils/utils.module';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
||||||| 2c8d4aa:src/forgot-password/forgot-password.module.ts
import { Users } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { MailerModule } from '../mailer/mailer.module';
import { UtilsModule } from '../shared/utils/utils.module';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
=======
import { Users } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { MailerModule } from '../shared/mailer/mailer.module';
import { UtilsModule } from '../shared/utils/utils.module';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
>>>>>>> main:src/forgot-password/forgot-password.module.ts

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailerModule, UtilsModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ForgotPasswordService,
    UsersService,
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
