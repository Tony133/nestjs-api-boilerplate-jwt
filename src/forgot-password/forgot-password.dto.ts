import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
