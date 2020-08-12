import { Module } from "@nestjs/common";
import { ForgotPasswordService } from "./forgot-password.service";
import { ForgotPasswordController } from "./forgot-password.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/User";
import { UsersService } from "../users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ForgotPasswordService, UsersService],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
