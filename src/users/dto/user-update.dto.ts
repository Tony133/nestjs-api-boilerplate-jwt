import { PartialType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserUpdateDto extends PartialType(UserDto) {}
