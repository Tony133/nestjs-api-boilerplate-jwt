import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
