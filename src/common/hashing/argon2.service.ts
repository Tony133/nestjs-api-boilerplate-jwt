import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { HashingService } from './hashing.service';

@Injectable()
export class Argon2Service implements HashingService {
  private readonly options = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  };

  public async hash(data: string | Buffer): Promise<string> {
    return await argon2.hash(data, this.options);
  }

  public compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return argon2.verify(encrypted, data);
  }
}
