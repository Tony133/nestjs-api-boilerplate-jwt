import { Controller, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    return res.status(HttpStatus.OK).json(this.appService.getHello());
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/secure')
  getProtectedResource(@Res() res: Response) {
    return res.status(HttpStatus.OK).json(this.appService.getSecureResource());
  }
}
