import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class UserProfileDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
