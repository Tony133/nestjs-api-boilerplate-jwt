import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/user.dto';

export class ForgotPasswordDto extends PickType(UserDto, ['email'] as const) {}
