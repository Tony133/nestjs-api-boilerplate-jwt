import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/user.dto';

export class LoginDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}
