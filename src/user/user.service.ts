import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { IUser } from './user.interface';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(user: UserDto): Promise<IUser> {
    return await this.userRepository.save(user);
  }

  async updateByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    user.password = bcrypt.hashSync(
      Math.random()
        .toString(36)
        .slice(-8),
      8,
    );

    return await this.userRepository.save(user);
  }

  async updateByPassword(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    user.password = bcrypt.hashSync(password, 8);

    return await this.userRepository.save(user);
  }
}
