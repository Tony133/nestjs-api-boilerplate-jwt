import { UserProfileDto } from '../dto/user-profile.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserDto } from '../dto/user.dto';

export interface UsersRepository {
  findAll();
  findByEmail(email: string);
  findBySub(sub: number);
  findById(userId: string);
  create(userDto: UserDto);
  updateByEmail(email: string);
  updateByPassword(email: string, password: string);
  updateProfileUser(id: string, userProfileDto: UserProfileDto);
  updateUser(id: string, userUpdateDto: UserUpdateDto);
  deleteUser(id: string);
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
