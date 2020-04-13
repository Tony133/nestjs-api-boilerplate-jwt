import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'This is a simple example of item returned by your APIs.',
    };
  }

  getSecureResource() {
    return {
      message:
        'Access to protected resources granted! This protected resource is displayed when the token is successfully provided.',
    };
  }
}
