import { MaxLength, IsNotEmpty, IsEmail, IsString } from "class-validator";

export class LoginDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly password: string;
}
