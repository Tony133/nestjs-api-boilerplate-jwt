import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { IUsers } from './interfaces/users.interface';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  public async findByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }

    return user;
  }

  public async findById(userId: string): Promise<Users> {
    const user = await this.userRepository.findOneBy({
      id: +userId,
    });

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async create(userDto: UserDto): Promise<IUsers> {
    try {
      return await this.userRepository.save(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<Users> {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      user.password = bcrypt.hashSync(Math.random().toString(36).slice(-8), 8);

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    email: string,
    password: string,
  ): Promise<Users> {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      user.password = bcrypt.hashSync(password, 8);

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateProfileUser(
    id: string,
    userProfileDto: UserProfileDto,
  ): Promise<Users> {
    try {
      const user = await this.userRepository.findOneBy({ id: +id });
      user.name = userProfileDto.name;
      user.email = userProfileDto.email;
      user.username = userProfileDto.username;

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
