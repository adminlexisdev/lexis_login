import { Module } from '@nestjs/common';
import { UsuariosActivosService } from './usuarios-activos.service';
import { UsuariosActivosController } from './usuarios-activos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosActivos } from './entities/usuarios-activos.entity';
import { ServiciosActivosAdquiridosModule } from '../servicios_activos_adquiridos/servicios_activos_adquiridos.module';

@Module({
  controllers: [UsuariosActivosController],
  providers: [UsuariosActivosService],
  imports: [
    TypeOrmModule.forFeature([UsuariosActivos]),
    ServiciosActivosAdquiridosModule,
  ],
  exports: [UsuariosActivosService],
})
export class UsuariosActivosModule {}
