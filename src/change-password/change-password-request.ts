import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
} from 'class-validator';

export class ChangePasswordRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
