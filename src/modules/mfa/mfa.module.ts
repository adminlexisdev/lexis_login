import { Module } from '@nestjs/common';
import { MfaService } from './mfa.service';
import { MfaController } from './mfa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mfa } from './entities/mfa.entity';

@Module({
  controllers: [MfaController],
  providers: [MfaService],
  imports: [TypeOrmModule.forFeature([Mfa])],
  exports: [MfaService],
})
export class MfaModule {}
