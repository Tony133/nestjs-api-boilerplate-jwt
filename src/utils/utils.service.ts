import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class UtilsService {
  public generatePassword() {
    return crypto.randomUUID();
  }
}
