import { Controller } from '@nestjs/common';
import { UsuariosActivosService } from './usuarios-activos.service';

@Controller('usuarios-activos')
export class UsuariosActivosController {
  constructor(
    private readonly usuariosActivosService: UsuariosActivosService,
  ) {}
}
