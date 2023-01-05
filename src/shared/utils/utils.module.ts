import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
