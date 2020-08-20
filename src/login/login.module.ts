import { Module } from "@nestjs/common";
import { LoginService } from "./login.service";
import { LoginController } from "./login.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../users/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./passport/jwt.strategy";
import { environment } from "../environment";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    JwtModule.register({
      secret: environment.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [LoginService, UsersService, JwtStrategy],
  controllers: [LoginController],
})
export class LoginModule {}
