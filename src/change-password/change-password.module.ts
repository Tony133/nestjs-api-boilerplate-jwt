import { Module } from "@nestjs/common";
import { ChangePasswordController } from "./change-password.controller";
import { ChangePasswordService } from "./change-password.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/User";
import { UsersService } from "../users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ChangePasswordController],
  providers: [ChangePasswordService, UsersService],
})
export class ChangePasswordModule {}
