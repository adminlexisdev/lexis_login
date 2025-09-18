import { Module } from '@nestjs/common';
import { UsuariosActivosService } from './usuarios-activos.service';
import { UsuariosActivosController } from './usuarios-activos.controller';

@Module({
  controllers: [UsuariosActivosController],
  providers: [UsuariosActivosService],
})
export class UsuariosActivosModule {}
