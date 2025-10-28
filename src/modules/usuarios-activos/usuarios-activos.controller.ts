import { Controller, Get } from '@nestjs/common';
import { UsuariosActivosService } from './usuarios-activos.service';

@Controller('usuarios-activos')
export class UsuariosActivosController {
  constructor(
    private readonly usuariosActivosService: UsuariosActivosService,
  ) {}

  @Get('get_service')
  getUsersFromService() {
    return this.usuariosActivosService.getUsuariosByCuentaAndServicio(
      '<token>',
    );
  }
}
