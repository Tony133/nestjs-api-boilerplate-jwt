import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegisterController } from "./register.controller";
import { RegisterService } from "./register.service";
import { UsersService } from "../users/users.service";
import { User } from "../entity/User";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [RegisterController],
  providers: [RegisterService, UsersService],
})
export class RegisterModule {}
