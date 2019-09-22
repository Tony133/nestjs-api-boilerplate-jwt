import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { message: 'This is a simple example of item returned by your APIs.' };
  }
}
