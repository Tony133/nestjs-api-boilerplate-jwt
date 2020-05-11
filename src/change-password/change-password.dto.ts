import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
