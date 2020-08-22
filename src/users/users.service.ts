import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
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
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  public async findById(userId: string): Promise<Users> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  public async create(userDto: UserDto): Promise<IUsers> {
    return await this.userRepository.save(userDto);
  }

  public async updateByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({ email: email });
    user.password = bcrypt.hashSync(
      Math.random()
        .toString(36)
        .slice(-8),
      8,
    );

    return await this.userRepository.save(user);
  }

  public async updateByPassword(
    email: string,
    password: string,
  ): Promise<Users> {
    const user = await this.userRepository.findOne({ email: email });
    user.password = bcrypt.hashSync(password, 8);

    return await this.userRepository.save(user);
  }

  public async updateProfileUser(id: string, userProfileDto: UserProfileDto): Promise<Users> {
    const user = await this.userRepository.findOne({id: +id});
    user.name = userProfileDto.name;
    user.email = userProfileDto.email;
    user.username = userProfileDto.username;
    
    return await this.userRepository.save(user);
  }

}
