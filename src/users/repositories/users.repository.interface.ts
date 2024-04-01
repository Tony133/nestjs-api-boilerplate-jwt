import { UserProfileDto } from '../dto/user-profile.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserDto } from '../dto/user.dto';

export interface UsersRepository {
  findAll(): void;
  findByEmail(email: string): void;
  findBySub(sub: number): void;
  findById(userId: string): void;
  create(userDto: UserDto): void;
  updateByEmail(email: string): void;
  updateByPassword(email: string, password: string): void;
  updateUserProfile(id: string, userProfileDto: UserProfileDto): void;
  updateUser(id: string, userUpdateDto: UserUpdateDto): void;
  deleteUser(id: string): void;
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
