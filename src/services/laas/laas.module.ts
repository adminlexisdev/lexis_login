import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LaasService } from './laas.service';

@Module({
  imports: [ConfigModule],
  providers: [LaasService],
  exports: [LaasService],
})
export class LaasModule {}
