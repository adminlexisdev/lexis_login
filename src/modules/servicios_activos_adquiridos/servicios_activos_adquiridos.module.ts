import { Module } from '@nestjs/common';
import { ServiciosActivosAdquiridosService } from './servicios_activos_adquiridos.service';
import { ServiciosActivosAdquiridosController } from './servicios_activos_adquiridos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiciosActivosAdquirido } from './entities/servicios_activos_adquirido.entity';
@Module({
  controllers: [ServiciosActivosAdquiridosController],
  providers: [ServiciosActivosAdquiridosService],
  exports: [ServiciosActivosAdquiridosService],
  imports: [TypeOrmModule.forFeature([ServiciosActivosAdquirido])],
})
export class ServiciosActivosAdquiridosModule {}
