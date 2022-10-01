import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class ChangePasswordDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}
