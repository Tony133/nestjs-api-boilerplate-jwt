import {
  IsNotEmpty,
  IsEmail,
  IsString,
} from 'class-validator';

export class ForgotPasswordRequest {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
